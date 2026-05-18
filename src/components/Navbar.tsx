"use client";
import { ShoppingBag, User, Leaf, Heart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react'; // Import useSession

export default function Navbar() {
  const { cart, getCartItems } = useCart();
  const { data: session } = useSession(); // Check if user is logged in
  const cartItems = getCartItems();

  return (
    <nav className="flex justify-between items-center p-5 bg-white border-b sticky top-0 z-50 px-8">
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
        <Leaf className="text-emerald-600" fill="currentColor" />
        <h1 className="text-2xl font-bold text-emerald-900 tracking-tight">LuminaSkin</h1>
      </Link>
      
      <div className="hidden md:flex gap-8 items-center text-sm font-medium text-gray-600">
        <Link href="/" className="hover:text-emerald-600 transition">Shop All</Link>
        <Link href="/quiz" className="hover:text-emerald-600 transition">Skin Quiz</Link>
        <a href="#" className="hover:text-emerald-600 transition">About</a>
      </div>

      <div className="flex gap-5 items-center">
        {/* SMART USER ICON */}
        <Link 
          href={session ? "/profile" : "/login"} 
          className="group relative"
        >
          <User className="cursor-pointer text-gray-600 group-hover:text-emerald-600 transition" size={20} />
        </Link>

        <Link href="/wishlist" className="relative group">
          <Heart className="text-gray-600 group-hover:text-red-500 transition" size={20} />
        </Link>

        <Link href="/cart" className="relative group">
          <ShoppingBag className="text-gray-600 group-hover:text-emerald-600 transition" size={20} />
          <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {cartItems.length} {/* Use getCartItems().length */}
          </span>
        </Link>
      </div>
    </nav>
  );
}