'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Phone, Lock, Eye, EyeOff, ShieldCheck, User } from 'lucide-react';
import AuthShell, { AuthField, AuthError, AuthSubmit, AuthSwitch } from '@/components/AuthShell';

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
    <AuthShell
      kicker="Purohit Portal"
      title={<>पंडित एवं <span className="text-orange-600">पुरोहित</span> पोर्टल</>}
      sub="यजमान पूजा बुकिंग, अनुष्ठान एवं दक्षिणा प्रबंधन"
      sideImage="/home/pandit.jpg"
      sideQuote="ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्"
      sideAuthor="गायत्री मंत्र"
      below={
        <AuthSwitch
          icon={<User className="w-5 h-5" />}
          title="क्या आप सामान्य भक्त या Admin हैं?"
          sub="राम नाम जप, प्रोफाइल एवं Admin एक्सेस"
          href="/login"
          cta="भक्त/Admin लॉगिन →"
        />
      }
    >
      <div className="mb-6 grid grid-cols-3 gap-2 p-3 rounded-xl bg-orange-50/60 border border-orange-100 text-center">
        {[
          ['पूजा प्रबंधन', '📅 बुकिंग्स'],
          ['पारदर्शिता', '💰 दक्षिणा विवरण'],
          ['स्वायत्तता', '📿 शुल्क व तिथि'],
        ].map(([k, v]) => (
          <div key={k}>
            <p className="text-[10px] text-slate-500 font-semibold">{k}</p>
            <p className="text-xs font-bold text-orange-700 mt-0.5">{v}</p>
          </div>
        ))}
      </div>

      {error && <AuthError>{error}</AuthError>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          label="पंजीकृत मोबाइल नंबर अथवा पंडित ID"
          icon={Phone}
          type="text"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="10-अंकीय मोबाइल नंबर या Username"
          required
        />
        <AuthField
          label="गोपनीय पासवर्ड (Password)"
          icon={Lock}
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="अपना पासवर्ड दर्ज करें"
          required
          trailing={
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-orange-600 cursor-pointer" aria-label="पासवर्ड दिखाएं">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        <p className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" /> सुरक्षित पुरोहित सत्यापन एवं डेटा सुरक्षा
        </p>

        <AuthSubmit loading={loading} loadingText="सत्यापन हो रहा है...">🔱 पुरोहित पोर्टल में प्रवेश करें</AuthSubmit>
      </form>

      <p className="mt-6 pt-5 border-t border-orange-100 text-center text-sm text-slate-600">
        क्या आप नए पंडित जी हैं?{' '}
        <Link href="/pandit/register" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">पुरोहित पंजीकरण करें 🕉️</Link>
      </p>
    </AuthShell>
  );
}
