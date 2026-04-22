'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, Star, FilterX, ArrowRight, Shrub, Navigation } from 'lucide-react';

interface Mandir {
  _id: string;
  name: string;
  photos: string[];
  location: {
    city: string;
    state: string;
    coordinates?: { lat: number; lng: number; };
  };
  averageRating: number;
  timing?: { opening: string; closing: string; };
}

export default function CompactMandirListing() {
  const [mandirs, setMandirs] = useState<Mandir[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  useEffect(() => {
    const fetchMandirs = async () => {
      try {
        let url = `/api/mandirs?search=${search}&city=${cityFilter}`;
        const response = await api.get(url);
        const data = await response.json();
        if (data.success) setMandirs(data.mandirs);
      } catch (error) { console.error('Fetch Error:', error); } 
      finally { setLoading(false); }
    };
    const debounce = setTimeout(fetchMandirs, 400);
    return () => clearTimeout(debounce);
  }, [search, cityFilter]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FFFAF3]">
      <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFAF3] text-slate-900 antialiased selection:bg-orange-200">
      <Navbar showAuthButtons={true} />

      <main className="max-w-6xl mx-auto px-2 sm:px-6 pt-24 pb-12">
        
        {/* --- DYNAMIC HEADER --- */}
        <div className="mb-6 md:mb-10 px-3">
          <div className="flex items-end justify-between flex-wrap gap-3">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl md:text-6xl font-black tracking-tight text-slate-900 leading-none">
                पावन <span className="text-orange-600 italic">दर्शन</span>
              </h1>
              <div className="h-1 w-16 bg-orange-500 mt-3 rounded-full" />
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">
                 Explore Divine Destinations
              </p>
            </motion.div>
            <Link href="/mandirs/submit"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #f9e07a, #d4920a)', color: '#3a0f00' }}>
              🛕 मंदिर जोड़ें
            </Link>
          </div>
        </div>

        {/* --- SMART SEARCH & FILTERS --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 mb-8 px-2">
          <div className="md:col-span-5 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search Mandir..."
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-orange-100 rounded-2xl text-xs font-bold focus:border-orange-500 outline-none transition-all shadow-sm"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="md:col-span-4 relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="City..."
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-orange-100 rounded-2xl text-xs font-bold focus:border-orange-500 outline-none transition-all shadow-sm"
              onChange={(e) => setCityFilter(e.target.value)}
            />
          </div>
          <button 
            onClick={() => {setSearch(''); setCityFilter('');}}
            className="md:col-span-3 flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 rounded-2xl text-xs font-black shadow-lg hover:bg-orange-600 transition-all active:scale-95"
          >
            <FilterX size={16} /> RESET
          </button>
        </div>

        {/* --- GRID (2-COLUMN ON MOBILE) --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-6 px-1">
          <AnimatePresence mode="popLayout">
            {mandirs.map((mandir, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                key={mandir._id}
                className="group bg-white rounded-2xl md:rounded-[2.5rem] border border-orange-50 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Photo with Glass Badge */}
                <div className="relative aspect-[4/3] md:h-52 overflow-hidden bg-slate-100">
                  {mandir.photos?.[0] ? (
                    <img 
                      src={mandir.photos[0]} 
                      alt={mandir.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl opacity-20 bg-orange-50">🛕</div>
                  )}
                  
                  {/* Glass Rating */}
                  <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/80 backdrop-blur-md px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-lg flex items-center gap-1 shadow-sm border border-white/40">
                    <Star size={10} className="fill-orange-500 text-orange-500 sm:w-3 sm:h-3" />
                    <span className="text-[9px] sm:text-xs font-black text-slate-800">
                      {mandir.averageRating > 0 ? mandir.averageRating.toFixed(1) : 'NEW'}
                    </span>
                  </div>
                </div>

                {/* Content - Compact for 2-column Grid */}
                <div className="p-2.5 sm:p-6">
                  <h3 className="text-[12px] sm:text-xl font-black text-slate-900 mb-0.5 sm:mb-1 group-hover:text-orange-600 transition-colors truncate tracking-tighter leading-tight">
                    {mandir.name}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-slate-400 mb-3 sm:mb-4">
                    <MapPin size={10} className="text-orange-400" />
                    <span className="text-[9px] sm:text-sm font-bold truncate opacity-80">{mandir.location.city}</span>
                  </div>

                  {/* Actions & Timings */}
                  <div className="flex flex-col gap-2 pt-2 sm:pt-4 border-t border-orange-50">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock size={10} className="text-orange-400" />
                      <span className="text-[8px] sm:text-xs font-black uppercase tracking-tighter">
                        {mandir.timing?.opening || 'Dawn'} - {mandir.timing?.closing || 'Dusk'}
                      </span>
                    </div>
                    
                    <div className="mt-1">
                      <Link 
                        href={`/mandirs/${mandir._id}`} 
                        className="w-full py-2.5 sm:py-4 bg-orange-600 text-white rounded-xl sm:rounded-2xl text-[9px] sm:text-sm font-black flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-orange-900/10 active:scale-95 transition-all group/btn"
                      >
                        VIEW DARSHAN <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform sm:w-4 sm:h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* --- EMPTY STATE --- */}
        {!loading && mandirs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-orange-200 mx-2 shadow-inner">
            <div className="text-5xl mb-3">🕉️</div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No Mandirs Found</p>
          </div>
        )}
      </main>

      <footer className="py-12 text-center border-t border-orange-100 mt-10">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.8em]">जय श्री राम</p>
      </footer>
    </div>
  );
}