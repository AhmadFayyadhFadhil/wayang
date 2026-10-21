import React, { useRef, useEffect, useState, useCallback } from 'react';
import handTrackingService from '../../services/vision/handTrackingService';
import dalangKinematicsEngine from '../../services/vision/dalangKinematicsEngine';
import soundEngine from '../../services/soundscape';
import AuthenticLeatherWayang from '../../components/stage/AuthenticLeatherWayang';
import { CHARACTERS_MASTER } from '../../data/master/charactersMaster';
import {
  X,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Sparkles,
  Swords,
  Droplets,
  Sun,
  HelpCircle,
} from 'lucide-react';

// Koneksi ruas tulang tangan MediaPipe
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],       // Jempol
  [0, 5], [5, 6], [6, 7], [7, 8],       // Telunjuk
  [0, 9], [9, 10], [10, 11], [11, 12],  // Jari Tengah
  [0, 13], [13, 14], [14, 15], [15, 16],// Jari Manis
  [0, 17], [17, 18], [18, 19], [19, 20],// Kelingking
  [5, 9], [9, 13], [13, 17],            // Telapak
];

export default function WayangArStageModal({ isOpen, onClose, onOpenTutorial }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);

  // Karakter yang dipilih untuk tangan kiri dan kanan
  const [leftSlug, setLeftSlug] = useState('rahwana');
  const [rightSlug, setRightSlug] = useState('shinta');

  // Skala ukuran wayang independen untuk tangan kiri dan kanan (sesuai referensi: 1.3x kiri & 1.0x kanan)
  const [leftScale, setLeftScale] = useState(1.3);
  const [rightScale, setRightScale] = useState(1.0);

  // Mode Suasana / Mood Lakon ('netral' | 'damai' | 'sedih' | 'perang')
  const [mood, setMood] = useState('sedih'); // Default sedih dengan efek hujan rintik persis foto referensi

  // Status Dalang & Audio
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Menginisialisasi kamera panggung...');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isUiHidden, setIsUiHidden] = useState(false); // Hotkey 'H' untuk Zen Mode

  // State koordinat live kedua karakter di panggung (diperbarui direct 60 FPS)
  const [leftCharState, setLeftCharState] = useState({
    x: 0.28,
    y: 0.65,
    facing: 'right',
    pose: 'default',
    depth: 0,
    armAngles: null,
    isKiprah: false,
  });

  const [rightCharState, setRightCharState] = useState({
    x: 0.72,
    y: 0.65,
    facing: 'left',
    pose: 'default',
    depth: 0,
    armAngles: null,
    isKiprah: false,
  });

  // Stable refs untuk menghindari re-run effect webcam
  const leftSlugRef = useRef(leftSlug);
  const rightSlugRef = useRef(rightSlug);
  const moodRef = useRef(mood);

  useEffect(() => {
    leftSlugRef.current = leftSlug;
  }, [leftSlug]);

  useEffect(() => {
    rightSlugRef.current = rightSlug;
  }, [rightSlug]);

  useEffect(() => {
    moodRef.current = mood;
  }, [mood]);

  // Inisialisasi partikel cuaca (Hujan, Bara Api, Kabut Damai)
  useEffect(() => {
    const particles = [];
    const count = 120;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        speed: 0.012 + Math.random() * 0.024,
        length: 12 + Math.random() * 22,
        opacity: 0.25 + Math.random() * 0.55,
        size: 1 + Math.random() * 3,
        sway: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;
  }, []);

  // Toggle Layar Penuh
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Toggle Audio Gamelan
  const handleToggleAudio = useCallback(() => {
    setIsAudioOn((prev) => {
      const next = !prev;
      soundEngine.setVolume(next ? 0.7 : 0);
      return next;
    });
  }, []);

  // Keyboard Shortcuts Pro Dalang
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      const key = e.key.toLowerCase();
      if (key === 'h') {
        setIsUiHidden((prev) => !prev);
      } else if (key === 'f') {
        setLeftCharState((prev) => ({
          ...prev,
          facing: prev.facing === 'left' ? 'right' : 'left',
        }));
        try {
          soundEngine.playDodogan();
        } catch {}
      } else if (key === 'g') {
        setRightCharState((prev) => ({
          ...prev,
          facing: prev.facing === 'left' ? 'right' : 'left',
        }));
        try {
          soundEngine.playDodogan();
        } catch {}
      } else if (key === 'd') {
        setLeftCharState((prev) => ({ ...prev, isKiprah: true }));
        setRightCharState((prev) => ({ ...prev, isKiprah: true }));
        try {
          soundEngine.playKepyak();
        } catch {}
        setTimeout(() => {
          setLeftCharState((prev) => ({ ...prev, isKiprah: false }));
          setRightCharState((prev) => ({ ...prev, isKiprah: false }));
        }, 2200);
      } else if (key === 'm') {
        handleToggleAudio();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleToggleAudio]);

  // Loop Render Panggung Canvas AR & Partikel Cuaca
  const renderStageCanvas = useCallback(
    (results) => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      const currentMood = moodRef.current;

      ctx.save();
      ctx.clearRect(0, 0, width, height);

      // 1. Gambar Feed Kamera Webcam dengan Cermin (Mirrored AR Background)
      ctx.save();
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, width, height);
      ctx.restore();

      // 2. Overlay Suasana Gelap Kelir Jawa & Sorotan Lampu Blencong
      let overlayColor = 'rgba(10, 7, 5, 0.48)';
      if (currentMood === 'sedih') overlayColor = 'rgba(14, 18, 28, 0.52)';
      else if (currentMood === 'perang') overlayColor = 'rgba(28, 10, 8, 0.55)';
      else if (currentMood === 'damai') overlayColor = 'rgba(12, 16, 12, 0.44)';

      ctx.fillStyle = overlayColor;
      ctx.fillRect(0, 0, width, height);

      // Pendaran Cahaya Lampu Minyak Blencong di Tengah Kelir
      const blencongGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.38,
        30,
        width * 0.5,
        height * 0.45,
        width * 0.65
      );
      if (currentMood === 'sedih') {
        blencongGrad.addColorStop(0, 'rgba(186, 230, 253, 0.28)');
        blencongGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.08)');
        blencongGrad.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
      } else if (currentMood === 'perang') {
        blencongGrad.addColorStop(0, 'rgba(254, 215, 170, 0.35)');
        blencongGrad.addColorStop(0.4, 'rgba(239, 68, 68, 0.18)');
        blencongGrad.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
      } else {
        blencongGrad.addColorStop(0, 'rgba(254, 240, 138, 0.32)');
        blencongGrad.addColorStop(0.45, 'rgba(212, 175, 55, 0.12)');
        blencongGrad.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
      }
      ctx.fillStyle = blencongGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Efek Partikel Cuaca Dinamis (Hujan Sedih / Bara Perang / Semilir Damai)
      const particles = particlesRef.current || [];
      particles.forEach((p) => {
        if (currentMood === 'sedih') {
          // Efek Hujan Gerimis Rintik Vertikal (Persis foto referensi user!)
          p.y += p.speed * 2.2;
          p.x += 0.0015;
          if (p.y > 1.0) {
            p.y = 0;
            p.x = Math.random();
          }

          const px = p.x * width;
          const py = p.y * height;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + 1.2, py + p.length);
          ctx.strokeStyle = `rgba(186, 230, 253, ${p.opacity * 0.85})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        } else if (currentMood === 'perang') {
          // Bara Api Melayang Naik
          p.y -= p.speed * 0.9;
          p.x += Math.sin(p.sway) * 0.002;
          p.sway += 0.08;
          if (p.y < 0) {
            p.y = 1.0;
            p.x = Math.random();
          }

          const px = p.x * width;
          const py = p.y * height;
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(249, 115, 22, ${p.opacity})`;
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 8;
          ctx.fill();
        } else if (currentMood === 'damai') {
          // Semilir Kelopak Bunga Melayang Pelan
          p.y += p.speed * 0.45;
          p.x += Math.cos(p.sway) * 0.003;
          p.sway += 0.04;
          if (p.y > 1.0) {
            p.y = 0;
            p.x = Math.random();
          }

          const px = p.x * width;
          const py = p.y * height;
          ctx.beginPath();
          ctx.arc(px, py, p.size * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(253, 224, 71, ${p.opacity * 0.75})`;
          ctx.shadowColor = '#eab308';
          ctx.shadowBlur = 6;
          ctx.fill();
        }
      });

      // 4. Render Dual Skeletal Ruas Tulang di Atas Kanvas Panggung
      // Tangan Kiri = Kuning Emas (#facc15) | Tangan Kanan = Biru Cyan (#38bdf8)
      const landmarksList = results?.landmarks || [];
      if (landmarksList.length > 0) {
        landmarksList.forEach((landmarks) => {
          // Tentukan apakah ini tangan kiri atau kanan berdasar posisi X
          const palmCenterX = 1.0 - landmarks[9].x;
          const isLeftHand = palmCenterX < 0.5;

          const strokeCol = isLeftHand ? 'rgba(250, 204, 21, 0.95)' : 'rgba(56, 189, 248, 0.95)';
          const jointCol = isLeftHand ? '#fef08a' : '#bae6fd';
          const glowCol = isLeftHand ? '#eab308' : '#0284c7';

          ctx.lineWidth = 2.4;
          ctx.strokeStyle = strokeCol;
          ctx.shadowColor = glowCol;
          ctx.shadowBlur = 8;

          HAND_CONNECTIONS.forEach(([i, j]) => {
            const p1 = landmarks[i];
            const p2 = landmarks[j];
            if (!p1 || !p2) return;

            const x1 = (1.0 - p1.x) * width;
            const y1 = p1.y * height;
            const x2 = (1.0 - p2.x) * width;
            const y2 = p2.y * height;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          });

          // Titik-titik sendi
          landmarks.forEach((p, idx) => {
            const px = (1.0 - p.x) * width;
            const py = p.y * height;

            ctx.beginPath();
            const isTip = idx === 4 || idx === 8 || idx === 20;
            ctx.arc(px, py, isTip ? 4.8 : 2.8, 0, Math.PI * 2);
            ctx.fillStyle = jointCol;
            ctx.fill();
            ctx.strokeStyle = '#120a05';
            ctx.lineWidth = 1;
            ctx.stroke();
          });
        });
      }

      ctx.restore();
    },
    []
  );

  // Lifecycle Tracking Kamera Webcam
  useEffect(() => {
    if (!isOpen) return;

    let isSubscribed = true;

    const startStageVision = async () => {
      try {
        setStatusMessage('Memuat model MediaPipe Vision...');
        await handTrackingService.init();

        if (!isSubscribed || !videoRef.current) return;
        setStatusMessage('Menghubungkan kamera webcam panggung...');

        // Dummy karakter array untuk proses frame kinematika
        const dummyChars = [
          { instanceId: 'char-left', slug: leftSlugRef.current, x: 0.28, y: 0.65, scale: 1.3 },
          { instanceId: 'char-right', slug: rightSlugRef.current, x: 0.72, y: 0.65, scale: 1.0 },
        ];

        await handTrackingService.start(videoRef.current, (results) => {
          if (!isSubscribed) return;

          // Proses kinematika OneEuro
          const updates = dalangKinematicsEngine.processFrame(results, dummyChars, null);

          // Update koordinat karakter kiri & kanan
          updates.forEach(({ instanceId, updates: u }) => {
            if (instanceId === 'char-left') {
              setLeftCharState((prev) => ({ ...prev, ...u }));
            } else if (instanceId === 'char-right') {
              setRightCharState((prev) => ({ ...prev, ...u }));
            }
          });

          // Render canvas AR + cuaca + skeletal
          renderStageCanvas(results);
          setStatusMessage(dalangKinematicsEngine.statusMessage);
        });
      } catch (err) {
        if (!isSubscribed) return;
        setStatusMessage(`Webcam tidak aktif: ${err?.message || 'Izin ditolak'}`);
      }
    };

    startStageVision();

    return () => {
      isSubscribed = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      handTrackingService.stop();
    };
  }, [isOpen, renderStageCanvas]);

  if (!isOpen) return null;

  const leftCharData = CHARACTERS_MASTER.find((c) => c.slug === leftSlug) || CHARACTERS_MASTER[5];
  const rightCharData = CHARACTERS_MASTER.find((c) => c.slug === rightSlug) || CHARACTERS_MASTER[6];

  return (
    <div
      ref={containerRef}
      className="wayang-ar-interactive-stage-modal"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: '#070503',
        color: '#fcfaf2',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        userSelect: 'none',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Video Element Tersembunyi (Disalurkan ke Canvas AR) */}
      <video
        ref={videoRef}
        playsInline
        muted
        style={{ display: 'none' }}
      />

      {/* =========================================================================
          1. HEADER BAR ATAS (STATUS AR & MOOD FILTER TABS)
          ========================================================================= */}
      <header
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          background: 'linear-gradient(180deg, rgba(12, 8, 4, 0.95) 0%, rgba(12, 8, 4, 0.4) 80%, transparent 100%)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
          opacity: isUiHidden ? 0 : 1,
          transition: 'opacity 0.25s ease',
        }}
      >
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Status AR Aktif */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(20, 14, 8, 0.85)',
              border: '1px solid rgba(34, 197, 94, 0.5)',
              boxShadow: '0 0 14px rgba(34, 197, 94, 0.25)',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 8px #22c55e',
                display: 'inline-block',
                animation: 'pulse 1.8s infinite',
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', color: '#86efac' }}>
              AR AKTIF: SIAP BERMAIN
            </span>
          </div>

          {/* 4 Mood Selector Tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(26, 18, 11, 0.9)',
              padding: '4px',
              borderRadius: '12px',
              border: '1px solid rgba(212, 175, 55, 0.35)',
            }}
          >
            {[
              { id: 'netral', label: 'NETRAL', icon: Sun },
              { id: 'damai', label: 'DAMAI', icon: Sparkles },
              { id: 'sedih', label: 'SEDIH', icon: Droplets },
              { id: 'perang', label: 'PERANG', icon: Swords },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = mood === tab.id;
              const isSedihActive = isActive && tab.id === 'sedih';
              const isPerangActive = isActive && tab.id === 'perang';

              let activeBg = 'linear-gradient(180deg, #d4af37 0%, #b45309 100%)';
              let activeBorder = 'rgba(250, 204, 21, 0.8)';
              let activeColor = '#160d06';

              if (isSedihActive) {
                activeBg = 'linear-gradient(180deg, #38bdf8 0%, #0369a1 100%)';
                activeBorder = '#7dd3fc';
                activeColor = '#082f49';
              } else if (isPerangActive) {
                activeBg = 'linear-gradient(180deg, #ef4444 0%, #991b1b 100%)';
                activeBorder = '#fca5a5';
                activeColor = '#450a0a';
              }

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setMood(tab.id);
                    try {
                      soundEngine.playDodogan();
                    } catch {}
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: isActive ? `1.5px solid ${activeBorder}` : '1px solid transparent',
                    background: isActive ? activeBg : 'transparent',
                    color: isActive ? activeColor : '#d1c7b7',
                    boxShadow: isActive ? '0 4px 14px rgba(0, 0, 0, 0.4)' : 'none',
                  }}
                >
                  <Icon size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Action Utilities */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleToggleAudio}
              style={{
                background: 'rgba(28, 20, 12, 0.8)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                borderRadius: '8px',
                padding: '7px 10px',
                color: isAudioOn ? '#facc15' : '#9ca3af',
                cursor: 'pointer',
              }}
              title="Toggle Audio Gamelan (M)"
            >
              {isAudioOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button
              onClick={onOpenTutorial}
              style={{
                background: 'rgba(28, 20, 12, 0.8)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                borderRadius: '8px',
                padding: '7px 10px',
                color: '#e5d5be',
                cursor: 'pointer',
              }}
              title="Panduan Dalang AR"
            >
              <HelpCircle size={16} />
            </button>
            <button
              onClick={handleToggleFullscreen}
              style={{
                background: 'rgba(28, 20, 12, 0.8)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                borderRadius: '8px',
                padding: '7px 10px',
                color: '#e5d5be',
                cursor: 'pointer',
              }}
              title="Layar Penuh"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(185, 28, 28, 0.35)',
                border: '1px solid rgba(239, 68, 68, 0.6)',
                borderRadius: '8px',
                padding: '7px 10px',
                color: '#fecaca',
                cursor: 'pointer',
              }}
              title="Kembali ke Studio Panggung"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Sub-bar: Status Deteksi Tangan Dalang Kiri & Kanan */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 12px',
              borderRadius: '999px',
              background: 'rgba(26, 18, 10, 0.85)',
              border: '1px solid rgba(250, 204, 21, 0.7)',
              fontSize: '11px',
              fontWeight: 700,
              color: '#facc15',
            }}
          >
            <span>👈 KIRI:</span>
            <span>✋ Jari ({leftCharData?.name?.split(' ')[1] || 'Rahwana'})</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 12px',
              borderRadius: '999px',
              background: 'rgba(12, 22, 34, 0.85)',
              border: '1px solid rgba(56, 189, 248, 0.7)',
              fontSize: '11px',
              fontWeight: 700,
              color: '#38bdf8',
            }}
          >
            <span>👉 KANAN:</span>
            <span>✋ Jari ({rightCharData?.name?.split(' ')[1] || 'Sinta'})</span>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. KELIR STAGE AREA (CANVAS AR + WAYANG KULIT BENERAN)
          ========================================================================= */}
      <main
        style={{
          position: 'relative',
          flex: 1,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Canvas Render AR Feed, Partikel Hujan & Dual Skeletal */}
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* TOKOH WAYANG KIRI (PRABU RAHWANA) */}
        <div
          style={{
            position: 'absolute',
            left: `${leftCharState.x * 100}%`,
            top: `${leftCharState.y * 100}%`,
            transform: 'translate(-50%, -75%)',
            pointerEvents: 'none',
            zIndex: 5,
            transition: 'left 0.05s linear, top 0.05s linear',
          }}
        >
          <AuthenticLeatherWayang
            slug={leftSlug}
            facing={leftCharState.facing}
            scale={leftScale}
            armAngles={leftCharState.armAngles}
            isKiprah={leftCharState.isKiprah}
            depth={leftCharState.depth}
            renderMode="color"
            animated={true}
          />
          {/* Label Nama Tokoh Kiri */}
          <div
            style={{
              position: 'absolute',
              bottom: '-24px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '2px 10px',
              borderRadius: '4px',
              background: 'rgba(18, 12, 7, 0.92)',
              border: '1px solid rgba(250, 204, 21, 0.65)',
              color: '#facc15',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 10px rgba(0,0,0,0.6)',
              whiteSpace: 'nowrap',
            }}
          >
            {leftCharData?.name?.toUpperCase() || 'RAHWANA'}
          </div>
        </div>

        {/* TOKOH WAYANG KANAN (DEWI SHINTA) */}
        <div
          style={{
            position: 'absolute',
            left: `${rightCharState.x * 100}%`,
            top: `${rightCharState.y * 100}%`,
            transform: 'translate(-50%, -75%)',
            pointerEvents: 'none',
            zIndex: 6,
            transition: 'left 0.05s linear, top 0.05s linear',
          }}
        >
          <AuthenticLeatherWayang
            slug={rightSlug}
            facing={rightCharState.facing}
            scale={rightScale}
            armAngles={rightCharState.armAngles}
            isKiprah={rightCharState.isKiprah}
            depth={rightCharState.depth}
            renderMode="color"
            animated={true}
          />
          {/* Label Nama Tokoh Kanan */}
          <div
            style={{
              position: 'absolute',
              bottom: '-24px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '2px 10px',
              borderRadius: '4px',
              background: 'rgba(8, 18, 28, 0.92)',
              border: '1px solid rgba(56, 189, 248, 0.65)',
              color: '#38bdf8',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 10px rgba(0,0,0,0.6)',
              whiteSpace: 'nowrap',
            }}
          >
            {rightCharData?.name?.toUpperCase() || 'SINTA'}
          </div>
        </div>

        {/* Status Text Melayang Lembut di Bawah Kanvas */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            padding: '5px 16px',
            borderRadius: '999px',
            background: 'rgba(14, 10, 6, 0.75)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            fontSize: '11.5px',
            color: '#d4af37',
            backdropFilter: 'blur(8px)',
            opacity: isUiHidden ? 0 : 0.9,
            transition: 'opacity 0.25s ease',
          }}
        >
          {statusMessage}
        </div>
      </main>

      {/* =========================================================================
          3. PEDURUNGAN KONTROL BAWAH (PERSIS SEPERTI FOTO LAYAR TABLET PENGGUNA)
          ========================================================================= */}
      <footer
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          background: 'linear-gradient(0deg, rgba(14, 10, 6, 0.98) 0%, rgba(18, 12, 8, 0.92) 80%, transparent 100%)',
          borderTop: '1.5px solid rgba(212, 175, 55, 0.45)',
          boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.75)',
          opacity: isUiHidden ? 0 : 1,
          transition: 'opacity 0.25s ease',
        }}
      >
        {/* Kontrol Sisi Kiri: Tokoh Kiri + Slider Ukuran Kiri */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Dropdown Tokoh Kiri */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#facc15' }}>👈 Kiri:</span>
            <select
              value={leftSlug}
              onChange={(e) => setLeftSlug(e.target.value)}
              style={{
                background: '#23170e',
                color: '#fef08a',
                border: '1px solid rgba(250, 204, 21, 0.6)',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '12px',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {CHARACTERS_MASTER.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Slider Ukuran Kiri (Default 1.3x seperti di foto) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11.5px', color: '#c5b8a5' }}>Ukuran:</span>
            <input
              type="range"
              min="0.5"
              max="2.2"
              step="0.1"
              value={leftScale}
              onChange={(e) => setLeftScale(parseFloat(e.target.value))}
              style={{
                width: '90px',
                accentColor: '#facc15',
                cursor: 'pointer',
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#facc15', minWidth: '32px' }}>
              {leftScale.toFixed(1)}x
            </span>
          </div>
        </div>

        {/* Bagian Tengah: Judul Gelar Emas & SFX Dalang Cepat */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#facc15',
              textShadow: '0 0 12px rgba(250, 204, 21, 0.5)',
            }}
          >
            <span>❖</span>
            <span>WAYANG AR INTERAKTIF</span>
            <span>❖</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => {
                try {
                  soundEngine.playDodogan();
                } catch {}
              }}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(38, 26, 16, 0.85)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                color: '#e5c158',
                fontSize: '10.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🥁 Dodogan
            </button>
            <button
              onClick={() => {
                try {
                  soundEngine.playKepyak();
                } catch {}
              }}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(38, 26, 16, 0.85)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                color: '#e5c158',
                fontSize: '10.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🔔 Kepyak
            </button>
            <span style={{ fontSize: '10px', color: '#9ca3af' }}>[D] Joged · [F/G] Balik · [H] Zen</span>
          </div>
        </div>

        {/* Kontrol Sisi Kanan: Slider Ukuran Kanan + Tokoh Kanan */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Slider Ukuran Kanan (Default 1.0x seperti di foto) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11.5px', color: '#c5b8a5' }}>Ukuran:</span>
            <input
              type="range"
              min="0.5"
              max="2.2"
              step="0.1"
              value={rightScale}
              onChange={(e) => setRightScale(parseFloat(e.target.value))}
              style={{
                width: '90px',
                accentColor: '#38bdf8',
                cursor: 'pointer',
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', minWidth: '32px' }}>
              {rightScale.toFixed(1)}x
            </span>
          </div>

          {/* Dropdown Tokoh Kanan */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <select
              value={rightSlug}
              onChange={(e) => setRightSlug(e.target.value)}
              style={{
                background: '#121e2c',
                color: '#bae6fd',
                border: '1px solid rgba(56, 189, 248, 0.6)',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '12px',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {CHARACTERS_MASTER.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>👉 Kanan</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
