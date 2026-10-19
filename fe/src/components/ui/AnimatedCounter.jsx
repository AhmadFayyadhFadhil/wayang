import React, { useState, useEffect } from 'react';

/**
 * AnimatedCounter Component
 * 
 * Menampilkan animasi angka countdown halus yang meluncur dari atas
 * dengan kurva perlambatan kubik (easeOutCubic) untuk transisi yang sangat mulus (buttery-smooth),
 * didukung pergerakan vertikal meluncur dari atas ke bawah.
 */
export default function AnimatedCounter({
  target = 0,
  start = 0,
  duration = 1000,
  delay = 0,
  prefix = '',
  suffix = '',
  separator = '.',
  shouldStart = true,
  onComplete,
  className = '',
  style = {},
}) {
  const [value, setValue] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!shouldStart) return;

    let timeoutId = null;
    let animFrameId = null;

    setValue(start);
    setHasStarted(false);
    setIsFinished(false);

    timeoutId = setTimeout(() => {
      setHasStarted(true);
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Kurva perlambatan kubik (easeOutCubic): gerakan sangat lembut, berangsur melambat secara natural tanpa loncatan kasar
        const ease = progress === 1 ? 1 : 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.round(start + (target - start) * ease);

        setValue(currentVal);

        if (progress < 1) {
          animFrameId = requestAnimationFrame(updateCounter);
        } else {
          setValue(target);
          setIsFinished(true);
          if (onComplete) onComplete();
        }
      };

      animFrameId = requestAnimationFrame(updateCounter);
    }, delay);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [target, start, duration, delay, shouldStart, onComplete]);

  // Format angka ribuan dengan pemisah lokal (titik untuk format Indonesia)
  const formattedValue = value
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  return (
    <span
      className={`animated-counter-num ${hasStarted ? 'is-active' : 'is-waiting'} ${isFinished ? 'is-finished' : ''} ${className}`}
      style={{
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.8px',
        display: 'inline-block',
        willChange: 'transform, opacity, filter',
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease, filter 0.4s ease',
        transform: hasStarted ? 'translateY(0)' : 'translateY(-14px)',
        opacity: hasStarted ? 1 : 0.45,
        filter: hasStarted ? 'blur(0px)' : 'blur(2px)',
        ...style,
      }}
    >
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}
