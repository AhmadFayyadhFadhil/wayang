import React, { useState, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Eye, Compass } from 'lucide-react';
import WayangFigureSvg from '../stage/WayangFigureSvg';

/**
 * WayangCoverflowCarousel
 * -------------------------------------------------------------
 * 3D Cascading Stacked Cards / Cover Flow Carousel untuk Atlas Tokoh Wayang.
 * - Sesuai referensi visual pengguna: Kartu tengah aktif memancarkan warna penuh,
 *   kartu sayap (kiri & kanan) mengecil secara simetris dengan efek desaturasi artistik (grayscale).
 * - Transisi hardware-accelerated 60 FPS (translate3d, scale, rotateY).
 * - Multi-kontrol: Klik langsung, tombol panah melingkar, touch swipe mobile, dan keyboard navigation.
 * - Anti-AI slop: Desain bernyawa dengan palet warna kayu soga, emas prada, dan gading hangat.
 */
export default function WayangCoverflowCarousel({
  characters = [],
  charAssets = {},
  onSelectCharacter,
  onPlayOnStage,
  watermarkText = 'TOKOH WAYANG',
}) {
  const [rawIndex, setRawIndex] = useState(0);
  const containerRef = useRef(null);
  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);

  const total = characters.length;

  // Derivasi activeIndex secara sinkron tanpa useEffect cascading renders (React 19 pattern)
  const activeIndex = total > 0 ? ((rawIndex % total) + total) % total : 0;

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setRawIndex((prev) => prev - 1);
  }, [total]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setRawIndex((prev) => prev + 1);
  }, [total]);

  // Navigasi Keyboard (Panah Kiri & Panah Kanan)
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    },
    [handlePrev, handleNext]
  );

  // Penanganan Gestur Sentuh (Touch Swipe) untuk Smartphone & Tablet
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    const threshold = 40; // minimum drag distance in px
    if (diff > threshold) {
      handleNext();
    } else if (diff < -threshold) {
      handlePrev();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // State Kosong (Jika hasil filter/pencarian tidak ada)
  if (!characters || characters.length === 0) {
    return (
      <div className="wayang-coverflow-empty">
        <Compass size={36} color="#d4af37" style={{ marginBottom: '12px' }} />
        <h4 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#1a140e', fontWeight: '800' }}>
          Tokoh Tidak Ditemukan
        </h4>
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', maxWidth: '420px', lineHeight: '1.5' }}>
          Tidak ada ksatria atau tokoh wayang yang cocok dengan kata kunci atau filter yang Anda pilih. Silakan gunakan filter lain.
        </p>
      </div>
    );
  }

  // Menghitung offset relatif (-2, -1, 0, 1, 2) untuk sirkularitas panggung
  const getOffset = (index) => {
    if (total <= 1) return 0;
    let diff = index - activeIndex;
    if (total >= 5) {
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;
    }
    return diff;
  };

  const activeChar = characters[activeIndex] || characters[0];

  return (
    <div
      ref={containerRef}
      className="wayang-coverflow-wrapper"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Koleksi Tokoh Wayang 3D Cover Flow"
    >
      {/* Panggung Perspektif 3D Utama */}
      <div className="wayang-coverflow-stage">
        {/* Giant Typographic Backdrop Watermark (Sesuai Referensi Visual) */}
        <div className="wayang-coverflow-watermark-bg" aria-hidden="true">
          <span className="wayang-coverflow-watermark-text">
            {watermarkText}
          </span>
        </div>

        {characters.map((char, index) => {
          const offset = getOffset(index);
          const isCenter = offset === 0;
          const isVisible = Math.abs(offset) <= 2;
          const charImg = charAssets[char.slug];

          return (
            <div
              key={char.id || char.slug || index}
              className={`wayang-coverflow-card ${isCenter ? 'is-active' : ''} ${
                !isVisible ? 'is-hidden' : ''
              }`}
              data-offset={offset}
              style={{
                // z-index dinamis agar kartu tengah selalu di atas sayap samping
                zIndex: isCenter ? 20 : 10 - Math.abs(offset),
              }}
              onClick={() => {
                if (isCenter) {
                  // Jika kartu aktif diklik, buka modal profil detail
                  if (onSelectCharacter) onSelectCharacter(char);
                } else {
                  // Jika kartu sayap diklik, putar panggung ke kartu tersebut
                  setRawIndex(index);
                }
              }}
              role="button"
              tabIndex={isCenter ? 0 : -1}
              aria-label={`${char.name} ${isCenter ? '(Aktif)' : ''}`}
            >
              {/* Bagian Visual / Gambar Tokoh */}
              <div className="wayang-coverflow-img-box">
                {charImg ? (
                  <img
                    src={charImg}
                    alt={char.name}
                    className="wayang-coverflow-char-img"
                    loading="lazy"
                  />
                ) : (
                  <div className="wayang-coverflow-svg-holder">
                    <WayangFigureSvg
                      slug={char.slug}
                      scale={0.75}
                      width={130}
                      height={190}
                      accentColor={char.accentColor || '#d4af37'}
                      animated={isCenter}
                    />
                  </div>
                )}

                {/* Badge Kategori Tokoh (Pill Melayang) */}
                <div className="wayang-coverflow-type-badge">
                  <span>{char.typeName || 'Ksatria'}</span>
                </div>

                {/* Gradient Penyeimbang Visual */}
                <div className="wayang-coverflow-img-overlay" />
              </div>

              {/* Informasi & Konten Karakter */}
              <div className="wayang-coverflow-content">
                {/* Gelar & Pusaka Luhur */}
                <div className="wayang-coverflow-meta-list">
                  <div className="wayang-coverflow-meta-item">
                    <span className="wayang-coverflow-meta-label">Gelar:</span>
                    <span className="wayang-coverflow-meta-val" title={char.alias}>
                      {char.alias || '-'}
                    </span>
                  </div>
                  <div className="wayang-coverflow-meta-item">
                    <span className="wayang-coverflow-meta-label">Pusaka:</span>
                    <span className="wayang-coverflow-meta-val" title={char.weapons}>
                      {char.weapons || '-'}
                    </span>
                  </div>
                </div>

                {/* Nama Tokoh */}
                <h3 className="wayang-coverflow-title">{char.name}</h3>

                {/* Deskripsi Singkat */}
                <p className="wayang-coverflow-desc">
                  {char.shortDesc || char.description || 'Tokoh pewayangan legendaris wiracarita Nusantara.'}
                </p>

                {/* Tombol Aksi (Tampil interaktif saat menjadi kartu aktif di tengah) */}
                <div className="wayang-coverflow-actions">
                  <button
                    type="button"
                    className="wayang-coverflow-btn-profile"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectCharacter) onSelectCharacter(char);
                    }}
                    title="Buka Pustaka Lengkap & Visualisasi Pose"
                  >
                    <Eye size={15} style={{ marginRight: '6px' }} />
                    Profil & Pose
                  </button>
                  <button
                    type="button"
                    className="wayang-coverflow-btn-play"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onPlayOnStage) onPlayOnStage(char.id);
                    }}
                    title="Mainkan Tokoh ini di Panggung Kelir Virtual"
                  >
                    <Play size={14} fill="#0d0a07" style={{ marginRight: '5px' }} />
                    Mainkan
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Tombol Navigasi Panah Sisi Kiri (Circular Glass Button) */}
        {total > 1 && (
          <button
            type="button"
            className="wayang-coverflow-nav-arrow wayang-coverflow-nav-prev"
            onClick={handlePrev}
            aria-label="Tokoh Sebelumnya"
          >
            <ChevronLeft size={22} color="#1a140e" />
          </button>
        )}

        {/* Tombol Navigasi Panah Sisi Kanan (Circular Glass Button) */}
        {total > 1 && (
          <button
            type="button"
            className="wayang-coverflow-nav-arrow wayang-coverflow-nav-next"
            onClick={handleNext}
            aria-label="Tokoh Berikutnya"
          >
            <ChevronRight size={22} color="#1a140e" />
          </button>
        )}
      </div>

      {/* Bagian Bawah: Indikator Pagination Dots & Ringkasan Tokoh Aktif */}
      <div className="wayang-coverflow-footer">
        <div className="wayang-coverflow-dots">
          {characters.map((char, idx) => (
            <button
              key={char.id || idx}
              type="button"
              className={`wayang-coverflow-dot ${idx === activeIndex ? 'is-active' : ''}`}
              onClick={() => setRawIndex(idx)}
              aria-label={`Pilih tokoh ${char.name}`}
              title={char.name}
            />
          ))}
        </div>

        <div className="wayang-coverflow-indicator-badge">
          <span className="wayang-coverflow-current-num">
            {activeIndex + 1} / {total}
          </span>
          <span className="wayang-coverflow-current-name">{activeChar?.name}</span>
        </div>
      </div>
    </div>
  );
}
