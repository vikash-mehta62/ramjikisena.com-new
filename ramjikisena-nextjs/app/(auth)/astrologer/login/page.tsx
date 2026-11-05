'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, ArrowLeft, Phone, ChevronRight } from 'lucide-react';
import { setAstrologerAuth } from '@/lib/astrologerAuth';
import AuthShell, { AuthField, AuthError, AuthSubmit } from '@/components/AuthShell';

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
    <AuthShell
      kicker="Astrologer Portal"
      title={<>ज्योतिषी <span className="text-orange-600">लॉगिन</span></>}
      sub="अपने परामर्श सत्र एवं क्लाइंट्स का प्रबंधन करें"
      sideQuote="ज्योतिष वेद का नेत्र है — सही समय पर सही मार्गदर्शन"
      sideAuthor="वेदांग ज्योतिष"
    >
      {error && <AuthError>{error}</AuthError>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          label="मोबाइल नंबर या यूजरनेम"
          icon={Phone}
          type="text"
          required
          placeholder="मोबाइल नंबर या @username"
          value={formData.identifier}
          onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
        />
        <AuthField
          label="पासवर्ड"
          icon={Lock}
          type={showPassword ? 'text' : 'password'}
          required
          placeholder="अपना पासवर्ड दर्ज करें"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          trailing={
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-orange-600 cursor-pointer" aria-label="पासवर्ड दिखाएं">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />
        <AuthSubmit loading={loading} loadingText="सत्यापन हो रहा है...">
          डैशबोर्ड में प्रवेश करें <ChevronRight className="w-4 h-4" />
        </AuthSubmit>
      </form>

      <div className="mt-6 pt-5 border-t border-orange-100 text-center space-y-3 text-sm text-slate-600">
        <p>
          नया खाता बनाना चाहते हैं?{' '}
          <Link href="/astrologer/register" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">यहाँ रजिस्टर करें</Link>
        </p>
        <Link href="/astrology" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-orange-700">
          <ArrowLeft className="w-3.5 h-3.5" /> वापस डायरेक्टरी पर जाएं
        </Link>
      </div>
    </AuthShell>
  );
}
