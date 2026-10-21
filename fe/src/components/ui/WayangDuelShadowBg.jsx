import React, { useState, useEffect, useRef } from 'react';
import WayangFigureSvg from '../stage/WayangFigureSvg';

/**
 * WayangDuelShadowBg
 * -------------------------------------------------------------
 * Latar belakang siluet pertarungan wayang (Perang Tanding Kelir)
 * khusus untuk seksi "Tokoh & Karakter Wayang" pada Story Atlas.
 * - Menggunakan IntersectionObserver untuk memicu animasi masuk (slide-in)
 *   saat pengguna scroll ke seksi Tokoh, dan mundur memudar (slide-out)
 *   saat di-scroll keluar.
 * - Estetika otentik: Siluet wayang berbayang temaram mori katun kelir
 *   diterangi pendar lembut lampu Blencong sang Dalang di tengah.
 * - Anti-AI slop: Bayangan lembut (opacity 12-15% + soft blur), tidak pekat,
 *   dan tidak merusak keterbacaan kartu carousel.
 */
export default function WayangDuelShadowBg({
  leftSlug = 'gatotkaca',
  rightSlug = 'karna',
}) {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Amati parent section (seksi Tokoh) jika tersedia, atau kontainer sendiri
    const targetElement = el.parentElement || el;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.12, // Aktif saat 12% seksi mulai masuk layar
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(targetElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="wayang-duel-shadow-wrapper"
      aria-hidden="true"
    >
      {/* Pendar Hangat Lampu Minyak Blencong Dalang */}
      <div className={`wayang-duel-blencong ${isInView ? 'is-active' : ''}`} />

      {/* Siluet Tokoh Ksatria Kiri (Pose Perang Menghadap Kanan) */}
      <div
        className={`wayang-duel-figure wayang-duel-left ${
          isInView ? 'is-in-view' : 'is-out-view'
        }`}
      >
        <WayangFigureSvg
          slug={leftSlug}
          pose="perang"
          facing="right"
          scale={1.2}
          width={260}
          height={380}
          animated={isInView}
          accentColor="#5a3d28"
        />
      </div>

      {/* Siluet Tokoh Ksatria Kanan (Pose Perang Menghadap Kiri) */}
      <div
        className={`wayang-duel-figure wayang-duel-right ${
          isInView ? 'is-in-view' : 'is-out-view'
        }`}
      >
        <WayangFigureSvg
          slug={rightSlug}
          pose="perang"
          facing="left"
          scale={1.2}
          width={260}
          height={380}
          animated={isInView}
          accentColor="#5a3d28"
        />
      </div>
    </div>
  );
}
