import React, { useRef, useEffect, useState, useCallback } from 'react';
import handTrackingService from '../../services/vision/handTrackingService';
import dalangKinematicsEngine from '../../services/vision/dalangKinematicsEngine';
import soundEngine from '../../services/soundscape';
import RealLeatherPuppet from '../../components/stage/RealLeatherPuppet';
import { updatePuppetArmsDOM, mapScreenLandmarkToPuppet } from '../../services/vision/puppetIkSolver';
import ErrorBoundary from '../../components/ui/ErrorBoundary';
import { CHARACTERS_MASTER } from '../../data/master/charactersMaster';
import {
  X,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  HelpCircle,
  Upload,
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
  const fileInputRef = useRef(null);
  const particlesRef = useRef([]);
  const leftPuppetRef = useRef(null);
  const rightPuppetRef = useRef(null);
  const statusMessageRef = useRef('');
  const vignetteGradRef = useRef(null);

  // Koleksi wayang custom yang diunggah dalang
  const [customPuppets, setCustomPuppets] = useState([]);

  // Karakter yang dipilih untuk tangan kiri dan kanan
  const [leftSlug, setLeftSlug] = useState('arjuna');
  const [rightSlug, setRightSlug] = useState('shinta');

  // Skala ukuran wayang independen untuk tangan kiri dan kanan
  const [leftScale, setLeftScale] = useState(1.2);
  const [rightScale, setRightScale] = useState(1.0);

  // Mode Suasana / Mood Lakon ('netral' | 'damai' | 'sendu' | 'perang')
  const [mood, setMood] = useState('sendu');
  const [isWeatherActive, setIsWeatherActive] = useState(true);

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
    fingerTargets: null,
    isKiprah: false,
  });

  const [rightCharState, setRightCharState] = useState({
    x: 0.72,
    y: 0.65,
    facing: 'left',
    pose: 'default',
    depth: 0,
    fingerTargets: null,
    isKiprah: false,
  });

  // Stable refs untuk menghindari re-run effect webcam
  const leftSlugRef = useRef(leftSlug);
  const rightSlugRef = useRef(rightSlug);
  const leftScaleRef = useRef(leftScale);
  const rightScaleRef = useRef(rightScale);
  const leftFacingRef = useRef('right');
  const rightFacingRef = useRef('left');
  const moodRef = useRef(mood);
  const isWeatherActiveRef = useRef(isWeatherActive);

  useEffect(() => {
    leftSlugRef.current = leftSlug;
  }, [leftSlug]);

  useEffect(() => {
    rightSlugRef.current = rightSlug;
  }, [rightSlug]);

  useEffect(() => {
    leftScaleRef.current = leftScale;
  }, [leftScale]);

  useEffect(() => {
    rightScaleRef.current = rightScale;
  }, [rightScale]);

  useEffect(() => {
    moodRef.current = mood;
  }, [mood]);

  useEffect(() => {
    isWeatherActiveRef.current = isWeatherActive;
  }, [isWeatherActive]);

  // Inisialisasi partikel cuaca lembut (hujan gerimis tenang)
  useEffect(() => {
    const particles = [];
    const count = 50;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        speed: 0.01 + Math.random() * 0.016,
        length: 10 + Math.random() * 16,
        opacity: 0.18 + Math.random() * 0.35,
      });
    }
    particlesRef.current = particles;
  }, []);

  // Upload Wayang Koleksi Sendiri (Format PNG Transparan)
  const handleUploadCustomPuppet = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const newPuppet = {
      id: `custom-${Date.now()}`,
      slug: `custom-${Date.now()}`,
      name: cleanName || 'Wayang Koleksi Sendiri',
      customImageUrl: url,
    };
    setCustomPuppets((prev) => [newPuppet, ...prev]);
    setLeftSlug(newPuppet.slug);
    try {
      soundEngine.playDodogan();
    } catch {}
  };

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

  // Render Panggung Canvas AR: Bersih, Jernih, Tanpa Tirai Merah Menutupi Wajah (60-120 FPS High Performance)
  const renderStageCanvas = useCallback((results) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const currentMood = moodRef.current;
    const weatherOn = isWeatherActiveRef.current;

    ctx.save();

    // 1. Gambar Feed Kamera Webcam Jernih & Asli (Mirrored)
    ctx.save();
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, width, height);
    ctx.restore();

    // 2. Vignette Alami Halus di Tepian Layar (Cached Gradient)
    if (!vignetteGradRef.current) {
      const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        width * 0.38,
        width * 0.5,
        height * 0.5,
        width * 0.72
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(10, 6, 3, 0.45)');
      vignetteGradRef.current = vignette;
    }
    ctx.fillStyle = vignetteGradRef.current;
    ctx.fillRect(0, 0, width, height);

    // 3. Efek Cuaca Sangat Lembut & Tenang (Batched Draw Call)
    if (weatherOn && currentMood === 'sendu') {
      const particles = particlesRef.current || [];
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.28)';
      ctx.beginPath();
      particles.forEach((p) => {
        p.y += p.speed;
        if (p.y > 1.0) {
          p.y = 0;
          p.x = Math.random();
        }
        const px = p.x * width;
        const py = p.y * height;
        ctx.moveTo(px, py);
        ctx.lineTo(px, py + p.length);
      });
      ctx.stroke();
    }

    // 4. Render Dual Skeletal Garis Halus di Bawah Wayang (Batched Draw Calls)
    const landmarksList = results?.landmarks || [];
    if (landmarksList.length > 0) {
      landmarksList.forEach((landmarks) => {
        const palmCenterX = 1.0 - landmarks[9].x;
        const isLeftHand = palmCenterX < 0.5;

        const strokeCol = isLeftHand ? 'rgba(212, 175, 55, 0.85)' : 'rgba(56, 189, 248, 0.85)';
        const jointCol = isLeftHand ? '#fef08a' : '#bae6fd';

        ctx.lineWidth = 1.8;
        ctx.strokeStyle = strokeCol;

        // Batched bone paths
        ctx.beginPath();
        HAND_CONNECTIONS.forEach(([i, j]) => {
          const p1 = landmarks[i];
          const p2 = landmarks[j];
          if (!p1 || !p2) return;
          ctx.moveTo((1.0 - p1.x) * width, p1.y * height);
          ctx.lineTo((1.0 - p2.x) * width, p2.y * height);
        });
        ctx.stroke();

        // Batched joints
        ctx.fillStyle = jointCol;
        landmarks.forEach((p, idx) => {
          const px = (1.0 - p.x) * width;
          const py = p.y * height;
          ctx.beginPath();
          const isTip = idx === 4 || idx === 8;
          ctx.arc(px, py, isTip ? 3.8 : 2.2, 0, Math.PI * 2);
          ctx.fill();
        });
      });
    }

    ctx.restore();
  }, []);

  // Lifecycle Tracking Kamera Webcam
  useEffect(() => {
    if (!isOpen) return;

    let isSubscribed = true;

    const startStageVision = async () => {
      try {
        setStatusMessage('Menyiapkan panggung dalang...');
        await handTrackingService.init();

        if (!isSubscribed || !videoRef.current) return;
        setStatusMessage('Menghubungkan kamera...');

        const dummyChars = [
          { instanceId: 'char-left', slug: leftSlugRef.current, x: 0.28, y: 0.65, scale: 1.2 },
          { instanceId: 'char-right', slug: rightSlugRef.current, x: 0.72, y: 0.65, scale: 1.0 },
        ];

        dalangKinematicsEngine.setMode('dual');

        await handTrackingService.start(videoRef.current, (results) => {
          if (!isSubscribed) return;

          const canvas = canvasRef.current;
          const stageW = canvas?.width || 1280;
          const stageH = canvas?.height || 720;

          // 1. Jalankan kinematics engine dual-hand
          const updates = dalangKinematicsEngine.processFrame(results, dummyChars, null);

          // 2. Direct DOM Hardware Acceleration 60-120 FPS
          updates.forEach(({ instanceId, updates: u }) => {
            const isLeft = instanceId === 'char-left';
            const puppetEl = isLeft ? leftPuppetRef.current : rightPuppetRef.current;
            const currentScale = isLeft ? leftScaleRef.current : rightScaleRef.current;

            if (puppetEl) {
              if (u.x !== undefined) puppetEl.style.left = `${(u.x * 100).toFixed(2)}%`;
              if (u.y !== undefined) puppetEl.style.top = `${(u.y * 100).toFixed(2)}%`;
              if (u.facing !== undefined) {
                if (isLeft) leftFacingRef.current = u.facing;
                else rightFacingRef.current = u.facing;

                const inner = puppetEl.querySelector('.real-leather-puppet-container');
                if (inner) {
                  const scX = u.facing === 'left' ? -currentScale : currentScale;
                  inner.style.transform = `scale(${scX}, ${currentScale})`;
                }
              }
            }

            // Hanya re-render React ketika status animasi diskrit berubah (bukan koordinat kontinu)
            if (instanceId === 'char-left') {
              if (u.isKiprah !== undefined) {
                setLeftCharState((prev) => (prev.isKiprah !== u.isKiprah ? { ...prev, isKiprah: u.isKiprah } : prev));
              }
            } else if (instanceId === 'char-right') {
              if (u.isKiprah !== undefined) {
                setRightCharState((prev) => (prev.isKiprah !== u.isKiprah ? { ...prev, isKiprah: u.isKiprah } : prev));
              }
            }
          });

          // 3. Precise Finger Snapping: Hitung target tangan wayang langsung dari koordinat nyata Landmark 4 & 8
          const rawLandmarksList = results?.landmarks || [];
          if (rawLandmarksList.length === 1) {
            const landmarks = rawLandmarksList[0];
            const palmScreenX = (1.0 - landmarks[9].x) * stageW;
            const palmScreenY = landmarks[9].y * stageH;
            const isLeftHand = palmScreenX < stageW * 0.5;

            const puppetEl = isLeftHand ? leftPuppetRef.current : rightPuppetRef.current;
            const currentScale = isLeftHand ? leftScaleRef.current : rightScaleRef.current;
            const currentFacing = isLeftHand ? leftFacingRef.current : rightFacingRef.current;

            if (puppetEl) {
              const thumbScreen = {
                x: (1.0 - landmarks[4].x) * stageW,
                y: landmarks[4].y * stageH,
              };
              const indexScreen = {
                x: (1.0 - landmarks[8].x) * stageW,
                y: landmarks[8].y * stageH,
              };
              const palmScreen = {
                x: palmScreenX,
                y: palmScreenY,
              };

              const frontTarget = mapScreenLandmarkToPuppet(thumbScreen, palmScreen, currentScale, currentFacing);
              const backTarget = mapScreenLandmarkToPuppet(indexScreen, palmScreen, currentScale, currentFacing);

              if (frontTarget && backTarget) {
                updatePuppetArmsDOM(puppetEl, null, { front: frontTarget, back: backTarget });
              }
            }
          } else if (rawLandmarksList.length >= 2) {
            // Urutkan kedua tangan dari kiri ke kanan layar secara deterministik:
            // Tangan ke-0 (paling kiri di layar) -> leftPuppetRef (char-left)
            // Tangan ke-1 (paling kanan di layar) -> rightPuppetRef (char-right)
            const sortedByScreenX = [...rawLandmarksList].sort((a, b) => (1.0 - a[9].x) - (1.0 - b[9].x));

            // Tangan Kiri -> Wayang Kiri
            const leftLandmarks = sortedByScreenX[0];
            const leftPuppet = leftPuppetRef.current;
            if (leftPuppet) {
              const leftPalmScreen = {
                x: (1.0 - leftLandmarks[9].x) * stageW,
                y: leftLandmarks[9].y * stageH,
              };
              const thumbScreen = {
                x: (1.0 - leftLandmarks[4].x) * stageW,
                y: leftLandmarks[4].y * stageH,
              };
              const indexScreen = {
                x: (1.0 - leftLandmarks[8].x) * stageW,
                y: leftLandmarks[8].y * stageH,
              };

              const frontTarget = mapScreenLandmarkToPuppet(thumbScreen, leftPalmScreen, leftScaleRef.current, leftFacingRef.current);
              const backTarget = mapScreenLandmarkToPuppet(indexScreen, leftPalmScreen, leftScaleRef.current, leftFacingRef.current);

              if (frontTarget && backTarget) {
                updatePuppetArmsDOM(leftPuppet, null, { front: frontTarget, back: backTarget });
              }
            }

            // Tangan Kanan -> Wayang Kanan
            const rightLandmarks = sortedByScreenX[1];
            const rightPuppet = rightPuppetRef.current;
            if (rightPuppet) {
              const rightPalmScreen = {
                x: (1.0 - rightLandmarks[9].x) * stageW,
                y: rightLandmarks[9].y * stageH,
              };
              const thumbScreen = {
                x: (1.0 - rightLandmarks[4].x) * stageW,
                y: rightLandmarks[4].y * stageH,
              };
              const indexScreen = {
                x: (1.0 - rightLandmarks[8].x) * stageW,
                y: rightLandmarks[8].y * stageH,
              };

              const frontTarget = mapScreenLandmarkToPuppet(thumbScreen, rightPalmScreen, rightScaleRef.current, rightFacingRef.current);
              const backTarget = mapScreenLandmarkToPuppet(indexScreen, rightPalmScreen, rightScaleRef.current, rightFacingRef.current);

              if (frontTarget && backTarget) {
                updatePuppetArmsDOM(rightPuppet, null, { front: frontTarget, back: backTarget });
              }
            }
          }

          // Perbarui koordinat dinamis agar pelacakan dua tangan tetap sinkron
          if (updates.length > 0) {
            updates.forEach(({ instanceId, updates: u }) => {
              if (instanceId === 'char-left' && u.x !== undefined) dummyChars[0].x = u.x;
              if (instanceId === 'char-right' && u.x !== undefined) dummyChars[1].x = u.x;
            });
          }

          renderStageCanvas(results);
          if (statusMessageRef.current !== dalangKinematicsEngine.statusMessage) {
            statusMessageRef.current = dalangKinematicsEngine.statusMessage;
            setStatusMessage(dalangKinematicsEngine.statusMessage);
          }
        });
      } catch (err) {
        if (!isSubscribed) return;
        setStatusMessage(`Kamera tidak aktif: ${err?.message || 'Izin ditolak'}`);
      }
    };

    startStageVision();

    return () => {
      isSubscribed = false;
      handTrackingService.stop();
      dalangKinematicsEngine.setMode('solo');
    };
  }, [isOpen, renderStageCanvas]);

  // Paint latar kelir awal agar kanvas tidak hitam polos saat menunggu feed kamera
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = '#0f0a07';
    ctx.fillRect(0, 0, w, h);
    // Cahaya lampu blencong di tengah panggung
    const glow = ctx.createRadialGradient(w * 0.5, h * 0.45, 40, w * 0.5, h * 0.45, w * 0.55);
    glow.addColorStop(0, 'rgba(212, 175, 55, 0.28)');
    glow.addColorStop(0.5, 'rgba(120, 53, 15, 0.15)');
    glow.addColorStop(1, 'rgba(15, 10, 7, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
  }, [isOpen]);

  if (!isOpen) return null;

  // Gabungkan master characters dengan wayang custom dalang
  const allAvailableCharacters = [...customPuppets, ...CHARACTERS_MASTER];
  const leftCharData = allAvailableCharacters.find((c) => c.slug === leftSlug) || CHARACTERS_MASTER[1];
  const rightCharData = allAvailableCharacters.find((c) => c.slug === rightSlug) || CHARACTERS_MASTER[6];

  return (
    <div
      ref={containerRef}
      className="wayang-ar-interactive-stage-modal"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: '#0a0705',
        color: '#fcfaf2',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        userSelect: 'none',
        overflow: 'hidden',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Input File Tersembunyi untuk Unggah Wayang Sendiri */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/webp,image/jpeg"
        onChange={handleUploadCustomPuppet}
        style={{ display: 'none' }}
      />

      {/* Video Webcam Tersembunyi (Disalurkan ke Kanvas) */}
      <video
        ref={videoRef}
        playsInline
        muted
        style={{
          position: 'fixed',
          top: -9999,
          left: -9999,
          width: 320,
          height: 240,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      {/* =========================================================================
          1. HEADER ATAS BERSIH & BERWIBAWA (ZERO EMOJI)
          ========================================================================= */}
      <header
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          background: 'linear-gradient(180deg, rgba(14, 10, 6, 0.9) 0%, rgba(14, 10, 6, 0.2) 80%, transparent 100%)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
          opacity: isUiHidden ? 0 : 1,
          transition: 'opacity 0.25s ease',
        }}
      >
        {/* Status Kamera & Dalang */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              background: 'rgba(20, 14, 9, 0.85)',
              border: '1px solid rgba(34, 197, 94, 0.45)',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 6px #22c55e',
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', color: '#86efac' }}>
              AR Aktif
            </span>
          </div>

          <span style={{ fontSize: '12px', color: '#bfae9c' }}>
            {statusMessage}
          </span>
        </div>

        {/* Pemilih Suasana Bersih Tanpa Emoticon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(24, 17, 11, 0.85)',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid rgba(212, 175, 55, 0.25)',
          }}
        >
          {[
            { id: 'netral', label: 'Netral' },
            { id: 'damai', label: 'Damai' },
            { id: 'sendu', label: 'Sendu' },
            { id: 'perang', label: 'Perang' },
          ].map((tab) => {
            const isActive = mood === tab.id;
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
                  padding: '5px 14px',
                  borderRadius: '7px',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  border: isActive ? '1px solid rgba(212, 175, 55, 0.65)' : '1px solid transparent',
                  background: isActive ? '#382515' : 'transparent',
                  color: isActive ? '#fef08a' : '#c5b8a5',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Utilitas Panggung */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsWeatherActive((prev) => !prev)}
            style={{
              background: 'rgba(24, 17, 11, 0.8)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '7px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 600,
              color: isWeatherActive ? '#e8bb5c' : '#78716c',
              cursor: 'pointer',
            }}
            title="Nyalakan / Matikan Efek Cuaca"
          >
            Cuaca: {isWeatherActive ? 'Aktif' : 'Nonaktif'}
          </button>
          <button
            onClick={handleToggleAudio}
            style={{
              background: 'rgba(24, 17, 11, 0.8)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '7px',
              padding: '6px 10px',
              color: isAudioOn ? '#e8bb5c' : '#78716c',
              cursor: 'pointer',
            }}
            title="Toggle Audio (M)"
          >
            {isAudioOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
          <button
            onClick={onOpenTutorial}
            style={{
              background: 'rgba(24, 17, 11, 0.8)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '7px',
              padding: '6px 10px',
              color: '#d1c7b7',
              cursor: 'pointer',
            }}
            title="Panduan Dalang"
          >
            <HelpCircle size={15} />
          </button>
          <button
            onClick={handleToggleFullscreen}
            style={{
              background: 'rgba(24, 17, 11, 0.8)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '7px',
              padding: '6px 10px',
              color: '#d1c7b7',
              cursor: 'pointer',
            }}
            title="Layar Penuh"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(127, 29, 29, 0.3)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '7px',
              padding: '6px 10px',
              color: '#fca5a5',
              cursor: 'pointer',
            }}
            title="Kembali ke Studio"
          >
            <X size={15} />
          </button>
        </div>
      </header>

      {/* =========================================================================
          2. KELIR STAGE AREA (KANVAS KAMERA JERNIH + WAYANG ASLI DENGAN IK)
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

        {/* TOKOH WAYANG KIRI */}
        <div
          ref={leftPuppetRef}
          style={{
            position: 'absolute',
            left: `${leftCharState.x * 100}%`,
            top: `${leftCharState.y * 100}%`,
            transform: 'translate(-50%, -52%)',
            pointerEvents: 'none',
            zIndex: 5,
            willChange: 'left, top',
          }}
        >
          <ErrorBoundary>
            <RealLeatherPuppet
              slug={leftSlug}
              customImageUrl={leftCharData?.customImageUrl}
              facing={leftCharState.facing}
              scale={leftScale}
              fingerTargets={leftCharState.fingerTargets}
              isKiprah={leftCharState.isKiprah}
              depth={leftCharState.depth}
            />
          </ErrorBoundary>
        </div>

        {/* TOKOH WAYANG KANAN */}
        <div
          ref={rightPuppetRef}
          style={{
            position: 'absolute',
            left: `${rightCharState.x * 100}%`,
            top: `${rightCharState.y * 100}%`,
            transform: 'translate(-50%, -52%)',
            pointerEvents: 'none',
            zIndex: 6,
            willChange: 'left, top',
          }}
        >
          <ErrorBoundary>
            <RealLeatherPuppet
              slug={rightSlug}
              customImageUrl={rightCharData?.customImageUrl}
              facing={rightCharState.facing}
              scale={rightScale}
              fingerTargets={rightCharState.fingerTargets}
              isKiprah={rightCharState.isKiprah}
              depth={rightCharState.depth}
            />
          </ErrorBoundary>
        </div>
      </main>

      {/* =========================================================================
          3. BILAH KONTROL BAWAH RAMPIANG & BERSIH (ZERO EMOJI)
          ========================================================================= */}
      <footer
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 24px',
          background: 'linear-gradient(0deg, rgba(14, 10, 6, 0.95) 0%, rgba(14, 10, 6, 0.8) 80%, transparent 100%)',
          borderTop: '1px solid rgba(212, 175, 55, 0.25)',
          opacity: isUiHidden ? 0 : 1,
          transition: 'opacity 0.25s ease',
        }}
      >
        {/* Kontrol Sisi Kiri: Pilihan Tokoh Kiri + Slider Ukuran */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#e5c158' }}>Sisi Kiri:</span>
            <select
              value={leftSlug}
              onChange={(e) => setLeftSlug(e.target.value)}
              style={{
                background: '#20160e',
                color: '#fef08a',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                borderRadius: '6px',
                padding: '5px 8px',
                fontSize: '11px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {allAvailableCharacters.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#a89a8a' }}>Ukuran:</span>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={leftScale}
              onChange={(e) => setLeftScale(parseFloat(e.target.value))}
              style={{ width: '80px', accentColor: '#d4af37', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '11px', color: '#fef08a', minWidth: '30px' }}>
              {leftScale.toFixed(1)}x
            </span>
          </div>
        </div>

        {/* Bagian Tengah: Audio Dalang & Panduan Cepat Tanpa Simbol Berlebih */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {
              try {
                soundEngine.playDodogan();
              } catch {}
            }}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              background: '#281c12',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              color: '#e5c158',
              fontSize: '10.5px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Dodogan
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
              background: '#281c12',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              color: '#e5c158',
              fontSize: '10.5px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Kepyak
          </button>
          <button
            onClick={() => {
              try {
                soundEngine.playGong();
              } catch {}
            }}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              background: '#281c12',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              color: '#e5c158',
              fontSize: '10.5px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Gong
          </button>
          <span style={{ fontSize: '10px', color: '#78716c', marginLeft: '6px' }}>
            Tekan H untuk mode panggung bersih
          </span>
        </div>

        {/* Kontrol Sisi Kanan: Slider Ukuran + Pilihan Tokoh Kanan + Tombol Unggah */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#a89a8a' }}>Ukuran:</span>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={rightScale}
              onChange={(e) => setRightScale(parseFloat(e.target.value))}
              style={{ width: '80px', accentColor: '#38bdf8', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '11px', color: '#bae6fd', minWidth: '30px' }}>
              {rightScale.toFixed(1)}x
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#38bdf8' }}>Sisi Kanan:</span>
            <select
              value={rightSlug}
              onChange={(e) => setRightSlug(e.target.value)}
              style={{
                background: '#121e2c',
                color: '#bae6fd',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '6px',
                padding: '5px 8px',
                fontSize: '11px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {allAvailableCharacters.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tombol Unggah Wayang Sendiri */}
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(32, 22, 14, 0.9) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.5)',
              color: '#fef08a',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Unggah file gambar wayang kulit (PNG transparan) milik Anda sendiri"
          >
            <Upload size={12} />
            <span>Unggah Wayang</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
