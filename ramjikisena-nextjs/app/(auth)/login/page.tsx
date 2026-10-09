'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/auth';
import {
  User, Lock, ArrowLeft, Loader2, Flag,
  Eye, EyeOff, Crown, Sparkles, ShieldCheck, Flame
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
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
        } else if (result.user?.role === 'admin' || result.user?.role === 'staff' || result.user?.role === 'subadmin') {
          router.push('/admin/admin-dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0d0400 0%, #1a0800 50%, #0d0400 100%)',
      }}
    >
      {/* Background Spiritual Symbols */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="text-[34rem] font-black leading-none"
          style={{ color: 'rgba(212,146,10,0.03)' }}
        >
          ॐ
        </span>
      </div>

      {/* Radial divine golden glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 35%, rgba(212,146,10,0.18) 0%, transparent 68%)',
        }}
      />

      <div className="w-full max-w-md relative z-10 my-8">
        {/* Top Divine Emblem & Branding */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3 shadow-2xl transition-transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #f9e07a 0%, #d4920a 55%, #b8760a 100%)',
              boxShadow: '0 10px 28px rgba(212,146,10,0.45)',
            }}
          >
            <Flag className="w-8 h-8" style={{ color: '#451200' }} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-black tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>श्री राम नाम संकीर्तन बैंक</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            भक्त एवं <span style={{ color: '#f9e07a' }}>व्यवस्थापक</span> लॉगिन
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: 'rgba(255,210,140,0.6)' }}>
            राम नाम जप, प्रोफाइल एवं Admin एक्सेस हेतु लॉगिन करें
          </p>

          {/* Badges for clarity */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/15">
              🙏 Bhakt / User Portal
            </span>
            <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/35 flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-300" /> Admin Supported
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div
          className="rounded-[2.2rem] p-7 sm:p-8 relative overflow-hidden"
          style={{
            background: 'rgba(24, 10, 3, 0.75)',
            border: '1px solid rgba(249, 224, 122, 0.28)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
          }}
        >
          {/* Subtle Corner Ornament */}
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-amber-400/10 via-transparent to-transparent pointer-events-none" />

          {/* Admin Guidance Callout */}
          <div
            className="mb-5 p-3 rounded-2xl flex items-start gap-2.5 text-xs font-semibold leading-relaxed"
            style={{
              background: 'rgba(212,146,10,0.1)',
              border: '1px solid rgba(212,146,10,0.25)',
              color: '#fde68a',
            }}
          >
            <Crown className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-amber-300">व्यवस्थापक (Admin):</span> Admin भी अपने ID/Password से यहीं लॉगिन करें। सफल लॉगिन के बाद आप सीधे Admin Dashboard पर पहुँचेंगे।
            </div>
          </div>

          {error && (
            <div
              className="px-4 py-3 rounded-2xl mb-5 flex items-center gap-2 text-sm font-bold animate-shake"
              style={{
                background: 'rgba(220,38,38,0.18)',
                border: '1px solid rgba(220,38,38,0.35)',
                color: '#fca5a5',
              }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Mobile input */}
            <div>
              <label
                className="block text-[11px] font-black uppercase tracking-wider mb-2"
                style={{ color: 'rgba(255,210,140,0.7)' }}
              >
                यूज़रनेम (Username)
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: '#f9e07a' }}
                />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all placeholder:text-white/30"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(200,130,0,0.35)',
                    color: 'white',
                  }}
                  placeholder="अपना Username दर्ज करें (उदा. ram_bhakt या admin)"
                  required
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label
                className="block text-[11px] font-black uppercase tracking-wider mb-2"
                style={{ color: 'rgba(255,210,140,0.7)' }}
              >
                पासवर्ड (Password)
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: '#f9e07a' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all placeholder:text-white/30"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(200,130,0,0.35)',
                    color: 'white',
                  }}
                  placeholder="अपना पासवर्ड दर्ज करें"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot / Mobile Login Link */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-white/40">पासवर्ड याद नहीं?</span>
              <Link
                href="/forgot"
                className="text-xs font-black hover:underline transition-all flex items-center gap-1"
                style={{ color: '#f9e07a' }}
              >
                <span>📱 मोबाइल नंबर से लॉगिन</span>
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60 cursor-pointer shadow-xl hover:brightness-110"
              style={{
                background: 'linear-gradient(135deg, #f9e07a 0%, #d4920a 55%, #b8760a 100%)',
                color: '#3a0f00',
                boxShadow: '0 8px 24px rgba(212,146,10,0.4)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>प्रवेश हो रहा है...</span>
                </>
              ) : (
                <>
                  <span>🙏 लॉगिन करें / Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Devotee Registration Link */}
          <div
            className="mt-6 pt-5 text-center"
            style={{ borderTop: '1px solid rgba(200,130,0,0.2)' }}
          >
            <p className="text-sm" style={{ color: 'rgba(255,210,140,0.65)' }}>
              नये भक्त सदस्य हैं?{' '}
              <Link
                href="/register"
                className="font-black hover:underline transition-all"
                style={{ color: '#f9e07a' }}
              >
                यहाँ रजिस्टर करें ✨
              </Link>
            </p>
          </div>
        </div>

        {/* Dedicated Pandit Switcher Banner (Distinct & Prominent) */}
        <div
          className="mt-5 p-4 rounded-2xl flex items-center justify-between gap-3 transition-all hover:border-orange-500/50"
          style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(249,115,22,0.16))',
            border: '1px solid rgba(249,115,22,0.3)',
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(239,68,68,0.25), rgba(249,115,22,0.3))',
                border: '1px solid rgba(249,115,22,0.4)',
              }}
            >
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-white truncate">
                क्या आप पंडित जी / पुरोहित हैं?
              </p>
              <p className="text-[11px] text-white/50 truncate">
                पूजा, कर्मकांड एवं यजमान बुकिंग पोर्टल
              </p>
            </div>
          </div>
          <Link
            href="/pandit/login"
            className="flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-orange-600 to-red-600 hover:brightness-110 shadow-lg active:scale-95 transition-all"
          >
            पंडित लॉगिन →
          </Link>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs font-bold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
            style={{ color: 'rgba(255,210,140,0.5)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>मुख्य पृष्ठ पर वापस जाएं (Back to Home)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
