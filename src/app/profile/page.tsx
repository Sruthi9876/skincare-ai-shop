"use client";
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useSession, signOut } from 'next-auth/react';
import { User, Package, LogOut, Mail, CreditCard } from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    async function loadOrders() {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    }
    loadOrders();
  }, []);

  if (!session) return <div className="text-center py-20">Please login to view your profile.</div>;

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left: Personal Info */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <User size={48} />
              </div>
              <h2 className="text-2xl font-bold text-emerald-950">{session.user?.name}</h2>
              <p className="text-slate-500">{session.user?.email}</p>
            </div>
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail size={18} /> <span>{session.user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <CreditCard size={18} /> <span>Payment: Visa **** 4242</span>
              </div>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition"
              >
                <LogOut size={18} /> Logout Account
              </button>
            </div>
          </div>

          {/* Right: Order History */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-3xl font-bold text-emerald-950 flex items-center gap-3">
              <Package size={32} /> My Order History
            </h3>
            
            {orders.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center border border-dashed border-gray-300 text-gray-500">
                No orders found. Start shopping for a glow!
              </div>
            ) : (
              orders.map((order: any) => (
                <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-gray-400">Order ID: {order._id}</span>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                     order.status === 'Paid' 
                     ? 'bg-emerald-100 text-emerald-700' 
                     : 'bg-blue-100 text-blue-700'
                       }`}>
                       {order.status} 
                    </span>
                  </div>
                  <div className="space-y-3">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="font-medium">${item.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-4 pt-4 flex justify-between font-bold text-emerald-950">
                    <span>Total</span>
                    <span>${order.total}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}