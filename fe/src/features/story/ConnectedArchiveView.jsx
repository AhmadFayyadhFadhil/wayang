import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import persistenceService from '../../services/persistenceService';
import { getStoryById } from '../../data/master/storiesMaster';
import { getCharacterById } from '../../data/master/charactersMaster';
import { Compass } from 'lucide-react';

// Cover Assets Berkualitas Tinggi untuk 4 Pementasan Terpopuler
import galleryCoverGatotkaca from '../../assets/gallery_cover_gatotkaca.jpg';
import dalangPerformanceHeritage from '../../assets/dalang_performance_heritage.jpg';
import tatahSunggingCraft from '../../assets/tatah_sungging_craft.jpg';
import gamelanOrchestraHeritage from '../../assets/gamelan_orchestra_heritage.jpg';

// 4 Pementasan Unggulan Terkurasi Sesuai Format Leaderboard Top 4
const TOP_4_PERFORMANCES = [
  {
    id: 'top-1',
    rank: '01',
    title: 'Bharatayuddha: Gugurnya Ghatotkaca',
    description: 'Pertempuran sengit malam hari di padang Kurusetra antara Senopati Udara Raden Gatotkaca melawan Adipati Karna bersenjatakan pusaka Kunta Wijayadanu.',
    coverImg: galleryCoverGatotkaca,
    stat1: 'LAKON: BHARATAYUDDHA',
    stat2: '4 BABAK MEDAN LAGA',
    stat3: 'GENDING: SLENDRO SREPEG',
    storyId: 1,
    storySlug: 'bharatayuddha-kurusetra',
    characterIds: [1, 3, 2], // Gatotkaca, Karna, Arjuna
    characterNames: ['Raden Gatotkaca', 'Adipati Karna', 'Raden Arjuna'],
    scene_data: {
      scenes: [
        {
          id: 'sc-top1-1',
          title: 'Pergerakan Pasukan Kurusetra Malam',
          background: 'kelir-blencong-default',
          durationMs: 4500,
          audioAssetId: 1,
          characters: [
            {
              instanceId: 'inst-karna-1',
              characterId: 3,
              name: 'Adipati Karna',
              slug: 'karna',
              x: 0.72,
              y: 0.68,
              scale: 1.0,
              pose: 'perang',
              facing: 'left',
              dialogue: 'Wengi iki Kurusetra dadi seksi, Senjata Kunta wus cumawis nembus angkasa!',
              accentColor: '#f97316',
            },
          ],
        },
        {
          id: 'sc-top1-2',
          title: 'Gatotkaca Nyamber ing Awang-awang',
          background: 'kelir-blencong-default',
          durationMs: 5000,
          audioAssetId: 1,
          characters: [
            {
              instanceId: 'inst-gatot-1',
              characterId: 1,
              name: 'Raden Gatotkaca',
              slug: 'gatotkaca',
              x: 0.35,
              y: 0.42,
              scale: 1.05,
              pose: 'default',
              facing: 'right',
              dialogue: 'Duh Karna, aja bungah dhisik! Otot kawat balung wesi ora bakal gigrig!',
              accentColor: '#eab308',
            },
            {
              instanceId: 'inst-karna-2',
              characterId: 3,
              name: 'Adipati Karna',
              slug: 'karna',
              x: 0.76,
              y: 0.68,
              scale: 1.0,
              pose: 'perang',
              facing: 'left',
              dialogue: 'Tampanana panah Kunta Wijayadanu iki, Gatotkaca!',
              accentColor: '#f97316',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'top-2',
    rank: '02',
    title: 'Karno Tanding: Panah Kyai Pasopati',
    description: 'Puncak duel takdir dua ksatria bersaudara kandung seibu di atas kereta kencana perang Kurusetra, mempertemukan keagungan ilmu panah Arjuna dan keteguhan satria Karna.',
    coverImg: dalangPerformanceHeritage,
    stat1: 'LAKON: BHARATAYUDDHA',
    stat2: '5 BABAK SATRIA',
    stat3: 'GENDING: SAMPAK MANYURA',
    storyId: 1,
    storySlug: 'bharatayuddha-kurusetra',
    characterIds: [2, 3, 4], // Arjuna, Karna, Bima
    characterNames: ['Raden Arjuna', 'Adipati Karna', 'Raden Werkudara'],
    scene_data: {
      scenes: [
        {
          id: 'sc-top2-1',
          title: 'Adep-adepan Kereta Perang',
          background: 'kelir-blencong-default',
          durationMs: 4500,
          audioAssetId: 2,
          characters: [
            {
              instanceId: 'inst-arjuna-1',
              characterId: 2,
              name: 'Raden Arjuna',
              slug: 'arjuna',
              x: 0.28,
              y: 0.68,
              scale: 0.98,
              pose: 'default',
              facing: 'right',
              dialogue: 'Kakang Karna, sanadyan kita sedulur, pakurmatan marang dharma kudu madeg!',
              accentColor: '#0ea5e9',
            },
            {
              instanceId: 'inst-karna-3',
              characterId: 3,
              name: 'Adipati Karna',
              slug: 'karna',
              x: 0.74,
              y: 0.68,
              scale: 1.0,
              pose: 'perang',
              facing: 'left',
              dialogue: 'Iki dharma satria, Janaka. Ayo padha tuntasake ing puncaking Kurusetra!',
              accentColor: '#f97316',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'top-3',
    rank: '03',
    title: 'Ramayana: Anoman Obong Alengka',
    description: 'Aksi kepahlawanan sang duta kera putih Hanoman yang meloloskan diri dari kepungan raksasa dan menyulut api suci membumihanguskan benteng kezaliman Rahwana.',
    coverImg: tatahSunggingCraft,
    stat1: 'LAKON: RAMAYANA PURWA',
    stat2: '3 BABAK DUTA SUCI',
    stat3: 'GENDING: SREPEG LASEM',
    storyId: 2,
    storySlug: 'ramayana-anoman-obong',
    characterIds: [5, 2], // Dewi Shinta, Arjuna
    characterNames: ['Dewi Shinta', 'Raden Arjuna', 'Ksatria Wanara'],
    scene_data: {
      scenes: [
        {
          id: 'sc-top3-1',
          title: 'Taman Argasoka & Kobaran Api',
          background: 'kelir-blencong-default',
          durationMs: 4500,
          audioAssetId: 1,
          characters: [
            {
              instanceId: 'inst-shinta-1',
              characterId: 5,
              name: 'Dewi Shinta',
              slug: 'shinta',
              x: 0.3,
              y: 0.68,
              scale: 0.95,
              pose: 'sembah',
              facing: 'right',
              dialogue: 'Duh Sang Hyang Widhi, slametake sang utusan suci saka pangepunge raksasa Alengka!',
              accentColor: '#ec4899',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'top-4',
    rank: '04',
    title: 'Dewa Ruci: Samudra Sunyata Bima Suci',
    description: 'Perjalanan kontemplasi spiritual Raden Werkudara menyelami dasar Samudra Minangkalbu untuk menemukan Tirta Pawitra dan wejangan hakikat kasampurnan urip.',
    coverImg: gamelanOrchestraHeritage,
    stat1: 'LAKON: SERAT PURWA',
    stat2: '4 BABAK MAKRIFAT',
    stat3: 'GENDING: AYAK-AYAK SLENDRO',
    storyId: 3,
    storySlug: 'dewa-ruci-bima-suci',
    characterIds: [4, 2], // Bima, Arjuna
    characterNames: ['Raden Werkudara', 'Raden Arjuna'],
    scene_data: {
      scenes: [
        {
          id: 'sc-top4-1',
          title: 'Dasar Samudra Minangkalbu',
          background: 'kelir-blencong-default',
          durationMs: 5000,
          audioAssetId: 3,
          characters: [
            {
              instanceId: 'inst-bima-1',
              characterId: 4,
              name: 'Raden Werkudara',
              slug: 'bima',
              x: 0.35,
              y: 0.68,
              scale: 1.1,
              pose: 'default',
              facing: 'right',
              dialogue: 'Aku ora bakal mundur sanadyan samudra muntap, netepake dhawuhe Guru Durna!',
              accentColor: '#10b981',
            },
          ],
        },
      ],
    },
  },
];

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
        // Fallback ke local storage
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
    <div
      style={{
        maxWidth: '1160px',
        margin: '0 auto',
        padding: '24px 20px 80px 20px',
        color: '#fcfaf2',
        boxSizing: 'border-box',
      }}
    >
      {/* ============================================================
          HEADER HALAMAN GALERI (Tipografi Bersih & Elegan)
          ============================================================ */}
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <h1
          style={{
            fontSize: 'clamp(28px, 4.2vw, 42px)',
            fontWeight: '850',
            color: '#fcfaf2',
            letterSpacing: '-0.5px',
            margin: '0 0 12px 0',
            lineHeight: '1.2',
          }}
        >
          Leaderboard Top 4 <span style={{ color: '#d4af37' }}>Pementasan Wayang</span>
        </h1>
        <p
          style={{
            fontSize: '15px',
            color: '#b5a492',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: '1.65',
          }}
        >
          Karya pementasan lakon wayang digital terkurasi dengan kelir interaktif dua dimensi, visual tatah-sungging otentik, dan naskah pakem bersejarah.
        </p>
      </div>

      {/* ============================================================
          GRID 2x2 KARTU PEMENTASAN (Sesuai Layout Desain Referensi)
          ============================================================ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
          gap: '24px',
          marginBottom: '56px',
        }}
      >
        {TOP_4_PERFORMANCES.map((item) => (
          <div
            key={item.id}
            style={{
              background: '#120d09',
              border: '1px solid rgba(212, 175, 55, 0.16)',
              borderRadius: '20px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'border-color 0.25s ease, transform 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.42)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.16)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Bagian Atas: Media Image 16:9 dengan Badge Nomor & Bar Metrik */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '240px',
                overflow: 'hidden',
                background: '#090705',
              }}
            >
              <img
                src={item.coverImg}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />

              {/* Badge Nomor di Pojok Kanan Atas (01, 02, 03, 04) */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '20px',
                  fontSize: '32px',
                  fontWeight: '700',
                  fontFamily: 'monospace, var(--font-sans)',
                  color: 'rgba(255, 255, 255, 0.78)',
                  lineHeight: 1,
                  letterSpacing: '1px',
                  pointerEvents: 'none',
                }}
              >
                {item.rank}
              </div>

              {/* Bar Metrik Teks di Bawah Gambar (Sesuai Referensi ROI | Win Rate | AUM) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '28px 18px 12px 18px',
                  background: 'linear-gradient(to top, rgba(10, 7, 5, 0.96) 0%, rgba(10, 7, 5, 0.65) 65%, transparent 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '11px',
                  fontWeight: '650',
                  color: '#e4d6c2',
                  letterSpacing: '0.04em',
                  pointerEvents: 'none',
                }}
              >
                <span>{item.stat1}</span>
                <span style={{ color: 'rgba(212, 175, 55, 0.45)' }}>|</span>
                <span>{item.stat2}</span>
                <span style={{ color: 'rgba(212, 175, 55, 0.45)' }}>|</span>
                <span>{item.stat3}</span>
              </div>
            </div>

            {/* Bagian Bawah: Judul, Deskripsi & Tombol Aksi Interaktif */}
            <div
              style={{
                padding: '24px 24px 22px 24px',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h2
                  style={{
                    margin: '0 0 10px 0',
                    fontSize: '21px',
                    fontWeight: '800',
                    color: '#fcfaf2',
                    letterSpacing: '-0.3px',
                    lineHeight: '1.3',
                  }}
                >
                  {item.title}
                </h2>

                <p
                  style={{
                    margin: '0 0 18px 0',
                    fontSize: '13.5px',
                    color: '#b5a492',
                    lineHeight: '1.65',
                  }}
                >
                  {item.description}
                </p>

                {/* Tokoh Terhubung (Badge Pills) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '22px' }}>
                  {item.characterNames.map((name, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'rgba(212, 175, 55, 0.08)',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        color: '#d4af37',
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: '650',
                      }}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tombol Aksi */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  onClick={() =>
                    onPlayPerformance({
                      id: item.id,
                      title: item.title,
                      description: item.description,
                      scene_data: item.scene_data,
                    })
                  }
                  style={{
                    flex: 1,
                    background: '#e8bb5c',
                    border: 'none',
                    color: '#0d0a07',
                    padding: '11px 20px',
                    borderRadius: '20px',
                    fontSize: '13.5px',
                    fontWeight: '750',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#dcae4d';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#e8bb5c';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Tonton Pertunjukan
                </button>

                <button
                  onClick={() => onNavigateToStory && onNavigateToStory(item.storySlug)}
                  style={{
                    background: '#1c150f',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    color: '#fcfaf2',
                    padding: '11px 20px',
                    borderRadius: '20px',
                    fontSize: '13.5px',
                    fontWeight: '650',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#281c14';
                    e.currentTarget.style.borderColor = '#d4af37';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#1c150f';
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Naskah
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================
          KARYA TAMBAHAN KOMUNITAS / PENGGUNA (Jika ada karya baru)
          ============================================================ */}
      {publicWorks.length > 0 && (
        <div style={{ marginTop: '20px', borderTop: '1px solid rgba(212, 175, 55, 0.14)', paddingTop: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Compass size={18} color="#d4af37" />
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fcfaf2', margin: 0 }}>
              Karya Pengguna Tersimpan
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
            {publicWorks.map((work) => {
              const sceneData = typeof work.scene_data === 'string' ? JSON.parse(work.scene_data) : work.scene_data;
              const scenes = sceneData?.scenes || [];
              const refStory = work.story_id ? getStoryById(work.story_id) : null;

              return (
                <div
                  key={work.id}
                  style={{
                    background: '#120d09',
                    border: '1px solid rgba(212, 175, 55, 0.16)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', color: '#fcfaf2', fontWeight: '750' }}>
                      {work.title}
                    </h3>
                    <p style={{ margin: '0 0 12px 0', fontSize: '12.5px', color: '#b5a492', lineHeight: '1.5' }}>
                      {work.description || 'Pertunjukan karya kreator digital Wayangverse.'}
                    </p>
                    {refStory && (
                      <div style={{ fontSize: '11.5px', color: '#d4af37', marginBottom: '14px' }}>
                        Lakon: {refStory.title}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onPlayPerformance && onPlayPerformance(work)}
                    style={{
                      background: '#e8bb5c',
                      border: 'none',
                      color: '#0d0a07',
                      padding: '10px 20px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '750',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#dcae4d';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#e8bb5c';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Putar ({scenes.length} Babak)
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
