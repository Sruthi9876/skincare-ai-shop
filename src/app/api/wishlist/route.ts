import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { getServerSession } from 'next-auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Please login first" }, { status: 401 });

    const { productId } = await req.json();
    await connectDB();

    const user = await User.findOne({ email: session.user?.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    //aa If product is already in wishlist, remove it. Otherwise, add it.
    const isWishlisted = user.wishlist.includes(productId);
    
    if (isWishlisted) {
      await User.findByIdAndUpdate(user._id, { $pull: { wishlist: productId } });
      return NextResponse.json({ message: "Removed from wishlist", wishlisted: false });
    } else {
      await User.findByIdAndUpdate(user._id, { $push: { wishlist: productId } });
      return NextResponse.json({ message: "Added to wishlist!", wishlisted: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    await connectDB();
    const user = await User.findOne({ email: session.user?.email }).populate('wishlist');
    return NextResponse.json(user?.wishlist || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}