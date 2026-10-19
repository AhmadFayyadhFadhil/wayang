import React, { useState } from 'react';
import { STORIES_MASTER } from '../../data/master/storiesMaster';
import persistenceService from '../../services/persistenceService';
import soundEngine from '../../services/soundscape';
import { CheckCircle, AlertCircle, Globe, Lock, BookOpen, Save } from 'lucide-react';

export default function SavePerformanceModal({
  isOpen,
  onClose,
  metadata,
  onUpdateMetadata,
  exportSceneData,
  onSavedSuccess,
}) {
  const [title, setTitle] = useState(metadata.title || '');
  const [description, setDescription] = useState(metadata.description || '');
  const [storyId, setStoryId] = useState(metadata.storyId || '');
  const [visibility, setVisibility] = useState(metadata.visibility || 'public');
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
          ? 'Karya berhasil disimpan ke basis data.'
          : 'Karya tersimpan aman di penyimpanan lokal.',
      });

      // Efek perayaan
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
        soundEngine.playGong();
      } catch (_e) {}

      if (onSavedSuccess) onSavedSuccess(result.data);
      setTimeout(() => {
        onClose();
      }, 1400);
    } else {
      setStatusMessage({ type: 'error', text: 'Gagal menyimpan karya. Coba kembali.' });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: '#17110c',
          border: '1px solid rgba(212, 175, 55, 0.22)',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '520px',
          width: '90%',
          color: '#fcfaf2',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: '#d4af37', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Save size={18} /> Simpan Pertunjukan Wayang
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#bfae9c', fontSize: '18px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave}>
          {/* Judul Pertunjukan */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Judul Pertunjukan (Wajib)*</label>
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
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Deskripsi / Catatan Sutradara Dalang</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan pesan moral atau interpretasi dari adegan ini..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Rujukan Cerita Sumber (Cultural Integrity) */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>
              <BookOpen size={12} /> Rujukan Cerita / Lakon Asal (Opsional)
            </label>
            <select
              value={storyId}
              onChange={(e) => setStoryId(e.target.value)}
              style={inputStyle}
            >
              <option value="">-- Interpretasi Mandiri / Bebas --</option>
              {STORIES_MASTER.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.tradition})
                </option>
              ))}
            </select>
            <div style={{ fontSize: '11px', color: '#bfae9c', marginTop: '4px' }}>
              Menghubungkan karya ke arsip naskah menjaga integritas budaya dan atribusi tradisi.
            </div>
          </div>

          {/* Visibilitas Karya */}
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Visibilitas Publikasi</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setVisibility('public')}
                style={{
                  ...optionBtnStyle,
                  borderColor: visibility === 'public' ? '#10b981' : '#362619',
                  background: visibility === 'public' ? 'rgba(16, 185, 129, 0.15)' : '#221a13',
                }}
              >
                <Globe size={16} color={visibility === 'public' ? '#6ee7b7' : '#bfae9c'} />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '12px' }}>Publik (Galeri)</div>
                  <div style={{ fontSize: '10px', color: '#bfae9c' }}>Dapat ditonton di Arsip Terhubung</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setVisibility('private')}
                style={{
                  ...optionBtnStyle,
                  borderColor: visibility === 'private' ? '#d4af37' : '#362619',
                  background: visibility === 'private' ? 'rgba(212, 175, 55, 0.12)' : '#221a13',
                }}
              >
                <Lock size={16} color={visibility === 'private' ? '#d4af37' : '#bfae9c'} />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '12px' }}>Privat (Pribadi)</div>
                  <div style={{ fontSize: '10px', color: '#bfae9c' }}>Hanya Anda yang dapat membuka</div>
                </div>
              </button>
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '14px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(153, 27, 27, 0.2)',
                color: statusMessage.type === 'success' ? '#6ee7b7' : '#fca5a5',
                border: `1px solid ${statusMessage.type === 'success' ? '#10b981' : '#ef4444'}`,
              }}
            >
              {statusMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {statusMessage.text}
            </div>
          )}

          {/* Tombol Simpan */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#221a13',
                border: '1px solid #4a3826',
                color: '#fcfaf2',
                padding: '9px 20px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: '#e8bb5c',
                border: 'none',
                color: '#0d0a07',
                padding: '9px 24px',
                borderRadius: '20px',
                fontWeight: '750',
                cursor: saving ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                boxShadow: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#dcae4d';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#e8bb5c';
              }}
            >
              {saving ? 'Menyimpan...' : 'Simpan Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '12px',
  fontWeight: '600',
  color: '#bfae9c',
  marginBottom: '6px',
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  background: '#0d0a07',
  border: '1px solid #362619',
  borderRadius: '8px',
  color: '#fcfaf2',
  fontSize: '13px',
  boxSizing: 'border-box',
};

const optionBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px',
  borderRadius: '10px',
  borderWidth: '2px',
  borderStyle: 'solid',
  cursor: 'pointer',
  textAlign: 'left',
  color: '#f9fafb',
};
