'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  Sparkles, Phone, Mail, MapPin, Star, Calendar, Trash2, Pencil,
  Plus, X, CheckCircle2, Clock, ShieldCheck, ShieldAlert,
  Search, Flame, AlertCircle, RefreshCw, User, Award, Check, ExternalLink
} from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';

interface Pandit {
  _id: string;
  name: string;
  username?: string;
  photo?: string;
  photos?: string[];
  contact: {
    phone: string;
    email?: string;
    whatsapp?: string;
  };
  location: {
    address?: string;
    city: string;
    state: string;
    pincode?: string;
  };
  experience: number;
  specialization: string[];
  languages: string[];
  about?: string;
  isVerified: boolean;
  isActive: boolean;
  averageRating?: number;
  totalBookings?: number;
  completedBookings?: number;
  createdAt: string;
}

export default function AdminPanditsPage() {
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'verified' | 'inactive'>('all');
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    active: 0
  });

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingPandit, setEditingPandit] = useState<Pandit | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phone: '',
    email: '',
    city: '',
    state: 'Uttar Pradesh',
    experience: 0,
    specialization: '',
    languages: 'Hindi, Sanskrit',
    photo: '',
    about: '',
    isVerified: true,
    isActive: true
  });

  useEffect(() => {
    fetchPandits();
  }, [activeTab]);

  const fetchPandits = async () => {
    setLoading(true);
    try {
      let queryParam = '';
      if (activeTab === 'pending') queryParam = '?verified=false';
      else if (activeTab === 'verified') queryParam = '?verified=true';
      else if (activeTab === 'inactive') queryParam = '?status=inactive';

      const response = await api.get(`/api/admin/pandits${queryParam}`);
      const data = await response.json();
      if (data.success) {
        setPandits(data.pandits || []);
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        showToast('error', data.message || 'पंडितों का डेटा लोड करने में समस्या आई');
      }
    } catch (error) {
      console.error('Error fetching pandits:', error);
      showToast('error', 'पंडितों का डेटा लोड करने में समस्या आई');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingPandit(null);
    setFormData({
      name: '',
      username: '',
      phone: '',
      email: '',
      city: '',
      state: 'Uttar Pradesh',
      experience: 0,
      specialization: '',
      languages: 'Hindi, Sanskrit',
      photo: '',
      about: '',
      isVerified: true,
      isActive: true
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (pandit: Pandit) => {
    setEditingPandit(pandit);
    setFormData({
      name: pandit.name || '',
      username: pandit.username || '',
      phone: pandit.contact?.phone || '',
      email: pandit.contact?.email || '',
      city: pandit.location?.city || '',
      state: pandit.location?.state || 'Uttar Pradesh',
      experience: pandit.experience || 0,
      specialization: pandit.specialization ? pandit.specialization.join(', ') : '',
      languages: pandit.languages ? pandit.languages.join(', ') : 'Hindi, Sanskrit',
      photo: pandit.photo || '',
      about: pandit.about || '',
      isVerified: pandit.isVerified,
      isActive: pandit.isActive
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        username: formData.username,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        state: formData.state,
        experience: Number(formData.experience) || 0,
        specialization: formData.specialization,
        languages: formData.languages,
        photo: formData.photo,
        about: formData.about,
        isVerified: formData.isVerified,
        isActive: formData.isActive
      };

      let res;
      if (editingPandit) {
        res = await api.put(`/api/admin/pandits/${editingPandit._id}`, payload);
      } else {
        res = await api.post('/api/admin/pandits', payload);
      }

      const data = await res.json();
      if (data.success) {
        showToast('success', editingPandit ? 'पंडित विवरण सफलतापूर्वक अपडेट हुआ' : 'नया पंडित सफलतापूर्वक जोड़ा गया');
        setShowModal(false);
        fetchPandits();
      } else {
        showToast('error', data.message || 'त्रुटि हुई');
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      showToast('error', err.message || 'सहेजने में विफलता');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleVerify = async (id: string, currentStatus: boolean) => {
    try {
      const res = await api.put(`/api/admin/pandits/${id}/verify`);
      const data = await res.json();
      if (data.success) {
        showToast('success', data.message);
        setPandits(prev =>
          prev.map(p => (p._id === id ? { ...p, isVerified: !currentStatus } : p))
        );
        setStats(prev => ({
          ...prev,
          verified: currentStatus ? prev.verified - 1 : prev.verified + 1,
          pending: currentStatus ? prev.pending + 1 : prev.pending - 1
        }));
      }
    } catch (error) {
      console.error('Verify toggle error:', error);
      showToast('error', 'सत्यापन स्थिति बदलने में त्रुटि');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await api.put(`/api/admin/pandits/${id}/status`);
      const data = await res.json();
      if (data.success) {
        showToast('success', data.message);
        setPandits(prev =>
          prev.map(p => (p._id === id ? { ...p, isActive: !currentStatus } : p))
        );
        setStats(prev => ({
          ...prev,
          active: currentStatus ? prev.active - 1 : prev.active + 1
        }));
      }
    } catch (error) {
      console.error('Status toggle error:', error);
      showToast('error', 'सक्रिय स्थिति बदलने में त्रुटि');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`क्या आप सच में "${name}" का रिकॉर्ड हटाना चाहते हैं?`)) return;
    try {
      const res = await api.delete(`/api/admin/pandits/${id}`);
      const data = await res.json();
      if (data.success) {
        showToast('success', data.message);
        setPandits(prev => prev.filter(p => p._id !== id));
        fetchPandits();
      } else {
        showToast('error', data.message || 'हटाने में समस्या आई');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showToast('error', 'हटाने में विफलता');
    }
  };

  // Filter pandits based on search
  const filteredPandits = pandits.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = p.name?.toLowerCase().includes(q);
    const phoneMatch = p.contact?.phone?.includes(q);
    const cityMatch = p.location?.city?.toLowerCase().includes(q);
    const specMatch = p.specialization?.some(s => s.toLowerCase().includes(q));
    return nameMatch || phoneMatch || cityMatch || specMatch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {statusMessage && (
        <div
          className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-sm font-bold text-white transition-all transform animate-bounce ${
            statusMessage.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-orange-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">पंडित प्रबंधन (Pandits Management)</h1>
              <p className="text-xs text-slate-500 font-medium">पंजीकृत पंडित, यजमान बुकिंग्स एवं सत्यापन नियंत्रण</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchPandits}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-all"
            title="रिफ्रेश करें"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>नया पंडित जोड़ें (+ Add Pandit)</span>
          </button>
        </div>
      </div>

      {/* Quick Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('all')}
          className={`p-5 rounded-3xl border cursor-pointer transition-all ${
            activeTab === 'all'
              ? 'bg-orange-50 border-orange-300 ring-2 ring-orange-500/20'
              : 'bg-white border-slate-100 hover:border-orange-200'
          }`}
        >
          <p className="text-xs font-black uppercase text-slate-500 tracking-wider">कुल पंडित (Total)</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{stats.total || pandits.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">सभी पंजीकृत पुरोहित</p>
        </div>

        <div
          onClick={() => setActiveTab('pending')}
          className={`p-5 rounded-3xl border cursor-pointer transition-all ${
            activeTab === 'pending'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20'
              : 'bg-white border-slate-100 hover:border-amber-200'
          }`}
        >
          <p className="text-xs font-black uppercase text-amber-600 tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> सत्यापन लंबित (Pending)
          </p>
          <p className="text-3xl font-black text-amber-700 mt-2">{stats.pending}</p>
          <p className="text-[11px] text-amber-600/70 mt-1">स्वीकृति की प्रतीक्षा में</p>
        </div>

        <div
          onClick={() => setActiveTab('verified')}
          className={`p-5 rounded-3xl border cursor-pointer transition-all ${
            activeTab === 'verified'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-100 hover:border-emerald-200'
          }`}
        >
          <p className="text-xs font-black uppercase text-emerald-600 tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> सत्यापित (Verified)
          </p>
          <p className="text-3xl font-black text-emerald-700 mt-2">{stats.verified}</p>
          <p className="text-[11px] text-emerald-600/70 mt-1">अधिकृत पंडित प्रोफाइल</p>
        </div>

        <div
          onClick={() => setActiveTab('inactive')}
          className={`p-5 rounded-3xl border cursor-pointer transition-all ${
            activeTab === 'inactive'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20'
              : 'bg-white border-slate-100 hover:border-rose-200'
          }`}
        >
          <p className="text-xs font-black uppercase text-rose-600 tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" /> निष्क्रिय (Inactive)
          </p>
          <p className="text-3xl font-black text-rose-700 mt-2">
            {(stats.total - stats.active) > 0 ? stats.total - stats.active : 0}
          </p>
          <p className="text-[11px] text-rose-600/70 mt-1">अस्थायी रूप से बंद</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-orange-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100/80 rounded-2xl">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            सभी ({stats.total || pandits.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'pending' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:text-amber-700'
            }`}
          >
            लंबित ({stats.pending})
          </button>
          <button
            onClick={() => setActiveTab('verified')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'verified' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            सत्यापित ({stats.verified})
          </button>
          <button
            onClick={() => setActiveTab('inactive')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'inactive' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            निष्क्रिय
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="नाम, शहर, फोन या विद्या खोजें..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
          />
        </div>
      </div>

      {/* Main Pandits List */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-orange-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-sm font-bold text-slate-500">पंडित सूची लोड हो रही है...</p>
        </div>
      ) : filteredPandits.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-orange-100 shadow-sm">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-800">कोई पंडित नहीं मिला</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {searchQuery
              ? `"${searchQuery}" से मेल खाता कोई रिकॉर्ड नहीं मिला।`
              : 'इस श्रेणी में अभी तक कोई पंडित पंजीकृत नहीं है।'}
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-5 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs rounded-2xl shadow-md"
          >
            + पहला पंडित जोड़ें
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPandits.map((pandit) => (
            <div
              key={pandit._id}
              className={`bg-white rounded-3xl border transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden flex flex-col justify-between ${
                !pandit.isVerified ? 'border-amber-200 ring-1 ring-amber-400/20' : 'border-slate-100'
              }`}
            >
              {/* Card Header & Profile */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {pandit.photo ? (
                      <img
                        src={pandit.photo}
                        alt={pandit.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-100 shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 text-white flex items-center justify-center text-xl font-black shadow-sm">
                        {pandit.name[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-black text-slate-900 leading-tight flex items-center gap-1.5">
                        {pandit.name}
                        {pandit.isVerified && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 flex-shrink-0" />
                        )}
                      </h3>
                      {pandit.username && (
                        <p className="text-[11px] text-slate-400 font-bold">@{pandit.username}</p>
                      )}
                      <p className="text-xs text-orange-700 font-bold flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-orange-500" />
                        <span>{pandit.location?.city || 'शहर उपलब्ध नहीं'}, {pandit.location?.state}</span>
                      </p>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        pandit.isVerified
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                      }`}
                    >
                      {pandit.isVerified ? 'सत्यापित' : 'लंबित सत्यापन'}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        pandit.isActive ? 'bg-slate-100 text-slate-700' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {pandit.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-1.5 py-2.5 px-3 bg-slate-50 rounded-2xl text-xs font-semibold text-slate-700 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-orange-500" /> फोन:
                    </span>
                    <a href={`tel:${pandit.contact?.phone}`} className="font-bold text-slate-900 hover:text-orange-600">
                      {pandit.contact?.phone}
                    </a>
                  </div>
                  {pandit.contact?.email && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Mail className="w-3.5 h-3.5 text-orange-500" /> ईमेल:
                      </span>
                      <span className="font-medium text-slate-700 truncate max-w-[160px]">
                        {pandit.contact.email}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Award className="w-3.5 h-3.5 text-orange-500" /> अनुभव:
                    </span>
                    <span className="font-black text-slate-900">{pandit.experience || 0} वर्ष</span>
                  </div>
                </div>

                {/* Specialization Tags */}
                {pandit.specialization && pandit.specialization.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">विशेषज्ञता</p>
                    <div className="flex flex-wrap gap-1">
                      {pandit.specialization.slice(0, 3).map((spec, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-orange-50 text-orange-800 border border-orange-200"
                        >
                          {spec}
                        </span>
                      ))}
                      {pandit.specialization.length > 3 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-lg bg-slate-100 text-slate-500">
                          +{pandit.specialization.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1 text-amber-600 font-black">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{pandit.averageRating?.toFixed(1) || '0.0'}</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-500">
                    बुकिंग्स: <span className="text-slate-900 font-black">{pandit.totalBookings || 0}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {new Date(pandit.createdAt).toLocaleDateString('hi-IN')}
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                {/* Verify Button */}
                <button
                  onClick={() => handleToggleVerify(pandit._id, pandit.isVerified)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                    pandit.isVerified
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-amber-500 text-white hover:bg-amber-600 shadow-md'
                  }`}
                  title={pandit.isVerified ? 'सत्यापन वापस लें' : 'सत्यापित (Approve) करें'}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{pandit.isVerified ? 'सत्यापित ✓' : 'Approve करें'}</span>
                </button>

                {/* Status Toggle Button */}
                <button
                  onClick={() => handleToggleActive(pandit._id, pandit.isActive)}
                  className={`py-2 px-3 rounded-xl text-xs font-black transition-all ${
                    pandit.isActive
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                  title={pandit.isActive ? 'निष्क्रिय करें' : 'सक्रिय करें'}
                >
                  {pandit.isActive ? 'Pause' : 'Activate'}
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => handleOpenEditModal(pandit)}
                  className="p-2 bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl border border-slate-200 transition-all"
                  title="संपादित करें"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(pandit._id, pandit.name)}
                  className="p-2 bg-white text-red-600 hover:bg-red-50 rounded-xl border border-slate-200 transition-all"
                  title="हटाएं"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Pandit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-orange-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {editingPandit ? 'पंडित विवरण संपादित करें (Edit Pandit)' : 'नया पंडित जोड़ें (Add New Pandit)'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">पंडित प्रोफ़ाइल व संपर्क विवरण दर्ज करें</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                    पंडित जी का नाम *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="उदा. आचार्य श्री रामानुज जी"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                    मोबाइल नंबर *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-अंकीय मोबाइल नंबर"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                    यूज़रनेम (Username)
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="उदा. pandit_ramesh (Optional)"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                    ईमेल (Email)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="panditji@gmail.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                    शहर (City) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="उदा. अयोध्या, वाराणसी, दिल्ली"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                    राज्य (State)
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="उदा. Uttar Pradesh"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                    अनुभव (Experience in Years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
                    placeholder="उदा. 10"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                    भाषाएं (Languages, comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.languages}
                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                    placeholder="Hindi, Sanskrit, English"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                  विशेषज्ञता (Specialization, comma separated)
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="Vedic Rituals, Griha Pravesh, Vivah Sanskar, Satyanarayan Katha, Rudrabhishek"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>

              {/* Photo Image Uploader */}
              <div>
                <ImageUploader
                  value={formData.photo}
                  onChange={(url) => setFormData({ ...formData, photo: url as string })}
                  folder="pandits"
                  label="पंडित जी की फोटो (Profile Photo)"
                />
              </div>

              {/* About */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                  परिचय व विवरण (About / Bio)
                </label>
                <textarea
                  rows={3}
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  placeholder="पंडित जी के कुल, विद्या एवं पूजन विधि का संक्षिप्त विवरण..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-black text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span>सत्यापित करें (Verified Profile)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-black text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span>सक्रिय प्रोफ़ाइल (Active Status)</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black shadow-lg disabled:opacity-50"
                >
                  {submitting ? 'सहेज रहे हैं...' : editingPandit ? 'अपडेट करें (Save)' : 'पंडित जोड़ें (Create)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
