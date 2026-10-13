import React, { useState, useEffect } from 'react';
import persistenceService from '../../services/persistenceService';
import { useStageStore } from './useStageStore';
import { getStoryById } from '../../data/master/storiesMaster';
import {
  Film,
  Plus,
  Play,
  Edit,
  Copy,
  Trash2,
  Globe,
  Lock,
  Calendar,
  Layers,
  BookOpen,
} from 'lucide-react';

export default function MyWorksView({ onOpenStudio, onPlayPerformance }) {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loadPerformanceFromData, resetStudio } = useStageStore();

  const loadWorks = async () => {
    setLoading(true);
    const data = await persistenceService.getMyWorks();
    setWorks(data);
    setLoading(false);
  };

  useEffect(() => {
    loadWorks();
  }, []);

  const handleReopenInStudio = (perf) => {
    loadPerformanceFromData(perf);
    if (onOpenStudio) onOpenStudio();
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Yakin ingin menghapus karya "${title}"?`)) {
      await persistenceService.deletePerformance(id);
      loadWorks();
    }
  };

  const handleDuplicate = async (perf) => {
    const sceneData = typeof perf.scene_data === 'string' ? JSON.parse(perf.scene_data) : perf.scene_data;
    const duplicateMeta = {
      id: null,
      title: `${perf.title} (Salinan)`,
      description: perf.description || '',
      storyId: perf.story_id || null,
      visibility: 'private',
    };
    await persistenceService.savePerformance(duplicateMeta, sceneData);
    loadWorks();
  };

  const handleCreateNew = () => {
    resetStudio();
    if (onOpenStudio) onOpenStudio();
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px', color: 'var(--text-main, #fbf8ee)' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          gap: '12px',
        }}
      >
        <div>
          <span style={{ fontSize: '11px', color: '#d4af37', fontWeight: 'bold' }}>
            GALERI KARYA PRIBADI
          </span>
          <h1 style={{ margin: '2px 0 0 0', fontSize: '24px', color: '#fcf6e8' }}>
            Karya & Lakon Saya ({works.length})
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#bfae9c' }}>
            Daftar pertunjukan wayang digital yang telah Anda rancang dan simpan.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          style={{
            background: 'linear-gradient(135deg, #8b4513, #5c2c10)',
            border: '1px solid #d4af37',
            color: '#fcf6e8',
            padding: '10px 20px',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(139, 69, 19, 0.45)',
          }}
        >
          <Plus size={16} /> Rancang Lakon Baru
        </button>
      </div>

      {/* Grid Karya */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
          Memuat daftar karya...
        </div>
      ) : works.length === 0 ? (
        <div
          style={{
            background: '#17110c',
            border: '1px dashed #5a3b22',
            borderRadius: '16px',
            padding: '50px 20px',
            textAlign: 'center',
          }}
        >
          <Film size={44} style={{ color: '#d4af37', marginBottom: '12px', opacity: 0.8 }} />
          <h3 style={{ margin: '0 0 8px 0', color: '#fcfaf2' }}>Belum Ada Karya Tersimpan</h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#bfae9c' }}>
            Mulai petualangan Anda sebagai dalang digital dengan menyusun adegan pertama di Virtual Stage.
          </p>
          <button
            onClick={handleCreateNew}
            style={{
              background: 'linear-gradient(135deg, #d4af37, #8b4513)',
              border: 'none',
              color: '#0d0a07',
              padding: '10px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
            }}
          >
            Masuk ke Studio Panggung
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {works.map((item) => {
            const sceneData = typeof item.scene_data === 'string' ? JSON.parse(item.scene_data) : item.scene_data;
            const sceneCount = sceneData?.scenes?.length || 1;
            const refStory = item.story_id ? getStoryById(item.story_id) : null;
            const isPublic = item.visibility === 'public';

            return (
              <div
                key={item.id}
                style={{
                  background: '#17110c',
                  border: '1px solid #362619',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: isPublic ? 'rgba(16, 185, 129, 0.15)' : '#221a13',
                        color: isPublic ? '#6ee7b7' : '#d4af37',
                        border: `1px solid ${isPublic ? 'rgba(16, 185, 129, 0.3)' : '#362619'}`,
                        fontWeight: '600',
                      }}
                    >
                      {isPublic ? <Globe size={12} /> : <Lock size={12} />}
                      {isPublic ? 'Publik' : 'Privat'}
                    </span>
                    <span style={{ fontSize: '11px', color: '#bfae9c', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={11} /> {new Date(item.updated_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#fcfaf2', fontWeight: '700' }}>{item.title}</h3>
                  <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#bfae9c', lineHeight: '1.4' }}>
                    {item.description || 'Tidak ada deskripsi.'}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '11px', color: '#bfae9c', marginBottom: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Layers size={13} color="#d4af37" /> {sceneCount} Adegan
                    </span>
                    {refStory && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <BookOpen size={13} color="#d4af37" /> Rujukan: {refStory.title}
                      </span>
                    )}
                  </div>
                </div>

                {/* Toolbar Aksi */}
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #231a13', paddingTop: '14px' }}>
                  <button
                    onClick={() => handleReopenInStudio(item)}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #d4af37, #8b4513)',
                      border: 'none',
                      color: '#0d0a07',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 10px rgba(212, 175, 55, 0.25)',
                    }}
                  >
                    <Edit size={14} /> Buka di Studio
                  </button>

                  <button
                    onClick={() => {
                      if (onPlayPerformance) onPlayPerformance(item);
                    }}
                    title="Putar Pertunjukan"
                    style={{
                      background: '#221a13',
                      border: '1px solid #362619',
                      color: '#d4af37',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Play size={14} fill="#d4af37" />
                  </button>

                  <button
                    onClick={() => handleDuplicate(item)}
                    title="Duplikasi Karya"
                    style={{
                      background: '#221a13',
                      border: '1px solid #362619',
                      color: '#fcfaf2',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Copy size={14} />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    title="Hapus Karya"
                    style={{
                      background: 'rgba(153, 27, 27, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      color: '#fca5a5',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
