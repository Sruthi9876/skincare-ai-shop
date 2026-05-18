"use client";
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import { ArrowLeft, CreditCard, Truck, Package, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { getCartItems, clearCart } = useCart();
  const cartItems = getCartItems();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ 
    fullName: '', 
    address: '', 
    city: '', 
    zipCode: '', 
    phone: '' 
  });
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  // Calculate total price
  const totalPrice = cartItems.reduce((acc: number, item: any) => {
    return acc + (item.product.price * item.quantity);
  }, 0);

  const handlePlaceOrder = async () => {
    // 1. Basic Validation
    if (!address.fullName || !address.address || !address.phone) {
      return toast.error("Please fill in all shipping details");
    }

    setLoading(true);
    try {
      // 2. Send order data to the API
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: cartItems.map((i: any) => ({ 
            ...i.product, 
            quantity: i.quantity 
          })),
          shippingAddress: address,
          paymentMethod: paymentMethod
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Checkout failed");

      if (paymentMethod === 'stripe') {
        // Redirect to Stripe Payment Page
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error("Payment link not generated");
        }
      } else {
        // CASH ON DELIVERY FLOW
        clearCart(); // Empty the cart since the order is placed
        toast.success("Order placed successfully via COD!");
        router.push('/success'); // Redirect to success page
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link href="/cart" className="flex items-center gap-2 text-emerald-600 font-medium mb-8 hover:underline transition">
          <ArrowLeft size={18} /> Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT SIDE: Shipping & Payment Form */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-emerald-950 mb-6 flex items-center gap-2">
              <Package className="text-emerald-600" /> Shipping Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  placeholder="John Doe" 
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  onChange={(e) => setAddress({...address, fullName: e.target.value})} 
                  value={address.fullName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input 
                  placeholder="123 Skin Care Lane" 
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  onChange={(e) => setAddress({...address, address: e.target.value})} 
                  value={address.address}
                />
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input 
                    placeholder="City" 
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    onChange={(e) => setAddress({...address, city: e.target.value})} 
                    value={address.city}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                  <input 
                    placeholder="123456" 
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    onChange={(e) => setAddress({...address, zipCode: e.target.value})} 
                    value={address.zipCode}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  placeholder="+91 0000000000" 
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  onChange={(e) => setAddress({...address, phone: e.target.value})} 
                  value={address.phone}
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-emerald-950 mt-10 mb-6 flex items-center gap-2">
              Payment Method
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => setPaymentMethod('stripe')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${paymentMethod === 'stripe' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-100 bg-white'}`}
              >
                <CreditCard className={paymentMethod === 'stripe' ? 'text-emerald-600' : 'text-gray-400'} />
                <span className="text-sm font-bold">Card Payment</span>
              </div>
              <div 
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${paymentMethod === 'cod' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-100 bg-white'}`}
              >
                <Truck className={paymentMethod === 'cod' ? 'text-emerald-600' : 'text-gray-400'} />
                <span className="text-sm font-bold">Cash on Delivery</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full mt-8 bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              {loading ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : "Place Order"}
            </button>
          </div>

          {/* RIGHT SIDE: Order Summary */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-fit sticky top-24">
            <h2 className="text-2xl font-bold text-emerald-950 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cartItems.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-gray-600">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between text-2xl font-black text-emerald-950">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}