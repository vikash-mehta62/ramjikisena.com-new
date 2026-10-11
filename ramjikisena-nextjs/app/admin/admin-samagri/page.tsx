'use client';

import { useState, useEffect } from 'react';
import { 
  Package, ShoppingBag, Plus, Pencil, Trash2, X, ChevronDown, 
  RefreshCw, Eye, Sparkles, MapPin, Phone, User, Calendar, 
  CreditCard, CheckCircle2, Clock, AlertCircle 
} from 'lucide-react';
import api from '@/lib/api';
import ImageUploader from '@/components/ImageUploader';
import AdminPagination from '@/components/AdminPagination';

type AdminTab = 'orders' | 'packages' | 'products';

interface Product { _id: string; name: string; category: string; price: number; unit: string; inStock: boolean; isActive: boolean; image: string; description: string; }
interface SamagriPackage { _id: string; name: string; tier: string; poojaType: string; originalPrice: number; discountedPrice: number; isActive: boolean; description: string; items: any[]; image?: string; }
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

  // Selected order for detailed modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Pagination for orders
  const [orderPage, setOrderPage] = useState(1);
  const [orderLimit, setOrderLimit] = useState(10);

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

  useEffect(() => {
    setOrderPage(1);
  }, [statusFilter]);

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
  const paginatedOrders = filteredOrders.slice((orderPage - 1) * orderLimit, orderPage * orderLimit);
  const totalOrderPages = Math.max(1, Math.ceil(filteredOrders.length / orderLimit));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Premium Header Banner */}
      <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl mb-6">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-bold flex-shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-orange-300 text-[11px] font-black uppercase tracking-wider mb-1">
                Sacred Pooja Essentials & Store
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">पूजा सामग्री प्रबंधन (Samagri Store)</h1>
              <p className="text-sm text-slate-300 mt-0.5">सामग्री पैकेजेस, उत्पाद सूची एवं भक्तजनों के ऑर्डर प्रबंधन</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchAll}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              रिफ्रेश
            </button>
            {tab === 'packages' && (
              <button
                onClick={() => { resetPackageForm(); setShowPackageForm(!showPackageForm); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-orange-500/20 transition-all hover:scale-105 cursor-pointer"
              >
                {showPackageForm ? <><X className="w-4 h-4" /> रद्द करें</> : <><Plus className="w-4 h-4" /> नया पैकेज जोड़ें</>}
              </button>
            )}
            {tab === 'products' && (
              <button
                onClick={() => { resetProductForm(); setShowProductForm(!showProductForm); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-orange-500/20 transition-all hover:scale-105 cursor-pointer"
              >
                {showProductForm ? <><X className="w-4 h-4" /> रद्द करें</> : <><Plus className="w-4 h-4" /> नया उत्पाद जोड़ें</>}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          onClick={() => setTab('orders')}
          className={`cursor-pointer bg-white rounded-2xl p-5 border transition-all ${
            tab === 'orders' ? 'border-slate-900 shadow-md ring-2 ring-slate-900/10' : 'border-slate-100 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">कुल ऑर्डर्स (Total Orders)</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{orders.length.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 font-medium">समस्त ऑर्डर इतिहास</span>
        </div>

        <div
          onClick={() => { setTab('orders'); setStatusFilter('pending'); }}
          className={`cursor-pointer bg-white rounded-2xl p-5 border transition-all ${
            tab === 'orders' && statusFilter === 'pending' ? 'border-amber-500 shadow-md ring-2 ring-amber-500/10' : 'border-slate-100 shadow-sm hover:shadow-md'
          } ${orders.filter(o => o.status === 'pending').length > 0 ? 'bg-amber-50/30' : ''}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800">लंबित ऑर्डर्स (Pending)</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-black text-amber-600">
              {orders.filter(o => o.status === 'pending').length.toLocaleString()}
            </p>
            {orders.filter(o => o.status === 'pending').length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black animate-pulse">
                प्रक्रिया करें
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">नवीनतम ऑर्डर</span>
        </div>

        <div
          onClick={() => setTab('packages')}
          className={`cursor-pointer bg-white rounded-2xl p-5 border transition-all ${
            tab === 'packages' ? 'border-slate-900 shadow-md ring-2 ring-slate-900/10' : 'border-slate-100 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">पूजा पैकेजेस (Packages)</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{packages.length.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 font-medium">कथा व अनुष्ठान किट</span>
        </div>

        <div
          onClick={() => setTab('products')}
          className={`cursor-pointer bg-white rounded-2xl p-5 border transition-all ${
            tab === 'products' ? 'border-slate-900 shadow-md ring-2 ring-slate-900/10' : 'border-slate-100 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">उपलब्ध सामग्री (Products)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{products.length.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 font-medium">{products.filter(p => p.inStock).length} स्टॉक में उपलब्ध</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-2xl p-2 shadow-md w-full sm:w-fit overflow-x-auto no-scrollbar">
        {(['orders', 'packages', 'products'] as AdminTab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl font-bold capitalize transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${tab === t ? 'bg-orange-600 text-white shadow' : 'text-gray-600 hover:bg-orange-50'}`}>
            {t === 'orders' ? '📦 Orders' : t === 'packages' ? '🎁 Packages' : '🛒 Products'}
          </button>
        ))}
      </div>

      {/* ── ORDERS TAB ── */}
      {tab === 'orders' && (
        <div>
          <div className="flex gap-2 mb-4 flex-wrap">
            <button onClick={() => setStatusFilter('')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${!statusFilter ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>All ({orders.length})</button>
            {STATUSES.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition cursor-pointer ${statusFilter === s ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
                {s} ({orders.filter(o => o.status === s).length})
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-slate-100">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No orders found</p>
              </div>
            ) : (
              <>
                {paginatedOrders.map(order => (
                  <div key={order._id} className="bg-white rounded-2xl shadow-md p-5 border border-orange-100 hover:shadow-lg transition-all">
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
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors border border-blue-200 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          विवरण देखें
                        </button>
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

                <AdminPagination
                  page={orderPage}
                  totalPages={totalOrderPages}
                  total={filteredOrders.length}
                  limit={orderLimit}
                  onPageChange={setOrderPage}
                  onLimitChange={(l) => {
                    setOrderLimit(l);
                    setOrderPage(1);
                  }}
                  limitOptions={[5, 10, 20, 50, 100]}
                  itemName="ऑर्डर"
                />
              </>
            )}
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedOrder(null);
          }}
        >
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-200 my-auto flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner">
                  📦
                </div>
                <div>
                  <h3 className="text-xl font-black">ऑर्डर विवरण (Order Details)</h3>
                  <p className="text-xs text-orange-100 font-mono">
                    #{selectedOrder._id.slice(-8).toUpperCase()} · {new Date(selectedOrder.createdAt).toLocaleString('hi-IN')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all hover:scale-105 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/50">
              {/* Status and Action */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">वर्तमान स्थिति:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${STATUS_COLORS[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">स्थिति बदलें:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      updateOrderStatus(selectedOrder._id, newStatus);
                      setSelectedOrder({ ...selectedOrder, status: newStatus });
                    }}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer & Delivery Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-orange-600" /> ग्राहक विवरण (Customer)
                  </h4>
                  <p className="text-sm font-black text-slate-800">{selectedOrder.user?.name || 'N/A'}</p>
                  <p className="text-xs text-slate-600 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedOrder.user?.contact || 'N/A'}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {selectedOrder.user?.city || 'N/A'}
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" /> डिलीवरी पता (Delivery Address)
                  </h4>
                  <p className="text-sm font-black text-slate-800">{selectedOrder.deliveryAddress?.name || selectedOrder.user?.name}</p>
                  <p className="text-xs text-slate-600">
                    {selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.state}
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500">भुगतान:</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold uppercase">
                      {selectedOrder.payment?.method || 'COD'} ({selectedOrder.payment?.status || 'pending'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-3.5 bg-slate-100/70 border-b border-slate-200 font-bold text-xs text-slate-700 flex items-center justify-between">
                  <span>ऑर्डर सामग्री (Ordered Items)</span>
                  <span>{selectedOrder.items?.length || 0} वस्तुएं</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="p-3.5 flex items-center justify-between text-sm">
                      <div>
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-500">दर: ₹{item.price} × {item.quantity}</p>
                      </div>
                      <p className="font-black text-slate-900">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-orange-50/50 border-t border-orange-100 flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">कुल भुगतान (Total Amount):</span>
                  <span className="text-xl font-black text-orange-600">₹{selectedOrder.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
