import React, { useState } from 'react';
import { STORIES_MASTER } from '../../data/master/storiesMaster';
import { CHARACTERS_MASTER } from '../../data/master/charactersMaster';
import { AUDIO_MASTER } from '../../data/master/audioMaster';
import WayangFigureSvg from '../../components/stage/WayangFigureSvg';
import soundEngine from '../../services/soundscape';
import {
  Search,
  Play,
  Square,
  ChevronDown,
} from 'lucide-react';

// Aset Visual Hero Section Sesuai Referensi Pengguna (SS 1, SS 2, SS 3)
import heroParchmentWideBg from '../../assets/hero_parchment_clouds_widescreen_hd.jpg';
import atlasGoldMotifStrip from '../../assets/atlas_gold_motif_strip.jpg';
import gununganHd from '../../assets/gunungan_kayon_hd.png';

// Gambar Otentik Lakon & Tokoh Sesuai Cardbox Halaman Beranda
import galleryCoverGatotkaca from '../../assets/gallery_cover_gatotkaca.jpg';
import lakonCoverDewaRuci from '../../assets/lakon_cover_dewa_ruci.jpg';
import lakonCoverShintaObong from '../../assets/lakon_cover_shinta_obong.jpg';
import wayangCardGatotkaca from '../../assets/wayang_card_gatotkaca.jpg';
import wayangCardArjuna from '../../assets/wayang_card_arjuna.jpg';
import wayangCardShinta from '../../assets/wayang_card_shinta.jpg';
import wayangCardBima from '../../assets/wayang_card_bima.jpg';

const STORY_ASSETS = {
  'gugurnya-ghatotkaca': {
    coverImg: galleryCoverGatotkaca,
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
};

const FILTER_CHIPS = [
  { id: 'all', label: 'Semua' },
  { id: 'stories', label: 'Lakon Cerita' },
  { id: 'characters', label: 'Tokoh Wayang' },
  { id: 'audio', label: 'Tata Suara' },
  { id: 'mahabharata', label: 'Mahabharata' },
  { id: 'ramayana', label: 'Ramayana' },
  { id: 'pandawa', label: 'Pandawa' },
  { id: 'punakawan', label: 'Punakawan' },
];

export default function AtlasView({ onPlayCharacterOnStage }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [selectedStoryModal, setSelectedStoryModal] = useState(null);
  const [selectedCharModal, setSelectedCharModal] = useState(null);
  const [previewPose, setPreviewPose] = useState('default');

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
    if (activeFilter === 'audio' || activeFilter === 'characters') return false;
    if (activeFilter === 'mahabharata') {
      return (
        s.tradition.toLowerCase().includes('mataram') ||
        s.title.toLowerCase().includes('bharatayuddha') ||
        s.title.toLowerCase().includes('dewa ruci') ||
        s.synopsis.toLowerCase().includes('kurusetra') ||
        s.synopsis.toLowerCase().includes('pandawa')
      );
    }
    if (activeFilter === 'ramayana') {
      return (
        s.title.toLowerCase().includes('ramayana') ||
        s.synopsis.toLowerCase().includes('alengka') ||
        s.synopsis.toLowerCase().includes('shinta')
      );
    }
    if (activeFilter === 'pandawa') {
      return s.synopsis.toLowerCase().includes('pandawa') || s.characterIds?.some((id) => [1, 2, 4].includes(id));
    }
    if (activeFilter === 'punakawan') {
      return s.characterIds?.includes(5);
    }
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
    if (activeFilter === 'stories' || activeFilter === 'audio') return false;
    if (activeFilter === 'mahabharata') {
      return ['gatotkaca', 'arjuna', 'karna', 'bima', 'semar'].includes(c.slug);
    }
    if (activeFilter === 'ramayana') {
      return ['rahwana'].includes(c.slug);
    }
    if (activeFilter === 'pandawa') {
      return ['gatotkaca', 'arjuna', 'bima'].includes(c.slug);
    }
    if (activeFilter === 'punakawan') {
      return c.type === 'punakawan' || c.slug === 'semar';
    }
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
    if (['stories', 'characters', 'pandawa', 'punakawan'].includes(activeFilter)) return false;
    if (activeFilter === 'mahabharata') {
      return a.title.toLowerCase().includes('mataram') || a.title.toLowerCase().includes('slendro');
    }
    if (activeFilter === 'ramayana') {
      return a.title.toLowerCase().includes('alengka');
    }
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
          padding: '130px 24px 90px 24px',
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

        {/* 3. Bottom Gradient: Transisi lembut ke bagian bawah hero & motif batik (Persis Beranda) */}
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

        {/* Ornamen Gunungan HD di Kiri & Kanan (Mengipas Perlahan & Menyatu dengan Latar Persis Beranda) */}
        <div
          className="hero-gunungan-frame-left"
          style={{
            position: 'absolute',
            left: '-15px',
            bottom: '0',
            height: '530px',
            width: '330px',
            zIndex: 3,
            opacity: 0.78,
            pointerEvents: 'none',
            filter: 'none',
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
            height: '530px',
            width: '330px',
            zIndex: 3,
            opacity: 0.78,
            pointerEvents: 'none',
            filter: 'none',
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

        {/* Konten Utama: Tipografi Klasik Mewah Sesuai Tata Letak SS 1 */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '880px',
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >

          {/* Judul Besar Klasik Sesuai Tipografi PRD & SRS (Plus Jakarta Sans) - Alami Bersih Tanpa Shadow */}
          <h1
            style={{
              margin: '0 0 20px 0',
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(34px, 4.8vw, 56px)',
              fontWeight: '850',
              color: '#fcfaf2',
              letterSpacing: '-0.5px',
              lineHeight: '1.22',
            }}
          >
            Warisan Lakon Pakem & <span style={{ color: '#d4af37' }}>Tokoh Wayang</span> Nusantara
          </h1>

          {/* Deskripsi Subtitle Elegan - Alami Bersih Tanpa Shadow */}
          <p
            style={{
              margin: '0 auto',
              fontSize: 'clamp(15px, 1.5vw, 17px)',
              color: '#f0e6d8',
              lineHeight: '1.8',
              maxWidth: '740px',
              fontWeight: '450',
            }}
          >
            Jelajahi naskah wiracarita klasik, filosofi watak ksatria adiluhung, rujukan babak pementasan purwa, serta tata suara gamelan tradisional yang terhubung secara otentik demi integritas budaya.
          </p>
        </div>

        {/* Indikator Gulir / Scroll Cue ke Konten Ensiklopedi */}
        <button
          onClick={() => {
            const el = document.getElementById('atlas-content-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          style={{
            position: 'absolute',
            bottom: '52px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            zIndex: 20,
            background: 'none',
            border: 'none',
            padding: '8px 16px',
            color: '#d4af37',
            opacity: 0.85,
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateX(-50%) translateY(2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.85';
            e.currentTarget.style.transform = 'translateX(-50%) translateY(0)';
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: '750',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            Jelajahi Arsip & Lakon
          </span>
          <ChevronDown size={19} />
        </button>

        {/* Strip Motif Batik Emas di Bagian Bawah Hero Sesuai Permintaan SS 3 */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40px',
            backgroundImage: `url(${atlasGoldMotifStrip})`,
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'center bottom',
            backgroundSize: 'auto 40px',
            borderTop: '1px solid rgba(212, 175, 55, 0.65)',
            boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.15)',
            zIndex: 15,
          }}
        />
      </section>

      {/* Konten Utama Story Atlas (Latar Belakang Hangat #f5f0e4 Sesuai Section Lakon Beranda) */}
      <section
        id="atlas-light-sections"
        style={{
          width: '100%',
          background: '#f5f0e4',
          minHeight: '80vh',
          padding: '80px 0 100px 0',
          boxSizing: 'border-box',
        }}
      >
        <div
          id="atlas-content-section"
          style={{
            maxWidth: '1280px',
            width: '100%',
            margin: '0 auto',
            padding: '0 24px',
            boxSizing: 'border-box',
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
                    {filteredStories.length} Naskah
                  </span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
                {filteredStories.map((story) => {
                  const asset = STORY_ASSETS[story.slug] || {
                    coverImg: galleryCoverGatotkaca,
                    traditionBadge: story.tradition || 'Gagrag Mataram',
                    versionPakem: story.versionLabel || 'Naskah Pakem',
                    provenanceSource: story.sources?.[0]?.title || 'Reksa Pustaka',
                  };

                  return (
                    <div
                      key={story.id}
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
                      {/* 1. Visual Cover Gambar dengan Badge Tradisi Pakem di Kiri Atas (Tanpa Ikon) */}
                      <div
                        style={{
                          position: 'relative',
                          width: '100%',
                          height: '220px',
                          borderRadius: '20px',
                          overflow: 'hidden',
                          background: '#090705',
                          marginBottom: '22px',
                        }}
                      >
                        <img
                          src={asset.coverImg}
                          alt={story.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            display: 'block',
                            transition: 'transform 0.4s ease',
                          }}
                        />

                        {/* Badge Tradisi Pakem Sesuai SRS tradition (Tanpa Ikon) */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '14px',
                            left: '14px',
                            background: 'rgba(255, 255, 255, 0.96)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '9999px',
                            padding: '6px 14px',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.14)',
                            fontSize: '11px',
                            fontWeight: '800',
                            color: '#1a140e',
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            pointerEvents: 'none',
                          }}
                        >
                          {asset.traditionBadge}
                        </div>
                      </div>

                      {/* 2. Informasi Konten Teks & Tombol Aksi dengan Spasi Lega dan Rapi */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          flex: 1,
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          {/* Meta Stack: Label Teks Vertikal Seragam untuk Semua Kartu (Pakem di atas, Sumber di bawah) */}
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              marginBottom: '16px',
                              fontSize: '13px',
                              lineHeight: '1.45',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span
                                style={{
                                  color: '#8b5a1b',
                                  fontWeight: '750',
                                  fontSize: '12px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.03em',
                                }}
                              >
                                Pakem:
                              </span>
                              <span style={{ color: '#2b2118', fontWeight: '600' }}>
                                {asset.versionPakem}
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span
                                style={{
                                  color: '#8b5a1b',
                                  fontWeight: '750',
                                  fontSize: '12px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.03em',
                                }}
                              >
                                Sumber:
                              </span>
                              <span style={{ color: '#2b2118', fontWeight: '600' }}>
                                {asset.provenanceSource}
                              </span>
                            </div>
                          </div>

                          {/* Judul Lakon (Warna Teks Soga Charcoal Bersih & Kontras) */}
                          <h3
                            style={{
                              margin: '0 0 14px 0',
                              fontSize: '20px',
                              fontWeight: '800',
                              color: '#1a140e',
                              letterSpacing: '-0.3px',
                              lineHeight: '1.35',
                              minHeight: '54px',
                            }}
                          >
                            {story.title}
                          </h3>

                          {/* Deskripsi / Sinopsis Naskah Singkat, Padat, Jelas, & Informatif (Warna Abu Lembut Tidak Kontras) */}
                          <p
                            style={{
                              margin: '0 0 24px 0',
                              fontSize: '13.5px',
                              color: '#6b7280',
                              lineHeight: '1.6',
                              minHeight: '44px',
                            }}
                          >
                            {story.shortSynopsis || story.shortDesc || story.synopsis}
                          </p>
                        </div>

                        {/* 3. Tombol Aksi Sesuai PRD PR-01 / SRS FR-01: Buka Naskah Pakem */}
                        <button
                          onClick={() => setSelectedStoryModal(story)}
                          style={{
                            width: '100%',
                            background: '#e8bb5c',
                            border: 'none',
                            color: '#0d0a07',
                            padding: '14px 24px',
                            borderRadius: '9999px',
                            fontSize: '14px',
                            fontWeight: '750',
                            letterSpacing: '0.01em',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'none',
                            transition: 'background 0.2s ease, transform 0.2s ease',
                            marginTop: 'auto',
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
                          Buka Naskah Pakem
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* B. Bagian Tokoh Wayang */}
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                {filteredCharacters.map((char) => {
                  const charImg = CHAR_ASSETS[char.slug];

                  return (
                    <div
                      key={char.id}
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
                      {/* Visual Tokoh */}
                      <div
                        style={{
                          position: 'relative',
                          width: '100%',
                          height: '240px',
                          borderRadius: '20px',
                          overflow: 'hidden',
                          background: '#140e09',
                          marginBottom: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {charImg ? (
                          <img
                            src={charImg}
                            alt={char.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center 15%',
                            }}
                          />
                        ) : (
                          <WayangFigureSvg
                            slug={char.slug}
                            scale={0.7}
                            width={120}
                            height={180}
                            accentColor={char.accentColor}
                          />
                        )}

                        <div
                          style={{
                            position: 'absolute',
                            top: '14px',
                            left: '14px',
                            background: 'rgba(255, 255, 255, 0.96)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '9999px',
                            padding: '6px 14px',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.14)',
                            fontSize: '11px',
                            fontWeight: '800',
                            color: '#1a140e',
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            pointerEvents: 'none',
                          }}
                        >
                          {char.typeName}
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          flex: 1,
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              marginBottom: '14px',
                              fontSize: '13px',
                              lineHeight: '1.45',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ color: '#8b5a1b', fontWeight: '750', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                Gelar:
                              </span>
                              <span style={{ color: '#2b2118', fontWeight: '600' }}>{char.alias}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ color: '#8b5a1b', fontWeight: '750', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                Pusaka:
                              </span>
                              <span style={{ color: '#2b2118', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {char.weapons}
                              </span>
                            </div>
                          </div>

                          {/* Judul Tokoh (Warna Teks Soga Charcoal Bersih & Kontras) */}
                          <h3
                            style={{
                              margin: '0 0 10px 0',
                              fontSize: '20px',
                              fontWeight: '800',
                              color: '#1a140e',
                              letterSpacing: '-0.3px',
                              lineHeight: '1.3',
                            }}
                          >
                            {char.name}
                          </h3>

                          {/* Deskripsi Tokoh Singkat, Padat, Jelas, & Informatif (Warna Abu Lembut Tidak Kontras) */}
                          <p
                            style={{
                              margin: '0 0 24px 0',
                              fontSize: '13.5px',
                              color: '#6b7280',
                              lineHeight: '1.6',
                              minHeight: '44px',
                            }}
                          >
                            {char.shortDesc || char.description}
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                          <button
                            onClick={() => {
                              setSelectedCharModal(char);
                              setPreviewPose('default');
                            }}
                            style={{
                              flex: 1,
                              background: '#f5f0e4',
                              border: '1px solid rgba(212, 175, 55, 0.45)',
                              color: '#1a140e',
                              padding: '12px 16px',
                              borderRadius: '9999px',
                              fontSize: '13px',
                              fontWeight: '750',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#ebe4d3';
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#f5f0e4';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            Profil & Pose
                          </button>
                          <button
                            onClick={() => onPlayCharacterOnStage && onPlayCharacterOnStage(char.id)}
                            style={{
                              flex: 1,
                              background: '#e8bb5c',
                              border: 'none',
                              color: '#0d0a07',
                              padding: '12px 16px',
                              borderRadius: '9999px',
                              fontSize: '13px',
                              fontWeight: '750',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: 'none',
                              transition: 'background 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#dcae4d';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#e8bb5c';
                            }}
                          >
                            Mainkan
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* C. Bagian Tata Suara */}
          {filteredAudio.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
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
                    Tata Suara & Soundscape Tradisi
                  </h3>
                  <span style={{ fontSize: '12px', color: '#8b5a1b', background: '#ffffff', border: '1px solid rgba(212, 175, 55, 0.25)', padding: '4px 14px', borderRadius: '14px', fontWeight: '750' }}>
                    {filteredAudio.length} Gamelan
                  </span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
                {filteredAudio.map((audio) => {
                  const isPlaying = playingAudioId === audio.id;
                  return (
                    <div
                      key={audio.id}
                      style={{
                        background: '#ffffff',
                        borderRadius: '18px',
                        border: '1px solid rgba(0, 0, 0, 0.06)',
                        padding: '18px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '18px',
                        height: '100%',
                        minHeight: '96px',
                        boxSizing: 'border-box',
                        boxShadow: '0 2px 10px rgba(40, 28, 16, 0.03)',
                        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 18px rgba(40, 28, 16, 0.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.06)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(40, 28, 16, 0.03)';
                      }}
                    >
                      {/* 1. Ikon Waveform Audio Sesuai Screenshot */}
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '16px',
                          background: isPlaying ? 'rgba(180, 138, 40, 0.16)' : 'rgba(212, 175, 55, 0.10)',
                          border: '1px solid rgba(212, 175, 55, 0.22)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '24px' }}>
                          <span
                            style={{
                              width: '3.5px',
                              height: isPlaying ? '14px' : '10px',
                              background: '#b48a28',
                              borderRadius: '9999px',
                              transition: 'height 0.25s ease',
                            }}
                          />
                          <span
                            style={{
                              width: '3.5px',
                              height: isPlaying ? '20px' : '18px',
                              background: '#d4af37',
                              borderRadius: '9999px',
                              transition: 'height 0.25s ease',
                            }}
                          />
                          <span
                            style={{
                              width: '3.5px',
                              height: isPlaying ? '16px' : '24px',
                              background: '#b48a28',
                              borderRadius: '9999px',
                              transition: 'height 0.25s ease',
                            }}
                          />
                          <span
                            style={{
                              width: '3.5px',
                              height: isPlaying ? '22px' : '14px',
                              background: '#d4af37',
                              borderRadius: '9999px',
                              transition: 'height 0.25s ease',
                            }}
                          />
                          <span
                            style={{
                              width: '3.5px',
                              height: isPlaying ? '12px' : '8px',
                              background: '#b48a28',
                              borderRadius: '9999px',
                              transition: 'height 0.25s ease',
                            }}
                          />
                        </div>
                      </div>

                      {/* 2. Judul (Soga Charcoal) & Deskripsi Singkat Padat (Warna Abu Lembut) - Teks Penuh Tanpa Terpotong */}
                      <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                        <h4
                          style={{
                            margin: '0 0 4px 0',
                            fontSize: '17px',
                            color: '#1a140e',
                            fontWeight: '800',
                            letterSpacing: '-0.2px',
                            lineHeight: '1.3',
                          }}
                        >
                          {audio.title}
                        </h4>
                        <p
                          style={{
                            margin: 0,
                            fontSize: '13px',
                            color: '#6b7280',
                            lineHeight: '1.45',
                          }}
                        >
                          {audio.shortDesc || audio.description}
                        </p>
                      </div>

                      {/* 3. Aksi: Teks "Play Demo" + Tombol Bulat Putih dengan Ikon Play Sesuai Screenshot */}
                      <button
                        onClick={() => handleToggleAudio(audio)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          padding: '4px 0',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            fontSize: '13.5px',
                            fontWeight: '700',
                            color: isPlaying ? '#991b1b' : '#b48a28',
                            letterSpacing: '0.01em',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {isPlaying ? 'Hentikan' : 'Play Demo'}
                        </span>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            background: isPlaying ? '#991b1b' : '#ffffff',
                            border: isPlaying ? 'none' : '1.5px solid rgba(212, 175, 55, 0.40)',
                            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isPlaying ? '#ffffff' : '#b48a28',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (!isPlaying) {
                              e.currentTarget.style.background = '#b48a28';
                              e.currentTarget.style.color = '#ffffff';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isPlaying) {
                              e.currentTarget.style.background = '#ffffff';
                              e.currentTarget.style.color = '#b48a28';
                            }
                          }}
                        >
                          {isPlaying ? (
                            <Square size={16} />
                          ) : (
                            <Play size={16} style={{ marginLeft: '2px' }} />
                          )}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MODAL 1: DETAIL LAKON CERITA (FR-02) */}
      {selectedStoryModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#17110c',
              border: '1px solid #d4af37',
              borderRadius: '16px',
              maxWidth: '650px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              color: '#fcfaf2',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(212, 175, 55, 0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#d4af37', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {selectedStoryModal.tradition} • {selectedStoryModal.versionLabel}
                </span>
                <h2 style={{ margin: '4px 0 0 0', fontSize: '22px', color: '#fcfaf2', fontWeight: '700' }}>
                  {selectedStoryModal.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedStoryModal(null)}
                style={{ background: 'none', border: 'none', color: '#bfae9c', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#d4af37', fontWeight: '700' }}>Ringkasan Lakon</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#e5dec9', lineHeight: '1.6' }}>
                {selectedStoryModal.synopsis}
              </p>
            </div>

            <div
              style={{
                background: '#221a13',
                borderLeft: '4px solid #d4af37',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
              }}
            >
              <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#d4af37' }}>
                Makna Filosofis & Nilai Moral
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#fcfaf2', lineHeight: '1.5', fontStyle: 'italic' }}>
                "{selectedStoryModal.philosophy}"
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#d4af37', fontWeight: '700' }}>
                Catatan Sumber & Integritas Budaya
              </h4>
              <div style={{ background: '#120e0a', padding: '14px', borderRadius: '8px', border: '1px solid #362619' }}>
                {selectedStoryModal.sources.map((src, i) => (
                  <div key={i} style={{ marginBottom: i < selectedStoryModal.sources.length - 1 ? '10px' : 0, fontSize: '12px' }}>
                    <div style={{ fontWeight: 'bold', color: '#fcfaf2' }}>{src.title}</div>
                    <div style={{ color: '#bfae9c' }}>Pengarang / Penerbit: {src.author}</div>
                    <div style={{ color: '#8c7d6e', fontSize: '11px' }}>Rujukan: {src.reference} • Hak Cipta: {src.rightsNote}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                onClick={() => setSelectedStoryModal(null)}
                style={{
                  background: '#221a13',
                  border: '1px solid #4a3826',
                  color: '#fcfaf2',
                  padding: '9px 24px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DETAIL PROFIL KARAKTER & UJI POSE (FR-03) */}
      {selectedCharModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#17110c',
              border: '1px solid #d4af37',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              color: '#fcfaf2',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(212, 175, 55, 0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', color: selectedCharModal.accentColor, fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {selectedCharModal.typeName}
                </span>
                <h2 style={{ margin: '4px 0 0 0', fontSize: '22px', color: '#fcfaf2', fontWeight: '700' }}>
                  {selectedCharModal.name}
                </h2>
                <div style={{ fontSize: '12px', color: '#bfae9c' }}>{selectedCharModal.alias}</div>
              </div>
              <button
                onClick={() => setSelectedCharModal(null)}
                style={{ background: 'none', border: 'none', color: '#bfae9c', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
              {/* Kanvas Interactive Pose Preview */}
              <div
                style={{
                  background: '#150f0a',
                  borderRadius: '12px',
                  padding: '20px',
                  border: `1px solid ${selectedCharModal.accentColor || '#d4af37'}`,
                  textAlign: 'center',
                }}
              >
                <WayangFigureSvg
                  slug={selectedCharModal.slug}
                  pose={previewPose}
                  scale={0.8}
                  width={140}
                  height={200}
                  accentColor={selectedCharModal.accentColor}
                />
                <div style={{ fontSize: '11px', color: '#bfae9c', marginTop: '8px' }}>
                  Pose Aktif: <strong style={{ color: selectedCharModal.accentColor }}>{previewPose.toUpperCase()}</strong>
                </div>

                {/* Tombol Pilihan Pose */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center', marginTop: '10px' }}>
                  {selectedCharModal.availablePoses.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPreviewPose(p)}
                      style={{
                        background: previewPose === p ? '#d4af37' : '#221a13',
                        border: `1px solid ${previewPose === p ? '#d4af37' : '#362619'}`,
                        color: previewPose === p ? '#0d0a07' : '#fcfaf2',
                        fontWeight: previewPose === p ? '700' : '500',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Watak & Nilai Filosofis */}
              <div>
                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#d4af37' }}>Senjata & Pusaka</h4>
                  <div style={{ fontSize: '12px', color: '#fcfaf2' }}>{selectedCharModal.weapons}</div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#d4af37' }}>Watak & Karakteristik</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#e5dec9', lineHeight: '1.5' }}>
                    {selectedCharModal.description}
                  </p>
                </div>

                <div
                  style={{
                    background: '#221a13',
                    borderLeft: '3px solid #d4af37',
                    padding: '10px 14px',
                    borderRadius: '6px',
                  }}
                >
                  <h4 style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#d4af37' }}>Nilai Luhur</h4>
                  <p style={{ margin: 0, fontSize: '11px', color: '#fcfaf2', lineHeight: '1.4', fontStyle: 'italic' }}>
                    "{selectedCharModal.philosophy}"
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #362619', paddingTop: '16px' }}>
              <button
                onClick={() => setSelectedCharModal(null)}
                style={{
                  background: '#221a13',
                  border: '1px solid #4a3826',
                  color: '#fcfaf2',
                  padding: '9px 20px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'all 0.2s ease',
                }}
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  if (onPlayCharacterOnStage) onPlayCharacterOnStage(selectedCharModal.id);
                  setSelectedCharModal(null);
                }}
                style={{
                  background: '#e8bb5c',
                  border: 'none',
                  color: '#0d0a07',
                  padding: '9px 24px',
                  borderRadius: '20px',
                  fontWeight: '750',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#dcae4d';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#e8bb5c';
                }}
              >
                Mainkan di Virtual Stage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

