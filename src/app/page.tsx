import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import ProductGrid from '@/components/ProductGrid';
import ChatBot from '@/components/ChatBot';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import Link from 'next/link';

export default async function Home() {
  // 1. Connect to Database and fetch all products
  await connectDB();
  
  // 2. Use .lean() and JSON stringify/parse to prevent the "Plain Object" error
  const rawProducts = await Product.find({}).lean();
  const products = JSON.parse(JSON.stringify(rawProducts));

  return (
    <main className="min-h-screen bg-[#fafaf9] text-slate-900">
      {/* Navigation Bar */}
      <Navbar />
      
      {/* --- HERO SECTION --- */}
      <section className="relative py-20 px-6 md:py-32 overflow-hidden">
        {/* Decorative background glow - Soft emerald spots for a luxury feel */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase bg-emerald-100 text-emerald-700 rounded-full">
              Science meets Nature
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-5xl md:text-7xl font-extrabold text-emerald-950 mb-6 tracking-tight leading-[1.1]">
            Science-Backed <span className="text-emerald-600">Glow</span> <br /> 
            for Every Skin Type.
          </h2>

          {/* Sub-heading */}
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop guessing your skincare. Our AI-powered consultant analyzes your skin needs 
            and curates a professional-grade routine just for you.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="#products" 
              className="bg-emerald-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 hover:scale-105 active:scale-95 text-center"
            >
              Shop Collection
            </Link>
            <Link 
              href="/quiz" 
              className="bg-white text-emerald-700 border-2 border-emerald-100 px-10 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition-all hover:border-emerald-200 text-center"
           >
             know your Skin Type
            </Link>
          </div>
        </div>
      </section>

      {/* --- PRODUCT GRID SECTION --- */}
      <section id="products" className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h3 className="text-3xl font-bold text-emerald-950">Our Best Sellers</h3>
            <p className="text-slate-500 mt-2">Curated favorites for visible results.</p>
          </div>
          <div className="hidden md:block h-px flex-1 bg-emerald-100 mx-8"></div>
          <Link href="/shop" className="text-emerald-600 font-semibold hover:underline underline-offset-4 transition">
            View All →
          </Link>
        </div>

        {/* Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
        <ProductGrid initialProducts={products} />
      </section>

      {/* --- AI CHATBOT FLOAT --- */}
      <ChatBot />
      
      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-100 py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 bg-emerald-600 rounded-full" />
          <span className="font-bold text-emerald-900">LuminaSkin AI</span>
        </div>
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} LuminaSkin AI. All rights reserved.
        </p>
      </footer>
    </main>
  );
}