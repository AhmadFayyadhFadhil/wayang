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
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #d97706, #78350f)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              color: '#fef3c7',
              fontSize: '15px',
              letterSpacing: '-0.5px',
            }}
          >
            W
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '0.5px', color: '#fef3c7' }}>
                WAYANG<span style={{ color: '#f59e0b' }}>VERSE</span>
              </span>
              <span
                style={{
                  fontSize: '9px',
                  background: '#272033',
                  color: '#d1d5db',
                  padding: '2px 5px',
                  borderRadius: '4px',
                  fontWeight: '600',
                }}
              >
                v1.0
              </span>
            </div>
            <div style={{ fontSize: '10px', color: '#9ca3af' }}>Platform Digital Pelestarian Seni Wayang</div>
          </div>
        </div>

        {/* Menu Navigasi Utama */}
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          <button
            onClick={() => onNavigate('home')}
            style={{
              ...navBtnStyle,
              background: activeTab === 'home' ? '#261f30' : 'transparent',
              color: activeTab === 'home' ? '#f59e0b' : '#9ca3af',
              borderColor: activeTab === 'home' ? '#78350f' : 'transparent',
            }}
          >
            Beranda
          </button>

          <button
            onClick={() => onNavigate('atlas')}
            style={{
              ...navBtnStyle,
              background: activeTab === 'atlas' ? '#261f30' : 'transparent',
              color: activeTab === 'atlas' ? '#f59e0b' : '#9ca3af',
              borderColor: activeTab === 'atlas' ? '#78350f' : 'transparent',
            }}
          >
            Story Atlas
          </button>

          <button
            onClick={() => onNavigate('stage')}
            style={{
              ...navBtnStyle,
              background: activeTab === 'stage' ? '#78350f' : '#221915',
              color: activeTab === 'stage' ? '#fef3c7' : '#fbbf24',
              borderColor: '#b45309',
              fontWeight: '600',
            }}
          >
            Panggung Virtual
          </button>

          <button
            onClick={() => onNavigate('archive')}
            style={{
              ...navBtnStyle,
              background: activeTab === 'archive' ? '#261f30' : 'transparent',
              color: activeTab === 'archive' ? '#f59e0b' : '#9ca3af',
              borderColor: activeTab === 'archive' ? '#78350f' : 'transparent',
            }}
          >
            Galeri Publik
          </button>

          <button
            onClick={() => onNavigate('my-works')}
            style={{
              ...navBtnStyle,
              background: activeTab === 'my-works' ? '#261f30' : 'transparent',
              color: activeTab === 'my-works' ? '#f59e0b' : '#9ca3af',
              borderColor: activeTab === 'my-works' ? '#78350f' : 'transparent',
            }}
          >
            Karya Saya
          </button>

          {/* Tab Khusus Administrator (CMS) */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              style={{
                ...navBtnStyle,
                background: activeTab === 'admin' ? '#78350f' : '#221915',
                color: activeTab === 'admin' ? '#fef3c7' : '#f59e0b',
                borderColor: '#b45309',
                fontWeight: '600',
              }}
            >
              Admin CMS
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
          }}
        >
          <User size={14} color={currentUser?.role === 'admin' ? '#fde68a' : currentUser ? '#f59e0b' : '#9ca3af'} />
          {currentUser ? (currentUser.role === 'admin' ? `${currentUser.name} (Admin)` : currentUser.name) : 'Masuk / Akun'}
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
