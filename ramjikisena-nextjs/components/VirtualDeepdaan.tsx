'use client';

import { useState } from 'react';
import { Flame, Sparkles, Heart, Share2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VirtualDeepdaan() {
  const [diyaLit, setDiyaLit] = useState(false);
  const [flowerCount, setFlowerCount] = useState(0);
  const [deepdaanCount, setDeepdaanCount] = useState(14832);
  const [blessingMsg, setBlessingMsg] = useState('');
  const [petals, setPetals] = useState<{ id: number; x: number }[]>([]);

  const handleLightDiya = () => {
    setDiyaLit(true);
    setDeepdaanCount(prev => prev + 1);
    setBlessingMsg('प्रभु श्री राम आपके जीवन में सुख, शांति और प्रकाश भरें! 🪔🙏');

    // Trigger sound if available
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(528, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.15);
      }
    } catch {}

    // Haptic
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(25); } catch {}
    }
  };

  const handleOfferFlowers = () => {
    setFlowerCount(prev => prev + 1);
    const newId = Date.now();
    const randomX = Math.floor(Math.random() * 80) + 10;
    setPetals(prev => [...prev.slice(-6), { id: newId, x: randomX }]);
    setTimeout(() => {
      setPetals(prev => prev.filter(p => p.id !== newId));
    }, 1500);

    // Haptic
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(15); } catch {}
    }
  };

  const shareDeepdaan = () => {
    const text = encodeURIComponent('🚩 जय श्री राम! मैंने आज प्रभु श्री राम जी के चरणों में पावन दीपदान व पुष्प अर्पण किया है। आप भी राम जी की सेना से जुड़कर पुण्य संचित करें: https://ramjikisena.com');
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#2D0D02] via-[#481804] to-[#1F0700] text-white shadow-xl shadow-orange-950/25 flex flex-col justify-between border border-amber-500/30">
      
      {/* Background glow when Diya is lit */}
      <div className={`absolute inset-0 bg-gradient-to-t from-amber-500/20 via-orange-500/10 to-transparent transition-opacity duration-700 pointer-events-none ${diyaLit ? 'opacity-100' : 'opacity-0'}`} />

      {/* Floating Petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {petals.map(p => (
          <motion.span
            key={p.id}
            initial={{ opacity: 1, y: 160, scale: 0.6 }}
            animate={{ opacity: 0, y: -20, scale: 1.2 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            style={{ left: `${p.x}%` }}
            className="absolute text-xl select-none"
          >
            🌸
          </motion.span>
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">
            वर्चुअल मंदिर सेवा
          </span>
          <span className="text-[11px] font-bold text-amber-200/80">
            आज: {deepdaanCount.toLocaleString('en-IN')}+ दीपदान
          </span>
        </div>

        {/* Diya Visual */}
        <div className="my-4 flex items-center justify-center">
          <div className="relative flex flex-col items-center">
            
            {/* Animated Flame */}
            <motion.div
              animate={diyaLit ? { scale: [1, 1.15, 0.95, 1], filter: ['drop-shadow(0 0 10px #f59e0b)', 'drop-shadow(0 0 24px #f97316)', 'drop-shadow(0 0 14px #eab308)'] } : { scale: 0.85, opacity: 0.4 }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              className="relative text-5xl sm:text-6xl cursor-pointer select-none"
              onClick={handleLightDiya}
              title="दीप प्रज्वलित करने हेतु क्लिक करें"
            >
              {diyaLit ? '🪔' : '🪔'}
              {diyaLit && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-yellow-400/40 blur-md pointer-events-none animate-ping" />
              )}
            </motion.div>

            <p className="mt-2 text-xs sm:text-sm font-serif font-black text-amber-200 text-center">
              {diyaLit ? 'पावन दीप प्रज्वलित 🙏' : 'प्रभु श्री राम के पावन चरणों में दीपदान करें'}
            </p>
          </div>
        </div>

        {/* Blessing notification */}
        <AnimatePresence>
          {blessingMsg && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-amber-100/90 text-center bg-white/10 backdrop-blur-xs py-1.5 px-3 rounded-xl border border-white/10 font-medium"
            >
              {blessingMsg}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 mt-4 flex items-center gap-2 pt-2 border-t border-white/10">
        <button
          onClick={handleLightDiya}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
            diyaLit
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border border-amber-300/40'
              : 'bg-white text-orange-950 hover:bg-amber-50'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-yellow-300" />
          <span>{diyaLit ? 'दीपदान संपन्न ✓' : 'दीप प्रज्वलित करें'}</span>
        </button>

        <button
          onClick={handleOfferFlowers}
          title="पुष्प अर्पित करें"
          className="py-2 px-3 rounded-xl font-bold text-xs bg-white/15 hover:bg-white/25 text-white border border-white/20 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
        >
          <span>🌸 पुष्प अर्पण</span>
          {flowerCount > 0 && <span className="text-[10px] bg-rose-500/80 px-1.5 py-0.2 rounded-full">+{flowerCount}</span>}
        </button>

        {diyaLit && (
          <button
            onClick={shareDeepdaan}
            title="WhatsApp पर शेयर करें"
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  );
}
