import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';

// DELETE: Remove a product from the database
export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } // Change to Promise
) {
  try {
    await connectDB();
    const { id } = await params; // AWAIT the params here
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: "Product deleted successfully!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update an existing product
export async function PUT(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } // Change to Promise
) {
  try {
    const body = await req.json();
    await connectDB();
    
    const { id } = await params; // AWAIT the params here

    // Ensure price is a number
    if (body.price) body.price = Number(body.price);

    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      body, 
      { new: true } 
    );

    if (!updatedProduct) {
      console.log("MongoDB could not find product with ID:", id);
      return NextResponse.json({ error: "Product not found in database" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated!", product: updatedProduct });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}