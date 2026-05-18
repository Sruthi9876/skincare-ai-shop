import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';

export async function GET() {
  try {
    await connectDB();
    // Use .lean() to get plain JS objects
    const products = await Product.find({}).lean();
    return NextResponse.json(JSON.parse(JSON.stringify(products)));
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Saving product to DB:", body); // Debug log
    await connectDB();
    
    const newProduct = await Product.create(body);
    return NextResponse.json({ message: "Product added!", product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}