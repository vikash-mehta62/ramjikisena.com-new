'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';

const slides = [
  {
    title: "🚩 जय श्री राम",
    subtitle: "राम नाम का लिखित जाप",
    desc: "कलियुग में नाम ही आधार है। अपनी आध्यात्मिक यात्रा को डिजिटल माध्यम से नई ऊंचाइयों पर ले जाएं।",
    img: "/ramji.jpg",
    color: "from-orange-500 to-red-600",
    glow: "rgba(255, 100, 0, 0.3)"
  },
  {
    title: "🙏 जय श्री हनुमान",
    subtitle: "भक्ति की पराकाष्ठा",
    desc: "संकट कटे मिटे सब पीरा, जो सुमिरै हनुमत बलबीरा। भक्ति की शक्ति से जुड़ें।",
    img: "/hanumanji.jpg",
    color: "from-red-600 to-orange-700",
    glow: "rgba(220, 38, 38, 0.3)"
  }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFAF3] overflow-x-hidden selection:bg-orange-200">
      <Navbar showAuthButtons={true} />

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-20"></div>

      {/* --- HERO SECTION --- */}
  <section className="relative h-[90vh] max-h-[900px] flex items-center overflow-hidden">
  
  {/* Dynamic Background Elements */}
  <AnimatePresence mode="wait">
    <motion.div
      key={currentSlide}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 -z-10"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].color} opacity-[0.03]`} />
      
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -right-20 text-[18rem] font-bold text-orange-600/5 select-none pointer-events-none"
      >
        ॐ
      </motion.div>
    </motion.div>
  </AnimatePresence>

  <div className="container mx-auto px-6 relative z-10">
    <div className="grid lg:grid-cols-2 gap-10 items-center">
      
      {/* Left Content */}
      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold tracking-widest uppercase mb-3">
              {slides[currentSlide].subtitle}
            </span>

            {/* Smaller Heading */}
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
              {slides[currentSlide].title.split(' ').map((word, i) => (
                <span key={i} className={i === 1 ? "text-orange-600" : ""}>
                  {word}{" "}
                </span>
              ))}
            </h1>

            {/* Smaller Description */}
            <p className="text-base md:text-lg text-slate-600 max-w-md mb-6 leading-relaxed">
              {slides[currentSlide].desc}
            </p>
            
            {/* Smaller Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register" className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl shadow-lg transition hover:scale-105">
                अभी शुरू करें ✨
              </Link>
              
              <Link href="/login" className="px-6 py-3 bg-white text-slate-800 border border-slate-200 font-semibold rounded-xl hover:bg-slate-50 transition">
                लॉगिन करें 🙏
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Image */}
      <div className="flex justify-center items-center">
        <motion.div
          key={currentSlide}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div 
            className="absolute inset-0 rounded-full blur-[60px] opacity-30 animate-pulse"
            style={{ backgroundColor: slides[currentSlide].glow }}
          />
          
          <div className="relative w-[240px] h-[240px] md:w-[380px] md:h-[380px]">
            <div className="relative w-full h-full rounded-3xl overflow-hidden border-8 border-white shadow-xl">
              <Image 
                src={slides[currentSlide].img} 
                alt="Divine Image" 
                fill 
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  </div>
</section>

      {/* --- STATS SECTION (Modern Look) --- */}
      <section className="py-20 relative bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
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
                className="flex flex-col items-center"
              >
                <span className="text-2xl mb-2">{stat.icon}</span>
                <h3 className="text-4xl font-black text-slate-900 mb-1">{stat.val}</h3>
                <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-32 bg-[#FFFAF3]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">राम सेना की विशेषताएं</h2>
            <div className="h-1.5 w-24 bg-orange-500 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "डिजिटल डायरी", icon: "📝", desc: "कहीं भी, कभी भी नाम लिखें और अपनी आध्यात्मिक प्रगति को ट्रैक करें।" },
              { title: "लीडरबोर्ड", icon: "🏆", desc: "साप्ताहिक और मासिक रैंकिंग में अपना स्थान बनाकर अन्य भक्तों को प्रेरित करें।" },
              { title: "मंदिर दर्शन", icon: "🛕", desc: "देश भर के प्रसिद्ध मंदिरों के दर्शन और उनकी महिमा के बारे में जानें।" }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -15 }}
                className="group p-10 bg-white rounded-[3rem] border border-orange-100 shadow-xl shadow-orange-900/5 transition-all"
              >
                <div className="text-5xl mb-8 bg-orange-50 w-20 h-20 flex items-center justify-center rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed text-lg">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- QUOTE SECTION --- */}
      <section className="py-40 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-6xl font-serif italic text-orange-400 leading-tight mb-10">
              "कलियुग केवल नाम अधारा। <br />
              सुमिर सुमिर नर उतरहिं पारा।।"
            </h2>
            <div className="flex items-center justify-center gap-4">
               <div className="h-[1px] w-12 bg-orange-800" />
               <p className="text-xl font-bold text-orange-200 uppercase tracking-widest">— श्री रामचरितमानस</p>
               <div className="h-[1px] w-12 bg-orange-800" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white pt-24 pb-12 border-t border-orange-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-[0.2em] uppercase">
              Ramji Ki <span className="text-orange-600">Sena</span>
            </h2>
            <div className="flex gap-10 mb-12">
              {['About', 'Mission', 'Contact', 'Privacy'].map((link) => (
                <Link key={link} href={`/${link.toLowerCase()}`} className="text-sm font-bold text-slate-400 hover:text-orange-600 transition-colors uppercase">
                  {link}
                </Link>
              ))}
            </div>
            <p className="text-sm text-slate-400">© 2026 Ramji Ki Sena. Built with Devotion.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}