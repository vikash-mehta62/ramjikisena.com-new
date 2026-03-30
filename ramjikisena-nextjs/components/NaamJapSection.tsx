'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, BarChart3, Flag, Flower2, Bird, CheckCircle2 } from 'lucide-react';
import { authApi, User } from '@/lib/auth';
import { setGlobalUnsavedJaap } from '@/lib/jaapContext';
import { useJaapNavigate } from '@/lib/useJaapNavigate';

interface NaamJapSectionProps {
  user: User;
  onSaveSuccess: () => void;
}

type NameType = 'RAM' | 'RADHE' | 'HARE_KRISHNA';

const NAME_CONFIG = {
  RAM: {
    label: 'राम', Icon: Flag,
    activeGrad: 'from-orange-500 to-red-600',
    bgLight: 'bg-orange-50', textColor: 'text-orange-700',
    borderColor: 'border-orange-300',
    keys: [['R', 'र', 'from-red-500 to-red-600'], ['A', 'ा', 'from-orange-500 to-orange-600'], ['M', 'म', 'from-yellow-500 to-yellow-600']],
    cols: 'grid-cols-3',
  },
  RADHE: {
    label: 'राधे', Icon: Flower2,
    activeGrad: 'from-pink-500 to-rose-600',
    bgLight: 'bg-pink-50', textColor: 'text-pink-700',
    borderColor: 'border-pink-300',
    keys: [['RA', 'रा', 'from-pink-500 to-pink-600'], ['DHE', 'धे', 'from-rose-500 to-rose-600']],
    cols: 'grid-cols-2',
  },
  HARE_KRISHNA: {
    label: 'हरे कृष्णा', Icon: Bird,
    activeGrad: 'from-blue-500 to-cyan-600',
    bgLight: 'bg-blue-50', textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
    keys: [['HA', 'ह', 'from-blue-500 to-blue-600'], ['RE', 'रे', 'from-cyan-500 to-cyan-600'], ['KRI', 'कृ', 'from-indigo-500 to-indigo-600'], ['SHNA', 'ष्णा', 'from-purple-500 to-purple-600']],
    cols: 'grid-cols-2 sm:grid-cols-4',
  },
};

export default function NaamJapSection({ user, onSaveSuccess }: NaamJapSectionProps) {
  const safeNavigate = useJaapNavigate();
  const [currentCount, setCurrentCount] = useState(0);
  const [textareaValue, setTextareaValue] = useState('');
  const [userInput, setUserInput] = useState('');
  const [selectedName, setSelectedName] = useState<NameType>('RAM');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync unsaved state globally whenever text changes
  useEffect(() => {
    setGlobalUnsavedJaap(textareaValue.length > 0);
  }, [textareaValue]);

  const appendCharacter = useCallback((char: string) => {
    let newTextarea = textareaValue;
    if (selectedName === 'RAM') {
      if (char === 'R' && (userInput === '' || userInput === 'RAM')) { setUserInput('R'); newTextarea += 'र'; }
      else if (char === 'A' && userInput === 'R') { setUserInput('RA'); newTextarea += 'ा'; }
      else if (char === 'M' && userInput === 'RA') { setUserInput('RAM'); newTextarea += 'म '; setCurrentCount(p => p + 1); }
      else return;
    }
    if (selectedName === 'RADHE') {
      if (char === 'RA' && (userInput === '' || userInput === 'RADHE')) { setUserInput('RA'); newTextarea += 'रा'; }
      else if (char === 'DHE' && userInput === 'RA') { setUserInput('RADHE'); newTextarea += 'धे '; setCurrentCount(p => p + 1); }
      else return;
    }
    if (selectedName === 'HARE_KRISHNA') {
      if (char === 'HA' && (userInput === '' || userInput === 'HAREKRISHNA')) { setUserInput('HA'); newTextarea += 'ह'; }
      else if (char === 'RE' && userInput === 'HA') { setUserInput('HARE'); newTextarea += 'रे '; }
      else if (char === 'KRI' && userInput === 'HARE') { setUserInput('HAREKRI'); newTextarea += 'कृ'; }
      else if (char === 'SHNA' && userInput === 'HAREKRI') { setUserInput('HAREKRISHNA'); newTextarea += 'ष्णा '; setCurrentCount(p => p + 1); }
      else return;
    }
    setTextareaValue(newTextarea);
  }, [textareaValue, userInput, selectedName]);

  const handleNameChange = (name: NameType) => {
    if (currentCount > 0 && !confirm('बदलाव करने से मौजूदा काउंट सेव नहीं होगा। जारी रखें?')) return;
    setSelectedName(name); setUserInput(''); setTextareaValue(''); setCurrentCount(0);
  };

  const handleSave = async () => {
    if (currentCount === 0) return;
    setIsSaving(true);
    try {
      const result = await authApi.saveCount(currentCount, (user.totalCount || 0) + currentCount, (user.mala || 0) + currentCount / 108);
      if (result.success) {
        setSaved(true);
        setTextareaValue(''); setUserInput(''); setCurrentCount(0);
        setGlobalUnsavedJaap(false);
        onSaveSuccess();
        setTimeout(() => setSaved(false), 2500);
      }
    } catch { alert('Error saving data'); } finally { setIsSaving(false); }
  };

  const cfg = NAME_CONFIG[selectedName];
  const malaProgress = ((currentCount % 108) / 108) * 100;
  const completedMalas = Math.floor(currentCount / 108);

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-[#FFFAF3] to-orange-50/60 relative overflow-hidden">
      {/* Subtle bg decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-10 -left-10 text-[14rem] font-black text-orange-600/[0.03] select-none leading-none">ॐ</div>
        <div className="absolute -bottom-10 -right-10 text-[10rem] text-red-600/[0.04] select-none leading-none">🚩</div>
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-2xl">

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-[0.25em] rounded-full mb-3">
            🙏 नाम लेखन
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            जय श्री राम, <span className="text-orange-600">{user.name}</span>!
          </h2>
          <p className="text-sm text-slate-500 mt-1">यहाँ से अपना नाम जाप शुरू करें</p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Rank', val: `#${user.rank}`, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100' },
            { label: 'Total Jaap', val: user.totalCount.toLocaleString(), color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
            { label: 'Mala', val: user.mala.toFixed(1), color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-100' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`${s.bg} border rounded-2xl py-4 text-center`}
            >
              <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest mb-1">{s.label}</p>
              <p className={`text-lg sm:text-xl font-black ${s.color}`}>{s.val}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Jaap Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[2rem] shadow-xl border border-orange-100 overflow-hidden"
        >
          {/* Name Selector Tab Bar */}
          <div className="flex border-b border-orange-100">
            {(Object.keys(NAME_CONFIG) as NameType[]).map((key) => {
              const c = NAME_CONFIG[key];
              const isActive = selectedName === key;
              return (
                <button
                  key={key}
                  onClick={() => handleNameChange(key)}
                  className={`flex-1 flex flex-col items-center gap-1 py-4 text-[10px] font-black uppercase tracking-wider transition-all border-b-2 ${
                    isActive
                      ? `border-orange-500 text-orange-700 bg-orange-50/60`
                      : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <c.Icon className={`w-4 h-4 ${isActive ? 'text-orange-600' : ''}`} />
                  {c.label}
                </button>
              );
            })}
          </div>

          <div className="p-5 sm:p-7">
            {/* Mala Progress */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  माला प्रगति {completedMalas > 0 && <span className="text-orange-600 ml-1">({completedMalas} पूरी)</span>}
                </span>
                <span className="text-[10px] font-black text-orange-600">{currentCount % 108}/108</span>
              </div>
              <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                  animate={{ width: `${malaProgress}%` }}
                  transition={{ type: 'spring', stiffness: 120 }}
                />
              </div>
            </div>

            {/* Textarea */}
            <div className="relative mb-5">
              <div className="absolute -top-3 right-4 z-10">
                <span className={`bg-gradient-to-r ${cfg.activeGrad} text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md`}>
                  JAAP: {currentCount}
                </span>
              </div>
              <textarea
                readOnly
                value={textareaValue}
                className={`w-full h-28 p-4 pt-5 ${cfg.bgLight} border-2 ${cfg.borderColor} rounded-2xl text-xl sm:text-2xl font-bold ${cfg.textColor} text-center focus:outline-none resize-none placeholder:text-current placeholder:opacity-20 leading-relaxed`}
                placeholder="नाम यहाँ प्रगट होगा..."
              />
            </div>

            {/* Keys */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedName}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className={`grid ${cfg.cols} gap-3 mb-5`}
              >
                {cfg.keys.map(([char, label, grad]) => (
                  <button
                    key={char}
                    onClick={() => appendCharacter(char)}
                    className={`bg-gradient-to-br ${grad} text-white text-2xl sm:text-3xl font-black py-5 rounded-2xl shadow-lg active:scale-95 transition-all border-b-4 border-black/15 hover:brightness-110`}
                  >
                    {label}
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleSave}
                disabled={currentCount === 0 || isSaving}
                className="relative py-4 bg-gradient-to-r from-green-600 to-emerald-600 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-green-900/10 overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {saved ? (
                    <motion.span key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> सेव हो गया!
                    </motion.span>
                  ) : (
                    <motion.span key="save" className="flex items-center gap-2">
                      <Save className="w-4 h-4" /> {isSaving ? 'सेविंग...' : 'SAVE'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <button
                onClick={() => safeNavigate('/dashboard')}
                className="py-4 bg-slate-900 text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-slate-800 shadow-lg"
              >
                <BarChart3 className="w-4 h-4" /> DASHBOARD
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
