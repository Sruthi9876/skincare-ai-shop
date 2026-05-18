"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Sparkles, CheckCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

export default function ProductModal({ product, onClose }: { product: any, onClose: () => void }) {
  const { addToCart } = useCart();

  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose} // Close when clicking background
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden relative flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-gray-100 transition z-10"
          >
            <X size={20} className="text-gray-600" />
          </button>

          {/* Left Side: Large Image */}
          <div className="w-full md:w-1/2 h-80 md:h-auto bg-gray-100">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Right Side: Details */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-emerald-600" size={16} />
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{product.category}</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-emerald-950 mb-4 leading-tight">
              {product.name}
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Features Section */}
            <div className="space-y-4 mb-8">
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Best For</h4>
                <div className="flex flex-wrap gap-2">
                  {product.skinType.map((type: string, i: number) => (
                    <span key={i} className="flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
                      <CheckCircle size={12} /> {type}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Targets</h4>
                <div className="flex flex-wrap gap-2">
                  {product.concerns.map((con: string, i: number) => (
                    <span key={i} className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200">
                      {con}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
              <span className="text-3xl font-black text-gray-900">${product.price}</span>
              <button 
                onClick={() => {
                  addToCart(product);
                  toast.success("Added to bag! ✨");
                }}
                className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2"
              >
                <ShoppingCart size={20} /> Add to Bag
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}