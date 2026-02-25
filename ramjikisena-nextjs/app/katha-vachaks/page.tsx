'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
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
  contact: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
  liveKathas: Array<{
    _id: string;
    city: string;
    state: string;
    startDate: string;
    endDate: string;
    liveLink?: string;
    kathaType: string;
    isActive: boolean;
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

  useEffect(() => {
    fetchKathaVachaks();
  }, [search, cityFilter, liveFilter]);

  const fetchKathaVachaks = async () => {
    try {
      let url = `/api/katha-vachaks?search=${search}&city=${cityFilter}`;
      if (liveFilter === 'live') url += '&isLive=true';
      
      const response = await api.get(url);
      const data = await response.json();
      if (data.success) {
        // Filter by live status on frontend if needed
        let filtered = data.kathaVachaks;
        if (liveFilter === 'offline') {
          filtered = filtered.filter((kv: KathaVachak) => !isCurrentlyLive(kv));
        }
        setKathaVachaks(filtered);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isCurrentlyLive = (kathaVachak: KathaVachak) => {
    const now = new Date();
    return kathaVachak.liveKathas.some(katha => {
      if (!katha.isActive) return false;
      const start = new Date(katha.startDate);
      
      // If no end date, consider it ongoing (live)
      if (!katha.endDate) {
        return start <= now;
      }
      
      const end = new Date(katha.endDate);
      return start <= now && end >= now;
    });
  };

  const getCurrentLiveKatha = (kathaVachak: KathaVachak) => {
    const now = new Date();
    return kathaVachak.liveKathas.find(katha => {
      if (!katha.isActive) return false;
      const start = new Date(katha.startDate);
      
      // If no end date, consider it ongoing (live)
      if (!katha.endDate) {
        return start <= now;
      }
      
      const end = new Date(katha.endDate);
      return start <= now && end >= now;
    });
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
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              कथा <span className="text-orange-600">वाचक</span>
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              Divine Storytellers & Spiritual Guides
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black bg-orange-100 text-orange-700 px-2 py-1 rounded-md uppercase tracking-tighter">
              Total: {kathaVachaks.length} Katha Vachaks
            </span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-10">
          <div className="md:col-span-4 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="नाम खोजें..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
            />
          </div>
          <div className="md:col-span-3 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="शहर..."
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
            />
          </div>
          <div className="md:col-span-3">
            <select
              value={liveFilter}
              onChange={(e) => setLiveFilter(e.target.value as any)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
            >
              <option value="all">All Status</option>
              <option value="live">🟢 Live Now</option>
              <option value="offline">⚪ Offline</option>
            </select>
          </div>
          <button
            onClick={() => { setSearch(''); setCityFilter(''); setLiveFilter('all'); }}
            className="md:col-span-2 flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors active:scale-95"
          >
            <FilterX size={16} /> Reset
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {kathaVachaks.map((kv) => {
              const isLive = isCurrentlyLive(kv);
              const liveKatha = getCurrentLiveKatha(kv);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={kv._id}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    {kv.photo ? (
                      <img src={kv.photo} alt={kv.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-5xl">
                        🙏
                      </div>
                    )}
                    
                    {/* Live Badge */}
                    {isLive && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-lg flex items-center gap-2 shadow-lg animate-pulse">
                        <Radio size={12} className="animate-ping" />
                        <span className="text-[11px] font-black uppercase">LIVE NOW</span>
                      </div>
                    )}

                    {/* Rating */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-slate-100">
                      <Star size={12} className="fill-orange-500 text-orange-500" />
                      <span className="text-[11px] font-black text-slate-800">
                        {kv.averageRating > 0 ? kv.averageRating.toFixed(1) : 'New'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-md font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors truncate">
                      {kv.name}
                    </h3>

                    <p className="text-[11px] text-orange-600 font-bold mb-2">
                      {kv.specialization || 'Katha Vachak'}
                    </p>

                    {isLive && liveKatha && (
                      <div className="mb-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg">
                        <p className="text-[10px] font-black text-red-700 uppercase mb-1 flex items-center gap-1">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                          {liveKatha.kathaType}
                        </p>
                        <p className="text-[10px] text-slate-700 font-semibold mb-1">
                          📍 {liveKatha.city}, {liveKatha.state}
                        </p>
                        <p className="text-[9px] text-slate-500">
                          Until {new Date(liveKatha.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-slate-500 mb-4">
                      <span className="text-[11px] font-medium">
                        {kv.experience} years experience
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-1 text-slate-400">
                        <span className="text-[10px] font-bold uppercase">
                          {kv.reviews.length} reviews
                        </span>
                      </div>

                      <Link
                        href={`/katha-vachaks/${kv._id}`}
                        className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-[11px] font-black hover:bg-orange-600 hover:text-white transition-all group/btn"
                      >
                        VIEW <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {kathaVachaks.length === 0 && (
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
