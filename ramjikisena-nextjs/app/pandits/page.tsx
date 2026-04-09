'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, ChevronRight, UserCheck, SlidersHorizontal, X, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
}

function PanditCard({ pandit, index }: { pandit: Pandit; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-orange-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
    >
      {/* Photo */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-gradient-to-br from-orange-100 to-amber-50 flex-shrink-0">
        {pandit.photo ? (
          <img
            src={pandit.photo}
            alt={pandit.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Sparkles className="w-16 h-16 text-orange-300" />
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Verified badge */}
        {pandit.isVerified && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-[10px] font-black shadow-lg">
            <UserCheck className="w-3 h-3" /> Verified
          </div>
        )}

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-lg">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          <span className="font-black text-slate-900 text-xs">{pandit.averageRating?.toFixed(1) || '5.0'}</span>
        </div>

        {/* Name on image bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-black text-lg leading-tight drop-shadow-lg">{pandit.name}</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-orange-300" />
            <span className="text-orange-200 text-xs font-semibold">{pandit.location?.city}</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-orange-50 rounded-xl p-2.5 text-center border border-orange-100">
            <p className="text-[9px] font-black text-orange-400 uppercase tracking-wide">Experience</p>
            <p className="text-base font-black text-orange-700">{pandit.experience || 0}<span className="text-xs"> yr</span></p>
          </div>
          <div className="bg-orange-50 rounded-xl p-2.5 text-center border border-orange-100">
            <p className="text-[9px] font-black text-orange-400 uppercase tracking-wide">Bookings</p>
            <p className="text-base font-black text-orange-700">{pandit.totalBookings || 0}<span className="text-xs">+</span></p>
          </div>
        </div>

        {/* Specializations */}
        {pandit.specialization?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {pandit.specialization.slice(0, 3).map((s, i) => (
              <span key={i} className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg border border-amber-100">
                {s}
              </span>
            ))}
            {pandit.specialization.length > 3 && (
              <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">
                +{pandit.specialization.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Book button */}
        <Link href={`/pandits/${pandit._id}`}
          className="mt-auto w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 group-hover:shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #f9e07a 0%, #d4920a 50%, #b8760a 100%)',
            color: '#3a0f00',
            boxShadow: '0 4px 12px rgba(180,100,0,0.25)',
          }}>
          🙏 Book Now <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function PanditsPage() {
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ search: '', city: '', specialization: '' });

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

  const hasFilters = filters.search || filters.city || filters.specialization;

  return (
    <div className="min-h-screen bg-[#FFFAF3]">
      <Navbar />

      {/* Hero */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden">
        <Image src="/home/Pradeep-Ji-Mishra.webp" alt="Pandit Ji" fill className="object-cover object-top" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#FFFAF3]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 text-white"
              style={{ background: 'rgba(200,130,0,0.5)', border: '1px solid rgba(200,130,0,0.4)' }}>
              🙏 वैदिक परंपरा
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-2xl">
              पंडित <span style={{ color: '#f9e07a' }}>बुकिंग</span>
            </h1>
            <p className="text-orange-200/80 text-sm mt-3 font-medium tracking-widest uppercase">
              Verified Experts for Every Occasion
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search */}
      <section className="relative z-10 -mt-6 pb-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Pandit naam ya pooja type..."
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                  value={filters.search}
                  onChange={e => setFilters({ ...filters, search: e.target.value })} />
              </div>
              <button onClick={() => setShowFilters(f => !f)}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                  showFilters ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-orange-50'
                }`}>
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              {hasFilters && (
                <button onClick={() => setFilters({ search: '', city: '', specialization: '' })}
                  className="px-3 py-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1 block">City</label>
                      <input type="text" placeholder="e.g. Bhopal"
                        className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                        value={filters.city}
                        onChange={e => setFilters({ ...filters, city: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1 block">Pooja Type</label>
                      <input type="text" placeholder="e.g. Vivah, Havan"
                        className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                        value={filters.specialization}
                        onChange={e => setFilters({ ...filters, specialization: e.target.value })} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Result count */}
          {!loading && (
            <p className="text-center text-xs font-bold text-slate-400 mt-3">
              {pandits.length} पंडित जी मिले
              {hasFilters && <button onClick={() => setFilters({ search: '', city: '', specialization: '' })} className="ml-2 text-orange-500 hover:underline">Clear filters</button>}
            </p>
          )}
        </div>
      </section>

      {/* Grid */}
      <main className="container mx-auto px-4 md:px-6 pb-20 max-w-7xl">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-orange-100 animate-pulse">
                <div className="aspect-[3/4] bg-orange-50" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-orange-50 rounded-full w-3/4" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-12 bg-orange-50 rounded-xl" />
                    <div className="h-12 bg-orange-50 rounded-xl" />
                  </div>
                  <div className="h-10 bg-orange-50 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        ) : pandits.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-orange-200 max-w-md mx-auto">
            <div className="text-5xl mb-4">🙏</div>
            <p className="font-black text-slate-700 mb-2">कोई पंडित जी नहीं मिले</p>
            <p className="text-slate-400 text-sm mb-5">अलग search try करें</p>
            <button onClick={() => setFilters({ search: '', city: '', specialization: '' })}
              className="px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl text-sm hover:bg-orange-600 transition-colors">
              सभी देखें
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {pandits.map((pandit, i) => (
              <PanditCard key={pandit._id} pandit={pandit} index={i} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
