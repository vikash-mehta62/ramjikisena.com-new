'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, User } from '@/lib/auth';
import { Edit2, Check, X, Camera, Upload } from 'lucide-react';
import { useToast } from '@/components/Toast';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', UPLOAD_PRESET!);
  fd.append('folder', folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: fd });
  const data = await res.json();
  if (!data.secure_url) throw new Error('Upload failed');
  return data.secure_url;
}

function AvatarUpload({ src, name, onChange }: { src?: string | null; name: string; onChange: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, 'profile_avatars');
      onChange(url);
    } catch { alert('Upload failed'); }
    setUploading(false);
  };

  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      {src ? (
        <img src={src} alt={name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg" />
      ) : (
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 border-4 border-white shadow-lg flex items-center justify-center text-white text-3xl font-black">
          {name?.charAt(0)?.toUpperCase()}
        </div>
      )}
      <button onClick={() => ref.current?.click()}
        className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors">
        {uploading ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Camera className="w-4 h-4" />}
      </button>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handle} />
    </div>
  );
}

function CoverUpload({ src, onChange }: { src?: string | null; onChange: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, 'profile_covers');
      onChange(url);
    } catch { alert('Upload failed'); }
    setUploading(false);
  };

  return (
    <div className="relative h-32 rounded-t-3xl overflow-hidden group cursor-pointer" onClick={() => ref.current?.click()}>
      {src ? (
        <img src={src} alt="cover" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-orange-500 to-red-500" />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-white/90 text-slate-800 px-4 py-2 rounded-xl font-bold text-sm">
          {uploading ? <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading...' : 'Change Cover'}
        </div>
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handle} />
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '', city: '', contact: '', about: '', dob: '',
    profileImage: '', coverImage: '',
  });

  useEffect(() => {
    authApi.getCurrentUser().then(u => {
      if (!u) { router.push('/login'); return; }
      setUser(u);
      setFormData({
        name: u.name, city: u.city, contact: u.contact,
        about: u.about || '', dob: u.dob ? u.dob.slice(0, 10) : '',
        profileImage: u.profileImage || '', coverImage: u.coverImage || '',
      });
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
    } catch { toast.error('Error updating profile'); }
    setSaving(false);
  };

  // Save images immediately when changed
  const saveImage = async (field: 'profileImage' | 'coverImage', url: string) => {
    setFormData(f => ({ ...f, [field]: url }));
    const token = localStorage.getItem('token');
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        credentials: 'include',
        body: JSON.stringify({ [field]: url }),
      });
      toast.success(field === 'profileImage' ? 'Avatar update ho gaya!' : 'Cover update ho gaya!');
      authApi.getCurrentUser().then(u => { if (u) setUser(u); });
    } catch { toast.error('Image save failed'); }
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
        {/* Cover */}
        <CoverUpload src={user?.coverImage} onChange={url => saveImage('coverImage', url)} />

        <div className="px-6 pb-6">
          <div className="flex justify-between items-end -mt-12 mb-4">
            <AvatarUpload
              src={user?.profileImage}
              name={user?.name || 'U'}
              onChange={url => saveImage('profileImage', url)}
            />
            {!editing && (
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors">
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              {[
                { label: 'Name', key: 'name', type: 'text' },
                { label: 'City', key: 'city', type: 'text' },
                { label: 'Contact', key: 'contact', type: 'tel' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm font-bold text-slate-600 mb-1">{label}</label>
                  <input type={type} value={formData[key as keyof typeof formData]}
                    onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Date of Birth 🎂</label>
                <input type="date" value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  max={new Date().toISOString().slice(0, 10)}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">
                  About Me <span className="text-xs font-normal text-slate-400">({formData.about.length}/300)</span>
                </label>
                <textarea value={formData.about} rows={3}
                  onChange={e => setFormData({ ...formData, about: e.target.value.slice(0, 300) })}
                  placeholder="Apne baare mein kuch likhein..."
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 disabled:opacity-50">
                  <Check className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => { setEditing(false); setFormData({ name: user?.name || '', city: user?.city || '', contact: user?.contact || '', about: user?.about || '', dob: user?.dob ? user.dob.slice(0, 10) : '', profileImage: user?.profileImage || '', coverImage: user?.coverImage || '' }); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-300">
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-black text-slate-900">{user?.name}</h2>
              <p className="text-slate-400 text-sm mb-3">@{user?.username}</p>
              {user?.about ? (
                <p className="text-slate-600 text-sm mb-4 leading-relaxed bg-orange-50 rounded-xl px-4 py-3 border border-orange-100">{user.about}</p>
              ) : (
                <p className="text-slate-400 text-sm mb-4 italic">
                  No bio yet. <button onClick={() => setEditing(true)} className="text-orange-500 hover:underline not-italic font-semibold">Add one</button>
                </p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-orange-50 text-orange-700 rounded-xl p-3"><p className="text-xs font-bold opacity-60 mb-0.5">City</p><p className="font-bold">{user?.city || '—'}</p></div>
                <div className="bg-orange-50 text-orange-700 rounded-xl p-3"><p className="text-xs font-bold opacity-60 mb-0.5">Contact</p><p className="font-bold">{user?.contact || '—'}</p></div>
                <div className="bg-blue-50 text-blue-700 rounded-xl p-3"><p className="text-xs font-bold opacity-60 mb-0.5">Rank</p><p className="font-bold">#{user?.rank}</p></div>
                <div className="bg-green-50 text-green-700 rounded-xl p-3"><p className="text-xs font-bold opacity-60 mb-0.5">Role</p><p className="font-bold capitalize">{user?.role || '—'}</p></div>
                {user?.dob && (
                  <div className="bg-pink-50 text-pink-700 rounded-xl p-3 col-span-2">
                    <p className="text-xs font-bold opacity-60 mb-0.5">Date of Birth 🎂</p>
                    <p className="font-bold">{new Date(user.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
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
          <div className="bg-purple-50 rounded-xl p-3 text-center"><p className="text-2xl font-black text-purple-600">{user?.totalCount || 0}</p><p className="text-xs font-bold text-slate-500 mt-1">Total Count</p></div>
          <div className="bg-pink-50 rounded-xl p-3 text-center"><p className="text-2xl font-black text-pink-600">{Number(user?.mala || 0).toFixed(2)}</p><p className="text-xs font-bold text-slate-500 mt-1">Total Mala</p></div>
          <div className="bg-yellow-50 rounded-xl p-3 text-center"><p className="text-2xl font-black text-yellow-600">{user?.dailyCounts?.length || 0}</p><p className="text-xs font-bold text-slate-500 mt-1">Days Active</p></div>
        </div>
      </div>
    </div>
  );
}
