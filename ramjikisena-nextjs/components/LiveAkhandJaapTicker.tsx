'use client';

import { useState, useEffect } from 'react';
import { Flame, Sparkles, Users, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LIVE_DEDICATIONS = [
  { city: 'अयोध्या धाम', name: 'रमेश शर्मा जी', count: '108 जाप', type: 'माला पूर्ण 🙏' },
  { city: 'काशी (वाराणसी)', name: 'अमित मिश्रा जी', count: '108 नाम', type: 'पुण्य संचित 🚩' },
  { city: 'जनकपुर धाम', name: 'सीता शरण जी', count: '216 जाप', type: '2 माला पूर्ण 🌸' },
  { city: 'जयपुर', name: 'सुनीता अग्रवाल जी', count: '108 जाप', type: 'दीपदान अर्पित 🪔' },
  { city: 'चित्रकूट', name: 'राम भक्त मंडल', count: '1,008 जाप', type: 'अखंड साधना ✨' },
  { city: 'उज्जैन', name: 'राजेश तिवारी जी', count: '108 जाप', type: 'माला पूर्ण 🙏' },
  { city: 'हरिद्वार', name: 'प्रिया वैष्णव जी', count: '108 नाम', type: 'पुण्य संचित 🚩' },
  { city: 'नासिक (पंचवटी)', name: 'गोपाल जोशी जी', count: '324 जाप', type: '3 माला पूर्ण 🌸' },
];

export default function LiveAkhandJaapTicker() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [baseCount, setBaseCount] = useState(14286108);

  // Auto rotate devotee dedications every 3.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % LIVE_DEDICATIONS.length);
      // Subtle organic increment in global counter
      setBaseCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const cur = LIVE_DEDICATIONS[activeIdx];

  const scrollToJaap = () => {
    const el = document.getElementById('jaap');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-6 max-w-6xl mt-6 sm:mt-8 mb-1">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2A0E04] via-[#4A1705] to-[#2A0E04] text-white p-3 sm:p-4 border border-amber-500/30 shadow-lg shadow-orange-950/20">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          
          {/* Left: Flame & Title */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/30">
              <Flame className="w-5 h-5 text-yellow-200 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-1.5 justify-center md:justify-start">
                <span className="text-xs sm:text-sm font-serif font-black tracking-wide text-amber-200">
                  अखंड राम नाम महायज्ञ
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">LIVE</span>
              </div>
              <p className="text-[11px] text-amber-100/70 font-medium">विश्वव्यापी डिजिटल राम नाम साधना</p>
            </div>
          </div>

          {/* Center: Live Community Ticker */}
          <div className="flex-1 max-w-md w-full overflow-hidden px-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-center md:justify-start gap-2 bg-white/10 backdrop-blur-xs py-1.5 px-3 rounded-full border border-white/10 text-xs"
              >
                <span className="text-orange-300 font-bold">🚩 {cur.city}:</span>
                <span className="text-white font-medium truncate">{cur.name}</span>
                <span className="text-amber-300 font-bold shrink-0">+{cur.count}</span>
                <span className="text-[10px] text-emerald-300 font-semibold shrink-0 hidden sm:inline">({cur.type})</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Grand Total & CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase font-bold text-amber-200/80 tracking-wider">कुल संचित राम नाम</p>
              <p className="text-base sm:text-lg font-mono font-black text-amber-300 leading-tight">
                {baseCount.toLocaleString('en-IN')}+
              </p>
            </div>

            <button
              onClick={scrollToJaap}
              className="py-1.5 px-3.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-[#451a03] shadow-md shadow-orange-500/25 flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
            >
              <span>आप भी जपें</span>
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
