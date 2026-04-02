'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, BarChart3, Flag, Flower2, Bird, CheckCircle2, Play, Pause, SkipBack, SkipForward, Music2 } from 'lucide-react';
import { authApi, User } from '@/lib/auth';
import { setGlobalUnsavedJaap } from '@/lib/jaapContext';
import { useJaapNavigate } from '@/lib/useJaapNavigate';

interface NaamJapSectionProps {
  user: User | null;
  onSaveSuccess: () => void;
}

type NameType = 'RAM' | 'RADHE' | 'HARE_KRISHNA';

const NAME_CONFIG = {
  RAM: {
    label: 'राम', Icon: Flag,
    keys: [['R', 'र'], ['A', 'ा'], ['M', 'म']],
    cols: 'grid-cols-3',
    beadColor: '#d4920a', accentColor: '#f9e07a',
    textColor: '#f9e07a',
    scrollText: 'राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम',
  },
  RADHE: {
    label: 'राधे', Icon: Flower2,
    keys: [['RA', 'रा'], ['DHE', 'धे']],
    cols: 'grid-cols-2',
    beadColor: '#e91e8c', accentColor: '#f9a8d4',
    textColor: '#f9a8d4',
    scrollText: 'राधे राधे राधे राधे राधे राधे राधे राधे राधे राधे राधे राधे राधे राधे राधे राधे',
  },
  HARE_KRISHNA: {
    label: 'हरे कृष्णा', Icon: Bird,
    keys: [['HA', 'ह'], ['RE', 'रे'], ['KRI', 'कृ'], ['SHNA', 'ष्णा']],
    cols: 'grid-cols-4',
    beadColor: '#1d4ed8', accentColor: '#93c5fd',
    textColor: '#93c5fd',
    scrollText: 'हरे कृष्णा हरे कृष्णा हरे कृष्णा हरे कृष्णा हरे कृष्णा हरे कृष्णा हरे कृष्णा',
  },
};

const SONGS = [
  { displayName: 'राम धुन',       file: '/audios/ramdhun.mp3',      emoji: '🚩' },
  { displayName: 'हे राम',        file: '/audios/heyram.mp3',       emoji: '🙏' },
  { displayName: 'सीता राम',      file: '/audios/sitaram.mp3',      emoji: '💐' },
  { displayName: 'हरि धुन',       file: '/audios/haridhun.mp3',     emoji: '🌺' },
  { displayName: 'राम नाम कीर्तन', file: '/audios/ramnamkirtan.mp3', emoji: '🎵' },
];

// Mala SVG
function MalaBeads({ progress, completedMalas, beadColor, accentColor }: {
  progress: number; completedMalas: number; beadColor: string; accentColor: string;
}) {
  const total = 108;
  const filled = Math.round((progress / 100) * total);
  const radius = 108, cx = 128, cy = 128;
  return (
    <svg width="256" height="256" viewBox="0 0 256 256">
      <circle cx={cx} cy={cy} r={radius + 8} fill="none" stroke={beadColor} strokeWidth="1" opacity="0.12" />
      {Array.from({ length: total }).map((_, i) => {
        const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        const isFilled = i < filled;
        const isNext = i === filled;
        const isMeru = i === 0;
        return (
          <motion.circle key={i} cx={x} cy={y}
            r={isMeru ? 7 : isNext ? 5.5 : 4}
            fill={isMeru ? accentColor : isFilled ? beadColor : 'rgba(255,255,255,0.1)'}
            stroke={isMeru ? beadColor : isFilled ? accentColor : 'rgba(255,255,255,0.15)'}
            strokeWidth={isMeru ? 2 : 1}
            animate={{ scale: isNext ? [1, 1.5, 1] : 1, opacity: isFilled || isMeru ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
          />
        );
      })}
      <text x={cx} y={cy - 20} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="bold" letterSpacing="2">माला</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill={accentColor} fontSize="30" fontWeight="900">{filled}</text>
      <text x={cx} y={cy + 28} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="10">/ 108</text>
      {completedMalas > 0 && (
        <text x={cx} y={cy + 48} textAnchor="middle" fill={accentColor} fontSize="10" fontWeight="bold">{completedMalas} पूर्ण 🙏</text>
      )}
    </svg>
  );
}

// Inline Mini Music Player
function InlineMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [idx, setIdx] = useState(0);
  const [showList, setShowList] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const play = (i: number) => {
    setIdx(i); setIsPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.volume = 1;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }, 80);
  };

  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.volume = 1; audioRef.current.play(); setIsPlaying(true); }
  };

  const next = () => play((idx + 1) % SONGS.length);
  const prev = () => play(idx === 0 ? SONGS.length - 1 : idx - 1);

  return (
    <div className="relative w-full">
      <audio ref={audioRef} src={SONGS[idx].file} onEnded={next} />

      {/* Playlist dropdown - opens UPWARD */}
      <AnimatePresence>
        {showList && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 0.97, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 left-0 right-0 rounded-2xl overflow-hidden z-50"
            style={{ background: '#1a0800', border: '1px solid rgba(200,130,0,0.3)' }}>
            {SONGS.map((s, i) => (
              <button key={i} onClick={() => { play(i); setShowList(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all hover:bg-white/5"
                style={idx === i ? { background: 'rgba(200,130,0,0.2)' } : {}}>
                <span className="text-base">{s.emoji}</span>
                <span className="text-sm font-bold flex-1" style={{ color: idx === i ? '#f9e07a' : 'rgba(255,200,120,0.6)' }}>
                  {s.displayName}
                </span>
                {idx === i && isPlaying && (
                  <span className="text-[10px] font-black" style={{ color: '#d4920a' }}>▶</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player bar */}
      <div className="flex items-center gap-2 rounded-2xl px-3 py-2"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,130,0,0.25)' }}>

        {/* Play/Pause */}
        <button onClick={toggle}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-110"
          style={{ background: 'linear-gradient(135deg, #f9e07a, #d4920a)' }}>
          {isPlaying
            ? <Pause className="w-3.5 h-3.5" style={{ color: '#3a0f00' }} />
            : <Play className="w-3.5 h-3.5 ml-0.5" style={{ color: '#3a0f00' }} />}
        </button>

        {/* Song name + visualizer */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{SONGS[idx].emoji}</span>
            <span className="text-xs font-black truncate" style={{ color: '#f9e07a' }}>{SONGS[idx].displayName}</span>
          </div>
          {isPlaying && (
            <div className="flex items-end gap-0.5 mt-0.5 h-2.5">
              {[...Array(8)].map((_, i) => (
                <motion.div key={i}
                  animate={{ height: ['2px', `${5 + i % 3 * 3}px`, '2px'] }}
                  transition={{ duration: 0.5 + i * 0.06, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-0.5 rounded-full" style={{ background: '#d4920a' }} />
              ))}
            </div>
          )}
        </div>

        {/* Prev / Next / Playlist */}
        <button onClick={prev} className="w-6 h-6 flex items-center justify-center hover:opacity-80 transition-all">
          <SkipBack className="w-3 h-3" style={{ color: 'rgba(255,200,120,0.7)' }} />
        </button>
        <button onClick={next} className="w-6 h-6 flex items-center justify-center hover:opacity-80 transition-all">
          <SkipForward className="w-3 h-3" style={{ color: 'rgba(255,200,120,0.7)' }} />
        </button>
        <button onClick={() => setShowList(s => !s)}
          className="w-6 h-6 flex items-center justify-center hover:opacity-80 transition-all">
          <Music2 className="w-3 h-3" style={{ color: showList ? '#f9e07a' : 'rgba(255,200,120,0.5)' }} />
        </button>
      </div>
    </div>
  );
}

export default function NaamJapSection({ user, onSaveSuccess }: NaamJapSectionProps) {
  const safeNavigate = useJaapNavigate();
  const [currentCount, setCurrentCount] = useState(0);
  const [textareaValue, setTextareaValue] = useState('');
  const [userInput, setUserInput] = useState('');
  const [selectedName, setSelectedName] = useState<NameType>('RAM');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setGlobalUnsavedJaap(textareaValue.length > 0); }, [textareaValue]);

  const appendCharacter = useCallback((char: string) => {
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
  }, [textareaValue, userInput, selectedName]);

  const handleNameChange = (name: NameType) => {
    if (currentCount > 0 && !confirm('बदलाव करने से मौजूदा काउंट सेव नहीं होगा। जारी रखें?')) return;
    setSelectedName(name); setUserInput(''); setTextareaValue(''); setCurrentCount(0);
  };

  const handleSave = async () => {
    if (currentCount === 0) return;
    setIsSaving(true);
    try {
      const result = await authApi.saveCount(currentCount, (user?.totalCount || 0) + currentCount, (user?.mala || 0) + currentCount / 108);
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
    <section className="min-h-screen relative overflow-hidden flex flex-col"
      style={{ background: 'linear-gradient(160deg, #0f0500 0%, #1a0800 40%, #2d0f00 70%, #0f0500 100%)' }}>

      {/* Scrolling naam background - full section cover, CSS marquee */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none flex flex-col justify-around py-2" style={{ opacity: 0.07 }}>
        {[...Array(10)].map((_, row) => (
          <div key={row} className="overflow-hidden whitespace-nowrap">
            <motion.span
              className="inline-block text-xl font-black"
              style={{ color: cfg.accentColor }}
              animate={{ x: row % 2 === 0 ? ['0%', '-50%'] : ['-50%', '0%'] }}
              transition={{ duration: 60 + row * 8, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}>
              {(cfg.scrollText + ' ').repeat(12)}
            </motion.span>
          </div>
        ))}
      </div>

      {/* Radial glow center */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 50%, ${cfg.beadColor}22 0%, transparent 65%)` }} />

      <div className="relative z-10 flex-1 flex flex-col container mx-auto px-4 py-14 max-w-6xl">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] mb-4"
            style={{ background: 'rgba(200,130,0,0.2)', border: '1px solid rgba(200,130,0,0.35)', color: '#f9e07a' }}>
            🙏 नाम लेखन
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-1">
            {user
              ? <>जय श्री राम, <span style={{ color: '#f9e07a' }}>{user.name}</span>!</>
              : <>🙏 <span style={{ color: '#f9e07a' }}>राम नाम</span> जाप करें</>
            }
          </h2>
          <p className="text-sm" style={{ color: 'rgba(255,200,120,0.5)' }}>यहाँ से अपना नाम जाप शुरू करें</p>
        </motion.div>

        {/* Stats + Player - same row */}
        <div className="flex items-center gap-3 mb-8 max-w-2xl mx-auto w-full">
          {/* Stats */}
          {[
            { label: 'Rank', val: user ? `#${user.rank}` : '--', color: '#f9e07a' },
            { label: 'Total Jaap', val: user ? user.totalCount.toLocaleString() : '--', color: '#fb923c' },
            { label: 'Mala', val: user ? user.mala.toFixed(1) : '--', color: '#fbbf24' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl py-2 px-3 text-center flex-shrink-0"
              style={{ background: 'rgba(200,130,0,0.1)', border: '1px solid rgba(200,130,0,0.2)' }}>
              <p className="text-[8px] uppercase font-black tracking-wider mb-0.5" style={{ color: 'rgba(255,200,120,0.4)' }}>{s.label}</p>
              <p className="text-sm font-black" style={{ color: s.color }}>{s.val}</p>
            </div>
          ))}
          {/* Player - takes remaining space */}
          <div className="flex-1 min-w-0">
            <InlineMusicPlayer />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center flex-1">

          {/* LEFT: Mala only */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} className="flex flex-col items-center gap-4 lg:w-72">

            <MalaBeads progress={malaProgress} completedMalas={completedMalas}
              beadColor={cfg.beadColor} accentColor={cfg.accentColor} />

            {/* Name tabs */}
            <div className="flex gap-2 flex-wrap justify-center">
              {(Object.keys(NAME_CONFIG) as NameType[]).map((key) => {
                const c = NAME_CONFIG[key];
                const isActive = selectedName === key;
                return (
                  <button key={key} onClick={() => handleNameChange(key)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all"
                    style={isActive ? {
                      background: 'linear-gradient(135deg, #f9e07a, #d4920a)',
                      color: '#3a0f00',
                      boxShadow: '0 4px 12px rgba(180,100,0,0.4)',
                    } : {
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(200,130,0,0.2)',
                      color: 'rgba(255,200,120,0.6)',
                    }}>
                    <c.Icon className="w-3 h-3" />{c.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT: Jaap Panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} className="flex-1 max-w-md w-full">

          \

            {/* Textarea */}
            <div className="relative mb-5 rounded-2xl overflow-hidden"
              style={{ border: `1.5px solid ${cfg.beadColor}55`, background: 'rgba(255,255,255,0.04)' }}>
              <textarea readOnly value={textareaValue} rows={5}
                className="w-full p-4 bg-transparent text-lg font-bold text-center focus:outline-none resize-none leading-relaxed"
                style={{ color: cfg.accentColor }}
                placeholder="" />
              {!textareaValue && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-sm font-bold" style={{ color: 'rgba(255,200,120,0.2)' }}>
                    नाम यहाँ प्रगट होगा...
                  </span>
                </div>
              )}
            </div>

            {/* Golden Keys */}
            <AnimatePresence mode="wait">
              <motion.div key={selectedName}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.15 }}
                className={`grid ${cfg.cols} gap-3 mb-5`}>
                {cfg.keys.map(([char, label]) => (
                  <motion.button key={char} onClick={() => appendCharacter(char)}
                    whileTap={{ scale: 0.9 }}
                    className="relative font-black overflow-hidden rounded-xl"
                    style={{
                      color: '#783205',
                      fontSize: cfg.keys.length === 4 ? '1.4rem' : '2rem',
                      padding: cfg.keys.length === 4 ? '12px 4px' : '12px 8px',
                      background: 'linear-gradient(160deg, #f9e07a 0%, #d4920a 30%, #f0b429 55%, #b8760a 80%, #e8a820 100%)',
                      boxShadow: '0 6px 20px rgba(140,80,0,0.5), inset 0 2px 3px rgba(255,245,160,0.7), inset 0 -3px 5px rgba(90,40,0,0.35)',
                      border: '2px solid #9a6200',
                    }}>
                    <span className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{ background: 'linear-gradient(135deg, rgba(255,255,210,0.45) 0%, transparent 50%)' }} />
                    <span className="relative z-10">{label}</span>
                  </motion.button>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Action Buttons */}
            {user ? (
              <div className="grid grid-cols-2 gap-3">
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave}
                  disabled={currentCount === 0 || isSaving}
                  className="py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all"
                  style={currentCount > 0 ? {
                    background: 'linear-gradient(135deg, #16a34a, #15803d)',
                    color: 'white', boxShadow: '0 6px 20px rgba(22,163,74,0.3)',
                  } : {
                    background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}>
                  <AnimatePresence mode="wait">
                    {saved ? (
                      <motion.span key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> सेव हो गया!
                      </motion.span>
                    ) : (
                      <motion.span key="save" className="flex items-center gap-2">
                        <Save className="w-4 h-4" /> {isSaving ? 'सेविंग...' : 'SAVE'}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <motion.button whileTap={{ scale: 0.97 }} onClick={() => safeNavigate('/dashboard')}
                  className="py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #f9e07a 0%, #d4920a 60%, #b8760a 100%)',
                    color: '#3a0f00', boxShadow: '0 6px 20px rgba(180,100,0,0.35)',
                  }}>
                  <BarChart3 className="w-4 h-4" /> DASHBOARD
                </motion.button>
              </div>
            ) : (
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => safeNavigate('/login')}
                className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #f9e07a 0%, #d4920a 60%, #b8760a 100%)',
                  color: '#3a0f00', boxShadow: '0 6px 20px rgba(180,100,0,0.35)',
                }}>
                🙏 जाप सेव करने के लिए लॉगिन करें
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
