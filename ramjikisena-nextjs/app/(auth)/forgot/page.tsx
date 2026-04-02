'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, ArrowLeft, Loader2, Flag } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!/^[0-9]{10}$/.test(contact)) {
      setError('कृपया 10 अंकों का मोबाइल नंबर डालें');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forgot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ contact }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.token) localStorage.setItem('token', data.token);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
        router.push(data.redirect || '/dashboard');
      } else {
        setError(data.message || 'Invalid phone number');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0f0500 0%, #1a0800 50%, #0f0500 100%)' }}>

      {/* OM background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[32rem] font-black leading-none" style={{ color: 'rgba(200,130,0,0.04)' }}>ॐ</span>
      </div>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(180,100,0,0.15) 0%, transparent 65%)' }} />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-xl"
            style={{ background: 'linear-gradient(135deg, #f9e07a, #d4920a)', boxShadow: '0 8px 24px rgba(180,100,0,0.4)' }}>
            <Flag className="w-7 h-7" style={{ color: '#3a0f00' }} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            RAMJI KI <span style={{ color: '#f9e07a' }}>SENA</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,200,120,0.5)' }}>मोबाइल नंबर से लॉगिन करें</p>
        </div>

        {/* Card */}
        <div className="rounded-[2rem] p-8"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,130,0,0.25)', backdropFilter: 'blur(12px)' }}>

          <h2 className="text-xl font-black text-center mb-6" style={{ color: '#f9e07a' }}>
            📱 Mobile Login
          </h2>

          {error && (
            <div className="px-4 py-3 rounded-2xl mb-5 flex items-center gap-2 text-sm font-bold"
              style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', color: '#fca5a5' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2"
                style={{ color: 'rgba(255,200,120,0.5)' }}>मोबाइल नंबर</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#d4920a' }} />
                <input type="tel" value={contact}
                  onChange={e => setContact(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-bold focus:outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(200,130,0,0.3)',
                    color: 'white',
                  }}
                  placeholder="9876543210"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required />
              </div>
              <p className="text-xs mt-2" style={{ color: 'rgba(255,200,120,0.35)' }}>
                अपना रजिस्टर्ड मोबाइल नंबर डालें
              </p>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #f9e07a 0%, #d4920a 60%, #b8760a 100%)',
                color: '#3a0f00',
                boxShadow: '0 6px 20px rgba(180,100,0,0.4)',
              }}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</> : '🙏 लॉगिन / Login'}
            </button>
          </form>

          <div className="mt-6 pt-5 space-y-3 text-center" style={{ borderTop: '1px solid rgba(200,130,0,0.15)' }}>
            <p className="text-sm" style={{ color: 'rgba(255,200,120,0.5)' }}>
              Username से लॉगिन करें?{' '}
              <Link href="/login" className="font-black hover:opacity-80 transition-all" style={{ color: '#f9e07a' }}>
                Login with Username
              </Link>
            </p>
            <p className="text-sm" style={{ color: 'rgba(255,200,120,0.5)' }}>
              नये सदस्य हैं?{' '}
              <Link href="/register" className="font-black hover:opacity-80 transition-all" style={{ color: '#f9e07a' }}>
                Register करें ✨
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm font-black inline-flex items-center gap-2 hover:gap-3 transition-all"
            style={{ color: 'rgba(255,200,120,0.5)' }}>
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
