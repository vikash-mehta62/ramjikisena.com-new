'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, ArrowRight, BadgeCheck, SlidersHorizontal, X, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';

interface PanditService {
  poojaType: string;
  price: number;
}

interface Pandit {
  _id: string;
  name: string;
  photo: string;
  experience: number;
  specialization: string[];
  location: { city: string; state: string };
  averageRating: number;
  totalBookings: number;
  description: string;
  isVerified: boolean;
  services?: PanditService[];
}

// Category filters match against specialization + service names (data is free text, Hindi or English)
const CATEGORIES = [
  { id: 'puja', label: 'पूजा', words: ['puja', 'pooja', 'पूजा', 'path', 'पाठ', 'satyanarayan', 'सत्यनारायण', 'rudrabhishek', 'रुद्राभिषेक', 'vedic', 'वैदिक'] },
  { id: 'havan', label: 'हवन', words: ['havan', 'हवन', 'yagya', 'yajna', 'यज्ञ', 'homa'] },
  { id: 'sanskar', label: 'संस्कार', words: ['sanskar', 'संस्कार', 'vivah', 'विवाह', 'marriage', 'griha', 'गृह', 'mundan', 'मुंडन', 'namkaran', 'नामकरण', 'janeu', 'जनेऊ'] },
  { id: 'katha', label: 'कथा', words: ['katha', 'कथा', 'bhagwat', 'भागवत', 'ramayan', 'रामायण', 'sundarkand', 'सुंदरकांड'] },
];

const EXPERIENCE = [
  { id: '0-5', label: '0-5 वर्ष', min: 0, max: 5 },
  { id: '5-10', label: '5-10 वर्ष', min: 5, max: 10 },
  { id: '10+', label: '10+ वर्ष', min: 10, max: Infinity },
];

const PRICE_MAX = 5000;

const startingPrice = (p: Pandit) => {
  const prices = (p.services || []).map(s => s.price).filter(n => n > 0);
  return prices.length ? Math.min(...prices) : null;
};

function PanditRow({ pandit, index }: { pandit: Pandit; index: number }) {
  const price = startingPrice(pandit);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.05, duration: 0.35 }}
    >
      <Link
        href={`/pandits/${pandit._id}`}
        className="group flex gap-4 p-3.5 sm:p-4 rounded-2xl bg-white border border-orange-100 shadow-sm hover:shadow-divine hover:border-orange-300 hover:-translate-y-0.5 transition-all"
      >
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-orange-100 to-amber-50">
          {pandit.photo ? (
            <img src={pandit.photo} alt={pandit.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><Sparkles className="w-10 h-10 text-orange-300" /></div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight group-hover:text-orange-700 transition-colors">{pandit.name}</h3>
            {pandit.isVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                <BadgeCheck className="w-3 h-3" /> Verified
              </span>
            )}
          </div>

          {pandit.specialization?.length > 0 && (
            <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-1">{pandit.specialization.slice(0, 4).join(' | ')}</p>
          )}

          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-bold text-slate-800">{pandit.averageRating ? pandit.averageRating.toFixed(1) : '5.0'}</span>
              <span className="text-slate-400">({pandit.totalBookings || 0})</span>
            </span>
            <span className="text-slate-300">•</span>
            <span>{pandit.experience || 0}+ वर्ष अनुभव</span>
            {pandit.location?.city && (
              <>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="hidden sm:inline-flex items-center gap-1"><MapPin className="w-3 h-3 text-orange-500" />{pandit.location.city}</span>
              </>
            )}
          </div>

          <div className="mt-auto pt-2.5 flex items-center justify-between gap-2">
            <span className="text-sm sm:text-base font-bold text-orange-600">
              {price ? `₹ ${price.toLocaleString('en-IN')} से शुरू` : 'दक्षिणा पर चर्चा'}
            </span>
            <span className="btn-shine px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs sm:text-sm font-bold shadow-sm group-hover:shadow-md inline-flex items-center gap-1">
              बुक करें <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function CheckRow({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center gap-2.5 py-1 cursor-pointer text-sm text-slate-700 hover:text-orange-700">
      <input type="checkbox" checked={checked} onChange={onChange} className="w-4 h-4 rounded border-orange-300 accent-orange-600 cursor-pointer" />
      {label}
    </label>
  );
}

export default function PanditsPage() {
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ search: '', city: '', specialization: '' });
  const [categories, setCategories] = useState<string[]>([]);
  const [experience, setExperience] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);

  useEffect(() => {
    const fetchPandits = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.city) params.append('city', filters.city);
        if (filters.specialization) params.append('specialization', filters.specialization);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pandits?${params}`);
        const data = await res.json();
        if (data.success) setPandits(data.pandits);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    const t = setTimeout(fetchPandits, 400);
    return () => clearTimeout(t);
  }, [filters]);

  const toggle = (list: string[], set: (v: string[]) => void, id: string) =>
    set(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);

  const visible = useMemo(() => pandits.filter(p => {
    if (categories.length) {
      const text = [...(p.specialization || []), ...(p.services || []).map(s => s.poojaType)].join(' ').toLowerCase();
      const hit = CATEGORIES.filter(c => categories.includes(c.id)).some(c => c.words.some(w => text.includes(w.toLowerCase())));
      if (!hit) return false;
    }
    if (experience.length) {
      const exp = p.experience || 0;
      if (!EXPERIENCE.filter(e => experience.includes(e.id)).some(e => exp >= e.min && exp < e.max)) return false;
    }
    if (maxPrice < PRICE_MAX) {
      const price = startingPrice(p);
      if (price !== null && price > maxPrice) return false;
    }
    return true;
  }), [pandits, categories, experience, maxPrice]);

  const hasFilters = !!(filters.search || filters.city || categories.length || experience.length || maxPrice < PRICE_MAX);
  const clearAll = () => {
    setFilters({ search: '', city: '', specialization: '' });
    setCategories([]);
    setExperience([]);
    setMaxPrice(PRICE_MAX);
  };

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-slate-900 mb-2">श्रेणी</p>
        {CATEGORIES.map(c => (
          <CheckRow key={c.id} label={c.label} checked={categories.includes(c.id)} onChange={() => toggle(categories, setCategories, c.id)} />
        ))}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900 mb-2">अनुभव</p>
        {EXPERIENCE.map(e => (
          <CheckRow key={e.id} label={e.label} checked={experience.includes(e.id)} onChange={() => toggle(experience, setExperience, e.id)} />
        ))}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900 mb-3">मूल्य सीमा</p>
        <input
          type="range"
          min={500}
          max={PRICE_MAX}
          step={100}
          value={maxPrice}
          onChange={e => setMaxPrice(Number(e.target.value))}
          className="w-full accent-orange-600 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>₹ 0</span>
          <span className="font-bold text-orange-700">{maxPrice >= PRICE_MAX ? `₹ ${PRICE_MAX}+` : `₹ ${maxPrice.toLocaleString('en-IN')}`}</span>
        </div>
      </div>
      {hasFilters && (
        <button onClick={clearAll} className="w-full py-2 rounded-xl text-sm font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 cursor-pointer">
          सभी फ़िल्टर हटाएं
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFCF7]">
      <Navbar />

      <PageHero
        kicker="Vedic Pandits"
        title="पंडित बुक करें"
        sub="अनुभवी और प्रमाणित पंडितों से पूजा और संस्कार कराएं"
      >
        <div className="flex flex-col sm:flex-row gap-2 max-w-2xl p-2 rounded-2xl bg-white/90 backdrop-blur border border-orange-200 shadow-lg shadow-orange-900/5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="पंडित का नाम, पूजा या शहर खोजें"
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-orange-50/50 border border-orange-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div className="relative sm:w-44">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="शहर (उदा. भोपाल)"
              className="w-full pl-9 pr-3 py-3 rounded-xl bg-orange-50/50 border border-orange-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={filters.city}
              onChange={e => setFilters({ ...filters, city: e.target.value })}
            />
          </div>
        </div>
      </PageHero>

      <main className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl py-8 sm:py-10 pb-24">
        {/* Phone: category chips + filter toggle */}
        <div className="lg:hidden mb-5">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
            <button
              onClick={() => setCategories([])}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-bold border cursor-pointer ${categories.length === 0 ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-700 border-orange-200'}`}
            >
              सभी
            </button>
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => toggle(categories, setCategories, c.id)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-bold border cursor-pointer ${categories.includes(c.id) ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-700 border-orange-200'}`}
              >
                {c.label}
              </button>
            ))}
            <button
              onClick={() => setShowFilters(f => !f)}
              className="shrink-0 ml-auto px-3 py-1.5 rounded-full text-sm font-bold border border-orange-200 bg-white text-orange-700 inline-flex items-center gap-1 cursor-pointer"
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
          {/* Desktop sidebar */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 p-5 rounded-2xl bg-white border border-orange-100 shadow-sm">
            {filterPanel}
          </aside>

          <section className="lg:col-span-9">
            {!loading && (
              <p className="text-sm text-slate-500 mb-4">
                <span className="font-bold text-slate-800">{visible.length}</span> पंडित जी उपलब्ध
              </p>
            )}

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
                <div className="text-5xl mb-3">🙏</div>
                <p className="font-bold text-slate-800 mb-1">कोई पंडित जी नहीं मिले</p>
                <p className="text-slate-500 text-sm mb-5">खोज शब्द या फ़िल्टर बदल कर देखें</p>
                <button onClick={clearAll} className="px-6 py-2.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm cursor-pointer">
                  सभी पंडित देखें
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {visible.map((pandit, i) => (
                  <PanditRow key={pandit._id} pandit={pandit} index={i} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
