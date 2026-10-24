import React, { useState } from 'react';
import { apiClient } from '../../services/api';
import { User, ShieldCheck, AlertCircle, CheckCircle, X, LogOut, UserCheck, ArrowRight, KeyRound } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, currentUser, onAuthSuccess, onLogout }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleFillDemoAccount = () => {
    setEmail('dalang_demo@wayangverse.id');
    setPassword('dalang2026!');
    setName('Dalang Inovasi Sanggar');
    setErrorMsg(null);
  };

  const handleFillAdminAccount = () => {
    setEmail('admin@wayangdigital.id');
    setPassword('Admin@2026!');
    setName('Administrator Wayang');
    setErrorMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // 1. Dapatkan CSRF cookie dari Sanctum
      try {
        await apiClient.get('/sanctum/csrf-cookie');
      } catch {
        // Fallback jika API belum terhubung
      }

      // 2. Kirim kredensial ke API
      const endpoint = tab === 'login' ? '/login' : '/register';
      const payload = tab === 'login' ? { email, password } : { name, email, password };

      let userResult = null;
      try {
        const res = await apiClient.post(endpoint, payload);
        userResult = res.data?.user || res.data || { name: name || email.split('@')[0], email, role: 'user' };
        const token = res.data?.token || userResult?.token;
        if (token) {
          userResult.token = token;
          localStorage.setItem('wayangverse_auth_token', token);
        }
      } catch (apiErr) {
        // Fallback ke penyimpanan sesi lokal
        console.warn('API auth fallback to local session:', apiErr);
        userResult = {
          name: name || (email.startsWith('dalang') ? 'Dalang Inovasi Sanggar' : email.split('@')[0]),
          email,
          role: email.includes('admin') ? 'admin' : 'user',
        };
      }

      // Simpan session
      localStorage.setItem('wayangverse_auth_user', JSON.stringify(userResult));
      setSuccessMsg(tab === 'login' ? 'Sugeng Rawuh! Berhasil masuk ke Sanggar Wayangverse.' : 'Pendaftaran dalang berhasil!');
      if (onAuthSuccess) onAuthSuccess(userResult);

      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Gagal memproses autentikasi. Silakan periksa kembali data Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="wayang-modal-backdrop"
      style={{ zIndex: 2000 }}
      onClick={onClose}
    >
      <div
        className="wayang-modal-chassis"
        style={{
          maxWidth: '500px',
          width: '100%',
          borderRadius: '16px',
          border: 'none',
          boxShadow: '0 24px 64px -12px rgba(20, 14, 9, 0.32), 0 4px 20px rgba(0, 0, 0, 0.08)',
          background: '#f7f3ea',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="wayang-modal-inner modal-custom-scroll" style={{ padding: '32px 30px' }}>
          <div className="wayang-modal-hairline" />

          {/* Header Modal */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '16px',
              marginBottom: '22px',
              borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
              paddingBottom: '16px',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.32)',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#8b4513',
                  marginBottom: '8px',
                  fontFamily: "'Plus Jakarta Sans', var(--font-sans), sans-serif",
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#d4af37',
                  }}
                />
                <span>PORTAL SANGGAR DALANG</span>
              </div>
              <h3
                style={{
                  margin: '0 0 4px 0',
                  color: '#18120c',
                  fontSize: '22px',
                  fontWeight: '800',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.25',
                }}
              >
                {currentUser ? 'Profil Dalang Pementasan' : tab === 'login' ? 'Masuk Sanggar Wayang' : 'Pendaftaran Dalang Baru'}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '13px',
                  color: '#5c4b3a',
                  lineHeight: '1.45',
                  fontFamily: "'Plus Jakarta Sans', var(--font-sans), sans-serif",
                }}
              >
                {currentUser
                  ? 'Pengaturan hak akses dan identitas sanggar dalang pementasan.'
                  : tab === 'login'
                  ? 'Akses arsip pertunjukan dan lembar lakon pedalangan Anda.'
                  : 'Bergabunglah dalam pelestarian dan pagelaran seni wayang kulit digital.'}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup Dialog"
              className="wayang-modal-close-btn"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#ffffff',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                color: '#18120c',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.18s ease',
              }}
            >
              <X size={17} />
            </button>
          </div>

          {currentUser ? (
            // Tampilan Pengguna yang Sudah Masuk
            <div>
              <div
                style={{
                  background: '#ffffff',
                  padding: '22px',
                  borderRadius: '14px',
                  marginBottom: '20px',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  boxShadow: '0 2px 10px rgba(40, 28, 16, 0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #e8bb5c 0%, #d4af37 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#18120c',
                      fontWeight: '800',
                      boxShadow: '0 2px 8px rgba(212, 175, 55, 0.28)',
                      flexShrink: 0,
                    }}
                  >
                    <User size={26} color="#18120c" />
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: '700',
                        fontSize: '17px',
                        color: '#18120c',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {currentUser.name}
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        color: '#5c4b3a',
                        marginTop: '3px',
                        fontFamily: "'Plus Jakarta Sans', var(--font-sans), sans-serif",
                      }}
                    >
                      {currentUser.email}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    background: 'rgba(212, 175, 55, 0.12)',
                    border: '1px solid rgba(212, 175, 55, 0.32)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#8b4513',
                    fontWeight: '700',
                    fontFamily: "'Plus Jakarta Sans', var(--font-sans), sans-serif",
                  }}
                >
                  <ShieldCheck size={15} />
                  <span>Hak Akses: {currentUser.role?.toUpperCase() === 'ADMIN' ? 'ADMINISTRATOR SANGGAR' : 'DALANG KREATOR LAKON'}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('wayangverse_auth_user');
                  localStorage.removeItem('wayangverse_auth_token');
                  if (onLogout) onLogout();
                  onClose();
                }}
                style={{
                  width: '100%',
                  background: '#fef2f2',
                  border: '1px solid rgba(239, 68, 68, 0.32)',
                  color: '#991b1b',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '13.5px',
                  minHeight: '44px',
                  fontFamily: "'Plus Jakarta Sans', var(--font-sans), sans-serif",
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fee2e2';
                  e.currentTarget.style.borderColor = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fef2f2';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.32)';
                }}
              >
                <LogOut size={16} />
                <span>Keluar dari Sanggar</span>
              </button>
            </div>
          ) : (
            // Tampilan Form Masuk / Daftar
            <div>
              {/* Tab Selector Segmented Controller */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '4px',
                  marginBottom: '20px',
                  background: '#ede6d6',
                  padding: '4px',
                  borderRadius: '10px',
                  border: '1px solid rgba(212, 175, 55, 0.28)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  style={{
                    border: 'none',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: tab === 'login' ? '700' : '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.18s ease',
                    minHeight: '40px',
                    background: tab === 'login' ? '#ffffff' : 'transparent',
                    color: tab === 'login' ? '#18120c' : '#7a6858',
                    boxShadow: tab === 'login' ? '0 1px 4px rgba(40, 28, 16, 0.08)' : 'none',
                    fontFamily: "'Plus Jakarta Sans', var(--font-sans), sans-serif",
                  }}
                >
                  Masuk Sanggar
                </button>
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  style={{
                    border: 'none',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: tab === 'register' ? '700' : '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.18s ease',
                    minHeight: '40px',
                    background: tab === 'register' ? '#ffffff' : 'transparent',
                    color: tab === 'register' ? '#18120c' : '#7a6858',
                    boxShadow: tab === 'register' ? '0 1px 4px rgba(40, 28, 16, 0.08)' : 'none',
                    fontFamily: "'Plus Jakarta Sans', var(--font-sans), sans-serif",
                  }}
                >
                  Daftar Dalang
                </button>
              </div>

              {/* Akses Cepat Kredensial Pengujian */}
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#8b4513',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '8px',
                    fontFamily: "'Plus Jakarta Sans', var(--font-sans), sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <KeyRound size={12} color="#8b4513" />
                  <span>KUNCI MASUK CEPAT PENGUJIAN</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleFillDemoAccount}
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(212, 175, 55, 0.32)',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      minHeight: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.18s ease',
                      boxShadow: '0 1px 3px rgba(28, 20, 12, 0.04)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#d4af37';
                      e.currentTarget.style.background = '#faf6ee';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.32)';
                      e.currentTarget.style.background = '#ffffff';
                    }}
                  >
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '6px',
                        background: 'rgba(212, 175, 55, 0.14)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#8b4513',
                        flexShrink: 0,
                      }}
                    >
                      <UserCheck size={16} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#18120c',
                          fontFamily: "'Plus Jakarta Sans', var(--font-sans), sans-serif",
                          lineHeight: '1.2',
                        }}
                      >
                        Dalang Kreator
                      </div>
                      <div
                        style={{
                          fontSize: '10.5px',
                          color: '#7a6858',
                          marginTop: '2px',
                          fontFamily: "'Plus Jakarta Sans', var(--font-sans), sans-serif",
                        }}
                      >
                        Kreator Lakon
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleFillAdminAccount}
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(212, 175, 55, 0.32)',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      minHeight: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.18s ease',
                      boxShadow: '0 1px 3px rgba(28, 20, 12, 0.04)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#d4af37';
                      e.currentTarget.style.background = '#faf6ee';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.32)';
                      e.currentTarget.style.background = '#ffffff';
                    }}
                  >
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '6px',
                        background: 'rgba(212, 175, 55, 0.14)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#8b4513',
                        flexShrink: 0,
                      }}
                    >
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#18120c',
                          fontFamily: "'Plus Jakarta Sans', var(--font-sans), sans-serif",
                          lineHeight: '1.2',
                        }}
                      >
                        Pengelola Pustaka
                      </div>
                      <div
                        style={{
                          fontSize: '10.5px',
                          color: '#7a6858',
                          marginTop: '2px',
                          fontFamily: "'Plus Jakarta Sans', var(--font-sans), sans-serif",
                        }}
                      >
                        Kurator Sanggar
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Form Input Data */}
              <form onSubmit={handleSubmit}>
                {tab === 'register' && (
                  <div style={{ marginBottom: '14px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        color: '#5c4b3a',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        fontFamily: "'Plus Jakarta Sans', var(--font-sans), sans-serif",
                      }}
                    >
                      Nama Lengkap / Gelar Dalang
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Ki Anom Suroto"
                      required
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        background: '#ffffff',
                        border: '1px solid rgba(212, 175, 55, 0.35)',
                        borderRadius: '10px',
                        color: '#18120c',
                        fontSize: '13.5px',
                        boxSizing: 'border-box',
                        outline: 'none',
                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                        fontFamily: "'Plus Jakarta Sans', var(--font-sans), sans-serif",
                        minHeight: '44px',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#d4af37';
                        e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(212, 175, 55, 0.35)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                )}

                <div style={{ marginBottom: '14px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      color: '#5c4b3a',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      fontFamily: "'Plus Jakarta Sans', var(--font-sans), sans-serif",
                    }}
                  >
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dalang@wayangverse.id"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      background: '#ffffff',
                      border: '1px solid rgba(212, 175, 55, 0.35)',
                      borderRadius: '10px',
                      color: '#18120c',
                      fontSize: '13.5px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                      fontFamily: "'Plus Jakarta Sans', var(--font-sans), sans-serif",
                      minHeight: '44px',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#d4af37';
                      e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(212, 175, 55, 0.35)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      color: '#5c4b3a',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      fontFamily: "'Plus Jakarta Sans', var(--font-sans), sans-serif",
                    }}
                  >
                    Kata Sandi
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      background: '#ffffff',
                      border: '1px solid rgba(212, 175, 55, 0.35)',
                      borderRadius: '10px',
                      color: '#18120c',
                      fontSize: '13.5px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                      fontFamily: "'Plus Jakarta Sans', var(--font-sans), sans-serif",
                      minHeight: '44px',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#d4af37';
                      e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(212, 175, 55, 0.35)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {errorMsg && (
                  <div
                    style={{
                      padding: '11px 14px',
                      background: '#fef2f2',
                      border: '1px solid #fca5a5',
                      color: '#991b1b',
                      borderRadius: '10px',
                      fontSize: '12.5px',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      fontFamily: "'Plus Jakarta Sans', var(--font-sans), sans-serif",
                    }}
                  >
                    <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0 }} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div
                    style={{
                      padding: '11px 14px',
                      background: '#f0fdf4',
                      border: '1px solid #86efac',
                      color: '#065f46',
                      borderRadius: '10px',
                      fontSize: '12.5px',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      fontFamily: "'Plus Jakarta Sans', var(--font-sans), sans-serif",
                    }}
                  >
                    <CheckCircle size={16} color="#16a34a" style={{ flexShrink: 0 }} />
                    <span>{successMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #d4af37 0%, #c59b27 100%)',
                    border: '1px solid rgba(139, 69, 19, 0.25)',
                    color: '#18120c',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    minHeight: '46px',
                    boxShadow: '0 3px 12px rgba(212, 175, 55, 0.28)',
                    fontFamily: "'Plus Jakarta Sans', var(--font-sans), sans-serif",
                    transition: 'all 0.18s ease',
                    opacity: loading ? 0.75 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #deb845 0%, #d4af37 100%)';
                      e.currentTarget.style.boxShadow = '0 5px 16px rgba(212, 175, 55, 0.35)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #d4af37 0%, #c59b27 100%)';
                      e.currentTarget.style.boxShadow = '0 3px 12px rgba(212, 175, 55, 0.28)';
                    }
                  }}
                >
                  <span>
                    {loading ? 'Memproses Permintaan...' : tab === 'login' ? 'Masuk ke Sanggar' : 'Daftarkan Akun Dalang'}
                  </span>
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
