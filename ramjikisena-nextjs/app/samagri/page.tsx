'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Package, Star, Truck, Shield, Plus, Minus, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  price: number;
  unit: string;
  inStock: boolean;
}

interface PackageItem {
  product: { _id: string; name: string; image: string; unit: string };
  quantity: number;
}

interface SamagriPackage {
  _id: string;
  name: string;
  description: string;
  tier: 'Basic' | 'Standard' | 'Premium';
  poojaType: string;
  items: PackageItem[];
  originalPrice: number;
  discountedPrice: number;
  image: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
}

const TIER_COLORS = {
  Basic: 'from-green-500 to-emerald-600',
  Standard: 'from-orange-500 to-amber-600',
  Premium: 'from-purple-600 to-violet-700',
};

const TIER_BADGE = {
  Basic: 'bg-green-100 text-green-700',
  Standard: 'bg-orange-100 text-orange-700',
  Premium: 'bg-purple-100 text-purple-700',
};

const CATEGORIES = ['All', 'Incense', 'Flowers', 'Diyas', 'Ghee', 'Sweets', 'Cloth', 'Idols', 'Other'];

export default function SamagriPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'packages' | 'products'>('packages');
  const [packages, setPackages] = useState<SamagriPackage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
    // Load cart from localStorage
    const saved = localStorage.getItem('samagri_cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('samagri_cart', JSON.stringify(newCart));
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(c => c.productId === product._id);
    let newCart: CartItem[];
    if (existing) {
      newCart = cart.map(c => c.productId === product._id ? { ...c, quantity: c.quantity + 1 } : c);
    } else {
      newCart = [...cart, { productId: product._id, name: product.name, price: product.price, quantity: 1, image: product.image, unit: product.unit }];
    }
    saveCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    const existing = cart.find(c => c.productId === productId);
    if (!existing) return;
    let newCart: CartItem[];
    if (existing.quantity === 1) {
      newCart = cart.filter(c => c.productId !== productId);
    } else {
      newCart = cart.map(c => c.productId === productId ? { ...c, quantity: c.quantity - 1 } : c);
    }
    saveCart(newCart);
  };

  const getQty = (productId: string) => cart.find(c => c.productId === productId)?.quantity || 0;

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const filteredProducts = products.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="h-20"></div>
        <div className="min-h-screen flex items-center justify-center bg-orange-50">
          <div className="text-center">
            <div className="text-6xl mb-4">🪔</div>
            <p className="text-xl text-orange-700">Loading Samagri...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="h-20"></div>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 text-white py-12 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="text-5xl mb-3">🪔</div>
            <h1 className="text-4xl font-bold mb-2">पूजन सामग्री</h1>
            <p className="text-orange-100 text-lg mb-6">शुद्ध और प्रामाणिक पूजा सामग्री — घर पर डिलीवरी</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2"><Truck className="w-4 h-4" /> Free delivery above ₹500</div>
              <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> 100% Pure & Authentic</div>
              <div className="flex items-center gap-2"><Star className="w-4 h-4" /> Trusted by 10,000+ devotees</div>
            </div>
          </div>
        </div>

        {/* Floating Cart */}
        {cartCount > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <Link href="/samagri/cart"
              className="flex items-center gap-3 bg-orange-600 text-white px-5 py-3 rounded-full shadow-2xl hover:bg-orange-700 transition-all hover:scale-105">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-bold">{cartCount} items</span>
              <span className="bg-white text-orange-600 px-2 py-0.5 rounded-full text-sm font-bold">₹{cartTotal}</span>
            </Link>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-white rounded-2xl p-2 shadow-md w-fit">
            <button onClick={() => setTab('packages')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${tab === 'packages' ? 'bg-orange-600 text-white shadow' : 'text-gray-600 hover:bg-orange-50'}`}>
              <Package className="w-4 h-4 inline mr-2" />पूजा पैकेज
            </button>
            <button onClick={() => setTab('products')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${tab === 'products' ? 'bg-orange-600 text-white shadow' : 'text-gray-600 hover:bg-orange-50'}`}>
              <ShoppingCart className="w-4 h-4 inline mr-2" />सामग्री खरीदें
            </button>
          </div>

          {/* PACKAGES TAB */}
          {tab === 'packages' && (
            <div>
              <h2 className="text-2xl font-bold text-orange-800 mb-6">🎁 पूजा पैकेज चुनें</h2>
              {packages.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>कोई पैकेज उपलब्ध नहीं है</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {packages.map(pkg => (
                    <div key={pkg._id} className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-orange-100 hover:border-orange-300 transition-all hover:shadow-2xl hover:-translate-y-1">
                      {/* Tier Header */}
                      <div className={`bg-gradient-to-r ${TIER_COLORS[pkg.tier]} p-5 text-white`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider opacity-80">{pkg.tier} Package</span>
                            <h3 className="text-xl font-bold mt-1">{pkg.name}</h3>
                            <p className="text-sm opacity-80 mt-1">{pkg.poojaType}</p>
                          </div>
                          <div className="text-3xl">
                            {pkg.tier === 'Basic' ? '🌿' : pkg.tier === 'Standard' ? '🪔' : '👑'}
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

                        {/* Items list */}
                        {pkg.items.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-bold text-gray-500 uppercase mb-2">शामिल सामग्री:</p>
                            <div className="space-y-1">
                              {pkg.items.slice(0, 5).map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                  <span className="text-orange-500">✓</span>
                                  <span>{item.product?.name}</span>
                                  <span className="text-gray-400">×{item.quantity}</span>
                                </div>
                              ))}
                              {pkg.items.length > 5 && (
                                <p className="text-xs text-orange-600 font-medium">+{pkg.items.length - 5} more items</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl font-bold text-orange-700">₹{pkg.discountedPrice}</span>
                          {pkg.originalPrice > pkg.discountedPrice && (
                            <>
                              <span className="text-gray-400 line-through text-sm">₹{pkg.originalPrice}</span>
                              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                {Math.round((1 - pkg.discountedPrice / pkg.originalPrice) * 100)}% OFF
                              </span>
                            </>
                          )}
                        </div>

                        <Link href={`/samagri/cart?packageId=${pkg._id}&packageName=${encodeURIComponent(pkg.name)}&price=${pkg.discountedPrice}`}
                          className={`w-full block text-center py-3 rounded-xl font-bold text-white bg-gradient-to-r ${TIER_COLORS[pkg.tier]} hover:shadow-lg transition-all hover:scale-105`}>
                          अभी बुक करें →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PRODUCTS TAB */}
          {tab === 'products' && (
            <div>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="सामग्री खोजें..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500" />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${category === cat ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>कोई सामग्री नहीं मिली</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map(product => {
                    const qty = getQty(product._id);
                    return (
                      <div key={product._id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-orange-100 hover:shadow-xl transition-all">
                        <div className="h-36 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-5xl">🪔</span>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2">{product.name}</h3>
                          <p className="text-xs text-gray-500 mb-2">{product.category} · per {product.unit}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-orange-700">₹{product.price}</span>
                            {!product.inStock ? (
                              <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                            ) : qty === 0 ? (
                              <button onClick={() => addToCart(product)}
                                className="flex items-center gap-1 bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-orange-700 transition">
                                <Plus className="w-3 h-3" /> Add
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button onClick={() => removeFromCart(product._id)}
                                  className="w-7 h-7 bg-orange-100 text-orange-700 rounded-lg flex items-center justify-center hover:bg-orange-200 transition">
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-bold text-orange-700 w-4 text-center">{qty}</span>
                                <button onClick={() => addToCart(product)}
                                  className="w-7 h-7 bg-orange-600 text-white rounded-lg flex items-center justify-center hover:bg-orange-700 transition">
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Proceed to cart button */}
              {cartCount > 0 && (
                <div className="mt-8 text-center">
                  <Link href="/samagri/cart"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                    <ShoppingCart className="w-5 h-5" />
                    Cart देखें ({cartCount} items · ₹{cartTotal})
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
