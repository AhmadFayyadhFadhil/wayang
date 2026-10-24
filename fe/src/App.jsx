import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomeView from './features/home/HomeView';
import AtlasView from './features/encyclopedia/AtlasView';
import StageStudio from './features/stage/StageStudio';
import ConnectedArchiveView from './features/story/ConnectedArchiveView';
import MyWorksView from './features/stage/MyWorksView';
import AdminCmsView from './features/admin/AdminCmsView';
import StagePreviewModal from './features/stage/StagePreviewModal';
import AuthModal from './features/auth/AuthModal';
import WayangLoadingScreen from './components/ui/WayangLoadingScreen';
import { useStageStore } from './features/stage/useStageStore';
import persistenceService from './services/persistenceService';
import { checkApiStatus } from './services/api';
import { initAOS } from './services/aos';
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
    async function initApp() {
      await testConnection();
    }
    initApp();

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

  // Loading Screen State (Initial App Load & Cross-Module Trigger)
  const [loadingConfig, setLoadingConfig] = useState(() => ({
    show: true,
    message: 'MEMUAT... MOHON SABAR',
    subtitle: 'Menyiapkan panggung kelir & wiracarita Nusantara',
    duration: 650, // Sangat cepat (650ms)
  }));

  // Global listener untuk memicu loading screen dari modul mana pun
  useEffect(() => {
    const handleShowLoading = (e) => {
      setLoadingConfig({
        show: true,
        message: e.detail?.message || 'MEMUAT... MOHON SABAR',
        subtitle: e.detail?.subtitle || '',
        duration: typeof e.detail?.duration === 'number' ? e.detail.duration : 500,
      });
    };

    const handleHideLoading = () => {
      setLoadingConfig((prev) => ({ ...prev, show: false }));
    };

    window.addEventListener('wayang-show-loading', handleShowLoading);
    window.addEventListener('wayang-hide-loading', handleHideLoading);

    return () => {
      window.removeEventListener('wayang-show-loading', handleShowLoading);
      window.removeEventListener('wayang-hide-loading', handleHideLoading);
    };
  }, []);

  // Inisialisasi AOS (Animate On Scroll) seperti jobnation.id setiap tab berubah (kecuali tab panggung kelir)
  useEffect(() => {
    if (activeTab === 'stage') return () => {};
    const cleanup = initAOS({ offset: 40 });
    const timer = setTimeout(() => {
      initAOS({ offset: 40 });
    }, 150);
    return () => {
      cleanup();
      clearTimeout(timer);
    };
  }, [activeTab]);

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        background: 'var(--bg-deep, #0d0a07)',
        color: 'var(--text-main, #fbf8ee)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 0. Layar Pemuatan Kultural Autentik (Gatotkaca & Cakra Surya Majapahit) */}
      <WayangLoadingScreen
        isVisible={loadingConfig.show}
        message={loadingConfig.message}
        subtitle={loadingConfig.subtitle}
        minDuration={loadingConfig.duration}
        onComplete={() => setLoadingConfig((prev) => ({ ...prev, show: false }))}
        allowSkip={true}
        playAudio={true}
      />

      {/* 1. Header & Navigasi Global (Disembunyikan saat di Studio Panggung untuk Studio Satu Layar 100vh) */}
      {activeTab !== 'stage' && (
        <Navbar
          activeTab={activeTab}
          onNavigate={handleNavigate}
          backendConnected={connection.connected}
          currentUser={currentUser}
          onOpenAuth={() => setShowAuthModal(true)}
        />
      )}

      {/* 2. Konten Halaman Aktif */}
      <main
        style={{
          flex: 1,
          paddingTop:
            activeTab === 'home' ||
            activeTab === 'atlas' ||
            activeTab === 'my-works' ||
            activeTab === 'archive' ||
            activeTab === 'admin' ||
            activeTab === 'stage'
              ? '0'
              : '112px',
          paddingBottom: '0',
          height: activeTab === 'stage' ? '100vh' : 'auto',
          overflow: activeTab === 'stage' ? 'hidden' : 'visible',
        }}
      >
        {activeTab === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            connectionStatus={connection}
            onTestConnection={testConnection}
          />
        )}

        {activeTab === 'atlas' && (
          <AtlasView onPlayCharacterOnStage={handlePlayCharacterOnStage} />
        )}

        {activeTab === 'stage' && (
          <StageStudio onNavigate={handleNavigate} />
        )}

        {activeTab === 'archive' && (
          <ConnectedArchiveView
            onPlayPerformance={handlePlayPerformanceFromGallery}
            onNavigateToCharacter={() => {
              handleNavigate('atlas');
            }}
            onNavigateToStory={() => {
              handleNavigate('atlas');
            }}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'my-works' && (
          <MyWorksView
            onOpenStudio={() => handleNavigate('stage')}
            onPlayPerformance={handlePlayPerformanceFromGallery}
          />
        )}

        {activeTab === 'admin' && (
          <AdminCmsView onPlayPerformance={handlePlayPerformanceFromGallery} />
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

      {/* Modal Autentikasi Pengguna & Akses Sanggar */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={currentUser}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          if (user?.role === 'admin') {
            handleNavigate('admin');
          }
        }}
        onLogout={() => {
          setCurrentUser(null);
          if (activeTab === 'admin') {
            handleNavigate('home');
          }
        }}
      />

      {/* 4. Footer Resmi Wayangverse (Disembunyikan saat di Studio Panggung untuk Studio Satu Layar) */}
      {activeTab !== 'stage' && (
        <Footer
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}

export default App;
