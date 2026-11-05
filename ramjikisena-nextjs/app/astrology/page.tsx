'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, ArrowRight, BadgeCheck, SlidersHorizontal, X, CircleDot } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';

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

function AstrologerRow({ astro, index }: { astro: Astrologer; index: number }) {
  const isOnline = astro.availabilityStatus === 'online';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.05, duration: 0.35 }}
    >
      <Link
        href={`/astrology/${astro._id}`}
        className="group flex gap-4 p-3.5 sm:p-4 rounded-2xl bg-white border border-orange-100 shadow-sm hover:shadow-divine hover:border-orange-300 hover:-translate-y-0.5 transition-all"
      >
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-orange-100 to-amber-50">
          {astro.photo ? (
            <img src={astro.photo} alt={astro.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl select-none">🔮</div>
          )}
          <span className={`absolute top-1.5 left-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold backdrop-blur ${isOnline ? 'bg-emerald-600/90 text-white' : 'bg-black/50 text-white/90'}`}>
            <CircleDot className={`w-2.5 h-2.5 ${isOnline ? 'animate-pulse' : ''}`} />
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight group-hover:text-orange-700 transition-colors">{astro.name}</h3>
            {astro.isVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                <BadgeCheck className="w-3 h-3" /> Verified
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-1">
            {astro.specialties?.length ? astro.specialties.slice(0, 4).join(' | ') : (astro.tagline || 'ज्योतिष एवं मार्गदर्शन विशेषज्ञ')}
          </p>

          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-bold text-slate-800">{astro.averageRating ? astro.averageRating.toFixed(1) : '5.0'}</span>
              <span className="text-slate-400">({astro.totalConsultations || 0})</span>
            </span>
            <span className="text-slate-300">•</span>
            <span>{astro.experience || 0}+ वर्ष अनुभव</span>
            {astro.languages?.length > 0 && (
              <>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="hidden sm:inline">{astro.languages.slice(0, 2).join(', ')}</span>
              </>
            )}
          </div>

          <div className="mt-auto pt-2.5 flex items-center justify-between gap-2">
            <span className="text-sm sm:text-base font-bold text-orange-600">₹ {(astro.fee || 501).toLocaleString('en-IN')} से शुरू</span>
            <span className="btn-shine px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs sm:text-sm font-bold shadow-sm group-hover:shadow-md inline-flex items-center gap-1">
              बुक करें <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

const FEE_MAX = 5000;

export default function AstrologyDirectoryPage() {
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [maxFee, setMaxFee] = useState(FEE_MAX);

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

  const visible = useMemo(
    () => (maxFee >= FEE_MAX ? astrologers : astrologers.filter(a => (a.fee || 501) <= maxFee)),
    [astrologers, maxFee]
  );

  const hasActiveFilters = selectedSpecialty !== 'all' || search.trim() !== '' || city.trim() !== '' || maxFee < FEE_MAX;

  const clearFilters = () => {
    setSelectedSpecialty('all');
    setSearch('');
    setCity('');
    setSortBy('rating');
    setMaxFee(FEE_MAX);
  };

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-slate-900 mb-2">विषय</p>
        {SPECIALTY_PILLS.map(pill => (
          <label key={pill.id} className="flex items-center gap-2.5 py-1 cursor-pointer text-sm text-slate-700 hover:text-orange-700">
            <input
              type="radio"
              name="specialty"
              checked={selectedSpecialty === pill.id}
              onChange={() => setSelectedSpecialty(pill.id)}
              className="w-4 h-4 accent-orange-600 cursor-pointer"
            />
            {pill.label}
          </label>
        ))}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900 mb-3">मूल्य सीमा</p>
        <input
          type="range"
          min={100}
          max={FEE_MAX}
          step={100}
          value={maxFee}
          onChange={e => setMaxFee(Number(e.target.value))}
          className="w-full accent-orange-600 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>₹ 0</span>
          <span className="font-bold text-orange-700">{maxFee >= FEE_MAX ? `₹ ${FEE_MAX}+` : `₹ ${maxFee.toLocaleString('en-IN')}`}</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900 mb-2">क्रम</p>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-orange-50/50 border border-orange-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
        >
          <option value="rating">शीर्ष रेटिंग</option>
          <option value="experience">अधिकतम अनुभव</option>
          <option value="fee_low">शुल्क: कम से ज्यादा</option>
          <option value="fee_high">शुल्क: ज्यादा से कम</option>
        </select>
      </div>
      {hasActiveFilters && (
        <button onClick={clearFilters} className="w-full py-2 rounded-xl text-sm font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 cursor-pointer">
          सभी फ़िल्टर हटाएं
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFCF7]">
      <Navbar />

      <PageHero
        kicker="Vedic Astrology"
        title="ज्योतिषी से परामर्श लें"
        sub="अपने जीवन की समस्याओं का समाधान पाएं — कुंडली, करियर, विवाह, वास्तु और भी बहुत कुछ"
      >
        <div className="flex flex-col sm:flex-row gap-2 max-w-2xl p-2 rounded-2xl bg-white/90 backdrop-blur border border-orange-200 shadow-lg shadow-orange-900/5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ज्योतिषी का नाम या विषय खोजें"
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-orange-50/50 border border-orange-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="relative sm:w-44">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="शहर (उदा. भोपाल)"
              className="w-full pl-9 pr-3 py-3 rounded-xl bg-orange-50/50 border border-orange-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={city}
              onChange={e => setCity(e.target.value)}
            />
          </div>
        </div>
      </PageHero>

      <main className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl py-8 sm:py-10">
        {/* Phone: specialty chips + filter toggle */}
        <div className="lg:hidden mb-5">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
            {SPECIALTY_PILLS.map(pill => (
              <button
                key={pill.id}
                onClick={() => setSelectedSpecialty(pill.id)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-bold border whitespace-nowrap cursor-pointer ${selectedSpecialty === pill.id ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-700 border-orange-200'}`}
              >
                {pill.label}
              </button>
            ))}
            <button
              onClick={() => setShowFilters(f => !f)}
              className="shrink-0 px-3 py-1.5 rounded-full text-sm font-bold border border-orange-200 bg-white text-orange-700 inline-flex items-center gap-1 cursor-pointer"
            >
              {showFilters ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />} फ़िल्टर
            </button>
          </div>
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="mt-3 p-4 rounded-2xl bg-white border border-orange-100 shadow-sm">{filterPanel}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 p-5 rounded-2xl bg-white border border-orange-100 shadow-sm">
            {filterPanel}
          </aside>

          <section className="lg:col-span-9">
            <div className="flex items-center justify-between gap-3 mb-4">
              {!loading && (
                <p className="text-sm text-slate-500">
                  <span className="font-bold text-slate-800">{visible.length}</span> ज्योतिषी उपलब्ध
                </p>
              )}
              <Link href="/astrologer/register" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700">
                ज्योतिषी के रूप में जुड़ें <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white border border-orange-100 animate-pulse">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-orange-50" />
                    <div className="flex-1 space-y-3 py-1">
                      <div className="h-4 bg-orange-50 rounded-full w-1/2" />
                      <div className="h-3 bg-orange-50 rounded-full w-3/4" />
                      <div className="h-3 bg-orange-50 rounded-full w-1/3" />
                      <div className="h-8 bg-orange-50 rounded-full w-1/3 ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            ) : visible.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border-2 border-dashed border-orange-200">
                <div className="text-5xl mb-3">🔮</div>
                <p className="font-bold text-slate-800 mb-1">कोई ज्योतिषी नहीं मिले</p>
                <p className="text-slate-500 text-sm mb-5">खोज शब्द या विषय बदल कर देखें</p>
                <button onClick={clearFilters} className="px-6 py-2.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm cursor-pointer">
                  सभी ज्योतिषी देखें
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {visible.map((astro, i) => (
                  <AstrologerRow key={astro._id} astro={astro} index={i} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Join as astrologer */}
        <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFE7CC] via-[#FFF1E0] to-[#FFE2C2] border border-orange-200 px-6 py-10 sm:px-12 sm:py-12">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-orange-600 mb-2">🪷 Astrologer Partner</span>
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#3D2A1E] leading-tight">
              क्या आप ज्योतिषी, हस्तरेखा विशेषज्ञ या टैरो रीडर हैं?
            </h3>
            <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
              राम जी की सेना के श्रद्धालुओं से सीधे जुड़ें। अपनी सुविधानुसार समय तय करें और भक्तों का मार्गदर्शन करें।
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/astrologer/register" className="btn-shine px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm shadow-divine inline-flex items-center gap-2">
                पंजीकरण करें <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/astrologer/login" className="px-5 py-3 rounded-full bg-white hover:bg-orange-50 text-orange-700 border border-orange-300 font-bold text-sm">
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
