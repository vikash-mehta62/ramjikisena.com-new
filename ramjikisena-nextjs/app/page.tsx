'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import NaamJapSection from '@/components/NaamJapSection';
import Footer from '@/components/Footer';
import { authApi, User } from '@/lib/auth';
import { useJaapNavigate } from '@/lib/useJaapNavigate';
import { ImageIcon, BookOpen, Users, Star, MessageCircle, Target, ArrowRight } from 'lucide-react';

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
                  <span className="text-orange-300 text-xs font-bold tracking-widest uppercase">रामजी की सेना</span>
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

      {/* --- NAAM JAP (logged in users only, right after hero) --- */}
      {!loading && user && <NaamJapSection user={user} onSaveSuccess={checkAuth} />}

     

      {/* --- FEATURES GRID --- */}
      <section className="py-20 bg-[#FFFAF3] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, transparent, #d4920a, transparent)' }} />
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-3">🚩 हमारी सेवाएं</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">राम सेना की विशेषताएं</h2>
            <div className="h-1 w-16 mx-auto rounded-full" style={{ background: 'linear-gradient(90deg, #d4920a, #f9e07a)' }} />
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "डिजिटल नाम डायरी", icon: "📿", desc: "कहीं भी, कभी भी राम नाम लिखें। अपनी माला और जाप की प्रगति ट्रैक करें।", href: "/dashboard", color: "from-orange-500 to-red-500", tag: "सबसे लोकप्रिय" },
              { title: "लीडरबोर्ड", icon: "🏆", desc: "साप्ताहिक और मासिक रैंकिंग में अपना स्थान बनाएं और भक्तों को प्रेरित करें।", href: "/history", color: "from-amber-500 to-orange-500", tag: "" },
              { title: "मंदिर दर्शन", icon: "🛕", desc: "देश भर के प्रसिद्ध मंदिरों के दर्शन और उनकी महिमा के बारे में जानें।", href: "/mandirs", color: "from-red-500 to-orange-600", tag: "" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative bg-white rounded-3xl border border-orange-100 shadow-lg shadow-orange-900/5 overflow-hidden cursor-pointer"
                onClick={() => safeNavigate(item.href)}
              >
                {item.tag && (
                  <div className="absolute top-4 right-4 text-[10px] font-black px-2.5 py-1 rounded-full text-white"
                    style={{ background: 'linear-gradient(135deg, #d4920a, #f9e07a)' }}>
                    {item.tag}
                  </div>
                )}
                {/* Top gradient bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${item.color}`} />
                <div className="p-7">
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">{item.desc}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-black text-orange-600 group-hover:gap-2 transition-all">
                    अभी देखें <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- EXPLORE MORE FEATURES --- */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <span className="inline-block px-4 py-1 bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-3">और भी बहुत कुछ</span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">सभी सेवाएं एक जगह</h2>
          </motion.div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            {[
              { title: "गैलरी",        desc: "भव्य दर्शन",    href: "/gallery",       icon: ImageIcon,     grad: "from-pink-500 to-rose-500" },
              { title: "कथा वाचक",    desc: "बुकिंग करें",   href: "/katha-vachaks", icon: BookOpen,      grad: "from-violet-500 to-purple-600" },
              { title: "भक्त समुदाय", desc: "साथ जुड़ें",    href: "/community",     icon: Users,         grad: "from-orange-500 to-red-500" },
              { title: "राम महिमा",   desc: "महिमा पढ़ें",   href: "/glory",         icon: Star,          grad: "from-amber-500 to-yellow-500" },
              { title: "फोरम",         desc: "प्रश्न पूछें",  href: "/forum",         icon: MessageCircle, grad: "from-teal-500 to-cyan-500" },
              { title: "हमारा मिशन", desc: "उद्देश्य जानें", href: "/mission",       icon: Target,        grad: "from-red-500 to-orange-600" },
            ].map((item, i) => (
              <motion.button
                key={i}
                onClick={() => safeNavigate(item.href)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -5, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="group flex flex-col items-center gap-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 p-4 text-center"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${item.grad} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800 group-hover:text-orange-600 transition-colors leading-tight">{item.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </motion.button>
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

      {/* --- PANDIT & KATHA VACHAK PROMO --- */}
      <section className="py-20 bg-[#FFFAF3] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #d4920a40, transparent)' }} />
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-3">🙏 बुकिंग सेवाएं</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">पंडित और कथा वाचक</h2>
            <p className="text-slate-500 text-sm">अनुभवी पंडितों और कथा वाचकों को घर बैठे बुक करें</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">

            {/* Pandit Card - with Pandit Pradeep Mishra background */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl shadow-xl cursor-pointer min-h-[320px]"
              onClick={() => safeNavigate('/pandits')}
            >
              {/* Background image - Pandit Pradeep Mishra (famous MP pandit) */}
              <div className="absolute inset-0">
                <Image
                  src="/home/Pradeep-Ji-Mishra.webp"
                  alt="Pandit Pradeep Mishra"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0800]/95 via-[#1a0800]/60 to-[#1a0800]/20" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-7 flex flex-col justify-end h-full min-h-[320px]">
                <div className="mt-auto">
                  <span className="inline-block text-[10px] font-black px-2.5 py-1 rounded-full text-white mb-3"
                    style={{ background: 'rgba(200,130,0,0.7)', border: '1px solid rgba(200,130,0,0.5)' }}>
                    🙏 Pandit Booking
                  </span>
                  <h3 className="text-2xl font-black text-white mb-2">पंडित बुकिंग</h3>
                  <p className="text-orange-100/80 text-sm mb-4 leading-relaxed">पूजा, हवन, विवाह, मुंडन — सभी संस्कारों के लिए अनुभवी पंडित बुक करें।</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {['पूजा', 'हवन', 'विवाह', 'मुंडन', 'गृह प्रवेश'].map(t => (
                      <span key={t} className="text-orange-200 text-xs font-bold px-3 py-1 rounded-full"
                        style={{ background: 'rgba(255,150,50,0.15)', border: '1px solid rgba(200,100,0,0.3)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-black text-white group-hover:gap-3 transition-all"
                    style={{ textShadow: '0 0 12px rgba(200,130,0,0.6)' }}>
                    पंडित खोजें <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Katha Vachak Card - with Pandit Pradeep Mishra katha background */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl shadow-xl cursor-pointer min-h-[320px]"
              onClick={() => safeNavigate('/katha-vachaks')}
            >
              {/* Background image - Katha Vachak scene */}
              <div className="absolute inset-0">
                <Image
                  src="/home/kathavachak.webp"
                  alt="Katha Vachak"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0030]/95 via-[#1a0040]/65 to-[#2d0060]/25" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-7 flex flex-col justify-end h-full min-h-[320px]">
                <div className="mt-auto">
                  <span className="inline-block text-[10px] font-black px-2.5 py-1 rounded-full text-white mb-3"
                    style={{ background: 'rgba(120,50,200,0.6)', border: '1px solid rgba(150,80,220,0.4)' }}>
                    📖 कथा वाचक —  Live And comming
                  </span>
                  <h3 className="text-2xl font-black text-white mb-2">कथा वाचक</h3>
                  <p className="text-purple-100/80 text-sm mb-4 leading-relaxed">रामायण, भागवत, सुंदरकांड — अनुभवी कथा वाचकों को अपने घर या मंदिर में बुलाएं।</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {['रामायण', 'भागवत', 'सुंदरकांड', 'शिव पुराण'].map(t => (
                      <span key={t} className="text-purple-200 text-xs font-bold px-3 py-1 rounded-full"
                        style={{ background: 'rgba(150,80,220,0.2)', border: '1px solid rgba(150,80,220,0.3)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-black text-white group-hover:gap-3 transition-all">
                    कथा वाचक खोजें <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
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