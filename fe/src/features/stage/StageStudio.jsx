import React, { useState } from 'react';
import { useStageStore } from './useStageStore';
import VirtualStageCanvas from './VirtualStageCanvas';
import SceneComposer from './SceneComposer';
import StagePreviewModal from './StagePreviewModal';
import SavePerformanceModal from './SavePerformanceModal';
import { Play, Save, RotateCcw, ArrowLeft } from 'lucide-react';

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
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px' }}>
      {/* Studio Header Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #1f1b29, #13111a)',
          border: '1px solid #3d334d',
          borderRadius: '14px',
          padding: '12px 18px',
          marginBottom: '16px',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => onNavigate && onNavigate('home')}
            title="Kembali ke Beranda"
            style={{
              background: '#2b263b',
              border: '1px solid #4a3e63',
              color: '#d1d5db',
              padding: '6px 10px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
            }}
          >
            <ArrowLeft size={14} /> Beranda
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', background: '#b45309', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                STUDIO DALANG 2D
              </span>
              <h1 style={{ margin: 0, fontSize: '18px', color: '#fef3c7', fontWeight: 'bold' }}>
                {metadata.title || 'Lakon Wayang Baru'}
              </h1>
            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
              {scenes.length} Adegan • Status: <strong style={{ color: metadata.visibility === 'public' ? '#34d399' : '#fbbf24' }}>{metadata.visibility === 'public' ? 'Publik' : 'Privat'}</strong>
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
            <RotateCcw size={14} /> Reset
          </button>

          <button
            onClick={() => setShowPreviewModal(true)}
            style={{
              ...studioBtnStyle,
              background: '#78350f',
              borderColor: '#f59e0b',
              color: '#fef3c7',
              fontWeight: '600',
            }}
          >
            <Play size={14} fill="#fef3c7" /> Pratinjau Pertunjukan
          </button>

          <button
            onClick={() => setShowSaveModal(true)}
            style={{
              ...studioBtnStyle,
              background: 'linear-gradient(135deg, #d97706, #b45309)',
              border: 'none',
              color: '#fff',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(217, 119, 6, 0.4)',
            }}
          >
            <Save size={15} /> Simpan Karya
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
  background: '#2b263b',
  border: '1px solid #4a3e63',
  color: '#e5e7eb',
  padding: '8px 14px',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '12px',
};
