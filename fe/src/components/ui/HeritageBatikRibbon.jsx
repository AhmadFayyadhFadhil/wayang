import React from 'react';
import atlasGoldMotifStrip from '../../assets/atlas_gold_motif_strip.jpg';
import nusantaraWordmark from '../../assets/nusantara_wordmark_transparent.png';

/**
 * HeritageBatikRibbon
 * -------------------------------------------------------------
 * Pita Pembatas Budaya Nusantara (Living Cultural Kinetic Ribbon).
 * Menggabungkan:
 * 1. Background: Infinite gliding batik prada emas Jawa kuno (conveyor continuous 60fps)
 * 2. Foreground: Kinetic infinite marquee tipografi otentik "nusantara" (foto pengguna)
 *    diselingi ornamen bintang surya Majapahit dan lencana adiluhung Wayangverse.
 * 3. Parallax dual-speed: Kecepatan geser batik dan teks berbeda sehingga memberikan
 *    efek kedalaman 3D teatrikal yang sangat mewah.
 * 4. Interaktif: Kecepatan melambat saat di-hover.
 */

const DEFAULT_TICKER_ITEMS = [
  { type: 'wordmark' },
  { type: 'badge', text: 'WAYANG KULIT PURWA' },
  { type: 'wordmark' },
  { type: 'badge', text: 'WARISAN ADILUHUNG' },
  { type: 'wordmark' },
  { type: 'badge', text: 'KELIR DIGITAL' },
  { type: 'wordmark' },
  { type: 'badge', text: 'GAGRAG TRADISI' },
  { type: 'wordmark' },
  { type: 'badge', text: 'SANAD PAKEM LAKON' },
];

export default function HeritageBatikRibbon({
  style = {},
  className = '',
  speed = 32,
  showBadges = true,
}) {
  return (
    <div
      className={`heritage-frosted-glass-ribbon ${className}`.trim()}
      style={style}
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

      {/* 3. Golden Scrim Overlay: Menjaga Keterbacaan dan Kontras Tulisan */}
      <div className="heritage-ribbon-gold-glaze" aria-hidden="true" />

      {/* 4. Marquee Viewport: Kinetic Nusantara Marquee Ticker */}
      <div className="heritage-ribbon-ticker-viewport">
        <div
          className="heritage-ribbon-ticker-track"
          style={{ animationDuration: `${speed}s` }}
        >
          {/* Track Group 1 */}
          <div className="heritage-ribbon-ticker-group">
            {DEFAULT_TICKER_ITEMS.map((item, idx) => (
              <React.Fragment key={`group1-${idx}`}>
                {item.type === 'wordmark' ? (
                  <img
                    src={nusantaraWordmark}
                    alt="Nusantara"
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
                <span className="heritage-ribbon-star-dot">✦</span>
              </React.Fragment>
            ))}
          </div>

          {/* Track Group 2 (Clone Identik untuk Perulangan Mulus 100% Tanpa Jeda) */}
          <div className="heritage-ribbon-ticker-group" aria-hidden="true">
            {DEFAULT_TICKER_ITEMS.map((item, idx) => (
              <React.Fragment key={`group2-${idx}`}>
                {item.type === 'wordmark' ? (
                  <img
                    src={nusantaraWordmark}
                    alt=""
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
                <span className="heritage-ribbon-star-dot">✦</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
