import React, { useState, useEffect, useCallback, useRef } from 'react';
import soundEngine from '../../services/soundscape';
import wayangLoadingFigure from '../../assets/wayang_loading_figure.png';
import wayangLoadingCakra from '../../assets/wayang_loading_cakra.png';

/**
 * WayangLoadingScreen
 * Layar pemuatan kultural autentik Wayangverse.
 * Cepat, responsif, bebas stuck, dan tombol 'Lewati' berfungsi instan.
 */
export default function WayangLoadingScreen({
  isVisible = true,
  message = 'MEMUAT... MOHON SABAR',
  subtitle = '',
  minDuration = 600, // Cepat & responsif (600ms)
  onComplete,
  allowSkip = true,
  playAudio = true,
}) {
  const [isExiting, setIsExiting] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const isFinishedRef = useRef(false);

  // Fungsi penyelesaian transisi cepat
  const finishLoading = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setIsExiting(true);

    if (playAudio) {
      try {
        soundEngine.playGong();
      } catch (_e) {
        // audio fail-soft
      }
    }

    // Transisi fade out cepat (220ms) lalu kabari parent
    setTimeout(() => {
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, 220);
  }, [playAudio]);

  // Tombol 'Lewati' langsung menutup seketika tanpa delay
  const handleSkip = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    isFinishedRef.current = true;
    setIsExiting(true);
    if (onCompleteRef.current) {
      onCompleteRef.current();
    }
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setIsExiting(false);
      isFinishedRef.current = false;
      return;
    }

    isFinishedRef.current = false;
    setIsExiting(false);

    if (playAudio) {
      try {
        soundEngine.playDodogan();
      } catch (_e) {
        // audio fail-soft
      }
    }

    // Timer pemuatan secepat mungkin sesuai minDuration
    const timer = setTimeout(() => {
      finishLoading();
    }, Math.max(200, minDuration));

    return () => {
      clearTimeout(timer);
    };
  }, [isVisible, minDuration, finishLoading, playAudio]);

  if (!isVisible) return null;

  return (
    <aside
      className={`wayang-loading-backdrop ${isExiting ? 'is-exiting' : ''}`}
      aria-label="Layar Pemuatan Wayangverse"
      role="status"
      aria-live="polite"
      onClick={handleSkip} // Klik di mana saja pada backdrop juga bisa menutup cepat jika stuck
      style={{ cursor: 'pointer' }}
    >
      {/* 1. Partikel Percikan Cahaya Temaram Malam (Golden Sparks) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <span
          className="wayang-loading-spark"
          style={{
            top: '25%',
            left: '22%',
            width: '4px',
            height: '4px',
            animation: 'sparkFloatSlow 4.2s ease-in-out infinite',
            animationDelay: '0.4s',
          }}
        />
        <span
          className="wayang-loading-spark"
          style={{
            top: '35%',
            right: '24%',
            width: '3.5px',
            height: '3.5px',
            animation: 'sparkFloatSlow 5s ease-in-out infinite',
            animationDelay: '1.2s',
          }}
        />
        <span
          className="wayang-loading-spark"
          style={{
            top: '60%',
            left: '30%',
            width: '3px',
            height: '3px',
            animation: 'sparkFloatSlow 3.8s ease-in-out infinite',
            animationDelay: '2.1s',
          }}
        />
        <span
          className="wayang-loading-spark"
          style={{
            top: '55%',
            right: '32%',
            width: '4px',
            height: '4px',
            animation: 'sparkFloatSlow 4.6s ease-in-out infinite',
            animationDelay: '0.8s',
          }}
        />
      </div>

      {/* 2. Tombol Lewati / Skip Instan di Pojok Kanan Atas */}
      {allowSkip && (
        <button
          type="button"
          onClick={handleSkip}
          className="wayang-loading-skip-btn"
          aria-label="Lewati Pemuatan"
          title="Lewati dan langsung masuk ke aplikasi"
          style={{ pointerEvents: 'auto', zIndex: 100 }}
        >
          <span>Lewati</span>
          <span style={{ fontSize: '14px', lineHeight: 1 }}>→</span>
        </button>
      )}

      {/* 3. Konten Utama Terpusat (Tokoh Gatotkaca, Cahaya Blencong, Teks, & Cakra) */}
      <div
        className="wayang-loading-hero-wrapper"
        onClick={(e) => e.stopPropagation()} // Supaya klik area tengah tidak mendadak close jika tidak disengaja
        style={{ cursor: 'default' }}
      >
        {/* Tokoh Wayang Kulit Gatotkaca & Siluet Gunungan dengan Efek Solah Mengambang */}
        <div className="wayang-loading-figure-container">
          {/* Pendaran Cahaya Lampu Blencong Bernapas di Balik Gunungan */}
          <div className="wayang-loading-blencong-aura" />

          {/* Tokoh Wayang Gatotkaca Tatah-Sungging Emas */}
          <img
            src={wayangLoadingFigure}
            alt="Raden Gatotkaca dan Gunungan Panggung Kelir"
            className="wayang-loading-figure-img"
          />
        </div>

        {/* Teks Tipografi Klasik 'MEMUAT... MOHON SABAR' Diapit Ornamen Patra */}
        <div className="wayang-loading-text">
          <span className="wayang-loading-flourish" aria-hidden="true">
            ❧
          </span>
          <span className="wayang-loading-text-gold">{message}</span>
          <span
            className="wayang-loading-flourish"
            aria-hidden="true"
            style={{ transform: 'scaleX(-1)', display: 'inline-block' }}
          >
            ❧
          </span>
        </div>

        {/* Subtitle Opsional */}
        {subtitle && <p className="wayang-loading-subtitle">{subtitle}</p>}

        {/* Spinner Cakra Manggilingan (Surya Majapahit + Golden Arc Ring) */}
        <div className="wayang-loading-spinner-box" aria-hidden="true">
          {/* Busur Emas Luar (Rotating Golden Arc Ring) */}
          <svg
            className="wayang-loading-arc-ring"
            viewBox="0 0 58 58"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="29"
              cy="29"
              r="25"
              stroke="rgba(212, 175, 55, 0.15)"
              strokeWidth="2.5"
            />
            <path
              d="M29 4C42.8071 4 54 15.1929 54 29"
              stroke="url(#goldenArcGradFast)"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="goldenArcGradFast" x1="29" y1="4" x2="54" y2="29" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fef08a" />
                <stop offset="0.6" stopColor="#e8bb5c" />
                <stop offset="1" stopColor="#d4af37" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>

          {/* Cakram Surya Majapahit / Mandala Dalam */}
          <img
            src={wayangLoadingCakra}
            alt="Cakra Surya Majapahit"
            className="wayang-loading-cakra-img"
          />
        </div>
      </div>
    </aside>
  );
}
