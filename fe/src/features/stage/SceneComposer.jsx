import React, { useState, useRef } from 'react';
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
  Upload,
  Play,
  Square,
  Film,
  Users,
  Plus,
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
  const customFileInputRef = useRef(null);

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

  const handleUploadCustomPuppet = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    onAddCharacter({
      name: cleanName || 'Wayang Koleksi Dalang',
      customImageUrl: url,
    });
    setShowAddCharModal(false);
    try {
      soundEngine.playDodogan();
    } catch {
      // Audio fail-soft
    }
  };

  return (
    <div
      className="scene-composer-container"
      style={{
        background: 'linear-gradient(180deg, rgba(22, 16, 12, 0.95) 0%, rgba(13, 9, 7, 0.98) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.28)',
        borderRadius: '18px',
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.5)',
        padding: '20px',
        color: '#fcfaf2',
        marginTop: '18px',
        position: 'relative',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* 1. TIMELINE STRIP ADEGAN (CINEMATIC BABAK REEL) */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div
              style={{
                fontSize: '10px',
                fontWeight: '800',
                color: '#d4af37',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '3px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d4af37' }} />
              <span>KHAZANAH ALUR LAKON • SINEMATIK KELIR</span>
            </div>
            <div style={{ fontSize: '15px', fontWeight: '850', color: '#fcfaf2', letterSpacing: '-0.2px' }}>
              Timeline Babak Pertunjukan ({scenes.length} Babak)
            </div>
          </div>

          <button
            onClick={() => {
              onAddScene();
              try {
                soundEngine.playDodogan();
              } catch {
                // Audio fail-soft
              }
            }}
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #c59b27 100%)',
              color: '#0d0a07',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.25)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.08)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Plus size={14} />
            <span>Tambah Babak</span>
          </button>
        </div>

        {/* Reel Kartu Babak Horisontal */}
        <div
          className="modal-custom-scroll"
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '10px',
            paddingTop: '2px',
          }}
        >
          {scenes.map((scene, idx) => {
            const isActive = idx === activeSceneIndex;
            const pathetLabel =
              idx === 0
                ? 'Pathet Nem'
                : idx === 1
                ? 'Pathet Sanga'
                : idx === 2
                ? 'Pathet Manyura'
                : `Manyura (${idx + 1})`;

            return (
              <div
                key={scene.id}
                onClick={() => onSelectScene(idx)}
                style={{
                  minWidth: '185px',
                  maxWidth: '220px',
                  padding: '12px',
                  borderRadius: '12px',
                  background: isActive
                    ? 'linear-gradient(145deg, #2a1c12 0%, #1a120b 100%)'
                    : 'rgba(24, 18, 14, 0.75)',
                  border: isActive ? '1.5px solid #d4af37' : '1px solid rgba(212, 175, 55, 0.18)',
                  boxShadow: isActive ? '0 6px 20px rgba(212, 175, 55, 0.18)' : '0 2px 6px rgba(0,0,0,0.25)',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  flexShrink: 0,
                }}
              >
                {/* Header Babak: Nomor & Pathet Tradisi */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: '800',
                        color: isActive ? '#fef08a' : '#d4af37',
                        background: 'rgba(212, 175, 55, 0.12)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                      }}
                    >
                      Babak #{idx + 1}
                    </span>
                    <span style={{ fontSize: '10px', color: '#c59b27', fontWeight: '650' }}>
                      {pathetLabel}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: '800',
                      color: isActive ? '#fcfaf2' : '#d5c7b5',
                      marginBottom: '8px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={scene.title}
                  >
                    {scene.title || `Babak ${idx + 1}`}
                  </div>
                </div>

                {/* Info Tokoh & Durasi */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '11px',
                      color: '#a3978c',
                      marginBottom: isActive ? '8px' : '0',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Users size={11} style={{ color: '#d4af37' }} />
                      {(scene.characters || []).length} Tokoh
                    </span>
                    <span>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={11} style={{ color: '#d4af37' }} />
                      {((scene.durationMs || 5000) / 1000).toFixed(0)}s
                    </span>
                  </div>

                  {/* Kontrol Aksi Babak Aktif */}
                  {isActive && (
                    <div
                      style={{
                        display: 'flex',
                        gap: '4px',
                        marginTop: '6px',
                        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
                        paddingTop: '6px',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {idx > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onReorderScene(idx, idx - 1);
                            }}
                            title="Geser Kiri (Sebelumnya)"
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
                            title="Geser Kanan (Selanjutnya)"
                            style={miniIconBtnStyle}
                          >
                            <ChevronRight size={12} />
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicateScene(idx);
                          }}
                          title="Duplikasi Babak Ini"
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
                            title="Hapus Babak"
                            style={{ ...miniIconBtnStyle, color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. PENGATURAN DETAIL ADEGAN AKTIF (DUAL-PANEL DECK) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '18px',
          background: 'rgba(26, 19, 13, 0.85)',
          padding: '18px',
          borderRadius: '14px',
          border: '1px solid rgba(212, 175, 55, 0.2)',
        }}
      >
        {/* Kolom 1: Konfigurasi Panggung & Audio BGM */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px',
              borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
              paddingBottom: '8px',
            }}
          >
            <Film size={14} style={{ color: '#d4af37' }} />
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#fcfaf2', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Reka Adegan & Latar Suara
            </span>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Judul Babak Ini</label>
            <input
              type="text"
              value={currentScene.title}
              onChange={(e) => onUpdateScene({ title: e.target.value })}
              style={inputStyle}
              placeholder="Contoh: Jejer Astina, Gara-gara, dsb..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>
                <Image size={12} style={{ color: '#d4af37' }} /> Latar Kelir
              </label>
              <select
                value={currentScene.background}
                onChange={(e) => onUpdateScene({ background: e.target.value })}
                style={inputStyle}
              >
                {getAllBackgrounds().map((bg) => (
                  <option key={bg.id} value={bg.id} style={{ background: '#1c140e', color: '#fcfaf2' }}>
                    {bg.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                <Clock size={12} style={{ color: '#d4af37' }} /> Durasi Babak
              </label>
              <select
                value={currentScene.durationMs || 5000}
                onChange={(e) => onUpdateScene({ durationMs: Number(e.target.value) })}
                style={inputStyle}
              >
                <option value={3000} style={{ background: '#1c140e', color: '#fcfaf2' }}>3 Detik (Cepat / Adegan Kilat)</option>
                <option value={5000} style={{ background: '#1c140e', color: '#fcfaf2' }}>5 Detik (Normal)</option>
                <option value={8000} style={{ background: '#1c140e', color: '#fcfaf2' }}>8 Detik (Sedang / Dialog Panjang)</option>
                <option value={12000} style={{ background: '#1c140e', color: '#fcfaf2' }}>12 Detik (Lambat / Suasana Khidmat)</option>
                <option value={16000} style={{ background: '#1c140e', color: '#fcfaf2' }}>16 Detik (Pentas Utama)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>
              <Music size={12} style={{ color: '#d4af37' }} /> Iringan Gamelan Latar (BGM)
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={currentScene.audioAssetId || 1}
                onChange={(e) => onUpdateScene({ audioAssetId: Number(e.target.value) })}
                style={{ ...inputStyle, flex: 1 }}
              >
                {AUDIO_MASTER.filter((a) => a.category === 'bgm').map((a) => (
                  <option key={a.id} value={a.id} style={{ background: '#1c140e', color: '#fcfaf2' }}>
                    {a.title} ({a.tempo})
                  </option>
                ))}
              </select>
              <button
                onClick={handleToggleBgm}
                title={isAudioPlaying ? 'Hentikan Audio Gamelan' : 'Dengarkan Audio Gamelan'}
                style={{
                  background: isAudioPlaying
                    ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
                    : 'linear-gradient(135deg, #2a1c12 0%, #19110a 100%)',
                  border: `1px solid ${isAudioPlaying ? '#f87171' : 'rgba(212, 175, 55, 0.45)'}`,
                  color: isAudioPlaying ? '#ffffff' : '#e8bb5c',
                  borderRadius: '10px',
                  padding: '0 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11.5px',
                  fontWeight: '750',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  boxShadow: isAudioPlaying ? '0 0 10px rgba(239, 68, 68, 0.35)' : 'none',
                }}
              >
                {isAudioPlaying ? <Square size={12} /> : <Play size={12} />}
                <span>{isAudioPlaying ? 'Stop' : 'Cek'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Kolom 2: Kotak Wayang & Dialog Sabda Dalang */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px',
              borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
              paddingBottom: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={14} style={{ color: '#d4af37' }} />
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#fcfaf2', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Kotak Tokoh & Sabda Dalang
              </span>
            </div>

            <button
              onClick={() => setShowAddCharModal(true)}
              style={{
                background: 'linear-gradient(135deg, #d4af37 0%, #c59b27 100%)',
                border: 'none',
                color: '#0d0a07',
                padding: '5px 14px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 2px 6px rgba(212, 175, 55, 0.25)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'none';
              }}
            >
              <UserPlus size={12} />
              <span>+ Tancep Tokoh</span>
            </button>
          </div>

          {/* Daftar Wayang & Input Dialog */}
          <div
            className="modal-custom-scroll"
            style={{
              maxHeight: '210px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              paddingRight: '4px',
            }}
          >
            {(currentScene.characters || []).length === 0 ? (
              <div
                style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  background: 'rgba(20, 14, 10, 0.6)',
                  borderRadius: '10px',
                  border: '1px dashed rgba(212, 175, 55, 0.25)',
                  color: '#a3978c',
                  fontSize: '12px',
                }}
              >
                Belum ada tokoh di atas kelir. Klik <strong>"+ Tancep Tokoh"</strong> untuk menata wayang ke panggung babak ini.
              </div>
            ) : (
              currentScene.characters.map((char) => {
                const avatarImg = CHAR_AVATARS[char.slug];

                return (
                  <div
                    key={char.instanceId}
                    style={{
                      background: 'rgba(30, 22, 16, 0.9)',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(212, 175, 55, 0.22)',
                      borderLeft: `4px solid ${char.accentColor || '#d4af37'}`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
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
                            <span style={{ fontWeight: '800', color: '#d4af37', fontSize: '11px' }}>
                              {(char.name || 'W')[0]}
                            </span>
                          )}
                        </div>

                        <span style={{ fontSize: '12px', fontWeight: '800', color: char.accentColor || '#fcfaf2' }}>
                          {char.name}
                        </span>
                      </div>

                      <button
                        onClick={() => onRemoveCharacter(char.instanceId)}
                        title="Lepas tokoh dari babak kelir ini"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#f87171',
                          cursor: 'pointer',
                          fontSize: '11px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        <Trash2 size={11} />
                        <span>Hapus</span>
                      </button>
                    </div>

                    <input
                      type="text"
                      value={char.dialogue || ''}
                      onChange={(e) => onUpdateCharacter(char.instanceId, { dialogue: e.target.value })}
                      placeholder={`Tulis sabda/ucapan dalang untuk ${char.name}...`}
                      style={{
                        width: '100%',
                        background: 'rgba(14, 10, 7, 0.85)',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        color: '#f3f4f6',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '11.5px',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.15s ease',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#d4af37';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(212, 175, 55, 0.25)';
                      }}
                    />
                  </div>
                );
              })
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
            style={{ maxWidth: '620px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="wayang-modal-inner modal-custom-scroll" style={{ padding: '28px 24px' }}>
              <div className="wayang-modal-hairline" />

              {/* Header Modal */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '16px',
                  marginBottom: '18px',
                  borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
                  paddingBottom: '14px',
                }}
              >
                <div>
                  <div className="wayang-modal-eyebrow" style={{ marginBottom: '6px' }}>
                    <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#d4af37' }} />
                    <span>ROSTER TOKOH WAYANG KULIT</span>
                  </div>
                  <h4
                    style={{
                      margin: 0,
                      color: '#1a140e',
                      fontSize: '20px',
                      fontWeight: '850',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      letterSpacing: '-0.3px',
                      fontFamily: 'Cinzel, Georgia, serif',
                    }}
                  >
                    <UserPlus size={18} style={{ color: '#8b4513' }} />
                    <span>Pilih Tokoh ke Panggung Kelir</span>
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

              {/* Input File Tersembunyi untuk Unggah Wayang Sendiri */}
              <input
                ref={customFileInputRef}
                type="file"
                accept="image/png,image/webp,image/jpeg"
                onChange={handleUploadCustomPuppet}
                style={{ display: 'none' }}
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <p style={{ margin: 0, fontSize: '13px', color: '#5c4738', lineHeight: '1.5' }}>
                  Pilih karakter wayang kulit yang ingin ditancapkan di atas kelir panggung untuk babak ini.
                </p>
                <button
                  type="button"
                  onClick={() => customFileInputRef.current?.click()}
                  style={{
                    background: 'linear-gradient(135deg, #2a1c12 0%, #150d08 100%)',
                    border: '1px solid rgba(212, 175, 55, 0.45)',
                    borderRadius: '10px',
                    color: '#fef08a',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 750,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                >
                  <Upload size={14} style={{ color: '#eab308' }} />
                  <span>+ Unggah Wayang Sendiri</span>
                </button>
              </div>

              {/* Grid Tokoh Karakter */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
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
                        borderRadius: '14px',
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
  fontSize: '11.5px',
  fontWeight: '700',
  color: '#d4af37',
  marginBottom: '6px',
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  background: 'rgba(14, 10, 7, 0.95)',
  border: '1px solid rgba(212, 175, 55, 0.25)',
  borderRadius: '8px',
  color: '#fcfaf2',
  fontSize: '12px',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.15s ease',
};

const miniIconBtnStyle = {
  background: 'rgba(30, 22, 16, 0.9)',
  border: '1px solid rgba(212, 175, 55, 0.28)',
  color: '#d5c7b5',
  padding: '4px 7px',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.15s ease',
};
