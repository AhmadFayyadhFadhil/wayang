import React, { useState, useEffect, useRef } from 'react';

/**
 * WayangDuelShadowBg
 * -------------------------------------------------------------
 * Latar belakang siluet pertarungan wayang (Perang Tanding Kelir)
 * khusus untuk seksi "Tokoh & Karakter Wayang" pada Story Atlas.
 * - Menggunakan siluet wayang kulit solid otentik (bukan garis stik/lidi)
 *   menampilkan anatomi ksatria gagah lengkap dengan makuta kencana,
 *   sayap Antakusuma, busur Gandewa, dan kain dodot perang.
 * - Sensor scroll otomatis (IntersectionObserver): Siluet meluncur masuk
 *   saat seksi terlihat di viewport dan mundur memudar saat di-scroll keluar.
 * - Pendar cahaya lampu minyak Blencong hangat temaram di tengah.
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

      {/* Siluet Ksatria Kiri: Raden Gatotkaca (Pose Tempur Udara Menghadap Kanan) */}
      <div
        className={`wayang-duel-figure wayang-duel-left ${
          isInView ? 'is-in-view' : 'is-out-view'
        }`}
      >
        <GatotkacaSolidSilhouette />
      </div>

      {/* Siluet Ksatria Kanan: Adipati Karna (Pose Memanah & Tombak Menghadap Kiri) */}
      <div
        className={`wayang-duel-figure wayang-duel-right ${
          isInView ? 'is-in-view' : 'is-out-view'
        }`}
      >
        <KarnaSolidSilhouette />
      </div>
    </div>
  );
}

/**
 * Siluet Solid Raden Gatotkaca
 * Dilengkapi Sayap Praba Antakusuma Megah, Makuta Jamang, & Sikap Tempur
 * Bebas dari garis tiang gapit/stik agar tidak tampak seperti stickman.
 */
function GatotkacaSolidSilhouette() {
  return (
    <svg
      viewBox="0 0 320 440"
      width="300"
      height="410"
      className="wayang-duel-svg-canvas"
      style={{ overflow: 'visible' }}
    >
      <g fill="#1a120c">
        {/* Sayap Praba Antakusuma Megah di Punggung */}
        <path d="M125 150 C70 95, 20 120, 15 170 C10 220, 45 250, 75 270 C45 240, 40 190, 60 160 C75 140, 100 145, 120 165 Z" />
        <path d="M110 135 C65 60, 15 80, 25 135 C35 185, 75 220, 105 240 C75 205, 50 160, 65 125 C80 95, 105 110, 115 145 Z" />
        <path d="M130 115 C95 35, 45 45, 45 95 C45 145, 95 190, 125 210 C95 165, 70 120, 85 85 C100 55, 120 75, 130 120 Z" />

        {/* Mahkota Makuta & Paras Gagah Mbangir */}
        <path d="M145 75 C140 45, 155 20, 175 10 C180 28, 175 48, 165 65 Z" />
        <path d="M150 40 C165 25, 185 20, 195 35 C185 45, 170 50, 155 52 Z" />
        {/* Wajah & Hidung Mbangir */}
        <path d="M150 68 C155 60, 170 60, 180 72 C195 76, 215 82, 210 92 C198 94, 185 96, 178 108 C168 116, 152 114, 146 102 Z" />
        {/* Sumping & Garuda Mungkur di Belakang Leher */}
        <path d="M142 82 C125 78, 115 90, 120 105 C128 112, 138 108, 142 98 Z" />

        {/* Dada Bidang, Leher, & Perut Ksatria */}
        <path d="M152 105 C162 118, 185 125, 188 148 C190 172, 178 195, 168 215 C155 218, 145 208, 142 192 C138 165, 140 135, 148 108 Z" />

        {/* Lengan Depan Terangkat Siap Tempur (Aji Brajamusti) */}
        <path d="M182 135 C205 130, 235 125, 252 140 C262 148, 268 165, 262 178 C252 170, 245 155, 230 152 C210 148, 195 152, 182 155 Z" />
        <path d="M255 142 C275 140, 295 145, 305 160 C302 175, 288 185, 275 182 C272 172, 265 165, 252 165 Z" />
        {/* Kepalan Tangan Brajamusti */}
        <circle cx="295" cy="165" r="14" />

        {/* Lengan Belakang Siap Menerjang */}
        <path d="M140 148 C118 155, 102 170, 95 192 C105 200, 118 198, 125 185 C132 172, 138 162, 145 158 Z" />
        <path d="M98 190 C85 210, 78 235, 82 255 C92 255, 102 245, 105 230 C108 215, 110 200, 105 190 Z" />
        <circle cx="82" cy="252" r="11" />

        {/* Kain Dodot Kampuh Ksatria Berombak Megah */}
        <path d="M152 210 C175 220, 205 240, 215 270 C222 295, 210 325, 192 345 C185 330, 188 310, 180 295 C172 280, 155 265, 148 245 C145 230, 148 218, 152 210 Z" />
        <path d="M145 225 C125 245, 105 270, 102 305 C115 315, 135 310, 145 292 C152 275, 155 250, 152 230 Z" />

        {/* Kaki Ksatria Gagah (Kuda-Kuda Tempur Terbang) */}
        {/* Kaki Depan */}
        <path d="M185 320 C198 340, 212 365, 218 392 C205 398, 195 395, 190 382 C185 365, 178 348, 175 330 Z" />
        <path d="M215 390 C228 390, 248 395, 255 405 C248 412, 225 412, 210 405 Z" />
        {/* Kaki Belakang Menjejak Kokoh */}
        <path d="M125 305 C115 330, 105 360, 95 385 C105 392, 118 390, 122 378 C128 355, 135 335, 138 315 Z" />
        <path d="M95 385 C82 390, 65 398, 62 408 C75 412, 98 410, 105 400 Z" />
      </g>
    </svg>
  );
}

/**
 * Siluet Solid Adipati Karna (Suryaputra)
 * Dilengkapi Busur Pusaka Wijayacapa / Gandewa & Mahkota Surya Kencana
 * Bebas dari garis tiang gapit/stik agar tidak tampak seperti stickman.
 */
function KarnaSolidSilhouette() {
  return (
    <svg
      viewBox="0 0 320 440"
      width="300"
      height="410"
      className="wayang-duel-svg-canvas"
      style={{ overflow: 'visible' }}
    >
      <g fill="#1a120c">
        {/* Busur Panah Pusaka Raksasa (Wijayacapa / Gandewa) */}
        <path
          d="M195 35 C175 80, 155 160, 160 250 C165 320, 185 390, 210 425 C204 425, 180 355, 175 280 C170 200, 188 100, 202 35 Z"
          fill="#2b1a10"
        />

        {/* Praba Surya Mandala Kencana di Punggung */}
        <path d="M195 125 C235 90, 275 110, 285 155 C295 200, 265 240, 235 255 C255 225, 265 185, 250 155 C238 135, 215 130, 195 135 Z" />
        <path d="M185 110 C215 65, 255 75, 268 115 C278 150, 255 190, 230 215 C248 185, 252 148, 238 122 C225 102, 205 105, 185 115 Z" />

        {/* Mahkota Ketu Kencana Bertingkat Tinggi & Paras Narpatitama */}
        <path d="M175 75 C180 42, 168 18, 148 8 C142 25, 148 45, 158 65 Z" />
        <path d="M170 40 C155 25, 135 20, 125 35 C135 45, 150 50, 165 52 Z" />
        {/* Wajah Menatap Lanyap Mrabu */}
        <path d="M170 68 C165 60, 150 60, 140 72 C125 76, 105 82, 110 92 C122 94, 135 96, 142 108 C152 116, 168 114, 174 102 Z" />
        {/* Garuda Mungkur Belakang */}
        <path d="M178 82 C195 78, 205 90, 200 105 C192 112, 182 108, 178 98 Z" />

        {/* Dada Bidang, Zirah Surya, & Pinggang Ksatria */}
        <path d="M168 105 C158 118, 135 125, 132 148 C130 172, 142 195, 152 215 C165 218, 175 208, 178 192 C182 165, 180 135, 172 108 Z" />

        {/* Lengan Kiri Menarik Tali Busur Gandewa */}
        <path d="M138 135 C115 130, 85 125, 68 140 C58 148, 52 165, 58 178 C68 170, 75 155, 90 152 C110 148, 125 152, 138 155 Z" />
        <path d="M65 142 C45 140, 25 145, 15 160 C18 175, 32 185, 45 182 C48 172, 55 165, 68 165 Z" />
        <circle cx="25" cy="165" r="12" />

        {/* Lengan Belakang Memegang Poros Senjata */}
        <path d="M180 148 C202 155, 218 170, 225 192 C215 200, 202 198, 195 185 C188 172, 182 162, 175 158 Z" />
        <path d="M222 190 C235 210, 242 235, 238 255 C228 255, 218 245, 215 230 C212 215, 210 200, 215 190 Z" />
        <circle cx="238" cy="252" r="11" />

        {/* Kain Dodot Parang Rusak Keprabon */}
        <path d="M168 210 C145 220, 115 240, 105 270 C98 295, 110 325, 128 345 C135 330, 132 310, 140 295 C148 280, 165 265, 172 245 C175 230, 172 218, 168 210 Z" />
        <path d="M175 225 C195 245, 215 270, 218 305 C205 315, 185 310, 175 292 C168 275, 165 250, 168 230 Z" />

        {/* Kaki Ksatria Siap Meluncur */}
        {/* Kaki Depan Menekuk */}
        <path d="M135 320 C122 340, 108 365, 102 392 C115 398, 125 395, 130 382 C135 365, 142 348, 145 330 Z" />
        <path d="M105 390 C92 390, 72 395, 65 405 C72 412, 95 412, 110 405 Z" />
        {/* Kaki Belakang */}
        <path d="M195 305 C205 330, 215 360, 225 385 C215 392, 202 390, 198 378 C192 355, 185 335, 182 315 Z" />
        <path d="M225 385 C238 390, 255 398, 258 408 C245 412, 222 410, 215 400 Z" />
      </g>
    </svg>
  );
}
