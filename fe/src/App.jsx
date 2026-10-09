import { useState, useEffect } from 'react';
import { checkApiStatus } from './services/api';
import './App.css';

function App() {
  const [connection, setConnection] = useState({
    loading: true,
    connected: false,
    data: null,
    error: null,
  });

  const testConnection = async () => {
    setConnection((prev) => ({ ...prev, loading: true, error: null }));
    const result = await checkApiStatus();

    if (result.success) {
      setConnection({
        loading: false,
        connected: true,
        data: result.data,
        error: null,
      });
    } else {
      setConnection({
        loading: false,
        connected: false,
        data: null,
        error: result.error,
      });
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="app-container">
      <header>
        <span className="header-badge">LOMBA TEMA SOSIAL & KESENIAN</span>
        <h1 className="header-title">Wayang Digital</h1>
        <p className="header-subtitle">
          Platform panggung interaktif modern untuk digitalisasi pewayangan: menyajikan true story,
          peragaan wayang interaktif, visualisasi dinamis, serta atmosfer audio kontemporer untuk generasi muda.
        </p>
      </header>

      {/* Status Koneksi Backend & Database */}
      <section className="status-card">
        <div className="status-header">
          <div>
            <h3>Status Integrasi API & Database</h3>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>
              Verifikasi komunikasi antara Frontend (React) ⇄ Backend (Laravel 12) ⇄ Database (wayang)
            </p>
          </div>
          <button className="btn-refresh" onClick={testConnection} disabled={connection.loading}>
            {connection.loading ? 'Memeriksa...' : '🔄 Cek Ulang Koneksi'}
          </button>
        </div>

        <div className="status-grid">
          {/* Backend API */}
          <div className="status-item">
            <div className="status-label">Backend API (Laravel 12)</div>
            <div className="status-indicator">
              <span className={`dot ${connection.loading ? 'yellow' : connection.connected ? 'green' : 'red'}`}></span>
              <span>
                {connection.loading
                  ? 'Menghubungkan...'
                  : connection.connected
                  ? 'Online (Connected)'
                  : 'Offline / Error'}
              </span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
              {connection.data?.project?.framework || 'http://127.0.0.1:8000/api/status'}
            </div>
          </div>

          {/* Database */}
          <div className="status-item">
            <div className="status-label">Database MySQL</div>
            <div className="status-indicator">
              <span
                className={`dot ${
                  connection.loading
                    ? 'yellow'
                    : connection.data?.database?.connected
                    ? 'green'
                    : 'red'
                }`}
              ></span>
              <span>
                {connection.loading
                  ? 'Memeriksa...'
                  : connection.data?.database?.connected
                  ? `Connected: ${connection.data.database.name}`
                  : 'Terputus'}
              </span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
              Target DB: <strong>wayang</strong> (MySQL Port 3306)
            </div>
          </div>

          {/* Response Info */}
          <div className="status-item">
            <div className="status-label">Waktu Sinkronisasi</div>
            <div className="status-indicator">
              <span className="dot green"></span>
              <span style={{ fontSize: '13px' }}>
                {connection.data?.timestamp
                  ? new Date(connection.data.timestamp).toLocaleTimeString()
                  : 'Menunggu respon...'}
              </span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
              Handshake Status: {connection.data?.status || (connection.loading ? 'Loading' : 'Failed')}
            </div>
          </div>
        </div>

        {connection.error && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#f87171',
              fontSize: '13px',
            }}
          >
            ⚠️ <strong>Pesan Error:</strong> {connection.error}
            <div style={{ marginTop: '4px', color: '#cbd5e1' }}>
              Pastikan server Laravel aktif di terminal: <code>cd be &amp;&amp; php artisan serve</code>
            </div>
          </div>
        )}
      </section>

      {/* Arsitektur Modular Siap Pakai */}
      <section>
        <h3 className="section-title">Fondasi Modular (Siap Update Fitur dari Tim)</h3>
        <div className="architecture-grid">
          <div className="arch-box">
            <h4>🎭 Panggung Interaktif</h4>
            <p>Ruang manipulasi sendi &amp; siluet wayang digital di atas kelir.</p>
            <span className="arch-path">fe/src/features/stage/</span>
          </div>

          <div className="arch-box">
            <h4>📖 Story &amp; Lakon (True Story)</h4>
            <p>Alur cerita adaptasi sosial kontemporer dan dialog adegan.</p>
            <span className="arch-path">fe/src/features/story/</span>
          </div>

          <div className="arch-box">
            <h4>📜 Ensiklopedia Tokoh</h4>
            <p>Data karakter pewayangan, filosofi, watak, dan nilai moral.</p>
            <span className="arch-path">fe/src/features/encyclopedia/</span>
          </div>

          <div className="arch-box">
            <h4>🎵 Soundscape &amp; SFX</h4>
            <p>Backsound gamelan modern, suluk, dan efek suara interaksi panggung.</p>
            <span className="arch-path">fe/public/audio/</span>
          </div>

          <div className="arch-box">
            <h4>🖼️ Visual &amp; Kelir Assets</h4>
            <p>Komponen visual wayang (part tubuh terpisah), latar kelir, &amp; blencong.</p>
            <span className="arch-path">fe/public/images/</span>
          </div>

          <div className="arch-box">
            <h4>⚡ API Endpoints (Laravel 12)</h4>
            <p>Layanan controller, autentikasi, serta data naskah &amp; karakter.</p>
            <span className="arch-path">be/routes/api.php</span>
          </div>
        </div>
      </section>

      {/* Standby Status */}
      <footer className="standby-banner">
        <h4>🚀 Folder BE &amp; FE Siap Digunakan</h4>
        <p>
          Fondasi arsitektur, CORS, API bridge, dan koneksi database <strong>wayang</strong> telah aktif.
          Menunggu arahan dan pembaruan spesifikasi fitur selanjutnya dari tim.
        </p>
      </footer>
    </div>
  );
}

export default App;
