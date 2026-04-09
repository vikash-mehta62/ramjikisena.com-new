'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, User } from '@/lib/auth';
import { Sparkles, Edit2, Check, X } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function ProfilePage() {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', city: '', contact: '', about: '', dob: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    authApi.getCurrentUser().then(u => {
      if (!u) { router.push('/login'); return; }
      setUser(u);
      setFormData({ name: u.name, city: u.city, contact: u.contact, about: u.about || '', dob: u.dob ? u.dob.slice(0, 10) : '' });
      setLoading(false);
    }).catch(() => router.push('/login'));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Profile update ho gaya! ✅');
        setEditing(false);
        authApi.getCurrentUser().then(u => { if (u) setUser(u); });
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch {
      toast.error('Error updating profile');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Apni profile manage karein</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-sm border-2 border-orange-100 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-orange-500 to-red-500" />
        <div className="px-6 pb-6">
          <div className="flex justify-between items-end -mt-12 mb-4">
            <div className="w-24 h-24 bg-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-orange-500" />
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Contact</label>
                <input
                  type="tel"
                  value={formData.contact}
                  onChange={e => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Date of Birth 🎂</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  max={new Date().toISOString().slice(0, 10)}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">
                  About Me{' '}
                  <span className="text-xs font-normal text-slate-400">({formData.about.length}/300)</span>
                </label>
                <textarea
                  value={formData.about}
                  rows={3}
                  onChange={e => setFormData({ ...formData, about: e.target.value.slice(0, 300) })}
                  placeholder="Apne baare mein kuch likhein... (optional)"
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm resize-none"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      name: user?.name || '',
                      city: user?.city || '',
                      contact: user?.contact || '',
                      about: user?.about || '',
                      dob: user?.dob ? user.dob.slice(0, 10) : '',
                    });
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-black text-slate-900">{user?.name}</h2>
              <p className="text-slate-400 text-sm mb-3">@{user?.username}</p>
              {user?.about ? (
                <p className="text-slate-600 text-sm mb-4 leading-relaxed bg-orange-50 rounded-xl px-4 py-3 border border-orange-100">
                  {user.about}
                </p>
              ) : (
                <p className="text-slate-400 text-sm mb-4 italic">
                  No bio yet.{' '}
                  <button
                    onClick={() => setEditing(true)}
                    className="text-orange-500 hover:underline not-italic font-semibold"
                  >
                    Add one
                  </button>
                </p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-orange-50 text-orange-700 rounded-xl p-3">
                  <p className="text-xs font-bold opacity-60 mb-0.5">City</p>
                  <p className="font-bold">{user?.city || '—'}</p>
                </div>
                <div className="bg-orange-50 text-orange-700 rounded-xl p-3">
                  <p className="text-xs font-bold opacity-60 mb-0.5">Contact</p>
                  <p className="font-bold">{user?.contact || '—'}</p>
                </div>
                <div className="bg-blue-50 text-blue-700 rounded-xl p-3">
                  <p className="text-xs font-bold opacity-60 mb-0.5">Rank</p>
                  <p className="font-bold">#{user?.rank}</p>
                </div>
                <div className="bg-green-50 text-green-700 rounded-xl p-3">
                  <p className="text-xs font-bold opacity-60 mb-0.5">Role</p>
                  <p className="font-bold capitalize">{user?.role || '—'}</p>
                </div>
                {user?.dob && (
                  <div className="bg-pink-50 text-pink-700 rounded-xl p-3 col-span-2">
                    <p className="text-xs font-bold opacity-60 mb-0.5">Date of Birth 🎂</p>
                    <p className="font-bold">
                      {new Date(user.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spiritual Stats */}
      <div className="bg-white rounded-2xl shadow-sm border-2 border-orange-100 p-5">
        <h3 className="font-black text-slate-800 mb-4">Spiritual Stats</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-purple-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-purple-600">{user?.totalCount || 0}</p>
            <p className="text-xs font-bold text-slate-500 mt-1">Total Count</p>
          </div>
          <div className="bg-pink-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-pink-600">{Number(user?.mala || 0).toFixed(2)}</p>
            <p className="text-xs font-bold text-slate-500 mt-1">Total Mala</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-yellow-600">{user?.dailyCounts?.length || 0}</p>
            <p className="text-xs font-bold text-slate-500 mt-1">Days Active</p>
          </div>
        </div>
      </div>

    </div>
  );
}
