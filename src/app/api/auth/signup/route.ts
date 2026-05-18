import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '../../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    await connectDB();

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists!" }, { status: 400 });
    }

    // 2. Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Create the user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer', // Default to customer
    });

    return NextResponse.json({ message: "User created successfully!" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}