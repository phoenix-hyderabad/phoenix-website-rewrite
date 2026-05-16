import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as pdfParseModule from 'pdf-parse';

// Handle CommonJS/ESM interop and TS definition mismatches for pdf-parse
const parsePdf = (pdfParseModule as any).PDFParse || (pdfParseModule as any).default || pdfParseModule;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// We need the service role key or publishable key that has insert permissions.
// The publishable key has an insert policy based on create_table.sql.
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
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

        const dbSection = domainMap[domain.toLowerCase()];
        if (!dbSection) {
            return NextResponse.json(
                { error: 'Invalid domain specified' },
                { status: 400 }
            );
        }

        // Convert File to Buffer for pdf-parse
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Parse PDF text
        let pdfData;
        try {
            pdfData = await parsePdf(buffer);
        } catch (err) {
            console.error('PDF Parse Error:', err);
            return NextResponse.json({ error: 'Failed to parse PDF file. Ensure it is a valid PDF.' }, { status: 400 });
        }

        const text = pdfData.text;
        
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
