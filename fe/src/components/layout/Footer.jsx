import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import footerHeritageHd from '../../assets/footer_heritage_hd.jpg';
import { getFooterTeam } from '../../data/master/footerMaster';

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

// ============================================================
// TAHUN SAAT INI (RENDER MURNI REACT 19)
// ============================================================
const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ onNavigate }) {
  const [modalData, setModalData] = useState(null);
  const [teamMembers, setTeamMembers] = useState(getFooterTeam);

  // Sinkronisasi dinamis jika admin mengubah foto atau data tim di Admin CMS
  useEffect(() => {
    const handleSync = () => {
      setTeamMembers(getFooterTeam());
    };
    window.addEventListener('wayangverse_footer_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('wayangverse_footer_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

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
                {teamMembers.map((dev) => (
                  <a
                    key={dev.username || dev.id}
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
                      team: teamMembers,
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
                      team: teamMembers,
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
            style={{ maxWidth: modalData?.team ? '780px' : '560px', width: '100%' }}
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

                {/* Kartu Profil Tim Pengembang / Narahubung Instagram (Format Kartu Showcase Wayang) */}
                {modalData.team && (
                  <div
                    style={{
                      marginTop: '20px',
                      borderTop: '1px solid rgba(212, 175, 55, 0.25)',
                      paddingTop: '18px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '14px',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          color: '#8b4513',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d4af37' }} />
                        <span>Daftar Tim Pengembang & Kreator</span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#6e5e4d', fontStyle: 'italic' }}>
                        Panggung Wayang Kulit Digital
                      </span>
                    </div>

                    {/* Responsive Grid of Compact Showcase Cards (Desain Kartu Wayang Mini) */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                        gap: '16px',
                        alignItems: 'stretch',
                      }}
                    >
                      {modalData.team.map((member) => (
                        <div
                          key={member.username || member.id}
                          className="wayang-team-card"
                          style={{
                            background: '#fcfaf5',
                            border: '1px solid rgba(212, 175, 55, 0.32)',
                            borderRadius: '16px',
                            padding: '14px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: '0 4px 16px rgba(40, 28, 16, 0.06)',
                            position: 'relative',
                            transition: 'all 0.22s ease',
                            boxSizing: 'border-box',
                          }}
                        >
                          {/* Badge Kategori Melayang Sesuai Card Wayang */}
                          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
                            <span
                              style={{
                                background: '#1c140d',
                                color: '#e8bb5c',
                                border: '1px solid rgba(212, 175, 55, 0.35)',
                                padding: '3px 10px',
                                borderRadius: '9999px',
                                fontSize: '9px',
                                fontWeight: '850',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                              }}
                            >
                              {member.badge || 'TIM PENGEMBANG'}
                            </span>
                          </div>

                          {/* Wadah Foto / Avatar Pengembang */}
                          <div
                            style={{
                              width: '100%',
                              height: '135px',
                              borderRadius: '12px',
                              overflow: 'hidden',
                              background: 'radial-gradient(circle at 50% 40%, #2a1c12 0%, #120c08 100%)',
                              border: '1px solid rgba(212, 175, 55, 0.25)',
                              marginBottom: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative',
                            }}
                          >
                            {member.avatar ? (
                              <img
                                src={member.avatar}
                                alt={member.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  objectPosition: 'center top',
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#e8bb5c',
                                  gap: '6px',
                                }}
                              >
                                <div
                                  style={{
                                    width: '46px',
                                    height: '46px',
                                    borderRadius: '50%',
                                    background: 'rgba(212, 175, 55, 0.15)',
                                    border: '1.5px solid rgba(212, 175, 55, 0.45)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '16px',
                                    fontWeight: '800',
                                    color: '#fcfaf2',
                                  }}
                                >
                                  {member.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                </div>
                                <span style={{ fontSize: '10px', color: '#bfae9c', letterSpacing: '0.05em', fontWeight: '700' }}>
                                  KREATOR WAYANG
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Body Informasi Anggota */}
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '14px' }}>
                            <div style={{ fontSize: '10px', color: '#8b4513', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
                              Gelar: {member.role}
                            </div>
                            <h4
                              style={{
                                margin: '0 0 3px 0',
                                fontSize: '14.5px',
                                fontWeight: '850',
                                color: '#1a140e',
                                lineHeight: '1.25',
                              }}
                            >
                              {member.name}
                            </h4>
                            <div style={{ fontSize: '11.5px', color: '#8b5a1b', fontWeight: '700', marginBottom: '6px' }}>
                              @{member.username}
                            </div>
                            <p
                              style={{
                                margin: 0,
                                fontSize: '11px',
                                lineHeight: '1.5',
                                color: '#5c4a3b',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {member.bio || 'Pengembang platform pelestarian wayang kulit digital Nusantara.'}
                            </p>
                          </div>

                          {/* Tombol Aksi Golden Capsule */}
                          <a
                            href={member.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              background: '#c27827',
                              color: '#ffffff',
                              padding: '8px 14px',
                              borderRadius: '9999px',
                              fontSize: '12px',
                              fontWeight: '750',
                              textDecoration: 'none',
                              border: 'none',
                              transition: 'all 0.2s ease',
                              boxSizing: 'border-box',
                              width: '100%',
                            }}
                          >
                            <InstagramIcon />
                            <span>Lihat Instagram</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      ))}
                    </div>
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
