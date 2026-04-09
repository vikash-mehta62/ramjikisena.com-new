'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import NaamJapSection from '@/components/NaamJapSection';
import Footer from '@/components/Footer';
import { authApi, User } from '@/lib/auth';
import { useJaapNavigate } from '@/lib/useJaapNavigate';
import { ImageIcon, BookOpen, Users, Star, MessageCircle, Target, ArrowRight, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';

const ALL_SERVICES = [
  { title: 'पंडित बुकिंग',   desc: 'पूजा, हवन, विवाह',   href: '/pandits',       img: '/home/Pradeep-Ji-Mishra.webp', grad: 'from-orange-700 to-red-800',    emoji: '🙏', popular: '🔥 Most Booked' },
  { title: 'कथा वाचक',      desc: 'रामायण, भागवत',       href: '/katha-vachaks', img: '/home/kathavachak.webp',        grad: 'from-purple-700 to-indigo-800', emoji: '📖', popular: '⭐ Popular' },
  { title: 'नाम जाप',        desc: 'राम नाम लिखें',       href: '/#jaap',         img: '/ramji.jpg',                    grad: 'from-amber-700 to-orange-800',  emoji: '📿', popular: '🏆 #1 Feature' },
  { title: 'मंदिर दर्शन',   desc: 'प्रसिद्ध मंदिर',      href: '/mandirs',       img: '/ramji.jpg',                    grad: 'from-red-700 to-orange-800',    emoji: '🛕', popular: '' },
  { title: 'भक्त समुदाय',   desc: 'साथ जुड़ें',           href: '/community',     img: '/ramji.jpg',                    grad: 'from-orange-600 to-red-700',    emoji: '🤝', popular: '💬 Active' },
  { title: 'पूजन सामग्री',  desc: 'घर पर मंगाएं',         href: '/samagri',       img: '/ramji.jpg',                    grad: 'from-green-700 to-teal-800',    emoji: '🪔', popular: '🆕 New' },
  { title: 'गैलरी',          desc: 'भव्य दर्शन',          href: '/gallery',       img: '/ramji.jpg',                    grad: 'from-pink-700 to-rose-800',     emoji: '🖼️', popular: '' },
  { title: 'राम महिमा',      desc: 'महिमा पढ़ें',          href: '/glory',         img: '/hanumanji.jpg',                grad: 'from-amber-600 to-yellow-700',  emoji: '⭐', popular: '' },
];

function ServicesCarousel({ safeNavigate }: { safeNavigate: (href: string) => void }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const visible = 3;
  const max = ALL_SERVICES.length - visible;

  const prev = () => setIdx(i => (i <= 0 ? max : i - 1));
  const next = () => setIdx(i => (i >= max ? 0 : i + 1));

  // Auto-play
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx(i => (i >= max ? 0 : i + 1)), 2800);
    return () => clearInterval(t);
  }, [paused, max]);

  return (
    <div className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>

      {/* Prev */}
      <button onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #f9e07a, #d4920a)', color: '#3a0f00' }}>
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Track */}
      <div className="overflow-hidden rounded-2xl">
        <motion.div
          className="flex gap-4"
          animate={{ x: `calc(-${idx} * (33.333% + 0.8rem))` }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        >
          {ALL_SERVICES.map((svc, i) => (
            <motion.button
              key={i}
              onClick={() => safeNavigate(svc.href)}
              whileHover={{ y: -8, scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex-shrink-0 w-[calc(33.333%-0.65rem)] rounded-2xl overflow-hidden cursor-pointer relative group"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(200,130,0,0.3)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              }}
            >
              {/* Image area */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={svc.img} alt={svc.title} fill
                  className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
                />
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${svc.grad} opacity-50 mix-blend-multiply`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

                {/* Popular badge */}
                {svc.popular && (
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
                      style={{ background: 'linear-gradient(135deg, #d4920a, #f9e07a)', color: '#3a0f00' }}>
                      {svc.popular}
                    </span>
                  </div>
                )}

                {/* Emoji top-right */}
                <span className="absolute top-3 right-3 text-2xl drop-shadow-lg">{svc.emoji}</span>

                {/* Title on image bottom */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                  <p className="text-lg font-black text-white leading-tight drop-shadow-lg">{svc.title}</p>
                  <p className="text-xs font-semibold mt-1" style={{ color: 'rgba(255,200,120,0.8)' }}>{svc.desc}</p>
                </div>
              </div>

              {/* Bottom CTA bar */}
              <div className="flex items-center justify-between px-4 py-3"
                style={{ background: 'rgba(200,130,0,0.08)', borderTop: '1px solid rgba(200,130,0,0.15)' }}>
                <span className="text-xs font-black" style={{ color: 'rgba(255,200,120,0.7)' }}>अभी देखें</span>
                <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: '#f9e07a' }} />
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Next */}
      <button onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #f9e07a, #d4920a)', color: '#3a0f00' }}>
        <ChevronRightIcon className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-5">
        {Array.from({ length: max + 1 }).map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: idx === i ? '2rem' : '0.5rem',
              background: idx === i ? '#f9e07a' : 'rgba(255,200,120,0.2)',
            }} />
        ))}
      </div>
    </div>
  );
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
  const [loading, setLoading] = useState(true);
  const safeNavigate = useJaapNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFAF3] overflow-x-hidden selection:bg-orange-200">
      <Navbar showAuthButtons={true} />

      {/* --- FULL SCREEN HERO SLIDER --- */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#1a0a00]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src={slides[currentSlide].img}
                alt="Background"
                fill
                className="object-cover opacity-30 scale-105 animate-slow-zoom"
                priority
              />
              {/* Deep devotional gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#1a0800]/75 to-black/90" />
              {/* Warm golden side glow */}
              <div className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(200,100,0,0.18) 0%, transparent 70%)' }} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Decorative OM / diya top */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 text-orange-400/20 text-[10rem] font-black select-none leading-none pointer-events-none">
          ॐ
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 relative z-20 pt-24 pb-16">
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
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-600/80 backdrop-blur text-white text-[11px] font-black tracking-[0.2em] uppercase mb-6 shadow-lg shadow-orange-900/30 border border-orange-500/30">
                  🙏 {slides[currentSlide].subtitle}
                </span>

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
                  <span className="text-orange-300 text-xs font-bold tracking-widest uppercase">जय श्री राम नाम</span>
                  <div className="h-px flex-1 max-w-[80px] bg-orange-500/30" />
                </div>

                <p className="text-base md:text-lg text-orange-100/80 max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                  {slides[currentSlide].desc}
                </p>

                {/* Chaupai */}
                <div className="inline-block bg-white/5 border border-orange-400/20 backdrop-blur-sm rounded-2xl px-5 py-3 mb-8 text-left">
                  <p className="text-orange-300 text-sm font-semibold italic leading-relaxed">
                    "कलियुग केवल नाम अधारा।<br />सुमिर सुमिर नर उतरहिं पारा।।"
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button onClick={() => safeNavigate('/register')}
                    className="px-8 py-4 font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 text-base border border-yellow-600/40"
                    style={{
                      background: 'linear-gradient(135deg, #f9e07a 0%, #d4920a 40%, #f0b429 70%, #b8760a 100%)',
                      color: '#5a1a00',
                      boxShadow: '0 8px 24px rgba(180,100,0,0.4)',
                    }}>
                    🚩 अभी शुरू करें
                  </button>
                  <button onClick={() => safeNavigate('/login')}
                    className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-2xl hover:bg-white/20 transition-all text-base">
                    लॉगिन करें 🙏
                  </button>
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
                  {/* Outer golden glow ring */}
                  <div className="absolute -inset-4 rounded-[2.5rem] blur-2xl opacity-50 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse, #d4920a 0%, transparent 70%)' }} />

                  {/* Golden border frame */}
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
                      {/* Bottom fade */}
                      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1a0800]/80 to-transparent" />
                      {/* Bottom label */}
                      <div className="absolute bottom-4 left-0 right-0 text-center">
                        <span className="text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full"
                          style={{ color: '#f9e07a', textShadow: '0 0 12px rgba(200,130,0,0.8)' }}>
                          {slides[currentSlide].title}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Corner diya decorations */}
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
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 transition-all duration-300 rounded-full ${
                currentSlide === i ? "w-10 bg-yellow-400" : "w-2.5 bg-white/25"
              }`}
            />
          ))}
        </div>
      </section>

      {/* --- NAAM JAP --- */}
      {!loading && <NaamJapSection user={user} onSaveSuccess={checkAuth} />}

      {/* --- SERVICES CAROUSEL (all 8 services including pandit & katha) --- */}
      <section className="py-14 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #1a0800 0%, #0f0500 100%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #d4920a60, transparent)' }} />
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <span className="inline-block px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-full mb-3"
              style={{ background: 'rgba(200,130,0,0.2)', border: '1px solid rgba(200,130,0,0.3)', color: '#f9e07a' }}>
              और भी बहुत कुछ
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white">सभी सेवाएं एक जगह</h2>
          </motion.div>
          <ServicesCarousel safeNavigate={safeNavigate} />
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
          <div className="grid md:grid-cols-2 gap-12 items-center">
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
                <button onClick={() => safeNavigate('/samagri')}
                  className="inline-flex items-center gap-2 text-orange-200 font-bold px-7 py-3.5 rounded-2xl transition-all text-sm"
                  style={{ background: 'rgba(255,150,50,0.1)', border: '1px solid rgba(200,100,0,0.3)' }}>
                  🎁 Packages देखें
                </button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-3 gap-4">
              {[
                { tier: 'Basic', price: '₹499', emoji: '🌿', label: 'सामान्य पूजा' },
                { tier: 'Standard', price: '₹999', emoji: '🪔', label: 'विशेष पूजा' },
                { tier: 'Premium', price: '₹1999', emoji: '👑', label: 'महा पूजा' },
              ].map((pkg, i) => (
                <motion.button
                  key={pkg.tier}
                  whileHover={{ y: -6, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => safeNavigate('/samagri')}
                  className="rounded-2xl p-4 text-center hover:shadow-2xl transition-all"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,220,100,0.1), rgba(180,100,0,0.15))',
                    border: '1px solid rgba(200,130,0,0.3)',
                  }}
                >
                  <div className="text-3xl mb-2">{pkg.emoji}</div>
                  <p className="font-black text-white text-sm">{pkg.tier}</p>
                  <p className="text-xs text-orange-300/70 mb-1">{pkg.label}</p>
                  <p className="font-black text-lg" style={{ color: '#f9e07a' }}>{pkg.price}</p>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- QUOTE SECTION --- */}
      <section className="py-32 relative overflow-hidden" style={{ background: '#0f0500' }}>
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