'use client';

import { useState, useMemo } from 'react';
import { Calendar, Sunrise, Sparkles, Clock, Compass, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Vedic Panchang calculation based on current date
export default function DailyPanchang() {
  const [expanded, setExpanded] = useState(false);

  // Dynamic daily tithi calculation based on real date
  const panchangData = useMemo(() => {
    const today = new Date();
    const dayNames = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
    const monthNamesHindi = ['चैत्र', 'वैशाख', 'ज्येष्ठ', 'आषाढ़', 'श्रावण', 'भाद्रपद', 'अश्विन', 'कार्तिक', 'मार्गशीर्ष', 'पौष', 'माघ', 'फाल्गुन'];
    
    const dayOfWeek = dayNames[today.getDay()];
    // Approximate Hindu month mapping for display
    const monthIdx = (today.getMonth() + 10) % 12;
    const hinduMonth = monthNamesHindi[monthIdx];
    
    // Tithi approximation
    const dayNum = today.getDate();
    const paksha = dayNum <= 15 ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';
    const tithiNum = (dayNum % 15) || 15;
    const tithiNames = [
      'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी',
      'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
      'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा / अमावस्या'
    ];
    const tithiName = tithiNames[tithiNum - 1] || 'एकादशी';

    const nakshatraList = ['रोहिणी', 'मृगशिरा', 'पुनर्वसु', 'पुष्य', 'हस्त', 'चित्रा', 'स्वाति', 'अनुराधा', 'श्रवण'];
    const nakshatra = nakshatraList[dayNum % nakshatraList.length];

    // Formatted date
    const dateStr = today.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return {
      dayOfWeek,
      hinduMonth,
      paksha,
      tithiName,
      nakshatra,
      dateStr,
      samvat: 'विक्रम संवत 2083',
      sunrise: '06:22 AM',
      sunset: '05:48 PM',
      abhijit: '11:46 AM – 12:34 PM',
      rahukaal: '01:30 PM – 02:55 PM',
      shubhChoghadiya: 'अमृत (06:22 AM - 07:45 AM) • शुभ (10:30 AM - 12:00 PM)',
      specialNote: 'श्री राम नाम जप एवं दीपदान हेतु पावन समय'
    };
  }, []);

  return (
    <div className="container mx-auto px-3 sm:px-6 max-w-6xl mt-4 sm:mt-6">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-300/60 bg-gradient-to-r from-[#FFF8EE] via-[#FFF3DF] to-[#FFF8EE] shadow-md shadow-orange-950/5 p-3.5 sm:p-5">
        
        {/* Subtle background ornamentation */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-orange-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="relative flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-orange-200/70">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-sm">
              <Calendar className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-amber-950 font-serif">
                  आज का दैनिक पंचांग व शुभ मुहूर्त
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-bold">
                  आज • {panchangData.dayOfWeek}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-amber-900/80 font-medium">
                {panchangData.dateStr} • {panchangData.hinduMonth}, {panchangData.paksha} {panchangData.tithiName}
              </p>
            </div>
          </div>

          {/* Toggle button */}
          <button
            onClick={() => setExpanded(prev => !prev)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-orange-800 bg-white/90 hover:bg-white border border-amber-300 shadow-xs transition-all cursor-pointer"
          >
            <span>{expanded ? 'संक्षिप्त देखें' : 'विस्तृत मुहूर्त'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Core Muhurat Grid */}
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3">
          
          {/* Tithi & Nakshatra */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-white/80 border border-orange-100 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-500 truncate">तिथि व नक्षत्र</p>
              <p className="text-xs sm:text-sm font-black text-slate-900 truncate">{panchangData.tithiName}</p>
              <p className="text-[10px] text-orange-700 font-semibold truncate">{panchangData.nakshatra} नक्षत्र</p>
            </div>
          </div>

          {/* Abhijit Muhurat */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-emerald-50/90 to-amber-50/60 border border-emerald-200/80 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-emerald-800 truncate">शुभ अभिजित मुहूर्त</p>
              <p className="text-xs sm:text-sm font-black text-emerald-950 truncate">{panchangData.abhijit}</p>
              <p className="text-[10px] text-emerald-700 font-semibold truncate">सर्वश्रेष्ठ फलदायी</p>
            </div>
          </div>

          {/* Rahukaal */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-white/80 border border-orange-100 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <Shield className="w-3.5 h-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-500 truncate">राहुकाल (त्याज्य)</p>
              <p className="text-xs sm:text-sm font-black text-rose-900 truncate">{panchangData.rahukaal}</p>
              <p className="text-[10px] text-slate-500 font-medium truncate">शुभ कार्य वर्जित</p>
            </div>
          </div>

          {/* Sun timings */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-white/80 border border-orange-100 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Sunrise className="w-3.5 h-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-500 truncate">सूर्योदय • सूर्यास्त</p>
              <p className="text-xs sm:text-sm font-black text-slate-900 truncate">{panchangData.sunrise} • {panchangData.sunset}</p>
              <p className="text-[10px] text-amber-800 font-semibold truncate">{panchangData.samvat}</p>
            </div>
          </div>

        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pt-3 mt-3 border-t border-orange-200/60"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-amber-100">
                  <p className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-orange-600" /> आज का चौघड़िया (Choghadiya)
                  </p>
                  <p className="text-xs font-bold text-slate-800 mt-1 leading-relaxed">
                    {panchangData.shubhChoghadiya}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-[10px] font-bold uppercase text-amber-900 flex items-center gap-1">
                    🚩 आज का पावन संकल्प (Sankalp)
                  </p>
                  <p className="text-xs font-bold text-amber-950 mt-1 leading-relaxed">
                    {panchangData.specialNote} — आज के दिन 108 राम नाम का जप विशेष पुण्यकारी है।
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
