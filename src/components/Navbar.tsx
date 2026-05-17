"use client";
import { ShoppingBag, User, Leaf } from 'lucide-react';
import Link from 'next/link'; // Import Link for navigation
import { useCart } from '@/context/CartContext'; // Import the cart hook

export default function Navbar() {
  const { cart } = useCart(); // Get the current cart items to show the count

  return (
    <nav className="flex justify-between items-center p-5 bg-white border-b sticky top-0 z-50 px-8">
      {/* Logo Section */}
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
        <Leaf className="text-emerald-600" fill="currentColor" />
        <h1 className="text-2xl font-bold text-emerald-900 tracking-tight">LuminaSkin</h1>
      </Link>
      
      {/* Navigation Links */}
      <div className="hidden md:flex gap-8 items-center text-sm font-medium text-gray-600">
        <Link href="/" className="hover:text-emerald-600 transition">Shop All</Link>
        <a href="#" className="hover:text-emerald-600 transition">Skin Quiz</a>
        <a href="#" className="hover:text-emerald-600 transition">About</a>
      </div>

      {/* User Actions */}
      <div className="flex gap-5 items-center">
        <User className="cursor-pointer text-gray-600 hover:text-emerald-600 transition" size={20} />
        
        {/* Cart Link - This now takes you to the /cart page */}
        <Link href="/cart" className="relative group">
          <ShoppingBag className="text-gray-600 group-hover:text-emerald-600 transition" size={20} />
          {/* Dynamic Cart Count */}
          <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {cart.length}
          </span>
        </Link>
      </div>
    </nav>
  );
}