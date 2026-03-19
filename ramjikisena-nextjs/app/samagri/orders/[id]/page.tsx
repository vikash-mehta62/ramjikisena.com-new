'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Package, Clock, CheckCircle, Truck, XCircle, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';

interface Order {
  _id: string;
  orderType: string;
  items: { name: string; quantity: number; price: number; image: string }[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  status: string;
  poojaType: string;
  poojaDate: string;
  specialInstructions: string;
  deliveryAddress: { name: string; phone: string; address: string; city: string; state: string; pincode: string };
  payment: { method: string; status: string };
  trackingInfo: { confirmedAt?: string; packedAt?: string; shippedAt?: string; deliveredAt?: string; cancelledAt?: string };
  cancellationReason: string;
  createdAt: string;
}

const TRACKING_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Package, timeKey: 'createdAt' },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, timeKey: 'confirmedAt' },
  { key: 'packed', label: 'Packed', icon: Package, timeKey: 'packedAt' },
  { key: 'shipped', label: 'Shipped', icon: Truck, timeKey: 'shippedAt' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle, timeKey: 'deliveredAt' },
];

const STATUS_ORDER = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];

function OrderDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/api/samagri/orders/${id}`);
      const data = await res.json();
      if (data.success) setOrder(data.order);
      else router.push('/samagri/orders');
    } catch (err) {
      router.push('/samagri/orders');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!confirm('क्या आप यह order cancel करना चाहते हैं?')) return;
    setCancelling(true);
    try {
      const res = await api.post(`/api/samagri/orders/${id}/cancel`, { reason: 'Cancelled by user' });
      const data = await res.json();
      if (data.success) fetchOrder();
      else alert(data.message);
    } catch (err) {
      alert('Something went wrong');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="h-20"></div>
        <div className="min-h-screen flex items-center justify-center bg-orange-50">
          <div className="text-6xl">📦</div>
        </div>
      </>
    );
  }

  if (!order) return null;

  const currentIdx = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <>
      <Navbar />
      <div className="h-20"></div>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Success Banner */}
          {isSuccess && (
            <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-5 mb-6 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h2 className="text-xl font-bold text-green-700">Order Successfully Placed!</h2>
              <p className="text-green-600 text-sm mt-1">आपका order confirm हो गया है। जल्द ही delivery होगी।</p>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <Link href="/samagri/orders" className="p-2 bg-white rounded-xl shadow hover:shadow-md transition">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-orange-800">Order Details</h1>
              <p className="text-sm text-gray-500">#{order._id.slice(-8).toUpperCase()}</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Tracking */}
            {!isCancelled && (
              <div className="bg-white rounded-2xl shadow-md p-6 border border-orange-100">
                <h3 className="font-bold text-gray-800 mb-5">📍 Order Tracking</h3>
                <div className="relative">
                  {TRACKING_STEPS.map((step, i) => {
                    const Icon = step.icon;
                    const isDone = i <= currentIdx;
                    const isCurrent = i === currentIdx;
                    const time = i === 0 ? order.createdAt : (order.trackingInfo as any)[step.timeKey];
                    return (
                      <div key={step.key} className="flex gap-4 mb-4 last:mb-0">
                        <div className="flex flex-col items-center">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isDone ? (isCurrent ? 'bg-orange-600 text-white ring-4 ring-orange-200' : 'bg-green-500 text-white') : 'bg-gray-200 text-gray-400'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {i < TRACKING_STEPS.length - 1 && (
                            <div className={`w-0.5 h-8 mt-1 ${i < currentIdx ? 'bg-green-400' : 'bg-gray-200'}`} />
                          )}
                        </div>
                        <div className="pt-1.5">
                          <p className={`font-semibold text-sm ${isDone ? 'text-gray-800' : 'text-gray-400'}`}>{step.label}</p>
                          {time && <p className="text-xs text-gray-400">{new Date(time).toLocaleString('en-IN')}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cancelled */}
            {isCancelled && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
                <div className="flex items-center gap-3 text-red-700">
                  <XCircle className="w-6 h-6" />
                  <div>
                    <p className="font-bold">Order Cancelled</p>
                    {order.cancellationReason && <p className="text-sm">{order.cancellationReason}</p>}
                    {order.trackingInfo.cancelledAt && <p className="text-xs text-red-500">{new Date(order.trackingInfo.cancelledAt).toLocaleString('en-IN')}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Items */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-orange-100">
              <h3 className="font-bold text-gray-800 mb-4">🛒 Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" /> : <span className="text-xl">🪔</span>}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">×{item.quantity} · ₹{item.price} each</p>
                    </div>
                    <p className="font-bold text-gray-800">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 space-y-1 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
                <div className="flex justify-between text-gray-600"><span>Delivery</span><span>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</span></div>
                <div className="flex justify-between font-bold text-base text-gray-800 pt-1 border-t"><span>Total</span><span className="text-orange-700">₹{order.totalAmount}</span></div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-orange-100">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-600" /> Delivery Address</h3>
              <p className="font-medium text-gray-800">{order.deliveryAddress.name}</p>
              <p className="text-gray-600 text-sm">{order.deliveryAddress.phone}</p>
              <p className="text-gray-600 text-sm">{order.deliveryAddress.address}</p>
              <p className="text-gray-600 text-sm">{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
            </div>

            {/* Pooja Details */}
            {(order.poojaType || order.poojaDate || order.specialInstructions) && (
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-200">
                <h3 className="font-bold text-orange-800 mb-3">🙏 Pooja Details</h3>
                {order.poojaType && <p className="text-sm text-gray-700"><span className="font-medium">Pooja:</span> {order.poojaType}</p>}
                {order.poojaDate && <p className="text-sm text-gray-700"><span className="font-medium">Date:</span> {new Date(order.poojaDate).toLocaleDateString('en-IN')}</p>}
                {order.specialInstructions && <p className="text-sm text-gray-700"><span className="font-medium">Instructions:</span> {order.specialInstructions}</p>}
              </div>
            )}

            {/* Payment */}
            <div className="bg-white rounded-2xl shadow-md p-5 border border-orange-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">Payment</p>
                  <p className="text-sm text-gray-500 capitalize">{order.payment.method || 'COD'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.payment.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {order.payment.status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                </span>
              </div>
            </div>

            {/* Cancel Button */}
            {['pending', 'confirmed'].includes(order.status) && (
              <button onClick={cancelOrder} disabled={cancelling}
                className="w-full py-3 border-2 border-red-300 text-red-600 rounded-xl font-bold hover:bg-red-50 transition disabled:opacity-50">
                {cancelling ? 'Cancelling...' : '❌ Order Cancel करें'}
              </button>
            )}

            <Link href="/samagri" className="block text-center text-orange-600 font-semibold hover:text-orange-800 transition py-2">
              ← और सामग्री खरीदें
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-6xl">📦</div></div>}>
      <OrderDetailContent id={params.id} />
    </Suspense>
  );
}
