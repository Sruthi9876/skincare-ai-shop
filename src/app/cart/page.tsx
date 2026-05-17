"use client";
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  // Calculate total price
  const totalPrice = cart.reduce((acc: number, item: any) => acc + item.price, 0);

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/" className="flex items-center gap-2 text-emerald-600 font-medium mb-8 hover:underline">
          <ArrowLeft size={18} /> Back to Shop
        </Link>

        <h1 className="text-4xl font-bold text-emerald-950 mb-8 flex items-center gap-3">
          <ShoppingBag size={32} /> Your Shopping Bag
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg mb-6">Your bag is currently empty.</p>
            <Link href="/" className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">${item.price}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit sticky top-24">
              <h2 className="text-xl font-bold text-emerald-950 mb-6">Order Summary</h2>
              <div className="space-y-3 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
              </div>
              <div className="flex justify-between py-6 text-2xl font-bold text-emerald-950">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-100">
                Checkout Now
              </button>
              <button 
                onClick={clearCart}
                className="w-full mt-4 text-sm text-gray-400 hover:text-red-500 transition text-center"
              >
                Clear Bag
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}