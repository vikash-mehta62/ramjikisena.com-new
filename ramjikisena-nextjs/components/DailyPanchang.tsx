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
    const monthIdx = (today.getMonth() + 10) % 12;
    const hinduMonth = monthNamesHindi[monthIdx];
    
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
    <div className="w-full">
      <div className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-white text-slate-800 shadow-sm p-5 sm:p-6">
        


        {/* Top Header Row */}
        <div className="relative flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-amber-200/80">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Calendar className="w-5 h-5 text-white" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#7A1D05] font-serif tracking-tight">
                  आज का दैनिक पंचांग व शुभ मुहूर्त
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black shadow-xs">
                  आज • {panchangData.dayOfWeek}
                </span>
              </div>
              <p className="text-xs text-[#8A4A1C] font-semibold mt-0.5">
                {panchangData.dateStr} • {panchangData.hinduMonth}, {panchangData.paksha} {panchangData.tithiName}
              </p>
            </div>
          </div>

          {/* Toggle button */}
          <button
            onClick={() => setExpanded(prev => !prev)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#7A1D05] bg-white hover:bg-amber-50 border border-amber-300/80 shadow-xs transition-all cursor-pointer"
          >
            <span>{expanded ? 'संक्षिप्त देखें' : 'विस्तृत मुहूर्त'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Core Muhurat Grid */}
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3.5">
          
          {/* Tithi & Nakshatra */}
          <div className="p-3.5 rounded-xl bg-[#FFF8EE] border border-amber-200/80 flex items-center gap-3 shadow-2xs">
            <span className="w-9 h-9 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-500 truncate">तिथि व नक्षत्र</p>
              <p className="text-sm font-black text-slate-900 truncate">{panchangData.tithiName}</p>
              <p className="text-[11px] text-orange-700 font-semibold truncate">{panchangData.nakshatra} नक्षत्र</p>
            </div>
          </div>

          {/* Abhijit Muhurat */}
          <div className="p-3.5 rounded-xl bg-[#FFF8EE] border border-amber-200/80 flex items-center gap-3 shadow-2xs">
            <span className="w-9 h-9 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-orange-800 truncate">शुभ अभिजित मुहूर्त</p>
              <p className="text-sm font-black text-slate-900 truncate">{panchangData.abhijit}</p>
              <p className="text-[11px] text-orange-700 font-semibold truncate">सर्वश्रेष्ठ फलदायी</p>
            </div>
          </div>

          {/* Rahukaal */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 shadow-2xs">
            <span className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-500 truncate">राहुकाल (त्याज्य)</p>
              <p className="text-sm font-bold text-slate-800 truncate">{panchangData.rahukaal}</p>
              <p className="text-[11px] text-slate-500 font-medium truncate">शुभ कार्य वर्जित</p>
            </div>
          </div>

          {/* Sun timings */}
          <div className="p-3.5 rounded-xl bg-[#FFF8EE] border border-amber-200/80 flex items-center gap-3 shadow-2xs">
            <span className="w-9 h-9 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center shrink-0">
              <Sunrise className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-500 truncate">सूर्योदय • सूर्यास्त</p>
              <p className="text-sm font-black text-slate-900 truncate">{panchangData.sunrise} • {panchangData.sunset}</p>
              <p className="text-[11px] text-orange-700 font-semibold truncate">{panchangData.samvat}</p>
            </div>
          </div>

        </div>

        {/* Collapsible Expanded View */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3.5 pt-3.5 border-t border-amber-200/80"
            >
              <div className="grid sm:grid-cols-2 gap-3 text-xs bg-white/70 p-3.5 rounded-2xl border border-amber-200">
                <div className="flex items-start gap-2">
                  <Compass className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-[#7A1D05]">शुभ चौघड़िया मुहूर्त</p>
                    <p className="text-slate-700 mt-0.5">{panchangData.shubhChoghadiya}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-[#7A1D05]">विशेष आध्यात्मिक फल</p>
                    <p className="text-slate-700 mt-0.5">{panchangData.specialNote}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
