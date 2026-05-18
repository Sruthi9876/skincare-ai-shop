import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, );

export async function POST(req: Request) {
  try {
    const { items, shippingAddress, paymentMethod } = await req.json();
    const session = await getServerSession(authOptions);

    await connectDB();

    const total = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

    // FIX: Handle the userId carefully. If no session, use a placeholder or make it optional
    const order = await Order.create({
      userId: (session?.user as any)?.id || "guest_user",
      items: items,
      total: total,
      paymentMethod: paymentMethod,
      shippingAddress: shippingAddress,
      status: paymentMethod === 'cod' ? 'Processing' : 'Pending Payment',
    });

    if (paymentMethod === 'stripe') {
      const lineItems = items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name, images: item.image ? [item.image] : [] },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/success?orderId=${order._id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/cart`,
      });

      return NextResponse.json({ url: stripeSession.url });
    }

    return NextResponse.json({ message: "COD Order placed!", orderId: order._id });

  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}