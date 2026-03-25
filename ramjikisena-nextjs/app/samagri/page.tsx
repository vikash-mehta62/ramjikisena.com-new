'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Package, Star, Truck, Shield, 
  Plus, Minus, Search, CheckCircle2, ChevronRight, 
  ChevronDown, ShoppingBag, X 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';

// --- Types & Constants ---
interface Product {
  _id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  unit: string;
  inStock: boolean;
}

interface SamagriPackage {
  _id: string;
  name: string;
  description: string;
  tier: 'Basic' | 'Standard' | 'Premium';
  poojaType: string;
  items: { product: { name: string }; quantity: number }[];
  originalPrice: number;
  discountedPrice: number;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
}

const TIER_COLORS = {
  Basic: 'from-emerald-500 to-teal-600',
  Standard: 'from-orange-500 to-red-600',
  Premium: 'from-indigo-600 to-purple-700',
};

const CATEGORIES = ['All', 'Incense', 'Flowers', 'Diyas', 'Ghee', 'Sweets', 'Cloth', 'Idols'];

// --- Sub-Component: Package Card with Toggle ---
function PackageCard({ pkg }: { pkg: SamagriPackage }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-white rounded-[2.5rem] shadow-xl border border-orange-50 overflow-hidden group flex flex-col h-full hover:shadow-2xl transition-all duration-300"
    >
      <div className={`bg-gradient-to-br ${TIER_COLORS[pkg.tier]} p-6 text-white relative`}>
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md">
            {pkg.tier} Edition
          </span>
          <Package size={24} className="opacity-40" />
        </div>
        <h3 className="text-xl font-black mt-4 drop-shadow-md">{pkg.name}</h3>
        <p className="text-xs opacity-90 font-medium">{pkg.poojaType}</p>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-2 italic">
          {pkg.description}
        </p>

        {/* --- TOGGLE BUTTON FOR ITEMS --- */}
        <div className="mb-4">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center justify-between w-full p-3 transition-all rounded-xl group/btn ${isOpen ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-orange-50'}`}
          >
            <div className="flex items-center gap-2">
              <Package size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isOpen ? 'Close List' : `Included Items (${pkg.items.length})`}
              </span>
            </div>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
              <ChevronDown size={16} />
            </motion.div>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {pkg.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                      <span className="truncate">{item.product?.name}</span>
                      <span className="ml-auto text-orange-600 font-black">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Divine Offer</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">₹{pkg.discountedPrice}</span>
              <span className="text-xs text-slate-400 line-through font-bold">₹{pkg.originalPrice}</span>
            </div>
          </div>
          <Link 
            href={`/samagri/cart?packageId=${pkg._id}`} 
            className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-orange-600 transition-all active:scale-90 shadow-xl"
          >
            <Plus size={20} strokeWidth={3} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// --- Main Page Component ---
export default function SamagriPage() {
  const [tab, setTab] = useState<'packages' | 'products'>('packages');
  const [packages, setPackages] = useState<SamagriPackage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgRes, prodRes] = await Promise.all([
          api.get('/api/samagri/packages'),
          api.get('/api/samagri/products'),
        ]);
        const pkgData = await pkgRes.json();
        const prodData = await prodRes.json();
        if (pkgData.success) setPackages(pkgData.packages);
        if (prodData.success) setProducts(prodData.products);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchData();
    const saved = localStorage.getItem('samagri_cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('samagri_cart', JSON.stringify(newCart));
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(c => c.productId === product._id);
    const newCart = existing 
      ? cart.map(c => c.productId === product._id ? { ...c, quantity: c.quantity + 1 } : c)
      : [...cart, { productId: product._id, name: product.name, price: product.price, quantity: 1, image: product.image, unit: product.unit }];
    saveCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    const existing = cart.find(c => c.productId === productId);
    if (!existing) return;
    const newCart = existing.quantity === 1 
      ? cart.filter(c => c.productId !== productId)
      : cart.map(c => c.productId === productId ? { ...c, quantity: c.quantity - 1 } : c);
    saveCart(newCart);
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const filteredProducts = products.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    return matchCat && p.name.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FFFAF3]">
      <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFAF3] antialiased pb-20 selection:bg-orange-100">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-24 pb-8 md:pt-32 md:pb-12 bg-gradient-to-br from-orange-600 to-red-700 text-white px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 text-[12rem] pointer-events-none">🪔</div>
        <div className="max-w-6xl mx-auto text-center md:text-left relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-6xl font-black mb-2 tracking-tight">पूजन <span className="text-yellow-400">सामग्री</span></h1>
            <p className="text-orange-100 text-sm md:text-lg mb-6 font-medium">शुद्धता और विश्वास, हर घर की पूजा के लिए।</p>
          </motion.div>
        </div>
      </section>

      {/* Sticky Filters */}
      <div className="sticky top-16 md:top-20 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
              <button onClick={() => setTab('packages')} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${tab === 'packages' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-500'}`}>पूजा पैकेज</button>
              <button onClick={() => setTab('products')} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${tab === 'products' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-500'}`}>खुली सामग्री</button>
            </div>
            {cartCount > 0 && (
              <Link href="/samagri/cart" className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl active:scale-95 transition-all">
                <ShoppingBag size={18} /> <span className="text-xs font-black">₹{cartTotal}</span>
              </Link>
            )}
          </div>
          {tab === 'products' && (
             <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
               {CATEGORIES.map(cat => (
                 <button key={cat} onClick={() => setCategory(cat)} className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${category === cat ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-900/10' : 'bg-white text-slate-400 border-slate-200 hover:border-orange-300'}`}>{cat}</button>
               ))}
             </div>
          )}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-2 md:px-6 py-8">
        {/* Search */}
        {tab === 'products' && (
          <div className="relative mb-8 max-w-xl mx-auto px-2">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search item..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white border border-orange-100 rounded-2xl text-sm font-bold shadow-xl shadow-orange-900/5 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all" />
          </div>
        )}

        {/* Packages Grid */}
        {tab === 'packages' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-2">
            {packages.map(pkg => <PackageCard key={pkg._id} pkg={pkg} />)}
          </div>
        )}

        {/* Products Grid (2-Columns Mobile) */}
        {tab === 'products' && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 px-1">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map(product => {
                const qty = cart.find(c => c.productId === product._id)?.quantity || 0;
                return (
                  <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={product._id} className="bg-white rounded-2xl md:rounded-[2rem] border border-orange-50 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col h-full">
                    <div className="relative aspect-square bg-slate-50 overflow-hidden group">
                      <img src={product.image || '/item.jpg'} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      {!product.inStock && <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center text-center p-2"><span className="text-[10px] font-black text-red-600 uppercase">Out of Stock</span></div>}
                    </div>
                    
                    <div className="p-3 md:p-5 flex flex-col flex-1">
                      <p className="text-[8px] md:text-[10px] text-orange-500 font-black uppercase mb-1">{product.category}</p>
                      <h3 className="text-[12px] md:text-sm font-black text-slate-800 leading-tight mb-2 line-clamp-2 h-8 md:h-10">{product.name}</h3>
                      
                      <div className="flex items-baseline gap-1 mb-4">
                         <span className="text-sm md:text-lg font-black text-slate-900">₹{product.price}</span>
                         <span className="text-[8px] md:text-[10px] font-bold text-slate-400">/{product.unit}</span>
                      </div>
                      
                      <div className="mt-auto">
                        {qty === 0 ? (
                          <button onClick={() => addToCart(product)} disabled={!product.inStock} className="w-full py-2.5 bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white text-[10px] font-black rounded-xl transition-all active:scale-95 disabled:opacity-50">ADD TO CART</button>
                        ) : (
                          <div className="flex items-center justify-between bg-orange-600 rounded-xl p-1 shadow-lg shadow-orange-900/20">
                            <button onClick={() => removeFromCart(product._id)} className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center text-white"><Minus size={14} /></button>
                            <span className="text-white text-xs md:text-sm font-black">{qty}</span>
                            <button onClick={() => addToCart(product)} className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center text-white"><Plus size={14} /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Floating Checkout Bar */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-6 left-4 right-4 md:left-auto md:right-10 md:w-96 z-50">
            <Link href="/samagri/cart" className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-[2rem] shadow-2xl border border-white/10 active:scale-95 transition-all">
              <div className="flex items-center gap-4 pl-2">
                <div className="relative">
                  <ShoppingBag size={24} />
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900">{cartCount}</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Cart Total</p>
                  <p className="text-lg font-black">₹{cartTotal}</p>
                </div>
              </div>
              <div className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2">Checkout <ChevronRight size={16} /></div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-12 text-center border-t border-slate-100 opacity-30">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Pure Devotion • Authentic Samagri</p>
      </footer>
    </div>
  );
}