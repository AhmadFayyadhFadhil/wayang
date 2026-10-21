import React, { useState, useEffect, useMemo } from 'react';
import { apiClient } from '../../services/api';
import persistenceService from '../../services/persistenceService';
import { getStoryById } from '../../data/master/storiesMaster';
import {
  Search,
  Play,
  BookOpen,
  ChevronDown,
  Compass,
  Music,
  Layers,
} from 'lucide-react';

// Aset Visual Heritage & Ornamen Budaya
import heroParchmentWideBg from '../../assets/hero_parchment_clouds_widescreen_hd.jpg';
import atlasGoldMotifStrip from '../../assets/atlas_gold_motif_strip.jpg';
import gununganKayonHd from '../../assets/gunungan_kayon_hd.png';
import JavaneseCloudBackground from '../../components/ui/JavaneseCloudBackground';
import galleryCoverGatotkaca from '../../assets/gallery_cover_gatotkaca.jpg';
import dalangPerformanceHeritage from '../../assets/dalang_performance_heritage.jpg';
import tatahSunggingCraft from '../../assets/tatah_sungging_craft.jpg';
import gamelanOrchestraHeritage from '../../assets/gamelan_orchestra_heritage.jpg';
import lakonCoverShintaObong from '../../assets/lakon_cover_shinta_obong.jpg';
import lakonCoverDewaRuci from '../../assets/lakon_cover_dewa_ruci.jpg';

// 4 Pementasan Unggulan Terkurasi dengan Deskripsi Singkat, Padat, dan Jelas
const TOP_4_PERFORMANCES = [
  {
    id: 'top-1',
    rank: '01',
    title: 'Bharatayuddha: Gugurnya Ghatotkaca',
    subtitle: 'Palagan Kurusetra • Senopati Udara Melawan Panah Kunta',
    dalang: 'Ki Seno Purwanto',
    epos: 'Mahabharata • Bharatayuddha',
    category: 'mahabharata',
    badge: 'Pilihan Kurator #01',
    description:
      'Laga malam Kurusetra: Pengorbanan Sang Senopati Udara menahan panah Kunta Wijayadanu demi dharma Pandawa.',
    coverImg: galleryCoverGatotkaca,
    gending: 'Laras Slendro Srepeg',
    sanad: 'Serat Kakawin Bharatayuddha',
    storyId: 1,
    storySlug: 'bharatayuddha-kurusetra',
    characterIds: [1, 3, 2],
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
    subtitle: 'Palagan Kurusetra • Duel Dharma Dua Ksatria Bersaudara',
    dalang: 'Ki Manteb Soedharsono (Adaptasi)',
    epos: 'Mahabharata • Karna Parwa',
    category: 'mahabharata',
    badge: 'Pilihan Kurator #02',
    description:
      'Duel agung dua ksatria bersaudara kandung di Kurusetra untuk menunaikan sumpah satria dan takdir dharma.',
    coverImg: dalangPerformanceHeritage,
    gending: 'Laras Slendro Sampak Manyura',
    sanad: 'Mahabharata Parwa Sansekerta',
    storyId: 1,
    storySlug: 'bharatayuddha-kurusetra',
    characterIds: [2, 3, 4],
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
    subtitle: 'Taman Argasoka • Kobaran Api Suci Sang Wanara Putih',
    dalang: 'Nyi Sri Sulastri',
    epos: 'Ramayana Purwa',
    category: 'ramayana',
    badge: 'Pilihan Kurator #03',
    description:
      'Aksi Duta Wanara Putih Hanoman meloloskan diri dan menyulut api suci membumihanguskan benteng Rahwana.',
    coverImg: lakonCoverShintaObong || tatahSunggingCraft,
    gending: 'Laras Slendro Srepeg Lasem',
    sanad: 'Serat Ramayana Kakawin',
    storyId: 2,
    storySlug: 'ramayana-anoman-obong',
    characterIds: [5, 2],
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
    title: 'Dewa Ruci: Samudra Minangkalbu',
    subtitle: 'Laku Batin • Wejangan Suci Tirta Perwitasari',
    dalang: 'Ki Sugito Purbacarita',
    epos: 'Serat Dewa Ruci',
    category: 'dewaruci',
    badge: 'Pilihan Kurator #04',
    description:
      'Pencarian spiritual Raden Werkudara menyelami samudra raya demi wejangan suci dan kasampurnan urip.',
    coverImg: lakonCoverDewaRuci || gamelanOrchestraHeritage,
    gending: 'Laras Pelog Ayak-Ayak',
    sanad: 'Serat Dewa Ruci Yasadipura I',
    storyId: 3,
    storySlug: 'dewa-ruci-bima-suci',
    characterIds: [4, 2],
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

const FILTER_CHIPS = [
  { id: 'all', label: 'Semua Pagelaran' },
  { id: 'mahabharata', label: 'Mahabharata' },
  { id: 'ramayana', label: 'Ramayana' },
  { id: 'dewaruci', label: 'Serat Dewa Ruci' },
  { id: 'community', label: 'Karya Komunitas' },
];

export default function ConnectedArchiveView({
  onPlayPerformance,
  onNavigateToStory,
}) {
  const [publicWorks, setPublicWorks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    let isMounted = true;
    const loadPublicWorks = async () => {
      try {
        const res = await apiClient.get('/public/performances');
        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          if (isMounted) setPublicWorks(res.data.data);
          return;
        }
      } catch {
        // Fallback mulus ke localStorage jika backend offline
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

  // Gabungkan dan normalisasi seluruh pementasan (Terkurasi + Publik Komunitas)
  const allPerformances = useMemo(() => {
    const curated = TOP_4_PERFORMANCES.map((item) => ({
      ...item,
      isCommunity: false,
      scenesCount: item.scene_data?.scenes?.length || 1,
    }));

    const community = publicWorks.map((work) => {
      let sceneData = work.scene_data;
      if (typeof sceneData === 'string') {
        try {
          sceneData = JSON.parse(sceneData);
        } catch {
          sceneData = { scenes: [] };
        }
      }
      const scenes = sceneData?.scenes || [];
      const refStory = work.story_id ? getStoryById(work.story_id) : null;
      const charNames = Array.from(
        new Set(scenes.flatMap((s) => (s.characters || []).map((c) => c.name || 'Tokoh Wayang')))
      );

      return {
        id: work.id,
        rank: null,
        title: work.title,
        subtitle: refStory ? `Karya Komunitas • Adaptasi ${refStory.title}` : 'Karya Dalang Komunitas Digital',
        dalang: work.author || 'Dalang Komunitas Wayangverse',
        epos: refStory ? `Pakem: ${refStory.title}` : 'Kreasi Lakon Mandiri',
        category: 'community',
        badge: 'Karya Komunitas',
        description: work.description || 'Pementasan lakon wayang digital gubahan dalang komunitas Wayangverse.',
        coverImg: dalangPerformanceHeritage,
        gending: 'Laras Gamelan Panggung',
        sanad: refStory?.pakemSource || 'Arsip Publik Wayangverse',
        storyId: work.story_id || null,
        storySlug: refStory?.slug || null,
        characterIds: [],
        characterNames: charNames.length > 0 ? charNames : ['Tokoh Pementasan'],
        scene_data: sceneData,
        isCommunity: true,
        scenesCount: scenes.length || 1,
      };
    });

    return [...curated, ...community];
  }, [publicWorks]);

  // Filter & Search Engine
  const filteredPerformances = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allPerformances.filter((item) => {
      // Filter Kategori
      if (activeCategory === 'mahabharata' && item.category !== 'mahabharata') return false;
      if (activeCategory === 'ramayana' && item.category !== 'ramayana') return false;
      if (activeCategory === 'dewaruci' && item.category !== 'dewaruci') return false;
      if (activeCategory === 'community' && !item.isCommunity) return false;

      // Filter Pencarian Teks
      if (!q) return true;
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchDalang = item.dalang?.toLowerCase().includes(q);
      const matchEpos = item.epos?.toLowerCase().includes(q);
      const matchChars = (item.characterNames || []).some((c) => c.toLowerCase().includes(q));

      return matchTitle || matchDesc || matchDalang || matchEpos || matchChars;
    });
  }, [allPerformances, activeCategory, searchQuery]);

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#0d0a07', color: '#fcfaf2' }}>
      {/* ============================================================
          1. HERO SECTION CINEMATIC ALAMI (Full 100vh, Bersih, Anti-Slop)
          ============================================================ */}
      <section
        id="archive-hero-section"
        style={{
          width: '100%',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          background: '#0d0a07',
          padding: '130px 24px 90px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          boxSizing: 'border-box',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
        }}
      >
        {/* Layer Background Perkamen Awan Tradisional Warm Bronze HD */}
        <img
          src={heroParchmentWideBg}
          alt="Latar Perkamen Awan Tradisional Horizontal HD"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'bottom center',
            zIndex: 1,
            filter: 'contrast(1.02) brightness(0.78)',
          }}
        />

        {/* Top Shadow Gradient Menyelaraskan dengan Floating Navbar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '210px',
            background:
              'linear-gradient(to bottom, rgba(13, 10, 7, 0.94) 0%, rgba(13, 10, 7, 0.65) 100px, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Ambient Center Overlay: Meneduhkan Area Tengah agar Teks Terbaca Tajam */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 75% 70% at 50% 48%, rgba(16, 11, 7, 0.62) 0%, rgba(18, 12, 8, 0.40) 60%, rgba(10, 7, 5, 0.65) 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Bottom Gradient Transisi Lembut ke Bagian Konten Terang */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '220px',
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(13, 10, 7, 0.35) 35%, rgba(13, 10, 7, 0.88) 75%, #120b06 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Motif Awan Tradisional Jawa Otentik dengan Animasi Mengambang & Bergeser Halus (Berada di atas backdrop layer 2) */}
        <JavaneseCloudBackground variant="hero" theme="dark" opacity={0.55} animated={true} style={{ zIndex: 2 }} />

        {/* Ornamen Wayang Gunungan Kiri */}
        <div
          className="hero-gunungan-frame-left"
          style={{
            position: 'absolute',
            left: '-15px',
            bottom: '0',
            height: '530px',
            width: '330px',
            zIndex: 4,
            opacity: 0.78,
            pointerEvents: 'none',
            filter: 'none',
            maskImage:
              'linear-gradient(to bottom, black 65%, rgba(0, 0, 0, 0.5) 85%, transparent 98%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 65%, rgba(0, 0, 0, 0.5) 85%, transparent 98%)',
          }}
        >
          <img
            src={gununganKayonHd}
            alt="Wayang Gunungan Kiri"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Ornamen Wayang Gunungan Kanan */}
        <div
          className="hero-gunungan-frame-right"
          style={{
            position: 'absolute',
            right: '-15px',
            bottom: '0',
            height: '530px',
            width: '330px',
            zIndex: 4,
            opacity: 0.78,
            pointerEvents: 'none',
            filter: 'none',
            maskImage:
              'linear-gradient(to bottom, black 65%, rgba(0, 0, 0, 0.5) 85%, transparent 98%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 65%, rgba(0, 0, 0, 0.5) 85%, transparent 98%)',
          }}
        >
          <img
            src={gununganKayonHd}
            alt="Wayang Gunungan Kanan"
            style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scaleX(-1)' }}
          />
        </div>

        {/* Konten Hero Terpusat Sederhana & Berwibawa */}
        <div
          style={{
            maxWidth: '920px',
            width: '100%',
            position: 'relative',
            zIndex: 10,
            margin: '0 auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Eyebrow Budaya Nusantara */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.22)',
              color: '#d4af37',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              marginBottom: '18px',
            }}
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#d4af37' }} />
            <span>PANGGUNG TERBUKA PAGELARAN NUSANTARA</span>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#d4af37' }} />
          </div>

          {/* Headline Utama Selaras Tipografi Atlas & Beranda */}
          <h1
            style={{
              margin: '0 0 20px 0',
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(28px, 4.8vw, 56px)',
              fontWeight: '850',
              color: '#fcfaf2',
              letterSpacing: '-0.5px',
              lineHeight: '1.22',
              textAlign: 'center',
            }}
          >
            Khazanah Pagelaran & <span style={{ color: '#d4af37' }}>Pentas Wayang</span>
          </h1>

          {/* Subjudul Narasi Singkat, Padat, dan Jelas */}
          <p
            style={{
              margin: '0 auto 34px auto',
              fontSize: 'clamp(15px, 1.5vw, 17px)',
              color: '#f0e6d8',
              lineHeight: '1.8',
              maxWidth: '720px',
              fontWeight: '450',
              textAlign: 'center',
            }}
          >
            Panggung kelir digital nusantara. Saksikan lakon wiracarita luhur dan kreasi pedalangan modern dalam format dua dimensi interaktif.
          </p>

          {/* Tombol Aksi Tunggal yang Tenang & Jelas (Persis AtlasView) */}
          <button
            onClick={() => {
              const el = document.getElementById('archive-light-sections');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              background: 'linear-gradient(135deg, #e8bb5c 0%, #d4af37 100%)',
              border: '1px solid rgba(245, 215, 127, 0.45)',
              color: '#1a120b',
              padding: '13px 32px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '750',
              letterSpacing: '0.2px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              minHeight: '44px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.25)';
            }}
          >
            <span>Jelajahi Koleksi Pagelaran</span>
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Frosted Heritage Glass Ribbon & Continuous Gliding Batik Strip */}
        <div className="heritage-frosted-glass-ribbon">
          <div className="heritage-glass-specular-highlight" />
          <div
            className="infinite-batik-conveyor"
            style={{
              backgroundImage: `url(${atlasGoldMotifStrip})`,
            }}
          />
        </div>
      </section>

      {/* ============================================================
          2. LIGHT PARCHMENT ZONE (#f5f0e4)
          Navbar otomatis beralih ke mode terang di area ini
          ============================================================ */}
      <section
        id="archive-light-sections"
        data-light-section="true"
        style={{
          width: '100%',
          background: '#f5f0e4',
          minHeight: '80vh',
          padding: '80px 0 100px 0',
          boxSizing: 'border-box',
          color: '#1a140e',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top Soft Gradient: Transisi lembut dari kelir soga gelap ke kanvas gading hangat */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '70px',
            background:
              'linear-gradient(to bottom, rgba(18, 11, 6, 0.12) 0%, rgba(212, 175, 55, 0.04) 40%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />
        {/* Motif Awan Tradisional Jawa Halus (Hanya di margin tepi, tidak menabrak cardbox) */}
        <JavaneseCloudBackground variant="flanking" theme="light" opacity={0.20} animated={true} />

        <div
          style={{
            maxWidth: '1280px',
            width: '100%',
            margin: '0 auto',
            padding: '0 24px',
            boxSizing: 'border-box',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Section Header */}
          <h2
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              color: '#1a140e',
              margin: '0 0 12px 0',
              letterSpacing: '-0.02em',
            }}
          >
            Koleksi Pagelaran <span style={{ color: '#c27827' }}>Wayang Digital</span>
          </h2>

          <p
            style={{
              textAlign: 'center',
              fontSize: '15px',
              color: '#6e5e4d',
              maxWidth: '680px',
              margin: '0 auto 36px auto',
              lineHeight: '1.7',
            }}
          >
            Pilih lakon untuk menyaksikan pementasan wayang kulit dua dimensi dengan tata suara gamelan otentik.
          </p>

          {/* Kapsul Search Bar Elegan (Persis AtlasView) */}
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{
              maxWidth: '820px',
              width: '100%',
              margin: '0 auto 20px auto',
              background: '#ffffff',
              border: 'none',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
              borderRadius: '9999px',
              padding: '5px 6px 5px 22px',
              display: 'flex',
              alignItems: 'center',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Search size={22} style={{ color: '#78716c', marginRight: '14px', flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari lakon pagelaran, dalang, atau wiracarita..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: '#1a130d',
                fontSize: '15px',
                fontWeight: '500',
                fontFamily: 'inherit',
                padding: '10px 0',
                minWidth: '100px',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8a7d6e',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  marginRight: '6px',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              style={{
                background: '#c27827',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '12px 34px',
                fontSize: '15px',
                fontWeight: '750',
                cursor: 'pointer',
                letterSpacing: '0.02em',
                flexShrink: 0,
                boxShadow: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ad671d';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#c27827';
              }}
            >
              Cari
            </button>
          </form>

          {/* Baris Kapsul Filter Kategori (Persis AtlasView) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              flexWrap: 'wrap',
              marginBottom: '46px',
            }}
          >
            {FILTER_CHIPS.map((chip) => {
              const isActive = activeCategory === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setActiveCategory(chip.id)}
                  style={{
                    background: isActive ? '#c27827' : '#ffffff',
                    color: isActive ? '#ffffff' : '#2d1f14',
                    border: isActive ? '1px solid #c27827' : '1px solid #dcd7ce',
                    borderRadius: '9999px',
                    padding: '8px 22px',
                    fontSize: '14px',
                    fontWeight: isActive ? '750' : '600',
                    cursor: 'pointer',
                    boxShadow: 'none',
                    transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = '#c27827';
                      e.currentTarget.style.color = '#c27827';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = '#dcd7ce';
                      e.currentTarget.style.color = '#2d1f14';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* ============================================================
              BARIS HEADER KATALOG (Persis Story Atlas - Rapi, Tanpa Duplikasi)
              ============================================================ */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              paddingBottom: '12px',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: '22px',
                color: '#1a140e',
                fontWeight: '850',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              Daftar Pagelaran Wayang
            </h3>
            <span
              style={{
                fontSize: '12px',
                color: '#8b5a1b',
                background: '#ffffff',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                padding: '4px 14px',
                borderRadius: '14px',
                fontWeight: '750',
              }}
            >
              {filteredPerformances.length} Pagelaran
            </span>
          </div>

          {/* ============================================================
              GRID KATALOG PAGELARAN (Cardbox Bersih Sesuai AtlasView)
              ============================================================ */}
          {filteredPerformances.length === 0 ? (
            /* Keadaan Kosong (Empty State Bersih) */
            <div
              style={{
                textAlign: 'center',
                padding: '60px 24px',
                background: '#ffffff',
                borderRadius: '26px',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
                maxWidth: '640px',
                margin: '30px auto',
              }}
            >
              <Compass size={36} color="#8b5a1b" style={{ margin: '0 auto 14px auto' }} />
              <p style={{ fontSize: '18px', color: '#1a140e', fontWeight: '800', marginBottom: '8px' }}>
                Tidak ada pagelaran yang cocok dengan kata kunci "{searchQuery}"
              </p>
              <p style={{ fontSize: '13.5px', color: '#6e5e4d', marginBottom: '22px' }}>
                Coba gunakan kata kunci lain seperti "Gatotkaca", "Karna", "Anoman", atau reset filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                style={{
                  background: '#c27827',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '10px 26px',
                  fontSize: '13.5px',
                  fontWeight: '750',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                Tampilkan Semua Pagelaran
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                gap: '28px',
              }}
            >
              {filteredPerformances.map((item) => {
                return (
                  <div
                    key={item.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '20px',
                      border: '1px solid rgba(0, 0, 0, 0.06)',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                      boxShadow: '0 2px 10px rgba(40, 28, 16, 0.04)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(40, 28, 16, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.06)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(40, 28, 16, 0.04)';
                    }}
                  >
                    {/* Visual Cover Gambar 16:9 dengan Badge Tunggal Bersih */}
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '210px',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        background: '#090705',
                        marginBottom: '20px',
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
                          display: 'block',
                          transition: 'transform 0.4s ease',
                        }}
                      />

                      {/* Badge Tradisi / Kategori Tunggal Bersih di Pojok Kiri Atas */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          background: 'rgba(255, 255, 255, 0.96)',
                          backdropFilter: 'blur(8px)',
                          borderRadius: '9999px',
                          padding: '5px 12px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                          fontSize: '11px',
                          fontWeight: '800',
                          color: '#1a140e',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          pointerEvents: 'none',
                        }}
                      >
                        {item.badge || item.epos}
                      </div>
                    </div>

                    {/* Informasi Konten Teks & Tombol Aksi */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        {/* Meta Stack Rapi & Alami (Tanpa AI Slop) */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '10px',
                            fontSize: '12px',
                            color: '#8b5a1b',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}
                        >
                          <span>{item.epos}</span>
                          <span style={{ color: '#dcd7ce' }}>•</span>
                          <span>{item.dalang}</span>
                        </div>

                        {/* Judul Lakon */}
                        <h3
                          style={{
                            margin: '0 0 10px 0',
                            fontSize: '20px',
                            fontWeight: '850',
                            color: '#1a140e',
                            letterSpacing: '-0.3px',
                            lineHeight: '1.35',
                          }}
                        >
                          {item.title}
                        </h3>

                        {/* Deskripsi Singkat, Padat, dan Jelas (TIDAK KEPOTONG / FULL DISPLAY) */}
                        <p
                          style={{
                            margin: '0 0 14px 0',
                            fontSize: '13.5px',
                            color: '#655342',
                            lineHeight: '1.6',
                          }}
                        >
                          {item.description}
                        </p>

                        {/* Sajian Gending & Jumlah Babak */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '12.5px',
                            color: '#786c5e',
                            marginBottom: '20px',
                          }}
                        >
                          <Music size={13} style={{ color: '#8b5a1b' }} />
                          <span>{item.gending}</span>
                          <span style={{ color: '#dcd7ce' }}>•</span>
                          <Layers size={13} style={{ color: '#8b5a1b' }} />
                          <span>{item.scenesCount} Babak</span>
                        </div>
                      </div>

                      {/* Tombol Aksi Utama Bersih (1 Tombol Utama + Opsi Naskah Jika Ada) */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: 'auto' }}>
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
                            padding: '12px 20px',
                            borderRadius: '12px',
                            fontSize: '13.5px',
                            fontWeight: '750',
                            letterSpacing: '0.01em',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxShadow: 'none',
                            transition: 'background 0.2s ease, transform 0.2s ease',
                            minHeight: '44px',
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
                          <Play size={15} fill="#0d0a07" />
                          <span>Tonton Pagelaran</span>
                        </button>

                        {item.storySlug && (
                          <button
                            onClick={() => onNavigateToStory && onNavigateToStory(item.storySlug)}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #dcd7ce',
                              color: '#2d1f14',
                              padding: '12px 14px',
                              borderRadius: '12px',
                              fontSize: '13px',
                              fontWeight: '650',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              transition: 'all 0.2s ease',
                              minHeight: '44px',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#c27827';
                              e.currentTarget.style.color = '#c27827';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = '#dcd7ce';
                              e.currentTarget.style.color = '#2d1f14';
                            }}
                            title="Buka naskah cerita pakem"
                          >
                            <BookOpen size={15} />
                            <span>Naskah</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
