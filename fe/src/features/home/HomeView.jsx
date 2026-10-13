import React from 'react';
import { Film, BookOpen, Music, ShieldCheck, Zap, Layers } from 'lucide-react';
import WayangFigureSvg from '../../components/stage/WayangFigureSvg';

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

            {/* Right Column: Interactive Kelir Stage Preview */}
            <div
              style={{
                background: 'radial-gradient(ellipse at 50% 35%, rgba(212, 175, 55, 0.22) 0%, rgba(21, 16, 12, 0.96) 72%)',
                border: '1px solid #8b4513',
                borderRadius: '20px',
                padding: '24px 20px 16px 20px',
                position: 'relative',
                boxShadow: '0 20px 60px rgba(0,0,0,0.85), 0 0 35px rgba(212, 175, 55, 0.18)',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'flex-end',
                minHeight: '280px',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <WayangFigureSvg slug="gatotkaca" scale={0.85} width={135} height={200} accentColor="#e5c158" />
                <div style={{ fontSize: '11px', color: '#e5c158', fontWeight: '700', marginTop: '6px' }}>
                  Raden Gatotkaca
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <WayangFigureSvg slug="karna" pose="perang" facing="left" scale={0.85} width={135} height={200} accentColor="#f97316" />
                <div style={{ fontSize: '11px', color: '#fb923c', fontWeight: '700', marginTop: '6px' }}>
                  Adipati Karna
                </div>
              </div>

              {/* Tag Penjelas Kelir */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(13, 10, 7, 0.85)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  padding: '4px 14px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  color: '#bfae9c',
                  whiteSpace: 'nowrap',
                }}
              >
                Kelir 2D Vektor • Interaktif di Studio
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KONTEN LANJUTAN: PILAR & STATUS (Terpusat, MaxWidth 1200px) */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 24px 24px' }}>
        {/* FITUR UNGGULAN & PRINSIP PRODUK */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fcfaf2', marginBottom: '20px' }}>
            Pilar & Keunggulan Platform
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '18px' }}>
            <div style={featureCardStyle}>
              <div style={{ ...featureIconBox, background: '#451a03', color: '#e5c158' }}>
                <Zap size={18} />
              </div>
              <h3 style={featureTitleStyle}>Experience First</h3>
              <p style={featureDescStyle}>
                Bukan sekadar membaca teks. Pengguna mengendalikan posisi tokoh wayang, pose laga, dan dialog secara langsung di atas kelir digital.
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={{ ...featureIconBox, background: '#1c281e', color: '#6ee7b7' }}>
                <ShieldCheck size={18} />
              </div>
              <h3 style={featureTitleStyle}>Cultural Integrity</h3>
              <p style={featureDescStyle}>
                Menjaga keaslian pakem tradisi melalui naskah rujukan budaya yang terkurasi dan transparan bagi setiap lakon wiracarita.
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={{ ...featureIconBox, background: '#182635', color: '#7dd3fc' }}>
                <Layers size={18} />
              </div>
              <h3 style={featureTitleStyle}>Connected by Design</h3>
              <p style={featureDescStyle}>
                Setiap pertunjukan yang tersimpan menautkan tokoh dan cerita sumber, sehingga pengunjung dapat menelusuri filosofi di balik adegan.
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={{ ...featureIconBox, background: '#351829', color: '#f472b6' }}>
                <Music size={18} />
              </div>
              <h3 style={featureTitleStyle}>Soundscape Realtime</h3>
              <p style={featureDescStyle}>
                Gamelan laras slendro, efek dodogan cempala dalang, kepyak logam, dan gong ageng disintesis langsung di peramban web tanpa delay.
              </p>
            </div>
          </div>
        </section>

        {/* STATUS KONEKSI BACKEND & DATABASE */}
        <section
          style={{
            background: '#15100c',
            border: '1px solid #362619',
            borderRadius: '16px',
            padding: '18px 24px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '700', color: '#fcfaf2' }}>
                Integrasi REST API & Database
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#bfae9c' }}>
                Backend Laravel 12 & MySQL aktif. Frontend mendukung mekanisme cache lokal secara otomatis.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontSize: '11px',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: connectionStatus?.connected ? '#1c281e' : '#261b12',
                  color: connectionStatus?.connected ? '#6ee7b7' : '#d4af37',
                  border: `1px solid ${connectionStatus?.connected ? '#2d5a37' : '#5a3b22'}`,
                  fontWeight: '600',
                }}
              >
                {connectionStatus?.connected ? 'Backend Terhubung' : 'Mode Offline Aktif'}
              </span>

              <button
                onClick={onTestConnection}
                style={{
                  background: '#261b12',
                  border: '1px solid #5a3b22',
                  color: '#fcfaf2',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Cek Ulang
              </button>
            </div>
          </div>
        </section>
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
