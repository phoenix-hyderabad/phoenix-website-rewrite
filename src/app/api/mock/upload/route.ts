import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { parsePdfBuffer } from '../../../../lib/pdfParser';

// Prefer server-only env vars; fall back to NEXT_PUBLIC for compatibility
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const TABLE_NAME = 'phoenix-website_mock_oa';

// Module-level Supabase client — reused across requests (no re-init overhead)
let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
    if (!_supabase && SUPABASE_URL && SUPABASE_KEY) {
        _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    return _supabase!;
}

// Map frontend domain names to database section values
const domainMap: Record<string, string> = {
    'analog': 'Analog Electronics',
    'digital': 'Digital Electronics',
    'embedded': 'C / Embedded Systems',
    'aptitude': 'Electronics Aptitude',
};

// ─── Fast path: delegate to Python microservice (PyMuPDF + async httpx) ─────
async function tryMicroservice(file: File, dbSection: string): Promise<Response | null> {
    const pythonServiceUrl = process.env.PYTHON_PARSER_URL;
    if (!pythonServiceUrl) return null;

    console.log(`[Upload] Attempting microservice: ${pythonServiceUrl}/parse`);
    try {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('domain', dbSection);

        const resp = await fetch(`${pythonServiceUrl}/parse`, {
            method: 'POST',
            body: fd,
        });
        
        if (!resp.ok) {
            const errorText = await resp.text();
            console.warn(`[Upload] Microservice returned error (${resp.status}):`, errorText);
            return null;
        }

        const data = await resp.json();
        if (data.success) {
            console.log(`[Upload] Microservice success: ${data.count} questions`);
            return NextResponse.json({
                success: true,
                message: data.message,
                count: data.count,
            }) as unknown as Response;
        }
    } catch (err) {
        console.warn('[Upload] Microservice connection failed, falling back to local parser:', err);
    }
    return null;
}

// ─── Regex for local fallback parser ────────────────────────────────────────
const QUESTION_BLOCK_REGEX = /(?:^|\n\s*\n)\s*((?:Q(?:uestion)?\s*\.?\s*\d+|\d+)\s*[).:-])\s*([\s\S]*?)(?=(?:\n\s*\n\s*(?:Q(?:uestion)?\s*\.?\s*\d+|\d+)\s*[).:-])|$)/gi;

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
                const match = matches[i];
                if (match && match[2]) {
                    options[`option${i + 1}`] = match[2].trim();
                }
            }
            return options;
        }
    }
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const optLines: string[] = [];
    for (const line of lines) {
        if (/^(?:\(?[A-Ea-e1-5]\)?[).:-]|\[[A-Ea-e1-5]\])\s+/.test(line)) {
            optLines.push(line);
        }
    }
    if (optLines.length >= 2) {
        const options: Record<string, string> = {};
        for (let i = 0; i < Math.min(4, optLines.length); i++) {
            const line = optLines[i];
            if (line) {
                options[`option${i + 1}`] = line.replace(/^(?:\(?([A-Ea-e1-5])\)?[).:-]|\[([A-Ea-e1-5])\])\s*/,'').trim();
            }
        }
        return options;
    }
    return null;
}

// ─── Local fallback: parse with pdf-parse + regex ───────────────────────────
async function localParse(buffer: Buffer, dbSection: string) {
    const parsed = await parsePdfBuffer(buffer);
    const text = parsed.text || '';
    if (!text.trim()) throw new Error('PDF extracted text is empty');

    const questionsToInsert: any[] = [];
    const matches = [...text.matchAll(QUESTION_BLOCK_REGEX)];

    for (const match of matches) {
        let qText = match[2]?.trim();
        if (!qText || qText.length < 10) continue;

        const parsedOptions = parseOptions(qText);

        if (parsedOptions) {
            const splitRegex = /(?:\n|\s|^)\([A-Ea-e1-5]\)\s*|(?:\n|\s|^)[A-Ea-e1-5]\)\s*|(?:\n|\s|^)[A-Ea-e1-5]\.\s*|(?:\n|\s|^)\[[A-Ea-e1-5]\]\s*/;
            const cleanTextParts = qText.split(splitRegex);
            if (cleanTextParts[0] && cleanTextParts[0].trim().length > 5) {
                qText = cleanTextParts[0].trim();
            }
        }

        qText = qText.replace(/\s+/g, ' ');

        questionsToInsert.push({
            qtext: qText,
            qimage: null,
            type: 'mcq',
            section: dbSection,
            option1: parsedOptions?.option1 || null,
            option2: parsedOptions?.option2 || null,
            option3: parsedOptions?.option3 || null,
            option4: parsedOptions?.option4 || null,
            correctans: null,
        });
    }

    return questionsToInsert;
}

// ─── Main handler ───────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const domain = formData.get('domain') as string;

        if (!file || !domain) {
            return NextResponse.json({ error: 'File and domain are required' }, { status: 400 });
        }

        const MAX_BYTES = parseInt(process.env.MAX_PDF_SIZE_BYTES || '10485760');
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
            return NextResponse.json({ error: 'Invalid domain specified' }, { status: 400 });
        }

        const microResult = await tryMicroservice(file, dbSection);
        if (microResult) return microResult;

        console.log('[Upload] Falling back to local parser...');
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        let questionsToInsert: any[];
        try {
            questionsToInsert = await localParse(buffer, dbSection);
        } catch (err: any) {
            console.error('[Upload] Local PDF Parse Error:', err);
            return NextResponse.json(
                { error: `Failed to parse PDF file: ${err.message || 'Unknown error'}. Ensure it is a valid PDF.` },
                { status: 400 }
            );
        }

        if (questionsToInsert.length === 0) {
            console.warn('[Upload] No questions extracted by local parser');
            return NextResponse.json({
                error: 'No questions could be extracted from this PDF. Please check the format (e.g. Q1) ... ).'
            }, { status: 400 });
        }

        const supabase = getSupabase();
        // Cast to any to avoid strict type mismatch with dynamic table names in TS
        const { error } = await (supabase
            .from(TABLE_NAME)
            .insert(questionsToInsert as any, { count: 'exact' }) as any);

        if (error) {
            console.error('[Upload] Supabase Insert Error:', error);
            return NextResponse.json({ error: 'Failed to insert questions into database.' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Successfully uploaded ${questionsToInsert.length} questions (local fallback).`,
            count: questionsToInsert.length
        });

    } catch (error: any) {
        console.error('[Upload] Unexpected Error:', error);
        return NextResponse.json(
            { error: `An unexpected error occurred: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}

