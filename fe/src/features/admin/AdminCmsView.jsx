import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../services/api';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Music,
  ShieldAlert,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  Eye,
  CheckCircle,
  AlertCircle,
  Play,
  Save,
  X,
  Sparkles,
  Layers,
} from 'lucide-react';

export default function AdminCmsView({ onPlayPerformance }) {
  const [activeSubTab, setActiveSubTab] = useState('ringkasan'); // 'ringkasan' | 'karakter' | 'cerita' | 'audio' | 'karya' | 'users'
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [stories, setStories] = useState([]);
  const [audioAssets, setAudioAssets] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [actionNotice, setActionNotice] = useState(null);

  // State Modal CRUD
  const [modalType, setModalType] = useState(null); // 'character' | 'story' | 'audio' | null
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const showNotification = (msg, type = 'success') => {
    setActionNotice({ msg, type });
    setTimeout(() => setActionNotice(null), 4000);
  };

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Load Stats
      const resStats = await apiClient.get('/admin/stats');
      if (resStats.data?.data) {
        setStats(resStats.data.data);
      }

      // 2. Load Characters
      const resChar = await apiClient.get('/characters?all=1');
      if (resChar.data?.data) {
        setCharacters(resChar.data.data);
      }

      // 3. Load Stories
      const resStories = await apiClient.get('/stories?all=1');
      if (resStories.data?.data) {
        setStories(resStories.data.data);
      }

      // 4. Load Audio Assets
      const resAudio = await apiClient.get('/audio-assets?all=1');
      if (resAudio.data?.data) {
        setAudioAssets(resAudio.data.data);
      }

      // 5. Load All Performances
      const resPerf = await apiClient.get('/admin/performances');
      if (resPerf.data?.data) {
        setPerformances(resPerf.data.data);
      }

      // 6. Load Users
      const resUsers = await apiClient.get('/admin/users');
      if (resUsers.data?.data) {
        setUsersList(resUsers.data.data);
      }
    } catch (err) {
      console.error('Gagal memuat data admin CMS:', err);
      showNotification('Gagal memuat data dari server backend.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Handler Hapus Item
  const handleDeleteItem = async (type, id, title) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus "${title}"?`)) return;

    try {
      if (type === 'character') {
        await apiClient.delete(`/admin/characters/${id}`);
        setCharacters((prev) => prev.filter((item) => item.id !== id));
      } else if (type === 'story') {
        await apiClient.delete(`/admin/stories/${id}`);
        setStories((prev) => prev.filter((item) => item.id !== id));
      } else if (type === 'audio') {
        await apiClient.delete(`/admin/audio-assets/${id}`);
        setAudioAssets((prev) => prev.filter((item) => item.id !== id));
      } else if (type === 'performance') {
        await apiClient.delete(`/admin/performances/${id}`);
        setPerformances((prev) => prev.filter((item) => item.id !== id));
      }
      showNotification(`"${title}" berhasil dihapus.`);
      // Refresh stats
      loadAllData();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Gagal menghapus data.', 'error');
    }
  };

  // Handler Toggle Visibilitas Karya
  const handleToggleVisibility = async (perf) => {
    const nextVis = perf.visibility === 'public' ? 'private' : 'public';
    try {
      await apiClient.patch(`/admin/performances/${perf.id}/visibility`, { visibility: nextVis });
      setPerformances((prev) =>
        prev.map((item) => (item.id === perf.id ? { ...item, visibility: nextVis } : item))
      );
      showNotification(`Visibilitas karya diubah menjadi ${nextVis.toUpperCase()}.`);
    } catch (err) {
      showNotification('Gagal memperbarui visibilitas karya.', 'error');
    }
  };

  // Handler Buka Modal Form
  const openCreateModal = (type) => {
    setModalType(type);
    setEditingItem(null);
    if (type === 'character') {
      setFormData({
        name: '',
        slug: '',
        alias: '',
        type: 'ksatria',
        type_name: 'Ksatria Satria Narpatitama',
        weapons: '',
        description: '',
        philosophy: '',
        tradition: 'Gaya Surakarta & Yogyakarta',
        accent_color: '#f59e0b',
        default_scale: 1.0,
        status: 'published',
      });
    } else if (type === 'story') {
      setFormData({
        title: '',
        slug: '',
        synopsis: '',
        philosophy: '',
        tradition: 'Gaya Surakarta & Yogyakarta',
        version_label: 'Pakem Gagrag Mataram',
        theme_song: 'Gamelan Srepeg Mataram',
        recommended_background: 'kelir-kurusetra-perang',
        status: 'published',
        source_title: '',
        source_author: '',
      });
    } else if (type === 'audio') {
      setFormData({
        title: '',
        category: 'bgm',
        instrument: 'Gamelan Slendro',
        tempo: 'Cepat & Heroik',
        mood: 'Peperangan / Dinamis',
        description: '',
        synth_type: 'srepeg',
        duration: 120,
        license_note: 'CC-BY 4.0 Creative Commons',
        status: 'active',
      });
    }
  };

  const openEditModal = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    setFormData({ ...item });
  };

  // Handler Submit Modal Form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'character') {
        if (editingItem) {
          await apiClient.patch(`/admin/characters/${editingItem.id}`, formData);
          showNotification('Karakter wayang berhasil diperbarui.');
        } else {
          await apiClient.post('/admin/characters', formData);
          showNotification('Karakter wayang baru berhasil ditambahkan.');
        }
      } else if (modalType === 'story') {
        const payload = {
          ...formData,
          sources: formData.source_title
            ? [
                {
                  title: formData.source_title,
                  author_or_publisher: formData.source_author || 'Pustaka Budaya',
                  rights_note: 'Domain Publik Budaya',
                },
              ]
            : [],
        };
        if (editingItem) {
          await apiClient.patch(`/admin/stories/${editingItem.id}`, payload);
          showNotification('Lakon wiracarita berhasil diperbarui.');
        } else {
          await apiClient.post('/admin/stories', payload);
          showNotification('Lakon wiracarita baru berhasil ditambahkan.');
        }
      } else if (modalType === 'audio') {
        if (editingItem) {
          await apiClient.patch(`/admin/audio-assets/${editingItem.id}`, formData);
          showNotification('Aset audio berhasil diperbarui.');
        } else {
          await apiClient.post('/admin/audio-assets', formData);
          showNotification('Aset audio baru berhasil ditambahkan.');
        }
      }

      setModalType(null);
      loadAllData();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Gagal menyimpan perubahan.', 'error');
    }
  };

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px 16px', color: '#f3f4f6' }}>
      {/* 1. Header Banner CMS */}
      <div
        style={{
          background: 'linear-gradient(135deg, #221810 0%, #15111d 100%)',
          border: '1px solid #78350f',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '24px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.7)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#b45309', color: '#fef3c7', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginBottom: '8px' }}>
            <Sparkles size={13} /> PUSAT KENDALI KURASI BUDAYA (ADMIN CMS)
          </div>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '26px', color: '#fef3c7', display: 'flex', alignItems: 'center', gap: '10px' }}>
            👑 Dashboard & Manajemen Data Master
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#d1d5db', maxWidth: '720px' }}>
            Kelola katalog tokoh wayang, naskah lakon wiracarita, instrumen tata suara pedalangan, moderasi karya pengguna, dan pantau metrik partisipasi digital.
          </p>
        </div>

        <button
          onClick={loadAllData}
          disabled={loading}
          style={{
            background: '#2b2138',
            border: '1px solid #5b4670',
            color: '#f3f4f6',
            padding: '10px 16px',
            borderRadius: '10px',
            cursor: loading ? 'wait' : 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Menyinkronkan...' : 'Refresh Data'}
        </button>
      </div>

      {/* Notifikasi Alert */}
      {actionNotice && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            background: actionNotice.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${actionNotice.type === 'success' ? '#10b981' : '#ef4444'}`,
            color: actionNotice.type === 'success' ? '#6ee7b7' : '#fca5a5',
          }}
        >
          {actionNotice.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{actionNotice.msg}</span>
        </div>
      )}

      {/* 2. Ringkasan Kartu Metrik Platform */}
      {stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
            marginBottom: '26px',
          }}
        >
          <MetricCard
            title="Tokoh Wayang"
            value={stats.counts?.characters || 0}
            icon="🎭"
            color="#f59e0b"
            onClick={() => setActiveSubTab('karakter')}
          />
          <MetricCard
            title="Lakon Wiracarita"
            value={stats.counts?.stories || 0}
            icon="📜"
            color="#38bdf8"
            onClick={() => setActiveSubTab('cerita')}
          />
          <MetricCard
            title="Tata Suara & SFX"
            value={stats.counts?.audio_assets || 0}
            icon="🎵"
            color="#a855f7"
            onClick={() => setActiveSubTab('audio')}
          />
          <MetricCard
            title="Karya Pertunjukan"
            value={stats.counts?.performances || 0}
            icon="🏛️"
            color="#10b981"
            subtitle={`${stats.counts?.public_performances || 0} Publik`}
            onClick={() => setActiveSubTab('karya')}
          />
          <MetricCard
            title="Pengguna Dalang"
            value={stats.counts?.users || 0}
            icon="👥"
            color="#ec4899"
            onClick={() => setActiveSubTab('users')}
          />
        </div>
      )}

      {/* 3. Sub-Tab Navigasi CMS */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          borderBottom: '1px solid #2d243b',
          paddingBottom: '14px',
          marginBottom: '22px',
        }}
      >
        <TabButton
          active={activeSubTab === 'ringkasan'}
          onClick={() => setActiveSubTab('ringkasan')}
          icon={<LayoutDashboard size={15} />}
          label="Ringkasan & Aktivitas"
        />
        <TabButton
          active={activeSubTab === 'karakter'}
          onClick={() => setActiveSubTab('karakter')}
          icon={<Layers size={15} />}
          label={`Master Karakter (${characters.length})`}
        />
        <TabButton
          active={activeSubTab === 'cerita'}
          onClick={() => setActiveSubTab('cerita')}
          icon={<BookOpen size={15} />}
          label={`Master Lakon Cerita (${stories.length})`}
        />
        <TabButton
          active={activeSubTab === 'audio'}
          onClick={() => setActiveSubTab('audio')}
          icon={<Music size={15} />}
          label={`Tata Suara & SFX (${audioAssets.length})`}
        />
        <TabButton
          active={activeSubTab === 'karya'}
          onClick={() => setActiveSubTab('karya')}
          icon={<ShieldAlert size={15} />}
          label={`Moderasi Karya (${performances.length})`}
        />
        <TabButton
          active={activeSubTab === 'users'}
          onClick={() => setActiveSubTab('users')}
          icon={<Users size={15} />}
          label={`Pengguna (${usersList.length})`}
        />
      </div>

      {/* 4. Konten Tab Aktif */}

      {/* TAB 1: RINGKASAN */}
      {activeSubTab === 'ringkasan' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Card Tindakan Cepat */}
          <div style={panelCardStyle}>
            <h3 style={panelHeaderStyle}>⚡ Tindakan Cepat Kurasi Master Data</h3>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '16px' }}>
              Tambah entitas budaya baru ke database untuk langsung tersedia di Story Atlas dan Virtual Stage.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => openCreateModal('character')} style={quickActionButtonStyle}>
                <Plus size={16} color="#f59e0b" /> Tambah Tokoh Wayang Baru
              </button>
              <button onClick={() => openCreateModal('story')} style={quickActionButtonStyle}>
                <Plus size={16} color="#38bdf8" /> Tambah Lakon Wiracarita & Naskah
              </button>
              <button onClick={() => openCreateModal('audio')} style={quickActionButtonStyle}>
                <Plus size={16} color="#a855f7" /> Tambah Aset Gamelan / SFX Pedalangan
              </button>
            </div>
          </div>

          {/* Card Aktivitas Karya Terbaru */}
          <div style={panelCardStyle}>
            <h3 style={panelHeaderStyle}>🏛️ Karya Pengguna Terbaru</h3>
            {performances.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#6b7280' }}>Belum ada karya yang tersimpan.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {performances.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    style={{
                      background: '#130f1d',
                      border: '1px solid #2d243b',
                      borderRadius: '10px',
                      padding: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#fef3c7' }}>{p.title}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                        Oleh: <strong>{p.user?.name || p.author || 'Anonim'}</strong> • Lakon: {p.story?.title || 'Bebas'}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: p.visibility === 'public' ? '#064e3b' : '#374151',
                        color: p.visibility === 'public' ? '#6ee7b7' : '#d1d5db',
                      }}
                    >
                      {p.visibility.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MASTER KARAKTER */}
      {activeSubTab === 'karakter' && (
        <div style={panelCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#fef3c7' }}>🎭 Katalog Tokoh Wayang Kulit</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
                Karakter yang diaktifkan di sini otomatis dapat dimainkan pengguna di Virtual Stage.
              </p>
            </div>
            <button onClick={() => openCreateModal('character')} style={primaryBtnStyle}>
              <Plus size={15} /> Tambah Tokoh
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderRowStyle}>
                  <th style={thStyle}>Tokoh</th>
                  <th style={thStyle}>Golongan</th>
                  <th style={thStyle}>Senjata Pusaka</th>
                  <th style={thStyle}>Filosofi Hidup</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {characters.map((char) => (
                  <tr key={char.id} style={tableRowStyle}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 'bold', color: char.accent_color || '#fef3c7' }}>{char.name}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>{char.alias || '-'}</div>
                    </td>
                    <td style={tdStyle}>
                      <span style={badgeStyle}>{char.type_name || char.type}</span>
                    </td>
                    <td style={tdStyle}>{char.weapons || '-'}</td>
                    <td style={{ ...tdStyle, maxWidth: '280px', fontSize: '12px', color: '#d1d5db' }}>
                      {char.philosophy?.slice(0, 90)}...
                    </td>
                    <td style={tdStyle}>
                      <span style={{ ...badgeStyle, background: char.status === 'published' ? '#064e3b' : '#3f3f46', color: char.status === 'published' ? '#6ee7b7' : '#d1d5db' }}>
                        {char.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => openEditModal('character', char)} style={actionBtnEditStyle} title="Edit">
                          <Edit3 size={13} />
                        </button>
                        <button onClick={() => handleDeleteItem('character', char.id, char.name)} style={actionBtnDeleteStyle} title="Hapus">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MASTER LAKON CERITA */}
      {activeSubTab === 'cerita' && (
        <div style={panelCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#fef3c7' }}>📜 Katalog Lakon Wiracarita & Naskah Pakem</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
                Lakon rujukan yang tampil di Story Atlas beserta sumber atribusi budaya aslinya.
              </p>
            </div>
            <button onClick={() => openCreateModal('story')} style={primaryBtnStyle}>
              <Plus size={15} /> Tambah Lakon
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderRowStyle}>
                  <th style={thStyle}>Judul Lakon</th>
                  <th style={thStyle}>Gagrag Tradisi</th>
                  <th style={thStyle}>Gending Musik</th>
                  <th style={thStyle}>Naskah Rujukan</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((s) => (
                  <tr key={s.id} style={tableRowStyle}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 'bold', color: '#fef3c7' }}>{s.title}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>{s.version_label}</div>
                    </td>
                    <td style={tdStyle}>{s.tradition}</td>
                    <td style={tdStyle}>{s.theme_song}</td>
                    <td style={tdStyle}>
                      {s.sources && s.sources.length > 0 ? (
                        <span style={{ fontSize: '11px', color: '#38bdf8' }}>
                          📚 {s.sources[0].title}
                        </span>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#6b7280' }}>-</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <span style={{ ...badgeStyle, background: s.status === 'published' ? '#064e3b' : '#3f3f46', color: s.status === 'published' ? '#6ee7b7' : '#d1d5db' }}>
                        {s.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => openEditModal('story', s)} style={actionBtnEditStyle} title="Edit">
                          <Edit3 size={13} />
                        </button>
                        <button onClick={() => handleDeleteItem('story', s.id, s.title)} style={actionBtnDeleteStyle} title="Hapus">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MASTER TATA SUARA */}
      {activeSubTab === 'audio' && (
        <div style={panelCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#fef3c7' }}>🎵 Master Tata Suara & Soundscape Pedalangan</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
                Aset BGM gamelan dinamis, dodogan cempala kayu, kepyak logam, dan gong ageng.
              </p>
            </div>
            <button onClick={() => openCreateModal('audio')} style={primaryBtnStyle}>
              <Plus size={15} /> Tambah Tata Suara
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderRowStyle}>
                  <th style={thStyle}>Judul Aset</th>
                  <th style={thStyle}>Kategori</th>
                  <th style={thStyle}>Instrumen & Mood</th>
                  <th style={thStyle}>Tempo</th>
                  <th style={thStyle}>Lisensi</th>
                  <th style={thStyle}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {audioAssets.map((a) => (
                  <tr key={a.id} style={tableRowStyle}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 'bold', color: '#fef3c7' }}>{a.title}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>Synth: {a.synth_type} • Durasi: {a.duration}s</div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ ...badgeStyle, background: a.category === 'bgm' ? '#1e3a5f' : '#4a2810', color: a.category === 'bgm' ? '#7dd3fc' : '#fed7aa' }}>
                        {a.category.toUpperCase()}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div>{a.instrument}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>Mood: {a.mood}</div>
                    </td>
                    <td style={tdStyle}>{a.tempo}</td>
                    <td style={tdStyle}><span style={{ fontSize: '11px', color: '#10b981' }}>{a.license_note}</span></td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => openEditModal('audio', a)} style={actionBtnEditStyle} title="Edit">
                          <Edit3 size={13} />
                        </button>
                        <button onClick={() => handleDeleteItem('audio', a.id, a.title)} style={actionBtnDeleteStyle} title="Hapus">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: MODERASI KARYA */}
      {activeSubTab === 'karya' && (
        <div style={panelCardStyle}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#fef3c7' }}>🏛️ Moderasi Karya Pertunjukan Pengguna</h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
              Seluruh rekaman adegan panggung dari semua pengguna terdaftar. Anda dapat mengubah visibilitas publik/privat atau menghapus karya yang tidak pantas.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderRowStyle}>
                  <th style={thStyle}>Karya Lakon</th>
                  <th style={thStyle}>Dalang Kreator</th>
                  <th style={thStyle}>Lakon Cerita</th>
                  <th style={thStyle}>Visibilitas</th>
                  <th style={thStyle}>Waktu Dibuat</th>
                  <th style={thStyle}>Aksi Moderasi</th>
                </tr>
              </thead>
              <tbody>
                {performances.map((perf) => (
                  <tr key={perf.id} style={tableRowStyle}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 'bold', color: '#fef3c7' }}>{perf.title}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>{perf.description?.slice(0, 60)}...</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ color: '#fef3c7' }}>{perf.user?.name || perf.author}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>{perf.user?.email}</div>
                    </td>
                    <td style={tdStyle}>{perf.story?.title || 'Karya Mandiri Bebas'}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleToggleVisibility(perf)}
                        style={{
                          background: perf.visibility === 'public' ? '#064e3b' : '#374151',
                          color: perf.visibility === 'public' ? '#6ee7b7' : '#d1d5db',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                        }}
                      >
                        {perf.visibility.toUpperCase()} (Klik Ubah)
                      </button>
                    </td>
                    <td style={tdStyle}><span style={{ fontSize: '11px', color: '#9ca3af' }}>{new Date(perf.created_at).toLocaleDateString('id-ID')}</span></td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {onPlayPerformance && (
                          <button
                            onClick={() => onPlayPerformance(perf)}
                            style={{ ...actionBtnEditStyle, background: '#0284c7', borderColor: '#38bdf8' }}
                            title="Tonton Lakon"
                          >
                            <Play size={13} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteItem('performance', perf.id, perf.title)}
                          style={actionBtnDeleteStyle}
                          title="Hapus Karya"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: MANAJEMEN PENGGUNA */}
      {activeSubTab === 'users' && (
        <div style={panelCardStyle}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#fef3c7' }}>👥 Daftar Akun Pengguna & Dalang</h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
              Daftar akun yang terdaftar dalam ekosistem Wayangverse dan kontribusi karyanya.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderRowStyle}>
                  <th style={thStyle}>Nama Pengguna</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Peran (Role)</th>
                  <th style={thStyle}>Total Karya</th>
                  <th style={thStyle}>Terdaftar Sejak</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u.id} style={tableRowStyle}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 'bold', color: '#fef3c7' }}>{u.name}</div>
                    </td>
                    <td style={tdStyle}>{u.email}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          ...badgeStyle,
                          background: u.role === 'admin' ? '#78350f' : '#1e293b',
                          color: u.role === 'admin' ? '#fde68a' : '#94a3b8',
                          borderColor: u.role === 'admin' ? '#f59e0b' : '#334155',
                          borderWidth: '1px',
                          borderStyle: 'solid',
                        }}
                      >
                        {u.role?.toUpperCase()}
                      </span>
                    </td>
                    <td style={tdStyle}><strong>{u.performances_count} karya</strong></td>
                    <td style={tdStyle}><span style={{ fontSize: '11px', color: '#9ca3af' }}>{new Date(u.created_at).toLocaleDateString('id-ID')}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. MODAL CREATE / EDIT FORM */}
      {modalType && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2500,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#191523',
              border: '2px solid #78350f',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              color: '#f9fafb',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, color: '#f59e0b', fontSize: '18px' }}>
                {editingItem ? '✏️ Edit Data' : '➕ Tambah Data Baru'} ({modalType.toUpperCase()})
              </h3>
              <button
                onClick={() => setModalType(null)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              {/* Form Tokoh Karakter */}
              {modalType === 'character' && (
                <div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={labelStyle}>Nama Tokoh Wayang</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      style={inputStyle}
                      placeholder="Raden Gatotkaca"
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={labelStyle}>Gelar / Alias</label>
                    <input
                      type="text"
                      value={formData.alias || ''}
                      onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                      style={inputStyle}
                      placeholder="Satria Pringgandani, Senopati Udara"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <label style={labelStyle}>Golongan Tokoh</label>
                      <select
                        value={formData.type || 'ksatria'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        style={inputStyle}
                      >
                        <option value="ksatria">Ksatria</option>
                        <option value="punakawan">Punakawan</option>
                        <option value="raksasa">Raksasa</option>
                        <option value="dewa">Dewa / Batara</option>
                        <option value="wanita">Wanita / Putri</option>
                        <option value="lainnya">Lainnya</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Warna Aksen Vektor</label>
                      <input
                        type="color"
                        value={formData.accent_color || '#f59e0b'}
                        onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                        style={{ ...inputStyle, padding: '4px', height: '38px', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={labelStyle}>Senjata / Pusaka</label>
                    <input
                      type="text"
                      value={formData.weapons || ''}
                      onChange={(e) => setFormData({ ...formData, weapons: e.target.value })}
                      style={inputStyle}
                      placeholder="Kotang Antakusuma, Aji Brajamusti"
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={labelStyle}>Deskripsi Karakteristik</label>
                    <textarea
                      rows={3}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={labelStyle}>Makna Filosofis Watak</label>
                    <textarea
                      rows={3}
                      value={formData.philosophy || ''}
                      onChange={(e) => setFormData({ ...formData, philosophy: e.target.value })}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Status Katalog</label>
                    <select
                      value={formData.status || 'published'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="published">Published (Aktif di Panggung & Atlas)</option>
                      <option value="draft">Draft (Disimpan Sementara)</option>
                      <option value="archived">Archived (Arsip)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Form Lakon Cerita */}
              {modalType === 'story' && (
                <div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={labelStyle}>Judul Lakon Cerita</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      style={inputStyle}
                      placeholder="Bharatayuddha: Gugurnya Ghatotkaca"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <label style={labelStyle}>Gaya Tradisi</label>
                      <input
                        type="text"
                        value={formData.tradition || ''}
                        onChange={(e) => setFormData({ ...formData, tradition: e.target.value })}
                        style={inputStyle}
                        placeholder="Gaya Surakarta & Yogyakarta"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Tema Musik Pengiring</label>
                      <input
                        type="text"
                        value={formData.theme_song || ''}
                        onChange={(e) => setFormData({ ...formData, theme_song: e.target.value })}
                        style={inputStyle}
                        placeholder="Gamelan Srepeg Mataram"
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={labelStyle}>Ringkasan Sinopsis</label>
                    <textarea
                      rows={3}
                      value={formData.synopsis || ''}
                      onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={labelStyle}>Nilai Filosofis Lakon</label>
                    <textarea
                      rows={3}
                      value={formData.philosophy || ''}
                      onChange={(e) => setFormData({ ...formData, philosophy: e.target.value })}
                      required
                      style={inputStyle}
                    />
                  </div>
                  {!editingItem && (
                    <div style={{ marginBottom: '12px', background: '#120f18', padding: '10px', borderRadius: '8px', border: '1px solid #3c3252' }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '6px' }}>
                        📖 Naskah Sumber Rujukan Budaya (Atribusi)
                      </div>
                      <div style={{ marginBottom: '6px' }}>
                        <input
                          type="text"
                          value={formData.source_title || ''}
                          onChange={(e) => setFormData({ ...formData, source_title: e.target.value })}
                          placeholder="Judul Naskah (Cth: Kakawin Bharatayuddha)"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={formData.source_author || ''}
                          onChange={(e) => setFormData({ ...formData, source_author: e.target.value })}
                          placeholder="Penulis / Lembaga (Cth: Mpu Sedah & Mpu Panuluh)"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  )}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Status Katalog</label>
                    <select
                      value={formData.status || 'published'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Form Tata Suara */}
              {modalType === 'audio' && (
                <div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={labelStyle}>Judul Aset Audio</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      style={inputStyle}
                      placeholder="Gamelan Srepeg Mataram"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <label style={labelStyle}>Kategori</label>
                      <select
                        value={formData.category || 'bgm'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        style={inputStyle}
                      >
                        <option value="bgm">BGM (Musik Gamelan)</option>
                        <option value="sfx">SFX (Ketukan / Efek Pedalangan)</option>
                        <option value="suluk">Suluk (Vokal Dalang)</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Instrumen Utama</label>
                      <input
                        type="text"
                        value={formData.instrument || ''}
                        onChange={(e) => setFormData({ ...formData, instrument: e.target.value })}
                        required
                        style={inputStyle}
                        placeholder="Kendang, Bonang, Gong"
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <label style={labelStyle}>Tempo</label>
                      <input
                        type="text"
                        value={formData.tempo || ''}
                        onChange={(e) => setFormData({ ...formData, tempo: e.target.value })}
                        style={inputStyle}
                        placeholder="Cepat & Heroik"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Suasana (Mood)</label>
                      <input
                        type="text"
                        value={formData.mood || ''}
                        onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                        style={inputStyle}
                        placeholder="Peperangan / Gagah"
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={labelStyle}>Tipe Web Audio Synthesizer</label>
                    <select
                      value={formData.synth_type || 'srepeg'}
                      onChange={(e) => setFormData({ ...formData, synth_type: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="srepeg">Srepeg (Gamelan Cepat)</option>
                      <option value="ayak_ayak">Ayak-ayak (Gamelan Syahdu)</option>
                      <option value="sampak">Sampak (Gamelan Tegang)</option>
                      <option value="dodogan">Dodogan (Ketukan Cempala Kayu)</option>
                      <option value="kepyak">Kepyak (Gemerincing Logam Kaki)</option>
                      <option value="gong">Gong Ageng (Dentuman Puncak)</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Lisensi & Hak Cipta</label>
                    <input
                      type="text"
                      value={formData.license_note || ''}
                      onChange={(e) => setFormData({ ...formData, license_note: e.target.value })}
                      style={inputStyle}
                      placeholder="CC-BY 4.0 Creative Commons"
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  style={{
                    background: '#272333',
                    border: '1px solid #453a54',
                    color: '#d1d5db',
                    padding: '9px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #d97706, #b45309)',
                    border: 'none',
                    color: '#fff',
                    padding: '9px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Save size={15} /> Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-komponen Kartu Metrik
function MetricCard({ title, value, icon, color, subtitle, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#161220',
        border: '1px solid #2e263d',
        borderRadius: '12px',
        padding: '16px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.15s ease, border-color 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = color;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = '#2e263d';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', color: '#9ca3af' }}>{title}</span>
        <span style={{ fontSize: '20px' }}>{icon}</span>
      </div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: color }}>{value}</div>
      {subtitle && <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>{subtitle}</div>}
    </div>
  );
}

// Sub-komponen Tab Button
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? '#78350f' : '#191524',
        border: `1px solid ${active ? '#f59e0b' : '#3c3252'}`,
        color: active ? '#fef3c7' : '#9ca3af',
        padding: '8px 14px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: active ? 'bold' : 'normal',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.15s ease',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

// Gaya Elemen
const panelCardStyle = {
  background: '#161220',
  border: '1px solid #2e263d',
  borderRadius: '14px',
  padding: '20px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
};

const panelHeaderStyle = {
  margin: '0 0 8px 0',
  fontSize: '16px',
  color: '#fef3c7',
};

const quickActionButtonStyle = {
  background: '#231e30',
  border: '1px dashed #4b3d63',
  color: '#f3f4f6',
  padding: '12px 16px',
  borderRadius: '10px',
  cursor: 'pointer',
  textAlign: 'left',
  fontSize: '13px',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  transition: 'all 0.15s ease',
};

const primaryBtnStyle = {
  background: 'linear-gradient(135deg, #d97706, #b45309)',
  border: 'none',
  color: '#fff',
  padding: '8px 14px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '13px',
};

const tableHeaderRowStyle = {
  borderBottom: '1px solid #3c3252',
  textAlign: 'left',
};

const thStyle = {
  padding: '10px 12px',
  color: '#9ca3af',
  fontSize: '11px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const tableRowStyle = {
  borderBottom: '1px solid #221c2e',
};

const tdStyle = {
  padding: '12px',
  verticalAlign: 'middle',
};

const badgeStyle = {
  background: '#231e30',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  color: '#d1d5db',
  display: 'inline-block',
};

const actionBtnEditStyle = {
  background: '#78350f',
  border: '1px solid #f59e0b',
  color: '#fef3c7',
  padding: '5px 8px',
  borderRadius: '6px',
  cursor: 'pointer',
};

const actionBtnDeleteStyle = {
  background: '#7f1d1d',
  border: '1px solid #ef4444',
  color: '#fee2e2',
  padding: '5px 8px',
  borderRadius: '6px',
  cursor: 'pointer',
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '600',
  color: '#d1d5db',
  marginBottom: '4px',
};

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  background: '#120f18',
  border: '1px solid #3c3252',
  borderRadius: '8px',
  color: '#f9fafb',
  fontSize: '13px',
  boxSizing: 'border-box',
};
