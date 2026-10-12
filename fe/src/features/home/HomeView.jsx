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
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#f59e0b',
                marginBottom: '14px',
              }}
            >
              <Sparkles size={13} /> KARYA INOVASI LOMBA: REVITALISASI BUDAYA DIGITAL
            </div>

            <h1
              style={{
                margin: '0 0 14px 0',
                fontSize: '36px',
                fontWeight: '900',
                color: '#fef3c7',
                lineHeight: '1.2',
                letterSpacing: '-0.5px',
              }}
            >
              Ubah Penonton Menjadi <span style={{ color: '#f59e0b', textShadow: '0 0 20px rgba(245,158,11,0.5)' }}>Dalang Digital</span>
            </h1>

            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#d1d5db', lineHeight: '1.6', maxWidth: '500px' }}>
              <strong>Wayangverse</strong> menjembatani kearifan adiluhung dengan generasi muda. Rancang adegan di atas kelir 2D interaktif, dengarkan soundscape gamelan dinamis, serta hubungkan interpretasi kreatif ke naskah dan filosofi tradisi.
            </p>

            {/* Tombol Call-to-Action Utama */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <button
                onClick={() => onNavigate('stage')}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #b45309)',
                  border: 'none',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <Film size={18} /> Masuk ke Studio Panggung
              </button>

              <button
                onClick={() => onNavigate('atlas')}
                style={{
                  background: 'rgba(39, 39, 42, 0.8)',
                  border: '1px solid #78350f',
                  color: '#fef3c7',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <BookOpen size={16} /> Buka Story Atlas
              </button>
            </div>
          </div>

          {/* Mini Interactive Preview Stage (Gatotkaca vs Karna) */}
          <div
            style={{
              background: 'radial-gradient(ellipse at 50% 30%, rgba(245, 158, 11, 0.25) 0%, #1a1410 70%)',
              border: '2px solid #78350f',
              borderRadius: '16px',
              padding: '20px',
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'flex-end',
              minHeight: '220px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <WayangFigureSvg slug="gatotkaca" scale={0.7} width={120} height={180} accentColor="#eab308" />
              <div style={{ fontSize: '11px', color: '#facc15', fontWeight: 'bold', marginTop: '4px' }}>
                Raden Gatotkaca
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <WayangFigureSvg slug="karna" pose="perang" facing="left" scale={0.7} width={120} height={180} accentColor="#f97316" />
              <div style={{ fontSize: '11px', color: '#fb923c', fontWeight: 'bold', marginTop: '4px' }}>
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
              🌿 Kelir 2D SVG • Siap Dimanipulasi di Studio
            </div>
          </div>
        </div>
      </section>

      {/* 2. FITUR UNGGULAN & PRINSIP PRODUK (PRD BAB 1.3) */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', color: '#fef3c7', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🌟 Pilar Utama Wayangverse
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={featureCardStyle}>
            <div style={{ ...featureIconBox, background: '#78350f', color: '#f59e0b' }}>
              <Zap size={20} />
            </div>
            <h3 style={featureTitleStyle}>Experience First</h3>
            <p style={featureDescStyle}>
              Bukan sekadar membaca teks narasi. Pengguna mengendalikan posisi wayang, pose sabetan, dan naskah dialog secara visual di atas kelir.
            </p>
          </div>

          <div style={featureCardStyle}>
            <div style={{ ...featureIconBox, background: '#064e3b', color: '#34d399' }}>
              <ShieldCheck size={20} />
            </div>
            <h3 style={featureTitleStyle}>Cultural Integrity</h3>
            <p style={featureDescStyle}>
              Membedakan secara tegas versi pakem tradisi (sumber rujukan asli) dengan karya kreasi bebas pengguna melalui atribusi yang transparan.
            </p>
          </div>

          <div style={featureCardStyle}>
            <div style={{ ...featureIconBox, background: '#1e3a5f', color: '#38bdf8' }}>
              <Layers size={20} />
            </div>
            <h3 style={featureTitleStyle}>Connected by Design</h3>
            <p style={featureDescStyle}>
              Setiap pertunjukan tersimpan menautkan tokoh dan cerita sumber. Pengunjung dapat menelusuri filosofi tokoh yang ada di karya.
            </p>
          </div>

          <div style={featureCardStyle}>
            <div style={{ ...featureIconBox, background: '#4a044e', color: '#f472b6' }}>
              <Music size={20} />
            </div>
            <h3 style={featureTitleStyle}>Soundscape Realtime</h3>
            <p style={featureDescStyle}>
              Tata suara gamelan laras slendro, efek dodogan kotak dalang, kepyak logam, dan gong ageng terintegrasi langsung di peramban web.
            </p>
          </div>
        </div>
      </section>

      {/* 3. STATUS KONEKSI BACKEND & DATABASE */}
      <section
        style={{
          background: '#16141d',
          border: '1px solid #32293e',
          borderRadius: '16px',
          padding: '18px 22px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#fef3c7' }}>
              📡 Status Integrasi REST API (Laravel 12 & Database)
            </h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
              Arsitektur terpisah First-Party SPA ⇄ Laravel REST API. Frontend tetap beroperasi penuh berkat arsitektur <em>Offline-First Cache</em>.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                fontSize: '12px',
                padding: '4px 12px',
                borderRadius: '8px',
                background: connectionStatus?.connected ? '#064e3b' : '#374151',
                color: connectionStatus?.connected ? '#34d399' : '#d1d5db',
                border: `1px solid ${connectionStatus?.connected ? '#10b981' : '#4b5563'}`,
              }}
            >
              {connectionStatus?.connected ? '✅ Backend Terhubung' : '⚡ Local-First Mode'}
            </span>

            <button
              onClick={onTestConnection}
              style={{
                background: '#2b2339',
                border: '1px solid #483a5e',
                color: '#e5e7eb',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Cek Ulang API
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
