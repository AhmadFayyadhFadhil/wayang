import React, { useState } from 'react';
import { CHARACTERS_MASTER } from '../../data/master/charactersMaster';
import { getAllBackgrounds } from '../../data/master/stageConfigMaster';
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
  X,
  UserPlus,
} from 'lucide-react';

import avatarGatotkaca from '../../assets/avatar_gatotkaca.png';
import avatarArjuna from '../../assets/avatar_arjuna.png';
import avatarShinta from '../../assets/avatar_shinta.png';
import avatarBima from '../../assets/avatar_bima.png';

const CHAR_AVATARS = {
  gatotkaca: avatarGatotkaca,
  arjuna: avatarArjuna,
  shinta: avatarShinta,
  werkudara: avatarBima,
};

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
                {getAllBackgrounds().map((bg) => (
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

      {/* Modal Pemilihan Tokoh Baru ke Babak Kelir */}
      {showAddCharModal && (
        <div
          className="wayang-modal-backdrop"
          style={{ zIndex: 1100 }}
          onClick={() => setShowAddCharModal(false)}
        >
          <div
            className="wayang-modal-chassis"
            style={{ maxWidth: '580px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="wayang-modal-inner modal-custom-scroll" style={{ padding: '30px 26px' }}>
              <div className="wayang-modal-hairline" />

              {/* Header Modal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '20px', borderBottom: '1px solid rgba(212, 175, 55, 0.15)', paddingBottom: '16px' }}>
                <div>
                  <div className="wayang-modal-eyebrow" style={{ marginBottom: '8px' }}>
                    <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#d4af37' }} />
                    <span>ROSTER TOKOH WAYANG KULIT</span>
                  </div>
                  <h4
                    style={{
                      margin: 0,
                      color: '#1a140e',
                      fontSize: '21px',
                      fontWeight: '850',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      letterSpacing: '-0.3px',
                      fontFamily: 'Cinzel, Georgia, serif',
                    }}
                  >
                    <UserPlus size={18} style={{ color: '#8b4513' }} />
                    <span>Pilih Tokoh ke Panggung</span>
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddCharModal(false)}
                  aria-label="Tutup Dialog"
                  className="wayang-modal-close-btn"
                >
                  <X size={18} />
                </button>
              </div>

            <p style={{ margin: '0 0 18px 0', fontSize: '13.5px', color: '#5c4738', lineHeight: '1.5' }}>
              Pilih karakter wayang kulit yang ingin ditampilkan di atas kelir panggung untuk adegan babak ini.
            </p>

            {/* Grid Tokoh Karakter */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px' }}>
              {CHARACTERS_MASTER.map((char) => {
                const avatarImg = CHAR_AVATARS[char.slug];

                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => {
                      onAddCharacter(char.id);
                      setShowAddCharModal(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: '#ffffff',
                      border: '1px solid rgba(212, 175, 55, 0.32)',
                      borderRadius: '16px',
                      padding: '12px 14px',
                      cursor: 'pointer',
                      color: '#1a140e',
                      textAlign: 'left',
                      minHeight: '44px',
                      boxShadow: '0 2px 8px rgba(40, 28, 16, 0.04)',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#d4af37';
                      e.currentTarget.style.background = 'rgba(212, 175, 55, 0.12)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.32)';
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        border: `1.5px solid ${char.accentColor || '#d4af37'}`,
                        overflow: 'hidden',
                        background: '#0d0805',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {avatarImg ? (
                        <img src={avatarImg} alt={char.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontWeight: '800', color: '#e8bb5c', fontSize: '15px' }}>{char.name[0]}</span>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#1a140e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {char.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#8b4513', fontWeight: '700', marginTop: '1px' }}>
                        {char.typeName}
                      </div>
                      {char.weapons && (
                        <div style={{ fontSize: '10.5px', color: '#6e5e4d', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          Pusaka: {char.weapons.split(',')[0]}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
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
