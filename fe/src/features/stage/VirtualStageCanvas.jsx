import React, { useRef, useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import RealLeatherPuppet from '../../components/stage/RealLeatherPuppet';
import { updatePuppetArmsDOM } from '../../services/vision/puppetIkSolver';
import { getBackgroundById, STAGE_CONFIG_MASTER } from '../../data/master/stageConfigMaster';
import soundEngine from '../../services/soundscape';
import { ZoomIn, ZoomOut, Trash2, Volume2, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

const VirtualStageCanvas = forwardRef(function VirtualStageCanvas({
  scene,
  selectedInstanceId,
  onSelectCharacter,
  onUpdateCharacter,
  onRemoveCharacter,
  isInteractive = true,
  isVisionActive = false,
}, ref) {
  const containerRef = useRef(null);
  const charDomRefs = useRef({});
  const [draggingId, setDraggingId] = useState(null);
  const draggingIdRef = useRef(null);
  const dragPosRef = useRef(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [volume, setVolume] = useState(70);

  const bgConfig = getBackgroundById(scene?.background);
  const characters = useMemo(() => scene?.characters || [], [scene?.characters]);
  const selectedChar = characters.find((c) => c.instanceId === selectedInstanceId);

  // Ekspos manipulasi DOM langsung ke Dalang Vision (0x React Re-render = 60/120 FPS Butter Smooth)
  useImperativeHandle(ref, () => ({
    directUpdate: (instanceId, updates) => {
      const el = charDomRefs.current[instanceId];
      if (!el) return;

      if (updates.x !== undefined) {
        el.style.left = `${(updates.x * 100).toFixed(2)}%`;
      }
      if (updates.y !== undefined) {
        el.style.top = `${(updates.y * 100).toFixed(2)}%`;
      }
      if (updates.facing !== undefined) {
        const puppetEl = el.querySelector('.real-leather-puppet-container') || el.querySelector('svg > g');
        if (puppetEl) {
          const char = characters.find((c) => c.instanceId === instanceId);
          const sc = char?.scale || 1.0;
          if (puppetEl.tagName.toLowerCase() === 'div') {
            const isFlipped = updates.facing === 'right';
            puppetEl.style.transform = `scale(${isFlipped ? -sc : sc}, ${sc})`;
          } else {
            puppetEl.setAttribute('transform', `scale(${updates.facing === 'left' ? -sc : sc}, ${sc})`);
          }
        }
      }
      if (updates.fingerTargets) {
        updatePuppetArmsDOM(el, updates.fingerTargets);
      }
    },
  }), [characters]);

  // Kontrol Skala Global Cepat Wayang (Memperbesar / Memperkecil)
  const handleGlobalScaleChange = (delta) => {
    if (characters.length === 0) return;
    const current = (selectedChar || characters[0])?.scale || 1.0;
    const newScale = Math.max(0.5, Math.min(2.2, Number((current + delta).toFixed(1))));
    if (selectedInstanceId) {
      onUpdateCharacter(selectedInstanceId, { scale: newScale });
    } else {
      characters.forEach((c) => {
        onUpdateCharacter(c.instanceId, { scale: newScale });
      });
    }
  };

  // Pemicu SFX Dalang
  const handlePlaySfx = (type) => {
    if (type === 'dodogan') soundEngine.playDodogan();
    else if (type === 'kepyak') soundEngine.playKepyak();
    else if (type === 'gong') soundEngine.playGong();
  };

  // Dragging Handlers: Direct DOM 120 FPS Hardware Accelerated Dragging (Zero React Re-render Lag)
  const handlePointerDown = (e, char) => {
    if (!isInteractive) return;
    e.stopPropagation();
    onSelectCharacter(char.instanceId);

    const rect = containerRef.current.getBoundingClientRect();
    const charPxX = char.x * rect.width;
    const charPxY = char.y * rect.height;

    setDraggingId(char.instanceId);
    draggingIdRef.current = char.instanceId;
    dragPosRef.current = { x: char.x, y: char.y };
    setDragOffset({
      x: e.clientX - rect.left - charPxX,
      y: e.clientY - rect.top - charPxY,
    });

    // Mainkan suara dodogan halus saat wayang dipegang
    soundEngine.playDodogan();
  };

  const handlePointerMove = (e) => {
    const currentDragId = draggingIdRef.current;
    if (!currentDragId || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left - dragOffset.x;
    const currentY = e.clientY - rect.top - dragOffset.y;

    const normX = Math.max(0.06, Math.min(0.94, currentX / rect.width));
    const normY = Math.max(0.35, Math.min(0.85, currentY / rect.height));

    dragPosRef.current = { x: normX, y: normY };

    // Manipulasi DOM langsung pada frame event mouse: 120 FPS ultra-lancar
    const el = charDomRefs.current[currentDragId];
    if (el) {
      el.style.left = `${(normX * 100).toFixed(2)}%`;
      el.style.top = `${(normY * 100).toFixed(2)}%`;
    }
  };

  const handlePointerUp = () => {
    const currentDragId = draggingIdRef.current;
    if (currentDragId) {
      if (dragPosRef.current) {
        onUpdateCharacter(currentDragId, dragPosRef.current);
        dragPosRef.current = null;
      }
      draggingIdRef.current = null;
      setDraggingId(null);
      // Bunyi kepyak saat wayang ditancapkan
      soundEngine.playKepyak();
    }
  };

  useEffect(() => {
    const handleGlobalUp = () => {
      const currentDragId = draggingIdRef.current;
      if (currentDragId) {
        if (dragPosRef.current) {
          onUpdateCharacter(currentDragId, dragPosRef.current);
          dragPosRef.current = null;
        }
        draggingIdRef.current = null;
        setDraggingId(null);
        soundEngine.playKepyak();
      }
    };
    window.addEventListener('pointerup', handleGlobalUp);
    return () => window.removeEventListener('pointerup', handleGlobalUp);
  }, [onUpdateCharacter]);

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
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        const nextFacing = char.facing === 'left' ? 'right' : 'left';
        onUpdateCharacter(selectedInstanceId, { facing: nextFacing });
        soundEngine.playDodogan();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedInstanceId, isInteractive, characters, onUpdateCharacter]);

  return (
    <div
      className="stage-gawangan-frame"
    >
      {/* Ornamen Sudut Prada Kencana Plawah */}
      <div style={{ position: 'absolute', top: '10px', left: '10px', width: '14px', height: '14px', borderTop: '2px solid #d4af37', borderLeft: '2px solid #d4af37', pointerEvents: 'none', zIndex: 20 }} />
      <div style={{ position: 'absolute', top: '10px', right: '10px', width: '14px', height: '14px', borderTop: '2px solid #d4af37', borderRight: '2px solid #d4af37', pointerEvents: 'none', zIndex: 20 }} />
      <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '14px', height: '14px', borderBottom: '2px solid #d4af37', borderLeft: '2px solid #d4af37', pointerEvents: 'none', zIndex: 20 }} />
      <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '14px', height: '14px', borderBottom: '2px solid #d4af37', borderRight: '2px solid #d4af37', pointerEvents: 'none', zIndex: 20 }} />

      <div className="stage-gawangan-inner" style={{ backgroundColor: bgConfig.bgColor }}>
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
              height: '13.5%',
              background: 'linear-gradient(180deg, #2b1f13 0%, #1a140c 35%, #152216 65%, #0f1710 100%)',
              borderTop: '2px solid rgba(212, 175, 55, 0.45)',
              zIndex: 3,
              boxShadow: '0 -6px 20px rgba(0, 0, 0, 0.65)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 18px',
                fontSize: '10.5px',
                color: '#d4af37',
                letterSpacing: '1.2px',
                fontWeight: '700',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#d4af37' }} />
                PALAHAN DEBOG TANCEPAN
              </span>
              <span style={{ opacity: 0.75, letterSpacing: '0.8px' }}>PANGGUNG KELIR PURWA</span>
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
              ref={(el) => {
                if (el) charDomRefs.current[char.instanceId] = el;
                else delete charDomRefs.current[char.instanceId];
              }}
              onPointerDown={(e) => handlePointerDown(e, char)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                const nextFacing = char.facing === 'left' ? 'right' : 'left';
                onUpdateCharacter(char.instanceId, { facing: nextFacing });
                soundEngine.playDodogan();
              }}
              style={{
                position: 'absolute',
                left: leftPercent,
                top: topPercent,
                transform: 'translate(-50%, -65%)',
                zIndex: isSelected ? 10 : 5,
                willChange: (isVisionActive || draggingId === char.instanceId) ? 'left, top' : 'auto',
                transition: isVisionActive
                  ? 'none' // Zero latency: manipulasi DOM langsung meluncur 60-120 FPS tanpa hambatan interpolasi
                  : draggingId === char.instanceId
                  ? 'none'
                  : 'filter 0.2s, left 0.15s ease-out, top 0.15s ease-out',
              }}
            >
              {/* Tombol Aksi Cepat: Balik Arah Hadap (Flip) */}
              {isSelected && !isVisionActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-32px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 25,
                    pointerEvents: 'auto',
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const nextFacing = char.facing === 'left' ? 'right' : 'left';
                      onUpdateCharacter(char.instanceId, { facing: nextFacing });
                      soundEngine.playDodogan();
                    }}
                    title="Balik Arah Hadap Wayang (Shortcut: F / Klik Dua Kali)"
                    style={{
                      background: '#23180f',
                      border: '1px solid rgba(212, 175, 55, 0.65)',
                      color: '#fef08a',
                      borderRadius: '16px',
                      padding: '3px 10px',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span>⇄ Balik (F)</span>
                  </button>
                </div>
              )}
              {/* Balon Dialog Wayang jika ada naskah (Pita Sabda Dalang) */}
              {char.dialogue && !isVisionActive && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%) translateY(-12px)',
                    maxWidth: '240px',
                    minWidth: '130px',
                    padding: '8px 14px',
                    background: 'rgba(20, 14, 9, 0.94)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: `1.5px solid ${char.accentColor || '#d4af37'}`,
                    borderRadius: '12px',
                    color: '#fef08a',
                    fontSize: '12px',
                    lineHeight: '1.45',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.65)',
                    zIndex: 20,
                  }}
                >
                  <div style={{ fontWeight: '800', color: char.accentColor || '#d4af37', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px' }}>
                    {char.name}
                  </div>
                  <div style={{ fontStyle: 'italic', color: '#fcfaf2' }}>"{char.dialogue}"</div>
                  {/* Panah Balon Dialog */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      borderWidth: '6px',
                      borderStyle: 'solid',
                      borderColor: `${char.accentColor || '#d4af37'} transparent transparent transparent`,
                    }}
                  />
                </div>
              )}

              {/* Komponen Wayang Kulit Beneran dengan Tekstur Asli, Gapit Tanduk, & Dukungan Unggah Sendiri */}
              <RealLeatherPuppet
                slug={char.slug}
                customImageUrl={char.customImageUrl}
                facing={char.facing}
                scale={char.scale}
                fingerTargets={char.fingerTargets}
                isSelected={isSelected}
                isKiprah={char.pose === 'perang'}
                width={190}
                height={290}
              />
            </div>
          );
        })}

        {/* Panel Cepat Dalang (SFX Controller & Volume Gamelan di Pojok Panggung) */}
        {isInteractive && (
          <div
            className="stage-canvas-sfx-overlay-desktop"
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              zIndex: 15,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(20, 14, 9, 0.88)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              padding: '5px 10px',
              borderRadius: '9999px',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.55)',
            }}
          >
            <button
              onClick={() => handlePlaySfx('dodogan')}
              title="Ketuk Dodogan Kotak Dalang (Keyboard: Space)"
              style={{
                background: 'rgba(45, 30, 20, 0.9)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                color: '#fef08a',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: '750',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d4af37';
                e.currentTarget.style.background = '#3c2718';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
                e.currentTarget.style.background = 'rgba(45, 30, 20, 0.9)';
              }}
            >
              <span>🥁</span>
              <span>Dodogan</span>
            </button>
            <button
              onClick={() => handlePlaySfx('kepyak')}
              title="Gemerincing Kepyak Dalang (Keyboard: Shift)"
              style={{
                background: 'rgba(45, 30, 20, 0.9)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                color: '#fef08a',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: '750',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d4af37';
                e.currentTarget.style.background = '#3c2718';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
                e.currentTarget.style.background = 'rgba(45, 30, 20, 0.9)';
              }}
            >
              <span>🔔</span>
              <span>Kepyak</span>
            </button>
            <button
              onClick={() => handlePlaySfx('gong')}
              title="Gong Ageng Pamungkas (Keyboard: G)"
              style={{
                background: 'rgba(45, 30, 20, 0.9)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                color: '#fef08a',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: '750',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d4af37';
                e.currentTarget.style.background = '#3c2718';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
                e.currentTarget.style.background = 'rgba(45, 30, 20, 0.9)';
              }}
            >
              <span>🎵</span>
              <span>Gong</span>
            </button>

            {/* Volume Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', paddingLeft: '6px', borderLeft: '1px solid rgba(212, 175, 55, 0.25)' }}>
              <Volume2 size={13} color="#d4af37" />
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
                title={`Volume Suara: ${volume}%`}
                style={{ width: '56px', height: '4px', accentColor: '#d4af37', cursor: 'pointer' }}
              />
            </div>
          </div>
        )}

        {/* Tombol Skala Bentuk Wayang Cepat Mengambang di Pojok Kanan Atas Panggung */}
        {isInteractive && characters.length > 0 && (
          <div
            className="stage-canvas-scale-overlay-desktop"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              zIndex: 15,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(20, 14, 9, 0.88)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              padding: '5px 12px',
              borderRadius: '9999px',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.55)',
            }}
          >
            <span style={{ fontSize: '11px', color: '#d4af37', fontWeight: '800', letterSpacing: '0.04em' }}>
              Skala:
            </span>
            <button
              type="button"
              onClick={() => handleGlobalScaleChange(-0.1)}
              title="Perkecil Ukuran Bentuk Wayang (-)"
              style={stageScaleBtnStyle}
            >
              <ZoomOut size={12} color="#fef08a" />
            </button>
            <span style={{ fontSize: '11.5px', fontWeight: '850', color: '#fef08a', minWidth: '28px', textAlign: 'center' }}>
              {(selectedChar?.scale || characters[0]?.scale || 1.0).toFixed(1)}x
            </span>
            <button
              type="button"
              onClick={() => handleGlobalScaleChange(0.1)}
              title="Perbesar Ukuran Bentuk Wayang (+)"
              style={stageScaleBtnStyle}
            >
              <ZoomIn size={12} color="#fef08a" />
            </button>
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
              background: 'rgba(20, 14, 9, 0.85)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: '600',
              color: '#f0e4d0',
              pointerEvents: 'none',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
            }}
          >
            Klik & geser wayang untuk mengatur posisi solah
          </div>
        )}
      </div>
      </div>

      {/* Mobile Dalang Touch Dock: Pengendali SFX Gamelan & Skala Wayang di Bawah Panggung */}
      {isInteractive && (
        <div className="stage-mobile-touch-dock">
          <div className="stage-mobile-sfx-cluster">
            <button
              type="button"
              onClick={() => handlePlaySfx('dodogan')}
              className="stage-mobile-dock-btn"
              title="Ketuk Dodogan Kotak Dalang"
            >
              🥁 Dodogan
            </button>
            <button
              type="button"
              onClick={() => handlePlaySfx('kepyak')}
              className="stage-mobile-dock-btn"
              title="Gemerincing Kepyak Dalang"
            >
              🔔 Kepyak
            </button>
            <button
              type="button"
              onClick={() => handlePlaySfx('gong')}
              className="stage-mobile-dock-btn"
              title="Gong Ageng Pamungkas"
            >
              🎵 Gong
            </button>
          </div>

          {characters.length > 0 && (
            <div className="stage-mobile-scale-cluster">
              <button
                type="button"
                onClick={() => handleGlobalScaleChange(-0.1)}
                className="stage-mobile-scale-btn"
                title="Perkecil Ukuran Wayang"
              >
                <ZoomOut size={13} color="#fef3c7" />
              </button>
              <span className="stage-mobile-scale-text">
                {(selectedChar?.scale || characters[0]?.scale || 1.0).toFixed(1)}x
              </span>
              <button
                type="button"
                onClick={() => handleGlobalScaleChange(0.1)}
                className="stage-mobile-scale-btn"
                title="Perbesar Ukuran Wayang"
              >
                <ZoomIn size={13} color="#fef3c7" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating Action Toolbar untuk Karakter yang Sedang Terpilih (Floating Dalang Toolbelt) */}
      {isInteractive && selectedChar && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            background: 'linear-gradient(180deg, #1d140e 0%, #150f0a 100%)',
            borderTop: '1px solid rgba(212, 175, 55, 0.32)',
            color: '#fcfaf2',
            gap: '10px',
            borderRadius: '0 0 14px 14px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: selectedChar.accentColor || '#d4af37',
                boxShadow: `0 0 8px ${selectedChar.accentColor || '#d4af37'}`,
              }}
            />
            <span style={{ fontSize: '13px', fontWeight: '850', color: '#fcfaf2' }}>
              {selectedChar.name}
            </span>
            <span style={{ fontSize: '11px', color: '#c4b5a3', background: 'rgba(212, 175, 55, 0.1)', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              Posisi: {Math.round(selectedChar.x * 100)}%, {Math.round(selectedChar.y * 100)}%
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
            {/* Balik Arah Hadap (Flip) */}
            <button
              onClick={() =>
                onUpdateCharacter(selectedChar.instanceId, {
                  facing: selectedChar.facing === 'left' ? 'right' : 'left',
                })
              }
              title="Balik Arah Hadap (Shortcut: F / Klik Dua Kali)"
              style={actionBtnStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d4af37';
                e.currentTarget.style.background = '#2c1e14';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.32)';
                e.currentTarget.style.background = 'rgba(34, 24, 16, 0.9)';
              }}
            >
              <span>🔄</span>
              <span>Hadap {selectedChar.facing === 'left' ? 'Kiri' : 'Kanan'}</span>
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
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d4af37';
                e.currentTarget.style.background = '#2c1e14';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.32)';
                e.currentTarget.style.background = 'rgba(34, 24, 16, 0.9)';
              }}
            >
              <ZoomOut size={13} />
            </button>
            <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#fef08a', padding: '0 4px' }}>
              {selectedChar.scale}x
            </span>
            <button
              onClick={() =>
                onUpdateCharacter(selectedChar.instanceId, {
                  scale: Math.min(1.5, Number((selectedChar.scale + 0.1).toFixed(1))),
                })
              }
              title="Perbesar Wayang"
              style={actionBtnStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d4af37';
                e.currentTarget.style.background = '#2c1e14';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.32)';
                e.currentTarget.style.background = 'rgba(34, 24, 16, 0.9)';
              }}
            >
              <ZoomIn size={13} />
            </button>

            {/* D-Pad Geser Aksesibel */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'rgba(26, 18, 12, 0.95)', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: '8px', padding: '2px 4px' }}>
              <button
                onClick={() => onUpdateCharacter(selectedChar.instanceId, { x: selectedChar.x - 0.02 })}
                title="Geser Kiri (Keyboard: Panah Kiri)"
                style={miniNudgeBtnStyle}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <ArrowLeft size={13} />
              </button>
              <button
                onClick={() => onUpdateCharacter(selectedChar.instanceId, { y: selectedChar.y - 0.02 })}
                title="Geser Atas (Keyboard: Panah Atas)"
                style={miniNudgeBtnStyle}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <ArrowUp size={13} />
              </button>
              <button
                onClick={() => onUpdateCharacter(selectedChar.instanceId, { y: selectedChar.y + 0.02 })}
                title="Geser Bawah (Keyboard: Panah Bawah)"
                style={miniNudgeBtnStyle}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <ArrowDown size={13} />
              </button>
              <button
                onClick={() => onUpdateCharacter(selectedChar.instanceId, { x: selectedChar.x + 0.02 })}
                title="Geser Kanan (Keyboard: Panah Kanan)"
                style={miniNudgeBtnStyle}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Pilihan Pose Cepat */}
            <select
              value={selectedChar.pose}
              onChange={(e) => onUpdateCharacter(selectedChar.instanceId, { pose: e.target.value })}
              style={{
                background: 'rgba(34, 24, 16, 0.95)',
                color: '#fef08a',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                borderRadius: '8px',
                padding: '7px 10px',
                fontSize: '11.5px',
                fontWeight: '700',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {STAGE_CONFIG_MASTER.poses.map((p) => (
                <option key={p.id} value={p.id} style={{ background: '#1c140e', color: '#fef08a' }}>
                  Pose: {p.label}
                </option>
              ))}
            </select>

            {/* Hapus Wayang dari Panggung */}
            <button
              onClick={() => onRemoveCharacter(selectedChar.instanceId)}
              title="Hapus Wayang dari Adegan ini"
              style={{
                ...actionBtnStyle,
                background: 'rgba(127, 29, 29, 0.75)',
                borderColor: 'rgba(239, 68, 68, 0.5)',
                color: '#fecaca',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#991b1b';
                e.currentTarget.style.borderColor = '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(127, 29, 29, 0.75)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
              }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default VirtualStageCanvas;

const actionBtnStyle = {
  background: 'rgba(34, 24, 16, 0.9)',
  border: '1px solid rgba(212, 175, 55, 0.32)',
  color: '#fcfaf2',
  padding: '6px 14px',
  borderRadius: '10px',
  fontSize: '12px',
  fontWeight: '700',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '36px',
  gap: '6px',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
};

const miniNudgeBtnStyle = {
  background: 'transparent',
  border: 'none',
  color: '#e8bb5c',
  padding: '4px 6px',
  minWidth: '32px',
  minHeight: '32px',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.15s ease',
};

const stageScaleBtnStyle = {
  background: 'rgba(45, 32, 20, 0.95)',
  border: '1px solid rgba(212, 175, 55, 0.38)',
  color: '#fef08a',
  padding: '4px 8px',
  minWidth: '32px',
  minHeight: '32px',
  borderRadius: '10px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
};

