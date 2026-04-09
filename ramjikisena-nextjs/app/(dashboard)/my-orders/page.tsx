'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Clock, CheckCircle, Truck, XCircle, ShoppingBag, ChevronRight, MapPin, CreditCard, Calendar } from 'lucide-react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderItem { name: string; quantity: number; price: number; }
interface Order {
  _id: string;
  orderType: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  status: string;
  poojaType: string;
  poojaDate: string;
  deliveryAddress: { name: string; phone: string; address: string; city: string; state: string; pincode: string; };
  payment: { method: string; status: string };
  createdAt: string;
}

const STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];

const STATUS_CFG: Record<string, { color: string; bg: string; border: string; icon: any; label: string; emoji: string }> = {
  pending:   { color: 'text-yellow-700', bg: 'bg-yellow-50',  border: 'border-yellow-200', icon: Clock,        label: 'Pending',   emoji: '⏳' },
  confirmed: { color: 'text-blue-700',   bg: 'bg-blue-50',    border: 'border-blue-200',   icon: CheckCircle,  label: 'Confirmed', emoji: '✅' },
  packed:    { color: 'text-purple-700', bg: 'bg-purple-50',  border: 'border-purple-200', icon: Package,      label: 'Packed',    emoji: '📦' },
  shipped:   { color: 'text-indigo-700', bg: 'bg-indigo-50',  border: 'border-indigo-200', icon: Truck,        label: 'Shipped',   emoji: '🚚' },
  delivered: { color: 'text-green-700',  bg: 'bg-green-50',   border: 'border-green-200',  icon: CheckCircle,  label: 'Delivered', emoji: '🎉' },
  cancelled: { color: 'text-red-700',    bg: 'bg-red-50',     border: 'border-red-200',    icon: XCircle,      label: 'Cancelled', emoji: '❌' },
};

function OrderProgress({ status }: { status: string }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 mt-3">
        <div className="h-1.5 w-full rounded-full bg-red-200" />
        <span className="text-xs text-red-500 font-bold whitespace-nowrap">Cancelled</span>
      </div>
    );
  }
  const currentIdx = STATUSES.indexOf(status);
  return (
    <div className="mt-3">
      <div className="flex gap-1 mb-1.5">
        {STATUSES.map((s, i) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= currentIdx ? 'bg-orange-500' : 'bg-slate-200'}`} />
        ))}
      </div>
      <div className="flex justify-between">
        {STATUSES.map((s, i) => (
          <span key={s} className={`text-[9px] font-bold capitalize ${i <= currentIdx ? 'text-orange-600' : 'text-slate-300'}`}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  const cfg = STATUS_CFG[order.status] || STATUS_CFG.pending;
  const Icon = cfg.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="bg-white rounded-2xl border-2 border-orange-100 hover:border-orange-300 shadow-sm hover:shadow-md transition-all cursor-pointer p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[10px] font-bold text-slate-400 mb-0.5">
            ORDER #{order._id.slice(-8).toUpperCase()}
          </p>
          <p className="font-black text-slate-800">
            {order.orderType === 'package' ? '🎁 Package Order' : `${order.items.length} Item${order.items.length > 1 ? 's' : ''}`}
          </p>
          {order.poojaType && (
            <p className="text-xs text-orange-600 font-semibold mt-0.5">🪔 {order.poojaType}</p>
          )}
        </div>
        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
          <Icon className="w-3 h-3" /> {cfg.label}
        </span>
      </div>

      {/* Items preview */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {order.items.slice(0, 3).map((item, i) => (
          <span key={i} className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-lg font-semibold">
            {item.name} ×{item.quantity}
          </span>
        ))}
        {order.items.length > 3 && (
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg font-semibold">
            +{order.items.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1 text-slate-500">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-xs">{order.deliveryAddress?.city}, {order.deliveryAddress?.state}</span>
        </div>
        <div className="text-right">
          <p className="font-black text-orange-600 text-lg">₹{order.totalAmount?.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400">
            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      <OrderProgress status={order.status} />
    </motion.div>
  );
}

function OrderDetail({ order, onClose }: { order: Order; onClose: () => void }) {
  const cfg = STATUS_CFG[order.status] || STATUS_CFG.pending;
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white rounded-2xl border-2 border-orange-100 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-5 text-white">
        <div className="flex items-center justify-between mb-1">
          <p className="text-orange-100 text-xs font-bold">ORDER #{order._id.slice(-8).toUpperCase()}</p>
          <button onClick={onClose} className="text-white/70 hover:text-white text-lg leading-none lg:hidden">✕</button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-black text-xl">{order.orderType === 'package' ? '🎁 Package' : `${order.items.length} Items`}</p>
            <p className="text-orange-100 text-xs mt-0.5">
              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-white/20 text-white`}>
            <Icon className="w-3.5 h-3.5" /> {cfg.label}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">

        {/* Progress */}
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <p className="text-xs font-black text-orange-600 uppercase tracking-widest mb-3">Order Progress</p>
          <OrderProgress status={order.status} />
        </div>

        {/* Items */}
        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Items</p>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                  <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                </div>
                <p className="font-black text-slate-700">₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Price breakdown */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Price Breakdown</p>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>₹{order.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery</span>
              <span>{order.deliveryCharge === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${order.deliveryCharge}`}</span>
            </div>
            <div className="flex justify-between font-black text-slate-900 pt-1.5 border-t border-slate-200">
              <span>Total</span>
              <span className="text-orange-600">₹{order.totalAmount?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Delivery Address</p>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="font-black text-slate-800">{order.deliveryAddress?.name}</p>
            <p className="text-sm text-slate-600 mt-1">{order.deliveryAddress?.address}</p>
            <p className="text-sm text-slate-600">{order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}</p>
            {order.deliveryAddress?.phone && (
              <p className="text-sm text-slate-500 mt-1">📞 {order.deliveryAddress.phone}</p>
            )}
          </div>
        </div>

        {/* Payment */}
        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Payment</p>
          <div className="flex items-center gap-3 bg-green-50 rounded-xl p-4 border border-green-100">
            <CreditCard className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-black text-slate-800 capitalize">{order.payment?.method || 'COD'}</p>
              <p className={`text-xs font-bold capitalize ${order.payment?.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                {order.payment?.status || 'Pending'}
              </p>
            </div>
          </div>
        </div>

        {/* Pooja details */}
        {order.poojaType && (
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Pooja Details</p>
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <p className="font-black text-orange-800">🪔 {order.poojaType}</p>
              {order.poojaDate && (
                <p className="text-sm text-orange-600 mt-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(order.poojaDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    api.get('/api/samagri/orders/my')
      .then(r => r.json())
      .then(d => { if (d.success) setOrders(d.orders); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Orders</h1>
          <p className="text-slate-500 text-sm mt-1">Apne samagri orders track karein</p>
        </div>
        <Link href="/samagri"
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors">
          <ShoppingBag className="w-4 h-4" /> Shop More
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all capitalize ${
              filter === s ? 'bg-orange-500 text-white shadow-md' : 'bg-white border-2 border-orange-100 text-slate-600 hover:border-orange-300'
            }`}>
            {s === 'all' ? `All (${orders.length})` : `${STATUS_CFG[s]?.emoji} ${s}`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-orange-100 p-12 text-center">
          <Package className="w-14 h-14 mx-auto mb-4 text-orange-200" />
          <p className="font-black text-slate-700 mb-1">
            {filter === 'all' ? 'Koi order nahi mila' : `Koi ${filter} order nahi`}
          </p>
          <p className="text-slate-400 text-sm mb-5">Puja samagri order karein</p>
          <Link href="/samagri"
            className="inline-block px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl text-sm hover:shadow-lg transition-all">
            Samagri Dekhein
          </Link>
        </div>
      ) : (
        /* Two-panel layout on desktop */
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Orders list */}
          <div className={`space-y-3 ${selected ? 'lg:col-span-2' : 'lg:col-span-5'}`}>
            {filtered.map(order => (
              <OrderCard key={order._id} order={order}
                onClick={() => setSelected(selected?._id === order._id ? null : order)} />
            ))}
          </div>

          {/* Detail panel */}
          <AnimatePresence>
            {selected && (
              <div className="lg:col-span-3">
                <OrderDetail order={selected} onClose={() => setSelected(null)} />
              </div>
            )}
          </AnimatePresence>

        </div>
      )}
    </div>
  );
}
