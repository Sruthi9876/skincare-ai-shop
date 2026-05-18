import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import { User } from '../../../models/User';
import { Product } from '../../../models/Product'; 
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId } = await req.json();
    await connectDB();

    const userId = (session.user as any).id;
    const user = await User.findById(userId);
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json([]);
    await connectDB();
    const userId = (session.user as any).id;
    const user = await User.findById(userId).populate('wishlist');
    return NextResponse.json(user?.wishlist || []);
  } catch (error: any) {
    return NextResponse.json([], { status: 200 });
  }
}