'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import AdminPagination from '@/components/AdminPagination';
import {
  Scroll, FileText, Smartphone, Phone, Star, Calendar,
  Trash2, Pencil, Plus, X, Eye, Search, RefreshCw, MapPin,
  Mail, Globe, Youtube, Facebook, Instagram, Twitter, Video, CheckCircle2
} from 'lucide-react';

interface LiveKatha {
  _id?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country?: string;
  pincode?: string;
  startDate: string;
  endDate: string;
  liveLink?: string;
  kathaType: string;
  isActive: boolean;
}

interface KathaVachak {
  _id: string;
  name: string;
  photo: string;
  photos?: string[];
  experience: number;
  specialization: string;
  description: string;
  contact: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
  liveKathas: LiveKatha[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
  averageRating: number;
  reviews: any[];
  createdAt: string;
}

export default function AdminKathaVachaks() {
  const [kathaVachaks, setKathaVachaks] = useState<KathaVachak[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    withLiveKathas: 0,
    totalLiveKathas: 0
  });

  // Modal & Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedKathaVachak, setSelectedKathaVachak] = useState<KathaVachak | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    photos: [] as string[],
    experience: 0,
    specialization: '',
    description: '',
    'contact.phone': '',
    'contact.email': '',
    'contact.whatsapp': '',
    'socialMedia.facebook': '',
    'socialMedia.instagram': '',
    'socialMedia.youtube': '',
    'socialMedia.twitter': ''
  });
  const [liveKathas, setLiveKathas] = useState<LiveKatha[]>([]);
  const [photoUrl, setPhotoUrl] = useState('');

  const fetchKathaVachaks = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/admin/katha-vachaks?page=${page}&limit=${limit}`;
      if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

      const response = await api.get(url);
      const data = await response.json();
      if (data.success) {
        setKathaVachaks(data.kathaVachaks || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
          setTotalCount(data.pagination.total || 0);
        }
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching Katha Vachaks:', error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchKathaVachaks();
  }, [fetchKathaVachaks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const kathaVachakData: any = {
        name: formData.name,
        photo: formData.photo || (formData.photos.length > 0 ? formData.photos[0] : ''),
        photos: formData.photos,
        experience: formData.experience,
        specialization: formData.specialization,
        description: formData.description,
        contact: {
          phone: formData['contact.phone'],
          email: formData['contact.email'],
          whatsapp: formData['contact.whatsapp']
        },
        liveKathas: liveKathas,
        socialMedia: {
          facebook: formData['socialMedia.facebook'],
          instagram: formData['socialMedia.instagram'],
          youtube: formData['socialMedia.youtube'],
          twitter: formData['socialMedia.twitter']
        }
      };

      const url = editingId ? `/api/admin/katha-vachaks/${editingId}` : '/api/admin/katha-vachaks';
      const response = await (editingId ? api.put(url, kathaVachakData) : api.post(url, kathaVachakData));
      const data = await response.json();

      if (data.success) {
        alert(editingId ? '✅ कथा वाचक अपडेट हो गया!' : '✅ नया कथा वाचक जुड़ गया!');
        resetForm();
        fetchKathaVachaks();
      } else {
        alert(data.message || 'Error saving Katha Vachak');
      }
    } catch (error) {
      alert('Error saving Katha Vachak');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      photo: '',
      photos: [],
      experience: 0,
      specialization: '',
      description: '',
      'contact.phone': '',
      'contact.email': '',
      'contact.whatsapp': '',
      'socialMedia.facebook': '',
      'socialMedia.instagram': '',
      'socialMedia.youtube': '',
      'socialMedia.twitter': ''
    });
    setLiveKathas([]);
    setPhotoUrl('');
  };

  const handleEdit = (kv: KathaVachak) => {
    setEditingId(kv._id);
    let photosArray = kv.photos || [];
    if (photosArray.length === 0 && kv.photo) {
      photosArray = [kv.photo];
    }

    const formattedLiveKathas = (kv.liveKathas || []).map(katha => ({
      ...katha,
      startDate: katha.startDate ? new Date(katha.startDate).toISOString().split('T')[0] : '',
      endDate: katha.endDate ? new Date(katha.endDate).toISOString().split('T')[0] : ''
    }));

    setFormData({
      name: kv.name,
      photo: kv.photo || '',
      photos: photosArray,
      experience: kv.experience,
      specialization: kv.specialization || '',
      description: kv.description || '',
      'contact.phone': kv.contact?.phone || '',
      'contact.email': kv.contact?.email || '',
      'contact.whatsapp': kv.contact?.whatsapp || '',
      'socialMedia.facebook': kv.socialMedia?.facebook || '',
      'socialMedia.instagram': kv.socialMedia?.instagram || '',
      'socialMedia.youtube': kv.socialMedia?.youtube || '',
      'socialMedia.twitter': kv.socialMedia?.twitter || ''
    });
    setLiveKathas(formattedLiveKathas);
    setShowForm(true);
    setSelectedKathaVachak(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const uploadImageToS3 = async (file: File) => {
    try {
      setUploading(true);
      const data = new FormData();
      data.append('image', file);
      const token = localStorage.getItem('token');
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/upload/image?folder=katha-vachaks`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: data
      });

      const resJson = await response.json();
      if (resJson.success && resJson.url) return resJson.url;
      throw new Error(resJson.message || 'Upload failed');
    } catch (error) {
      alert('❌ Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }
    const url = await uploadImageToS3(file);
    if (url) {
      setFormData({ ...formData, photos: [...formData.photos, url] });
      alert('✅ Image uploaded!');
    }
  };

  const addPhotoUrl = () => {
    if (photoUrl.trim()) {
      setFormData({ ...formData, photos: [...formData.photos, photoUrl.trim()] });
      setPhotoUrl('');
    }
  };

  const removePhoto = (index: number) => {
    setFormData({ ...formData, photos: formData.photos.filter((_, i) => i !== index) });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('क्या आप वाकई इस कथा वाचक को हटाना चाहते हैं?')) return;
    try {
      const response = await api.delete(`/api/admin/katha-vachaks/${id}`);
      const data = await response.json();
      if (data.success) {
        alert('✅ कथा वाचक हटाया गया!');
        fetchKathaVachaks();
      }
    } catch (error) {
      alert('Error deleting');
    }
  };

  const addLiveKatha = () => {
    setLiveKathas([...liveKathas, {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: 'India',
      pincode: '',
      startDate: '',
      endDate: '',
      liveLink: '',
      kathaType: '',
      isActive: true
    }]);
  };

  const removeLiveKatha = (index: number) => {
    setLiveKathas(liveKathas.filter((_, i) => i !== index));
  };

  const updateLiveKatha = (index: number, field: string, value: any) => {
    const updated = [...liveKathas];
    (updated[index] as any)[field] = value;
    setLiveKathas(updated);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Premium Header Banner */}
      <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-bold flex-shrink-0">
              <Scroll className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-orange-300 text-[11px] font-black uppercase tracking-wider mb-1">
                Spiritual Orators & Kathas
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">कथा वाचक प्रबंधन (Katha Vachaks)</h1>
              <p className="text-sm text-slate-300 mt-0.5">कथा वाचकों की सूची, प्रोफाइल, और लाइव कथा कार्यक्रम</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fetchKathaVachaks()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              रिफ्रेश
            </button>
            <button
              onClick={() => { resetForm(); setShowForm(!showForm); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-orange-500/20 transition-all hover:scale-105"
            >
              {showForm ? <><X className="w-4 h-4" /> फॉर्म बंद करें</> : <><Plus className="w-4 h-4" /> नया कथा वाचक जोड़ें</>}
            </button>
          </div>
        </div>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">कुल कथा वाचक</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Scroll className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{stats.total.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 font-medium">पंजीकृत वक्ता प्रोफाइल</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">सक्रिय लाइव कथाएँ</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-red-600">{stats.totalLiveKathas.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 font-medium">लाइव व आगामी सत्संग</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">लाइव कथा वाचक</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">{stats.withLiveKathas.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 font-medium">चल रहे कार्यक्रमों वाले वक्ता</span>
        </div>
      </div>

      {/* Add / Edit Form Modal/Section */}
      {showForm && (
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-orange-100 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                {editingId ? <><Pencil className="w-5 h-5 text-orange-600" /> कथा वाचक विवरण संपादित करें</> : <><Plus className="w-5 h-5 text-orange-600" /> नया कथा वाचक जोड़ें</>}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">कृपया सभी आवश्यक आध्यात्मिक व संपर्क विवरण भरें</p>
            </div>
            <button
              onClick={resetForm}
              className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600" /> मुख्य परिचय (Basic Information)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">कथा वाचक का नाम *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="उदा. पूज्य श्री अनिरुद्धाचार्य जी महाराज"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">अनुभव (वर्ष) *</label>
                  <input
                    type="number"
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="उदा. 15"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">विशेषज्ञता (Specialization) *</label>
                  <input
                    type="text"
                    required
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="उदा. श्रीमद् भागवत कथा, राम कथा, शिव महापुराण"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">विस्तृत परिचय (Description / Bio)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={4}
                    placeholder="कथा वाचक का आध्यात्मिक सफर, प्रवचन शैली व विवरण..."
                  />
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600" /> तस्वीरें एवं फ़ोटो गैलरी (Photos)
              </h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    तस्वीर अपलोड करें (Upload Image)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                  {uploading && <p className="text-xs text-orange-600 mt-2 font-medium">अपलोड हो रहा है...</p>}
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="या फ़ोटो URL दर्ज करें..."
                  />
                  <button
                    type="button"
                    onClick={addPhotoUrl}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                  >
                    जोड़ें
                  </button>
                </div>

                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {formData.photos.map((p, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 group aspect-square">
                        <img src={p} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                        >
                          हटाएं
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-600" /> संपर्क जानकारी (Contact Details)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">फ़ोन नंबर (Phone)</label>
                  <input
                    type="text"
                    value={formData['contact.phone']}
                    onChange={(e) => setFormData({ ...formData, 'contact.phone': e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">व्हाट्सएप (WhatsApp)</label>
                  <input
                    type="text"
                    value={formData['contact.whatsapp']}
                    onChange={(e) => setFormData({ ...formData, 'contact.whatsapp': e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ईमेल (Email)</label>
                  <input
                    type="email"
                    value={formData['contact.email']}
                    onChange={(e) => setFormData({ ...formData, 'contact.email': e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="katha@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-orange-600" /> सोशल मीडिया लिंक्स (Social Media)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">YouTube चैनल</label>
                  <input
                    type="url"
                    value={formData['socialMedia.youtube']}
                    onChange={(e) => setFormData({ ...formData, 'socialMedia.youtube': e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="https://youtube.com/@..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Facebook पेज</label>
                  <input
                    type="url"
                    value={formData['socialMedia.facebook']}
                    onChange={(e) => setFormData({ ...formData, 'socialMedia.facebook': e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Instagram हैंडल</label>
                  <input
                    type="url"
                    value={formData['socialMedia.instagram']}
                    onChange={(e) => setFormData({ ...formData, 'socialMedia.instagram': e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Twitter / X प्रोफाइल</label>
                  <input
                    type="url"
                    value={formData['socialMedia.twitter']}
                    onChange={(e) => setFormData({ ...formData, 'socialMedia.twitter': e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Live Kathas Events */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-600" /> लाइव व आगामी कथा कार्यक्रम (Live Kathas)
                </h3>
                <button
                  type="button"
                  onClick={addLiveKatha}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> कार्यक्रम जोड़ें
                </button>
              </div>

              {liveKathas.length === 0 ? (
                <p className="text-xs text-slate-400 italic">कोई कार्यक्रम जोड़ा नहीं गया है।</p>
              ) : (
                <div className="space-y-4">
                  {liveKathas.map((katha, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-orange-600">कार्यक्रम #{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeLiveKatha(index)}
                          className="text-xs text-red-600 font-bold hover:underline"
                        >
                          हटाएं
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-slate-600 font-bold mb-1">कथा का प्रकार</label>
                          <input
                            type="text"
                            value={katha.kathaType}
                            onChange={(e) => updateLiveKatha(index, 'kathaType', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                            placeholder="उदा. श्रीमद् भागवत कथा"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 font-bold mb-1">स्थान / पता</label>
                          <input
                            type="text"
                            value={katha.addressLine1}
                            onChange={(e) => updateLiveKatha(index, 'addressLine1', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                            placeholder="ग्राउंड / हॉल का नाम"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 font-bold mb-1">शहर</label>
                          <input
                            type="text"
                            value={katha.city}
                            onChange={(e) => updateLiveKatha(index, 'city', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                            placeholder="भोपाल"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 font-bold mb-1">राज्य</label>
                          <input
                            type="text"
                            value={katha.state}
                            onChange={(e) => updateLiveKatha(index, 'state', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                            placeholder="मध्य प्रदेश"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 font-bold mb-1">प्रारंभ तिथि</label>
                          <input
                            type="date"
                            value={katha.startDate}
                            onChange={(e) => updateLiveKatha(index, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 font-bold mb-1">समापन तिथि</label>
                          <input
                            type="date"
                            value={katha.endDate}
                            onChange={(e) => updateLiveKatha(index, 'endDate', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-slate-600 font-bold mb-1">लाइव प्रसारण लिंक (YouTube Live URL)</label>
                          <input
                            type="url"
                            value={katha.liveLink || ''}
                            onChange={(e) => updateLiveKatha(index, 'liveLink', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                            placeholder="https://youtube.com/live/..."
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={katha.isActive}
                            onChange={(e) => updateLiveKatha(index, 'isActive', e.target.checked)}
                            className="w-4 h-4 rounded text-orange-600"
                          />
                          <span className="font-bold text-slate-700">सक्रिय (Active Event)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-orange-500/20 hover:scale-105 transition-all disabled:opacity-50"
              >
                {editingId ? 'अपडेट करें (Save Changes)' : 'कथा वाचक जोड़ें (Create)'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="कथा वाचक का नाम, विशेषज्ञता से खोजें..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
          />
        </div>
      </div>

      {/* Katha Vachaks Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider">
                <th className="py-3.5 px-4">कथा वाचक (Profile)</th>
                <th className="py-3.5 px-4">विशेषज्ञता (Specialization)</th>
                <th className="py-3.5 px-4">अनुभव व रेटिंग</th>
                <th className="py-3.5 px-4">संपर्क (Contact)</th>
                <th className="py-3.5 px-4">लाइव कार्यक्रम</th>
                <th className="py-3.5 px-4 text-right">कार्यवाही (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-2" />
                    <p>कथा वाचक लोड हो रहे हैं...</p>
                  </td>
                </tr>
              ) : kathaVachaks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Scroll className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-sm text-slate-600">कोई कथा वाचक नहीं मिला</p>
                    <p className="text-xs">नया कथा वाचक जोड़ने हेतु ऊपर दिए बटन पर क्लिक करें।</p>
                  </td>
                </tr>
              ) : (
                kathaVachaks.map((kv) => (
                  <tr key={kv._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {kv.photo ? (
                          <img
                            src={kv.photo}
                            alt={kv.name}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {kv.name?.charAt(0) || 'K'}
                          </div>
                        )}
                        <div>
                          <p
                            onClick={() => setSelectedKathaVachak(kv)}
                            className="font-bold text-slate-900 text-sm hover:text-orange-600 cursor-pointer"
                          >
                            {kv.name}
                          </p>
                          <p className="text-[11px] text-slate-400 line-clamp-1 max-w-[200px]">
                            {kv.description || 'आध्यात्मिक प्रवक्ता'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold bg-orange-50 text-orange-800 border border-orange-100">
                        {kv.specialization || 'सामान्य'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700">{kv.experience} वर्ष</span>
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          {kv.averageRating > 0 ? kv.averageRating.toFixed(1) : 'New'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {kv.contact?.phone || kv.contact?.whatsapp || '—'}
                    </td>

                    <td className="py-3 px-4">
                      {kv.liveKathas && kv.liveKathas.length > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-bold border border-red-200">
                          <Video className="w-3 h-3" /> {kv.liveKathas.length} कार्यक्रम
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">कोई नहीं</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedKathaVachak(kv)}
                          title="पूर्ण विवरण देखें"
                          className="p-1.5 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(kv)}
                          title="संपादित करें"
                          className="p-1.5 bg-slate-100 hover:bg-orange-600 hover:text-white text-slate-600 rounded-lg transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(kv._id)}
                          title="हटाएं"
                          className="p-1.5 bg-slate-100 hover:bg-red-600 hover:text-white text-slate-500 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination */}
        <div className="p-4 border-t border-slate-100">
          <AdminPagination
            page={page}
            totalPages={totalPages}
            total={totalCount}
            limit={limit}
            onPageChange={(p) => setPage(p)}
            onLimitChange={(l) => { setLimit(l); setPage(1); }}
            itemName="कथा वाचक"
          />
        </div>
      </div>

      {/* Katha Vachak Detail Modal */}
      {selectedKathaVachak && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col my-8 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-900 p-6 text-white relative flex-shrink-0">
              <button
                onClick={() => setSelectedKathaVachak(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-4">
                {selectedKathaVachak.photo ? (
                  <img
                    src={selectedKathaVachak.photo}
                    alt={selectedKathaVachak.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-500/50 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-2xl font-black flex-shrink-0">
                    {selectedKathaVachak.name?.charAt(0) || 'K'}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-black text-white">{selectedKathaVachak.name}</h3>
                  <p className="text-xs text-orange-300 font-bold mt-0.5">{selectedKathaVachak.specialization}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-300">
                    <span>{selectedKathaVachak.experience} वर्ष अनुभव</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {selectedKathaVachak.averageRating > 0 ? selectedKathaVachak.averageRating.toFixed(1) : 'New'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {/* Photo Gallery if any */}
              {selectedKathaVachak.photos && selectedKathaVachak.photos.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">फ़ोटो गैलरी</h4>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedKathaVachak.photos.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt=""
                        className="w-24 h-24 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Bio / Description */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="font-bold text-slate-800 block mb-1">परिचय एवं विवरण</span>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {selectedKathaVachak.description || 'कोई विवरण उपलब्ध नहीं है।'}
                </p>
              </div>

              {/* Contact & Social Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <span className="font-bold text-slate-800 block">संपर्क सूत्र</span>
                  <div className="space-y-1 text-slate-600">
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>फ़ोन: {selectedKathaVachak.contact?.phone || 'उपलब्ध नहीं'}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                      <span>व्हाट्सएप: {selectedKathaVachak.contact?.whatsapp || 'उपलब्ध नहीं'}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>ईमेल: {selectedKathaVachak.contact?.email || 'उपलब्ध नहीं'}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <span className="font-bold text-slate-800 block">सोशल मीडिया</span>
                  <div className="space-y-1.5 text-slate-600">
                    {selectedKathaVachak.socialMedia?.youtube ? (
                      <a
                        href={selectedKathaVachak.socialMedia.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-red-600 hover:underline"
                      >
                        <Youtube className="w-3.5 h-3.5" /> YouTube
                      </a>
                    ) : null}
                    {selectedKathaVachak.socialMedia?.facebook ? (
                      <a
                        href={selectedKathaVachak.socialMedia.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                      >
                        <Facebook className="w-3.5 h-3.5" /> Facebook
                      </a>
                    ) : null}
                    {selectedKathaVachak.socialMedia?.instagram ? (
                      <a
                        href={selectedKathaVachak.socialMedia.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-pink-600 hover:underline"
                      >
                        <Instagram className="w-3.5 h-3.5" /> Instagram
                      </a>
                    ) : null}
                    {!selectedKathaVachak.socialMedia?.youtube && !selectedKathaVachak.socialMedia?.facebook && !selectedKathaVachak.socialMedia?.instagram && (
                      <p className="text-slate-400 italic">कोई लिंक उपलब्ध नहीं</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Live Events List */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
                  कथा कार्यक्रम ({selectedKathaVachak.liveKathas?.length || 0})
                </h4>
                {selectedKathaVachak.liveKathas && selectedKathaVachak.liveKathas.length > 0 ? (
                  <div className="space-y-2">
                    {selectedKathaVachak.liveKathas.map((k, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between gap-2">
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{k.kathaType || 'कथा कार्यक्रम'}</p>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            {k.addressLine1}, {k.city}, {k.state}
                          </p>
                          <p className="text-slate-400 text-[10px]">
                            {k.startDate ? new Date(k.startDate).toLocaleDateString('hi-IN') : ''} - {k.endDate ? new Date(k.endDate).toLocaleDateString('hi-IN') : ''}
                          </p>
                        </div>
                        {k.liveLink && (
                          <a
                            href={k.liveLink}
                            target="_blank"
                            rel="noreferrer"
                            className="self-start sm:self-center px-3 py-1 bg-red-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1"
                          >
                            <Video className="w-3 h-3" /> लाइव देखें
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">कोई लाइव कार्यक्रम दर्ज नहीं है।</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
              <button
                onClick={() => {
                  const kv = selectedKathaVachak;
                  handleEdit(kv);
                }}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" /> संपादित करें (Edit)
              </button>
              <button
                onClick={() => setSelectedKathaVachak(null)}
                className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition-colors"
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
