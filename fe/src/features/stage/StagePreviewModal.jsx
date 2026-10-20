import React, { useState, useEffect } from 'react';
import VirtualStageCanvas from './VirtualStageCanvas';
import soundEngine from '../../services/soundscape';
import { AUDIO_MASTER } from '../../data/master/audioMaster';
import confetti from 'canvas-confetti';
import { X, Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react';

export default function StagePreviewModal({
  isOpen,
  onClose,
  scenes = [],
  metadata,
}) {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const activeScene = scenes[currentSceneIdx] || scenes[0];
  const totalScenes = scenes.length || 1;
  const currentDuration = activeScene?.durationMs || 5000;

  // Sinkronisasi Audio & Soundscape per pergantian adegan
  useEffect(() => {
    if (!isOpen) {
      soundEngine.stopBgm();
      return;
    }

    if (activeScene) {
      const audioConfig = AUDIO_MASTER.find((a) => a.id === activeScene.audioAssetId) || AUDIO_MASTER[0];
      if (isPlaying) {
        soundEngine.startBgm(audioConfig.synthType || 'srepeg', audioConfig.title);
        // Bunyikan gong/dodogan penanda peralihan adegan
        soundEngine.playDodogan();
      }
    }

    return () => {
      soundEngine.stopBgm();
    };
  }, [currentSceneIdx, isOpen, isPlaying, activeScene]);

  // Timer playback progress & pergantian adegan otomatis
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    setProgress(0);
    const intervalMs = 100;
    const stepIncrement = (intervalMs / currentDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Pindah ke adegan berikutnya jika ada
          if (currentSceneIdx < totalScenes - 1) {
            setCurrentSceneIdx((curr) => curr + 1);
            return 0;
          } else {
            // Selesai seluruh adegan! Rayakan dengan kembang api/confetti
            setIsPlaying(false);
            try {
              if (typeof confetti === 'function') {
                confetti({
                  particleCount: 120,
                  spread: 80,
                  origin: { y: 0.6 },
                });
              }
              soundEngine.playGong();
            } catch (_err) {}
            return 100;
          }
        }
        return prev + stepIncrement;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, currentSceneIdx, currentDuration, totalScenes]);

  if (!isOpen) return null;

  return (
    <div
      className="wayang-modal-backdrop"
      style={{
        zIndex: 9999,
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px',
      }}
    >
      {/* 1. Header Bioskop Kelir */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '12px 24px',
          background: 'rgba(22, 16, 10, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(212, 175, 55, 0.22)',
          borderRadius: '9999px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div>
          <div className="wayang-modal-eyebrow" style={{ marginBottom: '4px', fontSize: '10px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d4af37' }} />
            <span>PANGGUNG BIOSKOP KELIR VIRTUAL</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', color: '#fcfaf2', fontWeight: '850', fontFamily: 'Cinzel, Georgia, serif', letterSpacing: '-0.3px' }}>
              {metadata?.title || 'Pagelaran Lakon'}
            </h2>
            <span style={{ fontSize: '12px', color: '#bfae9c' }}>
              Adegan {currentSceneIdx + 1} dari {totalScenes}: <strong style={{ color: '#e8bb5c' }}>{activeScene?.title}</strong>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            soundEngine.stopBgm();
            onClose();
          }}
          aria-label="Tutup Pementasan"
          className="wayang-modal-close-btn"
          style={{ width: '40px', height: '40px' }}
        >
          <X size={18} />
        </button>
      </div>

      {/* 2. Panggung Virtual Utama (Proscenium Double-Bezel) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px 0',
          position: 'relative',
          width: '100%',
        }}
      >
        <div
          className="wayang-modal-chassis"
          style={{
            maxWidth: '1100px',
            width: '100%',
            padding: '3px',
            borderRadius: '24px',
          }}
        >
          <div
            className="wayang-modal-inner"
            style={{
              borderRadius: '21px',
              overflow: 'hidden',
              background: '#0a0705',
              maxHeight: 'none',
            }}
          >
            <div className="wayang-modal-hairline" />
            <VirtualStageCanvas
              scene={activeScene}
              selectedInstanceId={null}
              onSelectCharacter={() => {}}
              onUpdateCharacter={() => {}}
              onRemoveCharacter={() => {}}
              isInteractive={false}
            />
          </div>
        </div>
      </div>

      {/* 3. Floating Player Control Bar (Double-Bezel Island) */}
      <div
        className="wayang-modal-chassis"
        style={{
          maxWidth: '840px',
          width: '100%',
          margin: '0 auto',
          borderRadius: '9999px',
          padding: '2px',
        }}
      >
        <div
          className="wayang-modal-inner"
          style={{
            borderRadius: '9999px',
            padding: '12px 24px',
            background: 'linear-gradient(180deg, rgba(26, 19, 12, 0.98) 0%, rgba(16, 11, 7, 0.98) 100%)',
            maxHeight: 'none',
          }}
        >
        {/* Progress Bar & Penanda Waktu Adegan */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#c4b5a5', marginBottom: '6px', fontWeight: '600' }}>
            <span>Progress Babak Ini</span>
            <span style={{ color: '#e8bb5c' }}>{Math.round(progress)}%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '5px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #e8bb5c 0%, #d4af37 100%)',
                borderRadius: '9999px',
                transition: 'width 0.1s linear',
              }}
            />
          </div>
        </div>

        {/* Baris Tombol Kontrol */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {/* Info Tata Suara */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(212, 175, 55, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d4af37',
              }}
            >
              <Music size={14} />
            </div>
            <div style={{ fontSize: '12px', color: '#c4b5a5' }}>
              Gamelan: <strong style={{ color: '#fcfaf2' }}>{activeScene?.audioAssetId ? activeScene.audioAssetId.replace(/-/g, ' ') : 'Srepeg Klasik'}</strong>
            </div>
          </div>

          {/* Tombol Playback Tengah */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => {
                if (currentSceneIdx > 0) setCurrentSceneIdx((c) => c - 1);
              }}
              disabled={currentSceneIdx === 0}
              aria-label="Babak Sebelumnya"
              style={{
                ...ctrlBtnStyle,
                opacity: currentSceneIdx === 0 ? 0.35 : 1,
                cursor: currentSceneIdx === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              <SkipBack size={15} />
              <span>Lalu</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Jeda Pementasan' : 'Lanjutkan Pementasan'}
              style={{
                background: 'linear-gradient(135deg, #e8bb5c 0%, #d4af37 100%)',
                border: 'none',
                color: '#0d0a07',
                padding: '9px 24px',
                borderRadius: '9999px',
                fontSize: '13.5px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                minHeight: '44px',
                boxShadow: '0 2px 10px rgba(212, 175, 55, 0.35)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(1.08)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'brightness(1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {isPlaying ? <Pause size={16} fill="#0d0a07" /> : <Play size={16} fill="#0d0a07" />}
              <span>{isPlaying ? 'Jeda' : 'Lanjutkan'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (currentSceneIdx < totalScenes - 1) setCurrentSceneIdx((c) => c + 1);
              }}
              disabled={currentSceneIdx === totalScenes - 1}
              aria-label="Babak Berikutnya"
              style={{
                ...ctrlBtnStyle,
                opacity: currentSceneIdx === totalScenes - 1 ? 0.35 : 1,
                cursor: currentSceneIdx === totalScenes - 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <span>Lanjut</span>
              <SkipForward size={15} />
            </button>
          </div>

          {/* Indikator Status Tayang */}
          <div style={{ fontSize: '11.5px', color: isPlaying ? '#6ee7b7' : '#e5dec9', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: isPlaying ? '#10b981' : '#e8bb5c',
                display: 'inline-block',
              }}
            />
            <span>{isPlaying ? 'Tayang Berlangsung' : 'Pementasan Dijeda'}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

const ctrlBtnStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(212, 175, 55, 0.25)',
  color: '#fcfaf2',
  padding: '8px 16px',
  borderRadius: '9999px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '12.5px',
  fontWeight: '700',
  minHeight: '44px',
  transition: 'all 0.2s ease',
};
