import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Youtube, Facebook, Twitter } from 'lucide-react';

const footerLinks = {
  'Quick Links': [
    { label: 'होम', href: '/' },
    { label: 'हमारे बारे में', href: '/about' },
    { label: 'मिशन', href: '/mission' },
    { label: 'गैलरी', href: '/gallery' },
    { label: 'संपर्क', href: '/contact' },
  ],
  'सेवाएं': [
    { label: 'राम नाम लेखन', href: '/dashboard' },
    { label: 'पूजन सामग्री', href: '/samagri' },
    { label: 'मंदिर दर्शन', href: '/mandirs' },
    { label: 'पंडित बुकिंग', href: '/pandits' },
    { label: 'कथा वाचक', href: '/katha-vachaks' },
  ],
  'समुदाय': [
    { label: 'भक्त गण', href: '/devotees' },
    { label: 'ब्लॉग', href: '/blogs' },
    { label: 'फोरम', href: '/community' },
    { label: 'लीडरबोर्ड', href: '/history' },
    { label: 'फीडबैक', href: '/feedback' },
  ],
};

const socialLinks = [
  { Icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-500' },
  { Icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-red-500' },
  { Icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-500' },
  { Icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-400' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Top CTA Strip */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 py-4">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white font-semibold text-sm">🙏 राम नाम का जाप शुरू करें — आज ही जुड़ें</p>
          <Link
            href="/register"
            className="bg-white text-orange-700 font-bold text-sm px-5 py-2 rounded-full hover:bg-orange-50 transition-colors whitespace-nowrap"
          >
            अभी रजिस्टर करें →
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-black text-white mb-2 tracking-wide">
              🚩 Ramji Ki <span className="text-orange-500">Sena</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              कलियुग में नाम ही आधार है। डिजिटल माध्यम से अपनी भक्ति यात्रा को नई ऊंचाइयों पर ले जाएं।
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-slate-400">contact@ramjikisena.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-slate-400">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-slate-400">अयोध्या, उत्तर प्रदेश, भारत</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map(({ Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 ${color} hover:bg-slate-700 transition-all`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">{title}</h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-slate-400 text-sm hover:text-orange-400 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">
            © 2026 Ramji Ki Sena. Built with 🙏 Devotion. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Use'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                className="text-slate-500 text-xs hover:text-orange-400 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
