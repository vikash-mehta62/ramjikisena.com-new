'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ArrowLeft, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';

interface Order {
  _id: string;
  orderType: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  status: string;
  poojaType: string;
  poojaDate: string;
  deliveryAddress: { name: string; city: string; state: string };
  payment: { method: string; status: string };
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { color: string; icon: any; label: string }> = {
  pending:   { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Pending' },
  confirmed: { color: 'bg-blue-100 text-blue-700', icon: CheckCircle, label: 'Confirmed' },
  packed:    { color: 'bg-purple-100 text-purple-700', icon: Package, label: 'Packed' },
  shipped:   { color: 'bg-indigo-100 text-indigo-700', icon: Truck, label: 'Shipped' },
  delivered: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Cancelled' },
};

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/samagri/orders/my');
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="h-20"></div>
        <div className="min-h-screen flex items-center justify-center bg-orange-50">
          <div className="text-center"><div className="text-6xl mb-4">📦</div><p className="text-orange-700">Loading orders...</p></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="h-20"></div>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/samagri" className="p-2 bg-white rounded-xl shadow hover:shadow-md transition">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-orange-800">📦 मेरे Orders</h1>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg mb-4">कोई order नहीं मिला</p>
              <Link href="/samagri" className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition">
                सामग्री खरीदें
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                const Icon = cfg.icon;
                return (
                  <Link key={order._id} href={`/samagri/orders/${order._id}`}
                    className="block bg-white rounded-2xl shadow-md p-5 border border-orange-100 hover:shadow-xl hover:border-orange-300 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                        <p className="font-bold text-gray-800">
                          {order.orderType === 'package' ? '🎁 Package Order' : `${order.items.length} items`}
                        </p>
                        {order.poojaType && <p className="text-sm text-orange-600">{order.poojaType}</p>}
                      </div>
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${cfg.color}`}>
                        <Icon className="w-3 h-3" />{cfg.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-600">
                        <span>📍 {order.deliveryAddress.city}, {order.deliveryAddress.state}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-700 text-lg">₹{order.totalAmount}</p>
                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex gap-1">
                        {['pending','confirmed','packed','shipped','delivered'].map((s, i) => {
                          const statuses = ['pending','confirmed','packed','shipped','delivered'];
                          const currentIdx = statuses.indexOf(order.status);
                          const isFilled = order.status !== 'cancelled' && i <= currentIdx;
                          return (
                            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${isFilled ? 'bg-orange-500' : 'bg-gray-200'}`} />
                          );
                        })}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
