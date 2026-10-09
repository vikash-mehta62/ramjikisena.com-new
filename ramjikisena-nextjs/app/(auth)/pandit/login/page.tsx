'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Phone, Lock, Eye, EyeOff, ArrowLeft, Loader2,
  Flame, Sparkles, CheckCircle2, ShieldCheck, User
} from 'lucide-react';

export default function PanditLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: '',
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101'}/api/pandit-auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Save token and pandit info to localStorage and broadcast event
        if (data.token && data.pandit) {
          localStorage.setItem('panditToken', data.token);
          localStorage.setItem('pandit', JSON.stringify(data.pandit));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth-change'));
          }
        }

        // Redirect to pandit dashboard
        router.push('/pandit/dashboard');
      } else {
        setError(data.message || 'लॉगिन असफल रहा। कृपया पुनः प्रयास करें।');
      }
    } catch (err) {
      setError('सर्वर से संपर्क नहीं हो पाया। कृपया इंटरनेट कनेक्शन जांचें।');
      console.error('Pandit login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(155deg, #180303 0%, #290808 45%, #190303 100%)',
      }}
    >
      {/* Background Sacred Sanskrit Mantra Watermark */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-[0.035] overflow-hidden text-center">
        <p className="text-8xl sm:text-9xl font-black text-red-500 whitespace-nowrap">
          ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं
        </p>
        <p className="text-8xl sm:text-9xl font-black text-amber-500 whitespace-nowrap mt-8">
          भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्
        </p>
        <span className="text-[28rem] font-black leading-none text-red-400 mt-4">
          🕉️
        </span>
      </div>

      {/* Deep Sacred Vermillion & Crimson Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(220,38,38,0.22) 0%, rgba(185,28,28,0.08) 50%, transparent 72%)',
        }}
      />

      <div className="w-full max-w-lg relative z-10 my-8">
        {/* Top Vedic Sanskrit Shloka Ribbon */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 shadow-lg"
            style={{
              background: 'linear-gradient(90deg, rgba(220,38,38,0.2), rgba(249,115,22,0.25), rgba(220,38,38,0.2))',
              border: '1px solid rgba(249,115,22,0.35)',
            }}
          >
            <span className="text-xs">🪔</span>
            <span className="text-[11px] font-black tracking-widest text-amber-200">
              वैदिक पुरोहित एवं कर्मकांड सेवा मंच
            </span>
            <span className="text-xs">🪔</span>
          </div>

          {/* Central Purohit Icon */}
          <div className="relative inline-block mb-3">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl transition-transform hover:scale-105 mx-auto"
              style={{
                background: 'linear-gradient(135deg, #b91c1c 0%, #ea580c 55%, #f59e0b 100%)',
                boxShadow: '0 12px 32px rgba(220,38,38,0.45)',
              }}
            >
              <span className="text-4xl select-none">🕉️</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-red-950 p-1.5 rounded-xl shadow-md">
              <Flame className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            पंडित एवं <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">पुरोहित</span> पोर्टल
          </h1>
          <p className="text-xs sm:text-sm mt-1 text-red-200/70 font-medium">
            यजमान पूजा बुकिंग, अनुष्ठान एवं दक्षिणा प्रबंधन
          </p>

          {/* Purohit Badges */}
          <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
            <span className="text-[10px] font-black px-3 py-1 rounded-full bg-red-600/25 text-red-200 border border-red-500/35 flex items-center gap-1">
              <span>🔱</span> अधिकृत पुरोहित लॉगिन
            </span>
            <span className="text-[10px] font-black px-3 py-1 rounded-full bg-orange-600/25 text-orange-200 border border-orange-500/35 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-orange-300" /> यजमान बुकिंग सेवा
            </span>
          </div>
        </div>

        {/* Traditional Styled Card */}
        <div
          className="rounded-[2.4rem] p-7 sm:p-9 relative overflow-hidden"
          style={{
            background: 'rgba(38, 10, 10, 0.85)',
            border: '1px solid rgba(249, 115, 22, 0.35)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85)',
          }}
        >
          {/* Top Traditional Accent Line */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{
              background: 'linear-gradient(90deg, #dc2626, #ea580c, #f59e0b, #ea580c, #dc2626)',
            }}
          />

          {/* Quick Purohit Highlights Bar */}
          <div
            className="mb-6 p-3.5 rounded-2xl grid grid-cols-3 gap-2 text-center"
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(249, 115, 22, 0.2)',
            }}
          >
            <div>
              <p className="text-[10px] text-amber-200/60 font-bold uppercase">पूजा प्रबंधन</p>
              <p className="text-xs font-black text-amber-300 mt-0.5">📅 बुकिंग्स</p>
            </div>
            <div className="border-x border-orange-500/20">
              <p className="text-[10px] text-amber-200/60 font-bold uppercase">पारदर्शिता</p>
              <p className="text-xs font-black text-amber-300 mt-0.5">💰 दक्षिणा विवरण</p>
            </div>
            <div>
              <p className="text-[10px] text-amber-200/60 font-bold uppercase">स्वायत्तता</p>
              <p className="text-xs font-black text-amber-300 mt-0.5">📿 शुल्क व तिथि</p>
            </div>
          </div>

          {error && (
            <div
              className="mb-5 p-3.5 rounded-2xl flex items-center gap-2.5 text-sm font-bold"
              style={{
                background: 'rgba(220, 38, 38, 0.22)',
                border: '1px solid rgba(220, 38, 38, 0.45)',
                color: '#fca5a5',
              }}
            >
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Number / Username */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider mb-2 text-orange-200/80">
                पंजीकृत मोबाइल नंबर अथवा पंडित ID
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10-अंकीय मोबाइल नंबर या Username"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-bold text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/60 transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(249, 115, 22, 0.35)',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider mb-2 text-orange-200/80">
                गोपनीय पासवर्ड (Password)
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="अपना पासवर्ड दर्ज करें"
                  required
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl text-sm font-bold text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/60 transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(249, 115, 22, 0.35)',
                  }}
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

            {/* Verification Security Note */}
            <div className="flex items-center gap-2 pt-1 text-[11px] text-amber-200/70">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>सुरक्षित पुरोहित सत्यापन एवं डेटा सुरक्षा</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60 cursor-pointer shadow-xl text-white hover:brightness-110"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #d97706 100%)',
                boxShadow: '0 8px 26px rgba(220, 38, 38, 0.45)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>सत्यापन हो रहा है...</span>
                </>
              ) : (
                <>
                  <span>🔱 पुरोहित पोर्टल में प्रवेश करें (Enter Dashboard)</span>
                </>
              )}
            </button>
          </form>

          {/* New Pandit Register Link */}
          <div
            className="mt-6 pt-5 text-center"
            style={{ borderTop: '1px solid rgba(249, 115, 22, 0.2)' }}
          >
            <p className="text-sm text-amber-100/70">
              क्या आप नए पंडित जी हैं?{' '}
              <Link
                href="/pandit/register"
                className="font-black text-amber-300 hover:underline transition-all"
              >
                पुरोहित पंजीकरण करें 🕉️
              </Link>
            </p>
          </div>
        </div>

        {/* Distinct Devotee & Admin Switcher Banner */}
        <div
          className="mt-5 p-4 rounded-2xl flex items-center justify-between gap-3 transition-all hover:border-amber-400/50"
          style={{
            background: 'linear-gradient(135deg, rgba(212, 146, 10, 0.12), rgba(249, 224, 122, 0.08))',
            border: '1px solid rgba(212, 146, 10, 0.3)',
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(249, 224, 122, 0.25), rgba(212, 146, 10, 0.3))',
                border: '1px solid rgba(249, 224, 122, 0.4)',
              }}
            >
              <User className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-white truncate">
                क्या आप सामान्य भक्त या व्यवस्थापक (Admin) हैं?
              </p>
              <p className="text-[11px] text-white/50 truncate">
                राम नाम जप, प्रोफाइल एवं Admin एक्सेस
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-110 shadow-lg active:scale-95 transition-all"
          >
            भक्त/Admin लॉगिन →
          </Link>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs font-bold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all text-amber-200/50 hover:text-amber-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>मुख्य पृष्ठ पर वापस जाएं (Back to Home)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
