'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  Phone,
  User,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { setAstrologerAuth } from '@/lib/astrologerAuth';

export default function AstrologerLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
      const response = await fetch(`${apiUrl}/api/astrology-auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success && data.token) {
        setAstrologerAuth(data.token, data.astrologer);
        router.push('/astrologer/dashboard');
      } else {
        setError(data.message || 'लॉगिन असफल रहा। कृपया पुनः प्रयास करें।');
      }
    } catch (err) {
      console.error('Astrologer login error:', err);
      setError('सर्वर से संपर्क नहीं हो पाया। कृपया नेटवर्क जांचें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(155deg, #140803 0%, #2a1106 50%, #150802 100%)',
      }}
    >
      {/* Background Celestial Watermark */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-[0.03] overflow-hidden text-center">
        <span className="text-[26rem] font-black leading-none text-amber-400">
          🔮
        </span>
      </div>

      {/* Radial Gold/Amber Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 35%, rgba(245,158,11,0.2) 0%, rgba(180,83,9,0.06) 55%, transparent 75%)',
        }}
      />

      <div className="w-full max-w-md relative z-10 my-8">
        {/* Top Header Badge */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 shadow-lg"
            style={{
              background: 'linear-gradient(90deg, rgba(217,119,6,0.25), rgba(245,158,11,0.3), rgba(217,119,6,0.25))',
              border: '1px solid rgba(245,158,11,0.4)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[11px] font-black tracking-widest text-amber-200">
              ज्योतिष एवं टैरो रीडर पोर्टल
            </span>
          </div>

          {/* Central Crystal Ball Icon */}
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl transition-transform hover:scale-105 mx-auto mb-3"
            style={{
              background: 'linear-gradient(135deg, #92400e 0%, #d97706 60%, #fbbf24 100%)',
              boxShadow: '0 12px 32px rgba(217,119,6,0.45)',
            }}>
            <span className="text-4xl select-none">🔮</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            ज्योतिषी लॉगिन
          </h1>
          <p className="text-xs text-amber-200/70 mt-1">
            अपने परामर्श सत्र एवं क्लाइंट्स का प्रबंधन करें
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-200/60">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Phone or Username */}
            <div>
              <label className="block font-black text-slate-700 uppercase tracking-wider mb-1.5">
                मोबाइल नंबर या यूजरनेम
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="मोबाइल नंबर या @username"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-slate-800"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-black text-slate-700 uppercase tracking-wider mb-1.5">
                पासवर्ड
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="अपना पासवर्ड दर्ज करें"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-black text-sm text-slate-950 transition-all shadow-xl active:scale-95 disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #f9e07a 0%, #d4920a 60%, #b8760a 100%)',
                boxShadow: '0 6px 20px rgba(212,146,10,0.35)',
              }}
            >
              {loading ? 'सत्यापन हो रहा है...' : 'डैशबोर्ड में प्रवेश करें'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center space-y-3">
            <p className="text-xs text-slate-600 font-semibold">
              नया खाता बनाना चाहते हैं?{' '}
              <Link href="/astrologer/register" className="text-amber-700 font-black hover:underline">
                यहाँ रजिस्टर करें
              </Link>
            </p>

            <Link
              href="/astrology"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 font-bold transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> वापस डायरेक्टरी पर जाएं
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
