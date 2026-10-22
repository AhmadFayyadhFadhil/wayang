import React from 'react';
import atlasGoldMotifStrip from '../../assets/atlas_gold_motif_strip.jpg';
import nusantaraWordmark from '../../assets/nusantara_wordmark_transparent.png';

/**
 * HeritageBatikRibbon
 * -------------------------------------------------------------
 * Pita Pembatas Budaya Adiluhung Nusantara (Living Cultural Kinetic Ribbon).
 * Mendukung 2 mode (variant):
 * 1. variant="full" (default): Marquee kinetik kaya variasi berisi:
 *    - Pill badges filosofi pewayangan (kaca temaram)
 *    - Nama tokoh agung dalam tipografi serif berkarakter (Arjuna, Semar, Gatotkaca, Bima, dll.)
 *    - Logo otentik putih "nusantara" (tampil sesekali sebagai cap keagungan)
 *    - Ornamen bintang surya Majapahit emas
 *    Digunakan di bagian bawah halaman sebelum footer.
 * 2. variant="batik-only": Murni motif batik prada emas Jawa kuno yang meluncur kontinu
 *    tanpa teks/logo. Digunakan sebagai pembatas dekoratif antara hero banner dan konten babak.
 */

const TICKER_ITEMS = [
  { type: 'pill', text: 'WAYANG KULIT PURWA' },
  { type: 'char', name: 'Arjuna', epithet: 'Satria Panengah Pandawa' },
  { type: 'wordmark' },
  { type: 'pill', text: 'GAGRAG TRADISI' },
  { type: 'char', name: 'Semar', epithet: 'Kyai Lurah Pamong Adiluhung' },
  { type: 'pill', text: 'SANAD PAKEM LAKON' },
  { type: 'char', name: 'Gatotkaca', epithet: 'Satria Pringgandani' },
  { type: 'pill', text: 'TATAH SUNGGING ADILUHUNG' },
  { type: 'char', name: 'Bima', epithet: 'Raden Wrekudara' },
  { type: 'wordmark' },
  { type: 'pill', text: 'MEMAYU HAYUNING BAWANA' },
  { type: 'char', name: 'Srikandi', epithet: 'Prajurit Wanita Sejati' },
  { type: 'pill', text: 'KELIR DIGITAL' },
  { type: 'char', name: 'Karna', epithet: 'Adipati Awangga' },
];

export default function HeritageBatikRibbon({
  style = {},
  className = '',
  speed = 54,
  showBadges = true,
  showTicker = true,
  variant = 'full',
}) {
  const isBatikOnly = variant === 'batik-only' || showTicker === false;

  const ribbonStyle = {
    '--ribbon-duration': `${speed}s`,
    ...style,
  };

  const renderGroup = (groupId) => (
    <div
      className="heritage-ribbon-ticker-group"
      key={groupId}
      aria-hidden={groupId === 'group-clone'}
    >
      {TICKER_ITEMS.map((item, idx) => (
        <React.Fragment key={`${groupId}-${idx}`}>
          {item.type === 'wordmark' ? (
            <img
              src={nusantaraWordmark}
              alt={groupId === 'group-main' ? 'Nusantara' : ''}
              className="heritage-ribbon-wordmark-img"
              loading="lazy"
            />
          ) : item.type === 'char' ? (
            <span
              className="heritage-ribbon-char-tag"
              title={item.epithet}
            >
              <em>{item.name}</em>
            </span>
          ) : (
            showBadges && (
              <span className="heritage-ribbon-pill-tag">
                {item.text}
              </span>
            )
          )}
          {(item.type === 'wordmark' || item.type === 'char' || showBadges) && (
            <span className="heritage-ribbon-star-dot" aria-hidden="true">
              ✦
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div
      className={`heritage-frosted-glass-ribbon ${isBatikOnly ? 'heritage-ribbon--batik-only' : ''} ${className}`.trim()}
      style={ribbonStyle}
      aria-label="Pita Budaya Adiluhung Nusantara Wayangverse"
    >
      {/* 1. Specular Golden Highlight di Bibir Atas */}
      <div className="heritage-glass-specular-highlight" aria-hidden="true" />

      {/* 2. Lapisan Dasar: Infinite Gliding Batik Prada Emas */}
      <div
        className="infinite-batik-conveyor"
        aria-hidden="true"
        style={{
          backgroundImage: `url(${atlasGoldMotifStrip})`,
        }}
      />

      {/* 3. Golden Scrim Overlay: Penyeimbang Nuansa Emas Keraton */}
      <div className="heritage-ribbon-gold-glaze" aria-hidden="true" />

      {/* 4. Marquee Viewport: Kinetic Nusantara Marquee Ticker (Hanya Tampil di Mode Full) */}
      {!isBatikOnly && (
        <div className="heritage-ribbon-ticker-viewport">
          <div className="heritage-ribbon-ticker-track">
            {/* Track Group 1 (Main) */}
            {renderGroup('group-main')}

            {/* Track Group 2 (Clone Identik untuk Perulangan Mulus 100% Tanpa Jeda) */}
            {renderGroup('group-clone')}
          </div>
        </div>
      )}
    </div>
  );
}
