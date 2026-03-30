'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Save, ArrowRight } from 'lucide-react';
import { registerWarningHandler } from '@/lib/jaapContext';

export default function UnsavedJaapWarning() {
  const [show, setShow] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [pendingNav, setPendingNav] = useState<((h: string) => void) | null>(null);

  useEffect(() => {
    registerWarningHandler((href, navigate) => {
      setPendingHref(href);
      setPendingNav(() => navigate);
      setShow(true);
    });
  }, []);

  const close = () => {
    setShow(false);
    setPendingHref(null);
    setPendingNav(null);
  };

  const handleSaveFirst = () => {
    close();
    const btn = document.getElementById('jaap-save-btn');
    if (btn) btn.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLeaveAnyway = () => {
    const href = pendingHref;
    const nav = pendingNav;
    close();
    if (href && nav) nav(href);
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">रुकिए! 🙏</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              आपका <span className="font-bold text-orange-600">राम नाम जाप</span> अभी सेव नहीं हुआ है।<br />
              पहले सेव करें, फिर आगे जाएं।
            </p>
            <div className="space-y-3">
              <button
                onClick={handleSaveFirst}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black py-3.5 rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg active:scale-95"
              >
                <Save className="w-4 h-4" /> पहले सेव करें
              </button>
              <button
                onClick={handleLeaveAnyway}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-500 font-bold py-3 rounded-2xl hover:bg-slate-200 transition-all text-sm active:scale-95"
              >
                <ArrowRight className="w-4 h-4" /> बिना सेव किए जाएं
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
