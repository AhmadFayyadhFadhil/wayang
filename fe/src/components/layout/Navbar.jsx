import React from 'react';
import { BookOpen, Film, Globe, FolderHeart, User } from 'lucide-react';

export default function Navbar({ activeTab, onNavigate, backendConnected, currentUser, onOpenAuth }) {
  return (
    <header
      style={{
        background: 'rgba(18, 16, 24, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #382c40',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1180px',
          margin: '0 auto',
          padding: '12px 18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        {/* Logo & Brand */}
        <div
          onClick={() => onNavigate('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b, #b45309)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
              fontSize: '18px',
            }}
          >
            🎭
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '0.5px', color: '#fef3c7' }}>
                WAYANG<span style={{ color: '#f59e0b' }}>VERSE</span>
              </span>
              <span
                style={{
                  fontSize: '9px',
                  background: '#78350f',
                  color: '#fef3c7',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                }}
              >
                MVP v1.0
              </span>
            </div>
            <div style={{ fontSize: '10px', color: '#9ca3af' }}>Panggung Interaktif Kebudayaan Digital</div>
          </div>
        </div>

        {/* Menu Navigasi Utama */}
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <button
            onClick={() => onNavigate('home')}
            style={{
              ...navBtnStyle,
              background: activeTab === 'home' ? '#2e2438' : 'transparent',
              color: activeTab === 'home' ? '#f59e0b' : '#d1d5db',
              borderColor: activeTab === 'home' ? '#f59e0b' : 'transparent',
            }}
          >
            Beranda
          </button>

          <button
            onClick={() => onNavigate('atlas')}
            style={{
              ...navBtnStyle,
              background: activeTab === 'atlas' ? '#2e2438' : 'transparent',
              color: activeTab === 'atlas' ? '#f59e0b' : '#d1d5db',
              borderColor: activeTab === 'atlas' ? '#f59e0b' : 'transparent',
            }}
          >
            <BookOpen size={14} /> Story Atlas
          </button>

          <button
            onClick={() => onNavigate('stage')}
            style={{
              ...navBtnStyle,
              background: activeTab === 'stage' ? '#b45309' : '#3d2516',
              color: '#fff',
              fontWeight: 'bold',
              borderColor: '#f59e0b',
              boxShadow: '0 2px 10px rgba(245, 158, 11, 0.3)',
            }}
          >
            <Film size={14} /> Virtual Stage
          </button>

          <button
            onClick={() => onNavigate('archive')}
            style={{
              ...navBtnStyle,
              background: activeTab === 'archive' ? '#2e2438' : 'transparent',
              color: activeTab === 'archive' ? '#f59e0b' : '#d1d5db',
              borderColor: activeTab === 'archive' ? '#f59e0b' : 'transparent',
            }}
          >
            <Globe size={14} /> Connected Archive
          </button>

          <button
            onClick={() => onNavigate('my-works')}
            style={{
              ...navBtnStyle,
              background: activeTab === 'my-works' ? '#2e2438' : 'transparent',
              color: activeTab === 'my-works' ? '#f59e0b' : '#d1d5db',
              borderColor: activeTab === 'my-works' ? '#f59e0b' : 'transparent',
            }}
          >
            <FolderHeart size={14} /> Karya Saya
          </button>

          {/* Tab Khusus Administrator (CMS) */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              style={{
                ...navBtnStyle,
                background: activeTab === 'admin' ? '#78350f' : '#271c11',
                color: activeTab === 'admin' ? '#fef3c7' : '#fbbf24',
                borderColor: '#d97706',
                fontWeight: 'bold',
                boxShadow: '0 0 12px rgba(217, 119, 6, 0.35)',
              }}
            >
              👑 Admin CMS
            </button>
          )}
        </nav>

        {/* Indikator Backend Sync */}
        <div
          title={backendConnected ? 'Backend Laravel Terhubung' : 'Mode Offline-First (Local Cache Aktif)'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: '16px',
            background: backendConnected ? '#064e3b' : '#27272a',
            color: backendConnected ? '#34d399' : '#9ca3af',
            border: `1px solid ${backendConnected ? '#10b981' : '#3f3f46'}`,
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: backendConnected ? '#10b981' : '#f59e0b',
              display: 'inline-block',
            }}
          />
          <span>{backendConnected ? 'API Online' : 'Local Ready'}</span>
        </div>

        {/* Tombol Akun / Autentikasi (PR-05) */}
        <button
          onClick={onOpenAuth}
          style={{
            background: currentUser?.role === 'admin' ? '#78350f' : currentUser ? '#451a03' : '#272333',
            border: `1px solid ${currentUser?.role === 'admin' ? '#fbbf24' : currentUser ? '#f59e0b' : '#453a54'}`,
            color: currentUser ? '#fef3c7' : '#d1d5db',
            padding: '5px 12px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: currentUser?.role === 'admin' ? '0 0 10px rgba(251, 191, 36, 0.3)' : 'none',
          }}
        >
          <User size={14} color={currentUser?.role === 'admin' ? '#fde68a' : currentUser ? '#f59e0b' : '#9ca3af'} />
          {currentUser ? (currentUser.role === 'admin' ? `👑 ${currentUser.name} (Admin)` : currentUser.name) : 'Masuk / Akun'}
        </button>
      </div>
    </header>
  );
}

const navBtnStyle = {
  border: '1px solid transparent',
  padding: '6px 12px',
  borderRadius: '8px',
  fontSize: '12px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'all 0.15s ease',
};
