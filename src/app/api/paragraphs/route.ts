import { getDatabase } from '@/lib/mongodb';
import { ParagraphDocument } from '@/types';
import { Document, WithId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        console.log('API: Starting paragraphs fetch...');

        const { searchParams } = new URL(request.url);
        const book = searchParams.get('book');
        const persona_name = searchParams.get('persona_name');
        const limit = parseInt(searchParams.get('limit') || '10');

        console.log('API: Connecting to database...');
        const db = await getDatabase('memorizz');
        const collection = db.collection('paragraphs');

        // Build query filter
        const filter: Record<string, string> = {};
        if (book) {
            filter.book = book;
        }
        if (persona_name) {
            filter.persona_name = persona_name;
        }

        console.log('API: Query filter:', filter);
        console.log('API: Limit:', limit);

        // Fetch paragraphs with optional filtering
        const paragraphs = await collection
            .find(filter)
            .sort({ paragraph_index: 1 })
            .limit(limit)
            .toArray();

        console.log('API: Found paragraphs count:', paragraphs.length);
        console.log('API: First document sample:', paragraphs[0] ? JSON.stringify(paragraphs[0], null, 2) : 'No documents found');

        // Transform MongoDB documents to match our interface
        const transformedParagraphs: ParagraphDocument[] = paragraphs.map((doc: WithId<Document>) => ({
            _id: doc._id.toString(),
            id: doc.id as string || doc._id.toString(), // Use custom id field if available, fallback to _id
            persona_name: doc.persona_name as string || '',
            persona_id: doc.persona_id as string || '',
            book: doc.book as string,
            paragraph_index: doc.paragraph_index as number,
            paragraph: doc.paragraph as string,
            emotion: doc.emotion as string,
            emotion_level: doc.emotion_level as number,
            justification: doc.justification as string || ''
        }));

        console.log('API: Transformed paragraphs count:', transformedParagraphs.length);

        return NextResponse.json({
            success: true,
            paragraphs: transformedParagraphs,
            count: transformedParagraphs.length
        });

    } catch (error) {
        console.error('API Error fetching paragraphs:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch paragraphs',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Validate required fields
        const requiredFields = ['book', 'paragraph_index', 'paragraph', 'emotion', 'emotion_level'];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { success: false, error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        const db = await getDatabase();
        const collection = db.collection('paragraphs');

        // Insert new paragraph
        const result = await collection.insertOne({
            id: data.id || `para_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            persona_name: data.persona_name || '',
            persona_id: data.persona_id || '',
            book: data.book,
            paragraph_index: data.paragraph_index,
            paragraph: data.paragraph,
            emotion: data.emotion,
            emotion_level: data.emotion_level,
            justification: data.justification || '',
            created_at: new Date()
        });

        return NextResponse.json({
            success: true,
            id: result.insertedId.toString(),
            message: 'Paragraph added successfully'
        });

    } catch (error) {
        console.error('Error adding paragraph:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to add paragraph',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 
