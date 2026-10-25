'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, BarChart3, Flag, Flower2, Bird, CheckCircle2, Play, Pause,
  Plus, Minus, X, Pencil, Volume2, VolumeX, Sparkles, Music, Target, Timer, Zap, Flame, Trophy, Copy, RotateCcw
} from 'lucide-react';
import { authApi, User, getToken } from '@/lib/auth';
import { setGlobalUnsavedJaap } from '@/lib/jaapContext';
import { useJaapNavigate } from '@/lib/useJaapNavigate';
import { useToast } from './Toast';
import RamNaamCertificateModal from './RamNaamCertificateModal';

interface NaamJapSectionProps { user: User | null; onSaveSuccess: () => void; }
type NameType = 'RAM' | 'RADHE' | 'HARE_KRISHNA' | string;
type BeadStyle = 'rudraksha' | 'tulsi' | 'sphatik';
type JaapMode = 'mala' | 'timer' | 'auto';

interface CustomName { id: string; label: string; chars: string[]; }

const PRESET_CONFIG = {
  RAM:          { label: 'राम',        Icon: Flag,    keys: [['R','र','र'],['A','ा','।'],['M','म','म']],                          cols: 'grid-cols-3', beadColor: '#ea580c', accentColor: '#f97316', scrollText: 'राम ' },
  RADHE:        { label: 'राधे',       Icon: Flower2, keys: [['RA','रा','रा'],['DHE','धे','धे']],                               cols: 'grid-cols-2', beadColor: '#e11d48', accentColor: '#fb7185', scrollText: 'राधे ' },
  HARE_KRISHNA: { label: 'हरे कृष्णा', Icon: Bird,    keys: [['HARE','हरे','हरे'],['KRISHNA','कृष्णा','कृष्णा']], cols: 'grid-cols-2', beadColor: '#2563eb', accentColor: '#60a5fa', scrollText: 'हरे कृष्णा ' },
};

const LIVE_DEVOTEE_ACTIVITY = [
  { name: 'रमेश शर्मा जी', city: 'अयोध्या धाम', count: '108', malas: '1', action: 'ने 1 माला (108 जप) पूर्ण की!', badge: '🎉 1 माला पूर्ण', time: 'अभी-अभी' },
  { name: 'अंजली गुप्ता', city: 'काशी (वाराणसी)', count: '54', malas: '0', action: 'ने 54 पावन नाम जप अर्पित किए!', badge: '🪔 +54 जप', time: '1s ago' },
  { name: 'विक्रम सिंह राठौड़', city: 'जयपुर', count: '216', malas: '2', action: 'ने आज 2 मालाएं (216 जप) पूर्ण की!', badge: '✨ 2 माला पूर्ण', time: 'अभी-अभी' },
  { name: 'सुनीता पटेल', city: 'अहमदाबाद', count: '108', malas: '1', action: 'ने 1 माला पूर्ण की!', badge: '🏆 108 जप', time: '3s ago' },
  { name: 'गोपाल कृष्ण दास', city: 'श्री वृन्दावन धाम', count: '108', malas: '1', action: 'ने 108 हरे कृष्णा महामंत्र जप पूर्ण किए!', badge: '🌸 महामंत्र पूर्ण', time: 'अभी-अभी' },
  { name: 'दीपक शास्त्री', city: 'हरिद्वार', count: '324', malas: '3', action: 'ने आज 3 मालाएं (324 जप) पूर्ण की!', badge: '🚩 3 माला पूर्ण', time: '4s ago' },
  { name: 'मीनाक्षी जोशी', city: 'उज्जैन धाम', count: '108', malas: '1', action: 'ने 108 पावन नाम जप पूरे किए!', badge: '📿 माला पूर्ण', time: 'अभी-अभी' },
  { name: 'पंकज कुमार', city: 'नई दिल्ली', count: '108', malas: '1', action: 'ने डिजिटल राम नाम बैंक में 108 नाम जोड़े!', badge: '🙏 पुण्य संचित', time: '2s ago' },
];

const SONGS = [
  { displayName: 'राम धुन',        file: '/audios/ramdhun.mp3',      emoji: '🚩' },
  { displayName: 'हे राम',         file: '/audios/heyram.mp3',       emoji: '🙏' },
  { displayName: 'सीता राम',       file: '/audios/sitaram.mp3',      emoji: '💐' },
  { displayName: 'हरि धुन',        file: '/audios/haridhun.mp3',     emoji: '🌺' },
  { displayName: 'राम नाम कीर्तन', file: '/audios/ramnamkirtan.mp3', emoji: '🎵' },
];

const BEAD_LABEL: Record<BeadStyle, string> = { rudraksha: 'रुद्राक्ष', tulsi: 'तुलसी', sphatik: 'स्फटिक' };

// Radial gradient stops for the 3D beads: [offset, color]
const GRADS: Record<string, [string, string][]> = {
  rudrakshaBeadGradient:   [['0%', '#DF8742'], ['25%', '#C45A17'], ['65%', '#873507'], ['90%', '#541C00'], ['100%', '#2E0E00']],
  rudrakshaActiveGradient: [['0%', '#FFF4AA'], ['25%', '#FBBF24'], ['65%', '#EA580C'], ['95%', '#9A3412'], ['100%', '#631C04']],
  tulsiBeadGradient:       [['0%', '#EADBB6'], ['35%', '#C6AD7E'], ['75%', '#967746'], ['100%', '#674E2B']],
  tulsiActiveGradient:     [['0%', '#FFF9C4'], ['35%', '#F59E0B'], ['75%', '#D97706'], ['100%', '#78350F']],
  sphatikBeadGradient:     [['0%', '#FFFFFF'], ['45%', '#E2E8F0'], ['85%', '#CBD5E1'], ['100%', '#94A3B8']],
  sphatikActiveGradient:   [['0%', '#FFFFFF'], ['35%', '#BAE6FD'], ['75%', '#38BDF8'], ['100%', '#0284C7']],
  meruGradient:            [['0%', '#FFE082'], ['25%', '#FFB300'], ['65%', '#E65100'], ['95%', '#8D2500'], ['100%', '#4E1500']],
};

let sharedAudioCtx: AudioContext | null = null;
function getAudioContext(): AudioContext | null {
  try {
    if (!sharedAudioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        sharedAudioCtx = new AudioContextClass();
      }
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

function playTempleChime(freq = 528, isCelebration = false) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (isCelebration) {
      // Celestial harmonic triad (528Hz -> 660Hz -> 792Hz)
      [528, 660, 792].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.14);
        gain.gain.setValueAtTime(0.22, ctx.currentTime + idx * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.14 + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.14);
        osc.stop(ctx.currentTime + idx * 0.14 + 1.25);
      });
      return;
    }

    // Rich brass temple bell with harmonic overtone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, ctx.currentTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime);

    gain1.gain.setValueAtTime(0.2, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);

    gain2.gain.setValueAtTime(0.06, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(ctx.destination);
    gain2.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.95);
    osc2.stop(ctx.currentTime + 0.95);
  } catch {
    // Graceful fallback
  }
}

function triggerHaptic(type: 'tap' | 'complete' = 'tap') {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      if (type === 'complete') {
        navigator.vibrate([40, 50, 40, 50, 80]);
      } else {
        navigator.vibrate(12);
      }
    } catch {}
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
    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-amber-200/80 w-full">
      <audio ref={audioRef} src={SONGS[idx].file} onEnded={next} />
      <button onClick={toggle} className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 active:scale-90 bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-xs cursor-pointer hover:opacity-95">
        {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5 fill-white" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black truncate text-slate-800 flex items-center gap-1">
          <Music className="w-2.5 h-2.5 text-orange-500 shrink-0" />{playing ? 'बज रहा है...' : 'पावन भजन'}
        </p>
        <p className="text-[11px] truncate text-orange-700 font-semibold leading-tight">{SONGS[idx].emoji} {SONGS[idx].displayName}</p>
      </div>
      <button onClick={next} className="text-[10px] font-bold px-2.5 py-1 rounded-full active:scale-90 shrink-0 bg-white border border-orange-200 text-orange-700 hover:bg-orange-50 shadow-xs cursor-pointer">अगला ▶</button>
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
  const [autoSpeed, setAutoSpeed] = useState<number>(1200); // 1200ms default
  const [showCelebration, setShowCelebration] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

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
  const [activeDevoteeIdx, setActiveDevoteeIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDevoteeIdx(prev => (prev + 1) % LIVE_DEVOTEE_ACTIVITY.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

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

  const triggerBeadFeedback = useCallback((isCelebration = false) => {
    if (soundEnabled) {
      playTempleChime(528, isCelebration);
    }
    triggerHaptic(isCelebration ? 'complete' : 'tap');
    if (isCelebration) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3500);
    }
  }, [soundEnabled]);

  // Auto Count effect
  useEffect(() => {
    if (jaapMode !== 'auto' || !autoCounting) return;
    const interval = setInterval(() => {
      const label = isCustom ? (customCfg?.label || 'राम') : (selectedName === 'RADHE' ? 'राधे' : selectedName === 'HARE_KRISHNA' ? 'हरे कृष्णा' : 'राम');
      setTextareaValue(p => p + label + ' ');
      setCurrentCount(p => {
        const next = p + 1;
        triggerBeadFeedback(next > 0 && next % 108 === 0);
        return next;
      });
    }, autoSpeed);
    return () => clearInterval(interval);
  }, [jaapMode, autoCounting, autoSpeed, isCustom, customCfg, selectedName, triggerBeadFeedback]);

  // Timer effect
  useEffect(() => {
    if (jaapMode !== 'timer' || !timerRunning) return;
    if (timerLeft <= 0) {
      setTimerRunning(false);
      triggerBeadFeedback(true);
      return;
    }
    const interval = setInterval(() => {
      setTimerLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          setTimerRunning(false);
          triggerBeadFeedback(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [jaapMode, timerRunning, timerLeft, triggerBeadFeedback]);

  const incrementCount = () => {
    const label = isCustom ? (customCfg?.label || 'राम') : (selectedName === 'RADHE' ? 'राधे' : selectedName === 'HARE_KRISHNA' ? 'हरे कृष्णा' : 'राम');
    setTextareaValue(p => p + label + ' ');
    setCurrentCount(p => {
      const next = p + 1;
      triggerBeadFeedback(next > 0 && next % 108 === 0);
      return next;
    });
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
      setCurrentCount(p => {
        const next = p + 1;
        if (next > 0 && next % 108 === 0) triggerBeadFeedback(true);
        return next;
      });
      return;
    }
    let t = textareaValue;
    if (selectedName === 'RAM') {
      if (char === 'R' && (userInput === '' || userInput === 'RAM')) { setUserInput('R'); t += 'र'; }
      else if (char === 'A' && userInput === 'R') { setUserInput('RA'); t += 'ा'; }
      else if (char === 'M' && userInput === 'RA') {
        setUserInput('');
        t += 'म ';
        setCurrentCount(p => {
          const next = p + 1;
          if (next > 0 && next % 108 === 0) triggerBeadFeedback(true);
          return next;
        });
      }
      else return;
    } else if (selectedName === 'RADHE') {
      if (char === 'RA' && (userInput === '' || userInput === 'RADHE')) { setUserInput('RA'); t += 'रा'; }
      else if (char === 'DHE' && userInput === 'RA') {
        setUserInput('');
        t += 'धे ';
        setCurrentCount(p => {
          const next = p + 1;
          if (next > 0 && next % 108 === 0) triggerBeadFeedback(true);
          return next;
        });
      }
      else return;
    } else if (selectedName === 'HARE_KRISHNA') {
      if (char === 'HARE' && (userInput === '' || userInput === 'HAREKRISHNA')) {
        setUserInput('HARE');
        t += 'हरे ';
      } else if (char === 'KRISHNA' && userInput === 'HARE') {
        setUserInput('');
        t += 'कृष्णा ';
        setCurrentCount(p => {
          const next = p + 1;
          if (next > 0 && next % 108 === 0) triggerBeadFeedback(true);
          return next;
        });
      } else return;
    }
    setTextareaValue(t);
  }, [textareaValue, userInput, selectedName, isCustom, customCfg, triggerBeadFeedback]);

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
  const shownCount = currentCount % 108 === 0 && currentCount > 0 ? 108 : currentCount % 108;
  const ARC_R = 118;
  const ARC_C = 2 * Math.PI * ARC_R;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') { e.preventDefault(); handleSave(); }
        return;
      }
      if (e.altKey) return;
      if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); incrementCount(); return; }
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
        if (e.key === 'h' || e.key === 'H') appendCharacter('HARE');
        else if (e.key === 'k' || e.key === 'K') appendCharacter('KRISHNA');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [appendCharacter, selectedName, handleSave]);

  const getNextKey = () => {
    if (selectedName === 'RAM') {
      if (userInput === '' || userInput === 'RAM') return 'R';
      if (userInput === 'R') return 'A';
      if (userInput === 'RA') return 'M';
    } else if (selectedName === 'RADHE') {
      if (userInput === '' || userInput === 'RADHE') return 'RA';
      if (userInput === 'RA') return 'DHE';
    } else if (selectedName === 'HARE_KRISHNA') {
      if (userInput === '' || userInput === 'HAREKRISHNA') return 'HARE';
      if (userInput === 'HARE') return 'KRISHNA';
    }
    return null;
  };

  // Single-line, horizontally scrollable name chips
  const NameTabs = () => (
    <>
      {(Object.keys(PRESET_CONFIG) as NameType[]).map((key) => {
        const c = PRESET_CONFIG[key as keyof typeof PRESET_CONFIG];
        const isActive = selectedName === key;
        return (
          <button key={key} onClick={() => handleNameChange(key)}
            className={`shrink-0 whitespace-nowrap flex items-center gap-1.5 py-1.5 px-3 sm:px-3.5 rounded-full font-black text-xs transition-all active:scale-95 cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/30'
                : 'bg-white hover:bg-orange-50 border border-orange-200 text-slate-700'
            }`}>
            <c.Icon className="w-3.5 h-3.5" />
            <span>{c.label}</span>
          </button>
        );
      })}

      {customNames.map((cn) => {
        const isActive = selectedName === cn.id;
        return (
          <div key={cn.id} className="relative group shrink-0">
            <button onClick={() => handleNameChange(cn.id)}
              className={`whitespace-nowrap flex items-center gap-1 py-1.5 px-3 rounded-full font-bold text-xs transition-all active:scale-95 cursor-pointer max-w-[140px] ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                  : 'bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700'
              }`}>
              <Pencil className="w-3 h-3 shrink-0" />
              <span className="truncate">{cn.label}</span>
            </button>
            <button onClick={() => handleDeleteCustomName(cn.id)} aria-label="हटाएं"
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white hidden group-hover:flex items-center justify-center z-10">
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        );
      })}

      {user && customNames.length < 10 && (
        <button onClick={() => setShowAddModal(true)}
          className="shrink-0 whitespace-nowrap flex items-center gap-1 py-1.5 px-3 rounded-full font-bold text-xs transition-all active:scale-95 bg-white border border-dashed border-orange-400 text-orange-700 hover:bg-orange-50 cursor-pointer">
          <Plus className="w-3 h-3" />
          <span>कस्टम नाम</span>
        </button>
      )}
    </>
  );

  const ActionButtons = () => user ? (
    <div className="grid grid-cols-5 gap-2">
      <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={currentCount === 0 || isSaving}
        className={`col-span-3 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
          currentCount > 0
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md shadow-orange-500/30'
            : 'bg-orange-50 text-orange-300 border border-orange-100 cursor-not-allowed'
        }`}>
        <AnimatePresence mode="wait">
          {saved
            ? <motion.span key="s" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> सेव हुआ!</motion.span>
            : <motion.span key="u" className="flex items-center gap-1.5"><Save className="w-4 h-4" /> {isSaving ? 'सेव हो रहा...' : `जाप सेव करें${currentCount > 0 ? ` (${currentCount})` : ''}`}</motion.span>}
        </AnimatePresence>
      </motion.button>
      <motion.button whileTap={{ scale: 0.97 }} onClick={() => safeNavigate(user.role === 'pandit' ? '/pandit/dashboard' : '/dashboard')}
        className="col-span-2 py-2.5 px-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1 transition-all bg-white hover:bg-orange-50 text-orange-800 border border-orange-300 cursor-pointer">
        <BarChart3 className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{user.role === 'pandit' ? 'पुरोहित पोर्टल' : 'भक्त डैशबोर्ड'}</span>
      </motion.button>
    </div>
  ) : (
    <motion.button whileTap={{ scale: 0.97 }} onClick={() => safeNavigate('/login')}
      className="w-full py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md shadow-orange-500/30 cursor-pointer">
      🙏 लॉगिन करें (पुण्य संचित रखें)
    </motion.button>
  );

  const getBeadFill = (isMeru: boolean, isFilled: boolean) => {
    if (isMeru) return 'url(#meruGradient)';
    return `url(#${beadStyle}${isFilled ? 'ActiveGradient' : 'BeadGradient'})`;
  };

  const MODES: { id: JaapMode; label: string; Icon: typeof Sparkles }[] = [
    { id: 'mala', label: 'Mala', Icon: Sparkles },
    { id: 'timer', label: 'Timer', Icon: Timer },
    { id: 'auto', label: 'Auto Count', Icon: Zap },
  ];

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
                <label className="text-xs font-bold mb-1.5 block text-slate-700">बटन के अक्षर (optional, comma से अलग करें)</label>
                <input value={newChars} onChange={e => setNewChars(e.target.value)}
                  placeholder="जैसे: माता,रानी  या खाली छोड़ें"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm font-bold border border-orange-200 bg-orange-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                <p className="text-[10px] mt-1 text-slate-400">खाली छोड़ने पर एक बटन बनेगा जो पूरा नाम लिखेगा</p>
              </div>
            </div>
            <div className="flex gap-2 p-4 sm:p-5 border-t border-orange-100 bg-orange-50/40 shrink-0">
              <button onClick={handleAddCustomName} disabled={!newLabel.trim() || savingCustom}
                className="flex-1 py-2.5 rounded-xl font-black text-sm transition-all disabled:opacity-50 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md cursor-pointer">
                {savingCustom ? 'सेव हो रहा है...' : '✅ जोड़ें'}
              </button>
              <button onClick={() => { setShowAddModal(false); setNewLabel(''); setNewChars(''); }}
                className="px-4 py-2.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer">रद्द</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Main Jaap Section */}
    <div className="relative">
      {/* 108 Mala Celebration Banner */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div initial={{ opacity: 0, scale: 0.85, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500 text-white shadow-2xl shadow-orange-600/50 text-center pointer-events-none border border-yellow-200/60 max-w-sm w-[90%]">
            <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black">
              <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" />
              <span>🚩 108 पावन जाप पूर्ण! जय श्री राम 🙏</span>
              <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" />
            </div>
            <div className="flex items-center justify-center gap-2 mt-0.5">
              <span className="text-[10px] text-amber-100 font-bold">आपकी 1 पवित्र माला पूर्ण हुई</span>
              <button onClick={() => setShowCertificate(true)} className="pointer-events-auto text-[10px] font-black text-amber-950 bg-yellow-300 hover:bg-yellow-200 px-2.5 py-0.5 rounded-full shadow-xs cursor-pointer transition-all">
                📜 प्रशस्ति पत्र
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="container mx-auto px-3 sm:px-6 max-w-6xl">

        {/* Section heading */}
        <div className="text-center mb-2.5 sm:mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] sm:text-[11px] font-black tracking-wide mb-1">
            🚩 108 पावन मनके
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-[#7A1D05]">
            {user ? <>जय श्री राम, <span className="text-orange-600">{user.name}</span>!</> : <>श्री <span className="text-orange-600">राम नाम</span> जाप माला</>}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">माला फेरें, मन में शांति और अनंत पुण्य का संचार करें</p>
        </div>

        {/* ============ GAMING-STYLE LIVE DEVOTEE JAPA TICKER ============ */}
        <div className="mb-3 max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-full bg-gradient-to-r from-[#581404] via-[#7A1D05] to-[#581404] border border-amber-500/40 shadow-md shadow-orange-950/20 py-1.5 px-3 sm:px-4 flex items-center justify-between gap-2 text-white">
            
            {/* Left: Live indicator badge */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-[10px] sm:text-[11px] font-black uppercase text-emerald-400 tracking-wider">
                LIVE JAP
              </span>
            </div>

            {/* Middle: Rotating devotee activity ticker (Gaming Winner Style) */}
            <div className="flex-1 overflow-hidden text-center sm:text-left px-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDevoteeIdx}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.22 }}
                  className="flex items-center justify-center sm:justify-start gap-1.5 text-xs truncate"
                >
                  <span className="font-black text-amber-300 truncate">
                    {LIVE_DEVOTEE_ACTIVITY[activeDevoteeIdx].name}
                  </span>
                  <span className="text-amber-200/80 text-[11px] shrink-0">
                    ({LIVE_DEVOTEE_ACTIVITY[activeDevoteeIdx].city})
                  </span>
                  <span className="text-amber-100 text-[11px] truncate hidden md:inline">
                    {LIVE_DEVOTEE_ACTIVITY[activeDevoteeIdx].action}
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-amber-950 shrink-0 shadow-2xs ml-auto">
                    {LIVE_DEVOTEE_ACTIVITY[activeDevoteeIdx].badge}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: Real-time Live Sadhaks online count */}
            <div className="hidden lg:flex items-center gap-1 shrink-0 text-[10px] font-bold text-amber-200/80 pl-2 border-l border-amber-500/30">
              <span>👥</span>
              <span>1,280+ भक्त लाइव</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-3.5 sm:gap-5 items-stretch">

          {/* ============ LEFT: MALA ============ */}
          <div className="lg:col-span-5 relative rounded-2xl border border-amber-200/80 bg-white p-3 sm:p-3.5 shadow-lg shadow-orange-900/5 flex flex-col gap-2 overflow-hidden">
            

            {/* Top row: 108 मनका माला Badge + Sound toggle & Bead selector */}
            <div className="relative flex items-center justify-between gap-1.5 flex-wrap sm:flex-nowrap">
              <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[11px] font-black shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                <span>108 मनका माला</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => setSoundEnabled(prev => !prev)} title="ध्वनि ऑन/ऑफ"
                  className="py-1 px-2 rounded-full text-[10px] sm:text-[11px] font-bold flex items-center gap-1 bg-white hover:bg-orange-50 text-orange-800 border border-orange-200 cursor-pointer transition-all shadow-xs">
                  {soundEnabled ? <Volume2 className="w-3 h-3 text-orange-600" /> : <VolumeX className="w-3 h-3 text-slate-400" />}
                  <span>{soundEnabled ? 'ON' : 'OFF'}</span>
                </button>
                <button onClick={() => setBeadStyle(beadStyle === 'rudraksha' ? 'tulsi' : beadStyle === 'tulsi' ? 'sphatik' : 'rudraksha')} title="मनका शैली बदलें"
                  className="py-1 px-2 rounded-full text-[10px] sm:text-[11px] font-bold flex items-center gap-1 bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 cursor-pointer transition-all shadow-xs">
                  <span>📿 {BEAD_LABEL[beadStyle]}</span>
                </button>
              </div>
            </div>

            {/* 3 Compact Stats Badges (Transferred from right card) */}
            <div className="relative grid grid-cols-3 gap-1.5 pt-0.5">
              {/* 1. Total Jaap */}
              <div className="rounded-xl border border-amber-200/80 bg-[#FFF8EE] p-1.5 text-center shadow-2xs">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center bg-orange-100 text-orange-600">
                    <Trophy className="w-2.5 h-2.5" />
                  </span>
                  <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider truncate">Total Jaap</p>
                </div>
                <p className="text-sm sm:text-base font-serif font-black text-slate-900 truncate leading-tight">
                  {((user?.totalCount || 0) + currentCount).toLocaleString('en-IN')}
                </p>
              </div>

              {/* 2. आज (Today) */}
              <div className="rounded-xl border border-amber-200/80 bg-[#FFF8EE] p-1.5 text-center shadow-2xs">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center bg-amber-100 text-amber-600">
                    <Flame className="w-2.5 h-2.5" />
                  </span>
                  <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider truncate">आज (Today)</p>
                </div>
                <p className="text-sm sm:text-base font-serif font-black text-slate-900 truncate leading-tight">
                  {currentCount.toLocaleString('en-IN')}
                </p>
              </div>

              {/* 3. पूर्ण माला */}
              <div className="rounded-xl border border-amber-200/80 bg-[#FFF8EE] p-1.5 text-center shadow-2xs">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center bg-orange-100 text-orange-600">
                    <Sparkles className="w-2.5 h-2.5" />
                  </span>
                  <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider truncate">पूर्ण माला</p>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <p className="text-sm sm:text-base font-serif font-black text-slate-900 leading-tight">
                    {completedMalas.toString()}
                  </p>
                  {completedMalas > 0 && (
                    <button onClick={() => setShowCertificate(true)} title="प्रशस्ति पत्र देखें" className="text-[8px] font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-1 rounded-full cursor-pointer">
                      📜
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Mala */}
            <div className="relative flex items-center justify-center select-none py-0.5">
              <div onClick={incrementCount} title="माला को स्पर्श करके जप करें (+1)"
                className="relative cursor-pointer active:scale-[0.98] transition-transform">
                <svg viewBox="0 0 260 260" className="w-[145px] h-[145px] sm:w-[160px] sm:h-[160px] drop-shadow-md">
                  <defs>
                    {Object.entries(GRADS).map(([id, stops]) => (
                      <radialGradient key={id} id={id} cx={id === 'meruGradient' ? '30%' : '35%'} cy={id === 'meruGradient' ? '30%' : '35%'} r={id === 'meruGradient' ? '70%' : '65%'}>
                        {stops.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
                      </radialGradient>
                    ))}
                    <linearGradient id="arcGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#F97316" />
                      <stop offset="100%" stopColor="#FBBF24" />
                    </linearGradient>
                    <radialGradient id="discGradient" cx="50%" cy="40%" r="70%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#FFF1DA" />
                    </radialGradient>
                    <filter id="beadShadow" x="-20%" y="-20%" width="150%" height="150%">
                      <feDropShadow dx="0.8" dy="1.4" stdDeviation="0.9" floodColor="#3D1200" floodOpacity="0.4" />
                    </filter>
                  </defs>

                  {/* Progress arc (current mala) */}
                  <circle cx="130" cy="130" r={ARC_R} fill="none" stroke="#FFE4C4" strokeWidth="5" />
                  <circle cx="130" cy="130" r={ARC_R} fill="none" stroke="url(#arcGradient)" strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={ARC_C} strokeDashoffset={ARC_C * (1 - malaProgress / 100)}
                    transform="rotate(-90 130 130)" style={{ transition: 'stroke-dashoffset 0.3s ease' }} />

                  {/* Center disc */}
                  <circle cx="130" cy="130" r="82" fill="url(#discGradient)" stroke="#FED7AA" strokeWidth="1.2" />
                  <circle cx="130" cy="130" r="74" fill="none" stroke="#FDBA74" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.8" />

                  {/* 108 beads */}
                  {Array.from({ length: 108 }).map((_, i) => {
                    const angle = (i / 108) * 2 * Math.PI - Math.PI / 2;
                    const r = 100;
                    const cx = Math.round((130 + r * Math.cos(angle)) * 100) / 100;
                    const cy = Math.round((130 + r * Math.sin(angle)) * 100) / 100;
                    const isFilled = i < beadsFilled;
                    const isMeru = i === 0;
                    return (
                      <g key={i} filter="url(#beadShadow)">
                        <circle cx={cx} cy={cy} r={isMeru ? 7 : 4} fill={getBeadFill(isMeru, isFilled)} className="transition-colors duration-150" />
                        {isFilled && <circle cx={cx - 1.2} cy={cy - 1.2} r={isMeru ? 2.5 : 1.3} fill="#FFF" opacity="0.75" />}
                      </g>
                    );
                  })}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl sm:text-4xl font-black text-[#7A1D05] font-serif leading-none">{shownCount}</span>
                  <span className="text-[10px] sm:text-[11px] font-bold text-orange-700 mt-1 tracking-wide">
                    {currentCount > 0 && currentCount % 108 === 0 ? 'जप पूर्ण 🙏' : 'जप जारी'}
                  </span>
                </div>
              </div>
            </div>

            {/* Controls: − [ big button ] + */}
            <div className="relative flex flex-col items-center justify-center gap-1.5">
              <div className="flex items-center justify-center gap-4">
                <button onClick={decrementCount} disabled={currentCount === 0} title="एक जाप कम करें (-1)"
                  className="w-8 h-8 rounded-full bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 shadow-xs flex items-center justify-center transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                  <Minus className="w-4 h-4 stroke-[2.5]" />
                </button>
                <button
                  onClick={incrementCount}
                  title="क्लिक करके जाप करें (+1)"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-md shadow-orange-500/40 flex items-center justify-center transition-all active:scale-90 border-2 border-white cursor-pointer hover:scale-105">
                  <Play className="w-4 h-4 ml-0.5 fill-white" />
                </button>
                <button onClick={incrementCount} title="एक जाप जोड़ें (+1)"
                  className="w-8 h-8 rounded-full bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 shadow-xs flex items-center justify-center transition-all active:scale-90 cursor-pointer">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Goal bar */}
            <div className="relative px-3 py-1.5 rounded-xl bg-white border border-orange-100 shadow-xs">
              <div className="flex items-center justify-between mb-1 text-[11px] font-bold">
                <span className="text-amber-900 flex items-center gap-1"><Target className="w-3 h-3 text-orange-500" /> आज का लक्ष्य</span>
                <span className="font-mono text-orange-600">{shownCount} / 108</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-orange-100 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, Math.max(2, malaProgress))}%` }} />
              </div>
            </div>

            {/* Quote */}
            <p className="relative text-center text-[11px] font-serif italic text-amber-900/80 leading-tight truncate px-1">
              “राम नाम में ऐसी शक्ति है जो मन को शांति और जीवन को सुखमय बना देती है।”
            </p>

            <div className="relative mt-auto pt-0.5"><MiniPlayer /></div>
          </div>

          {/* ============ RIGHT: ISHTA DEV + LEKHAN (Enlarged Typed Box) ============ */}
          <div className="lg:col-span-7 rounded-2xl border border-amber-200/80 bg-white p-3.5 sm:p-4 shadow-lg shadow-orange-900/5 flex flex-col gap-3 overflow-hidden">

            {/* Ishta dev Selector Chips */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1">
                  <span>📿</span>
                  <span>इष्ट देव नाम चयन</span>
                </p>
                <span className="text-[10px] text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  {cfg.label} जाप सक्रिय
                </span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
                <NameTabs />
              </div>
            </div>

            {/* Lekhan Controls */}
            <div className="pt-2.5 border-t border-orange-100 flex-1 flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1">
                  <span>✍️</span>
                  <span>लिखित नाम संकीर्तन</span>
                </span>
                <button onClick={() => setManualMode(m => !m)}
                  className="text-[10px] sm:text-[11px] font-bold text-orange-700 hover:bg-orange-100 flex items-center gap-1 cursor-pointer bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 transition-all">
                  <Pencil className="w-2.5 h-2.5" />
                  <span>{manualMode ? 'बटन से लिखें' : 'कीबोर्ड से टाइप करें'}</span>
                </button>
              </div>

              {!manualMode ? (
                <AnimatePresence mode="wait">
                  <motion.div key={selectedName} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.12 }}
                    className={`grid ${cfg.cols} gap-2 sm:gap-2.5`}>
                    {cfg.keys.map(([char, appendChar, displayChar]) => {
                      const isNext = getNextKey() === char;
                      return (
                        <motion.button key={char} onClick={() => appendCharacter(char)} whileTap={{ scale: 0.94, y: 2 }}
                          className={`relative overflow-hidden rounded-xl sm:rounded-2xl border border-amber-600/30 cursor-pointer hover:brightness-105 py-2.5 sm:py-3 px-1 transition-all ${
                            isNext ? 'ring-2 ring-orange-500 ring-offset-1' : ''
                          }`}
                          style={{
                            color: '#451a03',
                            background: isNext
                              ? 'linear-gradient(180deg, #FFF5CC 0%, #FCD34D 50%, #F59E0B 100%)'
                              : 'linear-gradient(180deg, #FFF0B3 0%, #F5BE38 50%, #E39400 100%)',
                            boxShadow: isNext
                              ? '0 0 10px rgba(245,158,11,0.5), 0 4px 0 #B86E00, 0 6px 12px rgba(180,90,0,0.25), inset 0 2px 2px rgba(255,255,255,0.8)'
                              : '0 4px 0 #B86E00, 0 6px 12px rgba(180,90,0,0.22), inset 0 2px 2px rgba(255,255,255,0.7)',
                          }}>
                          <span className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 45%)' }} />
                          <span className={`relative z-10 font-serif font-black ${cfg.keys.length === 4 ? 'text-base sm:text-xl' : 'text-xl sm:text-2xl'}`}>{displayChar || appendChar || char}</span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="flex gap-2">
                  <input value={manualInput} onChange={e => setManualInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleManualSubmit()}
                    placeholder={`${cfg.label} यहाँ लिखें...`}
                    className="flex-1 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border border-orange-200 bg-orange-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  <button onClick={handleManualSubmit} disabled={!manualInput.trim()}
                    className="px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm bg-orange-500 hover:bg-orange-600 text-white shadow-xs cursor-pointer disabled:opacity-40">+1</button>
                </div>
              )}

              {/* Enlarged & Prominent Written Sankirtan Display Box */}
              <div className="relative mt-2.5 rounded-2xl bg-[#FFF8EE] border-2 border-dashed border-amber-300/90 shadow-inner p-3 sm:p-4 min-h-[95px] sm:min-h-[120px] max-h-48 flex flex-col justify-between overflow-hidden">
                {/* Header bar inside box */}
                <div className="flex items-center justify-between gap-2 border-b border-amber-200/70 pb-1.5 mb-1.5">
                  <span className="text-[11px] font-black text-[#8A4A1C] flex items-center gap-1">
                    <span>📜</span>
                    <span>लिखित नाम संकीर्तन पट्टिका</span>
                  </span>
                  {textareaValue && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-black text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-200">
                        {textareaValue.trim().split(/\s+/).filter(Boolean).length} बार संकीर्तित
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(textareaValue.trim());
                          toast.success('नाम संकीर्तन कॉपी किया गया! 📋');
                        }}
                        title="कॉपी करें"
                        className="px-2 py-0.5 rounded-md bg-white hover:bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Copy className="w-3 h-3" />
                        <span>कॉपी</span>
                      </button>
                      <button
                        onClick={() => {
                          setTextareaValue('');
                          setUserInput('');
                        }}
                        title="साफ़ करें"
                        className="px-2 py-0.5 rounded-md bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 shadow-2xs text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>साफ़</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto flex items-center justify-center py-1">
                  {textareaValue ? (
                    <p className="text-base sm:text-xl lg:text-2xl font-serif font-black text-[#7A1D05] leading-relaxed tracking-wider text-center select-all">
                      {textareaValue}
                    </p>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-xs sm:text-sm font-serif font-bold text-amber-900/80">
                        ✨ प्रभु श्री राम का पावन नाम यहाँ प्रकट होगा...
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        ऊपर दिए गए बटनों [ {cfg.keys.map(k => k[2] || k[1] || k[0]).join(' ')} ] पर क्लिक करें या कीबोर्ड से टाइप करें
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions + mantra */}
            <div className="mt-auto pt-2 sm:pt-2.5 border-t border-orange-100 flex flex-col gap-2">
              <ActionButtons />
              <div className="text-center">
                <p className="text-sm sm:text-base font-black text-orange-600 font-serif tracking-wider">
                  {selectedName === 'RADHE' ? '|| श्री राधे कृष्ण ||' : selectedName === 'HARE_KRISHNA' ? '|| हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे ||' : '|| श्री राम जय राम जय जय राम ||'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">
                  {selectedName === 'RADHE' ? 'कीबोर्ड शॉर्टकट: R, D या + / - दबाकर भी जाप कर सकते हैं' : selectedName === 'HARE_KRISHNA' ? 'कीबोर्ड शॉर्टकट: H (हरे), K (कृष्णा) या + / - दबाकर भी जाप कर सकते हैं' : 'कीबोर्ड शॉर्टकट: R, A, M या + / - दबाकर भी जाप कर सकते हैं'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
      <RamNaamCertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        devoteeName={user?.name || 'राम भक्त'}
        totalJaap={((user?.totalCount || 0) + currentCount)}
        completedMalas={completedMalas}
      />
    </div>
    </>
  );
}
