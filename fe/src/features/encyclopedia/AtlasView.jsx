import React, { useState, useEffect } from 'react';
import { STORIES_MASTER } from '../../data/master/storiesMaster';
import { CHARACTERS_MASTER } from '../../data/master/charactersMaster';
import { AUDIO_MASTER } from '../../data/master/audioMaster';
import WayangFigureSvg from '../../components/stage/WayangFigureSvg';
import soundEngine from '../../services/soundscape';
import {
  Search,
  Play,
  ChevronDown,
  Shield,
  X,
} from 'lucide-react';

// Aset Visual Hero Section Sesuai Referensi Pengguna (SS 1, SS 2, SS 3)
import heroParchmentWideBg from '../../assets/hero_parchment_clouds_widescreen_hd.jpg';
import atlasGoldMotifStrip from '../../assets/atlas_gold_motif_strip.jpg';
import gununganHd from '../../assets/gunungan_kayon_hd.png';
import JavaneseCloudBackground from '../../components/ui/JavaneseCloudBackground';
import WayangCoverflowCarousel from '../../components/ui/WayangCoverflowCarousel';
import WayangDuelShadowBg from '../../components/ui/WayangDuelShadowBg';
import AtlasStoryShowcase from './AtlasStoryShowcase';
import WayangTopAudioCarousel from '../../components/ui/WayangTopAudioCarousel';

// Gambar Otentik Lakon & Tokoh Sesuai Cardbox Halaman Beranda
import galleryCoverGatotkaca from '../../assets/gallery_cover_gatotkaca.jpg';
import lakonCoverDewaRuci from '../../assets/lakon_cover_dewa_ruci.jpg';
import lakonCoverShintaObong from '../../assets/lakon_cover_shinta_obong.jpg';
import dalangPerformanceHeritage from '../../assets/dalang_performance_heritage.jpg';
import gamelanOrchestraHeritage from '../../assets/gamelan_orchestra_heritage.jpg';
import tatahSunggingCraft from '../../assets/tatah_sungging_craft.jpg';
import wayangCardGatotkaca from '../../assets/wayang_card_gatotkaca.jpg';
import wayangCardArjuna from '../../assets/wayang_card_arjuna.jpg';
import wayangCardShinta from '../../assets/wayang_card_shinta.jpg';
import wayangCardBima from '../../assets/wayang_card_bima.jpg';
import wayangCardKarna from '../../assets/wayang_card_karna.jpg';
import wayangCardRahwana from '../../assets/wayang_card_rahwana.jpg';
import wayangCardSemar from '../../assets/wayang_card_semar.jpg';

const AUDIO_POSTERS = {
  1: gamelanOrchestraHeritage,
  2: dalangPerformanceHeritage,
  3: lakonCoverShintaObong,
  4: tatahSunggingCraft,
  5: galleryCoverGatotkaca,
  6: lakonCoverDewaRuci,
};

const STORY_ASSETS = {
  'gugurnya-ghatotkaca': {
    coverImg: galleryCoverGatotkaca,
    traditionBadge: 'Gagrag Mataram',
    versionPakem: 'Serat Bharatayuddha',
    provenanceSource: 'Reksa Pustaka',
  },
  'karno-tanding': {
    coverImg: dalangPerformanceHeritage,
    traditionBadge: 'Gagrag Mataram',
    versionPakem: 'Serat Bharatayuddha',
    provenanceSource: 'Reksa Pustaka',
  },
  'dewa-ruci': {
    coverImg: lakonCoverDewaRuci,
    traditionBadge: 'Gaya Surakarta',
    versionPakem: 'Serat Dewa Ruci',
    provenanceSource: 'Museum Radyapustaka',
  },
  'shinta-obong': {
    coverImg: lakonCoverShintaObong,
    traditionBadge: 'Tradisi Ramayana',
    versionPakem: 'Kakawin Ramayana',
    provenanceSource: 'Balai Pustaka',
  },
};

const CHAR_ASSETS = {
  gatotkaca: wayangCardGatotkaca,
  arjuna: wayangCardArjuna,
  shinta: wayangCardShinta,
  bima: wayangCardBima,
  karna: wayangCardKarna,
  rahwana: wayangCardRahwana,
  semar: wayangCardSemar,
};

const FILTER_CHIPS = [
  { id: 'all', label: 'Semua' },
  { id: 'stories', label: 'Lakon Cerita' },
  { id: 'characters', label: 'Tokoh Wayang' },
  { id: 'audio', label: 'Tata Suara' },
];

export default function AtlasView({ onPlayCharacterOnStage }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [selectedStoryModal, setSelectedStoryModal] = useState(null);
  const [selectedCharModal, setSelectedCharModal] = useState(null);
  const [previewPose, setPreviewPose] = useState('default');

  // Bersihkan pemutaran audio gending saat pengguna berpindah tab/halaman
  useEffect(() => {
    return () => {
      soundEngine.stopBgm();
    };
  }, []);

  const q = searchQuery.toLowerCase().trim();

  // Filter Lakon Cerita
  const filteredStories = STORIES_MASTER.filter((s) => {
    const textMatch =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.synopsis.toLowerCase().includes(q) ||
      (s.shortSynopsis && s.shortSynopsis.toLowerCase().includes(q)) ||
      s.tradition.toLowerCase().includes(q) ||
      s.philosophy.toLowerCase().includes(q);

    if (!textMatch) return false;

    if (activeFilter === 'all' || activeFilter === 'stories') return true;
    return false;
  });

  // Filter Tokoh Wayang
  const filteredCharacters = CHARACTERS_MASTER.filter((c) => {
    const textMatch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.alias.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      (c.shortDesc && c.shortDesc.toLowerCase().includes(q)) ||
      c.weapons.toLowerCase().includes(q) ||
      c.typeName.toLowerCase().includes(q);

    if (!textMatch) return false;

    if (activeFilter === 'all' || activeFilter === 'characters') return true;
    return false;
  });

  // Filter Tata Suara
  const filteredAudio = AUDIO_MASTER.filter((a) => {
    const textMatch =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.instrument.toLowerCase().includes(q) ||
      a.mood.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q);

    if (!textMatch) return false;

    if (activeFilter === 'all' || activeFilter === 'audio') return true;
    return false;
  });

  const handleToggleAudio = (audio) => {
    if (playingAudioId === audio.id) {
      soundEngine.stopBgm();
      setPlayingAudioId(null);
    } else {
      if (audio.category === 'bgm') {
        soundEngine.startBgm(audio.synthType, audio.title);
      } else if (audio.category === 'sfx') {
        if (audio.synthType === 'dodogan') soundEngine.playDodogan();
        else if (audio.synthType === 'kepyak') soundEngine.playKepyak();
        else if (audio.synthType === 'gong') soundEngine.playGong();
      }
      setPlayingAudioId(audio.id);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: 'var(--bg-deep, #0d0a07)',
        color: 'var(--text-main, #fbf8ee)',
        paddingBottom: '60px',
      }}
    >
      {/* ============================================================
          HERO SECTION STORY ATLAS (1 Halaman Penuh 100vh Seperti Beranda,
          Latar Belakang Ultra-HD 16:9 SS 2, & Strip Motif Batik Emas SS 3)
          ============================================================ */}
      <section
        style={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: 'clamp(75px, 10vh, 115px) clamp(16px, 3vw, 24px) clamp(35px, 5vh, 75px) clamp(16px, 3vw, 24px)',
          overflow: 'hidden',
          background: '#0d0a07',
          boxSizing: 'border-box',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
        }}
      >
        {/* Layer Background: Latar Perkamen Awan Tradisional Warm Bronze HD (Sama persis dengan Beranda) */}
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
            filter: 'contrast(1.0) brightness(0.88)',
          }}
        />

        {/* 1. Top Shadow Gradient: Menyelaraskan latar belakang dengan Navbar agar tidak kontras/tabrakan (Persis Beranda) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '200px',
            background:
              'linear-gradient(to bottom, rgba(13, 10, 7, 0.92) 0%, rgba(13, 10, 7, 0.60) 90px, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* 2. Harmonious Center Ambient Overlay: Meneduhkan area tengah agar teks terbaca jernih tanpa silau/kontras tajam (Persis Beranda) */}
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

        {/* 3. Bottom Gradient: Transisi lembut pelebur bayangan dasar hero & ornamen gunungan */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '140px',
            background:
              'linear-gradient(to top, rgba(13, 10, 7, 0.85) 0%, rgba(13, 10, 7, 0.35) 60%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Motif Awan Tradisional Jawa Otentik dengan Animasi Mengambang & Bergeser Halus (Berada di atas backdrop layer 2) */}
        <JavaneseCloudBackground variant="hero" theme="dark" opacity={0.65} animated={true} style={{ zIndex: 3 }} />

        {/* Ornamen Gunungan HD di Kiri & Kanan (Selaras Persis dengan Hero Galeri Publik & Panggung Kelir) */}
        <div
          className="hero-gunungan-frame-left"
          style={{
            position: 'absolute',
            left: '-15px',
            bottom: '0',
            height: 'clamp(340px, 55vh, 530px)',
            width: 'clamp(200px, 32vh, 330px)',
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
            src={gununganHd}
            alt="Gunungan Kelir Kiri HD"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        <div
          className="hero-gunungan-frame-right"
          style={{
            position: 'absolute',
            right: '-15px',
            bottom: '0',
            height: 'clamp(340px, 55vh, 530px)',
            width: 'clamp(200px, 32vh, 330px)',
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
            src={gununganHd}
            alt="Gunungan Kelir Kanan HD"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              transform: 'scaleX(-1)',
            }}
          />
        </div>

        {/* Konten Utama: Tipografi Klasik Mewah Terpusat Sempurna (Persis Hero Beranda) */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '920px',
            width: '100%',
            margin: '0 auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Eyebrow Budaya Nusantara (Persis Hero Beranda) */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 14px',
              borderRadius: '9999px',
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.22)',
              color: '#d4af37',
              fontSize: '10.5px',
              fontWeight: '700',
              letterSpacing: '2.2px',
              textTransform: 'uppercase',
              marginBottom: '18px',
            }}
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#d4af37' }} />
            <span>Pustaka Wiracarita & Ensiklopedi Wayang</span>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#d4af37' }} />
          </div>

          {/* Judul Besar Klasik Sesuai Tipografi PRD & SRS (Plus Jakarta Sans) - Terpusat */}
          <h1
            style={{
              margin: '0 0 22px 0',
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(32px, 5.2vw, 56px)',
              fontWeight: '850',
              color: '#fcfaf2',
              letterSpacing: '-0.6px',
              lineHeight: '1.22',
              textAlign: 'center',
            }}
          >
            Warisan Lakon Pakem & <span style={{ color: '#d4af37' }}>Tokoh Wayang</span> Nusantara
          </h1>

          {/* Deskripsi Subtitle Elegan - Terpusat */}
          <p
            style={{
              margin: '0 auto 36px auto',
              fontSize: 'clamp(14px, 1.35vw, 16.5px)',
              color: '#f0e6d8',
              lineHeight: '1.75',
              maxWidth: '720px',
              fontWeight: '450',
              textAlign: 'center',
            }}
          >
            Jelajahi naskah wiracarita klasik, filosofi watak ksatria adiluhung, rujukan babak pementasan purwa, serta tata suara gamelan tradisional yang terhubung secara otentik demi integritas budaya.
          </p>

          {/* Tombol Aksi Utama Hero (Persis Tata Letak Hero Beranda) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '14px',
              flexWrap: 'wrap',
              marginBottom: '0',
            }}
          >
            <button
              onClick={() => {
                const el = document.getElementById('atlas-content-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: '#e8bb5c',
                border: 'none',
                color: '#0d0a07',
                padding: '12px 28px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '750',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.background = '#dcae4d';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = '#e8bb5c';
              }}
            >
              <span>Jelajahi Pustaka & Lakon</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Frosted Heritage Glass Ribbon & Continuous Gliding Batik Strip (Sesuai Permintaan User) */}
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

      {/* Konten Utama Story Atlas (Latar Belakang Hangat #f5f0e4 Sesuai Section Lakon Beranda) */}
      <section
        id="atlas-light-sections"
        data-light-section="true"
        style={{
          width: '100%',
          background: '#f5f0e4',
          minHeight: '80vh',
          padding: '80px 0 100px 0',
          boxSizing: 'border-box',
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
          id="atlas-content-section"
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
          {/* 1. Header Khazanah Pustaka Wayang Sesuai Tipografi PRD & SRS (Plus Jakarta Sans) */}
          <h2
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              color: '#1a140e',
              margin: '0 0 24px 0',
              letterSpacing: '-0.02em',
            }}
          >
            Koleksi Khazanah <span style={{ color: '#d4af37' }}>Wayang Nusantara</span>
          </h2>

          {/* 2. Kapsul Search Bar Elegan (Persis Tata Letak Screenshot: Kapsul Putih, Ikon Search, Button Oranye-Emas) */}
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
              placeholder="Cari lakon cerita, tokoh wayang, atau tata suara..."
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
                fontWeight: '700',
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
              Search
            </button>
          </form>

          {/* 3. Baris Kapsul Filter Kategori */}
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
              const isActive = activeFilter === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setActiveFilter(chip.id)}
                  style={{
                    background: isActive ? '#c27827' : '#ffffff',
                    color: isActive ? '#ffffff' : '#2d1f14',
                    border: isActive ? '1px solid #c27827' : '1px solid #dcd7ce',
                    borderRadius: '9999px',
                    padding: '8px 22px',
                    fontSize: '14px',
                    fontWeight: isActive ? '700' : '600',
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

          {/* 4. TAMPILAN KONTEN KHAZANAH */}
          {/* Keadaan jika tidak ada hasil pencarian/filter sama sekali */}
          {filteredStories.length === 0 && filteredCharacters.length === 0 && filteredAudio.length === 0 && (
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
              <p style={{ fontSize: '18px', color: '#1a140e', fontWeight: '800', marginBottom: '8px' }}>
                Tidak ada koleksi yang cocok dengan kata kunci "{searchQuery}"
              </p>
              <p style={{ fontSize: '13.5px', color: '#6e5e4d', marginBottom: '22px' }}>
                Coba gunakan kata kunci lain seperti "Gatotkaca", "Arjuna", "Dewa Ruci", atau bersihkan pencarian.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                style={{
                  background: '#c27827',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '10px 26px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Tampilkan Semua Koleksi
              </button>
            </div>
          )}

          {/* A. Bagian Lakon Cerita (Cardbox Persis Halaman Beranda) */}
          {filteredStories.length > 0 && (
            <div style={{ marginBottom: filteredCharacters.length > 0 || filteredAudio.length > 0 ? '56px' : '20px' }}>
              {activeFilter === 'all' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '22px',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                    paddingBottom: '12px',
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: '24px', color: '#1a140e', fontWeight: '850', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    Lakon Cerita Wayang
                  </h3>
                  <span style={{ fontSize: '12px', color: '#8b5a1b', background: '#ffffff', border: '1px solid rgba(212, 175, 55, 0.25)', padding: '4px 14px', borderRadius: '14px', fontWeight: '750' }}>
                    {filteredStories.length} Naskah Pakem
                  </span>
                </div>
              )}

              {/* Theatrical Master Spotlight & 3D Playlist Grid Sesuai Referensi Visual Pengguna */}
              <AtlasStoryShowcase
                stories={filteredStories}
                storyAssets={STORY_ASSETS}
                onSelectStoryModal={(story) => setSelectedStoryModal(story)}
                onPlayCharacterOnStage={(charId) => {
                  if (onPlayCharacterOnStage) onPlayCharacterOnStage(charId);
                }}
              />
            </div>
          )}

          {/* B. Bagian Tokoh Wayang — Panggung Terbuka Khazanah Ksatria Nusantara */}
          {filteredCharacters.length > 0 && (
            <div style={{ marginBottom: filteredAudio.length > 0 ? '56px' : '20px' }}>
              {activeFilter === 'all' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '22px',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                    paddingBottom: '12px',
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: '24px', color: '#1a140e', fontWeight: '850', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    Tokoh & Karakter Wayang
                  </h3>
                  <span style={{ fontSize: '12px', color: '#8b5a1b', background: '#ffffff', border: '1px solid rgba(212, 175, 55, 0.25)', padding: '4px 14px', borderRadius: '14px', fontWeight: '750' }}>
                    {filteredCharacters.length} Tokoh
                  </span>
                </div>
              )}

              {/* Panggung Terbuka Tokoh Wayang (Open Canvas Kelir - Bebas Kotak Pembungkus) */}
              <div className="wayang-tokoh-section-container">
                {/* Latar Belakang Siluet Perang Tanding Kelir */}
                <WayangDuelShadowBg leftSlug="gatotkaca" rightSlug="karna" />

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <WayangCoverflowCarousel
                    characters={filteredCharacters}
                    charAssets={CHAR_ASSETS}
                    onSelectCharacter={(char) => {
                      setSelectedCharModal(char);
                      setPreviewPose('default');
                    }}
                    onPlayOnStage={(charId) => {
                      if (onPlayCharacterOnStage) onPlayCharacterOnStage(charId);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* C. Bagian Tata Suara — Netflix Top 10 Style Horizontal Carousel */}
          {filteredAudio.length > 0 && (
            <div style={{ marginBottom: '36px' }}>
              {activeFilter === 'all' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '18px',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                    paddingBottom: '12px',
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: '24px', color: '#1a140e', fontWeight: '850', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    Tata Suara & Soundscape Tradisi
                  </h3>
                  <span style={{ fontSize: '12px', color: '#8b5a1b', background: '#ffffff', border: '1px solid rgba(212, 175, 55, 0.25)', padding: '4px 14px', borderRadius: '14px', fontWeight: '750' }}>
                    {filteredAudio.length} Gamelan & SFX
                  </span>
                </div>
              )}

              <WayangTopAudioCarousel
                audioList={filteredAudio}
                playingAudioId={playingAudioId}
                onToggleAudio={handleToggleAudio}
                audioPosters={AUDIO_POSTERS}
              />
            </div>
          )}
        </div>
      </section>

      {/* MODAL 1: DETAIL LAKON CERITA (FR-02) — BESPOKE MUSEUM MANUSCRIPT DESIGN */}
      {selectedStoryModal && (() => {
        const asset = STORY_ASSETS[selectedStoryModal.slug] || {};
        const coverImg = asset.coverImg || null;
        const tradition = asset.traditionBadge || selectedStoryModal.tradition;
        const pakem = asset.versionPakem || selectedStoryModal.versionLabel;

        return (
          <div
            className="wayang-modal-backdrop"
            style={{ zIndex: 1000 }}
            onClick={() => setSelectedStoryModal(null)}
          >
            <div
              className="wayang-modal-chassis"
              style={{ maxWidth: '720px', width: '100%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="wayang-modal-hairline" />

              {/* 1. ILLUMINATED MANUSCRIPT COVER BANNER */}
              {coverImg ? (
                <div
                  style={{
                    position: 'relative',
                    height: '220px',
                    width: '100%',
                    flexShrink: 0,
                    overflow: 'hidden',
                    backgroundColor: '#120d08',
                  }}
                >
                  <img
                    src={coverImg}
                    alt={selectedStoryModal.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center 30%',
                      filter: 'brightness(0.82) contrast(1.08)',
                    }}
                  />
                  {/* Subtle Gradient Vignette Fading Smoothly into Modal Body */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(20, 14, 9, 0.22) 0%, rgba(247, 243, 234, 0.45) 45%, rgba(247, 243, 234, 0.95) 85%, #f7f3ea 100%)',
                    }}
                  />

                  {/* Top Bar: Micro Category Badge & Engineered Close Pill */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '18px',
                      left: '24px',
                      right: '20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      zIndex: 3,
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        background: 'rgba(255, 255, 255, 0.92)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(40, 28, 16, 0.08)',
                        fontSize: '10.5px',
                        fontWeight: '800',
                        letterSpacing: '0.12em',
                        color: '#8b4513',
                        textTransform: 'uppercase',
                        boxShadow: '0 2px 8px rgba(40, 28, 16, 0.08)',
                      }}
                    >
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#d4af37' }} />
                      <span>SERAT LAKON PURWA</span>
                    </div>

                    <button
                      type="button"
                      aria-label="Tutup Dialog Lakon"
                      onClick={() => setSelectedStoryModal(null)}
                      className="wayang-modal-close-btn"
                      style={{
                        width: '38px',
                        height: '38px',
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Title & Metadata inside Banner lower section */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '26px',
                      right: '26px',
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#8b4513',
                        fontWeight: '800',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        marginBottom: '4px',
                      }}
                    >
                      {tradition} • {pakem}
                    </div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: '25px',
                        fontWeight: '850',
                        color: '#1a140e',
                        fontFamily: 'Cinzel, Georgia, serif',
                        letterSpacing: '-0.02em',
                        lineHeight: '1.2',
                      }}
                    >
                      {selectedStoryModal.title}
                    </h2>
                  </div>
                </div>
              ) : (
                /* Header fallback if no cover image */
                <div
                  style={{
                    padding: '28px 28px 16px 28px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#8b4513',
                        fontWeight: '800',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                      }}
                    >
                      SERAT LAKON PURWA • {tradition} ({pakem})
                    </div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: '24px',
                        fontWeight: '850',
                        color: '#1a140e',
                        fontFamily: 'Cinzel, Georgia, serif',
                      }}
                    >
                      {selectedStoryModal.title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    aria-label="Tutup Dialog Lakon"
                    onClick={() => setSelectedStoryModal(null)}
                    className="wayang-modal-close-btn"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {/* 2. EDITORIAL MANUSCRIPT CONTENT (ANTI-BOX SOUP) */}
              <div
                className="wayang-modal-inner modal-custom-scroll"
                style={{
                  padding: '24px 28px 28px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                {/* A. Sinopsis Lakon — Clean Editorial Prose */}
                <div>
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', color: '#8b4513', fontWeight: '800', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      Ringkasan & Alur Kisah
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '14.5px',
                      lineHeight: '1.85',
                      color: '#3d2b1f',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {selectedStoryModal.synopsis}
                  </p>
                </div>

                {/* B. Makna Filosofis — Sacred Illuminated Pull-Quote */}
                <div
                  style={{
                    position: 'relative',
                    padding: '16px 20px',
                    borderRadius: '10px',
                    border: '1px solid rgba(212, 175, 55, 0.28)',
                    background: '#ffffff',
                    boxShadow: '0 2px 8px rgba(40, 28, 16, 0.04)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      fontWeight: '800',
                      color: '#8b4513',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                    }}
                  >
                    <span>Piwulang Luhur & Hakikat Filosofis</span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '14px',
                      lineHeight: '1.7',
                      color: '#1a140e',
                      fontStyle: 'italic',
                      fontFamily: 'Georgia, serif',
                    }}
                  >
                    "{selectedStoryModal.philosophy}"
                  </p>
                </div>

                {/* C. Catatan Filologi & Provenance — Architectural Ledger */}
                <div>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', color: '#6e5e4d', fontWeight: '800', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      Rujukan Filologi & Sumber Pakem
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                      gap: '12px 24px',
                      fontSize: '12.5px',
                    }}
                  >
                    {selectedStoryModal.sources.map((src, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div style={{ color: '#8b4513', fontWeight: '750' }}>{src.title}</div>
                        <div style={{ color: '#5c4a3b', fontSize: '12px' }}>
                          Pujangga / Sumber: <span style={{ color: '#1a140e', fontWeight: '600' }}>{src.author}</span>
                        </div>
                        <div style={{ color: '#7a6858', fontSize: '11.5px' }}>
                          Rujukan: {src.reference} • {src.rightsNote}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* D. Balanced Footer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '18px',
                    marginTop: '6px',
                    borderTop: '1px solid rgba(40, 28, 16, 0.06)',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ fontSize: '11.5px', color: '#6e5e4d', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', background: '#d4af37' }} />
                    <span>Preservasi Budaya Wayang Digital Indonesia</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedStoryModal(null)}
                    className="wayang-btn-ghost"
                  >
                    Tutup Pratinjau
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL 2: DETAIL PROFIL KARAKTER & UJI POSE (FR-03) — BESPOKE ARCHIVAL SHOWCASE */}
      {selectedCharModal && (
        <div
          className="wayang-modal-backdrop"
          style={{ zIndex: 1000 }}
          onClick={() => setSelectedCharModal(null)}
        >
          <div
            className="wayang-modal-chassis"
            style={{ maxWidth: '820px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="wayang-modal-hairline" />

            {/* Header Dialog */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                padding: '24px 28px 16px 28px',
                borderBottom: 'none',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: selectedCharModal.accentColor || '#d4af37' }} />
                  <span style={{ fontSize: '10.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: selectedCharModal.accentColor || '#8b4513', fontWeight: '800' }}>
                    ENSIKLOPEDIA TOKOH WAYANG
                  </span>
                  <span style={{ opacity: 0.4, color: '#8b5a1b' }}>•</span>
                  <span style={{ fontSize: '11px', color: '#5c4a3b', fontWeight: '700' }}>
                    {selectedCharModal.typeName}
                  </span>
                </div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '26px',
                    color: '#1a140e',
                    fontWeight: '850',
                    fontFamily: 'Cinzel, Georgia, serif',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {selectedCharModal.name}
                </h2>
                <div style={{ fontSize: '13px', color: '#8b4513', fontStyle: 'italic', marginTop: '2px', fontWeight: '600' }}>
                  {selectedCharModal.alias}
                </div>
              </div>

              <button
                type="button"
                aria-label="Tutup Dialog Tokoh"
                onClick={() => setSelectedCharModal(null)}
                className="wayang-modal-close-btn"
                style={{ width: '38px', height: '38px' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Grid Pedestal Preview & Watak (No Repetitive Boxes) */}
            <div
              className="wayang-modal-inner modal-custom-scroll"
              style={{ padding: '24px 28px 28px 28px' }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '28px',
                  alignItems: 'start',
                  marginBottom: '24px',
                }}
              >
                {/* Kolom Kiri: Pedestal Kelir & Uji Pose */}
                <div
                  style={{
                    background: 'radial-gradient(circle at 50% 35%, rgba(45, 32, 20, 0.5) 0%, rgba(13, 9, 6, 0.95) 100%)',
                    borderRadius: '16px',
                    padding: '24px 20px',
                    border: '1px solid rgba(212, 175, 55, 0.22)',
                    boxShadow: 'inset 0 2px 14px rgba(0,0,0,0.6)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ marginBottom: '14px' }}>
                    <WayangFigureSvg
                      slug={selectedCharModal.slug}
                      pose={previewPose}
                      scale={0.88}
                      width={160}
                      height={220}
                      accentColor={selectedCharModal.accentColor}
                    />
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#bfae9c', marginBottom: '12px' }}>
                    Pose Aktif: <strong style={{ color: selectedCharModal.accentColor || '#d4af37' }}>{previewPose.toUpperCase()}</strong>
                  </div>

                  {/* Tombol Pilihan Pose */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                    {selectedCharModal.availablePoses.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPreviewPose(p)}
                        style={{
                          background: previewPose === p ? 'linear-gradient(135deg, #e8bb5c 0%, #d4af37 100%)' : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${previewPose === p ? '#d4af37' : 'rgba(212, 175, 55, 0.22)'}`,
                          color: previewPose === p ? '#0d0a07' : '#fcfaf2',
                          fontWeight: previewPose === p ? '800' : '650',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '11.5px',
                          cursor: 'pointer',
                          textTransform: 'capitalize',
                          minHeight: '34px',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kolom Kanan: Watak, Senjata, dan Nilai Luhur (Unboxed Flow) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Watak & Karakteristik */}
                  <div>
                    <div style={{ fontSize: '11px', color: '#8b4513', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Watak & Karakteristik
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', color: '#3d2b1f', lineHeight: '1.8' }}>
                      {selectedCharModal.description}
                    </p>
                  </div>

                  {/* Senjata & Pusaka */}
                  <div>
                    <div style={{ fontSize: '11px', color: '#6e5e4d', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Senjata & Pusaka Utama
                    </div>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#ffffff',
                        border: '1px solid rgba(212, 175, 55, 0.35)',
                        borderRadius: '9999px',
                        padding: '5px 14px',
                        fontSize: '12.5px',
                        fontWeight: '750',
                        color: '#1a140e',
                        boxShadow: '0 2px 8px rgba(40, 28, 16, 0.04)',
                      }}
                    >
                      <Shield size={13} color="#8b4513" />
                      <span>{selectedCharModal.weapons}</span>
                    </div>
                  </div>

                  {/* Nilai Luhur Manuscript Pull-Quote */}
                  <div
                    style={{
                      padding: '16px 20px',
                      borderRadius: '10px',
                      border: '1px solid rgba(212, 175, 55, 0.28)',
                      background: '#ffffff',
                      boxShadow: '0 2px 8px rgba(40, 28, 16, 0.04)',
                    }}
                  >
                    <div style={{ fontSize: '10.5px', color: '#8b4513', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Nilai Luhur Tokoh
                    </div>
                    <p style={{ margin: 0, fontSize: '13.5px', color: '#1a140e', lineHeight: '1.65', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
                      "{selectedCharModal.philosophy}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: '12px',
                  borderTop: '1px solid rgba(212, 175, 55, 0.25)',
                  paddingTop: '18px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedCharModal(null)}
                  className="wayang-btn-ghost"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onPlayCharacterOnStage) onPlayCharacterOnStage(selectedCharModal.id);
                    setSelectedCharModal(null);
                  }}
                  className="wayang-btn-cta"
                  style={{ justifyContent: 'space-between' }}
                >
                  <span>Mainkan di Virtual Stage</span>
                  <span className="wayang-btn-cta-icon">
                    <Play size={13} fill="#16100a" color="#16100a" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

