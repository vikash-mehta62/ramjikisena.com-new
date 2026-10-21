'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, BarChart3, Flag, Flower2, Bird, CheckCircle2, Play, Pause,
  Plus, Minus, X, Pencil, Volume2, VolumeX, RotateCcw, Sparkles, Bell
} from 'lucide-react';
import { authApi, User, getToken } from '@/lib/auth';
import { setGlobalUnsavedJaap } from '@/lib/jaapContext';
import { useJaapNavigate } from '@/lib/useJaapNavigate';
import { useToast } from './Toast';

interface NaamJapSectionProps { user: User | null; onSaveSuccess: () => void; }
type NameType = 'RAM' | 'RADHE' | 'HARE_KRISHNA' | string;
type BeadStyle = 'rudraksha' | 'tulsi' | 'sphatik';
type JaapMode = 'mala' | 'timer' | 'auto';

interface CustomName { id: string; label: string; chars: string[]; }

const PRESET_CONFIG = {
  RAM:          { label: 'राम',        Icon: Flag,    keys: [['R','र'],['A','ा'],['M','म']],                          cols: 'grid-cols-3', beadColor: '#ea580c', accentColor: '#f97316', scrollText: 'राम ' },
  RADHE:        { label: 'राधे',       Icon: Flower2, keys: [['RA','रा'],['DHE','धे']],                               cols: 'grid-cols-2', beadColor: '#e11d48', accentColor: '#fb7185', scrollText: 'राधे ' },
  HARE_KRISHNA: { label: 'हरे कृष्णा', Icon: Bird,    keys: [['HA','ह'],['RE','रे'],['KRI','कृ'],['SHNA','ष्णा']], cols: 'grid-cols-4', beadColor: '#2563eb', accentColor: '#60a5fa', scrollText: 'हरे कृष्णा ' },
};

const SONGS = [
  { displayName: 'राम धुन',        file: '/audios/ramdhun.mp3',      emoji: '🚩' },
  { displayName: 'हे राम',         file: '/audios/heyram.mp3',       emoji: '🙏' },
  { displayName: 'सीता राम',       file: '/audios/sitaram.mp3',      emoji: '💐' },
  { displayName: 'हरि धुन',        file: '/audios/haridhun.mp3',     emoji: '🌺' },
  { displayName: 'राम नाम कीर्तन', file: '/audios/ramnamkirtan.mp3', emoji: '🎵' },
];

function playTempleChime(freq = 528) {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.85);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.9);
  } catch {
    // Graceful fallback
  }
}

function MiniPlayer() {
  const [playing, setPlaying] = useState(false);
  const [idx, setIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.volume = 1; audioRef.current.play(); setPlaying(true); }
  };
  const next = () => {
    const i = (idx + 1) % SONGS.length;
    setIdx(i);
    setPlaying(false);
    setTimeout(() => { if (audioRef.current) { audioRef.current.volume = 1; audioRef.current.play(); setPlaying(true); } }, 80);
  };
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-orange-50/70 border border-orange-200/80 shadow-sm w-full">
      <audio ref={audioRef} src={SONGS[idx].file} onEnded={next} />
      <button onClick={toggle} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 active:scale-90 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 cursor-pointer">
        {playing ? <Pause className="w-3.5 h-3.5 text-white" /> : <Play className="w-3.5 h-3.5 ml-0.5 text-white" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-black truncate text-slate-800">{playing ? '🎵 बज रहा है...' : '🎵 पावन भजन सुनें'}</p>
        <p className="text-[10px] truncate text-orange-700 font-semibold">{SONGS[idx].emoji} {SONGS[idx].displayName}</p>
      </div>
      <button onClick={next} className="text-[10px] font-bold px-2.5 py-1 rounded-lg active:scale-90 flex-shrink-0 bg-white border border-orange-200 text-slate-700 hover:text-orange-600 shadow-sm cursor-pointer">अगला ▶</button>
    </div>
  );
}

export default function NaamJapSection({ user, onSaveSuccess }: NaamJapSectionProps) {
  const safeNavigate = useJaapNavigate();
  const toast = useToast();
  const [currentCount, setCurrentCount] = useState(0);
  const [textareaValue, setTextareaValue] = useState('');
  const [userInput, setUserInput] = useState('');
  const [selectedName, setSelectedName] = useState<NameType>('RAM');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Mode and settings
  const [jaapMode, setJaapMode] = useState<JaapMode>('mala');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [beadStyle, setBeadStyle] = useState<BeadStyle>('rudraksha');
  const [autoCounting, setAutoCounting] = useState(false);

  // Timer mode state
  const [timerDuration, setTimerDuration] = useState(300); // 5 min default
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerLeft, setTimerLeft] = useState(300);

  // Custom names state
  const [customNames, setCustomNames] = useState<CustomName[]>(user?.customJaapNames || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newChars, setNewChars] = useState('');
  const [savingCustom, setSavingCustom] = useState(false);

  // Manual typing mode
  const [manualMode, setManualMode] = useState(false);
  const [manualInput, setManualInput] = useState('');

  useEffect(() => {
    if (user?.customJaapNames) setCustomNames(user.customJaapNames);
  }, [user]);

  useEffect(() => { setGlobalUnsavedJaap(textareaValue.length > 0); }, [textareaValue]);

  const isCustom = !['RAM', 'RADHE', 'HARE_KRISHNA'].includes(selectedName);
  const customCfg = isCustom ? customNames.find(n => n.id === selectedName) : null;
  const cfg = isCustom ? {
    label: customCfg?.label || '',
    Icon: Pencil,
    keys: (customCfg?.chars || []).map(c => [c, c]),
    cols: customCfg && customCfg.chars.length <= 2 ? 'grid-cols-2' : customCfg && customCfg.chars.length >= 4 ? 'grid-cols-4' : 'grid-cols-3',
    beadColor: '#7c3aed',
    accentColor: '#8b5cf6',
    scrollText: (customCfg?.label || '') + ' ',
  } : PRESET_CONFIG[selectedName as keyof typeof PRESET_CONFIG];

  // Auto Count effect
  useEffect(() => {
    if (jaapMode !== 'auto' || !autoCounting) return;
    const interval = setInterval(() => {
      const label = isCustom ? (customCfg?.label || 'राम') : (selectedName === 'RADHE' ? 'राधे' : selectedName === 'HARE_KRISHNA' ? 'हरे कृष्णा' : 'राम');
      setTextareaValue(p => p + label + ' ');
      setCurrentCount(p => p + 1);
      if (soundEnabled) {
        playTempleChime(528);
      }
    }, 1200);
    return () => clearInterval(interval);
  }, [jaapMode, autoCounting, isCustom, customCfg, selectedName, soundEnabled]);

  // Timer effect
  useEffect(() => {
    if (jaapMode !== 'timer' || !timerRunning) return;
    if (timerLeft <= 0) {
      setTimerRunning(false);
      if (soundEnabled) playTempleChime(660);
      return;
    }
    const interval = setInterval(() => {
      setTimerLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          setTimerRunning(false);
          if (soundEnabled) playTempleChime(660);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [jaapMode, timerRunning, timerLeft, soundEnabled]);

  const triggerBeadFeedback = () => {
    if (soundEnabled) {
      playTempleChime(528);
    }
  };

  const incrementCount = () => {
    const label = isCustom ? (customCfg?.label || 'राम') : (selectedName === 'RADHE' ? 'राधे' : selectedName === 'HARE_KRISHNA' ? 'हरे कृष्णा' : 'राम');
    setTextareaValue(p => p + label + ' ');
    setCurrentCount(p => p + 1);
    triggerBeadFeedback();
  };

  const decrementCount = () => {
    if (currentCount > 0) {
      setCurrentCount(p => p - 1);
    }
  };

  const appendCharacter = useCallback((char: string) => {
    if (isCustom) {
      const label = customCfg?.label || char;
      setTextareaValue(p => p + label + ' ');
      setCurrentCount(p => p + 1);
      triggerBeadFeedback();
      return;
    }
    let t = textareaValue;
    if (selectedName === 'RAM') {
      if (char === 'R' && (userInput === '' || userInput === 'RAM')) { setUserInput('R'); t += 'र'; }
      else if (char === 'A' && userInput === 'R') { setUserInput('RA'); t += 'ा'; }
      else if (char === 'M' && userInput === 'RA') {
        setUserInput('RAM');
        t += 'म ';
        setCurrentCount(p => p + 1);
        triggerBeadFeedback();
      }
      else return;
    } else if (selectedName === 'RADHE') {
      if (char === 'RA' && (userInput === '' || userInput === 'RADHE')) { setUserInput('RA'); t += 'रा'; }
      else if (char === 'DHE' && userInput === 'RA') {
        setUserInput('RADHE');
        t += 'धे ';
        setCurrentCount(p => p + 1);
        triggerBeadFeedback();
      }
      else return;
    } else if (selectedName === 'HARE_KRISHNA') {
      if (char === 'HA' && (userInput === '' || userInput === 'HAREKRISHNA')) { setUserInput('HA'); t += 'ह'; }
      else if (char === 'RE' && userInput === 'HA') { setUserInput('HARE'); t += 'रे '; }
      else if (char === 'KRI' && userInput === 'HARE') { setUserInput('HAREKRI'); t += 'कृ'; }
      else if (char === 'SHNA' && userInput === 'HAREKRI') {
        setUserInput('HAREKRISHNA');
        t += 'ष्णा ';
        setCurrentCount(p => p + 1);
        triggerBeadFeedback();
      }
      else return;
    }
    setTextareaValue(t);
  }, [textareaValue, userInput, selectedName, isCustom, customCfg, soundEnabled]);

  const handleManualSubmit = () => {
    if (!manualInput.trim()) return;
    setTextareaValue(p => p + manualInput.trim() + ' ');
    setCurrentCount(p => p + 1);
    setManualInput('');
    triggerBeadFeedback();
  };

  const handleNameChange = (name: NameType) => {
    if (currentCount > 0 && !confirm('बदलाव करने से मौजूदा काउंट सेव नहीं होगा। जारी रखें?')) return;
    setSelectedName(name); setUserInput(''); setTextareaValue(''); setCurrentCount(0); setManualMode(false); setManualInput('');
  };

  const handleSave = async () => {
    if (currentCount === 0) return;
    setIsSaving(true);
    try {
      const result = await authApi.saveCount(currentCount, (user?.totalCount || 0) + currentCount, (user?.mala || 0) + currentCount / 108);
      if (result.success) {
        setSaved(true); setTextareaValue(''); setUserInput(''); setCurrentCount(0);
        setGlobalUnsavedJaap(false);
        // Also update cached pandit if present
        if (typeof window !== 'undefined') {
          const pStr = localStorage.getItem('pandit');
          if (pStr) {
            try {
              const pObj = JSON.parse(pStr);
              pObj.totalCount = (pObj.totalCount || 0) + currentCount;
              pObj.mala = pObj.totalCount > 0 ? (pObj.totalCount / 108).toFixed(2) : 0;
              localStorage.setItem('pandit', JSON.stringify(pObj));
            } catch {}
          }
        }
        onSaveSuccess();
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error(result.message || 'जाप सेव करने में त्रुटि हुई');
      }
    } catch { toast.error('जाप सेव करने में त्रुटि हुई'); } finally { setIsSaving(false); }
  };

  const handleAddCustomName = async () => {
    if (!newLabel.trim()) return;
    setSavingCustom(true);
    const chars = newChars.trim()
      ? newChars.split(',').map(s => s.trim()).filter(Boolean)
      : [newLabel.trim()];
    const token = getToken();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/custom-jaap-names`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id: Date.now().toString(), label: newLabel.trim(), chars }),
      });
      const data = await res.json();
      if (data.success) {
        setCustomNames(data.customJaapNames);
        setShowAddModal(false); setNewLabel(''); setNewChars('');
        toast.success(`"${newLabel}" नाम जोड़ा गया!`);
      } else {
        toast.error(data.message || 'नाम जोड़ने में त्रुटि');
      }
    } catch { toast.error('नेटवर्क त्रुटि'); } finally { setSavingCustom(false); }
  };

  const handleDeleteCustomName = async (id: string) => {
    const token = getToken();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/custom-jaap-names/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCustomNames(data.customJaapNames);
        if (selectedName === id) handleNameChange('RAM');
        toast.success('नाम हटाया गया');
      } else {
        toast.error('नाम हटाने में त्रुटि');
      }
    } catch { toast.error('नाम हटाने में त्रुटि'); }
  };

  const malaProgress = ((currentCount % 108) / 108) * 100;
  const beadsFilled = Math.round((malaProgress / 100) * 108);
  const completedMalas = Math.floor(currentCount / 108);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') { e.preventDefault(); handleSave(); }
        return;
      }
      if (e.altKey) return;
      if (e.key === '+' || e.key === '=') { incrementCount(); return; }
      if (e.key === '-' || e.key === '_') { decrementCount(); return; }
      if (selectedName === 'RAM') {
        if (e.key === 'r' || e.key === 'R') appendCharacter('R');
        else if (e.key === 'a' || e.key === 'A') appendCharacter('A');
        else if (e.key === 'm' || e.key === 'M') appendCharacter('M');
      } else if (selectedName === 'RADHE') {
        if (e.key === 'r' || e.key === 'R') appendCharacter('RA');
        else if (e.key === 'd' || e.key === 'D') appendCharacter('DHE');
      } else if (selectedName === 'HARE_KRISHNA') {
        if (e.key === 'h' || e.key === 'H') appendCharacter('HA');
        else if (e.key === 'r' || e.key === 'R') appendCharacter('RE');
        else if (e.key === 'k' || e.key === 'K') appendCharacter('KRI');
        else if (e.key === 's' || e.key === 'S') appendCharacter('SHNA');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [appendCharacter, selectedName, handleSave]);

  const NameTabs = ({ vertical = false }: { vertical?: boolean }) => (
    <>
      {(Object.keys(PRESET_CONFIG) as NameType[]).map((key) => {
        const c = PRESET_CONFIG[key as keyof typeof PRESET_CONFIG];
        const isActive = selectedName === key;
        return (
          <button key={key} onClick={() => handleNameChange(key)}
            className={`flex items-center gap-2 py-2 px-3 rounded-2xl font-black text-xs sm:text-sm transition-all active:scale-95 cursor-pointer ${vertical ? 'w-full' : 'flex-1 justify-center'} ${
              isActive
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                : 'bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-slate-700 shadow-sm'
            }`}>
            <c.Icon className="w-4 h-4 flex-shrink-0" />
            <span>{c.label}</span>
          </button>
        );
      })}

      {customNames.map((cn) => {
        const isActive = selectedName === cn.id;
        return (
          <div key={cn.id} className={`relative group ${vertical ? 'w-full' : 'flex-1'}`}>
            <button onClick={() => handleNameChange(cn.id)}
              className={`flex items-center gap-2 py-2 px-3 rounded-2xl font-black text-xs sm:text-sm transition-all active:scale-95 w-full cursor-pointer ${vertical ? '' : 'justify-center'} ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                  : 'bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700'
              }`}>
              <Pencil className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{cn.label}</span>
            </button>
            <button onClick={() => handleDeleteCustomName(cn.id)}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white hidden group-hover:flex items-center justify-center z-10"
              style={{ fontSize: '10px' }}>
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        );
      })}

      {user && customNames.length < 10 && (
        <button onClick={() => setShowAddModal(true)}
          className={`flex items-center gap-1.5 py-2 px-3 rounded-2xl font-bold text-xs transition-all active:scale-95 bg-white border border-dashed border-orange-300 text-orange-700 hover:bg-orange-50 cursor-pointer ${vertical ? 'w-full justify-start' : 'flex-shrink-0 justify-center'}`}>
          <Plus className="w-3.5 h-3.5" />
          <span>+ कस्टम नाम</span>
        </button>
      )}
    </>
  );

  const ActionButtons = () => user ? (
    <div className="flex flex-col gap-2">
      <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={currentCount === 0 || isSaving}
        className={`py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
          currentCount > 0
            ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-600/25'
            : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
        }`}>
        <AnimatePresence mode="wait">
          {saved
            ? <motion.span key="s" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> सेव हो गया!</motion.span>
            : <motion.span key="u" className="flex items-center gap-2"><Save className="w-4 h-4" /> {isSaving ? 'सेव हो रहा है...' : 'जाप सेव करें (SAVE)'}</motion.span>}
        </AnimatePresence>
      </motion.button>
      <motion.button whileTap={{ scale: 0.97 }} onClick={() => safeNavigate(user.role === 'pandit' ? '/pandit/dashboard' : '/dashboard')}
        className="py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 shadow-sm cursor-pointer">
        <BarChart3 className="w-4 h-4" /> {user.role === 'pandit' ? 'पुरोहित डैशबोर्ड' : 'भक्त डैशबोर्ड'}
      </motion.button>
    </div>
  ) : (
    <motion.button whileTap={{ scale: 0.97 }} onClick={() => safeNavigate('/login')}
      className="w-full py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/25 cursor-pointer">
      🙏 लॉगिन करें (पुण्य संचित रखें)
    </motion.button>
  );

  // Bead colors based on style
  const getBeadFill = (isMeru: boolean, isFilled: boolean) => {
    if (isMeru) return 'url(#meruGradient)';
    if (beadStyle === 'tulsi') {
      return isFilled ? 'url(#tulsiActiveGradient)' : 'url(#tulsiBeadGradient)';
    }
    if (beadStyle === 'sphatik') {
      return isFilled ? 'url(#sphatikActiveGradient)' : 'url(#sphatikBeadGradient)';
    }
    // Default Rudraksha
    return isFilled ? 'url(#rudrakshaActiveGradient)' : 'url(#rudrakshaBeadGradient)';
  };

  return (
    <>
    {/* Add Custom Name Modal */}
    <AnimatePresence>
      {showAddModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowAddModal(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 10 }}
            onClick={e => e.stopPropagation()}
            className="my-auto rounded-3xl w-full max-w-sm shadow-2xl bg-white border border-orange-200 max-h-[92vh] flex flex-col overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-orange-100 shrink-0">
              <h3 className="font-black text-slate-900 text-lg">कस्टम नाम जोड़ें</h3>
              <p className="text-xs text-slate-500 mt-0.5">जैसे: मातारानी, शिव, गणेश, सीताराम</p>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-3.5">
              <div>
                <label className="text-xs font-bold mb-1.5 block text-slate-700">नाम *</label>
                <input value={newLabel} onChange={e => setNewLabel(e.target.value)} maxLength={40}
                  placeholder="जैसे: मातारानी"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm font-bold border border-orange-200 bg-orange-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="text-xs font-bold mb-1.5 block text-slate-700">
                  बटन के अक्षर (optional, comma से अलग करें)
                </label>
                <input value={newChars} onChange={e => setNewChars(e.target.value)}
                  placeholder="जैसे: माता,रानी  या खाली छोड़ें"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm font-bold border border-orange-200 bg-orange-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                <p className="text-[10px] mt-1 text-slate-400">
                  खाली छोड़ने पर एक बटन बनेगा जो पूरा नाम लिखेगा
                </p>
              </div>
            </div>

            <div className="flex gap-2 p-4 sm:p-5 border-t border-orange-100 bg-orange-50/40 shrink-0">
              <button onClick={handleAddCustomName} disabled={!newLabel.trim() || savingCustom}
                className="flex-1 py-2.5 rounded-xl font-black text-sm transition-all disabled:opacity-50 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md cursor-pointer">
                {savingCustom ? 'सेव हो रहा है...' : '✅ जोड़ें'}
              </button>
              <button onClick={() => { setShowAddModal(false); setNewLabel(''); setNewChars(''); }}
                className="px-4 py-2.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer">
                रद्द
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Main Jaap Section */}
    <section id="jaap" className="relative py-4 sm:py-8 bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F0] to-[#FFFDF9] border-t border-orange-100/80 scroll-mt-20 overflow-hidden">
      <div className="container mx-auto px-3 sm:px-6 max-w-6xl">

        {/* Outer Section Card */}
        <div className="relative overflow-hidden rounded-3xl shadow-lg shadow-orange-950/5 p-4 sm:p-7 border border-orange-200/80 bg-white">

          <div className="relative z-10 max-w-5xl mx-auto">

            {/* Header with Devotional Greeting */}
            <div className="text-center mb-3 sm:mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1 bg-orange-100 border border-orange-200 text-orange-700 shadow-xs">
                <span>📿</span>
                <span>श्री राम नाम जप माला — 108 Sacred Beads</span>
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
                {user ? (
                  <>जय श्री राम, <span className="text-orange-600">{user.name}</span>!</>
                ) : (
                  <>श्री <span className="text-orange-600">राम नाम</span> जाप माला</>
                )}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium">
                108 मणियों की पवित्र माला फेरें, मन में शांति और अनंत पुण्य का संचार करें
              </p>
            </div>

            {/* Responsive Grid: 2 Columns on Desktop (lg:grid-cols-12), 1 Column on Mobile */}
            <div className="grid lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">

              {/* LEFT COLUMN (lg:col-span-5) — 3D Sacred Mala, Counter, Play/Pause, Goal Bar, Quote */}
              <div className="lg:col-span-5 bg-[#FFFDF9] rounded-2xl sm:rounded-3xl border border-orange-200/80 p-4 sm:p-6 shadow-sm flex flex-col items-center justify-between overflow-hidden">
                <div className="w-full flex flex-col items-center">

                  {/* 1. Mode Tabs at Top (Mala | Timer | Auto Count) */}
                  <div className="flex items-center p-1 rounded-xl bg-orange-50/90 border border-orange-200/80 w-full mb-3">
                    <button
                      onClick={() => { setJaapMode('mala'); setAutoCounting(false); setTimerRunning(false); }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        jaapMode === 'mala'
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                          : 'text-slate-600 hover:text-orange-600'
                      }`}
                    >
                      📿 Mala
                    </button>
                    <button
                      onClick={() => { setJaapMode('timer'); setAutoCounting(false); }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        jaapMode === 'timer'
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                          : 'text-slate-600 hover:text-orange-600'
                      }`}
                    >
                      ⏱️ Timer
                    </button>
                    <button
                      onClick={() => {
                        setJaapMode('auto');
                        setTimerRunning(false);
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        jaapMode === 'auto'
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                          : 'text-slate-600 hover:text-orange-600'
                      }`}
                    >
                      ⚡ Auto Count
                    </button>
                  </div>

                  {/* 2. REALISTIC 3D RUDRAKSHA MALA (Center Clean Counter Overlay) */}
                  <div className="relative w-full flex items-center justify-center gap-2 sm:gap-4 my-1 select-none">

                    {/* Left Round Minus Button [-] */}
                    <button
                      onClick={decrementCount}
                      disabled={currentCount === 0}
                      title="एक जाप कम करें (-1)"
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 active:scale-90 text-white shadow-md shadow-orange-500/25 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer z-20 shrink-0"
                    >
                      <Minus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                    </button>

                    {/* Central Realistic Mala SVG Circle with 108 Beads */}
                    <div
                      onClick={incrementCount}
                      title="माला की मणियों को स्पर्श करके जप करें (+1)"
                      className="relative flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                    >
                      <svg viewBox="0 0 240 240" className="w-[190px] h-[190px] sm:w-[230px] sm:h-[230px] drop-shadow-md">
                        <defs>
                          {/* Realistic 3D Rudraksha Bead Gradients */}
                          <radialGradient id="rudrakshaBeadGradient" cx="35%" cy="35%" r="65%">
                            <stop offset="0%" stopColor="#DF8742" />
                            <stop offset="25%" stopColor="#C45A17" />
                            <stop offset="65%" stopColor="#873507" />
                            <stop offset="90%" stopColor="#541C00" />
                            <stop offset="100%" stopColor="#2E0E00" />
                          </radialGradient>

                          <radialGradient id="rudrakshaActiveGradient" cx="35%" cy="35%" r="65%">
                            <stop offset="0%" stopColor="#FFF4AA" />
                            <stop offset="25%" stopColor="#FBBF24" />
                            <stop offset="65%" stopColor="#EA580C" />
                            <stop offset="95%" stopColor="#9A3412" />
                            <stop offset="100%" stopColor="#631C04" />
                          </radialGradient>

                          {/* Tulsi Bead Gradients */}
                          <radialGradient id="tulsiBeadGradient" cx="35%" cy="35%" r="65%">
                            <stop offset="0%" stopColor="#EADBB6" />
                            <stop offset="35%" stopColor="#C6AD7E" />
                            <stop offset="75%" stopColor="#967746" />
                            <stop offset="100%" stopColor="#674E2B" />
                          </radialGradient>
                          <radialGradient id="tulsiActiveGradient" cx="35%" cy="35%" r="65%">
                            <stop offset="0%" stopColor="#FFF9C4" />
                            <stop offset="35%" stopColor="#F59E0B" />
                            <stop offset="75%" stopColor="#D97706" />
                            <stop offset="100%" stopColor="#78350F" />
                          </radialGradient>

                          {/* Sphatik (Quartz) Gradients */}
                          <radialGradient id="sphatikBeadGradient" cx="35%" cy="35%" r="65%">
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="45%" stopColor="#E2E8F0" />
                            <stop offset="85%" stopColor="#CBD5E1" />
                            <stop offset="100%" stopColor="#94A3B8" />
                          </radialGradient>
                          <radialGradient id="sphatikActiveGradient" cx="35%" cy="35%" r="65%">
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="35%" stopColor="#BAE6FD" />
                            <stop offset="75%" stopColor="#38BDF8" />
                            <stop offset="100%" stopColor="#0284C7" />
                          </radialGradient>

                          {/* Large Sumeru / Meru Bead Gradient */}
                          <radialGradient id="meruGradient" cx="30%" cy="30%" r="70%">
                            <stop offset="0%" stopColor="#FFE082" />
                            <stop offset="25%" stopColor="#FFB300" />
                            <stop offset="65%" stopColor="#E65100" />
                            <stop offset="95%" stopColor="#8D2500" />
                            <stop offset="100%" stopColor="#4E1500" />
                          </radialGradient>

                          {/* Soft Bead Drop Shadow */}
                          <filter id="beadShadow" x="-20%" y="-20%" width="150%" height="150%">
                            <feDropShadow dx="0.8" dy="1.4" stdDeviation="0.9" floodColor="#3D1200" floodOpacity="0.4" />
                          </filter>
                        </defs>

                        {/* Inner Golden Ring */}
                        <circle cx="120" cy="120" r="72" fill="none" stroke="#FED7AA" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.8" />
                        <circle cx="120" cy="120" r="66" fill="#FFFBF5" />

                        {/* 108 Beads Array */}
                        {Array.from({ length: 108 }).map((_, i) => {
                          const angle = (i / 108) * 2 * Math.PI - Math.PI / 2;
                          const r = 90;
                          const cx = 120 + r * Math.cos(angle);
                          const cy = 120 + r * Math.sin(angle);
                          const isFilled = i < beadsFilled;
                          const isMeru = i === 0;

                          return (
                            <g key={i} filter="url(#beadShadow)">
                              <circle
                                cx={cx}
                                cy={cy}
                                r={isMeru ? 6.8 : 3.8}
                                fill={getBeadFill(isMeru, isFilled)}
                                className="transition-colors duration-150"
                              />
                              {/* Specular White Highlight Dot */}
                              <circle
                                cx={cx - (isMeru ? 2 : 1.2)}
                                cy={cy - (isMeru ? 2 : 1.2)}
                                r={isMeru ? 1.8 : 0.9}
                                fill="#FFFFFF"
                                opacity={isFilled ? 0.9 : 0.55}
                              />
                            </g>
                          );
                        })}
                      </svg>

                      {/* Clean HTML typography inside center circle (eliminates SVG scaling/overlap bugs) */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                        <span className="text-3xl sm:text-4xl font-black text-amber-950 font-serif leading-none tracking-tight">
                          {currentCount % 108 === 0 && currentCount > 0 ? 108 : currentCount % 108}
                        </span>
                        <span className="text-[11px] sm:text-xs font-bold text-amber-800/80 mt-1 uppercase tracking-wider">
                          {currentCount > 0 && currentCount % 108 === 0 ? 'जप पूर्ण' : 'जप जारी'}
                        </span>
                        {completedMalas > 0 ? (
                          <span className="text-[9px] sm:text-[10px] font-black text-orange-700 bg-orange-100/90 px-2 py-0.5 rounded-full mt-1 border border-orange-200">
                            {completedMalas} माला पूर्ण
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-400 mt-0.5">/ 108 मनके</span>
                        )}
                      </div>
                    </div>

                    {/* Right Round Plus Button [+] */}
                    <button
                      onClick={incrementCount}
                      title="एक जाप जोड़ें (+1)"
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 active:scale-90 text-white shadow-md shadow-orange-500/25 flex items-center justify-center transition-all cursor-pointer z-20 shrink-0"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                    </button>
                  </div>

                  {/* 3. PROMINENT GLOWING PLAY/PAUSE/TAP BUTTON (Matching Screen 3) */}
                  <div className="my-2.5 flex items-center justify-center">
                    <button
                      onClick={jaapMode === 'auto' ? () => setAutoCounting(prev => !prev) : incrementCount}
                      className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-500 hover:from-orange-700 hover:to-amber-600 active:scale-90 text-white shadow-lg shadow-orange-500/35 flex items-center justify-center transition-all cursor-pointer border-2 border-white/80"
                      title={jaapMode === 'auto' ? (autoCounting ? 'Pause Auto Jaap' : 'Start Auto Jaap') : 'क्लिक करके जाप करें (+1)'}
                    >
                      {jaapMode === 'auto' ? (
                        autoCounting ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5 fill-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white ml-0.5 fill-white" />
                      )}
                    </button>
                  </div>

                  {/* 4. GOAL PROGRESS BAR (Matching Screen 3: "आज का लक्ष्य" 108 / 108) */}
                  <div className="w-full p-2.5 sm:p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-amber-900 font-black flex items-center gap-1">
                        <span>🎯</span>
                        <span>आज का लक्ष्य</span>
                      </span>
                      <span className="text-orange-600 font-black font-mono">
                        {currentCount % 108 === 0 && currentCount > 0 ? 108 : currentCount % 108} / 108
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-amber-200/60 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(3, malaProgress))}%` }}
                      />
                    </div>
                  </div>

                  {/* 5. DEVOTIONAL QUOTE CARD (Matching Screen 3) */}
                  <div className="w-full mt-2.5 p-3 rounded-2xl bg-gradient-to-r from-amber-50/80 via-orange-50/50 to-amber-50/80 border border-amber-200/60 text-center">
                    <p className="text-xs font-bold text-slate-800 font-serif leading-relaxed italic">
                      “राम नाम में ऐसी शक्ति है जो मन को शांति और जीवन को सुखमय बना देती है।”
                    </p>
                  </div>

                  {/* (B) Timer Mode Controls if active */}
                  {jaapMode === 'timer' && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="w-full mt-2 p-2.5 rounded-xl bg-amber-50/90 border border-amber-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-slate-700">⏱️ साधना समय:</span>
                        <span className="text-sm font-black text-orange-600 font-mono">
                          {Math.floor(timerLeft / 60).toString().padStart(2, '0')}:{(timerLeft % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 mb-2">
                        {[
                          { label: '5m', sec: 300 },
                          { label: '10m', sec: 600 },
                          { label: '15m', sec: 900 },
                          { label: '21m', sec: 1260 },
                        ].map(t => (
                          <button
                            key={t.sec}
                            onClick={() => {
                              setTimerDuration(t.sec);
                              setTimerLeft(t.sec);
                              setTimerRunning(false);
                            }}
                            className={`py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              timerDuration === t.sec
                                ? 'bg-orange-600 text-white shadow-xs'
                                : 'bg-white text-slate-700 border border-amber-200 hover:bg-orange-50'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setTimerRunning(prev => !prev)}
                        className="w-full py-1.5 rounded-lg font-black text-xs text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-xs cursor-pointer"
                      >
                        {timerRunning ? 'Pause Timer' : 'Start Timer'}
                      </button>
                    </motion.div>
                  )}

                  {/* 6. Settings Row (Sound & Mala Beads) */}
                  <div className="w-full mt-2.5 p-2 rounded-xl bg-white border border-orange-100 shadow-xs flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSoundEnabled(prev => !prev)}
                      className="flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 bg-orange-50/80 hover:bg-orange-100 text-orange-800 border border-orange-200 cursor-pointer"
                    >
                      {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-orange-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
                      <span>ध्वनि: {soundEnabled ? 'ON' : 'OFF'}</span>
                    </button>

                    <button
                      onClick={() => {
                        const next: BeadStyle = beadStyle === 'rudraksha' ? 'tulsi' : beadStyle === 'tulsi' ? 'sphatik' : 'rudraksha';
                        setBeadStyle(next);
                      }}
                      className="flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 bg-amber-50/80 hover:bg-amber-100 text-amber-800 border border-amber-200 cursor-pointer"
                    >
                      <span>📿</span>
                      <span className="capitalize">{beadStyle} मनके</span>
                    </button>
                  </div>

                </div>

                {/* 7. Mini Bhajan Player at bottom of Left Column */}
                <div className="w-full mt-2.5 pt-2 border-t border-orange-100">
                  <MiniPlayer />
                </div>
              </div>

              {/* RIGHT COLUMN (lg:col-span-7) — Devotional Stats, Name Selector, Tactile Lekhan Keys, Display Box, Actions, Mantra */}
              <div className="lg:col-span-7 bg-[#FFFDF9] rounded-2xl sm:rounded-[2.5rem] border border-orange-200/90 p-3 sm:p-7 shadow-lg shadow-orange-900/5 flex flex-col justify-between overflow-hidden">
                <div>

                  {/* 1. Three Top Stats (Total Jaap | Today | Streak) */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full mb-3 sm:mb-5 text-center">
                    <div className="bg-orange-50/70 rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-orange-100 shadow-sm">
                      <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Jaap</p>
                      <p className="text-sm sm:text-xl font-black text-slate-900 mt-0.5 truncate">
                        {((user?.totalCount || 0) + currentCount).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="bg-amber-50/70 rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-amber-100 shadow-sm">
                      <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider">Today (आज)</p>
                      <p className="text-sm sm:text-xl font-black text-orange-600 mt-0.5">
                        {currentCount}
                      </p>
                    </div>
                    <div className="bg-rose-50/70 rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-rose-100 shadow-sm">
                      <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider">पूर्ण माला</p>
                      <p className="text-sm sm:text-xl font-black text-slate-900 mt-0.5">
                        {completedMalas > 0 ? `${completedMalas} माला` : 'साधना जारी'}
                      </p>
                    </div>
                  </div>

                  {/* 2. Divine Name Selection Tabs [राम] [राधे] [हरे कृष्णा] */}
                  <div className="w-full mb-3 sm:mb-4">
                    <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5 sm:mb-2">
                      इष्ट देव नाम चयन:
                    </p>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                      <NameTabs vertical={false} />
                    </div>
                  </div>

                  {/* 3. Tactile 3D Naam Lekhan Keyboard [ र ] [ ा ] [ म ] */}
                  <div className="w-full pt-2.5 sm:pt-3 border-t border-orange-100">
                    <div className="flex items-center justify-between mb-2 sm:mb-2.5">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <span>✍️</span>
                        <span>लिखित नाम संकीर्तन:</span>
                      </span>
                      <button
                        onClick={() => setManualMode(m => !m)}
                        className="text-[11px] sm:text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer bg-orange-50 px-2 sm:px-2.5 py-1 rounded-lg border border-orange-200"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>{manualMode ? 'बटन से लिखें' : 'कीबोर्ड से टाइप करें'}</span>
                      </button>
                    </div>

                    {!manualMode ? (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={selectedName}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.12 }}
                          className={`grid ${cfg.cols} gap-2 sm:gap-3`}
                        >
                          {cfg.keys.map(([char, label]) => (
                            <motion.button
                              key={char}
                              onClick={() => appendCharacter(char)}
                              whileTap={{ scale: 0.94 }}
                              className="relative font-black overflow-hidden rounded-xl sm:rounded-2xl shadow-md border border-amber-600/30 cursor-pointer transition-all hover:brightness-105 py-2.5 sm:py-4 px-1 sm:px-2"
                              style={{
                                color: '#451a03',
                                background: 'linear-gradient(180deg, #FFF0B3 0%, #F5BE38 45%, #E39400 100%)',
                                boxShadow: '0 6px 14px rgba(180,90,0,0.22), inset 0 2px 2px rgba(255,255,255,0.7), inset 0 -3px 4px rgba(140,60,0,0.25)',
                              }}
                            >
                              <span
                                className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none"
                                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 40%)' }}
                              />
                              <span className={`relative z-10 font-serif ${cfg.keys.length === 4 ? 'text-lg sm:text-2xl' : 'text-2xl sm:text-4xl'}`}>{label}</span>
                            </motion.button>
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          value={manualInput}
                          onChange={e => setManualInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleManualSubmit()}
                          placeholder={`${cfg.label} यहाँ लिखें...`}
                          className="flex-1 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-sm font-bold border border-orange-200 bg-orange-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button
                          onClick={handleManualSubmit}
                          disabled={!manualInput.trim()}
                          className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-black text-sm bg-orange-500 text-white shadow-sm cursor-pointer disabled:opacity-40"
                        >
                          +1
                        </button>
                      </div>
                    )}

                    {/* Live Written Display Box */}
                    <div className="mt-2.5 sm:mt-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-amber-50/60 border border-orange-200 text-center min-h-[44px] sm:min-h-[56px] max-h-20 sm:max-h-24 overflow-y-auto flex items-center justify-center">
                      {textareaValue ? (
                        <p className="text-xs sm:text-base font-black text-orange-950 font-serif leading-relaxed tracking-wide">
                          {textareaValue}
                        </p>
                      ) : (
                        <p className="text-[11px] sm:text-xs text-slate-400 italic">
                          यहाँ आपके द्वारा लिखित राम नाम संकीर्तन प्रदर्शित होगा...
                        </p>
                      )}
                    </div>
                  </div>

                </div>

                {/* 4. Bottom Actions: Save, Dashboard, Mantra & Shortcuts */}
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-orange-100 flex flex-col gap-2.5 sm:gap-3">
                  <ActionButtons />
                  <div className="text-center pt-1 sm:pt-2">
                    <p className="text-sm sm:text-lg font-black text-orange-600 font-serif tracking-wider">
                      || श्री राम जय राम जय जय राम ||
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 hidden sm:block">
                      कीबोर्ड शॉर्टकट: R, A, M या + / - दबाकर भी जाप कर सकते हैं
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
    </>
  );
}
