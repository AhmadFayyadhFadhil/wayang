import React from 'react';

/**
 * Komponen Siluet Vektor Wayang Kulit Otentik Berbasis SVG
 * Rendisi tajam, scalable, dengan variasi pose dan arah hadap
 */
export default function WayangFigureSvg({
  slug = 'gatotkaca',
  pose = 'default',
  facing = 'right',
  scale = 1,
  isSelected = false,
  accentColor = '#f59e0b',
  width = 160,
  height = 240,
}) {
  const isFlipped = facing === 'left';

  // Transformasi orientasi dan scaling
  const transform = `scale(${isFlipped ? -scale : scale}, ${scale})`;

  return (
    <svg
      viewBox="-100 -20 200 280"
      width={width * scale}
      height={height * scale}
      style={{
        overflow: 'visible',
        filter: isSelected
          ? `drop-shadow(0 0 12px ${accentColor}) drop-shadow(0 0 24px rgba(245, 158, 11, 0.4))`
          : 'drop-shadow(0 6px 10px rgba(0,0,0,0.45))',
        transition: 'filter 0.2s ease, transform 0.15s ease',
        cursor: 'grab',
      }}
    >
      <g transform={transform}>
        {/* Tangkai Gapit & Tudhing Wayang (Tongkat Penggerak) */}
        <line
          x1="0"
          y1="80"
          x2="0"
          y2="260"
          stroke="#5c3a21"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <line
          x1={isFlipped ? '-25' : '25'}
          y1="120"
          x2={isFlipped ? '-45' : '45'}
          y2="220"
          stroke="#451a03"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 2"
        />

        {/* Gambar Wayang sesuai Slug Karakter */}
        {renderCharacterSilhouettes(slug, pose, accentColor)}
      </g>
    </svg>
  );
}

function renderCharacterSilhouettes(slug, pose, accent) {
  switch (slug) {
    case 'gatotkaca':
      return <GatotkacaSvg pose={pose} accent={accent} />;
    case 'arjuna':
      return <ArjunaSvg pose={pose} accent={accent} />;
    case 'karna':
      return <KarnaSvg pose={pose} accent={accent} />;
    case 'bima':
      return <BimaSvg pose={pose} accent={accent} />;
    case 'semar':
      return <SemarSvg pose={pose} accent={accent} />;
    case 'rahwana':
      return <RahwanaSvg pose={pose} accent={accent} />;
    default:
      return <GatotkacaSvg pose={pose} accent={accent} />;
  }
}

/* ==================== 1. GATOTKACA ==================== */
function GatotkacaSvg({ pose, accent }) {
  const isFlying = pose === 'terbang';
  const isWar = pose === 'perang';
  const isSembah = pose === 'sembah';

  return (
    <g className="wayang-gatotkaca">
      {/* Praba / Sayap Kotang Antakusuma */}
      <path
        d="M-5 40 C-35 25, -65 55, -50 95 C-40 120, -10 110, -5 95 Z"
        fill="#1e1b18"
        stroke={accent}
        strokeWidth="1.5"
      />
      <path
        d="M-10 50 C-30 45, -50 70, -40 90"
        stroke="#d97706"
        strokeWidth="1"
        fill="none"
      />

      {/* Badan & Kotang Antakusuma Bintang Emas */}
      <path
        d="M-15 45 Q-20 85 -10 115 L12 115 Q22 85 15 45 Z"
        fill="#181512"
        stroke="#78350f"
        strokeWidth="1.5"
      />
      {/* Lambang Bintang di Dada */}
      <polygon
        points="0,68 4,76 12,76 6,82 8,90 0,85 -8,90 -6,82 -12,76 -4,76"
        fill={accent}
      />

      {/* Kepala & Makuta Jamang Basunanda */}
      <g transform={isFlying ? 'rotate(-10 0 25)' : ''}>
        <path
          d="M-12 15 C-10 -5, 15 -10, 20 10 C22 25, 5 35, -5 32 Z"
          fill="#1c1917"
        />
        {/* Hidung Gagah & Kumis */}
        <path d="M12 18 L24 22 L14 26 Z" fill="#1c1917" />
        <path d="M10 25 Q16 28 20 25" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
        {/* Mahkota / Jamang Belakang Menjulang */}
        <path
          d="M-8 8 C-18 -15, 0 -22, 10 -15 C18 -8, 12 5, 5 8 Z"
          fill="#27272a"
          stroke={accent}
          strokeWidth="1.5"
        />
        <circle cx="8" cy="18" r="1.8" fill={accent} />
      </g>

      {/* Celana Cinde Kembang & Dodot Poleng */}
      <path
        d="M-12 115 L-18 165 L-2 165 L-2 135 L5 135 L5 165 L18 165 L14 115 Z"
        fill="#292524"
        stroke="#b45309"
        strokeWidth="1.5"
      />
      {/* Kaki Kanan & Kiri Bergelang Binggel */}
      <rect x="-14" y="165" width="8" height="42" rx="3" fill="#1c1917" />
      <rect x="7" y="165" width="8" height="42" rx="3" fill="#1c1917" />
      {/* Gelang Kaki Emas */}
      <line x1="-15" y1="195" x2="-5" y2="195" stroke={accent} strokeWidth="2.5" />
      <line x1="6" y1="195" x2="16" y2="195" stroke={accent} strokeWidth="2.5" />

      {/* Lengan & Posisi Pose */}
      {isWar ? (
        // Pose Perang: Tangan mengepal terangkat
        <g>
          <path d="M15 55 Q35 45 42 30" stroke="#1c1917" strokeWidth="6" strokeLinecap="round" fill="none" />
          <circle cx="44" cy="28" r="6" fill={accent} />
          <path d="M-15 55 Q-30 65 -35 85" stroke="#1c1917" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>
      ) : isSembah ? (
        // Pose Sembah: Tangan terkatup di depan dada
        <g>
          <path d="M12 55 Q25 65 18 75" stroke="#1c1917" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M-10 55 Q5 65 15 75" stroke="#1c1917" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="17" cy="74" r="5" fill={accent} />
        </g>
      ) : isFlying ? (
        // Pose Terbang: Meluncur ke depan
        <g>
          <path d="M15 55 Q40 50 60 48" stroke="#1c1917" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          <path d="M-12 55 Q-30 75 -45 95" stroke="#1c1917" strokeWidth="5.5" strokeLinecap="round" fill="none" />
        </g>
      ) : (
        // Pose Default: Tangan menjuntai dengan kelat bahu
        <g>
          <path d="M15 55 Q28 85 22 110" stroke="#1c1917" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="15" cy="55" r="4.5" fill={accent} />
          <path d="M-12 55 Q-25 80 -18 105" stroke="#1c1917" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="-12" cy="55" r="4.5" fill={accent} />
        </g>
      )}
    </g>
  );
}

/* ==================== 2. ARJUNA ==================== */
function ArjunaSvg({ pose, accent }) {
  const isBow = pose === 'perang' || pose === 'memanah';
  const isSembah = pose === 'sembah';

  return (
    <g className="wayang-arjuna">
      {/* Tubuh Ramping Anggun Alus */}
      <path
        d="M-8 42 Q-12 75 -6 108 L8 108 Q14 75 8 42 Z"
        fill="#1e1e1e"
        stroke="#0284c7"
        strokeWidth="1.2"
      />
      {/* Kalung Bulan Sabit & Selendang */}
      <path d="M-4 50 Q0 60 6 50" stroke={accent} strokeWidth="2" fill="none" />

      {/* Kepala Menunduk Alus & Gelung Supit Urang */}
      <g>
        <path d="M-6 16 C-4 2, 12 -2, 16 12 C18 24, 6 30, -2 28 Z" fill="#18181b" />
        {/* Hidung Lancip Alus */}
        <path d="M10 16 L20 18 L12 22 Z" fill="#18181b" />
        <circle cx="7" cy="14" r="1.3" fill={accent} />
        {/* Gelung Supit Urang Melengkung Anggun */}
        <path
          d="M-4 10 C-14 -5, -8 -18, 5 -12 C12 -6, 2 5, -2 8"
          stroke={accent}
          strokeWidth="2.5"
          fill="none"
        />
      </g>

      {/* Kain Jarik Alus */}
      <path
        d="M-8 108 L-12 165 L-2 165 L0 135 L4 165 L12 165 L9 108 Z"
        fill="#262626"
        stroke="#38bdf8"
        strokeWidth="1.2"
      />
      <rect x="-9" y="165" width="6" height="40" rx="2" fill="#18181b" />
      <rect x="5" y="165" width="6" height="40" rx="2" fill="#18181b" />

      {/* Gandewa / Busur Panah Pasopati jika pose panah */}
      {isBow ? (
        <g>
          {/* Busur Lengkung Emas */}
          <path d="M22 0 Q45 55 25 110" stroke="#facc15" strokeWidth="2.5" fill="none" />
          <line x1="22" y1="0" x2="25" y2="110" stroke="#94a3b8" strokeWidth="0.8" />
          {/* Tangan menarik tali busur */}
          <path d="M8 50 L28 48 L-5 52" stroke="#18181b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <line x1="-10" y1="52" x2="35" y2="48" stroke="#38bdf8" strokeWidth="1.8" />
        </g>
      ) : isSembah ? (
        <g>
          <path d="M6 50 Q18 58 12 68" stroke="#18181b" strokeWidth="4.5" fill="none" />
          <path d="M-6 50 Q4 58 10 68" stroke="#18181b" strokeWidth="4.5" fill="none" />
          <circle cx="11" cy="67" r="4" fill={accent} />
        </g>
      ) : (
        <g>
          <path d="M9 48 Q20 75 16 100" stroke="#18181b" strokeWidth="4.5" fill="none" />
          <path d="M-8 48 Q-18 72 -14 96" stroke="#18181b" strokeWidth="4.5" fill="none" />
        </g>
      )}
    </g>
  );
}

/* ==================== 3. ADIPATI KARNA ==================== */
function KarnaSvg({ pose }) {
  const isWar = pose === 'perang' || pose === 'memanah';

  return (
    <g className="wayang-karna">
      {/* Praba Megah Adipati */}
      <path
        d="M-5 35 C-30 20, -55 45, -42 85 C-32 108, -8 100, -5 85 Z"
        fill="#261b15"
        stroke="#ea580c"
        strokeWidth="1.5"
      />
      {/* Badan Berbaju Emas Mentari (Putra Batara Surya) */}
      <path
        d="M-10 42 Q-14 78 -8 110 L10 110 Q16 78 10 42 Z"
        fill="#1c1917"
        stroke="#f97316"
        strokeWidth="1.5"
      />
      {/* Surya Mandala di Dada */}
      <circle cx="1" cy="65" r="7" fill="#fb923c" />
      <circle cx="1" cy="65" r="4" fill="#fed7aa" />

      {/* Mahkota Makuta Emas Berkilau */}
      <g>
        <path d="M-8 16 C-4 0, 14 0, 18 14 C20 25, 8 30, 0 28 Z" fill="#1c1917" />
        <path d="M12 18 L24 20 L15 24 Z" fill="#1c1917" />
        <path
          d="M-5 10 L-2 -18 L8 -12 L12 12 Z"
          fill="#431407"
          stroke="#ea580c"
          strokeWidth="1.8"
        />
        <circle cx="8" cy="16" r="1.5" fill="#fed7aa" />
      </g>

      {/* Dodot & Celana Satria */}
      <path
        d="M-9 110 L-15 165 L-3 165 L0 135 L5 165 L15 165 L11 110 Z"
        fill="#292524"
        stroke="#c2410c"
        strokeWidth="1.5"
      />
      <rect x="-11" y="165" width="7" height="42" rx="2" fill="#1c1917" />
      <rect x="6" y="165" width="7" height="42" rx="2" fill="#1c1917" />

      {/* Senjata Kunta Wijayandanu / Panah */}
      {isWar ? (
        <g>
          <line x1="-15" y1="95" x2="45" y2="35" stroke="#f97316" strokeWidth="2.5" />
          <polygon points="45,35 55,30 46,42" fill="#facc15" />
          <path d="M10 50 Q28 42 38 45" stroke="#1c1917" strokeWidth="5" fill="none" />
        </g>
      ) : (
        <g>
          <path d="M10 50 Q24 75 18 102" stroke="#1c1917" strokeWidth="5" fill="none" />
          <path d="M-8 50 Q-22 75 -16 102" stroke="#1c1917" strokeWidth="5" fill="none" />
        </g>
      )}
    </g>
  );
}

/* ==================== 4. BIMA (WERKUDARA) ==================== */
function BimaSvg({ pose }) {
  const isWar = pose === 'perang';

  return (
    <g className="wayang-bima" transform="scale(1.1) translate(0, -10)">
      {/* Tubuh Kekar Raksasa Pandawa */}
      <path
        d="M-18 40 Q-26 85 -14 120 L16 120 Q28 85 18 40 Z"
        fill="#18181b"
        stroke="#7c3aed"
        strokeWidth="2"
      />
      {/* Gelung Pudak Sategal Khas Bima */}
      <g>
        <path d="M-12 12 C-10 -8, 16 -12, 22 10 C25 25, 8 32, -4 28 Z" fill="#18181b" />
        {/* Hidung Besar & Mata Thelengan */}
        <path d="M12 14 L28 17 L16 23 Z" fill="#18181b" />
        <circle cx="10" cy="14" r="2.4" fill="#a855f7" />
        {/* Rambut Belakang Melengkung Menjulang */}
        <path
          d="M-8 5 C-22 -15, -12 -30, 2 -22 C14 -12, 5 2, -2 8"
          stroke="#c084fc"
          strokeWidth="3.5"
          fill="none"
        />
      </g>

      {/* Kain Kampuh Poleng Merah Hitam Putih Kotak-kotak */}
      <path
        d="M-15 120 L-22 170 L-4 170 L0 140 L8 170 L22 170 L17 120 Z"
        fill="#27272a"
        stroke="#e4e4e7"
        strokeWidth="1.5"
      />
      {/* Motif Poleng */}
      <rect x="-10" y="125" width="8" height="8" fill="#fafafa" opacity="0.3" />
      <rect x="2" y="135" width="8" height="8" fill="#fafafa" opacity="0.3" />

      {/* Kaki Kokoh Besar */}
      <rect x="-16" y="170" width="10" height="46" rx="3" fill="#18181b" />
      <rect x="8" y="170" width="10" height="46" rx="3" fill="#18181b" />

      {/* Kuku Pancanaka Tajam Panjang Melengkung di Ibu Jari */}
      {isWar ? (
        <g>
          <path d="M18 50 Q45 42 40 18" stroke="#18181b" strokeWidth="6.5" fill="none" />
          {/* Cakar Kuku Pancanaka */}
          <path d="M40 18 Q55 10 46 0" stroke="#facc15" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Gada Rujakpala */}
          <ellipse cx="-35" cy="80" rx="10" ry="25" fill="#4c1d95" stroke="#a855f7" strokeWidth="2" />
        </g>
      ) : (
        <g>
          <path d="M18 50 Q32 85 24 112" stroke="#18181b" strokeWidth="6" fill="none" />
          {/* Kuku Pancanaka menjulur */}
          <path d="M24 112 Q32 120 28 128" stroke="#facc15" strokeWidth="2.5" fill="none" />
          <path d="M-16 50 Q-30 85 -22 112" stroke="#18181b" strokeWidth="6" fill="none" />
        </g>
      )}
    </g>
  );
}

/* ==================== 5. SEMAR ==================== */
function SemarSvg() {
  return (
    <g className="wayang-semar" transform="scale(0.9) translate(0, 20)">
      {/* Badan Bulat Tambun Lambang Bumi Pertiwi */}
      <ellipse cx="0" cy="100" rx="42" ry="38" fill="#18181b" stroke="#10b981" strokeWidth="2" />
      {/* Pusar Semar Besar */}
      <circle cx="8" cy="95" r="4.5" fill="#10b981" />

      {/* Kepala Menangis & Tersenyum, Kuncung Rambut Putih di Dahi */}
      <g>
        <circle cx="5" cy="42" r="22" fill="#18181b" stroke="#10b981" strokeWidth="1.5" />
        {/* Kuncung Semar */}
        <path d="M15 24 Q30 14 26 28 Q20 32 16 30" fill="#f8fafc" stroke="#10b981" strokeWidth="1.2" />
        {/* Mata Sipit Senyum */}
        <path d="M10 42 Q16 46 20 42" stroke="#f8fafc" strokeWidth="2" fill="none" />
        {/* Bibir Senyum */}
        <path d="M12 52 Q18 58 24 50" stroke="#f8fafc" strokeWidth="2" fill="none" />
      </g>

      {/* Kain Sarong Kampuh Poleng Semar */}
      <path
        d="M-35 125 Q0 145 35 125 L25 170 L-25 170 Z"
        fill="#262626"
        stroke="#10b981"
        strokeWidth="1.5"
      />
      <rect x="-18" y="170" width="12" height="24" rx="4" fill="#18181b" />
      <rect x="6" y="170" width="12" height="24" rx="4" fill="#18181b" />

      {/* Jari Tangan Menunjuk Nasihat (Jari Telunjuk Khas Semar) */}
      <path d="M22 80 Q45 82 55 72" stroke="#18181b" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <line x1="55" y1="72" x2="65" y2="70" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

/* ==================== 6. RAHWANA (DASAMUKA) ==================== */
function RahwanaSvg({ pose }) {
  const isWar = pose === 'perang';

  return (
    <g className="wayang-rahwana" transform="scale(1.15) translate(0, -15)">
      {/* Praba Api Raksasa Angkara Murka */}
      <path
        d="M-10 30 C-45 10, -70 50, -50 98 C-35 125, -10 115, -8 98 Z"
        fill="#450a0a"
        stroke="#ef4444"
        strokeWidth="2"
      />

      {/* Badan Raksasa Merah Gelap */}
      <path
        d="M-20 40 Q-28 85 -16 122 L18 122 Q28 85 20 40 Z"
        fill="#1c1917"
        stroke="#dc2626"
        strokeWidth="2"
      />

      {/* Kepala Dasamuka (Taring & Mahkota Raksasa) */}
      <g>
        <path d="M-15 12 C-10 -12, 22 -10, 24 16 C26 32, 10 38, -6 32 Z" fill="#1c1917" />
        {/* Taring Raksasa Menyeringai */}
        <path d="M12 28 L18 36 L22 28 Z" fill="#fef2f2" />
        <path d="M8 20 L28 20 L16 26 Z" fill="#1c1917" />
        {/* Mahkota Berduri Tajam */}
        <polygon points="-8,6 -4,-22 6,-8 14,-26 18,8" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" />
        {/* Mata Membelalak Merah */}
        <circle cx="12" cy="14" r="3.2" fill="#ef4444" />
      </g>

      {/* Dodot Raksasa Alengka */}
      <path
        d="M-18 122 L-26 175 L-4 175 L0 145 L8 175 L25 175 L18 122 Z"
        fill="#292524"
        stroke="#991b1b"
        strokeWidth="1.8"
      />
      <rect x="-18" y="175" width="12" height="42" rx="3" fill="#1c1917" />
      <rect x="8" y="175" width="12" height="42" rx="3" fill="#1c1917" />

      {/* Senjata Pedang Candrasa jika perang */}
      {isWar ? (
        <g>
          <path d="M18 55 Q48 45 42 12" stroke="#1c1917" strokeWidth="6.5" fill="none" />
          {/* Pedang Lengkung Candrasa */}
          <path d="M42 12 Q75 -5 65 -25" stroke="#e2e8f0" strokeWidth="3.5" fill="none" />
          <path d="M-18 55 Q-45 65 -35 95" stroke="#1c1917" strokeWidth="6" fill="none" />
        </g>
      ) : (
        <g>
          <path d="M18 55 Q35 85 28 115" stroke="#1c1917" strokeWidth="6" fill="none" />
          <path d="M-18 55 Q-35 85 -28 115" stroke="#1c1917" strokeWidth="6" fill="none" />
        </g>
      )}
    </g>
  );
}
