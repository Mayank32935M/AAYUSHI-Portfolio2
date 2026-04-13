import { motion, AnimatePresence } from 'framer-motion';

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function AboutOverlay({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* ── Backdrop ── */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* ── Panel ── */}
          <motion.div
            className="relative z-10 w-full max-w-2xl bg-[#0e0e0e] border border-white/[0.06] rounded-lg p-8 md:p-12 overflow-hidden flex flex-col md:flex-row gap-8 items-center"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-white/30 hover:text-white/80 transition-colors bg-transparent border-none cursor-pointer z-20"
            >
              <XIcon />
            </button>

            {/* Profile Image Column */}
            <div className="w-full md:w-1/3 aspect-[3/4] relative rounded-md overflow-hidden bg-black/50 border border-white/10 shrink-0">
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
               <img 
                 src="./Profile.jpg" 
                 alt="Aayushi"
                 className="w-full h-full object-cover opacity-80 mix-blend-luminosity"
               />
            </div>

            {/* Content Column */}
            <div className="w-full md:w-2/3">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
                About the Artist
              </h2>
              <div className="h-px w-12 bg-accent/40 mb-6" />
              
              <div className="space-y-4 font-sans text-sm text-dim leading-relaxed">
                <p>
                  Aayushi is a contemporary abstract expressionist based in New Delhi. Exploring the boundaries between 
                  raw emotion and structured geometry, her work creates a dialogue between ethereal lightness and 
                  architectural weight.
                </p>
                <p>
                  Specializing in large-scale canvas and mixed-media installations, the signature "zero-gravity" 
                  perspective is heavily influenced by minimalism, architectural studies, and natural phenomena.
                </p>
                <p>
                  Her paintings invite the viewer not just to look, but to mentally step inside the negative space.
                </p>
              </div>
              
              <div className="mt-8 flex gap-6">
                <div>
                   <span className="block text-[10px] uppercase tracking-[0.2em] text-dim/60 font-sans mb-1">Exhibitions</span>
                   <span className="block text-sm text-white/80 font-sans">12</span>
                </div>
                <div>
                   <span className="block text-[10px] uppercase tracking-[0.2em] text-dim/60 font-sans mb-1">Active Years</span>
                   <span className="block text-sm text-white/80 font-sans">5+</span>
                </div>
                <div>
                   <span className="block text-[10px] uppercase tracking-[0.2em] text-dim/60 font-sans mb-1">Studio</span>
                   <span className="block text-sm text-white/80 font-sans">New Delhi</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
