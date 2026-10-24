import React, { useState } from 'react';
import { STORIES_MASTER } from '../../data/master/storiesMaster';
import persistenceService from '../../services/persistenceService';
import soundEngine from '../../services/soundscape';
import confetti from 'canvas-confetti';
import { CheckCircle, AlertCircle, Globe, Lock, BookOpen, Save, X } from 'lucide-react';

export default function SavePerformanceModal({
  isOpen,
  onClose,
  metadata,
  onUpdateMetadata,
  exportSceneData,
  onSavedSuccess,
}) {
  const [title, setTitle] = useState(metadata?.title || '');
  const [description, setDescription] = useState(metadata?.description || '');
  const [storyId, setStoryId] = useState(metadata?.storyId || '');
  const [visibility, setVisibility] = useState(metadata?.visibility || 'public');
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || title.trim().length < 3) {
      setStatusMessage({ type: 'error', text: 'Judul pertunjukan wajib minimal 3 karakter.' });
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    const updatedMeta = {
      ...metadata,
      title: title.trim(),
      description: description.trim(),
      storyId: storyId ? Number(storyId) : null,
      visibility,
    };
    onUpdateMetadata(updatedMeta);

    const sceneDataPayload = exportSceneData();

    const result = await persistenceService.savePerformance(updatedMeta, sceneDataPayload);
    setSaving(false);

    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: result.syncedWithServer
          ? 'Karya berhasil disimpan ke basis data arsip.'
          : 'Karya tersimpan aman di penyimpanan lokal (offline mode).',
      });

      // Efek perayaan suara gong & confetti
      try {
        if (typeof confetti === 'function') {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
        }
        soundEngine.playGong();
      } catch (_e) {}

      if (onSavedSuccess) onSavedSuccess(result.data);
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setStatusMessage({ type: 'error', text: 'Gagal menyimpan karya. Silakan coba kembali.' });
    }
  };

  return (
    <div
      className="wayang-modal-backdrop"
      style={{ zIndex: 1100 }}
      onClick={onClose}
    >
      <div
        className="wayang-modal-chassis"
        style={{ maxWidth: '560px', width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="wayang-modal-inner modal-custom-scroll" style={{ padding: '32px 28px' }}>
          <div className="wayang-modal-hairline" />

          {/* Header Modal dengan Eyebrow Budaya & Tombol Tutup */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '22px', borderBottom: '1px solid rgba(212, 175, 55, 0.15)', paddingBottom: '16px' }}>
            <div>
              <div className="wayang-modal-eyebrow" style={{ marginBottom: '8px' }}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#d4af37' }} />
                <span>PRESERVASI SANGGAR DALANG</span>
              </div>
              <h3
                style={{
                  margin: 0,
                  color: '#1a140e',
                  fontSize: '22px',
                  fontWeight: '850',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  letterSpacing: '-0.3px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <Save size={20} style={{ color: '#8b4513' }} />
                <span>Simpan Lakon Pementasan</span>
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup Dialog"
              className="wayang-modal-close-btn"
            >
              <X size={18} />
            </button>
          </div>

        <form onSubmit={handleSave}>
          {/* Judul Pertunjukan */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>
              <span>Judul Lakon Pertunjukan</span>
              <span style={{ color: '#8b4513' }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Gugurnya Sang Senopati Udara"
              maxLength={100}
              required
              style={inputStyle}
            />
          </div>

          {/* Deskripsi Karya */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Deskripsi & Catatan Sutradara Dalang</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan intisari adegan, pesan moral, atau pesan watak dari pagelaran ini..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Rujukan Cerita Sumber (Cultural Integrity) */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>
              <BookOpen size={13} style={{ color: '#8b4513' }} />
              <span>Rujukan Naskah Wiracarita (Opsional)</span>
            </label>
            <select
              value={storyId}
              onChange={(e) => setStoryId(e.target.value)}
              style={inputStyle}
            >
              <option value="">-- Interpretasi Mandiri / Lakon Carangan --</option>
              {STORIES_MASTER.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.tradition})
                </option>
              ))}
            </select>
            <div style={{ fontSize: '11px', color: '#6e5e4d', marginTop: '5px', lineHeight: '1.45' }}>
              Menautkan lakon ke naskah pakem menjaga sanad budaya dan rujukan pementasan.
            </div>
          </div>

          {/* Visibilitas Karya */}
          <div style={{ marginBottom: '22px' }}>
            <label style={labelStyle}>Pilihan Visibilitas Pagelaran</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setVisibility('public')}
                style={{
                  ...optionBtnStyle,
                  borderColor: visibility === 'public' ? '#d4af37' : 'rgba(212, 175, 55, 0.28)',
                  background: visibility === 'public' ? 'rgba(212, 175, 55, 0.16)' : '#ffffff',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: visibility === 'public' ? '#d4af37' : 'rgba(212, 175, 55, 0.12)',
                    color: visibility === 'public' ? '#0d0a07' : '#8b4513',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Globe size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: '750', fontSize: '13px', color: '#1a140e' }}>Galeri Publik</div>
                  <div style={{ fontSize: '11px', color: '#6e5e4d', marginTop: '2px' }}>Dapat ditonton oleh umum</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setVisibility('private')}
                style={{
                  ...optionBtnStyle,
                  borderColor: visibility === 'private' ? '#d4af37' : 'rgba(212, 175, 55, 0.28)',
                  background: visibility === 'private' ? 'rgba(212, 175, 55, 0.16)' : '#ffffff',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: visibility === 'private' ? '#d4af37' : 'rgba(212, 175, 55, 0.12)',
                    color: visibility === 'private' ? '#0d0a07' : '#8b4513',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Lock size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: '750', fontSize: '13px', color: '#1a140e' }}>Sanggar Privat</div>
                  <div style={{ fontSize: '11px', color: '#6e5e4d', marginTop: '2px' }}>Hanya tersimpan untuk Anda</div>
                </div>
              </button>
            </div>
          </div>

          {/* Status Feedback Message */}
          {statusMessage && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '18px',
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.14)' : 'rgba(239, 68, 68, 0.12)',
                color: statusMessage.type === 'success' ? '#047857' : '#b91c1c',
                border: `1px solid ${statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.35)'}`,
              }}
            >
              {statusMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Tombol Aksi */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '10px', borderTop: '1px solid rgba(212, 175, 55, 0.25)' }}>
            <button
              type="button"
              onClick={onClose}
              className="wayang-btn-ghost"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="wayang-btn-cta"
            >
              <span>{saving ? 'Menyimpan...' : 'Simpan Lakon Sekarang'}</span>
              <span className="wayang-btn-cta-icon">
                <Save size={15} color="#16100a" />
              </span>
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '12px',
  fontWeight: '750',
  color: '#6e5e4d',
  marginBottom: '7px',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  background: '#ffffff',
  border: '1px solid rgba(212, 175, 55, 0.35)',
  borderRadius: '12px',
  color: '#1a140e',
  fontSize: '13.5px',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.2s ease',
  fontFamily: 'inherit',
};

const optionBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 14px',
  borderRadius: '14px',
  borderWidth: '1px',
  borderStyle: 'solid',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.2s ease',
  minHeight: '44px',
  boxSizing: 'border-box',
  boxShadow: '0 2px 8px rgba(40, 28, 16, 0.04)',
};
