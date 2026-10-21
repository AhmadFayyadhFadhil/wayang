import React, { useRef, useEffect, useState, useCallback } from 'react';
import handTrackingService from '../../services/vision/handTrackingService';
import dalangKinematicsEngine from '../../services/vision/dalangKinematicsEngine';
import { X, Minimize2, Maximize2, RefreshCw, HelpCircle, Sparkles, Swords, User } from 'lucide-react';

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
  onOpenTutorial,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [visionMode, setVisionMode] = useState('dual'); // 'solo' | 'dual'
  const [statusText, setStatusText] = useState('Menginisialisasi kamera...');
  const [statusTone, setStatusTone] = useState('idle');
  const [isMirrored, setIsMirrored] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

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

  // Render skeletal telapak tangan emas prada di atas kanvas
  const drawSkeletalOverlay = useCallback((results) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Gambar frame video dengan efek cermin
    if (isMirrored) {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, width, height);

    // Overlay gelap bernuansa soga agar skeletal kontras
    ctx.fillStyle = 'rgba(18, 13, 9, 0.35)';
    ctx.fillRect(0, 0, width, height);

    // Kembalikan orientasi untuk skeletal jika di-mirror
    ctx.restore();

    const landmarksList = results?.landmarks || [];
    if (landmarksList.length === 0) return;

    landmarksList.forEach((landmarks) => {
      // 1. Gambar Ruas Tulang (Bones)
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.85)'; // Emas Prada
      ctx.shadowColor = 'rgba(232, 187, 92, 0.9)';
      ctx.shadowBlur = 6;

      HAND_CONNECTIONS.forEach(([i, j]) => {
        const p1 = landmarks[i];
        const p2 = landmarks[j];
        if (!p1 || !p2) return;

        const x1 = isMirrored ? (1 - p1.x) * width : p1.x * width;
        const y1 = p1.y * height;
        const x2 = isMirrored ? (1 - p2.x) * width : p2.x * width;
        const y2 = p2.y * height;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      // 2. Gambar Titik Sendi (Joints)
      landmarks.forEach((p, idx) => {
        const px = isMirrored ? (1 - p.x) * width : p.x * width;
        const py = p.y * height;

        ctx.beginPath();
        // Ujung jempol (#4) dan telunjuk (#8) diberi aksen lebih besar
        const isTip = idx === 4 || idx === 8;
        ctx.arc(px, py, isTip ? 4.5 : 2.8, 0, Math.PI * 2);
        ctx.fillStyle = isTip ? '#fef08a' : '#d4af37';
        ctx.fill();
        ctx.strokeStyle = '#1a120b';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 3. Efek Khusus jika Cengkeram Cempurit (Pinch)
      if (dalangKinematicsEngine.isPinching(landmarks)) {
        const p4 = landmarks[4];
        const p8 = landmarks[8];
        const pinchX = isMirrored ? (1 - (p4.x + p8.x) / 2) * width : ((p4.x + p8.x) / 2) * width;
        const pinchY = ((p4.y + p8.y) / 2) * height;

        ctx.beginPath();
        ctx.arc(pinchX, pinchY, 9, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(250, 204, 21, 0.65)';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 12;
        ctx.fill();
      }
    });
  }, [isMirrored]);

  // Lifecycle hand tracking
  useEffect(() => {
    if (!isOpen) {
      handTrackingService.stop();
      return;
    }

    let isSubscribed = true;

    const startVision = async () => {
      try {
        setErrorMessage(null);
        setStatusText('Memuat model MediaPipe Vision...');
        await handTrackingService.init();

        if (!isSubscribed || !videoRef.current) return;
        setStatusText('Menghubungkan kamera webcam...');

        await handTrackingService.start(videoRef.current, (results) => {
          if (!isSubscribed) return;

          // Render skeletal
          drawSkeletalOverlay(results);

          // Terjemahkan koordinat ke wayang
          const updates = dalangKinematicsEngine.processFrame(results, characters, selectedInstanceId);
          updates.forEach(({ instanceId, updates: u }) => {
            if (onUpdateCharacter) {
              onUpdateCharacter(instanceId, u);
            }
          });

          setStatusText(dalangKinematicsEngine.statusMessage);
          setStatusTone(dalangKinematicsEngine.statusTone);
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
      handTrackingService.stop();
    };
  }, [isOpen, characters, selectedInstanceId, onUpdateCharacter, drawSkeletalOverlay]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        width: isMinimized ? '220px' : '300px',
        background: '#16100a',
        border: '1.5px solid rgba(212, 175, 55, 0.45)',
        borderRadius: '16px',
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.65), 0 0 20px rgba(212, 175, 55, 0.15)',
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
        transition: 'width 0.25s ease, height 0.25s ease',
      }}
    >
      {/* Video element hidden (stream disalurkan ke Canvas) */}
      <video
        ref={videoRef}
        playsInline
        muted
        style={{ display: 'none' }}
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
        <div style={{ position: 'relative', width: '100%', height: '170px', background: '#0d0a07' }}>
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
              width={300}
              height={170}
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
