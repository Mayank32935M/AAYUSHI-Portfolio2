import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticWrapper from './MagneticWrapper';

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

export default function Navbar({ onWorksClick }) {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 flex items-center justify-between px-8 py-6 z-40 select-none"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
    >
      {/* ── Logo / Artist name ── */}
      <MagneticWrapper intensity={0.1}>
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-2 h-2 rounded-full bg-accent/60" />
          <span className="text-sm font-sans font-light tracking-[0.2em] uppercase text-white/80">
            Aayushi
          </span>
        </div>
      </MagneticWrapper>

      {/* ── Navigation Links ── */}
      <div className="flex items-center gap-8">
        {[
          { label: 'Works', action: onWorksClick },
        ].map((item) => (
          <MagneticWrapper key={item.label} intensity={0.2}>
            <button
              onClick={item.action}
              onMouseEnter={() => setHovered(item.label)}
              onMouseLeave={() => setHovered(null)}
              className="relative py-2 text-xs font-sans tracking-[0.15em] uppercase text-white/50 hover:text-white/90 transition-colors duration-300 bg-transparent border-none cursor-pointer"
            >
              {item.label}
              <AnimatePresence>
                {hovered === item.label && (
                  <motion.div
                    layoutId="navUnderline"
                    className="absolute bottom-0 left-0 right-0 h-px bg-accent/40"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
            </button>
          </MagneticWrapper>
        ))}

        {/* ── Social icons ── */}
        <div className="flex items-center gap-4 ml-4 pl-6 border-l border-white/10">
          <MagneticWrapper intensity={0.3}>
            <a
              href="https://www.instagram.com/brush_it_0ff?igsh=b2hzOTF1ejduZXds"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-1 text-white/40 hover:text-accent transition-colors duration-300"
            >
              <InstagramIcon />
            </a>
          </MagneticWrapper>
          <MagneticWrapper intensity={0.3}>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=rajsinhaaayushifr16@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-1 text-white/40 hover:text-accent transition-colors duration-300"
            >
              <MailIcon />
            </a>
          </MagneticWrapper>
        </div>
      </div>
    </motion.nav>
  );
}
