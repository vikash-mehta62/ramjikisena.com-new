'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, BookOpen, Church, Scroll, User as UserIcon,
  Image as ImageIcon, Phone, Calendar, BarChart3, Flag,
  Sparkles, ShoppingBag, Users, HelpCircle, Compass,
  LogOut, Crown, Menu, X, Star, MessageSquare
} from 'lucide-react';
import { requestGlobalNavigation } from '@/lib/jaapContext';
interface NavbarProps { showAuthButtons?: boolean; }

const exploreLinks = [
  { href: '/mandirs',       label: 'मंदिर दर्शन',    icon: Church,       desc: 'Explore divine temples',        color: 'text-orange-600 bg-orange-50' },
  { href: '/pandits',       label: 'पंडित बुकिंग',   icon: Sparkles,     desc: 'Book experienced pandits',      color: 'text-yellow-600 bg-yellow-50' },
  { href: '/katha-vachaks', label: 'कथा वाचक',       icon: Scroll,       desc: 'Find katha vachaks',            color: 'text-purple-600 bg-purple-50' },
  { href: '/samagri',       label: 'पूजन सामग्री',   icon: ShoppingBag,  desc: 'Order puja samagri',            color: 'text-green-600 bg-green-50' },
  { href: '/community',     label: 'भक्त समुदाय',    icon: Users,        desc: 'Connect with devotees',         color: 'text-blue-600 bg-blue-50' },
  { href: '/forum',         label: 'फोरम',            icon: HelpCircle,   desc: 'Ask spiritual questions',       color: 'text-teal-600 bg-teal-50' },
  { href: '/gallery',       label: 'गैलरी',           icon: ImageIcon,    desc: 'Divine moments & events',       color: 'text-pink-600 bg-pink-50' },
  { href: '/glory',         label: 'राम महिमा',       icon: Star,         desc: 'Glory of Ram Naam',             color: 'text-amber-600 bg-amber-50' },
  { href: '/mission',       label: 'हमारा मिशन',      icon: Flag,         desc: 'Our spiritual mission',         color: 'text-red-600 bg-red-50' },
  { href: '/about',         label: 'हमारे बारे में',  icon: BookOpen,     desc: 'About Ramji Ki Sena',           color: 'text-indigo-600 bg-indigo-50' },
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
    isLoggedIn: false, isPanditLoggedIn: false,
    userName: '', panditName: '', isAdmin: false,
  });
  const isHomePage = pathname === '/';
  const [scrolled, setScrolled]           = useState(false);
  const [exploreOpen, setExploreOpen]     = useState(false);
  const [userMenuOpen, setUserMenuOpen]   = useState(false);
  const [loginOpen, setLoginOpen]         = useState(false);
  const [mobileOpen, setMobileOpen]       = useState(false);

  const exploreRef  = useRef<HTMLDivElement>(null);
  const userRef     = useRef<HTMLDivElement>(null);
  const loginRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const token      = localStorage.getItem('token');
    const panditTok  = localStorage.getItem('panditToken');
    const user       = JSON.parse(localStorage.getItem('user')   || '{}');
    const pandit     = JSON.parse(localStorage.getItem('pandit') || '{}');
    setAuth({
      isLoggedIn:       !!token,
      isPanditLoggedIn: !!panditTok,
      userName:         user.name   || 'User',
      panditName:       pandit.name || 'Pandit',
      isAdmin:          user.role   === 'admin',
    });
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) setExploreOpen(false);
      if (userRef.current   && !userRef.current.contains(e.target as Node))    setUserMenuOpen(false);
      if (loginRef.current  && !loginRef.current.contains(e.target as Node))   setLoginOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const logout = (type: 'user' | 'pandit') => {
    // 1. Clear all localStorage
    localStorage.clear();

    // 2. Clear all cookies
    document.cookie.split(';').forEach(c => {
      const key = c.trim().split('=')[0];
      document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
      document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${window.location.hostname}`;
    });

    // 3. Call backend logout to clear server-side cookie
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100';
    fetch(`${apiUrl}/api/logout`, { method: 'GET', credentials: 'include' })
      .finally(() => { window.location.href = '/'; });
  };

  const dashboardHref = auth.isAdmin ? '/admin/admin-dashboard' : '/dashboard';
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
                RAMJI KI <span style={{ color: '#f9e07a' }}>SENA</span>
              </p>
              <p className="text-[9px] text-white/40 tracking-[0.2em] uppercase">Spiritual Portal</p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 rounded-2xl p-1 backdrop-blur-md"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,130,0,0.2)' }}>
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
                      position: 'fixed',
                      top: '64px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 'min(640px, calc(100vw - 2rem))',
                      zIndex: 9999,
                    }}
                  >
                    {/* Arrow */}
                    <div className="flex justify-center mb-1">
                      <div className="w-3 h-3 bg-white rotate-45 shadow-sm border-l border-t border-slate-100" />
                    </div>
                    <div className="bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                      {/* Header */}
                      <div className="px-5 py-3 border-b border-slate-100"
                        style={{ background: 'linear-gradient(135deg, #fff9f0, #fff)' }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">सभी सेवाएं</p>
                            <p className="text-sm font-black text-slate-800">All Features</p>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                            🚩 Ramji Ki Sena
                          </div>
                        </div>
                      </div>

                      {/* Grid */}
                      <div className="p-4 grid grid-cols-3 gap-1.5">
                        {exploreLinks.map(({ href, label, icon: Icon, desc, color }) => (
                          <button key={href} onClick={() => safeNavigate(href)}
                            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 active:bg-orange-50 transition-all group text-left w-full">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color} group-hover:scale-110 transition-transform`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-tight">{label}</p>
                              <p className="text-[10px] text-slate-400 leading-tight mt-0.5 truncate">{desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <p className="text-[10px] text-slate-400">🙏 जय श्री राम</p>
                        <button onClick={() => safeNavigate('/dashboard')}
                          className="text-[10px] font-black text-orange-600 hover:text-orange-700 flex items-center gap-1">
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
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-black ${auth.isAdmin ? 'bg-orange-600' : 'bg-white/20'}`}>
                        {auth.isAdmin ? <Crown className="w-4 h-4" /> : auth.userName[0]?.toUpperCase()}
                      </div>
                      <span className="text-white text-sm font-bold max-w-[100px] truncate">{auth.userName}</span>
                      {auth.isAdmin && <span className="text-[9px] bg-orange-600 text-white px-1.5 py-0.5 rounded-full font-black">ADMIN</span>}
                      <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Signed in as</p>
                            <p className="text-sm font-black text-slate-900 truncate">{auth.userName}</p>
                          </div>
                          <div className="p-1.5 space-y-0.5">
                            <button onClick={() => safeNavigate(dashboardHref)}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-all">
                              <BarChart3 className="w-4 h-4" />
                              {auth.isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                            </button>
                            {!auth.isAdmin && (
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
                  <div className="flex items-center gap-2">
                    <button onClick={() => safeNavigate('/pandit/dashboard')}
                      className="flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-2 rounded-2xl text-white text-sm font-bold hover:bg-white/15 transition-all">
                      <Sparkles className="w-4 h-4 text-orange-400" />
                      {auth.panditName}
                    </button>
                    <button onClick={() => logout('pandit')}
                      className="p-2 bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2" ref={loginRef}>
                    <button onClick={() => { setLoginOpen(o => !o); setExploreOpen(false); }}
                      className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-bold px-3 py-2 rounded-xl hover:bg-white/10 transition-all">
                      Login <ChevronDown className={`w-3.5 h-3.5 transition-transform ${loginOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <button onClick={() => safeNavigate('/register')}
                      className="font-black px-5 py-2 rounded-xl text-sm active:scale-95 transition-all"
                      style={{
                        background: 'linear-gradient(135deg, #f9e07a 0%, #d4920a 50%, #b8760a 100%)',
                        color: '#3a0f00',
                        boxShadow: '0 4px 14px rgba(180,100,0,0.35)',
                      }}>
                      Sign Up
                    </button>

                    <AnimatePresence>
                      {loginOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-5 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                          <button onClick={() => safeNavigate('/login')}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-all border-b border-slate-100">
                            <UserIcon className="w-4 h-4" /> User Login
                          </button>
                          <button onClick={() => safeNavigate('/pandit/login')}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-all">
                            <Sparkles className="w-4 h-4" /> Pandit Login
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                  <p className="text-sm font-black text-white">RAMJI KI <span className="text-orange-500">SENA</span></p>
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
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black ${auth.isAdmin ? 'bg-orange-600' : 'bg-white/20'}`}>
                            {auth.isAdmin ? <Crown className="w-4 h-4" /> : auth.userName[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white text-sm font-black">{auth.userName}</p>
                            {auth.isAdmin && <p className="text-orange-400 text-[10px] font-black uppercase">Admin</p>}
                          </div>
                        </div>
                        <button onClick={() => safeNavigate(dashboardHref)}
                          className="w-full flex items-center gap-2 p-3 rounded-2xl bg-orange-600 text-white text-sm font-black">
                          <BarChart3 className="w-4 h-4" /> {auth.isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                        </button>
                        {!auth.isAdmin && (
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
                        <button onClick={() => safeNavigate('/pandit/dashboard')}
                          className="w-full flex items-center gap-2 p-3 rounded-2xl bg-orange-600 text-white text-sm font-black">
                          <Sparkles className="w-4 h-4" /> {auth.panditName} Dashboard
                        </button>
                        <button onClick={() => logout('pandit')}
                          className="w-full p-3 rounded-2xl bg-red-500/20 text-red-400 text-sm font-bold">
                          Logout
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => safeNavigate('/login')}
                            className="p-3 rounded-2xl bg-white/10 text-white text-sm font-bold text-center">Login</button>
                          <button onClick={() => safeNavigate('/register')}
                            className="p-3 rounded-2xl bg-orange-600 text-white text-sm font-black text-center">Sign Up</button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => safeNavigate('/pandit/login')}
                            className="p-3 rounded-2xl bg-white/5 text-white/70 text-xs font-bold text-center">Pandit Login</button>
                          <button onClick={() => safeNavigate('/pandit/register')}
                            className="p-3 rounded-2xl bg-white/5 text-white/70 text-xs font-bold text-center">Pandit Register</button>
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
