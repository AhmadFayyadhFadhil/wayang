import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Music, Film, ArrowUpRight, ArrowRight, Sparkles } from 'lucide-react';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import JavaneseCloudBackground from '../../components/ui/JavaneseCloudBackground';
import HeritageBatikRibbon from '../../components/ui/HeritageBatikRibbon';

// Assets
import heroParchmentWideBg from '../../assets/hero_parchment_clouds_widescreen_hd.jpg';
import gununganHd from '../../assets/gunungan_kayon_hd.png';
import avatarGatotkaca from '../../assets/avatar_gatotkaca.png';
import avatarArjuna from '../../assets/avatar_arjuna.png';
import avatarShinta from '../../assets/avatar_shinta.png';
import avatarBima from '../../assets/avatar_bima.png';

// Gambar Museum Otentik High-Definition untuk Kartu Tokoh Wayang & Lakon
import wayangCardGatotkaca from '../../assets/wayang_card_gatotkaca.jpg';
import wayangCardArjuna from '../../assets/wayang_card_arjuna.jpg';
import wayangCardShinta from '../../assets/wayang_card_shinta.jpg';
import wayangCardBima from '../../assets/wayang_card_bima.jpg';
import galleryCoverGatotkaca from '../../assets/gallery_cover_gatotkaca.jpg';
import dalangPerformanceHeritage from '../../assets/dalang_performance_heritage.jpg';
import tatahSunggingCraft from '../../assets/tatah_sungging_craft.jpg';
import gamelanOrchestraHeritage from '../../assets/gamelan_orchestra_heritage.jpg';
import ctaGununganGoldenBg from '../../assets/cta_gunungan_golden_bg.jpg';
import lakonCoverDewaRuci from '../../assets/lakon_cover_dewa_ruci.jpg';
import lakonCoverShintaObong from '../../assets/lakon_cover_shinta_obong.jpg';
import pilarPanggungKelir from '../../assets/pilar_panggung_kelir.jpg';
import pilarPustakaPakem from '../../assets/pilar_pustaka_pakem.jpg';
import pilarTataSuara from '../../assets/pilar_tata_suara.jpg';

// 4 Pementasan Unggulan Terpopuler Sesuai Format Leaderboard Top 4
const HOME_TOP_4_PERFORMANCES = [
  {
    id: 'top-1',
    rank: '01',
    title: 'Gugurnya Ghatotkaca',
    dalang: 'Ki Seno Purwanto',
    epos: 'Mahabharata • Bharatayuddha',
    duration: '3 Babak • Pathet Sanga',
    views: '4.8k Apresiasi',
    badge: 'Pagelaran Terpopuler #01',
    description: 'Pertempuran malam hari di padang Kurusetra antara Senopati Udara Raden Gatotkaca melawan panah pusaka Kunta Wijayadanu Adipati Karna.',
    coverImg: galleryCoverGatotkaca,
  },
  {
    id: 'top-2',
    rank: '02',
    title: 'Karno Tanding',
    dalang: 'Ki Manteb S. (Adaptasi)',
    epos: 'Mahabharata • Karna Parwa',
    duration: '4 Babak • Pathet Manyura',
    views: '3.9k Apresiasi',
    badge: 'Unggulan Kurasi #02',
    description: 'Puncak duel takdir dua ksatria bersaudara seibu di palagan Kurusetra bersenjatakan panah Kyai Pasopati dan Kyai Kaladite.',
    coverImg: dalangPerformanceHeritage,
  },
  {
    id: 'top-3',
    rank: '03',
    title: 'Anoman Obong',
    dalang: 'Nyi Sri Sulastri',
    epos: 'Ramayana • Sundara Kanda',
    duration: '3 Babak • Pathet Nem',
    views: '3.2k Apresiasi',
    badge: 'Pilihan Budaya #03',
    description: 'Aksi kepahlawanan duta kera putih Raden Hanoman membakar benteng kemegahan angkara murka kraton Alengka dengan kobaran api suci.',
    coverImg: tatahSunggingCraft,
  },
  {
    id: 'top-4',
    rank: '04',
    title: 'Dewa Ruci',
    dalang: 'Ki Sugito Purbacarita',
    epos: 'Serat Dewa Ruci',
    duration: '3 Babak • Kasampurnan',
    views: '2.7k Apresiasi',
    badge: 'Falsafah Luhur #04',
    description: 'Perjalanan kontemplasi spiritual Raden Werkudara mengarungi samudra raya demi menemukan hakikat jati diri dan kasampurnan urip.',
    coverImg: gamelanOrchestraHeritage,
  },
];

export default function HomeView({ onNavigate, connectionStatus: _connectionStatus, onTestConnection: _onTestConnection }) {
  // State animasi countdown & kemunculan bergiliran untuk cardbox floating numerik
  const [statsInView, setStatsInView] = useState(false);
  const statsSectionRef = useRef(null);

  useEffect(() => {
    const el = statsSectionRef.current;
    if (!el) {
      setStatsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    // Timeout cadangan otomatis: saat beranda dibuka langsung jalan tanpa menunggu scroll
    const fallbackTimer = setTimeout(() => {
      setStatsInView(true);
    }, 350);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  // State hover interaktif untuk pilar fondasi (default null: semua button outline pada kondisi resting)
  const [hoveredPillar, setHoveredPillar] = useState(null);

  // Dynamic mouse spotlight & subtle 3D tilt tracking for ecosystem cards
  const handlePillarMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * -5;
    const tiltY = ((x - centerX) / centerX) * 5;
    card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
  };

  const handlePillarMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.removeProperty('--mouse-x');
    card.style.removeProperty('--mouse-y');
    card.style.removeProperty('--tilt-x');
    card.style.removeProperty('--tilt-y');
  };
  // 4 Lakon terkurasi utama untuk showcase sesuai spesifikasi Bento Grid
  const featuredStories = [
    {
      id: 1,
      slug: 'gugurnya-ghatotkaca',
      title: 'Gugurnya Ghatotkaca',
      category: 'Bharatayuddha',
      shortDesc: 'Pengorbanan suci ksatria Pringgandani di palagan Kurusetra demi melindungi dharma dan pertiwi.',
      coverImg: galleryCoverGatotkaca,
      cardClass: 'lakon-bento-card-tall',
    },
    {
      id: 2,
      slug: 'dewa-ruci',
      title: 'Dewa Ruci',
      category: 'Filsafat Batin',
      shortDesc: 'Pencarian spiritual hakikat manusia mengarungi samudra raya demi mencapai kasampurnan urip.',
      coverImg: lakonCoverDewaRuci,
      cardClass: 'lakon-bento-card-top-mid',
    },
    {
      id: 3,
      slug: 'shinta-obong',
      title: 'Shinta Obong',
      category: 'Epos Ramayana',
      shortDesc: 'Ujian keteguhan cinta dan kemurnian moral Dewi Shinta melalui kobaran api suci.',
      coverImg: lakonCoverShintaObong,
      cardClass: 'lakon-bento-card-top-right',
    },
    {
      id: 4,
      slug: 'karno-tanding',
      title: 'Karno Tanding',
      category: 'Puncak Wiracarita',
      shortDesc: 'Puncak duel takdir dua ksatria bersaudara kandung seibu di atas kereta kencana perang Kurusetra.',
      coverImg: dalangPerformanceHeritage,
      cardClass: 'lakon-bento-card-bottom-wide',
    },
  ];
  // State kartu accordion tokoh wayang (kartu aktif melebar, kartu lainnya ramping seperti di referensi)
  const [activeCharId, setActiveCharId] = useState(1);
  // State kartu leaderboard top 4 (default 'top-1' aktif)
  const [activeLeaderboardId, setActiveLeaderboardId] = useState('top-1');

  // 4 Karakter utama dengan data kultural otentik ragam gagrag
  const featuredCharacters = [
    {
      id: 1,
      slug: 'gatotkaca',
      name: 'Raden Gatotkaca',
      alias: 'Satria Pringgandani • Senopati Udara',
      subheading: 'Ksatria Gagah Perkasa',
      weapons: 'Kotang Antakusuma & Brajamusti',
      description:
        'Putra Werkudara berjuluk otot kawat balung wesi yang mampu melesat di angkasa. Simbol kerelaan berkorban demi keutuhan bangsa dan loyalitas prajurit sejati.',
      philosophy: 'Dedikasi & Kerelaan Berkorban',
      tradition: 'Gaya Surakarta & Yogyakarta',
      avatarImg: avatarGatotkaca,
      cardImg: wayangCardGatotkaca,
    },
    {
      id: 2,
      slug: 'arjuna',
      name: 'Raden Arjuna',
      alias: 'Janaka • Dananjaya • Permadi',
      subheading: 'Ksatria Halus & Utama',
      weapons: 'Panah Pasopati & Gandewa',
      description:
        'Penengah Pandawa berparas rupawan dan ahli memanah nomor satu dengan pusaka Pasopati. Mewakili ketajaman konsentrasi batin (cipta wening) dan kepatuhan dharma.',
      philosophy: 'Cipta Wening & Ketenangan Batin',
      tradition: 'Gaya Surakarta & Yogyakarta',
      avatarImg: avatarArjuna,
      cardImg: wayangCardArjuna,
    },
    {
      id: 101,
      slug: 'shinta',
      name: 'Dewi Shinta',
      alias: 'Putri Janaka • Putri Mithila',
      subheading: 'Perlambang Kesucian',
      weapons: 'Kemurnian Kasih & Janji Suci',
      description:
        'Titisan Batari Sri Widowati dalam wiracarita klasik Ramayana. Lambang kesucian cinta sejati, keteguhan hati menghadapi cobaan angkara, serta kemurnian moral.',
      philosophy: 'Kesetiaan & Kemurnian Moral',
      tradition: 'Tradisi Ramayana (Balai Pustaka)',
      avatarImg: avatarShinta,
      cardImg: wayangCardShinta,
    },
    {
      id: 4,
      slug: 'bima',
      name: 'Raden Werkudara',
      alias: 'Bimasena • Bayusuta • Bratasena',
      subheading: 'Ksatria Gagah Lugas',
      weapons: 'Kuku Pancanaka & Gada Rujakpala',
      description:
        'Pandawa kedua berbadan perkasa berwatak jujur tanpa pamrih dengan pusaka Kuku Pancanaka. Lambang ketegasan hukum dan pencari kasampurnan urip.',
      philosophy: 'Kejujuran & Ketegasan Hukum',
      tradition: 'Serat Dewa Ruci (Radyapustaka)',
      avatarImg: avatarBima,
      cardImg: wayangCardBima,
    },
  ];

  return (
    <div
      style={{
        width: '100%',
        color: '#1a140e',
        background: 'var(--canvas, #f7f4eb)',
        overflowX: 'hidden',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* ============================================================
          1. HERO SECTION (PRD 5.1: LANDING & PROPOSISI NILAI WAYANGVERSE)
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
        {/* Layer Background: Latar Perkamen Awan Tradisional Warm Bronze HD (Harmonis dengan Gunungan) */}
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

        {/* 1. Top Shadow Gradient: Menyelaraskan latar belakang dengan Navbar agar tidak kontras/tabrakan */}
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

        {/* 2. Harmonious Center Ambient Overlay: Meneduhkan area tengah agar teks terbaca jernih tanpa silau */}
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

        {/* 3. Bottom Gradient: Transisi lembut ke bagian bawah hero */}
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

        {/* Motif Awan Tradisional Jawa Otentik dengan Animasi Mengambang & Bergeser Halus */}
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
            style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scaleX(-1)' }}
          />
        </div>

        {/* Center Hero Content */}
        <div
          style={{
            maxWidth: '920px',
            width: '100%',
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Main Headline (Warna Alami Bersih Tanpa Shadow/Stroke) */}
          <h1
            style={{
              margin: '0 0 22px 0',
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(32px, 5.2vw, 56px)',
              fontWeight: '850',
              color: '#fcfaf2',
              lineHeight: '1.22',
              letterSpacing: '-0.6px',
            }}
          >
            Satu Panggung untuk Memainkan{' '}
            <span style={{ color: '#d4af37' }}>Seni Wayang</span>{' '}
            dan Karakter Luhur
          </h1>

          {/* Subtitle Sesuai PRD 1.2 Proposisi Nilai */}
          <p
            style={{
              margin: '0 auto 36px auto',
              fontSize: 'clamp(14px, 1.35vw, 16.5px)',
              color: '#f0e6d8',
              lineHeight: '1.75',
              maxWidth: '720px',
              fontWeight: '450',
            }}
          >
            Wayangverse menghadirkan panggung wayang digital interaktif dua dimensi berbasis kelir dengan visual tatah-sungging otentik, animasi solah dalang, tata suara gamelan real-time, dan relasi data ke naskah pakem bersejarah.
          </p>

          {/* Dual Action Buttons (Warna Solid Alami Bersih Tanpa Shadow/Stroke Berlebih) */}
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
            {/* Primary Capsule Button -> Panggung Virtual */}
            <button
              onClick={() => onNavigate('stage')}
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
              Buka Panggung Virtual
            </button>

            {/* Secondary Capsule Button -> Story Atlas */}
            <button
              onClick={() => onNavigate('atlas')}
              style={{
                background: '#1c140d',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                color: '#fcfaf2',
                padding: '13px 28px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '650',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = '#281c12';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = '#1c140d';
              }}
            >
              Jelajahi Story Atlas
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
          CARDBOX NUMERIK FLOATING (3 METRIK UTAMA SESUAI PERMINTAAN)
          Mengambang di perbatasan hero & konten, diposisikan lebih ke atas agar
          langsung tampak jelas saat membuka halaman beranda
          ============================================================ */}
      <div className="hero-floating-card-wrapper" ref={statsSectionRef}>
        <div className="hero-floating-card">
          {/* Metrik 1: Panggung 2D & Skenario (Countdown Serentak dari 3.000 ke 2.400+) */}
          <div
            className={`hero-floating-stat-item ${statsInView ? 'stat-item-active' : ''}`}
            style={{
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
              opacity: statsInView ? 1 : 0.4,
              transform: statsInView ? 'translateY(0)' : 'translateY(-12px)',
            }}
          >
            <div className="hero-stat-number" style={statNumberStyle}>
              <AnimatedCounter
                start={3000}
                target={2400}
                suffix="+"
                duration={1200}
                delay={120}
                shouldStart={statsInView}
              />
            </div>
            <div className="hero-stat-label" style={statLabelStyle}>Pementasan Diciptakan</div>
            <div className="hero-stat-sub" style={statSubStyle}>Karya dalang & generasi muda</div>
          </div>

          {/* Metrik 2: Tokoh Tatah-Sungging Klasik (Countdown Serentak dari 50 ke 15+) */}
          <div
            className={`hero-floating-stat-item ${statsInView ? 'stat-item-active' : ''}`}
            style={{
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
              opacity: statsInView ? 1 : 0.4,
              transform: statsInView ? 'translateY(0)' : 'translateY(-12px)',
            }}
          >
            <div className="hero-stat-number" style={statNumberStyle}>
              <AnimatedCounter
                start={50}
                target={15}
                suffix="+"
                duration={1200}
                delay={120}
                shouldStart={statsInView}
              />
            </div>
            <div className="hero-stat-label" style={statLabelStyle}>Tokoh Wayang Klasik</div>
            <div className="hero-stat-sub" style={statSubStyle}>Tatah-sungging otentik HD</div>
          </div>

          {/* Metrik 3: Naskah Rujukan Terkurasi Sanad Purwa (Countdown Serentak dari 150% ke 100%) */}
          <div
            className={`hero-floating-stat-item ${statsInView ? 'stat-item-active' : ''}`}
            style={{
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
              opacity: statsInView ? 1 : 0.4,
              transform: statsInView ? 'translateY(0)' : 'translateY(-12px)',
            }}
          >
            <div className="hero-stat-number" style={statNumberStyle}>
              <AnimatedCounter
                start={150}
                target={100}
                suffix="%"
                duration={1200}
                delay={120}
                shouldStart={statsInView}
              />
            </div>
            <div className="hero-stat-label" style={statLabelStyle}>Sanad Pakem Tradisi</div>
            <div className="hero-stat-sub" style={statSubStyle}>Kakawin & Serat Purwa terkurasi</div>
          </div>
        </div>
      </div>

      {/* ============================================================
          2. TIGA PILAR EKOSISTEM: PANGGUNG KELIR, PUSTAKA PAKEM, & TATA SUARA
          ============================================================ */}
      <div id="home-light-sections">
      <section
        style={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxSizing: 'border-box',
          padding: 'clamp(64px, 8vw, 96px) 24px',
          background: 'transparent',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Motif Awan Tradisional Jawa Halus Khusus Section Terang dengan Cardbox (Hanya di margin tepi, tidak menabrak cardbox) */}
        <JavaneseCloudBackground variant="flanking" theme="light" opacity={0.18} animated={true} />

        <div style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          {/* Header Bagian: Judul Utama & Subjudul dengan Eyebrow Kultural */}
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <div
              style={{
                fontSize: '11.5px',
                fontWeight: '800',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#8b4513',
                marginBottom: '8px',
              }}
            >
              ARUS KREASI NUSANTARA
            </div>
            <h2
              style={{
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: '850',
                color: '#1a140e',
                letterSpacing: '-0.6px',
                margin: '0 0 14px 0',
              }}
            >
              Tiga Pilar Ekosistem Wayangverse
            </h2>

            <p
              style={{
                fontSize: '14.5px',
                color: '#6e5e4d',
                maxWidth: '650px',
                margin: '0 auto',
                lineHeight: '1.65',
              }}
            >
              Tiga pilar fungsional yang menghubungkan aksi panggung, sastra klasik, dan tata suara budaya dalam satu kesatuan sistem terpadu.
            </p>
          </div>

          {/* Grid 3 Pilar Cardbox dengan Spotlight & Background Wayang Asli Pengguna */}
          <div className="fondasi-ecosystem-grid">
            {[
              {
                id: 'pilar-1',
                nav: 'stage',
                icon: <Film size={24} color="#8b4513" />,
                title: 'Studio Panggung Kelir',
                desc: 'Kanvas kelir digital interaktif untuk menata lakon adegan, menggerakkan tudhing tokoh, merangkai babak, serta memimpin pagelaran secara visual.',
                btnLabel: 'Masuk ke Panggung',
                bgImage: pilarPanggungKelir,
                tag: 'Interaktif 16:9',
              },
              {
                id: 'pilar-2',
                nav: 'atlas',
                icon: <BookOpen size={24} color="#8b4513" />,
                title: 'Pustaka & Sanad Pakem',
                desc: 'Ensiklopedia naskah wiracarita terkurasi yang mengupas silsilah, filosofi watak luhur para ksatria, serta kajian naskah bersejarah Nusantara.',
                btnLabel: 'Jelajahi Pustaka',
                bgImage: pilarPustakaPakem,
                tag: 'Sanad Sastra',
              },
              {
                id: 'pilar-3',
                nav: 'atlas',
                icon: <Music size={24} color="#8b4513" />,
                title: 'Tata Suara Gamelan Slendro',
                desc: 'Sintesis tata suara peramban real-time untuk gending laras slendro, ritme kendhang, hingga hentakan dodogan cempala dan kepyak dalang.',
                btnLabel: 'Dengarkan Suara',
                bgImage: pilarTataSuara,
                tag: 'Web Audio Gamelan',
              },
            ].map((pilar, idx) => {
              const isHovered = hoveredPillar === idx;

              return (
                <div
                  key={pilar.id}
                  className={`fondasi-ecosystem-card ${isHovered ? 'is-hovered' : ''}`}
                  onMouseEnter={() => setHoveredPillar(idx)}
                  onMouseMove={handlePillarMouseMove}
                  onMouseLeave={(e) => {
                    setHoveredPillar(null);
                    handlePillarMouseLeave(e);
                  }}
                  onClick={() => onNavigate(pilar.nav)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onNavigate(pilar.nav);
                    }
                  }}
                >
                  {/* 1. Watermark Background Foto Wayang Tradisi Pilihan Pengguna */}
                  <img
                    src={pilar.bgImage}
                    alt={pilar.title}
                    className="fondasi-card-wayang-bg"
                    loading="lazy"
                  />

                  {/* 2. Layer Sorot Lampu Blencong Dinamis (Mouse Spotlight) */}
                  <div className="fondasi-card-spotlight" aria-hidden="true" />

                  {/* 3. Baris Header: Ikon + Tag Kultural */}
                  <div className="fondasi-card-top-row">
                    <div className="fondasi-card-icon-wrap">
                      {pilar.icon}
                    </div>
                    <span className="fondasi-card-tag">
                      {pilar.tag}
                    </span>
                  </div>

                  {/* 4. Konten Teks Utama */}
                  <div className="fondasi-card-body">
                    <h3 className="fondasi-card-title">
                      {pilar.title}
                    </h3>
                    <p className="fondasi-card-desc">
                      {pilar.desc}
                    </p>
                  </div>

                  {/* 5. Tombol Solid Pill Bernuansa Emas Prada */}
                  <button
                    className="fondasi-card-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(pilar.nav);
                    }}
                  >
                    <span>{pilar.btnLabel}</span>
                    <ArrowRight size={14} className="fondasi-card-btn-arrow" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Divider Transisi Halus Emas: Tiga Pilar ke Lakon Rujukan */}
      <div className="section-divider" role="separator" aria-hidden="true" />

      {/* ============================================================
          4. KURASI LAKON NASKAH RUJUKAN KLASIK
          ============================================================ */}
      <section
        style={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxSizing: 'border-box',
          background: 'transparent',
          border: 'none',
          padding: 'clamp(64px, 8vw, 96px) 24px',
        }}
      >
        <div style={{ maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '38px',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div style={{ maxWidth: '780px' }}>
              <div
                style={{
                  fontSize: '11.5px',
                  fontWeight: '800',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#8b4513',
                  marginBottom: '8px',
                }}
              >
                KHAZANAH NASKAH PURWA
              </div>
              <h2 style={{ ...sectionHeadingStyle, margin: '0 0 8px 0' }}>
                Lakon Wayang Rujukan Bersejarah
              </h2>
              <p style={{ ...sectionSubtitleStyle, margin: 0, maxWidth: '720px' }}>
                Pilih wiracarita pakem klasik dan langsung pentaskan babak adegannya di panggung virtual kelir.
              </p>
            </div>

            <button
              onClick={() => onNavigate('atlas')}
              style={selengkapnyaBtnStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#dcae4d';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#e8bb5c';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Jelajahi Pustaka Lakon
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Bento Grid 4 Lakon Terkurasi Sesuai Layout Referensi Modern Glass */}
          <div className="lakon-bento-grid">
            {featuredStories.map((story) => (
              <div
                key={story.id}
                className={`lakon-bento-card ${story.cardClass}`}
                onClick={() => onNavigate('atlas')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onNavigate('atlas');
                  }
                }}
              >
                {/* Background Image Otentik Full Card */}
                <img
                  src={story.coverImg}
                  alt={story.title}
                  className="lakon-bento-bg-img"
                  loading="lazy"
                />

                {/* Ambient Scrim Gradient agar teks & image menyatu harmonis tanpa kontras tajam */}
                <div className="lakon-bento-ambient-gradient" />

                {/* Label Kategori di Pojok Kiri Atas */}
                <div className="lakon-bento-category-badge">
                  {story.category}
                </div>

                {/* Floating Frosted Glass Panel di Bagian Bawah */}
                <div className="lakon-bento-glass-panel">
                  <h3 className="lakon-bento-title">
                    {story.title}
                  </h3>
                  <p className="lakon-bento-desc">
                    {story.shortDesc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider Transisi Halus Emas: Lakon Rujukan ke Koleksi Tokoh */}
      <div className="section-divider" role="separator" aria-hidden="true" />

      {/* ============================================================
          5. KOLEKSI TOKOH WAYANG KLASIK & WANDHA OTENTIK
          Tata letak terinspirasi dari referensi desain: Tag slash,
          headline besar, paragraf kanan dengan kontrol slider (← [bar] →),
          dan kartu modern dengan satu kartu aktif berlatar gelap.
          ============================================================ */}
      <section
        style={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxSizing: 'border-box',
          padding: 'clamp(64px, 8vw, 96px) 24px',
          background: 'transparent',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Motif Awan Tradisional Jawa Halus Khusus Section Terang dengan Cardbox */}
        <JavaneseCloudBackground variant="flanking" theme="light" opacity={0.18} animated={true} />

        <div style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          {/* Header Bagian: Kiri (Headline Besar Tanpa Teks Tag), Kanan (Deskripsi PRD Tanpa Arrow) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '48px',
              flexWrap: 'wrap',
              gap: '32px',
            }}
          >
            {/* Sisi Kiri: Headline Utama Tanpa Teks di Atasnya */}
            <div style={{ maxWidth: '640px' }}>
              <div
                style={{
                  fontSize: '11.5px',
                  fontWeight: '800',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#8b4513',
                  marginBottom: '8px',
                }}
              >
                WANDHA & FALSAFAH KSATRIA
              </div>
              <h2
                style={{
                  fontSize: 'clamp(32px, 4.2vw, 46px)',
                  fontWeight: '850',
                  color: '#1a140e',
                  letterSpacing: '-0.6px',
                  lineHeight: '1.2',
                  margin: 0,
                }}
              >
                Karakter Wayang Klasik & Falsafah Watak
              </h2>
            </div>

            {/* Sisi Kanan: Narasi Filosofi Budaya (Tanpa Icon Arrow/Slider Sesuai Permintaan) */}
            <div style={{ maxWidth: '480px', width: '100%' }}>
              <p
                style={{
                  fontSize: '15px',
                  lineHeight: '1.7',
                  color: '#6e5e4d',
                  margin: 0,
                }}
              >
                Di Wayangverse, setiap tokoh dirancang berdasar naskah pakem bersejarah dan tatah-sungging otentik. Pelajari wanda, falsafah watak luhur, pusaka sakti, serta mainkan langsung karakternya di panggung kelir virtual.
              </p>
            </div>
          </div>

          {/* Accordion Carousel Tokoh Wayang (Sesuai Referensi SS: 1 Kartu Melebar & Kartu Lainnya Persegi Ramping) */}
          <div className="wayang-accordion-container">
            {featuredCharacters.map((char) => {
              const isActive = activeCharId === char.id;

              return (
                <div
                  key={char.id}
                  onClick={() => setActiveCharId(char.id)}
                  onMouseEnter={() => setActiveCharId(char.id)}
                  className={`wayang-accordion-card ${isActive ? 'active' : 'inactive'}`}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isActive}
                  aria-label={char.name}
                >
                  {/* Gambar Karakter Full-Bleed High Definition */}
                  <img
                    src={char.cardImg}
                    alt={char.name}
                    className="wayang-accordion-img"
                  />

                  {/* Lapisan Gradien Bayangan Gelap dari Bawah (Mencegah Kontras/Tabrakan Teks & Gambar) */}
                  <div className="wayang-accordion-gradient" />

                  {/* KONDISI 1: Kartu Aktif Melebar (Menampilkan Judul Karakter, Kategori, & Tombol Aksi Bulat Sesuai Screenshot) */}
                  {isActive ? (
                    <div className="wayang-accordion-active-content">
                      <div style={{ maxWidth: '80%' }}>
                        <span className="wayang-accordion-tag">
                          {char.subheading}
                        </span>
                        <h3 className="wayang-accordion-title">
                          {char.name}
                        </h3>
                        <p className="wayang-accordion-alias">
                          {char.alias}
                        </p>
                        <p className="wayang-accordion-desc">
                          {char.description}
                        </p>
                      </div>

                      {/* Tombol Aksi Lingkaran Panah di Pojok Kanan Bawah Sesuai Screenshot */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('stage');
                        }}
                        title="Mainkan di Panggung Kelir"
                        className="wayang-accordion-circle-btn"
                        aria-label={`Mainkan ${char.name} di panggung virtual`}
                      >
                        <ArrowUpRight size={22} />
                      </button>
                    </div>
                  ) : (
                    /* KONDISI 2: Kartu Tidak Aktif (Persegi Ramping dengan Judul Vertikal Sesuai Screenshot) */
                    <div className="wayang-accordion-vertical-content">
                      <h4 className="wayang-accordion-vertical-title">
                        {char.name}
                      </h4>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Tombol Selengkapnya di Bawah 4 Cardbox (Berada di Tengah-Tengah, Style & Responsif Sesuai Navbar) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '44px',
            }}
          >
            <button
              onClick={() => onNavigate('atlas')}
              style={{
                background: '#e8bb5c',
                border: 'none',
                color: '#0d0a07',
                padding: '10px 28px',
                borderRadius: '20px',
                fontSize: '13.5px',
                fontWeight: '750',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
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
              Telusuri Ensiklopedia Tokoh
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* Divider Transisi Halus Emas: Koleksi Tokoh ke Pentas Wayang */}
      <div className="section-divider" role="separator" aria-hidden="true" />

      {/* ============================================================
          5. GALERI KARYA PUBLIK / LEADERBOARD TOP 4 PEMENTASAN WAYANG
          ============================================================ */}
      <section className="leaderboard-section-wrapper" id="leaderboard-showcase">
        <div style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', boxSizing: 'border-box', minWidth: 0 }}>
          {/* Header Section */}
          <div className="leaderboard-section-header">
            <div className="leaderboard-section-header-text">
              <div className="leaderboard-section-pretitle">
                PAGELARAN KOMUNITAS TERPILIH
              </div>
              <h2
                style={{
                  ...sectionHeadingStyle,
                  margin: '0 0 8px 0',
                }}
              >
                Pentas Wayang Terpopuler Pekan Ini
              </h2>
              <p
                style={{
                  ...sectionSubtitleStyle,
                  margin: 0,
                  maxWidth: '720px',
                }}
              >
                Karya lakon pilihan gubahan kreator muda dan dalang teruji yang terhubung langsung ke sanad pakem klasik.
              </p>
            </div>

            <button
              onClick={() => onNavigate('archive')}
              className="leaderboard-header-btn"
              aria-label="Buka Seluruh Galeri Karya"
            >
              <span>Buka Seluruh Galeri Karya</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Leaderboard Top 4 Theatrical Exhibition Showcase (Menggantikan Accordion Kembar) */}
          {(() => {
            const activePerformance =
              HOME_TOP_4_PERFORMANCES.find((item) => item.id === activeLeaderboardId) ||
              HOME_TOP_4_PERFORMANCES[0];

            return (
              <div className="leaderboard-showcase-grid">
                {/* Sisi Kiri: Master Stage Spotlight */}
                <div className="leaderboard-spotlight-stage">
                  <img
                    src={activePerformance.coverImg}
                    alt={activePerformance.title}
                    className="leaderboard-spotlight-bg-img"
                    key={activePerformance.id}
                  />
                  <div className="leaderboard-spotlight-scrim" />

                  {/* Header Meta: Terapung anggun di bagian paling atas panggung */}
                  <div className="leaderboard-spotlight-header-meta">
                    <span className="leaderboard-spotlight-badge">
                      <Sparkles size={12} />
                      {activePerformance.badge}
                    </span>
                    <span className="leaderboard-spotlight-epos">
                      {activePerformance.epos} • {activePerformance.duration}
                    </span>
                  </div>

                  {/* Bottom Content: Mengendap rapi di dasar panggung (Tengah terbuka jernih) */}
                  <div className="leaderboard-spotlight-content">
                    <h3 className="leaderboard-spotlight-title">
                      {activePerformance.title}
                    </h3>

                    <div className="leaderboard-spotlight-dalang">
                      <span>Dalang: {activePerformance.dalang}</span>
                      <span>•</span>
                      <span>{activePerformance.views}</span>
                    </div>

                    <p className="leaderboard-spotlight-desc">
                      {activePerformance.description}
                    </p>

                    <div className="leaderboard-spotlight-actions">
                      <button
                        onClick={() => onNavigate('archive')}
                        className="leaderboard-btn-primary"
                        aria-label={`Tonton pertunjukan ${activePerformance.title}`}
                      >
                        <Film size={15} style={{ marginRight: '7px' }} />
                        Tonton Pertunjukan
                      </button>
                      <button
                        onClick={() => onNavigate('atlas')}
                        className="leaderboard-btn-secondary"
                        aria-label={`Buka naskah pakem ${activePerformance.title}`}
                      >
                        <BookOpen size={15} style={{ marginRight: '7px' }} />
                        Naskah Pakem
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sisi Kanan: Reel Stack of 4 Curated Performances */}
                <div className="leaderboard-reel-stack">
                  {HOME_TOP_4_PERFORMANCES.map((item) => {
                    const isSelected = item.id === activePerformance.id;

                    return (
                      <div
                        key={item.id}
                        onClick={() => setActiveLeaderboardId(item.id)}
                        onMouseEnter={() => setActiveLeaderboardId(item.id)}
                        className={`leaderboard-reel-card ${isSelected ? 'active' : ''}`}
                        role="button"
                        tabIndex={0}
                        aria-selected={isSelected}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setActiveLeaderboardId(item.id);
                          }
                        }}
                      >
                        <div className="leaderboard-reel-rank">{item.rank}.</div>

                        <div className="leaderboard-reel-img-thumb">
                          <img
                            src={item.coverImg}
                            alt={item.title}
                            className="leaderboard-reel-img"
                            loading="lazy"
                          />
                        </div>

                        <div className="leaderboard-reel-body">
                          <h4 className="leaderboard-reel-title">{item.title}</h4>
                          <div className="leaderboard-reel-dalang">Oleh {item.dalang}</div>
                          <div className="leaderboard-reel-meta">
                            <span className="leaderboard-reel-epos">{item.epos}</span>
                            <span className="leaderboard-reel-dot">•</span>
                            <span className="leaderboard-reel-views">{item.views}</span>
                          </div>
                        </div>

                        <div className="leaderboard-reel-arrow">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </section>
      </div> {/* Tutup #home-light-sections */}

      {/* Divider Transisi Halus Emas: Leaderboard ke Call to Action */}
      <div className="section-divider" role="separator" aria-hidden="true" />

      {/* ============================================================
          6. FALSAFAH KULTURAL & CALL TO ACTION PENUTUP PAGELARAN
          ============================================================ */}
      <section
        style={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
          padding: 'clamp(64px, 8vw, 96px) 24px',
          background: 'transparent',
        }}
      >
        <div style={{ maxWidth: '1240px', width: '100%', margin: '0 auto' }}>
          <div
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              border: 'none',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
              minHeight: '450px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '72px 28px',
              textAlign: 'center',
              background: '#0a0704',
              boxSizing: 'border-box',
            }}
          >
            {/* Latar Belakang Gambar Wayang Gunungan Emas Panorama Widescreen - Utuh Tanpa Zoom */}
            <img
              src={ctaGununganGoldenBg}
              alt="Latar Panggung Wayang Gunungan Kembar"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                zIndex: 1,
              }}
            />

            {/* Ambient Overlay: Halus agar keindahan ukiran wayang gunungan emas dan awan megamendung tampil terang & jernih */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(16, 11, 7, 0.15) 0%, rgba(14, 9, 6, 0.30) 50%, rgba(16, 11, 7, 0.20) 100%)',
                zIndex: 2,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse at 50% 50%, rgba(16, 11, 7, 0.05) 0%, rgba(10, 7, 4, 0.38) 100%)',
                zIndex: 2,
              }}
            />

            {/* Konten Teks & Tombol CTA di Ruang Pendaran Cahaya Tengah Antara Dua Gunungan */}
            <div
              style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '680px',
                width: '100%',
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: '800',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#e8bb5c',
                  marginBottom: '12px',
                }}
              >
                PANGGILAN PAGELARAN DALANG
              </div>
              <h2
                style={{
                  margin: '0 0 16px 0',
                  fontSize: 'clamp(26px, 3.8vw, 42px)',
                  fontWeight: '850',
                  color: '#ffffff',
                  letterSpacing: '-0.5px',
                  lineHeight: '1.25',
                }}
              >
                Tancep Kayon: Mulai Pementasan Perdana Anda
              </h2>

              <p
                style={{
                  margin: '0 auto 30px auto',
                  fontSize: 'clamp(14px, 1.5vw, 16px)',
                  color: '#fcfaf2',
                  lineHeight: '1.7',
                  maxWidth: '620px',
                }}
              >
                Wujudkan lakon wayang impian Anda bersama Wayangverse. Eksplorasi watak ksatria, olah suara gamelan slendro, dan pimpin kelir digital dengan kebebasan berekspresi.
              </p>

              <button
                onClick={() => onNavigate('stage')}
                style={{
                  background: '#e8bb5c',
                  border: 'none',
                  color: '#0d0a07',
                  padding: '13px 36px',
                  borderRadius: '9999px',
                  fontSize: '14.5px',
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
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.background = '#dcae4d';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = '#e8bb5c';
                }}
              >
                Buka Kanvas Panggung Kelir
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Frosted Heritage Glass Ribbon & Kinetic Nusantara Marquee Ticker (Menuju Footer) */}
      <HeritageBatikRibbon style={{ zIndex: 10, position: 'relative' }} />
    </div>
  );
}

// ============================================================
// STYLES TOKENS & UTILITIES
// ============================================================

const statNumberStyle = {
  fontSize: 'clamp(28px, 2.5vw, 36px)',
  fontWeight: '800',
  color: '#e8bb5c',
  letterSpacing: '-0.5px',
  lineHeight: '1.1',
  marginBottom: 'clamp(3px, 0.5vh, 6px)',
};

const statLabelStyle = {
  fontSize: 'clamp(12.5px, 1.1vw, 14.5px)',
  fontWeight: '700',
  color: '#fdfbf7',
  marginBottom: '3px',
  letterSpacing: '0.2px',
};

const statSubStyle = {
  fontSize: 'clamp(10.5px, 0.9vw, 12.5px)',
  color: '#c7b7a6',
  fontWeight: '400',
  lineHeight: '1.4',
};

const sectionHeadingStyle = {
  fontSize: 'clamp(26px, 3.2vw, 36px)',
  fontWeight: '850',
  color: '#1a140e',
  letterSpacing: '-0.5px',
  margin: '0 0 10px 0',
};

const sectionSubtitleStyle = {
  fontSize: '14.5px',
  color: '#6e5e4d',
  maxWidth: '640px',
  margin: '0 auto',
  lineHeight: '1.65',
};

const selengkapnyaBtnStyle = {
  background: '#e8bb5c',
  border: 'none',
  color: '#0d0a07',
  borderRadius: '20px',
  padding: '13px 32px',
  fontSize: '15px',
  fontWeight: '650',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  flexShrink: 0,
};








