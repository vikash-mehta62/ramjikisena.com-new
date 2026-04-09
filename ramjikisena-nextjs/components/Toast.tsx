'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const STYLES = {
  success: { bg: '#16a34a', border: '#15803d', icon: '#bbf7d0' },
  error:   { bg: '#dc2626', border: '#b91c1c', icon: '#fecaca' },
  warning: { bg: '#d97706', border: '#b45309', icon: '#fde68a' },
  info:    { bg: '#2563eb', border: '#1d4ed8', icon: '#bfdbfe' },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const ctx: ToastContextType = {
    toast: addToast,
    success: (m) => addToast(m, 'success'),
    error:   (m) => addToast(m, 'error'),
    warning: (m) => addToast(m, 'warning'),
    info:    (m) => addToast(m, 'info'),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div className="fixed bottom-6 right-4 z-[99999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => {
            const Icon = ICONS[t.type];
            const s = STYLES[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 60, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl shadow-2xl"
                style={{ background: s.bg, border: `1px solid ${s.border}` }}
              >
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: s.icon }} />
                <p className="text-white text-sm font-semibold flex-1 leading-snug">{t.message}</p>
                <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
                  className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity">
                  <X className="w-4 h-4 text-white" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
