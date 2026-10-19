import React, { useState } from 'react';
import { CHARACTERS_MASTER } from '../../data/master/charactersMaster';
import { STAGE_CONFIG_MASTER } from '../../data/master/stageConfigMaster';
import { AUDIO_MASTER } from '../../data/master/audioMaster';
import soundEngine from '../../services/soundscape';
import {
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Music,
  Image,
  Clock,
  MessageSquare,
} from 'lucide-react';

export default function SceneComposer({
  scenes,
  activeSceneIndex,
  onSelectScene,
  onAddScene,
  onDuplicateScene,
  onRemoveScene,
  onReorderScene,
  onUpdateScene,
  onAddCharacter,
  onUpdateCharacter,
  onRemoveCharacter,
}) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showAddCharModal, setShowAddCharModal] = useState(false);

  const currentScene = scenes[activeSceneIndex] || scenes[0];
  const currentAudio = AUDIO_MASTER.find((a) => a.id === currentScene.audioAssetId) || AUDIO_MASTER[0];

  const handleToggleBgm = () => {
    if (isAudioPlaying) {
      soundEngine.stopBgm();
      setIsAudioPlaying(false);
    } else {
      soundEngine.startBgm(currentAudio.synthType || 'srepeg', currentAudio.title);
      setIsAudioPlaying(true);
    }
  };

  return (
    <div
      className="scene-composer-container"
      style={{
        background: '#17110c',
        border: '1px solid #362619',
        borderRadius: '14px',
        padding: '16px',
        color: '#fcfaf2',
        marginTop: '16px',
      }}
    >
      {/* 1. TIMELINE STRIP ADEGAN */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#d4af37', letterSpacing: '0.5px' }}>
            TIMELINE ALUR ADEGAN ({scenes.length} Adegan)
          </span>
          <button
            onClick={onAddScene}
            style={{
              background: '#e8bb5c',
              color: '#0d0a07',
              border: 'none',
              padding: '7px 20px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '750',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
            Tambah Adegan
          </button>
        </div>

        {/* Strip Kartu Adegan */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '8px',
          }}
        >
          {scenes.map((scene, idx) => {
            const isActive = idx === activeSceneIndex;
            return (
              <div
                key={scene.id}
                onClick={() => onSelectScene(idx)}
                style={{
                  minWidth: '160px',
                  padding: '10px',
                  borderRadius: '10px',
                  background: isActive ? '#2d1e12' : '#221a13',
                  border: isActive ? '2px solid #d4af37' : '1px solid #362619',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: isActive ? '#fcfaf2' : '#bfae9c' }}>
                    #{idx + 1} {scene.title}
                  </span>
                </div>

                <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '8px' }}>
                  {scene.characters.length} Tokoh • {((scene.durationMs || 5000) / 1000).toFixed(0)}s
                </div>

                {/* Kontrol Aksi Per Adegan */}
                {isActive && (
                  <div style={{ display: 'flex', gap: '4px', marginTop: '6px', borderTop: '1px solid #3e2815', paddingTop: '6px' }}>
                    {idx > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReorderScene(idx, idx - 1);
                        }}
                        title="Geser Kiri"
                        style={miniIconBtnStyle}
                      >
                        <ChevronLeft size={12} />
                      </button>
                    )}
                    {idx < scenes.length - 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReorderScene(idx, idx + 1);
                        }}
                        title="Geser Kanan"
                        style={miniIconBtnStyle}
                      >
                        <ChevronRight size={12} />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateScene(idx);
                      }}
                      title="Duplikasi Adegan"
                      style={miniIconBtnStyle}
                    >
                      <Copy size={12} />
                    </button>
                    {scenes.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveScene(idx);
                        }}
                        title="Hapus Adegan"
                        style={{ ...miniIconBtnStyle, color: '#ef4444' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. PENGATURAN DETAIL ADEGAN AKTIF */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          background: '#1f1710',
          padding: '16px',
          borderRadius: '10px',
          border: '1px solid #362619',
        }}
      >
        {/* Kolom 1: Konfigurasi Panggung & Audio */}
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Judul Adegan</label>
            <input
              type="text"
              value={currentScene.title}
              onChange={(e) => onUpdateScene({ title: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>
                <Image size={12} /> Latar Kelir
              </label>
              <select
                value={currentScene.background}
                onChange={(e) => onUpdateScene({ background: e.target.value })}
                style={inputStyle}
              >
                {STAGE_CONFIG_MASTER.backgrounds.map((bg) => (
                  <option key={bg.id} value={bg.id}>
                    {bg.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                <Clock size={12} /> Durasi Adegan
              </label>
              <select
                value={currentScene.durationMs || 5000}
                onChange={(e) => onUpdateScene({ durationMs: Number(e.target.value) })}
                style={inputStyle}
              >
                <option value={3000}>3 Detik (Cepat)</option>
                <option value={5000}>5 Detik (Normal)</option>
                <option value={8000}>8 Detik (Sedang)</option>
                <option value={12000}>12 Detik (Panjang)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>
              <Music size={12} /> Iringan Gamelan Latar (BGM)
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={currentScene.audioAssetId || 1}
                onChange={(e) => onUpdateScene({ audioAssetId: Number(e.target.value) })}
                style={{ ...inputStyle, flex: 1 }}
              >
                {AUDIO_MASTER.filter((a) => a.category === 'bgm').map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title} ({a.tempo})
                  </option>
                ))}
              </select>
              <button
                onClick={handleToggleBgm}
                title={isAudioPlaying ? 'Hentikan Audio' : 'Dengarkan Audio'}
                style={{
                  background: isAudioPlaying ? '#ef4444' : '#451a03',
                  border: '1px solid #78350f',
                  color: '#fff',
                  borderRadius: '20px',
                  padding: '0 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: '600',
                }}
              >
                {isAudioPlaying ? 'Stop' : 'Cek'}
              </button>
            </div>
          </div>
        </div>

        {/* Kolom 2: Dialog & Tokoh yang Hadir */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={labelStyle}>
              <MessageSquare size={12} /> Naskah Dialog Tokoh di Panggung
            </label>
            <button
              onClick={() => setShowAddCharModal(true)}
              style={{
                background: '#e8bb5c',
                border: 'none',
                color: '#0d0a07',
                padding: '4px 14px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '750',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#dcae4d';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#e8bb5c';
              }}
            >
              Tambah Tokoh
            </button>
          </div>

          {/* Daftar Wayang & Input Dialog */}
          <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentScene.characters.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#6b7280', fontSize: '12px' }}>
                Belum ada wayang di adegan ini. Klik "+ Tokoh" untuk menancapkan wayang ke panggung.
              </div>
            ) : (
              currentScene.characters.map((char) => (
                <div
                  key={char.instanceId}
                  style={{
                    background: '#282533',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    borderLeft: `3px solid ${char.accentColor || '#f59e0b'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: char.accentColor }}>
                      {char.name}
                    </span>
                    <button
                      onClick={() => onRemoveCharacter(char.instanceId)}
                      title="Hapus Tokoh"
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '10px' }}
                    >
                      Hapus
                    </button>
                  </div>
                  <input
                    type="text"
                    value={char.dialogue || ''}
                    onChange={(e) => onUpdateCharacter(char.instanceId, { dialogue: e.target.value })}
                    placeholder={`Tulis ucapan/dialog untuk ${char.name}...`}
                    style={{
                      width: '100%',
                      background: '#1a1822',
                      border: '1px solid #3a3648',
                      color: '#f3f4f6',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal Pemilihan Tokoh Baru */}
      {showAddCharModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: '#17110c',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '480px',
              width: '90%',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ margin: 0, color: '#d4af37', fontSize: '16px', fontWeight: '700' }}>Pilih Tokoh Wayang</h4>
              <button
                onClick={() => setShowAddCharModal(false)}
                style={{ background: 'none', border: 'none', color: '#bfae9c', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#bfae9c' }}>
              Pilih karakter wayang kulit yang ingin ditampilkan di atas kelir panggung untuk adegan ini.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {CHARACTERS_MASTER.map((char) => (
                <button
                  key={char.id}
                  onClick={() => {
                    onAddCharacter(char.id);
                    setShowAddCharModal(false);
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    background: '#231a13',
                    border: '1px solid #362619',
                    borderRadius: '10px',
                    padding: '12px',
                    cursor: 'pointer',
                    color: '#fcfaf2',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: char.accentColor }}>{char.name}</span>
                  <span style={{ fontSize: '10px', color: '#bfae9c', marginTop: '2px' }}>{char.typeName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '11px',
  fontWeight: '600',
  color: '#d4af37',
  marginBottom: '4px',
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  background: '#0d0a07',
  border: '1px solid #362619',
  borderRadius: '8px',
  color: '#fcfaf2',
  fontSize: '12px',
  boxSizing: 'border-box',
};

const miniIconBtnStyle = {
  background: '#231a13',
  border: '1px solid #362619',
  color: '#bfae9c',
  padding: '4px 7px',
  borderRadius: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
};
