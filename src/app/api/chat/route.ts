import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectDB } from '../../../lib/mongodb';
import { Product } from '../../../models/Product';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].content;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ message: "API Key missing in Vercel settings." });
    }

    await connectDB();
    const products = await Product.find({});
    const productList = products.map((p: any) => `- ${p.name}: $${p.price}`).join('\n');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // --- FAIL-PROOF MODEL LOGIC ---
    // We try the Gemini 3 name first since that is what was in your screenshot
    // If that fails, we try the stable 1.5 version.
    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    } catch (e) {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    const finalPrompt = `
      You are the LuminaSkin consultant. Use this catalog:
      ${productList}
      
      User says: ${userMessage}
      Instructions: Recommend a product from the list. Be very brief.
    `;

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });

  } catch (error: any) {
    console.error("CRITICAL AI ERROR:", error.message);
    
    // This will help us find the EXACT model name Google wants
    return NextResponse.json({ 
      message: `AI error. Please try again. (Technical: ${error.message})` 
    });
  }
}