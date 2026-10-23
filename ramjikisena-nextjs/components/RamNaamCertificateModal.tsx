'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Award, Sparkles, Check, Download, Flag } from 'lucide-react';

interface CertificateProps {
  isOpen: boolean;
  onClose: () => void;
  devoteeName: string;
  totalJaap: number;
  completedMalas: number;
}

export default function RamNaamCertificateModal({
  isOpen,
  onClose,
  devoteeName,
  totalJaap,
  completedMalas,
}: CertificateProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('hi-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🚩 *श्री राम नाम महाबैंक • साधना प्रशस्ति पत्र* 🚩\n\n` +
      `प्रभु श्री राम की कृपा से भक्त *${devoteeName || 'राम भक्त'}* ने आज:\n` +
      `✨ कुल पावन जाप: *${totalJaap.toLocaleString('en-IN')}*\n` +
      `📿 पूर्ण माला: *${completedMalas}*\n\n` +
      `_“कलयुग केवल नाम अधारा, सुमिरि सुमिरि नर उतरहिं पारा”_\n\n` +
      `आप भी राम जी की सेना से जुड़कर डिजिटल माला से जाप करें और पुण्य संचित करें:\n` +
      `👉 https://ramjikisena.com`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopy = () => {
    const text = `🚩 श्री राम नाम साधना प्रशस्ति पत्र • भक्त: ${devoteeName || 'राम भक्त'} • कुल जाप: ${totalJaap} • https://ramjikisena.com`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FFF8EE] to-[#FFF4E0] border-4 border-amber-500/80 shadow-2xl p-4 sm:p-7 text-center text-slate-800"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="बंद करें"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-800 flex items-center justify-center cursor-pointer transition-all active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Ornamental Inner Border */}
          <div className="rounded-2xl border-2 border-dashed border-amber-600/40 p-4 sm:p-6 bg-white/70">
            
            {/* Top Emblem */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md">
                <Flag className="w-4 h-4 fill-white" />
              </span>
            </div>

            <p className="text-[11px] sm:text-xs uppercase font-black tracking-widest text-orange-700">
              श्री राम नाम महाबैंक • अयोध्या धाम
            </p>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-[#8B2500] mt-0.5">
              साधना प्रशस्ति पत्र
            </h2>
            <p className="text-[10px] text-slate-500 font-medium">CERTIFICATE OF SPIRITUAL MERIT</p>

            {/* Divider with Om */}
            <div className="flex items-center justify-center gap-2 my-3 text-amber-600 text-xs font-bold">
              <span className="h-[1px] w-12 bg-amber-300" />
              <span>ॐ श्री राम ॐ</span>
              <span className="h-[1px] w-12 bg-amber-300" />
            </div>

            <p className="text-xs sm:text-sm text-slate-600">यह प्रमाणित किया जाता है कि परम भक्त</p>
            
            <p className="text-lg sm:text-2xl font-serif font-black text-orange-950 my-1 underline decoration-amber-400 decoration-2 underline-offset-4">
              {devoteeName || 'परम राम भक्त'}
            </p>

            <p className="text-xs text-slate-700 leading-relaxed max-w-sm mx-auto">
              ने प्रभु श्री राम के पावन नाम का विधिपूर्वक जप कर अपने जीवन में शांति, भक्ति और अनंत पुण्य संचित किया है।
            </p>

            {/* Stats Badge */}
            <div className="grid grid-cols-2 gap-3 my-4 max-w-xs mx-auto">
              <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200">
                <p className="text-[10px] font-bold uppercase text-slate-500">कुल संचित जाप</p>
                <p className="text-lg sm:text-xl font-serif font-black text-orange-700">
                  {totalJaap.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-[10px] font-bold uppercase text-slate-500">पूर्ण पावन माला</p>
                <p className="text-lg sm:text-xl font-serif font-black text-amber-700">
                  {completedMalas} माला
                </p>
              </div>
            </div>

            {/* Holy Chaupai */}
            <p className="text-xs sm:text-[13px] font-serif italic font-bold text-amber-950 leading-relaxed bg-amber-100/50 py-1.5 px-3 rounded-lg border border-amber-200/60">
              “कलयुग केवल नाम अधारा, सुमिरि सुमिरि नर उतरहिं पारा”
            </p>

            {/* Seal & Date */}
            <div className="flex items-center justify-between pt-4 mt-3 border-t border-amber-200 text-left text-[11px]">
              <div>
                <p className="font-bold text-slate-700">दिनांक: {todayStr}</p>
                <p className="text-[10px] text-slate-400">श्री राम जी की सेना</p>
              </div>

              {/* Verified Seal */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[10px] shadow-sm">
                <Award className="w-3.5 h-3.5" />
                <span>डिजिटल मुहर • स्वीकृत</span>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 mt-4">
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp पर शेयर करें</span>
            </button>

            <button
              onClick={handleCopy}
              className="py-2.5 px-3.5 rounded-xl font-bold text-xs bg-white hover:bg-orange-50 text-orange-800 border border-orange-300 shadow-sm flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Sparkles className="w-3.5 h-3.5 text-orange-500" />}
              <span>{copied ? 'कॉपी हुआ!' : 'कॉपी'}</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
