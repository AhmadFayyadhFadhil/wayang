import React, { useState } from 'react';
import { getCharacterCutout, POSE_DYNAMICS } from '../../data/master/characterAssets';

/**
 * Komponen Penampil Wayang Kulit Otentik (Authentic Javanese Leather Shadow Puppet)
 * Menampilkan figur wayang tatah-sungging prada emas beresolusi tinggi dengan:
 * - Efek lampu blencong dinamis (berubah warna & intensitas mengikuti pose/solah)
 * - Bayangan kelir dalang yang hidup (authentic blencong drop-shadow)
 * - Dinamika solah pose dalang responsif (Default, Sembah, Perang, Terbang, Memanah, dll)
 * - Lapisan gestur artistik otentik (tangan sembah, sambaran kilat perang, sapuan angin terbang)
 */
export default function AuthenticPuppetViewer({
  slug = 'gatotkaca',
  name = 'Raden Gatotkaca',
  pose = 'default',
  accentColor = '#d4af37',
  scale = 1.0,
  width = 220,
  height = 320,
  animated = true,
  interactive = true,
  showBlencongGlow = true,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const cutoutSrc = getCharacterCutout(slug);
  const poseConfig = POSE_DYNAMICS[pose] || POSE_DYNAMICS.default;

  // Stance transform: Menggabungkan skala dasar, pose dinamis, dan efek interaksi hover
  const hoverScale = isHovered && interactive ? 1.03 : 1;
  const activeTransform = `scale(${scale * hoverScale}) ${poseConfig.transform || ''}`.trim();

  // Filter bayangan blencong dinamis sesuai karakter pose
  const shadowFilter = poseConfig.filterExtra || `drop-shadow(0 14px 22px rgba(10, 6, 3, 0.78))`;

  return (
    <div
      className="authentic-puppet-viewer-wrapper"
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
    >
      {/* 1. EFEK LAMPU BLENCONG DINAMIS (Warna pijar merespons solah karakter) */}
      {showBlencongGlow && (
        <div
          className="blencong-ambient-glow"
          style={{
            position: 'absolute',
            inset: '-15%',
            background: `radial-gradient(circle at 50% 38%, ${poseConfig.auraColor || accentColor} 0%, rgba(139, 69, 19, 0.15) 52%, transparent 74%)`,
            pointerEvents: 'none',
            zIndex: 0,
            borderRadius: '50%',
            filter: 'blur(12px)',
            opacity: isHovered ? 0.95 : 0.8,
            transition: 'background 0.5s ease, opacity 0.4s ease',
          }}
        />
      )}

      {/* 2. LAPISAN TRANSFORMASI POSE (Dipisahkan agar tidak tertimpa animasi CSS) */}
      <div
        className="authentic-puppet-stance-layer"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          transform: activeTransform,
          transformOrigin: 'bottom center',
          filter: shadowFilter,
          transition: 'transform 0.45s cubic-bezier(0.18, 0.89, 0.32, 1.15), filter 0.4s ease',
          userSelect: 'none',
        }}
      >
        {/* 3. LAPISAN APUNG HALUS DALANG (Subtle Breathing Motion - Tanpa Menabrak Transform) */}
        <div
          className={`puppet-breathe-sublayer ${animated ? 'dalang-soft-float' : ''}`}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Gambar Wayang Kulit Tatah-Sungging Asli */}
          <img
            src={cutoutSrc}
            alt={`Wayang Kulit ${name} - Pose ${pose}`}
            loading="eager"
            onError={(e) => {
              if (!imgError) {
                setImgError(true);
                e.currentTarget.src = `/images/characters/${slug}_otentik_cutout.png`;
              }
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              pointerEvents: 'none',
              display: 'block',
            }}
          />

          {/* 4. OVERLAY GESTUR ARTISTIK SPESIFIK POSE */}
          {/* A. Gestur Sembah: Tangan Pangabekti Emas di Dada */}
          {pose === 'sembah' && (
            <div
              className="pose-overlay-sembah"
              style={{
                position: 'absolute',
                top: '46%',
                left: '48%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Pijar Berkah Emas */}
              <div
                style={{
                  position: 'absolute',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(254, 240, 138, 0.65) 0%, rgba(212, 175, 55, 0.2) 60%, transparent 80%)',
                  animation: 'pulseSembahAura 2s ease-in-out infinite',
                }}
              />
              <svg width="48" height="48" viewBox="0 0 48 48" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))' }}>
                <defs>
                  <linearGradient id="goldSembahGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#854d0e" />
                  </linearGradient>
                </defs>
                {/* Siluet Dua Telapak Tangan Menyembah (Ngabekti) */}
                <path
                  d="M24 8 C23 16, 17 24, 18 32 C19 36, 23 37, 24 38 C25 37, 29 36, 30 32 C31 24, 25 16, 24 8 Z"
                  fill="url(#goldSembahGrad)"
                  stroke="#451a03"
                  strokeWidth="1.2"
                />
                <line x1="24" y1="10" x2="24" y2="36" stroke="#451a03" strokeWidth="1" strokeDasharray="2 1" />
                <circle cx="24" cy="36" r="2.5" fill="#fef08a" stroke="#78350f" strokeWidth="0.8" />
              </svg>
            </div>
          )}

          {/* B. Gestur Perang: Percikan Sambaran Kilat Kiprah Tempur */}
          {pose === 'perang' && (
            <div
              className="pose-overlay-perang"
              style={{
                position: 'absolute',
                top: '30%',
                right: '10%',
                pointerEvents: 'none',
              }}
            >
              <svg width="60" height="60" viewBox="0 0 60 60" style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }}>
                {/* Percikan Aura Senjata Sakti */}
                <path
                  d="M10 20 L28 12 L22 30 L45 22 L26 48 L32 32 Z"
                  fill="#fef08a"
                  stroke="#dc2626"
                  strokeWidth="1.5"
                  style={{ animation: 'sparkCombat 1.2s ease-in-out infinite' }}
                />
              </svg>
            </div>
          )}

          {/* C. Gestur Terbang: Garis Kecepatan Angin & Sapuan Mega di Udara */}
          {pose === 'terbang' && (
            <div
              className="pose-overlay-terbang"
              style={{
                position: 'absolute',
                bottom: '10%',
                left: '-15%',
                width: '130%',
                pointerEvents: 'none',
              }}
            >
              <svg width="100%" height="50" viewBox="0 0 200 50">
                {/* Garis Sapuan Angin Kotang Antakusuma */}
                <path
                  d="M10 15 Q70 25 180 10"
                  stroke="rgba(254, 240, 138, 0.7)"
                  strokeWidth="2.2"
                  strokeDasharray="18 12"
                  fill="none"
                  style={{ animation: 'windStreak 1s linear infinite' }}
                />
                <path
                  d="M30 32 Q90 40 190 26"
                  stroke="rgba(245, 158, 11, 0.6)"
                  strokeWidth="1.6"
                  strokeDasharray="24 16"
                  fill="none"
                  style={{ animation: 'windStreak 0.8s linear infinite reverse' }}
                />
              </svg>
            </div>
          )}

          {/* D. Gestur Memanah: Busur Gandewa Emas & Anak Panah */}
          {pose === 'memanah' && (
            <div
              className="pose-overlay-memanah"
              style={{
                position: 'absolute',
                top: '25%',
                right: '4%',
                pointerEvents: 'none',
              }}
            >
              <svg width="70" height="70" viewBox="0 0 70 70" style={{ filter: 'drop-shadow(0 0 10px #facc15)' }}>
                {/* Anak Panah Pasopati Bercahaya */}
                <line x1="8" y1="52" x2="62" y2="18" stroke="#fef08a" strokeWidth="2.4" strokeLinecap="round" />
                <polygon points="62,18 50,18 56,26" fill="#facc15" stroke="#854d0e" strokeWidth="0.8" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Style scoped untuk animasi efek solah */}
      <style>
        {`
          @keyframes dalangBreatheGentle {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
            100% { transform: translateY(0px); }
          }
          .dalang-soft-float {
            animation: dalangBreatheGentle 4.2s ease-in-out infinite;
          }
          @keyframes pulseSembahAura {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.15); opacity: 0.9; }
          }
          @keyframes sparkCombat {
            0%, 100% { transform: rotate(0deg) scale(0.95); opacity: 0.8; }
            50% { transform: rotate(6deg) scale(1.08); opacity: 1; }
          }
          @keyframes windStreak {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -60; }
          }
        `}
      </style>
    </div>
  );
}
