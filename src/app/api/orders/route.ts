import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const orderSchema = z.object({
  userId: z.string(),
  items: z.array(z.object({
    gameId: z.string(),
    quantity: z.number().int().min(1),
    price: z.number().positive(),
  })),
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
    
    const orders = await db.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            game: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = orderSchema.parse(body);
    
    const total = validatedData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    
    const order = await db.order.create({
      data: {
        userId: validatedData.userId,
        total,
        status: 'pending',
        items: {
          create: validatedData.items.map(item => ({
            gameId: item.gameId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            game: true,
          },
        },
      },
    });
    
    await db.cartItem.deleteMany({
      where: {
        userId: validatedData.userId,
        gameId: {
          in: validatedData.items.map(item => item.gameId),
        },
      },
    });
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}