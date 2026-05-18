"use client";
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import { Trash2, ArrowLeft, ShoppingBag, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { getCartItems, removeFromCart, clearCart, updateQuantity } = useCart();
  const cartItems = getCartItems();
  const router = useRouter();

  // Calculate total price based on quantity
  const totalPrice = cartItems.reduce((acc: number, item: any) => {
    return acc + (item.product.price * item.quantity);
  }, 0);

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    // Redirect the user to the checkout form page
    router.push('/checkout');
  };

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Back to Shop Link */}
        <Link href="/" className="flex items-center gap-2 text-emerald-600 font-medium mb-8 hover:underline transition">
          <ArrowLeft size={18} /> Back to Shop
        </Link>

        <h1 className="text-4xl font-bold text-emerald-950 mb-8 flex items-center gap-3">
          <ShoppingBag size={32} /> Your Shopping Bag
        </h1>

        {cartItems.length === 0 ? (
          /* --- EMPTY STATE --- */
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
            <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={32} className="text-emerald-600" />
            </div>
            <p className="text-gray-500 text-xl mb-8">Your bag is currently empty.</p>
            <Link 
              href="/" 
              className="bg-emerald-600 text-white px-10 py-4 rounded-full font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 inline-block"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* --- CART CONTENT --- */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* 1. Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item: any, index: number) => (
                <div key={item.product._id} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">${item.product.price}</p>
                  </div>

                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border border-gray-200">
                    <button 
                      onClick={() => updateQuantity(item.product._id, -1)} 
                      className="p-1 hover:bg-white rounded shadow-sm transition text-gray-600"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product._id, 1)} 
                      className="p-1 hover:bg-white rounded shadow-sm transition text-gray-600"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.product._id)}
                    className="p-3 text-gray-400 hover:text-red-500 transition"
                    title="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* 2. Order Summary */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl h-fit sticky top-24">
              <h2 className="text-2xl font-bold text-emerald-950 mb-6">Order Summary</h2>
              
              <div className="space-y-4 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxes</span>
                  <span className="font-medium">$0.00</span>
                </div>
              </div>

              <div className="flex justify-between py-6 text-2xl font-black text-emerald-950">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <button 
                onClick={handleProceedToCheckout}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-100"
              >
                Proceed to Checkout
              </button>

              <button 
                onClick={clearCart}
                className="w-full mt-4 text-sm text-gray-400 hover:text-red-500 transition text-center font-medium"
              >
                Clear entire bag
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}