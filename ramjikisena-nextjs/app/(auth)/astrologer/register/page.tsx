'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Phone,
  Lock,
  User,
  MapPin,
  Award,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { setAstrologerAuth } from '@/lib/astrologerAuth';

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
    <div
      className="min-h-screen py-12 px-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(155deg, #140803 0%, #2a1106 50%, #150802 100%)',
      }}
    >
      <div className="w-full max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/astrology"
            className="inline-flex items-center gap-1.5 text-xs text-amber-300/80 hover:text-amber-200 font-bold mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>वापस ज्योतिष डायरेक्टरी</span>
          </Link>

          <div className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl mx-auto mb-3"
            style={{
              background: 'linear-gradient(135deg, #92400e 0%, #d97706 60%, #fbbf24 100%)',
            }}>
            <span className="text-3xl">🔮</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white">
            ज्योतिषी / टैरो रीडर पंजीकरण
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/70 mt-1 max-w-md mx-auto">
            राम जी की सेना मंच से जुड़ें और देशभर के श्रद्धालुओं एवं भक्तों का मार्गदर्शन करें
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border border-amber-200/60">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Step 1: Basic Information */}
            <div>
              <h3 className="text-sm font-black text-amber-800 uppercase tracking-wider pb-2 border-b border-amber-100 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-600" />
                <span>1. व्यक्तिगत विवरण (Personal Info)</span>
              </h3>

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">पूरा नाम (Full Name) *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. पं. राधेश्याम शास्त्री"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">यूजरनेम (वैकल्पिक)</label>
                  <input
                    type="text"
                    placeholder="उदा. astro_radheshyam"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">मोबाइल नंबर (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10 अंकों का फोन नंबर"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ईमेल (वैकल्पिक)</label>
                  <input
                    type="email"
                    placeholder="shastri@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Location & Professional Experience */}
            <div>
              <h3 className="text-sm font-black text-amber-800 uppercase tracking-wider pb-2 border-b border-amber-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>2. स्थान एवं अनुभव (Location & Expertise)</span>
              </h3>

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">शहर (City) *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. भोपाल"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">राज्य (State) *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. मध्य प्रदेश"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">अनुभव (वर्षों में) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="उदा. 8"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">परामर्श शुल्क (₹ प्रति सत्र) *</label>
                  <input
                    type="number"
                    min="100"
                    required
                    placeholder="उदा. 501"
                    value={formData.fee}
                    onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Specialties Multi-Select */}
              <div className="mt-4">
                <label className="block font-bold text-slate-700 mb-2">
                  आपकी विशेषज्ञताएं (Specialties - एक या अधिक चुनें) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                  {AVAILABLE_SPECIALTIES.map((spec) => {
                    const isSelected = selectedSpecialties.includes(spec);
                    return (
                      <button
                        type="button"
                        key={spec}
                        onClick={() => toggleSpecialty(spec)}
                        className={`p-2.5 rounded-xl border text-left font-bold transition flex items-center justify-between text-xs ${
                          isSelected
                            ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate">{spec}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-700 flex-shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Languages & Tagline */}
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">भाषाएं (Languages)</label>
                  <input
                    type="text"
                    placeholder="Hindi, English, Sanskrit"
                    value={formData.languages}
                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">शिक्षा / उपाधि (Qualifications)</label>
                  <input
                    type="text"
                    placeholder="उदा. ज्योतिष विशारद, बी.ए. संस्कृत"
                    value={formData.qualifications}
                    onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Tagline & Bio */}
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">संक्षिप्त स्लोगन (Tagline)</label>
                  <input
                    type="text"
                    placeholder="उदा. 15 वर्षों से सटीक कुण्डली एवं विवाह विश्लेषण"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">अपने बारे में विस्तृत जानकारी (Bio / About)</label>
                  <textarea
                    rows={3}
                    placeholder="अपने अनुभव, ज्ञान एवं परामर्श शैली के बारे में विस्तार से बताएं..."
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Security & Password */}
            <div>
              <h3 className="text-sm font-black text-amber-800 uppercase tracking-wider pb-2 border-b border-amber-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>3. सुरक्षा एवं पासवर्ड (Security)</span>
              </h3>

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">पासवर्ड *</label>
                  <input
                    type="password"
                    required
                    placeholder="कम से कम 6 अक्षर"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">पासवर्ड पुष्टि करें *</label>
                  <input
                    type="password"
                    required
                    placeholder="पुनः पासवर्ड दर्ज करें"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl font-black text-sm text-slate-950 transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #f9e07a 0%, #d4920a 60%, #b8760a 100%)',
                  boxShadow: '0 6px 20px rgba(212,146,10,0.35)',
                }}
              >
                {loading ? 'पंजीकरण हो रहा है...' : 'पंजीकरण पूरा करें (Register Astrologer)'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Login prompt */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600 font-semibold">
              पहले से पंजीकृत हैं?{' '}
              <Link href="/astrologer/login" className="text-amber-700 font-black hover:underline">
                यहाँ लॉगिन करें
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
