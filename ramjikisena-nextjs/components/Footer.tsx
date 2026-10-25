import Link from 'next/link';
import Image from 'next/image';
import {
  Mail, Phone, MapPin, ExternalLink, Youtube, Facebook,
  Instagram, Twitter, Sparkles, Heart, ArrowRight, ShieldCheck, Flame, BookOpen
} from 'lucide-react';

const darshanGalleries = [
  {
    title: 'अयोध्या धाम',
    sub: 'भव्य राम मंदिर तीर्थ',
    img: '/images/Ayodhya Ramji Photo.webp',
    href: '/mandirs',
  },
  {
    title: 'श्री राम लला',
    sub: 'पावन विग्रह दर्शन',
    img: '/images/aboutImg1.webp',
    href: '/gallery',
  },
  {
    title: 'हनुमान गढ़ी',
    sub: 'संकटमोचन अयोध्या',
    img: '/hanumanji.jpg',
    href: '/glory',
  },
  {
    title: 'अमृत रामकथा',
    sub: 'पूज्य व्यास पीठ',
    img: '/home/kathavachak.webp',
    href: '/katha-vachaks',
  },
];

const serviceLinks = [
  { label: 'अखंड राम नाम जप बैंक', href: '/#jaap' },
  { label: 'दैनिक पंचांग व शुभ मुहूर्त', href: '/#panchang' },
  { label: 'प्रमाणित वैदिक पंडित जी', href: '/pandits' },
  { label: 'पावन मंदिर तीर्थ दर्शन', href: '/mandirs' },
  // { label: '100% शुद्ध पूजन सामग्री', href: '/samagri' },
  { label: 'वैदिक ज्योतिष & कुंडली', href: '/astrology' },
];

const wisdomLinks = [
  { label: 'श्री रामचरितमानस चौपाई', href: '/#chaupai' },
  { label: 'श्री हनुमान चालीसा व स्तोत्र', href: '/glory' },
  { label: 'अमृत रामकथा व प्रवचन', href: '/katha-vachaks' },
  { label: 'धार्मिक प्रेरक आलेख व ब्लॉग', href: '/blogs' },
  { label: 'भक्त सत्संग फोरम', href: '/forum' },
  { label: 'दिव्य पावन छायाचित्र गैलरी', href: '/gallery' },
];

const trustLinks = [
  { label: 'हमारे बारे में', href: '/about' },
  { label: 'राम भक्त परिवार समुदाय', href: '/community' },
  { label: 'सेवा व दान संकल्प', href: '/about' },
  { label: 'नियम व शर्तें', href: '/' },
  { label: 'गोपनीयता नीति (Privacy)', href: '/' },
  { label: 'संपर्क व सहायता', href: '/about' },
];

export default function Footer() {
  const marqueeStyle = {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    animation: 'marquee 50s linear infinite',
  };

  const marqueeReverseStyle = {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    animation: 'marquee-reverse 50s linear infinite',
  };

  return (
    <footer className="relative overflow-hidden w-full bg-gradient-to-b from-[#350A01] via-[#240600] to-[#150300] text-white border-t-2 border-[#D4AF37]/50">
      
      {/* Keyframes for Subtle Marquee */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marquee-reverse { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
      `}} />

      {/* --- Sacred Ram Naam Watermark --- */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] select-none flex flex-col justify-around py-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex overflow-hidden">
            <div style={i % 2 === 0 ? marqueeReverseStyle : marqueeStyle} className="text-[22px] font-serif font-black tracking-[16px] text-amber-200">
              श्री राम जय राम जय जय राम • राम राम राम राम • हरे राम हरे कृष्ण • जय श्री राम नाम
            </div>
            <div style={i % 2 === 0 ? marqueeReverseStyle : marqueeStyle} className="text-[22px] font-serif font-black tracking-[16px] text-amber-200">
              श्री राम जय राम जय जय राम • राम राम राम राम • हरे राम हरे कृष्ण • जय श्री राम नाम
            </div>
          </div>
        ))}
      </div>

      {/* ================= 1. TOP SACRED SHLOK BANNER ================= */}
      <div className="relative z-10 border-b border-[#D4AF37]/20 bg-black/30 backdrop-blur-xs py-3 px-4">
        <div className="container mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#FBE192] font-serif font-semibold">
            <span>🚩</span>
            <span>॥ ॐ श्री रामाय नमः ॥</span>
            <span className="text-[#D4AF37]/50 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-amber-100/80">रामो विग्रहवान् धर्मः साधुः सत्यपराक्रमः</span>
          </div>
          <div className="text-[11px] text-amber-200/70 font-medium">
            <span>विश्वव्यापी डिजिटल राम नाम साधना महायज्ञ</span>
          </div>
        </div>
      </div>

      {/* ================= 2. SACRED DARSHAN GALLERY STRIP (पावन धाम दर्शन) ================= */}
      <div className="relative z-10 border-b border-[#D4AF37]/20 py-8 bg-black/15">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">🛕</span>
              <p className="text-xs font-serif font-bold uppercase tracking-wider text-[#FBE192]">
                पावन धाम व दिव्य विग्रह दर्शन
              </p>
            </div>
            <Link
              href="/mandirs"
              className="text-[11px] font-bold text-amber-200/80 hover:text-[#FBE192] flex items-center gap-1 transition-colors"
            >
              <span>तीर्थ दर्शन देखें</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {darshanGalleries.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="group relative rounded-xl overflow-hidden border border-[#D4AF37]/40 shadow-sm hover:border-[#D4AF37] hover:shadow-md transition-all aspect-[16/10] bg-black/40 flex flex-col justify-end p-2.5"
              >
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  sizes="(max-width:640px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-106 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent group-hover:from-black/90 transition-all" />
                <div className="relative z-10">
                  <p className="text-xs font-serif font-bold text-white group-hover:text-[#FBE192] transition-colors leading-tight">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-amber-200/80 mt-0.5 line-clamp-1">
                    {item.sub}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ================= 3. MAIN FOOTER CONTENT ================= */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Col 1: Brand & Logo (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              {/* Official Brand Logo */}
              <Link href="/" className="inline-flex items-center gap-3 group mb-4">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-[#D4AF37] shadow-lg bg-[#FFF8EE] group-hover:scale-105 transition-transform">
                  <Image
                    src="/images/ramjikisena_logo.webp"
                    alt="राम जी की सेना लोगो"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-black tracking-tight text-white leading-none">
                    Jai Shri <span className="text-[#FBE192]">Ram Naam</span>
                  </h2>
                  <p className="text-[10px] text-amber-200/90 font-bold tracking-wider uppercase mt-1">
                    श्री राम जी की सेना • Jai Shree Ram
                  </p>
                </div>
              </Link>

              <p className="text-xs text-amber-100/75 leading-relaxed mb-5 max-w-sm">
                डिजिटल माध्यम से अखंड राम नाम संकीर्तन, 108 करोड़ राम नाम महायज्ञ एवं सनातन संस्कृति, 
                वैदिक परंपराओं का विश्वव्यापी लोक-कल्याणकारी प्रसार।
              </p>

              {/* Devotional Helpline Pill */}
              <div className="p-3 rounded-xl bg-white/5 border border-[#D4AF37]/30 mb-5 max-w-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FBE192] mb-1">
                  <span>🚩</span>
                  <span>राम सेवा केंद्र व सहायता:</span>
                </div>
                <p className="text-[11px] text-amber-100/70">
                  contact@ramjikisena.com • Ayodhya Seva
                </p>
              </div>

              {/* Social Media Links */}
              <div className="flex items-center gap-2.5">
                {[
                  { icon: Youtube, href: '#', label: 'YouTube' },
                  { icon: Facebook, href: '#', label: 'Facebook' },
                  { icon: Instagram, href: '#', label: 'Instagram' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                ].map(({ icon: Icon, href, label }, idx) => (
                  <a
                    key={idx}
                    href={href}
                    aria-label={label}
                    className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#D4AF37]/40 bg-white/5 text-amber-200/80 hover:text-[#FBE192] hover:border-[#D4AF37] hover:bg-white/10 transition-all"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2: Services (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <h3 className="font-serif font-bold text-xs uppercase tracking-[0.2em] mb-4 text-[#FBE192] flex items-center gap-1.5">
              <span>🪷</span>
              <span>पावन सेवाएं</span>
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs text-amber-100/70 hover:text-[#FBE192] hover:translate-x-1 transition-all inline-block"
                  >
                    • {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Wisdom & Knowledge (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <h3 className="font-serif font-bold text-xs uppercase tracking-[0.2em] mb-4 text-[#FBE192] flex items-center gap-1.5">
              <span>📖</span>
              <span>अमृत ज्ञान व साहित्य</span>
            </h3>
            <ul className="space-y-2.5">
              {wisdomLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs text-amber-100/70 hover:text-[#FBE192] hover:translate-x-1 transition-all inline-block"
                  >
                    • {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Trust Card & Akhand Jaap CTA (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <div className="p-4 rounded-xl bg-gradient-to-b from-white/10 to-white/5 border border-[#D4AF37]/40 text-center">
              <div className="relative w-16 h-20 mx-auto rounded-lg overflow-hidden border border-[#D4AF37] shadow-sm mb-2.5">
                <Image
                  src="/images/hero-mobile-ramji.webp"
                  alt="प्रभु श्री राम"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-xs font-serif font-bold text-[#FBE192]">
                अखंड राम नाम जप
              </p>
              <p className="text-[10px] text-amber-100/70 mt-0.5">
                1.42+ करोड़ नाम संचित
              </p>
              <Link
                href="/#jaap"
                className="mt-3 w-full py-1.5 px-2 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1 shadow-sm inline-flex"
              >
                <span>नाम जपें</span>
                <Flame className="w-3 h-3" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ================= 4. VEDIC AUTHENTICATION & TRUST STRIP ================= */}
      <div className="relative z-10 border-t border-[#D4AF37]/20 bg-black/40 py-3.5 px-4">
        <div className="container mx-auto max-w-6xl flex flex-wrap items-center justify-center sm:justify-between gap-3 text-[11px] text-amber-100/75">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FBE192]" />
              <span>100% सात्विक एवं वैदिक परंपरा</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>विश्वव्यापी अखंड संकीर्तन महायज्ञ</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>निःस्वार्थ राम सेवा संकल्प</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-amber-200/60">
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <span>|</span>
            <Link href="/" className="hover:text-white transition-colors">Privacy</Link>
            <span>|</span>
            <Link href="/" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>

      {/* ================= 5. BOTTOM BAR ================= */}
      <div className="relative z-10 border-t border-white/5 bg-black/60 py-3 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-amber-200/50">
          <div>
            © 2026 Jai Shri Ram Naam (राम जी की सेना). समस्त अधिकार सुरक्षित.
          </div>
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <a
              href="https://inextets.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-200/80 hover:text-[#FBE192] font-semibold transition-colors flex items-center gap-1"
            >
              <span>iNext ETS</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
}
