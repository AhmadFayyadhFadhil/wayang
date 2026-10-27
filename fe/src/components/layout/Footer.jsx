import React, { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import footerHeritageHd from '../../assets/footer_heritage_hd.jpg';

// ============================================================
// IKON INSTAGRAM MINIMALIS EMAS (VEKTOR MURNI)
// ============================================================
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// Profil Resmi Tim Pengembang & Kreator Wayangverse
const DEVELOPER_PROFILES = [
  {
    name: 'Ahmad Fayyadh Fadhil',
    role: 'Lead Developer & Software Architect',
    username: 'fadhillllll15',
    url: 'https://www.instagram.com/fadhillllll15?dlrf=cTJ4dGNvbHFtb2t0',
  },
  {
    name: 'Raffi Akbar / Skywalker',
    role: 'UI/UX Designer & Project Lead',
    username: '_.skywalkerr',
    url: 'https://www.instagram.com/_.skywalkerr?cplk=dHE0MGp5MHl5cTkx',
  },
  {
    name: 'Haycell',
    role: 'Frontend & Interactive Audio Engineer',
    username: 'haycell._',
    url: 'https://www.instagram.com/haycell._?rpxt=cDg5dDkwODI3c3Jw',
  },
];

// ============================================================
// TAHUN SAAT INI (RENDER MURNI REACT 19)
// ============================================================
const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ onNavigate }) {
  const [modalData, setModalData] = useState(null);

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

            {/* Tautan Instagram Resmi Tim Pengembang */}
            <div className="wayang-footer-dev-section">
              <div className="wayang-footer-dev-label">
                <InstagramIcon />
                <span>Instagram Tim Pengembang:</span>
              </div>
              <div className="wayang-footer-dev-pills">
                {DEVELOPER_PROFILES.map((dev) => (
                  <a
                    key={dev.username}
                    href={dev.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wayang-footer-dev-pill"
                    title={`Instagram ${dev.name} (@${dev.username})`}
                  >
                    <span>@{dev.username}</span>
                    <ExternalLink size={11} style={{ opacity: 0.7 }} />
                  </a>
                ))}
              </div>
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
                      subtitle: 'Pusat Pelestarian Warisan Pedalangan Digital & Tim Pengembang',
                      content:
                        'Wayangverse lahir dari ikhtiar merawat warisan adiluhung seni wayang kulit Nusantara melalui perpaduan seni tradisi dan rekayasa teknologi web modern. Dikembangkan secara independen oleh tim kreator muda yang berdedikasi menghadirkan panggung pedalangan digital yang dapat dinikmati dan dipelajari oleh seluruh generasi.',
                      team: DEVELOPER_PROFILES,
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
                      subtitle: 'Modernisasi Warisan Budaya & Ruang Kreativitas Lintas Generasi',
                      content:
                        'Wayangverse lahir dari tekad untuk menjembatani warisan adiluhung seni pedalangan Nusantara dengan generasi masa kini. Di era perkembangan teknologi pesat, kami menghadirkan terobosan modernisasi: mengemas pakem wiracarita dan keindahan visual wayang kulit purwa ke dalam kanvas digital interaktif yang memikat daya tarik lintas generasi.\n\nLebih dari sekadar etalase tontonan pasif, Panggung Kelir Virtual kami ciptakan sebagai ruang eksplorasi kreatif tanpa batas—tempat generasi muda dapat bebas berimajinasi, menyusun adegan, memainkan tokoh wayang, dan mengasah daya cipta seni pedalangan secara mandiri demi menjaga kelestarian warisan leluhur bangsa.',
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
                      subtitle: 'Terhubung Langsung dengan Tim Pengembang',
                      content:
                        'Ingin berdiskusi, memberikan apresiasi, masukan pengembangan, atau menjalin kolaborasi edukasi budaya? Silakan sapa dan terhubung langsung dengan tim pengembang Wayangverse melalui Instagram resmi kami:',
                      team: DEVELOPER_PROFILES,
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
                  padding: '20px 22px',
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

                {/* Kartu Profil Tim Pengembang / Narahubung Instagram Interaktif */}
                {modalData.team && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      marginTop: '18px',
                      borderTop: '1px solid rgba(212, 175, 55, 0.2)',
                      paddingTop: '16px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        color: '#8b4513',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        marginBottom: '4px',
                      }}
                    >
                      Daftar Tim Pengembang & Kreator
                    </div>
                    {modalData.team.map((member) => (
                      <div
                        key={member.username}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          background: 'rgba(212, 175, 55, 0.06)',
                          border: '1px solid rgba(212, 175, 55, 0.25)',
                          borderRadius: '10px',
                          gap: '12px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: '750', color: '#1a140e' }}>
                            {member.name}
                          </span>
                          <span style={{ fontSize: '11.5px', color: '#6e5e4d', fontWeight: '600' }}>
                            {member.role}
                          </span>
                        </div>
                        <a
                          href={member.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#1a140e',
                            color: '#e8bb5c',
                            padding: '6px 14px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            fontWeight: '700',
                            textDecoration: 'none',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <InstagramIcon />
                          <span>@{member.username}</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
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
