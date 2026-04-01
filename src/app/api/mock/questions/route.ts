import { type NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { mockOA } from '~/server/db/schema';
import { eq, sql } from 'drizzle-orm';

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

        // Fetch random questions from the database based on section
        const questions = await db
            .select()
            .from(mockOA)
            .where(eq(mockOA.section, dbSection))
            .orderBy(sql`RANDOM()`)
            .limit(numQuestions);

        console.log(`Raw database query returned ${questions.length} questions`);
        if (questions.length > 0) {
            console.log('First raw question from DB:', {
                qid: questions[0]?.qid,
                section: questions[0]?.section,
                correctans: questions[0]?.correctans,
                allKeys: Object.keys(questions[0] ?? {}),
                fullObject: questions[0]
            });
        } else {
            console.log(`No questions found for section: ${dbSection}`);
        }

        // Transform the data to match the frontend format
        const formattedQuestions = questions.map((q) => ({
            id: q.qid,
            text: q.qtext ?? '',
            image: q.qimage,
            options: [
                q.option1 ?? '',
                q.option2 ?? '',
                q.option3 ?? '',
                q.option4 ?? '',
            ].filter(opt => opt !== ''),
            // Create a map of option numbers to their text values
            optionsMap: {
                'option1': q.option1 ?? '',
                'option2': q.option2 ?? '',
                'option3': q.option3 ?? '',
                'option4': q.option4 ?? '',
            },
            correctAnswer: q.correctans ?? '', // This will be "option1", "option2", etc.
            section: q.section,
        }));

        console.log(`Fetched ${formattedQuestions.length} questions for domain: ${domain}`);
        console.log('Sample question with correct answer:', {
            id: formattedQuestions[0]?.id,
            correctAnswer: formattedQuestions[0]?.correctAnswer,
            optionsMap: formattedQuestions[0]?.optionsMap,
        });

        return NextResponse.json({
            questions: formattedQuestions,
            domain: domain,
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