import React from 'react';
import { Film, BookOpen, Sparkles, Music, ShieldCheck, Zap, Layers } from 'lucide-react';
import WayangFigureSvg from '../../components/stage/WayangFigureSvg';

export default function HomeView({ onNavigate, connectionStatus, onTestConnection }) {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px', color: '#f3f4f6' }}>
      {/* 1. HERO SECTION */}
      <section
        style={{
          position: 'relative',
          background: 'linear-gradient(145deg, #1f140d 0%, #110e17 50%, #0b0910 100%)',
          borderRadius: '24px',
          padding: '40px 28px',
          border: '2px solid #78350f',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(217, 119, 6, 0.25)',
          overflow: 'hidden',
          marginBottom: '32px',
        }}
      >
        {/* Blencong Glow Effect */}
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            right: '10%',
            width: '260px',
            height: '260px',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)',
            filter: 'blur(30px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'center' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '600',
                color: '#f59e0b',
                marginBottom: '14px',
              }}
            >
              Platform Digitalisasi Seni & Filosofi Wayang
            </div>

            <h1
              style={{
                margin: '0 0 14px 0',
                fontSize: '34px',
                fontWeight: '800',
                color: '#fef3c7',
                lineHeight: '1.25',
                letterSpacing: '-0.5px',
              }}
            >
              Ubah Penonton Menjadi <span style={{ color: '#f59e0b' }}>Dalang Digital</span>
            </h1>

            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#d1d5db', lineHeight: '1.6', maxWidth: '500px' }}>
              <strong>Wayangverse</strong> menghadirkan kearifan pewayangan ke ruang modern. Rancang adegan di atas kelir 2D interaktif, kendalikan iringan gamelan dinamis, serta hubungkan karya kreatif dengan pakem dan naskah tradisi.
            </p>

            {/* Tombol Call-to-Action Utama */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <button
                onClick={() => onNavigate('stage')}
                style={{
                  background: 'linear-gradient(135deg, #d97706, #b45309)',
                  border: 'none',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
                }}
              >
                <Film size={16} /> Buka Panggung Virtual
              </button>

              <button
                onClick={() => onNavigate('atlas')}
                style={{
                  background: '#241e2f',
                  border: '1px solid #48395e',
                  color: '#fef3c7',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <BookOpen size={16} /> Jelajahi Story Atlas
              </button>
            </div>
          </div>

          {/* Mini Interactive Preview Stage (Gatotkaca vs Karna) */}
          <div
            style={{
              background: 'radial-gradient(ellipse at 50% 30%, rgba(245, 158, 11, 0.2) 0%, #15111b 70%)',
              border: '1px solid #4a3828',
              borderRadius: '16px',
              padding: '20px',
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'flex-end',
              minHeight: '220px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <WayangFigureSvg slug="gatotkaca" scale={0.7} width={120} height={180} accentColor="#eab308" />
              <div style={{ fontSize: '11px', color: '#facc15', fontWeight: '600', marginTop: '4px' }}>
                Raden Gatotkaca
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <WayangFigureSvg slug="karna" pose="perang" facing="left" scale={0.7} width={120} height={180} accentColor="#f97316" />
              <div style={{ fontSize: '11px', color: '#fb923c', fontWeight: '600', marginTop: '4px' }}>
                Adipati Karna
              </div>
            </div>

            {/* Tag Penjelas */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.7)',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '10px',
                color: '#d4d4d8',
                whiteSpace: 'nowrap',
              }}
            >
              Kelir 2D Vektor • Interaktif di Studio
            </div>
          </div>
        </div>
      </section>

      {/* 2. FITUR UNGGULAN & PRINSIP PRODUK (PRD BAB 1.3) */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fef3c7', marginBottom: '16px' }}>
          Pilar & Keunggulan Platform
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={featureCardStyle}>
            <div style={{ ...featureIconBox, background: '#78350f', color: '#f59e0b' }}>
              <Zap size={18} />
            </div>
            <h3 style={featureTitleStyle}>Experience First</h3>
            <p style={featureDescStyle}>
              Bukan sekadar membaca teks. Pengguna mengendalikan posisi tokoh wayang, pose laga, dan dialog secara langsung di atas kelir digital.
            </p>
          </div>

          <div style={featureCardStyle}>
            <div style={{ ...featureIconBox, background: '#064e3b', color: '#34d399' }}>
              <ShieldCheck size={18} />
            </div>
            <h3 style={featureTitleStyle}>Cultural Integrity</h3>
            <p style={featureDescStyle}>
              Menjaga keaslian pakem tradisi melalui naskah rujukan budaya yang terkurasi dan transparan bagi setiap lakon wiracarita.
            </p>
          </div>

          <div style={featureCardStyle}>
            <div style={{ ...featureIconBox, background: '#1e3a5f', color: '#38bdf8' }}>
              <Layers size={18} />
            </div>
            <h3 style={featureTitleStyle}>Connected by Design</h3>
            <p style={featureDescStyle}>
              Setiap pertunjukan yang tersimpan menautkan tokoh dan cerita sumber, sehingga pengunjung dapat menelusuri filosofi di balik adegan.
            </p>
          </div>

          <div style={featureCardStyle}>
            <div style={{ ...featureIconBox, background: '#4a044e', color: '#f472b6' }}>
              <Music size={18} />
            </div>
            <h3 style={featureTitleStyle}>Soundscape Realtime</h3>
            <p style={featureDescStyle}>
              Gamelan laras slendro, efek dodogan cempala dalang, kepyak logam, dan gong ageng disintesis langsung di peramban web tanpa delay.
            </p>
          </div>
        </div>
      </section>

      {/* 3. STATUS KONEKSI BACKEND & DATABASE */}
      <section
        style={{
          background: '#16141d',
          border: '1px solid #2e263d',
          borderRadius: '14px',
          padding: '16px 20px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#fef3c7' }}>
              Integrasi REST API & Database
            </h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
              Backend Laravel 12 & MySQL aktif. Frontend mendukung mekanisme cache lokal secara otomatis.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: connectionStatus?.connected ? '#064e3b' : '#27272a',
                color: connectionStatus?.connected ? '#34d399' : '#d1d5db',
                border: `1px solid ${connectionStatus?.connected ? '#10b981' : '#3f3f46'}`,
              }}
            >
              {connectionStatus?.connected ? 'Backend Terhubung' : 'Mode Offline Aktif'}
            </span>

            <button
              onClick={onTestConnection}
              style={{
                background: '#231e30',
                border: '1px solid #3c3252',
                color: '#e5e7eb',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              Cek Ulang
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

const featureCardStyle = {
  background: '#16141d',
  border: '1px solid #32293e',
  borderRadius: '14px',
  padding: '18px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const featureIconBox = {
  width: '38px',
  height: '38px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const featureTitleStyle = {
  margin: 0,
  fontSize: '15px',
  color: '#fef3c7',
};

const featureDescStyle = {
  margin: 0,
  fontSize: '12px',
  color: '#9ca3af',
  lineHeight: '1.5',
};
