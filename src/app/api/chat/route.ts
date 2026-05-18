import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectDB } from '../../../lib/mongodb';
import { Product } from '../../../models/Product';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].content;

    await connectDB();
    const products = await Product.find({});
    const productList = products.map((p: any) => `- ${p.name}: $${p.price}`).join('\n');

    // WE ARE USING 1.5-FLASH BECAUSE PRO IS 404-ING ON YOUR ACCOUNT
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const finalPrompt = `You are a skincare expert. Catalog:\n${productList}\nUser: ${userMessage}`;

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    return NextResponse.json({ message: response.text() });

  } catch (error: any) {
    // This will print the error clearly in Vercel logs
    console.error("LIVE SITE AI ERROR:", error.message);
    return NextResponse.json({ message: `AI Error: ${error.message}` }, { status: 500 });
  }
}