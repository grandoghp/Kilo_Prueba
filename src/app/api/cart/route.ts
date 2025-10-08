import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const cartItemSchema = z.object({
  userId: z.string(),
  gameId: z.string(),
  quantity: z.number().int().min(1),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const cartItems = await db.cartItem.findMany({
      where: { userId },
      include: {
        game: true,
      },
    });
    
    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = cartItemSchema.parse(body);
    
    const existingItem = await db.cartItem.findUnique({
      where: {
        userId_gameId: {
          userId: validatedData.userId,
          gameId: validatedData.gameId,
        },
      },
    });
    
    let cartItem;
    if (existingItem) {
      cartItem = await db.cartItem.update({
        where: {
          userId_gameId: {
            userId: validatedData.userId,
            gameId: validatedData.gameId,
          },
        },
        data: {
          quantity: existingItem.quantity + validatedData.quantity,
        },
        include: {
          game: true,
        },
      });
    } else {
      cartItem = await db.cartItem.create({
        data: validatedData,
        include: {
          game: true,
        },
      });
    }
    
    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const gameId = searchParams.get('gameId');
    
    if (!userId || !gameId) {
      return NextResponse.json(
        { error: 'User ID and Game ID are required' },
        { status: 400 }
      );
    }
    
    await db.cartItem.delete({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    });
    
    return NextResponse.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}