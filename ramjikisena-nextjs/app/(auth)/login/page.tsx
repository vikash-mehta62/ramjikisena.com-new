'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/auth';
import { User, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import MusicPlayer from '@/components/MusicPlayer';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authApi.login(formData.username, formData.password);

      if (result.success) {
        if (result.redirect) {
          router.push(result.redirect);
        } else if (result.user?.role === 'admin') {
          router.push('/admin/admin-dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFAF3] flex items-center justify-center p-4 relative overflow-hidden">
      <MusicPlayer />

      {/* Subtle ॐ background decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[28rem] font-black text-orange-600/[0.03] leading-none">ॐ</span>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-600 rounded-full shadow-xl mb-4">
            <span className="text-4xl">🚩</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">RAMJI KI SENA</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">राम नाम लेखन हेतु लॉगिन करें</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[2rem] border border-orange-100 shadow-xl p-8">
          <h2 className="text-xl font-black text-slate-900 text-center mb-6">लॉगिन / Login</h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-2xl mb-6 flex items-center gap-2 text-sm font-bold">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 w-4 h-4" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-11 pr-4 bg-white border border-orange-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-orange-500 outline-none shadow-sm focus:ring-2 focus:ring-orange-200"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 w-4 h-4" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-4 bg-white border border-orange-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-orange-500 outline-none shadow-sm focus:ring-2 focus:ring-orange-200"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="text-right">
              <Link href="/forgot" className="text-orange-600 hover:text-orange-700 text-xs font-black hover:underline">
                📱 Login With Mobile Number?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white rounded-2xl font-black py-4 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                '🙏 लॉगिन / Login'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-orange-50 text-center">
            <p className="text-slate-500 text-sm">
              नये सदस्य हैं?{' '}
              <Link href="/register" className="text-orange-600 hover:text-orange-700 font-black hover:underline">
                Register karein ✨
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-orange-600 hover:text-orange-700 font-black text-sm inline-flex items-center gap-2 hover:gap-3 transition-all">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
