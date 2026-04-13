import { motion, AnimatePresence } from 'framer-motion';

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function WorksOverlay({ isOpen, onClose, paintings, onPaintingSelect }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-[#0e0e0e]/95 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Scrolling Content Panel */}
          <motion.div
            className="relative z-10 w-full h-full max-w-7xl md:border md:border-white/[0.06] md:rounded-lg overflow-y-auto overflow-x-hidden bg-transparent md:bg-[#0a0a0a]/50"
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
             {/* Header */}
             <div className="sticky top-0 z-20 flex items-center justify-between p-6 md:p-10 bg-gradient-to-b from-[#0e0e0e] to-transparent">
                <div>
                   <h2 className="font-serif text-3xl md:text-5xl font-bold text-white tracking-tight">Index</h2>
                   <div className="h-px w-8 bg-accent/40 mt-4" />
                </div>
                <button
                  onClick={onClose}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer border border-white/5"
                >
                  <XIcon />
                </button>
             </div>

             {/* Grid */}
             <div className="p-6 md:p-10 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 pb-32">
                {paintings.map((painting, idx) => (
                   <motion.div 
                     key={painting.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5, delay: idx * 0.05 }}
                     className="group cursor-pointer flex flex-col"
                     onClick={() => {
                        onPaintingSelect(painting);
                        onClose(); // Close the index grid
                     }}
                   >
                      <div className="w-full aspect-[3/4] overflow-hidden bg-black/20 rounded-sm mb-4 border border-white/[0.03] group-hover:border-white/20 transition-colors duration-500">
                         <img 
                            src={painting.src} 
                            alt={painting.title} 
                            className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-80 group-hover:opacity-100"
                         />
                      </div>
                      <div className="flex flex-col">
                         <h3 className="font-serif text-lg text-white/90 group-hover:text-white transition-colors">
                           {painting.title}
                         </h3>
                         <div className="flex justify-between items-center mt-1">
                            <span className="text-[10px] uppercase font-sans tracking-widest text-dim">
                              {painting.medium}
                            </span>
                            <span className="text-[10px] font-sans text-dim/60">
                              {painting.year}
                            </span>
                         </div>
                      </div>
                   </motion.div>
                ))}
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
