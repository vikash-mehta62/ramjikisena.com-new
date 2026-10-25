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
    <div className="w-full mb-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#581404] via-[#7A1D05] to-[#581404] text-white p-3.5 sm:p-4 border border-amber-500/30 shadow-md">
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          
          {/* Left: Flame & Title */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-sm">
              <Flame className="w-5 h-5 text-amber-200" />
            </span>
            <div>
              <div className="flex items-center gap-1.5 justify-center md:justify-start">
                <span className="text-xs sm:text-sm font-serif font-black tracking-wide text-amber-200">
                  अखंड राम नाम महायज्ञ
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-amber-100/70 font-medium">विश्वव्यापी डिजिटल राम नाम साधना</p>
            </div>
          </div>

          {/* Center: Live Community Ticker */}
          <div className="flex-1 max-w-md w-full overflow-hidden px-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center md:justify-start gap-2 bg-white/10 py-1.5 px-3.5 rounded-full border border-white/10 text-xs"
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
              type="button"
              onClick={scrollToJaap}
              className="py-1.5 px-4 rounded-full text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-sm flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
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
