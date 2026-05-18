import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // 1. Get the session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      console.log("Orders API: No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Extract the ID (Cast to string to be safe)
    const userId = (session.user as any).id;
    console.log("Looking for orders for User ID:", userId);

    await connectDB();
    
    // 3. FIX: Use a flexible query. 
    // We search for orders where userId is either the exact ID or the String version of the ID.
    const orders = await Order.find({ 
      $or: [
        { userId: userId }, 
        { userId: new mongoose.Types.ObjectId(userId) } 
      ] 
    })
    .sort({ createdAt: -1 })
    .lean();
    
    console.log(`Found ${orders.length} orders in database.`);

    return NextResponse.json(JSON.parse(JSON.stringify(orders)));
  } catch (error: any) {
    console.error("Orders API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}