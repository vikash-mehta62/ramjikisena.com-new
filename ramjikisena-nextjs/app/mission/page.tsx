'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const missionCards = [
  { icon: '🙏', title: 'आध्यात्मिक विकास', desc: 'हमारा उद्देश्य प्रत्येक व्यक्ति को राम नाम के माध्यम से आध्यात्मिक विकास की ओर प्रेरित करना है। राम नाम का जप मन को शांति प्रदान करता है।' },
  { icon: '🌟', title: 'समुदाय निर्माण', desc: 'एक ऐसे समुदाय का निर्माण करना जहां सभी भक्त एक साथ मिलकर राम नाम का जप करें और एक दूसरे को प्रेरित करें।' },
  { icon: '📈', title: 'दैनिक अभ्यास', desc: 'राम नाम लेखन को दैनिक जीवन का हिस्सा बनाना। नियमित अभ्यास से आध्यात्मिक शक्ति में वृद्धि होती है।' },
  { icon: '🌍', title: 'वैश्विक पहुंच', desc: 'राम नाम की महिमा को विश्व भर में फैलाना। यह मंच सभी देशों के भक्तों के लिए उपलब्ध है।' },
];

const stats = [
  { value: '1.2Cr+', label: 'जाप' },
  { value: '50k+', label: 'भक्त' },
  { value: '500+', label: 'शहर' },
  { value: '108', label: 'दैनिक माला' },
];

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-[#FFFAF3] text-slate-900 antialiased selection:bg-orange-200">
      <Navbar showAuthButtons={true} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-12">

        <div className="mb-10 text-center md:text-left">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-6xl font-black tracking-tight text-slate-900 leading-none">
              हमारा <span className="text-orange-600 italic">मिशन</span>
            </h1>
            <div className="h-1 w-16 bg-orange-500 mx-auto md:mx-0 mt-3 rounded-full" />
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">
              Spiritual Awakening Through Ram Naam
            </p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-slate-900 rounded-[2.5rem] p-10 text-center mb-10">
          <p className="text-white text-xl md:text-2xl font-black">राम नाम के माध्यम से आध्यात्मिक जागरण</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {missionCards.map((card, i) => (
            <motion.div key={card.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white rounded-[2.5rem] border border-orange-100 shadow-sm hover:shadow-xl transition-all p-6 md:p-8">
              <span className="text-3xl mb-4 block">{card.icon}</span>
              <h3 className="font-black text-slate-900 text-lg mb-2">{card.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-white rounded-[2.5rem] border border-orange-100 shadow-sm p-8 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map(s => (
              <div key={s.label}>
                <p className="text-3xl md:text-4xl font-black text-orange-600">{s.value}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-r from-orange-500 to-red-500 rounded-[2.5rem] p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4">हमारे साथ जुड़ें</h2>
          <p className="text-orange-100 text-sm font-bold mb-6">राम नाम लेखन की पवित्र यात्रा में हमारे साथ शामिल हों</p>
          <Link href="/register" className="inline-block bg-white text-orange-600 rounded-2xl font-black px-8 py-3.5 hover:bg-orange-50 transition-all active:scale-95">
            अभी शुरू करें →
          </Link>
        </motion.div>
      </main>
      <footer className="py-12 text-center border-t border-orange-100 mt-10">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.8em]">जय श्री राम</p>
      </footer>
    </div>
  );
}
