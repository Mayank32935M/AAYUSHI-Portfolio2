import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 12) + 2;
      if (current >= 100) {
        setProgress(100);
        clearInterval(interval);
        setTimeout(onComplete, 600); // Wait a bit after hitting 100%
      } else {
        setProgress(current);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black"
        initial={{ y: 0 }}
        exit={{ y: '-100%' }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="overflow-hidden">
          <motion.h1
            className="text-8xl md:text-[12rem] font-serif font-black text-white leading-none tracking-tighter"
            initial={{ y: 150 }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {progress}
            <span className="text-4xl md:text-8xl text-dim">%</span>
          </motion.h1>
        </div>
        <div className="absolute bottom-12 uppercase tracking-[0.4em] text-[10px] text-dim/60 font-sans">
          Initializing Zero-Gravity Engine
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
