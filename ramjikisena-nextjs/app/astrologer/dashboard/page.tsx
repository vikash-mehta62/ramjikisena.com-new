'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  FileText,
  Save,
  CircleDot
} from 'lucide-react';
import {
  getAstrologerToken,
  getAstrologerInfo,
  clearAstrologerAuth,
  astrologerFetch
} from '@/lib/astrologerAuth';

interface Consultation {
  _id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  consultationType: 'Call' | 'WhatsApp' | 'In-Person';
  serviceTitle: string;
  fee: number;
  consultationDate: string;
  consultationTimeSlot: string;
  birthDetails?: {
    dob?: string;
    tob?: string;
    pob?: string;
  };
  topic: string;
  question?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  astrologerNotes?: string;
  createdAt: string;
}

interface DashboardStats {
  totalConsultations: number;
  pendingConsultations: number;
  completedConsultations: number;
  averageRating: number;
  estimatedEarnings: number;
  availabilityStatus: 'online' | 'busy' | 'offline';
  isVerified: boolean;
}

export default function AstrologerDashboardPage() {
  const router = useRouter();
  const [astrologer, setAstrologer] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'requests' | 'profile'>('requests');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal / Notes edit
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Profile Edit Form State
  const [profileForm, setProfileForm] = useState({
    tagline: '',
    about: '',
    fee: 501,
    availabilityStatus: 'online'
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const token = getAstrologerToken();
    const info = getAstrologerInfo();

    if (!token || !info) {
      router.push('/astrologer/login');
      return;
    }

    setAstrologer(info);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';

      // 1. Fetch Stats
      const statsRes = await astrologerFetch(`${apiUrl}/api/astrology-dashboard/stats`);
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
        setProfileForm(prev => ({
          ...prev,
          availabilityStatus: statsData.stats.availabilityStatus || 'online'
        }));
      }

      // 2. Fetch Consultations
      const consultRes = await astrologerFetch(`${apiUrl}/api/astrology-dashboard/consultations`);
      const consultData = await consultRes.json();
      if (consultData.success) {
        setConsultations(consultData.consultations || []);
      }

      // 3. Fetch Full Profile
      const profileRes = await astrologerFetch(`${apiUrl}/api/astrology-dashboard/profile`);
      const profileData = await profileRes.json();
      if (profileData.success && profileData.astrologer) {
        const astro = profileData.astrologer;
        setProfileForm({
          tagline: astro.tagline || '',
          about: astro.about || '',
          fee: astro.fee || 501,
          availabilityStatus: astro.availabilityStatus || 'online'
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string, notes?: string) => {
    setUpdatingStatus(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
      const payload: any = { status: newStatus };
      if (notes !== undefined) payload.astrologerNotes = notes;

      const res = await astrologerFetch(`${apiUrl}/api/astrology-dashboard/consultations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || 'स्थिति अपडेट हो गई!');
        setSelectedConsultation(null);
        fetchDashboardData();
      } else {
        alert(data.message || 'त्रुटि हुई');
      }
    } catch (err) {
      console.error('Error updating consultation status:', err);
      alert('अपडेट नहीं हो पाया।');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
      const res = await astrologerFetch(`${apiUrl}/api/astrology-dashboard/profile`, {
        method: 'PUT',
        body: JSON.stringify(profileForm)
      });
      const data = await res.json();
      if (data.success) {
        alert('प्रोफाइल सफलतापूर्वक अपडेट हो गई!');
        fetchDashboardData();
      } else {
        alert(data.message || 'प्रोफाइल अपडेट नहीं हो पाई');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('नेटवर्क त्रुटि');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleToggleOnline = async () => {
    const nextStatus = profileForm.availabilityStatus === 'online' ? 'offline' : 'online';
    setProfileForm(prev => ({ ...prev, availabilityStatus: nextStatus }));

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
      await astrologerFetch(`${apiUrl}/api/astrology-dashboard/profile`, {
        method: 'PUT',
        body: JSON.stringify({ availabilityStatus: nextStatus })
      });
      fetchDashboardData();
    } catch (err) {
      console.error('Error toggling availability:', err);
    }
  };

  const handleLogout = () => {
    clearAstrologerAuth();
    router.push('/astrologer/login');
  };

  const filteredConsultations = consultations.filter(c => {
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-bold text-amber-900 text-sm">डैशबोर्ड लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  const isOnline = profileForm.availabilityStatus === 'online';

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 antialiased">
      {/* Top Navbar Header */}
      <header className="sticky top-0 z-50 bg-[#160803]/95 backdrop-blur-md border-b border-amber-900/30 text-white py-3.5 px-4 sm:px-8">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-md"
                style={{ background: 'linear-gradient(135deg, #f9e07a 0%, #d4920a 60%, #b8760a 100%)', color: '#3a0f00' }}>
                🔮
              </div>
              <div>
                <p className="text-sm font-black leading-tight">राम जी की सेना</p>
                <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">ज्योतिषी पोर्टल</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Online Toggle Pill */}
            <button
              onClick={handleToggleOnline}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition border shadow-sm ${
                isOnline
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-700'
              }`}
            >
              <CircleDot className={`w-3.5 h-3.5 ${isOnline ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
              <span>{isOnline ? 'उपलब्ध (Online)' : 'ऑफलाइन (Offline)'}</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-white/80 hover:text-red-300 transition text-xs font-bold flex items-center gap-1.5"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">लॉगआउट</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-4 sm:px-8 py-8 max-w-7xl">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-[#1f0902] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden mb-8 border border-amber-500/20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block mb-1">
                जय श्री राम • ज्योतिषी डैशबोर्ड
              </span>
              <h1 className="text-2xl sm:text-3xl font-black">
                स्वागत है, {astrologer?.name || 'ज्योतिषी जी'}
              </h1>
              <p className="text-xs text-amber-100/70 mt-1">
                {astrologer?.city ? `${astrologer.city}, ${astrologer.state || ''}` : 'भारत'} •{' '}
                {astrologer?.specialties?.join(', ') || 'Vedic Astrology'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/astrology/${astrologer?._id}`}
                target="_blank"
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition flex items-center gap-1.5"
              >
                <span>पब्लिक प्रोफाइल देखें</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Total Consultations */}
          <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              कुल परामर्श (Total)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats?.totalConsultations || 0}
            </div>
            <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
              सर्वकालिक सत्र
            </span>
          </div>

          {/* Pending Requests */}
          <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block mb-1">
              लंबित अनुरोध (Pending)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-600">
              {stats?.pendingConsultations || 0}
            </div>
            <span className="text-[11px] text-amber-700/80 font-semibold mt-1 block">
              उत्तर देना शेष है
            </span>
          </div>

          {/* Completed */}
          <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block mb-1">
              पूर्ण परामर्श (Completed)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">
              {stats?.completedConsultations || 0}
            </div>
            <span className="text-[11px] text-emerald-700/80 font-semibold mt-1 block">
              सफलतापूर्वक संपन्न
            </span>
          </div>

          {/* Estimated Earnings */}
          <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block mb-1">
              अनुमानित आय (Earnings)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-700">
              ₹{stats?.estimatedEarnings || 0}
            </div>
            <span className="text-[11px] text-slate-500 font-semibold mt-1 block flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 inline" />{' '}
              रेटिंग: {stats?.averageRating?.toFixed(1) || '5.0'}
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition ${
              activeTab === 'requests'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-800 border border-slate-200'
            }`}
          >
            📋 परामर्श अनुरोध ({consultations.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition ${
              activeTab === 'profile'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-800 border border-slate-200'
            }`}
          >
            ⚙️ प्रोफाइल एवं शुल्क सेटिंग्स
          </button>
        </div>

        {/* Tab 1: Consultation Requests */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {/* Sub Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
              {[
                { id: 'all', label: 'सभी (All)' },
                { id: 'pending', label: 'लंबित (Pending)' },
                { id: 'confirmed', label: 'पुष्ट (Confirmed)' },
                { id: 'completed', label: 'पूर्ण (Completed)' },
                { id: 'cancelled', label: 'रद्द (Cancelled)' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    statusFilter === f.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* List of Consultations */}
            {filteredConsultations.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-amber-100 shadow-sm">
                <div className="text-4xl mb-2">🔮</div>
                <h3 className="font-black text-slate-800 text-base mb-1">कोई परामर्श अनुरोध नहीं मिला</h3>
                <p className="text-xs text-slate-500">
                  {statusFilter !== 'all' ? 'इस श्रेणी में कोई अनुरोध नहीं है।' : 'नए अनुरोध यहाँ दिखाई देंगे।'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredConsultations.map((item) => {
                  const hasBirthDetails = item.birthDetails && (item.birthDetails.dob || item.birthDetails.pob);

                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-3xl p-5 border border-amber-100/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div>
                        {/* Status + Mode Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              item.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : item.status === 'confirmed'
                                ? 'bg-blue-100 text-blue-800'
                                : item.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            ● {item.status}
                          </span>

                          <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                            {item.consultationType === 'Call' ? '📞 फोन कॉल' : item.consultationType === 'WhatsApp' ? '💬 व्हाट्सएप' : '🏛️ प्रत्यक्ष'}
                          </span>
                        </div>

                        {/* Client Name & Topic */}
                        <h3 className="text-base font-black text-slate-900 leading-tight">
                          {item.clientName}
                        </h3>
                        <p className="text-xs text-amber-800 font-bold mt-0.5">
                          विषय: {item.topic}
                        </p>

                        {/* Date & Time Slot */}
                        <div className="flex items-center gap-3 text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-1 font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-amber-600" />
                            <span>{new Date(item.consultationDate).toLocaleDateString('hi-IN')}</span>
                          </div>
                          <div className="flex items-center gap-1 font-semibold">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>{item.consultationTimeSlot}</span>
                          </div>
                        </div>

                        {/* Birth Details (Kundli info) */}
                        {hasBirthDetails && (
                          <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/50 text-[11px] text-amber-950 space-y-0.5">
                            <span className="font-bold block text-[10px] uppercase text-amber-800">
                              📜 जन्म विवरण (Kundli Data):
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 font-semibold">
                              <div>तिथि: {item.birthDetails?.dob || '-'}</div>
                              <div>समय: {item.birthDetails?.tob || '-'}</div>
                              <div>स्थान: {item.birthDetails?.pob || '-'}</div>
                            </div>
                          </div>
                        )}

                        {/* Client Question / Problem */}
                        {item.question && (
                          <div className="mt-2 text-xs text-slate-600 bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                            <span className="font-bold text-slate-700">प्रश्न: </span>
                            {item.question}
                          </div>
                        )}

                        {/* Astro Notes if any */}
                        {item.astrologerNotes && (
                          <div className="mt-2 text-[11px] text-indigo-800 bg-indigo-50/80 p-2 rounded-lg border border-indigo-100">
                            <span className="font-bold">आपके नोट्स: </span>
                            {item.astrologerNotes}
                          </div>
                        )}
                      </div>

                      {/* Client Contact & Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        {/* Call & WhatsApp buttons */}
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${item.clientPhone}`}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 transition"
                          >
                            <Phone className="w-3.5 h-3.5 text-slate-600" />
                            <span>{item.clientPhone}</span>
                          </a>
                          <a
                            href={`https://wa.me/91${item.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`जय श्री राम! मैं ज्योतिषी ${astrologer?.name} बोल रहा हूँ, आपने ramjikisena.com पर परामर्श बुक किया था।`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
                            title="WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4 text-emerald-600" />
                          </a>
                        </div>

                        {/* Status Change Buttons */}
                        <div className="flex items-center gap-1.5">
                          {item.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(item._id, 'confirmed')}
                                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition"
                              >
                                स्वीकार करें
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(item._id, 'cancelled')}
                                className="px-2 py-1.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100 transition"
                              >
                                रद्द
                              </button>
                            </>
                          )}

                          {item.status === 'confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(item._id, 'completed')}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>पूर्ण करें</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedConsultation(item);
                              setNotesInput(item.astrologerNotes || '');
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-xs transition"
                            title="Add Consultation Notes"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 mb-1">प्रोफाइल एवं परामर्श सेटिंग्स</h2>
            <p className="text-xs text-slate-500 mb-6">यहाँ से आप अपना शुल्क, स्लोगन एवं परिचय विवरण अपडेट कर सकते हैं</p>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">संक्षिप्त स्लोगन (Tagline)</label>
                <input
                  type="text"
                  value={profileForm.tagline}
                  onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                  placeholder="उदा. वैदिक ज्योतिष एवं हस्तरेखा विशेषज्ञ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">परामर्श शुल्क (₹ प्रति 30 मिनट सत्र)</label>
                <input
                  type="number"
                  min="100"
                  value={profileForm.fee}
                  onChange={(e) => setProfileForm({ ...profileForm, fee: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">अपने बारे में विस्तृत परिचय (Bio)</label>
                <textarea
                  rows={4}
                  value={profileForm.about}
                  onChange={(e) => setProfileForm({ ...profileForm, about: e.target.value })}
                  placeholder="अपने अनुभव, ज्ञान एवं परामर्श शैली के बारे में विस्तार से बताएं..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingProfile ? 'सहेज रहे हैं...' : 'सेटिंग्स सहेजें (Save Changes)'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Notes Modal */}
      <AnimatePresence>
        {selectedConsultation && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-100"
            >
              <h3 className="text-base font-black text-slate-900 mb-1">
                परामर्श नोट्स जोड़ें
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                क्लाइंट: {selectedConsultation.clientName} ({selectedConsultation.topic})
              </p>

              <textarea
                rows={4}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="परामर्श के दौरान बताए गए उपाय, रत्न या भविष्यफल यहाँ नोट करें..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs mb-4"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedConsultation(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition"
                >
                  रद्द करें
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedConsultation._id, selectedConsultation.status, notesInput)}
                  disabled={updatingStatus}
                  className="px-5 py-2 rounded-xl bg-amber-600 text-white font-black text-xs hover:bg-amber-700 transition"
                >
                  {updatingStatus ? 'सहेज रहे हैं...' : 'नोट्स सुरक्षित करें'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
