import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].content;

    await connectDB();
    const products = await Product.find({});
    const productList = products.map((p: any) => 
      `- ${p.name} (${p.category}): Best for ${p.skinType.join(', ')}. Helps with ${p.concerns.join(', ')}. Price: $${p.price}`
    ).join('\n');

    // The most basic, compatible prompt possible
    const finalPrompt = `
      You are a skincare expert. Use this product list to help the user:
      ${productList}

      Rules: 
      1. Only recommend from the list. 
      2. Be short and professional.
      
      User says: ${userMessage}
      Expert Response:`;

    // Using 'gemini-pro' - the most universal model name
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });

  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ 
      message: `AI Error: ${error.message}. If this is a 404, try changing the model name to 'gemini-1.5-flash' in route.ts` 
    }, { status: 500 });
  }
}