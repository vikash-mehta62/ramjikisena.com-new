'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import NaamJapSection from '@/components/NaamJapSection';
import Footer from '@/components/Footer';
import DailyPanchang from '@/components/DailyPanchang';
import LiveAkhandJaapTicker from '@/components/LiveAkhandJaapTicker';
import VirtualDeepdaan from '@/components/VirtualDeepdaan';
import RamShalakaModal from '@/components/RamShalakaModal';
import { authApi, User } from '@/lib/auth';
import { useJaapNavigate } from '@/lib/useJaapNavigate';
import {
  Sparkles, Flame, Trophy, Crown, Share2, Heart, ShieldCheck, CheckCircle2,
  Compass, BookOpen, Users, ArrowRight, ChevronLeft, ChevronRight as ChevronRightIcon,
  Star, Award, Clock, MapPin, Calendar, Play, Volume2, RefreshCw, Church,
  Check, Smartphone, ExternalLink, X, Headphones, Music, Bell, Quote
} from 'lucide-react';

import { SEED_CHAUPAIS, ChaupaiItem } from '@/lib/seedInspirations';

export interface ServiceItem {
  _id?: string;
  id?: string;
  serviceId?: string;
  category: 'purohit' | 'satsang' | 'darshan' | 'samagri' | 'blogs';
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
  order?: number;
  active?: boolean;
}

const SERVICE_CATEGORIES = [
  { id: 'all', label: 'समस्त सेवाएं', icon: '🕉️' },
  { id: 'purohit', label: 'पुरोहित व कथा', icon: '🔱' },
  { id: 'satsang', label: 'संकीर्तन व बैंक', icon: '📿' },
  { id: 'darshan', label: 'तीर्थ व महिमा', icon: '🛕' },
  { id: 'samagri', label: 'पूजन सामग्री', icon: '🪔' },
  { id: 'blogs', label: 'धार्मिक ब्लॉग', icon: '📖' },
];

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
  },
  {
    id: 'jaap',
    category: 'satsang',
    title: 'डिजिटल राम नाम बैंक',
    subtitle: 'Akhand Ram Naam Bank',
    desc: 'कलियुग में केवल नाम ही उद्धार का आधार है। लिखित राम नाम संकीर्तन करें और मालाएं संचित करें।',
    href: '/#jaap',
    img: '/ramji.jpg',
    imgPosition: 'object-top',
    emoji: '📿',
    popular: '🏆 #1 महा-साधना',
    features: ['108 मणियों की माला', 'अखंड महा-बैंक', 'पुण्य संचय'],
    ctaText: 'लिखित जाप करें',
    stats: '1.42+ करोड़ नाम',
  },
  {
    id: 'mandirs',
    category: 'darshan',
    title: 'पावन मंदिर दर्शन व मार्गदर्शिका',
    subtitle: 'Sacred Temples & Darshan Guide',
    desc: 'अयोध्या धाम, काशी विश्वनाथ सहित देश के पवित्र तीर्थों का इतिहास, आरती समय व दर्शन नियम।',
    href: '/mandirs',
    img: '/images/Ayodhya Ramji Photo.webp',
    imgPosition: 'object-top',
    emoji: '🛕',
    popular: '🛕 पावन तीर्थ धाम',
    features: ['आरती का समय', 'इतिहास व महत्ता', 'तीर्थ मार्गदर्शिका'],
    ctaText: 'मंदिर दर्शन देखें',
    stats: 'पावन तीर्थ',
  },
  {
    id: 'samagri',
    category: 'samagri',
    title: 'शुद्ध वैदिक पूजन सामग्री',
    subtitle: 'Pure Vedic Puja Samagri Store',
    desc: 'हवन सामग्री, रुद्राक्ष माला, धूप-दीप, गंगाजल व समस्त वैदिक अनुष्ठानों की शुद्ध सामग्री।',
    href: '/samagri',
    img: '/home/pandit.jpg',
    imgPosition: 'object-[center_20%]',
    emoji: '🪔',
    popular: '📦 शुद्ध एवं प्रामाणिक',
    features: ['100% शुद्ध सामग्री', 'हवन व पूजा किट', 'घर तक डिलीवरी'],
    ctaText: 'सामग्री देखें',
    stats: 'वैदिक सामग्री',
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
  },
  {
    id: 'glory',
    category: 'darshan',
    title: 'श्री राम महिमा व अमृत कथा',
    subtitle: 'Glory of Shri Ram Naam',
    desc: 'राम नाम का आध्यात्मिक महत्व, संतों के अलौकिक अनुभव, मानस की चौपाइयां व गूढ़ रहस्य।',
    href: '/glory',
    img: '/hanumanji.jpg',
    imgPosition: 'object-top',
    emoji: '✨',
    popular: '✨ अमृत प्रसंग',
    features: ['अमृत चौपाइयां', 'संतों के अनुभव', 'आध्यात्मिक ज्ञान'],
    ctaText: 'महिमा पढ़ें',
    stats: 'पावन प्रसंग',
  },
  {
    id: 'blogs',
    category: 'blogs',
    title: 'धार्मिक ब्लॉग व सनातन विचार',
    subtitle: 'Spiritual Blogs & Sanatan Wisdom',
    desc: 'सनातन धर्म, वेद, उपनिषद, पर्व-त्योहारों का महत्व एवं भक्तों द्वारा लिखे गए प्रेरक आध्यात्मिक लेख।',
    href: '/blogs',
    img: '/images/aboutImg3.webp',
    imgPosition: 'object-top',
    emoji: '📝',
    popular: '📚 ज्ञान अमृत',
    features: ['धार्मिक लेख', 'भक्त अनुभव', 'पर्व महात्म्य'],
    ctaText: 'ब्लॉग पढ़ें',
    stats: 'आध्यात्मिक ज्ञान',
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
  ];
}

function formatIndianNumber(num: number): string {
  if (!num) return '0';
  return num.toLocaleString('en-IN');
}

export interface HeroSlide {
  _id?: string;
  title: string;
  subtitle?: string;
  tagline?: string;
  description?: string;
  badge?: string;
  image: string;
  mobileImage?: string;
  textAlignment?: 'left' | 'center' | 'right';
  textColor?: string;
  showText?: boolean;
  showButtons?: boolean;
  button1Text?: string;
  button1Link?: string;
  button2Text?: string;
  button2Link?: string;
  order?: number;
  isActive?: boolean;
}

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    title: 'Jai Shree Ram',
    subtitle: 'Naam is the True Power',
    tagline: 'Chant. Connect. Learn. Live with Bhagwan Ram.',
    description: 'Join millions of devotees and experience peace, positivity and happiness through Ram Naam in your daily life.',
    badge: '🚩 Jai Shree Ram — Naam is the True Power',
    image: '/images/hero-ayodhya-ramji-hd.webp',
    mobileImage: '/images/hero-ayodhya-ramji.webp',
    textAlignment: 'center',
    button1Text: 'Start Ram Naam Jaap',
    button1Link: '/#jaap',
    button2Text: 'Watch Video',
    button2Link: 'https://www.youtube.com/embed/Pj3hXU0w198',
    order: 1,
    isActive: true
  },
  {
    title: 'श्री राम नाम बैंक',
    subtitle: 'अखंड नाम संकीर्तन',
    tagline: 'कलियुग केवल नाम अधारा। सुमिरि सुमिरि नर उतरहिं पारा॥',
    description: 'पवित्र राम नाम जप करें और जीवन के समस्त पापों व चिंताओं से मुक्ति पाकर आनंद की अनुभूति करें।',
    badge: '📿 राम नाम ही सब है',
    image: '/ramji.jpg',
    button1Text: 'लिखित जाप करें',
    button1Link: '/#jaap',
    button2Text: 'वैदिक सेवाएं देखें',
    button2Link: '/#services',
    order: 2,
    isActive: true
  },
  {
    title: 'राम जी की सेना',
    subtitle: 'विश्व व्यापी भक्ति आंदोलन',
    tagline: 'जन जन तक प्रभु श्री राम की कृपा',
    description: 'लाखों भक्तों के साथ जुड़ें और सनातन धर्म के प्रचार-प्रसार में अपना योगदान दें।',
    badge: '🚩 मर्यादा पुरुषोत्तम प्रभु',
    image: '/images/Ayodhya Ramji Photo.webp',
    button1Text: 'सेना से जुड़ें',
    button1Link: '/community',
    button2Text: 'मंदिर दर्शन',
    button2Link: '/mandirs',
    order: 3,
    isActive: true
  }
];

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [pandit, setPandit] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [dailyChaupais, setDailyChaupais] = useState<ChaupaiItem[]>(getTodaySeedChaupais);
  const [activeChaupaiIdx, setActiveChaupaiIdx] = useState(0);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [services, setServices] = useState<ServiceItem[]>(ALL_SERVICES);
  const [serviceCategory, setServiceCategory] = useState<string>('all');
  const [showShalakaModal, setShowShalakaModal] = useState(false);
  const safeNavigate = useJaapNavigate();

  // Dynamic Hero Slides Carousel State
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isSlidePaused, setIsSlidePaused] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState('https://www.youtube.com/embed/Pj3hXU0w198');

  const filteredServices = (serviceCategory === 'all'
    ? services
    : services.filter(s => s.category === serviceCategory)
  ).filter(s => s.active !== false);

  // Live Counts State (Baseline backed with instant fallback)
  const [stats, setStats] = useState({
    totalRamNaam: 14210890,
    totalMalas: 131582,
    totalDevotees: 178,
    totalPandits: 6,
    totalMandirs: 1,
    totalKathaVachaks: 5,
  });

  const [topDevotees, setTopDevotees] = useState<any[]>([
    { name: 'संतोष दुबे जी', city: 'Bhopal', totalCount: 3655603, mala: 33848 },
    { name: 'चन्द्र शेखर जी', city: 'Bhopal', totalCount: 3033333, mala: 28086 },
    { name: 'लालजी शर्मा जी', city: 'Bhopal', totalCount: 1372087, mala: 12704 },
    { name: 'प्रवीण शर्मा जी', city: 'Bhopal', totalCount: 1339211, mala: 12400 },
    { name: 'शिव मोहन पटेल जी', city: 'Varanasi', totalCount: 911810, mala: 8442 },
  ]);

  const checkAuth = async () => {
    let currentUser: User | null = null;
    try {
      const userData = await authApi.getCurrentUser();
      if (userData) {
        currentUser = userData;
        setUser(userData);
      }
    } catch {
      // Ignore network error
    }

    try {
      if (typeof window !== 'undefined') {
        const pTok = localStorage.getItem('panditToken');
        const pData = localStorage.getItem('pandit');
        if (pTok && pData) {
          const parsedPandit = JSON.parse(pData);
          setPandit(parsedPandit);
          if (!currentUser) {
            setUser({
              _id: parsedPandit._id,
              username: parsedPandit.username || '',
              name: parsedPandit.name || 'पंडित जी',
              city: parsedPandit.city || parsedPandit.location?.city || '',
              contact: parsedPandit.phone || parsedPandit.contact?.phone || '',
              rank: 1,
              currCount: parsedPandit.currCount || 0,
              totalCount: parsedPandit.totalCount || 0,
              mala: parsedPandit.mala || 0,
              role: 'pandit',
              dailyCounts: parsedPandit.dailyCounts || []
            });
          }
        } else {
          setPandit(null);
          if (!currentUser) {
            setUser(null);
          }
        }
      }
    } catch {
      setPandit(null);
      if (!currentUser) setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Ensure fresh visit starts at top unless specific anchor requested
    if (typeof window !== 'undefined') {
      if (!window.location.hash) {
        window.scrollTo(0, 0);
      } else if (window.location.hash === '#jaap') {
        const el = document.getElementById('jaap');
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
        }
      }
    }

    checkAuth();
    fetchLiveStats();
    fetchDailyInspirations();
    fetchServices();
    fetchHeroSlides();

    const onAuthEvent = () => checkAuth();
    window.addEventListener('storage', onAuthEvent);
    window.addEventListener('auth-change', onAuthEvent);
    return () => {
      window.removeEventListener('storage', onAuthEvent);
      window.removeEventListener('auth-change', onAuthEvent);
    };
  }, []);

  // Hero Slider Auto-rotation (6 seconds per slide, pauses on hover)
  useEffect(() => {
    if (heroSlides.length <= 1 || isSlidePaused) return;
    const timer = setInterval(() => {
      setCurrentSlideIdx((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length, isSlidePaused]);

  const fetchHeroSlides = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
      const res = await fetch(`${apiUrl}/api/public/hero-slides`);
      const data = await res.json();
      if (data.success && Array.isArray(data.slides) && data.slides.length > 0) {
        setHeroSlides(data.slides);
      }
    } catch (e) {
      // Gracefully uses DEFAULT_HERO_SLIDES
    }
  };

  const handleHeroButtonClick = (link?: string, text?: string) => {
    if (!link || link === '/#jaap') {
      safeNavigate('/#jaap');
      return;
    }
    const lowerLink = (link || '').toLowerCase();
    const lowerText = (text || '').toLowerCase();
    
    // Check if it's a video action
    if (
      lowerLink.includes('youtube.com') ||
      lowerLink.includes('youtu.be') ||
      lowerText.includes('video') ||
      lowerText.includes('वीडियो') ||
      link === 'video'
    ) {
      let embedUrl = link;
      if (embedUrl.includes('watch?v=')) {
        embedUrl = embedUrl.replace('watch?v=', 'embed/').split('&')[0];
      } else if (embedUrl.includes('youtu.be/')) {
        const vid = embedUrl.split('youtu.be/')[1]?.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${vid}`;
      }
      if (!embedUrl || embedUrl === 'video' || !embedUrl.startsWith('http')) {
        embedUrl = 'https://www.youtube.com/embed/Pj3hXU0w198'; // Peaceful Ram Naam Stuti
      }
      setActiveVideoUrl(embedUrl);
      setVideoModalOpen(true);
      return;
    }

    if (link.startsWith('http')) {
      window.open(link, '_blank');
    } else {
      safeNavigate(link);
    }
  };

  const fetchLiveStats = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
      const res = await fetch(`${apiUrl}/api/public/home-stats`);
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
        if (Array.isArray(data.topDevotees) && data.topDevotees.length > 0) {
          setTopDevotees(data.topDevotees);
        }
      }
    } catch (e) {
      // Gracefully uses baseline stats
    }
  };

  const fetchDailyInspirations = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
      const res = await fetch(`${apiUrl}/api/public/daily-inspirations`);
      const data = await res.json();
      if (data.success && Array.isArray(data.daily) && data.daily.length > 0) {
        setDailyChaupais(data.daily);
      }
    } catch (e) {
      // Fallback already pre-loaded
    }
  };

  const fetchServices = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
      const res = await fetch(`${apiUrl}/api/public/services`);
      const data = await res.json();
      if (data.success && Array.isArray(data.services) && data.services.length > 0) {
        setServices(data.services);
      }
    } catch (e) {
      // Gracefully uses ALL_SERVICES fallback
    }
  };

  const handleShareChaupai = (chaupai: string, bhavarth: string, source: string) => {
    const text = `🚩 *जय श्री राम* 🚩\n\n"${chaupai}"\n\n*भावार्थ:* ${bhavarth}\n*स्रोत:* ${source}\n\n🙏 आज ही अपना दैनिक राम नाम जप शुरू करें:\nhttps://ramjikisena.com`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  const currentSlide = heroSlides[currentSlideIdx] || DEFAULT_HERO_SLIDES[0];
  const showText = currentSlide.showText !== false;
  const showButtons = currentSlide.showButtons !== false;
  const crore = stats.totalRamNaam >= 10000000 ? `${(stats.totalRamNaam / 10000000).toFixed(1)} Cr+` : `${formatIndianNumber(stats.totalRamNaam)}`;

  const DOCK = [
    { label: 'राम नाम जप', sub: '108 मनके महा-जप', href: '/#jaap', Icon: Sparkles, tone: 'bg-orange-100 text-orange-600' },
    { label: 'पंडित बुक करें', sub: 'पूजा, हवन व संस्कार', href: '/pandits', Icon: Flame, tone: 'bg-amber-100 text-amber-600' },
    { label: 'ज्योतिषी परामर्श', sub: 'कुंडली व मार्गदर्शन', href: '/astrology', Icon: Compass, tone: 'bg-yellow-100 text-yellow-700' },
    { label: 'भजन व आरती', sub: 'अमृत संकीर्तन सुनें', href: '/#jaap', Icon: Music, tone: 'bg-rose-100 text-rose-600' },
    { label: 'कथा व्यास', sub: 'श्री रामकथा व सत्संग', href: '/katha-vachaks', Icon: BookOpen, tone: 'bg-purple-100 text-purple-600' },
    { label: 'भक्त सत्संग', sub: 'विश्वव्यापी रामभक्त', href: '/community', Icon: Users, tone: 'bg-sky-100 text-sky-600' },
  ];

  const STATS = [
    { Icon: Sparkles, value: crore, label: 'राम नाम जप' },
    { Icon: Users, value: `${formatIndianNumber(stats.totalDevotees)}+`, label: 'पंजीकृत भक्त' },
    { Icon: Flame, value: `${stats.totalPandits}+`, label: 'वैदिक पुरोहित' },
    { Icon: BookOpen, value: `${stats.totalKathaVachaks}+`, label: 'कथा व्यास' },
  ];

  const EXPLORE = [
    {
      badge: '▶ अमृत वर्षा',
      title: 'श्री रामकथा व अमृत प्रवचन',
      sub: 'पूज्य व्यास पीठ द्वारा मानस के गूढ़ रहस्यों और भक्ति की पावन अमृत धारा।',
      cta: 'कथा सुनें',
      img: '/home/kathavachak.webp',
      href: '/katha-vachaks',
    },
    {
      badge: '⚡ संकट मोचन',
      title: 'संकट मोचन हनुमान चालीसा',
      sub: 'नित्य हनुमान चालीसा व सुंदरकांड पाठ से हर भय, क्लेश व संकट से मुक्ति पाएं।',
      cta: 'पाठ करें',
      img: '/hanumanji.jpg',
      href: '/#jaap',
    },
    {
      badge: '🎵 अमृत संकीर्तन',
      title: 'मधुर भजन व दिव्य आरती',
      sub: 'प्रभु श्री राम की पावन आरती, स्तुति व मधुर संकीर्तन से मन में असीम शांति पाएं।',
      cta: 'संकीर्तन सुनें',
      img: '/images/Ayodhya Ramji Photo.webp',
      href: '/#jaap',
    },
    {
      badge: '📿 अखंड महा-जप',
      title: 'डिजिटल राम नाम महा-बैंक',
      sub: '108 मणियों की पवित्र माला फेरें, नाम लेखन करें और अक्षय पुण्य संचित करें।',
      cta: 'जाप शुरू करें',
      img: '/ramji.jpg',
      href: '/#jaap',
    },
  ];

  const FEATURES = [
    { Icon: Bell, t: 'दैनिक सूचनाएं', s: 'भजन, चौपाई व मुहूर्त' },
    { Icon: Sparkles, t: 'व्यक्तिगत जप काउंटर', s: 'अपनी साधना की प्रगति' },
    { Icon: Calendar, t: 'कथा व सत्संग', s: 'ऑनलाइन व ऑफलाइन' },
    { Icon: ShieldCheck, t: 'सत्यापित पुरोहित', s: 'विश्वसनीय बुकिंग' },
    { Icon: BookOpen, t: 'ज्ञान व लेख', s: 'रामायण, चालीसा, स्तोत्र' },
    { Icon: Heart, t: 'सेवा व सहयोग', s: 'आध्यात्मिक पहल' },
  ];

  const SectionTitle = ({ kicker, title, accent }: { kicker?: string; title: string; accent?: string }) => (
    <div className="text-center mb-6 sm:mb-8">
      {kicker && <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] font-black tracking-wide mb-2">{kicker}</span>}
      <div className="flex items-center justify-center gap-3 sm:gap-5">
        <span className="h-px w-8 sm:w-24 bg-gradient-to-r from-transparent to-orange-400" />
        <h2 className="text-xl sm:text-3xl font-serif font-black text-[#A52A0A]">
          {title} {accent && <span className="text-orange-600">{accent}</span>}
        </h2>
        <span className="h-px w-8 sm:w-24 bg-gradient-to-l from-transparent to-orange-400" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF9F1] text-slate-800 overflow-x-hidden selection:bg-orange-200 selection:text-orange-900 pb-16 md:pb-0">
      <Navbar showAuthButtons={true} />

      {/* ================= HERO ================= */}
      <section
        className="relative w-full overflow-hidden bg-[#FFF4E6]"
        onMouseEnter={() => setIsSlidePaused(true)}
        onMouseLeave={() => setIsSlidePaused(false)}
      >
        <div className="relative min-h-[480px] sm:min-h-[520px] lg:min-h-[580px] flex items-end md:items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <div className={currentSlide.mobileImage ? 'hidden md:block absolute inset-0' : 'absolute inset-0'}>
                <Image src={currentSlide.image || '/images/hero-clean-bg.webp'} alt={currentSlide.title || 'Shri Ram'} fill priority unoptimized sizes="100vw" className="object-cover object-[78%_top] md:object-[70%_top]" />
              </div>
              {currentSlide.mobileImage && (
                <div className="md:hidden absolute inset-0">
                  <Image src={currentSlide.mobileImage} alt={currentSlide.title || 'Shri Ram'} fill priority unoptimized sizes="100vw" className="object-cover object-top" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Readability gradients */}
          <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-[#FFF4E6] via-[#FFF4E6]/80 via-35% to-transparent to-65%" />
          <div className="absolute inset-0 md:hidden bg-gradient-to-t from-[#FFF4E6] via-[#FFF4E6]/85 via-40% to-transparent to-70%" />
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#FFF9F1] to-transparent" />

          {heroSlides.length > 1 && (
            <>
              <button onClick={() => setCurrentSlideIdx((p) => (p - 1 + heroSlides.length) % heroSlides.length)} aria-label="Previous Slide" className="hidden sm:flex absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-lg border border-orange-200/60 items-center justify-center backdrop-blur-md active:scale-90 transition-all cursor-pointer">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => setCurrentSlideIdx((p) => (p + 1) % heroSlides.length)} aria-label="Next Slide" className="hidden sm:flex absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-lg border border-orange-200/60 items-center justify-center backdrop-blur-md active:scale-90 transition-all cursor-pointer">
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="container mx-auto px-5 sm:px-8 lg:px-14 relative z-20 pt-16 pb-16 sm:pb-20">
            <div className="max-w-xl text-center md:text-left mx-auto md:mx-0">
              <AnimatePresence mode="wait">
                <motion.div key={currentSlideIdx} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45 }}>
                  {(pandit || user) && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-white/90 border border-orange-200 text-orange-950 text-xs font-bold shadow-sm">
                      <span>{pandit ? '🔱' : '🙏'}</span>
                      <span className="truncate max-w-[240px]">सादर प्रणाम, <strong>{pandit ? (pandit.name || 'पंडित जी') : user?.name}</strong>!</span>
                    </div>
                  )}
                  {showText && (
                    <>
                      <p className="text-sm sm:text-base font-semibold tracking-wide text-[#5a2a0e] mb-2">
                        Chant <span className="text-orange-500">•</span> Connect <span className="text-orange-500">•</span> Grow <span className="text-orange-500">•</span> Serve
                      </p>
                      <h1 className="font-serif font-black leading-[1.1] text-[#A52A0A] text-4xl sm:text-5xl lg:text-6xl drop-shadow-sm">
                        {currentSlide.title || 'Jai Shree Ram'}
                        {currentSlide.subtitle && <span className="block text-2xl sm:text-3xl lg:text-4xl mt-1 text-[#C2410C]">{currentSlide.subtitle}</span>}
                      </h1>
                      {currentSlide.tagline && <p className="mt-3 text-sm sm:text-base font-bold text-[#3B1405]">{currentSlide.tagline}</p>}
                      <p className="mt-2 text-sm sm:text-base text-[#4a2a14] leading-relaxed max-w-md mx-auto md:mx-0">
                        {currentSlide.description}
                      </p>
                    </>
                  )}
                  {showButtons && (
                    <div className="mt-5 flex flex-wrap items-center gap-3 justify-center md:justify-start">
                      <button onClick={() => handleHeroButtonClick(currentSlide.button1Link, currentSlide.button1Text)} className="px-7 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/40 active:scale-95 transition-all flex items-center gap-2 cursor-pointer">
                        <Play className="w-4 h-4 fill-white" />
                        <span>{currentSlide.button1Text || 'Start Ram Naam Jaap'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleHeroButtonClick(currentSlide.button2Link || 'video', currentSlide.button2Text)} className="px-6 py-3.5 rounded-full font-bold text-sm text-[#7a2a08] bg-white/90 hover:bg-white border border-orange-300 active:scale-95 transition-all backdrop-blur-md flex items-center gap-2 cursor-pointer">
                        <Play className="w-4 h-4 text-orange-600" />
                        <span>{currentSlide.button2Text || 'Watch Video'}</span>
                      </button>
                    </div>
                  )}
                  <p className="mt-4 text-xs sm:text-sm text-[#5a2a0e] flex items-center gap-1.5 justify-center md:justify-start">
                    <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                    Together for a Better &amp; More Devotional World
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {heroSlides.length > 1 && (
            <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center gap-2">
              {heroSlides.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentSlideIdx(idx)} aria-label={`Slide ${idx + 1}`} className={`transition-all rounded-full cursor-pointer ${idx === currentSlideIdx ? 'w-7 h-2 bg-gradient-to-r from-orange-500 to-amber-500' : 'w-2 h-2 bg-orange-300/70 hover:bg-orange-400'}`} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= FLOATING ACTION DOCK ================= */}
      <div className="relative z-30 max-w-6xl mx-auto px-3 sm:px-4 -mt-8 sm:-mt-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-orange-900/10 border border-orange-100 p-3 sm:p-4">
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {DOCK.map(({ label, sub, href, Icon, tone }) => (
              <button key={label} onClick={() => safeNavigate(href)} className="group flex flex-col items-center text-center gap-1.5 p-2.5 sm:p-3 rounded-2xl hover:bg-orange-50/80 transition-all cursor-pointer lg:border-r last:border-r-0 border-orange-100/70">
                <span className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center ${tone} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-900 leading-tight">{label}</span>
                <span className="text-[10px] sm:text-xs text-slate-500 leading-tight hidden sm:block">{sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= EXPLORE OUR SPIRITUAL WORLD ================= */}
      <section className="py-12 sm:py-16 bg-[#FFFDF9] border-t border-orange-100/60">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl text-center">
          
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/80 text-orange-800 text-xs font-black tracking-wide mb-2.5">
            🚩 दिव्य आध्यात्मिक संसार
          </span>

          <h2 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight">
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">Spiritual World</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto font-medium">
            प्रभु श्री राम की पावन कथा, स्तुति, संकीर्तन और नित्य साधना से अपने जीवन को पावन बनाएं
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-10 text-left">
            {EXPLORE.map((it) => (
              <div
                key={it.title}
                onClick={() => safeNavigate(it.href)}
                className="group bg-white rounded-3xl border border-orange-100/90 hover:border-orange-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="relative h-44 sm:h-48 overflow-hidden bg-orange-50">
                    <Image
                      src={it.img}
                      alt={it.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-black/60 backdrop-blur-xs text-white border border-white/20 shadow-sm">
                        {it.badge}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="text-base font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                      {it.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                      {it.sub}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 flex items-center justify-between border-t border-orange-50 mt-2 pt-3">
                  <span className="text-xs font-bold text-orange-600 group-hover:text-orange-700">
                    {it.cta}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/30 group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ================= DAILY PANCHANG & SHUBH MUHURAT ================= */}
      <DailyPanchang />

      {/* ================= STATS BAND ================= */}
      <section className="relative mt-6 sm:mt-8 overflow-hidden bg-gradient-to-r from-[#FFE7C7] via-[#FFF1DC] to-[#FFE7C7]">
        <Image src="/images/Ayodhya Ramji Photo.webp" alt="" fill unoptimized sizes="100vw" className="object-cover object-center opacity-[0.12]" />
        <div className="relative container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-0 md:divide-x divide-orange-200">
            {STATS.map(({ Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center text-center px-2">
                <Icon className="w-7 h-7 sm:w-9 sm:h-9 text-orange-600 mb-1" />
                <p className="text-2xl sm:text-4xl font-serif font-black text-[#A52A0A]">{value}</p>
                <p className="text-xs sm:text-sm text-[#5a2a0e] font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TODAY'S NAAM + DAILY INSPIRATION + COMMUNITY ================= */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-3 sm:px-6 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-4 items-stretch">
            {/* Virtual Mandir & Deepdaan */}
            <div className="lg:col-span-5 flex flex-col">
              <VirtualDeepdaan />
            </div>

            {/* Daily Inspiration */}
            {(() => {
              const list = dailyChaupais.length ? dailyChaupais : [SEED_CHAUPAIS[0]];
              const cur = list[activeChaupaiIdx % list.length];
              return (
                <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-orange-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">दैनिक प्रेरणा</span>
                      <Quote className="w-5 h-5 text-orange-300" />
                    </div>
                    <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed font-serif italic">“{cur.chaupai}”</p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">{cur.bhavarth}</p>
                    <p className="text-[11px] font-semibold text-orange-600 mt-2">— {cur.source}</p>
                  </div>
                  <div className="pt-4 flex items-center gap-2">
                    <div className="flex items-center gap-1.5 mr-auto">
                      {list.map((_, i) => (
                        <button key={i} onClick={() => setActiveChaupaiIdx(i)} aria-label={`चौपाई ${i + 1}`} className={`h-1.5 rounded-full transition-all cursor-pointer ${(activeChaupaiIdx % list.length) === i ? 'w-5 bg-orange-600' : 'w-1.5 bg-orange-200'}`} />
                      ))}
                    </div>
                    <button onClick={() => setActiveChaupaiIdx((p) => (p + 1) % list.length)} className="py-2 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95">
                      <RefreshCw className="w-3 h-3" /> अगली
                    </button>
                    <button onClick={() => handleShareChaupai(cur.chaupai, cur.bhavarth, cur.source)} className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 cursor-pointer active:scale-95" title="WhatsApp पर शेयर करें">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  {shareSuccess && <p className="text-[11px] text-emerald-600 font-bold mt-2">✓ शेयर विंडो खुल गई</p>}
                </div>
              );
            })()}

            {/* Community */}
            <div className="lg:col-span-3 bg-white rounded-3xl p-5 sm:p-6 border border-orange-100 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">Community</span>
                <p className="mt-3 text-base font-black text-slate-900">राम भक्त सत्संग परिवार</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">विचार साझा करें, प्रश्न पूछें और देश-विदेश के भक्तों से जुड़ें।</p>
                <div className="flex items-center -space-x-1.5 mt-3">
                  {['🙏', '🚩', '🕉️', '🌸', '✨'].map((e, i) => (
                    <span key={i} className="w-7 h-7 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-xs">{e}</span>
                  ))}
                  <span className="text-[11px] font-bold text-orange-600 pl-3">{stats.totalDevotees}+ भक्त</span>
                </div>
              </div>
              <button onClick={() => safeNavigate('/community')} className="mt-4 w-full py-2.5 rounded-xl font-bold text-xs text-white bg-orange-600 hover:bg-orange-700 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all">
                Join Now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= AKHAND RAM NAAM LIVE TICKER ================= */}
      <LiveAkhandJaapTicker />

      {/* ================= INTERACTIVE JAAP TOOL ================= */}
      <NaamJapSection user={user} onSaveSuccess={checkAuth} />

      {/* ================= ALL SERVICES ================= */}
      <section id="services" className="py-10 sm:py-14 bg-[#FFF9F1] border-t border-orange-100/70">
        <div className="container mx-auto px-3 sm:px-6 max-w-6xl">
          <SectionTitle kicker="🚩 वैदिक सनातन सेवाएं" title="राम जी की सेना —" accent="सभी पावन सेवाएं" />
          <div className="flex items-center justify-start sm:justify-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
            {SERVICE_CATEGORIES.map((cat) => {
              const active = serviceCategory === cat.id;
              return (
                <button key={cat.id} onClick={() => setServiceCategory(cat.id)} className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${active ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' : 'bg-white border border-orange-100 hover:bg-orange-50 text-slate-700'}`}>
                  <span>{cat.icon}</span><span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredServices.map((service) => (
              <div key={service.serviceId || service.id || service._id} onClick={() => safeNavigate(service.href)} className="group bg-white rounded-3xl border border-orange-100 hover:border-orange-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col justify-between cursor-pointer">
                <div>
                  <div className="relative h-32 sm:h-44 overflow-hidden bg-orange-50">
                    <Image src={service.img} alt={service.title} fill sizes="(max-width:640px) 50vw, 25vw" className={`object-cover ${service.imgPosition || 'object-top'} group-hover:scale-105 transition-transform duration-700`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {service.popular && <span className="absolute top-2 left-2 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full bg-white/95 text-orange-700 line-clamp-1 max-w-[85%]">{service.popular}</span>}
                    {service.stats && <span className="absolute bottom-2 left-2 text-[9px] sm:text-[10px] font-bold text-white bg-black/55 backdrop-blur-md px-2 py-0.5 rounded">{service.stats}</span>}
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-orange-600 line-clamp-1">{service.subtitle}</p>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1 mt-0.5">{service.title}</h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{service.desc}</p>
                    {Array.isArray(service.features) && service.features.length > 0 && (
                      <div className="hidden sm:flex flex-wrap gap-1.5 mt-3">
                        {service.features.map((f, i) => <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-100">{f}</span>)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-3 sm:px-4 py-2.5 border-t border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50/40 flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-black text-orange-700 truncate">{service.ctaText || 'प्रवेश करें'}</span>
                  <span className="w-7 h-7 rounded-full bg-orange-500 group-hover:bg-orange-600 text-white flex items-center justify-center shrink-0 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= JOIN THE MOVEMENT ================= */}
      <section className="px-3 sm:px-6 py-4">
        <div className="relative max-w-6xl mx-auto overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white shadow-xl shadow-orange-500/30">
          <Image src="/images/Ayodhya Ramji Photo.webp" alt="" fill unoptimized sizes="100vw" className="object-cover object-right opacity-20 mix-blend-soft-light" />
          <div className="relative px-6 sm:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
            <div>
              <p className="text-lg sm:text-2xl font-serif font-black">Together, Let&apos;s Spread the Message of “Jai Shri Ram Naam”</p>
              <p className="text-xs sm:text-sm text-white/90 mt-1.5">🪷 Peace in Heart &nbsp;•&nbsp; ✨ Positivity in Life &nbsp;•&nbsp; 🚩 Devotion for a Better Tomorrow</p>
            </div>
            <button onClick={() => safeNavigate('/community')} className="shrink-0 px-6 py-3 rounded-full font-black text-xs sm:text-sm text-orange-700 bg-white hover:bg-amber-50 shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer">
              Join Our Devotional Community <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= KEY FEATURES ================= */}
      <section className="py-10 sm:py-14">
        <div className="container mx-auto px-3 sm:px-6 max-w-6xl">
          <SectionTitle title="Our Key" accent="Features" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {FEATURES.map(({ Icon, t, s }) => (
              <div key={t} className="bg-white rounded-2xl border border-orange-100 p-4 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <span className="mx-auto w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-2.5"><Icon className="w-6 h-6" /></span>
                <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">{t}</p>
                <p className="text-[11px] text-slate-500 mt-1 leading-tight">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TOP DEVOTEES ================= */}
      <section className="py-10 sm:py-14 bg-white border-t border-orange-100/70">
        <div className="container mx-auto px-3 sm:px-6 max-w-6xl">
          <SectionTitle kicker="🏆 संकीर्तन शिरोमणि मंडल" title="सर्वोच्च" accent="राम भक्त संकीर्तक" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {topDevotees.slice(0, 5).map((d, i) => {
              const medals = ['🥇', '🥈', '🥉', '🎖️', '🎖️'];
              return (
                <div key={i} className={`rounded-3xl p-4 border shadow-sm hover:shadow-md transition-all ${i === 0 ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300' : 'bg-[#FFF9F1] border-orange-100'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{medals[i]}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white text-orange-700 border border-orange-200">#{i + 1}</span>
                  </div>
                  <p className="text-sm font-black text-slate-900 truncate">{d.name || d.username}</p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3 text-orange-500" />{d.city || 'भारत'}</p>
                  <div className="mt-3 pt-2 border-t border-orange-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">कुल राम नाम</p>
                    <p className="text-base font-serif font-black text-orange-600">{formatIndianNumber(d.totalCount)}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-5">
            <button onClick={() => safeNavigate('/devotees')} className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 cursor-pointer">
              सम्पूर्ण सूची देखें <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= APP DOWNLOAD ================= */}
      <section className="px-3 sm:px-6 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-[#2B1104] via-[#4A1E08] to-[#2B1104] text-white shadow-2xl">
          <div className="grid md:grid-cols-2 gap-6 items-center p-6 sm:p-10">
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-4xl font-serif font-black text-amber-200">Jai Shri Ram Naam App</h2>
              <p className="mt-2 text-sm sm:text-base text-white/80">भक्ति को अपने साथ रखें, हमेशा। कहीं भी, कभी भी जप करें।</p>
              <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-left max-w-md mx-auto md:mx-0">
                {['दैनिक भजन व आरती', 'पंचांग व मुहूर्त', 'जप काउंटर', 'सत्संग व कार्यक्रम'].map((t) => (
                  <li key={t} className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-300 shrink-0" />{t}</li>
                ))}
              </ul>
              <div className="mt-5 flex items-center gap-3 justify-center md:justify-start">
                <button onClick={() => safeNavigate('/#jaap')} className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"><Smartphone className="w-4 h-4" />Google Play</button>
                <button onClick={() => safeNavigate('/#jaap')} className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"><Smartphone className="w-4 h-4" />App Store</button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-44 h-80 rounded-[2.2rem] border-[7px] border-[#1a0a03] bg-gradient-to-b from-orange-400 to-orange-600 shadow-2xl shadow-orange-500/30 flex flex-col items-center justify-center text-white relative">
                <span className="absolute top-2 w-16 h-1.5 rounded-full bg-black/40" />
                <p className="text-xs font-semibold opacity-90">Ram Naam Today</p>
                <p className="text-6xl font-serif font-black my-1">108</p>
                <span className="mt-2 px-4 py-1.5 rounded-full bg-white/25 text-[11px] font-bold">Tap to Chant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CLOSING QUOTE ================= */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#FFE7C7] via-[#FFF1DC] to-[#FFE7C7] py-10 sm:py-14 text-center px-4">
        <p className="text-2xl sm:text-4xl font-serif font-black text-[#A52A0A] leading-snug">“ राम नाम से जीवन में नई ऊर्जा<br className="hidden sm:block" /> और सही दिशा मिलती है ”</p>
        <button onClick={() => safeNavigate('/#jaap')} className="mt-5 px-8 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/40 hover:from-orange-600 hover:to-orange-700 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer">
          Start Your Journey Today <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* --- RAM SHALAKA MODAL --- */}
      <RamShalakaModal isOpen={showShalakaModal} onClose={() => setShowShalakaModal(false)} />

      {/* --- WATCH VIDEO MODAL --- */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-orange-500/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-orange-950 via-slate-900 to-orange-950 border-b border-orange-500/20">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🚩</span>
                  <h3 className="font-bold text-sm sm:text-base text-amber-200">
                    श्री राम संकीर्तन व दर्शन
                  </h3>
                </div>
                <button
                  onClick={() => setVideoModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Video Iframe Container (16:9 Aspect Ratio) */}
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  src={`${activeVideoUrl}?autoplay=1&rel=0`}
                  title="Devotional Video"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}