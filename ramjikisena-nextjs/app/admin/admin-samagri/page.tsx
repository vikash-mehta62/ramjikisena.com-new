'use client';

import { useState, useEffect } from 'react';
import { Package, ShoppingBag, Plus, Pencil, Trash2, X, ChevronDown } from 'lucide-react';
import api from '@/lib/api';
import ImageUploader from '@/components/ImageUploader';

type AdminTab = 'orders' | 'packages' | 'products';

interface Product { _id: string; name: string; category: string; price: number; unit: string; inStock: boolean; isActive: boolean; image: string; description: string; }
interface SamagriPackage { _id: string; name: string; tier: string; poojaType: string; originalPrice: number; discountedPrice: number; isActive: boolean; description: string; items: any[]; }
interface Order {
  _id: string;
  user: { name: string; contact: string; city: string };
  orderType: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  status: string;
  deliveryAddress: { name: string; city: string; state: string };
  payment: { method: string; status: string };
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  packed: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const CATEGORIES = ['Incense', 'Flowers', 'Diyas', 'Ghee', 'Sweets', 'Cloth', 'Idols', 'Other'];
const TIERS = ['Basic', 'Standard', 'Premium'];
const STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

export default function AdminSamagriPage() {
  const [tab, setTab] = useState<AdminTab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [packages, setPackages] = useState<SamagriPackage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ name: '', description: '', category: 'Other', price: '', unit: 'piece', image: '', inStock: true });

  // Package form
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<SamagriPackage | null>(null);
  const [packageForm, setPackageForm] = useState({ name: '', description: '', tier: 'Basic', poojaType: 'General', originalPrice: '', discountedPrice: '', image: '' });

  // Order status filter
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [ordRes, pkgRes, prodRes] = await Promise.all([
        api.get('/api/admin/samagri/orders'),
        api.get('/api/admin/samagri/packages'),
        api.get('/api/admin/samagri/products'),
      ]);
      const [ordData, pkgData, prodData] = await Promise.all([ordRes.json(), pkgRes.json(), prodRes.json()]);
      if (ordData.success) setOrders(ordData.orders);
      if (pkgData.success) setPackages(pkgData.packages);
      if (prodData.success) setProducts(prodData.products);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // ── Products ──────────────────────────────────────────────────────────────
  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...productForm, price: Number(productForm.price) };
      const res = editingProduct
        ? await api.put(`/api/admin/samagri/products/${editingProduct._id}`, payload)
        : await api.post('/api/admin/samagri/products', payload);
      const data = await res.json();
      if (data.success) { fetchAll(); resetProductForm(); }
      else alert(data.message);
    } catch (err) { alert('Error saving product'); }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const res = await api.delete(`/api/admin/samagri/products/${id}`);
    const data = await res.json();
    if (data.success) fetchAll();
  };

  const resetProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm({ name: '', description: '', category: 'Other', price: '', unit: 'piece', image: '', inStock: true });
  };

  const startEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({ name: p.name, description: p.description, category: p.category, price: String(p.price), unit: p.unit, image: p.image, inStock: p.inStock });
    setShowProductForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Packages ──────────────────────────────────────────────────────────────
  const savePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...packageForm, originalPrice: Number(packageForm.originalPrice), discountedPrice: Number(packageForm.discountedPrice) };
      const res = editingPackage
        ? await api.put(`/api/admin/samagri/packages/${editingPackage._id}`, payload)
        : await api.post('/api/admin/samagri/packages', payload);
      const data = await res.json();
      if (data.success) { fetchAll(); resetPackageForm(); }
      else alert(data.message);
    } catch (err) { alert('Error saving package'); }
  };

  const deletePackage = async (id: string) => {
    if (!confirm('Delete this package?')) return;
    const res = await api.delete(`/api/admin/samagri/packages/${id}`);
    const data = await res.json();
    if (data.success) fetchAll();
  };

  const resetPackageForm = () => {
    setShowPackageForm(false);
    setEditingPackage(null);
    setPackageForm({ name: '', description: '', tier: 'Basic', poojaType: 'General', originalPrice: '', discountedPrice: '', image: '' });
  };

  const startEditPackage = (p: SamagriPackage) => {
    setEditingPackage(p);
    setPackageForm({ name: p.name, description: p.description, tier: p.tier, poojaType: p.poojaType, originalPrice: String(p.originalPrice), discountedPrice: String(p.discountedPrice), image: p.image || '' });
    setShowPackageForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Order Status Update ───────────────────────────────────────────────────
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await api.put(`/api/admin/samagri/orders/${orderId}/status`, { status });
      const data = await res.json();
      if (data.success) fetchAll();
      else alert(data.message);
    } catch (err) { alert('Error updating status'); }
  };

  const filteredOrders = statusFilter ? orders.filter(o => o.status === statusFilter) : orders;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl">🪔</div>
          <div>
            <h1 className="text-4xl font-bold mb-1">Samagri Management</h1>
            <p className="text-orange-100">Manage products, packages & orders</p>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">{orders.length}</p>
            <p className="text-sm text-orange-100">Total Orders</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">{packages.length}</p>
            <p className="text-sm text-orange-100">Packages</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">{products.length}</p>
            <p className="text-sm text-orange-100">Products</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-2xl p-2 shadow-md w-fit">
        {(['orders', 'packages', 'products'] as AdminTab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl font-bold capitalize transition-all ${tab === t ? 'bg-orange-600 text-white shadow' : 'text-gray-600 hover:bg-orange-50'}`}>
            {t === 'orders' ? '📦 Orders' : t === 'packages' ? '🎁 Packages' : '🛒 Products'}
          </button>
        ))}
      </div>

      {/* ── ORDERS TAB ── */}
      {tab === 'orders' && (
        <div>
          <div className="flex gap-2 mb-4 flex-wrap">
            <button onClick={() => setStatusFilter('')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${!statusFilter ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>All ({orders.length})</button>
            {STATUSES.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition ${statusFilter === s ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
                {s} ({orders.filter(o => o.status === s).length})
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No orders found</p>
              </div>
            ) : filteredOrders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl shadow-md p-5 border border-orange-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-bold text-gray-800">#{order._id.slice(-8).toUpperCase()}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                    </div>
                    <p className="text-sm text-gray-600">{order.user?.name} · {order.user?.contact}</p>
                    <p className="text-sm text-gray-500">📍 {order.deliveryAddress?.city}, {order.deliveryAddress?.state}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-orange-700 text-lg">₹{order.totalAmount}</p>
                      <p className="text-xs text-gray-500 capitalize">{order.payment?.method || 'COD'}</p>
                    </div>
                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order._id, e.target.value)}
                        className="appearance-none pl-3 pr-8 py-2 border-2 border-orange-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-orange-500 bg-white cursor-pointer">
                        {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                {/* Items preview */}
                <div className="mt-3 pt-3 border-t flex flex-wrap gap-2">
                  {order.items.slice(0, 4).map((item, i) => (
                    <span key={i} className="bg-orange-50 text-orange-700 text-xs px-2 py-1 rounded-lg">{item.name} ×{item.quantity}</span>
                  ))}
                  {order.items.length > 4 && <span className="text-xs text-gray-400">+{order.items.length - 4} more</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PACKAGES TAB ── */}
      {tab === 'packages' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => { resetPackageForm(); setShowPackageForm(!showPackageForm); }}
              className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-700 transition">
              {showPackageForm ? <><X className="w-4 h-4" />Cancel</> : <><Plus className="w-4 h-4" />Add Package</>}
            </button>
          </div>

          {showPackageForm && (
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-orange-200">
              <h3 className="text-xl font-bold text-orange-700 mb-4">{editingPackage ? '✏️ Edit Package' : '➕ New Package'}</h3>
              <form onSubmit={savePackage} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Package Name *</label>
                  <input required value={packageForm.name} onChange={e => setPackageForm({...packageForm, name: e.target.value})}
                    placeholder="e.g., Satyanarayan Pooja Package" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Tier *</label>
                  <select required value={packageForm.tier} onChange={e => setPackageForm({...packageForm, tier: e.target.value})}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400">
                    {TIERS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Pooja Type</label>
                  <input value={packageForm.poojaType} onChange={e => setPackageForm({...packageForm, poojaType: e.target.value})}
                    placeholder="e.g., Satyanarayan Katha" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Original Price (₹) *</label>
                  <input required type="number" value={packageForm.originalPrice} onChange={e => setPackageForm({...packageForm, originalPrice: e.target.value})}
                    placeholder="e.g., 1500" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Discounted Price (₹) *</label>
                  <input required type="number" value={packageForm.discountedPrice} onChange={e => setPackageForm({...packageForm, discountedPrice: e.target.value})}
                    placeholder="e.g., 999" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Description</label>
                  <textarea value={packageForm.description} onChange={e => setPackageForm({...packageForm, description: e.target.value})}
                    rows={2} placeholder="Package description..." className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 resize-none" />
                </div>
                <div className="md:col-span-2">
                  <ImageUploader
                    label="Package Image"
                    value={packageForm.image}
                    onChange={v => setPackageForm({ ...packageForm, image: v as string })}
                    folder="samagri/packages"
                  />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button type="submit" className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition">
                    {editingPackage ? 'Update Package' : 'Create Package'}
                  </button>
                  <button type="button" onClick={resetPackageForm} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition">Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map(pkg => (
              <div key={pkg._id} className="bg-white rounded-2xl shadow-md p-5 border border-orange-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pkg.tier === 'Basic' ? 'bg-green-100 text-green-700' : pkg.tier === 'Standard' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>{pkg.tier}</span>
                    <h3 className="font-bold text-gray-800 mt-1">{pkg.name}</h3>
                    <p className="text-sm text-gray-500">{pkg.poojaType}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditPackage(pkg)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => deletePackage(pkg._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-orange-700">₹{pkg.discountedPrice}</span>
                  {pkg.originalPrice > pkg.discountedPrice && <span className="text-gray-400 line-through text-sm">₹{pkg.originalPrice}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PRODUCTS TAB ── */}
      {tab === 'products' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => { resetProductForm(); setShowProductForm(!showProductForm); }}
              className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-700 transition">
              {showProductForm ? <><X className="w-4 h-4" />Cancel</> : <><Plus className="w-4 h-4" />Add Product</>}
            </button>
          </div>

          {showProductForm && (
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-orange-200">
              <h3 className="text-xl font-bold text-orange-700 mb-4">{editingProduct ? '✏️ Edit Product' : '➕ New Product'}</h3>
              <form onSubmit={saveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Product Name *</label>
                  <input required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})}
                    placeholder="e.g., Chandan Agarbatti" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Category *</label>
                  <select required value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Price (₹) *</label>
                  <input required type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})}
                    placeholder="e.g., 50" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Unit</label>
                  <select value={productForm.unit} onChange={e => setProductForm({...productForm, unit: e.target.value})}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400">
                    {['piece', 'pack', 'kg', 'gram', 'litre', 'ml', 'box', 'set'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Description</label>
                  <input value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})}
                    placeholder="Short description..." className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400" />
                </div>
                <div className="md:col-span-2">
                  <ImageUploader
                    label="Product Image"
                    value={productForm.image}
                    onChange={v => setProductForm({ ...productForm, image: v as string })}
                    folder="samagri/products"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="inStock" checked={productForm.inStock} onChange={e => setProductForm({...productForm, inStock: e.target.checked})} className="w-4 h-4 accent-orange-600" />
                  <label htmlFor="inStock" className="text-sm font-semibold text-gray-700">In Stock</label>
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button type="submit" className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button type="button" onClick={resetProductForm} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition">Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <div key={product._id} className="bg-white rounded-2xl shadow-md p-4 border border-orange-100 flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" /> : <span className="text-2xl">🪔</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-gray-500">{product.category} · per {product.unit}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-orange-700">₹{product.price}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => startEditProduct(product)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteProduct(product._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
