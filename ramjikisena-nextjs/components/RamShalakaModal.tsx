'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Share2, RotateCcw, Compass, CheckCircle2 } from 'lucide-react';

// The 9 traditional Goswami Tulsidas Ramcharitmanas Chaupais for Ram Shalaka
const SHALAKA_RESULTS = [
  {
    id: 1,
    chaupai: 'सुनि सीय सत्य असीस हमारी। पूजहि मन कामना तुम्हारी।।',
    source: 'श्री रामचरितमानस — बालकाण्ड (सीता-गौरी पूजन)',
    meaning: 'माता गौरी का आशीर्वाद है कि तुम्हारी समस्त मनोकामनाएं पूर्ण होंगी।',
    verdict: 'मनोकामना पूर्ण होगी',
    verdictType: 'success',
    color: 'from-emerald-500 to-teal-600',
    tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 2,
    chaupai: 'प्रबिसि नगर कीजे सब काजा। हृदयँ राखि कोसलपुर राजा।।',
    source: 'श्री रामचरितमानस — सुंदरकाण्ड (हनुमान जी लंका प्रवेश)',
    meaning: 'हृदय में भगवान श्री राम का ध्यान रखकर कार्य प्रारंभ करें, सफलता अवश्य मिलेगी।',
    verdict: 'कार्य सिद्ध होगा',
    verdictType: 'success',
    color: 'from-amber-500 to-orange-600',
    tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    id: 3,
    chaupai: 'होइहि सोई जो राम रचि राखा। को करि तर्क बढ़ावै साखा।।',
    source: 'श्री रामचरितमानस — बालकाण्ड (शिव-पार्वती संवाद)',
    meaning: 'वही होगा जो प्रभु श्री राम ने रच रखा है। व्यर्थ चिंता छोड़कर प्रभु इच्छा पर भरोसा रखें।',
    verdict: 'प्रभु इच्छा पर विश्वास रखें',
    verdictType: 'neutral',
    color: 'from-sky-500 to-blue-600',
    tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    id: 4,
    chaupai: 'गरल सुधा रिपु करहिं मिताई। गोपद सिंधु अनल सितलाई।।',
    source: 'श्री रामचरितमानस — सुंदरकाण्ड',
    meaning: 'प्रभु कृपा से विष भी अमृत बन जाता है, शत्रु भी मित्र बन जाते हैं। संकट टल जाएगा।',
    verdict: 'अत्यंत शुभ फलदायी',
    verdictType: 'success',
    color: 'from-teal-500 to-emerald-600',
    tagColor: 'bg-teal-100 text-teal-800 border-teal-200',
  },
  {
    id: 5,
    chaupai: 'बिधि बस सुजन कुसंगत परहीं। फनि मनि सम निज गुन अनुसरहीं।।',
    source: 'श्री रामचरितमानस — बालकाण्ड',
    meaning: 'यदि परिस्थितिवश कठिनाई भी आए, तो अपने सद्गुण और धैर्य न छोड़ें। विजय आपकी होगी।',
    verdict: 'धैर्य व सावधानी रखें',
    verdictType: 'neutral',
    color: 'from-amber-600 to-yellow-600',
    tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    id: 6,
    chaupai: 'सखा सोच त्यागहु बल मोरें। सब बिधि घटब काज मैं तोरें।।',
    source: 'श्री रामचरितमानस — किष्किन्धाकाण्ड (श्री राम-सुग्रीव संवाद)',
    meaning: 'भगवान कहते हैं कि चिंता छोड़ो, मेरे बल पर भरोसा रखो। तुम्हारे समस्त कार्य पूर्ण होंगे।',
    verdict: 'चिंता त्यागें, कार्य पूर्ण होगा',
    verdictType: 'success',
    color: 'from-orange-500 to-amber-600',
    tagColor: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  {
    id: 7,
    chaupai: 'मुद मंगलमय संत समाजू। जिमि जग जंगम तीरथराजू।।',
    source: 'श्री रामचरितमानस — बालकाण्ड (संत महिमा)',
    meaning: 'संतों और बड़ों के आशीर्वाद से आपका कल्याण होगा और शुभ समाचार प्राप्त होगा।',
    verdict: 'उत्तम व कल्याणकारी',
    verdictType: 'success',
    color: 'from-indigo-500 to-purple-600',
    tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    id: 8,
    chaupai: 'धीरज धर्म मित्र अरु नारी। आपद काल परखिअहिं चारी।।',
    source: 'श्री रामचरितमानस — अरण्यकाण्ड',
    meaning: 'कठिन समय में धैर्य और धर्म का पालन करें। जल्दबाजी न करें, परिणाम सुखद होगा।',
    verdict: 'संयम और विवेक से काम लें',
    verdictType: 'neutral',
    color: 'from-rose-500 to-pink-600',
    tagColor: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  {
    id: 9,
    chaupai: 'बरु भल बास नरक कर ताता। दुष्ट संग जनि देइ बिधाता।।',
    source: 'श्री रामचरितमानस — सुन्दरकाण्ड (विभीषण जी)',
    meaning: 'सत्संगति का ध्यान रखें। सोच-विचार कर आगे बढ़ें, बड़ों का परामर्श अवश्य लें।',
    verdict: 'सतर्कता आवश्यक है',
    verdictType: 'warning',
    color: 'from-amber-700 to-orange-800',
    tagColor: 'bg-amber-100 text-amber-900 border-amber-300',
  },
];

// The sacred 9x9 Shalaka Akshar Grid
const GRID_LETTERS = [
  'सु', 'प्र', 'हो', 'ग', 'बि', 'स', 'मु', 'धी', 'ब',
  'नि', 'बि', 'इ', 'र', 'धि', 'खा', 'द', 'रज', 'रु',
  'सी', 'सि', 'हि', 'ल', 'ब', 'सो', 'मं', 'ध', 'भ',
  'य', 'न', 'सो', 'सु', 'स', 'च', 'ग', 'र्म', 'ल',
  'स', 'ग', 'ई', 'धा', 'सु', 'त्या', 'ल', 'मि', 'बा',
  'त्य', 'र', 'जो', 'रि', 'ज', 'ग', 'म', 'त्र', 'स',
  'अ', 'की', 'रा', 'पु', 'न', 'हु', 'य', 'अ', 'न',
  'सी', 'जे', 'म', 'क', 'कु', 'ब', 'सं', 'रु', 'र',
  'स', 'स', 'र', 'र', 'सं', 'ल', 'त', 'ना', 'क',
];

interface RamShalakaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RamShalakaModal({ isOpen, onClose }: RamShalakaModalProps) {
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [result, setResult] = useState<typeof SHALAKA_RESULTS[0] | null>(null);

  if (!isOpen) return null;

  const handleCellClick = (index: number) => {
    setSelectedCell(index);
    // Map index to one of the 9 sacred chaupais (index % 9)
    const res = SHALAKA_RESULTS[index % SHALAKA_RESULTS.length];
    setResult(res);

    // Play chime sound
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(528, ctx.currentTime);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.25);
      }
    } catch {}

    // Haptic
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate([25, 40, 25]); } catch {}
    }
  };

  const handleReset = () => {
    setSelectedCell(null);
    setResult(null);
  };

  const handleShare = () => {
    if (!result) return;
    const text = encodeURIComponent(
      `🚩 *श्री राम शलाका प्रश्नावली — पावन मार्गदर्शन* 🚩\n\n` +
      `चौपाई: “${result.chaupai}”\n\n` +
      `✨ *फल: ${result.verdict}*\n` +
      `अर्थ: ${result.meaning}\n` +
      `स्रोत: ${result.source}\n\n` +
      `आप भी प्रभु श्री राम से मार्गदर्शन प्राप्त करें:\n` +
      `👉 https://ramjikisena.com`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F0] to-[#FFF3E0] border-2 border-amber-400 shadow-2xl p-4 sm:p-6 text-slate-800 max-h-[92vh] flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="बंद करें"
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-800 flex items-center justify-center cursor-pointer transition-all active:scale-90 z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-black uppercase tracking-wider mb-1 shadow-sm">
              <Compass className="w-3.5 h-3.5" /> श्री राम शलाका प्रश्नावली
            </span>
            <h2 className="text-lg sm:text-2xl font-serif font-black text-[#8B2500]">
              गोस्वामी तुलसीदास कृत रामचरितमानस शलाका
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-600 mt-1 max-w-md mx-auto">
              {!result
                ? 'मन में प्रभु श्री राम का ध्यान करें, अपना प्रश्न सोचें और किसी भी एक पावन अक्षर पर स्पर्श करें।'
                : 'प्रभु श्री राम का पावन उत्तर व मार्गदर्शन नीचे प्रकट हुआ है:'}
            </p>
          </div>

          <div className="overflow-y-auto flex-1 pr-1">
            {/* The 9x9 Interactive Grid */}
            {!result ? (
              <div className="grid grid-cols-9 gap-1 sm:gap-1.5 p-2 sm:p-3 rounded-2xl bg-gradient-to-b from-amber-100/70 to-orange-100/50 border border-amber-300/80 shadow-inner max-w-md mx-auto">
                {GRID_LETTERS.map((letter, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleCellClick(i)}
                    className="aspect-square rounded-lg bg-white hover:bg-amber-50 border border-amber-300 text-amber-950 font-black text-xs sm:text-sm font-serif shadow-xs flex items-center justify-center cursor-pointer transition-colors active:bg-orange-500 active:text-white"
                  >
                    {letter}
                  </motion.button>
                ))}
              </div>
            ) : (
              /* Divine Result Card */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-amber-300 shadow-md text-center flex flex-col gap-3"
              >
                {/* Result Verdict Badge */}
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs sm:text-sm font-black border ${result.tagColor}`}>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>फल: {result.verdict}</span>
                  </span>
                </div>

                {/* Holy Chaupai */}
                <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/70 border border-amber-200">
                  <p className="text-sm sm:text-lg font-serif font-black text-orange-950 leading-relaxed italic">
                    “{result.chaupai}”
                  </p>
                  <p className="text-[11px] font-bold text-orange-700 mt-1.5">
                    — {result.source}
                  </p>
                </div>

                {/* Meaning & Guidance */}
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 text-left">
                  <p className="font-bold text-slate-900 mb-0.5">सरल भावार्थ व मार्गदर्शन:</p>
                  <p>{result.meaning}</p>
                </div>

                {/* Action buttons inside result */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleShare}
                    className="flex-1 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>WhatsApp पर शेयर करें</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="py-2.5 px-3.5 rounded-xl font-bold text-xs bg-orange-100 hover:bg-orange-200 text-orange-800 border border-orange-300 flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>नया प्रश्न</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer guidance */}
          <div className="mt-3 pt-2.5 border-t border-amber-200/80 text-center text-[10px] sm:text-[11px] text-amber-900/80 font-medium">
            🚩 श्रद्धा और विश्वास के साथ केवल एक बार में एक ही प्रश्न का उत्तर लें।
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
