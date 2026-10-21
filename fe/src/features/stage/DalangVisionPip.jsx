import React, { useRef, useEffect, useState, useCallback } from 'react';
import handTrackingService from '../../services/vision/handTrackingService';
import dalangKinematicsEngine from '../../services/vision/dalangKinematicsEngine';
import {
  X,
  Minimize2,
  Maximize2,
  RefreshCw,
  HelpCircle,
  Sparkles,
  Swords,
  User,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

import avatarGatotkaca from '../../assets/avatar_gatotkaca.png';
import avatarArjuna from '../../assets/avatar_arjuna.png';
import avatarBima from '../../assets/avatar_bima.png';
import avatarShinta from '../../assets/avatar_shinta.png';

// Koneksi ruas tulang tangan MediaPipe
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],       // Jempol
  [0, 5], [5, 6], [6, 7], [7, 8],       // Telunjuk
  [0, 9], [9, 10], [10, 11], [11, 12],  // Jari Tengah
  [0, 13], [13, 14], [14, 15], [15, 16],// Jari Manis
  [0, 17], [17, 18], [18, 19], [19, 20],// Kelingking
  [5, 9], [9, 13], [13, 17],            // Telapak
];

export default function DalangVisionPip({
  isOpen,
  onClose,
  characters = [],
  selectedInstanceId,
  onUpdateCharacter,
  onDirectUpdate,
  onOpenTutorial,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const avatarImagesRef = useRef({});
  const pendingUpdatesRef = useRef(new Map());
  const commitTimeoutRef = useRef(null);

  const [isMinimized, setIsMinimized] = useState(false);
  const [visionMode, setVisionMode] = useState('dual'); // 'solo' | 'dual'
  const [statusText, setStatusText] = useState('Menginisialisasi kamera...');
  const [statusTone, setStatusTone] = useState('idle');
  const [isMirrored, setIsMirrored] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Stable refs untuk mencegah re-run effect webcam saat props/state berubah
  const statusTextRef = useRef(statusText);
  const statusToneRef = useRef(statusTone);
  const charactersRef = useRef(characters);
  const selectedInstanceIdRef = useRef(selectedInstanceId);
  const onUpdateCharacterRef = useRef(onUpdateCharacter);
  const onDirectUpdateRef = useRef(onDirectUpdate);
  const isMirroredRef = useRef(isMirrored);

  useEffect(() => {
    charactersRef.current = characters;
  }, [characters]);

  useEffect(() => {
    selectedInstanceIdRef.current = selectedInstanceId;
  }, [selectedInstanceId]);

  useEffect(() => {
    onUpdateCharacterRef.current = onUpdateCharacter;
  }, [onUpdateCharacter]);

  useEffect(() => {
    onDirectUpdateRef.current = onDirectUpdate;
  }, [onDirectUpdate]);

  useEffect(() => {
    isMirroredRef.current = isMirrored;
  }, [isMirrored]);

  // Pre-load avatar wayang untuk rendering instan 60 FPS di Canvas
  useEffect(() => {
    const sources = {
      gatotkaca: avatarGatotkaca,
      arjuna: avatarArjuna,
      bima: avatarBima,
      shinta: avatarShinta,
    };

    Object.entries(sources).forEach(([slug, src]) => {
      const img = new Image();
      img.src = src;
      avatarImagesRef.current[slug] = img;
    });
  }, []);

  // Ganti mode kinematika
  const handleToggleMode = (mode) => {
    setVisionMode(mode);
    dalangKinematicsEngine.setMode(mode);
  };

  // Toggle cermin kamera
  const handleToggleMirror = () => {
    const nextMirror = !isMirrored;
    setIsMirrored(nextMirror);
    dalangKinematicsEngine.setMirrored(nextMirror);
  };

  // Kontrol Skala Cepat Wayang (Memperbesar / Memperkecil)
  const activeChar = characters.find((c) => c.instanceId === selectedInstanceId) || characters[0];
  const currentScale = activeChar?.scale || 1.0;

  const handleScaleChange = (delta) => {
    if (!characters || characters.length === 0) return;
    const newScale = Math.max(0.5, Math.min(2.2, Number((currentScale + delta).toFixed(1))));
    if (selectedInstanceId) {
      onUpdateCharacter(selectedInstanceId, { scale: newScale });
    } else {
      characters.forEach((c) => {
        onUpdateCharacter(c.instanceId, { scale: newScale });
      });
    }
  };

  // Render skeletal telapak tangan emas prada dan Avatar Wayang AR di atas kanvas
  const drawSkeletalOverlay = useCallback((results, smoothedHands = []) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const mirrored = isMirroredRef.current;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Gambar frame video dengan efek cermin
    if (mirrored) {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, width, height);

    // Overlay gelap bernuansa soga agar skeletal dan avatar kontras
    ctx.fillStyle = 'rgba(18, 13, 9, 0.4)';
    ctx.fillRect(0, 0, width, height);

    ctx.restore();

    const landmarksList = results?.landmarks || [];
    if (landmarksList.length === 0) return;

    // 1. Gambar Skeletal Ruas Tulang dan Sendi (Batched for 60-120 FPS high performance)
    landmarksList.forEach((landmarks) => {
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.85)'; // Emas Prada
      ctx.shadowColor = 'rgba(232, 187, 92, 0.8)';
      ctx.shadowBlur = 4;

      ctx.beginPath();
      HAND_CONNECTIONS.forEach(([i, j]) => {
        const p1 = landmarks[i];
        const p2 = landmarks[j];
        if (!p1 || !p2) return;

        const x1 = mirrored ? (1 - p1.x) * width : p1.x * width;
        const y1 = p1.y * height;
        const x2 = mirrored ? (1 - p2.x) * width : p2.x * width;
        const y2 = p2.y * height;

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      });
      ctx.stroke();

      // Titik Sendi (Joints)
      ctx.shadowBlur = 0;
      landmarks.forEach((p, idx) => {
        const px = mirrored ? (1 - p.x) * width : p.x * width;
        const py = p.y * height;

        ctx.beginPath();
        const isTip = idx === 4 || idx === 8;
        ctx.arc(px, py, isTip ? 4.5 : 2.6, 0, Math.PI * 2);
        ctx.fillStyle = isTip ? '#fef08a' : '#d4af37';
        ctx.fill();
        ctx.strokeStyle = '#1a120b';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Efek Cubitan Cempurit (Pinch Aura)
      if (dalangKinematicsEngine.isPinching(landmarks)) {
        const p4 = landmarks[4];
        const p8 = landmarks[8];
        const pinchX = mirrored ? (1 - (p4.x + p8.x) / 2) * width : ((p4.x + p8.x) / 2) * width;
        const pinchY = ((p4.y + p8.y) / 2) * height;

        ctx.beginPath();
        ctx.arc(pinchX, pinchY, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(250, 204, 21, 0.7)';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 14;
        ctx.fill();
      }
    });

    // 2. Gambar Avatar Wayang Mini di Atas Setiap Telapak Tangan yang Mengendalikan
    (smoothedHands || []).forEach((hand) => {
      if (!hand || !hand.targetChar) return;
      const char = hand.targetChar;
      const cx = hand.x * width;
      const cy = Math.max(26, hand.y * height - 34);
      const radius = 20;

      // Glow Cempurit saat Menjepit
      if (hand.isPinching) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();
      }

      // Lingkaran Bingkai Avatar dengan status Terkunci
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#1c140e';
      ctx.fill();
      ctx.strokeStyle = hand.isLocked ? '#facc15' : char.accentColor || '#d4af37';
      ctx.lineWidth = hand.isLocked ? 3 : 2.4;
      ctx.shadowColor = hand.isLocked ? '#facc15' : 'transparent';
      ctx.shadowBlur = hand.isLocked ? 8 : 0;
      ctx.stroke();
      ctx.clip();

      const imgObj = avatarImagesRef.current[char.slug];
      if (imgObj && imgObj.complete && imgObj.naturalWidth > 0) {
        ctx.drawImage(imgObj, cx - radius, cy - radius, radius * 2, radius * 2);
      } else {
        ctx.fillStyle = char.accentColor || '#d4af37';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((char.name || 'W').substring(0, 2).toUpperCase(), cx, cy);
      }
      ctx.restore();

      // Label Nama Tokoh, Indikator Lock & Arah Hadap Flip
      ctx.save();
      ctx.font = 'bold 9.5px sans-serif';
      ctx.textAlign = 'center';
      const roleText =
        hand.role === 'tokoh_kiri'
          ? ' (Kiri)'
          : hand.role === 'tokoh_kanan'
          ? ' (Kanan)'
          : hand.role === 'cempurit'
          ? ' (Cempurit)'
          : '';
      const facingText = hand.facing === 'left' ? ' ◀ Kiri' : ' ▶ Kanan';
      const fullLabel = `🔒 ${(char.name || 'Wayang')}${roleText}${facingText}`;
      const textWidth = ctx.measureText(fullLabel).width;

      ctx.fillStyle = 'rgba(22, 16, 10, 0.92)';
      ctx.fillRect(cx - textWidth / 2 - 4, cy + radius + 2, textWidth + 8, 14);
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(cx - textWidth / 2 - 4, cy + radius + 2, textWidth + 8, 14);

      ctx.fillStyle = hand.isPinching ? '#fef08a' : '#e8bb5c';
      ctx.fillText(fullLabel, cx, cy + radius + 12);
      ctx.restore();
    });
  }, []);

  const drawSkeletalOverlayRef = useRef(drawSkeletalOverlay);
  useEffect(() => {
    drawSkeletalOverlayRef.current = drawSkeletalOverlay;
  }, [drawSkeletalOverlay]);

  // Lifecycle hand tracking: hanya dimulai ketika isOpen aktif dan ditutup saat isOpen false
  useEffect(() => {
    if (!isOpen) {
      handTrackingService.stop();
      return;
    }

    let isSubscribed = true;
    const pendingUpdates = pendingUpdatesRef.current;

    const startVision = async () => {
      try {
        setErrorMessage(null);
        setStatusText('Memuat model MediaPipe Vision...');
        await handTrackingService.init();

        if (!isSubscribed || !videoRef.current) return;
        setStatusText('Menghubungkan kamera webcam...');

        await handTrackingService.start(videoRef.current, (results) => {
          if (!isSubscribed) return;

          // 1. Jalankan kalkulasi kinematika & tentukan karakter target melalui ref stabil
          const currentChars = charactersRef.current;
          const currentSelId = selectedInstanceIdRef.current;
          const directUpdateFn = onDirectUpdateRef.current;
          const updateCharFn = onUpdateCharacterRef.current;

          const updates = dalangKinematicsEngine.processFrame(results, currentChars, currentSelId);

          // 2. Manipulasi DOM langsung (0x React Re-render = 60/120 FPS Butter Smooth)
          if (directUpdateFn && updates.length > 0) {
            updates.forEach(({ instanceId, updates: u }) => {
              directUpdateFn(instanceId, u);
            });
          }

          // 3. Simpan pembaruan ke buffer; commit ke store hanya saat idle/tancep debog (0x React lag)
          if (updates.length > 0) {
            updates.forEach(({ instanceId, updates: u }) => {
              pendingUpdates.set(instanceId, {
                ...(pendingUpdates.get(instanceId) || {}),
                ...u,
              });
            });

            if (commitTimeoutRef.current) {
              clearTimeout(commitTimeoutRef.current);
            }
            commitTimeoutRef.current = setTimeout(() => {
              if (updateCharFn && pendingUpdates.size > 0) {
                pendingUpdates.forEach((u, id) => {
                  updateCharFn(id, u);
                });
                pendingUpdates.clear();
              }
              commitTimeoutRef.current = null;
            }, 1000);
          } else if (results?.landmarks?.length === 0) {
            // Tancep Debog: tangan keluar kamera, segera commit posisi terakhir ke store
            if (commitTimeoutRef.current) {
              clearTimeout(commitTimeoutRef.current);
              commitTimeoutRef.current = null;
            }
            if (pendingUpdates.size > 0 && updateCharFn) {
              pendingUpdates.forEach((u, id) => {
                updateCharFn(id, u);
              });
              pendingUpdates.clear();
            }
          }

          // 4. Render skeletal beserta avatar wayang di atas tangan
          if (drawSkeletalOverlayRef.current) {
            drawSkeletalOverlayRef.current(results, dalangKinematicsEngine.smoothedHands);
          }

          if (statusTextRef.current !== dalangKinematicsEngine.statusMessage) {
            statusTextRef.current = dalangKinematicsEngine.statusMessage;
            setStatusText(dalangKinematicsEngine.statusMessage);
          }
          if (statusToneRef.current !== dalangKinematicsEngine.statusTone) {
            statusToneRef.current = dalangKinematicsEngine.statusTone;
            setStatusTone(dalangKinematicsEngine.statusTone);
          }
        });
      } catch (err) {
        if (!isSubscribed) return;
        setErrorMessage(err?.message || 'Webcam tidak dapat diakses atau izin ditolak');
        setStatusText('Gagal mengaktifkan kamera');
        setStatusTone('idle');
      }
    };

    startVision();

    return () => {
      isSubscribed = false;
      if (commitTimeoutRef.current) {
        clearTimeout(commitTimeoutRef.current);
        commitTimeoutRef.current = null;
      }
      if (pendingUpdates.size > 0 && onUpdateCharacterRef.current) {
        pendingUpdates.forEach((u, id) => {
          onUpdateCharacterRef.current(id, u);
        });
        pendingUpdates.clear();
      }
      handTrackingService.stop();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        width: isMinimized ? '220px' : '320px',
        background: '#16100a',
        border: '1.5px solid rgba(212, 175, 55, 0.45)',
        borderRadius: '16px',
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.65), 0 0 20px rgba(212, 175, 55, 0.15)',
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
        transition: 'width 0.25s ease, height 0.25s ease',
      }}
    >
      {/* Video element hidden (stream disalurkan ke Canvas) - Hindari display:none agar decoder webcam aktif */}
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

      {/* Header Panel PiP */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: '#1f160e',
          borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background:
                statusTone === 'grabbing'
                  ? '#eab308'
                  : statusTone === 'detected'
                  ? '#22c55e'
                  : statusTone === 'tancep'
                  ? '#94a3b8'
                  : '#ef4444',
              boxShadow: statusTone === 'grabbing' ? '0 0 8px #eab308' : 'none',
            }}
          />
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#fcfaf2', letterSpacing: '0.05em' }}>
            DALANG VISION
          </span>

          {/* Tombol Kontrol Cepat Skala Wayang (Ukuran Bentuk) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              background: 'rgba(212, 175, 55, 0.12)',
              padding: '1px 5px',
              borderRadius: '6px',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              marginLeft: '2px',
            }}
          >
            <button
              type="button"
              onClick={() => handleScaleChange(-0.1)}
              title="Perkecil Ukuran Bentuk Wayang (-)"
              style={{ ...pipIconBtnStyle, padding: '2px 3px' }}
            >
              <ZoomOut size={11} color="#e8bb5c" />
            </button>
            <span style={{ fontSize: '9.5px', fontWeight: '800', color: '#fef08a', minWidth: '24px', textAlign: 'center' }}>
              {currentScale.toFixed(1)}x
            </span>
            <button
              type="button"
              onClick={() => handleScaleChange(0.1)}
              title="Perbesar Ukuran Bentuk Wayang (+)"
              style={{ ...pipIconBtnStyle, padding: '2px 3px' }}
            >
              <ZoomIn size={11} color="#e8bb5c" />
            </button>
          </div>
        </div>

        {/* Tombol Kontrol Cepat PiP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {onOpenTutorial && (
            <button
              type="button"
              onClick={onOpenTutorial}
              title="Panduan Gestur Dalang"
              style={pipIconBtnStyle}
            >
              <HelpCircle size={13} />
            </button>
          )}

          <button
            type="button"
            onClick={handleToggleMirror}
            title={isMirrored ? 'Matikan Efek Cermin' : 'Nyalakan Efek Cermin'}
            style={pipIconBtnStyle}
          >
            <RefreshCw size={13} />
          </button>

          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? 'Perbesar Layar' : 'Perkecil Layar'}
            style={pipIconBtnStyle}
          >
            {isMinimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
          </button>

          <button
            type="button"
            onClick={onClose}
            title="Tutup Mode Dalang Vision"
            style={{ ...pipIconBtnStyle, color: '#ef4444' }}
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Konten PiP Kamera (Canvas Skeletal) */}
      {!isMinimized && (
        <div style={{ position: 'relative', width: '100%', height: '180px', background: '#0d0a07' }}>
          {errorMessage ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                textAlign: 'center',
                color: '#f87171',
                fontSize: '12px',
                lineHeight: '1.4',
              }}
            >
              <div style={{ fontWeight: '700', marginBottom: '4px' }}>Kamera Tidak Tersedia</div>
              <div>{errorMessage}</div>
              <div style={{ fontSize: '11px', color: '#bfae9c', marginTop: '6px' }}>
                Anda tetap dapat mendalang dengan mouse / keyboard.
              </div>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              width={320}
              height={180}
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'cover',
              }}
            />
          )}

          {/* Mode Switcher Bar di Atas Layar Kamera */}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              right: '8px',
              display: 'flex',
              gap: '6px',
              zIndex: 10,
            }}
          >
            <button
              type="button"
              onClick={() => handleToggleMode('solo')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '10.5px',
                fontWeight: '750',
                cursor: 'pointer',
                background: visionMode === 'solo' ? 'rgba(212, 175, 55, 0.95)' : 'rgba(22, 16, 10, 0.75)',
                color: visionMode === 'solo' ? '#16100a' : '#e8bb5c',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.2s ease',
              }}
            >
              <User size={11} />
              <span>1 Tokoh (Solo)</span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleMode('dual')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '10.5px',
                fontWeight: '750',
                cursor: 'pointer',
                background: visionMode === 'dual' ? 'rgba(212, 175, 55, 0.95)' : 'rgba(22, 16, 10, 0.75)',
                color: visionMode === 'dual' ? '#16100a' : '#e8bb5c',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.2s ease',
              }}
            >
              <Swords size={11} />
              <span>2 Tokoh (Laga)</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer HUD Status Gerak */}
      <div
        style={{
          padding: '8px 12px',
          background: '#19110a',
          fontSize: '11px',
          color: '#e8bb5c',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          borderTop: '1px solid rgba(212, 175, 55, 0.15)',
        }}
      >
        <Sparkles size={12} color="#d4af37" style={{ flexShrink: 0 }} />
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontWeight: '600',
          }}
        >
          {statusText}
        </span>
      </div>
    </div>
  );
}

const pipIconBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#bfae9c',
  cursor: 'pointer',
  padding: '4px',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
