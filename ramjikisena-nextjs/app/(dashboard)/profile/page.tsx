'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi, User } from '@/lib/auth';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    contact: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userData = await authApi.getCurrentUser();
      if (!userData) {
        router.push('/login');
        return;
      }
      setUser(userData);
      setFormData({
        name: userData.name,
        city: userData.city,
        contact: userData.contact,
      });
      setLoading(false);
    } catch (error) {
      router.push('/login');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('Profile updated successfully! ✅');
        setEditing(false);
        fetchProfile();
      } else {
        setMessage(data.message || 'Failed to update profile');
      }
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🙏</div>
          <p className="text-xl text-orange-700">Loading...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <h1 className="text-2xl font-bold">My Profile</h1>
            </div>
            <Link href="/dashboard" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition">
              ← Back
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-orange-200">
            {/* Cover */}
            <div className="h-32 bg-gradient-to-r from-orange-500 to-red-500"></div>
            
            {/* Profile Info */}
            <div className="px-6 pb-6">
              {/* Avatar */}
              <div className="flex justify-center -mt-16 mb-4">
                <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-6xl">
                  🙏
                </div>
              </div>

              {/* Message */}
              {message && (
                <div className={`mb-4 p-3 rounded-lg text-center ${
                  message.includes('✅') 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              {/* Edit/View Mode */}
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Contact</label>
                    <input
                      type="tel"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                      maxLength={10}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: user?.name || '',
                          city: user?.city || '',
                          contact: user?.contact || '',
                        });
                      }}
                      className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">{user?.name}</h2>
                    <p className="text-gray-600">@{user?.username}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-orange-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600">City</p>
                      <p className="text-lg font-semibold text-orange-700">{user?.city}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600">Contact</p>
                      <p className="text-lg font-semibold text-orange-700">{user?.contact}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600">Rank</p>
                      <p className="text-lg font-semibold text-blue-700">#{user?.rank}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600">Role</p>
                      <p className="text-lg font-semibold text-green-700 capitalize">{user?.role}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditing(true)}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition mt-4"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200">
            <h3 className="text-2xl font-bold text-orange-700 mb-4">Spiritual Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-xl text-center">
                <p className="text-sm text-gray-700">Total Count</p>
                <p className="text-3xl font-bold text-purple-700">{user?.totalCount || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-4 rounded-xl text-center">
                <p className="text-sm text-gray-700">Total Mala</p>
                <p className="text-3xl font-bold text-pink-700">{user?.mala || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-4 rounded-xl text-center">
                <p className="text-sm text-gray-700">Days Active</p>
                <p className="text-3xl font-bold text-yellow-700">{user?.dailyCounts?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
