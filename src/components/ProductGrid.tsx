"use client";
import { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import ProductModal from './ProductModal'; // Import the modal
import { Search, Filter, ArrowUpDown } from 'lucide-react';

export default function ProductGrid({ initialProducts }: { initialProducts: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSkinType, setSelectedSkinType] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState<any>(null); // STATE FOR MODAL

  const categories = ['All', ...new Set(initialProducts.map(p => p.category))];
  const skinTypes = ['All', 'Oily', 'Dry', 'Combination', 'Sensitive'];

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product: any) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSkinType = selectedSkinType === 'All' || product.skinType.includes(selectedSkinType);
        
        return matchesSearch && matchesCategory && matchesSkinType;
      })
      .sort((a: any, b: any) => {
        if (sortBy === 'low') return a.price - b.price;
        if (sortBy === 'high') return b.price - a.price;
        return 0;
      });
  }, [searchQuery, selectedCategory, selectedSkinType, sortBy, initialProducts]);

  return (
    <div className="space-y-8">
      {/* Filter Bar (Keeping the same as before) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-emerald-600" />
            <select className="p-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Skin:</span>
            <select className="p-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              value={selectedSkinType} onChange={(e) => setSelectedSkinType(e.target.value)}>
              {skinTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown size={16} className="text-emerald-600" />
            <select className="p-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-500 font-medium">Showing {filteredProducts.length} products</p>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product: any) => (
          <ProductCard 
            key={product._id} 
            product={product} 
            onProductClick={() => setSelectedProduct(product)} // Pass click function
          />
        ))}
      </div>

      {/* THE MODAL POPUP */}
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </div>
  );
}