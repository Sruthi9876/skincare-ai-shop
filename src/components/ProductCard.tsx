"use client";
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext'; // Import the cart hook

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart(); // Access the add function

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
      <div className="h-64 w-full bg-gray-50 rounded-xl mb-4 overflow-hidden relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
      </div>
      
      <div className="space-y-1 mb-4">
        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{product.category}</p>
        <h3 className="font-bold text-gray-800 text-lg leading-tight">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
        <span className="font-bold text-xl text-gray-900">${product.price}</span>
        <button 
          onClick={() => addToCart(product)} // Add product to cart on click!
          className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-100"
        >
          <ShoppingCart size={20} />
        </button>
      </div>
    </motion.div>
  );
}