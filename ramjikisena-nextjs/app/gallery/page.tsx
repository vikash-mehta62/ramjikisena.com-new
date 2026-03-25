'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const galleryItems = [
  { title: 'राम मंदिर अयोध्या', emoji: '🛕', color: 'from-orange-400 to-red-500' },
  { title: 'राम नाम लेखन', emoji: '✍️', color: 'from-amber-400 to-orange-500' },
  { title: 'भजन संध्या', emoji: '🎵', color: 'from-purple-400 to-violet-500' },
  { title: 'सामुदायिक कार्यक्रम', emoji: '👥', color: 'from-blue-400 to-cyan-500' },
  { title: 'कथा कार्यक्रम', emoji: '📖', color: 'from-green-400 to-emerald-500' },
  { title: 'आरती', emoji: '🪔', color: 'from-yellow-400 to-amber-500' },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#FFFAF3] text-slate-900 antialiased selection:bg-orange-200">
      <Navbar showAuthButtons={true} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-12">

        <div className="mb-10 text-center md:text-left">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-6xl font-black tracking-tight text-slate-900 leading-none">
              फोटो <span className="text-orange-600 italic">गैलरी</span>
            </h1>
            <div className="h-1 w-16 bg-orange-500 mx-auto md:mx-0 mt-3 rounded-full" />
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">
              Divine Moments &amp; Spiritual Events
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {galleryItems.map((item, i) => (
            <motion.div key={item.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
              className="group bg-white rounded-2xl md:rounded-[2.5rem] border border-orange-100 shadow-sm hover:shadow-xl transition-all overflow-hidden">
              <div className={`h-48 md:h-64 bg-gradient-to-br ${item.color} flex items-center justify-center overflow-hidden`}>
                <span className="text-6xl md:text-7xl drop-shadow-lg transition-transform duration-500 group-hover:scale-110">
                  {item.emoji}
                </span>
              </div>
              <div className="p-4 md:p-5">
                <h3 className="text-sm md:text-base font-black text-slate-900 tracking-tight group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="mt-12 bg-slate-900 rounded-[2.5rem] p-10 text-center">
          <h2 className="text-2xl md:text-4xl font-black text-white mb-3">अपनी फोटो शेयर करें</h2>
          <p className="text-slate-400 text-sm font-bold mb-6">अपने भक्ति के पलों को हमारे साथ साझा करें</p>
          <Link href="/contact"
            className="inline-block bg-orange-600 text-white rounded-2xl font-black px-8 py-3.5 hover:bg-orange-700 transition-all active:scale-95">
            संपर्क करें →
          </Link>
        </motion.div>
      </main>
      <footer className="py-12 text-center border-t border-orange-100 mt-10">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.8em]">जय श्री राम</p>
      </footer>
    </div>
  );
}
