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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px', color: 'var(--text-main, #fbf8ee)' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #2b1b11, #140e09)',
          border: '1px solid #5a3b22',
          borderRadius: '16px',
          padding: '28px',
          marginBottom: '24px',
          boxShadow: '0 12px 35px rgba(0,0,0,0.65)',
        }}
      >
        <div style={{ display: 'inline-block', background: '#8b4513', border: '1px solid #d4af37', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', color: '#fcf6e8', marginBottom: '8px' }}>
          ARSIP KREATIF TERHUBUNG
        </div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#fcf6e8' }}>
          Galeri Karya Publik & Jaringan Budaya
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#bfae9c', maxWidth: '750px', lineHeight: '1.6' }}>
          Saksikan interpretasi lakon wayang yang dirancang oleh generasi muda. Setiap karya terhubung langsung ke sumber naskah cerita dan watak filosofis tokoh pewayangan.
        </p>
      </div>

      {publicWorks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', background: '#16110c', borderRadius: '16px', border: '1px solid #362619' }}>
          <Globe size={40} color="#d4af37" style={{ marginBottom: '10px' }} />
          <h3 style={{ margin: '0 0 6px 0', color: '#fcf6e8' }}>Belum Ada Karya Publik</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#bfae9c' }}>
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
                  background: '#16110c',
                  border: '1px solid #362619',
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
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      color: '#d4af37',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: '700',
                      letterSpacing: '0.04em',
                      marginBottom: '12px',
                    }}
                  >
                    <ShieldCheck size={13} /> INTERPRETASI KREATIF PENGGUNA
                  </div>

                  <h3 style={{ margin: '0 0 8px 0', fontSize: '19px', color: '#fcfaf2', fontWeight: '700' }}>{work.title}</h3>
                  <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#bfae9c', lineHeight: '1.5' }}>
                    {work.description || 'Pertunjukan kreasi wayang digital virtual.'}
                  </p>

                  {/* Relasi Cerita Sumber (FR-15) */}
                  {refStory && (
                    <div
                      onClick={() => onNavigateToStory && onNavigateToStory(refStory.slug)}
                      style={{
                        background: '#221a13',
                        border: '1px solid #362619',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        marginBottom: '14px',
                        fontSize: '12px',
                        color: '#fcfaf2',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', color: '#d4af37', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <BookOpen size={13} /> Lakon Rujukan:
                        </div>
                        <div style={{ color: '#fcfaf2' }}>{refStory.title} ({refStory.tradition})</div>
                      </div>
                      <ExternalLink size={13} color="#d4af37" />
                    </div>
                  )}

                  {/* Relasi Tokoh yang Digunakan (FR-15 - Navigasi Relasi) */}
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#bfae9c', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Users size={13} color="#d4af37" /> Tokoh Terhubung ({usedCharacters.length}):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {usedCharacters.map((char) => (
                        <button
                          key={char.id}
                          onClick={() => onNavigateToCharacter && onNavigateToCharacter(char.slug)}
                          title={`Buka profil ${char.name}`}
                          style={{
                            background: '#221a13',
                            border: `1px solid ${char.accentColor || '#362619'}`,
                            color: '#fcfaf2',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {char.name} <ExternalLink size={10} color={char.accentColor || '#d4af37'} />
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
                    background: 'linear-gradient(135deg, #d4af37, #8b4513)',
                    border: 'none',
                    color: '#0d0a07',
                    padding: '11px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Play size={15} fill="#0d0a07" /> Tonton Pertunjukan ({scenes.length} Adegan)
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
