import { useState, useCallback, useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import HeroTitle from './components/HeroTitle';
import CustomCursor from './components/CustomCursor';
import ContactOverlay from './components/ContactOverlay';
import AboutOverlay from './components/AboutOverlay';
import WorksOverlay from './components/WorksOverlay';
import Preloader from './components/Preloader';
import PolaroidCard from './components/PolaroidCard';
import { usePhysics } from './hooks/usePhysics';

/* ── 9 Paintings Data ── */
const paintings = [
  { id: 1, src: '/paintings/Ayanakouji.jpeg', title: 'Ayanakouji', year: '2025', medium: 'Original Artwork', size: 'lg' },
  { id: 2, src: '/paintings/Eye.jpeg', title: 'Eye', year: '2025', medium: 'Original Artwork', size: 'md' },
  { id: 3, src: '/paintings/Project File.jpeg', title: 'Project File', year: '2025', medium: 'Original Artwork', size: 'sm' },
  { id: 4, src: '/paintings/gallery-1.jpeg', title: 'Gallery I', year: '2025', medium: 'Original Artwork', size: 'lg' },
  { id: 5, src: '/paintings/gallery-2.jpeg', title: 'Gallery II', year: '2025', medium: 'Original Artwork', size: 'md' },
  { id: 6, src: '/paintings/gallery-3.jpeg', title: 'Gallery III', year: '2025', medium: 'Original Artwork', size: 'lg' },
  { id: 7, src: '/paintings/gallery-4.jpeg', title: 'Gallery IV', year: '2025', medium: 'Original Artwork', size: 'md' },
  { id: 8, src: '/paintings/gallery-5.jpeg', title: 'Gallery V', year: '2025', medium: 'Original Artwork', size: 'sm' },
  { id: 9, src: '/paintings/gallery-6.jpeg', title: 'Gallery VI', year: '2025', medium: 'Original Artwork', size: 'lg' },
];

export default function App() {
  const [showContact, setShowContact] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showWorks, setShowWorks] = useState(false);
  const [appLoaded, setAppLoaded] = useState(false);
  const [quickViewCard, setQuickViewCard] = useState(null);

  /* ── Reverse Parallax values for HeroTitle ── */
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  const handleMouseMove = useCallback((e) => {
    mouseX.set(e.clientX / window.innerWidth);
    mouseY.set(e.clientY / window.innerHeight);
  }, [mouseX, mouseY]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  /* ── Initialize Physics Engine ── */
  const { motionValues, engine } = usePhysics(appLoaded ? paintings : []);

  return (
    <>
      <AnimatePresence>
        {!appLoaded && <Preloader key="preloader" onComplete={() => setAppLoaded(true)} />}
      </AnimatePresence>

      <div className="relative h-screen w-screen overflow-hidden bg-canvas">
        {/* Overlays */}
        <div className="noise-overlay" />
        <div className="vignette" />
        <CustomCursor />

        {appLoaded && (
          <>
            {/* Background elements */}
            <HeroTitle mouseX={smoothMouseX} mouseY={smoothMouseY} />

            {/* Matter.js Driven Polaroid Cards */}
            {paintings.map((painting) => {
               // Only render the floating card if it is NOT currently expanded.
               // framer-motion's layoutId handles transitioning between the floating state and Quick View state
               if (quickViewCard && quickViewCard.id === painting.id) return null;
               
               const vals = motionValues[painting.id];
               if (!vals) return null; // Defensive guard

               return (
                 <PolaroidCard
                   key={painting.id}
                   painting={painting}
                   motionVals={vals}
                   onQuickView={() => setQuickViewCard(painting)}
                 />
               );
            })}

            {/* Quick View Expanded Overlay */}
            <AnimatePresence>
              {quickViewCard && (
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setQuickViewCard(null)}
                >
                  <motion.div
                    layoutId={`card-container-${quickViewCard.id}`}
                    className="relative w-full max-w-4xl aspect-[4/3] max-h-[85vh] bg-[#f8f8f8] p-4 lg:p-6 pb-20 lg:pb-32 shadow-2xl flex flex-col cursor-auto"
                    onClick={(e) => e.stopPropagation()} // Prevent bubbling up to background click
                  >
                     <motion.img
                       layoutId={`card-image-${quickViewCard.id}`}
                       src={quickViewCard.src}
                       alt={quickViewCard.title}
                       className="w-full flex-grow object-contain bg-black/5"
                     />
                     <div className="absolute bottom-6 md:bottom-10 inset-x-0 text-center px-4">
                        <h2 className="font-serif text-3xl md:text-5xl font-black text-neutral-900 tracking-tight">
                           {quickViewCard.title}
                        </h2>
                        <div className="flex items-center justify-center gap-3 mt-3">
                           <span className="text-xs tracking-widest uppercase font-sans text-neutral-500">
                             {quickViewCard.medium}
                           </span>
                           <span className="text-xs text-neutral-400">&bull;</span>
                           <span className="text-xs tracking-widest font-sans text-neutral-500">
                             {quickViewCard.year}
                           </span>
                        </div>
                     </div>
                     {/* Close button inside polaroid frame */}
                     <button 
                        onClick={() => setQuickViewCard(null)}
                        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors pointer border-none cursor-pointer"
                     >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                     </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Static Interactive Elements staying fixed relative to viewport */}
            <div className="fixed inset-0 pointer-events-none z-40">
              <div className="pointer-events-auto">
               <Navbar onWorksClick={() => setShowWorks(true)} />
              </div>

              {/* Bottom Corners */}
              <div className="absolute bottom-8 left-8 pointer-events-auto">
                <button 
                  onClick={() => setShowAbout(true)}
                  className="text-xs font-sans tracking-[0.15em] uppercase text-white/50 hover:text-white/90 transition-colors duration-300 bg-transparent border-none cursor-pointer"
                >
                  About Me
                </button>
              </div>

              <div className="absolute bottom-8 right-8 pointer-events-auto">
                <button 
                  onClick={() => setShowContact(true)}
                  className="text-xs font-sans tracking-[0.15em] uppercase text-white/50 hover:text-white/90 transition-colors duration-300 bg-transparent border-none cursor-pointer"
                >
                  Contact
                </button>
              </div>
            </div>
            
            <ContactOverlay isOpen={showContact} onClose={() => setShowContact(false)} />
            <AboutOverlay isOpen={showAbout} onClose={() => setShowAbout(false)} />
            <WorksOverlay 
               isOpen={showWorks} 
               onClose={() => setShowWorks(false)} 
               paintings={paintings}
               onPaintingSelect={(painting) => setQuickViewCard(painting)}
            />
          </>
        )}
      </div>
    </>
  );
}
