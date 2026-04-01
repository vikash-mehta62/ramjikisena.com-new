'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, FilterX, ArrowRight, Radio } from 'lucide-react';

interface KathaVachak {
  _id: string;
  name: string;
  photo: string;
  experience: number;
  specialization: string;
  description: string;
  contact: { phone?: string; email?: string; whatsapp?: string; };
  liveKathas: Array<{
    _id: string; city: string; state: string;
    startDate: string; endDate: string;
    liveLink?: string; kathaType: string; isActive: boolean;
  }>;
  averageRating: number;
  reviews: any[];
  isLive?: boolean;
}

export default function KathaVachakListing() {
  const [kathaVachaks, setKathaVachaks] = useState<KathaVachak[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [liveFilter, setLiveFilter] = useState<'all' | 'live' | 'offline'>('all');

  useEffect(() => { fetchKathaVachaks(); }, [search, cityFilter, liveFilter]);

  const fetchKathaVachaks = async () => {
    try {
      let url = `/api/katha-vachaks?search=${search}&city=${cityFilter}`;
      if (liveFilter === 'live') url += '&isLive=true';
      const response = await api.get(url);
      const data = await response.json();
      if (data.success) {
        let filtered = data.kathaVachaks;
        if (liveFilter === 'offline') filtered = filtered.filter((kv: KathaVachak) => !isCurrentlyLive(kv));
        setKathaVachaks(filtered);
      }
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const isCurrentlyLive = (kv: KathaVachak) => {
    const now = new Date();
    return kv.liveKathas.some(k => {
      if (!k.isActive) return false;
      const start = new Date(k.startDate);
      if (!k.endDate) return start <= now;
      return start <= now && new Date(k.endDate) >= now;
    });
  };

  const getCurrentLiveKatha = (kv: KathaVachak) => {
    const now = new Date();
    return kv.liveKathas.find(k => {
      if (!k.isActive) return false;
      const start = new Date(k.startDate);
      if (!k.endDate) return start <= now;
      return start <= now && new Date(k.endDate) >= now;
    });
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FFFAF3]">
      <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFAF3] text-slate-900 antialiased selection:bg-orange-200">
      <Navbar showAuthButtons={true} />

      {/* Hero Banner */}
      <div className="relative h-[320px] md:h-[400px] w-full overflow-hidden">
        <Image
          src="/home/kathavachak.webp"
          alt="Katha Vachak"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-[#FFFAF3]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 text-white"
              style={{ background: 'rgba(200,130,0,0.5)', border: '1px solid rgba(200,130,0,0.4)' }}>
              🙏 आध्यात्मिक प्रवचन
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-2xl">
              कथा <span style={{ color: '#f9e07a' }}>वाचक</span>
            </h1>
            <p className="text-orange-200/80 text-sm mt-3 font-medium tracking-widest uppercase">
              Divine Storytellers &amp; Spiritual Guides
            </p>
          </motion.div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-2 sm:px-6 pb-12 -mt-6 relative z-10">

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 mb-8 px-2">
          <div className="md:col-span-4 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={16} />
            <input type="text" placeholder="नाम खोजें..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-orange-100 rounded-2xl text-xs font-bold focus:border-orange-500 outline-none transition-all shadow-sm" />
          </div>
          <div className="md:col-span-3 relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={16} />
            <input type="text" placeholder="City..." value={cityFilter} onChange={e => setCityFilter(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-orange-100 rounded-2xl text-xs font-bold focus:border-orange-500 outline-none transition-all shadow-sm" />
          </div>
          <div className="md:col-span-3">
            <select value={liveFilter} onChange={e => setLiveFilter(e.target.value as 'all' | 'live' | 'offline')}
              className="w-full px-4 py-3.5 bg-white border border-orange-100 rounded-2xl text-xs font-bold focus:border-orange-500 outline-none transition-all shadow-sm">
              <option value="all">All Status</option>
              <option value="live">🟢 Live Now</option>
              <option value="offline">⚪ Offline</option>
            </select>
          </div>
          <button onClick={() => { setSearch(''); setCityFilter(''); setLiveFilter('all'); }}
            className="md:col-span-2 flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 rounded-2xl text-xs font-black shadow-lg hover:bg-orange-600 transition-all active:scale-95">
            <FilterX size={16} /> RESET
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-6 px-1">
          <AnimatePresence mode="popLayout">
            {kathaVachaks.map((kv, i) => {
              const isLive = isCurrentlyLive(kv);
              const liveKatha = getCurrentLiveKatha(kv);
              return (
                <motion.div layout key={kv._id}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="group bg-white rounded-2xl md:rounded-[2.5rem] border border-orange-50 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  {/* Photo */}
                  <div className="relative aspect-[4/3] md:h-52 overflow-hidden bg-slate-100">
                    {kv.photo ? (
                      <img src={kv.photo} alt={kv.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl opacity-20 bg-orange-50">🙏</div>
                    )}
                    {isLive && (
                      <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-red-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg flex items-center gap-1.5 shadow-lg animate-pulse">
                        <Radio size={10} className="sm:w-3 sm:h-3" />
                        <span className="text-[9px] sm:text-[11px] font-black uppercase">LIVE</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/80 backdrop-blur-md px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-lg flex items-center gap-1 shadow-sm border border-white/40">
                      <Star size={10} className="fill-orange-500 text-orange-500 sm:w-3 sm:h-3" />
                      <span className="text-[9px] sm:text-xs font-black text-slate-800">
                        {kv.averageRating > 0 ? kv.averageRating.toFixed(1) : 'NEW'}
                      </span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-2.5 sm:p-5">
                    <h3 className="text-[12px] sm:text-lg font-black text-slate-900 mb-0.5 group-hover:text-orange-600 transition-colors truncate tracking-tighter">
                      {kv.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-orange-600 font-bold mb-2 truncate">
                      {kv.specialization || 'Katha Vachak'}
                    </p>
                    <span className="inline-flex items-center bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full text-[9px] sm:text-[11px] font-black mb-2">
                      {kv.experience} yrs exp
                    </span>
                    {isLive && liveKatha && (
                      <div className="mb-2 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-[9px] sm:text-[10px] font-black text-red-700 uppercase flex items-center gap-1 mb-0.5">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                          {liveKatha.kathaType}
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-slate-600 font-semibold">📍 {liveKatha.city}, {liveKatha.state}</p>
                      </div>
                    )}
                    <div className="flex flex-col gap-2 pt-2 sm:pt-3 border-t border-orange-50">
                      <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {kv.reviews.length} reviews
                      </span>
                      <Link href={`/katha-vachaks/${kv._id}`}
                        className="w-full py-2 sm:py-3 bg-orange-600 text-white rounded-xl sm:rounded-2xl text-[9px] sm:text-xs font-black flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all group/btn">
                        VIEW <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {!loading && kathaVachaks.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-orange-200 mx-2 shadow-inner">
            <div className="text-5xl mb-3">📖</div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No Katha Vachaks Found</p>
          </div>
        )}
      </main>
      <footer className="py-12 text-center border-t border-orange-100 mt-10">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.8em]">जय श्री राम</p>
      </footer>
    </div>
  );
}
