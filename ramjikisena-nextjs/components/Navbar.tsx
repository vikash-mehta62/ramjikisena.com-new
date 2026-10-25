'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, BookOpen, Church, Scroll, User as UserIcon,
  Image as ImageIcon, Phone, Calendar, BarChart3, Flag,
  Sparkles, ShoppingBag, Users, HelpCircle, Compass,
  LogOut, Crown, Menu, X, Star, MessageSquare, Home,
  Flame, Shield, ArrowRight, UserPlus, Search
} from 'lucide-react';
import { requestGlobalNavigation } from '@/lib/jaapContext';
interface NavbarProps { showAuthButtons?: boolean; }

interface ExploreLinkItem {
  href: string;
  label: string;
  sub: string;
  desc: string;
  img: string;
  badge?: string;
  icon?: any;
}

const exploreLinks: ExploreLinkItem[] = [
  {
    href: '/#jaap',
    label: 'राम नाम जप बैंक',
    sub: 'Akhand Ram Naam Bank',
    desc: '108 मनका माला, अखंड संकीर्तन व पुण्य संचय',
    img: '/ramji.jpg',
    badge: '🏆 1.42 Cr+',
    icon: Flame,
  },
  {
    href: '/katha-vachaks',
    label: 'श्री कथा वाचक',
    sub: 'Katha Vyas & Pravachan',
    desc: 'पूज्य व्यास पीठ द्वारा अमृत रामकथा व प्रवचन',
    img: '/home/kathavachak.webp',
    badge: '📖 कथा व्यास',
    icon: Scroll,
  },
  {
    href: '/pandits',
    label: 'वैदिक पंडित जी',
    sub: 'Vedic Purohits Booking',
    desc: 'विवाह, गृह प्रवेश, रुद्राभिषेक व 16 संस्कार पुरोहित',
    img: '/home/pandit.jpg',
    badge: '🔱 प्रमाणित',
    icon: Sparkles,
  },
  {
    href: '/mandirs',
    label: 'पावन मंदिर दर्शन',
    sub: 'Sacred Temples & Darshan',
    desc: 'अयोध्या धाम, काशी विश्वनाथ व तीर्थ मार्गदर्शिका',
    img: '/images/Ayodhya Ramji Photo.webp',
    badge: '🛕 तीर्थ दर्शन',
    icon: Church,
  },
  {
    href: '/astrology',
    label: 'ज्योतिष & टैरो',
    sub: 'Vedic Astrology & Tarot',
    desc: 'कुंडली, ग्रह गोचर व प्रामाणिक ज्योतिष मार्गदर्शन',
    img: '/images/hero-mobile-ramji.webp',
    badge: '🔮 परामर्श',
    icon: Sparkles,
  },
  {
    href: '/community',
    label: 'राम भक्त परिवार',
    sub: 'Devotee Satsang Community',
    desc: 'देश-विदेश के हजारों रामभक्तों का पावन समुदाय',
    img: '/home/Pradeep-Ji-Mishra.webp',
    badge: '🤝 सत्संग',
    icon: Users,
  },
  {
    href: '/glory',
    label: 'राम नाम महिमा',
    sub: 'Glory of Prabhu Ram Naam',
    desc: 'शास्त्रों व संतों के मुख से पावन नाम महिमा के अमृत वचन',
    img: '/hanumanji.jpg',
    badge: '⭐ अमृत ज्ञान',
    icon: Star,
  },
  {
    href: '/blogs',
    label: 'ब्लॉग व प्रेरक विचार',
    sub: 'Spiritual Articles & Katha',
    desc: 'धार्मिक प्रेरक प्रसंग, रामायण कथाएं व पावन आलेख',
    img: '/images/gallery-1.webp',
    badge: '📚 ज्ञान अमृत',
    icon: BookOpen,
  },
  {
    href: '/forum',
    label: 'सत्संग फोरम',
    sub: 'Devotional Q&A Forum',
    desc: 'धार्मिक प्रश्नोत्तरी व संतों के साथ आध्यात्मिक विचार',
    img: '/images/aboutImg1.webp',
    badge: '💬 संवाद',
    icon: HelpCircle,
  },
  {
    href: '/gallery',
    label: 'दिव्य पावन गैलरी',
    sub: 'Sacred Moments & Darshan',
    desc: 'भव्य उत्सव, आरती व पावन दर्शन छायाचित्र',
    img: '/images/gallery-1.webp',
    badge: '📸 दर्शन',
    icon: ImageIcon,
  },
  /*
  {
    href: '/samagri',
    label: 'शुद्ध वैदिक सामग्री',
    sub: 'Pure Vedic Puja Store',
    desc: '100% सात्विक हवन व पूजन सामग्री, रोली, गंगाजल',
    img: '/images/aboutImg1.webp',
    badge: '🪔 100% शुद्ध',
    icon: ShoppingBag,
  },
  */
  {
    href: '/about',
    label: 'हमारे बारे में',
    sub: 'About Jai Shri Ram Naam',
    desc: 'जय श्री राम नाम मिशन, उद्देश्य, सेवा व संपर्क',
    img: '/images/hero-ayodhya-ramji-hd.webp',
    badge: '🚩 सेवा',
    icon: Flag,
  },
];

const mainLinks = [
  { href: '/#jaap',         label: 'Naam Jaap',     icon: Flame },
  { href: '/pandits',       label: 'Pandits',       icon: Sparkles },
  { href: '/mandirs',       label: 'Mandirs',       icon: Church },
  // { href: '/samagri',       label: 'Samagri',       icon: ShoppingBag },
];

export default function Navbar({ showAuthButtons = true }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navigate = (href: string) => {
    router.push(href);
    setExploreOpen(false);
    setUserMenuOpen(false);
    setLoginOpen(false);
    setSignupOpen(false);
    setMobileOpen(false);
  };

  const safeNavigate = (href: string) => {
    requestGlobalNavigation(href, navigate);
    setExploreOpen(false);
    setUserMenuOpen(false);
    setLoginOpen(false);
    setSignupOpen(false);
    setMobileOpen(false);
  };

  const [auth, setAuth] = useState({
    isLoggedIn: false,
    isPanditLoggedIn: false,
    isAstrologerLoggedIn: false,
    userName: '',
    panditName: '',
    astrologerName: '',
    isAdmin: false,
    isStaff: false,
    panditPhoto: '',
    astrologerPhoto: '',
  });
  const isHomePage = pathname === '/';
  const [scrolled, setScrolled]           = useState(false);
  const [exploreOpen, setExploreOpen]     = useState(false);
  const [userMenuOpen, setUserMenuOpen]   = useState(false);
  const [panditMenuOpen, setPanditMenuOpen] = useState(false);
  const [astrologerMenuOpen, setAstrologerMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen]         = useState(false);
  const [signupOpen, setSignupOpen]       = useState(false);
  const [mobileAuthTab, setMobileAuthTab] = useState<'login' | 'register'>('login');
  const [mobileOpen, setMobileOpen]       = useState(false);

  const exploreRef = useRef<HTMLDivElement>(null);
  const userRef    = useRef<HTMLDivElement>(null);
  const panditRef  = useRef<HTMLDivElement>(null);
  const astrologerRef = useRef<HTMLDivElement>(null);
  const loginRef   = useRef<HTMLDivElement>(null);
  const signupRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const syncAuth = () => {
      try {
        const token     = localStorage.getItem('token');
        const panditTok = localStorage.getItem('panditToken');
        const astroTok  = localStorage.getItem('astrologerToken');
        const user      = JSON.parse(localStorage.getItem('user')       || '{}');
        const pandit    = JSON.parse(localStorage.getItem('pandit')     || '{}');
        const astro     = JSON.parse(localStorage.getItem('astrologer')  || '{}');
        setAuth({
          isLoggedIn:           !!token,
          isPanditLoggedIn:     !!panditTok,
          isAstrologerLoggedIn: !!astroTok,
          userName:             user.name       || 'User',
          panditName:           pandit.name     || 'पंडित जी',
          astrologerName:       astro.name      || 'ज्योतिषी जी',
          isAdmin:              user.role       === 'admin',
          isStaff:              user.role       === 'staff' || user.role === 'subadmin',
          panditPhoto:          pandit.photo    || '',
          astrologerPhoto:      astro.photo     || '',
        });
      } catch (err) {
        console.error('Navbar syncAuth error:', err);
      }
    };

    syncAuth();
    window.addEventListener('storage', syncAuth);
    window.addEventListener('auth-change', syncAuth);
    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('auth-change', syncAuth);
    };
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exploreRef.current    && !exploreRef.current.contains(e.target as Node))    setExploreOpen(false);
      if (userRef.current       && !userRef.current.contains(e.target as Node))       setUserMenuOpen(false);
      if (panditRef.current     && !panditRef.current.contains(e.target as Node))     setPanditMenuOpen(false);
      if (astrologerRef.current && !astrologerRef.current.contains(e.target as Node)) setAstrologerMenuOpen(false);
      if (loginRef.current      && !loginRef.current.contains(e.target as Node))      setLoginOpen(false);
      if (signupRef.current     && !signupRef.current.contains(e.target as Node))     setSignupOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const logout = (type: 'user' | 'pandit' | 'astrologer') => {
    if (type === 'astrologer') {
      localStorage.removeItem('astrologerToken');
      localStorage.removeItem('astrologer');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-change'));
      }
      window.location.href = '/astrologer/login';
      return;
    }

    if (type === 'pandit') {
      localStorage.removeItem('panditToken');
      localStorage.removeItem('pandit');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-change'));
      }
      window.location.href = '/pandit/login';
      return;
    }

    // 1. Clear user localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-change'));
    }

    // 2. Clear all cookies
    document.cookie.split(';').forEach(c => {
      const key = c.trim().split('=')[0];
      document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
      document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${window.location.hostname}`;
    });

    // 3. Call backend logout to clear server-side cookie
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
    fetch(`${apiUrl}/api/logout`, { method: 'GET', credentials: 'include' })
      .finally(() => { window.location.href = '/'; });
  };

  const dashboardHref = (auth.isAdmin || auth.isStaff) ? '/admin/admin-dashboard' : '/dashboard';
  const isActive = (p: string) => pathname === p;

  return (
    <>
      <header
        className={`fixed top-0 w-full z-[100] transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-orange-100 ${
          scrolled ? 'py-1.5 shadow-md shadow-orange-900/5' : 'py-2 shadow-sm'
        }`}
      >
        <div className="container mx-auto px-3 sm:px-6 flex items-center justify-between gap-3">

          {/* Logo */}
          <button onClick={() => safeNavigate('/')} className="flex items-center gap-2.5 group flex-shrink-0 cursor-pointer text-left">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-md border border-[#D4AF37]/60 group-hover:scale-105 transition-transform bg-[#FFF8EE]">
              <Image
                src="/images/ramjikisena_logo.webp"
                alt="राम जी की सेना लोगो"
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <p className="text-sm sm:text-base font-black tracking-tight leading-none text-[#581404]">
                <span className="text-orange-600">JaiShri</span><span>RamNaam</span>
              </p>
              <p className="text-[8px] sm:text-[9px] text-[#8C2206] font-bold tracking-wider uppercase mt-0.5">राम जी की सेना • Jai Shree Ram</p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full p-1 bg-orange-50/70 border border-orange-200/70 shadow-sm shadow-orange-500/5">
            {/* Home Button */}
            <button onClick={() => safeNavigate('/')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive('/')
                  ? 'bg-orange-500 text-white shadow-sm font-black'
                  : 'text-slate-700 hover:text-orange-600 hover:bg-orange-100/70'
              }`}>
              <Home className="w-3.5 h-3.5" /> Home
            </button>

            {mainLinks.map(({ href, label, icon: Icon }) => (
              <button key={href} onClick={() => safeNavigate(href)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive(href)
                    ? 'bg-orange-500 text-white shadow-sm font-black'
                    : 'text-slate-700 hover:text-orange-600 hover:bg-orange-100/70'
                }`}>
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}

            {/* Explore Dropdown */}
            <div className="relative" ref={exploreRef}>
              <button
                onClick={() => { setExploreOpen(o => !o); setUserMenuOpen(false); setLoginOpen(false); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  exploreOpen ? 'bg-orange-200/80 text-orange-900' : 'text-slate-700 hover:text-orange-600 hover:bg-orange-100/70'
                }`}>
                <Compass className="w-3.5 h-3.5" />
                More
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${exploreOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {exploreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      right: '0',
                      width: '600px',
                      maxWidth: 'calc(100vw - 20px)',
                      zIndex: 9999,
                    }}
                  >
                    {/* Arrow pointing to More button */}
                    <div className="flex justify-end pr-8 mb-1">
                      <div className="w-3.5 h-3.5 rotate-45 bg-white border-t border-l border-amber-200" />
                    </div>
                    <div className="rounded-[1.75rem] shadow-2xl overflow-hidden bg-white border border-amber-200 max-h-[calc(100vh-90px)] flex flex-col">
                      
                      {/* Header */}
                      <div className="px-5 py-3 border-b border-amber-100 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 flex items-center justify-between shrink-0">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">समस्त पावन सेवाएं</p>
                          <p className="text-base font-serif font-black text-[#7A1D05]">Explore Devotional Services</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full bg-white text-orange-700 border border-amber-200 shadow-2xs">
                          <span>🚩</span>
                          <span>जय श्री राम</span>
                        </div>
                      </div>

                      {/* Featured Top Sacred Banner with Ramji Photo */}
                      <div className="px-3 pt-3 pb-1 shrink-0">
                        <button
                          onClick={() => safeNavigate('/#jaap')}
                          className="w-full flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-gradient-to-r from-[#FFF5E6] via-[#FFF0DB] to-[#FFF5E6] border border-amber-300/80 hover:border-orange-400 shadow-2xs hover:shadow-md transition-all group text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-amber-300 shadow-2xs shrink-0 bg-amber-100">
                              <Image
                                src="/images/hero-mobile-ramji.webp"
                                alt="Shri Ram"
                                fill
                                unoptimized
                                className="object-cover group-hover:scale-110 transition-transform"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-black text-[#7A1D05] truncate">डिजिटल राम नाम बैंक</span>
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-orange-500 text-white">#1 साधना</span>
                              </div>
                              <p className="text-[11px] text-amber-900/80 truncate">1.42+ करोड़ नाम संचित • 108 मनका पावन माला जाप करें</p>
                            </div>
                          </div>
                          <span className="text-xs font-black text-orange-600 bg-white px-2.5 py-1 rounded-full border border-amber-200 shadow-2xs shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-all flex items-center gap-1">
                            जाप करें <ArrowRight className="w-3 h-3" />
                          </span>
                        </button>
                      </div>

                      {/* Grid with Real Photos for every item */}
                      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto flex-1 overscroll-contain max-h-[360px]">
                        {exploreLinks.map(({ href, label, sub, desc, img, badge }) => (
                          <button
                            key={href}
                            onClick={() => safeNavigate(href)}
                            className="flex items-center gap-2.5 p-2 rounded-xl transition-all group text-left w-full hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50/70 border border-amber-100/70 hover:border-amber-300 bg-white shadow-2xs hover:shadow-xs cursor-pointer active:scale-[0.98]"
                          >
                            {/* Photo Thumbnail */}
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-amber-200 shadow-2xs group-hover:scale-105 transition-transform bg-amber-50">
                              <Image
                                src={img}
                                alt={label}
                                fill
                                unoptimized
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>

                            {/* Text Info */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <p className="text-xs font-black leading-tight text-slate-800 group-hover:text-orange-600 truncate">
                                  {label}
                                </p>
                                {badge && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100/80 text-amber-900 border border-amber-200/80 shrink-0">
                                    {badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] font-semibold text-orange-600/90 leading-tight mt-0.5 truncate">
                                {sub}
                              </p>
                              <p className="text-[10px] leading-tight mt-0.5 text-slate-500 truncate">
                                {desc}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="px-5 py-2.5 flex items-center justify-between border-t border-amber-100 bg-gradient-to-r from-amber-50/60 to-orange-50/60 shrink-0">
                        <p className="text-[11px] font-semibold text-amber-900 flex items-center gap-1">
                          <span>🙏</span>
                          <span>जय श्री राम — सेवा में आपका स्वागत है</span>
                        </p>
                        <button
                          onClick={() => safeNavigate('/dashboard')}
                          className="text-xs font-black flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-sm hover:shadow-md hover:scale-102 transition-all cursor-pointer"
                        >
                          भक्त डैशबोर्ड →
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right: Actions & Auth */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            {/* Quick Search - Commented out as requested
            <button
              onClick={() => safeNavigate('/#explore')}
              title="खोजें / Search"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-all border border-orange-200/80 bg-white shadow-sm cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
            */}

            {showAuthButtons && (
              <div className="hidden lg:flex items-center gap-2">
                {auth.isLoggedIn ? (
                  <div className="relative" ref={userRef}>
                    <button
                      onClick={() => { setUserMenuOpen(o => !o); setExploreOpen(false); }}
                      className="flex items-center gap-2 bg-orange-50/70 border border-orange-200 hover:bg-orange-100/80 transition-all px-3 py-1.5 rounded-full shadow-sm">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black shadow-sm ${auth.isAdmin ? 'bg-orange-600' : auth.isStaff ? 'bg-amber-600' : 'bg-orange-500'}`}>
                        {auth.isAdmin ? <Crown className="w-3.5 h-3.5" /> : auth.isStaff ? <Shield className="w-3.5 h-3.5" /> : auth.userName[0]?.toUpperCase()}
                      </div>
                      <span className="text-slate-800 text-xs font-bold max-w-[100px] truncate">{auth.userName}</span>
                      {auth.isAdmin && <span className="text-[8px] bg-orange-600 text-white px-1.5 py-0.5 rounded-full font-black">ADMIN</span>}
                      {auth.isStaff && <span className="text-[8px] bg-amber-600 text-white px-1.5 py-0.5 rounded-full font-black">STAFF</span>}
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-52 max-h-[calc(100vh-90px)] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 shrink-0">
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
                              {auth.isAdmin ? 'Administrator' : auth.isStaff ? 'Staff Member' : 'Signed in as'}
                            </p>
                            <p className="text-sm font-black text-slate-900 truncate">{auth.userName}</p>
                          </div>
                          <div className="p-1.5 space-y-0.5 overflow-y-auto flex-1">
                            <button onClick={() => safeNavigate(dashboardHref)}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-all">
                              <BarChart3 className="w-4 h-4" />
                              {auth.isAdmin ? 'Admin Dashboard' : auth.isStaff ? 'Staff Portal' : 'Dashboard'}
                            </button>
                            {!auth.isAdmin && !auth.isStaff && (
                              <>
                                <button onClick={() => safeNavigate('/my-bookings')}
                                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-all">
                                  <Calendar className="w-4 h-4" /> My Bookings
                                </button>
                                {/* <button onClick={() => safeNavigate('/samagri/orders')}
                                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-all">
                                  <ShoppingBag className="w-4 h-4" /> My Orders
                                </button> */}
                              </>
                            )}
                          </div>
                          <div className="p-1.5 border-t border-slate-100 shrink-0">
                            <button onClick={() => logout('user')}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all">
                              <LogOut className="w-4 h-4" /> Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : auth.isPanditLoggedIn ? (
                  <div className="relative" ref={panditRef}>
                    <button
                      onClick={() => { setPanditMenuOpen(o => !o); setExploreOpen(false); setUserMenuOpen(false); }}
                      className="flex items-center gap-2 bg-orange-50/90 border border-orange-200 hover:bg-orange-100 hover:border-orange-300 transition-all px-3 py-1.5 rounded-full group shadow-xs cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xs font-black shadow-xs flex-shrink-0">
                        {auth.panditPhoto ? (
                          <img src={auth.panditPhoto} alt={auth.panditName} className="w-full h-full object-cover" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-slate-900 text-xs sm:text-sm font-bold max-w-[120px] truncate group-hover:text-orange-600 transition-colors">
                        {auth.panditName}
                      </span>
                      <span className="text-[9px] bg-gradient-to-r from-red-600 to-orange-600 text-white px-2 py-0.5 rounded-full font-black tracking-wider uppercase shadow-xs">
                        🔱 PANDIT
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-500 group-hover:text-orange-600 transition-transform ${panditMenuOpen ? 'rotate-180 text-orange-600' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {panditMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-60 max-h-[calc(100vh-90px)] flex flex-col bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden z-50"
                        >
                          {/* Header */}
                          <div className="px-4 py-3 border-b border-orange-100 bg-gradient-to-r from-orange-50/80 to-amber-50/80 shrink-0">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                                वैदिक पुरोहित पोर्टल
                              </p>
                              <span className="text-xs">🕉️</span>
                            </div>
                            <p className="text-sm font-black text-slate-900 truncate mt-0.5">{auth.panditName}</p>
                          </div>

                          {/* Menu items */}
                          <div className="p-1.5 space-y-0.5 overflow-y-auto flex-1">
                            <button
                              onClick={() => { setPanditMenuOpen(false); safeNavigate('/pandit/dashboard'); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-all text-left"
                            >
                              <BarChart3 className="w-4 h-4 text-orange-500" />
                              <span>पंडित डैशबोर्ड</span>
                            </button>

                            <button
                              onClick={() => { setPanditMenuOpen(false); safeNavigate('/pandit/bookings'); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-all text-left"
                            >
                              <Calendar className="w-4 h-4 text-amber-500" />
                              <span>पूजा बुकिंग्स</span>
                            </button>

                            <button
                              onClick={() => { setPanditMenuOpen(false); safeNavigate('/pandit/profile'); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-all text-left"
                            >
                              <UserIcon className="w-4 h-4 text-purple-500" />
                              <span>मेरी प्रोफाइल</span>
                            </button>

                            <button
                              onClick={() => { setPanditMenuOpen(false); safeNavigate('/pandit/earnings'); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-all text-left"
                            >
                              <Star className="w-4 h-4 text-emerald-500" />
                              <span>दक्षिणा एवं आय</span>
                            </button>
                          </div>

                          {/* Logout */}
                          <div className="p-1.5 border-t border-slate-100 bg-slate-50/50 shrink-0">
                            <button
                              onClick={() => { setPanditMenuOpen(false); logout('pandit'); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all text-left"
                            >
                              <LogOut className="w-4 h-4 text-red-500" />
                              <span>पंडित लॉगआउट</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : auth.isAstrologerLoggedIn ? (
                  <div className="relative" ref={astrologerRef}>
                    <button
                      onClick={() => { setAstrologerMenuOpen(o => !o); setExploreOpen(false); setUserMenuOpen(false); setPanditMenuOpen(false); }}
                      className="flex items-center gap-2 bg-amber-50/90 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition-all px-3 py-1.5 rounded-full group shadow-xs cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-amber-600 to-amber-700 text-white text-xs font-black shadow-xs flex-shrink-0">
                        {auth.astrologerPhoto ? (
                          <img src={auth.astrologerPhoto} alt={auth.astrologerName} className="w-full h-full object-cover" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-slate-900 text-xs sm:text-sm font-bold max-w-[120px] truncate group-hover:text-amber-700 transition-colors">
                        {auth.astrologerName}
                      </span>
                      <span className="text-[9px] bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 px-2 py-0.5 rounded-full font-black tracking-wider uppercase shadow-xs">
                        🔮 ASTROLOGER
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-500 group-hover:text-amber-600 transition-transform ${astrologerMenuOpen ? 'rotate-180 text-amber-600' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {astrologerMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-60 max-h-[calc(100vh-90px)] flex flex-col bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden z-50"
                        >
                          <div className="px-4 py-3 border-b border-amber-100 bg-gradient-to-r from-amber-50/80 to-yellow-50/80 shrink-0">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">
                                ज्योतिषी एवं टैरो पोर्टल
                              </p>
                              <span className="text-xs">🔮</span>
                            </div>
                            <p className="text-sm font-black text-slate-900 truncate mt-0.5">{auth.astrologerName}</p>
                          </div>

                          <div className="p-1.5 space-y-0.5 overflow-y-auto flex-1">
                            <button
                              onClick={() => { setAstrologerMenuOpen(false); safeNavigate('/astrologer/dashboard'); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition-all text-left"
                            >
                              <BarChart3 className="w-4 h-4 text-amber-600" />
                              <span>ज्योतिषी डैशबोर्ड</span>
                            </button>

                            <button
                              onClick={() => { setAstrologerMenuOpen(false); safeNavigate('/astrology'); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition-all text-left"
                            >
                              <Compass className="w-4 h-4 text-amber-600" />
                              <span>डायरेक्टरी देखें</span>
                            </button>
                          </div>

                          <div className="p-1.5 border-t border-slate-100 bg-slate-50/50 shrink-0">
                            <button
                              onClick={() => { setAstrologerMenuOpen(false); logout('astrologer'); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all text-left"
                            >
                              <LogOut className="w-4 h-4 text-red-500" />
                              <span>ज्योतिषी लॉगआउट</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {/* Login Dropdown */}
                    <div className="relative" ref={loginRef}>
                      <button
                        onClick={() => { setLoginOpen(o => !o); setSignupOpen(false); setExploreOpen(false); }}
                        className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full transition-all cursor-pointer border ${
                          loginOpen
                            ? 'bg-orange-100 text-orange-950 border-orange-300 ring-2 ring-orange-200 shadow-sm'
                            : 'bg-white text-slate-700 border-orange-200 hover:text-orange-600 hover:bg-orange-50 hover:border-orange-300 shadow-xs'
                        }`}
                      >
                        <UserIcon className="w-4 h-4 text-orange-600" />
                        <span>Login</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${loginOpen ? 'rotate-180 text-orange-600' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {loginOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.96 }}
                            transition={{ duration: 0.16 }}
                            style={{
                              position: 'absolute',
                              top: 'calc(100% + 8px)',
                              right: 0,
                              width: '330px',
                              maxWidth: 'calc(100vw - 24px)',
                              zIndex: 9999,
                            }}
                          >
                            {/* Arrow indicator */}
                            <div className="flex justify-end pr-7 mb-1">
                              <div className="w-3 h-3 rotate-45 bg-white border-t border-l border-orange-200" />
                            </div>

                            <div className="rounded-2xl shadow-2xl overflow-hidden max-h-[calc(100vh-90px)] flex flex-col bg-white border border-orange-100">
                              {/* Dropdown Header */}
                              <div className="px-4 py-3 border-b border-orange-100 bg-orange-50/70 flex items-center justify-between shrink-0">
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-wider text-orange-600">
                                    प्रवेश पोर्टल / Login Portals
                                  </p>
                                  <p className="text-xs font-bold text-slate-800">लॉगिन प्रकार चुनें</p>
                                </div>
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white text-orange-700 border border-orange-200 shadow-xs">
                                  🚩 3 Portals
                                </span>
                              </div>

                              {/* Dropdown Options */}
                              <div className="p-2 space-y-1.5 overflow-y-auto flex-1 overscroll-contain">
                                {/* Option 1: User & Admin Login */}
                                <button
                                  onClick={() => safeNavigate('/login')}
                                  className="w-full text-left p-2.5 rounded-xl transition-all group flex items-start gap-3 hover:bg-orange-50/80 border border-transparent hover:border-orange-200 cursor-pointer"
                                >
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform bg-orange-100/80 border border-orange-200 text-orange-600">
                                    <UserIcon className="w-5 h-5 text-orange-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <p className="text-sm font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                                        भक्त / यूजर लॉगिन
                                      </p>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                                      राम नाम जप, प्रोफाइल एवं <span className="text-orange-700 font-bold">Admin</span> लॉगिन
                                    </p>
                                    <div className="flex items-center gap-1 mt-1.5">
                                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                        Devotee
                                      </span>
                                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-800">
                                        👑 Admin
                                      </span>
                                    </div>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all mt-1" />
                                </button>

                                {/* Option 2: Pandit Login */}
                                <button
                                  onClick={() => safeNavigate('/pandit/login')}
                                  className="w-full text-left p-2.5 rounded-xl transition-all group flex items-start gap-3 hover:bg-orange-50/80 border border-transparent hover:border-orange-200 cursor-pointer"
                                >
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform bg-red-50 border border-red-200 text-red-600">
                                    <Flame className="w-5 h-5 text-red-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <p className="text-sm font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                                        पंडित जी लॉगिन
                                      </p>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                                      पूजा-अर्चना, यजमान बुकिंग एवं दक्षिणा पोर्टल
                                    </p>
                                    <div className="flex items-center gap-1 mt-1.5">
                                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800">
                                        🔱 वैदिक पुरोहित
                                      </span>
                                    </div>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all mt-1" />
                                </button>

                                {/* Option 3: Astrologer Login */}
                                <button
                                  onClick={() => safeNavigate('/astrologer/login')}
                                  className="w-full text-left p-2.5 rounded-xl transition-all group flex items-start gap-3 hover:bg-orange-50/80 border border-transparent hover:border-orange-200 cursor-pointer"
                                >
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform bg-amber-50 border border-amber-200 text-amber-600">
                                    <Sparkles className="w-5 h-5 text-amber-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <p className="text-sm font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                                        ज्योतिषी / टैरो रीडर लॉगिन
                                      </p>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                                      कुंडली विश्लेषण, टैरो परामर्श एवं क्लाइंट प्रबंधन
                                    </p>
                                    <div className="flex items-center gap-1 mt-1.5">
                                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                                        🔮 Astrologer Portal
                                      </span>
                                    </div>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all mt-1" />
                                </button>
                              </div>

                              {/* Dropdown Note & Switch to Sign Up */}
                              <div className="px-4 py-2.5 border-t border-orange-100 bg-orange-50/50 text-[11px] flex items-center justify-between text-slate-600">
                                <span>नया खाता बनाना है?</span>
                                <button
                                  onClick={() => { setLoginOpen(false); setSignupOpen(true); }}
                                  className="font-black text-orange-600 hover:text-orange-700 underline cursor-pointer transition-colors"
                                >
                                  साइन अप करें →
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Sign Up Dropdown */}
                    <div className="relative" ref={signupRef}>
                      <button
                        onClick={() => { setSignupOpen(o => !o); setLoginOpen(false); setExploreOpen(false); }}
                        className="font-black px-4 py-1.5 rounded-full text-xs sm:text-sm active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-orange-500/25 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white"
                      >
                        <UserPlus className="w-4 h-4 text-white" />
                        <span>Sign Up</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-white/80 transition-transform duration-200 ${signupOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {signupOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.96 }}
                            transition={{ duration: 0.16 }}
                            style={{
                              position: 'absolute',
                              top: 'calc(100% + 8px)',
                              right: 0,
                              width: '330px',
                              maxWidth: 'calc(100vw - 24px)',
                              zIndex: 9999,
                            }}
                          >
                            {/* Arrow indicator */}
                            <div className="flex justify-end pr-7 mb-1">
                              <div className="w-3 h-3 rotate-45 bg-white border-t border-l border-orange-200" />
                            </div>

                            <div className="rounded-2xl shadow-2xl overflow-hidden max-h-[calc(100vh-90px)] flex flex-col bg-white border border-orange-100">
                              {/* Dropdown Header */}
                              <div className="px-4 py-3 border-b border-orange-100 bg-orange-50/70 flex items-center justify-between shrink-0">
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-wider text-orange-600">
                                    नया खाता / Register Portals
                                  </p>
                                  <p className="text-xs font-bold text-slate-800">पंजीकरण प्रकार चुनें</p>
                                </div>
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white text-orange-700 border border-orange-200 shadow-xs">
                                  ✨ 3 Options
                                </span>
                              </div>

                              {/* Dropdown Options */}
                              <div className="p-2 space-y-1.5 overflow-y-auto flex-1 overscroll-contain">
                                {/* Option 1: Devotee / User Register */}
                                <button
                                  onClick={() => safeNavigate('/register')}
                                  className="w-full text-left p-2.5 rounded-xl transition-all group flex items-start gap-3 hover:bg-orange-50/80 border border-transparent hover:border-orange-200 cursor-pointer"
                                >
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform bg-orange-100/80 border border-orange-200 text-orange-600">
                                    <UserPlus className="w-5 h-5 text-orange-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <p className="text-sm font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                                        भक्त / यूजर पंजीकरण
                                      </p>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                                      राम नाम लिखित जप, व्यक्तिगत प्रोफाइल व समुदाय
                                    </p>
                                    <div className="flex items-center gap-1 mt-1.5">
                                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                        Devotee
                                      </span>
                                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                        निःशुल्क (Free)
                                      </span>
                                    </div>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all mt-1" />
                                </button>

                                {/* Option 2: Pandit Register */}
                                <button
                                  onClick={() => safeNavigate('/pandit/register')}
                                  className="w-full text-left p-2.5 rounded-xl transition-all group flex items-start gap-3 hover:bg-orange-50/80 border border-transparent hover:border-orange-200 cursor-pointer"
                                >
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform bg-red-50 border border-red-200 text-red-600">
                                    <Flame className="w-5 h-5 text-red-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <p className="text-sm font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                                        पंडित जी पंजीकरण
                                      </p>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                                      वैदिक पुरोहित प्रोफाइल, पूजा बुकिंग एवं दक्षिणा प्राप्ति
                                    </p>
                                    <div className="flex items-center gap-1 mt-1.5">
                                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800">
                                        🔱 वैदिक पुरोहित
                                      </span>
                                    </div>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all mt-1" />
                                </button>

                                {/* Option 3: Astrologer Register */}
                                <button
                                  onClick={() => safeNavigate('/astrologer/register')}
                                  className="w-full text-left p-2.5 rounded-xl transition-all group flex items-start gap-3 hover:bg-orange-50/80 border border-transparent hover:border-orange-200 cursor-pointer"
                                >
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform bg-amber-50 border border-amber-200 text-amber-600">
                                    <Sparkles className="w-5 h-5 text-amber-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <p className="text-sm font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                                        ज्योतिषी / टैरो पंजीकरण
                                      </p>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                                      ज्योतिष विशेषज्ञ, टैरो परामर्शदाता व कुंडली सेवाएं
                                    </p>
                                    <div className="flex items-center gap-1 mt-1.5">
                                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                                        🔮 Astrologer & Tarot
                                      </span>
                                    </div>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all mt-1" />
                                </button>
                              </div>

                              {/* Dropdown Note & Switch to Login */}
                              <div className="px-4 py-2.5 border-t border-orange-100 bg-orange-50/50 text-[11px] flex items-center justify-between text-slate-600">
                                <span>पहले से पंजीकृत हैं?</span>
                                <button
                                  onClick={() => { setSignupOpen(false); setLoginOpen(true); }}
                                  className="font-black text-orange-600 hover:text-orange-700 underline cursor-pointer transition-colors"
                                >
                                  लॉगिन करें →
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(o => !o)}
            className="lg:hidden w-9 h-9 flex items-center justify-center bg-orange-50 border border-orange-200 rounded-xl text-slate-700 hover:bg-orange-100 transition-all shadow-sm">
            {mobileOpen ? <X className="w-5 h-5 text-orange-600" /> : <Menu className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[98]" />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 right-0 h-screen w-[85%] max-w-sm bg-white border-l border-orange-100 z-[99] flex flex-col overflow-y-auto shadow-2xl">

              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-orange-100 bg-[#FFF8EE]">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-[#D4AF37] shadow-sm bg-white">
                    <Image
                      src="/images/ramjikisena_logo.webp"
                      alt="राम जी की सेना लोगो"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#581404] leading-none">JaiShri<span className="text-orange-600">RamNaam</span></p>
                    <p className="text-[8px] text-[#8C2206] font-bold tracking-wider uppercase mt-0.5">राम जी की सेना • Jai Shree Ram</p>
                  </div>
                </div>
                <button onClick={() => setMobileOpen(false)} className="w-8 h-8 bg-white border border-orange-200 rounded-xl flex items-center justify-center text-slate-600 shadow-sm">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 p-4 space-y-6">
                {/* Main Links */}
                <div>
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 px-1">Navigation</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => safeNavigate('/')}
                      className={`flex items-center gap-2 p-3 rounded-2xl text-xs font-black transition-all ${
                        isActive('/') ? 'bg-orange-500 text-white shadow-sm' : 'bg-orange-50/70 border border-orange-100 text-slate-700 hover:bg-orange-100'
                      }`}>
                      <Home className="w-4 h-4" /> Home
                    </button>
                    {mainLinks.map(({ href, label, icon: Icon }) => (
                      <button key={href} onClick={() => safeNavigate(href)}
                        className={`flex items-center gap-2 p-3 rounded-2xl text-xs font-black transition-all ${
                          isActive(href) ? 'bg-orange-500 text-white shadow-sm' : 'bg-orange-50/70 border border-orange-100 text-slate-700 hover:bg-orange-100'
                        }`}>
                        <Icon className="w-4 h-4" /> {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Explore */}
                <div>
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 px-1">Explore</p>
                  <div className="grid grid-cols-2 gap-2">
                    {exploreLinks.map(({ href, label, img, icon: Icon }) => (
                      <button key={href} onClick={() => safeNavigate(href)}
                        className="flex items-center gap-2 p-2 rounded-2xl text-xs font-bold bg-white border border-amber-100 text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-all shadow-2xs">
                        {img ? (
                          <div className="relative w-6 h-6 rounded-lg overflow-hidden shrink-0 border border-amber-200">
                            <Image src={img} alt={label} fill unoptimized className="object-cover" />
                          </div>
                        ) : Icon ? (
                          <Icon className="w-4 h-4 text-orange-600" />
                        ) : null}
                        <span className="truncate">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auth */}
                {showAuthButtons && (
                  <div>
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 px-1">Account</p>
                    {auth.isLoggedIn ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 bg-orange-50/80 border border-orange-200 rounded-2xl p-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-xs ${auth.isAdmin ? 'bg-orange-600' : auth.isStaff ? 'bg-amber-600' : 'bg-orange-500'}`}>
                            {auth.isAdmin ? <Crown className="w-4 h-4" /> : auth.isStaff ? <Shield className="w-4 h-4" /> : auth.userName[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-slate-900 text-sm font-black">{auth.userName}</p>
                            {auth.isAdmin && <p className="text-orange-600 text-[10px] font-black uppercase">Admin</p>}
                            {auth.isStaff && <p className="text-amber-600 text-[10px] font-black uppercase">Staff</p>}
                          </div>
                        </div>
                        <button onClick={() => safeNavigate(dashboardHref)}
                          className="w-full flex items-center gap-2 p-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-black shadow-sm">
                          <BarChart3 className="w-4 h-4" /> {auth.isAdmin ? 'Admin Dashboard' : auth.isStaff ? 'Staff Portal' : 'Dashboard'}
                        </button>
                        {!auth.isAdmin && !auth.isStaff && (
                          <button onClick={() => safeNavigate('/my-bookings')}
                            className="w-full flex items-center gap-2 p-3 rounded-2xl bg-white border border-orange-200 text-slate-700 hover:bg-orange-50 text-sm font-bold">
                            <Calendar className="w-4 h-4 text-orange-500" /> My Bookings
                          </button>
                        )}
                        <button onClick={() => logout('user')}
                          className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-sm font-bold transition-all">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    ) : auth.isPanditLoggedIn ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 bg-orange-50/80 border border-orange-200 rounded-2xl p-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-600 text-white text-base font-black flex-shrink-0 shadow-xs">
                            {auth.panditPhoto ? (
                              <img src={auth.panditPhoto} alt={auth.panditName} className="w-full h-full object-cover" />
                            ) : (
                              <span>🔱</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-900 text-sm font-black truncate">{auth.panditName}</p>
                            <p className="text-orange-600 text-[10px] font-black uppercase tracking-wider">वैदिक पुरोहित पोर्टल</p>
                          </div>
                        </div>

                        <button onClick={() => safeNavigate('/pandit/dashboard')}
                          className="w-full flex items-center gap-2.5 p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-black shadow-sm">
                          <BarChart3 className="w-4 h-4" /> पंडित डैशबोर्ड
                        </button>
                        <button onClick={() => safeNavigate('/pandit/bookings')}
                          className="w-full flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-orange-200 text-slate-800 text-sm font-bold hover:bg-orange-50 transition-all">
                          <Calendar className="w-4 h-4 text-amber-500" /> पूजा बुकिंग्स
                        </button>
                        <button onClick={() => safeNavigate('/pandit/profile')}
                          className="w-full flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-orange-200 text-slate-800 text-sm font-bold hover:bg-orange-50 transition-all">
                          <UserIcon className="w-4 h-4 text-purple-500" /> मेरी प्रोफाइल
                        </button>
                        <button onClick={() => safeNavigate('/pandit/earnings')}
                          className="w-full flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-orange-200 text-slate-800 text-sm font-bold hover:bg-orange-50 transition-all">
                          <Star className="w-4 h-4 text-emerald-500" /> दक्षिणा एवं आय
                        </button>

                        <button onClick={() => logout('pandit')}
                          className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-sm font-bold transition-all">
                          <LogOut className="w-4 h-4" /> पंडित लॉगआउट
                        </button>
                      </div>
                    ) : auth.isAstrologerLoggedIn ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 bg-amber-50/80 border border-amber-200 rounded-2xl p-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-amber-600 to-yellow-600 text-white text-base font-black flex-shrink-0 shadow-xs">
                            {auth.astrologerPhoto ? (
                              <img src={auth.astrologerPhoto} alt={auth.astrologerName} className="w-full h-full object-cover" />
                            ) : (
                              <span>🔮</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-900 text-sm font-black truncate">{auth.astrologerName}</p>
                            <p className="text-amber-700 text-[10px] font-black uppercase tracking-wider">ज्योतिषी / टैरो पोर्टल</p>
                          </div>
                        </div>

                        <button onClick={() => safeNavigate('/astrologer/dashboard')}
                          className="w-full flex items-center gap-2.5 p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-sm font-black shadow-sm">
                          <BarChart3 className="w-4 h-4" /> ज्योतिषी डैशबोर्ड
                        </button>
                        <button onClick={() => safeNavigate('/astrology')}
                          className="w-full flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-amber-200 text-slate-800 text-sm font-bold hover:bg-amber-50 transition-all">
                          <Compass className="w-4 h-4 text-amber-600" /> डायरेक्टरी देखें
                        </button>

                        <button onClick={() => logout('astrologer')}
                          className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-sm font-bold transition-all">
                          <LogOut className="w-4 h-4" /> ज्योतिषी लॉगआउट
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Mobile Tab Switcher */}
                        <div className="flex bg-orange-50 p-1 rounded-2xl border border-orange-200">
                          <button
                            type="button"
                            onClick={() => setMobileAuthTab('login')}
                            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              mobileAuthTab === 'login'
                                ? 'bg-orange-500 text-white shadow-sm'
                                : 'text-slate-700 hover:text-orange-600'
                            }`}
                          >
                            <UserIcon className="w-3.5 h-3.5" />
                            लॉगिन (Login)
                          </button>
                          <button
                            type="button"
                            onClick={() => setMobileAuthTab('register')}
                            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              mobileAuthTab === 'register'
                                ? 'bg-orange-500 text-white shadow-sm'
                                : 'text-slate-700 hover:text-orange-600'
                            }`}
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            साइन अप (Sign Up)
                          </button>
                        </div>

                        {mobileAuthTab === 'login' ? (
                          <div className="bg-white border border-orange-200 rounded-2xl p-3 space-y-2 shadow-xs">
                            <p className="text-[10px] font-black uppercase tracking-wider text-orange-600">
                              लॉगिन पोर्टल चुनें / Select Login
                            </p>

                            {/* Mobile User / Admin Login */}
                            <button
                              onClick={() => safeNavigate('/login')}
                              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-orange-50/70 hover:bg-orange-100/80 border border-orange-200/80 text-left active:scale-98 transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
                                  <UserIcon className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-xs font-black text-slate-900">भक्त / यूजर लॉगिन</p>
                                  <p className="text-[10px] text-slate-500">भक्त एवं Admin लॉगिन</p>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-orange-700 bg-white border border-orange-200 px-2 py-0.5 rounded shadow-2xs">
                                Devotee & Admin →
                              </span>
                            </button>

                            {/* Mobile Pandit Login */}
                            <button
                              onClick={() => safeNavigate('/pandit/login')}
                              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-red-50/60 hover:bg-red-100/80 border border-red-200/80 text-left active:scale-98 transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-red-100 border border-red-200 flex items-center justify-center text-red-600">
                                  <Flame className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-xs font-black text-slate-900">पंडित जी लॉगिन</p>
                                  <p className="text-[10px] text-slate-500">वैदिक पुरोहित पोर्टल</p>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-red-700 bg-white border border-red-200 px-2 py-0.5 rounded shadow-2xs">
                                Pandit Portal →
                              </span>
                            </button>

                            {/* Mobile Astrologer Login */}
                            <button
                              onClick={() => safeNavigate('/astrologer/login')}
                              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200/80 text-left active:scale-98 transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600">
                                  <Sparkles className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-xs font-black text-slate-900">ज्योतिषी / टैरो लॉगिन</p>
                                  <p className="text-[10px] text-slate-500">ज्योतिषी & टैरो पोर्टल</p>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-amber-800 bg-white border border-amber-200 px-2 py-0.5 rounded shadow-2xs">
                                Astro Portal →
                              </span>
                            </button>

                            <div className="pt-1 text-center">
                              <button
                                onClick={() => setMobileAuthTab('register')}
                                className="text-[11px] text-orange-600 font-bold hover:underline cursor-pointer"
                              >
                                नया खाता बनाना है? साइन अप करें →
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white border border-orange-200 rounded-2xl p-3 space-y-2 shadow-xs">
                            <p className="text-[10px] font-black uppercase tracking-wider text-orange-600">
                              नया पंजीकरण चुनें / Select Sign Up
                            </p>

                            {/* Mobile User Register */}
                            <button
                              onClick={() => safeNavigate('/register')}
                              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-orange-50/70 hover:bg-orange-100/80 border border-orange-200/80 text-left active:scale-98 transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
                                  <UserPlus className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-xs font-black text-slate-900">भक्त / यूजर पंजीकरण</p>
                                  <p className="text-[10px] text-slate-500">राम नाम जप एवं प्रोफाइल</p>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-700 bg-white border border-emerald-200 px-2 py-0.5 rounded shadow-2xs">
                                निःशुल्क Register →
                              </span>
                            </button>

                            {/* Mobile Pandit Register */}
                            <button
                              onClick={() => safeNavigate('/pandit/register')}
                              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-red-50/60 hover:bg-red-100/80 border border-red-200/80 text-left active:scale-98 transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-red-100 border border-red-200 flex items-center justify-center text-red-600">
                                  <Flame className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-xs font-black text-slate-900">पंडित जी पंजीकरण</p>
                                  <p className="text-[10px] text-slate-500">वैदिक पुरोहित प्रोफाइल</p>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-red-700 bg-white border border-red-200 px-2 py-0.5 rounded shadow-2xs">
                                Pandit Register →
                              </span>
                            </button>

                            {/* Mobile Astrologer Register */}
                            <button
                              onClick={() => safeNavigate('/astrologer/register')}
                              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200/80 text-left active:scale-98 transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600">
                                  <Sparkles className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-xs font-black text-slate-900">ज्योतिषी / टैरो पंजीकरण</p>
                                  <p className="text-[10px] text-slate-500">परामर्शदाता प्रोफाइल</p>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-amber-800 bg-white border border-amber-200 px-2 py-0.5 rounded shadow-2xs">
                                Astro Register →
                              </span>
                            </button>

                            <div className="pt-1 text-center">
                              <button
                                onClick={() => setMobileAuthTab('login')}
                                className="text-[11px] text-orange-600 font-bold hover:underline cursor-pointer"
                              >
                                पहले से खाता है? लॉगिन करें →
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
