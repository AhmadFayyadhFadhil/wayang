import React, { useState, useRef, useCallback } from 'react';
import { useStageStore } from './useStageStore';
import VirtualStageCanvas from './VirtualStageCanvas';
import SceneComposer from './SceneComposer';
import StagePreviewModal from './StagePreviewModal';
import SavePerformanceModal from './SavePerformanceModal';
import StageBackgroundModal from './StageBackgroundModal';
import DalangVisionPip from './DalangVisionPip';
import DalangVisionTutorialModal from './DalangVisionTutorialModal';
import WayangArStageModal from './WayangArStageModal';
import ErrorBoundary from '../../components/ui/ErrorBoundary';
import { getBackgroundById } from '../../data/master/stageConfigMaster';
import { RotateCcw, Play, Save, ArrowLeft, X, Palette, Hand, Sparkles } from 'lucide-react';

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

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [isDalangVisionActive, setIsDalangVisionActive] = useState(false);
  const [showVisionTutorial, setShowVisionTutorial] = useState(false);
  const [showArStageModal, setShowArStageModal] = useState(false);

  const currentScene = scenes[activeSceneIndex] || scenes[0];
  const currentBgConfig = getBackgroundById(currentScene?.background);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 16px', color: '#fcfaf2' }}>
      {/* Studio Header Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#16100a',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '16px',
          padding: '14px 20px',
          marginBottom: '16px',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => onNavigate && onNavigate('home')}
            title="Kembali ke Beranda"
            style={{
              background: '#231a13',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: '#e8bb5c',
              padding: '8px 16px',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              fontWeight: '700',
              minHeight: '40px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d4af37';
              e.currentTarget.style.background = '#2c2017';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
              e.currentTarget.style.background = '#231a13';
            }}
          >
            <ArrowLeft size={14} />
            <span>Beranda</span>
          </button>

          <div>
            <h1 style={{ margin: 0, fontSize: '18px', color: '#fcfaf2', fontWeight: '800' }}>
              {metadata.title || 'Lakon Wayang Baru'}
            </h1>
            <div style={{ fontSize: '11px', color: '#bfae9c', marginTop: '2px' }}>
              {scenes.length} Adegan • Status: <strong style={{ color: metadata.visibility === 'public' ? '#10b981' : '#e8bb5c' }}>{metadata.visibility === 'public' ? 'Publik' : 'Privat'}</strong>
            </div>
          </div>
        </div>

        {/* Toolbar Tombol Aksi Studio */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <button
            onClick={() => setShowResetConfirmModal(true)}
            title="Reset Panggung ke Adegan Awal"
            style={studioBtnStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
              e.currentTarget.style.background = '#2c2017';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
              e.currentTarget.style.background = '#231a13';
            }}
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          {/* Tombol Ganti Kelir Panggung */}
          <button
            onClick={() => setShowBackgroundModal(true)}
            title={`Ganti latar kelir panggung (Saat ini: ${currentBgConfig.name})`}
            style={{
              ...studioBtnStyle,
              background: '#231a13',
              border: '1px solid rgba(212, 175, 55, 0.45)',
              color: '#e8bb5c',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d4af37';
              e.currentTarget.style.background = '#2c2017';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.45)';
              e.currentTarget.style.background = '#231a13';
            }}
          >
            <Palette size={14} />
            <span>Ganti Kelir</span>
            <span
              style={{
                fontSize: '11px',
                color: '#d4af37',
                background: 'rgba(212, 175, 55, 0.12)',
                padding: '2px 8px',
                borderRadius: '10px',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {currentBgConfig.name}
            </span>
          </button>

          {/* Tombol Digital Dalang Vision (Hand Tracking AI) */}
          <button
            onClick={() => setIsDalangVisionActive(!isDalangVisionActive)}
            title="Kendalikan wayang dengan telapak tangan via webcam (Computer Vision AI)"
            style={{
              ...studioBtnStyle,
              background: isDalangVisionActive
                ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.28) 0%, rgba(35, 26, 19, 0.95) 100%)'
                : '#231a13',
              border: `1px solid ${isDalangVisionActive ? '#d4af37' : 'rgba(212, 175, 55, 0.45)'}`,
              color: isDalangVisionActive ? '#fef08a' : '#e8bb5c',
              fontWeight: '750',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: isDalangVisionActive ? '0 0 14px rgba(212, 175, 55, 0.35)' : 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d4af37';
              e.currentTarget.style.background = '#2c2017';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isDalangVisionActive ? '#d4af37' : 'rgba(212, 175, 55, 0.45)';
              e.currentTarget.style.background = isDalangVisionActive
                ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.28) 0%, rgba(35, 26, 19, 0.95) 100%)'
                : '#231a13';
            }}
          >
            <Hand size={14} color={isDalangVisionActive ? '#facc15' : '#e8bb5c'} />
            <span>Dalang Vision</span>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: isDalangVisionActive ? '#22c55e' : 'rgba(212, 175, 55, 0.4)',
                boxShadow: isDalangVisionActive ? '0 0 8px #22c55e' : 'none',
              }}
            />
          </button>

          {/* Tombol Panggung Wayang AR Interaktif (Sesuai Foto Referensi Pengguna) */}
          <button
            onClick={() => setShowArStageModal(true)}
            title="Buka Panggung Wayang AR Interaktif Layar Penuh (2 Tokoh & Dual Hand Tracking)"
            style={{
              ...studioBtnStyle,
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.35) 0%, rgba(139, 69, 19, 0.45) 100%)',
              border: '1.5px solid #facc15',
              color: '#fef08a',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 16px rgba(250, 204, 21, 0.35)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#fef08a';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(250, 204, 21, 0.55)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#facc15';
              e.currentTarget.style.boxShadow = '0 0 16px rgba(250, 204, 21, 0.35)';
            }}
          >
            <Sparkles size={14} color="#facc15" />
            <span>Panggung AR</span>
          </button>

          <button
            onClick={() => setShowPreviewModal(true)}
            style={{
              ...studioBtnStyle,
              background: '#231a13',
              border: '1px solid rgba(212, 175, 55, 0.45)',
              color: '#e8bb5c',
              fontWeight: '700',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d4af37';
              e.currentTarget.style.background = '#2c2017';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.45)';
              e.currentTarget.style.background = '#231a13';
            }}
          >
            <Play size={13} fill="#e8bb5c" />
            <span>Pratinjau Pertunjukan</span>
          </button>

          <button
            onClick={() => setShowSaveModal(true)}
            style={{
              ...studioBtnStyle,
              background: 'linear-gradient(135deg, #e8bb5c 0%, #d4af37 100%)',
              border: 'none',
              color: '#0d0a07',
              fontWeight: '800',
              padding: '9px 20px',
              boxShadow: '0 2px 8px rgba(212, 175, 55, 0.25)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.06)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Save size={14} />
            <span>Simpan Karya</span>
          </button>
        </div>
      </div>

      {/* Virtual Kelir Canvas */}
      <VirtualStageCanvas
        ref={stageCanvasRef}
        scene={currentScene}
        selectedInstanceId={selectedInstanceId}
        onSelectCharacter={setSelectedInstanceId}
        onUpdateCharacter={updateCharacter}
        onRemoveCharacter={removeCharacterFromActiveScene}
        isInteractive={true}
        isVisionActive={isDalangVisionActive}
      />

      {/* Scene Composer & Timeline */}
      <SceneComposer
        scenes={scenes}
        activeSceneIndex={activeSceneIndex}
        onSelectScene={setActiveSceneIndex}
        onAddScene={addScene}
        onDuplicateScene={duplicateScene}
        onRemoveScene={removeScene}
        onReorderScene={reorderScene}
        onUpdateScene={updateActiveScene}
        onAddCharacter={addCharacterToActiveScene}
        onUpdateCharacter={updateCharacter}
        onRemoveCharacter={removeCharacterFromActiveScene}
      />

      {/* Modal Preview Client-Side */}
      <StagePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        scenes={scenes}
        metadata={metadata}
      />

      {/* Modal Pemilih Latar Kelir Panggung */}
      <StageBackgroundModal
        isOpen={showBackgroundModal}
        onClose={() => setShowBackgroundModal(false)}
        currentBackgroundId={currentScene?.background}
        onSelectBackground={(bgId, applyToAll) => {
          if (applyToAll) {
            updateAllScenes({ background: bgId });
          } else {
            updateActiveScene({ background: bgId });
          }
        }}
      />

      {/* Panel Floating PiP Dalang Vision (Webcam & Skeletal Tracking) */}
      <DalangVisionPip
        isOpen={isDalangVisionActive}
        onClose={() => setIsDalangVisionActive(false)}
        characters={currentScene?.characters || []}
        selectedInstanceId={selectedInstanceId}
        onUpdateCharacter={updateCharacter}
        onDirectUpdate={handleDirectUpdate}
        onOpenTutorial={() => setShowVisionTutorial(true)}
      />

      {/* Panggung Wayang AR Interaktif Layar Penuh (Sesuai Foto Referensi Pengguna) */}
      <ErrorBoundary onClose={() => setShowArStageModal(false)}>
        <WayangArStageModal
          isOpen={showArStageModal}
          onClose={() => setShowArStageModal(false)}
          onOpenTutorial={() => setShowVisionTutorial(true)}
        />
      </ErrorBoundary>

      {/* Modal Panduan Gestur Dalang */}
      <DalangVisionTutorialModal
        isOpen={showVisionTutorial}
        onClose={() => setShowVisionTutorial(false)}
      />

      {/* Modal Simpan Karya */}
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

              {/* Tombol Tutup X */}
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

              <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', fontWeight: '850', color: '#1a140e', fontFamily: 'Cinzel, Georgia, serif', letterSpacing: '-0.3px' }}>
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

const studioBtnStyle = {
  background: '#231a13',
  border: '1px solid rgba(212, 175, 55, 0.25)',
  color: '#fcfaf2',
  padding: '8px 16px',
  borderRadius: '12px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  fontSize: '12.5px',
  fontWeight: '700',
  minHeight: '40px',
  transition: 'all 0.2s ease',
};
