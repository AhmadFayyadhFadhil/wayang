import React, { useState } from 'react';
import { useStageStore } from './useStageStore';
import VirtualStageCanvas from './VirtualStageCanvas';
import SceneComposer from './SceneComposer';
import StagePreviewModal from './StagePreviewModal';
import SavePerformanceModal from './SavePerformanceModal';
export default function StageStudio({ onNavigate }) {
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
    setSelectedInstanceId,
    addCharacterToActiveScene,
    removeCharacterFromActiveScene,
    updateCharacter,
    exportSceneData,
    resetStudio,
  } = useStageStore();

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const currentScene = scenes[activeSceneIndex] || scenes[0];

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
          border: '1px solid #362619',
          borderRadius: '14px',
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
              padding: '8px 18px',
              borderRadius: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '650',
              transition: 'all 0.2s ease',
            }}
          >
            Beranda
          </button>

          <div>
            <h1 style={{ margin: 0, fontSize: '18px', color: '#fcfaf2', fontWeight: '700' }}>
              {metadata.title || 'Lakon Wayang Baru'}
            </h1>
            <div style={{ fontSize: '11px', color: '#bfae9c', marginTop: '2px' }}>
              {scenes.length} Adegan • Status: <strong style={{ color: metadata.visibility === 'public' ? '#10b981' : '#e8bb5c' }}>{metadata.visibility === 'public' ? 'Publik' : 'Privat'}</strong>
            </div>
          </div>
        </div>

        {/* Toolbar Tombol Aksi Studio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => {
              if (window.confirm('Mulai proyek lakon baru dari awal? Perubahan belum tersimpan akan di-reset.')) {
                resetStudio();
              }
            }}
            title="Reset Panggung ke Adegan Awal"
            style={studioBtnStyle}
          >
            Reset
          </button>

          <button
            onClick={() => setShowPreviewModal(true)}
            style={{
              ...studioBtnStyle,
              background: '#231a13',
              borderColor: '#e8bb5c',
              color: '#e8bb5c',
              fontWeight: '650',
            }}
          >
            Pratinjau Pertunjukan
          </button>

          <button
            onClick={() => setShowSaveModal(true)}
            style={{
              ...studioBtnStyle,
              background: '#e8bb5c',
              border: 'none',
              color: '#0d0a07',
              fontWeight: '750',
              padding: '9px 20px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#dcae4d';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#e8bb5c';
            }}
          >
            Simpan Karya
          </button>
        </div>
      </div>

      {/* Virtual Kelir Canvas */}
      <VirtualStageCanvas
        scene={currentScene}
        selectedInstanceId={selectedInstanceId}
        onSelectCharacter={setSelectedInstanceId}
        onUpdateCharacter={updateCharacter}
        onRemoveCharacter={removeCharacterFromActiveScene}
        isInteractive={true}
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
    </div>
  );
}

const studioBtnStyle = {
  background: '#231a13',
  border: '1px solid #362619',
  color: '#fcfaf2',
  padding: '8px 16px',
  borderRadius: '20px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '12px',
  fontWeight: '600',
  transition: 'all 0.2s ease',
};
