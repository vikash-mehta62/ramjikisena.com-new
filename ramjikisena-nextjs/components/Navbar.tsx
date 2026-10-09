'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, BookOpen, Church, Scroll, User as UserIcon,
  Image as ImageIcon, Phone, Calendar, BarChart3, Flag,
  Sparkles, ShoppingBag, Users, HelpCircle, Compass,
  LogOut, Crown, Menu, X, Star, MessageSquare, Home,
  Flame, Shield, ArrowRight
} from 'lucide-react';
import { requestGlobalNavigation } from '@/lib/jaapContext';
interface NavbarProps { showAuthButtons?: boolean; }

const exploreLinks = [
  { href: '/katha-vachaks', label: 'कथा वाचक',       icon: Scroll,       desc: 'Find katha vachaks',            color: 'text-purple-600 bg-purple-50' },
  { href: '/forum',         label: 'फोरम',            icon: HelpCircle,   desc: 'Ask spiritual questions',       color: 'text-teal-600 bg-teal-50' },
  { href: '/gallery',       label: 'गैलरी',           icon: ImageIcon,    desc: 'Divine moments & events',       color: 'text-pink-600 bg-pink-50' },
  { href: '/glory',         label: 'राम महिमा',       icon: Star,         desc: 'Glory of Ram Naam',             color: 'text-amber-600 bg-amber-50' },
  { href: '/mission',       label: 'हमारा मिशन',      icon: Flag,         desc: 'Our spiritual mission',         color: 'text-red-600 bg-red-50' },
  { href: '/about',         label: 'हमारे बारे में',  icon: BookOpen,     desc: 'About Jai Shri Ram Naam',       color: 'text-indigo-600 bg-indigo-50' },
  { href: '/contact',       label: 'संपर्क',          icon: Phone,        desc: 'Get in touch with us',          color: 'text-slate-600 bg-slate-50' },
  { href: '/blogs',         label: 'ब्लॉग',           icon: MessageSquare,desc: 'Spiritual blogs & articles',    color: 'text-cyan-600 bg-cyan-50' },
];

const mainLinks = [
  { href: '/mandirs',   label: 'Mandirs',   icon: Church },
  { href: '/pandits',   label: 'Pandits',   icon: Sparkles },
  { href: '/samagri',   label: 'Samagri',   icon: ShoppingBag },
  { href: '/community', label: 'Community', icon: Users },
];

export default function Navbar({ showAuthButtons = true }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navigate = (href: string) => {
    router.push(href);
    setExploreOpen(false);
    setUserMenuOpen(false);
    setLoginOpen(false);
    setMobileOpen(false);
  };

  const safeNavigate = (href: string) => {
    requestGlobalNavigation(href, navigate);
    setExploreOpen(false);
    setUserMenuOpen(false);
    setLoginOpen(false);
    setMobileOpen(false);
  };

  const [auth, setAuth] = useState({
    isLoggedIn: false,
    isPanditLoggedIn: false,
    userName: '',
    panditName: '',
    isAdmin: false,
    isStaff: false,
    panditPhoto: '',
  });
  const isHomePage = pathname === '/';
  const [scrolled, setScrolled]           = useState(false);
  const [exploreOpen, setExploreOpen]     = useState(false);
  const [userMenuOpen, setUserMenuOpen]   = useState(false);
  const [panditMenuOpen, setPanditMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen]         = useState(false);
  const [mobileOpen, setMobileOpen]       = useState(false);

  const exploreRef = useRef<HTMLDivElement>(null);
  const userRef    = useRef<HTMLDivElement>(null);
  const panditRef  = useRef<HTMLDivElement>(null);
  const loginRef   = useRef<HTMLDivElement>(null);

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
        const user      = JSON.parse(localStorage.getItem('user')   || '{}');
        const pandit    = JSON.parse(localStorage.getItem('pandit') || '{}');
        setAuth({
          isLoggedIn:       !!token,
          isPanditLoggedIn: !!panditTok,
          userName:         user.name   || 'User',
          panditName:       pandit.name || 'पंडित जी',
          isAdmin:          user.role   === 'admin',
          isStaff:          user.role   === 'staff' || user.role === 'subadmin',
          panditPhoto:      pandit.photo || '',
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
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) setExploreOpen(false);
      if (userRef.current    && !userRef.current.contains(e.target as Node))    setUserMenuOpen(false);
      if (panditRef.current  && !panditRef.current.contains(e.target as Node))  setPanditMenuOpen(false);
      if (loginRef.current   && !loginRef.current.contains(e.target as Node))   setLoginOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const logout = (type: 'user' | 'pandit') => {
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
        className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
          isHomePage
            ? scrolled ? 'py-2 shadow-2xl shadow-black/40' : 'bg-transparent py-4'
            : 'py-3 shadow-lg'
        }`}
        style={
          !isHomePage
            ? { background: 'rgba(15,5,0,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(200,130,0,0.2)' }
            : scrolled
            ? { background: 'rgba(15,5,0,0.96)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(200,130,0,0.15)' }
            : {}
        }
      >
        <div className="container mx-auto px-5 flex items-center justify-between gap-4">

          {/* Logo */}
          <button onClick={() => safeNavigate('/')} className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, #f9e07a 0%, #d4920a 60%, #b8760a 100%)', boxShadow: '0 4px 12px rgba(180,100,0,0.4)' }}>
              <Flag className="w-5 h-5" style={{ color: '#5a1a00' }} />
            </div>
            <div className="hidden sm:block">
              <p className="text-base font-black tracking-tighter text-white leading-none">
                JAI SHRI <span style={{ color: '#f9e07a' }}>RAM NAAM</span>
              </p>
              <p className="text-[9px] text-white/40 tracking-[0.2em] uppercase">Spiritual Portal</p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 rounded-2xl p-1 backdrop-blur-md"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,130,0,0.2)' }}>

            {/* Home Button */}
            <button onClick={() => safeNavigate('/')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isActive('/')
                  ? 'text-white shadow-lg'
                  : 'text-white/75 hover:text-white hover:bg-white/10'
              }`}
              style={isActive('/') ? {
                background: 'linear-gradient(135deg, #d4920a, #f9e07a, #b8760a)',
                color: '#3a0f00',
              } : {}}>
              <Home className="w-3.5 h-3.5" /> Home
            </button>

            {mainLinks.map(({ href, label, icon: Icon }) => (
              <button key={href} onClick={() => safeNavigate(href)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive(href)
                    ? 'text-white shadow-lg'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
                style={isActive(href) ? {
                  background: 'linear-gradient(135deg, #d4920a, #f9e07a, #b8760a)',
                  color: '#3a0f00',
                } : {}}>
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}

            {/* Explore Dropdown */}
            <div className="relative" ref={exploreRef}>
              <button
                onClick={() => { setExploreOpen(o => !o); setUserMenuOpen(false); setLoginOpen(false); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  exploreOpen ? 'bg-white/15 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}>
                <Compass className="w-3.5 h-3.5" />
                Explore
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${exploreOpen ? 'rotate-180' : ''}`} />
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
                      width: '420px',
                      zIndex: 9999,
                    }}
                  >
                    {/* Arrow pointing to Explore button */}
                    <div className="flex justify-end pr-8 mb-1">
                      <div className="w-3 h-3 rotate-45" style={{ background: 'rgba(15,5,0,0.97)', border: '1px solid rgba(200,130,0,0.3)', borderBottom: 'none', borderRight: 'none' }} />
                    </div>
                    <div className="rounded-[1.5rem] shadow-2xl overflow-hidden"
                      style={{ background: 'rgba(15,5,0,0.97)', border: '1px solid rgba(200,130,0,0.3)', backdropFilter: 'blur(20px)' }}>
                      {/* Header */}
                      <div className="px-4 py-3 border-b"
                        style={{ borderColor: 'rgba(200,130,0,0.2)', background: 'rgba(212,146,10,0.08)' }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: 'rgba(249,224,122,0.5)' }}>सभी सेवाएं</p>
                            <p className="text-sm font-black text-white">Explore Everything</p>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
                            style={{ background: 'rgba(212,146,10,0.15)', color: '#f9e07a', border: '1px solid rgba(212,146,10,0.3)' }}>
                            🚩 Jai Shri Ram Naam
                          </div>
                        </div>
                      </div>

                      {/* Grid */}
                      <div className="p-3 grid grid-cols-4 gap-1.5">
                        {exploreLinks.map(({ href, label, icon: Icon, desc }) => (
                          <button key={href} onClick={() => safeNavigate(href)}
                            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all group text-center w-full"
                            style={{ border: '1px solid transparent' }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,146,10,0.12)';
                              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,146,10,0.25)';
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                              (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent';
                            }}>
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                              style={{ background: 'rgba(212,146,10,0.15)', border: '1px solid rgba(212,146,10,0.25)' }}>
                              <Icon className="w-4 h-4" style={{ color: '#f9e07a' }} />
                            </div>
                            <div>
                              <p className="text-xs font-black leading-tight transition-colors" style={{ color: '#fff' }}>{label}</p>
                              <p className="text-[10px] leading-tight mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-2.5 flex items-center justify-between"
                        style={{ borderTop: '1px solid rgba(200,130,0,0.2)', background: 'rgba(212,146,10,0.05)' }}>
                        <p className="text-[10px] font-medium" style={{ color: 'rgba(249,224,122,0.5)' }}>🙏 जय श्री राम — सेवा में आपका स्वागत है</p>
                        <button onClick={() => safeNavigate('/dashboard')}
                          className="text-[10px] font-black flex items-center gap-1 px-2.5 py-1 rounded-full transition-all"
                          style={{ color: '#f9e07a', background: 'rgba(212,146,10,0.15)', border: '1px solid rgba(212,146,10,0.3)' }}>
                          Dashboard →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right: Auth */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            {showAuthButtons && (
              <>
                {auth.isLoggedIn ? (
                  <div className="relative" ref={userRef}>
                    <button
                      onClick={() => { setUserMenuOpen(o => !o); setExploreOpen(false); }}
                      className="flex items-center gap-2 bg-white/10 border border-white/15 hover:bg-white/15 transition-all px-3 py-2 rounded-2xl">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-black ${auth.isAdmin ? 'bg-orange-600' : auth.isStaff ? 'bg-amber-600' : 'bg-white/20'}`}>
                        {auth.isAdmin ? <Crown className="w-4 h-4" /> : auth.isStaff ? <Shield className="w-4 h-4" /> : auth.userName[0]?.toUpperCase()}
                      </div>
                      <span className="text-white text-sm font-bold max-w-[100px] truncate">{auth.userName}</span>
                      {auth.isAdmin && <span className="text-[9px] bg-orange-600 text-white px-1.5 py-0.5 rounded-full font-black">ADMIN</span>}
                      {auth.isStaff && <span className="text-[9px] bg-amber-600 text-white px-1.5 py-0.5 rounded-full font-black">STAFF</span>}
                      <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
                              {auth.isAdmin ? 'Administrator' : auth.isStaff ? 'Staff Member' : 'Signed in as'}
                            </p>
                            <p className="text-sm font-black text-slate-900 truncate">{auth.userName}</p>
                          </div>
                          <div className="p-1.5 space-y-0.5">
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
                                <button onClick={() => safeNavigate('/samagri/orders')}
                                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-all">
                                  <ShoppingBag className="w-4 h-4" /> My Orders
                                </button>
                              </>
                            )}
                          </div>
                          <div className="p-1.5 border-t border-slate-100">
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
                      className="flex items-center gap-2 bg-white/10 border border-orange-500/35 hover:bg-white/15 hover:border-orange-400/60 transition-all px-3 py-1.5 rounded-2xl group shadow-lg shadow-black/30"
                    >
                      <div className="w-7 h-7 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xs font-black shadow-md flex-shrink-0">
                        {auth.panditPhoto ? (
                          <img src={auth.panditPhoto} alt={auth.panditName} className="w-full h-full object-cover" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-white text-sm font-bold max-w-[110px] truncate group-hover:text-amber-300 transition-colors">
                        {auth.panditName}
                      </span>
                      <span className="text-[9px] bg-gradient-to-r from-red-600 to-orange-600 text-white px-1.5 py-0.5 rounded-full font-black tracking-wider uppercase shadow-sm">
                        🔱 PANDIT
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-white/70 transition-transform ${panditMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {panditMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden z-50"
                        >
                          {/* Header */}
                          <div className="px-4 py-3 border-b border-orange-100 bg-gradient-to-r from-orange-50/80 to-amber-50/80">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                                वैदिक पुरोहित पोर्टल
                              </p>
                              <span className="text-xs">🕉️</span>
                            </div>
                            <p className="text-sm font-black text-slate-900 truncate mt-0.5">{auth.panditName}</p>
                          </div>

                          {/* Menu items */}
                          <div className="p-1.5 space-y-0.5">
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
                          <div className="p-1.5 border-t border-slate-100 bg-slate-50/50">
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
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="relative" ref={loginRef}>
                      <button
                        onClick={() => { setLoginOpen(o => !o); setExploreOpen(false); }}
                        className={`flex items-center gap-1.5 text-sm font-bold px-3.5 py-2 rounded-xl transition-all ${
                          loginOpen
                            ? 'bg-white/15 text-white ring-1 ring-amber-400/40'
                            : 'text-white/90 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <UserIcon className="w-4 h-4 text-amber-300" />
                        <span>Login</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-amber-300/80 transition-transform duration-200 ${loginOpen ? 'rotate-180' : ''}`} />
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
                              zIndex: 9999,
                            }}
                          >
                            {/* Arrow indicator */}
                            <div className="flex justify-end pr-7 mb-1">
                              <div
                                className="w-3 h-3 rotate-45"
                                style={{
                                  background: 'rgba(15,5,0,0.98)',
                                  border: '1px solid rgba(212,146,10,0.3)',
                                  borderBottom: 'none',
                                  borderRight: 'none',
                                }}
                              />
                            </div>

                            <div
                              className="rounded-2xl shadow-2xl overflow-hidden"
                              style={{
                                background: 'rgba(15,5,0,0.98)',
                                border: '1px solid rgba(212,146,10,0.3)',
                                backdropFilter: 'blur(24px)',
                                boxShadow: '0 20px 45px rgba(0,0,0,0.7)',
                              }}
                            >
                              {/* Dropdown Header */}
                              <div
                                className="px-4 py-3 border-b flex items-center justify-between"
                                style={{
                                  borderColor: 'rgba(212,146,10,0.2)',
                                  background: 'rgba(212,146,10,0.08)',
                                }}
                              >
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-wider text-amber-400/80">
                                    प्रवेश पोर्टल / Login Portals
                                  </p>
                                  <p className="text-xs font-bold text-white">लॉगिन प्रकार चुनें</p>
                                </div>
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                  🚩 2 Portals
                                </span>
                              </div>

                              {/* Dropdown Options */}
                              <div className="p-2 space-y-1.5">
                                {/* Option 1: User & Admin Login */}
                                <button
                                  onClick={() => safeNavigate('/login')}
                                  className="w-full text-left p-3 rounded-xl transition-all group flex items-start gap-3 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/30"
                                >
                                  <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"
                                    style={{
                                      background: 'linear-gradient(135deg, rgba(249,224,122,0.2), rgba(212,146,10,0.25))',
                                      border: '1px solid rgba(249,224,122,0.35)',
                                    }}
                                  >
                                    <UserIcon className="w-5 h-5 text-amber-300" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <p className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                                        भक्त / यूजर लॉगिन
                                      </p>
                                    </div>
                                    <p className="text-[11px] text-white/50 leading-snug mt-0.5">
                                      राम नाम जप, प्रोफाइल एवं <span className="text-amber-300 font-bold">Admin</span> लॉगिन
                                    </p>
                                    <div className="flex items-center gap-1 mt-1.5">
                                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                                        Devotee
                                      </span>
                                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                                        👑 Admin
                                      </span>
                                    </div>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all mt-1" />
                                </button>

                                {/* Option 2: Pandit Login */}
                                <button
                                  onClick={() => safeNavigate('/pandit/login')}
                                  className="w-full text-left p-3 rounded-xl transition-all group flex items-start gap-3 hover:bg-red-500/10 border border-transparent hover:border-red-500/30"
                                >
                                  <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"
                                    style={{
                                      background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(249,115,22,0.25))',
                                      border: '1px solid rgba(249,115,22,0.35)',
                                    }}
                                  >
                                    <Flame className="w-5 h-5 text-orange-400" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <p className="text-sm font-black text-white group-hover:text-orange-400 transition-colors">
                                        पंडित जी लॉगिन
                                      </p>
                                    </div>
                                    <p className="text-[11px] text-white/50 leading-snug mt-0.5">
                                      पूजा-अर्चना, यजमान बुकिंग एवं दक्षिणा पोर्टल
                                    </p>
                                    <div className="flex items-center gap-1 mt-1.5">
                                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300">
                                        🔱 वैदिक पुरोहित
                                      </span>
                                    </div>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all mt-1" />
                                </button>
                              </div>

                              {/* Dropdown Note */}
                              <div
                                className="px-4 py-2 border-t text-[10px] leading-tight flex items-center gap-1.5"
                                style={{
                                  borderColor: 'rgba(212,146,10,0.15)',
                                  background: 'rgba(212,146,10,0.05)',
                                  color: 'rgba(255,200,120,0.75)',
                                }}
                              >
                                <span>🛡️</span>
                                <span>व्यवस्थापक (Admin) <strong>User Login</strong> से ही प्रवेश करें</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button onClick={() => safeNavigate('/register')}
                      className="font-black px-4 py-2 rounded-xl text-sm active:scale-95 transition-all"
                      style={{
                        background: 'linear-gradient(135deg, #f9e07a 0%, #d4920a 50%, #b8760a 100%)',
                        color: '#3a0f00',
                        boxShadow: '0 4px 14px rgba(180,100,0,0.35)',
                      }}>
                      Sign Up
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(o => !o)}
            className="lg:hidden w-10 h-10 flex items-center justify-center bg-white/10 border border-white/15 rounded-xl text-white hover:bg-white/15 transition-all">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[98]" />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 right-0 h-screen w-[85%] max-w-sm bg-slate-950 border-l border-white/10 z-[99] flex flex-col overflow-y-auto">

              {/* Mobile Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center">
                    <Flag className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-black text-white">JAI SHRI <span className="text-orange-500">RAM NAAM</span></p>
                </div>
                <button onClick={() => setMobileOpen(false)} className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 p-4 space-y-6">
                {/* Main Links */}
                <div>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.25em] mb-2 px-1">Main</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => safeNavigate('/')}
                      className={`flex items-center gap-2 p-3 rounded-2xl text-sm font-bold transition-all ${
                        isActive('/') ? 'bg-orange-600 text-white' : 'bg-white/5 text-white/80 hover:bg-white/10'
                      }`}>
                      <Home className="w-4 h-4" /> Home
                    </button>
                    {mainLinks.map(({ href, label, icon: Icon }) => (
                      <button key={href} onClick={() => safeNavigate(href)}
                        className={`flex items-center gap-2 p-3 rounded-2xl text-sm font-bold transition-all ${
                          isActive(href) ? 'bg-orange-600 text-white' : 'bg-white/5 text-white/80 hover:bg-white/10'
                        }`}>
                        <Icon className="w-4 h-4" /> {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Explore */}
                <div>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.25em] mb-2 px-1">Explore</p>
                  <div className="grid grid-cols-2 gap-2">
                    {exploreLinks.map(({ href, label, icon: Icon }) => (
                      <button key={href} onClick={() => safeNavigate(href)}
                        className="flex items-center gap-2 p-3 rounded-2xl text-sm font-bold bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all">
                        <Icon className="w-4 h-4" /> {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auth */}
                {showAuthButtons && (
                  <div>
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.25em] mb-2 px-1">Account</p>
                    {auth.isLoggedIn ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black ${auth.isAdmin ? 'bg-orange-600' : auth.isStaff ? 'bg-amber-600' : 'bg-white/20'}`}>
                            {auth.isAdmin ? <Crown className="w-4 h-4" /> : auth.isStaff ? <Shield className="w-4 h-4" /> : auth.userName[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white text-sm font-black">{auth.userName}</p>
                            {auth.isAdmin && <p className="text-orange-400 text-[10px] font-black uppercase">Admin</p>}
                            {auth.isStaff && <p className="text-amber-400 text-[10px] font-black uppercase">Staff</p>}
                          </div>
                        </div>
                        <button onClick={() => safeNavigate(dashboardHref)}
                          className="w-full flex items-center gap-2 p-3 rounded-2xl bg-orange-600 text-white text-sm font-black">
                          <BarChart3 className="w-4 h-4" /> {auth.isAdmin ? 'Admin Dashboard' : auth.isStaff ? 'Staff Portal' : 'Dashboard'}
                        </button>
                        {!auth.isAdmin && !auth.isStaff && (
                          <button onClick={() => safeNavigate('/my-bookings')}
                            className="w-full flex items-center gap-2 p-3 rounded-2xl bg-white/5 text-white/80 text-sm font-bold">
                            <Calendar className="w-4 h-4" /> My Bookings
                          </button>
                        )}
                        <button onClick={() => logout('user')}
                          className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500 hover:text-white transition-all">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    ) : auth.isPanditLoggedIn ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 bg-gradient-to-r from-red-950/40 to-orange-950/40 border border-orange-500/25 rounded-2xl p-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-600 text-white text-base font-black flex-shrink-0 shadow-md">
                            {auth.panditPhoto ? (
                              <img src={auth.panditPhoto} alt={auth.panditName} className="w-full h-full object-cover" />
                            ) : (
                              <span>🔱</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-black truncate">{auth.panditName}</p>
                            <p className="text-orange-400 text-[10px] font-black uppercase tracking-wider">वैदिक पुरोहित पोर्टल</p>
                          </div>
                        </div>

                        <button onClick={() => safeNavigate('/pandit/dashboard')}
                          className="w-full flex items-center gap-2.5 p-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white text-sm font-black shadow-lg">
                          <BarChart3 className="w-4 h-4" /> पंडित डैशबोर्ड
                        </button>
                        <button onClick={() => safeNavigate('/pandit/bookings')}
                          className="w-full flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-white/90 text-sm font-bold hover:bg-white/10 transition-all">
                          <Calendar className="w-4 h-4 text-amber-300" /> पूजा बुकिंग्स
                        </button>
                        <button onClick={() => safeNavigate('/pandit/profile')}
                          className="w-full flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-white/90 text-sm font-bold hover:bg-white/10 transition-all">
                          <UserIcon className="w-4 h-4 text-purple-300" /> मेरी प्रोफाइल
                        </button>
                        <button onClick={() => safeNavigate('/pandit/earnings')}
                          className="w-full flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-white/90 text-sm font-bold hover:bg-white/10 transition-all">
                          <Star className="w-4 h-4 text-emerald-300" /> दक्षिणा एवं आय
                        </button>

                        <button onClick={() => logout('pandit')}
                          className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500 hover:text-white transition-all">
                          <LogOut className="w-4 h-4" /> पंडित लॉगआउट
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-wider text-amber-300/80">
                            लॉगिन पोर्टल चुनें / Select Login
                          </p>

                          {/* Mobile User / Admin Login */}
                          <button
                            onClick={() => safeNavigate('/login')}
                            className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-left text-white active:scale-98 transition-all"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300">
                                <UserIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-xs font-black text-white">भक्त / यूजर लॉगिन</p>
                                <p className="text-[10px] text-white/50">भक्त एवं Admin लॉगिन</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded">
                              Devotee & Admin →
                            </span>
                          </button>

                          {/* Mobile Pandit Login */}
                          <button
                            onClick={() => safeNavigate('/pandit/login')}
                            className="w-full flex items-center justify-between p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-left text-white active:scale-98 transition-all"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-orange-400">
                                <Flame className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-xs font-black text-white">पंडित जी लॉगिन</p>
                                <p className="text-[10px] text-white/50">वैदिक पुरोहित पोर्टल</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-orange-400 bg-red-500/15 px-2 py-0.5 rounded">
                              Pandit Portal →
                            </span>
                          </button>
                        </div>

                        {/* Sign up buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => safeNavigate('/register')}
                            className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs text-center shadow-lg"
                          >
                            भक्त Sign Up ✨
                          </button>
                          <button
                            onClick={() => safeNavigate('/pandit/register')}
                            className="p-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs text-center border border-white/10"
                          >
                            पंडित रजिस्ट्रेशन 🕉️
                          </button>
                        </div>
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
