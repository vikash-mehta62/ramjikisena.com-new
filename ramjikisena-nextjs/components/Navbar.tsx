'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, BookOpen, Church, Scroll, User as UserIcon, Image as ImageIcon, Phone, Calendar, BarChart3, Flag, Crown, Sparkles, ShoppingBag, Users, HelpCircle } from 'lucide-react';

interface NavbarProps {
  showAuthButtons?: boolean;
}

export default function Navbar({ showAuthButtons = true }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPanditLoggedIn, setIsPanditLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [panditName, setPanditName] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);
  
  const loginDropdownRef = useRef<HTMLDivElement>(null);
  const registerDropdownRef = useRef<HTMLDivElement>(null);

  // Scroll effect for dynamic styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    const panditToken = localStorage.getItem('panditToken');
    const user = localStorage.getItem('user');
    const pandit = localStorage.getItem('pandit');
    
    setIsLoggedIn(!!token);
    setIsPanditLoggedIn(!!panditToken);
    
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || 'User');
      } catch (e) {
        setUserName('User');
      }
    }
    
    if (pandit) {
      try {
        const panditData = JSON.parse(pandit);
        setPanditName(panditData.name || 'Pandit');
      } catch (e) {
        setPanditName('Pandit');
      }
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target as Node)) {
        setShowLoginDropdown(false);
      }
      if (registerDropdownRef.current && !registerDropdownRef.current.contains(event.target as Node)) {
        setShowRegisterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    router.push('/');
  };

  const handlePanditLogout = () => {
    localStorage.removeItem('panditToken');
    localStorage.removeItem('pandit');
    setIsPanditLoggedIn(false);
    setPanditName('');
    router.push('/');
  };

  const navLinks = [
    { href: '/about', label: 'About', icon: <BookOpen className="w-4 h-4" /> },
    { href: '/mandirs', label: 'Mandirs', icon: <Church className="w-4 h-4" /> },
    { href: '/katha-vachaks', label: 'Katha Vachak', icon: <Scroll className="w-4 h-4" /> },
    { href: '/pandits', label: 'Book Pandit', icon: <Sparkles className="w-4 h-4" /> },
    { href: '/samagri', label: 'Samagri', icon: <ShoppingBag className="w-4 h-4" /> },
    { href: '/community', label: 'Community', icon: <Users className="w-4 h-4" /> },
    { href: '/forum', label: 'Forum', icon: <HelpCircle className="w-4 h-4" /> },
    { href: '/gallery', label: 'Gallery', icon: <ImageIcon className="w-4 h-4" /> },
    { href: '/contact', label: 'Contact', icon: <Phone className="w-4 h-4" /> },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-orange-800/95 backdrop-blur-lg py-2 shadow-xl border-b border-orange-400/20' 
          : 'bg-gradient-to-r from-orange-600 to-red-600 py-3 shadow-lg'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group outline-none">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md group-hover:blur-lg transition-all opacity-50 scale-110"></div>
              <div className="relative w-10 h-10 md:w-11 md:h-11 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-105 group-hover:rotate-[360deg] transition-all duration-700">
                <Flag className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg md:text-xl font-black tracking-tighter text-white leading-none drop-shadow-md">
                RAMJI KI SENA
              </h1>
              
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center bg-black/10 backdrop-blur-md rounded-full px-1.5 py-1 border border-white/10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-1.5 text-sm font-bold transition-all rounded-full flex items-center gap-1.5 group ${
                  isActive(link.href) 
                    ? 'text-orange-900 bg-yellow-400 shadow-md' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <span className="transition-transform group-hover:scale-125">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {showAuthButtons && (
              <div className="hidden sm:flex items-center gap-3">
                {isLoggedIn || isPanditLoggedIn ? (
                  <>
                    {isLoggedIn && (
                      <>
                        {/* User Dropdown */}
                        <div className="relative" ref={loginDropdownRef}>
                          <button
                            onClick={() => {
                              setShowLoginDropdown(!showLoginDropdown);
                              setShowRegisterDropdown(false);
                            }}
                            className="flex items-center gap-2 text-sm font-bold text-white hover:text-yellow-300 transition-colors"
                          >
                            <UserIcon className="w-4 h-4" />
                            {userName}
                            <ChevronDown className={`w-4 h-4 transition-transform ${showLoginDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {showLoginDropdown && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-orange-200 overflow-hidden z-50">
                              <Link
                                href="/dashboard"
                                onClick={() => setShowLoginDropdown(false)}
                                className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-orange-900 hover:bg-orange-50 transition-colors border-b border-orange-100"
                              >
                                <BarChart3 className="w-4 h-4" />
                                Dashboard
                              </Link>
                              <Link
                                href="/my-bookings"
                                onClick={() => setShowLoginDropdown(false)}
                                className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-orange-900 hover:bg-orange-50 transition-colors"
                              >
                                <Calendar className="w-4 h-4" />
                                My Bookings
                              </Link>
                              <Link
                                href="/samagri"
                                onClick={() => setShowLoginDropdown(false)}
                                className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-orange-900 hover:bg-orange-50 transition-colors border-t border-orange-100"
                              >
                                <ShoppingBag className="w-4 h-4" />
                                Samagri Shop
                              </Link>
                              <Link
                                href="/samagri/orders"
                                onClick={() => setShowLoginDropdown(false)}
                                className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-orange-900 hover:bg-orange-50 transition-colors"
                              >
                                <span className="text-sm">📦</span>
                                My Samagri Orders
                              </Link>
                              <Link
                                href="/community"
                                onClick={() => setShowLoginDropdown(false)}
                                className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-orange-900 hover:bg-orange-50 transition-colors border-t border-orange-100"
                              >
                                <Users className="w-4 h-4" />
                                Community Feed
                              </Link>
                              <Link
                                href="/forum"
                                onClick={() => setShowLoginDropdown(false)}
                                className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-orange-900 hover:bg-orange-50 transition-colors"
                              >
                                <HelpCircle className="w-4 h-4" />
                                Spiritual Forum
                              </Link>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={handleUserLogout}
                          className="px-4 py-2 bg-white text-red-600 rounded-full text-sm font-bold shadow-lg hover:bg-red-50 active:scale-95 transition-all"
                        >
                          Logout
                        </button>
                      </>
                    )}
                    {isPanditLoggedIn && (
                      <>
                        <Link href="/pandit/dashboard" className="flex items-center gap-2 text-sm font-bold text-white hover:text-yellow-300 transition-colors">
                          <Sparkles className="w-4 h-4" />
                          {panditName}
                        </Link>
                        <button
                          onClick={handlePanditLogout}
                          className="px-4 py-2 bg-white text-red-600 rounded-full text-sm font-bold shadow-lg hover:bg-red-50 active:scale-95 transition-all"
                        >
                          Logout
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* Login Dropdown */}
                    <div className="relative" ref={loginDropdownRef}>
                      <button
                        onClick={() => {
                          setShowLoginDropdown(!showLoginDropdown);
                          setShowRegisterDropdown(false);
                        }}
                        className="flex items-center gap-1 text-sm font-bold text-white hover:text-yellow-300 transition-colors"
                      >
                        Login
                        <ChevronDown className={`w-4 h-4 transition-transform ${showLoginDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showLoginDropdown && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-orange-200 overflow-hidden z-50">
                          <Link
                            href="/login"
                            onClick={() => setShowLoginDropdown(false)}
                            className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-orange-900 hover:bg-orange-50 transition-colors border-b border-orange-100"
                          >
                            <UserIcon className="w-4 h-4" />
                            User Login
                          </Link>
                          <Link
                            href="/pandit/login"
                            onClick={() => setShowLoginDropdown(false)}
                            className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-orange-900 hover:bg-orange-50 transition-colors"
                          >
                            <Sparkles className="w-4 h-4" />
                            Pandit Login
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Register Dropdown */}
                    <div className="relative" ref={registerDropdownRef}>
                      <button
                        onClick={() => {
                          setShowRegisterDropdown(!showRegisterDropdown);
                          setShowLoginDropdown(false);
                        }}
                        className="flex items-center gap-1 px-5 py-2 bg-gradient-to-r from-yellow-300 to-orange-400 text-orange-950 rounded-full text-sm font-black shadow-xl hover:shadow-yellow-500/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
                      >
                        SIGN UP
                        <ChevronDown className={`w-4 h-4 transition-transform ${showRegisterDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showRegisterDropdown && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-orange-200 overflow-hidden z-50">
                          <Link
                            href="/register"
                            onClick={() => setShowRegisterDropdown(false)}
                            className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-orange-900 hover:bg-orange-50 transition-colors border-b border-orange-100"
                          >
                            <UserIcon className="w-4 h-4" />
                            User Register
                          </Link>
                          <Link
                            href="/pandit/register"
                            onClick={() => setShowRegisterDropdown(false)}
                            className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-orange-900 hover:bg-orange-50 transition-colors"
                          >
                            <Sparkles className="w-4 h-4" />
                            Pandit Register
                          </Link>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center rounded-xl bg-white/10 border border-white/20 active:scale-90 transition-all"
              aria-label="Toggle Menu"
            >
              <span className={`h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'w-5 rotate-45 translate-y-1.5' : 'w-5 mb-1'}`} />
              <span className={`h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'w-4 mb-1'}`} />
              <span className={`h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'w-5 -rotate-45 -translate-y-1' : 'w-4'}`} />
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Content */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            mobileMenuOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="bg-orange-900/40 backdrop-blur-xl rounded-3xl p-4 border border-white/10 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                  isActive(link.href) ? 'bg-yellow-400 text-orange-900' : 'bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-4 font-bold">
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </div>
                <span className="opacity-50">→</span>
              </Link>
            ))}
            
            {/* Mobile Auth Buttons */}
            {isLoggedIn || isPanditLoggedIn ? (
              <div className="space-y-2 mt-2">
                {isLoggedIn && (
                  <>
                    <div className="text-xs font-bold text-yellow-300 px-2 mb-1">User Menu</div>
                    <Link href="/dashboard" className="flex items-center justify-center gap-2 py-3 text-center font-bold text-white bg-white/10 rounded-2xl">
                      <BarChart3 className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link href="/my-bookings" className="flex items-center justify-center gap-2 py-3 text-center font-bold text-white bg-white/10 rounded-2xl">
                      <Calendar className="w-4 h-4" />
                      My Bookings
                    </Link>
                    <Link href="/samagri" className="flex items-center justify-center gap-2 py-3 text-center font-bold text-white bg-white/10 rounded-2xl">
                      <ShoppingBag className="w-4 h-4" />
                      Samagri Shop
                    </Link>
                    <Link href="/samagri/orders" className="flex items-center justify-center gap-2 py-3 text-center font-bold text-white bg-white/10 rounded-2xl">
                      <span>📦</span>
                      My Samagri Orders
                    </Link>
                    <Link href="/community" className="flex items-center justify-center gap-2 py-3 text-center font-bold text-white bg-white/10 rounded-2xl">
                      <Users className="w-4 h-4" />
                      Community Feed
                    </Link>
                    <Link href="/forum" className="flex items-center justify-center gap-2 py-3 text-center font-bold text-white bg-white/10 rounded-2xl">
                      <HelpCircle className="w-4 h-4" />
                      Spiritual Forum
                    </Link>
                    <button onClick={handleUserLogout} className="w-full py-3 text-center font-bold bg-red-500 text-white rounded-2xl">
                      Logout
                    </button>
                  </>
                )}
                {isPanditLoggedIn && (
                  <>
                    <Link href="/pandit/dashboard" className="flex items-center justify-center gap-2 py-3 text-center font-bold text-white bg-white/10 rounded-2xl">
                      <Sparkles className="w-4 h-4" />
                      {panditName} Dashboard
                    </Link>
                    <button onClick={handlePanditLogout} className="w-full py-3 text-center font-bold bg-red-500 text-white rounded-2xl">
                      Logout
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-2 mt-2">
                <div className="text-xs font-bold text-yellow-300 px-2 mb-1">User</div>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" className="py-3 text-center font-bold text-white bg-white/10 rounded-2xl">Login</Link>
                  <Link href="/register" className="py-3 text-center font-bold bg-yellow-400 text-orange-900 rounded-2xl shadow-lg">Register</Link>
                </div>
                <div className="text-xs font-bold text-yellow-300 px-2 mt-3 mb-1">Pandit</div>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/pandit/login" className="py-3 text-center font-bold text-white bg-white/10 rounded-2xl">Login</Link>
                  <Link href="/pandit/register" className="py-3 text-center font-bold bg-yellow-400 text-orange-900 rounded-2xl shadow-lg">Register</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}