"use client"; // CRITICAL: This tells Next.js it's a browser page

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal'; // Added Modal support
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Fetch the wishlist items from the API
  useEffect(() => {
    async function loadWishlist() {
      try {
        const res = await fetch('/api/wishlist');
        const data = await res.json();
        if (Array.isArray(data)) {
          setWishlist(data);
        }
      } catch (error) {
        console.error("Failed to load wishlist", error);
      } finally {
        setLoading(false);
      }
    }
    loadWishlist();
  }, []);

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back Link */}
        <Link href="/" className="flex items-center gap-2 text-emerald-600 font-medium mb-8 hover:underline transition w-fit">
          <ArrowLeft size={18} /> Back to Shop
        </Link>

        {/* Title */}
        <div className="flex items-center gap-3 mb-12">
          <div className="p-3 bg-red-50 rounded-2xl">
            <Heart className="text-red-500 fill-red-500" size={32} />
          </div>
          <h1 className="text-4xl font-black text-emerald-950 tracking-tight">My Favorites</h1>
        </div>

        {loading ? (
          /* Loading State */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          /* Empty State */
          <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-gray-300 shadow-sm">
            <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={32} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Save items you love to find them easily later.</p>
            <Link 
              href="/" 
              className="bg-emerald-600 text-white px-10 py-4 rounded-full font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 inline-block"
            >
              Start Exploring
            </Link>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlist.map((product: any) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onProductClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Popup */}
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </main>
  );
}