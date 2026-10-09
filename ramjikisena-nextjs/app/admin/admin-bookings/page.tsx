'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  Calendar, Phone, MapPin, User, Clock, CheckCircle2,
  XCircle, AlertCircle, RefreshCw, Search, DollarSign, Filter
} from 'lucide-react';

interface BookingItem {
  _id: string;
  user?: {
    name: string;
    contact?: string;
    email?: string;
    username?: string;
  };
  pandit?: {
    name: string;
    contact?: { phone?: string };
    location?: { city?: string };
    photo?: string;
  };
  poojaType: string;
  date: string;
  time?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  totalAmount?: number;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  specialInstructions?: string;
  contactPhone?: string;
  createdAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0
  });

  useEffect(() => {
    fetchBookings();
  }, [activeFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const q = activeFilter !== 'all' ? `?status=${activeFilter}` : '';
      const res = await api.get(`/api/admin/bookings${q}`);
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await api.put(`/api/admin/bookings/${id}/status`, { status });
      const data = await res.json();
      if (data.success) {
        setBookings(prev =>
          prev.map(b => (b._id === id ? { ...b, status: status as any } : b))
        );
        fetchBookings();
      }
    } catch (err) {
      console.error('Update booking status error:', err);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      b.poojaType?.toLowerCase().includes(s) ||
      b.user?.name?.toLowerCase().includes(s) ||
      b.pandit?.name?.toLowerCase().includes(s) ||
      b.location?.city?.toLowerCase().includes(s)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-700">पुष्टि (Confirmed)</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">सम्पन्न (Completed)</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-700">रद्द (Cancelled)</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 animate-pulse">प्रतीक्षारत (Pending)</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-orange-100 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">पूजा बुकिंग्स (Bookings Management)</h1>
            <p className="text-xs text-slate-500 font-medium">यजमानों द्वारा पंडित जी की पूजा बुकिंग व स्थिति नियंत्रण</p>
          </div>
        </div>

        <button
          onClick={fetchBookings}
          className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-all self-end sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-black uppercase text-slate-500">कुल बुकिंग्स</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{stats.total || bookings.length}</p>
        </div>
        <div className="bg-amber-50 p-5 rounded-3xl border border-amber-200 shadow-sm">
          <p className="text-xs font-black uppercase text-amber-700">प्रतीक्षारत (Pending)</p>
          <p className="text-3xl font-black text-amber-800 mt-2">{stats.pending}</p>
        </div>
        <div className="bg-blue-50 p-5 rounded-3xl border border-blue-200 shadow-sm">
          <p className="text-xs font-black uppercase text-blue-700">पुष्ट (Confirmed)</p>
          <p className="text-3xl font-black text-blue-800 mt-2">{stats.confirmed}</p>
        </div>
        <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-200 shadow-sm">
          <p className="text-xs font-black uppercase text-emerald-700">सम्पन्न (Completed)</p>
          <p className="text-3xl font-black text-emerald-800 mt-2">{stats.completed}</p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-3xl border border-orange-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100/80 rounded-2xl">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-black capitalize transition-all ${
                activeFilter === tab
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'all' ? 'सभी' : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="पूजा, भक्त, पंडित या शहर खोजें..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
          />
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-orange-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-sm font-bold text-slate-500">बुकिंग्स लोड हो रही हैं...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-orange-100">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-base font-black text-slate-700">कोई बुकिंग नहीं मिली</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(b => (
            <div
              key={b._id}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900">{b.poojaType}</h3>
                  {getStatusBadge(b.status)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-600">
                  <div>
                    <span className="font-bold text-slate-400">यजमान (User):</span>{' '}
                    <span className="font-bold text-slate-900">{b.user?.name || 'अतिथि'}</span> ({b.user?.contact || b.contactPhone || '-'})
                  </div>
                  <div>
                    <span className="font-bold text-slate-400">पंडित जी:</span>{' '}
                    <span className="font-bold text-orange-700">{b.pandit?.name || 'अनिर्दिष्ट'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400">तिथि / समय:</span>{' '}
                    <span className="font-bold text-slate-900">{new Date(b.date).toLocaleDateString('hi-IN')} {b.time ? `(${b.time})` : ''}</span>
                  </div>
                </div>

                {b.location?.city && (
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{b.location.address ? `${b.location.address}, ` : ''}{b.location.city}, {b.location.state}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-bold">दक्षिणा / शुल्क</p>
                  <p className="text-lg font-black text-emerald-700">₹{b.totalAmount || b.price}</p>
                </div>

                {/* Status Changer */}
                <select
                  value={b.status}
                  onChange={(e) => handleUpdateStatus(b._id, e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-800 focus:outline-none"
                >
                  <option value="pending">प्रतीक्षारत (Pending)</option>
                  <option value="confirmed">पुष्ट (Confirmed)</option>
                  <option value="completed">सम्पन्न (Completed)</option>
                  <option value="cancelled">रद्द (Cancelled)</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
