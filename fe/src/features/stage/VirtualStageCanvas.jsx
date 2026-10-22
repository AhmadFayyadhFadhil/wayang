import React, { useRef, useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import RealLeatherPuppet from '../../components/stage/RealLeatherPuppet';
import { updatePuppetArmsDOM } from '../../services/vision/puppetIkSolver';
import { getBackgroundById } from '../../data/master/stageConfigMaster';
import soundEngine from '../../services/soundscape';

const VirtualStageCanvas = forwardRef(function VirtualStageCanvas({
  scene,
  selectedInstanceId,
  onSelectCharacter,
  onUpdateCharacter,
  onOpenAddCharacter,
  isInteractive = true,
  isVisionActive = false,
}, ref) {
  const containerRef = useRef(null);
  const charDomRefs = useRef({});
  const [draggingId, setDraggingId] = useState(null);
  const draggingIdRef = useRef(null);
  const dragPosRef = useRef(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showDragTip, setShowDragTip] = useState(() => {
    try {
      return !localStorage.getItem('wayang_drag_tip_seen');
    } catch {
      return false;
    }
  });

  const bgConfig = getBackgroundById(scene?.background);
  const characters = useMemo(() => scene?.characters || [], [scene?.characters]);
  const selectedChar = characters.find((c) => c.instanceId === selectedInstanceId);

  // Dialog yang aktif untuk subtitle sinematik (prioritaskan tokoh terpilih, lalu tokoh manapun yang memiliki naskah)
  const activeDialogueChar = useMemo(() => {
    if (selectedChar && selectedChar.dialogue) return selectedChar;
    return characters.find((c) => c.dialogue);
  }, [selectedChar, characters]);

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

  // Dragging Handlers: Direct DOM 120 FPS Hardware Accelerated Dragging
  const handlePointerDown = (e, char) => {
    if (!isInteractive) return;
    e.stopPropagation();
    onSelectCharacter(char.instanceId);

    if (showDragTip) {
      try {
        localStorage.setItem('wayang_drag_tip_seen', 'true');
      } catch {
        // storage fallback
      }
      setShowDragTip(false);
    }

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

    // Suara dodogan halus saat wayang dipegang
    try {
      soundEngine.playDodogan();
    } catch {
      // Audio fail-soft
    }
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

    // Manipulasi DOM langsung pada frame event mouse: 120 FPS
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
      try {
        soundEngine.playKepyak();
      } catch {
        // Audio fail-soft
      }
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
      }
    };
    window.addEventListener('pointerup', handleGlobalUp);
    return () => window.removeEventListener('pointerup', handleGlobalUp);
  }, [onUpdateCharacter]);

  // Aksesibilitas Keyboard
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
        try { soundEngine.playDodogan(); } catch {}
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onUpdateCharacter(selectedInstanceId, { x: char.x + step });
        try { soundEngine.playDodogan(); } catch {}
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        onUpdateCharacter(selectedInstanceId, { y: char.y - step });
        try { soundEngine.playDodogan(); } catch {}
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onUpdateCharacter(selectedInstanceId, { y: char.y + step });
        try { soundEngine.playDodogan(); } catch {}
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        const nextFacing = char.facing === 'left' ? 'right' : 'left';
        onUpdateCharacter(selectedInstanceId, { facing: nextFacing });
        try { soundEngine.playDodogan(); } catch {}
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedInstanceId, isInteractive, characters, onUpdateCharacter]);

  return (
    <div className="stage-gawangan-frame">
      {/* Ornamen Sudut Prada Kencana */}
      <div className="stage-frame-corner top-left" />
      <div className="stage-frame-corner top-right" />
      <div className="stage-frame-corner bottom-left" />
      <div className="stage-frame-corner bottom-right" />

      <div className="stage-gawangan-inner" style={{ backgroundColor: bgConfig.bgColor }}>
        {/* Kanvas Panggung Utama (16:9 Rasio Terpelihara) */}
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={() => isInteractive && onSelectCharacter(null)}
          className="stage-canvas-viewport"
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%', // 16:9 Aspect Ratio
            cursor: draggingId ? 'grabbing' : 'default',
            overflow: 'hidden',
            background: `radial-gradient(ellipse at 50% 25%, ${bgConfig.glowColor}44 0%, ${bgConfig.kelirColor} 45%, ${bgConfig.bgColor} 100%)`,
          }}
        >
          {/* Latar Gambar Panggung jika tersedia */}
          {bgConfig.bgImage && (
            <img
              src={bgConfig.bgImage}
              alt={bgConfig.name}
              className="stage-canvas-bg-image"
              style={{
                opacity: bgConfig.imageOpacity || 0.9,
              }}
            />
          )}

          {/* Lampu Blencong Keemasan dengan Denyut Bernafas Sakral (5.5s Cycle) */}
          <div
            className="blencong-light-aura"
            style={{
              background: `radial-gradient(circle, ${bgConfig.glowColor} 0%, rgba(245, 158, 11, 0.4) 40%, transparent 70%)`,
            }}
          />

          {/* Siluet Debog (Batang Pisang Tempat Tancep Wayang) */}
          <div className="stage-debog-bar">
            <div className="stage-debog-inner">
              <span className="debog-pathet-pill">
                PATHET {bgConfig.pathet?.toUpperCase() || 'NEM'} • SUASANA {bgConfig.name?.toUpperCase()}
              </span>
              <span className="debog-audio-cue">
                GARIS TANCEP WAYANG PURWA
              </span>
            </div>
          </div>

          {/* Tokoh Wayang Kulit di Atas Panggung */}
          {characters.map((char, idx) => {
            const isSelected = selectedInstanceId === char.instanceId;
            const isDragging = draggingId === char.instanceId;
            const swayDuration = `${5.2 + (idx % 3) * 0.9}s`;

            return (
              <div
                key={char.instanceId}
                ref={(el) => {
                  if (el) charDomRefs.current[char.instanceId] = el;
                  else delete charDomRefs.current[char.instanceId];
                }}
                onPointerDown={(e) => handlePointerDown(e, char)}
                className={`stage-puppet-node ${isSelected ? 'is-selected' : ''} ${isDragging ? 'is-dragging' : 'wayang-idle-sway'}`}
                style={{
                  left: `${(char.x * 100).toFixed(2)}%`,
                  top: `${(char.y * 100).toFixed(2)}%`,
                  cursor: isInteractive ? (isDragging ? 'grabbing' : 'grab') : 'default',
                  zIndex: isSelected ? 12 : 5,
                  animationDuration: swayDuration,
                }}
              >
                {/* Ring Seleksi Halus */}
                {isSelected && isInteractive && (
                  <div
                    className="puppet-selection-ring"
                    style={{ borderColor: char.accentColor || '#d4af37' }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateCharacter(char.instanceId, {
                          facing: char.facing === 'left' ? 'right' : 'left',
                        });
                        try { soundEngine.playDodogan(); } catch {}
                      }}
                      title="Balik Arah Hadap (Shortcut: F)"
                      className="puppet-flip-pill"
                    >
                      <span>⇄ Balik (F)</span>
                    </button>
                  </div>
                )}

                {/* Komponen Wayang Kulit Tatah Sungging Asli */}
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

          {/* Subtitle Sinematik di Dasar Kelir (Menggantikan Balon Melayang) */}
          {activeDialogueChar && !isVisionActive && (
            <div className="kelir-cinematic-subtitle-bar">
              <div className="subtitle-char-label">
                <span
                  className="subtitle-char-dot"
                  style={{ background: activeDialogueChar.accentColor || '#d4af37' }}
                />
                <span
                  className="subtitle-char-name"
                  style={{ color: activeDialogueChar.accentColor || '#e8bb5c' }}
                >
                  {activeDialogueChar.name}
                </span>
              </div>
              <p className="subtitle-dialogue-text">
                &ldquo;{activeDialogueChar.dialogue}&rdquo;
              </p>
            </div>
          )}

          {/* Watermark Nama Kelir di Pojok Kiri Bawah */}
          <div className="kelir-name-watermark">
            <span>{bgConfig?.name || 'Kelir Blencong Klasik'}</span>
          </div>

          {/* Kontrol Zoom Mini Non-Intrusif di Pojok Kanan Bawah */}
          {isInteractive && characters.length > 0 && (
            <div className="kelir-zoom-control">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGlobalScaleChange(-0.1);
                }}
                title="Perkecil Ukuran Bentuk Wayang (−)"
                aria-label="Perkecil Wayang"
                className="kelir-zoom-btn"
              >
                −
              </button>
              <span className="kelir-zoom-value">
                {(selectedChar?.scale || characters[0]?.scale || 1.0).toFixed(1)}x
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGlobalScaleChange(0.1);
                }}
                title="Perbesar Ukuran Bentuk Wayang (＋)"
                aria-label="Perbesar Wayang"
                className="kelir-zoom-btn"
              >
                ＋
              </button>
            </div>
          )}

          {/* Petunjuk Interaksi Halus Sekali Muncul */}
          {showDragTip && characters.length > 0 && !selectedChar && (
            <div className="kelir-drag-tip">
              Klik &amp; geser wayang untuk mengatur posisi solah
            </div>
          )}

          {/* Empty State Jika Belum Ada Tokoh di Babak Ini */}
          {characters.length === 0 && (
            <div className="kelir-empty-state">
              <div className="kelir-empty-glyph">ꦥꦁꦒꦸꦁ</div>
              <div className="kelir-empty-title">Kelir Suwung • Siap Digelar</div>
              <p className="kelir-empty-sub">
                Panggung siap dibuka. Tancapkan tokoh pertama untuk mengawali lakon pedalangan babak ini.
              </p>
              {onOpenAddCharacter && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenAddCharacter();
                  }}
                  className="kelir-empty-add-btn"
                >
                  ＋ Tancap Tokoh Pertama
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default VirtualStageCanvas;
