import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { db as prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const sig = headersList.get('stripe-signature');

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      if (!userId) {
        console.error('No userId in session metadata');
        return NextResponse.json({ error: 'No userId' }, { status: 400 });
      }

      // Get cart items
      const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: { game: true },
      });

      if (cartItems.length === 0) {
        console.error('Cart is empty for user:', userId);
        return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
      }

      // Calculate total
      const total = cartItems.reduce((sum, item) => sum + (item.game.price * item.quantity), 0);

      // Create order
      const order = await prisma.order.create({
        data: {
          userId,
          total,
          status: 'paid',
        },
      });

      // Create order items
      await prisma.orderItem.createMany({
        data: cartItems.map(item => ({
          id: `${order.id}-${item.gameId}`, // Composite key
          orderId: order.id,
          gameId: item.gameId,
          quantity: item.quantity,
          price: item.game.price,
        })),
      });

      // Update stock
      for (const item of cartItems) {
        await prisma.game.update({
          where: { id: item.gameId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Clear cart
      await prisma.cartItem.deleteMany({
        where: { userId },
      });

      console.log('Order created:', order.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}