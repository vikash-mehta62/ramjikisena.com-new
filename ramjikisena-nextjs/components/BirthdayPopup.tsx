'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cake, Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';

export default function BirthdayPopup() {
  const [show, setShow] = useState(false);
  const [age, setAge] = useState(0);
  const [userName, setUserName] = useState('');
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) return;

    // Check if already shown today
    const shownToday = localStorage.getItem('birthdayPopupShown');
    const today = new Date().toDateString();
    if (shownToday === today) return;

    // Fetch user data
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success || !data.user) return;
        
        const user = data.user;
        if (!user.dob) return;

        // Check if today is birthday
        const dob = new Date(user.dob);
        const now = new Date();
        
        if (dob.getMonth() === now.getMonth() && dob.getDate() === now.getDate()) {
          // Calculate age
          let calculatedAge = now.getFullYear() - dob.getFullYear();
          if (now.getMonth() < dob.getMonth() || 
              (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate())) {
            calculatedAge--;
          }
          
          setAge(calculatedAge);
          setUserName(user.name);
          setShow(true);
          
          // Mark as shown for today
          localStorage.setItem('birthdayPopupShown', today);
        }
      })
      .catch(err => console.error('Birthday check error:', err));

    // Set window size for confetti
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Confetti */}
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              onClick={e => e.stopPropagation()}
              className="bg-gradient-to-br from-pink-50 via-white to-orange-50 rounded-[3rem] p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden border-4 border-pink-200"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-2xl"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-2xl"
                />
              </div>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg z-10"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>

              {/* Content */}
              <div className="relative z-10">
                {/* Cake icon */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-8xl mb-4"
                >
                  🎂
                </motion.div>

                {/* Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-orange-500 to-red-600 mb-2"
                >
                  जन्मदिन की शुभकामनाएं!
                </motion.h1>

                {/* Name */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-black text-slate-800 mb-1"
                >
                  {userName} जी 🎉
                </motion.p>

                {/* Age */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-full font-black text-xl mb-4 shadow-lg"
                >
                  <Sparkles className="w-5 h-5" />
                  {age} साल के हो गए!
                  <Sparkles className="w-5 h-5" />
                </motion.div>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 mb-5 border-2 border-pink-200"
                >
                  <p className="text-slate-700 text-sm leading-relaxed font-semibold">
                    🙏 भगवान श्री राम आपको दीर्घायु, सुख, समृद्धि और अच्छे स्वास्थ्य का आशीर्वाद दें।
                    <br />
                    <span className="text-orange-600 font-black">जय श्री राम! 🚩</span>
                  </p>
                </motion.div>

                {/* Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 text-white font-black rounded-2xl text-lg hover:shadow-2xl transition-all"
                >
                  🎉 धन्यवाद!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
