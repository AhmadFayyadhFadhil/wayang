import React from 'react';
import { X, Sparkles, Swords, User, CheckCircle } from 'lucide-react';

export default function DalangVisionTutorialModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(10, 7, 5, 0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          background: '#18120c',
          border: '1px solid #8b4513',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(212, 175, 55, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div
          style={{
            padding: '24px 28px 16px',
            borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(to bottom, #241910, #18120c)',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: '800',
                color: '#d4af37',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              <Sparkles size={12} />
              <span>PANDUAN DIGITAL DALANG VISION</span>
            </div>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#fcfaf2', fontWeight: '800' }}>
              Cara Mendalang dengan Telapak Tangan
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#a89a8a',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Isi Panduan 3 Langkah Pokok */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Langkah 1: Pinch / Cengkeram Cempurit */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
              padding: '14px 16px',
              borderRadius: '14px',
              background: '#221810',
              border: '1px solid rgba(212, 175, 55, 0.2)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                color: '#e8bb5c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0,
              }}
            >
              🔒
            </div>
            <div>
              <div style={{ fontWeight: '800', color: '#fcfaf2', fontSize: '14px', marginBottom: '3px' }}>
                1. Telapak Tangan Otomatis Terkunci (Auto-Lock)
              </div>
              <div style={{ fontSize: '12.5px', color: '#d5c4b1', lineHeight: '1.5' }}>
                Cukup angkat tangan Anda di depan kamera. Tangan kiri otomatis mengunci tokoh kiri dan tangan kanan mengunci tokoh kanan. Wayang langsung melayang mulus mengikuti gerakan tangan tanpa membuat dalang lelah.
              </div>
            </div>
          </div>

          {/* Langkah 2: Miringkan Telapak untuk Balik Arah Hadap */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
              padding: '14px 16px',
              borderRadius: '14px',
              background: '#221810',
              border: '1px solid rgba(212, 175, 55, 0.2)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                color: '#e8bb5c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0,
              }}
            >
              🔄
            </div>
            <div>
              <div style={{ fontWeight: '800', color: '#fcfaf2', fontSize: '14px', marginBottom: '3px' }}>
                2. Miringkan Telapak untuk Balik Arah Hadap (Flip)
              </div>
              <div style={{ fontSize: '12.5px', color: '#d5c4b1', lineHeight: '1.5' }}>
                Miringkan telapak ke kiri agar wayang hadap kiri, miringkan ke kanan agar wayang hadap kanan. Kepalkan tangan untuk pose perang sabetan, atau rapatkan kedua telapak untuk sembah takzim.
              </div>
            </div>
          </div>

          {/* Langkah 3: Dua Mode Pilihan */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}
          >
            <div
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e8bb5c', fontWeight: '800', fontSize: '13px', marginBottom: '4px' }}>
                <User size={14} />
                <span>Mode 1 Tokoh (Solo)</span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#bfae9c', lineHeight: '1.4' }}>
                Satu tangan menggerakkan posisi cempurit badan, tangan kedua mengendalikan artikulasi tuding lengan & sembah.
              </div>
            </div>

            <div
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e8bb5c', fontWeight: '800', fontSize: '13px', marginBottom: '4px' }}>
                <Swords size={14} />
                <span>Mode 2 Tokoh (Laga)</span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#bfae9c', lineHeight: '1.4' }}>
                Tangan kiri kendalikan tokoh kiri, tangan kanan kendalikan tokoh kanan. Dekatkan kedua tangan untuk adegan perang tanding!
              </div>
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div
          style={{
            padding: '16px 28px 24px',
            borderTop: '1px solid rgba(212, 175, 55, 0.15)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="wayang-btn-cta"
            style={{ borderRadius: '10px' }}
          >
            <CheckCircle size={15} color="#16100a" />
            <span>Saya Mengerti, Mulai Mendalang</span>
          </button>
        </div>
      </div>
    </div>
  );
}
