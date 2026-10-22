import React from 'react';
import atlasGoldMotifStrip from '../../assets/atlas_gold_motif_strip.jpg';
import nusantaraWordmark from '../../assets/nusantara_wordmark_transparent.png';

/**
 * HeritageBatikRibbon
 * -------------------------------------------------------------
 * Pita Pembatas Budaya Adiluhung Nusantara (Living Cultural Kinetic Ribbon).
 * Menggabungkan:
 * 1. Background: Batik prada emas Jawa kuno dengan kontras terkontrol (subtle watermark)
 * 2. Foreground: Kinetic infinite marquee tipografi otentik "nusantara" bergantian dengan
 *    pill badges filosofi pewayangan dan separator ornamen surya Majapahit emas
 * 3. Loop: Seamless 100% tanpa jeda/lompatan (matematis zero-jump reset)
 * 4. Masking: Fade gradasi di tepi kiri dan kanan untuk transisi visual mulus tanpa potong kasar
 * 5. Interaktivitas & Aksesibilitas: Hover pause dan dukungan prefers-reduced-motion
 */

const TICKER_ITEMS = [
  { type: 'pill', text: 'WAYANG KULIT PURWA' },
  { type: 'wordmark' },
  { type: 'pill', text: 'GAGRAG TRADISI' },
  { type: 'wordmark' },
  { type: 'pill', text: 'SANAD PAKEM LAKON' },
  { type: 'wordmark' },
  { type: 'pill', text: 'WARISAN ADILUHUNG' },
  { type: 'wordmark' },
  { type: 'pill', text: 'KELIR DIGITAL' },
  { type: 'wordmark' },
  { type: 'pill', text: 'MAHAKARYA NUSANTARA' },
  { type: 'wordmark' },
  { type: 'pill', text: 'TATAH SUNGGING ADILUHUNG' },
  { type: 'wordmark' },
  { type: 'pill', text: 'FILOSOFI JAWA PURWA' },
  { type: 'wordmark' },
];

export default function HeritageBatikRibbon({
  style = {},
  className = '',
  speed = 36,
  showBadges = true,
}) {
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
          ) : (
            showBadges && (
              <span className="heritage-ribbon-pill-tag">
                {item.text}
              </span>
            )
          )}
          {(item.type === 'wordmark' || showBadges) && (
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
      className={`heritage-frosted-glass-ribbon ${className}`.trim()}
      style={ribbonStyle}
      aria-label="Pita Budaya Adiluhung Nusantara Wayangverse"
    >
      {/* 1. Specular Golden Highlight di Bibir Atas */}
      <div className="heritage-glass-specular-highlight" aria-hidden="true" />

      {/* 2. Lapisan Dasar: Infinite Gliding Batik Prada Emas (Subtle Watermark) */}
      <div
        className="infinite-batik-conveyor"
        aria-hidden="true"
        style={{
          backgroundImage: `url(${atlasGoldMotifStrip})`,
        }}
      />

      {/* 3. Golden Scrim Overlay: Menjaga Keterbacaan dan Kontras Tulisan */}
      <div className="heritage-ribbon-gold-glaze" aria-hidden="true" />

      {/* 4. Marquee Viewport: Kinetic Nusantara Marquee Ticker dengan Edge Masking */}
      <div className="heritage-ribbon-ticker-viewport">
        <div className="heritage-ribbon-ticker-track">
          {/* Track Group 1 (Main) */}
          {renderGroup('group-main')}

          {/* Track Group 2 (Clone Identik untuk Perulangan Mulus 100% Tanpa Jeda) */}
          {renderGroup('group-clone')}
        </div>
      </div>
    </div>
  );
}
