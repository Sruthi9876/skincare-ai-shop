"use client";
import Navbar from '@/components/Navbar';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#fafaf9]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-100 p-6 rounded-full text-emerald-600">
            <CheckCircle size={80} />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-emerald-950 mb-4">Order Confirmed!</h1>
        <p className="text-lg text-slate-600 mb-10">
          Thank you for your purchase. Your skin's new best friends are on their way to you.
        </p>
        <Link 
          href="/" 
          className="bg-emerald-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-emerald-700 transition shadow-lg"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}