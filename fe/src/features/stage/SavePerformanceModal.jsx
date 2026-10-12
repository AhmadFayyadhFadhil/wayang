import React, { useState } from 'react';
import { STORIES_MASTER } from '../../data/master/storiesMaster';
import persistenceService from '../../services/persistenceService';
import soundEngine from '../../services/soundscape';
import confetti from 'canvas-confetti';
import { Save, CheckCircle, AlertCircle, Globe, Lock, BookOpen } from 'lucide-react';

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
          ? '🎉 Karya berhasil disimpan ke server & database!'
          : '💾 Karya tersimpan aman secara lokal (Offline cache).',
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
          background: '#1a1822',
          border: '2px solid #78350f',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '520px',
          width: '90%',
          color: '#f9fafb',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: '#f59e0b', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            💾 Simpan Pertunjukan Wayang
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '18px', cursor: 'pointer' }}
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
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
              ℹ️ Menghubungkan karya ke arsip cerita menjaga integritas budaya dan atribusi tradisi.
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
                  borderColor: visibility === 'public' ? '#10b981' : '#374151',
                  background: visibility === 'public' ? '#064e3b' : '#27272a',
                }}
              >
                <Globe size={16} color={visibility === 'public' ? '#34d399' : '#9ca3af'} />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '12px' }}>Publik (Galeri)</div>
                  <div style={{ fontSize: '10px', color: '#9ca3af' }}>Dapat ditonton di Connected Archive</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setVisibility('private')}
                style={{
                  ...optionBtnStyle,
                  borderColor: visibility === 'private' ? '#f59e0b' : '#374151',
                  background: visibility === 'private' ? '#451a03' : '#27272a',
                }}
              >
                <Lock size={16} color={visibility === 'private' ? '#fbbf24' : '#9ca3af'} />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '12px' }}>Privat (Pribadi)</div>
                  <div style={{ fontSize: '10px', color: '#9ca3af' }}>Hanya Anda yang dapat membuka</div>
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
                background: statusMessage.type === 'success' ? '#064e3b' : '#450a0a',
                color: statusMessage.type === 'success' ? '#34d399' : '#f87171',
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
                background: '#27272a',
                border: '1px solid #3f3f46',
                color: '#d4d4d8',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: '#b45309',
                border: 'none',
                color: '#fff',
                padding: '8px 20px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: saving ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
              }}
            >
              <Save size={16} /> {saving ? 'Menyimpan...' : 'Simpan Sekarang'}
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
  color: '#e5e7eb',
  marginBottom: '6px',
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  background: '#121118',
  border: '1px solid #3a3648',
  borderRadius: '8px',
  color: '#f9fafb',
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
