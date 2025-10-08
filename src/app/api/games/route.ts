import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const gameSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  genre: z.string().min(1),
  platform: z.string().min(1),
  imageUrl: z.string().url(),
  rating: z.number().min(0).max(5).optional(),
  releaseDate: z.string().optional(),
  stock: z.number().int().min(0).default(0),
});

export async function GET() {
  try {
    const games = await db.game.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = gameSchema.parse(body);
    
    const game = await db.game.create({
      data: {
        ...validatedData,
        releaseDate: validatedData.releaseDate ? new Date(validatedData.releaseDate) : null,
      },
    });
    
    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error('Error creating game:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    );
  }
}