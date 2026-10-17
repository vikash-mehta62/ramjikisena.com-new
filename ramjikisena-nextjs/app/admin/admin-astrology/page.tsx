'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Star,
  Calendar,
  Trash2,
  Pencil,
  X,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Search,
  AlertCircle,
  RefreshCw,
  User,
  Award,
  Check,
  ExternalLink,
  MessageCircle,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import AdminPagination from '@/components/AdminPagination';

interface Astrologer {
  _id: string;
  name: string;
  username: string;
  photo?: string;
  tagline: string;
  about: string;
  contact: {
    phone: string;
    email?: string;
    whatsapp?: string;
  };
  location: {
    city: string;
    state: string;
    address?: string;
  };
  experience: number;
  specialties: string[];
  languages: string[];
  fee: number;
  averageRating: number;
  totalConsultations: number;
  isVerified: boolean;
  isActive: boolean;
  availabilityStatus: 'online' | 'busy' | 'offline';
  createdAt: string;
}

interface Consultation {
  _id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  consultationType: string;
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
  status: string;
  astrologer?: {
    _id: string;
    name: string;
    contact?: { phone: string };
    location?: { city: string };
    fee?: number;
  };
  createdAt: string;
}

export default function AdminAstrologyPage() {
  const [mainTab, setMainTab] = useState<'astrologers' | 'consultations'>('astrologers');
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'verified' | 'inactive'>('all');
  const [astroPage, setAstroPage] = useState(1);
  const [astroLimit, setAstroLimit] = useState(10);
  const [astroTotalPages, setAstroTotalPages] = useState(1);
  const [astroTotalCount, setAstroTotalCount] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    active: 0
  });

  // Modal State
  const [selectedAstroDetails, setSelectedAstroDetails] = useState<Astrologer | null>(null);
  const [selectedConsultationDetails, setSelectedConsultationDetails] = useState<Consultation | null>(null);

  // Edit Modal State
  const [editingAstro, setEditingAstro] = useState<Astrologer | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    tagline: '',
    about: '',
    fee: 501,
    experience: 5,
    city: '',
    state: '',
    specialties: '',
    languages: '',
    isVerified: true,
    isActive: true
  });
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (mainTab === 'astrologers') {
      fetchAstrologers();
    } else {
      fetchConsultations();
    }
  }, [mainTab, activeTab, astroPage, astroLimit]);

  const showToast = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const fetchAstrologers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(astroPage));
      params.set('limit', String(astroLimit));
      if (activeTab === 'pending') params.set('verified', 'false');
      else if (activeTab === 'verified') params.set('verified', 'true');
      else if (activeTab === 'inactive') params.set('status', 'inactive');

      const response = await api.get(`/api/admin/astrologers?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setAstrologers(data.astrologers || []);
        if (data.pagination) {
          setAstroTotalPages(data.pagination.totalPages || 1);
          setAstroTotalCount(data.pagination.total || 0);
        }
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        showToast('error', data.message || 'डेटा लोड करने में समस्या आई');
      }
    } catch (error) {
      console.error('Error fetching astrologers:', error);
      showToast('error', 'सर्वर से संपर्क नहीं हो पाया');
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/astrology-consultations');
      const data = await response.json();
      if (data.success) {
        setConsultations(data.consultations || []);
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerify = async (astro: Astrologer) => {
    try {
      const res = await api.put(`/api/admin/astrologers/${astro._id}/verify`);
      const data = await res.json();
      if (data.success) {
        showToast('success', data.message);
        fetchAstrologers();
      } else {
        showToast('error', data.message || 'सत्यापन स्थिति नहीं बदली जा सकी');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'त्रुटि हुई');
    }
  };

  const handleToggleStatus = async (astro: Astrologer) => {
    try {
      const res = await api.put(`/api/admin/astrologers/${astro._id}/status`);
      const data = await res.json();
      if (data.success) {
        showToast('success', data.message);
        fetchAstrologers();
      } else {
        showToast('error', data.message || 'स्थिति नहीं बदली जा सकी');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'त्रुटि हुई');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`क्या आप निश्चित रूप से ${name} का रिकॉर्ड हटाना चाहते हैं?`)) return;
    try {
      const res = await api.delete(`/api/admin/astrologers/${id}`);
      const data = await res.json();
      if (data.success) {
        showToast('success', data.message);
        fetchAstrologers();
      } else {
        showToast('error', data.message || 'हटाया नहीं जा सका');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'त्रुटि हुई');
    }
  };

  const openEditModal = (astro: Astrologer) => {
    setEditingAstro(astro);
    setEditForm({
      name: astro.name || '',
      tagline: astro.tagline || '',
      about: astro.about || '',
      fee: astro.fee || 501,
      experience: astro.experience || 0,
      city: astro.location?.city || '',
      state: astro.location?.state || '',
      specialties: astro.specialties ? astro.specialties.join(', ') : '',
      languages: astro.languages ? astro.languages.join(', ') : 'Hindi',
      isVerified: astro.isVerified,
      isActive: astro.isActive
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAstro) return;
    setSubmitting(true);
    try {
      const res = await api.put(`/api/admin/astrologers/${editingAstro._id}`, editForm);
      const data = await res.json();
      if (data.success) {
        showToast('success', 'ज्योतिषी विवरण सफलतापूर्वक अपडेट हुआ!');
        setEditingAstro(null);
        fetchAstrologers();
      } else {
        showToast('error', data.message || 'अपडेट नहीं हो पाया');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'सर्वर त्रुटि');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAstrologers = astrologers.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.name?.toLowerCase().includes(q) ||
      a.contact?.phone?.includes(q) ||
      a.location?.city?.toLowerCase().includes(q) ||
      a.specialties?.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Toast */}
      {statusMessage && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold transition-all border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-900/30 text-2xl">
            🔮
          </div>
          <div>
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-0.5">
              Admin Control Panel
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
              ज्योतिषाचार्य एवं टैरो प्रबंधन
            </h1>
            <p className="text-white/50 text-xs font-bold mt-0.5">
              पंजीकृत विशेषज्ञों की सूची, सत्यापन (Verification) एवं परामर्श अनुरोध
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/astrology"
            target="_blank"
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/15 flex items-center gap-1.5 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>लाइव डायरेक्टरी</span>
          </Link>
        </div>
      </div>

      {/* Main Mode Switcher */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMainTab('astrologers')}
          className={`px-5 py-2.5 rounded-2xl font-black text-xs transition ${
            mainTab === 'astrologers'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
          }`}
        >
          🔮 ज्योतिषी एवं टैरो रीडर्स ({stats.total})
        </button>
        <button
          onClick={() => setMainTab('consultations')}
          className={`px-5 py-2.5 rounded-2xl font-black text-xs transition ${
            mainTab === 'consultations'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
          }`}
        >
          📋 सभी परामर्श अनुरोध ({consultations.length})
        </button>
      </div>

      {mainTab === 'astrologers' ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                कुल ज्योतिषी
              </span>
              <p className="text-2xl md:text-3xl font-black text-slate-900">{stats.total}</p>
              <span className="text-[11px] text-slate-500 font-semibold mt-1 block">पंजीकृत विशेषज्ञ</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">
                प्रमाणित (Verified)
              </span>
              <p className="text-2xl md:text-3xl font-black text-emerald-600">{stats.verified}</p>
              <span className="text-[11px] text-emerald-700/80 font-semibold mt-1 block">सत्यापित प्रोफाइल</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-sm">
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block mb-1">
                सत्यापन लंबित
              </span>
              <p className="text-2xl md:text-3xl font-black text-amber-600">{stats.pending}</p>
              <span className="text-[11px] text-amber-700/80 font-semibold mt-1 block">रिव्यू की आवश्यकता</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-blue-100 shadow-sm">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-1">
                सक्रिय (Active)
              </span>
              <p className="text-2xl md:text-3xl font-black text-blue-600">{stats.active}</p>
              <span className="text-[11px] text-blue-700/80 font-semibold mt-1 block">डायरेक्टरी में दृश्य</span>
            </div>
          </div>

          {/* Search & Sub-tabs */}
          <div className="bg-white rounded-3xl p-4 border border-amber-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {[
                { id: 'all', label: 'सभी' },
                { id: 'verified', label: 'प्रमाणित' },
                { id: 'pending', label: 'लंबित' },
                { id: 'inactive', label: 'निष्क्रिय' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="नाम, फोन या शहर खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Astrologers List / Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20 bg-white rounded-3xl border border-amber-100">
              <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredAstrologers.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-amber-100 shadow-sm">
              <div className="text-4xl mb-2">🔮</div>
              <h3 className="font-black text-slate-800 text-base mb-1">कोई ज्योतिषी नहीं मिले</h3>
              <p className="text-xs text-slate-500">कृपया फिल्टर या सर्च बदलें।</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[750px]">
                  <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    <tr>
                      <th className="p-4">विशेषज्ञ</th>
                      <th className="p-4">संपर्क & शहर</th>
                      <th className="p-4">विधाएं (Specialties)</th>
                      <th className="p-4">शुल्क / सत्र</th>
                      <th className="p-4">परामर्श / रेटिंग</th>
                      <th className="p-4">सत्यापन</th>
                      <th className="p-4 text-right">कार्रवाई</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {filteredAstrologers.map((astro) => (
                      <tr key={astro._id} className="hover:bg-slate-50/60 transition">
                        {/* Name & Photo */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-amber-100 text-amber-800 flex items-center justify-center font-black flex-shrink-0">
                              {astro.photo ? (
                                <img src={astro.photo} alt={astro.name} className="w-full h-full object-cover" />
                              ) : (
                                <span>🔮</span>
                              )}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-sm">{astro.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold truncate max-w-[140px]">
                                {astro.tagline || `@${astro.username}`}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Contact & City */}
                        <td className="p-4">
                          <p className="font-bold text-slate-800">{astro.contact?.phone}</p>
                          <p className="text-[11px] text-slate-500">
                            {astro.location?.city}, {astro.location?.state}
                          </p>
                        </td>

                        {/* Specialties */}
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {astro.specialties?.slice(0, 2).map((s, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200"
                              >
                                {s}
                              </span>
                            ))}
                            {(astro.specialties?.length || 0) > 2 && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500 font-bold">
                                +{(astro.specialties?.length || 0) - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Fee */}
                        <td className="p-4">
                          <span className="font-black text-amber-800 text-sm">₹{astro.fee || 501}</span>
                          <span className="text-[10px] text-slate-400 block">{astro.experience || 0} वर्ष अनु.</span>
                        </td>

                        {/* Rating & Consultations */}
                        <td className="p-4">
                          <div className="flex items-center gap-1 font-bold text-slate-800">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            <span>{astro.averageRating?.toFixed(1) || '5.0'}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block font-semibold">
                            {astro.totalConsultations || 0} परामर्श
                          </span>
                        </td>

                        {/* Verified Switch */}
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleVerify(astro)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition flex items-center gap-1 ${
                              astro.isVerified
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            }`}
                          >
                            {astro.isVerified ? (
                              <>
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                <span>Verified</span>
                              </>
                            ) : (
                              <>
                                <ShieldAlert className="w-3 h-3 text-amber-600" />
                                <span>Unverified</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleStatus(astro)}
                              className={`p-1.5 rounded-lg border text-xs font-bold transition ${
                                astro.isActive
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-slate-100 text-slate-500 border-slate-200'
                              }`}
                              title={astro.isActive ? 'Active (Click to Deactivate)' : 'Inactive (Click to Activate)'}
                            >
                              {astro.isActive ? 'Active' : 'Inactive'}
                            </button>

                            <button
                              onClick={() => setSelectedAstroDetails(astro)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 transition"
                              title="पूर्ण विवरण देखें"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => openEditModal(astro)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 transition"
                              title="Edit Details"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDelete(astro._id, astro.name)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 transition"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Server-Side Pagination */}
            <AdminPagination
              page={astroPage}
              totalPages={astroTotalPages}
              total={astroTotalCount}
              limit={astroLimit}
              onPageChange={(p) => setAstroPage(p)}
              onLimitChange={(l) => { setAstroLimit(l); setAstroPage(1); }}
              itemName="ज्योतिषी"
            />
          </>
        )}
        </>
      ) : (
        /* Tab 2: Consultations List */
        <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-slate-900 text-base">
              सभी परामर्श अनुरोध (Consultation Bookings)
            </h3>
            <span className="text-xs font-bold bg-amber-50 text-amber-800 px-3 py-1 rounded-full">
              {consultations.length} अनुरोध प्राप्त
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : consultations.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              अभी तक कोई परामर्श अनुरोध नहीं मिला है।
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[750px]">
                <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <tr>
                    <th className="p-3">यजमान (Client)</th>
                    <th className="p-3">ज्योतिषी (Astrologer)</th>
                    <th className="p-3">विषय & विवरण</th>
                    <th className="p-3">दिनांक & स्लॉट</th>
                    <th className="p-3">जन्म विवरण (Kundli)</th>
                    <th className="p-3">स्थिति (Status)</th>
                    <th className="p-3 text-right">विवरण</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {consultations.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/60 transition">
                      <td className="p-3">
                        <p className="font-black text-slate-900">{item.clientName}</p>
                        <a href={`tel:${item.clientPhone}`} className="text-[11px] text-amber-700 hover:underline">
                          {item.clientPhone}
                        </a>
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-slate-800">{item.astrologer?.name || 'Astrologer'}</p>
                        <span className="text-[10px] text-slate-400">{item.consultationType} • ₹{item.fee}</span>
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-slate-800">{item.topic}</p>
                        {item.question && (
                          <p className="text-[10px] text-slate-400 truncate max-w-xs">{item.question}</p>
                        )}
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-slate-800">
                          {new Date(item.consultationDate).toLocaleDateString('hi-IN')}
                        </p>
                        <p className="text-[10px] text-slate-400">{item.consultationTimeSlot}</p>
                      </td>
                      <td className="p-3 text-[10px]">
                        {item.birthDetails?.dob ? (
                          <div className="space-y-0.5">
                            <span className="block font-bold">DOB: {item.birthDetails.dob}</span>
                            <span className="block text-slate-400">TOB: {item.birthDetails.tob || '-'}</span>
                            <span className="block text-slate-400">POB: {item.birthDetails.pob || '-'}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            item.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : item.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : item.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedConsultationDetails(item)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 font-bold text-[11px] transition inline-flex items-center gap-1"
                          title="परामर्श विवरण देखें"
                        >
                          <Eye className="w-3 h-3" />
                          <span>देखें</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingAstro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl my-auto border border-amber-100">
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 shrink-0 bg-white">
              <h3 className="font-black text-slate-900 text-base">
                ज्योतिषी विवरण संपादित करें (Edit Astrologer)
              </h3>
              <button onClick={() => setEditingAstro(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="p-5 sm:p-6 space-y-3.5 text-xs overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">नाम</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">शुल्क (₹ प्रति सत्र)</label>
                  <input
                    type="number"
                    required
                    value={editForm.fee}
                    onChange={(e) => setEditForm({ ...editForm, fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">शहर</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">राज्य</label>
                  <input
                    type="text"
                    value={editForm.state}
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">संक्षिप्त स्लोगन (Tagline)</label>
                <input
                  type="text"
                  value={editForm.tagline}
                  onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">विशेषज्ञताएं (Comma separated)</label>
                <input
                  type="text"
                  value={editForm.specialties}
                  onChange={(e) => setEditForm({ ...editForm, specialties: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">परिचय (Bio)</label>
                <textarea
                  rows={3}
                  value={editForm.about}
                  onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editForm.isVerified}
                    onChange={(e) => setEditForm({ ...editForm, isVerified: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600"
                  />
                  <span>प्रमाणित (Verified)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editForm.isActive}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600"
                  />
                  <span>सक्रिय (Active in Directory)</span>
                </label>
              </div>

              </div>

              {/* Pinned Footer */}
              <div className="p-4 sm:p-5 flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingAstro(null)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black shadow-md transition cursor-pointer"
                >
                  {submitting ? 'सहेज रहे हैं...' : 'सुरक्षित करें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Astrologer Detail Inspection Modal */}
      {selectedAstroDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col my-auto animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-900 p-6 text-white relative flex-shrink-0">
              <button
                onClick={() => setSelectedAstroDetails(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-4">
                {selectedAstroDetails.photo ? (
                  <img
                    src={selectedAstroDetails.photo}
                    alt={selectedAstroDetails.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/50 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl font-black flex-shrink-0">
                    {selectedAstroDetails.name?.charAt(0) || 'A'}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    {selectedAstroDetails.name}
                    {selectedAstroDetails.isVerified && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </h3>
                  <p className="text-xs text-amber-300 font-bold mt-0.5">{selectedAstroDetails.tagline || 'ज्योतिषाचार्य'}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        selectedAstroDetails.isVerified
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {selectedAstroDetails.isVerified ? 'सत्यापित (Verified)' : 'लंबित (Pending)'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        selectedAstroDetails.isActive
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {selectedAstroDetails.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">परामर्श शुल्क</span>
                  <span className="text-base font-black text-amber-700">₹{selectedAstroDetails.fee || 501}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">अनुभव</span>
                  <span className="text-base font-black text-slate-800">{selectedAstroDetails.experience || 0} वर्ष</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">रेटिंग</span>
                  <div className="flex items-center justify-center gap-1 text-base font-black text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{selectedAstroDetails.averageRating?.toFixed(1) || '5.0'}</span>
                  </div>
                </div>
              </div>

              {/* Contact & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <span className="font-bold text-slate-800 block text-xs">संपर्क सूत्र</span>
                  <div className="space-y-1.5 text-slate-600">
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                      <span>फ़ोन: <strong className="text-slate-800">{selectedAstroDetails.contact?.phone}</strong></span>
                    </p>
                    {selectedAstroDetails.contact?.whatsapp && (
                      <p className="flex items-center gap-2">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>व्हाट्सएप: {selectedAstroDetails.contact.whatsapp}</span>
                      </p>
                    )}
                    {selectedAstroDetails.contact?.email && (
                      <p className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-amber-600" />
                        <span>ईमेल: {selectedAstroDetails.contact.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <span className="font-bold text-slate-800 block text-xs">स्थान</span>
                  <div className="space-y-1 text-slate-600">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>शहर: <strong className="text-slate-800">{selectedAstroDetails.location?.city || 'उपलब्ध नहीं'}</strong></span>
                    </p>
                    <p className="text-slate-500 pl-5.5">राज्य: {selectedAstroDetails.location?.state || 'उपलब्ध नहीं'}</p>
                    {selectedAstroDetails.location?.address && (
                      <p className="text-slate-500 pl-5.5">पता: {selectedAstroDetails.location.address}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
                  विशेषज्ञता (Specialties)
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAstroDetails.specialties?.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl font-bold text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
                  भाषाएँ (Languages)
                </h4>
                <p className="text-slate-700 font-medium">
                  {selectedAstroDetails.languages?.join(', ') || 'Hindi'}
                </p>
              </div>

              {/* Bio */}
              {selectedAstroDetails.about && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="font-bold text-slate-800 block mb-1">विस्तृत परिचय (About)</span>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {selectedAstroDetails.about}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
              <button
                onClick={() => {
                  const a = selectedAstroDetails;
                  setSelectedAstroDetails(null);
                  openEditModal(a);
                }}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" /> संपादित करें (Edit)
              </button>

              <button
                onClick={() => setSelectedAstroDetails(null)}
                className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Consultation Detail Inspection Modal */}
      {selectedConsultationDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col my-auto animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-900 p-6 text-white relative flex-shrink-0">
              <button
                onClick={() => setSelectedConsultationDetails(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div>
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-1">
                  परामर्श अनुरोध विवरण (Consultation Details)
                </span>
                <h3 className="text-xl font-black text-white">{selectedConsultationDetails.clientName}</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  ज्योतिषी: <strong className="text-white">{selectedConsultationDetails.astrologer?.name || 'विशेषज्ञ'}</strong> • ₹{selectedConsultationDetails.fee}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              {/* Client & Booking Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">फ़ोन नंबर</span>
                  <a href={`tel:${selectedConsultationDetails.clientPhone}`} className="font-bold text-amber-800 hover:underline">
                    {selectedConsultationDetails.clientPhone}
                  </a>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">परामर्श का प्रकार</span>
                  <span className="font-bold text-slate-800">{selectedConsultationDetails.consultationType}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">दिनांक</span>
                  <span className="font-bold text-slate-800">
                    {new Date(selectedConsultationDetails.consultationDate).toLocaleDateString('hi-IN')}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">समय स्लॉट</span>
                  <span className="font-bold text-slate-800">{selectedConsultationDetails.consultationTimeSlot}</span>
                </div>
              </div>

              {/* Topic & Question */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 space-y-1">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">विषय / समस्या</span>
                <p className="font-black text-amber-950 text-sm">{selectedConsultationDetails.topic}</p>
                {selectedConsultationDetails.question && (
                  <p className="text-xs text-amber-900 pt-1 leading-relaxed">
                    {selectedConsultationDetails.question}
                  </p>
                )}
              </div>

              {/* Birth Details (Kundli) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <span className="font-bold text-slate-900 block text-xs">कुंडली जन्म विवरण (Birth Details)</span>
                {selectedConsultationDetails.birthDetails?.dob ? (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">जन्म तिथि (DOB)</span>
                      <span className="font-bold text-slate-800">{selectedConsultationDetails.birthDetails.dob}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">जन्म समय (TOB)</span>
                      <span className="font-bold text-slate-800">{selectedConsultationDetails.birthDetails.tob || '—'}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">जन्म स्थान (POB)</span>
                      <span className="font-bold text-slate-800">{selectedConsultationDetails.birthDetails.pob || '—'}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 italic">जन्म विवरण उपलब्ध नहीं है</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end flex-shrink-0">
              <button
                onClick={() => setSelectedConsultationDetails(null)}
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
