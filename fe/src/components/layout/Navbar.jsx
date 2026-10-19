import React, { useState, useEffect } from 'react';

export default function Navbar({ activeTab, onNavigate, backendConnected, currentUser, onOpenAuth }) {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Cari semua section bertema terang secara dinamis dan menyeluruh
          const lightElements = document.querySelectorAll(
            '[data-light-section="true"], #home-light-sections, #atlas-light-sections, #my-works-light-sections, #template-lakon-section'
          );
          let inLight = false;
          const navbarTop = 20;
          const navbarBottom = 75;

          for (let i = 0; i < lightElements.length; i++) {
            const rect = lightElements[i].getBoundingClientRect();
            // Cek apakah navbar (posisi vertikal 20px-75px) berada di atas area terang
            if (rect.top <= navbarBottom && rect.bottom >= navbarTop) {
              inLight = true;
              break;
            }
          }

          setIsLightMode(inLight);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    const timer = setTimeout(handleScroll, 80);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(timer);
    };
  }, [activeTab]);

  const navItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'atlas', label: 'Story Atlas' },
    { id: 'stage', label: 'Panggung Virtual' },
    { id: 'archive', label: 'Galeri Publik' },
    { id: 'my-works', label: 'Karya Saya' },
  ];

  if (currentUser?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin CMS' });
  }

  return (
    <header
      style={{
        position: 'fixed',
        top: '20px',
        left: 0,
        right: 0,
        zIndex: 100,
        width: '100%',
        padding: '0 24px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1180px',
          margin: '0 auto',
          // Latar belakang kaca halus hangat: di area terang menggunakan warm parchment glass yang lembut menyatu dengan #f5f0e4, tidak kontras putih pekat
          background: isLightMode ? 'rgba(248, 243, 233, 0.88)' : 'rgba(20, 14, 9, 0.68)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isLightMode
            ? '1px solid rgba(212, 175, 55, 0.28)'
            : '1px solid rgba(212, 175, 55, 0.22)',
          borderRadius: '9999px',
          padding: '10px 14px 10px 26px',
          boxShadow: isLightMode
            ? '0 8px 24px rgba(40, 28, 16, 0.06), 0 1px 4px rgba(212, 175, 55, 0.06)'
            : '0 8px 28px rgba(0, 0, 0, 0.30)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          pointerEvents: 'auto',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* 1. Brand Logo (Kiri) - Tipografi Elegan Minimalis Alami */}
        <div
          onClick={() => onNavigate('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            userSelect: 'none',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: '18.5px',
              fontWeight: '850',
              letterSpacing: '-0.4px',
              color: isLightMode ? '#1a140e' : '#fcfaf2',
              fontFamily: 'var(--font-sans)',
              transition: 'color 0.25s ease',
            }}
          >
            Wayang<span style={{ color: isLightMode ? '#c27827' : '#e8bb5c' }}>verse.</span>
          </span>
        </div>

        {/* 2. Menu Navigasi Tengah - Sederhana, Elegan, & Bebas Kontras Berlebihan */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const activeColor = isLightMode ? '#8b5a1b' : '#e8bb5c';
            const inactiveColor = isLightMode ? '#5e5042' : '#d6c8b8';
            const activeBg = isLightMode ? 'rgba(212, 175, 55, 0.14)' : 'rgba(232, 187, 92, 0.14)';
            const activeBorder = isLightMode ? 'rgba(212, 175, 55, 0.35)' : 'rgba(212, 175, 55, 0.30)';

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  background: isActive ? activeBg : 'transparent',
                  border: isActive ? `1px solid ${activeBorder}` : '1px solid transparent',
                  color: isActive ? activeColor : inactiveColor,
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  fontSize: '13.5px',
                  fontWeight: isActive ? '750' : '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.18s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = isLightMode ? '#1a140e' : '#fcfaf2';
                    e.currentTarget.style.background = isLightMode
                      ? 'rgba(212, 175, 55, 0.10)'
                      : 'rgba(255, 255, 255, 0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = inactiveColor;
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* 3. Action Button (Kanan) - Clean Pill Button */}
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {currentUser ? (
            /* Jika Pengguna Sudah Login: Pill Profil Dalang Elegan */
            <button
              onClick={onOpenAuth}
              title={`Akun: ${currentUser.email} (${currentUser.role || 'dalang'})`}
              style={{
                background: isLightMode ? 'rgba(212, 175, 55, 0.12)' : 'rgba(232, 187, 92, 0.14)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: isLightMode
                  ? '1px solid rgba(212, 175, 55, 0.32)'
                  : '1px solid rgba(212, 175, 55, 0.35)',
                color: isLightMode ? '#1a140e' : '#fcfaf2',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '750',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isLightMode
                  ? '0 2px 6px rgba(40, 28, 16, 0.04)'
                  : '0 2px 10px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isLightMode
                  ? 'rgba(212, 175, 55, 0.20)'
                  : 'rgba(232, 187, 92, 0.26)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isLightMode
                  ? 'rgba(212, 175, 55, 0.12)'
                  : 'rgba(232, 187, 92, 0.14)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#10b981',
                  display: 'inline-block',
                }}
              />
              <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.name || 'Dalang'}
              </span>
            </button>
          ) : (
            /* Jika Belum Login: Clean Pill Button */
            <button
              onClick={onOpenAuth}
              style={{
                background: isLightMode ? '#c27827' : '#e8bb5c',
                border: 'none',
                color: isLightMode ? '#ffffff' : '#0d0a07',
                padding: '8px 22px',
                borderRadius: '20px',
                fontSize: '13.5px',
                fontWeight: '750',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                boxShadow: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isLightMode ? '#ad671d' : '#dcae4d';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isLightMode ? '#c27827' : '#e8bb5c';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Masuk Akun
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
