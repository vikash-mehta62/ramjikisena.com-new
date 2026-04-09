'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, BarChart3, Flag, Flower2, Bird, CheckCircle2, Play, Pause, Plus, X, Pencil } from 'lucide-react';
import { authApi, User } from '@/lib/auth';
import { setGlobalUnsavedJaap } from '@/lib/jaapContext';
import { useJaapNavigate } from '@/lib/useJaapNavigate';
import { useToast } from './Toast';

interface NaamJapSectionProps { user: User | null; onSaveSuccess: () => void; }
type NameType = 'RAM' | 'RADHE' | 'HARE_KRISHNA' | string;

interface CustomName { id: string; label: string; chars: string[]; }

const PRESET_CONFIG = {
  RAM:          { label: 'राम',        Icon: Flag,    keys: [['R','र'],['A','ा'],['M','म']],                          cols: 'grid-cols-3', beadColor: '#d4920a', accentColor: '#f9e07a', scrollText: 'राम ' },
  RADHE:        { label: 'राधे',       Icon: Flower2, keys: [['RA','रा'],['DHE','धे']],                               cols: 'grid-cols-2', beadColor: '#e91e8c', accentColor: '#f9a8d4', scrollText: 'राधे ' },
  HARE_KRISHNA: { label: 'हरे कृष्णा', Icon: Bird,    keys: [['HA','ह'],['RE','रे'],['KRI','कृ'],['SHNA','ष्णा']], cols: 'grid-cols-4', beadColor: '#1d4ed8', accentColor: '#93c5fd', scrollText: 'हरे कृष्णा ' },
};

const SONGS = [
  { displayName: 'राम धुन',        file: '/audios/ramdhun.mp3',      emoji: '🚩' },
  { displayName: 'हे राम',         file: '/audios/heyram.mp3',       emoji: '🙏' },
  { displayName: 'सीता राम',       file: '/audios/sitaram.mp3',      emoji: '💐' },
  { displayName: 'हरि धुन',        file: '/audios/haridhun.mp3',     emoji: '🌺' },
  { displayName: 'राम नाम कीर्तन', file: '/audios/ramnamkirtan.mp3', emoji: '🎵' },
];

function MiniPlayer() {
  const [playing, setPlaying] = useState(false);
  const [idx, setIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const toggle = () => { if (!audioRef.current) return; if (playing) { audioRef.current.pause(); setPlaying(false); } else { audioRef.current.volume = 1; audioRef.current.play(); setPlaying(true); } };
  const next = () => { const i = (idx + 1) % SONGS.length; setIdx(i); setPlaying(false); setTimeout(() => { if (audioRef.current) { audioRef.current.volume = 1; audioRef.current.play(); setPlaying(true); } }, 80); };
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,130,0,0.2)' }}>
      <audio ref={audioRef} src={SONGS[idx].file} onEnded={next} />
      <button onClick={toggle} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 active:scale-90" style={{ background: 'linear-gradient(135deg, #f9e07a, #d4920a)', boxShadow: '0 3px 8px rgba(180,100,0,0.4)' }}>
        {playing ? <Pause className="w-3 h-3" style={{ color: '#3a0f00' }} /> : <Play className="w-3 h-3 ml-0.5" style={{ color: '#3a0f00' }} />}
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black truncate" style={{ color: '#f9e07a' }}>{playing ? '🎵 बज रहा है...' : '🎵 भजन सुनें'}</p>
        <p className="text-[9px] truncate" style={{ color: 'rgba(255,200,120,0.5)' }}>{SONGS[idx].emoji} {SONGS[idx].displayName}</p>
      </div>
      <button onClick={next} className="text-[9px] font-black px-1.5 py-0.5 rounded-lg active:scale-90 flex-shrink-0" style={{ color: 'rgba(255,200,120,0.5)', background: 'rgba(255,255,255,0.05)' }}>अगला ▶</button>
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

  // Custom names state
  const [customNames, setCustomNames] = useState<CustomName[]>(user?.customJaapNames || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newChars, setNewChars] = useState('');
  const [savingCustom, setSavingCustom] = useState(false);

  // Manual typing mode (for custom names)
  const [manualMode, setManualMode] = useState(false);
  const [manualInput, setManualInput] = useState('');

  useEffect(() => {
    if (user?.customJaapNames) setCustomNames(user.customJaapNames);
  }, [user]);

  useEffect(() => { setGlobalUnsavedJaap(textareaValue.length > 0); }, [textareaValue]);

  // Get current config - preset or custom
  const isCustom = !['RAM', 'RADHE', 'HARE_KRISHNA'].includes(selectedName);
  const customCfg = isCustom ? customNames.find(n => n.id === selectedName) : null;
  const cfg = isCustom ? {
    label: customCfg?.label || '',
    Icon: Pencil,
    keys: (customCfg?.chars || []).map(c => [c, c]),
    cols: customCfg && customCfg.chars.length <= 2 ? 'grid-cols-2' : customCfg && customCfg.chars.length >= 4 ? 'grid-cols-4' : 'grid-cols-3',
    beadColor: '#7c3aed',
    accentColor: '#c4b5fd',
    scrollText: (customCfg?.label || '') + ' ',
  } : PRESET_CONFIG[selectedName as keyof typeof PRESET_CONFIG];

  const appendCharacter = useCallback((char: string) => {
    if (isCustom) {
      // Custom: each button press = one full naam
      const label = customCfg?.label || char;
      setTextareaValue(p => p + label + ' ');
      setCurrentCount(p => p + 1);
      return;
    }
    let t = textareaValue;
    if (selectedName === 'RAM') {
      if (char === 'R' && (userInput === '' || userInput === 'RAM')) { setUserInput('R'); t += 'र'; }
      else if (char === 'A' && userInput === 'R') { setUserInput('RA'); t += 'ा'; }
      else if (char === 'M' && userInput === 'RA') { setUserInput('RAM'); t += 'म '; setCurrentCount(p => p + 1); }
      else return;
    } else if (selectedName === 'RADHE') {
      if (char === 'RA' && (userInput === '' || userInput === 'RADHE')) { setUserInput('RA'); t += 'रा'; }
      else if (char === 'DHE' && userInput === 'RA') { setUserInput('RADHE'); t += 'धे '; setCurrentCount(p => p + 1); }
      else return;
    } else if (selectedName === 'HARE_KRISHNA') {
      if (char === 'HA' && (userInput === '' || userInput === 'HAREKRISHNA')) { setUserInput('HA'); t += 'ह'; }
      else if (char === 'RE' && userInput === 'HA') { setUserInput('HARE'); t += 'रे '; }
      else if (char === 'KRI' && userInput === 'HARE') { setUserInput('HAREKRI'); t += 'कृ'; }
      else if (char === 'SHNA' && userInput === 'HAREKRI') { setUserInput('HAREKRISHNA'); t += 'ष्णा '; setCurrentCount(p => p + 1); }
      else return;
    }
    setTextareaValue(t);
  }, [textareaValue, userInput, selectedName, isCustom, customCfg]);

  // Manual type submit
  const handleManualSubmit = () => {
    if (!manualInput.trim()) return;
    setTextareaValue(p => p + manualInput.trim() + ' ');
    setCurrentCount(p => p + 1);
    setManualInput('');
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
        setGlobalUnsavedJaap(false); onSaveSuccess();
        setTimeout(() => setSaved(false), 2500);
      }
    } catch { toast.error('जाप सेव करने में त्रुटि हुई'); } finally { setIsSaving(false); }
  };

  const handleAddCustomName = async () => {
    if (!newLabel.trim()) return;
    setSavingCustom(true);
    const chars = newChars.trim()
      ? newChars.split(',').map(s => s.trim()).filter(Boolean)
      : [newLabel.trim()];
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
      }
    } catch { toast.error('नाम हटाने में त्रुटि'); }
  };

  const malaProgress = ((currentCount % 108) / 108) * 100;
  const beadsFilled = Math.round((malaProgress / 100) * 108);
  const completedMalas = Math.floor(currentCount / 108);

  // Keyboard shortcuts (after all handlers are declared)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') { e.preventDefault(); handleSave(); }
        return;
      }
      if (e.altKey) return;
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

  // All name tabs (preset + custom)
  const NameTabs = ({ vertical = false }: { vertical?: boolean }) => (
    <>
      {/* Preset tabs */}
      {(Object.keys(PRESET_CONFIG) as NameType[]).map((key) => {
        const c = PRESET_CONFIG[key as keyof typeof PRESET_CONFIG];
        const isActive = selectedName === key;
        return (
          <button key={key} onClick={() => handleNameChange(key)}
            className={`flex items-center gap-2 py-2 px-3 rounded-xl font-black text-sm transition-all active:scale-95 ${vertical ? 'w-full' : 'flex-1 justify-center'}`}
            style={isActive ? { background: 'linear-gradient(135deg, #f9e07a, #d4920a)', color: '#3a0f00', boxShadow: '0 4px 14px rgba(180,100,0,0.4)' }
              : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,130,0,0.2)', color: 'rgba(255,200,120,0.6)' }}>
            <c.Icon className="w-4 h-4 flex-shrink-0" />
            <span>{c.label}</span>
          </button>
        );
      })}

      {/* Custom name tabs */}
      {customNames.map((cn) => {
        const isActive = selectedName === cn.id;
        return (
          <div key={cn.id} className={`relative group ${vertical ? 'w-full' : 'flex-1'}`}>
            <button onClick={() => handleNameChange(cn.id)}
              className={`flex items-center gap-2 py-2 px-3 rounded-xl font-black text-sm transition-all active:scale-95 w-full ${vertical ? '' : 'justify-center'}`}
              style={isActive
                ? { background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: 'white', boxShadow: '0 4px 14px rgba(124,58,237,0.4)' }
                : { background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', color: 'rgba(196,181,253,0.8)' }}>
              <Pencil className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{cn.label}</span>
            </button>
            {/* Delete button */}
            <button onClick={() => handleDeleteCustomName(cn.id)}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white hidden group-hover:flex items-center justify-center z-10"
              style={{ fontSize: '10px' }}>
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        );
      })}

      {/* Add custom button */}
      {user && customNames.length < 10 && (
        <button onClick={() => setShowAddModal(true)}
          className={`flex items-center gap-1.5 py-2 px-3 rounded-xl font-black text-xs transition-all active:scale-95 ${vertical ? 'w-full justify-start' : 'flex-shrink-0 justify-center'}`}
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(200,130,0,0.4)', color: 'rgba(255,200,120,0.5)' }}>
          <Plus className="w-3.5 h-3.5" />
          <span>कस्टम</span>
        </button>
      )}
    </>
  );

  // Reusable save/dashboard buttons
  const ActionButtons = () => user ? (
    <div className="flex flex-col gap-2">
      <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={currentCount === 0 || isSaving}
        className="py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all"
        style={currentCount > 0 ? { background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white', boxShadow: '0 5px 14px rgba(22,163,74,0.3)' }
          : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <AnimatePresence mode="wait">
          {saved
            ? <motion.span key="s" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> सेव हो गया!</motion.span>
            : <motion.span key="u" className="flex items-center gap-2"><Save className="w-4 h-4" /> {isSaving ? 'सेविंग...' : 'SAVE'}</motion.span>}
        </AnimatePresence>
      </motion.button>
      <motion.button whileTap={{ scale: 0.97 }} onClick={() => safeNavigate('/dashboard')}
        className="py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all"
        style={{ background: 'linear-gradient(135deg, #f9e07a 0%, #d4920a 60%, #b8760a 100%)', color: '#3a0f00', boxShadow: '0 5px 14px rgba(180,100,0,0.3)' }}>
        <BarChart3 className="w-4 h-4" /> DASHBOARD
      </motion.button>
    </div>
  ) : (
    <motion.button whileTap={{ scale: 0.97 }} onClick={() => safeNavigate('/login')}
      className="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all"
      style={{ background: 'linear-gradient(135deg, #f9e07a 0%, #d4920a 60%, #b8760a 100%)', color: '#3a0f00', boxShadow: '0 5px 14px rgba(180,100,0,0.3)' }}>
      🙏 लॉगिन करें
    </motion.button>
  );

  return (
    <>
    {/* Add Custom Name Modal */}
    <AnimatePresence>
      {showAddModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}>
          <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            style={{ background: '#1a0800', border: '1px solid rgba(200,130,0,0.3)' }}>
            <h3 className="font-black text-white text-lg mb-1">कस्टम नाम जोड़ें</h3>
            <p className="text-xs mb-4" style={{ color: 'rgba(255,200,120,0.5)' }}>जैसे: मातारानी, शिव, गणेश, सीताराम</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold mb-1 block" style={{ color: 'rgba(255,200,120,0.6)' }}>नाम *</label>
                <input value={newLabel} onChange={e => setNewLabel(e.target.value)} maxLength={40}
                  placeholder="जैसे: मातारानी"
                  className="w-full px-3 py-2.5 rounded-xl text-sm font-bold focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,130,0,0.3)', color: '#f9e07a' }} />
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block" style={{ color: 'rgba(255,200,120,0.6)' }}>
                  बटन के अक्षर (optional, comma से अलग करें)
                </label>
                <input value={newChars} onChange={e => setNewChars(e.target.value)}
                  placeholder="जैसे: माता,रानी  या खाली छोड़ें"
                  className="w-full px-3 py-2.5 rounded-xl text-sm font-bold focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,130,0,0.3)', color: '#f9e07a' }} />
                <p className="text-[10px] mt-1" style={{ color: 'rgba(255,200,120,0.35)' }}>
                  खाली छोड़ने पर एक बटन बनेगा जो पूरा नाम लिखेगा
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={handleAddCustomName} disabled={!newLabel.trim() || savingCustom}
                className="flex-1 py-2.5 rounded-xl font-black text-sm transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #f9e07a, #d4920a)', color: '#3a0f00' }}>
                {savingCustom ? 'सेव हो रहा है...' : '✅ जोड़ें'}
              </button>
              <button onClick={() => { setShowAddModal(false); setNewLabel(''); setNewChars(''); }}
                className="px-4 py-2.5 rounded-xl font-bold text-sm"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,200,120,0.6)', border: '1px solid rgba(200,130,0,0.2)' }}>
                रद्द
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #0f0500 0%, #1a0800 50%, #0f0500 100%)' }}>
      {/* Scrolling background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none flex flex-col justify-around" style={{ opacity: 0.06 }}>
        {[...Array(8)].map((_, row) => (
          <div key={row} className="overflow-hidden whitespace-nowrap">
            <motion.span className="inline-block text-base font-black" style={{ color: cfg.accentColor }}
              animate={{ x: row % 2 === 0 ? ['0%', '-50%'] : ['-50%', '0%'] }}
              transition={{ duration: 60 + row * 8, repeat: Infinity, ease: 'linear' }}>
              {cfg.scrollText.repeat(60)}
            </motion.span>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-4">

        {/* Header */}
        <div className="text-center mb-4">
          <span className="inline-block px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-1"
            style={{ background: 'rgba(200,130,0,0.2)', border: '1px solid rgba(200,130,0,0.3)', color: '#f9e07a' }}>
            🙏 नाम लेखन
          </span>
          <h2 className="text-xl font-black text-white leading-tight">
            {user ? <>जय श्री राम, <span style={{ color: '#f9e07a' }}>{user.name}</span>!</> : <><span style={{ color: '#f9e07a' }}>राम नाम</span> जाप करें</>}
          </h2>
          <p className="text-[10px]" style={{ color: 'rgba(255,200,120,0.45)' }}>यहाँ से अपना नाम जाप शुरू करें</p>
        </div>

        {/* ── MOBILE LAYOUT (< lg) ── */}
        <div className="flex flex-col gap-3 lg:hidden">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Rank', val: user ? `#${user.rank}` : '--', color: '#f9e07a' },
              { label: 'Jaap', val: user ? user.totalCount.toLocaleString() : '--', color: '#fb923c' },
              { label: 'Mala', val: user ? Number(user.mala).toFixed(1) : '--', color: '#fbbf24' },
            ].map((s, i) => (
              <div key={i} className="rounded-xl py-2 px-1 text-center" style={{ background: 'rgba(200,130,0,0.1)', border: '1px solid rgba(200,130,0,0.2)' }}>
                <p className="text-[7px] uppercase font-black tracking-wide" style={{ color: 'rgba(255,200,120,0.4)' }}>{s.label}</p>
                <p className="text-sm font-black leading-tight mt-0.5" style={{ color: s.color }}>{s.val}</p>
              </div>
            ))}
          </div>
          {/* Mala + Name tabs row */}
          <div className="flex items-center gap-3">
            {/* Mala SVG - compact */}
            <div className="flex-shrink-0">
              <svg width="90" height="90" viewBox="0 0 120 120">
                {Array.from({ length: 108 }).map((_, i) => {
                  const angle = (i / 108) * 2 * Math.PI - Math.PI / 2;
                  const r = 50;
                  const cx = 60 + r * Math.cos(angle);
                  const cy = 60 + r * Math.sin(angle);
                  const isFilled = i < beadsFilled;
                  const isMeru = i === 0;
                  return (
                    <circle key={i} cx={cx} cy={cy} r={isMeru ? 4 : 2.2}
                      fill={isMeru ? cfg.accentColor : isFilled ? cfg.beadColor : 'rgba(255,255,255,0.1)'}
                      stroke={isMeru ? cfg.beadColor : isFilled ? cfg.accentColor : 'rgba(255,255,255,0.12)'}
                      strokeWidth={0.6} />
                  );
                })}
                <text x="60" y="52" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7" fontWeight="bold">माला</text>
                <text x="60" y="68" textAnchor="middle" fill={cfg.accentColor} fontSize="18" fontWeight="900">{beadsFilled}</text>
                <text x="60" y="78" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="7">/108</text>
                {completedMalas > 0 && <text x="60" y="90" textAnchor="middle" fill={cfg.accentColor} fontSize="7">{completedMalas} पूर्ण</text>}
              </svg>
            </div>
            {/* Name tabs vertical next to mala */}
            <div className="flex flex-col gap-1.5 flex-1"><NameTabs vertical /></div>
          </div>
          <MiniPlayer />
          {/* Progress */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,200,120,0.4)' }}>माला प्रगति</span>
              <span className="text-[9px] font-black" style={{ color: cfg.accentColor }}>{currentCount % 108}/108</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${cfg.beadColor}, ${cfg.accentColor})` }}
                animate={{ width: `${malaProgress}%` }} transition={{ type: 'spring', stiffness: 120 }} />
            </div>
          </div>
          {/* Count */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider" style={{ color: 'rgba(255,200,120,0.4)' }}>वर्तमान जाप</span>
            <motion.span key={currentCount} initial={{ scale: 1.3, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }}
              className="text-xl font-black px-3 py-0.5 rounded-full"
              style={{ color: cfg.accentColor, background: 'rgba(200,130,0,0.15)', border: '1.5px solid rgba(200,130,0,0.25)' }}>
              {currentCount}
            </motion.span>
          </div>
          {/* Textarea */}
          <div className="relative rounded-xl overflow-hidden" style={{ border: `1.5px solid ${cfg.beadColor}44`, background: 'rgba(255,255,255,0.04)' }}>
            <textarea readOnly value={textareaValue} rows={2}
              className="w-full px-3 py-2 bg-transparent text-sm font-bold text-center focus:outline-none resize-none leading-relaxed"
              style={{ color: cfg.accentColor }} />
            {!textareaValue && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xs" style={{ color: 'rgba(255,200,120,0.2)' }}>नाम यहाँ प्रगट होगा...</span>
              </div>
            )}
          </div>
          {/* Keys */}
          <AnimatePresence mode="wait">
            <motion.div key={selectedName} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.12 }} className={`grid ${cfg.cols} gap-2`}>
              {cfg.keys.map(([char, label]) => (
                <motion.button key={char} onClick={() => appendCharacter(char)} whileTap={{ scale: 0.88 }}
                  className="relative font-black overflow-hidden rounded-xl"
                  style={{ color: '#783205', fontSize: cfg.keys.length === 4 ? '1.4rem' : '1.7rem', padding: cfg.keys.length === 4 ? '10px 4px' : '12px 8px', background: 'linear-gradient(160deg, #f9e07a 0%, #d4920a 30%, #f0b429 55%, #b8760a 80%, #e8a820 100%)', boxShadow: '0 5px 16px rgba(140,80,0,0.45), inset 0 2px 3px rgba(255,245,160,0.6), inset 0 -3px 5px rgba(90,40,0,0.3)', border: '2px solid #9a6200' }}>
                  <span className="absolute inset-0 rounded-xl pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,210,0.4) 0%, transparent 50%)' }} />
                  <span className="relative z-10">{label}</span>
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Manual typing toggle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => setManualMode(m => !m)}
                className="flex items-center gap-1.5 text-[10px] font-black transition-all"
                style={{ color: manualMode ? '#f9e07a' : 'rgba(255,200,120,0.4)' }}>
                <Pencil className="w-3 h-3" />
                {manualMode ? 'बटन से लिखें' : 'खुद टाइप करें'}
              </button>
              {!isCustom && !manualMode && (
                <span className="text-[9px]" style={{ color: 'rgba(255,200,120,0.25)' }}>
                  ⌨️ Keyboard: R A M
                </span>
              )}
            </div>
            {manualMode && (
              <div className="flex gap-2">
                <input value={manualInput} onChange={e => setManualInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleManualSubmit()}
                  placeholder={`${cfg.label} यहाँ लिखें...`}
                  className="flex-1 px-3 py-2 rounded-xl text-sm font-bold focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${cfg.beadColor}66`, color: cfg.accentColor }} />
                <button onClick={handleManualSubmit} disabled={!manualInput.trim()}
                  className="px-4 py-2 rounded-xl font-black text-sm transition-all disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #f9e07a, #d4920a)', color: '#3a0f00' }}>
                  +1
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <ActionButtons />
        </div>

        {/* ── DESKTOP LAYOUT (lg+) ── */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-start">

          {/* LEFT — Stats + Mala */}
          <div className="col-span-3 flex flex-col items-center gap-3">
            <div className="grid grid-cols-3 gap-2 w-full">
              {[
                { label: 'Rank', val: user ? `#${user.rank}` : '--', color: '#f9e07a' },
                { label: 'Jaap', val: user ? user.totalCount.toLocaleString() : '--', color: '#fb923c' },
                { label: 'Mala', val: user ? Number(user.mala).toFixed(1) : '--', color: '#fbbf24' },
              ].map((s, i) => (
                <div key={i} className="rounded-xl py-2 px-1 text-center" style={{ background: 'rgba(200,130,0,0.1)', border: '1px solid rgba(200,130,0,0.2)' }}>
                  <p className="text-[7px] uppercase font-black tracking-wide" style={{ color: 'rgba(255,200,120,0.4)' }}>{s.label}</p>
                  <p className="text-sm font-black leading-tight mt-0.5" style={{ color: s.color }}>{s.val}</p>
                </div>
              ))}
            </div>
            <svg width="150" height="150" viewBox="0 0 120 120">
              {Array.from({ length: 108 }).map((_, i) => {
                const angle = (i / 108) * 2 * Math.PI - Math.PI / 2;
                const r = 50;
                const cx = 60 + r * Math.cos(angle);
                const cy = 60 + r * Math.sin(angle);
                const isFilled = i < beadsFilled;
                const isMeru = i === 0;
                return (
                  <circle key={i} cx={cx} cy={cy} r={isMeru ? 4 : 2.2}
                    fill={isMeru ? cfg.accentColor : isFilled ? cfg.beadColor : 'rgba(255,255,255,0.1)'}
                    stroke={isMeru ? cfg.beadColor : isFilled ? cfg.accentColor : 'rgba(255,255,255,0.12)'}
                    strokeWidth={0.6} />
                );
              })}
              <text x="60" y="52" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7" fontWeight="bold">माला</text>
              <text x="60" y="68" textAnchor="middle" fill={cfg.accentColor} fontSize="18" fontWeight="900">{beadsFilled}</text>
              <text x="60" y="78" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="7">/108</text>
              {completedMalas > 0 && <text x="60" y="90" textAnchor="middle" fill={cfg.accentColor} fontSize="7">{completedMalas} पूर्ण</text>}
            </svg>
          </div>

          {/* CENTER — Jaap area */}
          <div className="col-span-6 flex flex-col gap-2.5">
            <MiniPlayer />
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,200,120,0.4)' }}>माला प्रगति</span>
                <span className="text-[9px] font-black" style={{ color: cfg.accentColor }}>{currentCount % 108}/108</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${cfg.beadColor}, ${cfg.accentColor})` }}
                  animate={{ width: `${malaProgress}%` }} transition={{ type: 'spring', stiffness: 120 }} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider" style={{ color: 'rgba(255,200,120,0.4)' }}>वर्तमान जाप</span>
              <motion.span key={currentCount} initial={{ scale: 1.3, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }}
                className="text-xl font-black px-3 py-0.5 rounded-full"
                style={{ color: cfg.accentColor, background: 'rgba(200,130,0,0.15)', border: '1.5px solid rgba(200,130,0,0.25)' }}>
                {currentCount}
              </motion.span>
            </div>
            <div className="relative rounded-xl overflow-hidden" style={{ border: `1.5px solid ${cfg.beadColor}44`, background: 'rgba(255,255,255,0.04)' }}>
              <textarea readOnly value={textareaValue} rows={2}
                className="w-full px-3 py-2 bg-transparent text-sm font-bold text-center focus:outline-none resize-none leading-relaxed"
                style={{ color: cfg.accentColor }} />
              {!textareaValue && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-xs" style={{ color: 'rgba(255,200,120,0.2)' }}>नाम यहाँ प्रगट होगा...</span>
                </div>
              )}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={selectedName} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.12 }} className={`grid ${cfg.cols} gap-2`}>
                {cfg.keys.map(([char, label]) => (
                  <motion.button key={char} onClick={() => appendCharacter(char)} whileTap={{ scale: 0.88 }}
                    className="relative font-black overflow-hidden rounded-xl"
                    style={{ color: '#783205', fontSize: cfg.keys.length === 4 ? '1.4rem' : '1.7rem', padding: cfg.keys.length === 4 ? '10px 4px' : '12px 8px', background: 'linear-gradient(160deg, #f9e07a 0%, #d4920a 30%, #f0b429 55%, #b8760a 80%, #e8a820 100%)', boxShadow: '0 5px 16px rgba(140,80,0,0.45), inset 0 2px 3px rgba(255,245,160,0.6), inset 0 -3px 5px rgba(90,40,0,0.3)', border: '2px solid #9a6200' }}>
                    <span className="absolute inset-0 rounded-xl pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,210,0.4) 0%, transparent 50%)' }} />
                    <span className="relative z-10">{label}</span>
                  </motion.button>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT — Name tabs + Actions */}
          <div className="col-span-3 flex flex-col gap-2.5">
            <p className="text-[8px] uppercase font-black tracking-widest" style={{ color: 'rgba(255,200,120,0.3)' }}>नाम चुनें</p>
            <div className="flex flex-col gap-1.5"><NameTabs vertical /></div>
            <div className="h-px" style={{ background: 'rgba(200,130,0,0.15)' }} />
            <ActionButtons />
          </div>

        </div>

      </div>
    </section>
    </>
  );
}
