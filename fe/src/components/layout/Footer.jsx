import React, { useState } from 'react';
import { X } from 'lucide-react';
import footerHeritageHd from '../../assets/footer_heritage_hd.jpg';

// ============================================================
// IKON SOSIAL MEDIA VEKTOR
// ============================================================
const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// ============================================================
// Tahun saat ini dihitung di tingkat modul agar render murni sesuai standar React 19
const CURRENT_YEAR = new Date().getFullYear();

// KOMPONEN UTAMA FOOTER
// ============================================================
export default function Footer({ onNavigate }) {
  const [modalData, setModalData] = useState(null);

  const socialLinks = [
    { name: 'YouTube', icon: <YoutubeIcon />, href: 'https://youtube.com', title: 'Wayangverse YouTube' },
    { name: 'Facebook', icon: <FacebookIcon />, href: 'https://facebook.com', title: 'Wayangverse Facebook' },
    { name: 'Twitter', icon: <TwitterIcon />, href: 'https://twitter.com', title: 'Wayangverse Twitter' },
    { name: 'Instagram', icon: <InstagramIcon />, href: 'https://instagram.com', title: 'Wayangverse Instagram' },
  ];

  return (
    <footer
      style={{
        width: '100%',
        background: '#0d0906',
        color: '#fcfaf2',
        borderTop: 'none',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* ============================================================
          1. LAPISAN DASAR: LATAR BELAKANG ELEGAN ULTRA HD ASLI (TIDAK BURAM)
          ============================================================ */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <img
          src={footerHeritageHd}
          alt="Latar Belakang Budaya Wayangverse HD"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'contrast(1.1) brightness(0.65)',
          }}
        />
        {/* Scrim Peneduh Tengah & Tepi: Menjamin teks dan tautan terbaca sangat tajam */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 95% 85% at 50% 50%, rgba(13, 9, 6, 0.70) 0%, rgba(13, 9, 6, 0.88) 68%, rgba(10, 7, 5, 0.97) 100%)',
          }}
        />
        {/* Hairline Pembatas Emas Halus di Atas Footer */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.35) 50%, transparent 100%)',
          }}
        />
      </div>

      {/* ============================================================
          2. KONTEN UTAMA (Z-INDEX 3 / DI ATAS MOTIF / TIDAK TERTUTUP)
          ============================================================ */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: 'clamp(48px, 6vw, 64px) clamp(16px, 3.5vw, 24px) 36px clamp(16px, 3.5vw, 24px)',
          position: 'relative',
          zIndex: 3,
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        {/* MAIN 4-PART CONTENT (LAYOUT SCREENSHOT PERSIS) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '56px 40px',
          }}
        >
          {/* SISI KIRI: BRAND, ALAMAT, DAN 4 IKON SOSIAL */}
          <div style={{ flex: '1 1 340px', maxWidth: '420px' }}>
            {/* Brand Title: Jangkor. -> Wayangverse. */}
            <div
              onClick={() => onNavigate && onNavigate('home')}
              style={{
                cursor: 'pointer',
                display: 'inline-block',
                marginBottom: '16px',
                userSelect: 'none',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '32px',
                  fontWeight: '850',
                  color: '#fcfaf2',
                  letterSpacing: '-0.6px',
                  fontFamily: 'var(--font-sans)',
                  lineHeight: '1.2',
                }}
              >
                Wayangverse<span style={{ color: '#e8bb5c' }}>.</span>
              </h3>
            </div>

            {/* Address Lines */}
            <div
              style={{
                fontSize: '14.5px',
                lineHeight: '1.7',
                color: '#c4b5a5',
                marginBottom: '44px',
                fontWeight: '450',
              }}
            >
              <div>Jl. Pondok Leungsir Street</div>
              <div>No 491 Village Park</div>
            </div>

            {/* 4 Ikon Media Sosial Melingkar (Bulat Kapsul dengan Border Emas) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.title}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'rgba(28, 20, 13, 0.8)',
                    border: '1px solid rgba(212, 175, 55, 0.18)',
                    color: '#e8bb5c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e8bb5c';
                    e.currentTarget.style.color = '#0d0a07';
                    e.currentTarget.style.borderColor = '#e8bb5c';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(232, 187, 92, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(28, 20, 13, 0.9)';
                    e.currentTarget.style.color = '#e8bb5c';
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.4)';
                  }}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* SISI KANAN: 3 KOLOM TAUTAN (COMPANY, PRODUCT, LEGAL) */}
          <div
            style={{
              flex: '2 1 520px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '40px 32px',
            }}
          >
            {/* Kolom 1: Company */}
            <div>
              <h4
                style={{
                  fontSize: '15.5px',
                  fontWeight: '750',
                  color: '#f5ebd9',
                  letterSpacing: '-0.2px',
                  margin: '0 0 20px 0',
                }}
              >
                Company
              </h4>
              <ul style={footerListStyle}>
                <li>
                  <button
                    onClick={() =>
                      setModalData({
                        title: 'Tentang Wayangverse',
                        subtitle: 'Pusat Pelestarian Warisan Pedalangan Digital',
                        content:
                          'Wayangverse adalah platform digital terintegrasi yang menjembatani naskah pakem klasik pedalangan Nusantara dengan kanvas panggung kelir interaktif dua dimensi dan tata suara gamelan real-time.',
                      })
                    }
                    style={footerLinkBtnStyle}
                    onMouseEnter={handleLinkMouseEnter}
                    onMouseLeave={handleLinkMouseLeave}
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      setModalData({
                        title: 'Kontak Redaksi & Komunitas',
                        subtitle: 'Hubungi Tim Pengembang & Dalang',
                        content:
                          'Surel: redaksi@wayangverse.id\nWhatsApp: +62 812-3456-7890\nStudio: Jl. Pondok Leungsir No. 491, Village Park, Surakarta.',
                      })
                    }
                    style={footerLinkBtnStyle}
                    onMouseEnter={handleLinkMouseEnter}
                    onMouseLeave={handleLinkMouseLeave}
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      setModalData({
                        title: 'Pusat Dukungan Dalang & Edukasi',
                        subtitle: 'Bantuan Pengoperasian Studio & Ensiklopedia',
                        content:
                          'Dapatkan panduan lengkap cara menggerakkan wayang di panggung 2D, memilih gending laras slendro, dan menyusun urutan babak lakon pementasan.',
                      })
                    }
                    style={footerLinkBtnStyle}
                    onMouseEnter={handleLinkMouseEnter}
                    onMouseLeave={handleLinkMouseLeave}
                  >
                    Support
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      setModalData({
                        title: 'Karier & Kontributor Budaya',
                        subtitle: 'Bergabung Bersama Melestarikan Budaya',
                        content:
                          'Kami membuka kesempatan bagi para dalang, pengrawit, peneliti naskah serat purwa, seniman ilustrasi wayang, dan pengembang web untuk berkontribusi melestarikan budaya bangsa.',
                      })
                    }
                    style={footerLinkBtnStyle}
                    onMouseEnter={handleLinkMouseEnter}
                    onMouseLeave={handleLinkMouseLeave}
                  >
                    Career
                  </button>
                </li>
              </ul>
            </div>

            {/* Kolom 2: Product */}
            <div>
              <h4
                style={{
                  fontSize: '15.5px',
                  fontWeight: '750',
                  color: '#f5ebd9',
                  letterSpacing: '-0.2px',
                  margin: '0 0 20px 0',
                }}
              >
                Product
              </h4>
              <ul style={footerListStyle}>
                <li>
                  <button
                    onClick={() => onNavigate && onNavigate('stage')}
                    title="Panggung Virtual 2D Studio Dalang"
                    style={footerLinkBtnStyle}
                    onMouseEnter={handleLinkMouseEnter}
                    onMouseLeave={handleLinkMouseLeave}
                  >
                    New product
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate && onNavigate('atlas')}
                    title="Story & Character Atlas Wayang"
                    style={footerLinkBtnStyle}
                    onMouseEnter={handleLinkMouseEnter}
                    onMouseLeave={handleLinkMouseLeave}
                  >
                    Custom card
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate && onNavigate('stage')}
                    title="Audio Gamelan Slendro Real-time & Naskah"
                    style={footerLinkBtnStyle}
                    onMouseEnter={handleLinkMouseEnter}
                    onMouseLeave={handleLinkMouseLeave}
                  >
                    Printing needs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate && onNavigate('archive')}
                    title="Galeri Karya & Komunitas Wayang"
                    style={footerLinkBtnStyle}
                    onMouseEnter={handleLinkMouseEnter}
                    onMouseLeave={handleLinkMouseLeave}
                  >
                    Interest
                  </button>
                </li>
              </ul>
            </div>

            {/* Kolom 3: Legal */}
            <div>
              <h4
                style={{
                  fontSize: '15.5px',
                  fontWeight: '750',
                  color: '#f5ebd9',
                  letterSpacing: '-0.2px',
                  margin: '0 0 20px 0',
                }}
              >
                Legal
              </h4>
              <ul style={footerListStyle}>
                <li>
                  <button
                    onClick={() =>
                      setModalData({
                        title: 'Syarat & Ketentuan (Terms & Conditions)',
                        subtitle: 'Prinsip Integritas Kultural Wayangverse',
                        content:
                          'Semua visual karakter wayang, naskah serat purwa, dan audio gending pada platform ini dilindungi oleh prinsip Cultural Integrity dan hak cipta keterbukaan pelestarian budaya Nusantara.',
                      })
                    }
                    style={footerLinkBtnStyle}
                    onMouseEnter={handleLinkMouseEnter}
                    onMouseLeave={handleLinkMouseLeave}
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      setModalData({
                        title: 'Kebijakan Privasi (Privacy Policy)',
                        subtitle: 'Perlindungan Data Kreator & Pengguna',
                        content:
                          'Wayangverse menghormati dan melindungi data privasi pengguna serta hak cipta atas rekaman pementasan yang dibuat melalui Studio Dalang 2D.',
                      })
                    }
                    style={footerLinkBtnStyle}
                    onMouseEnter={handleLinkMouseEnter}
                    onMouseLeave={handleLinkMouseLeave}
                  >
                    Privacy policy
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* BILAH HAK CIPTA BAWAH */}
        <div
          style={{
            borderTop: '1px solid rgba(212, 175, 55, 0.16)',
            marginTop: '56px',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '12.5px',
            color: '#9e8c79',
          }}
        >
          <div>
            © {CURRENT_YEAR} <strong style={{ color: '#fcfaf2' }}>Wayangverse</strong>. Dilindungi Hak Cipta. Dedikasi Pelestarian Seni Pedalangan Nusantara.
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span>Pondok Leungsir Park</span>
            <span>•</span>
            <span style={{ color: '#e8bb5c', fontWeight: '600' }}>Memayu Hayuning Bawana</span>
          </div>
        </div>
      </div>

      {/* MODAL DIALOG INFORMASI TAUTAN */}
      {modalData && (
        <div
          className="wayang-modal-backdrop"
          style={{ zIndex: 9999 }}
          onClick={() => setModalData(null)}
        >
          <div
            className="wayang-modal-chassis"
            style={{ maxWidth: '560px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="wayang-modal-inner modal-custom-scroll"
              style={{ padding: '30px 28px' }}
            >
              <div className="wayang-modal-hairline" />

              {/* Header Dialog */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '16px',
                  marginBottom: '20px',
                  borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
                  paddingBottom: '16px',
                }}
              >
                <div>
                  <div className="wayang-modal-eyebrow" style={{ marginBottom: '8px' }}>
                    <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#d4af37' }} />
                    <span>INFORMASI & DOKUMENTASI</span>
                  </div>
                  <h3
                    style={{
                      margin: '0 0 4px 0',
                      fontSize: '22px',
                      fontWeight: '850',
                      color: '#1a140e',
                      fontFamily: 'Cinzel, Georgia, serif',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {modalData.title}
                  </h3>
                  <div style={{ fontSize: '12.5px', color: '#8b4513', fontWeight: '650' }}>
                    {modalData.subtitle}
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Tutup Dialog Informasi"
                  onClick={() => setModalData(null)}
                  className="wayang-modal-close-btn"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Isi Konten */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  marginBottom: '24px',
                  boxShadow: '0 2px 8px rgba(40, 28, 16, 0.04)',
                }}
              >
                <p
                  style={{
                    fontSize: '13.5px',
                    lineHeight: '1.75',
                    color: '#3d2b1f',
                    margin: 0,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {modalData.content}
                </p>
              </div>

              {/* Tombol Aksi */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(212, 175, 55, 0.15)', paddingTop: '18px' }}>
                <button
                  type="button"
                  onClick={() => setModalData(null)}
                  className="wayang-btn-cta"
                >
                  <span>Mengerti & Tutup</span>
                  <span className="wayang-btn-cta-icon">
                    <X size={15} color="#16100a" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

const footerListStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const footerLinkBtnStyle = {
  background: 'none',
  border: 'none',
  padding: '2px 0',
  color: '#bfae9c',
  fontSize: '14px',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.18s ease',
  fontFamily: 'inherit',
  display: 'inline-block',
};

const handleLinkMouseEnter = (e) => {
  e.currentTarget.style.color = '#e8bb5c';
  e.currentTarget.style.transform = 'translateX(2px)';
};

const handleLinkMouseLeave = (e) => {
  e.currentTarget.style.color = '#bfae9c';
  e.currentTarget.style.transform = 'translateX(0)';
};
