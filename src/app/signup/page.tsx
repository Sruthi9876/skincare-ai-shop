"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success("Account created! Please login.");
      router.push('/login');
    } else {
      const data = await res.json();
      toast.error(data.error || "Something went wrong");
    }
  };

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      <Navbar />
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl border border-emerald-100">
        <h2 className="text-3xl font-bold text-emerald-950 text-center mb-2">Join LuminaSkin</h2>
        <p className="text-center text-slate-500 mb-8">Create an account for personalized care</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" required className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => setForm({...form, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" required className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => setForm({...form, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" required className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => setForm({...form, password: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <select 
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => setForm({...form, role: e.target.value})}
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin (Staff Only)</option>
            </select>
          </div>
          <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg">
            Create Account
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account? <Link href="/login" className="text-emerald-600 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </main>
  );
}