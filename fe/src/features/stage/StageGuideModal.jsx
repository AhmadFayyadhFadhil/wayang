import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Sparkles,
  Layers,
  Move,
  MessageSquare,
  Play,
  ArrowRight,
  ArrowLeft,
  Check,
  Film,
} from 'lucide-react';

const GUIDE_STEPS = [
  {
    stepNumber: 1,
    glyph: 'ꦥꦁꦒꦸꦁ',
    tag: 'Kelir Sinematik 16:9',
    title: 'Sugeng Rawuh ing Panggung Kelir',
    icon: Film,
    accentColor: '#d4af37',
    description:
      'Inilah kelir panggung digital Anda. Dirancang dalam rasio sinematik 16:9 yang responsif, dilengkapi pencahayaan lampu Blencong bernafas sakral dan siluet batang pisang (Debog) di dasar panggung tempat tancep wayang.',
    tips: [
      'Kanvas panggung selalu terkunci pada rasio 16:9 yang utuh tanpa terpotong.',
      'Subtitle ucapan tokoh berlabuh rapi di dasar debog dan tidak menghalangi solah wayang.',
    ],
  },
  {
    stepNumber: 2,
    glyph: 'ꦠꦺꦴꦏꦺꦴꦃ',
    tag: 'Rail Tab Penyusun (Kiri)',
    title: 'Menata Lakon, Tokoh & Tata Suara',
    icon: Layers,
    accentColor: '#e8bb5c',
    description:
      'Gunakan bilah menu di sisi kiri untuk meracik seluruh elemen pertunjukan Anda melalui empat tab utama:',
    tips: [
      'Tokoh: Tancep wayang legendaris dari pustaka pakem atau unggah wayang koleksi Anda.',
      'Latar: Pilih suasana kelir (Prabayasa, Alas Roban, Perang Kurusetra, dsb).',
      'Suara: Putar gamelan latar dan bunyikan efek pedalangan (Dodogan, Kepyak, Gong).',
      'Sabda: Tulis ucapan dalang yang akan dilantunkan para tokoh lakon.',
    ],
  },
  {
    stepNumber: 3,
    glyph: 'ꦱꦺꦴꦭꦃ',
    tag: 'Solah & Posisi Wayang',
    title: 'Menggerakkan Wayang di Atas Kelir',
    icon: Move,
    accentColor: '#38bdf8',
    description:
      'Sebagai dalang, Anda memiliki kendali penuh atas pergerakan dan orientasi setiap wayang di panggung:',
    tips: [
      'Klik & geser (drag) wayang langsung di atas kelir untuk menata posisi.',
      'Tekan tombol "F" pada keyboard untuk membalik arah hadap wayang (kiri ↔ kanan).',
      'Gunakan tombol panah keyboard (← ↑ → ↓) untuk pergeseran presisi tinggi.',
      'Gunakan kontrol zoom (− / ＋) di pojok kanan bawah debog untuk menyesuaikan ukuran wayang.',
    ],
  },
  {
    stepNumber: 4,
    glyph: 'ꦱꦧꦢ',
    tag: 'Panel Naskah & Filmstrip',
    title: 'Sabda Dialog & Reka Babak Cerita',
    icon: MessageSquare,
    accentColor: '#a78bfa',
    description:
      'Kembangkan alur cerita pagelaran secara dinamis melalui panel kontekstual di sisi kanan dan filmstrip di bawah:',
    tips: [
      'Pilih wayang di kelir untuk menuliskan naskah dialognya di panel kanan.',
      'Klik babak pada filmstrip bawah untuk mengatur durasi dan pathet nada (Nem, Sanga, Manyura).',
      'Gunakan tombol "＋" di filmstrip untuk menambah babak baru atau duplikasi adegan.',
    ],
  },
  {
    stepNumber: 5,
    glyph: 'ꦥꦼꦤꦠꦱ',
    tag: 'Pentas & Kendali AI',
    title: 'Gelar Pagelaran & Dalang Vision',
    icon: Play,
    accentColor: '#22c55e',
    description:
      'Saat lakon telah siap, Anda dapat mementaskannya secara interaktif atau menyimpannya ke arsip digital:',
    tips: [
      'Pratinjau: Masuk ke mode pertunjukan layar penuh dengan kontrol pemutaran babak otomatis.',
      'Dalang Vision: Gerakkan tangan di depan webcam Anda untuk menggerakkan wayang secara magis dengan AI!',
      'Simpan Karya: Simpan lakon ke arsip publik atau privat agar dapat disaksikan penikmat wayang.',
    ],
  },
];

export default function StageGuideModal({ isOpen, onClose }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const totalSteps = GUIDE_STEPS.length;
  const currentStep = GUIDE_STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

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

  // Keyboard navigation: Escape to close/skip, Arrows to navigate
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

  if (!isOpen) return null;

  return (
    <div
      className="stage-guide-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="stage-guide-title"
    >
      <div
        className="stage-guide-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar Atas Tipis */}
        <div className="stage-guide-progress-track">
          <div
            className="stage-guide-progress-fill"
            style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Header Modal */}
        <div className="stage-guide-header">
          <div className="stage-guide-header-meta">
            <span className="stage-guide-badge">
              <Sparkles size={12} color="#d4af37" />
              <span>PANDUAN STUDIO DALANG</span>
            </span>
            <span className="stage-guide-step-count">
              Langkah {currentStep.stepNumber} dari {totalSteps}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="stage-guide-close-btn"
            title="Lewati dan Tutup Panduan (Esc)"
            aria-label="Tutup Panduan"
          >
            <X size={18} />
          </button>
        </div>

        {/* Konten Langkah Terpilih */}
        <div className="stage-guide-body">
          {/* Visual Header Banner Langkah */}
          <div
            className="stage-guide-hero-banner"
            style={{
              borderColor: `${currentStep.accentColor}33`,
              background: `radial-gradient(ellipse at 50% 0%, ${currentStep.accentColor}18 0%, rgba(20, 14, 9, 0.8) 100%)`,
            }}
          >
            <div className="stage-guide-glyph-avatar">
              <span className="stage-guide-glyph-text">{currentStep.glyph}</span>
              <div
                className="stage-guide-icon-pill"
                style={{
                  background: `${currentStep.accentColor}22`,
                  color: currentStep.accentColor,
                  border: `1px solid ${currentStep.accentColor}55`,
                }}
              >
                <StepIcon size={16} />
              </div>
            </div>

            <div className="stage-guide-hero-titles">
              <div
                className="stage-guide-step-tag"
                style={{ color: currentStep.accentColor }}
              >
                {currentStep.tag}
              </div>
              <h2 id="stage-guide-title" className="stage-guide-title">
                {currentStep.title}
              </h2>
            </div>
          </div>

          {/* Deskripsi & Butir Panduan */}
          <p className="stage-guide-desc">{currentStep.description}</p>

          <div className="stage-guide-tips-list">
            {currentStep.tips.map((tip, idx) => (
              <div key={idx} className="stage-guide-tip-item">
                <span
                  className="stage-guide-tip-dot"
                  style={{ background: currentStep.accentColor }}
                />
                <span className="stage-guide-tip-text">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigasi & Aksi */}
        <div className="stage-guide-footer">
          {/* Tombol Lewati / Skip di Sisi Kiri */}
          <button
            type="button"
            onClick={onClose}
            className="stage-guide-skip-btn"
            title="Lewati panduan dan langsung mendalang"
          >
            Lewati Panduan
          </button>

          {/* Titik Indikator Langkah (Dots) */}
          <div className="stage-guide-dots-indicator" aria-label="Indikator langkah">
            {GUIDE_STEPS.map((step, idx) => (
              <button
                key={step.stepNumber}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`stage-guide-dot ${idx === currentStepIndex ? 'is-active' : ''} ${
                  idx < currentStepIndex ? 'is-completed' : ''
                }`}
                title={`Menuju langkah ${step.stepNumber}: ${step.title}`}
                aria-label={`Langkah ${step.stepNumber}`}
              />
            ))}
          </div>

          {/* Navigasi Kanan (Kembali / Lanjut) */}
          <div className="stage-guide-nav-buttons">
            {!isFirstStep && (
              <button
                type="button"
                onClick={handlePrev}
                className="stage-guide-prev-btn"
                title="Langkah sebelumnya"
              >
                <ArrowLeft size={14} />
                <span>Kembali</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="stage-guide-next-btn"
              title={isLastStep ? 'Selesai panduan & mulai mendalang' : 'Lanjut ke langkah berikutnya'}
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
