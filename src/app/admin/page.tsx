"use client";
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import { Plus, Trash2, Package, Upload, Edit3 } from 'lucide-react';

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', skinType: '', concerns: '', image: '' });
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (e) { console.error("Fetch error", e); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) return toast.error("Please upload an image first!");

    const productData = {
      ...form,
      price: Number(form.price),
      skinType: typeof form.skinType === 'string' ? form.skinType.split(',').map(s => s.trim()) : form.skinType,
      concerns: typeof form.concerns === 'string' ? form.concerns.split(',').map(s => s.trim()) : form.concerns,
    };

    const url = editingId ? `/api/products/${editingId}` : '/api/products';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        toast.success(editingId ? "Product updated!" : "Product added!");
        setForm({ name: '', description: '', price: '', category: '', skinType: '', concerns: '', image: '' });
        setEditingId(null);
        await fetchProducts();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Operation failed");
      }
    } catch (err) {
      toast.error("Server error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success("Deleted!");
      fetchProducts();
    }
  };

  const startEdit = (product: any) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      skinType: product.skinType.join(', '),
      concerns: product.concerns.join(', '),
      image: product.image,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        setForm({ ...form, image: data.url });
        toast.success("Image uploaded!");
      }
    } catch (err) { toast.error("Upload failed"); } finally { setUploading(false); }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center gap-3 mb-10">
          <Package className="text-emerald-600" size={32} />
          <h1 className="text-3xl font-bold text-emerald-950">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              {editingId ? <Edit3 size={20} /> : <Plus size={20} />} 
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                suppressHydrationWarning // <--- FIX ADDED
                placeholder="Product Name" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                onChange={(e) => setForm({...form, name: e.target.value})} value={form.name} required 
              />
              <textarea 
                suppressHydrationWarning // <--- FIX ADDED
                placeholder="Description" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                onChange={(e) => setForm({...form, description: e.target.value})} value={form.description} required 
              />
              <div className="flex gap-2">
                <input 
                  suppressHydrationWarning // <--- FIX ADDED
                  placeholder="Price" type="number" step="0.01" className="w-1/2 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                  onChange={(e) => setForm({...form, price: e.target.value})} value={form.price} required 
                />
                <input 
                  suppressHydrationWarning // <--- FIX ADDED
                  placeholder="Category" className="w-1/2 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                  onChange={(e) => setForm({...form, category: e.target.value})} value={form.category} required 
                />
              </div>
              <input 
                suppressHydrationWarning // <--- FIX ADDED
                placeholder="Skin Types (comma separated)" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                onChange={(e) => setForm({...form, skinType: e.target.value})} value={form.skinType} required 
              />
              <input 
                suppressHydrationWarning // <--- FIX ADDED
                placeholder="Concerns (comma separated)" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                onChange={(e) => setForm({...form, concerns: e.target.value})} value={form.concerns} required 
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Product Image</label>
                <div className="flex items-center gap-4">
                  <input type="file" accept="image/*" className="hidden" id="imageUpload" onChange={handleImageUpload} />
                  <label htmlFor="imageUpload" className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg cursor-pointer hover:bg-gray-200 transition text-sm font-medium">
                    <Upload size={16} /> {uploading ? 'Uploading...' : 'Choose File'}
                  </label>
                  {form.image && <span className="text-xs text-emerald-600 truncate max-w-[150px]">Image Ready!</span>}
                </div>
              </div>
              <button disabled={uploading} className={`w-full py-3 rounded-xl font-bold transition shadow-lg ${editingId ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}>
                {uploading ? 'Uploading...' : editingId ? 'Update Product' : 'Add Product to Store'}
              </button>
              {editingId && (
                <button type="button" onClick={() => {setEditingId(null); setForm({ name: '', description: '', price: '', category: '', skinType: '', concerns: '', image: '' });}} 
                  className="w-full py-3 text-gray-500 font-medium hover:text-gray-700 transition text-center">
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">Product</th>
                  <th className="p-4 font-semibold text-gray-600">Price</th>
                  <th className="p-4 font-semibold text-gray-600">Category</th>
                  <th className="p-4 font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p: any) => (
                  <tr key={p._id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4 flex items-center gap-3">
                      <img src={p.image} className="w-10 h-10 rounded-lg object-cover" alt={p.name} />
                      <span className="font-medium">{p.name}</span>
                    </td>
                    <td className="p-4 text-gray-600">${p.price}</td>
                    <td className="p-4 text-gray-500">{p.category}</td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => startEdit(p)} className="p-2 text-blue-400 hover:text-blue-600 transition"><Edit3 size={18} /></button>
                      <button onClick={() => handleDelete(p._id)} className="p-2 text-red-400 hover:text-red-600 transition"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}