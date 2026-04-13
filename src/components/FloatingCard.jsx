import { useRef, useState, useMemo } from 'react';
import {
  motion,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';

/* ── Size presets based on depth ── */
const sizeMap = {
  lg: { w: 320, h: 400 },
  md: { w: 260, h: 320 },
  sm: { w: 200, h: 250 },
};

/* ── Depth config: parallax multiplier, scale, opacity, blur ── */
const depthConfig = {
  1: { parallax: 30, scale: 1, opacity: 1, blur: 0, zBase: 30 },
  2: { parallax: 18, scale: 0.88, opacity: 0.85, blur: 0.5, zBase: 20 },
  3: { parallax: 8, scale: 0.72, opacity: 0.65, blur: 1, zBase: 10 },
};

export default function FloatingCard({
  painting,
  constraintsRef,
  mouseX,
  mouseY,
  isActive,
  onActivate,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);

  const { src, title, year, medium, size, initialX, initialY, depth, rotate } =
    painting;
  const config = depthConfig[depth];
  const dims = sizeMap[size];

  /* ── Randomized float animation per card ── */
  const floatParams = useMemo(
    () => ({
      yOffset: 8 + Math.random() * 14,
      xOffset: 4 + Math.random() * 8,
      rotateOffset: 1.5 + Math.random() * 2.5,
      duration: 5 + Math.random() * 4,
      delay: Math.random() * 3,
    }),
    []
  );

  /* ── Parallax transforms driven by mouse ── */
  const parallaxX = useTransform(
    mouseX,
    [0, 1],
    [config.parallax, -config.parallax]
  );
  const parallaxY = useTransform(
    mouseY,
    [0, 1],
    [config.parallax, -config.parallax]
  );
  const springParallaxX = useSpring(parallaxX, { stiffness: 80, damping: 25 });
  const springParallaxY = useSpring(parallaxY, { stiffness: 80, damping: 25 });

  /* ── Card tilt on hover ── */
  const rotateXVal = useMotionValue(0);
  const rotateYVal = useMotionValue(0);
  const springRotateX = useSpring(rotateXVal, { stiffness: 150, damping: 20 });
  const springRotateY = useSpring(rotateYVal, { stiffness: 150, damping: 20 });

  const handleCardMouseMove = (e) => {
    if (!cardRef.current || isDragging) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateXVal.set(y * -12);
    rotateYVal.set(x * 12);
  };

  const handleCardMouseLeave = () => {
    setIsHovered(false);
    rotateXVal.set(0);
    rotateYVal.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="absolute group"
      style={{
        left: `${initialX}%`,
        top: `${initialY}%`,
        width: dims.w,
        height: dims.h,
        zIndex: isActive ? 100 : isHovered ? 50 : config.zBase,
        x: springParallaxX,
        y: springParallaxY,
        perspective: 1000,
      }}
      /* ── Float animation ── */
      animate={
        !isHovered && !isDragging && !isActive
          ? {
              y: [0, -floatParams.yOffset, 0, floatParams.yOffset * 0.5, 0],
              x: [
                0,
                floatParams.xOffset,
                0,
                -floatParams.xOffset * 0.7,
                0,
              ],
              rotate: [
                rotate,
                rotate + floatParams.rotateOffset,
                rotate,
                rotate - floatParams.rotateOffset * 0.6,
                rotate,
              ],
            }
          : {}
      }
      transition={
        !isHovered && !isDragging && !isActive
          ? {
              duration: floatParams.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: floatParams.delay,
            }
          : { type: 'spring', stiffness: 200, damping: 25 }
      }
      /* ── Drag ── */
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.08}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      /* ── Hover ── */
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleCardMouseMove}
      onMouseLeave={handleCardMouseLeave}
      whileHover={{ scale: isActive ? 1 : 1.06 }}
      onClick={onActivate}
    >
      <motion.div
        className="relative w-full h-full rounded-md overflow-hidden"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
          scale: isActive ? 1.15 : config.scale,
          opacity: isActive ? 1 : isHovered ? 1 : config.opacity,
          filter: `blur(${isHovered || isActive ? 0 : config.blur}px)`,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        {/* ── Shadow ── */}
        <div
          className="absolute -inset-2 rounded-lg transition-all duration-500"
          style={{
            background: `radial-gradient(ellipse at center, rgba(232,220,200,${
              isHovered ? 0.1 : 0.04
            }) 0%, transparent 70%)`,
            filter: `blur(${depth === 1 ? 20 : depth === 2 ? 14 : 8}px)`,
          }}
        />

        {/* ── Image ── */}
        <img
          src={src}
          alt={title}
          className="w-full h-full object-cover rounded-md pointer-events-none select-none"
          draggable={false}
        />

        {/* ── Shimmer border ── */}
        <div
          className="absolute inset-0 rounded-md pointer-events-none transition-opacity duration-300"
          style={{
            border: '1px solid',
            borderImage: isHovered
              ? 'linear-gradient(135deg, rgba(232,220,200,0.4), transparent 50%, rgba(232,220,200,0.2)) 1'
              : 'linear-gradient(135deg, rgba(255,255,255,0.08), transparent 50%, rgba(255,255,255,0.04)) 1',
          }}
        />

        {/* ── Info overlay on hover ── */}
        <AnimatePresence>
          {(isHovered || isActive) && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
              }}
            >
              <h3 className="font-serif text-base font-bold text-white leading-tight">
                {title}
              </h3>
              <p className="text-[11px] text-accent/70 mt-1 tracking-wider uppercase font-sans">
                {medium} · {year}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
