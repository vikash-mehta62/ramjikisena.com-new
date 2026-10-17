'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Plus, Search, Trash2, Edit2, CheckCircle2,
  X, RefreshCw, Eye, EyeOff, BookOpen, Share2
} from 'lucide-react';
import { useToast } from '@/components/Toast';

interface Inspiration {
  _id: string;
  chaupai: string;
  bhavarth: string;
  source: string;
  active: boolean;
  order?: number;
  createdAt?: string;
}

export default function AdminInspirationsPage() {
  const toast = useToast();
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Inspiration | null>(null);
  const [formChaupai, setFormChaupai] = useState('');
  const [formBhavarth, setFormBhavarth] = useState('');
  const [formSource, setFormSource] = useState('श्री रामचरितमानस');
  const [formActive, setFormActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchInspirations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
      const res = await fetch(`${apiUrl}/api/admin/inspirations?limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.inspirations)) {
        setInspirations(data.inspirations);
      }
    } catch (err) {
      toast.error('चौपाइयां लोड करने में त्रुटि हुई');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspirations();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormChaupai('');
    setFormBhavarth('');
    setFormSource('श्री रामचरितमानस');
    setFormActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (item: Inspiration) => {
    setEditingItem(item);
    setFormChaupai(item.chaupai);
    setFormBhavarth(item.bhavarth);
    setFormSource(item.source || 'श्री रामचरितमानस');
    setFormActive(item.active);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formChaupai.trim() || !formBhavarth.trim()) {
      toast.error('चौपाई और भावार्थ दोनों अनिवार्य हैं');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
      const url = editingItem
        ? `${apiUrl}/api/admin/inspirations/${editingItem._id}`
        : `${apiUrl}/api/admin/inspirations`;
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          chaupai: formChaupai,
          bhavarth: formBhavarth,
          source: formSource,
          active: formActive
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success(editingItem ? 'चौपाई अपडेट हो गई' : 'नई चौपाई जोड़ी गई');
        setShowModal(false);
        fetchInspirations();
      } else {
        toast.error(data.message || 'त्रुटि हुई');
      }
    } catch {
      toast.error('नेटवर्क त्रुटि हुई');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (item: Inspiration) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
      const res = await fetch(`${apiUrl}/api/admin/inspirations/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ active: !item.active })
      });
      const data = await res.json();
      if (data.success) {
        setInspirations(prev => prev.map(i => i._id === item._id ? { ...i, active: !i.active } : i));
        toast.success(item.active ? 'चौपाई निष्क्रिय की गई' : 'चौपाई सक्रिय की गई');
      }
    } catch {
      toast.error('स्टेटस अपडेट नहीं हो सका');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('क्या आप निश्चित रूप से इस चौपाई को हटाना चाहते हैं?')) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
      const res = await fetch(`${apiUrl}/api/admin/inspirations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setInspirations(prev => prev.filter(i => i._id !== id));
        toast.success('चौपाई हटा दी गई');
      }
    } catch {
      toast.error('हटाने में त्रुटि हुई');
    }
  };

  const handleSeed50 = async (force = false) => {
    if (force && !confirm('क्या आप निश्चित रूप से डेटाबेस को पुनः 50 पावन चौपाइयों से रीसेट करना चाहते हैं?')) return;
    setSeeding(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
      const res = await fetch(`${apiUrl}/api/admin/inspirations/seed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ force })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchInspirations();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('सीड करने में त्रुटि हुई');
    } finally {
      setSeeding(false);
    }
  };

  const filteredInspirations = inspirations.filter(item => {
    const matchesSearch = item.chaupai.toLowerCase().includes(search.toLowerCase()) ||
      item.bhavarth.toLowerCase().includes(search.toLowerCase()) ||
      item.source.toLowerCase().includes(search.toLowerCase());
    
    if (filterActive === 'active') return matchesSearch && item.active;
    if (filterActive === 'inactive') return matchesSearch && !item.active;
    return matchesSearch;
  });

  const activeCount = inspirations.filter(i => i.active).length;

  return (
    <div className="space-y-6">

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-orange-100 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black mb-2">
            <span>🪔</span>
            <span>दैनिक प्रेरणा व अमृत चौपाई</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            दैनिक प्रेरणा प्रबंधन (Daily Inspirations)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            होमपेज पर प्रतिदिन 2 सक्रिय चौपाइयां स्वतः चक्रीय रूप से प्रदर्शित होती हैं।
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => handleSeed50(inspirations.length > 0)}
            disabled={seeding}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
            <span>{inspirations.length === 0 ? '🌱 50 चौपाइयां लोड करें' : '🔄 50 चौपाइयां री-सीड'}</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ नई चौपाई जोड़ें</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">कुल चौपाइयां</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{inspirations.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">डेटाबेस में सुरक्षित संग्रह</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm">
          <p className="text-xs font-bold text-emerald-600 uppercase">सक्रिय (Active)</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{activeCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">प्रतिदिन रोटेशन में सम्मिलित</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-sm">
          <p className="text-xs font-bold text-amber-600 uppercase">दैनिक प्रदर्शन</p>
          <p className="text-2xl font-black text-amber-600 mt-1">2 प्रतिदिन</p>
          <p className="text-[11px] text-slate-400 mt-1">वर्ष के हर दिन नई चौपाइयां</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-orange-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="चौपाई, भावार्थ या काण्ड खोजें..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {(['all', 'active', 'inactive'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterActive(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                filterActive === f
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f === 'all' ? 'सभी' : f === 'active' ? 'सक्रिय' : 'निष्क्रिय'}
            </button>
          ))}
        </div>
      </div>

      {/* Inspirations List */}
      <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-orange-500 mb-2" />
            <p className="text-xs font-bold">चौपाइयां लोड हो रही हैं...</p>
          </div>
        ) : filteredInspirations.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl">🪔</span>
            <p className="text-sm font-black text-slate-800 mt-2">कोई चौपाई नहीं मिली</p>
            <p className="text-xs text-slate-500 mt-1">आप नई चौपाई जोड़ सकते हैं या 50 चौपाइयां लोड कर सकते हैं।</p>
            <button
              onClick={() => handleSeed50(true)}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-orange-500 text-white shadow-sm cursor-pointer"
            >
              🌱 50 चौपाइयां तुरंत लोड करें
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredInspirations.map((item, index) => (
              <div key={item._id} className="p-5 hover:bg-orange-50/30 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-400">#{index + 1}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                      {item.source}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      item.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.active ? 'सक्रिय (Active)' : 'निष्क्रिय (Inactive)'}
                    </span>
                  </div>

                  <p className="text-base font-bold text-slate-900 font-serif leading-relaxed">
                    "{item.chaupai}"
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-700">भावार्थ:</strong> {item.bhavarth}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleToggleActive(item)}
                    title={item.active ? 'निष्क्रिय करें' : 'सक्रिय करें'}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      item.active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {item.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(item)}
                    title="संपादित करें"
                    className="p-2 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-all cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    title="हटाएं"
                    className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-orange-200 my-auto flex flex-col max-h-[92vh] overflow-hidden"
            >
              {/* Modal Header (Pinned Top) */}
              <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                <h3 className="font-black text-lg text-slate-900">
                  {editingItem ? 'चौपाई संपादित करें' : 'नई पावन चौपाई जोड़ें'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                {/* Modal Body (Scrollable inside) */}
                <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      चौपाई / दोहा *
                    </label>
                    <textarea
                      rows={2}
                      value={formChaupai}
                      onChange={e => setFormChaupai(e.target.value)}
                      placeholder="जैसे: मंगल भवन अमंगल हारी। द्रवउ सुदसरथ अजिर बिहारी।।"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-orange-200 bg-orange-50/30 text-sm font-serif font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      सरल हिंदी भावार्थ *
                    </label>
                    <textarea
                      rows={3}
                      value={formBhavarth}
                      onChange={e => setFormBhavarth(e.target.value)}
                      placeholder="चौपाई का सरल अर्थ लिखें..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-orange-200 bg-orange-50/30 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        स्रोत / काण्ड
                      </label>
                      <input
                        type="text"
                        value={formSource}
                        onChange={e => setFormSource(e.target.value)}
                        placeholder="जैसे: श्री रामचरितमानस — बालकाण्ड"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-orange-200 bg-orange-50/30 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        स्थिति (Status)
                      </label>
                      <select
                        value={formActive ? 'true' : 'false'}
                        onChange={e => setFormActive(e.target.value === 'true')}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-orange-200 bg-orange-50/30 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                      >
                        <option value="true">सक्रिय (Active)</option>
                        <option value="false">निष्क्रिय (Inactive)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Modal Footer (Pinned Bottom) */}
                <div className="p-4 sm:p-6 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 bg-slate-50/90">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl font-black text-xs text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'सेव हो रहा है...' : (editingItem ? 'अपडेट करें' : 'जोड़ें')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
