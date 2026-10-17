'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Sparkles, Plus, Edit3, Trash2, ArrowUpDown, Check, AlertCircle,
  Loader2, RefreshCw, Eye, EyeOff, Save, X, ExternalLink, Play
} from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';

export interface HeroSlideItem {
  _id: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  badge: string;
  image: string;
  mobileImage?: string;
  textAlignment?: 'left' | 'center' | 'right';
  textColor?: string;
  showText?: boolean;
  showButtons?: boolean;
  button1Text: string;
  button1Link: string;
  button2Text: string;
  button2Link: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlideItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    tagline: '',
    description: '',
    badge: '🚩 Jai Shree Ram — Naam is the True Power',
    image: '',
    mobileImage: '',
    textAlignment: 'center' as 'left' | 'center' | 'right',
    textColor: '#2a1306',
    showText: true,
    showButtons: true,
    button1Text: 'Start Ram Naam Jaap',
    button1Link: '/#jaap',
    button2Text: 'Watch Video',
    button2Link: '',
    order: 1,
    isActive: true,
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

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/admin/hero-slides`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.slides)) {
        setSlides(data.slides);
      } else {
        showToast(data.message || 'स्लाइड्स लोड करने में विफल', 'error');
      }
    } catch (e: any) {
      showToast('सर्वर से संपर्क नहीं हो पाया: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const openCreateModal = () => {
    setIsNew(true);
    setFormData({
      title: 'Jai Shree Ram',
      subtitle: 'Naam is the True Power',
      tagline: 'Chant. Connect. Learn. Live with Bhagwan Ram.',
      description: 'Join millions of devotees and experience peace, positivity and happiness through Ram Naam in your daily life.',
      badge: '🚩 Jai Shree Ram — Naam is the True Power',
      image: '/images/hero-ayodhya-ramji-hd.webp',
      mobileImage: '',
      textAlignment: 'center',
      textColor: '#2a1306',
      showText: true,
      showButtons: true,
      button1Text: 'Start Ram Naam Jaap',
      button1Link: '/#jaap',
      button2Text: 'Watch Video',
      button2Link: '',
      order: slides.length + 1,
      isActive: true,
    });
    setEditingSlide({} as HeroSlideItem);
  };

  const openEditModal = (slide: HeroSlideItem) => {
    setIsNew(false);
    setEditingSlide(slide);
    setFormData({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      tagline: slide.tagline || '',
      description: slide.description || '',
      badge: slide.badge || '',
      image: slide.image || '',
      mobileImage: slide.mobileImage || '',
      textAlignment: (slide.textAlignment === 'left' || slide.textAlignment === 'right' || slide.textAlignment === 'center') ? slide.textAlignment : 'center',
      textColor: slide.textColor || '#2a1306',
      showText: slide.showText !== undefined ? Boolean(slide.showText) : true,
      showButtons: slide.showButtons !== undefined ? Boolean(slide.showButtons) : true,
      button1Text: slide.button1Text || 'Start Ram Naam Jaap',
      button1Link: slide.button1Link || '/#jaap',
      button2Text: slide.button2Text || 'Watch Video',
      button2Link: slide.button2Link || '',
      order: slide.order ?? 1,
      isActive: slide.isActive ?? true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('कृपया शीर्षक (Title) दर्ज करें', 'error');
      return;
    }
    if (!formData.image.trim()) {
      showToast('कृपया फोटो (Image URL/Upload) प्रदान करें', 'error');
      return;
    }

    try {
      setSaving(true);
      const url = isNew
        ? `${API_URL}/api/admin/hero-slides`
        : `${API_URL}/api/admin/hero-slides/${editingSlide?._id}`;
      const method = isNew ? 'POST' : 'PUT';

      const payload = {
        title: formData.title.trim(),
        subtitle: (formData.subtitle || '').trim(),
        tagline: (formData.tagline || '').trim(),
        description: (formData.description || '').trim(),
        badge: (formData.badge || '').trim(),
        image: formData.image.trim(),
        mobileImage: (formData.mobileImage || '').trim(),
        textAlignment: formData.textAlignment || 'center',
        textColor: formData.textColor || '#2a1306',
        showText: Boolean(formData.showText),
        showButtons: Boolean(formData.showButtons),
        button1Text: (formData.button1Text || '').trim(),
        button1Link: (formData.button1Link || '').trim(),
        button2Text: (formData.button2Text || '').trim(),
        button2Link: (formData.button2Link || '').trim(),
        order: Number(formData.order) || 1,
        isActive: Boolean(formData.isActive),
      };

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(isNew ? 'नया हीरो स्लाइड सफलतापूर्वक जोड़ा गया!' : 'हीरो स्लाइड सफलतापूर्वक अपडेट किया गया!');
        setEditingSlide(null);
        setIsNew(false);
        fetchSlides();
      } else {
        showToast(data.message || 'सहेजने में विफल', 'error');
      }
    } catch (e: any) {
      showToast('त्रुटि: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setSaving(true);
      const res = await fetch(`${API_URL}/api/admin/hero-slides/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        showToast('स्लाइड सफलतापूर्वक हटा दी गई');
        setDeleteConfirmId(null);
        fetchSlides();
      } else {
        showToast(data.message || 'हटाने में विफल', 'error');
      }
    } catch (e: any) {
      showToast('त्रुटि: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (slide: HeroSlideItem) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/hero-slides/${slide._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ isActive: !slide.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`स्लाइड ${!slide.isActive ? 'सक्रिय (Active)' : 'निष्क्रिय (Inactive)'} कर दी गई`);
        setSlides(prev =>
          prev.map(s => (s._id === slide._id ? { ...s, isActive: !slide.isActive } : s))
        );
      } else {
        showToast(data.message || 'अपडेट विफल', 'error');
      }
    } catch (e: any) {
      showToast('त्रुटि: ' + e.message, 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-sm font-bold text-white transition-all transform animate-bounce ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>होमपेज हीरो बैनर प्रबंधन (Homepage Hero Slides)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              हीरो स्लाइडर / मुख्य बैनर
            </h1>
            <p className="text-xs sm:text-sm text-orange-100/90 mt-1 max-w-xl">
              होमपेज के मुख्य हीरो सेक्शन में प्रदर्शित होने वाले बैनर्स, फोटो, हेडलाइन्स और बटन्स को यहां से जोड़ें और संपादित करें।
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={openCreateModal}
              className="px-5 py-3 rounded-2xl font-black text-xs text-orange-950 bg-white hover:bg-orange-50 shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 text-orange-600" />
              <span>नया स्लाइड जोड़ें</span>
            </button>
            <button
              onClick={fetchSlides}
              disabled={loading}
              className="p-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer"
              title="रिफ्रेश करें"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Slides List Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-orange-100">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
          <p className="text-sm font-bold text-slate-500 mt-3">हीरो स्लाइड्स लोड हो रही हैं...</p>
        </div>
      ) : slides.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-orange-200 p-8">
          <p className="text-4xl mb-3">🖼️</p>
          <h3 className="text-lg font-black text-slate-800">कोई हीरो स्लाइड नहीं मिली</h3>
          <p className="text-xs text-slate-500 mt-1">पहला हीरो स्लाइड जोड़ने के लिए ऊपर "नया स्लाइड जोड़ें" बटन दबाएं।</p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-5 py-2.5 rounded-xl font-bold text-xs bg-orange-600 text-white shadow-sm"
          >
            + नया स्लाइड जोड़ें
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {slides.map((slide) => (
            <div
              key={slide._id}
              className={`bg-white rounded-3xl border transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden ${
                slide.isActive ? 'border-orange-100' : 'border-slate-200 opacity-70 bg-slate-50/50'
              }`}
            >
              <div>
                {/* Image Banner Box */}
                <div className="relative h-48 w-full bg-orange-950 overflow-hidden">
                  {slide.image ? (
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                      कोई फोटो नहीं
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Order, Status & Alignment Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-white/90 text-slate-800 shadow">
                        क्रम #{slide.order}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black text-white shadow ${
                          slide.isActive ? 'bg-emerald-600' : 'bg-slate-600'
                        }`}
                      >
                        {slide.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {slide.showText === false ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-700/90 text-white shadow backdrop-blur-xs">
                          🖼️ केवल फोटो
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-white/95 text-slate-800 shadow"
                          title={`टेक्स्ट रंग: ${slide.textColor || '#2a1306'}`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-slate-300"
                            style={{ backgroundColor: slide.textColor || '#2a1306' }}
                          />
                          रंग
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/90 text-white shadow backdrop-blur-xs">
                        {slide.textAlignment === 'left' ? '⬅️ बायाँ' : slide.textAlignment === 'right' ? '➡️ दायाँ' : '⏺️ मध्य'}
                      </span>
                      {slide.mobileImage && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600/90 text-white shadow backdrop-blur-xs" title="अलग मोबाइल फोटो मौजूद है">
                          📱 मोबाइल
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title overlay at bottom of image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs font-black text-amber-300 uppercase tracking-wider truncate">
                      {slide.badge || '🚩 Jai Shree Ram'}
                    </p>
                    <h3 className="text-lg font-black leading-tight drop-shadow-md truncate">
                      {slide.title}
                    </h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-2">
                  {slide.showText === false ? (
                    <div className="py-2 px-3 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold flex items-center gap-2">
                      <span>🖼️</span>
                      <span>होमपेज पर इस स्लाइड का टेक्स्ट छिपा रहेगा (शुद्ध बैनर मोड)</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-slate-800 line-clamp-1">
                        {slide.subtitle || 'Naam is the True Power'}
                      </p>
                      <p className="text-xs text-orange-700 font-semibold line-clamp-1">
                        {slide.tagline}
                      </p>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {slide.description}
                      </p>
                    </>
                  )}

                  {/* Buttons Info */}
                  <div className="pt-2 flex items-center gap-2 text-[11px] font-semibold text-slate-500 flex-wrap">
                    {slide.showButtons === false ? (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200 text-[10px]">
                        🚫 बटन छिपे हुए हैं
                      </span>
                    ) : (
                      <>
                        <span className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-800 border border-orange-200">
                          🔘 {slide.button1Text || 'Start Jaap'}
                        </span>
                        {slide.button2Text && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                            🔘 {slide.button2Text}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-3 bg-orange-50/50 border-t border-orange-100 flex items-center justify-between">
                <button
                  onClick={() => handleToggleActive(slide)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    slide.isActive
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={slide.isActive ? 'निष्क्रिय करें' : 'सक्रिय करें'}
                >
                  {slide.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{slide.isActive ? 'सक्रिय' : 'निष्क्रिय'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(slide)}
                    className="p-2 rounded-xl bg-white hover:bg-orange-100 text-orange-700 border border-orange-200 transition-all cursor-pointer shadow-sm"
                    title="संपादित करें (Edit)"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(slide._id)}
                    className="p-2 rounded-xl bg-white hover:bg-red-100 text-red-600 border border-red-200 transition-all cursor-pointer shadow-sm"
                    title="हटाएं (Delete)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-red-200 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">क्या आप सुनिश्चित हैं?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              यह हीरो स्लाइड हमेशा के लिए हटा दी जाएगी और होमपेज पर नहीं दिखाई देगी।
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                रद्द करें
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl font-black text-xs bg-red-600 text-white hover:bg-red-700 shadow-md cursor-pointer disabled:opacity-50"
              >
                {saving ? 'हटाया जा रहा है...' : 'हाँ, हटाएं'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Slide Modal */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl border border-orange-200 shadow-2xl my-8 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-orange-100 flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🖼️</span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {isNew ? 'नया हीरो स्लाइड जोड़ें' : 'हीरो स्लाइड संपादित करें'}
                  </h3>
                  <p className="text-xs text-slate-500">होमपेज के मुख्य बैनर में नया रूप प्रदर्शित करें</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingSlide(null);
                  setIsNew(false);
                }}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSave} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {/* Desktop & Mobile Photos Grid */}
              <div className="grid md:grid-cols-2 gap-4 p-4 rounded-2xl bg-orange-50/50 border border-orange-200/80">
                {/* Desktop Photo */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <span>💻 डेस्कटॉप फोटो (Desktop Photo)</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                      1920 × 800 px (16:9)
                    </span>
                  </div>
                  <div className="relative w-full h-32 rounded-xl bg-orange-950 overflow-hidden border border-orange-200">
                    {formData.image ? (
                      <Image
                        src={formData.image}
                        alt="Desktop Preview"
                        fill
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                        डेस्कटॉप फोटो नहीं चुनी
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/hero-ayodhya-ramji-hd.webp या URL"
                    className="w-full px-3 py-1.5 rounded-xl text-xs font-bold border border-orange-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <ImageUploader
                    folder="hero"
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: Array.isArray(url) ? url[0] : url })}
                    label="💻 डेस्कटॉप फोटो अपलोड करें"
                  />
                  <p className="text-[10px] text-slate-500">
                    कंप्यूटर व लैपटॉप स्क्रीन पर यह फोटो दिखेगी।
                  </p>
                </div>

                {/* Mobile Photo (Optional) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <span>📱 मोबाइल फोटो (Mobile Photo)</span>
                      <span className="text-[10px] text-slate-400 font-normal">(वैकल्पिक)</span>
                    </label>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      1080 × 1350 px (4:5)
                    </span>
                  </div>
                  <div className="relative w-full h-32 rounded-xl bg-orange-950 overflow-hidden border border-orange-200">
                    {formData.mobileImage ? (
                      <Image
                        src={formData.mobileImage}
                        alt="Mobile Preview"
                        fill
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs text-center px-2">
                        <span>मोबाइल फोटो नहीं चुनी</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">(खाली रहने पर डेस्कटॉप फोटो दिखेगी)</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    value={formData.mobileImage}
                    onChange={(e) => setFormData({ ...formData, mobileImage: e.target.value })}
                    placeholder="/images/hero-ayodhya-ramji.webp या URL"
                    className="w-full px-3 py-1.5 rounded-xl text-xs font-bold border border-orange-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <ImageUploader
                    folder="hero"
                    value={formData.mobileImage}
                    onChange={(url) => setFormData({ ...formData, mobileImage: Array.isArray(url) ? url[0] : url })}
                    label="📱 मोबाइल फोटो अपलोड करें"
                  />
                  <p className="text-[10px] text-slate-500">
                    स्मार्टफोन पर पोर्ट्रेट मोड में यह फोटो शानदार दिखेगी।
                  </p>
                </div>
              </div>

              {/* Text Alignment Picker (Left / Center / Right) */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black text-slate-800">
                    टेक्स्ट अलाइनमेंट (Text Alignment) *
                  </label>
                  <span className="text-[10px] text-amber-800 font-bold">
                    फोटो के अनुसार टेक्स्ट की स्थिति तय करें
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, textAlignment: 'left' }))}
                    className={`py-2 px-3 rounded-xl text-xs font-black border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      formData.textAlignment === 'left'
                        ? 'bg-orange-500 text-white border-orange-600 shadow-md ring-2 ring-orange-300 scale-102'
                        : 'bg-white text-slate-700 border-amber-200 hover:bg-orange-50'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span>⬅️ बायाँ (Left)</span>
                      {formData.textAlignment === 'left' && <span className="text-[10px]">✓</span>}
                    </div>
                    <span className="text-[9px] font-normal opacity-90 hidden sm:inline">जब प्रभु दाईं ओर हों</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, textAlignment: 'center' }))}
                    className={`py-2 px-3 rounded-xl text-xs font-black border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      formData.textAlignment === 'center'
                        ? 'bg-orange-500 text-white border-orange-600 shadow-md ring-2 ring-orange-300 scale-102'
                        : 'bg-white text-slate-700 border-amber-200 hover:bg-orange-50'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span>⏺️ मध्य (Center)</span>
                      {formData.textAlignment === 'center' && <span className="text-[10px]">✓</span>}
                    </div>
                    <span className="text-[9px] font-normal opacity-90 hidden sm:inline">संतुलित दृश्य</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, textAlignment: 'right' }))}
                    className={`py-2 px-3 rounded-xl text-xs font-black border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      formData.textAlignment === 'right'
                        ? 'bg-orange-500 text-white border-orange-600 shadow-md ring-2 ring-orange-300 scale-102'
                        : 'bg-white text-slate-700 border-amber-200 hover:bg-orange-50'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span>➡️ दायाँ (Right)</span>
                      {formData.textAlignment === 'right' && <span className="text-[10px]">✓</span>}
                    </div>
                    <span className="text-[9px] font-normal opacity-90 hidden sm:inline">जब प्रभु बाईं ओर हों</span>
                  </button>
                </div>
                <p className="text-[10px] text-amber-900 mt-2 font-medium">
                  {formData.textAlignment === 'left' && '📌 टेक्स्ट और बटन स्लाइड के बाईं तरफ संरेखित होंगे ताकि दाईं तरफ प्रभु का विग्रह स्पष्ट दिखे।'}
                  {formData.textAlignment === 'center' && '📌 टेक्स्ट और बटन स्लाइड के केंद्र (Center) में रहेंगे।'}
                  {formData.textAlignment === 'right' && '📌 टेक्स्ट और बटन स्लाइड के दाईं तरफ संरेखित होंगे ताकि बाईं तरफ प्रभु का विग्रह स्पष्ट दिखे।'}
                </p>
              </div>

              {/* Text Visibility & Button Visibility Toggles */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800">
                    👁️ टेक्स्ट व बटन डिस्प्ले सेटिंग्स (Display Settings)
                  </label>
                  <span className="text-[10px] text-amber-800 font-bold">
                    कंट्रोल करें क्या दिखाना है
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-2.5">
                  {/* Show Text Toggle */}
                  <label className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                    formData.showText
                      ? 'bg-orange-50 border-orange-300 ring-1 ring-orange-200'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}>
                    <div className="pr-2">
                      <p className="text-xs font-black text-slate-800">
                        {formData.showText ? '✅ टेक्स्ट दिखाएं' : '🚫 टेक्स्ट छिपाएं'}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {formData.showText ? 'शीर्षक, टैगलाइन और विवरण दिखेंगे' : 'केवल फोटो/बैनर दिखेगा (Pure Banner)'}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.showText}
                      onChange={(e) => setFormData({ ...formData, showText: e.target.checked })}
                      className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                    />
                  </label>

                  {/* Show Buttons Toggle */}
                  <label className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                    formData.showButtons
                      ? 'bg-orange-50 border-orange-300 ring-1 ring-orange-200'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}>
                    <div className="pr-2">
                      <p className="text-xs font-black text-slate-800">
                        {formData.showButtons ? '✅ एक्शन बटन दिखाएं' : '🚫 बटन छिपाएं'}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {formData.showButtons ? 'Start Jaap / Video बटन दिखेंगे' : 'कोई बटन नहीं दिखेगा'}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.showButtons}
                      onChange={(e) => setFormData({ ...formData, showButtons: e.target.checked })}
                      className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Text Color Picker & Presets */}
              {formData.showText && (
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-800">
                      🎨 टेक्स्ट का रंग (Text Color)
                    </label>
                    <span className="text-[10px] text-amber-800 font-bold">
                      फोटो के अनुसार रंग चुनें
                    </span>
                  </div>

                  {/* Preset Swatches */}
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { name: 'डार्क ब्रॉन्ज (Standard)', hex: '#2a1306' },
                      { name: 'शुद्ध सफ़ेद (White)', hex: '#ffffff' },
                      { name: 'दिव्य सुनहरा (Golden)', hex: '#d97706' },
                      { name: 'केसरिया (Saffron)', hex: '#ea580c' },
                      { name: 'गहरा काला (Black)', hex: '#111827' },
                      { name: 'गहरा लाल (Crimson)', hex: '#991b1b' },
                    ].map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => setFormData({ ...formData, textColor: preset.hex })}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          formData.textColor?.toLowerCase() === preset.hex.toLowerCase()
                            ? 'bg-white border-orange-500 ring-2 ring-orange-400 shadow-sm'
                            : 'bg-white/80 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-slate-300 shadow-xs flex-shrink-0"
                          style={{ backgroundColor: preset.hex }}
                        />
                        <span className="text-[11px] text-slate-700">{preset.name}</span>
                        {formData.textColor?.toLowerCase() === preset.hex.toLowerCase() && (
                          <span className="text-orange-600 text-xs font-black">✓</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Custom Color Input & Live Preview */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-amber-200 shadow-xs">
                      <span className="text-[11px] font-bold text-slate-600">कस्टम रंग:</span>
                      <input
                        type="color"
                        value={formData.textColor || '#2a1306'}
                        onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={formData.textColor || '#2a1306'}
                        onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                        placeholder="#2a1306"
                        className="w-20 px-2 py-0.5 text-xs font-mono font-bold uppercase rounded border border-slate-200 text-slate-800"
                      />
                    </div>

                    {/* Live Preview Text Sample */}
                    <div className="flex-1 px-3 py-1.5 rounded-xl bg-white/70 border border-amber-200 flex items-center justify-center overflow-hidden">
                      <span
                        className="font-serif font-black text-sm truncate"
                        style={{ color: formData.textColor || '#2a1306' }}
                      >
                        जय श्री राम • {formData.title || 'Jai Shree Ram'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Title & Subtitle */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">मुख्य शीर्षक (Title) *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="जैसे: Jai Shree Ram"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm font-bold border border-orange-200 bg-orange-50/40 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">उप-शीर्षक (Subtitle)</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="जैसे: Naam is the True Power"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm font-bold border border-orange-200 bg-orange-50/40 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">टैगलाइन (Tagline)</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="जैसे: Chant. Connect. Learn. Live with Bhagwan Ram."
                  className="w-full px-3.5 py-2 rounded-xl text-xs font-bold border border-orange-200 bg-orange-50/40 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">विवरण (Description)</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="जैसे: Join millions of devotees and experience peace, positivity and happiness through Ram Naam in your daily life."
                  className="w-full px-3.5 py-2 rounded-xl text-xs font-medium border border-orange-200 bg-orange-50/40 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Top Badge Text */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">टॉप रिबन बैज (Badge)</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="जैसे: 🚩 Jai Shree Ram — Naam is the True Power"
                  className="w-full px-3.5 py-2 rounded-xl text-xs font-bold border border-orange-200 bg-orange-50/40 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Action Buttons Configuration */}
              <div className="grid sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200">
                <div className="space-y-2">
                  <p className="text-xs font-black text-amber-900">बटन 1 (मुख्य नारंगी बटन):</p>
                  <input
                    type="text"
                    value={formData.button1Text}
                    onChange={(e) => setFormData({ ...formData, button1Text: e.target.value })}
                    placeholder="बटन 1 नाम"
                    className="w-full px-3 py-1.5 rounded-lg text-xs font-bold border border-orange-200 bg-white"
                  />
                  <input
                    type="text"
                    value={formData.button1Link}
                    onChange={(e) => setFormData({ ...formData, button1Link: e.target.value })}
                    placeholder="बटन 1 लिंक (e.g. /#jaap)"
                    className="w-full px-3 py-1.5 rounded-lg text-xs font-bold border border-orange-200 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-black text-amber-900">बटन 2 (सफेद बटन / वीडियो):</p>
                  <input
                    type="text"
                    value={formData.button2Text}
                    onChange={(e) => setFormData({ ...formData, button2Text: e.target.value })}
                    placeholder="बटन 2 नाम"
                    className="w-full px-3 py-1.5 rounded-lg text-xs font-bold border border-orange-200 bg-white"
                  />
                  <input
                    type="text"
                    value={formData.button2Link}
                    onChange={(e) => setFormData({ ...formData, button2Link: e.target.value })}
                    placeholder="बटन 2 लिंक या YouTube URL"
                    className="w-full px-3 py-1.5 rounded-lg text-xs font-bold border border-orange-200 bg-white"
                  />
                </div>
              </div>

              {/* Sequence Order and Active Switch */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700">क्रम संख्या (Order):</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-20 px-3 py-1.5 rounded-xl text-xs font-bold border border-orange-200 bg-orange-50/40 text-center"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700">स्लाइड सक्रिय रखें:</label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                    className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                      formData.isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {formData.isActive ? 'हाँ (Active)' : 'नहीं (Inactive)'}
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-2 pt-4 border-t border-orange-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingSlide(null);
                    setIsNew(false);
                  }}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl font-black text-xs text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>सहेजा जा रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{isNew ? 'स्लाइड जोड़ें' : 'बदलाव सहेजें'}</span>
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
