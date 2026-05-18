"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: any;
  onProductClick: () => void;
}

export default function ProductCard({ product, onProductClick }: ProductCardProps) {
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Check if product is in wishlist on load
  useEffect(() => {
    if (session) {
      fetch('/api/wishlist')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setIsWishlisted(data.some((item: any) => item._id === product._id));
          }
        })
        .catch(() => {});
    }
  }, [session, product._id]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop the modal from opening
    if (!session) return toast.error("Please login to save favorites!");

    const previousState = isWishlisted;
    setIsWishlisted(!previousState);

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id }),
      });
      const data = await res.json();
      setIsWishlisted(data.wishlisted);
      toast.success(data.wishlisted ? "Added to favorites! ❤️" : "Removed from favorites");
    } catch (err) {
      setIsWishlisted(previousState);
      toast.error("Wishlist update failed");
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      onClick={onProductClick}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden cursor-pointer h-full flex flex-col"
    >
      {/* Heart Button */}
      <div className="absolute top-4 right-4 z-20">
        <button 
          onClick={toggleWishlist}
          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform"
        >
          <Heart 
            size={18} 
            className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} 
          />
        </button>
      </div>

      {/* Image */}
      <div className="h-64 w-full bg-gray-50 overflow-hidden relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
      </div>
      
      {/* Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">
            {product.category}
          </p>
          <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-2">
            {product.description}
          </p>
        </div>
        <div className="mt-4 flex justify-between items-center">
            <span className="font-black text-xl text-gray-900">${product.price}</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <ShoppingCart size={18} />
            </div>
        </div>
      </div>
    </motion.div>
  );
}