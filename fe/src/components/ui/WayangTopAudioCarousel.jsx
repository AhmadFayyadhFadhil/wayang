import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Square, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';

/**
 * WayangTopAudioCarousel
 * ------------------------------------------------------------------
 * Format Horizontal Carousel bergaya Netflix Top 10 untuk Tata Suara & Soundscape.
 * - Ciri khas: Giant Outlined Overlapping Numbers (1, 2, 3, 4, 5, 6) bergaris tepi emas prada.
 * - Vertical Portrait Poster Cards dengan foto instrumen gamelan & orkestra tradisi.
 * - Lencana inisial emas "W" Wayangverse dan pill kategori (BGM / SFX).
 * - Pemutar audio interaktif dengan animasi equalizer gelombang suara saat aktif.
 * - Navigasi scroll horizontal mulus (panah geser + touch swipe mobile).
 */
/**
 * Helper untuk mengekstrak label tempo yang ringkas, elegan, dan anti-overflow.
 * Menjamin pill badge di kanan atas tidak terpotong (truncated) canggung.
 */
const formatTempoTag = (audio = {}) => {
  if (audio.tempoTag) return audio.tempoTag;
  const tempo = audio.tempo || '';
  if (!tempo) return '';
  const tempoMap = {
    'Lambat, Syahdu, Mengalun': 'Lambat',
    'Aksen Tunggal / Hentakan': 'Aksen Tunggal',
    'Gema Menggelegar Dalam': 'Gema Ageng',
    'Sangat Cepat & Bergetar': 'Sangat Cepat',
    'Cepat & Heroik': 'Cepat',
    'Gemerincing Tajam': 'Gemerincing',
  };
  if (tempoMap[tempo]) return tempoMap[tempo];

  // Fallback dinamis: potong tanda pemisah koma, ampersand, atau slash
  const primary = tempo.split(/[,&/]/)[0].trim();
  if (primary.length > 13) {
    const words = primary.split(' ');
    return words.length > 1 ? words.slice(0, 2).join(' ') : primary.slice(0, 12);
  }
  return primary;
};

export default function WayangTopAudioCarousel({
  audioList = [],
  playingAudioId = null,
  onToggleAudio,
  audioPosters = {},
}) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = trackRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const handleScroll = (direction) => {
    if (!trackRef.current) return;
    const scrollAmount = direction * 320;
    trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (!audioList || audioList.length === 0) return null;

  return (
    <div className="wayang-top-audio-container" aria-label="Top Tata Suara & Soundscape Tradisi">
      {/* Tombol Panah Navigasi Kiri */}
      {canScrollLeft && (
        <button
          type="button"
          className="wayang-top-audio-nav wayang-top-audio-nav-left"
          onClick={() => handleScroll(-1)}
          aria-label="Geser ke kiri"
        >
          <ChevronLeft size={24} color="#1a140e" />
        </button>
      )}

      {/* Track Horizontal Scroll dengan Scroll Snap */}
      <div ref={trackRef} className="wayang-top-audio-track">
        {audioList.map((audio, index) => {
          const rank = index + 1;
          const isPlaying = playingAudioId === audio.id;
          const posterImg = audioPosters[audio.id] || null;

          return (
            <div
              key={audio.id}
              className={`wayang-top-audio-card-wrapper ${isPlaying ? 'is-playing' : ''}`}
            >
              {/* NOMOR URUT RAKSASA HOLLOW OUTLINE (Netflix Top 10 Style) */}
              <div className="wayang-top-audio-rank-number" aria-hidden="true">
                {rank}
              </div>

              {/* POSTER KARTU VERTIKAL */}
              <div
                className="wayang-top-audio-poster"
                onClick={() => onToggleAudio && onToggleAudio(audio)}
                role="button"
                tabIndex={0}
                aria-label={`${audio.title} - ${isPlaying ? 'Hentikan' : 'Putar'}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (onToggleAudio) onToggleAudio(audio);
                  }
                }}
              >
                {/* Foto Latar Belakang Instrumen / Pagelaran */}
                {posterImg ? (
                  <img
                    src={posterImg}
                    alt={audio.title}
                    className="wayang-top-audio-img"
                    loading="lazy"
                  />
                ) : (
                  <div className="wayang-top-audio-img-placeholder">
                    <Volume2 size={40} color="#d4af37" />
                  </div>
                )}

                {/* Scrim Gradient Gelap agar teks judul & instrumen terbaca jernih */}
                <div className="wayang-top-audio-scrim" />

                {/* Header Crest: Inisial Emas "W" + Badge Kategori (BGM/SFX) */}
                <div className="wayang-top-audio-header">
                  <div className="wayang-top-audio-crest-group">
                    <span className="wayang-top-audio-crest-logo">W</span>
                    <span
                      className="wayang-top-audio-badge-category"
                      title={`Kategori: ${audio.category ? audio.category.toUpperCase() : 'BGM'}`}
                    >
                      {audio.category ? audio.category.toUpperCase() : 'BGM'}
                    </span>
                  </div>

                  {/* Lencana Tempo / Mood di Kanan Atas dengan Anti-Overflow Tooltip */}
                  {audio.tempo && (
                    <span
                      className="wayang-top-audio-tempo-tag"
                      title={`Karakter Irama: ${audio.tempo}${audio.mood ? ` • ${audio.mood}` : ''}`}
                    >
                      {formatTempoTag(audio)}
                    </span>
                  )}
                </div>

                {/* Konten Bagian Bawah Poster */}
                <div className="wayang-top-audio-content">
                  <h4 className="wayang-top-audio-title" title={audio.title}>
                    {audio.title}
                  </h4>
                  <p
                    className="wayang-top-audio-instrument"
                    title={`Instrumen: ${audio.instrument}${audio.mood ? ` (${audio.mood})` : ''}`}
                  >
                    {audio.instrument}
                  </p>

                  <div className="wayang-top-audio-footer-row">
                    {/* Tombol Play / Stop dengan Equalizer Aktif */}
                    <div className="wayang-top-audio-play-box">
                      <div className={`wayang-top-audio-play-btn ${isPlaying ? 'playing' : ''}`}>
                        {isPlaying ? (
                          <Square size={14} fill="#ffffff" color="#ffffff" />
                        ) : (
                          <Play size={15} fill="#0d0a07" color="#0d0a07" style={{ marginLeft: '2px' }} />
                        )}
                      </div>

                      {/* Equalizer Waveform Bars saat Audio Aktif */}
                      {isPlaying ? (
                        <div className="wayang-top-audio-equalizer">
                          <span className="eq-bar eq-bar-1" />
                          <span className="eq-bar eq-bar-2" />
                          <span className="eq-bar eq-bar-3" />
                          <span className="eq-bar eq-bar-4" />
                        </div>
                      ) : (
                        <span className="wayang-top-audio-play-label">Play Demo</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Highlight Glow Border Emas saat Hover & Playing */}
                <div className="wayang-top-audio-highlight-border" aria-hidden="true" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tombol Panah Navigasi Kanan */}
      {canScrollRight && (
        <button
          type="button"
          className="wayang-top-audio-nav wayang-top-audio-nav-right"
          onClick={() => handleScroll(1)}
          aria-label="Geser ke kanan"
        >
          <ChevronRight size={24} color="#1a140e" />
        </button>
      )}
    </div>
  );
}
