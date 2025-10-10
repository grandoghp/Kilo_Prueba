import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db as prisma } from '@/lib/db';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userId = user.id;

    // Get cart items with game details
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { game: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Validate stock availability
    for (const item of cartItems) {
      if (item.quantity > item.game.stock) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.game.title}. Available: ${item.game.stock}` },
          { status: 400 }
        );
      }
    }

    // Create line items for Stripe
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.game.title,
          description: item.game.description,
          images: [item.game.imageUrl],
        },
        unit_amount: Math.round(item.game.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // SIMULACIÓN: Crear checkout sin Stripe (para testing)
    // En producción, descomenta el código de Stripe arriba

    // Calcular total
    const total = cartItems.reduce((sum, item) => sum + (item.game.price * item.quantity), 0);

    // Simular procesamiento del pago
    console.log('🛒 Simulando checkout para usuario:', userId);
    console.log('📦 Items en carrito:', cartItems.length);
    console.log('💰 Total:', total);

    // Crear orden simulada
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: 'paid', // Simular pago exitoso
      },
    });

    // Crear items de orden
    await prisma.orderItem.createMany({
      data: cartItems.map(item => ({
        id: `${order.id}-${item.gameId}`,
        orderId: order.id,
        gameId: item.gameId,
        quantity: item.quantity,
        price: item.game.price,
      })),
    });

    // Actualizar stock
    for (const item of cartItems) {
      await prisma.game.update({
        where: { id: item.gameId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Limpiar carrito
    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    console.log('✅ Orden simulada creada:', order.id);

    // Redirigir a página de éxito con ID simulado
    return NextResponse.json({
      url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id=sim_${order.id}`
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}