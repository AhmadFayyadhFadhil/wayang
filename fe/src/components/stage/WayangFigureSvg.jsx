import React from 'react';

/**
 * Komponen Wayang Kulit Otentik Berbasis Vektor Tatah-Sungging
 * Dilengkapi Sistem Rigging Sendi 2-Segmen (Pundak & Siku) + Tangkai Tudhing Dalang
 * Menghadirkan Solah Gerak Ayunan Tangan Alami (Articulated Arm Animation)
 */
export default function WayangFigureSvg({
  slug = 'gatotkaca',
  pose = 'default',
  facing = 'right',
  scale = 1,
  isSelected = false,
  accentColor = '#d4af37',
  width = 160,
  height = 240,
  animated = true,
}) {
  const isFlipped = facing === 'left';
  const transform = `scale(${isFlipped ? -scale : scale}, ${scale})`;

  return (
    <svg
      viewBox="-110 -30 220 300"
      width={width * scale}
      height={height * scale}
      style={{
        overflow: 'visible',
        filter: isSelected
          ? 'drop-shadow(0 6px 18px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 14px rgba(232, 187, 92, 0.55))'
          : 'drop-shadow(0 8px 14px rgba(0, 0, 0, 0.6))',
        transition: 'filter 0.2s ease, transform 0.15s ease',
        cursor: 'grab',
      }}
    >
      <defs>
        {/* Style scoped untuk animasi ayunan sendi tangan dalang */}
        <style>
          {`
            @keyframes dalangShoulderIdleSvg {
              0% { transform: rotate(0deg); }
              50% { transform: rotate(7deg); }
              100% { transform: rotate(0deg); }
            }
            @keyframes dalangElbowIdleSvg {
              0% { transform: rotate(0deg); }
              50% { transform: rotate(12deg); }
              100% { transform: rotate(0deg); }
            }
            @keyframes dalangBackShoulderIdleSvg {
              0% { transform: rotate(0deg); }
              50% { transform: rotate(-5deg); }
              100% { transform: rotate(0deg); }
            }
            @keyframes dalangBackElbowIdleSvg {
              0% { transform: rotate(0deg); }
              50% { transform: rotate(-9deg); }
              100% { transform: rotate(0deg); }
            }
            @keyframes dalangCombatShoulderSvg {
              0% { transform: rotate(0deg); }
              50% { transform: rotate(-6deg); }
              100% { transform: rotate(0deg); }
            }
            @keyframes dalangCombatElbowSvg {
              0% { transform: rotate(0deg); }
              50% { transform: rotate(-10deg); }
              100% { transform: rotate(0deg); }
            }
            .wayang-arm-front-shld {
              transform-origin: 0px 0px;
              ${animated ? 'animation: dalangShoulderIdleSvg 3.2s ease-in-out infinite;' : ''}
            }
            .wayang-arm-front-elbw {
              transform-origin: 0px 0px;
              ${animated ? 'animation: dalangElbowIdleSvg 3.2s ease-in-out infinite 0.3s;' : ''}
            }
            .wayang-arm-back-shld {
              transform-origin: 0px 0px;
              ${animated ? 'animation: dalangBackShoulderIdleSvg 3.6s ease-in-out infinite 0.4s;' : ''}
            }
            .wayang-arm-back-elbw {
              transform-origin: 0px 0px;
              ${animated ? 'animation: dalangBackElbowIdleSvg 3.6s ease-in-out infinite 0.7s;' : ''}
            }
            .wayang-arm-combat-shld {
              transform-origin: 0px 0px;
              ${animated ? 'animation: dalangCombatShoulderSvg 2.4s ease-in-out infinite;' : ''}
            }
            .wayang-arm-combat-elbw {
              transform-origin: 0px 0px;
              ${animated ? 'animation: dalangCombatElbowSvg 2.4s ease-in-out infinite 0.25s;' : ''}
            }
          `}
        </style>
      </defs>

      <g transform={transform}>
        {/* Render Tokoh Wayang Otentik */}
        {renderAuthenticWayang(slug, pose, accentColor, animated)}
      </g>
    </svg>
  );
}

function renderAuthenticWayang(slug, pose, accent, animated) {
  switch (slug) {
    case 'gatotkaca':
      return <AuthenticGatotkaca pose={pose} accent={accent} animated={animated} />;
    case 'arjuna':
      return <AuthenticArjuna pose={pose} accent={accent} animated={animated} />;
    case 'karna':
      return <AuthenticKarna pose={pose} accent={accent} animated={animated} />;
    case 'bima':
      return <AuthenticBima pose={pose} accent={accent} animated={animated} />;
    case 'semar':
      return <AuthenticSemar pose={pose} accent={accent} animated={animated} />;
    case 'rahwana':
      return <AuthenticRahwana pose={pose} accent={accent} animated={animated} />;
    case 'shinta':
      return <AuthenticShinta pose={pose} accent={accent} animated={animated} />;
    default:
      return <AuthenticGatotkaca pose={pose} accent={accent} animated={animated} />;
  }
}

/**
 * Tangkai Penggerak Tudhing Wayang Kulit Otentik
 */
function TudhingStick({ x1, y1, x2, y2, color = '#3e2723' }) {
  return (
    <g opacity="0.85">
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Pegangan Dalang di Pangkal Bawah */}
      <circle cx={x2} cy={y2} r="2.8" fill="#d4af37" />
    </g>
  );
}

/**
 * Gapit Utama Penopang Wayang (Tanduk Kerbau / Kayu Jati)
 */
function MainGapit({ x = 0, yStart = 65, yEnd = 270, stroke = '#3e2723' }) {
  return (
    <g opacity="0.95">
      <line
        x1={x}
        y1={yStart}
        x2={x}
        y2={yEnd}
        stroke={stroke}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {/* Lilitan Tali Pluntur Pengikat Gapit */}
      <line x1={x - 3} y1={yStart + 35} x2={x + 3} y2={yStart + 35} stroke="#d4af37" strokeWidth="2" />
      <line x1={x - 3} y1={yStart + 80} x2={x + 3} y2={yStart + 80} stroke="#d4af37" strokeWidth="2" />
      <line x1={x - 3} y1={yStart + 130} x2={x + 3} y2={yStart + 130} stroke="#d4af37" strokeWidth="2" />
    </g>
  );
}

/* =========================================================================
   1. RADEN GATOTKACA — SATRIA PRINGGANDANI (Gagahan, Otot Kawat Balung Wesi)
   ========================================================================= */
function AuthenticGatotkaca({ pose, accent, animated }) {
  const isWar = pose === 'perang';
  const isFly = pose === 'terbang';
  const isSembah = pose === 'sembah';

  return (
    <g className="wayang-gatotkaca-authentic">
      {/* 1. LENGAN BELAKANG (Layer Paling Belakang) */}
      <g transform="translate(-14, 52)">
        <g className={animated ? 'wayang-arm-back-shld' : ''}>
          {/* Lengan Atas Belakang */}
          <path
            d="M0 0 Q-15 15 -12 36"
            stroke="#1c140e"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Siku Belakang */}
          <g transform="translate(-12, 36)">
            <g className={animated ? 'wayang-arm-back-elbw' : ''}>
              {/* Lengan Bawah & Telapak Belakang */}
              <path
                d="M0 0 Q-5 18 4 36"
                stroke="#1c140e"
                strokeWidth="4.2"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="4" cy="36" r="3" fill="#d4af37" />
              {/* Tudhing Belakang */}
              <TudhingStick x1="4" y1="36" x2="-8" y2="185" />
            </g>
          </g>
        </g>
      </g>

      {/* 2. PRABA SAYAP KOTANG ANTAKUSUMA (Ukiran Tatah Sungging Emas) */}
      <g>
        {/* Praba Luar */}
        <path
          d="M-6 40 C-40 20, -75 50, -60 95 C-48 125, -12 118, -4 100 Z"
          fill="#17110c"
          stroke={accent}
          strokeWidth="2"
        />
        {/* Ornamen Sungging Dalam Praba */}
        <path
          d="M-10 48 C-35 34, -62 60, -50 90 C-40 112, -15 106, -8 92 Z"
          fill="#251a12"
          stroke="#e5c158"
          strokeWidth="1"
          strokeDasharray="4 2"
        />
        {/* Lubang Tatahan Ukir Praba */}
        <circle cx="-32" cy="65" r="2.5" fill="#fcfaf2" opacity="0.8" />
        <circle cx="-42" cy="80" r="2.5" fill="#fcfaf2" opacity="0.8" />
        <circle cx="-35" cy="95" r="2.2" fill="#fcfaf2" opacity="0.8" />
      </g>

      {/* 3. GAPIT UTAMA PENOPANG */}
      <MainGapit x={0} yStart={60} yEnd={265} />

      {/* 4. BADAN KOTANG ANTAKUSUMA & DODOT POLENG */}
      {/* Rompi Beludru Antakusuma Hitam-Emas */}
      <path
        d="M-16 45 Q-22 82 -12 115 L14 115 Q24 82 16 45 Z"
        fill="#140f0b"
        stroke="#8b4513"
        strokeWidth="2"
      />
      {/* Garis Border Emas Kotang */}
      <path
        d="M-12 48 Q-16 80 -8 112 L10 112 Q18 80 12 48 Z"
        fill="none"
        stroke={accent}
        strokeWidth="1.2"
      />
      {/* Kalung Wulan Tumanggal */}
      <path d="M-6 48 Q0 58 6 48" stroke="#fcfaf2" strokeWidth="2" fill="none" />
      <path d="M-8 52 Q0 64 8 52" stroke={accent} strokeWidth="1.8" fill="none" />
      {/* Bintang Kencana Sakti Antakusuma di Tengah Dada */}
      <polygon
        points="0,70 3,76 10,76 5,81 7,88 0,84 -7,88 -5,81 -10,76 -3,76"
        fill="#e5c158"
        stroke="#8b4513"
        strokeWidth="0.8"
      />
      <circle cx="0" cy="80" r="2" fill="#b91c1c" />

      {/* 5. KEPALA & MAHKOTA JAMANG BASUNANDA GATOTKACA */}
      <g transform={isFly ? 'rotate(-12 0 25)' : ''}>
        {/* Siluet Wajah Gagahan */}
        <path
          d="M-10 15 C-8 -4, 16 -8, 20 12 C22 26, 4 34, -4 32 Z"
          fill="#17110c"
          stroke={accent}
          strokeWidth="1"
        />
        {/* Hidung Bentar Gagah & Mulut */}
        <path d="M14 16 L26 20 L16 26 Z" fill="#17110c" stroke={accent} strokeWidth="0.8" />
        {/* Kumis Sanggan Gagah Melengkung */}
        <path d="M12 24 Q18 28 23 23" stroke="#fcfaf2" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M12 25 Q18 29 23 24" stroke="#d4af37" strokeWidth="1" fill="none" />
        {/* Mata Thelengan Gagah */}
        <ellipse cx="10" cy="16" rx="3" ry="2" fill="#fcfaf2" />
        <circle cx="11" cy="16" r="1.5" fill="#17110c" />
        <circle cx="11" cy="16" r="0.7" fill="#d4af37" />

        {/* Mahkota Jamang Basunanda Menjulang */}
        <path
          d="M-8 10 C-18 -18, -4 -28, 8 -20 C18 -12, 14 2, 6 10 Z"
          fill="#251a12"
          stroke={accent}
          strokeWidth="1.8"
        />
        {/* Hiasan Garuda Mungkur di Belakang Leher */}
        <path
          d="M-12 16 C-22 10, -24 24, -14 24 Z"
          fill="#d4af37"
          stroke="#8b4513"
          strokeWidth="1"
        />
        {/* Sumping Surèngpati di Telinga */}
        <path
          d="M-2 20 Q-8 24 -4 28 Q0 24 -2 20"
          fill="#d4af37"
          stroke="#8b4513"
          strokeWidth="1"
        />
        {/* Permata Merah Delima di Mahkota */}
        <circle cx="4" cy="-12" r="2.2" fill="#b91c1c" />
        <circle cx="0" cy="-4" r="1.8" fill="#e5c158" />
      </g>

      {/* 6. DODOT KAMPUH, KAIN CINDE & SAMPUR */}
      <g>
        {/* Dodot Kampuh Poleng Merah-Hitam */}
        <path
          d="M-14 115 L-20 165 L-2 165 L-2 135 L5 135 L5 165 L20 165 L16 115 Z"
          fill="#291a10"
          stroke={accent}
          strokeWidth="1.8"
        />
        {/* Motif Garis-Garis Batik Tatah */}
        <line x1="-10" y1="125" x2="-2" y2="155" stroke="#d4af37" strokeWidth="1" />
        <line x1="2" y1="125" x2="10" y2="155" stroke="#d4af37" strokeWidth="1" />
        {/* Uncal Kencana Menjuntai di Tengah */}
        <path d="M-2 118 L-2 162 L4 162 L4 118 Z" fill="#e5c158" stroke="#8b4513" strokeWidth="1" />
        {/* Sampur Selendang Melambai */}
        <path
          d="M14 125 Q28 140 22 170 Q16 150 14 140"
          fill="#b91c1c"
          stroke="#d4af37"
          strokeWidth="1"
        />

        {/* Kaki Gagahan Berbinggel Emas */}
        <rect x="-16" y="165" width="9" height="42" rx="3" fill="#17110c" stroke="#8b4513" strokeWidth="1" />
        <rect x="7" y="165" width="9" height="42" rx="3" fill="#17110c" stroke="#8b4513" strokeWidth="1" />
        {/* Gelang Kaki Binggel Kencana */}
        <line x1="-18" y1="195" x2="-6" y2="195" stroke={accent} strokeWidth="3" />
        <line x1="6" y1="195" x2="18" y2="195" stroke={accent} strokeWidth="3" />
      </g>

      {/* 7. LENGAN DEPAN (Articulated Arm Rigging & Live Solah Animation) */}
      <g transform="translate(14, 52)">
        <g
          className={
            animated
              ? isWar
                ? 'wayang-arm-combat-shld'
                : 'wayang-arm-front-shld'
              : ''
          }
        >
          {/* Kelat Bahu Naga Emas di Pundak */}
          <path
            d="M-3 -4 Q6 -8 8 0 Q4 6 -3 2 Z"
            fill="#e5c158"
            stroke="#8b4513"
            strokeWidth="1"
          />

          {/* Lengan Atas (Shoulder to Elbow) */}
          {isWar ? (
            <path
              d="M0 0 Q18 -5 28 -18"
              stroke="#17110c"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
          ) : isSembah ? (
            <path
              d="M0 0 Q10 12 6 24"
              stroke="#17110c"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
          ) : isFly ? (
            <path
              d="M0 0 Q22 -4 38 -4"
              stroke="#17110c"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            /* Idle Pose: Lengan menjuntai berotot */
            <path
              d="M0 0 Q16 18 12 38"
              stroke="#17110c"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* SENDI SIKU (Elbow Joint) */}
          <g
            transform={
              isWar
                ? 'translate(28, -18)'
                : isSembah
                ? 'translate(6, 24)'
                : isFly
                ? 'translate(38, -4)'
                : 'translate(12, 38)'
            }
          >
            <g
              className={
                animated
                  ? isWar
                    ? 'wayang-arm-combat-elbw'
                    : 'wayang-arm-front-elbw'
                  : ''
              }
            >
              {/* Gelang Kana Emas di Siku/Pergelangan */}
              <circle cx="0" cy="0" r="3.5" fill="#e5c158" stroke="#8b4513" strokeWidth="1" />

              {/* Lengan Bawah & Telapak Tangan */}
              {isWar ? (
                <g>
                  {/* Tangan Terangkat Mengepal Tegas */}
                  <path
                    d="M0 0 Q12 -12 18 -25"
                    stroke="#17110c"
                    strokeWidth="4.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle cx="18" cy="-25" r="4.2" fill="#d4af37" />
                  <TudhingStick x1="18" y1="-25" x2="26" y2="160" />
                </g>
              ) : isSembah ? (
                <g>
                  <path
                    d="M0 0 Q-6 10 -15 12"
                    stroke="#17110c"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle cx="-15" cy="12" r="3.5" fill="#d4af37" />
                </g>
              ) : isFly ? (
                <g>
                  <path
                    d="M0 0 Q15 0 26 2"
                    stroke="#17110c"
                    strokeWidth="4.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle cx="26" cy="2" r="4" fill="#d4af37" />
                  <TudhingStick x1="26" y1="2" x2="35" y2="175" />
                </g>
              ) : (
                /* Idle Pose: Menekuk alami memegang tudhing */
                <g>
                  <path
                    d="M0 0 Q-4 18 2 36"
                    stroke="#17110c"
                    strokeWidth="4.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Telapak Tangan & Driji Ngithing Gagah */}
                  <circle cx="2" cy="36" r="3.8" fill="#d4af37" stroke="#8b4513" strokeWidth="0.8" />
                  {/* Tudhing Bambu / Tanduk Wayang Depan */}
                  <TudhingStick x1="2" y1="36" x2="14" y2="185" />
                </g>
              )}
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

/* =========================================================================
   2. RADEN ARJUNA (JANAKA) — SATRIA ALUS & UTAMA (Anggun, Cipta Wening)
   ========================================================================= */
function AuthenticArjuna({ pose, accent, animated }) {
  const isBow = pose === 'perang' || pose === 'memanah';
  const isSembah = pose === 'sembah';

  return (
    <g className="wayang-arjuna-authentic">
      {/* 1. LENGAN BELAKANG */}
      <g transform="translate(-10, 48)">
        <g className={animated ? 'wayang-arm-back-shld' : ''}>
          <path d="M0 0 Q-12 14 -8 32" stroke="#1c1917" strokeWidth="4.2" strokeLinecap="round" fill="none" />
          <g transform="translate(-8, 32)">
            <g className={animated ? 'wayang-arm-back-elbw' : ''}>
              <path d="M0 0 Q-4 16 2 32" stroke="#1c1917" strokeWidth="3.6" strokeLinecap="round" fill="none" />
              <circle cx="2" cy="32" r="2.8" fill="#e5c158" />
              <TudhingStick x1="2" y1="32" x2="-6" y2="175" />
            </g>
          </g>
        </g>
      </g>

      {/* 2. GAPIT UTAMA */}
      <MainGapit x={0} yStart={55} yEnd={260} stroke="#4a2e18" />

      {/* 3. TUBUH RAMPING ALUS */}
      <path
        d="M-10 44 Q-14 76 -7 110 L9 110 Q16 76 10 44 Z"
        fill="#181512"
        stroke={accent}
        strokeWidth="1.5"
      />
      {/* Kalung Bulan Sabit Penanggalan 3 Tingkat */}
      <path d="M-6 48 Q0 56 6 48" stroke="#fcfaf2" strokeWidth="1.8" fill="none" />
      <path d="M-8 52 Q0 62 8 52" stroke={accent} strokeWidth="1.5" fill="none" />
      <path d="M-10 56 Q0 68 10 56" stroke={accent} strokeWidth="1.2" fill="none" />

      {/* 4. KEPALA & GELUNG SUPIT URANG ANGGUN */}
      <g>
        {/* Wajah Luruh Tumungkul Alus */}
        <path
          d="M-6 16 C-4 2, 12 -2, 16 12 C18 24, 6 30, -2 28 Z"
          fill="#17120e"
          stroke={accent}
          strokeWidth="1"
        />
        {/* Hidung Mancung Lancip Walik Grengseng */}
        <path d="M12 16 L22 18 L14 22 Z" fill="#17120e" stroke={accent} strokeWidth="0.8" />
        {/* Mata Liyepan Alus Menunduk */}
        <path d="M8 15 Q14 16 18 14" stroke="#fcfaf2" strokeWidth="1.5" fill="none" />
        <circle cx="12" cy="15.5" r="1" fill="#e5c158" />
        {/* Sumping Sekar Kluwih di Telinga */}
        <path d="M0 20 Q-4 23 -1 26 Q3 23 0 20" fill="#e5c158" stroke="#8b4513" strokeWidth="0.8" />

        {/* Gelung Supit Urang Lengkung Anggun */}
        <path
          d="M-4 12 C-16 -6, -10 -22, 4 -16 C14 -8, 4 4, -2 8"
          stroke={accent}
          strokeWidth="2.8"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M-2 10 C-12 -4, -8 -18, 2 -14"
          stroke="#fcfaf2"
          strokeWidth="1"
          fill="none"
        />
      </g>

      {/* 5. DODOT JARIK PARANG RUSAK KLITHIK & SAMPUR */}
      <g>
        <path
          d="M-9 110 L-14 165 L-2 165 L0 135 L4 165 L14 165 L10 110 Z"
          fill="#221811"
          stroke={accent}
          strokeWidth="1.4"
        />
        {/* Motif Garis Parang */}
        <line x1="-8" y1="120" x2="-2" y2="150" stroke="#e5c158" strokeWidth="1" />
        <line x1="2" y1="120" x2="8" y2="150" stroke="#e5c158" strokeWidth="1" />
        {/* Selendang Sampur Mengayun */}
        <path d="M10 118 Q22 135 16 160" stroke="#d4af37" strokeWidth="1.5" fill="none" />

        {/* Kaki Alusan Berbinggel */}
        <rect x="-11" y="165" width="7" height="40" rx="2" fill="#17120e" stroke="#8b4513" strokeWidth="0.8" />
        <rect x="5" y="165" width="7" height="40" rx="2" fill="#17120e" stroke="#8b4513" strokeWidth="0.8" />
        <line x1="-12" y1="192" x2="-3" y2="192" stroke={accent} strokeWidth="2.5" />
        <line x1="4" y1="192" x2="13" y2="192" stroke={accent} strokeWidth="2.5" />
      </g>

      {/* 6. LENGAN DEPAN & BUSUR PANAH PASOPATI */}
      {isBow ? (
        <g>
          {/* Gandewa Busur Panah Pusaka Emas */}
          <path d="M22 -8 Q46 52 24 114" stroke="#e5c158" strokeWidth="3" fill="none" />
          <line x1="22" y1="-8" x2="24" y2="114" stroke="#fcfaf2" strokeWidth="0.8" />
          {/* Tangan menarik tali busur */}
          <g transform="translate(10, 48)">
            <g className={animated ? 'wayang-arm-combat-shld' : ''}>
              <path d="M0 0 L22 -4 L-4 4" stroke="#17120e" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              {/* Anak Panah Pasopati Meluncur */}
              <line x1="-8" y1="4" x2="38" y2="-6" stroke="#e5c158" strokeWidth="2" />
              <polygon points="38,-6 46,-8 40,-2" fill="#fcfaf2" />
            </g>
          </g>
        </g>
      ) : (
        <g transform="translate(10, 48)">
          <g className={animated ? 'wayang-arm-front-shld' : ''}>
            <circle cx="0" cy="0" r="3" fill="#e5c158" />
            {/* Lengan Atas Alusan */}
            <path d="M0 0 Q14 16 10 34" stroke="#17120e" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* SIKU DEPAN */}
            <g transform="translate(10, 34)">
              <g className={animated ? 'wayang-arm-front-elbw' : ''}>
                <circle cx="0" cy="0" r="2.8" fill="#e5c158" />
                {/* Lengan Bawah & Jari Ngithing */}
                <path d="M0 0 Q-3 16 2 32" stroke="#17120e" strokeWidth="4" strokeLinecap="round" fill="none" />
                <circle cx="2" cy="32" r="3" fill="#e5c158" />
                <TudhingStick x1="2" y1="32" x2="10" y2="178" />
              </g>
            </g>
          </g>
        </g>
      )}
    </g>
  );
}

/* =========================================================================
   3. ADIPATI KARNA — SURYAPUTRA (Satria Narpatitama, Praba Kencana Surya)
   ========================================================================= */
function AuthenticKarna({ pose, accent, animated }) {
  const isWar = pose === 'perang' || pose === 'memanah';

  return (
    <g className="wayang-karna-authentic">
      {/* 1. LENGAN BELAKANG */}
      <g transform="translate(-10, 46)">
        <g className={animated ? 'wayang-arm-back-shld' : ''}>
          <path d="M0 0 Q-14 14 -10 34" stroke="#1a110a" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <g transform="translate(-10, 34)">
            <g className={animated ? 'wayang-arm-back-elbw' : ''}>
              <path d="M0 0 Q-4 16 3 32" stroke="#1a110a" strokeWidth="4" strokeLinecap="round" fill="none" />
              <circle cx="3" cy="32" r="3" fill="#ea580c" />
              <TudhingStick x1="3" y1="32" x2="-8" y2="178" />
            </g>
          </g>
        </g>
      </g>

      {/* 2. PRABA KENCANA BATARA SURYA */}
      <g>
        <path
          d="M-5 35 C-36 15, -62 42, -50 82 C-38 108, -8 102, -4 86 Z"
          fill="#24150b"
          stroke="#ea580c"
          strokeWidth="1.8"
        />
        <path
          d="M-8 42 C-30 26, -50 48, -42 76 C-32 94, -12 90, -8 78 Z"
          fill="#331c0e"
          stroke="#d4af37"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
      </g>

      {/* 3. GAPIT UTAMA */}
      <MainGapit x={0} yStart={55} yEnd={262} stroke="#3e2723" />

      {/* 4. BADAN BERBAJU ZIRAH SURYA MANDALA */}
      <path
        d="M-11 44 Q-15 78 -9 112 L11 112 Q17 78 11 44 Z"
        fill="#1c120c"
        stroke="#ea580c"
        strokeWidth="1.8"
      />
      {/* Lambang Surya Mandala di Dada */}
      <circle cx="1" cy="66" r="8" fill="#ea580c" stroke="#d4af37" strokeWidth="1.5" />
      <circle cx="1" cy="66" r="4.5" fill="#fed7aa" />

      {/* 5. MAHKOTA MAKUTA KETU SURYA & PARAS MRABU LANYAP */}
      <g>
        {/* Wajah Menatap Gagah Mrabu */}
        <path d="M-8 16 C-4 0, 14 0, 18 14 C20 25, 8 30, 0 28 Z" fill="#1c120c" stroke="#ea580c" strokeWidth="1" />
        <path d="M12 18 L24 20 L15 24 Z" fill="#1c120c" stroke="#ea580c" strokeWidth="0.8" />
        {/* Kumis Tipis Bangsawan */}
        <path d="M11 23 Q16 26 21 22" stroke="#ea580c" strokeWidth="1.5" fill="none" />
        {/* Mata Liyepan Tajam */}
        <ellipse cx="9" cy="16" rx="2.5" ry="1.5" fill="#fcfaf2" />
        <circle cx="10" cy="16" r="1.2" fill="#ea580c" />

        {/* Mahkota Makuta Emas Berkilau Bertingkat */}
        <path
          d="M-5 10 L-3 -20 L7 -14 L12 12 Z"
          fill="#3e1a0b"
          stroke="#ea580c"
          strokeWidth="2"
        />
        <circle cx="2" cy="-8" r="2.5" fill="#fcfaf2" />
        <circle cx="2" cy="-8" r="1.2" fill="#ea580c" />
      </g>

      {/* 6. DODOT MERAH KEPRAOBON & KAKI BINGGEL */}
      <g>
        <path
          d="M-10 112 L-16 165 L-3 165 L0 135 L5 165 L16 165 L12 112 Z"
          fill="#2b1409"
          stroke="#ea580c"
          strokeWidth="1.6"
        />
        <line x1="-8" y1="125" x2="-2" y2="155" stroke="#f97316" strokeWidth="1" />
        <line x1="3" y1="125" x2="10" y2="155" stroke="#f97316" strokeWidth="1" />

        <rect x="-12" y="165" width="8" height="42" rx="2" fill="#1c120c" stroke="#8b4513" strokeWidth="1" />
        <rect x="6" y="165" width="8" height="42" rx="2" fill="#1c120c" stroke="#8b4513" strokeWidth="1" />
        <line x1="-13" y1="194" x2="-3" y2="194" stroke="#ea580c" strokeWidth="2.8" />
        <line x1="5" y1="194" x2="15" y2="194" stroke="#ea580c" strokeWidth="2.8" />
      </g>

      {/* 7. LENGAN DEPAN & SENJATA KUNTA WIJAYANDANU */}
      {isWar ? (
        <g>
          {/* Senjata Sakti Kunta Wijayandanu Berujung Trisula */}
          <line x1="-16" y1="98" x2="48" y2="30" stroke="#f97316" strokeWidth="3" />
          <polygon points="48,30 60,24 50,38" fill="#facc15" stroke="#ea580c" strokeWidth="1" />
          <g transform="translate(11, 46)">
            <g className={animated ? 'wayang-arm-combat-shld' : ''}>
              <path d="M0 0 Q18 -4 28 0" stroke="#1c120c" strokeWidth="5" strokeLinecap="round" fill="none" />
              <circle cx="28" cy="0" r="3.5" fill="#ea580c" />
              <TudhingStick x1="28" y1="0" x2="38" y2="165" />
            </g>
          </g>
        </g>
      ) : (
        <g transform="translate(11, 46)">
          <g className={animated ? 'wayang-arm-front-shld' : ''}>
            <circle cx="0" cy="0" r="3.2" fill="#ea580c" />
            <path d="M0 0 Q16 16 11 36" stroke="#1c120c" strokeWidth="4.8" strokeLinecap="round" fill="none" />
            <g transform="translate(11, 36)">
              <g className={animated ? 'wayang-arm-front-elbw' : ''}>
                <circle cx="0" cy="0" r="2.8" fill="#d4af37" />
                <path d="M0 0 Q-3 16 2 34" stroke="#1c120c" strokeWidth="4.2" strokeLinecap="round" fill="none" />
                <circle cx="2" cy="34" r="3.2" fill="#ea580c" />
                <TudhingStick x1="2" y1="34" x2="12" y2="182" />
              </g>
            </g>
          </g>
        </g>
      )}
    </g>
  );
}

/* =========================================================================
   4. RADEN WERKUDARA (BIMA) — KUKU PANCANAKA & GELUNG PUDAK SATEGAL
   ========================================================================= */
function AuthenticBima({ pose, accent, animated }) {
  const isWar = pose === 'perang';

  return (
    <g className="wayang-bima-authentic" transform="scale(1.1) translate(0, -10)">
      {/* 1. LENGAN BELAKANG */}
      <g transform="translate(-16, 50)">
        <g className={animated ? 'wayang-arm-back-shld' : ''}>
          <path d="M0 0 Q-16 18 -12 40" stroke="#14110e" strokeWidth="6" strokeLinecap="round" fill="none" />
          <g transform="translate(-12, 40)">
            <g className={animated ? 'wayang-arm-back-elbw' : ''}>
              <path d="M0 0 Q-5 18 3 38" stroke="#14110e" strokeWidth="5.2" strokeLinecap="round" fill="none" />
              {/* Kuku Pancanaka Belakang */}
              <path d="M3 38 Q10 44 8 50" stroke="#d4af37" strokeWidth="3" fill="none" strokeLinecap="round" />
              <TudhingStick x1="3" y1="38" x2="-8" y2="180" />
            </g>
          </g>
        </g>
      </g>

      {/* 2. GAPIT UTAMA TEBAL */}
      <MainGapit x={0} yStart={50} yEnd={265} stroke="#2b1a10" />

      {/* 3. TUBUH KEKAR PERKASA */}
      <path
        d="M-18 42 Q-26 84 -15 120 L16 120 Q28 84 18 42 Z"
        fill="#120e0a"
        stroke={accent}
        strokeWidth="2.2"
      />
      {/* Kalung Naga Praba di Leher */}
      <path d="M-10 46 Q0 60 10 46" stroke="#d4af37" strokeWidth="3" fill="none" />

      {/* 4. GELUNG PUDAK SATEGAL BESAR & PARAS WERKUDARA */}
      <g>
        <path d="M-12 12 C-10 -8, 16 -12, 22 10 C25 25, 8 32, -4 28 Z" fill="#120e0a" stroke={accent} strokeWidth="1.2" />
        {/* Hidung Bentar Besar & Kumis Lebat */}
        <path d="M14 14 L28 18 L16 24 Z" fill="#120e0a" stroke={accent} strokeWidth="1" />
        <path d="M12 24 Q20 28 26 23" stroke="#fcfaf2" strokeWidth="2.5" fill="none" />
        {/* Mata Thelengan Bulat Melotot */}
        <circle cx="10" cy="14" r="3.2" fill="#fcfaf2" />
        <circle cx="10" cy="14" r="2" fill="#120e0a" />
        <circle cx="10" cy="14" r="1" fill="#d4af37" />

        {/* Gelung Pudak Sategal Melengkung Tinggi */}
        <path
          d="M-8 6 C-24 -16, -14 -32, 2 -24 C14 -14, 5 2, -2 8"
          stroke={accent}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* 5. KAMPUH POLENG BANG BINTULU (Kotak-Kotak Hitam-Putih-Merah) */}
      <g>
        <path
          d="M-16 120 L-24 170 L-4 170 L0 140 L8 170 L24 170 L18 120 Z"
          fill="#1c1917"
          stroke={accent}
          strokeWidth="2"
        />
        {/* Motif Poleng */}
        <rect x="-12" y="125" width="8" height="8" fill="#fcfaf2" opacity="0.8" />
        <rect x="-4" y="125" width="8" height="8" fill="#b91c1c" opacity="0.8" />
        <rect x="4" y="125" width="8" height="8" fill="#fcfaf2" opacity="0.8" />
        <rect x="-8" y="135" width="8" height="8" fill="#b91c1c" opacity="0.8" />
        <rect x="0" y="135" width="8" height="8" fill="#fcfaf2" opacity="0.8" />

        {/* Kaki Kekar Berbinggel */}
        <rect x="-18" y="170" width="11" height="46" rx="3" fill="#120e0a" stroke="#8b4513" strokeWidth="1.2" />
        <rect x="8" y="170" width="11" height="46" rx="3" fill="#120e0a" stroke="#8b4513" strokeWidth="1.2" />
        <line x1="-20" y1="202" x2="-6" y2="202" stroke={accent} strokeWidth="3.5" />
        <line x1="7" y1="202" x2="21" y2="202" stroke={accent} strokeWidth="3.5" />
      </g>

      {/* 6. LENGAN DEPAN & KUKU PANCANAKA EMAS */}
      {isWar ? (
        <g>
          {/* Gada Rujakpala Raksasa */}
          <ellipse cx="-38" cy="75" rx="12" ry="30" fill="#2b1a10" stroke={accent} strokeWidth="2.5" />
          <line x1="-38" y1="105" x2="-38" y2="155" stroke="#d4af37" strokeWidth="4" />
          <g transform="translate(18, 50)">
            <g className={animated ? 'wayang-arm-combat-shld' : ''}>
              <path d="M0 0 Q25 -10 35 -24" stroke="#120e0a" strokeWidth="6.5" strokeLinecap="round" fill="none" />
              {/* Cakar Kuku Pancanaka Mengkilap */}
              <path d="M35 -24 Q48 -32 42 -40" stroke="#facc15" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </g>
          </g>
        </g>
      ) : (
        <g transform="translate(18, 50)">
          <g className={animated ? 'wayang-arm-front-shld' : ''}>
            <circle cx="0" cy="0" r="4" fill={accent} />
            <path d="M0 0 Q18 20 14 42" stroke="#120e0a" strokeWidth="6" strokeLinecap="round" fill="none" />
            <g transform="translate(14, 42)">
              <g className={animated ? 'wayang-arm-front-elbw' : ''}>
                <circle cx="0" cy="0" r="3.5" fill={accent} />
                <path d="M0 0 Q-4 18 3 38" stroke="#120e0a" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                {/* Kuku Pancanaka Melengkung Panjang Tajam */}
                <path d="M3 38 Q14 46 10 54" stroke="#facc15" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <TudhingStick x1="3" y1="38" x2="16" y2="185" />
              </g>
            </g>
          </g>
        </g>
      )}
    </g>
  );
}

/* =========================================================================
   5. KYAI LURAH SEMAR — BATARA ISMAYA (Pamong Luhur, Dewa Ngejawantah)
   ========================================================================= */
function AuthenticSemar({ animated }) {
  return (
    <g className="wayang-semar-authentic" transform="scale(0.95) translate(0, 15)">
      {/* 1. GAPIT UTAMA */}
      <MainGapit x={0} yStart={50} yEnd={260} stroke="#3e2723" />

      {/* 2. BADAN BULAT TAMBUN LAMBANG PERTIWI */}
      <ellipse cx="0" cy="100" rx="44" ry="40" fill="#14110e" stroke="#bfae9c" strokeWidth="2.2" />
      <circle cx="8" cy="95" r="5" fill="#d4af37" />

      {/* 3. KEPALA SEMAR & KUNCUNG PUTIH */}
      <g>
        <circle cx="6" cy="42" r="22" fill="#14110e" stroke="#bfae9c" strokeWidth="1.8" />
        {/* Jambul Kuncung Putih Khas di Dahi */}
        <path d="M16 22 Q32 12 28 28 Q22 32 18 30" fill="#fcfaf2" stroke="#d4af37" strokeWidth="1.5" />
        {/* Paras Menangis-Tersenyum */}
        <path d="M12 42 Q18 46 22 42" stroke="#fcfaf2" strokeWidth="2.2" fill="none" />
        <path d="M14 52 Q20 58 26 50" stroke="#fcfaf2" strokeWidth="2.2" fill="none" />
      </g>

      {/* 4. SARONG KAMPUH POLENG SEMAR */}
      <path
        d="M-36 125 Q0 148 36 125 L26 172 L-26 172 Z"
        fill="#261c14"
        stroke="#bfae9c"
        strokeWidth="1.8"
      />
      <rect x="-20" y="172" width="13" height="25" rx="4" fill="#14110e" stroke="#8b4513" strokeWidth="1" />
      <rect x="7" y="172" width="13" height="25" rx="4" fill="#14110e" stroke="#8b4513" strokeWidth="1" />

      {/* 5. TANGAN MENUNJUK PITUTUR LUHUR (Articulated Rigging) */}
      <g transform="translate(22, 78)">
        <g className={animated ? 'wayang-arm-front-shld' : ''}>
          <path d="M0 0 Q22 -2 36 -6" stroke="#14110e" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          <g transform="translate(36, -6)">
            <g className={animated ? 'wayang-arm-front-elbw' : ''}>
              {/* Jari Telunjuk Menuding Nasihat Luhur */}
              <line x1="0" y1="0" x2="16" y2="-2" stroke="#d4af37" strokeWidth="3" strokeLinecap="round" />
              <TudhingStick x1="0" y1="0" x2="12" y2="155" />
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

/* =========================================================================
   6. PRABU RAHWANA (DASAMUKA) — RAJA RAKSASA ANGKARA MURKA
   ========================================================================= */
function AuthenticRahwana({ pose, accent, animated }) {
  const isWar = pose === 'perang';

  return (
    <g className="wayang-rahwana-authentic" transform="scale(1.15) translate(0, -15)">
      {/* 1. LENGAN BELAKANG */}
      <g transform="translate(-18, 52)">
        <g className={animated ? 'wayang-arm-back-shld' : ''}>
          <path d="M0 0 Q-16 18 -12 40" stroke="#170c0c" strokeWidth="6.5" strokeLinecap="round" fill="none" />
          <g transform="translate(-12, 40)">
            <g className={animated ? 'wayang-arm-back-elbw' : ''}>
              <path d="M0 0 Q-5 18 3 38" stroke="#170c0c" strokeWidth="5.8" strokeLinecap="round" fill="none" />
              <circle cx="3" cy="38" r="4" fill="#991b1b" />
              <TudhingStick x1="3" y1="38" x2="-8" y2="185" />
            </g>
          </g>
        </g>
      </g>

      {/* 2. PRABA GENI BARA API ANGKARA */}
      <g>
        <path
          d="M-10 30 C-46 10, -75 52, -52 100 C-36 128, -10 118, -8 100 Z"
          fill="#3b0a0a"
          stroke="#991b1b"
          strokeWidth="2.2"
        />
        <path
          d="M-14 38 C-40 22, -62 58, -44 92 C-30 112, -12 106, -10 92 Z"
          fill="#5a1010"
          stroke="#d4af37"
          strokeWidth="1"
          strokeDasharray="4 2"
        />
      </g>

      {/* 3. GAPIT UTAMA */}
      <MainGapit x={0} yStart={55} yEnd={270} stroke="#3e1a10" />

      {/* 4. BADAN RAKSASA MERAH TUA */}
      <path
        d="M-20 42 Q-28 86 -16 124 L18 124 Q28 86 20 42 Z"
        fill="#1a0c0c"
        stroke="#991b1b"
        strokeWidth="2.2"
      />

      {/* 5. KEPALA DASAMUKA & SIYUNG TARING MENYERINGAI */}
      <g>
        <path d="M-15 12 C-10 -12, 22 -10, 24 16 C26 32, 10 38, -6 32 Z" fill="#1a0c0c" stroke="#991b1b" strokeWidth="1.2" />
        {/* Taring Siyung Raksasa */}
        <polygon points="12,28 18,36 22,28" fill="#fcfaf2" stroke="#991b1b" strokeWidth="0.8" />
        <path d="M8 20 L28 20 L16 26 Z" fill="#1a0c0c" stroke="#991b1b" strokeWidth="1" />
        {/* Mahkota Berduri Raksasa Alengka */}
        <polygon points="-8,6 -4,-22 6,-8 14,-26 18,8" fill="#5a1010" stroke="#d4af37" strokeWidth="1.8" />
        {/* Mata Thelengan Membelalak Merah */}
        <circle cx="12" cy="14" r="3.5" fill="#b91c1c" />
        <circle cx="12" cy="14" r="1.8" fill="#fcfaf2" />
      </g>

      {/* 6. DODOT RAKSASA & BINGGEL */}
      <g>
        <path
          d="M-18 124 L-26 175 L-4 175 L0 145 L8 175 L26 175 L18 124 Z"
          fill="#2b0f0f"
          stroke="#991b1b"
          strokeWidth="2"
        />
        <rect x="-18" y="175" width="12" height="42" rx="3" fill="#1a0c0c" stroke="#8b4513" strokeWidth="1.2" />
        <rect x="8" y="175" width="12" height="42" rx="3" fill="#1a0c0c" stroke="#8b4513" strokeWidth="1.2" />
        <line x1="-20" y1="205" x2="-6" y2="205" stroke="#991b1b" strokeWidth="3.5" />
        <line x1="7" y1="205" x2="21" y2="205" stroke="#991b1b" strokeWidth="3.5" />
      </g>

      {/* 7. LENGAN DEPAN & PEDANG CANDRASA */}
      {isWar ? (
        <g>
          <g transform="translate(18, 52)">
            <g className={animated ? 'wayang-arm-combat-shld' : ''}>
              <path d="M0 0 Q25 -10 32 -26" stroke="#1a0c0c" strokeWidth="6.5" strokeLinecap="round" fill="none" />
              {/* Pedang Lengkung Candrasa Berpamor */}
              <path d="M32 -26 Q60 -45 52 -60" stroke="#e2e8f0" strokeWidth="4" fill="none" strokeLinecap="round" />
              <circle cx="32" cy="-26" r="4" fill="#d4af37" />
              <TudhingStick x1="32" y1="-26" x2="42" y2="160" />
            </g>
          </g>
        </g>
      ) : (
        <g transform="translate(18, 52)">
          <g className={animated ? 'wayang-arm-front-shld' : ''}>
            <circle cx="0" cy="0" r="4" fill="#991b1b" />
            <path d="M0 0 Q18 20 14 44" stroke="#1a0c0c" strokeWidth="6" strokeLinecap="round" fill="none" />
            <g transform="translate(14, 44)">
              <g className={animated ? 'wayang-arm-front-elbw' : ''}>
                <circle cx="0" cy="0" r="3.5" fill="#d4af37" />
                <path d="M0 0 Q-4 18 3 38" stroke="#1a0c0c" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                <circle cx="3" cy="38" r="4" fill="#991b1b" />
                <TudhingStick x1="3" y1="38" x2="16" y2="188" />
              </g>
            </g>
          </g>
        </g>
      )}
    </g>
  );
}

/* =========================================================================
   7. DEWI SHINTA — PUTRI MANTILI (Putri Luruh Halus, Setia & Suci)
   ========================================================================= */
function AuthenticShinta({ pose, animated }) {
  const isSembah = pose === 'sembah';
  const isSedih = pose === 'sedih';

  return (
    <g className="wayang-shinta-authentic" transform="scale(0.92) translate(0, 10)">
      {/* 1. LENGAN BELAKANG */}
      <g transform="translate(-8, 52)">
        <g className={animated ? 'wayang-arm-back-shld' : ''}>
          <path d="M0 0 Q-12 18 -8 40" stroke="#24180e" strokeWidth="4.2" strokeLinecap="round" fill="none" />
          <g transform="translate(-8, 40)">
            <g className={animated ? 'wayang-arm-back-elbw' : ''}>
              <path d="M0 0 Q-4 16 3 34" stroke="#24180e" strokeWidth="3.6" strokeLinecap="round" fill="none" />
              <circle cx="3" cy="34" r="3" fill="#d4af37" />
              <TudhingStick x1="3" y1="34" x2="-8" y2="185" />
            </g>
          </g>
        </g>
      </g>

      {/* 2. SAMPUR KENCANA / SELENDANG PUTRI */}
      <g opacity="0.9">
        <path
          d="M-10 65 Q-28 100 -24 160 Q-22 210 -12 250"
          stroke="#d4af37"
          strokeWidth="3.2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M-8 75 Q-22 110 -18 165 Q-16 205 -8 245"
          stroke="#b45309"
          strokeWidth="1.2"
          fill="none"
        />
      </g>

      {/* 3. GAPIT UTAMA PENOPANG PUTRI */}
      <MainGapit x={0} yStart={45} yEnd={265} stroke="#3e2723" />

      {/* 4. DODOT KEMBEN BATIK SOGA PRADA & SAMPARAN */}
      <g>
        {/* Badan Ramping Putri Kuning Langsat */}
        <path
          d="M-10 42 Q-14 80 -10 115 L12 115 Q16 80 12 42 Z"
          fill="#1c120c"
          stroke="#d4af37"
          strokeWidth="1.8"
        />
        {/* Kemben Prada Emas */}
        <path
          d="M-10 55 Q0 62 12 55 L11 88 Q0 96 -9 88 Z"
          fill="#3d2314"
          stroke="#e8bb5c"
          strokeWidth="1.4"
        />
        {/* Kain Dodot Parang Klithik Samparan Panjang */}
        <path
          d="M-12 115 Q-16 160 -18 215 Q-12 245 4 250 Q16 245 16 215 Q18 160 14 115 Z"
          fill="#2a160c"
          stroke="#d4af37"
          strokeWidth="1.8"
        />
        {/* Motif Garis Prada Dodot */}
        <path d="M-10 135 L12 150 M-12 165 L10 180 M-14 195 L8 210 M-16 225 L6 240" stroke="#c59b27" strokeWidth="1.2" strokeDasharray="3 2" />
      </g>

      {/* 5. KEPALA PUTRI LURUH, CUNDUK MENTUL & JAMANG KENCANA */}
      <g transform={isSedih ? 'rotate(5, 0, 20)' : ''}>
        {/* Profil Muka Halus & Mata Jaitan Luruh */}
        <path
          d="M-8 12 Q-4 -8 14 -4 Q20 12 14 26 Q4 32 -6 24 Z"
          fill="#1c120c"
          stroke="#d4af37"
          strokeWidth="1.2"
        />
        {/* Gelung Putri Kencana */}
        <path
          d="M-12 6 C-18 -10, -6 -24, 6 -18 C-2 -14, -6 0, -8 10 Z"
          fill="#1a1008"
          stroke="#d4af37"
          strokeWidth="1.6"
        />
        {/* Cunduk Mentul Emas Bergoyang di Atas Gelung */}
        <line x1="2" y1="-18" x2="6" y2="-32" stroke="#d4af37" strokeWidth="1.5" />
        <circle cx="6" cy="-32" r="3.2" fill="#facc15" stroke="#92400e" strokeWidth="0.8" />
        <line x1="-4" y1="-16" x2="-8" y2="-28" stroke="#d4af37" strokeWidth="1.5" />
        <circle cx="-8" cy="-28" r="2.8" fill="#facc15" stroke="#92400e" strokeWidth="0.8" />
        {/* Jamang Putri & Sumping Surengpati */}
        <path d="M2 -6 Q12 -2 14 10" stroke="#facc15" strokeWidth="1.8" fill="none" />
        <circle cx="2" cy="14" r="2.5" fill="#facc15" />
      </g>

      {/* 6. LENGAN DEPAN PUTRI & TUDHING */}
      {isSembah ? (
        <g transform="translate(10, 48)">
          <path d="M0 0 Q14 12 18 -10" stroke="#24180e" strokeWidth="4.2" strokeLinecap="round" fill="none" />
          <circle cx="18" cy="-10" r="3.2" fill="#d4af37" />
          <TudhingStick x1="18" y1="-10" x2="22" y2="170" />
        </g>
      ) : (
        <g transform="translate(10, 48)">
          <g className={animated ? 'wayang-arm-front-shld' : ''}>
            <circle cx="0" cy="0" r="3" fill="#d4af37" />
            <path d="M0 0 Q14 18 10 38" stroke="#24180e" strokeWidth="4.2" strokeLinecap="round" fill="none" />
            <g transform="translate(10, 38)">
              <g className={animated ? 'wayang-arm-front-elbw' : ''}>
                <circle cx="0" cy="0" r="2.5" fill="#facc15" />
                <path d="M0 0 Q-3 16 3 32" stroke="#24180e" strokeWidth="3.8" strokeLinecap="round" fill="none" />
                <circle cx="3" cy="32" r="3" fill="#d4af37" />
                <TudhingStick x1="3" y1="32" x2="12" y2="185" />
              </g>
            </g>
          </g>
        </g>
      )}
    </g>
  );
}
