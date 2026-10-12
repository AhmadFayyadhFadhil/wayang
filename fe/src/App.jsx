import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import HomeView from './features/home/HomeView';
import AtlasView from './features/encyclopedia/AtlasView';
import StageStudio from './features/stage/StageStudio';
import ConnectedArchiveView from './features/story/ConnectedArchiveView';
import MyWorksView from './features/stage/MyWorksView';
import StagePreviewModal from './features/stage/StagePreviewModal';
import AuthModal from './features/auth/AuthModal';
import { useStageStore } from './features/stage/useStageStore';
import persistenceService from './services/persistenceService';
import { checkApiStatus } from './services/api';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'atlas' | 'stage' | 'archive' | 'my-works'
  const [selectedPerformanceForWatch, setSelectedPerformanceForWatch] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('wayangverse_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (_e) {
      return null;
    }
  });

  // Status Koneksi Backend
  const [connection, setConnection] = useState({
    loading: true,
    connected: false,
    data: null,
    error: null,
  });

  const { addCharacterToActiveScene, exportSceneData } = useStageStore();

  const testConnection = async () => {
    setConnection((prev) => ({ ...prev, loading: true, error: null }));
    const result = await checkApiStatus();
    if (result.success) {
      setConnection({
        loading: false,
        connected: true,
        data: result.data,
        error: null,
      });
    } else {
      setConnection({
        loading: false,
        connected: false,
        data: null,
        error: result.error,
      });
    }
  };

  useEffect(() => {
    testConnection();

    // Inisialisasi karya demo awal jika local storage masih kosong
    const initialDemoWork = {
      id: 'demo-1',
      title: 'Bharatayuddha: Gugurnya Ghatotkaca',
      description: 'Pertempuran malam hari di padang Kurusetra antara Sang Senopati Udara dengan Adipati Karna.',
      story_id: 1,
      visibility: 'public',
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      author: 'Dalang Muda Preservasi Budaya',
      scene_data: exportSceneData(),
      schema_version: 1,
    };
    persistenceService.seedInitialDemoWorks(initialDemoWork);
  }, []);

  // Handler interaksi lintas modul (Connected by Design)
  const handlePlayCharacterOnStage = (characterId) => {
    addCharacterToActiveScene(characterId);
    setActiveTab('stage');
  };

  const handlePlayPerformanceFromGallery = (performance) => {
    setSelectedPerformanceForWatch(performance);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0c0a10',
        color: '#f3f4f6',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. Header & Navigasi Global */}
      <Navbar
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        backendConnected={connection.connected}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* 2. Konten Halaman Aktif */}
      <main style={{ flex: 1, paddingBottom: '40px' }}>
        {activeTab === 'home' && (
          <HomeView
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            connectionStatus={connection}
            onTestConnection={testConnection}
          />
        )}

        {activeTab === 'atlas' && (
          <AtlasView onPlayCharacterOnStage={handlePlayCharacterOnStage} />
        )}

        {activeTab === 'stage' && (
          <StageStudio onNavigate={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === 'archive' && (
          <ConnectedArchiveView
            onPlayPerformance={handlePlayPerformanceFromGallery}
            onNavigateToCharacter={() => setActiveTab('atlas')}
            onNavigateToStory={() => setActiveTab('atlas')}
          />
        )}

        {activeTab === 'my-works' && (
          <MyWorksView
            onOpenStudio={() => setActiveTab('stage')}
            onPlayPerformance={handlePlayPerformanceFromGallery}
          />
        )}
      </main>

      {/* 3. Global Modal Playback (Ketika tombol Nonton/Putar diklik di Galeri) */}
      {selectedPerformanceForWatch && (
        <StagePreviewModal
          isOpen={Boolean(selectedPerformanceForWatch)}
          onClose={() => setSelectedPerformanceForWatch(null)}
          scenes={
            (typeof selectedPerformanceForWatch.scene_data === 'string'
              ? JSON.parse(selectedPerformanceForWatch.scene_data)
              : selectedPerformanceForWatch.scene_data
            )?.scenes || []
          }
          metadata={selectedPerformanceForWatch}
        />
      )}

      {/* Modal Autentikasi Pengguna & Demo (PR-05) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={currentUser}
        onAuthSuccess={(user) => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
      />

      {/* 4. Footer Bernuansa Warisan Budaya */}
      <footer
        style={{
          borderTop: '1px solid #272133',
          background: '#09080d',
          padding: '24px 18px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#6b7280',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div>
            <strong style={{ color: '#d4a359' }}>Wayangverse</strong> — Platform Pertunjukan Wayang 2D Virtual & Preservasi Budaya.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Tema: Sosial & Kesenian</span>
            <span>•</span>
            <span>Prinsip: Cultural Integrity</span>
            <span>•</span>
            <span>Versi: MVP 1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
