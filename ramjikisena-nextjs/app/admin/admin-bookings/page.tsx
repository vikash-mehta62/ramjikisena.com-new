'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import AdminPagination from '@/components/AdminPagination';
import {
  Calendar, Phone, MapPin, User, Clock, CheckCircle2,
  XCircle, AlertCircle, RefreshCw, Search, DollarSign,
  Filter, Eye, X, Sparkles, Shield, PackageCheck
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
  poojaDate?: string;
  date?: string;
  poojaTime?: string;
  time?: string;
  duration?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
  price: number;
  totalAmount?: number;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    landmark?: string;
  };
  requirements?: {
    samagriNeeded?: boolean;
    numberOfPeople?: number;
    specialInstructions?: string;
    language?: string;
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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });

  // Modal State
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<BookingItem | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/admin/bookings?page=${page}&limit=${limit}`;
      if (activeFilter !== 'all') url += `&status=${activeFilter}`;
      if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

      const res = await api.get(url);
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
          setTotalCount(data.pagination.total || 0);
        }
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, activeFilter, search]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await api.put(`/api/admin/bookings/${id}/status`, { status });
      const data = await res.json();
      if (data.success) {
        setBookings(prev =>
          prev.map(b => (b._id === id ? { ...b, status: status as any } : b))
        );
        if (selectedBookingDetails && selectedBookingDetails._id === id) {
          setSelectedBookingDetails({ ...selectedBookingDetails, status: status as any });
        }
        fetchBookings();
      }
    } catch (err) {
      console.error('Update booking status error:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700">पुष्ट (Confirmed)</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">सम्पन्न (Completed)</span>;
      case 'cancelled':
      case 'rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700">रद्द (Cancelled)</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 animate-pulse">प्रतीक्षारत (Pending)</span>;
    }
  };

  const getBookingDate = (b: BookingItem) => {
    const raw = b.poojaDate || b.date;
    if (!raw) return 'उपलब्ध नहीं';
    return new Date(raw).toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Premium Header Banner */}
      <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-bold flex-shrink-0">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-orange-300 text-[11px] font-black uppercase tracking-wider mb-1">
                Pooja Bookings & Services
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">पूजा बुकिंग्स प्रबंधन (Bookings)</h1>
              <p className="text-sm text-slate-300 mt-0.5">यजमानों द्वारा पंडित जी की पूजा बुकिंग, स्थिति व दक्षिणा नियंत्रण</p>
            </div>
          </div>

          <button
            onClick={() => fetchBookings()}
            disabled={loading}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            रिफ्रेश
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => { setActiveFilter('all'); setPage(1); }}
          className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'all' ? 'border-slate-900 shadow-md ring-2 ring-slate-900/10' : 'border-slate-100 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">कुल बुकिंग्स</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{stats.total.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 font-medium">सभी ऑर्डर्स</span>
        </div>

        <div
          onClick={() => { setActiveFilter('pending'); setPage(1); }}
          className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'pending' ? 'border-amber-500 shadow-md ring-2 ring-amber-500/10' : 'border-slate-100 shadow-sm hover:shadow-md'
          } ${stats.pending > 0 ? 'bg-amber-50/30' : ''}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800">प्रतीक्षारत (Pending)</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-black text-amber-700">{stats.pending.toLocaleString()}</p>
            {stats.pending > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black animate-pulse">
                एक्शन आवश्यक
              </span>
            )}
          </div>
          <span className="text-[11px] text-amber-700/80 font-medium">पुष्टि की प्रतीक्षा</span>
        </div>

        <div
          onClick={() => { setActiveFilter('confirmed'); setPage(1); }}
          className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'confirmed' ? 'border-blue-600 shadow-md ring-2 ring-blue-600/10' : 'border-slate-100 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">पुष्ट (Confirmed)</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-700">{stats.confirmed.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 font-medium">स्वीकृत पूजा बुकिंग</span>
        </div>

        <div
          onClick={() => { setActiveFilter('completed'); setPage(1); }}
          className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'completed' ? 'border-emerald-600 shadow-md ring-2 ring-emerald-600/10' : 'border-slate-100 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">सम्पन्न (Completed)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700">{stats.completed.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 font-medium">सफलतापूर्वक पूर्ण</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100/80 rounded-xl">
          {[
            { id: 'all', label: 'सभी' },
            { id: 'pending', label: 'प्रतीक्षारत' },
            { id: 'confirmed', label: 'पुष्ट' },
            { id: 'completed', label: 'सम्पन्न' },
            { id: 'cancelled', label: 'रद्द' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveFilter(tab.id as any); setPage(1); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                activeFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="पूजा, यजमान, शहर खोजें..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-5">
        {loading ? (
          <div className="p-16 text-center text-slate-400 font-medium">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-2" />
            <p className="text-xs">बुकिंग्स लोड हो रही हैं...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-700">कोई बुकिंग नहीं मिली</p>
            <p className="text-xs text-slate-400 mt-1">फ़िल्टर या खोज बदल कर पुनः प्रयास करें।</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {bookings.map(b => (
              <div
                key={b._id}
                className="bg-slate-50/70 hover:bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3
                      onClick={() => setSelectedBookingDetails(b)}
                      className="text-base font-black text-slate-900 hover:text-orange-600 cursor-pointer"
                    >
                      {b.poojaType}
                    </h3>
                    {getStatusBadge(b.status)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                    <div>
                      <span className="font-bold text-slate-400 block text-[10px]">यजमान (Client):</span>
                      <span className="font-bold text-slate-900">{b.user?.name || 'अतिथि'}</span>
                      <span className="text-slate-400 block text-[11px] font-mono">
                        {b.user?.contact || b.contactPhone || '—'}
                      </span>
                    </div>

                    <div>
                      <span className="font-bold text-slate-400 block text-[10px]">पंडित जी (Pandit):</span>
                      <span className="font-bold text-orange-700">{b.pandit?.name || 'अनिर्दिष्ट'}</span>
                      <span className="text-slate-400 block text-[11px]">
                        {b.pandit?.location?.city || ''}
                      </span>
                    </div>

                    <div>
                      <span className="font-bold text-slate-400 block text-[10px]">पूजा तिथि व समय:</span>
                      <span className="font-bold text-slate-900">{getBookingDate(b)}</span>
                      <span className="text-slate-400 block text-[11px]">
                        {b.poojaTime || b.time || 'समय अनिर्दिष्ट'}
                      </span>
                    </div>
                  </div>

                  {b.location?.city && (
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{b.location.address ? `${b.location.address}, ` : ''}{b.location.city}, {b.location.state}</span>
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">दक्षिणा / शुल्क</p>
                    <p className="text-base sm:text-lg font-black text-emerald-700">₹{b.totalAmount || b.price}</p>
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={() => setSelectedBookingDetails(b)}
                    className="p-2 bg-white text-slate-700 hover:bg-slate-900 hover:text-white rounded-xl border border-slate-200 transition-all text-xs font-bold flex items-center gap-1 shadow-sm"
                    title="पूर्ण विवरण देखें"
                  >
                    <Eye className="w-4 h-4" />
                    <span>विवरण</span>
                  </button>

                  {/* Status Changer */}
                  <select
                    value={b.status}
                    onChange={(e) => handleUpdateStatus(b._id, e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
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

        {/* Server-Side Pagination */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <AdminPagination
            page={page}
            totalPages={totalPages}
            total={totalCount}
            limit={limit}
            onPageChange={(p) => setPage(p)}
            onLimitChange={(l) => { setLimit(l); setPage(1); }}
            itemName="बुकिंग"
          />
        </div>
      </div>

      {/* Booking Detail Inspection Modal */}
      {selectedBookingDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col my-8 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-900 p-6 text-white relative flex-shrink-0">
              <button
                onClick={() => setSelectedBookingDetails(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div>
                <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest block mb-1">
                  पूजा बुकिंग विवरण (Booking Details)
                </span>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black text-white">{selectedBookingDetails.poojaType}</h3>
                  {getStatusBadge(selectedBookingDetails.status)}
                </div>
                <p className="text-xs text-slate-300 mt-1 font-mono">
                  ID: {selectedBookingDetails._id}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              {/* Pricing & Timing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">कुल दक्षिणा</span>
                  <span className="text-base font-black text-emerald-700">₹{selectedBookingDetails.totalAmount || selectedBookingDetails.price}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">पूजा दिनांक</span>
                  <span className="text-xs font-black text-slate-800">{getBookingDate(selectedBookingDetails)}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">समय / अवधि</span>
                  <span className="text-xs font-black text-slate-800">{selectedBookingDetails.poojaTime || selectedBookingDetails.time || 'उपलब्ध नहीं'}</span>
                </div>
              </div>

              {/* Yajman & Pandit Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
                  <span className="font-bold text-slate-900 block text-xs">यजमान (User) विवरण</span>
                  <p><strong className="text-slate-800">{selectedBookingDetails.user?.name || 'अतिथि'}</strong></p>
                  <p className="flex items-center gap-1.5 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedBookingDetails.user?.contact || selectedBookingDetails.contactPhone || 'उपलब्ध नहीं'}</span>
                  </p>
                  {selectedBookingDetails.user?.email && (
                    <p className="text-slate-500">{selectedBookingDetails.user.email}</p>
                  )}
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
                  <span className="font-bold text-slate-900 block text-xs">पंडित (Pandit) विवरण</span>
                  <p><strong className="text-orange-700">{selectedBookingDetails.pandit?.name || 'अनिर्दिष्ट'}</strong></p>
                  {selectedBookingDetails.pandit?.contact?.phone && (
                    <p className="flex items-center gap-1.5 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedBookingDetails.pandit.contact.phone}</span>
                    </p>
                  )}
                  {selectedBookingDetails.pandit?.location?.city && (
                    <p className="text-slate-500">{selectedBookingDetails.pandit.location.city}</p>
                  )}
                </div>
              </div>

              {/* Location Address */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 block text-xs">पूजा स्थल का पता (Location)</span>
                <p className="text-slate-700 leading-relaxed">
                  {selectedBookingDetails.location?.address || ''}{' '}
                  {selectedBookingDetails.location?.city ? `${selectedBookingDetails.location.city}, ` : ''}
                  {selectedBookingDetails.location?.state || ''}{' '}
                  {selectedBookingDetails.location?.pincode ? `(${selectedBookingDetails.location.pincode})` : ''}
                </p>
                {selectedBookingDetails.location?.landmark && (
                  <p className="text-slate-500 text-[11px]">
                    लैंडमार्क: {selectedBookingDetails.location.landmark}
                  </p>
                )}
              </div>

              {/* Requirements & Instructions */}
              {(selectedBookingDetails.requirements || selectedBookingDetails.specialInstructions) && (
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 space-y-1.5 text-amber-950">
                  <span className="font-bold text-amber-900 block text-xs">विशेष निर्देश एवं सामग्री</span>
                  {selectedBookingDetails.requirements?.samagriNeeded !== undefined && (
                    <p className="text-xs">
                      पूजन सामग्री आवश्यक: <strong>{selectedBookingDetails.requirements.samagriNeeded ? 'हाँ (Yes)' : 'नहीं (No)'}</strong>
                    </p>
                  )}
                  {selectedBookingDetails.requirements?.numberOfPeople && (
                    <p className="text-xs">
                      यजमान परिवार सदस्य संख्या: <strong>{selectedBookingDetails.requirements.numberOfPeople}</strong>
                    </p>
                  )}
                  {(selectedBookingDetails.requirements?.specialInstructions || selectedBookingDetails.specialInstructions) && (
                    <p className="text-xs text-amber-900/90 pt-1">
                      {selectedBookingDetails.requirements?.specialInstructions || selectedBookingDetails.specialInstructions}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">स्थिति बदलें:</span>
                <select
                  value={selectedBookingDetails.status}
                  onChange={(e) => handleUpdateStatus(selectedBookingDetails._id, e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
                >
                  <option value="pending">प्रतीक्षारत (Pending)</option>
                  <option value="confirmed">पुष्ट (Confirmed)</option>
                  <option value="completed">सम्पन्न (Completed)</option>
                  <option value="cancelled">रद्द (Cancelled)</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedBookingDetails(null)}
                className="px-5 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition-colors"
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
