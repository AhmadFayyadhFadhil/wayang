import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import persistenceService from '../../services/persistenceService';
import { getStoryById } from '../../data/master/storiesMaster';
import { getCharacterById } from '../../data/master/charactersMaster';
import {
  Globe,
  Play,
  BookOpen,
  Users,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export default function ConnectedArchiveView({ onPlayPerformance, onNavigateToCharacter, onNavigateToStory }) {
  const [publicWorks, setPublicWorks] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const loadPublicWorks = async () => {
      try {
        const res = await apiClient.get('/public/performances');
        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          if (isMounted) setPublicWorks(res.data.data);
          return;
        }
      } catch (_e) {
        // Fallback ke local cache jika server offline
      }

      const all = persistenceService.getLocalWorks();
      const publics = all.filter((w) => w.visibility === 'public');
      if (isMounted) setPublicWorks(publics);
    };

    loadPublicWorks();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px', color: '#f3f4f6' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b24, #121016)',
          border: '1px solid #3d334a',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ display: 'inline-block', background: '#b45309', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>
          ARSIP KREATIF TERHUBUNG
        </div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#fef3c7' }}>
          Galeri Karya Publik & Jaringan Budaya
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#d1d5db', maxWidth: '750px', lineHeight: '1.6' }}>
          Saksikan interpretasi lakon wayang yang dirancang oleh generasi muda. Setiap karya terhubung langsung ke sumber naskah cerita dan watak filosofis tokoh pewayangan.
        </p>
      </div>

      {publicWorks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', background: '#131922', borderRadius: '16px', border: '1px solid #202b3a' }}>
          <Globe size={40} color="#38bdf8" style={{ marginBottom: '10px' }} />
          <h3 style={{ margin: '0 0 6px 0', color: '#f0f9ff' }}>Belum Ada Karya Publik</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
            Simpan lakon Anda dengan visibilitas "Publik" agar tampil di galeri ini.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '20px' }}>
          {publicWorks.map((work) => {
            const sceneData = typeof work.scene_data === 'string' ? JSON.parse(work.scene_data) : work.scene_data;
            const scenes = sceneData?.scenes || [];
            const refStory = work.story_id ? getStoryById(work.story_id) : null;

            // Ekstrak karakter unik yang dipakai di seluruh adegan (Connected by Design)
            const usedCharIds = new Set();
            scenes.forEach((s) => (s.characters || []).forEach((c) => usedCharIds.add(c.characterId)));
            const usedCharacters = Array.from(usedCharIds)
              .map((id) => getCharacterById(id))
              .filter(Boolean);

            return (
              <div
                key={work.id}
                style={{
                  background: '#151b26',
                  border: '1px solid #253347',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                }}
              >
                <div>
                  {/* Badge Atribusi Cultural Integrity */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#38bdf8',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      marginBottom: '10px',
                    }}
                  >
                    <ShieldCheck size={13} /> INTERPRETASI KREATIF PENGGUNA
                  </div>

                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#f0f9ff' }}>{work.title}</h3>
                  <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                    {work.description || 'Pertunjukan kreasi wayang digital virtual.'}
                  </p>

                  {/* Relasi Cerita Sumber (FR-15) */}
                  {refStory && (
                    <div
                      onClick={() => onNavigateToStory && onNavigateToStory(refStory.slug)}
                      style={{
                        background: '#1d2737',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        fontSize: '11px',
                        color: '#bae6fd',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#38bdf8', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <BookOpen size={12} /> Cerita Rujukan:
                        </div>
                        <div>{refStory.title} ({refStory.tradition})</div>
                      </div>
                      <ExternalLink size={12} color="#38bdf8" />
                    </div>
                  )}

                  {/* Relasi Tokoh yang Digunakan (FR-15 - Navigasi Relasi) */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={12} color="#f59e0b" /> Tokoh Terhubung ({usedCharacters.length}):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {usedCharacters.map((char) => (
                        <button
                          key={char.id}
                          onClick={() => onNavigateToCharacter && onNavigateToCharacter(char.slug)}
                          title={`Buka filosofi ${char.name}`}
                          style={{
                            background: '#243247',
                            border: `1px solid ${char.accentColor || '#38bdf8'}`,
                            color: '#f8fafc',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          {char.name} <ExternalLink size={9} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tombol Nonton Pertunjukan */}
                <button
                  onClick={() => onPlayPerformance && onPlayPerformance(work)}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                    border: 'none',
                    color: '#fff',
                    padding: '10px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 15px rgba(2, 132, 199, 0.3)',
                  }}
                >
                  <Play size={15} fill="#fff" /> Tonton Pertunjukan ({scenes.length} Adegan)
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
