'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Compass, Search, Edit3, ArrowUpDown, Check, AlertCircle,
  Loader2, RefreshCw, Eye, Sparkles, ExternalLink, Image as ImageIcon,
  Save, X
} from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';

export interface ServiceItem {
  _id: string;
  serviceId: string;
  category: 'purohit' | 'satsang' | 'darshan' | 'samagri' | 'blogs';
  title: string; // Hindi name
  subtitle: string; // English name
  desc: string;
  href: string;
  img: string;
  imgPosition?: string;
  emoji: string;
  popular: string;
  features: string[];
  ctaText: string;
  stats: string;
  order: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form state for editing
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    img: '',
    order: 0,
    desc: '',
    popular: '',
    ctaText: '',
    active: true,
    imgPosition: 'object-top',
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const getAuthHeaders = (): HeadersInit => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/admin/services`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.services)) {
        setServices(data.services);
      } else {
        showToast(data.message || 'सेवाएं लोड करने में विफल', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'नेटवर्क त्रुटि', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      subtitle: service.subtitle || '',
      img: service.img || '',
      order: service.order || 0,
      desc: service.desc || '',
      popular: service.popular || '',
      ctaText: service.ctaText || 'प्रवेश करें',
      active: service.active !== false,
      imgPosition: service.imgPosition || 'object-top',
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    if (!formData.title.trim()) {
      showToast('कृपया हिन्दी नाम दर्ज करें', 'error');
      return;
    }
    if (!formData.subtitle.trim()) {
      showToast('कृपया अंग्रेज़ी नाम दर्ज करें', 'error');
      return;
    }
    if (!formData.img.trim()) {
      showToast('कृपया फोटो URL दर्ज करें या फोटो अपलोड करें', 'error');
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`${API_URL}/api/admin/services/${editingService._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        showToast('सेवा सफलतापूर्वक अपडेट की गई!');
        setEditingService(null);
        fetchServices();
      } else {
        showToast(data.message || 'अपडेट करने में विफल', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'नेटवर्क त्रुटि', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Quick Sequence Change (+1 / -1)
  const handleQuickOrderChange = async (service: ServiceItem, newOrder: number) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/services/${service._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ order: newOrder }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`क्रम #${newOrder} सेट किया गया`);
        fetchServices();
      }
    } catch (err: any) {
      showToast('क्रम बदलने में त्रुटि', 'error');
    }
  };

  const filtered = services.filter((s) => {
    const q = search.toLowerCase().trim();
    return (
      s.title.toLowerCase().includes(q) ||
      s.subtitle.toLowerCase().includes(q) ||
      s.serviceId.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl text-sm font-bold animate-in fade-in slide-in-from-top-2 ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5 text-amber-200" />
              <span>Dynamic Services Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              सेवा प्रबंधन (वेबसाइट सेवाएं)
            </h1>
            <p className="text-sm text-orange-100 mt-1 max-w-2xl">
              वेबसाइट पर दिखने वाली समस्त सेवाओं के <strong>हिन्दी नाम, अंग्रेज़ी नाम, फोटो</strong> और <strong>क्रम संख्या (Sequence)</strong> को यहीं से सम्पादित करें।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchServices}
              className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>रिफ्रेश</span>
            </button>
          </div>
        </div>

        {/* Informative Notice Badge */}
        <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2 text-xs text-amber-100">
          <span className="text-base">ℹ️</span>
          <span>
            <strong>नोट:</strong> आप केवल मौजूदा सेवाओं को सम्पादित (Edit) कर सकते हैं। नई सेवा जोड़ना या हटाना सुरक्षित रूप से प्रतिबंधित है।
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="हिन्दी या अंग्रेज़ी नाम से खोजें..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
          <ArrowUpDown className="w-3.5 h-3.5 text-orange-600" />
          <span>कुल सेवाएं: <strong className="text-slate-900">{filtered.length}</strong> (क्रम संख्या अनुसार क्रमबद्ध)</span>
        </div>
      </div>

      {/* Services Table / Grid */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 flex flex-col items-center justify-center text-slate-400 shadow-sm border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600 mb-3" />
          <p className="text-sm font-bold text-slate-600">सेवाएं लोड हो रही हैं...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-500 shadow-sm border border-slate-200">
          <p className="text-sm font-bold">कोई सेवा नहीं मिली</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 text-center w-20">क्रम (Order)</th>
                  <th className="py-3.5 px-4 w-24">फोटो</th>
                  <th className="py-3.5 px-4">हिन्दी नाम</th>
                  <th className="py-3.5 px-4">अंग्रेज़ी नाम</th>
                  <th className="py-3.5 px-4">कैटेगरी / लिंक</th>
                  <th className="py-3.5 px-4 text-center">स्थिति</th>
                  <th className="py-3.5 px-4 text-right">एक्शन</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((service) => (
                  <tr key={service._id} className="hover:bg-orange-50/40 transition-colors">
                    {/* Sequence Order */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-1">
                        <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-800 font-black text-xs flex items-center justify-center shadow-xs">
                          #{service.order}
                        </span>
                      </div>
                    </td>

                    {/* Photo Preview */}
                    <td className="py-4 px-4">
                      <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
                        <Image
                          src={service.img}
                          alt={service.title}
                          fill
                          className={`object-cover ${service.imgPosition || 'object-top'}`}
                        />
                      </div>
                    </td>

                    {/* Hindi Title */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{service.emoji}</span>
                        <div>
                          <p className="font-bold text-slate-900">{service.title}</p>
                          {service.popular && (
                            <span className="text-[10px] text-orange-600 font-medium">
                              {service.popular}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* English Subtitle */}
                    <td className="py-4 px-4">
                      <p className="font-semibold text-slate-700">{service.subtitle}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{service.serviceId}</p>
                    </td>

                    {/* Category & Link */}
                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase mb-1">
                        {service.category}
                      </span>
                      <a
                        href={service.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-orange-600 hover:underline flex items-center gap-1 font-mono"
                      >
                        <span>{service.href}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </td>

                    {/* Active Status */}
                    <td className="py-4 px-4 text-center">
                      {service.active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          सक्रिय
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold">
                          छिपा हुआ
                        </span>
                      )}
                    </td>

                    {/* Action: Edit Button */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => openEditModal(service)}
                        className="px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 ml-auto cursor-pointer active:scale-95 border border-orange-200"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>सम्पादित करें</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingService(null);
          }}
        >
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 my-auto flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header Bar (Pinned Top) */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center text-xl shadow-xs">
                  {editingService.emoji || '✨'}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    सेवा सम्पादित करें (Edit Service)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ID: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-orange-700 font-mono">{editingService.serviceId}</code>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="flex flex-col flex-1 overflow-hidden">
              {/* Modal Body (Scrollable inside) */}
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
                {/* Row 1: Hindi & English Titles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      हिन्दी नाम (Hindi Name) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="उदा. वैदिक पंडित जी बुकिंग"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      अंग्रेज़ी नाम (English Name) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="उदा. Vedic Purohits & Karmakand"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Row 2: Sequence Order & Popular Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      क्रम संख्या (Sequence / Order #) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min={1}
                        max={999}
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white font-black"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                        क्रम संख्या
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      यह संख्या तय करती है कि वेबसाइट पर यह सेवा किस स्थान पर पहले दिखेगी।
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      पॉपुलर टैग (Popular Badge Text)
                    </label>
                    <input
                      type="text"
                      value={formData.popular}
                      onChange={(e) => setFormData({ ...formData, popular: e.target.value })}
                      placeholder="उदा. 🔥 सर्वाधिक लोकप्रिय"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Row 3: Photo Upload and Live Preview */}
                <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-orange-900 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-orange-600" />
                      <span>सर्विस फोटो (Service Photo) *</span>
                    </label>
                    <span className="text-[11px] text-orange-700 font-bold">
                      Upload new or paste URL
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    {/* Photo Preview Box */}
                    <div className="relative w-32 h-24 rounded-2xl overflow-hidden bg-slate-200 border-2 border-orange-300 shadow-md shrink-0">
                      {formData.img ? (
                        <Image
                          src={formData.img}
                          alt="Preview"
                          fill
                          className={`object-cover ${formData.imgPosition || 'object-top'}`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                          No image
                        </div>
                      )}
                    </div>

                    {/* S3 ImageUploader */}
                    <div className="flex-1 w-full">
                      <ImageUploader
                        label="नई फोटो चुनें व अपलोड करें (S3 Storage)"
                        value={formData.img}
                        onChange={(url) => setFormData({ ...formData, img: url as string })}
                        folder="services"
                        multiple={false}
                      />

                      {/* Direct URL input fallback */}
                      <div className="mt-2">
                        <input
                          type="text"
                          value={formData.img}
                          onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                          placeholder="या डायरेक्ट फोटो URL दर्ज करें (उदा. /home/pandit.jpg)"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 4: Description */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    विवरण (Description)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                    placeholder="सेवा का संक्षिप्त विवरण..."
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                </div>

                {/* Row 5: CTA Text and Active Visibility */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      बटन टेक्स्ट (CTA Button Text)
                    </label>
                    <input
                      type="text"
                      value={formData.ctaText}
                      onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                      placeholder="उदा. पंडित जी चुनें"
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4 sm:pt-0">
                    <input
                      type="checkbox"
                      id="activeToggle"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500 cursor-pointer"
                    />
                    <label htmlFor="activeToggle" className="text-xs font-bold text-slate-800 cursor-pointer">
                      वेबसाइट पर सक्रिय व दृश्यमान रखें (Active)
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Footer (Pinned Bottom) */}
              <div className="p-4 sm:p-6 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 bg-slate-50/90">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer"
                >
                  रद्द करें
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>सहेज रहे हैं...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>परिवर्तन सहेजें (Save Changes)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
