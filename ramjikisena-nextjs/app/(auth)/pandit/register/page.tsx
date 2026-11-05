'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, AtSign, Phone, Mail, MapPin, Map, Award, BookOpen, Languages, Lock } from 'lucide-react';
import AuthShell, { AuthField, AuthError, AuthSubmit } from '@/components/AuthShell';

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-orange-700 uppercase tracking-wider pb-2 border-b border-orange-100">{title}</h3>
      {children}
    </div>
  );
}

export default function PanditRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    state: '',
    experience: '',
    specialization: '',
    languages: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pandit-auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          city: formData.city,
          state: formData.state,
          experience: formData.experience ? parseInt(formData.experience) : 0,
          specialization: formData.specialization,
          languages: formData.languages
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Save token and pandit info to localStorage
        localStorage.setItem('panditToken', data.token);
        localStorage.setItem('pandit', JSON.stringify(data.pandit));

        // Redirect to pandit dashboard
        router.push('/pandit/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      wide
      kicker="Pandit Registration"
      title={<>पुरोहित <span className="text-orange-600">पंजीकरण</span></>}
      sub="हमारे मंच से जुड़ें और भक्तों की सेवा करें"
      sideImage="/home/pandit.jpg"
      sideQuote="ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्"
      sideAuthor="गायत्री मंत्र"
    >
      {error && <AuthError>{error}</AuthError>}

      <form onSubmit={handleSubmit} className="space-y-7">
        <FormSection title="Basic Information">
          <div className="grid md:grid-cols-2 gap-4">
            <AuthField label="Full Name *" icon={User} type="text" value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Pandit Shri..." required />
            <AuthField label="Username *" icon={AtSign} type="text" value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })} placeholder="panditji123" required
              hint="Unique username for login" />
            <AuthField label="Phone Number *" icon={Phone} type="tel" value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="10 digit mobile number" required />
            <AuthField label="Email (Optional)" icon={Mail} type="email" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your.email@example.com" />
          </div>
        </FormSection>

        <FormSection title="Location">
          <div className="grid md:grid-cols-2 gap-4">
            <AuthField label="City *" icon={MapPin} type="text" value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="Your city" required />
            <AuthField label="State *" icon={Map} type="text" value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })} placeholder="Your state" required />
          </div>
        </FormSection>

        <FormSection title="Professional Details">
          <AuthField label="Experience (Years)" icon={Award} type="number" value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })} placeholder="Years of experience" min="0" />
          <AuthField label="Specialization" icon={BookOpen} type="text" value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            placeholder="e.g., Vedic Rituals, Marriage, Griha Pravesh (comma separated)"
            hint="Separate multiple specializations with commas" />
          <AuthField label="Languages" icon={Languages} type="text" value={formData.languages}
            onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
            placeholder="e.g., Hindi, Sanskrit, English (comma separated)"
            hint="Separate multiple languages with commas" />
        </FormSection>

        <FormSection title="Security">
          <div className="grid md:grid-cols-2 gap-4">
            <AuthField label="Password *" icon={Lock} type="password" value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Create a strong password" required minLength={6} />
            <AuthField label="Confirm Password *" icon={Lock} type="password" value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="Re-enter password" required minLength={6} />
          </div>
        </FormSection>

        <AuthSubmit loading={loading} loadingText="Registering...">🕉️ Register as Pandit</AuthSubmit>
      </form>

      <div className="mt-6 pt-5 border-t border-orange-100 space-y-2 text-center text-sm text-slate-600">
        <p>
          Already have an account?{' '}
          <Link href="/pandit/login" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">Login</Link>
        </p>
        <p>
          Are you a user?{' '}
          <Link href="/register" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">User Registration</Link>
        </p>
      </div>
    </AuthShell>
  );
}
