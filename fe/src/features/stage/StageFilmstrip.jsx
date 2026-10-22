import React, { useMemo } from 'react';
import { Plus, Copy, Trash2, Film, Clock } from 'lucide-react';
import { getBackgroundById } from '../../data/master/stageConfigMaster';
import soundEngine from '../../services/soundscape';

export default function StageFilmstrip({
  scenes,
  activeSceneIndex,
  onSelectScene,
  onAddScene,
  onDuplicateScene,
  onRemoveScene,
}) {
  const totalDurationSeconds = useMemo(() => {
    return scenes.reduce((acc, s) => acc + (Number(s.duration) || 5), 0);
  }, [scenes]);

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="stage-filmstrip-bar" role="region" aria-label="Alur Babak Lakon">
      <div className="stage-filmstrip-left">
        <div className="stage-filmstrip-badge">
          <Film size={13} className="stage-filmstrip-badge-icon" />
          <span>ALUR BABAK</span>
        </div>
      </div>

      {/* Reel Kartu Babak (Horizontal Scroll) */}
      <div className="stage-filmstrip-track">
        {scenes.map((scene, idx) => {
          const isActive = idx === activeSceneIndex;
          const bgConfig = getBackgroundById(scene.background);
          const charCount = scene.characters?.length || 0;

          return (
            <div
              key={scene.id || idx}
              onClick={() => {
                onSelectScene(idx);
                try { soundEngine.playDodogan(); } catch {}
              }}
              className={`stage-filmstrip-card ${isActive ? 'is-active' : ''}`}
              title={`Babak ${idx + 1}: ${scene.title || 'Adegan'} (${scene.duration || 5}s)`}
            >
              {/* Mini Visual Thumbnail */}
              <div
                className="filmstrip-card-thumb"
                style={{
                  background: bgConfig?.kelirColor || '#231a13',
                  borderColor: isActive ? '#d4af37' : 'rgba(212, 175, 55, 0.25)',
                }}
              >
                <div
                  className="filmstrip-thumb-aura"
                  style={{ background: bgConfig?.glowColor || 'rgba(212, 175, 55, 0.4)' }}
                />
                <span className="filmstrip-thumb-number">#{idx + 1}</span>
                {charCount > 0 && (
                  <span className="filmstrip-thumb-chars" title={`${charCount} tokoh di babak ini`}>
                    👥 {charCount}
                  </span>
                )}
              </div>

              {/* Info Babak */}
              <div className="filmstrip-card-body">
                <div className="filmstrip-card-top-row">
                  <span className="filmstrip-card-pathet">
                    {bgConfig?.pathet?.toUpperCase() || 'NEM'}
                  </span>
                  <span className="filmstrip-card-duration">
                    <Clock size={10} style={{ opacity: 0.7 }} />
                    <span>{scene.duration || 5}s</span>
                  </span>
                </div>
                <div className="filmstrip-card-title">
                  {scene.title || `Babak ${idx + 1}`}
                </div>
              </div>

              {/* Tombol Aksi Cepat pada Kartu Babak */}
              <div className="filmstrip-card-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => {
                    onDuplicateScene(idx);
                    try { soundEngine.playDodogan(); } catch {}
                  }}
                  title="Duplikasi Babak Ini"
                  aria-label="Duplikasi Babak"
                  className="filmstrip-action-btn copy"
                >
                  <Copy size={11} />
                </button>
                {scenes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      onRemoveScene(idx);
                      try { soundEngine.playKepyak(); } catch {}
                    }}
                    title="Hapus Babak Ini"
                    aria-label="Hapus Babak"
                    className="filmstrip-action-btn delete"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Tombol Tambah Babak Baru */}
        <button
          type="button"
          onClick={() => {
            onAddScene();
            try { soundEngine.playDodogan(); } catch {}
          }}
          className="stage-filmstrip-add-btn"
          title="Tambah Babak Baru ke Lakon"
        >
          <div className="filmstrip-add-icon-wrap">
            <Plus size={14} />
          </div>
          <span className="filmstrip-add-text">Tambah Babak</span>
        </button>
      </div>

      {/* Total Durasi Lakon di Kanan */}
      <div className="stage-filmstrip-right">
        <div className="filmstrip-total-label">DURASI TOTAL</div>
        <div className="filmstrip-total-time">
          {formatTime(totalDurationSeconds)}
          <span className="filmstrip-total-sub">({scenes.length} Babak)</span>
        </div>
      </div>
    </div>
  );
}
