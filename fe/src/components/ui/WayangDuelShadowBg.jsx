import React, { useState, useEffect, useRef } from 'react';
import wayangShadowLeft from '../../assets/wayang_shadow_duel_left.png';
import wayangShadowRight from '../../assets/wayang_shadow_duel_right.png';

/**
 * WayangDuelShadowBg
 * -------------------------------------------------------------
 * Latar belakang siluet pertarungan wayang (Perang Tanding Kelir)
 * khusus untuk seksi "Tokoh & Karakter Wayang" pada Story Atlas.
 * - Menggunakan aset foto siluet wayang kulit otentik beresolusi tinggi
 *   kiriman pengguna dengan detail tatah-sungging dan renda ukiran asli.
 * - Sensor scroll otomatis (IntersectionObserver): Siluet meluncur masuk (slide-in)
 *   saat pengguna scroll ke seksi Tokoh, dan mundur memudar (slide-out) saat di-scroll keluar.
 * - Pendar cahaya lampu minyak Blencong hangat temaram di tengah panggung.
 */
export default function WayangDuelShadowBg() {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const targetElement = el.parentElement || el;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.12,
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
      {/* Pendar Hangat Lampu Minyak Blencong Dalang di Tengah */}
      <div className={`wayang-duel-blencong ${isInView ? 'is-active' : ''}`} />

      {/* Siluet Ksatria Kiri (Foto Otentik Pengguna - Menghadap Kanan) */}
      <div
        className={`wayang-duel-figure wayang-duel-left ${
          isInView ? 'is-in-view' : 'is-out-view'
        }`}
      >
        <img
          src={wayangShadowLeft}
          alt=""
          className="wayang-duel-puppet-img"
          loading="lazy"
        />
      </div>

      {/* Siluet Ksatria Kanan (Foto Otentik Pengguna - Menghadap Kiri) */}
      <div
        className={`wayang-duel-figure wayang-duel-right ${
          isInView ? 'is-in-view' : 'is-out-view'
        }`}
      >
        <img
          src={wayangShadowRight}
          alt=""
          className="wayang-duel-puppet-img"
          loading="lazy"
        />
      </div>
    </div>
  );
}
