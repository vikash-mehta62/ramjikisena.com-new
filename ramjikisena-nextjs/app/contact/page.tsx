'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Youtube } from 'lucide-react';

const infoCards = [
  { Icon: Mail, label: 'Email', value: 'contact@ramjikisena.com', color: 'bg-orange-100 text-orange-600' },
  { Icon: Phone, label: 'Phone', value: '+91 98765 43210', color: 'bg-amber-100 text-amber-600' },
  { Icon: MapPin, label: 'Address', value: 'Ayodhya, Uttar Pradesh, India', color: 'bg-red-100 text-red-600' },
  { Icon: Instagram, label: 'Social', value: 'Instagram / YouTube', color: 'bg-purple-100 text-purple-600' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('संदेश भेज दिया गया! 🙏');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#FFFAF3] text-slate-900 antialiased selection:bg-orange-200">
      <Navbar showAuthButtons={true} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-12">

        <div className="mb-10 text-center md:text-left">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-6xl font-black tracking-tight text-slate-900 leading-none">
              संपर्क <span className="text-orange-600 italic">करें</span>
            </h1>
            <div className="h-1 w-16 bg-orange-500 mx-auto md:mx-0 mt-3 rounded-full" />
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">
              We'd Love to Hear From You
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Info Cards */}
          <div className="space-y-4">
            {infoCards.map(({ Icon, label, value, color }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-lg transition-all">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{value}</p>
                </div>
              </motion.div>
            ))}

            {/* Social Links */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.32 }}
              className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Follow Us</p>
              <div className="flex gap-3">
                <a href="#" className="flex items-center gap-2 bg-pink-50 text-pink-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-pink-100 transition-all">
                  <Instagram size={14} /> Instagram
                </a>
                <a href="#" className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-red-100 transition-all">
                  <Youtube size={14} /> YouTube
                </a>
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4 }}
            className="bg-white rounded-[2.5rem] border border-orange-100 shadow-sm p-8">
            <h2 className="text-xl font-black text-slate-900 mb-6">संदेश भेजें</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">नाम</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="आपका नाम"
                  className="w-full px-4 py-3 bg-white border border-orange-100 rounded-2xl text-sm font-bold focus:border-orange-500 outline-none shadow-sm transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Email</label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="आपका ईमेल"
                  className="w-full px-4 py-3 bg-white border border-orange-100 rounded-2xl text-sm font-bold focus:border-orange-500 outline-none shadow-sm transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">संदेश</label>
                <textarea rows={5} required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="अपना संदेश लिखें..."
                  className="w-full px-4 py-3 bg-white border border-orange-100 rounded-2xl text-sm font-bold focus:border-orange-500 outline-none shadow-sm transition-all resize-none" />
              </div>
              <button type="submit"
                className="w-full bg-orange-600 text-white rounded-2xl font-black py-3.5 hover:bg-orange-700 transition-all active:scale-95 shadow-lg shadow-orange-200">
                संदेश भेजें 🙏
              </button>
            </form>
          </motion.div>
        </div>
      </main>
      <footer className="py-12 text-center border-t border-orange-100 mt-10">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.8em]">जय श्री राम</p>
      </footer>
    </div>
  );
}
