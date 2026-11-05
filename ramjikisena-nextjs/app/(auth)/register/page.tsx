'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/auth';
import { User, Lock, MapPin, Phone, FileText } from 'lucide-react';
import MusicPlayer from '@/components/MusicPlayer';
import AuthShell, { AuthField, AuthError, AuthSubmit } from '@/components/AuthShell';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    city: '',
    contact: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate contact
    if (!/^[0-9]{10}$/.test(formData.contact)) {
      setError('Contact number should be 10 digits');
      setLoading(false);
      return;
    }

    try {
      const result = await authApi.register(formData);

      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MusicPlayer />
      <AuthShell
        kicker="New Devotee"
        title={<>नये भक्त <span className="text-orange-600">रजिस्टर</span> करें</>}
        sub="राम नाम बैंक से जुड़ें और प्रतिदिन लिखित नाम जप करें"
        sideQuote="कलियुग केवल नाम अधारा। सुमिरि सुमिरि नर उतरहिं पारा॥"
        sideAuthor="श्री रामचरितमानस"
      >
        {error && <AuthError>{error}</AuthError>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <AuthField
              label="यूजर लॉगिन आइडी / Username"
              icon={User}
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Choose a username"
              required
            />
            <AuthField
              label="पूरा नाम / Full Name"
              icon={FileText}
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              required
            />
            <AuthField
              label="शहर / City"
              icon={MapPin}
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Enter your city"
              required
            />
            <AuthField
              label="मोबाइल नंबर / Mobile No."
              icon={Phone}
              type="tel"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="10 digit mobile number"
              pattern="[0-9]{10}"
              required
            />
          </div>
          <AuthField
            label="पासवर्ड / Password"
            icon={Lock}
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Create a strong password"
            required
          />

          <AuthSubmit loading={loading} loadingText="Loading...">✨ रजिस्टर / Register</AuthSubmit>
        </form>

        <p className="mt-6 pt-5 border-t border-orange-100 text-center text-sm text-slate-600">
          पहले से सदस्य हैं?{' '}
          <Link href="/login" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">लॉगिन करें / Login 🙏</Link>
        </p>
      </AuthShell>
    </>
  );
}
