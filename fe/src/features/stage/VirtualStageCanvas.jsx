import React, { useRef, useState, useEffect, useMemo } from 'react';
import WayangFigureSvg from '../../components/stage/WayangFigureSvg';
import { getBackgroundById, STAGE_CONFIG_MASTER } from '../../data/master/stageConfigMaster';
import soundEngine from '../../services/soundscape';
import { ZoomIn, ZoomOut, Trash2, Volume2, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

export default function VirtualStageCanvas({
  scene,
  selectedInstanceId,
  onSelectCharacter,
  onUpdateCharacter,
  onRemoveCharacter,
  isInteractive = true,
}) {
  const containerRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [volume, setVolume] = useState(70);

  const bgConfig = getBackgroundById(scene?.background);
  const characters = useMemo(() => scene?.characters || [], [scene?.characters]);

  // Pemicu SFX Dalang
  const handlePlaySfx = (type) => {
    if (type === 'dodogan') soundEngine.playDodogan();
    else if (type === 'kepyak') soundEngine.playKepyak();
    else if (type === 'gong') soundEngine.playGong();
  };

  // Dragging Handlers
  const handlePointerDown = (e, char) => {
    if (!isInteractive) return;
    e.stopPropagation();
    onSelectCharacter(char.instanceId);

    const rect = containerRef.current.getBoundingClientRect();
    const charPxX = char.x * rect.width;
    const charPxY = char.y * rect.height;

    setDraggingId(char.instanceId);
    setDragOffset({
      x: e.clientX - rect.left - charPxX,
      y: e.clientY - rect.top - charPxY,
    });

    // Mainkan suara dodogan halus saat wayang dipegang
    soundEngine.playDodogan();
  };

  const handlePointerMove = (e) => {
    if (!draggingId || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left - dragOffset.x;
    const currentY = e.clientY - rect.top - dragOffset.y;

    const normX = Math.max(0.06, Math.min(0.94, currentX / rect.width));
    const normY = Math.max(0.35, Math.min(0.85, currentY / rect.height));

    onUpdateCharacter(draggingId, { x: normX, y: normY });
  };

  const handlePointerUp = () => {
    if (draggingId) {
      setDraggingId(null);
      // Bunyi kepyak saat wayang ditancapkan
      soundEngine.playKepyak();
    }
  };

  useEffect(() => {
    const handleGlobalUp = () => setDraggingId(null);
    window.addEventListener('pointerup', handleGlobalUp);
    return () => window.removeEventListener('pointerup', handleGlobalUp);
  }, []);

  // Aksesibilitas Keyboard: Gerakkan wayang yang terpilih dengan tombol panah (NFR-06)
  useEffect(() => {
    if (!selectedInstanceId || !isInteractive) return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

      const char = characters.find((c) => c.instanceId === selectedInstanceId);
      if (!char) return;

      const step = 0.02;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onUpdateCharacter(selectedInstanceId, { x: char.x - step });
        soundEngine.playDodogan();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onUpdateCharacter(selectedInstanceId, { x: char.x + step });
        soundEngine.playDodogan();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        onUpdateCharacter(selectedInstanceId, { y: char.y - step });
        soundEngine.playDodogan();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onUpdateCharacter(selectedInstanceId, { y: char.y + step });
        soundEngine.playDodogan();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedInstanceId, isInteractive, characters, onUpdateCharacter]);

  const selectedChar = characters.find((c) => c.instanceId === selectedInstanceId);

  return (
    <div
      className="virtual-stage-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        userSelect: 'none',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
        border: '1px solid #362619',
        backgroundColor: bgConfig.bgColor,
      }}
    >
      {/* Kanvas Panggung Utama (Aspect Ratio 16:9) */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={() => isInteractive && onSelectCharacter(null)}
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '56.25%', // 16:9 Ratio
          cursor: draggingId ? 'grabbing' : 'default',
          overflow: 'hidden',
          background: `radial-gradient(ellipse at 50% 25%, ${bgConfig.glowColor}44 0%, ${bgConfig.kelirColor} 45%, ${bgConfig.bgColor} 100%)`,
        }}
      >
        {/* Latar Gambar Panggung Otentik jika tersedia */}
        {bgConfig.bgImage && (
          <img
            src={bgConfig.bgImage}
            alt={bgConfig.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: bgConfig.imageOpacity || 0.9,
              filter: 'contrast(1.08) brightness(0.95)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}

        {/* Lampu Blencong Keemasan di Atas Kelir */}
        <div
          style={{
            position: 'absolute',
            top: '8%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${bgConfig.glowColor} 0%, rgba(245, 158, 11, 0.4) 40%, transparent 70%)`,
            filter: 'blur(16px)',
            pointerEvents: 'none',
            zIndex: 1,
            animation: 'blencongPulse 3s infinite ease-in-out',
          }}
        />

        {/* Siluet Debog (Batang Pisang Tempat Tancep Wayang di Dasar Panggung) */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '14%',
            background: 'linear-gradient(to top, #140b05 0%, #29180c 70%, #451a03 100%)',
            borderTop: '2px solid #78350f',
            zIndex: 3,
            boxShadow: '0 -6px 15px rgba(0,0,0,0.6)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px 16px',
              fontSize: '11px',
              color: '#d4a359',
              letterSpacing: '1px',
            }}
          >
            <span>PALAHAN DEBOG WAYANG</span>
            <span style={{ opacity: 0.8 }}>PANGGUNG KELIR DIGITAL</span>
          </div>
        </div>

        {/* Karakter Wayang di Atas Kelir */}
        {characters.map((char) => {
          const isSelected = char.instanceId === selectedInstanceId;
          const leftPercent = `${(char.x * 100).toFixed(2)}%`;
          const topPercent = `${(char.y * 100).toFixed(2)}%`;

          return (
            <div
              key={char.instanceId}
              onPointerDown={(e) => handlePointerDown(e, char)}
              style={{
                position: 'absolute',
                left: leftPercent,
                top: topPercent,
                transform: 'translate(-50%, -65%)',
                zIndex: isSelected ? 10 : 5,
                transition: draggingId === char.instanceId ? 'none' : 'filter 0.2s',
              }}
            >
              {/* Balon Dialog Wayang jika ada naskah */}
              {char.dialogue && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%) translateY(-10px)',
                    maxWidth: '220px',
                    minWidth: '120px',
                    padding: '8px 12px',
                    background: 'rgba(23, 23, 23, 0.88)',
                    backdropFilter: 'blur(8px)',
                    border: `1.5px solid ${char.accentColor || '#f59e0b'}`,
                    borderRadius: '10px',
                    color: '#fef3c7',
                    fontSize: '12px',
                    lineHeight: '1.4',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                    zIndex: 20,
                  }}
                >
                  <div style={{ fontWeight: '600', color: char.accentColor, fontSize: '10px', marginBottom: '2px' }}>
                    {char.name}
                  </div>
                  <div>"{char.dialogue}"</div>
                  {/* Panah Balon Dialog */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      borderWidth: '6px',
                      borderStyle: 'solid',
                      borderColor: `${char.accentColor || '#f59e0b'} transparent transparent transparent`,
                    }}
                  />
                </div>
              )}

              {/* Komponen Wayang SVG */}
              <WayangFigureSvg
                slug={char.slug}
                pose={char.pose}
                facing={char.facing}
                scale={char.scale}
                isSelected={isSelected}
                accentColor={char.accentColor}
              />
            </div>
          );
        })}

        {/* Panel Cepat Dalang (SFX Controller di Pojok Panggung) */}
        {isInteractive && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              zIndex: 15,
              display: 'flex',
              gap: '6px',
              background: 'rgba(15, 12, 8, 0.75)',
              backdropFilter: 'blur(8px)',
              padding: '6px 10px',
              borderRadius: '24px',
              border: '1px solid rgba(217, 119, 6, 0.4)',
            }}
          >
            <button
              onClick={() => handlePlaySfx('dodogan')}
              title="Ketuk Dodogan Kotak Dalang"
              style={{
                background: '#451a03',
                border: '1px solid #b45309',
                color: '#fef3c7',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Dodogan
            </button>
            <button
              onClick={() => handlePlaySfx('kepyak')}
              title="Gemerincing Kepyak Dalang"
              style={{
                background: '#451a03',
                border: '1px solid #b45309',
                color: '#fef3c7',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Kepyak
            </button>
            <button
              onClick={() => handlePlaySfx('gong')}
              title="Gong Ageng Pamungkas"
              style={{
                background: '#451a03',
                border: '1px solid #b45309',
                color: '#fef3c7',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Gong
            </button>

            {/* Volume Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingLeft: '4px', borderLeft: '1px solid rgba(217,119,6,0.3)' }}>
              <Volume2 size={12} color="#f59e0b" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setVolume(val);
                  soundEngine.setVolume(val / 100);
                }}
                title={`Volume: ${volume}%`}
                style={{ width: '50px', height: '4px', accentColor: '#f59e0b', cursor: 'pointer' }}
              />
            </div>
          </div>
        )}

        {/* Petunjuk Interaksi jika belum memilih karakter */}
        {isInteractive && !selectedChar && characters.length > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: '16%',
              right: '16px',
              zIndex: 15,
              background: 'rgba(0,0,0,0.65)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              color: '#d4d4d8',
              pointerEvents: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            Klik & geser wayang untuk memindahkan posisi
          </div>
        )}
      </div>

      {/* Floating Action Toolbar untuk Karakter yang Sedang Terpilih */}
      {isInteractive && selectedChar && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            background: '#1c1917',
            borderTop: '1px solid #442a17',
            color: '#f3f4f6',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: selectedChar.accentColor }}>
              {selectedChar.name}
            </span>
            <span style={{ fontSize: '11px', color: '#9ca3af' }}>
              (Posisi: {Math.round(selectedChar.x * 100)}%, {Math.round(selectedChar.y * 100)}%)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Balik Arah Hadap (Flip) */}
            <button
              onClick={() =>
                onUpdateCharacter(selectedChar.instanceId, {
                  facing: selectedChar.facing === 'left' ? 'right' : 'left',
                })
              }
              title="Balik Arah Hadap (Kiri/Kanan)"
              style={actionBtnStyle}
            >
              Hadap {selectedChar.facing === 'left' ? 'Kiri' : 'Kanan'}
            </button>

            {/* Ubah Ukuran (Scale) */}
            <button
              onClick={() =>
                onUpdateCharacter(selectedChar.instanceId, {
                  scale: Math.max(0.7, Number((selectedChar.scale - 0.1).toFixed(1))),
                })
              }
              title="Perkecil Wayang"
              style={actionBtnStyle}
            >
              <ZoomOut size={14} />
            </button>
            <span style={{ fontSize: '11px', padding: '0 4px' }}>{selectedChar.scale}x</span>
            <button
              onClick={() =>
                onUpdateCharacter(selectedChar.instanceId, {
                  scale: Math.min(1.5, Number((selectedChar.scale + 0.1).toFixed(1))),
                })
              }
              title="Perbesar Wayang"
              style={actionBtnStyle}
            >
              <ZoomIn size={14} />
            </button>

            {/* D-Pad Geser Aksesibel (NFR-06) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: '#292524', border: '1px solid #78350f', borderRadius: '6px', padding: '1px 2px' }}>
              <button
                onClick={() => onUpdateCharacter(selectedChar.instanceId, { x: selectedChar.x - 0.02 })}
                title="Geser Kiri (atau Panah Kiri Keyboard)"
                style={miniNudgeBtnStyle}
              >
                <ArrowLeft size={12} />
              </button>
              <button
                onClick={() => onUpdateCharacter(selectedChar.instanceId, { y: selectedChar.y - 0.02 })}
                title="Geser Atas (atau Panah Atas Keyboard)"
                style={miniNudgeBtnStyle}
              >
                <ArrowUp size={12} />
              </button>
              <button
                onClick={() => onUpdateCharacter(selectedChar.instanceId, { y: selectedChar.y + 0.02 })}
                title="Geser Bawah (atau Panah Bawah Keyboard)"
                style={miniNudgeBtnStyle}
              >
                <ArrowDown size={12} />
              </button>
              <button
                onClick={() => onUpdateCharacter(selectedChar.instanceId, { x: selectedChar.x + 0.02 })}
                title="Geser Kanan (atau Panah Kanan Keyboard)"
                style={miniNudgeBtnStyle}
              >
                <ArrowRight size={12} />
              </button>
            </div>

            {/* Pilihan Pose Cepat */}
            <select
              value={selectedChar.pose}
              onChange={(e) => onUpdateCharacter(selectedChar.instanceId, { pose: e.target.value })}
              style={{
                background: '#292524',
                color: '#fef3c7',
                border: '1px solid #78350f',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              {STAGE_CONFIG_MASTER.poses.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>

            {/* Hapus Wayang dari Panggung */}
            <button
              onClick={() => onRemoveCharacter(selectedChar.instanceId)}
              title="Hapus Wayang dari Adegan ini"
              style={{ ...actionBtnStyle, background: '#7f1d1d', borderColor: '#ef4444' }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const actionBtnStyle = {
  background: '#292524',
  border: '1px solid #78350f',
  color: '#fef3c7',
  padding: '4px 10px',
  borderRadius: '6px',
  fontSize: '11px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

const miniNudgeBtnStyle = {
  background: 'transparent',
  border: 'none',
  color: '#fef3c7',
  padding: '3px 4px',
  borderRadius: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
