import React, { useMemo } from 'react';

// Import aset tekstur wayang kulit asli beresolusi tinggi
import bodyPng from '../../assets/puppets/body.png';
import upperArmLPng from '../../assets/puppets/upper-arm-l.png';
import forearmLPng from '../../assets/puppets/forearm-l.png';
import handLPng from '../../assets/puppets/hand-l.png';
import upperArmRPng from '../../assets/puppets/upper-arm-r.png';
import forearmRPng from '../../assets/puppets/forearm-r.png';
import handRPng from '../../assets/puppets/hand-r.png';

import {
  SHOULDER_L,
  SHOULDER_R,
  DEFAULT_FRONT_TARGET,
  DEFAULT_BACK_TARGET,
  solve2BoneIK,
  mapFingerToIkTarget,
} from '../../services/vision/puppetIkSolver';

const RealLeatherPuppet = React.memo(function RealLeatherPuppet({
  slug = 'arjuna',
  customImageUrl = null,
  facing = 'right',
  scale = 1.0,
  fingerTargets = null, // { thumb: { x, y }, index: { x, y } }
  isKiprah = false,
  depth = 0,
  isSelected = false,
  width = 240,
  height = 360,
}) {
  const isFlipped = facing === 'left';
  const effectiveScale = scale * (1 + depth * 0.12);

  // Perhitungan filter bayangan lampu blencong
  const shadowBlur = Math.round(8 + depth * 16);
  const shadowOpacity = Math.max(0.4, 0.75 - depth * 0.25);

  const filterStyle = isSelected
    ? `drop-shadow(0 8px 24px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 14px rgba(212, 175, 55, 0.6))`
    : `drop-shadow(0 ${shadowBlur}px ${shadowBlur * 1.4}px rgba(10, 6, 3, ${shadowOpacity}))`;

  // Target jempol (tangan depan) dan telunjuk (tangan belakang)
  const ikTargets = useMemo(() => {
    return {
      front: mapFingerToIkTarget(fingerTargets?.thumb, DEFAULT_FRONT_TARGET, true),
      back: mapFingerToIkTarget(fingerTargets?.index, DEFAULT_BACK_TARGET, false),
    };
  }, [fingerTargets]);

  const ikFront = useMemo(
    () => solve2BoneIK(SHOULDER_L, ikTargets.front, 60, 52, -1),
    [ikTargets.front]
  );

  const ikBack = useMemo(
    () => solve2BoneIK(SHOULDER_R, ikTargets.back, 60, 52, 1),
    [ikTargets.back]
  );

  return (
    <div
      className="real-leather-puppet-container"
      style={{
        display: 'inline-block',
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        transform: `scale(${isFlipped ? -effectiveScale : effectiveScale}, ${effectiveScale})`,
        transformOrigin: 'bottom center',
        filter: filterStyle,
        transition: 'transform 0.12s cubic-bezier(0.2, 0, 0.2, 1), filter 0.2s ease',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {/* 1. KASUS KHUSUS: WAYANG UNGGAHAN DALANG SENDIRI */}
      {customImageUrl ? (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <img
            src={customImageUrl}
            alt="Wayang Koleksi Dalang"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />
          {/* Gapit Tanduk Kerbau Penopang Gambar Unggahan */}
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            <line
              x1="50%"
              y1="30%"
              x2="50%"
              y2="100%"
              stroke="#24140b"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <line x1="47%" y1="50%" x2="53%" y2="50%" stroke="#d4af37" strokeWidth="2.5" />
            <line x1="47%" y1="75%" x2="53%" y2="75%" stroke="#d4af37" strokeWidth="2.5" />
          </svg>
        </div>
      ) : (
        /* 2. WAYANG KULIT ASLI MULTI-PART RIGGING */
        <div
          className={isKiprah ? 'wayang-kiprah-anim' : ''}
          style={{ width: '100%', height: '100%', position: 'relative' }}
        >
          {/* LENGAN BELAKANG (LAYER 1 - PALING BELAKANG) */}
          <div
            className="real-puppet-arm-back-shld"
            style={{
              position: 'absolute',
              left: `${SHOULDER_R.x}px`,
              top: `${SHOULDER_R.y}px`,
              transform: `rotate(${ikBack.shoulderAngle}deg)`,
              transformOrigin: '0 0',
              zIndex: 1,
            }}
          >
            <img
              src={upperArmRPng}
              alt="Lengan Atas Belakang"
              style={{
                width: '72px',
                transform: 'translate(-8px, -14px)',
                pointerEvents: 'none',
              }}
            />
            {/* Siku & Lengan Bawah Belakang */}
            <div
              className="real-puppet-arm-back-elbw"
              style={{
                position: 'absolute',
                left: '60px',
                top: '0px',
                transform: `rotate(${ikBack.elbowAngle}deg)`,
                transformOrigin: '0 0',
              }}
            >
              <img
                src={forearmRPng}
                alt="Lengan Bawah Belakang"
                style={{
                  width: '65px',
                  transform: 'translate(-8px, -12px)',
                  pointerEvents: 'none',
                }}
              />
              {/* Telapak Tangan Belakang */}
              <img
                src={handRPng}
                alt="Telapak Belakang"
                style={{
                  position: 'absolute',
                  left: '52px',
                  top: '-8px',
                  width: '38px',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* GAPIT TANDUK KERBAU PENOPANG BADAN UTAMA */}
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              zIndex: 1,
              pointerEvents: 'none',
            }}
            viewBox="0 0 240 360"
          >
            <defs>
              <linearGradient id="mainHornGapitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2e1c12" />
                <stop offset="40%" stopColor="#150a06" />
                <stop offset="70%" stopColor="#3d2619" />
                <stop offset="100%" stopColor="#1a0f0a" />
              </linearGradient>
              <linearGradient id="gatotPradaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#854d0e" />
              </linearGradient>
              <linearGradient id="karnaPradaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fdba74" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#7c2d12" />
              </linearGradient>
            </defs>
            {/* Batang Gapit Tanduk Kerbau Hitam Mengkilap */}
            <path
              d="M117 70 Q120 200 116 355 L124 355 Q122 200 123 70 Z"
              fill="url(#mainHornGapitGrad)"
              stroke="#0d0704"
              strokeWidth="0.8"
            />
            {/* Tali Pluntur Emas Pengikat Gapit ke Badan Kulit */}
            <rect x="115" y="140" width="10" height="4" rx="1" fill="#d4af37" stroke="#78350f" strokeWidth="0.6" />
            <rect x="115" y="220" width="10" height="4" rx="1" fill="#d4af37" stroke="#78350f" strokeWidth="0.6" />
            <rect x="114" y="295" width="12" height="5" rx="1" fill="#d4af37" stroke="#78350f" strokeWidth="0.6" />
          </svg>

          {/* Ornamen Karakter Khas Wayang Kulit (Gatotkaca Sayap Praba, Karna Surya, dll) */}
          {slug === 'gatotkaca' && (
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 2,
                pointerEvents: 'none',
              }}
              viewBox="0 0 240 360"
            >
              {/* Praba Sayap Antakusuma Emas di Punggung Gatotkaca */}
              <path
                d="M105 130 C45 95, 10 140, 32 205 C48 245, 95 235, 100 215 Z"
                fill="#18110b"
                stroke="url(#gatotPradaGrad)"
                strokeWidth="2.8"
              />
              <path
                d="M95 140 C52 110, 25 150, 42 195 C55 228, 90 220, 94 205 Z"
                fill="url(#gatotPradaGrad)"
                opacity="0.85"
              />
              {/* Bintang Kotang Antakusuma di Dada */}
              <polygon
                points="120,150 124,162 136,162 126,170 130,182 120,174 110,182 114,170 104,162 116,162"
                fill="url(#gatotPradaGrad)"
                stroke="#451a03"
                strokeWidth="1.2"
              />
            </svg>
          )}

          {slug === 'karna' && (
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 2,
                pointerEvents: 'none',
              }}
              viewBox="0 0 240 360"
            >
              {/* Mahkota Narpatitama Jamang Emas Suryaputra */}
              <polygon
                points="120,38 128,15 136,36 142,42 112,42"
                fill="url(#karnaPradaGrad)"
                stroke="#431407"
                strokeWidth="1.2"
              />
              {/* Surya Mandala Lambang Batara Surya di Dada */}
              <circle cx="120" cy="165" r="14" fill="url(#karnaPradaGrad)" stroke="#431407" strokeWidth="1.4" />
              <circle cx="120" cy="165" r="7" fill="#fef08a" />
            </svg>
          )}

          {slug === 'shinta' && (
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 2,
                pointerEvents: 'none',
              }}
              viewBox="0 0 240 360"
            >
              {/* Cunduk Mentul Putri Kencana */}
              <line x1="126" y1="46" x2="132" y2="20" stroke="#eab308" strokeWidth="2" />
              <circle cx="132" cy="20" r="4.5" fill="#fef08a" stroke="#854d0e" strokeWidth="1" />
              <line x1="118" y1="48" x2="112" y2="25" stroke="#eab308" strokeWidth="1.8" />
              <circle cx="112" cy="25" r="3.8" fill="#fef08a" stroke="#854d0e" strokeWidth="1" />
            </svg>
          )}

          {/* BADAN UTAMA KULIT ASLI (LAYER 2 - TENGAH) */}
          <img
            src={bodyPng}
            alt={slug}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '100%',
              height: '100%',
              transform: 'translate(-50%, -50%)',
              objectFit: 'contain',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />

          {/* LENGAN DEPAN (LAYER 3 - PALING DEPAN) */}
          <div
            className="real-puppet-arm-front-shld"
            style={{
              position: 'absolute',
              left: `${SHOULDER_L.x}px`,
              top: `${SHOULDER_L.y}px`,
              transform: `rotate(${ikFront.shoulderAngle}deg)`,
              transformOrigin: '0 0',
              zIndex: 3,
            }}
          >
            <img
              src={upperArmLPng}
              alt="Lengan Atas Depan"
              style={{
                width: '72px',
                transform: 'translate(-8px, -14px)',
                pointerEvents: 'none',
              }}
            />
            {/* Siku & Lengan Bawah Depan */}
            <div
              className="real-puppet-arm-front-elbw"
              style={{
                position: 'absolute',
                left: '60px',
                top: '0px',
                transform: `rotate(${ikFront.elbowAngle}deg)`,
                transformOrigin: '0 0',
              }}
            >
              <img
                src={forearmLPng}
                alt="Lengan Bawah Depan"
                style={{
                  width: '65px',
                  transform: 'translate(-8px, -12px)',
                  pointerEvents: 'none',
                }}
              />
              {/* Telapak Tangan Depan */}
              <img
                src={handLPng}
                alt="Telapak Depan"
                style={{
                  position: 'absolute',
                  left: '52px',
                  top: '-8px',
                  width: '38px',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* TANGKAI TUDHING DALANG (LAYER 4 - PENGHUBUNG JARI) */}
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              zIndex: 4,
              pointerEvents: 'none',
              overflow: 'visible',
            }}
          >
            {/* Tudhing Tangan Depan */}
            <line
              className="real-puppet-tudhing-front-line"
              x1={ikTargets.front.x}
              y1={ikTargets.front.y}
              x2={ikTargets.front.x + 8}
              y2={330}
              stroke="#26170d"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <circle
              className="real-puppet-tudhing-front-joint"
              cx={ikTargets.front.x}
              cy={ikTargets.front.y}
              r="3.2"
              fill="#d4af37"
              stroke="#1a0f08"
              strokeWidth="0.8"
            />

            {/* Tudhing Tangan Belakang */}
            <line
              className="real-puppet-tudhing-back-line"
              x1={ikTargets.back.x}
              y1={ikTargets.back.y}
              x2={ikTargets.back.x + 8}
              y2={330}
              stroke="#26170d"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <circle
              className="real-puppet-tudhing-back-joint"
              cx={ikTargets.back.x}
              cy={ikTargets.back.y}
              r="3.2"
              fill="#d4af37"
              stroke="#1a0f08"
              strokeWidth="0.8"
            />
          </svg>
        </div>
      )}

      {/* Gaya Animasi Kiprahan */}
      <style>
        {`
          @keyframes realPuppetKiprah {
            0% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-10px) rotate(2.5deg); }
            50% { transform: translateY(-3px) rotate(-1.5deg); }
            75% { transform: translateY(-12px) rotate(3deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          .wayang-kiprah-anim {
            animation: realPuppetKiprah 1.8s ease-in-out infinite;
            transform-origin: bottom center;
          }
        `}
      </style>
    </div>
  );
});

export default RealLeatherPuppet;
