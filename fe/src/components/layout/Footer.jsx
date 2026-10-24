import React, { useState } from 'react';
import { X } from 'lucide-react';
import footerHeritageHd from '../../assets/footer_heritage_hd.jpg';

// ============================================================
// IKON SOSIAL MEDIA MINIMALIS EMAS (VEKTOR MURNI TANPA LINGKARAN KLISE)
// ============================================================
const YoutubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

// Ikon X modern (menggantikan ikon Twitter burung lama)
const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// ============================================================
// TAHUN SAAT INI (RENDER MURNI REACT 19)
// ============================================================
const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ onNavigate }) {
  const [modalData, setModalData] = useState(null);

  const socialLinks = [
    { name: 'YouTube', icon: <YoutubeIcon />, href: 'https://youtube.com', title: 'Saluran YouTube Wayangverse' },
    { name: 'Facebook', icon: <FacebookIcon />, href: 'https://facebook.com', title: 'Laman Facebook Wayangverse' },
    { name: 'X', icon: <XIcon />, href: 'https://x.com', title: 'Akun Resmi X Wayangverse' },
    { name: 'Instagram', icon: <InstagramIcon />, href: 'https://instagram.com', title: 'Instagram @wayangverse' },
  ];

  return (
    <footer className="wayang-footer-root">
      {/* 1. Latar Belakang Heritage HD dengan Overlay Kontras Alami */}
      <div className="wayang-footer-bg-wrapper" aria-hidden="true">
        <img
          src={footerHeritageHd}
          alt="Latar Belakang Budaya Wayangverse HD"
          className="wayang-footer-bg-img"
        />
        <div className="wayang-footer-bg-scrim" />
        <div className="wayang-footer-top-specular" />
      </div>

      {/* 2. Konten Utama Footer */}
      <div className="wayang-footer-container" data-aos="fade-up" data-aos-duration="700">
        {/* Layout Asimetris (Brand 1.6fr : Kolom Link 1fr : 1fr : 0.9fr) */}
        <div className="wayang-footer-main-grid">
          {/* Kolom 1: Identitas Brand & Alamat Riil */}
          <div className="wayang-footer-brand-col">
            <div
              onClick={() => onNavigate && onNavigate('home')}
              className="wayang-footer-brand-header"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  if (onNavigate) onNavigate('home');
                }
              }}
            >
              <h3 className="wayang-footer-brand-title">
                Wayang<span style={{ color: '#e8bb5c' }}>verse.</span>
              </h3>
            </div>

            {/* Misi Kultural Humanis */}
            <p className="wayang-footer-mission-text">
              Merawat wayang lewat karya yang bisa dibawa pulang — melestarikan seni pedalangan Nusantara ke dalam kanvas digital interaktif dan arsip wiracarita adiluhung.
            </p>

            {/* Format Alamat Riil Rapi (Dapat Disesuaikan Pengguna) */}
            <div className="wayang-footer-address-block">
              <div className="wayang-footer-address-name">Studio & Galeri Wayangverse</div>
              <div className="wayang-footer-address-street">Jl. Slamet Riyadi No. 284, Sriwedari, Laweyan</div>
              <div className="wayang-footer-address-city">Surakarta, Jawa Tengah 57141, Indonesia</div>
            </div>

            {/* Ikon Sosial Emas Minimalis (Vektor Murni Tanpa Lingkaran Klise) */}
            <div className="wayang-footer-social-row">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.title}
                  className="wayang-footer-social-link"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Kolom 2: Jelajah Warisan */}
          <div className="wayang-footer-link-col">
            <h4 className="wayang-footer-col-heading">Jelajah</h4>
            <ul className="wayang-footer-link-list">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('atlas')}
                  className="wayang-footer-link-btn"
                >
                  Koleksi Wayang
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('atlas')}
                  className="wayang-footer-link-btn"
                >
                  Tokoh & Lakon
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('stage')}
                  className="wayang-footer-link-btn"
                >
                  Panggung Kelir
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('archive')}
                  className="wayang-footer-link-btn"
                >
                  Galeri Pementasan
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Wayangverse */}
          <div className="wayang-footer-link-col">
            <h4 className="wayang-footer-col-heading">Wayangverse</h4>
            <ul className="wayang-footer-link-list">
              <li>
                <button
                  type="button"
                  onClick={() =>
                    setModalData({
                      title: 'Tentang Kami',
                      subtitle: 'Pusat Pelestarian Warisan Pedalangan Digital',
                      content:
                        'Wayangverse lahir dari ikhtiar merawat warisan adiluhung seni wayang kulit Nusantara. Melalui kanvas kelir digital interaktif, ensiklopedia lakon serat klasik, dan soundscape gamelan prosedural real-time, kami menghadirkan panggung pedalangan yang dapat dinikmati generasi muda di mana pun berada.',
                    })
                  }
                  className="wayang-footer-link-btn"
                >
                  Tentang Kami
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    setModalData({
                      title: 'Cerita di Balik Karya',
                      subtitle: 'Dari Tatah Sungging Kulit Kerbau ke Kanvas Digital',
                      content:
                        'Setiap tokoh wayang digital di Wayangverse digambar berdasarkan pakem gagrag Surakarta dan Yogyakarta. Kami mendokumentasikan detail tatah sungging, anatomi proporsi karakter (satria, raseksa, pamong), serta filosofi warna muka untuk menjamin keaslian budaya tetap terjaga.',
                    })
                  }
                  className="wayang-footer-link-btn"
                >
                  Cerita di Balik Karya
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    setModalData({
                      title: 'Pesan Kartu Khusus',
                      subtitle: 'Koleksi Kartu Fisik & Kolaborasi Komunitas',
                      content:
                        'Bagi kurator, pendidik, dan pegiat seni yang memerlukan kartu fisik wayang beraksen prada emas kencana atau integrasi panggung untuk pagelaran edukasi budaya, silakan berdiskusi langsung dengan tim redaksi kami.',
                    })
                  }
                  className="wayang-footer-link-btn"
                >
                  Pesan Kartu Khusus
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    setModalData({
                      title: 'Hubungi Kami',
                      subtitle: 'Redaksi, Sanggar & Komunitas Pedalangan',
                      content:
                        'Surel: redaksi@wayangverse.id\nNarahubung: +62 812-2849-5714\nSanggar: Jl. Slamet Riyadi No. 284, Sriwedari, Surakarta, Jawa Tengah.',
                    })
                  }
                  className="wayang-footer-link-btn"
                >
                  Hubungi Kami
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Bantuan & Pakem */}
          <div className="wayang-footer-link-col">
            <h4 className="wayang-footer-col-heading">Bantuan</h4>
            <ul className="wayang-footer-link-list">
              <li>
                <button
                  type="button"
                  onClick={() =>
                    setModalData({
                      title: 'Syarat & Ketentuan',
                      subtitle: 'Integritas Kultural & Hak Cipta Terbuka',
                      content:
                        'Seluruh aset visual tokoh wayang dan rekaman lakon di Wayangverse dilindungi di bawah prinsip keterbukaan pelestarian budaya. Karya pementasan yang dibuat melalui Studio Dalang 2D dapat digunakan untuk tujuan edukasi, apresiasi seni, dan riset kebudayaan non-komersial.',
                    })
                  }
                  className="wayang-footer-link-btn"
                >
                  Syarat & Ketentuan
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    setModalData({
                      title: 'Kebijakan Privasi',
                      subtitle: 'Perlindungan Data Kreator & Pengguna',
                      content:
                        'Wayangverse menghormati privasi Anda. Data pagelaran lokal yang tersimpan di perangkat Anda dijamin keamanannya dan tidak diperjualbelikan kepada pihak ketiga mana pun.',
                    })
                  }
                  className="wayang-footer-link-btn"
                >
                  Kebijakan Privasi
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    setModalData({
                      title: 'Integritas Pakem Pedalangan',
                      subtitle: 'Sanad Wiracarita & Tata Bahasa Jawa',
                      content:
                        'Wayangverse berpegang teguh pada naskah pakem klasik seperti Serat Baratayuda, Ramayana Balai Pustaka, dan Serat Dewa Ruci Radyapustaka demi menjaga kehormatan nilai filosofis pitutur luhur para leluhur Nusantara.',
                    })
                  }
                  className="wayang-footer-link-btn"
                >
                  Integritas Pakem
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Divider Ornamen Gunungan / Kayon SVG Inline (Detail Buatan Tangan) */}
        <div className="wayang-footer-gunungan-divider" aria-hidden="true">
          <div className="wayang-footer-divider-hairline" />
          <div className="wayang-footer-gunungan-symbol">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              {/* Siluet Kayon / Gunungan Wayang */}
              <path
                d="M16 2C16 2 25 12 25 21C25 26 21 29 16 29C11 29 7 26 7 21C7 12 16 2 16 2Z"
                fill="rgba(212, 175, 55, 0.16)"
                stroke="#d4af37"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* Pohon Hayat / Batang Mandira */}
              <path
                d="M16 10V27M13 16L16 13L19 16M11 21L16 17L21 21"
                stroke="#e8bb5c"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
              {/* Pucuk Mustika Kencana */}
              <circle cx="16" cy="6" r="1.5" fill="#fcfaf2" />
            </svg>
          </div>
          <div className="wayang-footer-divider-hairline" />
        </div>

        {/* 4. Bilah Hak Cipta & Tagline Budaya Manusiawi */}
        <div className="wayang-footer-bottom-row">
          <div className="wayang-footer-copyright-text">
            © {CURRENT_YEAR} <strong>Wayangverse</strong>. Dibuat dengan hormat untuk seni pedalangan Nusantara.
          </div>
          <div className="wayang-footer-tagline-block">
            <span className="wayang-footer-javanese-script" title="Memayu Hayuning Bawana">
              ꦩꦺꦩꦪꦸꦲꦪꦸꦤꦶꦁꦧꦮꦤ
            </span>
            <span className="wayang-footer-tagline-bullet">•</span>
            <span className="wayang-footer-tagline-latin">
              Memayu Hayuning Bawana
            </span>
          </div>
        </div>
      </div>

      {/* 5. Modal Dialog Informasi Kuratorial */}
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
                    <span>DOKUMENTASI & INFORMASI</span>
                  </div>
                  <h3
                    style={{
                      margin: '0 0 4px 0',
                      fontSize: '22px',
                      fontWeight: '800',
                      color: '#1a140e',
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: '-0.02em',
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
                  <span>Tutup</span>
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
