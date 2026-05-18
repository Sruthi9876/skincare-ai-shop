"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Welcome back!");
      router.push('/');
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      <Navbar />
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl border border-emerald-100">
        <h2 className="text-3xl font-bold text-emerald-950 text-center mb-2">Welcome Back</h2>
        <p className="text-center text-slate-500 mb-8">Login to access your skin profile</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" required className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" required className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg">
            Login to LuminaSkin
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account? <Link href="/signup" className="text-emerald-600 font-bold hover:underline">Sign Up</Link>
        </p>
      </div>
    </main>
  );
}