import React, { useState, useEffect } from 'react';
import VirtualStageCanvas from './VirtualStageCanvas';
import soundEngine from '../../services/soundscape';
import { AUDIO_MASTER } from '../../data/master/audioMaster';
import confetti from 'canvas-confetti';
import { Play, Pause, SkipForward, SkipBack, X } from 'lucide-react';

export default function StagePreviewModal({
  isOpen,
  onClose,
  scenes,
  metadata,
}) {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const activeScene = scenes[currentSceneIdx] || scenes[0];
  const totalScenes = scenes.length;
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
        // Bunyikan gong penanda peralihan adegan
        soundEngine.playDodogan();
      }
    }

    return () => {
      soundEngine.stopBgm();
    };
  }, [currentSceneIdx, isOpen, isPlaying]);

  // Timer playback progress & pergantian adegan otomatis
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    setProgress(0);
    const intervalMs = 100;
    const stepIncrement = (intervalMs / currentDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Pindah ke adegan berikutnya
          if (currentSceneIdx < totalScenes - 1) {
            setCurrentSceneIdx((curr) => curr + 1);
            return 0;
          } else {
            // Selesai seluruh adegan! Rayakan dengan kembang api/confetti
            setIsPlaying(false);
            try {
              confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
              });
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
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#09080d',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px',
        color: '#f9fafb',
      }}
    >
      {/* Header Teater / Bioskop Kelir */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1000px',
          width: '100%',
          margin: '0 auto',
          paddingBottom: '12px',
        }}
      >
        <div>
          <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 'bold', letterSpacing: '1px' }}>
            🎭 MODE PRATINJAU PANGGUNG (CLIENT-SIDE PREVIEW)
          </span>
          <h2 style={{ margin: '2px 0 0 0', fontSize: '20px', color: '#fff' }}>{metadata?.title}</h2>
          <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
            Adegan {currentSceneIdx + 1} dari {totalScenes}: {activeScene?.title}
          </p>
        </div>

        <button
          onClick={() => {
            soundEngine.stopBgm();
            onClose();
          }}
          style={{
            background: '#27272a',
            border: '1px solid #3f3f46',
            color: '#e4e4e7',
            padding: '8px 16px',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
          }}
        >
          <X size={16} /> Tutup Preview
        </button>
      </div>

      {/* Panggung Virtual Utama (Read-only saat Playback) */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <VirtualStageCanvas
          scene={activeScene}
          selectedInstanceId={null}
          onSelectCharacter={() => {}}
          onUpdateCharacter={() => {}}
          onRemoveCharacter={() => {}}
          isInteractive={false}
        />
      </div>

      {/* Kontrol Player & Progress Bar di Bagian Bawah */}
      <div
        style={{
          maxWidth: '800px',
          width: '100%',
          margin: '12px auto 0 auto',
          background: 'rgba(24, 24, 27, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid #3f3f46',
          borderRadius: '14px',
          padding: '12px 20px',
        }}
      >
        {/* Progress Bar Adegan */}
        <div style={{ width: '100%', height: '5px', background: '#3f3f46', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
              transition: 'width 0.1s linear',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Tombol Navigasi Adegan Sebelumnya */}
          <button
            onClick={() => {
              if (currentSceneIdx > 0) setCurrentSceneIdx((c) => c - 1);
            }}
            disabled={currentSceneIdx === 0}
            style={{ ...ctrlBtnStyle, opacity: currentSceneIdx === 0 ? 0.4 : 1 }}
          >
            <SkipBack size={16} /> Adegan Lalu
          </button>

          {/* Tombol Play / Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: '#b45309',
              border: 'none',
              color: '#fff',
              padding: '8px 24px',
              borderRadius: '24px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
            }}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isPlaying ? 'Jeda' : 'Lanjutkan'}
          </button>

          {/* Tombol Adegan Berikutnya */}
          <button
            onClick={() => {
              if (currentSceneIdx < totalScenes - 1) setCurrentSceneIdx((c) => c + 1);
            }}
            disabled={currentSceneIdx === totalScenes - 1}
            style={{ ...ctrlBtnStyle, opacity: currentSceneIdx === totalScenes - 1 ? 0.4 : 1 }}
          >
            Adegan Lanjut <SkipForward size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

const ctrlBtnStyle = {
  background: '#27272a',
  border: '1px solid #3f3f46',
  color: '#e4e4e7',
  padding: '6px 14px',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '12px',
};
