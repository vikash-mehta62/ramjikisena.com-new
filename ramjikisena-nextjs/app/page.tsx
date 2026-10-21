'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import NaamJapSection from '@/components/NaamJapSection';
import Footer from '@/components/Footer';
import { authApi, User } from '@/lib/auth';
import { useJaapNavigate } from '@/lib/useJaapNavigate';
import {
  Sparkles, Flame, Trophy, Crown, Share2, Heart, ShieldCheck, CheckCircle2,
  Compass, BookOpen, Users, ArrowRight, ChevronLeft, ChevronRight as ChevronRightIcon,
  Star, Award, Clock, MapPin, Calendar, Play, Volume2, RefreshCw, Church,
  Check, Smartphone, ExternalLink, X
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

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-800 overflow-x-hidden selection:bg-orange-200 selection:text-orange-900 pb-16 md:pb-0">
      <Navbar showAuthButtons={true} />

      {/* --- HERO SECTION: FULL-WIDTH PANORAMIC SUNRISE HERO (MATCHING USER PHOTO EXACTLY) --- */}
      <section 
        className="relative w-full overflow-hidden bg-gradient-to-b from-[#FFF5E5] via-[#FFF9F0] to-[#FFFFFF]"
        onMouseEnter={() => setIsSlidePaused(true)}
        onMouseLeave={() => setIsSlidePaused(false)}
      >
        {/* Full-bleed Panoramic Banner Carousel Container */}
        <div className="relative w-full min-h-[380px] sm:min-h-[440px] lg:min-h-[500px] xl:min-h-[540px] flex items-center">
          
          {/* Background Image / Panoramic Artwork with AnimatePresence */}
          {(() => {
            const currentSlide = heroSlides[currentSlideIdx] || DEFAULT_HERO_SLIDES[0];
            const align = currentSlide.textAlignment || 'center';
            const isTextVisible = currentSlide.showText !== false;
            const isButtonsVisible = currentSlide.showButtons !== false;
            const textColor = currentSlide.textColor || '#2a1306';
            const isAnyContentVisible = isTextVisible || isButtonsVisible;
            return (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlideIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="absolute inset-0 z-0"
                  >
                    {/* Desktop Image (hidden on mobile if mobileImage exists) */}
                    <div className={currentSlide.mobileImage ? 'hidden md:block absolute inset-0' : 'absolute inset-0'}>
                      <Image
                        src={currentSlide.image || '/images/hero-clean-bg.webp'}
                        alt={currentSlide.title || 'Bhagwan Shri Ram'}
                        fill
                        priority
                        unoptimized
                        className="object-cover object-[78%_top] md:object-top"
                        sizes="100vw"
                      />
                    </div>

                    {/* Mobile Image (shown only on mobile if mobileImage exists) */}
                    {currentSlide.mobileImage && (
                      <div className="md:hidden absolute inset-0">
                        <Image
                          src={currentSlide.mobileImage}
                          alt={currentSlide.title || 'Bhagwan Shri Ram'}
                          fill
                          priority
                          unoptimized
                          className="object-cover object-top sm:object-center"
                          sizes="100vw"
                        />
                      </div>
                    )}

                    {/* Clean natural presentation with NO white milky haze */}
                  </motion.div>
                </AnimatePresence>

                {/* Mobile Floating Greeting Pill at TOP (leaves artwork center clear) */}
                {(pandit || user) && (
                  <div className="md:hidden absolute top-3 inset-x-0 flex justify-center z-30 pointer-events-none px-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-orange-200/90 text-orange-950 text-xs font-bold shadow-md">
                      <span className="text-sm">{pandit ? '🔱' : '🙏'}</span>
                      <span className="truncate max-w-[260px]">
                         सादर प्रणाम, <strong>{pandit ? (pandit.name || 'पंडित जी') : user?.name}</strong>!
                        {pandit && <span className="text-[10px] text-orange-700 ml-1 font-semibold">(पुरोहित)</span>}
                      </span>
                    </div>
                  </div>
                )}

                {/* Desktop Greeting Pill when text is hidden */}
                {(pandit || user) && !isTextVisible && !isButtonsVisible && (
                  <div className="hidden md:flex absolute top-4 left-6 z-20 pointer-events-none">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-orange-200/90 text-orange-950 text-xs font-bold shadow-sm">
                      <span className="text-base">{pandit ? '🔱' : '🙏'}</span>
                      <span>
                        सादर प्रणाम, <strong>{pandit ? (pandit.name || 'पंडित जी') : user?.name}</strong>!
                      </span>
                    </div>
                  </div>
                )}

                {/* Previous & Next Arrow Controls */}
                {heroSlides.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentSlideIdx((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                      aria-label="Previous Slide"
                      className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-slate-800 hover:text-orange-600 shadow-lg border border-orange-200/60 flex items-center justify-center backdrop-blur-md transition-all active:scale-90 cursor-pointer hidden sm:flex"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentSlideIdx((prev) => (prev + 1) % heroSlides.length)}
                      aria-label="Next Slide"
                      className="absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-slate-800 hover:text-orange-600 shadow-lg border border-orange-200/60 flex items-center justify-center backdrop-blur-md transition-all active:scale-90 cursor-pointer hidden sm:flex"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Foreground Text & Action Buttons */}
                {isAnyContentVisible && (
                  <div className="container mx-auto px-4 sm:px-8 lg:px-14 relative z-20 pt-8 sm:pt-14 pb-14 sm:pb-18">
                    <div className={`max-w-xl lg:max-w-2xl transition-all duration-300 ${
                      align === 'left'
                        ? 'text-center md:text-left mx-auto md:ml-4 lg:ml-8 md:mr-auto'
                        : align === 'right'
                        ? 'text-center md:text-right mx-auto md:mr-4 lg:mr-8 md:ml-auto'
                        : 'text-center mx-auto'
                    }`}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentSlideIdx}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.45, ease: 'easeOut' }}
                        >
                          {/* Text Content (Title, Subtitle, Tagline, Description) */}
                          {isTextVisible && (
                            <>
                              {/* Top Divine Badge */}
                              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-orange-200/90 text-[11px] sm:text-xs font-black tracking-wider uppercase mb-2.5 sm:mb-3 shadow-xs ${
                                align === 'left' ? 'mx-auto md:ml-0' : align === 'right' ? 'mx-auto md:mr-0' : 'mx-auto'
                              }`} style={{ color: textColor }}>
                                <span>{currentSlide.badge || '🚩 Jai Shree Ram — Naam is the True Power'}</span>
                              </div>

                              {/* Main Headline */}
                              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight leading-[1.15] mb-2 sm:mb-2.5 drop-shadow-xs" style={{ color: textColor }}>
                                <span className="block font-serif" style={{ color: textColor }}>
                                  {currentSlide.title || 'Jai Shree Ram'}
                                </span>
                                {currentSlide.subtitle && (
                                  <span className="block mt-1 font-serif text-xl sm:text-3xl lg:text-4xl font-black" style={{ color: textColor }}>
                                    {currentSlide.subtitle}
                                  </span>
                                )}
                              </h1>

                              {/* Subheading / Tagline */}
                              {currentSlide.tagline && (
                                <p className="text-sm sm:text-base font-bold mb-1.5 drop-shadow-xs" style={{ color: textColor }}>
                                  {currentSlide.tagline}
                                </p>
                              )}

                              {/* Description */}
                              <p className={`text-xs sm:text-sm lg:text-base max-w-lg leading-relaxed mb-4 sm:mb-5 font-medium ${
                                align === 'left' ? 'mx-auto md:ml-0' : align === 'right' ? 'mx-auto md:mr-0' : 'mx-auto'
                              }`} style={{ color: textColor, opacity: 0.95 }}>
                                {currentSlide.description || 'Join millions of devotees and experience peace, positivity and happiness through Ram Naam in your daily life.'}
                              </p>
                            </>
                          )}

                          {/* Two Action Buttons */}
                          {isButtonsVisible && (
                            <div className={`flex flex-wrap items-center gap-3 mb-4 sm:mb-5 ${
                              align === 'left' ? 'justify-center md:justify-start' : align === 'right' ? 'justify-center md:justify-end' : 'justify-center'
                            }`}>
                              <button
                                onClick={() => handleHeroButtonClick(currentSlide.button1Link, currentSlide.button1Text)}
                                className="px-6 sm:px-7 py-3 rounded-full font-bold text-xs sm:text-sm text-white shadow-lg shadow-orange-500/30 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                              >
                                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                                  <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
                                </div>
                                <span>{currentSlide.button1Text || 'Start Ram Naam Jaap'}</span>
                              </button>

                              <button
                                onClick={() => handleHeroButtonClick(currentSlide.button2Link || 'video', currentSlide.button2Text)}
                                className="px-5 sm:px-6 py-3 rounded-full font-bold text-xs sm:text-sm text-slate-800 bg-white/95 hover:bg-white border border-orange-200 hover:border-orange-400 active:scale-95 transition-all shadow-xs backdrop-blur-md flex items-center gap-2 cursor-pointer"
                              >
                                <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center">
                                  <Play className="w-2.5 h-2.5 text-orange-600 ml-0.5" />
                                </div>
                                <span>{currentSlide.button2Text || 'Watch Video'}</span>
                              </button>
                            </div>
                          )}

                          {/* Role-Aware User / Pandit Status Badge (shown inside text block on desktop only) */}
                          {pandit ? (
                            <div className={`hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/85 backdrop-blur-md border border-orange-200 text-orange-900 text-xs font-bold shadow-xs ${
                              align === 'left' ? 'mx-auto md:ml-0' : align === 'right' ? 'mx-auto md:mr-0' : 'mx-auto'
                            }`}>
                              <span className="text-base">🔱</span>
                              <span> सादर प्रणाम, <strong>{pandit.name || 'पंडित जी'}</strong>! आप पुरोहित पोर्टल में लॉगिन हैं।</span>
                            </div>
                          ) : user ? (
                            <div className={`hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/85 backdrop-blur-md border border-orange-200 text-orange-900 text-xs font-bold shadow-xs ${
                              align === 'left' ? 'mx-auto md:ml-0' : align === 'right' ? 'mx-auto md:mr-0' : 'mx-auto'
                            }`}>
                              <span className="text-base">🙏</span>
                              <span> सादर प्रणाम, <strong>{user.name}</strong>!</span>
                            </div>
                          ) : null}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* Slider Dots Indicator */}
                {heroSlides.length > 1 && (
                  <div className="absolute bottom-5 sm:bottom-6 inset-x-0 z-20 flex items-center justify-center gap-2">
                    {heroSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlideIdx(idx)}
                        aria-label={`Slide ${idx + 1}`}
                        className={`transition-all duration-300 cursor-pointer rounded-full ${
                          idx === currentSlideIdx
                            ? 'w-7 h-2 bg-gradient-to-r from-orange-500 to-amber-500 shadow-sm'
                            : 'w-2 h-2 bg-white/75 hover:bg-white shadow-xs border border-orange-300/40'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </section>

      {/* --- 4-GATEWAY FLOATING ACTION DOCK (EXACTLY MATCHING USER MOCKUP "WEBSITE - HOMEPAGE") --- */}
      <div className="relative z-30 max-w-5xl mx-auto px-3 sm:px-4 -mt-7 sm:-mt-9 lg:-mt-11">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-orange-950/10 border border-orange-200/80 p-2 sm:p-3">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
            {/* 1. Pandit Booking */}
            <button
              onClick={() => safeNavigate('/pandits')}
              className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FFFDF9] hover:bg-orange-50/70 border border-orange-100 hover:border-orange-300 transition-all text-left group shadow-2xs hover:shadow-sm cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center text-xl sm:text-2xl shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                🔱
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-tight truncate">
                  पंडित बुक करें
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate font-medium">
                  पूजा / हवन / संस्कार
                </p>
              </div>
            </button>

            {/* 2. Astrologer Booking */}
            <button
              onClick={() => safeNavigate('/astrology')}
              className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FFFDF9] hover:bg-amber-50/70 border border-orange-100 hover:border-amber-300 transition-all text-left group shadow-2xs hover:shadow-sm cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-white flex items-center justify-center text-xl sm:text-2xl shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                🔮
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-amber-700 transition-colors leading-tight truncate">
                  ज्योतिषी बुक करें
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate font-medium">
                  कुंडली / विवाह / करियर
                </p>
              </div>
            </button>

            {/* 3. Bhajan & Aarti */}
            <button
              onClick={() => safeNavigate('/#jaap')}
              className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FFFDF9] hover:bg-rose-50/70 border border-orange-100 hover:border-rose-300 transition-all text-left group shadow-2xs hover:shadow-sm cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 text-white flex items-center justify-center text-xl sm:text-2xl shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                🪔
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-rose-600 transition-colors leading-tight truncate">
                  भजन / आरती
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate font-medium">
                  सुनें और शांति पाएं
                </p>
              </div>
            </button>

            {/* 4. Ram Naam Jaap */}
            <button
              onClick={() => safeNavigate('/#jaap')}
              className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FFFDF9] hover:bg-emerald-50/70 border border-orange-100 hover:border-emerald-300 transition-all text-left group shadow-2xs hover:shadow-sm cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-xl sm:text-2xl shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                📿
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight truncate">
                  राम नाम जप
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate font-medium">
                  108 मणियों का दैनिक जप
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* --- SLEEK LIVE STATS STRIP (TIGHT COMPACT SPACING) --- */}
      <div className="relative z-20 max-w-5xl mx-auto px-3 sm:px-4 my-2.5 sm:my-3.5">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-orange-100/90 py-2 px-3 sm:px-6 shadow-xs">
          
          {/* Mobile View: Horizontal Swipeable Stats Strip */}
          <div className="flex sm:hidden items-center gap-2 overflow-x-auto no-scrollbar py-0.5 snap-x">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50/70 shrink-0 snap-start border border-amber-100/70">
              <span className="text-sm">🪷</span>
              <p className="text-xs font-black text-slate-900 whitespace-nowrap">
                {stats.totalRamNaam >= 10000000 ? `${(stats.totalRamNaam / 10000000).toFixed(1)} Cr+` : '1M+'} <span className="font-semibold text-[10px] text-slate-500">Devotees</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50/70 shrink-0 snap-start border border-orange-100/70">
              <span className="text-sm">🕉️</span>
              <p className="text-xs font-black text-slate-900 whitespace-nowrap">
                108+ <span className="font-semibold text-[10px] text-slate-500">Daily Jaap</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-50/70 shrink-0 snap-start border border-yellow-100/70">
              <span className="text-sm">📖</span>
              <p className="text-xs font-black text-slate-900 whitespace-nowrap">
                Daily <span className="font-semibold text-[10px] text-slate-500">Wisdom</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50/70 shrink-0 snap-start border border-rose-100/70">
              <span className="text-sm">🛕</span>
              <p className="text-xs font-black text-slate-900 whitespace-nowrap">
                Festivals <span className="font-semibold text-[10px] text-slate-500">Darshan</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50/70 shrink-0 snap-start border border-emerald-100/70">
              <span className="text-sm">👥</span>
              <p className="text-xs font-black text-slate-900 whitespace-nowrap">
                Global <span className="font-semibold text-[10px] text-slate-500">Bhakti</span>
              </p>
            </div>
          </div>

          {/* Desktop & Tablet: Clean 5-Item Row */}
          <div className="hidden sm:grid sm:grid-cols-5 gap-2 divide-x divide-slate-100">
            <div className="flex items-center justify-center gap-2 py-0.5">
              <span className="text-base">🪷</span>
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-900 leading-tight">
                  {stats.totalRamNaam >= 10000000 ? `${(stats.totalRamNaam / 10000000).toFixed(1)} Cr+` : '1M+'}
                </p>
                <p className="text-[10px] text-slate-500 font-medium truncate">Devotees</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 py-0.5">
              <span className="text-base">🕉️</span>
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-900 leading-tight">108+</p>
                <p className="text-[10px] text-slate-500 font-medium truncate">Chanting Daily</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 py-0.5">
              <span className="text-base">📖</span>
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-900 leading-tight">Daily</p>
                <p className="text-[10px] text-slate-500 font-medium truncate">Spiritual Content</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 py-0.5">
              <span className="text-base">🛕</span>
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-900 leading-tight">Festivals</p>
                <p className="text-[10px] text-slate-500 font-medium truncate">Live Darshan</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 py-0.5">
              <span className="text-base">👥</span>
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-900 leading-tight">Community</p>
                <p className="text-[10px] text-slate-500 font-medium truncate">Worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
            
      {/* --- 3-CARD SHOWCASE SECTION (MATCHING MIDDLE ROW IN PHOTO) --- */}
      <section className="py-3.5 sm:py-5 bg-[#FFFDF9]">
        <div className="container mx-auto px-3 sm:px-6 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-3.5 sm:gap-4 items-stretch">

            {/* Card 1: Today's Ram Naam Banner (Wide) */}
            <div className="lg:col-span-6 bg-gradient-to-br from-amber-100/80 via-orange-50 to-amber-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-orange-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-700 bg-white/80 px-2.5 py-0.5 rounded-full border border-orange-200">
                  Today's Ram Naam
                </span>

                <div className="mt-3 mb-2">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-black text-orange-900 leading-snug font-serif">
                    “ श्री राम जय राम जय जय राम ”
                  </p>
                  <p className="text-xs sm:text-sm text-slate-700 mt-1.5 font-medium">
                    Chant today and bring positivity and peace into your life.
                  </p>
                </div>
              </div>

              <div className="pt-3 relative z-10 flex items-center justify-between">
                <button
                  onClick={() => safeNavigate('/#jaap')}
                  className="px-5 py-2.5 rounded-full font-black text-xs text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Start Jaap Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="w-11 h-11 rounded-xl bg-white/80 border border-orange-200 flex items-center justify-center text-2xl shadow-xs">
                  🙏
                </div>
              </div>

              {/* Decorative watermark */}
              <div className="absolute right-0 bottom-0 text-[8rem] font-serif font-black text-orange-200/20 select-none pointer-events-none leading-none -mb-4">
                राम
              </div>
            </div>

            {/* Card 2: Daily Inspiration Card (2 daily active chaupais rotating every day) */}
            {(() => {
              const currentChaupai = dailyChaupais[activeChaupaiIdx % Math.max(1, dailyChaupais.length)] || SEED_CHAUPAIS[0];
              const totalChaupais = dailyChaupais.length || 2;
              const currentNum = (activeChaupaiIdx % Math.max(1, dailyChaupais.length)) + 1;
              return (
                <div className="lg:col-span-3 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-orange-100 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          दैनिक प्रेरणा
                        </span>
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-full border border-orange-100">
                          {currentNum}/{totalChaupais}
                        </span>
                      </div>
                      <span className="text-lg">🪔</span>
                    </div>

                    {/* Dot indicators for today's 2 chaupais */}
                    <div className="flex items-center gap-1.5 mb-2">
                      {dailyChaupais.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveChaupaiIdx(idx)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            (activeChaupaiIdx % dailyChaupais.length) === idx
                              ? 'w-5 bg-orange-600'
                              : 'w-1.5 bg-orange-200 hover:bg-orange-300'
                          }`}
                          aria-label={`चौपाई ${idx + 1}`}
                        />
                      ))}
                      <span className="text-[10px] font-medium text-slate-400 ml-1">आज की 2 चौपाइयां</span>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed italic mt-0.5 font-serif">
                      "{currentChaupai.chaupai}"
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-3">
                      {currentChaupai.bhavarth}
                    </p>
                    <p className="text-[10px] font-semibold text-orange-600 mt-1">
                      — {currentChaupai.source}
                    </p>
                  </div>

                  <div className="pt-3 flex items-center gap-2">
                    <button
                      onClick={() => setActiveChaupaiIdx((prev) => (prev + 1) % Math.max(1, dailyChaupais.length))}
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>अगली ({((activeChaupaiIdx + 1) % Math.max(1, dailyChaupais.length)) + 1}/{totalChaupais})</span>
                    </button>
                    <button
                      onClick={() => handleShareChaupai(currentChaupai.chaupai, currentChaupai.bhavarth, currentChaupai.source)}
                      className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-all cursor-pointer active:scale-95"
                      title="WhatsApp पर शेयर करें"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Card 3: Join Our Community Card */}
            <div className="lg:col-span-3 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-orange-100 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Join Our Community
                  </span>
                  <span className="text-lg">👥</span>
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1 leading-snug">
                  राम भक्त सत्संग परिवार
                </p>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed">
                  Share thoughts, ask questions and connect with fellow devotees worldwide.
                </p>

                {/* Devotees Avatars row */}
                <div className="flex items-center -space-x-1.5 mt-3">
                  {['🙏', '🚩', '🕉️', '🌸', '✨'].map((emoji, idx) => (
                    <div key={idx} className="w-7 h-7 rounded-full bg-orange-100 border border-white flex items-center justify-center text-[10px] shadow-xs">
                      {emoji}
                    </div>
                  ))}
                  <span className="text-[10px] font-bold text-orange-600 pl-2">
                    {stats.totalDevotees}+ Devotees
                  </span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => safeNavigate('/community')}
                  className="w-full py-2 rounded-xl font-bold text-xs text-white bg-orange-600 hover:bg-orange-700 shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Join Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- INTERACTIVE RAM NAAM JAAP TOOL --- */}
      {!loading && <NaamJapSection user={user} onSaveSuccess={checkAuth} />}

      {/* --- ALL DIVINE SERVICES SECTION (WHITE-AND-ORANGE THEMED) --- */}
      <section id="services" className="py-8 sm:py-12 bg-white border-t border-orange-100/70">
        <div className="container mx-auto px-4 sm:px-6">

          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-black mb-1.5">
              🚩 वैदिक सनातन सेवाएं
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
              राम जी की सेना — <span className="text-orange-600">सभी पावन सेवाएं</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              वेद-शास्त्रों की मर्यादा और सनातन परंपरा के अनुरूप समस्त धार्मिक आवश्यकताएं
            </p>

            {/* Filter Tabs */}
            <div className="flex items-center justify-center flex-wrap gap-2 mt-4 sm:mt-5">
              {SERVICE_CATEGORIES.map(cat => {
                const active = serviceCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setServiceCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      active
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-orange-50 text-slate-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredServices.map(service => (
              <div
                key={service.serviceId || service.id || service._id}
                onClick={() => safeNavigate(service.href)}
                className="bg-white rounded-3xl border border-slate-100 hover:border-orange-300 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-100">
                    <Image
                      src={service.img}
                      alt={service.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={`object-cover ${service.imgPosition || 'object-top'} group-hover:scale-105 transition-transform duration-700`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {service.popular && (
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white/90 text-orange-700 shadow-xs">
                          {service.popular}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/90 flex items-center justify-center text-base shadow-xs">
                      {service.emoji || '✨'}
                    </div>
                    {service.stats && (
                      <div className="absolute bottom-3 left-3">
                        <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md">
                          {service.stats}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 sm:p-5">
                    <p className="text-[10px] font-black uppercase tracking-wider text-orange-600 mb-0.5">
                      {service.subtitle}
                    </p>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {service.desc}
                    </p>

                    {Array.isArray(service.features) && service.features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {service.features.map((feat, fi) => (
                          <span key={fi} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-50 text-orange-800 border border-orange-100">
                            {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-4 sm:px-5 py-2.5 border-t border-orange-100/70 bg-gradient-to-r from-orange-50/60 to-amber-50/30 flex items-center justify-between">
                  <span className="text-xs font-black text-orange-700">{service.ctaText || 'प्रवेश करें'}</span>
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center gap-1 shadow-xs group-hover:from-orange-600 group-hover:to-amber-600 transition-all">
                    <span>प्रवेश करें</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- TOP DEVOTEES HONOR ROLL (सर्वोच्च राम भक्त मंडल) --- */}
      <section className="py-8 sm:py-10 bg-[#FFFDF9] border-t border-orange-100/70">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-black mb-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                <span>संकीर्तन शिरोमणि मंडल</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                सर्वोच्च राम भक्त संकीर्तक
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                लाखों मालाओं का पावन संचय करने वाले अग्रिम भक्त
              </p>
            </div>

            <button
              onClick={() => safeNavigate('/devotees')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>सम्पूर्ण सूची देखें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {topDevotees.slice(0, 5).map((devotee, index) => {
              const medals = ['🥇', '🥈', '🥉', '🎖️', '🎖️'];
              return (
                <div
                  key={index}
                  className="bg-white border border-orange-100 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{medals[index] || '🚩'}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                      #{index + 1}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-900 truncate">{devotee.name || devotee.username}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-orange-500" />
                      <span>{devotee.city || 'भारत'}</span>
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">कुल राम नाम</p>
                    <p className="text-sm font-black text-orange-600">{formatIndianNumber(devotee.totalCount)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- BOTTOM BANNER: DOWNLOAD APP & GLOBAL BHAKTI MOVEMENT (MATCHING PHOTO FOOTER BAR) --- */}
      <section className="bg-gradient-to-r from-[#2B1104] via-[#3D1805] to-[#2B1104] text-white py-8 border-t border-orange-950">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Left: App Download */}
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-2xl flex-shrink-0">
                📱
              </div>
              <div>
                <p className="text-base font-black text-amber-200">
                  Download JaiShriRamNaam App
                </p>
                <p className="text-xs text-white/70">
                  Chant anytime, anywhere. Available on Android & iOS.
                </p>
              </div>
            </div>

            {/* Middle: Badges */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => safeNavigate('/#jaap')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <span>Google Play</span>
              </button>
              <button
                onClick={() => safeNavigate('/#jaap')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <span>App Store</span>
              </button>
            </div>

            {/* Right: Global Movement */}
            <div className="flex items-center gap-3 text-center md:text-right">
              <div>
                <p className="text-xs font-bold text-amber-300">
                  Be a Part of a Global Bhakti Movement
                </p>
                <p className="text-[11px] text-white/60">
                  Connect with devotees from 20+ countries
                </p>
              </div>
              <button
                onClick={() => safeNavigate('/community')}
                className="px-4 py-2 rounded-full font-black text-xs text-slate-950 bg-gradient-to-r from-amber-300 to-orange-400 hover:from-amber-400 hover:to-orange-500 shadow-md transition-all active:scale-95"
              >
                Join Community
              </button>
            </div>

          </div>
        </div>
      </section>

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