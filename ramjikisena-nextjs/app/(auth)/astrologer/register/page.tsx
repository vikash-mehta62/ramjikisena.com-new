'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Phone, Lock, User, MapPin, Award, ChevronRight, ArrowLeft, CheckCircle2, FileText, LucideIcon } from 'lucide-react';
import { setAstrologerAuth } from '@/lib/astrologerAuth';
import AuthShell, { AuthField, AuthError, AuthSubmit } from '@/components/AuthShell';

const AVAILABLE_SPECIALTIES = [
  'Vedic Astrology (वैदिक ज्योतिष)',
  'Tarot Card Reading (टैरो कार्ड रीडिंग)',
  'Kundli Milan (कुण्डली मिलान)',
  'Vastu Shastra (वास्तु शास्त्र)',
  'Numerology (अंक ज्योतिष)',
  'Palmistry (हस्तरेखा विज्ञान)',
  'Prashna Kundli (प्रश्न कुण्डली)',
  'Gemology (रत्न परामर्श)',
];

export default function AstrologerRegisterPage() {
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
    experience: '5',
    fee: '501',
    tagline: '',
    about: '',
    qualifications: '',
    languages: 'Hindi, English',
  });

  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([
    'Vedic Astrology (वैदिक ज्योतिष)'
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSpecialty = (spec: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते (Passwords do not match)');
      setLoading(false);
      return;
    }

    if (formData.phone.replace(/\D/g, '').length < 10) {
      setError('कृपया मान्य 10 अंकों का फोन नंबर दर्ज करें');
      setLoading(false);
      return;
    }

    if (selectedSpecialties.length === 0) {
      setError('कृपया कम से कम एक विधा (Specialty) का चयन करें');
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
      const cleanSpecialties = selectedSpecialties.map(s => s.split(' (')[0]);

      const payload = {
        name: formData.name,
        username: formData.username || undefined,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password,
        city: formData.city.trim(),
        state: formData.state.trim(),
        experience: Number(formData.experience) || 1,
        fee: Number(formData.fee) || 501,
        specialties: cleanSpecialties,
        languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean),
        tagline: formData.tagline || 'ज्योतिष एवं टैरो परामर्श विशेषज्ञ',
        about: formData.about,
        qualifications: formData.qualifications,
      };

      const response = await fetch(`${apiUrl}/api/astrology-auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success && data.token) {
        setAstrologerAuth(data.token, data.astrologer);
        router.push('/astrologer/dashboard');
      } else {
        setError(data.message || 'पंजीकरण असफल रहा। कृपया पुनः प्रयास करें।');
      }
    } catch (err) {
      console.error('Astrologer registration error:', err);
      setError('सर्वर से संपर्क नहीं हो पाया। कृपया नेटवर्क कनेक्शन जांचें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      wide
      kicker="Astrologer Registration"
      title={<>ज्योतिषी / टैरो रीडर <span className="text-orange-600">पंजीकरण</span></>}
      sub="राम जी की सेना मंच से जुड़ें और देशभर के श्रद्धालुओं का मार्गदर्शन करें"
      sideQuote="ज्योतिष वेद का नेत्र है — सही समय पर सही मार्गदर्शन"
      sideAuthor="वेदांग ज्योतिष"
    >
      {error && <AuthError>{error}</AuthError>}

      <form onSubmit={handleSubmit} className="space-y-7">
        <Section icon={User} title="1. व्यक्तिगत विवरण (Personal Info)">
          <div className="grid sm:grid-cols-2 gap-4">
            <AuthField label="पूरा नाम (Full Name) *" type="text" required placeholder="उदा. पं. राधेश्याम शास्त्री"
              value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <AuthField label="यूजरनेम (वैकल्पिक)" type="text" placeholder="उदा. astro_radheshyam"
              value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
            <AuthField label="मोबाइल नंबर (WhatsApp) *" icon={Phone} type="tel" required placeholder="10 अंकों का फोन नंबर"
              value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <AuthField label="ईमेल (वैकल्पिक)" type="email" placeholder="shastri@example.com"
              value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
        </Section>

        <Section icon={MapPin} title="2. स्थान एवं अनुभव (Location & Expertise)">
          <div className="grid sm:grid-cols-2 gap-4">
            <AuthField label="शहर (City) *" type="text" required placeholder="उदा. भोपाल"
              value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
            <AuthField label="राज्य (State) *" type="text" required placeholder="उदा. मध्य प्रदेश"
              value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
            <AuthField label="अनुभव (वर्षों में) *" icon={Award} type="number" min="1" required placeholder="उदा. 8"
              value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} />
            <AuthField label="परामर्श शुल्क (₹ प्रति सत्र) *" type="number" min="100" required placeholder="उदा. 501"
              value={formData.fee} onChange={(e) => setFormData({ ...formData, fee: e.target.value })} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">आपकी विशेषज्ञताएं (Specialties - एक या अधिक चुनें) *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_SPECIALTIES.map((spec) => {
                const isSelected = selectedSpecialties.includes(spec);
                return (
                  <button
                    type="button"
                    key={spec}
                    onClick={() => toggleSpecialty(spec)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-orange-50 border-orange-400 text-orange-900'
                        : 'bg-white border-orange-100 text-slate-600 hover:bg-orange-50/50'
                    }`}
                  >
                    <span className="truncate">{spec}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <AuthField label="भाषाएं (Languages)" type="text" placeholder="Hindi, English, Sanskrit"
              value={formData.languages} onChange={(e) => setFormData({ ...formData, languages: e.target.value })} />
            <AuthField label="शिक्षा / उपाधि (Qualifications)" icon={FileText} type="text" placeholder="उदा. ज्योतिष विशारद, बी.ए. संस्कृत"
              value={formData.qualifications} onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })} />
          </div>
          <AuthField label="संक्षिप्त स्लोगन (Tagline)" type="text" placeholder="उदा. 15 वर्षों से सटीक कुण्डली एवं विवाह विश्लेषण"
            value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} />
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">अपने बारे में विस्तृत जानकारी (Bio / About)</label>
            <textarea
              rows={3}
              placeholder="अपने अनुभव, ज्ञान एवं परामर्श शैली के बारे में विस्तार से बताएं..."
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              className="w-full px-3.5 py-3 rounded-xl bg-orange-50/40 border border-orange-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
            />
          </div>
        </Section>

        <Section icon={Lock} title="3. सुरक्षा एवं पासवर्ड (Security)">
          <div className="grid sm:grid-cols-2 gap-4">
            <AuthField label="पासवर्ड *" icon={Lock} type="password" required placeholder="कम से कम 6 अक्षर"
              value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            <AuthField label="पासवर्ड पुष्टि करें *" icon={Lock} type="password" required placeholder="पुनः पासवर्ड दर्ज करें"
              value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
          </div>
        </Section>

        <AuthSubmit loading={loading} loadingText="पंजीकरण हो रहा है...">
          पंजीकरण पूरा करें (Register Astrologer) <ChevronRight className="w-4 h-4" />
        </AuthSubmit>
      </form>

      <div className="mt-6 pt-5 border-t border-orange-100 text-center space-y-3 text-sm text-slate-600">
        <p>
          पहले से पंजीकृत हैं?{' '}
          <Link href="/astrologer/login" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">यहाँ लॉगिन करें</Link>
        </p>
        <Link href="/astrology" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-orange-700">
          <ArrowLeft className="w-3.5 h-3.5" /> वापस ज्योतिष डायरेक्टरी
        </Link>
      </div>
    </AuthShell>
  );
}

function Section({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-orange-700 uppercase tracking-wider pb-2 border-b border-orange-100 flex items-center gap-2">
        <Icon className="w-4 h-4" /> {title}
      </h3>
      {children}
    </div>
  );
}
