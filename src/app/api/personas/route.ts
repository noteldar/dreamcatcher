import { getDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        console.log('API: Fetching distinct personas...');

        const db = await getDatabase('memorizz');
        const collection = db.collection('paragraphs');

        // Get distinct persona names
        const personas = await collection.distinct('persona_name');

        console.log('API: Found personas:', personas);

        // Filter out empty/null values and sort
        const validPersonas = personas
            .filter(persona => persona && typeof persona === 'string' && persona.trim().length > 0)
            .sort();

        console.log('API: Valid personas:', validPersonas);

        return NextResponse.json({
            success: true,
            personas: validPersonas,
            count: validPersonas.length
        });

    } catch (error) {
        console.error('API Error fetching personas:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch personas',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 
