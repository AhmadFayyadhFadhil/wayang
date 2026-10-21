import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Home,
  BookOpen,
  Sparkles,
  Globe,
  FolderHeart,
  ShieldAlert,
  User,
  LogIn,
  ChevronRight,
} from 'lucide-react';

export default function Navbar({ activeTab, onNavigate, _backendConnected, currentUser, onOpenAuth }) {
  const [isLightMode, setIsLightMode] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 900 : false
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Pantau breakpoint layar dan deteksi apakah berada di atas section terang
  useEffect(() => {
    let ticking = false;

    const checkViewport = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Cari semua section bertema terang secara dinamis dan menyeluruh
          const lightElements = document.querySelectorAll(
            '[data-light-section="true"], #home-light-sections, #atlas-light-sections, #my-works-light-sections, #template-lakon-section, #archive-light-sections'
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

    const handleResize = () => {
      checkViewport();
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    checkViewport();
    handleScroll();
    const timer = setTimeout(handleScroll, 80);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [activeTab]);

  // Tutup drawer jika tombol ESC ditekan
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Lock scroll background ketika drawer mobile terbuka
  useEffect(() => {
    if (isMobile && isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isMobileMenuOpen]);

  const navItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'atlas', label: 'Story Atlas', icon: BookOpen },
    { id: 'stage', label: 'Panggung Virtual', icon: Sparkles },
    { id: 'archive', label: 'Galeri Publik', icon: Globe },
    { id: 'my-works', label: 'Karya Saya', icon: FolderHeart },
  ];

  if (currentUser?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin CMS', icon: ShieldAlert });
  }

  const handleMobileNavClick = (id) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  const handleMobileAuthClick = () => {
    setIsMobileMenuOpen(false);
    onOpenAuth();
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: '16px',
          left: 0,
          right: 0,
          zIndex: 100,
          width: '100%',
          padding: '0 16px',
          boxSizing: 'border-box',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            maxWidth: '1180px',
            margin: '0 auto',
            // Latar belakang kaca halus hangat: di area terang menggunakan warm parchment glass yang lembut menyatu dengan #f5f0e4
            background: isLightMode ? 'rgba(248, 243, 233, 0.90)' : 'rgba(20, 14, 9, 0.72)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: isLightMode
              ? '1px solid rgba(212, 175, 55, 0.28)'
              : '1px solid rgba(212, 175, 55, 0.22)',
            borderRadius: '9999px',
            padding: isMobile ? '8px 12px 8px 18px' : '9px clamp(10px, 1.3vw, 14px) 9px clamp(14px, 1.8vw, 26px)',
            boxShadow: isLightMode
              ? '0 8px 24px rgba(40, 28, 16, 0.06), 0 1px 4px rgba(212, 175, 55, 0.06)'
              : '0 8px 28px rgba(0, 0, 0, 0.32)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: isMobile ? '12px' : 'clamp(8px, 1.5vw, 24px)',
            pointerEvents: 'auto',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* 1. Brand Logo (Kiri) - Tipografi Elegan Minimalis Alami */}
          <div
            onClick={() => {
              onNavigate('home');
              if (isMobileMenuOpen) setIsMobileMenuOpen(false);
            }}
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
                fontSize: isMobile ? '17px' : 'clamp(16px, 1.3vw, 18.5px)',
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

          {/* 2. Menu Navigasi Desktop (Tengah) - Ditampilkan saat Layar Lebar (>= 900px) */}
          {!isMobile && (
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(3px, 0.5vw, 6px)',
                flexShrink: 1,
                minWidth: 0,
              }}
            >
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const activeColor = isLightMode ? '#8b5a1b' : '#e8bb5c';
                const inactiveColor = isLightMode ? '#5e5042' : '#d6c8b8';
                const activeBg = isLightMode
                  ? 'rgba(212, 175, 55, 0.14)'
                  : 'rgba(232, 187, 92, 0.14)';
                const activeBorder = isLightMode
                  ? 'rgba(212, 175, 55, 0.35)'
                  : 'rgba(212, 175, 55, 0.30)';

                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    style={{
                      background: isActive ? activeBg : 'transparent',
                      border: isActive ? `1px solid ${activeBorder}` : '1px solid transparent',
                      color: isActive ? activeColor : inactiveColor,
                      padding: '7px clamp(8px, 1vw, 16px)',
                      borderRadius: '9999px',
                      fontSize: 'clamp(12px, 0.9vw, 13.5px)',
                      fontWeight: isActive ? '750' : '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.18s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      flexShrink: 0,
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
          )}

          {/* 3. Action Button Desktop (Kanan) */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              {currentUser ? (
                /* Jika Pengguna Sudah Login: Pill Profil Dalang Elegan */
                <button
                  onClick={onOpenAuth}
                  title={`Akun: ${currentUser.email} (${currentUser.role || 'dalang'})`}
                  style={{
                    background: isLightMode
                      ? 'rgba(212, 175, 55, 0.12)'
                      : 'rgba(232, 187, 92, 0.14)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: isLightMode
                      ? '1px solid rgba(212, 175, 55, 0.32)'
                      : '1px solid rgba(212, 175, 55, 0.35)',
                    color: isLightMode ? '#1a140e' : '#fcfaf2',
                    padding: '8px clamp(12px, 1.4vw, 20px)',
                    borderRadius: '20px',
                    fontSize: 'clamp(12px, 0.9vw, 13px)',
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
                  <span
                    style={{
                      maxWidth: '120px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
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
                    padding: '8px clamp(12px, 1.4vw, 22px)',
                    borderRadius: '20px',
                    fontSize: 'clamp(12px, 0.9vw, 13.5px)',
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
          )}

          {/* 4. Hamburger Button Mobile (< 860px) - Ergonomis 44x44px Touch Target */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Indikator Status Akun Ringkas pada Bar Mobile */}
              {currentUser && (
                <button
                  onClick={onOpenAuth}
                  aria-label="Profil Akun"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: isLightMode
                      ? 'rgba(212, 175, 55, 0.15)'
                      : 'rgba(232, 187, 92, 0.15)',
                    border: isLightMode
                      ? '1px solid rgba(212, 175, 55, 0.35)'
                      : '1px solid rgba(212, 175, 55, 0.30)',
                    color: isLightMode ? '#8b5a1b' : '#e8bb5c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  title={currentUser.name || 'Dalang'}
                >
                  <User size={18} />
                </button>
              )}

              {/* Tombol Hamburger dengan Touch Target 44x44px */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi wayang'}
                aria-expanded={isMobileMenuOpen}
                style={{
                  minWidth: '44px',
                  minHeight: '44px',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: isMobileMenuOpen
                    ? isLightMode
                      ? 'rgba(194, 120, 39, 0.18)'
                      : 'rgba(232, 187, 92, 0.22)'
                    : isLightMode
                    ? 'rgba(212, 175, 55, 0.12)'
                    : 'rgba(255, 255, 255, 0.08)',
                  border: isMobileMenuOpen
                    ? '1px solid rgba(212, 175, 55, 0.45)'
                    : isLightMode
                    ? '1px solid rgba(212, 175, 55, 0.25)'
                    : '1px solid rgba(212, 175, 55, 0.20)',
                  color: isLightMode ? '#1a140e' : '#fcfaf2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isMobileMenuOpen
                    ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                    : 'none',
                }}
              >
                {isMobileMenuOpen ? (
                  <X size={21} style={{ color: isLightMode ? '#8b5a1b' : '#e8bb5c' }} />
                ) : (
                  <Menu size={21} />
                )}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ============================================================
          HERITAGE GLASS MOBILE DRAWER / OVERLAY SHEET
          Tampil mulus saat Hamburger di-tap pada layar mobile/tablet
          ============================================================ */}
      {isMobile && isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu Navigasi Wayangverse"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: '76px 16px 24px 16px',
            boxSizing: 'border-box',
          }}
        >
          {/* Backdrop Blur Dimmer yang Menutup saat Disentuh */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(10, 7, 5, 0.65)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              transition: 'opacity 0.25s ease',
            }}
          />

          {/* Kartu Menu Mengambang Berkarakter Soga Glass & Prada Emas */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '480px',
              margin: '0 auto',
              maxHeight: 'calc(100vh - 100px)',
              overflowY: 'auto',
              background: isLightMode
                ? 'rgba(250, 246, 238, 0.96)'
                : 'rgba(18, 13, 9, 0.96)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: isLightMode
                ? '1px solid rgba(212, 175, 55, 0.35)'
                : '1px solid rgba(212, 175, 55, 0.28)',
              borderRadius: '24px',
              padding: '20px 18px',
              boxSizing: 'border-box',
              boxShadow: isLightMode
                ? '0 16px 40px rgba(40, 28, 16, 0.14), 0 0 1px 1px rgba(212, 175, 55, 0.15)'
                : '0 20px 48px rgba(0, 0, 0, 0.55), 0 0 1px 1px rgba(212, 175, 55, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {/* Header Mini Drawer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 8px 14px 8px',
                borderBottom: isLightMode
                  ? '1px solid rgba(0, 0, 0, 0.06)'
                  : '1px solid rgba(212, 175, 55, 0.15)',
                marginBottom: '6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '750',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: isLightMode ? '#8b5a1b' : '#d4af37',
                  }}
                >
                  JELAJAH PANGGUNG
                </span>
              </div>
              <span
                style={{
                  fontSize: '11.5px',
                  color: isLightMode ? '#786c5f' : '#9e8e7c',
                  fontWeight: '500',
                }}
              >
                Gagrag Mataram & Sala
              </span>
            </div>

            {/* Daftar Tautan Halaman Vertikal (Touch Target > 44px) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const IconComponent = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleMobileNavClick(item.id)}
                    style={{
                      minHeight: '48px',
                      width: '100%',
                      background: isActive
                        ? isLightMode
                          ? 'rgba(212, 175, 55, 0.16)'
                          : 'rgba(232, 187, 92, 0.16)'
                        : 'transparent',
                      border: isActive
                        ? isLightMode
                          ? '1px solid rgba(212, 175, 55, 0.35)'
                          : '1px solid rgba(212, 175, 55, 0.30)'
                        : '1px solid transparent',
                      borderRadius: '14px',
                      padding: '10px 14px',
                      boxSizing: 'border-box',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: isActive
                        ? isLightMode
                          ? '#8b5a1b'
                          : '#e8bb5c'
                        : isLightMode
                        ? '#3d2e20'
                        : '#e3d6c6',
                      fontWeight: isActive ? '750' : '600',
                      fontSize: '14.5px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          background: isActive
                            ? isLightMode
                              ? 'rgba(194, 120, 39, 0.15)'
                              : 'rgba(232, 187, 92, 0.22)'
                            : isLightMode
                            ? 'rgba(0, 0, 0, 0.04)'
                            : 'rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isActive
                            ? isLightMode
                              ? '#8b5a1b'
                              : '#e8bb5c'
                            : isLightMode
                            ? '#635344'
                            : '#baa996',
                          flexShrink: 0,
                        }}
                      >
                        <IconComponent size={17} />
                      </div>
                      <span>{item.label}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isActive && (
                        <span
                          style={{
                            fontSize: '10.5px',
                            fontWeight: '750',
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            background: isLightMode ? '#c27827' : '#e8bb5c',
                            color: isLightMode ? '#ffffff' : '#0d0a07',
                            letterSpacing: '0.4px',
                          }}
                        >
                          Aktif
                        </span>
                      )}
                      <ChevronRight
                        size={16}
                        style={{
                          opacity: isActive ? 1 : 0.4,
                          color: isActive
                            ? isLightMode
                              ? '#8b5a1b'
                              : '#e8bb5c'
                            : isLightMode
                            ? '#8a7c6e'
                            : '#8a7c6e',
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Pemisah Halus */}
            <div
              style={{
                height: '1px',
                background: isLightMode
                  ? 'rgba(0, 0, 0, 0.06)'
                  : 'rgba(212, 175, 55, 0.15)',
                margin: '12px 0 8px 0',
              }}
            />

            {/* Bagian Akun / Auth di Bawah Menu (Touch Target Ramah Sentuh) */}
            <div>
              {currentUser ? (
                <div
                  style={{
                    background: isLightMode
                      ? 'rgba(212, 175, 55, 0.08)'
                      : 'rgba(232, 187, 92, 0.08)',
                    border: isLightMode
                      ? '1px solid rgba(212, 175, 55, 0.25)'
                      : '1px solid rgba(212, 175, 55, 0.20)',
                    borderRadius: '16px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: isLightMode
                          ? 'rgba(212, 175, 55, 0.2)'
                          : 'rgba(232, 187, 92, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isLightMode ? '#8b5a1b' : '#e8bb5c',
                        flexShrink: 0,
                      }}
                    >
                      <User size={19} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '13.5px',
                          fontWeight: '750',
                          color: isLightMode ? '#1a140e' : '#fcfaf2',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {currentUser.name || 'Dalang'}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: isLightMode ? '#786c5f' : '#a39382',
                          textTransform: 'capitalize',
                        }}
                      >
                        {currentUser.role || 'dalang'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleMobileAuthClick}
                    style={{
                      minHeight: '38px',
                      background: isLightMode ? '#c27827' : '#e8bb5c',
                      color: isLightMode ? '#ffffff' : '#0d0a07',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '8px 14px',
                      fontSize: '12.5px',
                      fontWeight: '750',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    Profil
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleMobileAuthClick}
                  style={{
                    minHeight: '46px',
                    width: '100%',
                    background: isLightMode ? '#c27827' : '#e8bb5c',
                    color: isLightMode ? '#ffffff' : '#0d0a07',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '12px 18px',
                    fontSize: '14px',
                    fontWeight: '750',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <LogIn size={17} />
                  <span>Masuk Akun Dalang</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
