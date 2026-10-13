import React from 'react';
import { Film, BookOpen, Music, ShieldCheck, Zap, Layers } from 'lucide-react';
import WayangFigureSvg from '../../components/stage/WayangFigureSvg';
import kelirGununganImg from '../../assets/kelir_gunungan_stage.png';
import gatotkacaOtentikImg from '../../assets/gatotkaca_otentik_cutout.png';
import arjunaOtentikImg from '../../assets/arjuna_otentik_cutout.png';

export default function HomeView({ onNavigate, connectionStatus, onTestConnection }) {
  return (
    <div style={{ width: '100%', color: 'var(--text-main, #fbf8ee)' }}>
      {/* 1. HERO SECTION FULL LAYAR (Edge-to-Edge) */}
      <section
        style={{
          width: '100%',
          minHeight: 'calc(100vh - 65px)',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          background: 'radial-gradient(ellipse at 70% 35%, rgba(212, 175, 55, 0.16) 0%, rgba(139, 69, 19, 0.12) 40%, #0d0a07 80%)',
          borderBottom: '1px solid #362619',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
          padding: '60px 0',
        }}
      >
        {/* Blencong Glow Effect Background */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            right: '15%',
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, rgba(139, 69, 19, 0.08) 50%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        {/* Content Container (Center, generous max width) */}
        <div
          style={{
            maxWidth: '1280px',
            width: '100%',
            margin: '0 auto',
            padding: '0 24px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '40px',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Typography & CTAs */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  padding: '5px 14px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#e5c158',
                  letterSpacing: '0.5px',
                  marginBottom: '18px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                PLATFORM DIGITALISASI SENI & FILOSOFI WAYANG
              </div>

              <h1
                style={{
                  margin: '0 0 16px 0',
                  fontSize: 'clamp(32px, 4.2vw, 50px)',
                  fontWeight: '800',
                  color: '#fcfaf2',
                  lineHeight: '1.2',
                  letterSpacing: '-0.5px',
                }}
              >
                Ubah Penonton Menjadi{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #fce588, #d4af37, #b48a28)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                  }}
                >
                  Dalang Digital
                </span>
              </h1>

              <p
                style={{
                  margin: '0 0 28px 0',
                  fontSize: '15px',
                  color: '#bfae9c',
                  lineHeight: '1.7',
                  maxWidth: '540px',
                }}
              >
                <strong style={{ color: '#e5c158' }}>Wayangverse</strong> menghadirkan kearifan pewayangan ke ruang modern. Rancang adegan di atas kelir 2D interaktif, kendalikan iringan gamelan dinamis, serta hubungkan karya kreatif dengan pakem dan naskah tradisi.
              </p>

              {/* Call-to-Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                <button
                  onClick={() => onNavigate('stage')}
                  style={{
                    background: 'linear-gradient(135deg, #8b4513, #5c2c10)',
                    border: '1px solid #d4af37',
                    color: '#fcf6e8',
                    padding: '13px 28px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 6px 20px rgba(139, 69, 19, 0.45)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Film size={16} /> Buka Panggung Virtual
                </button>

                <button
                  onClick={() => onNavigate('atlas')}
                  style={{
                    background: 'rgba(34, 26, 19, 0.85)',
                    border: '1px solid #5a3b22',
                    color: '#fcf6e8',
                    padding: '13px 24px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <BookOpen size={16} /> Jelajahi Story Atlas
                </button>
              </div>
            </div>

            {/* Right Column: Authentic Wayang Kulit Kelir Stage Preview */}
            <div
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1.5px solid rgba(212, 175, 55, 0.65)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.92), 0 0 40px rgba(212, 175, 55, 0.28)',
                minHeight: '320px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                background: '#120e0a',
              }}
            >
              {/* Layer 1: Gunungan Kelir Stage Background (Foto Asli Gunungan Tradisi dari User) */}
              <img
                src={kelirGununganImg}
                alt="Kelir Gunungan Tradisi"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.92,
                  filter: 'contrast(1.08) brightness(0.92)',
                }}
              />

              {/* Layer 2: Blencong Warm Light Radial Vignette Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse at 50% 30%, rgba(212, 175, 55, 0.32) 0%, rgba(13, 10, 7, 0.58) 82%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Layer 3: Tokoh Wayang Kulit Otentik (Gambar Asli Tatah Sungging Beranimasi Hidup) */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0 20px 22px 20px',
                }}
              >
                {/* Raden Gatotkaca Asli */}
                <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img
                    src={gatotkacaOtentikImg}
                    alt="Raden Gatotkaca Asli"
                    className="wayang-living-sway-left"
                    style={{
                      maxHeight: '235px',
                      width: 'auto',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 12px 18px rgba(0,0,0,0.9)) drop-shadow(0 0 10px rgba(212, 175, 55, 0.25))',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                    }}
                    title="Raden Gatotkaca — Satria Pringgandani"
                  />
                  <div style={{ fontSize: '11px', color: '#e5c158', fontWeight: '700', marginTop: '6px', textShadow: '0 2px 4px rgba(0,0,0,0.95)' }}>
                    Raden Gatotkaca
                  </div>
                </div>

                {/* Raden Arjuna & Adipati Karna Asli */}
                <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img
                    src={arjunaOtentikImg}
                    alt="Raden Arjuna Asli"
                    className="wayang-living-sway-right"
                    style={{
                      maxHeight: '235px',
                      width: 'auto',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 12px 18px rgba(0,0,0,0.9)) drop-shadow(0 0 10px rgba(212, 175, 55, 0.25))',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                    }}
                    title="Raden Arjuna & Adipati Karna — Satria Pinilih"
                  />
                  <div style={{ fontSize: '11px', color: '#fb923c', fontWeight: '700', marginTop: '6px', textShadow: '0 2px 4px rgba(0,0,0,0.95)' }}>
                    Raden Arjuna & Karna
                  </div>
                </div>
              </div>

              {/* Layer 4: Tag Penjelas Kelir Otentik */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 5,
                  background: 'rgba(13, 10, 7, 0.88)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(212, 175, 55, 0.45)',
                  padding: '4px 16px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  color: '#e5c158',
                  fontWeight: '700',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.7)',
                }}
              >
                Kelir Purwa Otentik • Tatah Sungging Asli
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KONTEN LANJUTAN: EMPAT PILAR KEUNGGULAN (Terpusat, MaxWidth 1200px) */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 24px 40px 24px' }}>
        <section style={{ marginBottom: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#d4af37', fontWeight: '700', padding: '3px 10px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '20px', border: '1px solid rgba(212, 175, 55, 0.25)' }}>
              Filosofi & Keunggulan
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#fcfaf2', margin: '10px 0 8px 0', letterSpacing: '-0.3px' }}>
              Empat Pilar Pelestarian Digital
            </h2>
            <p style={{ fontSize: '14px', color: '#bfae9c', maxWidth: '620px', margin: '0 auto', lineHeight: '1.6' }}>
              Memadukan estetika adiluhung seni pedalangan klasik dengan teknologi komputasi interaktif web modern.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div style={featureCardStyle}>
              <div style={{ ...featureIconBox, background: 'rgba(212, 175, 55, 0.12)', border: '1px solid rgba(212, 175, 55, 0.3)', color: '#d4af37' }}>
                <Zap size={18} />
              </div>
              <h3 style={featureTitleStyle}>Cipta Karsa Interaktif</h3>
              <p style={featureDescStyle}>
                Bukan sekadar membaca. Pengguna memegang kendali penuh atas gerak, tancep, laga, dan dialog tokoh wayang di atas kelir digital.
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={{ ...featureIconBox, background: 'rgba(139, 69, 19, 0.25)', border: '1px solid rgba(212, 175, 55, 0.25)', color: '#e5c158' }}>
                <ShieldCheck size={18} />
              </div>
              <h3 style={featureTitleStyle}>Integritas Pakem Tradisi</h3>
              <p style={featureDescStyle}>
                Menjunjung tinggi keaslian sanad naskah rujukan bersejarah (seperti Kakawin Bharatayuddha dan Serat Purwa) yang terkurasi transparan.
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={{ ...featureIconBox, background: 'rgba(160, 82, 45, 0.22)', border: '1px solid rgba(160, 82, 45, 0.4)', color: '#d97706' }}>
                <Layers size={18} />
              </div>
              <h3 style={featureTitleStyle}>Jalinan Makna & Filosofi</h3>
              <p style={featureDescStyle}>
                Setiap karya pagelaran bertaut langsung dengan filosofi watak tokoh dan lakon induk sumbernya (*Connected by Design*).
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={{ ...featureIconBox, background: 'rgba(212, 175, 55, 0.12)', border: '1px solid rgba(212, 175, 55, 0.3)', color: '#d4af37' }}>
                <Music size={18} />
              </div>
              <h3 style={featureTitleStyle}>Tata Suara Gamelan Asli</h3>
              <p style={featureDescStyle}>
                Laras slendro, dodogan cempala dalang, kepyak logam, dan gong ageng disintesis langsung di peramban tanpa latensi.
              </p>
            </div>
          </div>
        </section>

        {/* Aksara Jawa & Kutipan Luhur */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1c140d, #120e0a)',
            border: '1px solid #362619',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontSize: '13px', color: '#d4af37', fontWeight: '700', fontStyle: 'italic', letterSpacing: '0.04em', marginBottom: '6px' }}>
            "Memayu Hayuning Bawana, Ambrasta Dur Hangkara"
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#bfae9c' }}>
            Memperindah kelestarian semesta dan menundukkan angkara murka melalui keluhuran seni budaya Nusantara.
          </p>
        </div>
      </div>
    </div>
  );
}

const featureCardStyle = {
  background: '#15100c',
  border: '1px solid #362619',
  borderRadius: '16px',
  padding: '22px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
};

const featureIconBox = {
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const featureTitleStyle = {
  margin: 0,
  fontSize: '15px',
  fontWeight: '700',
  color: '#fcfaf2',
};

const featureDescStyle = {
  margin: 0,
  fontSize: '12px',
  color: '#bfae9c',
  lineHeight: '1.6',
};
