import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useStageStore } from './useStageStore';
import VirtualStageCanvas from './VirtualStageCanvas';
import StageFilmstrip from './StageFilmstrip';
import StageCharacterModal from './StageCharacterModal';
import StagePreviewModal from './StagePreviewModal';
import SavePerformanceModal from './SavePerformanceModal';
import DalangVisionPip from './DalangVisionPip';
import DalangVisionTutorialModal from './DalangVisionTutorialModal';
import WayangArStageModal from './WayangArStageModal';
import StageGuideModal from './StageGuideModal';
import ErrorBoundary from '../../components/ui/ErrorBoundary';
import { getBackgroundById, getAllBackgrounds, STAGE_CONFIG_MASTER } from '../../data/master/stageConfigMaster';
import { AUDIO_MASTER } from '../../data/master/audioMaster';
import soundEngine from '../../services/soundscape';
import {
  RotateCcw,
  Play,
  Save,
  ArrowLeft,
  X,
  Hand,
  Sparkles,
  MoreVertical,
  Edit2,
  Check,
  Users,
  Image as ImageIcon,
  Volume2,
  MessageSquare,
  Trash2,
  ZoomIn,
  ZoomOut,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Plus,
  Upload,
  Clock,
  HelpCircle,
  BookOpen,
  Hammer,
  Bell,
  Disc3,
} from 'lucide-react';

import avatarGatotkaca from '../../assets/avatar_gatotkaca.png';
import avatarArjuna from '../../assets/avatar_arjuna.png';
import avatarShinta from '../../assets/avatar_shinta.png';
import avatarBima from '../../assets/avatar_bima.png';
import cardKarna from '../../assets/wayang_card_karna.jpg';
import cardRahwana from '../../assets/wayang_card_rahwana.jpg';
import cardSemar from '../../assets/wayang_card_semar.jpg';

const CHAR_AVATARS = {
  gatotkaca: avatarGatotkaca,
  arjuna: avatarArjuna,
  shinta: avatarShinta,
  werkudara: avatarBima,
  karna: cardKarna,
  rahwana: cardRahwana,
  semar: cardSemar,
};

export default function StageStudio({ onNavigate }) {
  const stageCanvasRef = useRef(null);
  const handleDirectUpdate = useCallback((instanceId, updates) => {
    stageCanvasRef.current?.directUpdate(instanceId, updates);
  }, []);

  const {
    metadata,
    scenes,
    activeSceneIndex,
    selectedInstanceId,
    setMetadata,
    setActiveSceneIndex,
    addScene,
    duplicateScene,
    removeScene,
    reorderScene,
    updateActiveScene,
    updateAllScenes,
    setSelectedInstanceId,
    addCharacterToActiveScene,
    removeCharacterFromActiveScene,
    updateCharacter,
    exportSceneData,
    resetStudio,
  } = useStageStore();

  // Modals & Mode States
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showAddCharModal, setShowAddCharModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [isDalangVisionActive, setIsDalangVisionActive] = useState(false);
  const [showVisionTutorial, setShowVisionTutorial] = useState(false);
  const [showArStageModal, setShowArStageModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef(null);

  // Panduan Interaktif Dalang (Otomatis muncul untuk pengunjung baru, disimpan di localStorage)
  const [showGuideModal, setShowGuideModal] = useState(() => {
    try {
      return !localStorage.getItem('wayang_stage_guide_completed');
    } catch {
      return false;
    }
  });

  const handleCloseGuide = useCallback(() => {
    setShowGuideModal(false);
    try {
      localStorage.setItem('wayang_stage_guide_completed', 'true');
    } catch {
      // safe fallback
    }
  }, []);

  // Studio Layout Rail State
  const [activeRailTab, setActiveRailTab] = useState('characters'); // 'characters' | 'backgrounds' | 'audio' | 'dialogue'
  const [applyBgToAll, setApplyBgToAll] = useState(false);
  const [volume, setVolume] = useState(70);
  const [playingBgmId, setPlayingBgmId] = useState(null);

  // Inline Title Editing State
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(metadata.title || 'Lakon Wayang Baru');
  const titleInputRef = useRef(null);
  const customFileInputRef = useRef(null);

  const allBackgrounds = useMemo(() => getAllBackgrounds(), []);
  const currentScene = scenes[activeSceneIndex] || scenes[0];
  const currentBgConfig = getBackgroundById(currentScene?.background);
  const currentAudio = AUDIO_MASTER.find((a) => a.id === currentScene?.audioAssetId) || AUDIO_MASTER[0];
  const selectedChar = currentScene?.characters?.find((c) => c.instanceId === selectedInstanceId);

  // Focus title input on edit mode
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  // Close more menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }
    };
    if (showMoreMenu) {
      document.addEventListener('pointerdown', handleClickOutside);
    }
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [showMoreMenu]);

  // Title Save Handler
  const handleSaveTitle = () => {
    const trimmed = titleInput.trim();
    if (trimmed) {
      setMetadata({ title: trimmed });
    } else {
      setTitleInput(metadata.title || 'Lakon Wayang Baru');
    }
    setIsEditingTitle(false);
  };

  // SFX Gamelan Dalang
  const handlePlaySfx = (type) => {
    try {
      if (type === 'dodogan') soundEngine.playDodogan();
      else if (type === 'kepyak') soundEngine.playKepyak();
      else if (type === 'gong') soundEngine.playGong();
    } catch {
      // Audio fail-soft
    }
  };

  // Toggle BGM Preview
  const handleToggleBgmTrack = (track) => {
    if (playingBgmId === track.id) {
      soundEngine.stopBgm();
      setPlayingBgmId(null);
    } else {
      soundEngine.startBgm(track.synthType || 'srepeg', track.title);
      setPlayingBgmId(track.id);
    }
  };

  // Upload Custom Puppet Handler
  const handleUploadCustomPuppet = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    addCharacterToActiveScene({
      name: cleanName || 'Wayang Koleksi Dalang',
      customImageUrl: url,
    });
    try {
      soundEngine.playDodogan();
    } catch {
      // Audio fail-soft
    }
  };

  return (
    <div className="stage-studio-single-screen-root">
      {/* =========================================================================
          WILAYAH 1: STUDIO HEADER (Tinggi: 58px)
          - Kiri: Tombol Back, Judul Lakon Inline Edit, Badge Babak & Visibilitas
          - Kanan: Pratinjau (Outline), Simpan (Satu-satunya Emas Solid), Menu ⋯
          ========================================================================= */}
      <header className="stage-studio-header-strip" role="banner">
        {/* Sisi Kiri: Navigasi & Judul Lakon */}
        <div className="studio-header-left">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home')}
            title="Kembali ke Beranda"
            aria-label="Kembali ke Beranda"
            className="studio-back-icon-btn"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="studio-title-container">
            {isEditingTitle ? (
              <div className="studio-title-edit-form">
                <input
                  ref={titleInputRef}
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle();
                    if (e.key === 'Escape') {
                      setTitleInput(metadata.title || 'Lakon Wayang Baru');
                      setIsEditingTitle(false);
                    }
                  }}
                  onBlur={handleSaveTitle}
                  className="studio-title-inline-input"
                  maxLength={60}
                />
                <button
                  type="button"
                  onClick={handleSaveTitle}
                  className="studio-title-save-btn"
                  title="Simpan Judul"
                >
                  <Check size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTitleInput(metadata.title || 'Lakon Wayang Baru');
                  setIsEditingTitle(true);
                }}
                className="studio-title-display-btn"
                title="Klik untuk mengubah judul lakon"
              >
                <span className="studio-title-text">
                  {metadata.title || 'Lakon Wayang Baru'}
                </span>
                <Edit2 size={13} className="studio-title-edit-icon" />
              </button>
            )}

            <div className="studio-header-meta-pill">
              <span className="meta-scene-num">
                Babak {activeSceneIndex + 1}/{scenes.length}
              </span>
              <span className="meta-separator">•</span>
              <span
                className="meta-visibility-tag"
                style={{ color: metadata.visibility === 'public' ? '#10b981' : '#e8bb5c' }}
              >
                {metadata.visibility === 'public' ? 'Publik' : 'Privat'}
              </span>
            </div>
          </div>
        </div>

        {/* Sisi Kanan: Hierarki Tombol (Outline Pratinjau + Emas Solid Simpan + Menu ⋯) */}
        <div className="studio-header-right">
          {/* Tombol Panduan Panggung Dalang (Interactive Onboarding) */}
          <button
            type="button"
            onClick={() => setShowGuideModal(true)}
            className="studio-guide-header-btn"
            title="Buka Panduan Studio Panggung Virtual"
            aria-label="Panduan Studio Panggung"
          >
            <HelpCircle size={14} />
            <span className="btn-label-text">Panduan</span>
          </button>

          {/* Tombol Dalang Vision (Camera Hand Tracking AI) */}
          <button
            type="button"
            onClick={() => setIsDalangVisionActive(!isDalangVisionActive)}
            className={`studio-vision-toggle-btn ${isDalangVisionActive ? 'is-active' : ''}`}
            title="Kendalikan wayang dengan telapak tangan via webcam (AI Hand Tracking)"
          >
            <Hand size={14} color={isDalangVisionActive ? '#22c55e' : '#e8bb5c'} />
            <span className="btn-label-text">Dalang Vision</span>
            {isDalangVisionActive && <span className="vision-active-badge">Aktif</span>}
          </button>

          {/* Tombol Pratinjau Pertunjukan (Outline Emas Lembut) */}
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="studio-preview-outline-btn"
            title="Pratinjau Pertunjukan Layar Penuh"
          >
            <Play size={14} className="preview-play-icon" />
            <span className="btn-label-text">Pratinjau</span>
          </button>

          {/* SATU-SATUNYA TOMBOL EMAS SOLID DI HALAMAN */}
          <button
            type="button"
            onClick={() => setShowSaveModal(true)}
            className="studio-save-solid-gold-btn"
            title="Simpan Karya Lakon Wayang"
          >
            <Save size={15} />
            <span className="btn-label-text">Simpan Karya</span>
          </button>

          {/* Menu Dropdown "⋯" (More Options) */}
          <div className="studio-more-dropdown-wrap" ref={moreMenuRef}>
            <button
              type="button"
              onClick={() => setShowMoreMenu((prev) => !prev)}
              aria-label="Menu Opsi Lainnya"
              aria-expanded={showMoreMenu}
              className={`studio-more-trigger-btn ${showMoreMenu ? 'is-active' : ''}`}
            >
              <MoreVertical size={18} />
            </button>

            {showMoreMenu && (
              <div className="studio-more-menu-panel" role="menu">
                {/* Panduan Studio Panggung Virtual */}
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    setShowGuideModal(true);
                  }}
                  className="more-menu-item"
                  role="menuitem"
                >
                  <BookOpen size={15} color="#d4af37" />
                  <div className="menu-item-text-group">
                    <span className="menu-item-title">Panduan Studio Panggung</span>
                    <span className="menu-item-desc">Pelajari langkah tancep tokoh, tata suara &amp; pentas</span>
                  </div>
                </button>

                {/* Mode Dalang Vision */}
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    setIsDalangVisionActive(!isDalangVisionActive);
                  }}
                  className="more-menu-item"
                  role="menuitem"
                >
                  <Hand size={15} color={isDalangVisionActive ? '#22c55e' : '#d4af37'} />
                  <div className="menu-item-text-group">
                    <div className="menu-item-title-row">
                      <span>Kendali Gerak (Dalang Vision)</span>
                      <span className="menu-badge-experiment">Eksperimen</span>
                    </div>
                    <span className="menu-item-desc">
                      {isDalangVisionActive ? 'Sedang aktif via webcam' : 'Gerakkan wayang dengan tangan via AI'}
                    </span>
                  </div>
                </button>

                {/* Mode Panggung AR */}
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    setShowArStageModal(true);
                  }}
                  className="more-menu-item"
                  role="menuitem"
                >
                  <Sparkles size={15} color="#facc15" />
                  <div className="menu-item-text-group">
                    <div className="menu-item-title-row">
                      <span>Lihat di Ruanganmu (Panggung AR)</span>
                      <span className="menu-badge-experiment">Eksperimen</span>
                    </div>
                    <span className="menu-item-desc">
                      Hadirkan panggung wayang 3D di ruangan fisik
                    </span>
                  </div>
                </button>

                {/* Panduan Gestur Dalang */}
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    setShowVisionTutorial(true);
                  }}
                  className="more-menu-item"
                  role="menuitem"
                >
                  <Hand size={15} color="#e8bb5c" />
                  <div className="menu-item-text-group">
                    <span className="menu-item-title">Panduan Gestur Dalang</span>
                    <span className="menu-item-desc">Pelajari isyarat tangan untuk menggerakkan wayang</span>
                  </div>
                </button>

                <div className="more-menu-divider" />

                {/* Reset Panggung (Aksi Destruktif Terlindungi) */}
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    setShowResetConfirmModal(true);
                  }}
                  className="more-menu-item danger"
                  role="menuitem"
                >
                  <RotateCcw size={15} color="#f87171" />
                  <div className="menu-item-text-group">
                    <span className="menu-item-title text-danger">Reset Panggung</span>
                    <span className="menu-item-desc">Kembalikan lakon ke kondisi awal</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN WORKSPACE GRID:
          - Rail Kiri (240px): 4 Tab Vertikal (Tokoh, Latar, Suara, Sabda)
          - Pusat Layar: Panggung Kelir Virtual 16:9
          - Panel Kanan (320px): Kontekstual Detail Tokoh / Adegan
          ========================================================================= */}
      <div className="stage-studio-main-grid">
        {/* WILAYAH 2: RAIL TAB "SUSUN" (KIRI - 240px) */}
        <aside className="stage-rail-sidebar" aria-label="Alat Penyusunan Lakon">
          {/* Header Tab Switcher */}
          <div className="stage-rail-nav-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeRailTab === 'characters'}
              onClick={() => setActiveRailTab('characters')}
              className={`stage-rail-tab-btn ${activeRailTab === 'characters' ? 'is-active' : ''}`}
            >
              <Users size={14} />
              <span>Tokoh</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeRailTab === 'backgrounds'}
              onClick={() => setActiveRailTab('backgrounds')}
              className={`stage-rail-tab-btn ${activeRailTab === 'backgrounds' ? 'is-active' : ''}`}
            >
              <ImageIcon size={14} />
              <span>Latar</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeRailTab === 'audio'}
              onClick={() => setActiveRailTab('audio')}
              className={`stage-rail-tab-btn ${activeRailTab === 'audio' ? 'is-active' : ''}`}
            >
              <Volume2 size={14} />
              <span>Suara</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeRailTab === 'dialogue'}
              onClick={() => setActiveRailTab('dialogue')}
              className={`stage-rail-tab-btn ${activeRailTab === 'dialogue' ? 'is-active' : ''}`}
            >
              <MessageSquare size={14} />
              <span>Sabda</span>
            </button>
          </div>

          {/* Isi Konten Rail Berdasarkan Tab */}
          <div className="stage-rail-content-body modal-custom-scroll">
            {/* TAB 1: TOKOH */}
            {activeRailTab === 'characters' && (
              <div className="rail-tab-pane">
                <div className="rail-section-header">
                  <span className="rail-section-title">TOKOH DI KELIR</span>
                  <span className="rail-section-badge">{currentScene?.characters?.length || 0}</span>
                </div>

                {/* Tombol Tambah Tokoh */}
                <button
                  type="button"
                  onClick={() => setShowAddCharModal(true)}
                  className="rail-add-char-action-btn"
                >
                  <Plus size={14} />
                  <span>Tambah Tokoh</span>
                </button>

                {/* Input Unggah Wayang Sendiri */}
                <input
                  ref={customFileInputRef}
                  type="file"
                  accept="image/png,image/webp,image/jpeg"
                  onChange={handleUploadCustomPuppet}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => customFileInputRef.current?.click()}
                  className="rail-upload-custom-btn"
                >
                  <Upload size={12} />
                  <span>Unggah Wayang Sendiri</span>
                </button>

                {/* Banner Cepat Dalang Vision AI */}
                <div
                  className={`rail-vision-card ${isDalangVisionActive ? 'is-active' : ''}`}
                  onClick={() => setIsDalangVisionActive(!isDalangVisionActive)}
                  title="Kendalikan wayang dengan telapak tangan via webcam"
                >
                  <div className="rail-vision-icon-wrap">
                    <Hand size={14} color={isDalangVisionActive ? '#22c55e' : '#fef08a'} />
                  </div>
                  <div className="rail-vision-text-wrap">
                    <div className="rail-vision-title">
                      <span>Dalang Vision AI</span>
                      {isDalangVisionActive && <span className="rail-vision-badge-active">Aktif</span>}
                    </div>
                    <span className="rail-vision-desc">
                      {isDalangVisionActive ? 'Webcam Aktif (Klik matikan)' : 'Kamera gerak tangan'}
                    </span>
                  </div>
                </div>

                {/* Daftar Tokoh di Babak Ini */}
                <div className="rail-char-items-list">
                  {(!currentScene?.characters || currentScene.characters.length === 0) ? (
                    <div className="rail-empty-hint">
                      Belum ada tokoh tertancap di babak ini.
                    </div>
                  ) : (
                    currentScene.characters.map((char) => {
                      const isSelected = selectedInstanceId === char.instanceId;
                      const avatarImg = CHAR_AVATARS[char.slug];

                      return (
                        <div
                          key={char.instanceId}
                          onClick={() => setSelectedInstanceId(char.instanceId)}
                          className={`rail-char-item-card ${isSelected ? 'is-selected' : ''}`}
                        >
                          <div
                            className="rail-char-avatar"
                            style={{ borderColor: char.accentColor || '#d4af37' }}
                          >
                            {avatarImg ? (
                              <img src={avatarImg} alt={char.name} />
                            ) : (
                              <span>{(char.name || 'W')[0]}</span>
                            )}
                          </div>
                          <div className="rail-char-meta">
                            <span className="rail-char-name">{char.name}</span>
                            <span className="rail-char-pose">
                              {char.facing === 'left' ? 'Hadap Kiri' : 'Hadap Kanan'} • {char.pose || 'tenang'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCharacterFromActiveScene(char.instanceId);
                              try { soundEngine.playKepyak(); } catch {}
                            }}
                            title="Lepas Tokoh dari Kelir"
                            aria-label={`Lepas ${char.name}`}
                            className="rail-char-remove-btn"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: LATAR */}
            {activeRailTab === 'backgrounds' && (
              <div className="rail-tab-pane">
                <div className="rail-section-header">
                  <span className="rail-section-title">PILIHAN KELIR</span>
                </div>

                {/* Toggle Terapkan ke Seluruh Babak */}
                <label className="rail-bg-apply-toggle">
                  <input
                    type="checkbox"
                    checked={applyBgToAll}
                    onChange={(e) => setApplyBgToAll(e.target.checked)}
                  />
                  <span>Terapkan ke semua babak</span>
                </label>

                {/* Grid Visual Thumbnail Kelir */}
                <div className="rail-bg-grid">
                  {allBackgrounds.map((bg) => {
                    const isActive = currentScene?.background === bg.id;

                    return (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => {
                          if (applyBgToAll) {
                            updateAllScenes({ background: bg.id });
                          } else {
                            updateActiveScene({ background: bg.id });
                          }
                          try { soundEngine.playDodogan(); } catch {}
                        }}
                        className={`rail-bg-card ${isActive ? 'is-active' : ''}`}
                      >
                        <div
                          className="rail-bg-thumb"
                          style={{
                            background: bg.bgImage
                              ? `url(${bg.bgImage}) center / cover no-repeat`
                              : (bg.kelirColor || '#281c13'),
                          }}
                        >
                          {!bg.bgImage && (
                            <div
                              className="rail-bg-thumb-glow"
                              style={{ background: bg.glowColor || 'rgba(212, 175, 55, 0.5)' }}
                            />
                          )}
                          {isActive && (
                            <div className="rail-bg-active-check">
                              <span>✓</span>
                              <span>Aktif</span>
                            </div>
                          )}
                        </div>
                        <div className="rail-bg-meta">
                          <div className="rail-bg-title-row">
                            <span className="rail-bg-name" title={bg.name}>{bg.name}</span>
                            <span className="rail-bg-pathet">Pathet {bg.pathet}</span>
                          </div>
                          {bg.atmosphere && (
                            <div className="rail-bg-atmosphere" title={bg.atmosphere}>
                              {bg.atmosphere}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: SUARA */}
            {activeRailTab === 'audio' && (
              <div className="rail-tab-pane">
                <div className="rail-section-header">
                  <span className="rail-section-title">EFEK GAMELAN DALANG</span>
                </div>

                {/* SFX Dalang Pads */}
                <div className="rail-sfx-pads-row">
                  <button
                    type="button"
                    onClick={() => handlePlaySfx('dodogan')}
                    title="Ketuk Dodogan Kotak Dalang (Keyboard: Space)"
                    className="rail-sfx-pad-btn"
                  >
                    <Hammer size={16} color="#d4af37" className="sfx-pad-icon" />
                    <span className="sfx-name">Dodogan</span>
                    <span className="sfx-key-badge">Space</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePlaySfx('kepyak')}
                    title="Gemerincing Kepyak Dalang (Keyboard: Shift)"
                    className="rail-sfx-pad-btn"
                  >
                    <Bell size={16} color="#d4af37" className="sfx-pad-icon" />
                    <span className="sfx-name">Kepyak</span>
                    <span className="sfx-key-badge">Shift</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePlaySfx('gong')}
                    title="Gong Ageng Pamungkas (Keyboard: G)"
                    className="rail-sfx-pad-btn"
                  >
                    <Disc3 size={16} color="#d4af37" className="sfx-pad-icon" />
                    <span className="sfx-name">Gong</span>
                    <span className="sfx-key-badge">G</span>
                  </button>
                </div>

                {/* Volume Slider Utama */}
                <div className="rail-volume-control-box">
                  <div className="rail-volume-header">
                    <span className="rail-volume-label">
                      <Volume2 size={13} color="#d4af37" />
                      <span>Volume Master</span>
                    </span>
                    <span className="rail-volume-val">{volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setVolume(val);
                      soundEngine.setVolume(val / 100);
                    }}
                    className="rail-volume-slider"
                  />
                </div>

                {/* BGM Gending Gamelan Selector */}
                <div className="rail-section-header" style={{ marginTop: '16px' }}>
                  <span className="rail-section-title">IRINGAN GENDING BABAK</span>
                </div>

                <div className="rail-bgm-tracks-list">
                  {AUDIO_MASTER.map((track) => {
                    const isSelectedTrack = currentScene?.audioAssetId === track.id;
                    const isPlaying = playingBgmId === track.id;

                    return (
                      <div
                        key={track.id}
                        onClick={() => {
                          updateActiveScene({ audioAssetId: track.id });
                        }}
                        className={`rail-bgm-track-card ${isSelectedTrack ? 'is-selected' : ''}`}
                      >
                        <div className="bgm-track-info">
                          <span className="bgm-track-title">{track.title}</span>
                          <span className="bgm-track-desc">{track.description}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleBgmTrack(track);
                          }}
                          title={isPlaying ? 'Hentikan Pratinjau' : 'Pratinjau Gending'}
                          className={`bgm-preview-btn ${isPlaying ? 'is-playing' : ''}`}
                        >
                          {isPlaying ? '⏹' : '▶'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: SABDA */}
            {activeRailTab === 'dialogue' && (
              <div className="rail-tab-pane">
                <div className="rail-section-header">
                  <span className="rail-section-title">NASKAH SABDA DALANG</span>
                </div>

                {(!currentScene?.characters || currentScene.characters.length === 0) ? (
                  <div className="rail-empty-hint">
                    Tancapkan tokoh ke kelir terlebih dahulu untuk menyusun naskah sabda.
                  </div>
                ) : (
                  currentScene.characters.map((char) => (
                    <div key={char.instanceId} className="rail-dialogue-item-card">
                      <div className="rail-dialogue-char-header">
                        <span
                          className="rail-dialogue-dot"
                          style={{ background: char.accentColor || '#d4af37' }}
                        />
                        <span className="rail-dialogue-name">{char.name}</span>
                      </div>
                      <textarea
                        rows={3}
                        value={char.dialogue || ''}
                        onChange={(e) => updateCharacter(char.instanceId, { dialogue: e.target.value })}
                        placeholder={`Tulis sabda/ucapan dalang untuk ${char.name}...`}
                        className="rail-dialogue-textarea"
                      />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </aside>

        {/* WILAYAH 3: PUSAT PANGGUNG KELIR (Virtual Stage Canvas) */}
        <main className="stage-kelir-center-area" role="region" aria-label="Panggung Kelir Utama">
          <div className="stage-canvas-frame-enclosure">
            <VirtualStageCanvas
              ref={stageCanvasRef}
              scene={currentScene}
              selectedInstanceId={selectedInstanceId}
              onSelectCharacter={setSelectedInstanceId}
              onUpdateCharacter={updateCharacter}
              onRemoveCharacter={removeCharacterFromActiveScene}
              onOpenAddCharacter={() => setShowAddCharModal(true)}
              isInteractive={true}
              isVisionActive={isDalangVisionActive}
            />
          </div>
        </main>

        {/* WILAYAH 4: PANEL KANAN KONTEKSTUAL (320px) */}
        <aside className="stage-context-panel" aria-label="Pengaturan Kontekstual">
          {selectedChar ? (
            /* KONDISI A: TOKOH TERPILIH DI KELIR */
            <div className="context-pane-body modal-custom-scroll">
              <div className="context-header-block">
                <div
                  className="context-char-avatar-ring"
                  style={{ borderColor: selectedChar.accentColor || '#d4af37' }}
                >
                  {CHAR_AVATARS[selectedChar.slug] ? (
                    <img src={CHAR_AVATARS[selectedChar.slug]} alt={selectedChar.name} />
                  ) : (
                    <span>{(selectedChar.name || 'W')[0]}</span>
                  )}
                </div>
                <div className="context-char-title-group">
                  <h3 className="context-char-name">{selectedChar.name}</h3>
                  <span className="context-char-type">
                    {selectedChar.typeName || 'Wayang Kulit Purwa'}
                  </span>
                </div>
              </div>

              {/* Aksi Solah & Hadap Wayang */}
              <div className="context-section-group">
                <span className="context-group-label">SOLAH &amp; ARAH HADAP</span>
                <div className="context-action-row">
                  <button
                    type="button"
                    onClick={() => {
                      updateCharacter(selectedChar.instanceId, {
                        facing: selectedChar.facing === 'left' ? 'right' : 'left',
                      });
                      try { soundEngine.playDodogan(); } catch {}
                    }}
                    className="context-action-btn"
                    title="Balik Arah Hadap (Shortcut: F)"
                  >
                    <span>⇄ Hadap {selectedChar.facing === 'left' ? 'Kanan' : 'Kiri'}</span>
                  </button>

                  <select
                    value={selectedChar.pose || 'default'}
                    onChange={(e) => updateCharacter(selectedChar.instanceId, { pose: e.target.value })}
                    className="context-pose-select"
                  >
                    {STAGE_CONFIG_MASTER.poses.map((p) => (
                      <option key={p.id} value={p.id}>
                        Pose: {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Kontrol Skala & D-Pad Geser Halus */}
              <div className="context-section-group">
                <span className="context-group-label">SKALA &amp; NUDGE POSISI</span>
                <div className="context-scale-and-dpad-row">
                  {/* Skala */}
                  <div className="context-scale-cluster">
                    <button
                      type="button"
                      onClick={() =>
                        updateCharacter(selectedChar.instanceId, {
                          scale: Math.max(0.6, Number(((selectedChar.scale || 1.0) - 0.1).toFixed(1))),
                        })
                      }
                      title="Perkecil Wayang"
                      className="context-mini-btn"
                    >
                      <ZoomOut size={13} />
                    </button>
                    <span className="context-scale-val">
                      {(selectedChar.scale || 1.0).toFixed(1)}x
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateCharacter(selectedChar.instanceId, {
                          scale: Math.min(2.0, Number(((selectedChar.scale || 1.0) + 0.1).toFixed(1))),
                        })
                      }
                      title="Perbesar Wayang"
                      className="context-mini-btn"
                    >
                      <ZoomIn size={13} />
                    </button>
                  </div>

                  {/* D-Pad Navigasi Posisi */}
                  <div className="context-dpad-cluster">
                    <button
                      type="button"
                      onClick={() => updateCharacter(selectedChar.instanceId, { x: selectedChar.x - 0.02 })}
                      title="Geser Kiri (Panah Kiri)"
                      className="context-dpad-btn"
                    >
                      <ArrowLeft size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCharacter(selectedChar.instanceId, { y: selectedChar.y - 0.02 })}
                      title="Geser Atas (Panah Atas)"
                      className="context-dpad-btn"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCharacter(selectedChar.instanceId, { y: selectedChar.y + 0.02 })}
                      title="Geser Bawah (Panah Bawah)"
                      className="context-dpad-btn"
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCharacter(selectedChar.instanceId, { x: selectedChar.x + 0.02 })}
                      title="Geser Kanan (Panah Kanan)"
                      className="context-dpad-btn"
                    >
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sabda Tokoh (Textarea Dialog) */}
              <div className="context-section-group">
                <span className="context-group-label">SABDA / UCAPAN TOKOH</span>
                <textarea
                  rows={4}
                  value={selectedChar.dialogue || ''}
                  onChange={(e) => updateCharacter(selectedChar.instanceId, { dialogue: e.target.value })}
                  placeholder={`Tuliskan sabda pedalangan untuk ${selectedChar.name}...`}
                  className="context-dialogue-textarea"
                />
                <span className="context-field-sub">
                  Naskah akan tampil sebagai subtitle sinematik di dasar kelir panggung.
                </span>
              </div>

              {/* Tombol Lepas dari Kelir */}
              <div className="context-footer-actions">
                <button
                  type="button"
                  onClick={() => {
                    removeCharacterFromActiveScene(selectedChar.instanceId);
                    try { soundEngine.playKepyak(); } catch {}
                  }}
                  className="context-remove-char-btn"
                >
                  <Trash2 size={13} />
                  <span>Lepas dari Kelir</span>
                </button>
              </div>
            </div>
          ) : (
            /* KONDISI B: TIDAK ADA TOKOH TERPILIH (RINGKASAN BABAK & CHEATSHEET) */
            <div className="context-pane-body modal-custom-scroll">
              <div className="context-section-group">
                <span className="context-group-label">RINGKASAN BABAK AKTIF</span>
                <div className="context-scene-summary-box">
                  <div className="scene-summary-title-row">
                    <span className="scene-summary-idx">#{activeSceneIndex + 1}</span>
                    <input
                      type="text"
                      value={currentScene?.title || ''}
                      onChange={(e) => updateActiveScene({ title: e.target.value })}
                      placeholder={`Babak ${activeSceneIndex + 1}`}
                      className="scene-summary-title-input"
                    />
                  </div>

                  <div className="scene-duration-slider-row">
                    <span className="scene-duration-label">
                      <Clock size={12} color="#d4af37" />
                      <span>Durasi Adegan: {currentScene?.duration || 5}s</span>
                    </span>
                    <input
                      type="range"
                      min="3"
                      max="30"
                      value={currentScene?.duration || 5}
                      onChange={(e) => updateActiveScene({ duration: Number(e.target.value) })}
                      className="scene-duration-slider"
                    />
                  </div>

                  <div className="scene-summary-badge-row">
                    <span className="scene-meta-tag">
                      Pathet: {currentBgConfig?.pathet?.toUpperCase() || 'NEM'}
                    </span>
                    <span className="scene-meta-tag">
                      Gending: {currentAudio?.title || 'Srepeg Nem'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pintasan Keyboard Pedalangan */}
              <div className="context-section-group">
                <span className="context-group-label">PINTASAN KEYBOARD DALANG</span>
                <div className="context-cheatsheet-grid">
                  <div className="cheatsheet-row">
                    <kbd>Space</kbd>
                    <span>Dodogan Kotak Dalang</span>
                  </div>
                  <div className="cheatsheet-row">
                    <kbd>Shift</kbd>
                    <span>Gemerincing Kepyak</span>
                  </div>
                  <div className="cheatsheet-row">
                    <kbd>G</kbd>
                    <span>Gong Ageng Pamungkas</span>
                  </div>
                  <div className="cheatsheet-row">
                    <kbd>F</kbd>
                    <span>Balik Arah Hadap Tokoh</span>
                  </div>
                  <div className="cheatsheet-row">
                    <kbd>Panah</kbd>
                    <span>Nudge Posisi Solah Wayang</span>
                  </div>
                </div>
              </div>

              {/* Tombol Cepat Tambah Tokoh */}
              <div className="context-quick-add-wrap">
                <button
                  type="button"
                  onClick={() => setShowAddCharModal(true)}
                  className="context-quick-add-btn"
                >
                  <Plus size={14} />
                  <span>Tancap Tokoh ke Babak Ini</span>
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* =========================================================================
          WILAYAH 5: FILMSTRIP BABAK (Dasar Layar: 105px)
          - Kartu Babak Mini Horisontal
          - Duplikasi, Hapus, Tambah Babak
          - Durasi Total Pentas
          ========================================================================= */}
      <footer className="stage-studio-footer-strip">
        <StageFilmstrip
          scenes={scenes}
          activeSceneIndex={activeSceneIndex}
          onSelectScene={setActiveSceneIndex}
          onAddScene={addScene}
          onDuplicateScene={duplicateScene}
          onRemoveScene={removeScene}
          onReorderScene={reorderScene}
        />
      </footer>

      {/* =========================================================================
          MODALS & OVERLAYS
          ========================================================================= */}
      {/* Modal Pemilihan Tokoh Baru ke Babak */}
      <StageCharacterModal
        isOpen={showAddCharModal}
        onClose={() => setShowAddCharModal(false)}
        onAddCharacter={addCharacterToActiveScene}
      />

      {/* Modal Preview Client-Side Layar Penuh */}
      <StagePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        scenes={scenes}
        metadata={metadata}
      />

      {/* Modal Simpan Karya Lakon */}
      <SavePerformanceModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        metadata={metadata}
        onUpdateMetadata={setMetadata}
        exportSceneData={exportSceneData}
        onSavedSuccess={(savedRecord) => {
          if (savedRecord?.id) setMetadata({ id: savedRecord.id });
        }}
      />

      {/* Modal Panduan Interaktif Studio Dalang (Onboarding Walkthrough) */}
      <StageGuideModal
        isOpen={showGuideModal}
        onClose={handleCloseGuide}
      />

      {/* Modal Panduan Gestur Dalang */}
      <DalangVisionTutorialModal
        isOpen={showVisionTutorial}
        onClose={() => setShowVisionTutorial(false)}
      />

      {/* Modal Panggung Wayang AR Interaktif Layar Penuh */}
      <ErrorBoundary onClose={() => setShowArStageModal(false)}>
        <WayangArStageModal
          isOpen={showArStageModal}
          onClose={() => setShowArStageModal(false)}
          onOpenTutorial={() => setShowVisionTutorial(true)}
        />
      </ErrorBoundary>

      {/* Panel Floating PiP Dalang Vision */}
      <DalangVisionPip
        isOpen={isDalangVisionActive}
        onClose={() => setIsDalangVisionActive(false)}
        characters={currentScene?.characters || []}
        selectedInstanceId={selectedInstanceId}
        onUpdateCharacter={updateCharacter}
        onDirectUpdate={handleDirectUpdate}
        onOpenTutorial={() => setShowVisionTutorial(true)}
      />

      {/* Modal Konfirmasi Reset Proyek Lakon */}
      {showResetConfirmModal && (
        <div
          className="wayang-modal-backdrop"
          style={{ zIndex: 1100 }}
          onClick={() => setShowResetConfirmModal(false)}
        >
          <div
            className="wayang-modal-chassis"
            style={{ maxWidth: '480px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="wayang-modal-inner" style={{ padding: '32px 28px', textAlign: 'center' }}>
              <div className="wayang-modal-hairline" />

              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                aria-label="Tutup Dialog"
                className="wayang-modal-close-btn"
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  width: '38px',
                  height: '38px',
                }}
              >
                <X size={16} />
              </button>

              <div
                style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '50%',
                  background: 'rgba(212, 175, 55, 0.14)',
                  border: '1px solid rgba(212, 175, 55, 0.42)',
                  boxShadow: '0 4px 12px rgba(139, 69, 19, 0.08)',
                  color: '#8b4513',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                }}
              >
                <RotateCcw size={24} />
              </div>

              <div className="wayang-modal-eyebrow" style={{ marginBottom: '8px' }}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#d4af37' }} />
                <span>KONFIRMASI PANGGUNG KELIR</span>
              </div>

              <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', fontWeight: '800', color: '#1a140e', fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
                Reset Proyek Lakon?
              </h3>
              <p style={{ margin: '0 0 26px 0', fontSize: '13.5px', color: '#5c4738', lineHeight: '1.65' }}>
                Mulai lakon baru dari awal? Seluruh susunan adegan, tokoh wayang, dan naskah dialog di panggung yang belum tersimpan akan dikembalikan ke kondisi awal.
              </p>

              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => setShowResetConfirmModal(false)}
                  className="wayang-btn-ghost"
                  style={{ flex: 1 }}
                >
                  Batalkan
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resetStudio();
                    setShowResetConfirmModal(false);
                  }}
                  className="wayang-btn-cta"
                  style={{ flex: 1, justifyContent: 'space-between' }}
                >
                  <span>Reset Lakon</span>
                  <span className="wayang-btn-cta-icon">
                    <RotateCcw size={15} color="#16100a" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
