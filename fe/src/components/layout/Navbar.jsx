import React from 'react';
import { BookOpen, Film, Globe, FolderHeart, User } from 'lucide-react';

export default function Navbar({ activeTab, onNavigate, backendConnected, currentUser, onOpenAuth }) {
  return (
    <header
      style={{
        background: 'rgba(13, 10, 7, 0.94)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #362619',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
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
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #d4af37, #8b4513)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              color: '#fcf6e8',
              fontSize: '15px',
              letterSpacing: '-0.5px',
              boxShadow: '0 2px 8px rgba(212, 175, 55, 0.25)',
            }}
          >
            W
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '0.5px', color: '#fcf6e8' }}>
                WAYANG<span style={{ color: '#d4af37' }}>VERSE</span>
              </span>
              <span
                style={{
                  fontSize: '9px',
                  background: '#2b1e14',
                  color: '#d4af37',
                  border: '1px solid #5a3b22',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  fontWeight: '600',
                }}
              >
                v1.0
              </span>
            </div>
            <div style={{ fontSize: '10px', color: '#bfae9c' }}>Platform Digital Pelestarian Seni Wayang</div>
          </div>
        </div>

        {/* Menu Navigasi Utama */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto' }}>
          <button
            onClick={() => onNavigate('home')}
            style={{
              ...navBtnStyle,
              background: activeTab === 'home' ? '#2b1e14' : 'transparent',
              color: activeTab === 'home' ? '#e5c158' : '#bfae9c',
              borderColor: activeTab === 'home' ? '#8b4513' : 'transparent',
            }}
          >
            Beranda
          </button>

          <button
            onClick={() => onNavigate('atlas')}
            style={{
              ...navBtnStyle,
              background: activeTab === 'atlas' ? '#2b1e14' : 'transparent',
              color: activeTab === 'atlas' ? '#e5c158' : '#bfae9c',
              borderColor: activeTab === 'atlas' ? '#8b4513' : 'transparent',
            }}
          >
            Story Atlas
          </button>

          <button
            onClick={() => onNavigate('stage')}
            style={{
              ...navBtnStyle,
              background: activeTab === 'stage' ? 'linear-gradient(135deg, #8b4513, #5c2c10)' : '#261b12',
              color: activeTab === 'stage' ? '#fcf6e8' : '#e5c158',
              borderColor: '#8b4513',
              fontWeight: '600',
              boxShadow: activeTab === 'stage' ? '0 2px 10px rgba(139, 69, 19, 0.4)' : 'none',
            }}
          >
            Panggung Virtual
          </button>

          <button
            onClick={() => onNavigate('archive')}
            style={{
              ...navBtnStyle,
              background: activeTab === 'archive' ? '#2b1e14' : 'transparent',
              color: activeTab === 'archive' ? '#e5c158' : '#bfae9c',
              borderColor: activeTab === 'archive' ? '#8b4513' : 'transparent',
            }}
          >
            Galeri Publik
          </button>

          <button
            onClick={() => onNavigate('my-works')}
            style={{
              ...navBtnStyle,
              background: activeTab === 'my-works' ? '#2b1e14' : 'transparent',
              color: activeTab === 'my-works' ? '#e5c158' : '#bfae9c',
              borderColor: activeTab === 'my-works' ? '#8b4513' : 'transparent',
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
                background: activeTab === 'admin' ? 'linear-gradient(135deg, #8b4513, #5c2c10)' : '#261b12',
                color: activeTab === 'admin' ? '#fcf6e8' : '#e5c158',
                borderColor: '#8b4513',
                fontWeight: '600',
              }}
            >
              Admin CMS
            </button>
          )}
        </nav>

        {/* Info Pengguna & Akun */}
        <button
          onClick={onOpenAuth}
          title={currentUser ? `Akun: ${currentUser.email} (${currentUser.role || 'dalang'})` : 'Masuk atau daftarkan akun'}
          style={{
            background: currentUser?.role === 'admin' ? 'rgba(120, 53, 15, 0.45)' : currentUser ? 'rgba(39, 34, 51, 0.7)' : '#211d2b',
            border: `1px solid ${currentUser?.role === 'admin' ? '#b45309' : currentUser ? '#4a3d60' : '#393247'}`,
            color: '#fef3c7',
            padding: '4px 12px 4px 6px',
            borderRadius: '24px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: currentUser?.role === 'admin' ? 'linear-gradient(135deg, #d97706, #78350f)' : currentUser ? '#b45309' : '#3730a3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <User size={13} />
          </div>
          <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {currentUser ? currentUser.name : 'Masuk / Akun'}
          </span>
          {currentUser?.role === 'admin' && (
            <span
              style={{
                fontSize: '9px',
                background: '#78350f',
                border: '1px solid #d97706',
                color: '#fef3c7',
                padding: '1px 6px',
                borderRadius: '10px',
                fontWeight: '700',
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
              }}
            >
              Admin
            </span>
          )}
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
