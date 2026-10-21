import React from 'react';

/**
 * Komponen Wayang Kulit Beneran (Authentic Javanese Leather Shadow Puppets)
 * Dirancang khusus dengan estetika tatah sungging prada emas otentik,
 * gapit tanduk kerbau nyata, dan sistem rigging sendi berartikulasi multi-segmen.
 */
export default function AuthenticLeatherWayang({
  slug = 'rahwana',
  facing = 'right',
  scale = 1.0,
  armAngles = null, // { frontShoulder, frontElbow, backShoulder, backElbow }
  isKiprah = false,
  depth = 0, // 0 (dekat kelir/tajam) s/d 1 (dekat lampu/mengabur)
  renderMode = 'color', // 'color' | 'shadow'
  isSelected = false,
  width = 240,
  height = 360,
  animated = true,
}) {
  const isFlipped = facing === 'left';
  const effectiveScale = scale * (1 + depth * 0.15); // Efek Z-depth: mendekat ke lampu = bayangan membesar

  // Perhitungan filter bayangan lampu blencong berdasarkan depth
  const shadowBlur = Math.round(6 + depth * 18);
  const shadowOpacity = Math.max(0.4, 0.85 - depth * 0.35);

  const filterStyle =
    renderMode === 'shadow'
      ? `drop-shadow(0 ${shadowBlur}px ${shadowBlur * 1.5}px rgba(12, 8, 4, ${shadowOpacity})) contrast(180%) brightness(20%)`
      : isSelected
      ? `drop-shadow(0 8px 24px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 16px rgba(250, 204, 21, 0.6))`
      : `drop-shadow(0 6px 16px rgba(0, 0, 0, 0.55)) drop-shadow(0 2px 8px rgba(212, 175, 55, 0.25))`;

  return (
    <div
      className="authentic-leather-wayang-container"
      style={{
        display: 'inline-block',
        transform: `scale(${isFlipped ? -effectiveScale : effectiveScale}, ${effectiveScale})`,
        transformOrigin: 'bottom center',
        filter: filterStyle,
        transition: 'transform 0.15s cubic-bezier(0.2, 0, 0.2, 1), filter 0.2s ease',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <svg
        viewBox="-130 -40 260 380"
        width={width}
        height={height}
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Gradasi Emas Prada Kencana */}
          <linearGradient id="goldPradaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#eab308" />
            <stop offset="85%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>

          {/* Gradasi Tanduk Kerbau Asli (Gapit Utama) */}
          <linearGradient id="hornGapitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2e1c12" />
            <stop offset="35%" stopColor="#1a0f0a" />
            <stop offset="70%" stopColor="#3d2619" />
            <stop offset="100%" stopColor="#150a06" />
          </linearGradient>

          {/* Gradasi Kulit Rahwana Merah Angkara */}
          <linearGradient id="rahwanaSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="45%" stopColor="#b91c1c" />
            <stop offset="80%" stopColor="#7f1d1d" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>

          {/* Gradasi Kulit Shinta Kuning Langsat Kencana */}
          <linearGradient id="shintaSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="50%" stopColor="#fde68a" />
            <stop offset="90%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          {/* Gradasi Batik Soga Cokelat Klasik */}
          <linearGradient id="batikSogaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5c2c10" />
            <stop offset="50%" stopColor="#3b1d0a" />
            <stop offset="100%" stopColor="#231005" />
          </linearGradient>

          {/* Pola Tatah Kerawangan Tembus Cahaya */}
          <pattern id="tatahKerawangan" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="1.1" fill="#fef08a" opacity="0.85" />
            <circle cx="1" cy="1" r="0.6" fill="#fef08a" opacity="0.6" />
            <circle cx="7" cy="7" r="0.6" fill="#fef08a" opacity="0.6" />
          </pattern>

          {/* Animasi Solah Kiprahan */}
          <style>
            {`
              @keyframes kiprahSway {
                0% { transform: translateY(0px) rotate(0deg); }
                25% { transform: translateY(-12px) rotate(3deg); }
                50% { transform: translateY(-4px) rotate(-2deg); }
                75% { transform: translateY(-14px) rotate(4deg); }
                100% { transform: translateY(0px) rotate(0deg); }
              }
              @keyframes armIdleNatural {
                0% { transform: rotate(0deg); }
                50% { transform: rotate(6deg); }
                100% { transform: rotate(0deg); }
              }
              .wayang-kiprah-active {
                animation: kiprahSway 1.8s ease-in-out infinite;
                transform-origin: 0px 240px;
              }
              .wayang-arm-idle {
                animation: armIdleNatural 3.4s ease-in-out infinite;
                transform-origin: 0px 0px;
              }
            `}
          </style>
        </defs>

        <g className={isKiprah ? 'wayang-kiprah-active' : ''}>
          {renderCharacterBody(slug, { armAngles, animated })}
        </g>
      </svg>
    </div>
  );
}

/**
 * Tangkai Gapit Tanduk Kerbau Asli (Main Gapit)
 */
function HornGapit({ x = 0, yTop = 30, yBottom = 330, width = 7 }) {
  return (
    <g className="main-horn-gapit" opacity="0.98">
      {/* Batang Utama Melengkung Gagah */}
      <path
        d={`M${x - width / 2} ${yTop} Q${x - 2} ${(yTop + yBottom) / 2} ${x - width / 2 - 1} ${yBottom} 
            L${x + width / 2 + 1} ${yBottom} Q${x + 2} ${(yTop + yBottom) / 2} ${x + width / 2} ${yTop} Z`}
        fill="url(#hornGapitGrad)"
        stroke="#120a05"
        strokeWidth="1.2"
      />
      {/* Ujung Atas Gapit yang Meruncing Rapi */}
      <path
        d={`M${x - width / 2} ${yTop} Q${x} ${yTop - 18} ${x + width / 2} ${yTop} Z`}
        fill="url(#hornGapitGrad)"
        stroke="#120a05"
        strokeWidth="1"
      />
      {/* Lilitan Tali Pluntur Emas Pengikat Gapit ke Kulit Wayang */}
      {[0.25, 0.45, 0.65, 0.82].map((ratio, idx) => {
        const y = yTop + (yBottom - yTop) * ratio;
        return (
          <g key={idx}>
            <rect
              x={x - width / 2 - 2}
              y={y}
              width={width + 4}
              height={5}
              rx={1.5}
              fill="url(#goldPradaGrad)"
              stroke="#78350f"
              strokeWidth="0.8"
            />
            <line
              x1={x - width / 2 - 2}
              y1={y + 2.5}
              x2={x + width / 2 + 2}
              y2={y + 2.5}
              stroke="#451a03"
              strokeWidth="0.8"
            />
          </g>
        );
      })}
      {/* Pegangan Dalang di Pangkal Bawah */}
      <circle cx={x} cy={yBottom - 12} r={width * 0.9} fill="#1a0f0a" stroke="#ca8a04" strokeWidth="1.2" />
    </g>
  );
}

/**
 * Tangkai Tudhing Tanduk Kerbau Penggerak Tangan Dalang
 */
function TudhingRod({ x1, y1, x2, yBottom = 290 }) {
  return (
    <g className="tudhing-rod-horn" opacity="0.95">
      {/* Batang Tudhing Tanduk Kerbau Lentur */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={yBottom}
        stroke="#24140b"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Pasak Kelosan Kuningan di Sambungan Jari Wayang */}
      <circle cx={x1} cy={y1} r="3.2" fill="url(#goldPradaGrad)" stroke="#451a03" strokeWidth="1" />
      {/* Cincin Pegangan Jari Dalang di Bawah */}
      <circle cx={x2} cy={yBottom} r="3.6" fill="url(#goldPradaGrad)" stroke="#78350f" strokeWidth="1.2" />
      <circle cx={x2} cy={yBottom} r="1.5" fill="#120a05" />
    </g>
  );
}

/**
 * Render Karakter Utama Wayang Kulit Beneran
 */
function renderCharacterBody(slug, { armAngles, animated }) {
  switch (slug) {
    case 'rahwana':
      return <RealRahwana armAngles={armAngles} animated={animated} />;
    case 'shinta':
      return <RealShinta armAngles={armAngles} animated={animated} />;
    case 'gatotkaca':
      return <RealGatotkaca armAngles={armAngles} animated={animated} />;
    case 'arjuna':
    default:
      return <RealArjuna armAngles={armAngles} animated={animated} />;
  }
}

/* =========================================================================
   1. PRABU RAHWANA (DASAMUKA) — RAJA RAKSASA ALENGKA (WAYANG BENERAN)
   ========================================================================= */
function RealRahwana({ armAngles, animated }) {
  const frontShldRot = armAngles?.frontShoulder ?? (animated ? 4 : 0);
  const frontElbwRot = armAngles?.frontElbow ?? (animated ? 8 : 0);
  const backShldRot = armAngles?.backShoulder ?? (animated ? -5 : 0);
  const backElbwRot = armAngles?.backElbow ?? (animated ? -7 : 0);

  return (
    <g className="real-wayang-rahwana" transform="translate(0, -10)">
      {/* 1. LENGAN BELAKANG DENGAN SENDI & TUDHING */}
      <g transform="translate(-24, 70)">
        <g style={{ transform: `rotate(${backShldRot}deg)`, transformOrigin: '0px 0px', transition: 'transform 0.1s ease-out' }}>
          {/* Lengan Atas Belakang Merah Sungging */}
          <path d="M0 0 Q-24 24 -16 52" stroke="url(#rahwanaSkinGrad)" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M0 0 Q-24 24 -16 52" stroke="#1c0707" strokeWidth="1.4" fill="none" />
          {/* Kelatbahu Naga Emas Prada */}
          <circle cx="-6" cy="12" r="5" fill="url(#goldPradaGrad)" stroke="#7f1d1d" strokeWidth="1" />
          <g transform="translate(-16, 52)">
            <g style={{ transform: `rotate(${backElbwRot}deg)`, transformOrigin: '0px 0px', transition: 'transform 0.1s ease-out' }}>
              {/* Lengan Bawah & Jari Kuku Meruncing */}
              <path d="M0 0 Q-6 24 6 52" stroke="url(#rahwanaSkinGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />
              {/* Gelang Binggel Prada */}
              <rect x="0" y="44" width="8" height="5" rx="1.5" fill="url(#goldPradaGrad)" stroke="#450a0a" strokeWidth="0.8" />
              <TudhingRod x1={6} y1={52} x2={-16} yBottom={270} />
            </g>
          </g>
        </g>
      </g>

      {/* 2. PRABA GENI BARA API ALENGKA (BERLUBANG TATAHAN EMAS) */}
      <g className="rahwana-praba">
        <path
          d="M-15 35 C-56 12, -96 64, -68 126 C-48 162, -14 150, -10 128 Z"
          fill="#450a0a"
          stroke="#b91c1c"
          strokeWidth="3.2"
        />
        {/* Pola Bara Lidah Api Tatah Emas */}
        <path
          d="M-20 45 C-50 26, -82 72, -58 116 C-42 142, -16 136, -14 118 Z"
          fill="url(#goldPradaGrad)"
          opacity="0.85"
        />
        <path
          d="M-22 55 C-42 42, -68 78, -50 108 C-36 126, -18 120, -16 108 Z"
          fill="#7f1d1d"
        />
      </g>

      {/* 3. GAPIT TANDUK KERBAU UTAMA */}
      <HornGapit x={0} yTop={20} yBottom={315} width={8} />

      {/* 4. BADAN RAKSASA GAGAH MERAH TUA & DODOT KENCANA */}
      <g className="rahwana-torso">
        {/* Dada Bidang Raksasa Merah Sungging */}
        <path
          d="M-28 52 Q-38 105 -22 150 L24 150 Q40 105 28 52 Z"
          fill="url(#rahwanaSkinGrad)"
          stroke="#450a0a"
          strokeWidth="2.8"
        />
        {/* Kalung Bulan Sabit Badhong Emas Prada */}
        <path
          d="M-22 56 Q0 94 22 56 Q14 74 -2 78 Q-16 74 -22 56 Z"
          fill="url(#goldPradaGrad)"
          stroke="#78350f"
          strokeWidth="1.4"
        />
        {/* Kain Dodot Poleng Merah Hitam Raksasa Alengka */}
        <path
          d="M-24 150 L-34 215 L-6 215 L0 178 L8 215 L34 215 L24 150 Z"
          fill="url(#batikSogaGrad)"
          stroke="#b91c1c"
          strokeWidth="2.4"
        />
        {/* Tatahan Kerawangan Celana Samping */}
        <rect x="-24" y="215" width="16" height="52" rx="3" fill="#1c0707" stroke="#b91c1c" strokeWidth="1.6" />
        <rect x="10" y="215" width="16" height="52" rx="3" fill="#1c0707" stroke="#b91c1c" strokeWidth="1.6" />
        {/* Binggel Kaki Emas Kerincing */}
        <line x1="-26" y1="252" x2="-8" y2="252" stroke="url(#goldPradaGrad)" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="8" y1="252" x2="26" y2="252" stroke="url(#goldPradaGrad)" strokeWidth="4.5" strokeLinecap="round" />
      </g>

      {/* 5. KEPALA DASAMUKA, MAHKOTA MAKU RAKSASA & SIYUNG TARING */}
      <g className="rahwana-head">
        {/* Muka Merah Menyala Dasamuka */}
        <path
          d="M-18 16 C-12 -16, 28 -14, 30 20 C32 42, 12 50, -8 42 Z"
          fill="url(#rahwanaSkinGrad)"
          stroke="#450a0a"
          strokeWidth="1.8"
        />
        {/* Taring Siyung Menyeramkan */}
        <polygon points="14,35 22,46 27,35" fill="#fef08a" stroke="#7f1d1d" strokeWidth="1" />
        <polygon points="20,24 30,30 22,34" fill="#fef08a" stroke="#7f1d1d" strokeWidth="1" />
        {/* Kumis Bapang Lebat */}
        <path d="M10 26 Q24 22 36 28 Q24 36 10 32 Z" fill="#150505" />
        {/* Mata Thelengan Membelalak Merah Emas */}
        <circle cx="16" cy="18" r="4.8" fill="url(#goldPradaGrad)" stroke="#7f1d1d" strokeWidth="1.2" />
        <circle cx="16" cy="18" r="2.8" fill="#dc2626" />
        <circle cx="16" cy="18" r="1.4" fill="#110303" />
        {/* Mahkota Berduri Garuda Mungkur Raksasa */}
        <polygon points="-12,8 -6,-30 6,-12 18,-36 24,10" fill="url(#goldPradaGrad)" stroke="#78350f" strokeWidth="2.2" />
        <circle cx="6" cy="-12" r="3" fill="#dc2626" />
      </g>

      {/* 6. LENGAN DEPAN RAHWANA & PEDANG CANDRASA */}
      <g transform="translate(26, 70)">
        <g style={{ transform: `rotate(${frontShldRot}deg)`, transformOrigin: '0px 0px', transition: 'transform 0.1s ease-out' }}>
          {/* Kelatbahu Depan Emas */}
          <circle cx="0" cy="0" r="5.5" fill="url(#goldPradaGrad)" stroke="#78350f" strokeWidth="1.2" />
          {/* Lengan Atas Depan */}
          <path d="M0 0 Q24 26 18 56" stroke="url(#rahwanaSkinGrad)" strokeWidth="9" strokeLinecap="round" fill="none" />
          <g transform="translate(18, 56)">
            <g style={{ transform: `rotate(${frontElbwRot}deg)`, transformOrigin: '0px 0px', transition: 'transform 0.1s ease-out' }}>
              <circle cx="0" cy="0" r="4.5" fill="url(#goldPradaGrad)" stroke="#78350f" strokeWidth="1" />
              {/* Lengan Bawah Depan */}
              <path d="M0 0 Q-4 24 6 50" stroke="url(#rahwanaSkinGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />
              <circle cx="6" cy="50" r="4.5" fill="#7f1d1d" />
              {/* Tudhing Penggerak Tangan Depan */}
              <TudhingRod x1={6} y1={50} x2={24} yBottom={275} />
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

/* =========================================================================
   2. DEWI SHINTA — PUTRI MANTILI (KUNING LANGSAT KENCANA WAYANG BENERAN)
   ========================================================================= */
function RealShinta({ armAngles, animated }) {
  const frontShldRot = armAngles?.frontShoulder ?? (animated ? 3 : 0);
  const frontElbwRot = armAngles?.frontElbow ?? (animated ? 6 : 0);
  const backShldRot = armAngles?.backShoulder ?? (animated ? -4 : 0);
  const backElbwRot = armAngles?.backElbow ?? (animated ? -6 : 0);

  return (
    <g className="real-wayang-shinta" transform="translate(0, 5)">
      {/* 1. LENGAN BELAKANG PUTRI & TUDHING */}
      <g transform="translate(-10, 68)">
        <g style={{ transform: `rotate(${backShldRot}deg)`, transformOrigin: '0px 0px', transition: 'transform 0.1s ease-out' }}>
          {/* Lengan Atas Belakang Kuning Langsat Halus */}
          <path d="M0 0 Q-16 22 -10 50" stroke="url(#shintaSkinGrad)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          <circle cx="-3" cy="12" r="3.5" fill="url(#goldPradaGrad)" stroke="#78350f" strokeWidth="0.8" />
          <g transform="translate(-10, 50)">
            <g style={{ transform: `rotate(${backElbwRot}deg)`, transformOrigin: '0px 0px', transition: 'transform 0.1s ease-out' }}>
              <path d="M0 0 Q-4 20 4 44" stroke="url(#shintaSkinGrad)" strokeWidth="4.8" strokeLinecap="round" fill="none" />
              {/* Gelang Kana Emas Putri */}
              <circle cx="4" cy="44" r="3.2" fill="url(#goldPradaGrad)" stroke="#78350f" strokeWidth="0.8" />
              <TudhingRod x1={4} y1={44} x2={-12} yBottom={265} />
            </g>
          </g>
        </g>
      </g>

      {/* 2. SAMPUR SELENDANG KENCANA PUTRI MENJUNTAI */}
      <g className="shinta-sampur" opacity="0.95">
        <path
          d="M-12 80 Q-34 125 -28 190 Q-24 245 -12 285"
          stroke="url(#goldPradaGrad)"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M-10 92 Q-26 135 -22 195 Q-18 240 -8 280"
          stroke="#b45309"
          strokeWidth="1.6"
          fill="none"
        />
      </g>

      {/* 3. GAPIT TANDUK KERBAU HALUS PENOPANG PUTRI */}
      <HornGapit x={0} yTop={15} yBottom={310} width={6} />

      {/* 4. BADAN RAMPING PUTRI, KEMBEN & DODOT PARANG KLITHIK */}
      <g className="shinta-body">
        {/* Tubuh Anggun Kuning Langsat Kencana */}
        <path
          d="M-14 55 Q-20 100 -14 140 L16 140 Q22 100 16 55 Z"
          fill="url(#shintaSkinGrad)"
          stroke="#78350f"
          strokeWidth="1.8"
        />
        {/* Kemben Prada Emas Bermotif */}
        <path
          d="M-14 70 Q0 80 16 70 L14 110 Q0 120 -12 110 Z"
          fill="url(#batikSogaGrad)"
          stroke="url(#goldPradaGrad)"
          strokeWidth="1.6"
        />
        <rect x="-11" y="80" width="22" height="22" fill="url(#goldPradaGrad)" opacity="0.4" />
        {/* Kain Dodot Samparan Panjang Menjuntai Soga */}
        <path
          d="M-16 140 Q-22 195 -24 260 Q-14 290 6 295 Q20 290 20 260 Q22 195 18 140 Z"
          fill="url(#batikSogaGrad)"
          stroke="url(#goldPradaGrad)"
          strokeWidth="2.2"
        />
        {/* Garis-Garis Sungging Tatah Emas Dodot */}
        <path d="M-14 165 L16 182 M-16 200 L14 218 M-18 235 L12 254 M-20 270 L10 288" stroke="url(#goldPradaGrad)" strokeWidth="1.5" strokeDasharray="4 2" />
      </g>

      {/* 5. PROFIL WAJAH LURUH, GELUNG PUTRI & CUNDUK MENTUL BERGOYANG */}
      <g className="shinta-head">
        {/* Paras Putri Luruh Lembut Menunduk */}
        <path
          d="M-10 16 Q-6 -10 16 -6 Q24 14 18 32 Q6 38 -8 28 Z"
          fill="url(#shintaSkinGrad)"
          stroke="#78350f"
          strokeWidth="1.4"
        />
        {/* Mata Jaitan Luruh Sayu Lembut */}
        <path d="M4 18 Q12 14 18 20" stroke="#1c0a00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {/* Alis Nanggal Sepisan & Bibir Delima Merekah */}
        <path d="M2 13 Q10 8 18 14" stroke="#78350f" strokeWidth="1.2" fill="none" />
        <path d="M8 28 Q13 31 16 27" stroke="#b91c1c" strokeWidth="1.5" fill="none" />
        {/* Gelung Putri Kencana Bertatah Emas */}
        <path
          d="M-16 8 C-24 -12, -8 -30, 8 -22 C-2 -18, -8 0, -10 14 Z"
          fill="#1c0d06"
          stroke="url(#goldPradaGrad)"
          strokeWidth="2"
        />
        {/* Cunduk Mentul Emas Bergoyang di Atas Mahkota */}
        <g className={animated ? 'wayang-cunduk-mentul' : ''}>
          <line x1="3" y1="-22" x2="8" y2="-40" stroke="url(#goldPradaGrad)" strokeWidth="1.8" />
          <circle cx="8" cy="-40" r="4.2" fill="url(#goldPradaGrad)" stroke="#78350f" strokeWidth="1" />
          <circle cx="8" cy="-40" r="1.5" fill="#fef08a" />
          <line x1="-5" y1="-20" x2="-10" y2="-35" stroke="url(#goldPradaGrad)" strokeWidth="1.8" />
          <circle cx="-10" cy="-35" r="3.6" fill="url(#goldPradaGrad)" stroke="#78350f" strokeWidth="1" />
        </g>
      </g>

      {/* 6. LENGAN DEPAN PUTRI & TUDHING PENUNTUN */}
      <g transform="translate(14, 65)">
        <g style={{ transform: `rotate(${frontShldRot}deg)`, transformOrigin: '0px 0px', transition: 'transform 0.1s ease-out' }}>
          <circle cx="0" cy="0" r="4" fill="url(#goldPradaGrad)" stroke="#78350f" strokeWidth="1" />
          {/* Lengan Atas Depan */}
          <path d="M0 0 Q18 24 12 48" stroke="url(#shintaSkinGrad)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          <g transform="translate(12, 48)">
            <g style={{ transform: `rotate(${frontElbwRot}deg)`, transformOrigin: '0px 0px', transition: 'transform 0.1s ease-out' }}>
              <circle cx="0" cy="0" r="3.2" fill="url(#goldPradaGrad)" stroke="#78350f" strokeWidth="0.8" />
              {/* Lengan Bawah Depan */}
              <path d="M0 0 Q-4 20 4 42" stroke="url(#shintaSkinGrad)" strokeWidth="4.8" strokeLinecap="round" fill="none" />
              <circle cx="4" cy="42" r="3.5" fill="url(#goldPradaGrad)" stroke="#78350f" strokeWidth="0.8" />
              <TudhingRod x1={4} y1={42} x2={16} yBottom={270} />
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

/* =========================================================================
   3. RADEN GATOTKACA — SATRIA PRINGGANDANI (WAYANG BENERAN)
   ========================================================================= */
function RealGatotkaca({ armAngles, animated }) {
  const frontShldRot = armAngles?.frontShoulder ?? (animated ? 4 : 0);
  const frontElbwRot = armAngles?.frontElbow ?? (animated ? 7 : 0);
  const backShldRot = armAngles?.backShoulder ?? (animated ? -5 : 0);
  const backElbwRot = armAngles?.backElbow ?? (animated ? -8 : 0);

  return (
    <g className="real-wayang-gatotkaca" transform="translate(0, 0)">
      {/* 1. Lengan Belakang */}
      <g transform="translate(-18, 68)">
        <g style={{ transform: `rotate(${backShldRot}deg)`, transformOrigin: '0px 0px', transition: 'transform 0.1s ease-out' }}>
          <path d="M0 0 Q-18 24 -12 50" stroke="#1e150f" strokeWidth="7" strokeLinecap="round" fill="none" />
          <g transform="translate(-12, 50)">
            <g style={{ transform: `rotate(${backElbwRot}deg)`, transformOrigin: '0px 0px', transition: 'transform 0.1s ease-out' }}>
              <path d="M0 0 Q-4 22 4 46" stroke="#1e150f" strokeWidth="6" strokeLinecap="round" fill="none" />
              <TudhingRod x1={4} y1={46} x2={-14} yBottom={270} />
            </g>
          </g>
        </g>
      </g>

      {/* 2. Praba Sayap Terbang Emas Antakusuma */}
      <g className="gatotkaca-praba">
        <path
          d="M-15 40 C-50 15, -85 58, -60 115 C-42 148, -12 138, -10 118 Z"
          fill="#1c1208"
          stroke="url(#goldPradaGrad)"
          strokeWidth="2.8"
        />
        <path d="M-18 48 C-44 26, -72 64, -50 106 C-36 128, -14 122, -12 108 Z" fill="url(#goldPradaGrad)" opacity="0.85" />
      </g>

      {/* 3. Gapit Tanduk Kerbau */}
      <HornGapit x={0} yTop={18} yBottom={315} width={7.5} />

      {/* 4. Torso Kotang Antakusuma & Dodot Poleng */}
      <g>
        <path d="M-22 52 Q-30 100 -18 145 L20 145 Q32 100 24 52 Z" fill="#18110b" stroke="url(#goldPradaGrad)" strokeWidth="2.2" />
        {/* Kotang Antakusuma Bintang Emas */}
        <polygon points="0,75 5,90 20,90 8,100 12,115 0,105 -12,115 -8,100 -20,90 -5,90" fill="url(#goldPradaGrad)" stroke="#78350f" strokeWidth="0.8" />
        {/* Dodot Poleng Hitam Putih Khas Pandawa */}
        <path d="M-20 145 L-28 210 L-4 210 L0 175 L8 210 L28 210 L20 145 Z" fill="#1e150f" stroke="url(#goldPradaGrad)" strokeWidth="2" />
      </g>

      {/* 5. Kepala Satria & Caping Basunanda */}
      <g>
        <path d="M-14 16 Q-8 -12 20 -8 Q26 14 20 28 Q8 36 -6 28 Z" fill="#18110b" stroke="url(#goldPradaGrad)" strokeWidth="1.6" />
        <polygon points="-8,6 2,-28 16,-8 20,8" fill="url(#goldPradaGrad)" stroke="#78350f" strokeWidth="1.8" />
        <circle cx="12" cy="16" r="3.8" fill="url(#goldPradaGrad)" />
        <circle cx="12" cy="16" r="1.8" fill="#110803" />
      </g>

      {/* 6. Lengan Depan Gatotkaca */}
      <g transform="translate(20, 68)">
        <g style={{ transform: `rotate(${frontShldRot}deg)`, transformOrigin: '0px 0px', transition: 'transform 0.1s ease-out' }}>
          <circle cx="0" cy="0" r="4.5" fill="url(#goldPradaGrad)" stroke="#78350f" strokeWidth="1" />
          <path d="M0 0 Q20 24 14 52" stroke="#1e150f" strokeWidth="7.5" strokeLinecap="round" fill="none" />
          <g transform="translate(14, 52)">
            <g style={{ transform: `rotate(${frontElbwRot}deg)`, transformOrigin: '0px 0px', transition: 'transform 0.1s ease-out' }}>
              <path d="M0 0 Q-4 22 4 46" stroke="#1e150f" strokeWidth="6.5" strokeLinecap="round" fill="none" />
              <TudhingRod x1={4} y1={46} x2={20} yBottom={275} />
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

/* =========================================================================
   4. RADEN ARJUNA — SATRIA MADUKARA (WAYANG BENERAN)
   ========================================================================= */
function RealArjuna({ armAngles, animated }) {
  const frontShldRot = armAngles?.frontShoulder ?? (animated ? 2 : 0);
  const frontElbwRot = armAngles?.frontElbow ?? (animated ? 5 : 0);
  const backShldRot = armAngles?.backShoulder ?? (animated ? -3 : 0);
  const backElbwRot = armAngles?.backElbow ?? (animated ? -5 : 0);

  return (
    <g className="real-wayang-arjuna" transform="translate(0, 5)">
      {/* 1. Lengan Belakang */}
      <g transform="translate(-14, 66)">
        <g style={{ transform: `rotate(${backShldRot}deg)`, transformOrigin: '0px 0px', transition: 'transform 0.1s ease-out' }}>
          <path d="M0 0 Q-16 22 -10 48" stroke="url(#shintaSkinGrad)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          <g transform="translate(-10, 48)">
            <g style={{ transform: `rotate(${backElbwRot}deg)`, transformOrigin: '0px 0px', transition: 'transform 0.1s ease-out' }}>
              <path d="M0 0 Q-3 20 4 42" stroke="url(#shintaSkinGrad)" strokeWidth="4.8" strokeLinecap="round" fill="none" />
              <TudhingRod x1={4} y1={42} x2={-12} yBottom={265} />
            </g>
          </g>
        </g>
      </g>

      {/* 2. Gapit Tanduk Kerbau Halus */}
      <HornGapit x={0} yTop={15} yBottom={310} width={6.5} />

      {/* 3. Badan Satria Halus & Dodot Parang Rusak */}
      <g>
        <path d="M-16 54 Q-22 96 -16 138 L18 138 Q24 96 18 54 Z" fill="url(#shintaSkinGrad)" stroke="#78350f" strokeWidth="1.8" />
        <path d="M-18 138 L-24 205 L-4 205 L0 170 L6 205 L24 205 L18 138 Z" fill="url(#batikSogaGrad)" stroke="url(#goldPradaGrad)" strokeWidth="2" />
        <path d="M-16 160 L18 175 M-18 190 L16 205" stroke="url(#goldPradaGrad)" strokeWidth="1.4" strokeDasharray="3 2" />
      </g>

      {/* 4. Kepala Tampan Luruh & Gelung Supit Urang */}
      <g>
        <path d="M-10 16 Q-6 -10 16 -6 Q22 14 16 30 Q6 36 -6 28 Z" fill="url(#shintaSkinGrad)" stroke="#78350f" strokeWidth="1.4" />
        {/* Gelung Supit Urang Ksatria Madukara */}
        <path d="M-14 8 C-22 -14, -6 -28, 10 -20 C-2 -16, -6 2, -8 14 Z" fill="#150a04" stroke="url(#goldPradaGrad)" strokeWidth="2" />
        <path d="M4 16 Q12 12 16 18" stroke="#150a04" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </g>

      {/* 5. Lengan Depan Arjuna */}
      <g transform="translate(16, 66)">
        <g style={{ transform: `rotate(${frontShldRot}deg)`, transformOrigin: '0px 0px', transition: 'transform 0.1s ease-out' }}>
          <circle cx="0" cy="0" r="4" fill="url(#goldPradaGrad)" stroke="#78350f" strokeWidth="1" />
          <path d="M0 0 Q18 22 12 48" stroke="url(#shintaSkinGrad)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          <g transform="translate(12, 48)">
            <g style={{ transform: `rotate(${frontElbwRot}deg)`, transformOrigin: '0px 0px', transition: 'transform 0.1s ease-out' }}>
              <circle cx="0" cy="0" r="3" fill="url(#goldPradaGrad)" stroke="#78350f" strokeWidth="0.8" />
              <path d="M0 0 Q-4 20 4 42" stroke="url(#shintaSkinGrad)" strokeWidth="4.8" strokeLinecap="round" fill="none" />
              <TudhingRod x1={4} y1={42} x2={18} yBottom={270} />
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}
