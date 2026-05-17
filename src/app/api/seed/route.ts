import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import { Product } from '../../../models/Product';

export async function GET() {
  try {
    await connectDB();

    const products = [
      {
        name: "Glow Radiance Serum",
        description: "A powerful Vitamin C serum that brightens skin and fades dark spots.",
        price: 29.99,
        category: "Serum",
        skinType: ["All"],
        concerns: ["Dullness", "Dark Spots"],
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500",
      },
      {
        name: "HydraPure Moisturizer",
        description: "Deeply hydrating cream with Hyaluronic Acid for intense moisture.",
        price: 24.50,
        category: "Moisturizer",
        skinType: ["Dry", "Combination"],
        concerns: ["Dryness", "Flaking"],
        image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbb779b?w=500",
      },
      {
        name: "ClearSkin Acne Gel",
        description: "Salicylic acid treatment to clear breakouts and unclog pores.",
        price: 18.00,
        category: "Treatment",
        skinType: ["Oily", "Combination"],
        concerns: ["Acne", "Blackheads"],
        image: "https://images.unsplash.com/photo-1556228578-8c7c2879723e?w=500",
      },
      {
        name: "Gentle Oat Cleanser",
        description: "A soothing, non-foaming cleanser that preserves the skin barrier.",
        price: 15.99,
        category: "Cleanser",
        skinType: ["Sensitive", "Dry"],
        concerns: ["Redness", "Irritation"],
        image: "https://images.unsplash.com/photo-1556228578-8c7c2879723e?w=500",
      },
      {
        name: "Age-Defy Night Cream",
        description: "Retinol-infused cream to reduce fine lines and wrinkles overnight.",
        price: 45.00,
        category: "Moisturizer",
        skinType: ["All"],
        concerns: ["Aging", "Wrinkles"],
        image: "https://images.unsplash.com/photo-1608248597279-f99d16076760?w=500",
      },
      {
        name: "Oil-Control Balancing Toner",
        description: "Refines pores and removes excess sebum without drying the skin.",
        price: 21.00,
        category: "Toner",
        skinType: ["Oily"],
        concerns: ["Large Pores", "Oiliness"],
        image: "https://images.unsplash.com/photo-1556228578-8c7c2879723e?w=500",
      }
    ];

    await Product.deleteMany({}); 
    await Product.insertMany(products);

    return NextResponse.json({ message: "🚀 Database seeded successfully! 6 products added." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}