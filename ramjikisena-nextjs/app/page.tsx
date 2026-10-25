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
  Sparkles, Flame, Users, ArrowRight, Star, Calendar, Play, BookOpen,
  Headphones, Share2, Heart, Bell, HelpCircle, FileText, X, Volume2, VolumeX
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

function LotusDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-4 opacity-70 select-none pointer-events-none">
      <span className="h-[1px] w-20 sm:w-32 bg-gradient-to-r from-transparent to-[#D4AF37]" />
      <span className="text-base sm:text-lg text-[#D4AF37]">🪷</span>
      <span className="h-[1px] w-20 sm:w-32 bg-gradient-to-l from-transparent to-[#D4AF37]" />
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

      {/* ================= COMPACT FESTIVE ANNOUNCEMENT BANNER ================= */}
      <div className="mt-14 sm:mt-16 bg-[#581404] text-white py-2 px-4 text-center text-xs border-b border-[#D4AF37]/40 flex items-center justify-center gap-2 relative z-30">
        <span className="text-[#D4AF37] text-xs">✦</span>
        <span className="font-serif font-bold tracking-wide text-[#FBE192]">पावन कार्तिक मास पर्व:</span>
        <span className="text-amber-100/90 hidden sm:inline text-xs">प्रतिदिन दीपदान एवं 108 राम नाम जप का अनंत पुण्य प्राप्त करें</span>
        <button
          type="button"
          onClick={() => safeNavigate('/#jaap')}
          className="text-[11px] font-bold text-[#F3CF7A] hover:text-white underline underline-offset-2 ml-1 cursor-pointer transition-colors"
        >
          साधना करें →
        </button>
        <span className="text-[#D4AF37] text-xs">✦</span>
      </div>

      {/* ================= 1. HERO SECTION WITH ICONIC MANDIR ARCH (MEHRAB) ================= */}
      <section className="relative w-full bg-[#FFFDF8] pt-10 sm:pt-16 pb-14 sm:pb-20 border-b border-amber-200/50 overflow-hidden">
        {/* Subtle Ayodhya Mandir Backdrop (12% Opacity for Temple Depth) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Image
            src="/images/Ayodhya Ramji Photo.webp"
            alt="Ayodhya Mandir"
            fill
            unoptimized
            className="object-cover object-center opacity-[0.12] filter saturate-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF8]/85 via-[#FFFDF8]/92 to-[#FFFDF8]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* Left Column: Regal Maroon & Gold Typography */}
            <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left">
              
              {/* Kicker + Ambient Dhun Pill */}
              <div className="flex flex-wrap items-center gap-2.5 mb-3 justify-center md:justify-start">
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#8C2206] uppercase">
                  <span className="text-[#D4AF37]">✦</span>
                  <span>Chant • Connect • Grow • Serve</span>
                  <span className="text-[#D4AF37]">✦</span>
                </div>

                {/* Subtle Ambient Dhun Toggle (Default OFF) */}
                <button
                  type="button"
                  onClick={toggleAmbient}
                  title="पावन मंदिर धुन (Ambient Music)"
                  className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white hover:bg-orange-50 border border-[#D4AF37]/50 text-[11px] font-bold text-[#581404] shadow-2xs transition-all cursor-pointer active:scale-95"
                >
                  {ambientPlaying ? <Volume2 className="w-3 h-3 text-orange-600" /> : <VolumeX className="w-3 h-3 text-slate-400" />}
                  <span>मंदिर धुन: {ambientPlaying ? 'चालू' : 'बंद'}</span>
                </button>
              </div>

              {/* H1 in Deep Maroon */}
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-serif font-black text-[#581404] leading-[1.14] tracking-tight mb-4">
                Jai Shri Ram Naam
              </h1>

              {/* Mobile Only: Sacred Mandir Arch (Mehrab) Frame */}
              <div className="md:hidden my-5 w-52 sm:w-60 mx-auto">
                <div className="flex justify-center -mb-2 relative z-20">
                  <div className="px-3.5 py-0.5 rounded-full bg-[#581404] border border-[#D4AF37] text-[#D4AF37] text-[10px] font-serif font-black tracking-wider shadow-sm">
                    ✦ श्री राम लला दर्शन ✦
                  </div>
                </div>
                <div className="relative aspect-[4/5.3] rounded-t-[130px] rounded-b-2xl overflow-hidden border-2 border-[#D4AF37] shadow-xl bg-[#FFF8EE] p-1">
                  <div className="relative w-full h-full rounded-t-[124px] rounded-b-xl overflow-hidden border border-[#D4AF37]/50 bg-white">
                    <Image
                      src="/images/hero-mobile-ramji.webp"
                      alt="श्री राम लला दर्शन"
                      fill
                      priority
                      unoptimized
                      className="object-cover object-center"
                    />

                    {/* Flower Shower Overlay */}
                    {pushpaShower && (
                      <div className="absolute inset-0 pointer-events-none flex flex-wrap justify-around items-start p-2 text-xl animate-bounce">
                        <span>🌸</span><span>🌺</span><span>🌼</span><span>🌸</span>
                      </div>
                    )}

                    {/* Diya Flame at Base */}
                    {diyaLit && (
                      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
                        <div className="w-4 h-6 rounded-full bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 diya-flame" />
                        <span className="text-lg -mt-1">🪔</span>
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 py-2.5 bg-gradient-to-t from-[#3D0C02] via-[#581404]/80 to-transparent text-center">
                      <span className="text-xs font-serif font-black text-[#D4AF37]">अयोध्या धाम • जय श्री राम</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Diya & Pushpa Buttons */}
                <div className="flex items-center justify-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleLightDiya}
                    className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFF8EE] border border-[#D4AF37]/60 text-[#581404] hover:bg-orange-50 shadow-2xs cursor-pointer active:scale-95"
                  >
                    🪔 {diyaLit ? 'दीप अर्पित 🙏' : 'दीप जलाएं'}
                  </button>
                  <button
                    type="button"
                    onClick={handleOfferPushpa}
                    className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFF8EE] border border-[#D4AF37]/60 text-[#581404] hover:bg-orange-50 shadow-2xs cursor-pointer active:scale-95"
                  >
                    🌸 पुष्प अर्पण
                  </button>
                </div>
              </div>

              {/* Tulsidas Quote Box */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#FFF8EE] border border-[#D4AF37]/50 text-[#581404] font-serif text-sm sm:text-[15px] font-semibold shadow-2xs mb-4 max-w-xl">
                “रामनाम मनुष्य को शांति, शक्ति और सही मार्ग दिखाता है” <span className="text-[#8C2206] font-sans text-xs font-normal ml-1">— संत तुलसीदास</span>
              </div>

              {/* Subtitle */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
                Let the divine name of Lord Ram fill your life with peace, positivity and eternal happiness.
              </p>

              {/* CTAs: Saffron ONLY on action buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 mb-5">
                <button
                  type="button"
                  onClick={() => safeNavigate('/#jaap')}
                  className="px-6 py-3 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Start Chanting Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setVideoModalOpen(true)}
                  className="px-5 py-3 rounded-full bg-white hover:bg-[#FFF8EE] text-[#581404] font-bold text-sm border border-[#D4AF37]/60 shadow-2xs hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span className="w-5 h-5 rounded-full bg-orange-50 text-orange-600 border border-orange-200/60 flex items-center justify-center">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </span>
                  <span>Watch Video</span>
                </button>
              </div>

              {/* Heart Note */}
              <p className="text-xs text-[#581404]/80 font-medium flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-orange-600 fill-orange-600" />
                <span>Together for a Better & More Devotional World</span>
              </p>
            </div>

            {/* Right Column (Desktop): Iconic Temple Mandir Arch (Mehrab) Framing Prabhu Shri Ram */}
            <div className="hidden md:flex md:col-span-5 justify-center relative">
              <div className="relative w-full max-w-[340px] lg:max-w-[370px]">
                
                {/* Temple Arch Crown (Crest) */}
                <div className="flex justify-center -mb-2.5 relative z-20">
                  <div className="px-4 py-1 rounded-full bg-[#581404] border border-[#D4AF37] text-[#D4AF37] text-[10px] font-serif font-black tracking-widest shadow-md flex items-center gap-1.5 uppercase">
                    <span>✦</span>
                    <span>श्री राम लला दर्शन</span>
                    <span>✦</span>
                  </div>
                </div>

                {/* Mandir Arch (Mehrab) Shaped Portrait Container */}
                <div className="relative aspect-[4/5.3] rounded-t-[145px] lg:rounded-t-[165px] rounded-b-2xl overflow-hidden border-2 border-[#D4AF37] shadow-xl bg-[#FFF8EE] p-1.5 group">
                  <div className="relative w-full h-full rounded-t-[136px] lg:rounded-t-[156px] rounded-b-xl overflow-hidden border border-[#D4AF37]/50 bg-white">
                    <Image
                      src="/images/hero-mobile-ramji.webp"
                      alt="प्रभु श्री राम लला - अयोध्या धाम"
                      fill
                      priority
                      unoptimized
                      className="object-cover object-center group-hover:scale-102 transition-transform duration-500"
                    />

                    {/* Flower Shower Animation */}
                    {pushpaShower && (
                      <div className="absolute inset-0 pointer-events-none flex flex-wrap justify-around items-start p-4 text-2xl animate-bounce z-20">
                        <span>🌸</span><span>🌺</span><span>🌼</span><span>🌸</span><span>🌺</span>
                      </div>
                    )}

                    {/* Diya Flame at Lotus Feet */}
                    {diyaLit && (
                      <div className="absolute bottom-11 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
                        <div className="w-5 h-7 rounded-full bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 diya-flame" />
                        <span className="text-xl -mt-1.5">🪔</span>
                      </div>
                    )}

                    {/* Bottom Golden Nameplate */}
                    <div className="absolute inset-x-0 bottom-0 py-3 bg-gradient-to-t from-[#3D0C02] via-[#581404]/85 to-transparent flex flex-col justify-end text-center px-4">
                      <span className="text-xs font-serif font-black text-[#D4AF37] tracking-wider">
                        अयोध्या धाम • जय श्री राम
                      </span>
                      <span className="text-[10px] text-amber-100/90 font-medium mt-0.5">
                        पावन विग्रह दर्शन
                      </span>
                    </div>
                  </div>
                </div>

                {/* 1-Click Interactive Diya & Pushpa Arpan Dock */}
                <div className="mt-3 flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-[#D4AF37]/50 shadow-xs">
                  <button
                    type="button"
                    onClick={handleLightDiya}
                    className="flex-1 py-1.5 px-2.5 rounded-full text-xs font-bold bg-[#FFF8EE] hover:bg-orange-50 text-[#581404] border border-[#D4AF37]/50 shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>🪔</span>
                    <span>{diyaLit ? 'दीप प्रज्वलित 🙏' : 'दीप जलाएं'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOfferPushpa}
                    className="flex-1 py-1.5 px-2.5 rounded-full text-xs font-bold bg-[#FFF8EE] hover:bg-orange-50 text-[#581404] border border-[#D4AF37]/50 shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>🌸</span>
                    <span>पुष्प अर्पण</span>
                  </button>
                </div>

                <p className="text-[10px] text-center text-slate-500 font-medium mt-1.5">
                  ✨ {diyaCount.toLocaleString('en-IN')}+ भक्तों ने आज पावन दीप प्रज्वलित किया
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 2. FLOATING QUICK ACTION DOCK (With Rich Devotional Images) ================= */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl -mt-6 sm:-mt-8 relative z-20">
        <div className="p-3 sm:p-4 rounded-2xl bg-white shadow-lg border border-[#D4AF37]/50">
          <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-amber-100 text-center">
            
            {/* 1. Listen & Chant */}
            <button
              type="button"
              onClick={() => safeNavigate('/#jaap')}
              className="p-3 hover:bg-[#FFF8EE] rounded-xl transition-all cursor-pointer flex flex-col items-center group"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-sm mb-1.5 group-hover:scale-105 transition-transform bg-amber-50">
                <Image
                  src="/hanumanji.jpg"
                  alt="Listen & Chant"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-black/20" />
                <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
                  <Headphones className="w-5 h-5 text-white" />
                </span>
              </div>
              <span className="text-xs font-bold text-slate-900 group-hover:text-orange-700 transition-colors">Listen & Chant</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Hanuman Chalisa, Ram Naam</span>
            </button>

            {/* 2. Read & Learn */}
            <button
              type="button"
              onClick={() => safeNavigate('/blogs')}
              className="p-3 hover:bg-[#FFF8EE] rounded-xl transition-all cursor-pointer flex flex-col items-center group"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-sm mb-1.5 group-hover:scale-105 transition-transform bg-amber-50">
                <Image
                  src="/images/gallery-1.webp"
                  alt="Read & Learn"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-black/20" />
                <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
                  <BookOpen className="w-5 h-5 text-white" />
                </span>
              </div>
              <span className="text-xs font-bold text-slate-900 group-hover:text-orange-700 transition-colors">Read & Learn</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Spiritual Stories & Quotes</span>
            </button>

            {/* 3. Join Events */}
            <button
              type="button"
              onClick={() => safeNavigate('/katha-vachaks')}
              className="p-3 hover:bg-[#FFF8EE] rounded-xl transition-all cursor-pointer flex flex-col items-center group"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-sm mb-1.5 group-hover:scale-105 transition-transform bg-amber-50">
                <Image
                  src="/home/kathavachak.webp"
                  alt="Join Events"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-black/20" />
                <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
                  <Calendar className="w-5 h-5 text-white" />
                </span>
              </div>
              <span className="text-xs font-bold text-slate-900 group-hover:text-orange-700 transition-colors">Join Events</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Katha, Bhajan & Satsang</span>
            </button>

            {/* 4. Devotional Community */}
            <button
              type="button"
              onClick={() => safeNavigate('/community')}
              className="p-3 hover:bg-[#FFF8EE] rounded-xl transition-all cursor-pointer flex flex-col items-center group"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-sm mb-1.5 group-hover:scale-105 transition-transform bg-amber-50">
                <Image
                  src="/home/Pradeep-Ji-Mishra.webp"
                  alt="Community"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-black/20" />
                <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
                  <Users className="w-5 h-5 text-white" />
                </span>
              </div>
              <span className="text-xs font-bold text-slate-900 group-hover:text-orange-700 transition-colors">Community</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Share Bhakti & Positivity</span>
            </button>

            {/* 5. Spread Bhakti */}
            <button
              type="button"
              onClick={() => setShowShalakaModal(true)}
              className="p-3 hover:bg-[#FFF8EE] rounded-xl transition-all cursor-pointer flex flex-col items-center col-span-2 md:col-span-1 group"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-sm mb-1.5 group-hover:scale-105 transition-transform bg-amber-50">
                <Image
                  src="/images/hero-mobile-ramji.webp"
                  alt="Spread Bhakti"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-black/20" />
                <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
                  <Share2 className="w-5 h-5 text-white" />
                </span>
              </div>
              <span className="text-xs font-bold text-slate-900 group-hover:text-orange-700 transition-colors">Spread Bhakti</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Ram Shalaka & Prerna</span>
            </button>

          </div>
        </div>
      </div>

      {/* ================= 3. STATS STRIP ================= */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl mt-6 sm:mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 sm:p-6 rounded-2xl bg-[#FFF8EE] border border-[#D4AF37]/40 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-serif font-black text-[#581404]">{crore}</p>
            <p className="text-xs font-medium text-slate-600 mt-0.5">Ram Naam Japa</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-serif font-black text-[#581404]">{formatIndianNumber(stats.totalMalas)}+</p>
            <p className="text-xs font-medium text-slate-600 mt-0.5">Completed Malas</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-serif font-black text-[#581404]">{formatIndianNumber(stats.totalDevotees)}+</p>
            <p className="text-xs font-medium text-slate-600 mt-0.5">Happy Devotees</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-serif font-black text-[#581404]">108+</p>
            <p className="text-xs font-medium text-slate-600 mt-0.5">Spiritual Articles & Katha</p>
          </div>
        </div>
      </div>

      <LotusDivider />

      {/* ================= 4. DAILY CHAUPAI BHOJPATRA SCROLL + WHATSAPP SHARE ================= */}
      <section className="py-12 sm:py-16 bg-[#FFFDF8]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="relative rounded-2xl bg-gradient-to-b from-[#FFFDF8] via-[#FFF9EE] to-[#FFF6E5] border-2 border-[#D4AF37]/60 shadow-md p-6 sm:p-8 overflow-hidden text-center">
            {/* Ornamental Gold Corner Icons */}
            <div className="absolute top-2.5 left-2.5 text-[#D4AF37] text-xs opacity-60">❖</div>
            <div className="absolute top-2.5 right-2.5 text-[#D4AF37] text-xs opacity-60">❖</div>
            <div className="absolute bottom-2.5 left-2.5 text-[#D4AF37] text-xs opacity-60">❖</div>
            <div className="absolute bottom-2.5 right-2.5 text-[#D4AF37] text-xs opacity-60">❖</div>

            {/* Header Tag */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#581404] text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-serif font-bold tracking-wider mb-4 shadow-2xs">
              <span>📜</span>
              <span>दैनिक पावन चौपाई • श्री रामचरितमानस</span>
            </div>

            {/* Sacred Chaupai Text */}
            <h3 className="text-lg sm:text-2xl font-serif font-black text-[#581404] leading-relaxed tracking-wide my-3">
              “{currentChaupai.chaupai}”
            </h3>

            {/* Bhavarth Box */}
            <div className="p-3 sm:p-4 rounded-xl bg-white/80 border border-[#D4AF37]/30 max-w-2xl mx-auto my-3 text-slate-700 text-xs sm:text-sm leading-relaxed">
              <span className="font-bold text-[#8C2206] block sm:inline mr-1">सरल भावार्थ:</span>
              <span>{currentChaupai.bhavarth}</span>
            </div>

            <p className="text-[11px] text-slate-500 font-medium mb-5">
              स्रोत: {currentChaupai.source || 'श्री रामचरितमानस'}
            </p>

            {/* Action Buttons: WhatsApp Share + Next */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const shareText = `🚩 *जय श्री राम* 🚩\n\n📜 *आज की पावन चौपाई*\n${currentChaupai.chaupai}\n\n✨ *भावार्थ:* ${currentChaupai.bhavarth}\n\n🙏 प्रतिदिन पावन नाम संकीर्तन व दर्शन हेतु जुड़ें:\n${typeof window !== 'undefined' ? window.location.origin : 'https://ramjikisena.com'}`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
                }}
                className="px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>📲 WhatsApp पर शेयर करें</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveChaupaiIdx(idx => (idx + 1) % dailyChaupais.length)}
                className="px-4 py-2.5 rounded-full bg-white hover:bg-orange-50 text-[#581404] border border-[#D4AF37]/60 font-bold text-xs sm:text-sm shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>अगली चौपाई ▶</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <LotusDivider />

      {/* ================= 5. DAILY PANCHANG & SHUBH MUHURAT (With Faint Mandala Watermark) ================= */}
      <section id="panchang" className="py-14 sm:py-18 bg-[#FFFDF8] relative overflow-hidden">
        {/* Subtle Sacred Mandala Background Watermark (6% Opacity) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.06] select-none">
          <svg viewBox="0 0 400 400" className="w-[450px] h-[450px] stroke-[#581404]" fill="none" strokeWidth="1.2">
            <circle cx="200" cy="200" r="180" />
            <circle cx="200" cy="200" r="150" />
            <circle cx="200" cy="200" r="120" />
            <circle cx="200" cy="200" r="90" />
            <circle cx="200" cy="200" r="60" />
            <polygon points="200,20 230,120 330,70 270,160 380,200 270,240 330,330 230,280 200,380 170,280 70,330 130,240 20,200 130,160 70,70 170,120" />
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <DailyPanchang />
        </div>
      </section>

      <LotusDivider />

      {/* ================= 6. AKHAND JAAP MALA COUNTER (Deep Maroon + Soft Diya Radiance) ================= */}
      <section
        id="jaap"
        className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#4A1003] via-[#350A01] to-[#4A1003] text-white border-t border-b border-[#D4AF37]/40 relative overflow-hidden scroll-mt-16"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 35%, rgba(245, 158, 11, 0.16) 0%, rgba(56, 11, 1, 0) 65%)',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <LiveAkhandJaapTicker />
          <div className="mt-4">
            <NaamJapSection user={user} onSaveSuccess={checkAuth} />
          </div>
        </div>
      </section>

      <LotusDivider />

      {/* ================= 7. EXPLORE OUR SPIRITUAL WORLD ================= */}
      <section className="py-14 sm:py-18 bg-[#FFFDF8]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#581404]">
              Explore Our Spiritual World
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl mx-auto">
              Inspire your life with sacred Katha, divine Chalisa, soul-stirring Bhajans and daily prayers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                title: 'Ram Katha & Spiritual Content',
                sub: 'Inspire Your Life',
                img: '/home/kathavachak.webp',
                href: '/katha-vachaks',
              },
              {
                title: 'Hanuman Chalisa',
                sub: 'Find Strength & Peace',
                img: '/hanumanji.jpg',
                href: '/glory',
              },
              {
                title: 'Bhajans & Aarti',
                sub: 'Feel the Devotion',
                img: '/images/gallery-1.webp',
                href: '/blogs',
              },
              {
                title: 'Daily Prayers & Panchang',
                sub: 'Start Your Day with Ram',
                img: '/images/Ayodhya Ramji Photo.webp',
                href: '/#panchang',
              },
            ].map((card, i) => (
              <Link
                key={i}
                href={card.href}
                className="group rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all bg-white flex flex-col justify-between"
              >
                <div className="relative h-36 sm:h-44 overflow-hidden bg-amber-50">
                  <Image
                    src={card.img}
                    alt={card.title}
                    fill
                    sizes="(max-width:768px) 50vw, 25vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-sm">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </span>
                </div>
                <div className="p-3.5 bg-white">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-700 transition-colors line-clamp-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {card.sub}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <LotusDivider />

      {/* ================= 8. EXPLORE DIVINE CONTENT ================= */}
      <section className="py-14 sm:py-18 bg-[#FFF8EE] border-t border-b border-amber-200/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#581404]">
                Explore Divine Content
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Immerse yourself in soulful Bhajans, Aarti, Katha and sacred teachings
              </p>
            </div>
            <Link
              href="/blogs"
              className="text-xs sm:text-sm font-bold text-orange-700 hover:text-orange-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            {/* Featured Left Card */}
            <button
              type="button"
              onClick={() => setVideoModalOpen(true)}
              className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group min-h-[220px] flex flex-col justify-end p-6 text-left"
            >
              <Image
                src="/images/Ayodhya Ramji Photo.webp"
                alt="Shri Ram Naam Shakti"
                fill
                className="object-cover object-top group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-orange-600 text-white text-[10px] font-bold uppercase tracking-wider mb-2">
                  Featured Video
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-black text-white mb-1">
                  श्री राम नाम शक्ति
                </h3>
                <p className="text-xs text-amber-100/90 mb-3">
                  Experience the divine energy of Shri Ram Naam in your daily life.
                </p>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-orange-800 font-bold text-xs shadow-sm">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Now</span>
                </span>
              </div>
            </button>

            {/* 4 Compact Cards Grid */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { title: 'Bhajans', sub: 'Soulful Ram Bhajans', img: '/images/gallery-1.webp', href: '/blogs' },
                { title: 'Aarti', sub: 'Daily Aarti & Chalisa', img: '/hanumanji.jpg', href: '/glory' },
                { title: 'Katha', sub: 'Ramayan & Stories', img: '/home/kathavachak.webp', href: '/katha-vachaks' },
                { title: 'Quotes', sub: 'Inspirational Quotes', img: '/ramji.jpg', href: '/community' },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="rounded-xl overflow-hidden bg-white border border-[#D4AF37]/40 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                >
                  <div className="relative h-28 overflow-hidden bg-amber-50">
                    <Image src={item.img} alt={item.title} fill className="object-cover object-top" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-3 text-center">
                    <p className="text-xs font-bold text-slate-800">{item.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{item.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LotusDivider />

      {/* ================= 9. POPULAR SERVICES ================= */}
      <section id="services" className="py-14 sm:py-18 bg-[#FFFDF8]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#581404]">
                लोकप्रिय सेवाएं (Popular Services)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                प्रमाणित पंडित बुकिंग, कथा व्यास, पावन मंदिर दर्शन एवं सत्संग
              </p>
            </div>
            <Link
              href="/pandits"
              className="text-xs sm:text-sm font-bold text-orange-700 hover:text-orange-800 flex items-center gap-1"
            >
              <span>सभी सेवाएं देखें</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {services.slice(0, 6).map((service) => (
              <Link
                key={service.id || service._id}
                href={service.href}
                className="group rounded-2xl overflow-hidden bg-white border border-[#D4AF37]/40 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-28 overflow-hidden bg-amber-50">
                    <Image
                      src={service.img}
                      alt={service.title}
                      fill
                      className={`object-cover ${service.imgPosition || 'object-top'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {service.rating && (
                      <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-amber-300">
                        {service.rating}
                      </span>
                    )}
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-orange-700 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-[11px] text-orange-700 font-semibold mt-1">
                      {service.price || 'सेवा उपलब्ध'}
                    </p>
                  </div>
                </div>
                <div className="p-3 pt-0">
                  <span className="w-full py-1.5 rounded-full bg-orange-50 group-hover:bg-orange-600 text-orange-700 group-hover:text-white font-bold text-xs transition-colors flex items-center justify-center">
                    {service.ctaText || 'विवरण देखें'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <LotusDivider />

      {/* ================= 10. OUR KEY FEATURES ================= */}
      <section className="py-14 sm:py-18 bg-[#FFF8EE] border-t border-amber-200/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#581404]">
              Our Key Features
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
              Everything you need for a peaceful, connected and spiritual life
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              { icon: Bell, t: 'Daily Notifications', d: 'Bhajan, quotes & panchang' },
              { icon: Sparkles, t: 'Personal Jap Counter', d: 'Track chanting progress' },
              { icon: Calendar, t: 'Events & Satsang', d: 'Join online & offline' },
              { icon: HelpCircle, t: 'Ask Questions', d: 'Connect with experts' },
              { icon: FileText, t: 'E-Books & Downloads', d: 'Ramayan, Chalisa, Stotra' },
              { icon: Heart, t: 'Seva & Donation', d: 'Support spiritual causes' },
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-[#D4AF37]/40 shadow-2xs text-center flex flex-col items-center"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-700 border border-orange-200/60 flex items-center justify-center mb-2.5">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-900">{item.t}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= 11. GRAND COMMUNITY BANNER (With Majestic Temple Imagery) ================= */}
      <section className="py-14 sm:py-18 bg-[#FFFDF8]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#4A1003] via-[#681704] to-[#3B0C02] text-white shadow-xl border-2 border-[#D4AF37]/60 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
            
            {/* Ayodhya Panoramic Background Image with subtle devotional glow */}
            <div className="absolute inset-0 pointer-events-none opacity-20 select-none">
              <Image
                src="/images/Ayodhya Ramji Photo.webp"
                alt="अयोध्या धाम"
                fill
                className="object-cover object-center"
              />
            </div>
            
            <div className="relative z-10 text-center md:text-left max-w-xl">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 text-[#FBE192] text-xs font-serif font-bold uppercase tracking-wider mb-3 border border-[#D4AF37]/40 shadow-xs">
                ✦ Join the Ram Naam Movement ✦
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-white leading-tight">
                Together, Let&apos;s Spread the Message of <br />
                <span className="text-[#FBE192]">&ldquo;Jai Shri Ram Naam&rdquo;</span>
              </h3>
              <p className="text-amber-100/90 text-xs sm:text-sm mt-3 leading-relaxed">
                Peace in Heart • Positivity in Life • Devotion for a Better Tomorrow
              </p>
            </div>

            <div className="relative z-10 shrink-0 flex flex-col sm:flex-row items-center gap-4">
              {/* Sacred Miniature Arch Frame */}
              <div className="relative w-20 h-24 rounded-t-full rounded-b-xl overflow-hidden border-2 border-[#D4AF37] shadow-lg bg-[#FFF8EE] hidden md:block">
                <Image
                  src="/images/hero-mobile-ramji.webp"
                  alt="श्री राम लला"
                  fill
                  className="object-cover object-center"
                />
              </div>

              <button
                type="button"
                onClick={() => safeNavigate('/community')}
                className="px-7 py-3.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95 flex items-center gap-2"
              >
                <span>Join Devotional Community</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
            <button
              type="button"
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
