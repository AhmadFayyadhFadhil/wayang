import React, { useState, useEffect } from 'react';
import soundEngine from '../../services/soundscape';
import gununganHd from '../../assets/gunungan_kayon_hd.png';

export default function GununganOpeningOverlay({ onComplete }) {
  const [stage, setStage] = useState('closed'); // 'closed' | 'opening' | 'finished'

  useEffect(() => {
    // 1. Tampilkan 2 Wayang Gunungan di tengah selama 500ms
    const startTimer = setTimeout(() => {
      setStage('opening');
      try {
        soundEngine.playDodogan();
        setTimeout(() => {
          soundEngine.playGong();
        }, 400);
      } catch (_e) {
        // audio fallback
      }
    }, 500);

    // 2. Selesaikan transisi setelah gerakan membuka tuntas
    const endTimer = setTimeout(() => {
      setStage('finished');
      if (onComplete) onComplete();
    }, 2200);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  if (stage === 'finished') return null;

  const isOpening = stage === 'opening';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: isOpening ? 'none' : 'auto',
        background: 'rgba(13, 10, 7, 0.96)',
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
        opacity: isOpening ? 0 : 1,
      }}
    >
      {/* Warm Amber Spotlight di Belakang Gunungan */}
      <div
        style={{
          position: 'absolute',
          width: '580px',
          height: '580px',
          borderRadius: '50%',
          background: 'rgba(212, 175, 55, 0.08)',
          filter: 'blur(50px)',
          zIndex: 1,
          transform: isOpening ? 'scale(2.2)' : 'scale(1)',
          transition: 'transform 1.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Tombol Lewati / Skip Minimalis di Sudut Kanan Atas */}
      <button
        onClick={() => {
          setStage('finished');
          if (onComplete) onComplete();
        }}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          zIndex: 50,
          background: 'rgba(28, 20, 13, 0.75)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '9999px',
          padding: '6px 16px',
          color: '#fcfaf2',
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
        }}
      >
        Lewati
      </button>

      {/* DUA WAYANGAN GUNUNGAN HD (HANYA GUNUNGAN YANG MEMBUKA DARI TENGAH KE KIRI DAN KANAN) */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1200px',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        {/* Gunungan Kiri (HD - Membuka ke Kiri) */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '4vh',
            height: 'clamp(420px, 75vh, 720px)',
            transformOrigin: 'bottom center',
            transform: isOpening
              ? 'translateX(-160vw) rotate(-18deg) scale(0.95)'
              : 'translateX(-96%) rotate(-1deg) scale(1)',
            transition: 'transform 1.7s cubic-bezier(0.16, 1, 0.3, 1)',
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.85))',
          }}
        >
          <img
            src={gununganHd}
            alt="Wayang Gunungan Kiri HD"
            style={{
              height: '100%',
              width: 'auto',
              objectFit: 'contain',
              imageRendering: 'auto',
            }}
          />
        </div>

        {/* Gunungan Kanan (HD - Membuka ke Kanan) */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '4vh',
            height: 'clamp(420px, 75vh, 720px)',
            transformOrigin: 'bottom center',
            transform: isOpening
              ? 'translateX(160vw) rotate(18deg) scale(0.95)'
              : 'translateX(-4%) rotate(1deg) scale(1)',
            transition: 'transform 1.7s cubic-bezier(0.16, 1, 0.3, 1)',
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.85))',
          }}
        >
          <img
            src={gununganHd}
            alt="Wayang Gunungan Kanan HD"
            style={{
              height: '100%',
              width: 'auto',
              objectFit: 'contain',
              imageRendering: 'auto',
              transform: 'scaleX(-1)', // Mirrored agar simetris sempurna di tengah
            }}
          />
        </div>
      </div>
    </div>
  );
}
