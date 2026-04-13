import { motion } from 'framer-motion';

const dimMap = {
  lg: { w: 260, h: 320 },
  md: { w: 220, h: 280 },
  sm: { w: 180, h: 230 },
};

export default function PolaroidCard({ painting, motionVals, onQuickView }) {
  const { src, title, size } = painting;
  const dims = dimMap[size];

  // Distinguish clicks from drags using mouse events
  let startPos = { x: 0, y: 0 };
  
  const handlePointerDown = (e) => {
    startPos = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e) => {
    const diffX = Math.abs(e.clientX - startPos.x);
    const diffY = Math.abs(e.clientY - startPos.y);
    // If the mouse barely moved, count it as a click for Quick View
    if (diffX < 5 && diffY < 5) {
      onQuickView();
    }
  };

  return (
    <motion.div
      layoutId={`card-container-${painting.id}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: dims.w,
        height: dims.h,
        // Drive position from the physics hook
        x: motionVals.x,
        y: motionVals.y,
        rotate: motionVals.rotate,
        // Center the transform point so x/y correspond to body center
        translateX: '-50%',
        translateY: '-50%',
        cursor: 'grab',
        zIndex: 10
      }}
      whileTap={{ cursor: 'grabbing' }}
    >
      <div 
        className="w-full h-full bg-[#f8f8f8] rounded-sm p-3 pb-12 shadow-[0_20px_40px_rgba(0,0,0,0.4)] pointer-events-none select-none transition-transform duration-300 group hover:scale-[1.02]"
        style={{ border: '1px solid rgba(0,0,0,0.1)' }}
      >
        <motion.img
          layoutId={`card-image-${painting.id}`}
          src={src}
          alt={title}
          className="w-full h-full object-cover rounded-sm pointer-events-none select-none drop-shadow-md"
          draggable={false}
        />
        {/* Caption */}
        <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <span className="font-serif italic text-black/60 text-xs">
              {title}
           </span>
        </div>
      </div>
    </motion.div>
  );
}
