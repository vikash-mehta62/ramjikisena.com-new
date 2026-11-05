'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/auth';
import { User, Lock, Eye, EyeOff, Crown, Flame } from 'lucide-react';
import AuthShell, { AuthField, AuthError, AuthSubmit, AuthSwitch } from '@/components/AuthShell';

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
    <AuthShell
      kicker="Bhakt Login"
      title={<>भक्त एवं <span className="text-orange-600">व्यवस्थापक</span> लॉगिन</>}
      sub="राम नाम जप, प्रोफाइल एवं Admin एक्सेस हेतु लॉगिन करें"
      below={
        <AuthSwitch
          icon={<Flame className="w-5 h-5" />}
          title="क्या आप पंडित जी / पुरोहित हैं?"
          sub="पूजा, कर्मकांड एवं यजमान बुकिंग पोर्टल"
          href="/pandit/login"
          cta="पंडित लॉगिन →"
        />
      }
    >
      <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
        <Crown className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p><span className="font-bold">व्यवस्थापक (Admin):</span> Admin भी अपने ID/Password से यहीं लॉगिन करें। सफल लॉगिन के बाद आप सीधे Admin Dashboard पर पहुँचेंगे।</p>
      </div>

      {error && <AuthError>{error}</AuthError>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          label="यूज़रनेम (Username)"
          icon={User}
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          placeholder="अपना Username दर्ज करें (उदा. ram_bhakt या admin)"
          required
        />
        <AuthField
          label="पासवर्ड (Password)"
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

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">पासवर्ड याद नहीं?</span>
          <Link href="/forgot" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">📱 मोबाइल नंबर से लॉगिन</Link>
        </div>

        <AuthSubmit loading={loading} loadingText="प्रवेश हो रहा है...">🙏 लॉगिन करें / Sign In</AuthSubmit>
      </form>

      <p className="mt-6 pt-5 border-t border-orange-100 text-center text-sm text-slate-600">
        नये भक्त सदस्य हैं?{' '}
        <Link href="/register" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">यहाँ रजिस्टर करें ✨</Link>
      </p>
    </AuthShell>
  );
}
