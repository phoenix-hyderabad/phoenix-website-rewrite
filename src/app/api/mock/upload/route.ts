import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { parsePdfBuffer } from '../../../../lib/pdfParser';

// Prefer server-only env vars; fall back to NEXT_PUBLIC for compatibility
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const TABLE_NAME = 'phoenix-website_mock_oa';

// Map frontend domain names to database section values
const domainMap: Record<string, string> = {
    'analog': 'Analog Electronics',
    'digital': 'Digital Electronics',
    'embedded': 'C / Embedded Systems',
    'aptitude': 'Electronics Aptitude',
};

// Regex to find a question block. Looks for a double newline (or start of text) followed by
// an optional 'Q' or 'Question', a number, and a punctuation mark ), ., or -.
// It gracefully ignores headings and introductory text.
const QUESTION_BLOCK_REGEX = /(?:^|\n\s*\n)\s*((?:Q(?:uestion)?\s*\.?\s*\d+|\d+)\s*[)\.:-])\s*([\s\S]*?)(?=(?:\n\s*\n\s*(?:Q(?:uestion)?\s*\.?\s*\d+|\d+)\s*[)\.:-])|$)/gi;

// Regexes to find options in various common formats: (A), A), A., [A], (1), 1), 1., [1]
const OPTIONS_REGEXES = [
    /(?:^|\s)\(([A-Ea-e1-5])\)\s*(.+?)(?=(?:\s\([A-Ea-e1-5]\))|$)/gs,
    /(?:^|\s)([A-Ea-e1-5])\)\s*(.+?)(?=(?:\s[A-Ea-e1-5]\))|$)/gs,
    /(?:^|\s)([A-Ea-e1-5])\.\s*(.+?)(?=(?:\s[A-Ea-e1-5]\.)|$)/gs,
    /(?:^|\s)\[([A-Ea-e1-5])\]\s*(.+?)(?=(?:\s\[[A-Ea-e1-5]\])|$)/gs,
];

function parseOptions(text: string) {
    for (const regex of OPTIONS_REGEXES) {
        const matches = [...text.matchAll(regex)];
        if (matches.length >= 2) {
            const options: Record<string, string> = {};
            for (let i = 0; i < Math.min(4, matches.length); i++) {
                options[`option${i + 1}`] = matches[i]?.[2]?.trim() || '';
            }
            return options;
        }
    }
    // Fallback: line-based detection for options starting at line beginnings like "A.", "B)", "(A)"
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const optLines: string[] = [];
    for (const line of lines) {
        if (/^(?:\(?[A-Ea-e1-5]\)?[\)\.\-\]]|\[[A-Ea-e1-5]\])\s+/.test(line)) {
            optLines.push(line);
        }
    }
    if (optLines.length >= 2) {
        const options: Record<string, string> = {};
        for (let i = 0; i < Math.min(4, optLines.length); i++) {
            // remove leading label like "A)" or "(A)" or "A." and keep the rest
            options[`option${i + 1}`] = optLines[i].replace(/^(?:\(?([A-Ea-e1-5])\)?[\)\.\-\]]|\[([A-Ea-e1-5])\])\s*/,'').trim();
        }
        return options;
    }

    return null;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const domain = formData.get('domain') as string;

        if (!file || !domain) {
            return NextResponse.json(
                { error: 'File and domain are required' },
                { status: 400 }
            );
        }

        // Basic validation: enforce PDF mime and size limit to avoid abuse
        const MAX_BYTES = parseInt(process.env.MAX_PDF_SIZE_BYTES || '10485760'); // 10 MB default
        const fileType = (file as any).type || '';
        const fileSize = (file as any).size || 0;
        if (!fileType.includes('pdf') && !file.name?.toLowerCase?.()?.endsWith('.pdf')) {
            return NextResponse.json({ error: 'Uploaded file must be a PDF.' }, { status: 400 });
        }
        if (fileSize > MAX_BYTES) {
            return NextResponse.json({ error: `File too large. Max ${MAX_BYTES} bytes allowed.` }, { status: 413 });
        }

        const dbSection = domainMap[domain.toLowerCase()];
        if (!dbSection) {
            return NextResponse.json(
                { error: 'Invalid domain specified' },
                { status: 400 }
            );
        }

        // Microservice URL (used as a fallback if local parsing doesn't produce results)
        const pythonServiceUrl = process.env.PYTHON_PARSER_URL;

        // Convert File to Buffer for parsing
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Parse PDF text using local parser abstraction
        let parsed;
        try {
            parsed = await parsePdfBuffer(buffer);
        } catch (err) {
            console.error('PDF Parse Error:', err);
            // If parsing fails and a microservice exists, try delegating
            if (pythonServiceUrl) {
                try {
                    const microserviceFormData = new FormData();
                    microserviceFormData.append('file', file);
                    microserviceFormData.append('domain', dbSection);
                    const response = await fetch(pythonServiceUrl, { method: 'POST', body: microserviceFormData });
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.detail || 'Microservice failed');
                    return NextResponse.json({ success: true, message: data.message, count: data.count });
                } catch (errMicro: any) {
                    console.error('Python Microservice Error:', errMicro);
                    return NextResponse.json({ error: 'Failed to parse PDF (local and microservice).' }, { status: 502 });
                }
            }

            return NextResponse.json({ error: 'Failed to parse PDF file. Ensure it is a valid PDF.' }, { status: 400 });
        }

        const text = parsed.text || '';
        
        // Extract questions
        const questionsToInsert: any[] = [];
        const matches = [...text.matchAll(QUESTION_BLOCK_REGEX)];

        for (const match of matches) {
            // match[1] is the label e.g. "Q1)"
            // match[2] is the raw text
            let qText = match[2].trim();
            if (qText.length < 10) continue; // Skip very short/invalid matches

            // Try parsing options
            const parsedOptions = parseOptions(qText);

            // If options were found inside the text, remove them from the main question stem
            if (parsedOptions) {
                // Split by the first occurrence of an option marker (flexible format)
                const splitRegex = /(?:\n|\s|^)\([A-Ea-e1-5]\)\s*|(?:\n|\s|^)[A-Ea-e1-5]\)\s*|(?:\n|\s|^)[A-Ea-e1-5]\.\s*|(?:\n|\s|^)\[[A-Ea-e1-5]\]\s*/;
                const cleanTextParts = qText.split(splitRegex);
                if (cleanTextParts[0] && cleanTextParts[0].trim().length > 5) {
                    qText = cleanTextParts[0].trim();
                }
            }

            // Replace newlines with spaces for a cleaner look, optional but usually preferred for MCQs
            qText = qText.replace(/\s+/g, ' ');

            const row = {
                qtext: qText,
                qimage: null,
                type: 'mcq',
                section: dbSection,
                option1: parsedOptions?.option1 || null,
                option2: parsedOptions?.option2 || null,
                option3: parsedOptions?.option3 || null,
                option4: parsedOptions?.option4 || null,
                correctans: null,
            };

            questionsToInsert.push(row);
        }

        // If no MCQs found locally, attempt microservice fallback (better OCR / image extraction)
        if (questionsToInsert.length === 0 && pythonServiceUrl) {
            try {
                const microserviceFormData = new FormData();
                microserviceFormData.append('file', file);
                microserviceFormData.append('domain', dbSection);

                const response = await fetch(pythonServiceUrl, { method: 'POST', body: microserviceFormData });
                const data = await response.json();
                if (!response.ok) throw new Error(data.detail || 'Microservice failed to process the PDF.');

                return NextResponse.json({ success: true, message: data.message, count: data.count });
            } catch (err: any) {
                console.error('Python Microservice Error:', err);
                return NextResponse.json({ error: 'No questions extracted and microservice fallback failed.' }, { status: 422 });
            }
        }

        if (questionsToInsert.length === 0) {
            return NextResponse.json({ 
                error: 'No questions could be extracted from this PDF. Please check the format (e.g. Q1) ... ).' 
            }, { status: 400 });
        }

        // Insert to Supabase
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert(questionsToInsert)
            .select('qid');

        if (error) {
            console.error('Supabase Insert Error:', error);
            return NextResponse.json({ error: 'Failed to insert questions into database.' }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            message: `Successfully uploaded ${questionsToInsert.length} questions.`,
            count: questionsToInsert.length 
        });

    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred during upload.' },
            { status: 500 }
        );
    }
}
