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
  Star, Award, Clock, MapPin, Calendar, Play, Volume2, RefreshCw, Church
} from 'lucide-react';

export interface ServiceItem {
  id: string;
  category: 'purohit' | 'satsang' | 'darshan' | 'samagri';
  title: string;
  subtitle: string;
  desc: string;
  href: string;
  img: string;
  grad: string;
  emoji: string;
  popular: string;
  features: string[];
  ctaText: string;
  stats: string;
}

const SERVICE_CATEGORIES = [
  { id: 'all', label: 'समस्त सेवाएं', icon: '🕉️', count: 8 },
  { id: 'purohit', label: 'पुरोहित व कथा', icon: '🔱', count: 2 },
  { id: 'satsang', label: 'संकीर्तन व सत्संग', icon: '📿', count: 3 },
  { id: 'darshan', label: 'तीर्थ व दर्शन', icon: '🛕', count: 2 },
  { id: 'samagri', label: 'पूजन सामग्री', icon: '🪔', count: 1 },
];

const ALL_SERVICES: ServiceItem[] = [
  {
    id: 'pandits',
    category: 'purohit',
    title: 'वैदिक पंडित जी बुकिंग',
    subtitle: 'Vedic Purohits & Karmakand',
    desc: 'विवाह, गृह प्रवेश, सत्यनारायण कथा, रुद्राभिषेक व 16 संस्कारों हेतु वेदपाठी ब्राह्मण।',
    href: '/pandits',
    img: '/home/pandit.jpg',
    grad: 'from-orange-800 to-red-950',
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
    grad: 'from-purple-800 to-indigo-950',
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
    grad: 'from-amber-700 to-orange-950',
    emoji: '📿',
    popular: '🏆 #1 महा-साधना',
    features: ['स्वतः माला गणना', 'अखंड महा-बैंक', 'पुण्य संचय'],
    ctaText: 'लिखित जाप करें',
    stats: '1.42+ करोड़ नाम',
  },
  {
    id: 'mandirs',
    category: 'darshan',
    title: 'पावन मंदिर दर्शन व आरती',
    subtitle: 'Sacred Temples & Darshan',
    desc: 'अयोध्या धाम, काशी विश्वनाथ सहित देश के पवित्र तीर्थों का इतिहास, आरती समय व दर्शन।',
    href: '/mandirs',
    img: '/images/Ayodhya Ramji Photo.webp',
    grad: 'from-red-800 to-amber-950',
    emoji: '🛕',
    popular: '🛕 पावन तीर्थ धाम',
    features: ['आरती का समय', 'इतिहास व महत्ता', 'तीर्थ मार्गदर्शिका'],
    ctaText: 'मंदिर दर्शन करें',
    stats: 'पावन तीर्थ',
  },
  {
    id: 'samagri',
    category: 'samagri',
    title: 'शुद्ध वैदिक पूजन सामग्री',
    subtitle: '100% Pure Vedic Samagri',
    desc: 'हवन सामग्री, धूप, देशी गाय का घी, गंगाजल, रोली व संपूर्ण पूजन किट्स सीधे आपके घर तक।',
    href: '/samagri',
    img: '/images/gallery-1.webp',
    grad: 'from-emerald-800 to-teal-950',
    emoji: '🪔',
    popular: '🆕 100% शुद्ध सात्विक',
    features: ['शास्त्रोक्त शुद्धता', 'घर पर डिलीवरी', 'रेडी पैकेजेस'],
    ctaText: 'सामग्री खरीदें',
    stats: 'होम डिलीवरी',
  },
  {
    id: 'community',
    category: 'satsang',
    title: 'राम भक्त परिवार व फोरम',
    subtitle: 'Devotee Satsang Community',
    desc: 'देश-विदेश के हजारों रामभक्तों के साथ आध्यात्मिक विचार-विमर्श, प्रश्नोत्तरी व सत्संग।',
    href: '/community',
    img: '/images/aboutImg1.webp',
    grad: 'from-blue-800 to-cyan-950',
    emoji: '🤝',
    popular: '💬 1000+ रामभक्त',
    features: ['सत्संग व विचार', 'धार्मिक प्रश्नोत्तरी', 'भक्त मंडल'],
    ctaText: 'सत्संग से जुड़ें',
    stats: '178+ पंजीकृत भक्त',
  },
  {
    id: 'glory',
    category: 'satsang',
    title: 'श्री राम महिमा व अमृत कथा',
    subtitle: 'Glory of Shri Ram Naam',
    desc: 'राम नाम का आध्यात्मिक महत्व, संतों के अलौकिक अनुभव, मानस की चौपाइयां व गूढ़ रहस्य।',
    href: '/glory',
    img: '/hanumanji.jpg',
    grad: 'from-yellow-700 to-amber-950',
    emoji: '✨',
    popular: '✨ अमृत प्रसंग',
    features: ['अमृत चौपाइयां', 'संतों के अनुभव', 'आध्यात्मिक ज्ञान'],
    ctaText: 'महिमा पढ़ें',
    stats: 'पावन प्रसंग',
  },
  {
    id: 'gallery',
    category: 'darshan',
    title: 'दिव्य दर्शन व उत्सव गैलरी',
    subtitle: 'Divine Photo Gallery',
    desc: 'प्रभु श्री राम, अयोध्या उत्सवों, संकीर्तन महोत्सवों व दिव्य आयोजनों की अलौकिक छवियां।',
    href: '/gallery',
    img: '/images/ramji-slider-1.webp',
    grad: 'from-rose-800 to-pink-950',
    emoji: '🌸',
    popular: '🌸 अलौकिक छवियां',
    features: ['एचडी दिव्य छवियां', 'उत्सव दर्शन', 'वॉलपेपर्स'],
    ctaText: 'गैलरी देखें',
    stats: 'मनोहर दर्शन',
  },
];

const DAILY_CHAUPAIS = [
  {
    chaupai: "मंगल भवन अमंगल हारी। द्रवउ सुदसरथ अजिर बिहारी।।",
    bhavarth: "जो मंगल करने वाले और अमंगल को हरने वाले हैं, वे श्री दशरथ जी के आंगन में खेलने वाले भगवान श्री राम मुझ पर कृपा करें।",
    source: "श्री रामचरितमानस — बालकाण्ड"
  },
  {
    chaupai: "कलियुग केवल नाम अधारा। सुमिरि सुमिरि नर उतरहिं पारा।।",
    bhavarth: "कलियुग में केवल भगवान का नाम ही उद्धार का एकमात्र आधार है, जिसका निरंतर स्मरण करके मनुष्य भवसागर से पार उतर जाता है।",
    source: "श्री रामचरितमानस — उत्तरकाण्ड"
  },
  {
    chaupai: "दीनदयाल बिरिदु संभारी। हरहु नाथ मम संकट भारी।।",
    bhavarth: "हे दीनों पर दया करने वाले प्रभु! अपने कृपालु स्वभाव का स्मरण करते हुए मेरे जीवन के सभी संकटों को हर लीजिए।",
    source: "श्री रामचरितमानस — सुन्दरकाण्ड"
  },
  {
    chaupai: "राम नाम मनिदीप धरु जीह देहरीं द्वार। तुलसी भीतर बाहिरहुँ जौं चाहसि उजियार।।",
    bhavarth: "यदि तुम अपने भीतर और बाहर दोनों ओर आध्यात्मिक उजाला चाहते हो, तो जीभ रूपी देहरी के द्वार पर राम नाम रूपी मणि-दीपक को धारण करो।",
    source: "दोहावली — गोस्वामी तुलसीदास"
  },
  {
    chaupai: "जापर कृपा राम की होई। तापर कृपा करहिं सब कोई।।",
    bhavarth: "जिस पर भगवान श्री राम जी की कृपा हो जाती है, उस पर संसार के सभी जीव और देवता स्वतः ही कृपा करने लगते हैं।",
    source: "श्री रामचरितमानस — अयोध्याकाण्ड"
  }
];

const SPIRITUAL_PILLARS = [
  {
    icon: '📿',
    title: 'डिजिटल राम नाम बैंक',
    desc: 'आपके द्वारा लिखा गया प्रत्येक राम नाम सुरक्षित रहता है। स्वतः माला गणना और पुण्य का संचय होता है।',
    tag: 'अखंड संकीर्तन',
  },
  {
    icon: '🔱',
    title: 'प्रमाणित वैदिक ब्राह्मण',
    desc: 'सभी पंडित जी वेद-शास्त्रों के ज्ञाता और पूर्णतः सत्यापित हैं। विवाह, गृह प्रवेश और सभी 16 संस्कार हेतु उपलब्ध।',
    tag: '100% प्रामाणिक',
  },
  {
    icon: '🪔',
    title: 'शुद्ध वैदिक पूजन सामग्री',
    desc: 'हवन सामग्री, धूप, गाय का शुद्ध घी व पूजा किट्स सीधे आपके द्वार तक। शास्त्रों के अनुरूप तैयार।',
    tag: 'घर पर डिलीवरी',
  },
  {
    icon: '🤝',
    title: 'वैश्विक राम भक्त परिवार',
    desc: 'देश-विदेश के हजारों रामभक्तों का आध्यात्मिक संगम। एक साथ नाम जप, मंदिर दर्शन और सत्संग का लाभ।',
    tag: 'भक्त समुदाय',
  },
];

function formatIndianNumber(num: number): string {
  if (!num) return '0';
  return num.toLocaleString('en-IN');
}

const slides = [
  {
    title: "🚩 जय श्री राम",
    subtitle: "राम नाम का लिखित जाप",
    desc: "कलियुग में नाम ही आधार है। अपनी आध्यात्मिक यात्रा को डिजिटल माध्यम से नई ऊंचाइयों पर ले जाएं।",
    img: "/ramji.jpg",
    color: "from-orange-500 to-red-600",
    glow: "rgba(255, 100, 0, 0.4)"
  },
  {
    title: "🙏 जय श्री हनुमान",
    subtitle: "भक्ति की पराकाष्ठा",
    desc: "संकट कटे मिटे सब पीरा, जो सुमिरै हनुमत बलबीरा। भक्ति की शक्ति से जुड़ें और संकटों से मुक्ति पाएं।",
    img: "/hanumanji.jpg",
    color: "from-red-600 to-orange-700",
    glow: "rgba(220, 38, 38, 0.4)"
  }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [pandit, setPandit] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [chaupaiIdx, setChaupaiIdx] = useState(0);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [serviceCategory, setServiceCategory] = useState<string>('all');
  const safeNavigate = useJaapNavigate();

  const filteredServices = serviceCategory === 'all'
    ? ALL_SERVICES
    : ALL_SERVICES.filter(s => s.category === serviceCategory);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData);
    } catch {
      setUser(null);
    }

    try {
      if (typeof window !== 'undefined') {
        const pTok = localStorage.getItem('panditToken');
        const pData = localStorage.getItem('pandit');
        if (pTok && pData) {
          setPandit(JSON.parse(pData));
        } else {
          setPandit(null);
        }
      }
    } catch {
      setPandit(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchLiveStats();

    const onAuthEvent = () => checkAuth();
    window.addEventListener('storage', onAuthEvent);
    window.addEventListener('auth-change', onAuthEvent);
    return () => {
      window.removeEventListener('storage', onAuthEvent);
      window.removeEventListener('auth-change', onAuthEvent);
    };
  }, []);

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
    <div className="min-h-screen bg-[#FFFAF3] overflow-x-hidden selection:bg-orange-200">
      <Navbar showAuthButtons={true} />

      {/* --- FULL SCREEN HERO SLIDER --- */}
      <section className="relative min-h-[92vh] lg:min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#1a0a00]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={slides[currentSlide].img}
                alt="Background"
                fill
                className="object-cover opacity-30 scale-105 animate-slow-zoom"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-[#1a0800]/80 to-[#120500]" />
              <div className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(200,100,0,0.22) 0%, transparent 70%)' }} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Decorative OM watermark */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 text-orange-400/15 text-[11rem] font-black select-none leading-none pointer-events-none">
          ॐ
        </div>

        {/* Main Hero Content */}
        <div className="container mx-auto px-6 relative z-20 pt-24 pb-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center w-full">

            {/* Left: Text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-white text-center lg:text-left order-2 lg:order-1"
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-600/80 backdrop-blur text-white text-[11px] font-black tracking-[0.2em] uppercase mb-5 shadow-lg shadow-orange-900/30 border border-orange-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{slides[currentSlide].subtitle}</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black leading-[1.05] mb-5 drop-shadow-2xl">
                  <span className="text-white">जय श्री </span>
                  <span className="text-transparent bg-clip-text"
                    style={{ backgroundImage: 'linear-gradient(135deg, #f9e07a 0%, #e8a820 40%, #f0b429 60%, #b8760a 100%)' }}>
                    राम
                  </span>
                </h1>

                {/* Divider line */}
                <div className="flex items-center gap-3 mb-5 justify-center lg:justify-start">
                  <div className="h-px w-8 bg-orange-500/60" />
                  <span className="text-orange-300 text-xs font-black tracking-widest uppercase">अखंड राम नाम महा-संकीर्तन बैंक</span>
                  <div className="h-px flex-1 max-w-[80px] bg-orange-500/30" />
                </div>

                <p className="text-base md:text-lg text-orange-100/85 max-w-lg mx-auto lg:mx-0 mb-7 leading-relaxed">
                  {slides[currentSlide].desc}
                </p>

                {/* Chaupai snippet card */}
                <div className="inline-flex items-center gap-3 bg-white/5 border border-orange-400/25 backdrop-blur-sm rounded-2xl px-5 py-3 mb-8 text-left">
                  <span className="text-2xl flex-shrink-0">🪔</span>
                  <div>
                    <p className="text-orange-300 text-sm font-bold italic leading-relaxed">
                      "कलियुग केवल नाम अधारा। सुमिरि सुमिरि नर उतरहिं पारा।।"
                    </p>
                    <p className="text-[10px] text-orange-400/70 font-semibold mt-0.5">— श्री रामचरितमानस</p>
                  </div>
                </div>

                {/* Role-Aware User / Pandit Status Badge */}
                {pandit ? (
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-red-950/60 to-orange-950/60 border border-orange-500/40 text-amber-200 text-xs font-bold backdrop-blur-md mb-6 shadow-xl">
                    <span className="text-base">🔱</span>
                    <span>
                      सादर प्रणाम, <strong className="text-white">{pandit.name || 'पंडित जी'}</strong>! आप पुरोहित पोर्टल में लॉगिन हैं।
                    </span>
                  </div>
                ) : user ? (
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/10 border border-white/15 text-white/90 text-xs font-bold backdrop-blur-md mb-6">
                    <span className="text-base">🙏</span>
                    <span>
                      सादर प्रणाम, <strong className="text-amber-300">{user.name}</strong>!
                      {user.role === 'admin' ? ' (Administrator)' : user.role === 'staff' || user.role === 'subadmin' ? ' (Staff Member)' : ''}
                    </span>
                  </div>
                ) : null}

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button onClick={() => safeNavigate('/#jaap')}
                    className="px-8 py-4 font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 text-base border border-yellow-600/40 flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #f9e07a 0%, #d4920a 40%, #f0b429 70%, #b8760a 100%)',
                      color: '#5a1a00',
                      boxShadow: '0 8px 24px rgba(180,100,0,0.4)',
                    }}>
                    <span>🚩 अभी नाम जाप करें</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {pandit ? (
                    <button
                      onClick={() => safeNavigate('/pandit/dashboard')}
                      className="px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black rounded-2xl shadow-xl shadow-orange-950/50 transition-all hover:scale-105 active:scale-95 text-base flex items-center justify-center gap-2 border border-orange-400/40"
                    >
                      <span>🔱 पंडित डैशबोर्ड खोलें</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : user ? (
                    <button
                      onClick={() =>
                        safeNavigate(
                          user.role === 'admin' || user.role === 'staff' || user.role === 'subadmin'
                            ? '/admin/admin-dashboard'
                            : '/dashboard'
                        )
                      }
                      className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-2xl hover:bg-white/20 transition-all text-base flex items-center justify-center gap-2"
                    >
                      <span>
                        {user.role === 'admin'
                          ? '👑 एडमिन डैशबोर्ड खोलें'
                          : user.role === 'staff' || user.role === 'subadmin'
                          ? '🛡️ स्टाफ पोर्टल खोलें'
                          : '🙏 भक्त डैशबोर्ड खोलें'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => safeNavigate('/login')}
                      className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-2xl hover:bg-white/20 transition-all text-base flex items-center justify-center gap-2"
                    >
                      <span>लॉगिन करें 🙏</span>
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Right: Divine Image Frame */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ delay: 0.15, duration: 0.9 }}
                className="flex justify-center items-center order-1 lg:order-2"
              >
                <div className="relative">
                  <div className="absolute -inset-4 rounded-[2.5rem] blur-2xl opacity-50 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse, #d4920a 0%, transparent 70%)' }} />

                  <div className="relative rounded-[2rem] p-[3px]"
                    style={{
                      background: 'linear-gradient(145deg, #f9e07a, #b8760a, #f0b429, #7a4a00)',
                      boxShadow: '0 0 40px rgba(200,130,0,0.5), 0 20px 60px rgba(0,0,0,0.6)',
                    }}>
                    <div className="relative w-[260px] h-[320px] sm:w-[320px] sm:h-[400px] md:w-[380px] md:h-[460px] rounded-[1.8rem] overflow-hidden bg-[#1a0800]">
                      <Image
                        src={slides[currentSlide].img}
                        alt={slides[currentSlide].title}
                        fill
                        className="object-cover object-top"
                        priority
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#1a0800]/95 via-[#1a0800]/50 to-transparent" />
                      <div className="absolute bottom-4 left-0 right-0 text-center">
                        <span className="text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full"
                          style={{ color: '#f9e07a', textShadow: '0 0 12px rgba(200,130,0,0.8)' }}>
                          {slides[currentSlide].title}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="absolute -top-3 -left-3 text-2xl drop-shadow-lg">🪔</span>
                  <span className="absolute -top-3 -right-3 text-2xl drop-shadow-lg">🪔</span>
                  <span className="absolute -bottom-3 -left-3 text-xl drop-shadow-lg">🌸</span>
                  <span className="absolute -bottom-3 -right-3 text-xl drop-shadow-lg">🌸</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 transition-all duration-300 rounded-full ${
                currentSlide === i ? "w-10 bg-yellow-400" : "w-2.5 bg-white/25"
              }`}
            />
          ))}
        </div>
      </section>

      {/* --- LIVE STATS TICKER RIBBON --- */}
      <section className="relative z-30 bg-[#120500] border-y border-amber-500/20 py-3.5 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-around gap-4 text-center md:text-left">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300/70">कुल संकीर्तित नाम</span>
                <p className="text-base font-black text-amber-300 leading-none">
                  {formatIndianNumber(stats.totalRamNaam)} <span className="text-xs text-amber-200/80 font-normal">जाप</span>
                </p>
              </div>
            </div>

            <div className="h-6 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="text-lg">📿</span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-300/70">पूर्ण मालाएं</span>
                <p className="text-base font-black text-orange-200 leading-none">
                  {formatIndianNumber(stats.totalMalas)} <span className="text-xs text-orange-200/80 font-normal">माला</span>
                </p>
              </div>
            </div>

            <div className="h-6 w-px bg-white/10 hidden md:block" />

            <div className="flex items-center gap-2">
              <span className="text-lg">🙏</span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300/70">पंजीकृत भक्त</span>
                <p className="text-base font-black text-white leading-none">
                  {stats.totalDevotees}+ <span className="text-xs text-white/60 font-normal">भक्त</span>
                </p>
              </div>
            </div>

            <div className="h-6 w-px bg-white/10 hidden lg:block" />

            <div className="flex items-center gap-2">
              <span className="text-lg">🔱</span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300/70">वैदिक पंडित</span>
                <p className="text-base font-black text-amber-300 leading-none">
                  {stats.totalPandits}+ <span className="text-xs text-amber-200/80 font-normal">सत्यापित</span>
                </p>
              </div>
            </div>

            <div className="h-6 w-px bg-white/10 hidden xl:block" />

            <div className="flex items-center gap-2">
              <span className="text-lg">📖</span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-300/70">कथा व्यास</span>
                <p className="text-base font-black text-orange-200 leading-none">
                  {stats.totalKathaVachaks}+ <span className="text-xs text-orange-200/80 font-normal">उपलब्ध</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* --- GRAND SANKIRTAN COUNTERS SECTION (MAHA-BANK) --- */}
      <section className="py-16 relative overflow-hidden bg-gradient-to-b from-[#1a0800] via-[#240a00] to-[#1a0800]">
        <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
          <span className="text-[32rem] font-black select-none text-amber-500">RAM</span>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black mb-3">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>श्री राम नाम संकीर्तन महा-बैंक</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              विश्वभर के भक्तों द्वारा <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400">
                1.42+ करोड़ नाम संकीर्तन
              </span>
            </h2>
            <p className="text-sm md:text-base text-orange-100/70 mt-3 max-w-xl mx-auto">
              भक्तों द्वारा समर्पित लिखित राम नाम का पावन संचय। आपके द्वारा लिखा गया हर नाम इस महा-बैंक में सदा सुरक्षित रहता है।
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {/* Center Main Spotlight Box */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="md:col-span-3 lg:col-span-1 rounded-3xl p-6 relative overflow-hidden border border-amber-400/40 shadow-2xl flex flex-col justify-between"
              style={{
                background: 'linear-gradient(145deg, rgba(212,146,10,0.25) 0%, rgba(50,15,0,0.85) 100%)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">🕉️</span>
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  अखंड जाप प्रवाह
                </span>
              </div>

              <div>
                <p className="text-xs font-black text-amber-200/80 uppercase tracking-widest mb-1">कुल लिखित राम नाम</p>
                <p className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
                  {formatIndianNumber(stats.totalRamNaam)}
                </p>
                <p className="text-xs text-orange-200/70 mt-2 leading-relaxed">
                  प्रत्येक अक्षर से अनंत पुण्य की प्राप्ति और मानसिक शांति।
                </p>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => safeNavigate('/#jaap')}
                  className="w-full py-3 rounded-xl font-black text-sm transition-all hover:scale-102 flex items-center justify-center gap-2 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #f9e07a, #d4920a)',
                    color: '#3a0f00',
                  }}
                >
                  <span>🚩 अपना राम नाम जोड़ें</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* 4 Companion Counter Cards in 2x2 Grid */}
            <div className="md:col-span-3 lg:col-span-2 grid sm:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 hover:border-amber-400/30 rounded-3xl p-5 backdrop-blur-sm transition-all">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl mb-3">
                  📿
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider">पूर्ण जप मालाएं</p>
                <p className="text-3xl font-black text-white mt-1">
                  {formatIndianNumber(stats.totalMalas)} <span className="text-base text-amber-300 font-normal">माला</span>
                </p>
                <p className="text-xs text-slate-400 mt-2">108 गुरियों की शास्त्रोक्त लिखित मालाएं</p>
              </div>

              <div className="bg-white/5 border border-white/10 hover:border-amber-400/30 rounded-3xl p-5 backdrop-blur-sm transition-all">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-300 flex items-center justify-center text-xl mb-3">
                  👥
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider">समर्पित राम भक्त</p>
                <p className="text-3xl font-black text-white mt-1">
                  {stats.totalDevotees}+ <span className="text-base text-orange-300 font-normal">भक्त</span>
                </p>
                <p className="text-xs text-slate-400 mt-2">दैनिक नाम संकीर्तन परिवार के सदस्य</p>
              </div>

              <div className="bg-white/5 border border-white/10 hover:border-amber-400/30 rounded-3xl p-5 backdrop-blur-sm transition-all">
                <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-300 flex items-center justify-center text-xl mb-3">
                  🔱
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider">सत्यापित वैदिक पंडित</p>
                <p className="text-3xl font-black text-white mt-1">
                  {stats.totalPandits}+ <span className="text-base text-red-300 font-normal">पंडित जी</span>
                </p>
                <p className="text-xs text-slate-400 mt-2">पूजा, अनुष्ठान व हवन हेतु उपलब्ध</p>
              </div>

              <div className="bg-white/5 border border-white/10 hover:border-amber-400/30 rounded-3xl p-5 backdrop-blur-sm transition-all">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-xl mb-3">
                  📖
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider">कथा व्यास व पीठ</p>
                <p className="text-3xl font-black text-white mt-1">
                  {stats.totalKathaVachaks}+ <span className="text-base text-purple-300 font-normal">व्यास</span>
                </p>
                <p className="text-xs text-slate-400 mt-2">श्रीमद्भागवत एवं रामकथा मर्मज्ञ</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- DAILY RAMAYAN CHAUPAI & SUVICHAR --- */}
      <section className="py-14 bg-[#120500] border-y border-amber-500/15">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-amber-500/30 shadow-2xl"
            style={{
              background: 'linear-gradient(145deg, #1f0b02 0%, #120500 100%)',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl text-amber-300">
                  📜
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400/80">आज का पावन सुविचार</span>
                  <p className="text-sm font-bold text-white">दैनिक रामायण चौपाई व अमृत संदेश</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setChaupaiIdx((prev) => (prev + 1) % DAILY_CHAUPAIS.length)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-amber-200 flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>अन्य चौपाई</span>
                </button>
              </div>
            </div>

            <div className="text-center py-4 space-y-4">
              <p className="text-2xl sm:text-3xl font-serif font-black text-amber-300 leading-relaxed italic drop-shadow-md">
                "{DAILY_CHAUPAIS[chaupaiIdx].chaupai}"
              </p>

              <div className="max-w-2xl mx-auto bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4">
                <p className="text-xs font-black text-amber-400 uppercase tracking-wider mb-1">भावार्थ (सरल अर्थ):</p>
                <p className="text-sm text-orange-100/90 leading-relaxed">
                  {DAILY_CHAUPAIS[chaupaiIdx].bhavarth}
                </p>
                <p className="text-[11px] font-semibold text-amber-400/70 mt-2">
                  — {DAILY_CHAUPAIS[chaupaiIdx].source}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-amber-500/15">
              <button
                onClick={() => handleShareChaupai(DAILY_CHAUPAIS[chaupaiIdx].chaupai, DAILY_CHAUPAIS[chaupaiIdx].bhavarth, DAILY_CHAUPAIS[chaupaiIdx].source)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{shareSuccess ? 'साझा किया गया!' : 'WhatsApp पर शेयर करें'}</span>
              </button>

              <button
                onClick={() => safeNavigate('/#jaap')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-black flex items-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <span>📿 आज का जाप शुरू करें</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- NAAM JAP INTERACTIVE TOOL --- */}
      {!loading && <NaamJapSection user={user} onSaveSuccess={checkAuth} />}

      {/* --- ALL DIVINE SERVICES SECTION (सभी पावन सेवाएं — RAM NAAM JAAP KE THEEK NICHE) --- */}
      <section id="services" className="py-20 relative overflow-hidden bg-gradient-to-b from-[#140600] via-[#1f0900] to-[#120500] border-t border-amber-500/25">
        {/* Sacred Background OM & Glow */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035] flex items-center justify-center">
          <span className="text-[34rem] font-black select-none text-amber-500">ॐ</span>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-36 bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black mb-3 shadow-lg">
              <span>🚩</span>
              <span>पावन सेवाएं एवं धर्म-संस्कृति</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              राम जी की सेना — <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400">सभी दिव्य सेवाएं</span>
            </h2>
            <p className="text-sm md:text-base text-orange-100/75 mt-3 leading-relaxed">
              वेद-शास्त्रों की मर्यादा और सनातन परंपरा के अनुरूप, आपकी समस्त धार्मिक व आध्यात्मिक आवश्यकताओं की प्रामाणिक पूर्ति एक ही पावन मंच पर।
            </p>
          </div>

          {/* Quick Pandit VIP Portal Bar (Shown if Pandit is logged in) */}
          {pandit && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 p-4 rounded-2xl bg-gradient-to-r from-red-950/80 via-orange-950/80 to-amber-950/80 border border-orange-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-600/30 border border-orange-500/40 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
                  🔱
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <p className="text-sm font-black text-white">पंडित नियंत्रण केंद्र (Pandit Portal Active)</p>
                    <span className="text-[9px] bg-orange-600 text-white px-2 py-0.5 rounded-full font-bold">ONLINE</span>
                  </div>
                  <p className="text-xs text-orange-200/70 mt-0.5">
                    सादर प्रणाम, <strong>{pandit.name || 'पंडित जी'}</strong>! यजमानों की पूजा बुकिंग्स एवं दक्षिणा इतिहास का त्वरित प्रबंधन करें।
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => safeNavigate('/pandit/dashboard')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-black shadow-lg transition-all"
                >
                  डैशबोर्ड खोलें 📊
                </button>
                <button
                  onClick={() => safeNavigate('/pandit/bookings')}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-bold transition-all"
                >
                  पूजा बुकिंग्स 📅
                </button>
                <button
                  onClick={() => safeNavigate('/pandit/profile')}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-bold transition-all"
                >
                  प्रोफाइल 👤
                </button>
              </div>
            </motion.div>
          )}

          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
            {SERVICE_CATEGORIES.map(cat => {
              const active = serviceCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setServiceCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
                    active
                      ? 'shadow-lg shadow-amber-900/40 scale-105'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  style={active ? {
                    background: 'linear-gradient(135deg, #f9e07a, #d4920a)',
                    color: '#3a0f00',
                    border: '1px solid rgba(249,224,122,0.8)',
                  } : {}}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    active ? 'bg-black/20 text-[#3a0f00]' : 'bg-white/10 text-white/60'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Divine Services Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredServices.map(service => (
                <motion.div
                  layout
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  whileHover={{ y: -7 }}
                  onClick={() => safeNavigate(service.href)}
                  className="rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between group transition-all"
                  style={{
                    background: 'linear-gradient(180deg, rgba(30,10,2,0.85) 0%, rgba(18,5,0,0.95) 100%)',
                    border: '1px solid rgba(212,146,10,0.25)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(249,224,122,0.6)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(212,146,10,0.25)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,146,10,0.25)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
                  }}
                >
                  <div>
                    {/* Top Image Banner */}
                    <div className="relative h-52 overflow-hidden bg-black/60">
                      <Image
                        src={service.img}
                        alt={service.title}
                        fill
                        className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${service.grad} opacity-40 mix-blend-multiply`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#140600] via-black/30 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg"
                          style={{
                            background: 'linear-gradient(135deg, #d4920a, #f9e07a)',
                            color: '#3a0f00',
                          }}>
                          {service.popular}
                        </span>

                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-black/50 backdrop-blur-md border border-amber-400/40 text-xl shadow-lg group-hover:rotate-6 transition-transform">
                          {service.emoji}
                        </div>
                      </div>

                      {/* Floating bottom stat tag on image */}
                      <div className="absolute bottom-3 left-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-amber-200 border border-white/10">
                          {service.stats}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      <p className="text-[10px] font-black uppercase tracking-wider text-amber-400/80 mb-1">
                        {service.subtitle}
                      </p>
                      <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                        {service.title}
                      </h3>
                      <p className="text-xs text-orange-100/70 mt-2 line-clamp-2 leading-relaxed">
                        {service.desc}
                      </p>

                      {/* 3 Highlights / Feature Pills */}
                      <div className="flex flex-wrap gap-1.5 mt-3.5">
                        {service.features.map((feat, fi) => (
                          <span
                            key={fi}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-orange-200/80"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer CTA Bar */}
                  <div className="px-5 py-3.5 border-t border-white/10 bg-black/40 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300/80 group-hover:text-amber-200 transition-colors">
                      {service.ctaText}
                    </span>
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md"
                      style={{
                        background: 'linear-gradient(135deg, #f9e07a, #d4920a)',
                        color: '#3a0f00',
                      }}>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Bottom Trust & Reassurance Ribbon */}
          <div className="mt-14 p-5 rounded-3xl bg-white/5 border border-amber-500/20 backdrop-blur-md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="flex items-center justify-center gap-2.5">
                <span className="text-2xl">🛡️</span>
                <div className="text-left">
                  <p className="text-xs font-black text-white">100% शास्त्रोक्त विधि</p>
                  <p className="text-[10px] text-orange-200/60">सत्यापित वैदिक परंपरा</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2.5">
                <span className="text-2xl">🙏</span>
                <div className="text-left">
                  <p className="text-xs font-black text-white">सत्यापित पुरोहित</p>
                  <p className="text-[10px] text-orange-200/60">योग्य व विद्वान ब्राह्मण</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2.5">
                <span className="text-2xl">🚚</span>
                <div className="text-left">
                  <p className="text-xs font-black text-white">शुद्ध पूजन सामग्री</p>
                  <p className="text-[10px] text-orange-200/60">घर पर सुरक्षित डिलीवरी</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2.5">
                <span className="text-2xl">📞</span>
                <div className="text-left">
                  <p className="text-xs font-black text-white">24/7 सहायता मंच</p>
                  <p className="text-[10px] text-orange-200/60">धार्मिक मार्गदर्शन सेवा</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TOP DEVOTEES HONOR ROLL (सर्वोच्च राम भक्त मंडल) --- */}
      <section className="py-16 bg-[#0d0400] relative overflow-hidden border-t border-amber-500/15">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-300 text-xs font-black mb-2">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>संकीर्तन शिरोमणि मंडल</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-white">
                सर्वोच्च राम भक्त संकीर्तक
              </h2>
              <p className="text-xs md:text-sm text-orange-200/70 mt-1">
                निरंतर नाम जप द्वारा लाखों मालाओं का पुण्य संचय करने वाले अग्रिम भक्त
              </p>
            </div>

            <button
              onClick={() => safeNavigate('/devotees')}
              className="inline-flex items-center gap-2 text-xs font-black px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-amber-300 border border-amber-400/30 transition-all self-start md:self-auto"
            >
              <span>सम्पूर्ण भक्त सूची देखें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {topDevotees.slice(0, 5).map((devotee, index) => {
              const medals = ['🥇', '🥈', '🥉', '🎖️', '🎖️'];
              const borders = [
                'border-amber-400/50 bg-gradient-to-b from-amber-500/15 to-transparent',
                'border-slate-300/40 bg-gradient-to-b from-slate-400/10 to-transparent',
                'border-amber-700/40 bg-gradient-to-b from-amber-700/10 to-transparent',
                'border-white/10 bg-white/5',
                'border-white/10 bg-white/5',
              ];

              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className={`rounded-2xl p-5 border ${borders[index] || borders[3]} relative overflow-hidden flex flex-col justify-between`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{medals[index] || '🚩'}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                      Rank #{index + 1}
                    </span>
                  </div>

                  <div>
                    <p className="text-base font-black text-white truncate">{devotee.name || devotee.username}</p>
                    <p className="text-[11px] font-semibold text-orange-300/70 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-orange-400" />
                      <span>{devotee.city || 'भारत'}</span>
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">कुल नाम</p>
                      <p className="text-sm font-black text-amber-300">{formatIndianNumber(devotee.totalCount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-400">मालाएं</p>
                      <p className="text-sm font-black text-white">{formatIndianNumber(Math.floor(devotee.mala || devotee.totalCount / 108))}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- THE 4 DIVINE PILLARS (राम जी की सेना क्यों चुनें) --- */}
      <section className="py-16 bg-[#160700] border-t border-amber-500/15">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-300">
              आध्यात्मिक संकल्प
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-white mt-2">
              राम जी की सेना के पावन स्तम्भ
            </h2>
            <p className="text-xs md:text-sm text-orange-200/70 mt-2">
              हर भक्त के जीवन में धर्म, भक्ति और शांति का संचार करने हेतु समर्पित
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SPIRITUAL_PILLARS.map((pillar, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 hover:border-amber-400/40 rounded-3xl p-6 transition-all flex flex-col justify-between group hover:bg-white/[0.07]"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    {pillar.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                    {pillar.tag}
                  </span>
                  <h3 className="text-lg font-black text-white mt-2 mb-2">{pillar.title}</h3>
                  <p className="text-xs text-orange-100/70 leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* --- SAMAGRI PROMO --- */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0800 0%, #3d1200 50%, #1a0800 100%)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.06]">
          <div className="absolute top-0 left-0 text-[18rem] leading-none select-none">🪔</div>
          <div className="absolute bottom-0 right-0 text-[18rem] leading-none select-none">🌸</div>
        </div>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #d4920a, transparent)' }} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-white">
              <div className="inline-flex items-center gap-2 text-[10px] font-black px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest"
                style={{ background: 'rgba(200,130,0,0.2)', border: '1px solid rgba(200,130,0,0.3)', color: '#f9e07a' }}>
                🆕 नई सुविधा
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-3 leading-tight text-white">
                पूजन सामग्री<br/>
                <span style={{ color: '#f9e07a' }}>घर पर मंगाएं</span>
              </h2>
              <p className="text-orange-200/70 text-sm mb-6 leading-relaxed">शुद्ध और प्रामाणिक पूजा सामग्री अब आपके दरवाजे तक। 100% विश्वसनीय।</p>
              <div className="flex flex-wrap gap-2 mb-7">
                {['✅ 100% शुद्ध', '🚚 Free Delivery ₹500+', '📦 Ready Packages', '🙏 Trusted'].map(f => (
                  <span key={f} className="text-orange-200 text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(255,150,50,0.12)', border: '1px solid rgba(200,100,0,0.25)' }}>
                    {f}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => safeNavigate('/samagri')}
                  className="inline-flex items-center gap-2 font-black px-7 py-3.5 rounded-2xl shadow-xl hover:scale-105 transition-all text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #f9e07a 0%, #d4920a 50%, #b8760a 100%)',
                    color: '#5a1a00',
                    boxShadow: '0 8px 24px rgba(180,100,0,0.4)',
                  }}>
                  🛒 अभी खरीदें
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- QUOTE SECTION --- */}
      <section className="py-24 relative overflow-hidden" style={{ background: '#0f0500' }}>
        <div className="absolute inset-0 pointer-events-none">
          <Image src="/ramji.jpg" alt="" fill className="object-cover opacity-10" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(180,80,0,0.25) 0%, #0f0500 70%)' }} />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
            <div className="text-5xl mb-6">🙏</div>
            <h2 className="text-3xl md:text-5xl font-serif italic leading-tight mb-8"
              style={{ color: '#f9e07a', textShadow: '0 0 40px rgba(200,130,0,0.5)' }}>
              "कलियुग केवल नाम अधारा। <br />सुमिर सुमिर नर उतरहिं पारा।।"
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-orange-700" />
              <p className="text-sm font-bold text-orange-300 uppercase tracking-widest">— श्री रामचरितमानस</p>
              <div className="h-px w-12 bg-orange-700" />
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Custom CSS for the slow-zoom animation */}
      <style jsx global>{`
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s infinite alternate ease-in-out;
        }
      `}</style>
    </div>
  );
}