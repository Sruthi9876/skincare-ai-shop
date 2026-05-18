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

    // This is the most stable model name for v1beta API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const finalPrompt = `
      You are the LuminaSkin consultant. Use this catalog to help the user.
      CATALOG:
      ${productList}
      
      USER QUESTION: ${userMessage}
      
      RULES:
      1. Only recommend products from the catalog.
      2. Be very brief and friendly.
    `;

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });

  } catch (error: any) {
    console.error("GEMINI_LIVE_ERROR:", error.message);
    
    // If it still 404s, this will tell the user exactly which model failed
    return NextResponse.json({ 
      message: `AI is currently updating. (Error: ${error.message})` 
    });
  }
}