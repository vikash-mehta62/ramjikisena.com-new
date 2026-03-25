'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

export default function GloryPage() {
  const cards = [
    { border: 'border-orange-500', icon: '🕉️', title: 'राम नाम का महत्व', type: 'text', body: 'राम नाम सबसे सरल और सबसे शक्तिशाली मंत्र है। यह केवल दो अक्षरों का है लेकिन इसमें संपूर्ण ब्रह्मांड की शक्ति समाहित है। राम नाम का जप करने से मन शांत होता है और आत्मा को परम शांति की प्राप्ति होती है।' },
    { border: 'border-yellow-500', icon: '✨', title: 'राम नाम के लाभ', type: 'bullets', bullets: ['मन की शांति और स्थिरता', 'नकारात्मक विचारों से मुक्ति', 'आध्यात्मिक शक्ति में वृद्धि', 'जीवन में सकारात्मकता', 'पापों का नाश', 'मोक्ष की प्राप्ति'] },
    { border: 'border-red-500', icon: '📜', title: 'शास्त्रों में राम नाम', type: 'doha', doha: 'राम नाम मणि दीप धरु जीह देहरी द्वार।\nतुलसी भीतर बाहेरहुँ जौं चाहसि उजिआर।।', body: 'गोस्वामी तुलसीदास जी ने राम नाम को मणि और दीपक की संज्ञा दी है। राम नाम से ही जीवन में प्रकाश आता है।' },
    { border: 'border-purple-500', icon: '🌟', title: 'कलयुग में राम नाम', type: 'text', body: 'कलयुग में राम नाम ही एकमात्र सहारा है। न जप है, न तप है, न योग है। केवल राम नाम का जप ही मनुष्य को मुक्ति दिला सकता है।' },
  ];

  return (
    <div className="min-h-screen bg-[#FFFAF3] text-slate-900 antialiased selection:bg-orange-200">
      <Navbar showAuthButtons={true} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        <div className="mb-10 text-center md:text-left">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-6xl font-black tracking-tight text-slate-900 leading-none">
              राम नाम <span className="text-orange-600 italic">महिमा</span>
            </h1>
            <div className="h-1 w-16 bg-orange-500 mx-auto md:mx-0 mt-3 rounded-full" />
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">
              The Divine Power of Ram Naam
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {cards.map((card, i) => (
            <motion.div key={card.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`bg-white rounded-[2.5rem] border-l-4 ${card.border} border border-orange-100 shadow-sm hover:shadow-xl transition-all p-6 md:p-8`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{card.icon}</span>
                <h3 className="font-black text-slate-900 text-base md:text-lg">{card.title}</h3>
              </div>
              {card.type === 'text' && <p className="text-slate-600 text-sm leading-relaxed">{card.body}</p>}
              {card.type === 'bullets' && (
                <ul className="space-y-2">
                  {card.bullets!.map(b => (
                    <li key={b} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />{b}
                    </li>
                  ))}
                </ul>
              )}
              {card.type === 'doha' && (
                <div>
                  <p className="italic text-slate-700 text-sm leading-relaxed mb-3 border-l-2 border-red-300 pl-3 whitespace-pre-line">"{card.doha}"</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{card.body}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-slate-900 rounded-[2.5rem] p-10 text-center mb-6">
          <p className="text-orange-400 italic text-xl md:text-3xl font-black leading-relaxed mb-3">
            "कलियुग केवल नाम अधारा।<br />सुमिर सुमिर नर उतरहिं पारा।।"
          </p>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">— श्री रामचरितमानस</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-r from-orange-500 to-red-500 rounded-[2.5rem] p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4">🙏 जय श्री राम 🙏</h2>
          <p className="text-orange-100 text-sm font-bold mb-6">राम नाम लेखन की पवित्र यात्रा शुरू करें</p>
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
