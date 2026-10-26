import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

/**
 * AtlasStoryShowcase
 * ------------------------------------------------------------------
 * Format Theatrical Master Spotlight & Interactive Playlist Grid
 * untuk Khazanah Lakon Cerita Wayang di Story Atlas.
 * - Sisi Kiri (Spotlight): Panggung 3D Tilt & Parallax Glare dinamis beresolusi tinggi.
 * - Sisi Kanan (Playlist): Daftar kartu naskah bernomor urut dengan highlight emas prada aktif.
 * - 60 FPS hardware accelerated dengan requestAnimationFrame dan clean unmount.
 */
export default function AtlasStoryShowcase({
  stories = [],
  storyAssets = {},
  onSelectStoryModal,
  _onPlayCharacterOnStage,
}) {
  const [activeStoryId, setActiveStoryId] = useState(stories[0]?.id || null);

  // Derivasi cerita aktif secara sinkron tanpa useEffect cascading renders (React 19 pattern)
  const activeStory =
    stories.find((s) => s.id === activeStoryId) || stories[0] || null;

  // Refs untuk 3D Interactive Tilt & Glare di panggung spotlight sisi kiri
  const containerRef = useRef(null);
  const cardPlaneRef = useRef(null);
  const glareRef = useRef(null);
  const rafIdRef = useRef(null);

  // Bersihkan requestAnimationFrame saat unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || !cardPlaneRef.current) return;

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      if (!containerRef.current || !cardPlaneRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const xNorm = Math.max(-0.5, Math.min(0.5, x - 0.5));
      const yNorm = Math.max(-0.5, Math.min(0.5, y - 0.5));

      // rotX & rotY dibatasi halus ±7deg agar teks dan tombol tetap nyaman dibaca
      const rotX = -yNorm * 14;
      const rotY = xNorm * 14;

      cardPlaneRef.current.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      if (glareRef.current) {
        const glareX = (x * 100).toFixed(1);
        const glareY = (y * 100).toFixed(1);
        glareRef.current.style.background = `radial-gradient(circle 260px at ${glareX}% ${glareY}%, rgba(245, 215, 127, 0.32) 0%, rgba(212, 175, 55, 0.10) 45%, transparent 75%)`;
        glareRef.current.style.opacity = '1';
      }
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (cardPlaneRef.current) {
      cardPlaneRef.current.style.transition = 'transform 0.18s ease-out';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    if (cardPlaneRef.current) {
      cardPlaneRef.current.style.transition =
        'transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1)';
      cardPlaneRef.current.style.transform =
        'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  }, []);

  if (!activeStory) return null;

  const activeAsset = storyAssets[activeStory.slug] || {};
  const activeIndex = stories.findIndex((s) => s.id === activeStory.id);
  const activeRank = String(activeIndex >= 0 ? activeIndex + 1 : 1).padStart(
    2,
    '0'
  );

  return (
    <div className="leaderboard-showcase-grid">
      {/* Sisi Kiri: Master Stage Spotlight dengan 3D Tilt & Blencong Glare */}
      <div
        ref={containerRef}
        className="leaderboard-spotlight-stage"
        onClick={() => onSelectStoryModal && onSelectStoryModal(activeStory)}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
          cursor: 'pointer',
        }}
      >
        <div
          ref={cardPlaneRef}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Foto Latar Belakang Otentik */}
          <img
            src={activeAsset.coverImg || activeStory.cover_image || activeStory.coverImage || activeStory.imageUrl}
            alt={activeStory.title}
            className="leaderboard-spotlight-bg-img"
            key={activeStory.id}
          />

          {/* Dynamic Blencong Oil Lamp Glare */}
          <div
            ref={glareRef}
            className="wayang-3d-cover-glare"
            aria-hidden="true"
            style={{ zIndex: 1, pointerEvents: 'none' }}
          />

          {/* Scrim Gradasi: Jernih di tengah agar subjek wayang tampil tajam */}
          <div className="leaderboard-spotlight-scrim" />

          {/* Header Meta: Terapung di bidang 3D (translateZ: 30px) */}
          <div
            className="leaderboard-spotlight-header-meta"
            style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}
          >
            <span className="leaderboard-spotlight-badge">
              <Sparkles size={12} />
              PILIHAN PAKEM #{activeRank}
            </span>
            <span className="leaderboard-spotlight-epos">
              {activeAsset.traditionBadge || activeStory.tradition} •{' '}
              {activeAsset.versionPakem || activeStory.versionLabel}
            </span>
          </div>

          {/* Bottom Content: Mengendap rapi di dasar panggung (translateZ: 40px) */}
          <div
            className="leaderboard-spotlight-content"
            style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d' }}
          >
            <h3 className="leaderboard-spotlight-title">{activeStory.title}</h3>

            <div className="leaderboard-spotlight-dalang">
              <span>
                Pakem: {activeAsset.versionPakem || activeStory.versionLabel}
              </span>
              <span>•</span>
              <span>
                Sumber: {activeAsset.provenanceSource || 'Reksa Pustaka'}
              </span>
            </div>

            <p className="leaderboard-spotlight-desc">
              {activeStory.shortSynopsis || activeStory.synopsis}
            </p>
          </div>
        </div>
      </div>

      {/* Sisi Kanan: Playlist Reel of Curated Stories */}
      <div className="leaderboard-reel-stack">
        {stories.map((story, index) => {
          const isSelected = story.id === activeStory.id;
          const asset = storyAssets[story.slug] || {};
          const rank = String(index + 1).padStart(2, '0');

          return (
            <div
              key={story.id}
              onClick={() => setActiveStoryId(story.id)}
              onMouseEnter={() => setActiveStoryId(story.id)}
              className={`leaderboard-reel-card ${isSelected ? 'active' : ''}`}
              role="button"
              tabIndex={0}
              aria-selected={isSelected}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveStoryId(story.id);
                }
              }}
            >
              <div className="leaderboard-reel-rank">{rank}.</div>

              <div className="leaderboard-reel-img-thumb">
                <img
                  src={asset.coverImg || story.cover_image || story.coverImage || story.imageUrl}
                  alt={story.title}
                  className="leaderboard-reel-img"
                  loading="lazy"
                />
              </div>

              <div className="leaderboard-reel-body">
                <h4 className="leaderboard-reel-title" title={story.title}>
                  {story.title}
                </h4>
                <div
                  className="leaderboard-reel-dalang"
                  title={`Pakem: ${asset.versionPakem || story.versionLabel || 'Klasik'}`}
                >
                  Pakem: {asset.versionPakem || story.versionLabel}
                </div>
                <div className="leaderboard-reel-meta">
                  <span
                    className="leaderboard-reel-epos"
                    title={`Tradisi: ${asset.traditionBadge || story.tradition || 'Jawa Purwa'}`}
                  >
                    {asset.traditionBadge || story.tradition}
                  </span>
                  <span className="leaderboard-reel-dot">•</span>
                  <span className="leaderboard-reel-views">
                    {story.characterIds?.length || 2} Tokoh Terkait
                  </span>
                </div>
              </div>

              <div className="leaderboard-reel-arrow">
                <ArrowRight size={14} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
