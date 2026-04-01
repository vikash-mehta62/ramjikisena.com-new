'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Star, 
  ChevronRight, 
  UserCheck, 
  SlidersHorizontal,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Pandit {
  _id: string;
  name: string;
  photo: string;
  experience: number;
  specialization: string[];
  location: {
    city: string;
    state: string;
  };
  averageRating: number;
  totalBookings: number;
  description: string;
  isVerified: boolean;
}

export default function PanditsPage() {
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    specialization: ''
  });

  useEffect(() => {
    const fetchPandits = async () => {
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.city) params.append('city', filters.city);
        if (filters.specialization) params.append('specialization', filters.specialization);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pandits?${params}`);
        const data = await response.json();

        if (data.success) {
          setPandits(data.pandits);
        }
      } catch (error) {
        console.error('Error fetching pandits:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchPandits, 500);
    return () => clearTimeout(debounce);
  }, [filters]);

  return (
    <div className="min-h-screen bg-[#FFFAF3] selection:bg-orange-100">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-[320px] md:h-[400px] w-full overflow-hidden">
        <Image
          src="/home/Pradeep-Ji-Mishra.webp"
          alt="Pandit Ji"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-[#FFFAF3]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
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

      {/* Search Section */}
      <section className="pb-6 -mt-6 relative z-10">
        <div className="container mx-auto px-4 text-center">
          {/* Compact Search Bar */}
          <div className="max-w-xl mx-auto flex gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-9 pr-3 py-3 bg-white rounded-xl shadow-sm border border-orange-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 bg-white border border-orange-100 rounded-xl shadow-sm hover:bg-orange-50 transition-colors"
            >
              <SlidersHorizontal className={`w-4 h-4 ${showFilters ? 'text-orange-600' : 'text-slate-400'}`} />
            </button>
          </div>

          {/* Filter Dropdown */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="max-w-xl mx-auto grid grid-cols-2 gap-2 mt-2 overflow-hidden"
              >
                <input 
                  type="text" 
                  placeholder="City" 
                  className="w-full px-3 py-2 bg-white/70 rounded-lg border border-orange-100 text-[10px] font-bold outline-none"
                  value={filters.city}
                  onChange={(e) => setFilters({...filters, city: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Puja Type" 
                  className="w-full px-3 py-2 bg-white/70 rounded-lg border border-orange-100 text-[10px] font-bold outline-none"
                  value={filters.specialization}
                  onChange={(e) => setFilters({...filters, specialization: e.target.value})}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* --- PANDITS GRID (2 Columns Mobile) --- */}
      <main className="container mx-auto px-2 md:px-6 pb-20">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading...</p>
          </div>
        ) : pandits.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[2rem] border border-dashed border-orange-200">
             <p className="text-slate-500 font-bold">No Pandit Ji found in this area.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
            <AnimatePresence>
              {pandits.map((pandit, i) => (
                <motion.div
                  key={pandit._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-sm border border-orange-50 group hover:shadow-xl transition-all duration-300"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                    <img 
                      src={pandit.photo || '/placeholder-pandit.jpg'} 
                      alt={pandit.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Top Badges */}
                    <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                      {pandit.isVerified && (
                        <div className="bg-green-500 text-white p-1 rounded-full shadow-lg">
                          <UserCheck className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                        </div>
                      )}
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute bottom-1.5 right-1.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-lg flex items-center gap-0.5 shadow-sm border border-white/50">
                      <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                      <span className="font-black text-slate-900 text-[9px] md:text-xs">
                        {pandit.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Info Body */}
                  <div className="p-2.5 md:p-6">
                    <h3 className="text-[12px] md:text-xl font-black text-slate-900 leading-tight mb-0.5 md:mb-1 truncate group-hover:text-orange-600 transition-colors">
                      {pandit.name}
                    </h3>
                    
                    <div className="flex items-center gap-1 text-[9px] md:text-sm text-slate-400 font-bold mb-3">
                      <MapPin className="w-2.5 h-2.5 text-orange-400" />
                      <span className="truncate">{pandit.location.city}</span>
                    </div>

                    {/* Stats (Desktop Only for Clean Mobile Look) */}
                    <div className="hidden md:flex gap-2 mb-4">
                      <div className="flex-1 bg-slate-50 py-2 rounded-xl text-center border border-slate-100">
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Exp</p>
                        <p className="text-xs font-black text-slate-700">{pandit.experience}Y</p>
                      </div>
                      <div className="flex-1 bg-slate-50 py-2 rounded-xl text-center border border-slate-100">
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Booked</p>
                        <p className="text-xs font-black text-slate-700">{pandit.totalBookings}+</p>
                      </div>
                    </div>

                    {/* Specialization Tags (Mobile Optimized) */}
                    <div className="flex flex-wrap gap-1 mb-3 h-4 overflow-hidden">
                      {pandit.specialization.slice(0, 1).map((s, idx) => (
                        <span key={idx} className="text-[8px] md:text-[10px] font-black uppercase text-orange-600 px-1">
                          • {s}
                        </span>
                      ))}
                    </div>

                    <Link 
                      href={`/pandits/${pandit._id}`}
                      className="w-full py-2 md:py-4 bg-slate-900 text-white text-[10px] md:text-xs font-black rounded-lg md:rounded-2xl flex items-center justify-center gap-1 active:scale-95 transition-all shadow-lg shadow-slate-900/10"
                    >
                      BOOK NOW <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* --- SIMPLE FOOTER --- */}
      <footer className="py-10 bg-[#0a0a0c] text-center border-t border-white/5 mt-10">
        <p className="text-slate-600 text-[10px] tracking-widest uppercase">
          © 2026 Ramji Ki Sena • Spiritual Services
        </p>
      </footer>
    </div>
  );
}