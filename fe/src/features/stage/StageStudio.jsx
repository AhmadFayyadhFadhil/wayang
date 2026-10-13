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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 16px', color: '#fcfaf2' }}>
      {/* Studio Header Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #1c150e, #130e09)',
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
              border: '1px solid #362619',
              color: '#d4af37',
              padding: '7px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            <ArrowLeft size={14} /> Beranda
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', background: 'linear-gradient(135deg, #d4af37, #8b4513)', color: '#0d0a07', padding: '2px 8px', borderRadius: '4px', fontWeight: '800', letterSpacing: '0.05em' }}>
                STUDIO DALANG 2D
              </span>
              <h1 style={{ margin: 0, fontSize: '18px', color: '#fcfaf2', fontWeight: '700' }}>
                {metadata.title || 'Lakon Wayang Baru'}
              </h1>
            </div>
            <div style={{ fontSize: '11px', color: '#bfae9c', marginTop: '2px' }}>
              {scenes.length} Adegan • Status: <strong style={{ color: metadata.visibility === 'public' ? '#10b981' : '#d4af37' }}>{metadata.visibility === 'public' ? 'Publik' : 'Privat'}</strong>
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
              background: '#231a13',
              borderColor: '#d4af37',
              color: '#d4af37',
              fontWeight: '600',
            }}
          >
            <Play size={14} fill="#d4af37" /> Pratinjau Pertunjukan
          </button>

          <button
            onClick={() => setShowSaveModal(true)}
            style={{
              ...studioBtnStyle,
              background: 'linear-gradient(135deg, #d4af37, #8b4513)',
              border: 'none',
              color: '#0d0a07',
              fontWeight: '700',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
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
  background: '#231a13',
  border: '1px solid #362619',
  color: '#fcfaf2',
  padding: '8px 14px',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '12px',
  fontWeight: '500',
};
