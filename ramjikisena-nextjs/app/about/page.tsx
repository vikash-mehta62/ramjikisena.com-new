'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const goals = [
  { title: 'राम नाम का प्रसार', desc: 'राम नाम के महत्व को जन-जन तक पहुंचाना' },
  { title: 'लेखन की प्रेरणा', desc: 'लोगों को राम नाम लेखन के लिए प्रेरित करना' },
  { title: 'आध्यात्मिक सहायता', desc: 'आध्यात्मिक विकास में सहायता करना' },
  { title: 'सकारात्मक समुदाय', desc: 'एक सकारात्मक समुदाय का निर्माण करना' },
];

const features = [
  { icon: '📊', title: 'Daily Tracking', desc: 'अपनी दैनिक प्रगति को ट्रैक करें' },
  { icon: '🏆', title: 'Leaderboard', desc: 'अन्य भक्तों के साथ प्रतिस्पर्धा करें' },
  { icon: '📈', title: 'Progress Chart', desc: 'अपनी आध्यात्मिक यात्रा देखें' },
  { icon: '👥', title: 'Community', desc: 'भक्तों का समुदाय' },
];

const values = [
  { icon: '🙏', title: 'भक्ति', desc: 'राम नाम में अटूट आस्था' },
  { icon: '🤝', title: 'समुदाय', desc: 'साथ मिलकर जप करना' },
  { icon: '🌟', title: 'प्रेरणा', desc: 'हर दिन आगे बढ़ना' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFFAF3] text-slate-900 antialiased selection:bg-orange-200">
      <Navbar showAuthButtons={true} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-12">

        <div className="mb-10 text-center md:text-left">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-6xl font-black tracking-tight text-slate-900 leading-none">
              हमारे <span className="text-orange-600 italic">बारे में</span>
            </h1>
            <div className="h-1 w-16 bg-orange-500 mx-auto md:mx-0 mt-3 rounded-full" />
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">
              Ramji Ki Sena — Spiritual Portal
            </p>
          </motion.div>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-slate-900 rounded-[2.5rem] p-10 text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">🚩 Ramji Ki Sena 🚩</h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            कलयुग में न जप है न तप है और न योग ही है। सिर्फ राम नाम ही इस कलिकाल में प्राणी मात्र का सहारा है।
            श्री राम चन्द्र जी सहज ही कृपा करने वाले और परम दयालु हैं।
            राम नाम का लिखित जाप सभी पापों को नष्ट कर मुक्ति प्रदान करने वाला है।
          </p>
        </motion.div>

        {/* Goals */}
        <div className="mb-10">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6">हमारा उद्देश्य</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {goals.map((g, i) => (
              <motion.div key={g.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-white rounded-[2rem] border border-orange-100 shadow-sm hover:shadow-xl transition-all p-5 flex gap-4 items-start">
                <span className="text-2xl flex-shrink-0">✅</span>
                <div>
                  <h3 className="font-black text-slate-900 text-sm mb-1">{g.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{g.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-10">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6">विशेषताएं</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-white rounded-[2rem] border border-orange-100 shadow-sm hover:shadow-xl transition-all p-5 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">{f.icon}</div>
                <h3 className="font-black text-slate-900 text-sm mb-1">{f.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-10">
          <div className="grid grid-cols-3 gap-4">
            {values.map((v, i) => (
              <motion.div key={v.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white rounded-[2rem] border border-orange-100 shadow-sm hover:shadow-xl transition-all p-5 text-center">
                <span className="text-3xl block mb-2">{v.icon}</span>
                <h3 className="font-black text-slate-900 text-sm mb-1">{v.title}</h3>
                <p className="text-slate-500 text-xs">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-r from-orange-500 to-red-500 rounded-[2.5rem] p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4">आज ही शुरू करें!</h2>
          <p className="text-orange-100 text-sm font-bold mb-6">राम नाम लेखन की अपनी आध्यात्मिक यात्रा शुरू करें</p>
          <Link href="/register" className="inline-block bg-white text-orange-600 rounded-2xl font-black px-8 py-3.5 hover:bg-orange-50 transition-all active:scale-95">
            रजिस्टर करें →
          </Link>
        </motion.div>
      </main>
      <footer className="py-12 text-center border-t border-orange-100 mt-10">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.8em]">जय श्री राम</p>
      </footer>
    </div>
  );
}
