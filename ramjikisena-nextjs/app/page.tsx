'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Save, BarChart3, Flag, Flower2, Bird, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import MusicPlayer from '@/components/MusicPlayer';
import { authApi, User } from '@/lib/auth';

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
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentCount, setCurrentCount] = useState(0);
  const [textareaValue, setTextareaValue] = useState('');
  const [userInput, setUserInput] = useState('');
  const [selectedName, setSelectedName] = useState<'RAM' | 'RADHE' | 'HARE_KRISHNA'>('RAM');

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

  const appendCharacter = (char: string) => {
    let newTextarea = textareaValue;
    
    // RAM logic
    if (selectedName === 'RAM') {
      if (char === 'R' && (userInput === '' || userInput === 'RAM')) {
        setUserInput('R');
        newTextarea += 'र';
      } else if (char === 'A' && userInput === 'R') {
        setUserInput('RA');
        newTextarea += 'ा';
      } else if (char === 'M' && userInput === 'RA') {
        setUserInput('RAM');
        newTextarea += 'म ';
        setCurrentCount(prev => prev + 1);
      } else {
        return;
      }
    }
    
    // RADHE logic
    if (selectedName === 'RADHE') {
      if (char === 'RA' && (userInput === '' || userInput === 'RADHE')) {
        setUserInput('RA');
        newTextarea += 'रा';
      } else if (char === 'DHE' && userInput === 'RA') {
        setUserInput('RADHE');
        newTextarea += 'धे ';
        setCurrentCount(prev => prev + 1);
      } else {
        return;
      }
    }
    
    // HARE KRISHNA logic
    if (selectedName === 'HARE_KRISHNA') {
      if (char === 'HA' && (userInput === '' || userInput === 'HAREKRISHNA')) {
        setUserInput('HA');
        newTextarea += 'ह';
      } else if (char === 'RE' && userInput === 'HA') {
        setUserInput('HARE');
        newTextarea += 'रे ';
      } else if (char === 'KRI' && userInput === 'HARE') {
        setUserInput('HAREKRI');
        newTextarea += 'कृ';
      } else if (char === 'SHNA' && userInput === 'HAREKRI') {
        setUserInput('HAREKRISHNA');
        newTextarea += 'ष्णा ';
        setCurrentCount(prev => prev + 1);
      } else {
        return;
      }
    }
    
    setTextareaValue(newTextarea);
  };

  const handleSave = async () => {
    if (textareaValue.trim() === '') {
      alert('कृपया पहले राम नाम लिखें');
      return;
    }

    try {
      const result = await authApi.saveCount(currentCount, (user?.totalCount || 0) + currentCount, (user?.mala || 0) + (currentCount / 108));
      
      if (result.success) {
        alert('✅ आपका रामनाम धन सेव हो गया है!');
        setTextareaValue('');
        setUserInput('');
        setCurrentCount(0);
        checkAuth(); // Refresh user data
      }
    } catch (error) {
      alert('Error saving data');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFAF3] overflow-x-hidden selection:bg-orange-200">
      <Navbar showAuthButtons={true} />
      
      {/* Music Player - Floating */}
      <MusicPlayer />

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

      {/* --- SAMAGRI PROMO SECTION --- */}
      <section className="py-20 bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 text-[12rem] text-white">🪔</div>
          <div className="absolute bottom-0 right-0 text-[12rem] text-white">🌸</div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-block bg-white/20 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-4">🆕 New Feature</div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">पूजन सामग्री<br/>घर पर मंगाएं</h2>
              <p className="text-orange-100 text-lg mb-6 leading-relaxed">
                शुद्ध और प्रामाणिक पूजा सामग्री अब आपके दरवाजे तक। Basic, Standard और Premium पैकेज उपलब्ध हैं।
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {['✅ 100% शुद्ध सामग्री', '🚚 Free Delivery ₹500+', '📦 Ready-to-use Packages', '🙏 Trusted by Devotees'].map(f => (
                  <span key={f} className="bg-white/15 text-white text-sm font-semibold px-4 py-2 rounded-full">{f}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/samagri" className="inline-flex items-center gap-2 bg-white text-orange-700 font-black px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg">
                  🛒 अभी खरीदें
                </Link>
                <Link href="/samagri?tab=packages" className="inline-flex items-center gap-2 bg-white/20 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/30 transition-all text-lg border border-white/30">
                  🎁 Packages देखें
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { tier: 'Basic', price: '₹499', emoji: '🌿', color: 'from-green-400 to-emerald-500', items: ['अगरबत्ती', 'दीपक', 'फूल', 'रोली'] },
                { tier: 'Standard', price: '₹999', emoji: '🪔', color: 'from-orange-400 to-amber-500', items: ['सभी Basic', 'घी', 'मिठाई', 'कपड़ा'] },
                { tier: 'Premium', price: '₹1999', emoji: '👑', color: 'from-purple-500 to-violet-600', items: ['सभी Standard', 'मूर्ति', 'विशेष सामग्री'] },
              ].map(pkg => (
                <Link key={pkg.tier} href="/samagri"
                  className="bg-white rounded-2xl p-4 text-center shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all group">
                  <div className={`w-12 h-12 bg-gradient-to-br ${pkg.color} rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    {pkg.emoji}
                  </div>
                  <p className="font-black text-gray-800 text-sm">{pkg.tier}</p>
                  <p className="text-orange-600 font-bold text-lg">{pkg.price}</p>
                  <div className="mt-2 space-y-0.5">
                    {pkg.items.map(item => (
                      <p key={item} className="text-xs text-gray-500">{item}</p>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- NAAM JAP SECTION (Only for Logged In Users) --- */}
      {!loading && user && (
        <section className="py-20 bg-gradient-to-br from-orange-100 via-red-100 to-yellow-100 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 text-[8rem] text-orange-600">ॐ</div>
            <div className="absolute bottom-10 right-10 text-[8rem] text-red-600">🚩</div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              {/* Welcome Header */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-black text-slate-900 mb-3">
                  🙏 नमस्ते, {user.name}!
                </h2>
                <p className="text-lg text-slate-600">यहाँ से राम नाम लेखन शुरू करें</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-lg border-2 border-orange-200">
                  <div className="text-sm font-semibold text-gray-600 mb-2">Your Rank</div>
                  <div className="text-4xl font-black text-orange-600">#{user.rank}</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-lg border-2 border-red-200">
                  <div className="text-sm font-semibold text-gray-600 mb-2">Total Count</div>
                  <div className="text-4xl font-black text-red-600">{user.totalCount}</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-lg border-2 border-yellow-200">
                  <div className="text-sm font-semibold text-gray-600 mb-2">Mala Count</div>
                  <div className="text-4xl font-black text-yellow-600">{user.mala.toFixed(1)}</div>
                </div>
              </div>

              {/* Naam Jap Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-orange-200">
                {/* Name Selector */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-700 mb-4 text-center flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-600" />
                    नाम चुनें / Select Name
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        setSelectedName('RAM');
                        setUserInput('');
                        setTextareaValue('');
                      }}
                      className={`p-4 rounded-xl font-bold text-lg transition-all ${
                        selectedName === 'RAM'
                          ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg scale-105'
                          : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-2 border-orange-200'
                      }`}
                    >
                      <Flag className="w-8 h-8 mx-auto mb-1" />
                      <div className="text-sm">राम</div>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedName('RADHE');
                        setUserInput('');
                        setTextareaValue('');
                      }}
                      className={`p-4 rounded-xl font-bold text-lg transition-all ${
                        selectedName === 'RADHE'
                          ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg scale-105'
                          : 'bg-pink-50 text-pink-700 hover:bg-pink-100 border-2 border-pink-200'
                      }`}
                    >
                      <Flower2 className="w-8 h-8 mx-auto mb-1" />
                      <div className="text-sm">राधे</div>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedName('HARE_KRISHNA');
                        setUserInput('');
                        setTextareaValue('');
                      }}
                      className={`p-4 rounded-xl font-bold text-lg transition-all ${
                        selectedName === 'HARE_KRISHNA'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-2 border-blue-200'
                      }`}
                    >
                      <Bird className="w-8 h-8 mx-auto mb-1" />
                      <div className="text-sm">हरे कृष्णा</div>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-orange-700">
                    {selectedName === 'RAM' && 'राम नाम लेखन'}
                    {selectedName === 'RADHE' && 'राधे नाम लेखन'}
                    {selectedName === 'HARE_KRISHNA' && 'हरे कृष्णा लेखन'}
                  </h3>
                  <div className="bg-orange-100 px-4 py-2 rounded-full">
                    <span className="text-sm font-bold text-orange-700">
                      Count: {currentCount}
                    </span>
                  </div>
                </div>

                {/* Writing Area */}
                <textarea
                  value={textareaValue}
                  readOnly
                  className="w-full h-32 p-4 border-2 border-orange-300 rounded-2xl focus:outline-none focus:border-orange-500 text-2xl font-semibold text-orange-700 resize-none mb-6 bg-orange-50/50"
                  placeholder={
                    selectedName === 'RAM' ? 'यहाँ पर राम नाम लिखें...' :
                    selectedName === 'RADHE' ? 'यहाँ पर राधे नाम लिखें...' :
                    'यहाँ पर हरे कृष्णा लिखें...'
                  }
                />

                {/* Buttons - Dynamic based on selected name */}
                {selectedName === 'RAM' && (
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <button
                      onClick={() => appendCharacter('R')}
                      className="bg-gradient-to-br from-red-500 to-red-600 text-white text-3xl font-bold py-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
                    >
                      र
                    </button>
                    <button
                      onClick={() => appendCharacter('A')}
                      className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-3xl font-bold py-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
                    >
                      ा
                    </button>
                    <button
                      onClick={() => appendCharacter('M')}
                      className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white text-3xl font-bold py-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
                    >
                      म
                    </button>
                  </div>
                )}

                {selectedName === 'RADHE' && (
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                      onClick={() => appendCharacter('RA')}
                      className="bg-gradient-to-br from-pink-500 to-pink-600 text-white text-3xl font-bold py-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
                    >
                      रा
                    </button>
                    <button
                      onClick={() => appendCharacter('DHE')}
                      className="bg-gradient-to-br from-rose-500 to-rose-600 text-white text-3xl font-bold py-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
                    >
                      धे
                    </button>
                  </div>
                )}

                {selectedName === 'HARE_KRISHNA' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <button
                      onClick={() => appendCharacter('HA')}
                      className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-3xl font-bold py-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
                    >
                      ह
                    </button>
                    <button
                      onClick={() => appendCharacter('RE')}
                      className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white text-3xl font-bold py-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
                    >
                      रे
                    </button>
                    <button
                      onClick={() => appendCharacter('KRI')}
                      className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-3xl font-bold py-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
                    >
                      कृ
                    </button>
                    <button
                      onClick={() => appendCharacter('SHNA')}
                      className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-3xl font-bold py-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
                    >
                      ष्णा
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleSave}
                    disabled={currentCount === 0}
                    className="bg-gradient-to-r from-green-600 to-teal-600 text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save
                  </button>
                  <Link
                    href="/dashboard"
                    className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all text-center flex items-center justify-center gap-2"
                  >
                    <BarChart3 className="w-5 h-5" />
                    Full Dashboard
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

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