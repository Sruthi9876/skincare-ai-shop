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
    const productList = products.map((p: any) => 
      `- ${p.name}: $${p.price}. Best for ${p.skinType.join(', ')}.`
    ).join('\n');

    // Use the EXACT model ID shown in your AI Studio Playground
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const finalPrompt = `
      You are the LuminaSkin consultant. Use this catalog:
      ${productList}
      
      Rules:
      1. Only recommend products from the list.
      2. Be concise.
      
      User: ${userMessage}
      Consultant:`;

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });

  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ 
      message: `AI Error: ${error.message}` 
    }, { status: 500 });
  }
}