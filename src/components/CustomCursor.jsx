import { useEffect, useState, useCallback } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const onMouseMove = useCallback((e) => {
    setPos({ x: e.clientX, y: e.clientY });
    setIsVisible(true);

    /* Check if hovering an interactive element */
    const target = e.target;
    const interactive =
      target.closest('button') ||
      target.closest('a') ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      window.getComputedStyle(target).cursor === 'pointer';
    setIsPointer(!!interactive);
  }, []);

  const onMouseLeave = useCallback(() => setIsVisible(false), []);
  const onMouseEnter = useCallback(() => setIsVisible(true), []);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [onMouseMove, onMouseLeave, onMouseEnter]);

  /* ── Lag the ring behind the dot ── */
  useEffect(() => {
    let raf;
    const lerp = (a, b, n) => (1 - n) * a + n * b;
    const animate = () => {
      setRingPos((prev) => ({
        x: lerp(prev.x, pos.x, 0.15),
        y: lerp(prev.y, pos.y, 0.15),
      }));
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [pos]);

  if (!isVisible) return null;

  return (
    <>
      {/* Dot */}
      <div
        className="cursor-dot"
        style={{
          left: pos.x,
          top: pos.y,
          width: isPointer ? 14 : 8,
          height: isPointer ? 14 : 8,
          background: isPointer
            ? 'rgba(232,220,200,0.9)'
            : 'rgba(232,220,200,1)',
        }}
      />
      {/* Ring */}
      <div
        className="cursor-ring"
        style={{
          left: ringPos.x,
          top: ringPos.y,
          width: isPointer ? 50 : 36,
          height: isPointer ? 50 : 36,
          borderColor: isPointer
            ? 'rgba(232,220,200,0.5)'
            : 'rgba(232,220,200,0.25)',
        }}
      />
    </>
  );
}
