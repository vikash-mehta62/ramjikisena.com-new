'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import NaamJapSection from '@/components/NaamJapSection';
import Footer from '@/components/Footer';
import DailyPanchang from '@/components/DailyPanchang';
import LiveAkhandJaapTicker from '@/components/LiveAkhandJaapTicker';
import RamShalakaModal from '@/components/RamShalakaModal';
import { authApi, User } from '@/lib/auth';
import { useJaapNavigate } from '@/lib/useJaapNavigate';
import {
  Sparkles, Flame, Users, ArrowRight, Calendar, Play, BookOpen,
  Heart, Bell, HelpCircle, FileText, X, Volume2, VolumeX,
  Music, HandHeart, Timer
} from 'lucide-react';

import { SEED_CHAUPAIS, ChaupaiItem } from '@/lib/seedInspirations';

export interface ServiceItem {
  _id?: string;
  id?: string;
  serviceId?: string;
  category: 'purohit' | 'satsang' | 'darshan' | 'samagri' | 'blogs' | 'astrology';
  title: string;
  subtitle: string;
  desc: string;
  href: string;
  img: string;
  imgPosition?: string;
  emoji?: string;
  popular?: string;
  features?: string[];
  ctaText?: string;
  stats?: string;
  rating?: string;
  price?: string;
  order?: number;
  active?: boolean;
}

const ALL_SERVICES: ServiceItem[] = [
  {
    id: 'pandits',
    category: 'purohit',
    title: 'वैदिक पंडित जी बुकिंग',
    subtitle: 'Vedic Purohits & Karmakand',
    desc: 'विवाह, गृह प्रवेश, सत्यनारायण कथा, रुद्राभिषेक व 16 संस्कारों हेतु वेदपाठी विद्वान ब्राह्मण।',
    href: '/pandits',
    img: '/home/pandit.jpg',
    imgPosition: 'object-[center_15%]',
    emoji: '🔱',
    popular: '🔥 सर्वाधिक लोकप्रिय',
    features: ['सत्यापित पुरोहित', 'घर पर / ऑनलाइन', '16 संस्कार'],
    ctaText: 'पंडित जी चुनें',
    stats: '6+ वैदिक पुरोहित',
    rating: '4.9★',
    price: '₹ 501 से शुरू',
  },
  {
    id: 'katha',
    category: 'purohit',
    title: 'श्री कथा व्यास व प्रवचन',
    subtitle: 'Katha Vyas & Pravachan',
    desc: 'श्री रामकथा, श्रीमद्भागवत महापुराण व शिवकथा के विद्वान व्यास पीठ द्वारा अमृत वर्षा।',
    href: '/katha-vachaks',
    img: '/home/kathavachak.webp',
    imgPosition: 'object-top',
    emoji: '📖',
    popular: '⭐ पूज्य व्यास पीठ',
    features: ['विद्वान व्यास पीठ', 'मधुर संकीर्तन', 'समस्त भारत'],
    ctaText: 'कथा व्यास देखें',
    stats: '5+ कथा व्यास',
    rating: '5.0★',
    price: '₹ 1,100 से शुरू',
  },
  {
    id: 'jaap',
    category: 'satsang',
    title: 'डिजिटल राम नाम बैंक',
    subtitle: 'Akhand Ram Naam Bank',
    desc: 'कलियुग में केवल नाम ही उद्धार का आधार है। लिखित राम नाम संकीर्तन करें और मालाएं संचित करें।',
    href: '/#jaap',
    img: '/ramji.jpg',
    imgPosition: 'object-[center_15%]',
    emoji: '📿',
    popular: '🏆 #1 महा-साधना',
    features: ['108 मणियों की माला', 'अखंड महा-बैंक', 'पुण्य संचय'],
    ctaText: 'लिखित जाप करें',
    stats: '1.42+ करोड़ नाम',
    rating: '4.9★',
    price: 'निःशुल्क साधना',
  },
  {
    id: 'mandirs',
    category: 'darshan',
    title: 'पावन मंदिर दर्शन व मार्गदर्शिका',
    subtitle: 'Sacred Temples & Darshan Guide',
    desc: 'अयोध्या धाम, काशी विश्वनाथ सहित देश के पवित्र तीर्थों का इतिहास, आरती समय व दर्शन नियम।',
    href: '/mandirs',
    img: '/images/Ayodhya Ramji Photo.webp',
    imgPosition: 'object-center',
    emoji: '🛕',
    popular: '🚩 पावन तीर्थ धाम',
    features: ['आरती का समय', 'इतिहास व महत्ता', 'तीर्थ मार्गदर्शिका'],
    ctaText: 'मंदिर दर्शन देखें',
    stats: 'पावन तीर्थ',
    rating: '4.9★',
    price: 'दर्शन मार्गदर्शिका',
  },
  /*
  {
    id: 'samagri',
    category: 'samagri',
    title: 'शुद्ध वैदिक पूजन सामग्री',
    subtitle: 'Pure Vedic Puja Samagri Store',
    desc: 'हवन सामग्री, अक्षत, रोली, धूप, दीप, गंगाजल व शुद्ध गौ-घृत — 100% सात्विक और प्राण-प्रतिष्ठित।',
    href: '/store',
    img: '/images/aboutImg1.webp',
    imgPosition: 'object-[center_15%]',
    emoji: '🪔',
    popular: '🌿 शुद्ध एवं प्रामाणिक',
    features: ['100% शुद्ध व सात्विक', 'प्रामाणिक स्रोत', 'होम डिलीवरी'],
    ctaText: 'सामग्री ऑर्डर करें',
    stats: 'वैदिक सामग्री',
    rating: '4.8★',
    price: '₹ 251 से शुरू',
  },
  */
  {
    id: 'astrology',
    category: 'astrology',
    title: 'वैदिक ज्योतिष & कुंडली',
    subtitle: 'Vedic Astrology & Tarot',
    desc: 'जन्मकुंडली, ग्रह गोचर, दोष निवारण व प्रामाणिक ज्योतिष मार्गदर्शन।',
    href: '/astrology',
    img: '/images/hero-mobile-ramji.webp',
    imgPosition: 'object-[center_15%]',
    emoji: '🔮',
    popular: '✨ प्रामाणिक मार्गदर्शन',
    features: ['कुंडली मिलान', 'दोष निवारण', 'रत्न व उपाय'],
    ctaText: 'परामर्श लें',
    stats: 'ज्योतिष परामर्श',
    rating: '4.9★',
    price: 'परामर्श उपलब्ध',
  },
  {
    id: 'community',
    category: 'satsang',
    title: 'राम भक्त परिवार व फोरम',
    subtitle: 'Devotee Satsang Community',
    desc: 'देश-विदेश के हजारों रामभक्तों के साथ आध्यात्मिक विचार-विमर्श, प्रश्नोत्तरी व सत्संग।',
    href: '/community',
    img: '/images/aboutImg1.webp',
    imgPosition: 'object-[center_15%]',
    emoji: '🤝',
    popular: '💬 भक्त सत्संग मंच',
    features: ['सत्संग व विचार', 'धार्मिक प्रश्नोत्तरी', 'भक्त मंडल'],
    ctaText: 'सत्संग से जुड़ें',
    stats: '178+ पंजीकृत भक्त',
    rating: '4.9★',
    price: 'भक्त समुदाय',
  },
];

function getTodaySeedChaupais(): ChaupaiItem[] {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const len = SEED_CHAUPAIS.length;
  return [
    SEED_CHAUPAIS[(dayOfYear * 2) % len],
    SEED_CHAUPAIS[(dayOfYear * 2 + 1) % len],
    SEED_CHAUPAIS[(dayOfYear * 2 + 2) % len],
  ];
}

function formatIndianNumber(num: number): string {
  if (!num) return '0';
  return num.toLocaleString('en-IN');
}

function SectionHeading({ kicker, title, sub, align = 'center', action }: {
  kicker: string;
  title: string;
  sub?: string;
  align?: 'center' | 'left';
  action?: React.ReactNode;
}) {
  const centered = align === 'center';
  return (
    <div className={`mb-8 sm:mb-10 flex gap-3 ${centered ? 'flex-col items-center text-center' : 'flex-row items-end justify-between'}`}>
      <div className={centered ? 'flex flex-col items-center' : 'min-w-0'}>
        <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-orange-600 mb-2">
          <span className="text-sm">🪷</span>
          {kicker}
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-[#3D2A1E] leading-tight">
          {title}
        </h2>
        {sub && (
          <p className={`text-sm sm:text-base text-slate-600 mt-2 max-w-xl ${centered ? 'mx-auto' : ''}`}>{sub}</p>
        )}
        <span className={`block h-1 w-16 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 mt-4 ${centered ? 'mx-auto' : ''}`} />
      </div>
      {action}
    </div>
  );
}

// Fades sections in as they scroll into view
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// Golden diya embers drifting upward (fixed positions so server and client render the same)
const EMBERS = [
  { l: 6, s: 6, d: 9, delay: 0, drift: 30 }, { l: 14, s: 4, d: 11, delay: 2.5, drift: -20 },
  { l: 22, s: 5, d: 8, delay: 5, drift: 25 }, { l: 31, s: 3, d: 12, delay: 1.2, drift: -30 },
  { l: 39, s: 6, d: 10, delay: 6.5, drift: 15 }, { l: 47, s: 4, d: 9, delay: 3.4, drift: -15 },
  { l: 55, s: 5, d: 13, delay: 0.8, drift: 35 }, { l: 63, s: 3, d: 10, delay: 4.6, drift: -25 },
  { l: 71, s: 6, d: 11, delay: 7.2, drift: 20 }, { l: 79, s: 4, d: 9, delay: 2, drift: -35 },
  { l: 87, s: 5, d: 12, delay: 5.8, drift: 25 }, { l: 94, s: 3, d: 10, delay: 3.9, drift: -10 },
];

function Embers({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-[1] ${className}`} aria-hidden>
      {EMBERS.map((e, i) => (
        <span
          key={i}
          className="ember"
          style={{
            left: `${e.l}%`,
            width: e.s,
            height: e.s,
            animationDuration: `${e.d}s`,
            animationDelay: `${e.delay}s`,
            ['--drift' as string]: `${e.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

// Counts up from 0 the first time it scrolls into view, then follows live updates
function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);
  const started = useRef(false);
  const fromRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const run = () => {
      const from = fromRef.current;
      const t0 = performance.now();
      const dur = 1600;
      let raf = 0;
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const n = from + (value - from) * eased;
        fromRef.current = n;
        setShown(n);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    };
    if (started.current) return run();
    if (!('IntersectionObserver' in window)) { setShown(value); return; }
    let cancel: (() => void) | undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        started.current = true;
        io.disconnect();
        cancel = run();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancel?.(); };
  }, [value]);

  return <span ref={ref}>{format(shown)}</span>;
}

const PETALS = ['🌸', '🌺', '🌼', '🌸', '🌺', '🌼', '🌸', '🌺'];

function PetalShower() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal text-xl"
          style={{ left: `${6 + i * 11.5}%`, animationDelay: `${(i % 4) * 0.18}s` }}
        >
          {p}
        </span>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [pandit, setPandit] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [dailyChaupais, setDailyChaupais] = useState<ChaupaiItem[]>(getTodaySeedChaupais);
  const [activeChaupaiIdx, setActiveChaupaiIdx] = useState(0);
  const [services, setServices] = useState<ServiceItem[]>(ALL_SERVICES);
  const [showShalakaModal, setShowShalakaModal] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const safeNavigate = useJaapNavigate();
  useScrollReveal();

  // Services carousel (phones / narrow windows): arrows, dots and mouse drag
  const servicesRef = useRef<HTMLDivElement>(null);
  const [serviceIdx, setServiceIdx] = useState(0);
  const dragRef = useRef({ active: false, x: 0, left: 0, moved: false });

  const serviceStep = () => {
    const el = servicesRef.current;
    const card = el?.firstElementChild as HTMLElement | null;
    return card ? card.offsetWidth + 16 : (el?.clientWidth || 300) * 0.8;
  };
  const goToService = (i: number) => {
    servicesRef.current?.scrollTo({ left: i * serviceStep(), behavior: 'smooth' });
  };
  const onServicesScroll = () => {
    const el = servicesRef.current;
    if (el) setServiceIdx(Math.round(el.scrollLeft / serviceStep()));
  };
  const onServicesMouseDown = (e: React.MouseEvent) => {
    const el = servicesRef.current;
    if (!el) return;
    dragRef.current = { active: true, x: e.clientX, left: el.scrollLeft, moved: false };
    el.style.scrollSnapType = 'none';
  };
  const onServicesMouseMove = (e: React.MouseEvent) => {
    const el = servicesRef.current;
    const d = dragRef.current;
    if (!el || !d.active) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5) d.moved = true;
    el.scrollLeft = d.left - dx;
  };
  const endServicesDrag = () => {
    const el = servicesRef.current;
    if (!el || !dragRef.current.active) return;
    dragRef.current.active = false;
    el.style.scrollSnapType = '';
    goToService(Math.round(el.scrollLeft / serviceStep()));
  };

  useEffect(() => {
    if (!videoModalOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setVideoModalOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [videoModalOpen]);

  // Interactive Live Diya & Pushpa Arpan State
  const [diyaLit, setDiyaLit] = useState(false);
  const [diyaCount, setDiyaCount] = useState(1428);
  const [pushpaShower, setPushpaShower] = useState(false);

  // Subtle Ambient Dhun State (Default OFF)
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAmbient = () => {
    if (!ambientAudioRef.current) return;
    if (ambientPlaying) {
      ambientAudioRef.current.pause();
      setAmbientPlaying(false);
    } else {
      ambientAudioRef.current.volume = 0.3;
      ambientAudioRef.current.play().then(() => setAmbientPlaying(true)).catch(() => {});
    }
  };

  const handleLightDiya = () => {
    if (!diyaLit) {
      setDiyaLit(true);
      setDiyaCount(c => c + 1);
    }
  };

  const handleOfferPushpa = () => {
    setPushpaShower(true);
    setTimeout(() => setPushpaShower(false), 2500);
  };

  const [stats, setStats] = useState({
    totalRamNaam: 14210890,
    totalMalas: 131582,
    totalDevotees: 178,
    totalPandits: 6,
    totalMandirs: 1,
    totalKathaVachaks: 5,
  });

  const checkAuth = async () => {
    try {
      const userData = await authApi.getCurrentUser();
      if (userData) setUser(userData);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
    fetchLiveStats();
    fetchDailyInspirations();
    fetchServices();
  }, []);

  const fetchLiveStats = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
      const countsRes = await fetch(`${apiUrl}/api/live-counts`);
      const countsData = await countsRes.json();
      if (countsData.success && countsData.counts) {
        setStats({
          totalRamNaam: countsData.counts.totalRamNaam || 14210890,
          totalMalas: countsData.counts.totalMalas || 131582,
          totalDevotees: countsData.counts.totalUsers || 178,
          totalPandits: countsData.counts.totalPandits || 6,
          totalMandirs: countsData.counts.totalMandirs || 1,
          totalKathaVachaks: countsData.counts.totalKathaVachaks || 5,
        });
      }
    } catch {}
  };

  const fetchDailyInspirations = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
      const res = await fetch(`${apiUrl}/api/public/inspirations?limit=6`);
      const data = await res.json();
      if (data.success && Array.isArray(data.inspirations) && data.inspirations.length > 0) {
        const mapped = data.inspirations.map((item: any) => ({
          chaupai: item.chaupai || item.text || '',
          bhavarth: item.bhavarth || item.meaning || '',
          source: item.source || 'श्री रामचरितमानस',
        })).filter((item: ChaupaiItem) => item.chaupai && item.bhavarth);
        if (mapped.length > 0) setDailyChaupais(mapped);
      }
    } catch {}
  };

  const fetchServices = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
      const res = await fetch(`${apiUrl}/api/public/services`);
      const data = await res.json();
      if (data.success && Array.isArray(data.services) && data.services.length > 0) {
        const cleaned = data.services.map((s: ServiceItem) => {
          if (s.img === '/images/aboutImg3.webp' || s.id === 'blogs' || s.category === 'blogs') {
            return { ...s, img: '/images/gallery-1.webp' };
          }
          return s;
        });
        setServices(cleaned);
      }
    } catch {}
  };

  const crore = stats.totalRamNaam >= 10000000
    ? `${(stats.totalRamNaam / 10000000).toFixed(1)} Cr+`
    : `${formatIndianNumber(stats.totalRamNaam)}`;

  const currentChaupai = dailyChaupais[activeChaupaiIdx % dailyChaupais.length] || dailyChaupais[0];

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-slate-800 overflow-x-hidden selection:bg-amber-100 selection:text-amber-900 pb-16 md:pb-0 relative font-sans">
      <Navbar showAuthButtons={true} />

      {/* Hidden Ambient Dhun Audio Element */}
      <audio ref={ambientAudioRef} src="/audios/haridhun.mp3" loop preload="none" />

      {/* Diya Flame Flicker Keyframe Style */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes diyaFlicker {
          0%, 100% { transform: scale(1) translateY(0); opacity: 1; filter: drop-shadow(0 -2px 6px rgba(245, 158, 11, 0.9)); }
          30% { transform: scale(0.94, 1.05) translateY(-1px); opacity: 0.88; filter: drop-shadow(0 -3px 8px rgba(245, 158, 11, 0.7)); }
          60% { transform: scale(1.05, 0.96) translateY(0); opacity: 0.96; filter: drop-shadow(0 -2px 7px rgba(245, 158, 11, 0.85)); }
          85% { transform: scale(0.98, 1.02) translateY(-0.5px); opacity: 0.92; filter: drop-shadow(0 -2px 5px rgba(245, 158, 11, 0.75)); }
        }
        .diya-flame {
          animation: diyaFlicker 2s infinite ease-in-out;
        }
      `}} />

      {/* ================= 1. HERO — Ayodhya panorama with Prabhu Shri Ram ================= */}
      <section className="relative w-full overflow-hidden bg-[#FFF3E2] mt-14 sm:mt-16">
        {/* Desktop panorama */}
        <div className="hidden md:block absolute inset-0 z-0">
          <Image
            src="/images/hero-ayodhya-ramji-hd.webp"
            alt="अयोध्या धाम में प्रभु श्री राम"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[62%_center] hero-kenburns"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFF6EA] via-[#FFF6EA]/85 lg:via-[#FFF6EA]/65 to-transparent to-[60%]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#FFF6EA]/90 to-transparent" />
        </div>

        {/* Mobile portrait */}
        <div className="md:hidden relative h-[360px] sm:h-[440px]">
          <Image
            src="/images/hero-mobile-ramji.webp"
            alt="प्रभु श्री राम"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_18%]"
          />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FFF3E2] via-[#FFF3E2]/70 to-transparent" />
          {pushpaShower && <PetalShower />}
        </div>

        {pushpaShower && <div className="hidden md:block"><PetalShower /></div>}
        <Embers />

        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl relative z-10 -mt-20 md:mt-0 md:min-h-[580px] lg:min-h-[640px] pb-20 md:pb-36 md:pt-16 lg:pt-20">
          <div className="grid md:grid-cols-12 gap-6 w-full">
            {/* Title, tagline, CTAs */}
            <div className="md:col-span-7 lg:col-span-6 flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="relative">
                {/* Calligraphy swirl flourishes */}
                <svg viewBox="0 0 120 120" className="absolute -left-6 sm:-left-10 top-[38%] w-14 sm:w-20 text-orange-600/80 hidden sm:block" fill="none" aria-hidden>
                  <path d="M110 20 C 60 5, 10 30, 18 70 C 24 100, 70 104, 72 78 C 74 58, 46 56, 44 72" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                </svg>
                <span className="block text-[60px] sm:text-[84px] lg:text-[104px] font-display hero-title text-saffron-foil drop-shadow-[0_2px_0_rgba(255,255,255,0.7)] hero-in">
                  जय श्री
                </span>
                <span className="block text-[68px] sm:text-[96px] lg:text-[124px] font-display hero-title hero-title-2 text-saffron-foil drop-shadow-[0_2px_0_rgba(255,255,255,0.7)] hero-in d1">
                  राम नाम
                </span>
              </h1>

              <svg viewBox="0 0 420 40" className="hero-in d2 w-64 sm:w-96 -mt-2 text-orange-600/80 mx-auto md:mx-0" fill="none" aria-hidden>
                <path d="M4 26 C 90 40, 200 2, 300 18 C 350 26, 380 30, 414 8 C 404 24, 392 30, 376 30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <p className="hero-in d2 mt-2 text-xl sm:text-[26px] font-medium text-[#3D2A1E] tracking-wide">
                Chant <span className="text-orange-500">•</span> Connect <span className="text-orange-500">•</span> Grow <span className="text-orange-500">•</span> Serve
              </p>
              <p className="hero-in d3 mt-4 text-slate-700 text-sm sm:text-[17px] leading-relaxed max-w-md">
                Experience the power of Shri Ram Naam. Join a global community for devotion, knowledge and positive living.
              </p>

              <div className="hero-in d4 flex flex-wrap items-center justify-center md:justify-start gap-3 mt-7">
                <button
                  type="button"
                  onClick={() => safeNavigate('/#jaap')}
                  className="group px-6 py-3 rounded-full btn-shine bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm shadow-divine hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Start Ram Naam Sadhna</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(true)}
                  className="px-5 py-3 rounded-full bg-white/90 hover:bg-white text-slate-800 font-bold text-sm border border-orange-300 shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center">
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                  </span>
                  <span>Watch Video</span>
                </button>
              </div>

              {/* Seva actions: Deep-daan, Pushpa Arpan, Mandir Dhun */}
              <div className="hero-in d5 flex flex-wrap items-center justify-center md:justify-start gap-2 mt-5">
                <button
                  type="button"
                  onClick={handleLightDiya}
                  className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/70 backdrop-blur hover:bg-white border border-[#D4AF37]/50 text-[#581404] cursor-pointer active:scale-95"
                >
                  <span className={diyaLit ? 'diya-flame inline-block' : ''}>🪔</span> {diyaLit ? 'दीप अर्पित 🙏' : 'दीप जलाएं'}
                </button>
                <button
                  type="button"
                  onClick={handleOfferPushpa}
                  className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/70 backdrop-blur hover:bg-white border border-[#D4AF37]/50 text-[#581404] cursor-pointer active:scale-95"
                >
                  🌸 पुष्प अर्पण
                </button>
                <button
                  type="button"
                  onClick={toggleAmbient}
                  title="पावन मंदिर धुन (Ambient Music)"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/70 backdrop-blur hover:bg-white border border-[#D4AF37]/50 text-[#581404] cursor-pointer active:scale-95"
                >
                  {ambientPlaying ? <Volume2 className="w-3.5 h-3.5 text-orange-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
                  मंदिर धुन
                </button>
              </div>
              <p className="hero-in d5 text-[11px] text-slate-500 mt-2">✨ आज {diyaCount.toLocaleString('en-IN')}+ भक्तों ने दीप प्रज्वलित किया</p>
            </div>

            {/* Tulsidas quote card floating in the sky */}
            <div className="hidden md:block md:col-span-5 lg:col-span-6 relative hero-in d3">
              <div className="float-soft absolute top-0 right-[36%] lg:right-[44%] w-[250px] lg:w-[280px] p-5 lg:p-6 rounded-3xl bg-white/30 backdrop-blur-md border border-white/60 shadow-lg">
                <p className="font-serif text-[17px] lg:text-xl leading-relaxed text-[#3D2A1E]">
                  <span className="text-orange-600 text-2xl leading-none">“</span>रामनाम मनुष्य को शांति, शक्ति और सही मार्ग दिखाता है<span className="text-orange-600 text-2xl leading-none">”</span>
                </p>
                <p className="text-sm text-[#5C3A21] mt-2 text-right">– संत तुलसीदास</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. SIX FEATURE CARDS (overlap the hero) ================= */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl -mt-10 md:-mt-24 relative z-20">
        <div className="reveal stagger grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            { icon: 'om', t: 'Ram Naam Jap Counter', s: 'Count & Stay Connected', go: () => safeNavigate('/#jaap') },
            { icon: Music, t: 'Daily Bhajan', s: 'Audio, Chalisa & Lyrics', go: () => safeNavigate('/glory') },
            { icon: Calendar, t: 'Panchang', s: 'Tithi, Vrat & Muhurat', go: () => safeNavigate('/#panchang') },
            { icon: BookOpen, t: 'Spiritual Knowledge', s: 'Articles, Stories, Teachings', go: () => safeNavigate('/blogs') },
            { icon: Users, t: 'Community', s: 'Join Devotees Worldwide', go: () => safeNavigate('/community') },
            { icon: HandHeart, t: 'Pandit Booking', s: 'Puja, Katha & Sanskar', go: () => safeNavigate('/pandits') },
          ].map(({ icon: Icon, t, s, go }) => (
            <button
              key={t}
              type="button"
              onClick={go}
              className="group flex flex-col items-center text-center px-3 py-5 sm:py-6 rounded-2xl bg-white border border-orange-100 shadow-lg shadow-orange-900/5 hover:shadow-divine hover:-translate-y-1 hover:border-orange-300 cursor-pointer"
            >
              <span className="w-16 h-16 rounded-full bg-gradient-to-b from-orange-50 to-orange-100/80 border border-orange-100 flex items-center justify-center mb-3 group-hover:from-orange-500 group-hover:to-orange-600 transition-colors">
                {Icon === 'om'
                  ? <span className="icon-pop text-4xl leading-none font-serif text-orange-600 group-hover:text-white transition-colors">ॐ</span>
                  : <Icon className="icon-pop w-8 h-8 text-orange-600 group-hover:text-white transition-colors" strokeWidth={1.6} />}
              </span>
              <span className="text-[15px] font-bold text-slate-900 leading-snug">{t}</span>
              <span className="text-[11px] text-slate-500 mt-1 leading-snug">{s}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ================= 3. STATS BAND with Ayodhya panorama ================= */}
      <section className="relative mt-10 sm:mt-12 overflow-hidden bg-gradient-to-r from-[#FFE9CF] via-[#FFF4E6] to-[#FFF4E6] border-y border-orange-100">
        <div className="absolute inset-y-0 left-0 w-full md:w-[42%] overflow-hidden pointer-events-none">
          <Image
            src="/images/hero-clean-bg.webp"
            alt=""
            fill
            sizes="(max-width:768px) 100vw, 42vw"
            className="object-cover object-[0%_60%] scale-[1.9] origin-left opacity-40 md:opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFF4E6]/40 to-[#FFF4E6]" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl relative">
          <div className="reveal stagger md:ml-[34%] grid grid-cols-2 md:grid-cols-4 gap-y-8 py-10 sm:py-12 md:divide-x divide-orange-200 text-center">
            {[
              { icon: <span className="text-4xl leading-none font-serif">ॐ</span>, value: stats.totalRamNaam, format: (n: number) => n >= 10000000 ? `${(n / 10000000).toFixed(1)} Cr+` : `${formatIndianNumber(Math.round(n))}+`, label: 'Ram Naam Japa' },
              { icon: <Users className="w-9 h-9" strokeWidth={1.5} />, value: stats.totalDevotees, format: (n: number) => `${formatIndianNumber(Math.round(n))}+`, label: 'Happy Devotees' },
              { icon: <Sparkles className="w-9 h-9" strokeWidth={1.5} />, value: stats.totalMalas, format: (n: number) => `${formatIndianNumber(Math.round(n))}+`, label: 'Completed Malas' },
              { icon: <FileText className="w-9 h-9" strokeWidth={1.5} />, value: 108, format: (n: number) => `${Math.round(n)}+`, label: 'Spiritual Articles' },
            ].map(({ icon, value, format, label }) => (
              <div key={label} className="flex flex-col items-center px-2">
                <span className="text-orange-600 h-10 flex items-center">{icon}</span>
                <p className="mt-2 text-3xl sm:text-4xl font-black text-orange-600 tabular-nums"><CountUp value={value} format={format} /></p>
                <p className="text-sm text-slate-600 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 4. AKHAND JAAP MALA COUNTER ================= */}
      <section
        id="jaap"
        className="relative overflow-hidden scroll-mt-14 py-14 sm:py-20 lg:pt-5 lg:pb-12 bg-gradient-to-b from-[#FFFCF7] via-[#FFF1DE] to-[#FFFCF7]"
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_30%,rgba(251,146,60,0.18)_0%,transparent_55%)]" />
        <span className="absolute -left-10 top-24 text-[260px] leading-none font-serif text-orange-500/[0.06] select-none pointer-events-none hidden md:block">ॐ</span>
        <span className="absolute -right-6 bottom-10 text-[220px] leading-none font-serif text-orange-500/[0.06] select-none pointer-events-none hidden md:block">राम</span>
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl relative z-10">
          <LiveAkhandJaapTicker />
          <div className="mt-4">
            <NaamJapSection user={user} onSaveSuccess={checkAuth} />
          </div>
        </div>
      </section>

      {/* ================= 5. EXPLORE DIVINE CONTENT ================= */}
      <section className="py-14 sm:py-20 bg-[#FFFCF7]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl">
          <div className="reveal grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Featured video */}
            <button
              type="button"
              onClick={() => setVideoModalOpen(true)}
              className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-xl cursor-pointer group min-h-[280px] sm:min-h-[320px] flex flex-col justify-end p-6 sm:p-8 text-left"
            >
              <Image
                src="/images/hero-clean-bg.webp"
                alt="श्री राम नाम शक्ति"
                fill
                sizes="(max-width:1024px) 100vw, 40vw"
                className="object-cover object-[12%_center] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
              <span className="absolute top-1/2 right-[18%] -translate-y-1/2 w-16 h-16 rounded-full bg-white/95 text-orange-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Play className="w-7 h-7 fill-current ml-1" />
              </span>
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-orange-600 text-white text-[11px] font-bold mb-3">
                  Featured Video
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-white">श्री राम नाम शक्ति</h3>
                <p className="text-sm text-white/85 mt-1 max-w-[240px]">Experience the divine energy of Shri Ram Naam.</p>
                <span className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-600 text-white font-bold text-sm shadow-md">
                  Watch Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </button>

            {/* Content cards */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex items-end justify-between mb-4">
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#3D2A1E]">Explore Divine Content</h2>
                <Link href="/blogs" className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="reveal stagger grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 flex-1">
                {[
                  { title: 'Bhajans', sub: 'Soulful Ram Bhajans', img: '/ramji.jpg', href: '/glory' },
                  { title: 'Aarti', sub: 'Daily Aarti & Chalisa', img: '/hanumanji.jpg', href: '/glory' },
                  { title: 'Katha', sub: 'Ramayan & Stories', img: '/home/kathavachak.webp', href: '/katha-vachaks' },
                  { title: 'Quotes', sub: 'Inspirational Quotes', img: '/images/gallery-1.webp', href: '/blogs' },
                ].map(item => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group rounded-2xl overflow-hidden bg-white border border-orange-100 shadow-md shadow-orange-900/5 hover:shadow-divine hover:-translate-y-1 flex flex-col"
                  >
                    <div className="relative aspect-[4/3.4] overflow-hidden bg-amber-50">
                      <Image src={item.img} alt={item.title} fill sizes="(max-width:640px) 50vw, 15vw" className="object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-3 sm:p-4 text-center">
                      <p className="text-base font-serif font-bold text-slate-900">{item.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.sub}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. DAILY CHAUPAI — Bhojpatra scroll + WhatsApp share ================= */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl">
          <SectionHeading
            kicker="Daily Chaupai"
            title="आज की पावन चौपाई"
            sub="श्री रामचरितमानस से प्रतिदिन एक अमृत वचन — भावार्थ सहित"
          />

          <div className="reveal grid md:grid-cols-12 rounded-3xl overflow-hidden border border-orange-200 shadow-xl shadow-orange-900/5 bg-[#FFF8EE]">
            {/* Darshan panel */}
            <div className="relative md:col-span-4 min-h-[220px] md:min-h-full">
              <Image
                src="/images/hero-mobile-ramji.webp"
                alt="प्रभु श्री राम"
                fill
                sizes="(max-width:768px) 100vw, 33vw"
                className="object-cover object-[center_15%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/50 via-transparent to-transparent md:from-transparent md:via-transparent md:to-[#FFF8EE]/30" />
              <span className="absolute bottom-4 left-4 md:bottom-6 md:left-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-[11px] font-bold text-orange-700 shadow-sm">
                📜 श्री रामचरितमानस
              </span>
            </div>

            {/* Scroll text */}
            <div className="relative md:col-span-8 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-[radial-gradient(ellipse_at_top_right,#FFE9C7_0%,transparent_60%)]">
              <span className="absolute top-4 right-6 text-[110px] leading-none font-serif text-orange-500/10 select-none pointer-events-none">“</span>

              <p className="text-xl sm:text-2xl lg:text-[28px] font-serif font-bold text-[#5A1A06] leading-relaxed">
                {currentChaupai.chaupai}
              </p>

              <div className="mt-5 pl-4 border-l-4 border-orange-400">
                <p className="text-[11px] font-bold uppercase tracking-widest text-orange-600 mb-1">सरल भावार्थ</p>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{currentChaupai.bhavarth}</p>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const shareText = `🚩 *जय श्री राम* 🚩\n\n📜 *आज की पावन चौपाई*\n${currentChaupai.chaupai}\n\n✨ *भावार्थ:* ${currentChaupai.bhavarth}\n\n🙏 प्रतिदिन पावन नाम संकीर्तन व दर्शन हेतु जुड़ें:\n${typeof window !== 'undefined' ? window.location.origin : 'https://ramjikisena.com'}`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  📲 WhatsApp पर शेयर करें
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChaupaiIdx(idx => (idx + 1) % dailyChaupais.length)}
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-orange-50 text-orange-700 border border-orange-300 font-bold text-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  अगली चौपाई <ArrowRight className="w-4 h-4" />
                </button>
                <span className="ml-auto flex items-center gap-1.5" aria-label="चौपाई क्रम">
                  {dailyChaupais.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`चौपाई ${i + 1}`}
                      onClick={() => setActiveChaupaiIdx(i)}
                      className={`h-2 rounded-full cursor-pointer transition-all ${i === activeChaupaiIdx % dailyChaupais.length ? 'w-6 bg-orange-500' : 'w-2 bg-orange-200 hover:bg-orange-300'}`}
                    />
                  ))}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-4">स्रोत: {currentChaupai.source || 'श्री रामचरितमानस'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 7. DAILY PANCHANG & SHUBH MUHURAT ================= */}
      <section id="panchang" className="py-14 sm:py-20 bg-[#FFF6EA] border-y border-orange-100 relative overflow-hidden scroll-mt-16">
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.07] select-none">
          <svg viewBox="0 0 400 400" className="w-[520px] h-[520px] stroke-orange-800" fill="none" strokeWidth="1.2">
            <circle cx="200" cy="200" r="180" />
            <circle cx="200" cy="200" r="150" />
            <circle cx="200" cy="200" r="120" />
            <circle cx="200" cy="200" r="90" />
            <circle cx="200" cy="200" r="60" />
            <polygon points="200,20 230,120 330,70 270,160 380,200 270,240 330,330 230,280 200,380 170,280 70,330 130,240 20,200 130,160 70,70 170,120" />
          </svg>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl relative z-10">
          <SectionHeading
            kicker="Panchang"
            title="शुभ समय जानें, शुभ कार्य करें"
            sub="तिथि, नक्षत्र, राहुकाल और शुभ समय — हर दिन अपडेट"
          />
          <div className="reveal">
            <DailyPanchang />
          </div>
        </div>
      </section>

      {/* ================= 8. POPULAR SERVICES ================= */}
      <section id="services" className="py-14 sm:py-20 bg-[#FFFCF7]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl">
          <SectionHeading
            align="left"
            kicker="Popular Services"
            title="लोकप्रिय सेवाएं"
            sub="प्रमाणित पंडित बुकिंग, कथा व्यास, पावन मंदिर दर्शन एवं सत्संग"
            action={
              <Link href="/pandits" className="shrink-0 text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                सभी सेवाएं देखें <ArrowRight className="w-4 h-4" />
              </Link>
            }
          />

          <div className="relative">
          <button
            type="button"
            aria-label="पिछली सेवा"
            onClick={() => goToService(Math.max(0, serviceIdx - 1))}
            disabled={serviceIdx === 0}
            className="sm:hidden absolute left-0 top-[34%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 border border-orange-200 shadow-lg text-orange-600 flex items-center justify-center cursor-pointer active:scale-90 disabled:opacity-0 transition-opacity"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
          <button
            type="button"
            aria-label="अगली सेवा"
            onClick={() => goToService(Math.min(Math.min(services.length, 6) - 1, serviceIdx + 1))}
            disabled={serviceIdx >= Math.min(services.length, 6) - 1}
            className="sm:hidden absolute right-0 top-[34%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-orange-600 shadow-lg text-white flex items-center justify-center cursor-pointer active:scale-90 disabled:opacity-0 transition-opacity"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div
            ref={servicesRef}
            onScroll={onServicesScroll}
            onMouseDown={onServicesMouseDown}
            onMouseMove={onServicesMouseMove}
            onMouseUp={endServicesDrag}
            onMouseLeave={endServicesDrag}
            onClickCapture={e => { if (dragRef.current.moved) { e.preventDefault(); e.stopPropagation(); dragRef.current.moved = false; } }}
            onDragStart={e => e.preventDefault()}
            className="reveal stagger cursor-grab active:cursor-grabbing sm:cursor-auto select-none sm:select-auto flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
            {services.slice(0, 6).map((service) => (
              <Link
                key={service.id || service._id}
                href={service.href}
                className="group shrink-0 w-[82%] sm:w-auto snap-center rounded-3xl overflow-hidden bg-white border border-orange-100 shadow-md shadow-orange-900/5 hover:shadow-divine hover:-translate-y-1 flex flex-col"
              >
                <div className="relative h-44 sm:h-48 overflow-hidden bg-amber-50">
                  <Image
                    src={service.img}
                    alt={service.title}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    className={`object-cover ${service.imgPosition || 'object-top'} group-hover:scale-105 transition-transform duration-700`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  {service.popular && (
                    <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/95 text-orange-700 shadow-sm">
                      {service.popular}
                    </span>
                  )}
                  {service.rating && (
                    <span className="absolute top-3 right-3 text-[11px] font-bold px-2 py-1 rounded-full bg-black/60 text-amber-300 backdrop-blur">
                      {service.rating}
                    </span>
                  )}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-serif font-bold text-white leading-snug line-clamp-1">{service.title}</h3>
                    <p className="text-[11px] text-white/80 line-clamp-1">{service.subtitle}</p>
                  </div>
                </div>
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{service.desc}</p>
                  {service.features && service.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {service.features.slice(0, 3).map(f => (
                        <span key={f} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-100">✓ {f}</span>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto pt-4 flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-orange-600">{service.price || 'सेवा उपलब्ध'}</span>
                    <span className="px-4 py-2 rounded-full bg-orange-50 group-hover:bg-orange-600 text-orange-700 group-hover:text-white font-bold text-xs flex items-center gap-1 transition-colors">
                      {service.ctaText || 'विवरण देखें'} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          </div>

          {/* Dots (phones only) */}
          <div className="sm:hidden flex items-center justify-center gap-1.5 mt-4">
            {services.slice(0, 6).map((s, i) => (
              <button
                key={s.id || s._id || i}
                type="button"
                aria-label={`सेवा ${i + 1}`}
                onClick={() => goToService(i)}
                className={`h-2 rounded-full cursor-pointer transition-all ${i === serviceIdx ? 'w-6 bg-orange-500' : 'w-2 bg-orange-200'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= 9. JOIN THE RAM NAAM MOVEMENT ================= */}
      <section className="py-10 sm:py-14 bg-[#FFFCF7]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl">
          <div className="reveal relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFE7CC] via-[#FFF1E0] to-[#FFE2C2] border border-orange-200 px-6 py-10 sm:py-14 text-center">
            <div className="absolute inset-y-0 right-0 w-1/2 md:w-[38%] pointer-events-none">
              <Image
                src="/images/hero-clean-bg.webp"
                alt=""
                fill
                sizes="40vw"
                className="object-cover object-[0%_55%] scale-[1.9] origin-left opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFF1E0] via-[#FFF1E0]/60 to-transparent" />
            </div>
            <div className="absolute inset-y-0 left-0 w-1/3 pointer-events-none opacity-[0.07] flex items-center justify-start pl-8 text-[180px] font-serif text-orange-700 select-none">ॐ</div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#3D2A1E]">Join the Ram Naam Movement</h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl mx-auto">
                Be a part of a global community spreading positivity, devotion and good deeds.
              </p>
              <button
                type="button"
                onClick={() => safeNavigate('/community')}
                className="group mt-6 inline-flex items-center gap-2 px-8 py-3 rounded-full btn-shine bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm shadow-divine cursor-pointer active:scale-95"
              >
                Join Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 10. OUR KEY FEATURES ================= */}
      <section className="py-12 sm:py-16 bg-[#FFFCF7]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl">
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#3D2A1E] mb-8 sm:mb-10 text-center md:text-left">Our Key Features</h2>
          <div className="reveal stagger grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-8">
            {[
              { icon: Bell, t: 'Daily Notifications', d: 'Get daily bhajan, quotes & panchang' },
              { icon: Timer, t: 'Personal Jap Counter', d: 'Track your chanting progress' },
              { icon: Calendar, t: 'Events & Satsang', d: 'Join online & offline events' },
              { icon: HelpCircle, t: 'Ask Questions', d: 'Connect with experts' },
              { icon: FileText, t: 'E-Books & Downloads', d: 'Ramayan, Chalisa, Stotra & More' },
              { icon: HandHeart, t: 'Seva & Donation', d: 'Support spiritual initiatives' },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="group flex flex-col items-center text-center">
                <Icon className="icon-pop w-10 h-10 text-orange-600 mb-3" strokeWidth={1.5} />
                <p className="text-sm font-bold text-slate-900">{t}</p>
                <p className="text-xs text-slate-500 mt-1 max-w-[150px]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 11. MOBILE APP SHOWCASE ================= */}
      <section className="relative overflow-hidden py-16 sm:py-20 text-white">
        <Image
          src="/images/hero-clean-bg.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 backdrop-blur-[3px] bg-gradient-to-b from-[#7A3410]/80 via-[#9A4A12]/65 to-[#5A2208]/85" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-5xl relative z-10 flex flex-col items-center gap-12">
          <div className="text-center">
            <h2 className="text-3xl sm:text-5xl font-serif font-black leading-tight">Jai Shri Ram Naam<br />Mobile App</h2>
            <p className="text-amber-100/90 mt-3 text-base sm:text-lg">Take devotion with you, always.</p>
            <div className="mt-7 flex flex-wrap gap-3 justify-center">
              {[
                { top: 'COMING SOON ON', name: 'Google Play', glyph: <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="#34A853" d="M3.6 1.8 13.8 12 3.6 22.2c-.4-.2-.6-.6-.6-1.1V2.9c0-.5.2-.9.6-1.1z" /><path fill="#FBBC04" d="m17.3 8.5-3.5 3.5 3.5 3.5 4-2.3c.9-.5.9-1.9 0-2.4l-4-2.3z" /><path fill="#4285F4" d="M3.6 22.2 13.8 12l3.5 3.5L5 22.4c-.5.3-1 .2-1.4-.2z" /><path fill="#EA4335" d="M3.6 1.8c.4-.4.9-.5 1.4-.2l12.3 6.9-3.5 3.5L3.6 1.8z" /></svg> },
                { top: 'COMING SOON ON', name: 'App Store', glyph: <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M16.4 1.4c0 1.1-.4 2.2-1.2 3-.9.9-2 1.4-3.2 1.3-.1-1.1.4-2.3 1.2-3.1.9-.9 2.1-1.4 3.2-1.2zM20.5 17.2c-.5 1.3-.8 1.8-1.5 3-1 1.6-2.4 3.5-4.1 3.5-1.5 0-1.9-1-4-1s-2.5 1-4.1 1c-1.7 0-3.1-1.8-4-3.3C.1 16-.4 10.9 1.4 8.2c1.3-1.9 3.3-3 5.2-3 1.9 0 3.1 1 4.7 1 1.5 0 2.5-1 4.7-1 1.7 0 3.5.9 4.7 2.5-4.2 2.3-3.5 8.2.8 9.5z" /></svg> },
              ].map(b => (
                <div key={b.name} className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/80 border border-white/30 select-none">
                  {b.glyph}
                  <span className="text-left">
                    <span className="block text-[9px] tracking-wider text-white/70">{b.top}</span>
                    <span className="block text-lg font-semibold leading-tight">{b.name}</span>
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-amber-100/70 mt-3">तब तक वेबसाइट पर ही राम नाम जप, भजन और पंचांग का आनंद लें 🙏</p>
          </div>

          {/* Two phone mockups */}
          <div className="flex justify-center items-end gap-4 sm:gap-6">
            <div className="float-soft"><div className="w-[170px] sm:w-[210px] rounded-[34px] bg-slate-900 p-2 shadow-2xl rotate-[-4deg]">
              <div className="rounded-[28px] overflow-hidden bg-[#FFF8EE] text-slate-800 h-[350px] sm:h-[420px] flex flex-col">
                <div className="px-3 pt-4 pb-2 flex items-center gap-2">
                  <span className="relative w-6 h-6 rounded-md overflow-hidden"><Image src="/images/ramjikisena_logo.webp" alt="" fill sizes="24px" className="object-cover" /></span>
                  <span className="text-[10px] font-bold text-orange-700 leading-tight">Jai Shri<br />Ram Naam</span>
                </div>
                <p className="px-3 text-xs font-bold">Jai Shri Ram 🙏</p>
                <p className="px-3 text-[9px] text-slate-500">Continue your daily sadhna</p>
                <div className="mx-3 mt-2 rounded-2xl bg-gradient-to-b from-orange-400 to-orange-600 text-white text-center py-4">
                  <p className="text-4xl font-black leading-none">108</p>
                  <p className="text-[9px] mt-1 opacity-90">Ram Naam Today</p>
                  <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-white/25 text-[9px]">Tap to Chant</span>
                </div>
                <div className="grid grid-cols-4 gap-1 px-3 mt-3 text-center">
                  {[Music, Flame, Calendar, BookOpen].map((I, i) => (
                    <span key={i} className="flex flex-col items-center"><span className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center"><I className="w-3.5 h-3.5" /></span></span>
                  ))}
                </div>
                <div className="mx-3 mt-3 p-2 rounded-xl bg-white border border-orange-100">
                  <p className="text-[9px] font-bold">Today&apos;s Thought</p>
                  <p className="text-[9px] text-slate-600 mt-0.5">“राम नाम ही जीवन की सच्ची शांति है”</p>
                </div>
              </div>
            </div></div>
            <div className="float-soft-late mb-6"><div className="w-[160px] sm:w-[200px] rounded-[34px] bg-slate-900 p-2 shadow-2xl rotate-[4deg]">
              <div className="rounded-[28px] overflow-hidden bg-white text-slate-800 h-[330px] sm:h-[400px] flex flex-col">
                <p className="px-3 pt-4 pb-2 text-xs font-bold">Bhajans</p>
                <div className="px-3 flex gap-1 mb-2">
                  {['All', 'Aarti', 'Chalisa'].map((c, i) => (
                    <span key={c} className={`px-2 py-0.5 rounded-full text-[8px] ${i === 0 ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-700'}`}>{c}</span>
                  ))}
                </div>
                {[
                  { t: 'Shri Ram Jai Ram', d: '5:23', img: '/ramji.jpg' },
                  { t: 'Shri Ram Aarti', d: '7:12', img: '/images/hero-mobile-ramji.webp' },
                  { t: 'Ram Dhun', d: '6:05', img: '/images/Ayodhya Ramji Photo.webp' },
                  { t: 'Hanuman Chalisa', d: '11:20', img: '/hanumanji.jpg' },
                  { t: 'Shri Ram Stuti', d: '4:42', img: '/images/gallery-1.webp' },
                ].map(s => (
                  <div key={s.t} className="flex items-center gap-2 px-3 py-1.5">
                    <span className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0"><Image src={s.img} alt="" fill sizes="36px" className="object-cover object-top" /></span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[9px] font-bold truncate">{s.t}</span>
                      <span className="block text-[8px] text-slate-400">{s.d}</span>
                    </span>
                    <Heart className="w-3 h-3 text-slate-400" />
                  </div>
                ))}
              </div>
            </div></div>
          </div>
        </div>
      </section>

      {/* ================= 12. DAILY INSPIRATION IN YOUR POCKET ================= */}
      <section className="py-14 sm:py-20 bg-[#FFFCF7]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-6xl">
        <div className="reveal grid md:grid-cols-2 gap-10 items-center rounded-[32px] bg-gradient-to-br from-[#FFE9D2] via-[#FFF3E6] to-[#FFE2C4] border border-orange-200 shadow-xl shadow-orange-900/5 p-8 sm:p-12 overflow-hidden">
          <div className="flex justify-center order-2 md:order-1">
            <div className="w-[220px] sm:w-[250px] rounded-[38px] bg-slate-900 p-2 shadow-2xl -rotate-6">
              <div className="relative rounded-[32px] overflow-hidden h-[440px] sm:h-[500px]">
                <Image src="/images/hero-mobile-ramji.webp" alt="श्री राम" fill sizes="250px" className="object-cover object-top" />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white text-center">
                  <p className="font-serif font-bold text-sm">जय श्री राम</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-orange-600 leading-tight">Daily Inspiration<br />in Your Pocket</h2>
            <ul className="mt-6 space-y-3.5 inline-block text-left">
              {[
                { icon: Music, t: 'Daily Bhajan & Aarti', href: '/glory' },
                { icon: Calendar, t: 'Panchang & Muhurat', href: '/#panchang' },
                { icon: BookOpen, t: 'Spiritual Articles', href: '/blogs' },
                { icon: Timer, t: 'Jap Counter', href: '/#jaap' },
                { icon: Users, t: 'Community & Events', href: '/community' },
                { icon: FileText, t: 'E-Books & Resources', href: '/blogs' },
                { icon: HandHeart, t: 'Seva & Donation', href: '/pandits' },
              ].map(({ icon: Icon, t, href }) => (
                <li key={t}>
                  <button type="button" onClick={() => safeNavigate(href)} className="group flex items-center gap-3 cursor-pointer">
                    <span className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-xs group-hover:bg-orange-600">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-[15px] font-semibold text-slate-800 group-hover:text-orange-700">{t}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      </section>

      {/* ================= 13. FINAL CTA ================= */}
      <section className="relative overflow-hidden min-h-[340px] sm:min-h-[400px] flex items-center">
        <Image
          src="/images/hero-clean-bg.webp"
          alt="सरयू तट, अयोध्या"
          fill
          sizes="100vw"
          className="object-cover object-[30%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2A0C03]/90 via-[#3B1205]/55 to-transparent" />
        <Embers />
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl relative z-10 flex justify-center md:justify-start">
          <div className="reveal max-w-md text-center md:text-left text-white py-12">
            <p className="text-2xl sm:text-4xl font-serif font-bold leading-snug drop-shadow">
              “राम नाम से जीवन में नई ऊर्जा और सही दिशा मिलती है”
            </p>
            <button
              type="button"
              onClick={() => safeNavigate('/#jaap')}
              className="group mt-7 inline-flex items-center gap-2 px-7 py-3.5 rounded-full btn-shine bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm shadow-divine cursor-pointer active:scale-95"
            >
              Start Your Journey Today <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />

      {/* ================= RAM SHALAKA MODAL ================= */}
      <RamShalakaModal
        isOpen={showShalakaModal}
        onClose={() => setShowShalakaModal(false)}
      />

      {/* ================= YOUTUBE VIDEO MODAL ================= */}
      {videoModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setVideoModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-[#D4AF37]/40"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close video"
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/40 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <iframe
              src="https://www.youtube.com/embed/Pj3hXU0w198?autoplay=1"
              title="Shri Ram Video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
