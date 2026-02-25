'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface NavbarProps {
  showAuthButtons?: boolean;
}

export default function Navbar({ showAuthButtons = true }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll effect for dynamic styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/');
  };

  const navLinks = [
    { href: '/about', label: 'About', icon: '📖' },
    { href: '/mandirs', label: 'Mandirs', icon: '🛕' },
    { href: '/katha-vachaks', label: 'Katha Vachak', icon: '📿' },
    { href: '/gallery', label: 'Gallery', icon: '🖼️' },
    { href: '/contact', label: 'Contact', icon: '📞' },
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
                <span className="text-xl md:text-2xl">🚩</span>
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
                <span className={`text-base transition-transform group-hover:scale-125`}>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {showAuthButtons && (
              <div className="hidden sm:flex items-center gap-3">
                {isLoggedIn ? (
                  <>
                    <Link href="/dashboard" className="text-sm font-bold text-white hover:text-yellow-300 transition-colors">
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-5 py-2 bg-white text-red-600 rounded-full text-sm font-bold shadow-lg hover:bg-red-50 active:scale-95 transition-all"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-sm font-bold text-white hover:text-yellow-300 transition-colors">
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="px-5 py-2 bg-gradient-to-r from-yellow-300 to-orange-400 text-orange-950 rounded-full text-sm font-black shadow-xl hover:shadow-yellow-500/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                      SIGN UP
                    </Link>
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
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </div>
                <span className="opacity-50">→</span>
              </Link>
            ))}
            
            {!isLoggedIn && (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Link href="/login" className="py-4 text-center font-bold text-white bg-white/10 rounded-2xl">Login</Link>
                <Link href="/register" className="py-4 text-center font-bold bg-yellow-400 text-orange-900 rounded-2xl shadow-lg">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}