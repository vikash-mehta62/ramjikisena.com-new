import Link from 'next/link';
import { Mail, Phone, MapPin, ExternalLink, Youtube, Facebook, Instagram, Twitter } from 'lucide-react';

const footerLinks = {
  'Quick Links': [
    { label: 'होम', href: '/' },
    { label: 'हमारे बारे में', href: '/about' },
    { label: 'संपर्क', href: '/contact' },
  ],
  'सेवाएं': [
    { label: 'राम नाम लेखन', href: '/dashboard' },
    { label: 'मंदिर दर्शन', href: '/mandirs' },
    { label: 'पंडित बुकिंग', href: '/pandits' },
  ],
  'समुदाय': [
    { label: 'भक्त गण', href: '/devotees' },
    { label: 'ब्लॉग', href: '/blogs' },
    { label: 'लीडरबोर्ड', href: '/history' },
  ],
};

export default function Footer() {
  const marqueeStyle = {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    animation: 'marquee 40s linear infinite',
  };

  const marqueeReverseStyle = {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    animation: 'marquee-reverse 40s linear infinite',
  };

  return (
    <footer className="relative overflow-hidden w-full" style={{ background: 'linear-gradient(180deg, #2a0e02 0%, #1a0800 100%)' }}>
      
      {/* Keyframes for Animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marquee-reverse { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
      `}} />

      {/* --- Small "Ram Ram" Watermark --- */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none flex flex-col justify-around py-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex overflow-hidden">
            <div style={i % 2 === 0 ? marqueeReverseStyle : marqueeStyle} className="text-[24px] font-bold tracking-[15px] text-orange-200">
              राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम
            </div>
            <div style={i % 2 === 0 ? marqueeReverseStyle : marqueeStyle} className="text-[24px] font-bold tracking-[15px] text-orange-200">
              राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम राम
            </div>
          </div>
        ))}
      </div>

      {/* Main Content (More Compact) */}
      <div className="container relative z-10 mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg text-xl"
                style={{ background: 'linear-gradient(135deg, #f9e07a, #d4920a)', color: '#3a0f00' }}>
                🚩
              </div>
              <h2 className="text-xl font-black tracking-tight text-white">
                RAMJI KI <span className="text-[#f9e07a]">SENA</span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed mb-6 text-white/60 max-w-xs">
              डिजिटल माध्यम से अपनी भक्ति यात्रा को नई ऊंचाइयों पर ले जाएं।
            </p>
            
            <div className="flex gap-3">
              {[<Youtube size={16}/>, <Facebook size={16}/>, <Instagram size={16}/>, <Twitter size={16}/>].map((icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg flex items-center justify-center border border-white/10 bg-white/5 text-white/40 hover:text-[#f9e07a] hover:border-[#f9e07a] transition-all">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="font-bold text-[11px] uppercase tracking-[0.2em] mb-4 text-[#f9e07a]">
                  {title}
                </h3>
                <ul className="space-y-2.5">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href} className="text-[13px] text-white/50 hover:text-white transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar (Thin) */}
      <div className="relative z-10 border-t border-white/5 bg-black/30 backdrop-blur-md">
        <div className="container mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[12px] text-white/30 flex items-center gap-4">
            <span>© 2026 Ramji Ki Sena</span>
            <Link href="/" className="hover:text-white">Privacy</Link>
            <Link href="/" className="hover:text-white">Terms</Link>
          </div>
          
          <a href="https://inextets.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] font-bold text-white/20 hover:text-[#f9e07a] transition-all">
            Powered by <span className="text-white/40">iNext ETS</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
}