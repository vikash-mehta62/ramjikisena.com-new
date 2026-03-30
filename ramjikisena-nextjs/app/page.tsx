'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import MusicPlayer from '@/components/MusicPlayer';
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
      <MusicPlayer />

      {/* --- FULL SCREEN HERO SLIDER --- */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <Image
                src={slides[currentSlide].img}
                alt="Background"
                fill
                className="object-cover opacity-40 scale-105 animate-slow-zoom"
                priority
              />
              <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/80`} />
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-6 relative z-10 h-full flex items-center">
              <div className="grid lg:grid-cols-2 gap-12 items-center w-full pt-20">
                
                {/* Text Content */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-white text-center lg:text-left order-2 lg:order-1"
                >
                  <span className="inline-block px-4 py-1.5 rounded-full bg-orange-600 text-white text-[12px] md:text-sm font-bold tracking-[0.2em] uppercase mb-6 shadow-lg shadow-orange-600/20">
                    {slides[currentSlide].subtitle}
                  </span>

                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 drop-shadow-2xl">
                    {slides[currentSlide].title.split(' ').map((word, i) => (
                      <span key={i} className={i >= 1 ? "text-orange-500" : ""}>
                        {word}{" "}
                      </span>
                    ))}
                  </h1>

                  <p className="text-lg md:text-xl text-gray-200 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">
                    {slides[currentSlide].desc}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                    <button onClick={() => safeNavigate('/register')} className="px-10 py-4 bg-orange-600 text-white font-bold rounded-2xl shadow-xl hover:bg-orange-500 transition-all hover:scale-105 active:scale-95 text-lg">
                      अभी शुरू करें ✨
                    </button>
                    <button onClick={() => safeNavigate('/login')} className="px-10 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-2xl hover:bg-white/20 transition-all text-lg">
                      लॉगिन करें 🙏
                    </button>
                  </div>
                </motion.div>

                {/* Main Visual Image */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 1 }}
                  className="flex justify-center items-center order-1 lg:order-2"
                >
                  <div className="relative w-[280px] h-[280px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px]">
                    <div 
                      className="absolute inset-0 rounded-full blur-[80px] opacity-40 animate-pulse"
                      style={{ backgroundColor: slides[currentSlide].glow }}
                    />
                    <div className="relative w-full h-full rounded-[40px] overflow-hidden border-[12px] border-white/10 backdrop-blur-sm shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                      <Image 
                        src={slides[currentSlide].img} 
                        alt="Divine" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slider Navigation Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 transition-all duration-300 rounded-full ${
                currentSlide === i ? "w-12 bg-orange-500" : "w-3 bg-white/30"
              }`}
            />
          ))}
        </div>
      </section>

      {/* --- NAAM JAP (logged in users only, right after hero) --- */}
      {!loading && user && <NaamJapSection user={user} onSaveSuccess={checkAuth} />}

      {/* --- STATS SECTION --- */}
      <section className="py-24 relative bg-white border-b border-orange-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
            {[
              { label: "Total Jaap", val: "1.2Cr+", icon: "📿" },
              { label: "Active Bhakts", val: "50k+", icon: "👥" },
              { label: "Daily Malas", val: "25,000", icon: "✨" },
              { label: "Cities", val: "500+", icon: "📍" },
            ].map((stat, i) => (
              <motion.div 
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="p-6 rounded-3xl hover:bg-orange-50 transition-colors"
              >
                <span className="text-3xl mb-3 block">{stat.icon}</span>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-1">{stat.val}</h3>
                <p className="text-[10px] md:text-xs font-bold text-orange-600 uppercase tracking-[0.2em]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 bg-[#FFFAF3]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">राम सेना की विशेषताएं</h2>
            <div className="h-1.5 w-20 bg-orange-500 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "डिजिटल डायरी", icon: "📝", desc: "कहीं भी, कभी भी नाम लिखें और अपनी आध्यात्मिक प्रगति को ट्रैक करें।", href: "/dashboard" },
              { title: "लीडरबोर्ड", icon: "🏆", desc: "साप्ताहिक और मासिक रैंकिंग में अपना स्थान बनाकर अन्य भक्तों को प्रेरित करें।", href: "/history" },
              { title: "मंदिर दर्शन", icon: "🛕", desc: "देश भर के प्रसिद्ध मंदिरों के दर्शन और उनकी महिमा के बारे में जानें।", href: "/mandirs" },
            ].map((item, i) => (
              <motion.div key={i} whileHover={{ y: -10 }}
                className="group p-8 bg-white rounded-[2.5rem] border border-orange-100 shadow-lg shadow-orange-900/5 transition-all">
                <button onClick={() => safeNavigate(item.href)} className="w-full text-left">
                  <div className="text-4xl mb-6 bg-orange-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- EXPLORE MORE FEATURES --- */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-2">और भी बहुत कुछ</span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">सभी सेवाएं एक जगह</h2>
            </div>
            <div className="h-0.5 flex-1 mx-6 bg-gradient-to-r from-orange-200 to-transparent rounded-full hidden md:block" />
          </motion.div>

          <div className="flex gap-4 justify-between pb-3 flex-wrap md:flex-nowrap">
            {[
              { title: "गैलरी",       desc: "भव्य दर्शन",          href: "/gallery",       icon: ImageIcon,    grad: "from-pink-500 to-rose-500" },
              { title: "कथा वाचक",   desc: "बुकिंग करें",          href: "/katha-vachaks", icon: BookOpen,     grad: "from-violet-500 to-purple-600" },
              { title: "भक्त समुदाय", desc: "साथ जुड़ें",           href: "/community",     icon: Users,        grad: "from-orange-500 to-red-500" },
              { title: "राम महिमा",   desc: "महिमा पढ़ें",          href: "/glory",         icon: Star,         grad: "from-amber-500 to-yellow-500" },
              { title: "फोरम",        desc: "प्रश्न पूछें",         href: "/forum",         icon: MessageCircle,grad: "from-teal-500 to-cyan-500" },
              { title: "हमारा मिशन", desc: "उद्देश्य जानें",        href: "/mission",       icon: Target,       grad: "from-red-500 to-orange-600" },
            ].map((item, i) => (
              <motion.button
                key={i}
                onClick={() => safeNavigate(item.href)}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, type: 'spring', stiffness: 200, damping: 20 }}
                whileHover={{ y: -6, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group flex-1 min-w-[130px] snap-start bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden text-left"
              >
                <div className={`bg-gradient-to-br ${item.grad} p-5 flex items-center justify-center`}>
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.2 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <item.icon className="w-7 h-7 text-white" strokeWidth={2} />
                  </motion.div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-tight">{item.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                  <motion.span
                    className="inline-flex items-center gap-0.5 text-[10px] font-black text-orange-500 mt-2"
                    whileHover={{ x: 3 }}
                  >
                    देखें <ArrowRight className="w-3 h-3" />
                  </motion.span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* --- SAMAGRI PROMO --- */}
      <section className="py-20 bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 text-[12rem] text-white leading-none">🪔</div>
          <div className="absolute bottom-0 right-0 text-[12rem] text-white leading-none">🌸</div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-block bg-white/20 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-4">🆕 New Feature</div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">पूजन सामग्री<br/>घर पर मंगाएं</h2>
              <p className="text-orange-100 text-lg mb-6 leading-relaxed">शुद्ध और प्रामाणिक पूजा सामग्री अब आपके दरवाजे तक।</p>
              <div className="flex flex-wrap gap-3 mb-8">
                {['✅ 100% शुद्ध', '🚚 Free Delivery ₹500+', '📦 Ready Packages', '🙏 Trusted'].map(f => (
                  <span key={f} className="bg-white/15 text-white text-sm font-semibold px-4 py-2 rounded-full">{f}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => safeNavigate('/samagri')} className="inline-flex items-center gap-2 bg-white text-orange-700 font-black px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-all text-lg">
                  🛒 अभी खरीदें
                </button>
                <button onClick={() => safeNavigate('/samagri')} className="inline-flex items-center gap-2 bg-white/20 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/30 transition-all text-lg border border-white/30">
                  🎁 Packages देखें
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { tier: 'Basic', price: '₹499', emoji: '🌿', color: 'from-green-400 to-emerald-500' },
                { tier: 'Standard', price: '₹999', emoji: '🪔', color: 'from-orange-400 to-amber-500' },
                { tier: 'Premium', price: '₹1999', emoji: '👑', color: 'from-purple-500 to-violet-600' },
              ].map(pkg => (
                <button key={pkg.tier} onClick={() => safeNavigate('/samagri')}
                  className="bg-white rounded-2xl p-4 text-center shadow-xl hover:-translate-y-2 transition-all group">
                  <div className={`w-12 h-12 bg-gradient-to-br ${pkg.color} rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    {pkg.emoji}
                  </div>
                  <p className="font-black text-gray-800 text-sm">{pkg.tier}</p>
                  <p className="text-orange-600 font-bold text-lg">{pkg.price}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- PANDIT & KATHA VACHAK PROMO --- */}
      <section className="py-24 bg-[#FFFAF3]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">पंडित और कथा वाचक</h2>
            <div className="h-1.5 w-20 bg-orange-500 mx-auto rounded-full" />
            <p className="text-slate-500 mt-4 text-lg">अनुभवी पंडितों और कथा वाचकों को घर बैठे बुक करें</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div whileHover={{ y: -8 }} className="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amber-50 to-orange-100 border border-orange-200 p-8 shadow-lg">
              <div className="absolute top-4 right-4 text-6xl opacity-20">🕉️</div>
              <div className="text-5xl mb-5">🙏</div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">पंडित बुकिंग</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">पूजा, हवन, विवाह, मुंडन — सभी संस्कारों के लिए अनुभवी पंडित बुक करें।</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['पूजा', 'हवन', 'विवाह', 'मुंडन', 'गृह प्रवेश'].map(t => (
                  <span key={t} className="bg-orange-200 text-orange-800 text-xs font-bold px-3 py-1 rounded-full">{t}</span>
                ))}
              </div>
              <button onClick={() => safeNavigate('/pandits')} className="inline-flex items-center gap-2 bg-orange-600 text-white font-black px-6 py-3 rounded-2xl hover:bg-orange-700 transition-all shadow-lg">
                पंडित खोजें →
              </button>
            </motion.div>
            <motion.div whileHover={{ y: -8 }} className="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-50 to-purple-100 border border-purple-200 p-8 shadow-lg">
              <div className="absolute top-4 right-4 text-6xl opacity-20">📖</div>
              <div className="text-5xl mb-5">📖</div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">कथा वाचक</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">रामायण, भागवत, सुंदरकांड — अनुभवी कथा वाचकों को अपने घर या मंदिर में बुलाएं।</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['रामायण', 'भागवत', 'सुंदरकांड', 'शिव पुराण'].map(t => (
                  <span key={t} className="bg-purple-200 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">{t}</span>
                ))}
              </div>
              <button onClick={() => safeNavigate('/katha-vachaks')} className="inline-flex items-center gap-2 bg-violet-600 text-white font-black px-6 py-3 rounded-2xl hover:bg-violet-700 transition-all shadow-lg">
                कथा वाचक खोजें →
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- QUOTE SECTION --- */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif italic text-orange-400 leading-tight mb-8">
              "कलियुग केवल नाम अधारा। <br />सुमिर सुमिर नर उतरहिं पारा।।"
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] w-12 bg-orange-800" />
              <p className="text-lg font-bold text-orange-200 uppercase tracking-widest">— श्री रामचरितमानस</p>
              <div className="h-[1px] w-12 bg-orange-800" />
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