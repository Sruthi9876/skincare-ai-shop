import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }

    const { productId } = await req.json();
    await connectDB();

    const userId = (session.user as any).id;
    const user = await User.findOne({ _id: userId });
    
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isWishlisted = user.wishlist.includes(productId);
    
    if (isWishlisted) {
      await User.findByIdAndUpdate(userId, { $pull: { wishlist: productId } });
      return NextResponse.json({ message: "Removed", wishlisted: false });
    } else {
      await User.findByIdAndUpdate(userId, { $push: { wishlist: productId } });
      return NextResponse.json({ message: "Added", wishlisted: true });
    }
  } catch (error: any) {
    console.error("Wishlist POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const userId = (session.user as any).id;
    const user = await User.findOne({ _id: userId }).select('wishlist');
    
    if (!user) return NextResponse.json([], { status: 200 });

    // Populate the product details for each ID in the wishlist
    const mongoose = require('mongoose');
    const Product = mongoose.model('Product');
    const wishlistedProducts = await Product.find({ _id: { $in: user.wishlist } });

    return NextResponse.json(wishlistedProducts);
  } catch (error: any) {
    console.error("Wishlist GET Error:", error);
    return NextResponse.json([], { status: 200 }); // Return empty array instead of 500 to prevent crash
  }
}