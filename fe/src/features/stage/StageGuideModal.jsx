import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  X,
  Sparkles,
  MessageSquare,
  Play,
  ArrowRight,
  ArrowLeft,
  Check,
  Hand,
  Save,
  Volume2,
  Image as ImageIcon,
  Users,
} from 'lucide-react';

export default function StageGuideModal({ isOpen, onClose }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  const steps = useMemo(
    () => [
      {
        stepNumber: 1,
        glyph: 'ꦥꦁꦒꦸꦁ',
        tag: 'PANGGUNG UTAMA',
        title: 'Kelir Panggung Virtual (16:9)',
        selector: '.stage-canvas-frame-enclosure',
        placement: 'center',
        pointerText: 'Kelir Panggung Utama',
        pointerArrow: '👇',
        pointerDirection: 'down',
        accentColor: '#d4af37',
        description:
          'Inilah panggung pertunjukan utama Anda. Wayang tampil dalam rasio sinematik 16:9 dengan pencahayaan lampu Blencong sakral dan siluet batang debog di bawah.',
        demoType: 'stage',
      },
      {
        stepNumber: 2,
        glyph: 'ꦠꦺꦴꦏꦺꦴꦃ',
        tag: 'RAIL MENU KIRI',
        title: 'Bilah Menu Tokoh, Latar & Suara',
        selector: '.stage-rail-sidebar',
        placement: 'right',
        pointerText: 'Bilah Menu Penyusun',
        pointerArrow: '👈',
        pointerDirection: 'left',
        accentColor: '#e8bb5c',
        description:
          'Bilah sisi kiri ini adalah perkakas utama dalang untuk meramu seluruh elemen pagelaran melalui 4 tab utama:',
        demoType: 'rail',
      },
      {
        stepNumber: 3,
        glyph: 'ꦥꦼꦤꦠꦱ',
        tag: 'HEADER KANAN',
        title: 'Tombol Aksi & AI Dalang Vision',
        selector: '.studio-header-right',
        placement: 'bottom',
        pointerText: 'Tombol Aksi Utama Dalang',
        pointerArrow: '👆',
        pointerDirection: 'up',
        accentColor: '#22c55e',
        description:
          'Deretan tombol di kanan atas ini memiliki fungsi penting untuk mengendalikan, memutar, dan menyimpan pertunjukan Anda:',
        demoType: 'header-buttons',
      },
      {
        stepNumber: 4,
        glyph: 'ꦱꦧꦢ',
        tag: 'PANEL KANAN',
        title: 'Panel Sabda Naskah & Reka Tokoh',
        selector: '.stage-context-panel',
        placement: 'left',
        pointerText: 'Panel Naskah & Tokoh',
        pointerArrow: '👉',
        pointerDirection: 'right',
        accentColor: '#a78bfa',
        description:
          'Saat tokoh wayang dipilih di atas kelir, panel di sisi kanan ini akan membuka pengaturan naskah ucapan dan solah tokoh:',
        demoType: 'context',
      },
      {
        stepNumber: 5,
        glyph: 'ꦧꦧꦏ',
        tag: 'FILMSTRIP BAWAH',
        title: 'Linimasa Babak Pertunjukan',
        selector: '.stage-studio-footer-strip',
        placement: 'top',
        pointerText: 'Linimasa Babak Cerita',
        pointerArrow: '👇',
        pointerDirection: 'down',
        accentColor: '#38bdf8',
        description:
          'Wayangverse mendukung lakon bersambung multi-babak. Atur urutan adegan, durasi, dan pathet gamelan di linimasa bawah ini:',
        demoType: 'filmstrip',
      },
    ],
    []
  );

  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  // Ukur posisi bounding rect elemen target di layar
  const updateTargetRect = useCallback(() => {
    if (!currentStep.selector) {
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(currentStep.selector);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      });
    } else {
      setTargetRect(null);
    }
  }, [currentStep.selector]);

  useEffect(() => {
    if (!isOpen) return;

    let animFrameId = requestAnimationFrame(() => {
      updateTargetRect();
    });

    const handleResize = () => {
      updateTargetRect();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [isOpen, updateTargetRect]);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  }, [isLastStep, onClose, totalSteps]);

  const handlePrev = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Keyboard navigation: Escape to skip, Arrows to navigate
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Hitung posisi floating card terhadap target elemen
  const getCardPositionStyle = () => {
    if (!targetRect || window.innerWidth <= 840) {
      return {
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: 'calc(100vw - 32px)',
        width: '540px',
        zIndex: 10003,
      };
    }

    const cardWidth = 520;
    const margin = 16;

    if (currentStep.placement === 'bottom') {
      let right = window.innerWidth - targetRect.right;
      if (right < margin) right = margin;
      return {
        position: 'fixed',
        top: `${Math.min(window.innerHeight - 440, targetRect.bottom + margin)}px`,
        right: `${right}px`,
        width: `${cardWidth}px`,
        zIndex: 10003,
      };
    }

    if (currentStep.placement === 'right') {
      let top = Math.max(margin, Math.min(window.innerHeight - 440, targetRect.top + 20));
      return {
        position: 'fixed',
        top: `${top}px`,
        left: `${targetRect.right + margin}px`,
        width: `${cardWidth}px`,
        zIndex: 10003,
      };
    }

    if (currentStep.placement === 'left') {
      let top = Math.max(margin, Math.min(window.innerHeight - 440, targetRect.top + 20));
      let left = targetRect.left - cardWidth - margin;
      return {
        position: 'fixed',
        top: `${top}px`,
        left: `${Math.max(margin, left)}px`,
        width: `${cardWidth}px`,
        zIndex: 10003,
      };
    }

    if (currentStep.placement === 'top') {
      return {
        position: 'fixed',
        bottom: `${window.innerHeight - targetRect.top + margin}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        width: `${cardWidth}px`,
        zIndex: 10003,
      };
    }

    // Default center
    return {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: `${cardWidth}px`,
      zIndex: 10003,
    };
  };

  if (!isOpen) return null;

  return (
    <div
      className="stage-spotlight-overlay-root"
      role="dialog"
      aria-modal="true"
      aria-labelledby="spotlight-guide-title"
    >
      {/* SVG Mask untuk Cut-out Lubang Spotlight Gelap */}
      <svg className="stage-spotlight-svg-mask" aria-hidden="true">
        <defs>
          <mask id="spotlight-cutout-mask">
            <rect width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - 6}
                y={targetRect.top - 6}
                width={targetRect.width + 12}
                height={targetRect.height + 12}
                rx="14"
                ry="14"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(10, 8, 6, 0.78)"
          mask="url(#spotlight-cutout-mask)"
        />
      </svg>

      {/* Frame Emas Berkilau & Animasi Beacon di Atas Target Elemen Asli */}
      {targetRect && (
        <div
          className="stage-spotlight-focus-frame"
          style={{
            top: `${targetRect.top - 6}px`,
            left: `${targetRect.left - 6}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`,
          }}
        >
          {/* Animasi Ping Circle Beacon */}
          <div className="spotlight-beacon-pulse-ring" />

          {/* Lencana Petunjuk Panah Beranimasi */}
          <div className={`spotlight-arrow-badge dir-${currentStep.pointerDirection}`}>
            <span className="badge-arrow-icon">{currentStep.pointerArrow}</span>
            <span className="badge-arrow-text">{currentStep.pointerText}</span>
          </div>
        </div>
      )}

      {/* Kartu Floating Panduan Terarah */}
      <div
        className="stage-spotlight-card"
        style={getCardPositionStyle()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar Emas di Sisi Atas */}
        <div className="spotlight-card-progress-track">
          <div
            className="spotlight-card-progress-fill"
            style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Header Kartu */}
        <div className="spotlight-card-header">
          <div className="spotlight-card-badge-row">
            <span className="spotlight-card-badge">
              <Sparkles size={11} color="#d4af37" />
              <span>{currentStep.tag}</span>
            </span>
            <span className="spotlight-card-step-num">
              Langkah {currentStep.stepNumber} dari {totalSteps}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="spotlight-card-close-btn"
            title="Lewati Panduan (Esc)"
            aria-label="Tutup Panduan"
          >
            <X size={16} />
          </button>
        </div>

        {/* Isi Panduan & Animasi Peragaan Spesifik */}
        <div className="spotlight-card-body">
          <div className="spotlight-card-title-row">
            <span className="spotlight-card-glyph">{currentStep.glyph}</span>
            <h2 id="spotlight-guide-title" className="spotlight-card-title">
              {currentStep.title}
            </h2>
          </div>

          <p className="spotlight-card-desc">{currentStep.description}</p>

          {/* =========================================================================
              ANIMASI PERAGAAN SPESIFIK SESUAI LANGKAH (BUKAN SEKADAR TEKS)
              ========================================================================= */}

          {/* 1. DEMO PANGGUNG KELIR: Animasi Wayang Bergeser & Subtitle */}
          {currentStep.demoType === 'stage' && (
            <div className="spotlight-interactive-demo stage-demo">
              <div className="demo-stage-screen">
                <div className="demo-blencong-light" />
                <div className="demo-wayang-actor">
                  <div className="demo-wayang-shadow" />
                  <div className="demo-hand-cursor">
                    <Hand size={14} />
                    <span>Geser</span>
                  </div>
                </div>
                <div className="demo-subtitle-pill">
                  <span className="demo-sub-dot" />
                  <span className="demo-sub-name">GATOTKACA:</span>
                  <span className="demo-sub-quote">&ldquo;Duh Rama Paduka...&rdquo;</span>
                </div>
                <div className="demo-debog-bar" />
              </div>
              <div className="demo-tips-row">
                <span className="demo-tip-pill">🖱️ Klik &amp; Geser Wayang</span>
                <span className="demo-tip-pill">⌨️ Tombol 'F' Balik Hadap</span>
                <span className="demo-tip-pill">🔍 Zoom (−/＋) di Debog</span>
              </div>
            </div>
          )}

          {/* 2. DEMO RAIL KIRI: 4 Tab Penyusun Lakon Berkedip */}
          {currentStep.demoType === 'rail' && (
            <div className="spotlight-interactive-demo rail-demo">
              <div className="demo-rail-grid">
                <div className="demo-rail-item active">
                  <div className="demo-rail-icon"><Users size={14} /></div>
                  <div className="demo-rail-text">
                    <strong>Tokoh</strong>
                    <span>Tancep wayang ke kelir</span>
                  </div>
                </div>
                <div className="demo-rail-item">
                  <div className="demo-rail-icon"><ImageIcon size={14} /></div>
                  <div className="demo-rail-text">
                    <strong>Latar</strong>
                    <span>Pilih suasana panggung</span>
                  </div>
                </div>
                <div className="demo-rail-item">
                  <div className="demo-rail-icon"><Volume2 size={14} /></div>
                  <div className="demo-rail-text">
                    <strong>Suara</strong>
                    <span>Gamelan &amp; kepyak dalang</span>
                  </div>
                </div>
                <div className="demo-rail-item">
                  <div className="demo-rail-icon"><MessageSquare size={14} /></div>
                  <div className="demo-rail-text">
                    <strong>Sabda</strong>
                    <span>Tulis naskah dialog</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. DEMO TOMBOL HEADER: Rincian Dalang Vision, Pratinjau & Simpan */}
          {currentStep.demoType === 'header-buttons' && (
            <div className="spotlight-interactive-demo header-buttons-demo">
              <div className="demo-button-card vision">
                <div className="demo-button-pill-mockup">
                  <Hand size={13} color="#22c55e" />
                  <span>Dalang Vision</span>
                  <span className="demo-live-dot" />
                </div>
                <span className="demo-button-explain">
                  Nyalakan kamera webcam Anda &mdash; gerakkan wayang secara magis dengan lambaian telapak tangan via AI!
                </span>
              </div>

              <div className="demo-button-card preview">
                <div className="demo-button-pill-mockup outline">
                  <Play size={13} color="#d4af37" />
                  <span>Pratinjau</span>
                </div>
                <span className="demo-button-explain">
                  Tonton pagelaran dalam mode layar penuh dengan alur babak otomatis seperti bioskop kelir.
                </span>
              </div>

              <div className="demo-button-card save">
                <div className="demo-button-pill-mockup solid">
                  <Save size={13} color="#18120c" />
                  <span>Simpan Karya</span>
                </div>
                <span className="demo-button-explain">
                  Simpan karya ke arsip digital publik atau privat agar dapat disaksikan kapan saja.
                </span>
              </div>
            </div>
          )}

          {/* 4. DEMO PANEL KANAN: Pengetikan Naskah Dialog & Solah */}
          {currentStep.demoType === 'context' && (
            <div className="spotlight-interactive-demo context-demo">
              <div className="demo-context-mockup">
                <div className="demo-context-header">
                  <span className="demo-avatar-mini">G</span>
                  <div className="demo-char-info">
                    <strong>Raden Gatotkaca</strong>
                    <span>Satria Pringgandani</span>
                  </div>
                </div>
                <div className="demo-typewriter-box">
                  <span className="demo-typewriter-label">Sabda Tokoh:</span>
                  <div className="demo-typewriter-input">
                    <span>&ldquo;Ingsun siap ngayahi kuwajiban, Rama...&rdquo;</span>
                    <span className="demo-cursor-blink">|</span>
                  </div>
                </div>
                <div className="demo-context-reflection">
                  <span>↳ Otomatis tampil di subtitle sinematik panggung</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. DEMO FILMSTRIP: Rangkaian Babak Pertunjukan */}
          {currentStep.demoType === 'filmstrip' && (
            <div className="spotlight-interactive-demo filmstrip-demo">
              <div className="demo-filmstrip-row">
                <div className="demo-scene-card active">
                  <span className="demo-scene-num">Babak 1</span>
                  <span className="demo-scene-title">Prabayasa</span>
                </div>
                <span className="demo-scene-arrow">➔</span>
                <div className="demo-scene-card">
                  <span className="demo-scene-num">Babak 2</span>
                  <span className="demo-scene-title">Alas Roban</span>
                </div>
                <span className="demo-scene-arrow">➔</span>
                <div className="demo-scene-card add">
                  <span>＋ Tambah Babak</span>
                </div>
              </div>
              <div className="demo-filmstrip-tip">
                Setiap babak dapat diatur durasi dan pathet nadanya (Nem, Sanga, Manyura).
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigasi */}
        <div className="spotlight-card-footer">
          <button
            type="button"
            onClick={onClose}
            className="spotlight-card-skip-btn"
            title="Lewati panduan dan langsung mendalang"
          >
            Lewati Panduan
          </button>

          <div className="spotlight-card-dots">
            {steps.map((s, idx) => (
              <button
                key={s.stepNumber}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`spotlight-dot ${idx === currentStepIndex ? 'is-active' : ''} ${
                  idx < currentStepIndex ? 'is-completed' : ''
                }`}
                title={`Menuju langkah ${s.stepNumber}: ${s.title}`}
                aria-label={`Langkah ${s.stepNumber}`}
              />
            ))}
          </div>

          <div className="spotlight-card-actions">
            {!isFirstStep && (
              <button
                type="button"
                onClick={handlePrev}
                className="spotlight-card-prev-btn"
                title="Kembali ke langkah sebelumnya"
              >
                <ArrowLeft size={13} />
                <span>Sebelumnya</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="spotlight-card-next-btn"
              title={isLastStep ? 'Selesai panduan dan mulai mendalang' : 'Lanjut ke langkah berikutnya'}
            >
              <span>{isLastStep ? 'Mulai Mendalang' : 'Lanjut'}</span>
              {isLastStep ? <Check size={14} /> : <ArrowRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
