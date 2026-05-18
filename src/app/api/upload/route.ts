import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// 1. Define exactly what a Cloudinary response looks like
interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  // adding [key: string]: any allows other properties without errors
  [key: string]: any; 
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Tell the Promise it will return a CloudinaryResponse
    const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) reject(error);
        else resolve(result as CloudinaryResponse);
      }).end(buffer);
    });

    // Now TypeScript knows for sure that result.secure_url exists!
    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}