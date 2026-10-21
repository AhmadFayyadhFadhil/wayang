import React, { useRef, useState, useCallback, useEffect } from 'react';

/**
 * Wayang3DImageCover
 * ------------------------------------------------------------------
 * Komponen cover gambar dengan 3D Interactive Tilt & Parallax Depth
 * terisolasi khusus pada area visual wayang dan dalang (Story Atlas).
 * - 60 FPS hardware accelerated melalui direct CSS transform & requestAnimationFrame.
 * - Layering stereoskopis: Badge tradisi melayang di bidang 3D (translateZ: 32px).
 * - Pendar cahaya Blencong dinamis (warm golden glare) mengikuti koordinat kursor.
 * - Desain otentik Nusantara tanpa AI slop (palet kayu soga & emas prada).
 */
export default function Wayang3DImageCover({
  coverImg,
  title,
  traditionBadge,
  className = '',
}) {
  const containerRef = useRef(null);
  const cardPlaneRef = useRef(null);
  const glareRef = useRef(null);
  const rafIdRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Bersihkan requestAnimationFrame saat unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || !cardPlaneRef.current) return;

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      if (!containerRef.current || !cardPlaneRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const xNorm = Math.max(-0.5, Math.min(0.5, x - 0.5));
      const yNorm = Math.max(-0.5, Math.min(0.5, y - 0.5));

      // rotX: gerakan kursor vertikal miringkan kartu atas-bawah
      // rotY: gerakan kursor horizontal miringkan kartu kiri-kanan
      const rotX = -yNorm * 18; // rentang -9deg s.d +9deg
      const rotY = xNorm * 18;  // rentang -9deg s.d +9deg

      cardPlaneRef.current.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.04, 1.04, 1.04)`;

      if (glareRef.current) {
        const glareX = (x * 100).toFixed(1);
        const glareY = (y * 100).toFixed(1);
        glareRef.current.style.background = `radial-gradient(circle 180px at ${glareX}% ${glareY}%, rgba(245, 215, 127, 0.35) 0%, rgba(212, 175, 55, 0.10) 45%, transparent 75%)`;
        glareRef.current.style.opacity = '1';
      }
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (cardPlaneRef.current) {
      cardPlaneRef.current.style.transition = 'transform 0.15s ease-out';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    if (cardPlaneRef.current) {
      cardPlaneRef.current.style.transition = 'transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1)';
      cardPlaneRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`wayang-3d-cover-container ${isHovered ? 'is-hovered' : ''} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={`Visual lakon: ${title || 'Pewayangan'}`}
    >
      <div ref={cardPlaneRef} className="wayang-3d-cover-plane">
        {/* Gambar Wayang / Dalang */}
        <img
          src={coverImg}
          alt={title || 'Visual Lakon Wayang'}
          className="wayang-3d-cover-img"
          loading="lazy"
        />

        {/* Dynamic Blencong Oil Lamp Glare Effect */}
        <div ref={glareRef} className="wayang-3d-cover-glare" aria-hidden="true" />

        {/* Soft Heritage Vignette Border Frame */}
        <div className="wayang-3d-cover-frame-highlight" aria-hidden="true" />

        {/* Floating Tradition Badge in 3D (translateZ: 32px) */}
        {traditionBadge && (
          <div className="wayang-3d-cover-badge">
            <span>{traditionBadge}</span>
          </div>
        )}
      </div>
    </div>
  );
}
