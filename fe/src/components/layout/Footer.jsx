import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Eye, Play } from 'lucide-react';
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
            style={{ maxWidth: modalData?.team ? '880px' : '560px', width: '100%' }}
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

                    {/* Responsive Grid of Compact Showcase Cards (Desain Persis Kartu Tokoh & Karakter Wayang) */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                        gap: '18px',
                        alignItems: 'stretch',
                      }}
                    >
                      {modalData.team.map((member) => (
                        <div
                          key={member.username || member.id}
                          className="wayang-team-card"
                          style={{
                            background: '#ffffff',
                            borderRadius: '22px',
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            boxShadow: '0 4px 18px rgba(40, 28, 16, 0.06)',
                            padding: '16px 16px 18px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            position: 'relative',
                            overflow: 'hidden',
                            boxSizing: 'border-box',
                            transition: 'all 0.25s ease',
                          }}
                        >
                          {/* Wadah Gambar / Foto Tokoh & Badge Melayang */}
                          <div
                            style={{
                              position: 'relative',
                              width: '100%',
                              height: '180px',
                              borderRadius: '16px',
                              overflow: 'hidden',
                              background: '#140e09',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: '14px',
                              flexShrink: 0,
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
                                  objectPosition: 'center 20%',
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
                                  gap: '8px',
                                }}
                              >
                                <div
                                  style={{
                                    width: '52px',
                                    height: '52px',
                                    borderRadius: '50%',
                                    background: 'rgba(212, 175, 55, 0.15)',
                                    border: '1.5px solid rgba(212, 175, 55, 0.45)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '18px',
                                    fontWeight: '800',
                                    color: '#fcfaf2',
                                  }}
                                >
                                  {member.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                </div>
                                <span style={{ fontSize: '10px', color: '#bfae9c', letterSpacing: '0.08em', fontWeight: '800' }}>
                                  KREATOR WAYANG
                                </span>
                              </div>
                            )}

                            {/* Badge Kategori Melayang Persis di Pojok Kiri Atas Foto */}
                            <div
                              style={{
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                zIndex: 5,
                                background: 'rgba(255, 255, 255, 0.94)',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                borderRadius: '9999px',
                                padding: '4px 12px',
                                fontSize: '9.5px',
                                fontWeight: '800',
                                color: '#1a140e',
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                                pointerEvents: 'none',
                              }}
                            >
                              <span>{member.badge || 'TIM PENGEMBANG'}</span>
                            </div>

                            {/* Gradient Penyeimbang Visual di Bawah Foto */}
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 65%, rgba(20, 14, 9, 0.35) 100%)',
                                pointerEvents: 'none',
                              }}
                            />
                          </div>

                          {/* Konten / Keterangan Tokoh & Meta */}
                          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                            {/* Gelar & Pusaka Luhur */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '8px', fontSize: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ color: '#8b5a1b', fontWeight: '750', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.03em', flexShrink: 0 }}>
                                  Gelar:
                                </span>
                                <span style={{ color: '#2b2118', fontWeight: '600', fontSize: '11.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={member.role}>
                                  {member.role || '-'}
                                </span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ color: '#8b5a1b', fontWeight: '750', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.03em', flexShrink: 0 }}>
                                  Pusaka:
                                </span>
                                <span style={{ color: '#2b2118', fontWeight: '600', fontSize: '11.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={`@${member.username}`}>
                                  @{member.username || '-'}
                                </span>
                              </div>
                            </div>

                            {/* Nama Tokoh / Developer */}
                            <h3
                              style={{
                                margin: '0 0 6px 0',
                                fontSize: '17.5px',
                                fontWeight: '800',
                                color: '#1a140e',
                                letterSpacing: '-0.3px',
                                lineHeight: '1.25',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                              title={member.name}
                            >
                              {member.name}
                            </h3>

                            {/* Deskripsi Singkat */}
                            <p
                              style={{
                                margin: '0 0 14px 0',
                                fontSize: '12px',
                                color: '#6b7280',
                                lineHeight: '1.55',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                height: '38px',
                              }}
                              title={member.bio}
                            >
                              {member.bio || 'Tokoh pewayangan legendaris wiracarita digital Nusantara.'}
                            </p>

                            {/* Dua Tombol Aksi Kapsul Persis Seperti Card Tokoh Wayang (Profil & Pose + Mainkan) */}
                            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                              <a
                                href={member.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  flex: 1,
                                  background: 'var(--canvas, #f7f4eb)',
                                  border: '1px solid rgba(212, 175, 55, 0.45)',
                                  color: '#1a140e',
                                  padding: '9px 10px',
                                  borderRadius: '9999px',
                                  fontSize: '11.5px',
                                  fontWeight: '750',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  minHeight: '38px',
                                  textDecoration: 'none',
                                  boxSizing: 'border-box',
                                  transition: 'all 0.2s ease',
                                  whiteSpace: 'nowrap',
                                }}
                                title={`Buka Profil ${member.name}`}
                              >
                                <Eye size={14} style={{ marginRight: '5px' }} />
                                <span>Profil & Pose</span>
                              </a>

                              <a
                                href={member.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  flex: 1,
                                  background: '#e8bb5c',
                                  border: 'none',
                                  color: '#0d0a07',
                                  padding: '9px 10px',
                                  borderRadius: '9999px',
                                  fontSize: '11.5px',
                                  fontWeight: '750',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  minHeight: '38px',
                                  textDecoration: 'none',
                                  boxSizing: 'border-box',
                                  transition: 'all 0.2s ease',
                                  whiteSpace: 'nowrap',
                                }}
                                title={`Mainkan Tokoh ${member.name} / Kunjungi Instagram`}
                              >
                                <Play size={13} fill="#0d0a07" style={{ marginRight: '5px' }} />
                                <span>Mainkan</span>
                              </a>
                            </div>
                          </div>
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
