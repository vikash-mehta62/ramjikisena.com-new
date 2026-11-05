'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone } from 'lucide-react';
import AuthShell, { AuthField, AuthError, AuthSubmit } from '@/components/AuthShell';

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
    <AuthShell
      kicker="Mobile Login"
      title={<>मोबाइल नंबर से <span className="text-orange-600">लॉगिन</span></>}
      sub="अपना रजिस्टर्ड मोबाइल नंबर डालें"
    >
      {error && <AuthError>{error}</AuthError>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          label="मोबाइल नंबर"
          icon={Phone}
          type="tel"
          value={contact}
          onChange={e => setContact(e.target.value)}
          placeholder="9876543210"
          pattern="[0-9]{10}"
          maxLength={10}
          required
          hint="अपना रजिस्टर्ड मोबाइल नंबर डालें"
        />
        <AuthSubmit loading={loading} loadingText="Loading...">🙏 लॉगिन / Login</AuthSubmit>
      </form>

      <div className="mt-6 pt-5 border-t border-orange-100 space-y-2 text-center text-sm text-slate-600">
        <p>
          Username से लॉगिन करें?{' '}
          <Link href="/login" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">Login with Username</Link>
        </p>
        <p>
          नये सदस्य हैं?{' '}
          <Link href="/register" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">Register करें ✨</Link>
        </p>
      </div>
    </AuthShell>
  );
}
