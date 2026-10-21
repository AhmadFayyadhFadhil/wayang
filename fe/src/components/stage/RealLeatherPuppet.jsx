import React, { useMemo } from 'react';

// Import aset tekstur wayang kulit asli beresolusi tinggi
import bodyPng from '../../assets/puppets/body.png';
import upperArmLPng from '../../assets/puppets/upper-arm-l.png';
import forearmLPng from '../../assets/puppets/forearm-l.png';
import handLPng from '../../assets/puppets/hand-l.png';
import upperArmRPng from '../../assets/puppets/upper-arm-r.png';
import forearmRPng from '../../assets/puppets/forearm-r.png';
import handRPng from '../../assets/puppets/hand-r.png';

/**
 * 2-Bone Analytical Inverse Kinematics Solver
 * Menghitung sudut rotasi pundak dan siku secara instan dan alami
 */
function solve2BoneIK(shoulder, target, Lu = 85, Lf = 80, bend = -1) {
  const dx = target.x - shoulder.x;
  const dy = target.y - shoulder.y;
  const dist = Math.max(20, Math.min(Lu + Lf - 2, Math.hypot(dx, dy)));
  const baseAngle = Math.atan2(dy, dx);

  const cosAngle = Math.max(-1, Math.min(1, (Lu * Lu + dist * dist - Lf * Lf) / (2 * Lu * dist)));
  const upperAngle = baseAngle + bend * Math.acos(cosAngle);

  const elbowX = shoulder.x + Lu * Math.cos(upperAngle);
  const elbowY = shoulder.y + Lu * Math.sin(upperAngle);

  const foreAngle = Math.atan2(target.y - elbowY, target.x - elbowX);

  return {
    shoulderAngle: (upperAngle * 180) / Math.PI,
    foreAngle: (foreAngle * 180) / Math.PI,
    elbow: { x: elbowX, y: elbowY },
    wrist: target,
  };
}

// Posisi pundak dalam sistem koordinat lokal 240 x 360
const SHOULDER_L = { x: 92, y: 122 };
const SHOULDER_R = { x: 148, y: 122 };

export default function RealLeatherPuppet({
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
    // Posisi istirahat alami jika jari belum terdeteksi
    const defaultThumbTarget = { x: 70, y: 220 };
    const defaultIndexTarget = { x: 170, y: 220 };

    if (!fingerTargets) {
      return {
        front: defaultThumbTarget,
        back: defaultIndexTarget,
      };
    }

    // Mapping koordinat jari normalisasi dalang ke rentang gerak wayang
    const mapFinger = (tip, defaultPos) => {
      if (!tip) return defaultPos;
      // Offset relatif dikalikan faktor jangkauan wayang
      const targetX = Math.max(20, Math.min(220, defaultPos.x + tip.dx * 160));
      const targetY = Math.max(60, Math.min(280, defaultPos.y + tip.dy * 160));
      return { x: targetX, y: targetY };
    };

    return {
      front: mapFinger(fingerTargets.thumb, defaultThumbTarget),
      back: mapFinger(fingerTargets.index, defaultIndexTarget),
    };
  }, [fingerTargets]);

  const ikFront = useMemo(
    () => solve2BoneIK(SHOULDER_L, ikTargets.front, 75, 70, -1),
    [ikTargets.front]
  );

  const ikBack = useMemo(
    () => solve2BoneIK(SHOULDER_R, ikTargets.back, 75, 70, 1),
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
            style={{
              position: 'absolute',
              left: `${shoulderR.x}px`,
              top: `${shoulderR.y}px`,
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
              style={{
                position: 'absolute',
                left: '60px',
                top: '0px',
                transform: `rotate(${ikBack.foreAngle - ikBack.shoulderAngle}deg)`,
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
            style={{
              position: 'absolute',
              left: `${shoulderL.x}px`,
              top: `${shoulderL.y}px`,
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
              style={{
                position: 'absolute',
                left: '60px',
                top: '0px',
                transform: `rotate(${ikFront.foreAngle - ikFront.shoulderAngle}deg)`,
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
              x1={ikTargets.front.x}
              y1={ikTargets.front.y}
              x2={ikTargets.front.x + 8}
              y2={330}
              stroke="#26170d"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <circle
              cx={ikTargets.front.x}
              cy={ikTargets.front.y}
              r="3.2"
              fill="#d4af37"
              stroke="#1a0f08"
              strokeWidth="0.8"
            />

            {/* Tudhing Tangan Belakang */}
            <line
              x1={ikTargets.back.x}
              y1={ikTargets.back.y}
              x2={ikTargets.back.x + 8}
              y2={330}
              stroke="#26170d"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <circle
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
}
