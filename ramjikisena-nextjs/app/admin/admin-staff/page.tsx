'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  Shield, User, Key, Phone, CheckSquare, Square, Plus,
  Pencil, Trash2, X, RefreshCw, CheckCircle2, AlertCircle,
  Eye, EyeOff, Lock, Sparkles, Layers, Search
} from 'lucide-react';

interface StaffUser {
  _id: string;
  name: string;
  username: string;
  contact: string;
  city?: string;
  role: 'staff' | 'subadmin' | 'admin';
  permissions: string[];
  createdAt: string;
}

const ALL_PERMISSION_MODULES = [
  { key: 'dashboard', label: 'Dashboard', desc: 'डैशबोर्ड एवं आँकड़े', icon: '📊', group: 'Overview' },
  { key: 'analytics', label: 'Visits & Analytics', desc: 'लाइव विज़िटर ट्रैफ़िक व विश्लेषण', icon: '📈', group: 'Overview' },
  { key: 'users', label: 'All Users', desc: 'उपयोगकर्ता सूची एवं प्रबंधन', icon: '👥', group: 'Management' },
  { key: 'staff', label: 'Staff & Roles', desc: 'स्टाफ एवं अधिकार नियंत्रण', icon: '🛡️', group: 'Management' },
  { key: 'mandirs', label: 'Mandirs', desc: 'मंदिर सूची व स्वीकृति', icon: '🛕', group: 'Services' },
  { key: 'kathaVachaks', label: 'Katha Vachaks', desc: 'कथा वाचक प्रोफाइल प्रबंधन', icon: '📜', group: 'Services' },
  { key: 'pandits', label: 'Pandits', desc: 'पंडित प्रोफ़ाइल व सत्यापन', icon: '🔱', group: 'Services' },
  { key: 'bookings', label: 'Bookings', desc: 'पूजा बुकिंग्स एवं स्थिति नियंत्रण', icon: '📅', group: 'Services' },
  { key: 'blogs', label: 'Blogs & Approvals', desc: 'आध्यात्मिक ब्लॉग स्वीकृति', icon: '✍️', group: 'Content' },
  { key: 'samagri', label: 'Samagri Store', desc: 'पूजन सामग्री एवं ऑर्डर्स', icon: '🪔', group: 'Content' },
];

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    contact: '',
    password: '',
    city: 'Staff Office',
    permissions: [] as string[]
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/staff');
      const data = await res.json();
      if (data.success) {
        setStaffList(data.staff || []);
      }
    } catch (err) {
      console.error('Fetch staff error:', err);
      showToast('error', 'स्टाफ सूची लोड करने में समस्या आई');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      username: '',
      contact: '',
      password: '',
      city: 'Staff Office',
      permissions: ['dashboard']
    });
    setShowPassword(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (staff: StaffUser) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name || '',
      username: staff.username || '',
      contact: staff.contact || '',
      password: '',
      city: staff.city || 'Staff Office',
      permissions: staff.permissions || []
    });
    setShowPassword(false);
    setShowModal(true);
  };

  const togglePermission = (key: string) => {
    setFormData(prev => {
      const exists = prev.permissions.includes(key);
      if (exists) {
        return { ...prev, permissions: prev.permissions.filter(k => k !== key) };
      } else {
        return { ...prev, permissions: [...prev.permissions, key] };
      }
    });
  };

  const selectAllPermissions = () => {
    setFormData(prev => ({
      ...prev,
      permissions: ALL_PERMISSION_MODULES.map(m => m.key)
    }));
  };

  const clearAllPermissions = () => {
    setFormData(prev => ({
      ...prev,
      permissions: []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let res;
      if (editingStaff) {
        res = await api.put(`/api/admin/staff/${editingStaff._id}`, formData);
      } else {
        res = await api.post('/api/admin/staff', formData);
      }

      const data = await res.json();
      if (data.success) {
        showToast('success', editingStaff ? 'स्टाफ जानकारी व अधिकार अपडेट किए गए' : 'नया स्टाफ सफलतापूर्वक बनाया गया');
        setShowModal(false);
        fetchStaff();
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

  const handleDeleteStaff = async (id: string, name: string) => {
    if (!confirm(`क्या आप सच में "${name}" का स्टाफ खाता हटाना चाहते हैं?`)) return;
    try {
      const res = await api.delete(`/api/admin/staff/${id}`);
      const data = await res.json();
      if (data.success) {
        showToast('success', data.message);
        setStaffList(prev => prev.filter(s => s._id !== id));
      } else {
        showToast('error', data.message || 'हटाने में समस्या आई');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast('error', 'हटाने में विफलता');
    }
  };

  const filteredStaff = staffList.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.name?.toLowerCase().includes(q) || s.username?.toLowerCase().includes(q) || s.contact?.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {statusMessage && (
        <div
          className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-sm font-bold text-white transition-all transform animate-bounce ${
            statusMessage.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
          }`}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-orange-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">स्टाफ एवं सब-एडमिन नियंत्रण (Staffing & Roles)</h1>
            <p className="text-xs text-slate-500 font-medium">
              स्टाफ बनाएँ और साइडबार के अनुसार उनके एक्सेस अधिकार (Permissions) तय करें
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchStaff}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-all"
            title="रिफ्रेश करें"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>नया स्टाफ जोड़ें (+ Add Staff)</span>
          </button>
        </div>
      </div>

      {/* Info Notice Box */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-orange-50 p-4 rounded-3xl border border-indigo-100 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed font-medium">
          <strong className="font-black text-indigo-950">साइडबार अधिकार कैसे काम करते हैं:</strong> स्टाफ सदस्य जब अपने यूज़रनेम और पासवर्ड से लॉगिन करेंगे, तो उनके साइडबार में <strong>सिर्फ वही विकल्प और पेज दिखाई देंगे</strong> जिनके बॉक्स आपने यहाँ टिक किए होंगे। अप्रमाणित पेजों पर उनका प्रवेश स्वतः वर्जित रहेगा।
        </div>
      </div>

      {/* Search & Staff Count */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="नाम, यूज़रनेम या मोबाइल नंबर से खोजें..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
        <div className="text-xs font-bold text-slate-500">
          कुल स्टाफ: <span className="font-black text-slate-900">{staffList.length}</span>
        </div>
      </div>

      {/* Staff List Cards */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-sm font-bold text-slate-500">स्टाफ सूची लोड हो रही है...</p>
        </div>
      ) : filteredStaff.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
          <Shield className="w-14 h-14 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-black text-slate-800">कोई स्टाफ सदस्य नहीं मिला</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            अभी तक कोई सब-एडमिन या स्टाफ खाता नहीं बनाया गया है।
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl shadow-md"
          >
            + पहला स्टाफ जोड़ें
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStaff.map((staff) => (
            <div
              key={staff._id}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                      {staff.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 leading-tight">{staff.name}</h3>
                      <p className="text-xs text-indigo-600 font-bold">@{staff.username}</p>
                      <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {staff.contact}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 uppercase">
                    Staff / SubAdmin
                  </span>
                </div>

                {/* Assigned Permissions Badges */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      स्वीकृत साइडबार अधिकार ({staff.permissions?.length || 0})
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 min-h-[48px]">
                    {staff.permissions && staff.permissions.length > 0 ? (
                      staff.permissions.map((pKey) => {
                        const mod = ALL_PERMISSION_MODULES.find(m => m.key === pKey);
                        return (
                          <span
                            key={pKey}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60 flex items-center gap-1"
                          >
                            <span>{mod?.icon || '🔹'}</span>
                            <span>{mod?.label || pKey}</span>
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-xs text-rose-500 font-bold italic">
                        ⚠️ कोई अधिकार नहीं दिया गया
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenEditModal(staff)}
                  className="flex-1 py-2 px-3 bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-black rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>अधिकार बदलें (Edit)</span>
                </button>
                <button
                  onClick={() => handleDeleteStaff(staff._id, staff.name)}
                  className="p-2 bg-white text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition-all"
                  title="हटाएं"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-indigo-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {editingStaff ? 'स्टाफ अधिकार संपादित करें' : 'नया स्टाफ खाता बनाएँ'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    साइडबार के अनुसार अनुमतियों का चयन करें
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                    स्टाफ का नाम *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="उदा. राहुल शर्मा"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                {/* Mobile Contact */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                    10-अंकीय मोबाइल नंबर *
                  </label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{10}"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="उदा. 9876543210"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                    लॉगिन यूज़रनेम (Username) *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingStaff}
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="उदा. staff_rahul"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-60"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                    {editingStaff ? 'नया पासवर्ड (बदलना हो तो ही डालें)' : 'गोपनीय पासवर्ड *'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required={!editingStaff}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={editingStaff ? 'खाली छोड़ें यदि वही रखना हो' : 'न्यूनतम 6 अक्षर'}
                      className="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Permissions Selector Box */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="block text-xs font-black text-slate-900 uppercase">
                      साइडबार अनुमतियाँ (Sidebar Permissions) *
                    </label>
                    <p className="text-[11px] text-slate-500">
                      चयनित विकल्प ही स्टाफ के लॉगिन होने पर दिखाई देंगे
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={selectAllPermissions}
                      className="px-2.5 py-1 text-[11px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg"
                    >
                      सभी चुनें (All)
                    </button>
                    <button
                      type="button"
                      onClick={clearAllPermissions}
                      className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg"
                    >
                      हटाएं (Clear)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  {ALL_PERMISSION_MODULES.map((item) => {
                    const isChecked = formData.permissions.includes(item.key);
                    return (
                      <div
                        key={item.key}
                        onClick={() => togglePermission(item.key)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isChecked
                            ? 'bg-indigo-50/80 border-indigo-300 ring-1 ring-indigo-500/30'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-xl flex-shrink-0">{item.icon}</span>
                          <div className="min-w-0">
                            <p className="text-xs font-black text-slate-900 leading-tight truncate">
                              {item.label}
                            </p>
                            <p className="text-[10px] text-slate-500 leading-tight mt-0.5 truncate">
                              {item.desc}
                            </p>
                          </div>
                        </div>

                        <div className="flex-shrink-0 ml-2">
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-indigo-600 fill-indigo-100" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
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
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-lg disabled:opacity-50"
                >
                  {submitting ? 'सहेज रहे हैं...' : editingStaff ? 'अपडेट करें (Save)' : 'खाता बनाएँ (Create)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
