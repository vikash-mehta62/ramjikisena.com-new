'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, User } from '@/lib/auth';
import { Save, Flag, Flower2, Bird, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import MusicPlayer from '@/components/MusicPlayer';
import { setGlobalUnsavedJaap } from '@/lib/jaapContext';
import { useJaapNavigate } from '@/lib/useJaapNavigate';

type NameType = 'RAM' | 'RADHE' | 'HARE_KRISHNA';

const NAME_CONFIGS = {
  RAM: {
    displayName: 'राम',
    hindiName: 'राम नाम',
    pattern: ['R', 'A', 'M'],
    hindiChars: ['र', 'ा', 'म'],
    colors: ['', '', ''],
    activeTab: 'bg-orange-500',
    icon: Flag,
  },
  RADHE: {
    displayName: 'राधे',
    hindiName: 'राधे नाम',
    pattern: ['RA', 'DHE'],
    hindiChars: ['रा', 'धे'],
    colors: ['from-pink-500 to-pink-600', 'from-rose-500 to-rose-600'],
    activeTab: 'bg-pink-500',
    icon: Flower2,
  },
  HARE_KRISHNA: {
    displayName: 'हरे कृष्णा',
    hindiName: 'हरे कृष्णा',
    pattern: ['HA', 'RE', 'KRI', 'SHNA'],
    hindiChars: ['ह', 'रे', 'कृ', 'ष्णा'],
    colors: ['from-blue-500 to-blue-600', 'from-cyan-500 to-cyan-600', 'from-indigo-500 to-indigo-600', 'from-purple-500 to-purple-600'],
    activeTab: 'bg-blue-500',
    icon: Bird,
  },
};

const quickLinks = [
  { href: '/devotees',     label: 'All Devotees',    emoji: '👥', color: 'border-orange-200 hover:border-orange-400 hover:bg-orange-50' },
  { href: '/history',      label: 'Lekhan History',  emoji: '📊', color: 'border-purple-200 hover:border-purple-400 hover:bg-purple-50' },
  { href: '/blogs',        label: 'Blogs',           emoji: '📝', color: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50' },
  { href: '/mandirs',      label: 'Mandirs',         emoji: '🛕', color: 'border-yellow-200 hover:border-yellow-400 hover:bg-yellow-50' },
  { href: '/samagri',      label: 'Poojan Samagri',  emoji: '🪔', color: 'border-green-200 hover:border-green-400 hover:bg-green-50' },
  { href: '/samagri/orders', label: 'My Orders',     emoji: '📦', color: 'border-teal-200 hover:border-teal-400 hover:bg-teal-50' },
  { href: '/community',    label: 'Community',       emoji: '🤝', color: 'border-pink-200 hover:border-pink-400 hover:bg-pink-50' },
  { href: '/profile',      label: 'My Profile',      emoji: '👤', color: 'border-slate-200 hover:border-slate-400 hover:bg-slate-50' },
];

export default function DashboardPage() {
  const router = useRouter();
  const safeNavigate = useJaapNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [currentCount, setCurrentCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [malaCount, setMalaCount] = useState(0);
  const [textareaValue, setTextareaValue] = useState('');
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedName, setSelectedName] = useState<NameType>('RAM');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    authApi.getCurrentUser().then(userData => {
      if (!userData) { router.push('/login'); return; }
      setUser(userData);
      setCurrentCount(userData.currCount);
      setTotalCount(userData.totalCount);
      setMalaCount(parseFloat(userData.mala.toString()));
      setLoading(false);
    }).catch(() => router.push('/login'));
  }, [router]);

  // Track unsaved jaap globally — any text in the box means unsaved
  useEffect(() => {
    setGlobalUnsavedJaap(textareaValue.length > 0);
  }, [textareaValue]);

  const switchName = (name: NameType) => {
    if (currentCount > 0) return; // don't switch mid-jaap
    setSelectedName(name);
    setUserInput('');
    setTextareaValue('');
  };

  const appendCharacter = useCallback((char: string) => {
    const cfg = NAME_CONFIGS[selectedName];

    if (selectedName === 'RAM') {
      if (char === 'R' && (userInput === '' || userInput === 'RAM')) {
        setUserInput('R'); setTextareaValue(p => p + 'र');
      } else if (char === 'A' && userInput === 'R') {
        setUserInput('RA'); setTextareaValue(p => p + 'ा');
      } else if (char === 'M' && userInput === 'RA') {
        setUserInput('RAM'); setTextareaValue(p => p + 'म ');
        setCurrentCount(p => p + 1); setTotalCount(p => p + 1);
        setMalaCount(p => (p * 108 + 1) / 108);
      }
      return;
    }

    if (selectedName === 'RADHE') {
      if (char === 'RA' && (userInput === '' || userInput === 'RADHE')) {
        setUserInput('RA'); setTextareaValue(p => p + 'रा');
      } else if (char === 'DHE' && userInput === 'RA') {
        setUserInput('RADHE'); setTextareaValue(p => p + 'धे ');
        setCurrentCount(p => p + 1); setTotalCount(p => p + 1);
        setMalaCount(p => (p * 108 + 1) / 108);
      }
      return;
    }

    if (selectedName === 'HARE_KRISHNA') {
      if (char === 'HA' && (userInput === '' || userInput === 'HAREKRISHNA')) {
        setUserInput('HA'); setTextareaValue(p => p + 'ह');
      } else if (char === 'RE' && userInput === 'HA') {
        setUserInput('HARE'); setTextareaValue(p => p + 'रे ');
      } else if (char === 'KRI' && userInput === 'HARE') {
        setUserInput('HAREKRI'); setTextareaValue(p => p + 'कृ');
      } else if (char === 'SHNA' && userInput === 'HAREKRI') {
        setUserInput('HAREKRISHNA'); setTextareaValue(p => p + 'ष्णा ');
        setCurrentCount(p => p + 1); setTotalCount(p => p + 1);
        setMalaCount(p => (p * 108 + 1) / 108);
      }
    }
  }, [selectedName, userInput]);

  const handleSave = async () => {
    if (currentCount === 0) {
      alert('कृपया पहले राम नाम लिखें');
      return;
    }
    setSaving(true);
    try {
      const result = await authApi.saveCount(currentCount, totalCount, malaCount);
      if (result.success) {
        setSaveSuccess(true);
        setTimeout(() => {
          setTextareaValue(''); setUserInput(''); setCurrentCount(0);
          setSaving(false); setSaveSuccess(false);
          setGlobalUnsavedJaap(false);
          authApi.getCurrentUser().then(u => { if (u) { setUser(u); setTotalCount(u.totalCount); setMalaCount(parseFloat(u.mala.toString())); } });
        }, 1800);
      } else {
        alert('Error saving'); setSaving(false);
      }
    } catch { alert('Error saving'); setSaving(false); }
  };

  const cfg = NAME_CONFIGS[selectedName];
  const malaProgress = ((currentCount % 108) / 108) * 100;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#fdf6ee] flex items-center justify-center">
          <div className="text-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full mx-auto mb-4" />
            <p className="text-orange-700 font-semibold">जय श्री राम...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <MusicPlayer />
      <div className="min-h-screen bg-[#fdf6ee] pt-20 pb-12">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-black px-4 py-1.5 rounded-full mb-3 tracking-widest uppercase">
              <Flag className="w-3 h-3" /> नाम लेखन
            </div>
            <h1 className="text-3xl font-black text-slate-900 leading-tight">
              जय श्री राम, <span className="text-orange-500">{user?.name}!</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">यहाँ से अपना नाम जाप शुरू करें</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'RANK', value: `#${user?.rank || '-'}`, bg: 'bg-orange-50', text: 'text-orange-600' },
              { label: 'TOTAL JAAP', value: totalCount, bg: 'bg-red-50', text: 'text-red-600' },
              { label: 'MALA', value: malaCount.toFixed(1), bg: 'bg-yellow-50', text: 'text-yellow-600' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
                <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1">{s.label}</p>
                <p className={`text-2xl font-black ${s.text}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Name Tabs */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex border-b border-slate-100">
              {(Object.keys(NAME_CONFIGS) as NameType[]).map(name => {
                const c = NAME_CONFIGS[name];
                const Icon = c.icon;
                const active = selectedName === name;
                return (
                  <button key={name} onClick={() => switchName(name)}
                    className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-black transition-all relative ${
                      active ? 'text-orange-600' : 'text-slate-400 hover:text-slate-600'
                    }`}>
                    <Icon className="w-4 h-4" />
                    {c.displayName}
                    {active && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
                  </button>
                );
              })}
            </div>

            <div className="p-5 space-y-4">
              {/* Mala Progress */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5">
                  <span>माला प्रगति</span>
                  <span className="text-orange-500">{currentCount % 108}/108</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                    animate={{ width: `${malaProgress}%` }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  />
                </div>
              </div>

              {/* Textarea */}
              <div className="relative">
                <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-black px-2.5 py-1 rounded-full z-10">
                  JAAP: {currentCount}
                </div>
                <div className="min-h-[120px] max-h-[180px] overflow-y-auto bg-orange-50/60 border-2 border-orange-200 rounded-2xl p-4 text-xl font-semibold text-orange-700 leading-relaxed">
                  {textareaValue || (
                    <span className="text-orange-300 text-base">नाम यहाँ प्रगट होगा...</span>
                  )}
                </div>
              </div>

              {/* Jap Buttons */}
              <div className={`grid gap-3 ${cfg.hindiChars.length === 3 ? 'grid-cols-3' : cfg.hindiChars.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
                {cfg.hindiChars.map((char, i) => (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => appendCharacter(cfg.pattern[i])}
                    className="relative font-black transition-transform overflow-hidden rounded-xl"
                    style={{
                      color: '#783205',
                      fontSize: '2.2rem',
                      padding: '10px 20px',
                      background: 'linear-gradient(160deg, #f9e07a 0%, #d4920a 30%, #f0b429 55%, #b8760a 80%, #e8a820 100%)',
                      boxShadow: '0 6px 16px rgba(140,80,0,0.5), inset 0 2px 3px rgba(255,245,160,0.7), inset 0 -3px 5px rgba(90,40,0,0.35)',
                      border: '2.5px solid #9a6200',
                      textShadow: '0 1px 2px rgba(255,220,100,0.4)',
                    }}
                  >
                    <span className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{ background: 'linear-gradient(135deg, rgba(255,255,210,0.45) 0%, transparent 50%)' }} />
                    <span className="relative z-10">{char}</span>
                  </motion.button>
                ))}
              </div>

              {/* Save & Dashboard Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <motion.button
                  id="jaap-save-btn"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSave}
                  disabled={saving || currentCount === 0}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm transition-all ${
                    currentCount > 0
                      ? 'bg-slate-900 text-white shadow-lg hover:bg-slate-800'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'सेव हो रहा है...' : 'SAVE'}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => safeNavigate('/history')}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm bg-orange-500 text-white shadow-lg hover:bg-orange-600 transition-all"
                >
                  <BarChart3 className="w-4 h-4" />
                  HISTORY
                </motion.button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Quick Links</p>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map(({ href, label, emoji, color }) => (
                <motion.button
                  key={href}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => safeNavigate(href)}
                  className={`bg-white rounded-2xl p-4 shadow-sm border-2 transition-all text-center ${color}`}
                >
                  <div className="text-2xl mb-1.5">{emoji}</div>
                  <p className="text-sm font-bold text-slate-700">{label}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Success Overlay */}
      <AnimatePresence>
        {saving && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-10 text-center shadow-2xl"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.6, repeat: Infinity }}
                className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <Flag className="w-10 h-10 text-orange-500" />
              </motion.div>
              <p className="text-lg font-black text-slate-900">जय श्री राम! 🙏</p>
              <p className="text-slate-500 text-sm mt-1">आपका रामनाम धन सेव हो रहा है...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
