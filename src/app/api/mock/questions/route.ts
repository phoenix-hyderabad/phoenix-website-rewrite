import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const TABLE_NAME = 'phoenix-website_mock_oa';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const domain = searchParams.get('domain');
        const numQuestions = parseInt(searchParams.get('questions') ?? '10');

        if (!domain) {
            return NextResponse.json(
                { error: 'Domain parameter is required' },
                { status: 400 }
            );
        }

        // Map frontend domain names to database section values
        const domainMap: Record<string, string> = {
            'analog': 'Analog Electronics',
            'digital': 'Digital Electronics',
            'embedded': 'C / Embedded Systems',
            'aptitude': 'Electronics Aptitude',
        };

        const dbSection = domainMap[domain.toLowerCase()];

        if (!dbSection) {
            return NextResponse.json(
                { error: 'Invalid domain specified' },
                { status: 400 }
            );
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

        // Fetch ALL matching questions first, then randomly slice
        const { data: allQuestions, error: countError } = await supabase
            .from(TABLE_NAME)
            .select('qid')
            .eq('section', dbSection);

        if (countError) {
            console.error('Supabase count error:', countError);
            return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
        }

        const total = allQuestions?.length ?? 0;
        console.log(`Total questions for section "${dbSection}": ${total}`);

        // Pick random indices
        const limit = Math.min(numQuestions, total);
        const randomOffset = total > limit ? Math.floor(Math.random() * (total - limit)) : 0;

        const { data: questions, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('section', dbSection)
            .range(randomOffset, randomOffset + limit - 1);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
        }

        if (!questions || questions.length === 0) {
            console.log(`No questions found for section: ${dbSection}`);
            return NextResponse.json({
                questions: [],
                domain,
                count: 0,
            });
        }

        // Shuffle the results for randomness
        const shuffled = [...questions].sort(() => Math.random() - 0.5);

        // Transform the data to match the frontend format
        const formattedQuestions = shuffled.map((q: Record<string, unknown>) => ({
            id: q.qid as number,
            text: (q.qtext as string) ?? '',
            image: q.qimage as string | null,
            options: [
                (q.option1 as string) ?? '',
                (q.option2 as string) ?? '',
                (q.option3 as string) ?? '',
                (q.option4 as string) ?? '',
            ].filter(opt => opt !== ''),
            optionsMap: {
                'option1': (q.option1 as string) ?? '',
                'option2': (q.option2 as string) ?? '',
                'option3': (q.option3 as string) ?? '',
                'option4': (q.option4 as string) ?? '',
            },
            correctAnswer: (q.correctans as string) ?? '',
            section: q.section as string,
        }));

        console.log(`Fetched ${formattedQuestions.length} questions for domain: ${domain}`);

        return NextResponse.json({
            questions: formattedQuestions,
            domain,
            count: formattedQuestions.length,
        });

    } catch (error) {
        console.error('Error fetching questions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch questions' },
            { status: 500 }
        );
    }
}