'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Star,
  ChevronRight,
  UserCheck,
  SlidersHorizontal,
  X,
  Sparkles,
  Compass,
  Phone,
  Clock,
  Award,
  ArrowRight,
  CircleDot
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface AstrologerOffering {
  _id?: string;
  title: string;
  description: string;
  fee: number;
  durationMinutes: number;
}

interface Astrologer {
  _id: string;
  name: string;
  username: string;
  photo?: string;
  tagline: string;
  about: string;
  experience: number;
  specialties: string[];
  languages: string[];
  location: { city: string; state: string };
  fee: number;
  averageRating: number;
  totalConsultations: number;
  isVerified: boolean;
  availabilityStatus: 'online' | 'busy' | 'offline';
  offerings?: AstrologerOffering[];
}

const SPECIALTY_PILLS = [
  { id: 'all', label: 'सभी (All)' },
  { id: 'Vedic Astrology', label: '🕉️ वैदिक ज्योतिष' },
  { id: 'Tarot Card Reading', label: '🃏 टैरो कार्ड' },
  { id: 'Kundli Milan', label: '📜 कुण्डली मिलान' },
  { id: 'Vastu', label: '🏡 वास्तु शास्त्र' },
  { id: 'Numerology', label: '🔢 अंक ज्योतिष' },
  { id: 'Palmistry', label: '✋ हस्तरेखा' },
];

function AstrologerCard({ astro, index }: { astro: Astrologer; index: number }) {
  const isOnline = astro.availabilityStatus === 'online';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-amber-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
    >
      {/* Top Banner / Avatar */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] overflow-hidden bg-gradient-to-br from-amber-950 via-slate-900 to-indigo-950 flex-shrink-0">
        {astro.photo ? (
          <img
            src={astro.photo}
            alt={astro.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
            <span className="text-5xl select-none mb-1">🔮</span>
            <span className="text-xs text-amber-200/70 font-semibold tracking-wider uppercase">
              {astro.specialties?.[0] || 'Astrology'}
            </span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase backdrop-blur-md shadow-md border border-white/20 text-white bg-black/40">
          <CircleDot className={`w-3 h-3 ${isOnline ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
          <span>{isOnline ? 'Available' : 'Offline'}</span>
        </div>

        {/* Verified Badge */}
        {astro.isVerified && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-600 text-white px-2 py-1 rounded-full text-[10px] font-black shadow-lg">
            <UserCheck className="w-3 h-3" /> प्रमाणित
          </div>
        )}

        {/* Bottom details on image */}
        <div className="absolute bottom-0 left-0 right-0 p-3.5 text-white">
          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <h3 className="font-black text-lg text-white leading-tight truncate drop-shadow-md">
                {astro.name}
              </h3>
              <p className="text-[11px] text-amber-200 truncate font-medium">
                {astro.tagline || 'ज्योतिष एवं मार्गदर्शन विशेषज्ञ'}
              </p>
            </div>
            {/* Rating pill */}
            <div className="flex items-center gap-1 bg-amber-500/90 text-slate-950 px-2 py-0.5 rounded-full text-xs font-black shadow-md flex-shrink-0">
              <Star className="w-3 h-3 fill-current" />
              <span>{astro.averageRating?.toFixed(1) || '5.0'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Info Content */}
      <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
        <div className="space-y-3">
          {/* Location & Experience Badges */}
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span className="font-semibold truncate">{astro.location?.city || 'India'}, {astro.location?.state || ''}</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
              <Award className="w-3.5 h-3.5" />
              <span>{astro.experience || 0}+ वर्ष अनुभव</span>
            </div>
          </div>

          {/* Specialties Pills */}
          {astro.specialties && astro.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {astro.specialties.slice(0, 3).map((spec, i) => (
                <span
                  key={i}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100"
                >
                  {spec}
                </span>
              ))}
              {astro.specialties.length > 3 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                  +{astro.specialties.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Languages */}
          {astro.languages && astro.languages.length > 0 && (
            <p className="text-[11px] text-slate-500">
              <span className="font-bold text-slate-700">भाषाएं: </span>
              {astro.languages.join(', ')}
            </p>
          )}
        </div>

        {/* Footer / Fee & CTA */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">परामर्श शुल्क</span>
            <span className="text-lg font-black text-amber-700">
              ₹{astro.fee || 501}
              <span className="text-[10px] text-slate-400 font-medium">/सत्र</span>
            </span>
          </div>

          <Link
            href={`/astrology/${astro._id}`}
            className="px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 text-slate-950"
            style={{
              background: 'linear-gradient(135deg, #f9e07a 0%, #d4920a 60%, #b8760a 100%)',
              boxShadow: '0 4px 12px rgba(212,146,10,0.3)',
            }}
          >
            <span>परामर्श लें</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function AstrologyDirectoryPage() {
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  const fetchAstrologers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSpecialty !== 'all') params.append('specialty', selectedSpecialty);
      if (search.trim()) params.append('search', search.trim());
      if (city.trim()) params.append('city', city.trim());
      if (sortBy) params.append('sortBy', sortBy);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
      const res = await fetch(`${apiUrl}/api/astrology?${params}`);
      const data = await res.json();
      if (data.success) {
        setAstrologers(data.astrologers || []);
      }
    } catch (e) {
      console.error('Error fetching astrologers:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchAstrologers, 300);
    return () => clearTimeout(timer);
  }, [selectedSpecialty, search, city, sortBy]);

  const hasActiveFilters = selectedSpecialty !== 'all' || search.trim() !== '' || city.trim() !== '';

  const clearFilters = () => {
    setSelectedSpecialty('all');
    setSearch('');
    setCity('');
    setSortBy('rating');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative pt-24 pb-16 overflow-hidden bg-gradient-to-b from-[#180b03] via-[#241006] to-[#FDFBF7]">
        {/* Sacred Astrology Glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: 'radial-gradient(circle at 50% 20%, rgba(249,224,122,0.3) 0%, rgba(212,146,10,0.15) 40%, transparent 70%)',
          }}
        />

        <div className="container mx-auto px-4 relative z-10 max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span
              className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-widest text-amber-300 mb-3 shadow-lg"
              style={{
                background: 'rgba(212,146,10,0.2)',
                border: '1px solid rgba(249,224,122,0.3)',
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              वैदिक ज्योतिष एवं टैरो कार्ड परामर्श
            </span>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight drop-shadow-xl">
              सटीक मार्गदर्शन, <span style={{ color: '#f9e07a' }}>उज्ज्वल भविष्य</span>
            </h1>

            <p className="text-amber-100/80 text-sm sm:text-base mt-3 max-w-2xl mx-auto font-medium">
              अनुभवी ज्योतिषाचार्यों एवं प्रमाणित टैरो कार्ड रीडर्स से कुंडली, करियर, विवाह, वास्तु एवं जीवन के हर महत्वपूर्ण प्रश्न पर व्यक्तिगत परामर्श प्राप्त करें।
            </p>
          </motion.div>

          {/* Search & Filter Bar */}
          <div className="mt-8 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-amber-200/60 p-3 sm:p-4 max-w-3xl mx-auto text-left">
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="ज्योतिषी का नाम, विधा या समस्या..."
                  className="w-full pl-10 pr-3 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* City input */}
              <div className="relative sm:w-44">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="शहर (उदा. भोपाल)"
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              {/* Sort selector */}
              <div className="sm:w-40">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                >
                  <option value="rating">शीर्ष रेटिंग (Rating)</option>
                  <option value="experience">अधिकतम अनुभव</option>
                  <option value="fee_low">शुल्क: कम से ज्यादा</option>
                  <option value="fee_high">शुल्क: ज्यादा से कम</option>
                </select>
              </div>

              {/* Clear button if filters active */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center justify-center font-bold text-xs"
                  title="Clear Filters"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Specialty Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 mt-3 border-t border-slate-100">
              {SPECIALTY_PILLS.map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSelectedSpecialty(pill.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedSpecialty === pill.id
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-800'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Astrologers Grid Section */}
      <main className="container mx-auto px-4 md:px-6 py-10 max-w-7xl">
        {/* Header Count */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>विशेषज्ञ ज्योतिषाचार्य एवं कार्ड रीडर्स</span>
              <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-black">
                {astrologers.length} उपलब्ध
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              अपनी पसंद के अनुसार अनुभवी विशेषज्ञ चुनें और सीधे ऑनलाइन या फोन पर परामर्श बुक करें
            </p>
          </div>

          <Link
            href="/astrologer/register"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black text-amber-700 bg-amber-50 hover:bg-amber-100 px-3.5 py-2 rounded-xl border border-amber-200 transition"
          >
            <span>ज्योतिषी के रूप में जुड़ें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-amber-100 animate-pulse">
                <div className="aspect-[4/3] bg-amber-50" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-amber-50 rounded-full w-3/4" />
                  <div className="h-3 bg-amber-50 rounded-full w-1/2" />
                  <div className="h-8 bg-amber-50 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : astrologers.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-amber-200 max-w-lg mx-auto shadow-sm p-8">
            <div className="text-5xl mb-3">🔮</div>
            <h3 className="font-black text-slate-800 text-lg mb-1">कोई ज्योतिषी नहीं मिले</h3>
            <p className="text-slate-500 text-sm mb-5">
              कृपया सर्च शब्द बदलें या अन्य विधा (Specialty) का चयन करें
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-amber-600 text-white font-bold rounded-xl text-xs hover:bg-amber-700 transition"
            >
              सभी ज्योतिषी देखें
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {astrologers.map((astro, i) => (
              <AstrologerCard key={astro._id} astro={astro} index={i} />
            ))}
          </div>
        )}

        {/* Bottom Banner for Joining as Astrologer */}
        <div className="mt-16 rounded-3xl p-6 sm:p-10 relative overflow-hidden text-white shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #240d04 0%, #3e1606 60%, #1f0802 100%)',
            border: '1px solid rgba(249,224,122,0.25)',
          }}>
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-black uppercase tracking-widest text-amber-300 block mb-2">
              🚩 जय श्री राम — ज्योतिषी पार्टनर मंच
            </span>
            <h3 className="text-2xl sm:text-3xl font-black leading-tight text-white mb-2">
              क्या आप ज्योतिषी, हस्तरेखा विशेषज्ञ या टैरो रीडर हैं?
            </h3>
            <p className="text-amber-100/75 text-sm mb-6 leading-relaxed">
              राम जी की सेना के लाखों श्रद्धालुओं एवं साधकों से सीधे जुड़ें। अपनी सुविधानुसार समय तय करें और भक्तों का मार्गदर्शन करें।
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/astrologer/register"
                className="px-6 py-3 rounded-2xl font-black text-xs sm:text-sm text-slate-950 transition-all shadow-lg active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #f9e07a 0%, #d4920a 60%, #b8760a 100%)',
                }}
              >
                पंजीकरण करें (Join Free) →
              </Link>
              <Link
                href="/astrologer/login"
                className="px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm text-white/90 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 transition"
              >
                ज्योतिषी लॉगिन
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
