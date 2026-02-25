'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, Star, Navigation, FilterX, ArrowRight } from 'lucide-react';

interface Mandir {
  _id: string;
  name: string;
  photos: string[];
  location: {
    city: string;
    state: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  averageRating: number;
  timings?: {
    opening: string;
    closing: string;
  };
  timing?: {
    opening: string;
    closing: string;
  };
}

export default function CompactMandirListing() {
  const [mandirs, setMandirs] = useState<Mandir[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  useEffect(() => {
    fetchMandirs();
  }, [search, cityFilter]);

  const fetchMandirs = async () => {
    try {
      let url = `/api/mandirs?search=${search}&city=${cityFilter}`;
      const response = await api.get(url);
      const data = await response.json();
      if (data.success) setMandirs(data.mandirs);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FAF9F6]">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 antialiased">
      <Navbar showAuthButtons={true} />

      <main className="max-w-6xl mx-auto px-4 pt-20 pb-12">
        {/* --- HEADER SECTION (Compact) --- */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">पावन <span className="text-orange-600">दर्शन</span></h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Explore Divine Destinations</p>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-black bg-orange-100 text-orange-700 px-2 py-1 rounded-md uppercase tracking-tighter">
               Total: {mandirs.length} Mandirs
             </span>
          </div>
        </div>

        {/* --- SEARCH BAR (Mini & Sharp) --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-10">
          <div className="md:col-span-5 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="मंदिर का नाम..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
            />
          </div>
          <div className="md:col-span-4 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="शहर चुनें..."
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => {setSearch(''); setCityFilter('');}}
            className="md:col-span-3 flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors active:scale-95"
          >
            <FilterX size={16} /> Reset Filters
          </button>
        </div>

        {/* --- GRID (Responsive & Tight) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {mandirs.map((mandir) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={mandir._id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-300"
              >
                {/* Compact Image */}
                <div className="relative h-44 overflow-hidden">
                  {mandir.photos?.[0] ? (
                    <img src={mandir.photos[0]} alt={mandir.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl grayscale opacity-50">🛕</div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-slate-100">
                    <Star size={12} className="fill-orange-500 text-orange-500" />
                    <span className="text-[11px] font-black text-slate-800">{mandir.averageRating > 0 ? mandir.averageRating.toFixed(1) : 'New'}</span>
                  </div>
                </div>

                {/* Content (Small & Focused) */}
                <div className="p-4">
                  <h3 className="text-md font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors truncate">
                    {mandir.name}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-slate-500 mb-4">
                    <MapPin size={12} className="shrink-0" />
                    <span className="text-[11px] font-medium truncate">{mandir.location.city}, {mandir.location.state}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold uppercase">{mandir.timing?.opening || 'Dawn'} - {mandir.timing?.closing || 'Dusk'}</span>
                    </div>
                    
                    <div className="flex gap-1">
                      {mandir.location.coordinates && (
                         <a href={`http://google.com/maps?q=${mandir.location.coordinates.lat},${mandir.location.coordinates.lng}`} 
                            className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-orange-600 transition-colors border border-slate-100">
                           <Navigation size={14} />
                         </a>
                      )}
                      <Link href={`/mandirs/${mandir._id}`} className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-[11px] font-black hover:bg-orange-600 hover:text-white transition-all group/btn">
                        VIEW <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* --- EMPTY STATE --- */}
        {mandirs.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Results Found</p>
          </div>
        )}
      </main>

      <footer className="py-8 text-center border-t border-slate-100">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">जय श्री राम</p>
      </footer>
    </div>
  );
}