import { motion, useTransform } from 'framer-motion';

export default function HeroTitle({ mouseX, mouseY }) {
  /* ── Subtle reverse-parallax on the title itself ── */
  const titleX = useTransform(mouseX, [0, 1], [15, -15]);
  const titleY = useTransform(mouseY, [0, 1], [10, -10]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
      style={{ zIndex: 2, x: titleX, y: titleY }}
    >
      {/* ── Main title ── */}
      <motion.h1
        className="font-serif font-black tracking-tight leading-[0.85] text-center"
        style={{
          fontSize: 'clamp(5rem, 14vw, 16rem)',
          color: 'transparent',
          WebkitTextStroke: '1.5px rgba(255,255,255,0.07)',
          textStroke: '1.5px rgba(255,255,255,0.07)',
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        AAYUSHI
      </motion.h1>

      {/* ── Subtitle line ── */}
      <motion.div
        className="flex items-center gap-4 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
      >
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent/30" />
        <span
          className="text-xs tracking-[0.35em] uppercase font-sans text-dim"
          style={{ letterSpacing: '0.35em' }}
        >
          Selected Works
        </span>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-accent/30" />
      </motion.div>

      {/* ── Year badge ── */}
      <motion.span
        className="mt-4 text-[10px] tracking-[0.5em] uppercase font-sans text-dim/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        2023 — 2024
      </motion.span>
    </motion.div>
  );
}
