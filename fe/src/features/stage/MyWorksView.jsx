import React, { useState, useEffect, useMemo } from 'react';
import persistenceService from '../../services/persistenceService';
import { useStageStore } from './useStageStore';
import { getStoryById } from '../../data/master/storiesMaster';
import { AUDIO_MASTER } from '../../data/master/audioMaster';
import soundEngine from '../../services/soundscape';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import {
  Film,
  Globe,
  Lock,
  Calendar,
  Layers,
  BookOpen,
  Plus,
  Search,
  Play,
  Square,
  Copy,
  Trash2,
  ChevronDown,
  ChevronUp,
  Check,
  Compass,
  Music,
  ArrowRight,
  Edit3,
  SlidersHorizontal,
  Users,
  Volume2,
  LayoutGrid,
  Columns,
  X,
} from 'lucide-react';

// Aset Visual Heritage & Ornamen Budaya
import heroParchmentWideBg from '../../assets/hero_parchment_clouds_widescreen_hd.jpg';
import atlasGoldMotifStrip from '../../assets/atlas_gold_motif_strip.jpg';
import gununganKayonHd from '../../assets/gunungan_kayon_hd.png';
import JavaneseCloudBackground from '../../components/ui/JavaneseCloudBackground';
import galleryCoverGatotkaca from '../../assets/gallery_cover_gatotkaca.jpg';
import dalangPerformanceHeritage from '../../assets/dalang_performance_heritage.jpg';
import lakonCoverDewaRuci from '../../assets/lakon_cover_dewa_ruci.jpg';
import lakonCoverShintaObong from '../../assets/lakon_cover_shinta_obong.jpg';
import tatahSunggingCraft from '../../assets/tatah_sungging_craft.jpg';
import avatarArjuna from '../../assets/avatar_arjuna.png';
import avatarBima from '../../assets/avatar_bima.png';
import avatarGatotkaca from '../../assets/avatar_gatotkaca.png';
import avatarShinta from '../../assets/avatar_shinta.png';

// 4 Template Inspirasi Lakon Pakem Klasik untuk Pementasan Cepat Berstandar Keraton
const TEMPLATE_STARTERS = [
  {
    id: 'tpl-1',
    storyId: 1,
    title: 'Bharatayuddha: Gugurnya Senopati Udara',
    subtitle: 'Palagan Kurusetra • Duel Gatotkaca vs Karna',
    tradition: 'Gagrag Mataram',
    versionPakem: 'Serat Bharatayuddha',
    conflictFocus: 'Duel Senopati Udara',
    category: 'mahabharata',
    description: 'Skenario babak peperangan malam di padang Kurusetra saat Sang Senopati Udara berhadapan dengan panah sakti Kunta Wijayandanu demi melindungi Pandawa.',
    coverImg: galleryCoverGatotkaca,
    characterIds: [1, 3],
    characters: [
      { name: 'Raden Gatotkaca', role: 'Senopati Udara Pandawa', avatar: avatarGatotkaca, accentColor: '#eab308' },
      { name: 'Adipati Karna', role: 'Senopati Utama Kurawa', avatar: avatarArjuna, accentColor: '#f97316' },
    ],
    audioId: 1,
    audioTitle: 'Gamelan Srepeg Mataram',
    audioSynthType: 'srepeg',
    audioMood: 'Perang Tanding • Cepat & Heroik',
    scenesCount: 2,
    scenes: [
      {
        id: 'sc-tpl-1-1',
        title: 'Gerak Pasukan Malam Kurusetra',
        background: 'kelir-kurusetra-perang',
        durationMs: 5000,
        audioAssetId: 1,
        characters: [
          {
            instanceId: 'inst-tpl-1-1',
            characterId: 3,
            name: 'Adipati Karna',
            slug: 'karna',
            x: 0.72,
            y: 0.68,
            scale: 1.0,
            pose: 'perang',
            facing: 'left',
            dialogue: 'Wengi iki Kurusetra dadi seksi, Senjata Kunta wus cumawis nembus angkasa!',
            translation: 'Malam ini Kurusetra menjadi saksi, Senjata Kunta telah siap menembus angkasa!',
            accentColor: '#f97316',
          },
        ],
      },
      {
        id: 'sc-tpl-1-2',
        title: 'Gatotkaca Membelah Angkasa',
        background: 'kelir-kurusetra-perang',
        durationMs: 5500,
        audioAssetId: 1,
        characters: [
          {
            instanceId: 'inst-tpl-1-2',
            characterId: 1,
            name: 'Raden Gatotkaca',
            slug: 'gatotkaca',
            x: 0.35,
            y: 0.45,
            scale: 1.05,
            pose: 'default',
            facing: 'right',
            dialogue: 'Duh Rama Pandawa, otot kawat balung wesi ora bakal gigrig bela bebener!',
            translation: 'Wahai Ayahanda Pandawa, otot kawat tulang besi takkan gentar membela kebenaran!',
            accentColor: '#eab308',
          },
        ],
      },
    ],
  },
  {
    id: 'tpl-2',
    storyId: 2,
    title: 'Dewa Ruci: Samudra Tirta Perwitasari',
    subtitle: 'Laku Hakikat • Wejangan Suci Sang Murid Sejati',
    tradition: 'Gaya Surakarta',
    versionPakem: 'Serat Dewa Ruci',
    conflictFocus: 'Pencarian Air Suci Hakikat',
    category: 'spiritual',
    description: 'Skenario babak spiritual Raden Werkudara menyelami samudra raya hingga bertemu wujud hakikat sukma sejati dalam ketenangan batin.',
    coverImg: lakonCoverDewaRuci,
    characterIds: [4],
    characters: [
      { name: 'Raden Werkudara', role: 'Satria Pencari Hakikat', avatar: avatarBima, accentColor: '#10b981' },
      { name: 'Sang Dewa Ruci', role: 'Wujud Hakikat Sejati', avatar: avatarBima, accentColor: '#d4af37' },
    ],
    audioId: 2,
    audioTitle: 'Gamelan Ayak-ayak Slendro',
    audioSynthType: 'ayak_ayak',
    audioMood: 'Filosofis • Lambat & Syahdu',
    scenesCount: 2,
    scenes: [
      {
        id: 'sc-tpl-2-1',
        title: 'Werkudara Menerjang Samudra',
        background: 'kelir-malam-mistik',
        durationMs: 5000,
        audioAssetId: 2,
        characters: [
          {
            instanceId: 'inst-tpl-2-1',
            characterId: 4,
            name: 'Raden Werkudara',
            slug: 'bima',
            x: 0.45,
            y: 0.68,
            scale: 1.1,
            pose: 'default',
            facing: 'right',
            dialogue: 'Ora bakal mundur satepak jangkah sadurunge nemu Air Suci Hakikat!',
            translation: 'Tak akan mundur selangkah pun sebelum menemukan Air Suci Hakikat!',
            accentColor: '#10b981',
          },
        ],
      },
      {
        id: 'sc-tpl-2-2',
        title: 'Pertemuan di Dasar Samudra',
        background: 'kelir-malam-mistik',
        durationMs: 6000,
        audioAssetId: 2,
        characters: [
          {
            instanceId: 'inst-tpl-2-2',
            characterId: 4,
            name: 'Sang Dewa Ruci',
            slug: 'bima',
            x: 0.60,
            y: 0.45,
            scale: 0.75,
            pose: 'sembah',
            facing: 'left',
            dialogue: 'He Werkudara, mlebuwa ing talingan kiwaku, weruha sajroning uripmu!',
            translation: 'Wahai Werkudara, masuklah ke telinga kiriku, lihatlah apa hakikat hidupmu!',
            accentColor: '#d4af37',
          },
        ],
      },
    ],
  },
  {
    id: 'tpl-3',
    storyId: 3,
    title: 'Ramayana: Kesucian Api Shinta Obong',
    subtitle: 'Wiracarita Ayodhya • Pembuktian Keteguhan Hati',
    tradition: 'Tradisi Ramayana',
    versionPakem: 'Kakawin Ramayana',
    conflictFocus: 'Ujian Api Batara Brama',
    category: 'ramayana',
    description: 'Skenario babak pengorbanan luhur Dewi Shinta di hadapan kobaran api suci Batara Brama sebagai bukti kesucian cinta dan kesetiaan.',
    coverImg: lakonCoverShintaObong,
    characterIds: [5, 2],
    characters: [
      { name: 'Dewi Shinta', role: 'Ksatria Putri Ayodhya', avatar: avatarShinta, accentColor: '#ec4899' },
      { name: 'Raden Rama Wijaya', role: 'Prabu Ayodhya', avatar: avatarArjuna, accentColor: '#3b82f6' },
    ],
    audioId: 3,
    audioTitle: 'Gamelan Sampak Alengka',
    audioSynthType: 'sampak',
    audioMood: 'Ketegangan • Cepat & Bergetar',
    scenesCount: 2,
    scenes: [
      {
        id: 'sc-tpl-3-1',
        title: 'Ujian Kesucian di Taman Asoka',
        background: 'kelir-blencong-default',
        durationMs: 5000,
        audioAssetId: 3,
        characters: [
          {
            instanceId: 'inst-tpl-3-1',
            characterId: 5,
            name: 'Dewi Shinta',
            slug: 'shinta',
            x: 0.42,
            y: 0.68,
            scale: 0.95,
            pose: 'sembah',
            facing: 'right',
            dialogue: 'Yen ingsun suci, geni iki bakal dadi kembang melati sing arum!',
            translation: 'Bila diriku suci, api ini akan menjadi bunga melati yang harum semerbak!',
            accentColor: '#ec4899',
          },
        ],
      },
      {
        id: 'sc-tpl-3-2',
        title: 'Anugerah Batara Brama',
        background: 'kelir-blencong-default',
        durationMs: 5500,
        audioAssetId: 3,
        characters: [
          {
            instanceId: 'inst-tpl-3-2',
            characterId: 5,
            name: 'Dewi Shinta',
            slug: 'shinta',
            x: 0.50,
            y: 0.65,
            scale: 1.0,
            pose: 'default',
            facing: 'right',
            dialogue: 'Geni ora ngobong, nanging paring berkah marang kasucening wardaya.',
            translation: 'Api tak membakar, melainkan memberi berkah bagi kesucian lubuk sanubari.',
            accentColor: '#ec4899',
          },
        ],
      },
    ],
  },
  {
    id: 'tpl-4',
    storyId: 1,
    title: 'Bharatayuddha: Perang Tanding Karna & Arjuna',
    subtitle: 'Palagan Kurusetra • Duel Panah Pasopati',
    tradition: 'Gagrag Ngayogyakarta',
    versionPakem: 'Serat Bharatayuddha',
    conflictFocus: 'Karna Tandhing',
    category: 'mahabharata',
    description: 'Skenario babak puncak perang saudara antara Raden Arjuna dan Adipati Karna, keduanya menjunjung tinggi sumpah darma ksatria masing-masing.',
    coverImg: dalangPerformanceHeritage,
    characterIds: [2, 3],
    characters: [
      { name: 'Raden Arjuna', role: 'Penengah Pandawa', avatar: avatarArjuna, accentColor: '#3b82f6' },
      { name: 'Adipati Karna', role: 'Senopati Awangga', avatar: avatarArjuna, accentColor: '#f97316' },
    ],
    audioId: 1,
    audioTitle: 'Gamelan Srepeg Mataram',
    audioSynthType: 'srepeg',
    audioMood: 'Perang Tanding • Cepat & Heroik',
    scenesCount: 2,
    scenes: [
      {
        id: 'sc-tpl-4-1',
        title: 'Tandhing Kereta Kurusetra',
        background: 'kelir-kurusetra-perang',
        durationMs: 5000,
        audioAssetId: 1,
        characters: [
          {
            instanceId: 'inst-tpl-4-1',
            characterId: 2,
            name: 'Raden Arjuna',
            slug: 'arjuna',
            x: 0.32,
            y: 0.68,
            scale: 1.0,
            pose: 'perang',
            facing: 'right',
            dialogue: 'Kakang Karna, abot rasane manah iki, nanging darma kesatria kudu linakonan!',
            translation: 'Kanda Karna, berat rasa hati ini, namun darma kesatria harus dijalankan!',
            accentColor: '#3b82f6',
          },
        ],
      },
      {
        id: 'sc-tpl-4-2',
        title: 'Pelepasan Pusaka Kyai Pasopati',
        background: 'kelir-kurusetra-perang',
        durationMs: 5500,
        audioAssetId: 1,
        characters: [
          {
            instanceId: 'inst-tpl-4-2',
            characterId: 2,
            name: 'Raden Arjuna',
            slug: 'arjuna',
            x: 0.40,
            y: 0.65,
            scale: 1.0,
            pose: 'default',
            facing: 'right',
            dialogue: 'Pasopati lumepas, nyuwun pangapunten duh Gusti Kang Akarya Jagad.',
            translation: 'Pasopati terlepas, mohon ampun wahai Tuhan Penguasa Alam Semesta.',
            accentColor: '#3b82f6',
          },
        ],
      },
    ],
  },
];

export default function MyWorksView({ onOpenStudio, onPlayPerformance }) {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'public' | 'private' | 'pakem'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'title' | 'scenes'

  // Kontrol Tampilan Khazanah Template Lakon Pakem
  const [showTemplatesDrawer, setShowTemplatesDrawer] = useState(true);
  const [templateFilter, setTemplateFilter] = useState('all'); // 'all' | 'mahabharata' | 'spiritual' | 'ramayana'
  const [templateViewMode, setTemplateViewMode] = useState('grid'); // 'grid' | 'inspector'
  const [inspectingTemplate, setInspectingTemplate] = useState(null); // Modal pratinjau detail babak
  const [selectedInspectorId, setSelectedInspectorId] = useState('tpl-1'); // Template terpilih pada mode inspector
  const [inspectorSceneIdx, setInspectorSceneIdx] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState(null);

  // Modal konfirmasi hapus karya & notifikasi toast
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const { loadPerformanceFromData, resetStudio } = useStageStore();

  const loadWorks = async () => {
    try {
      const data = await persistenceService.getMyWorks();
      setWorks(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function initWorks() {
      await loadWorks();
    }
    initWorks();
    return () => {
      soundEngine.stopBgm();
    };
  }, []);

  // Filter template lakon berdasarkan kategori
  const filteredTemplates = useMemo(() => {
    if (templateFilter === 'all') return TEMPLATE_STARTERS;
    return TEMPLATE_STARTERS.filter((tpl) => tpl.category === templateFilter);
  }, [templateFilter]);

  // Audio player handler untuk template lakon
  const handleToggleAudio = (tpl) => {
    if (playingAudioId === tpl.id) {
      soundEngine.stopBgm();
      setPlayingAudioId(null);
    } else {
      soundEngine.startBgm(tpl.audioSynthType || 'srepeg', tpl.audioTitle);
      setPlayingAudioId(tpl.id);
    }
  };

  const triggerToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Helper Pemilihan Cover Image Berdasarkan Story ID atau Fallback
  const getCoverImageForWork = (storyId, index = 0) => {
    if (storyId === 1) return galleryCoverGatotkaca;
    if (storyId === 2) return lakonCoverDewaRuci;
    if (storyId === 3) return lakonCoverShintaObong;
    const fallbacks = [dalangPerformanceHeritage, tatahSunggingCraft, galleryCoverGatotkaca];
    return fallbacks[index % fallbacks.length];
  };

  // Helper Avatar Karakter Berdasarkan Slug
  const getAvatarForSlug = (slug) => {
    if (slug === 'arjuna') return avatarArjuna;
    if (slug === 'bima' || slug === 'werkudara') return avatarBima;
    if (slug === 'gatotkaca') return avatarGatotkaca;
    if (slug === 'shinta') return avatarShinta;
    return null;
  };

  // Ekstrak Tokoh Unik dari Scene Data
  const getCharactersInWork = (sceneData) => {
    if (!sceneData) return [];
    const scenes = sceneData.scenes || [];
    const charMap = new Map();

    scenes.forEach((sc) => {
      (sc.characters || []).forEach((ch) => {
        if (!charMap.has(ch.characterId || ch.name)) {
          charMap.set(ch.characterId || ch.name, {
            name: ch.name,
            slug: ch.slug,
            accentColor: ch.accentColor || '#d4af37',
            avatar: getAvatarForSlug(ch.slug),
          });
        }
      });
    });

    return Array.from(charMap.values());
  };

  // Ekstrak Judul Audio / Gamelan Utama
  const getAudioTitleInWork = (sceneData) => {
    const firstScene = sceneData?.scenes?.[0];
    if (!firstScene || !firstScene.audioAssetId) return 'Gamelan Srepeg Mataram';
    const found = AUDIO_MASTER.find((a) => a.id === firstScene.audioAssetId);
    return found ? found.title : 'Gamelan Srepeg Mataram';
  };

  // Aksi Buka di Studio
  const handleReopenInStudio = (perf) => {
    loadPerformanceFromData(perf);
    if (onOpenStudio) onOpenStudio();
  };

  // Aksi Rancang Lakon Baru Kosong
  const handleCreateNew = () => {
    resetStudio();
    if (onOpenStudio) onOpenStudio();
  };

  // Aksi Mulai dari Template Inspirasi Pakem
  const handleUseTemplate = async (template) => {
    const newWorkData = {
      id: null,
      title: template.title,
      description: template.description,
      storyId: template.storyId,
      visibility: 'public',
    };

    const scenePayload = {
      scenes: template.scenes,
      version: 1,
    };

    const saved = await persistenceService.savePerformance(newWorkData, scenePayload);
    await loadWorks();

    if (saved && saved.data) {
      loadPerformanceFromData(saved.data);
    } else {
      loadPerformanceFromData({
        ...newWorkData,
        scene_data: scenePayload,
      });
    }

    triggerToast(`Skenario "${template.title}" siap disunting di Studio!`);
    if (onOpenStudio) onOpenStudio();
  };

  // Aksi Duplikasi Karya
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
    await loadWorks();
    triggerToast(`Karya "${perf.title}" berhasil diduplikasi sebagai draf privat.`);
  };

  // Aksi Toggle Visibilitas Cepat (Publik ⇄ Privat)
  const handleToggleVisibility = async (perf) => {
    const sceneData = typeof perf.scene_data === 'string' ? JSON.parse(perf.scene_data) : perf.scene_data;
    const newVisibility = perf.visibility === 'public' ? 'private' : 'public';
    const updatedMeta = {
      id: perf.id,
      title: perf.title,
      description: perf.description,
      storyId: perf.story_id,
      visibility: newVisibility,
      createdAt: perf.created_at,
    };
    await persistenceService.savePerformance(updatedMeta, sceneData);
    await loadWorks();
    triggerToast(
      `Visibilitas diubah ke ${newVisibility === 'public' ? 'Publik (Dapat ditonton di Galeri)' : 'Privat (Hanya untuk Anda)'}.`
    );
  };

  // Aksi Hapus Karya (Konfirmasi via Modal Custom)
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await persistenceService.deletePerformance(deleteTarget.id);
    await loadWorks();
    triggerToast(`Karya "${deleteTarget.title}" telah dihapus.`, 'info');
    setDeleteTarget(null);
  };

  // Statistik Real-Time
  const stats = useMemo(() => {
    const total = works.length;
    const publicWorks = works.filter((w) => w.visibility === 'public').length;
    const privateWorks = total - publicWorks;
    const pakemCount = works.filter((w) => Boolean(w.story_id)).length;
    const totalScenes = works.reduce((acc, curr) => {
      const data = typeof curr.scene_data === 'string' ? JSON.parse(curr.scene_data || '{}') : curr.scene_data;
      return acc + (data?.scenes?.length || 1);
    }, 0);

    return { total, publicWorks, privateWorks, pakemCount, totalScenes };
  }, [works]);

  // Filter & Pencarian
  const filteredWorks = useMemo(() => {
    let result = [...works];

    // Filter Kategori
    if (activeFilter === 'public') {
      result = result.filter((w) => w.visibility === 'public');
    } else if (activeFilter === 'private') {
      result = result.filter((w) => w.visibility !== 'public');
    } else if (activeFilter === 'pakem') {
      result = result.filter((w) => Boolean(w.story_id));
    }

    // Pencarian Teks
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((w) => {
        const titleMatch = w.title?.toLowerCase().includes(q);
        const descMatch = w.description?.toLowerCase().includes(q);
        const refStory = w.story_id ? getStoryById(w.story_id) : null;
        const storyMatch = refStory?.title?.toLowerCase().includes(q);
        return titleMatch || descMatch || storyMatch;
      });
    }

    // Pengurutan (Sorting)
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.updated_at || a.created_at || 0) - new Date(b.updated_at || b.created_at || 0));
    } else if (sortBy === 'title') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortBy === 'scenes') {
      result.sort((a, b) => {
        const sA = (typeof a.scene_data === 'string' ? JSON.parse(a.scene_data) : a.scene_data)?.scenes?.length || 1;
        const sB = (typeof b.scene_data === 'string' ? JSON.parse(b.scene_data) : b.scene_data)?.scenes?.length || 1;
        return sB - sA;
      });
    }

    return result;
  }, [works, activeFilter, searchQuery, sortBy]);

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#0d0a07', color: '#fbf8ee' }}>
      {/* ============================================================
          1. HERO SECTION: SANGGAR PUSTAKA KARYA DALANG
          Selaras dengan desain megah Beranda & Story Atlas (Full-Bleed,
          Ornamen Gunungan Berayun, Banner Perkamen HD & Motif Emas)
          ============================================================ */}
      <section
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
        {/* Layer Background: Latar Perkamen Awan Tradisional Warm Bronze HD (Sama Persis dengan Beranda) */}
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

        {/* 1. Top Shadow Gradient: Menyelaraskan Latar Belakang dengan Navbar Transparan agar Tidak Tabrakan Kontras */}
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

        {/* 2. Ambient Center Overlay: Meneduhkan Area Tengah agar Teks Terbaca Tajam, Mewah, dan Nyaman di Mata */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 75% 70% at 50% 48%, rgba(16, 11, 7, 0.65) 0%, rgba(18, 12, 8, 0.42) 60%, rgba(10, 7, 5, 0.68) 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* 3. Bottom Gradient Transisi Lembut ke Bagian Konten & Cardbox Stat */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '160px',
            background:
              'linear-gradient(to top, rgba(13, 10, 7, 0.88) 0%, rgba(13, 10, 7, 0.35) 60%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Motif Awan Tradisional Jawa Otentik dengan Animasi Mengambang & Bergeser Halus (Berada di atas backdrop layer 3 di panggung malam) */}
        <JavaneseCloudBackground variant="hero" theme="dark" opacity={0.55} animated={true} style={{ zIndex: 3 }} />

        {/* Ornamen Wayang Gunungan Berayun Kiri */}
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
          }}
        >
          <img
            src={gununganKayonHd}
            alt="Wayang Gunungan Kiri"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Ornamen Wayang Gunungan Berayun Kanan */}
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
            src={gununganKayonHd}
            alt="Wayang Gunungan Kanan"
            style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scaleX(-1)' }}
          />
        </div>

        {/* Konten Teks Hero Terpusat Sempurna (Panjang Selaras dengan Navbar 1180px) */}
        <div style={{ maxWidth: '1180px', width: '100%', position: 'relative', zIndex: 10, margin: '0 auto', textAlign: 'center' }}>
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
            <span>RUANG CIPTA PAGELARAN WAYANG</span>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#d4af37' }} />
          </div>

          {/* Headline Utama */}
          <h1
            style={{
              margin: '0 auto 20px auto',
              maxWidth: '850px',
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(34px, 4.8vw, 56px)',
              fontWeight: '850',
              color: '#fcfaf2',
              letterSpacing: '-0.5px',
              lineHeight: '1.22',
              textAlign: 'center',
            }}
          >
            Pustaka Lakon & <span style={{ color: '#d4af37' }}>Karya Saya</span>
          </h1>

          {/* Subjudul Sesuai Narasi Heritage */}
          <p
            style={{
              margin: '0 auto 34px auto',
              fontSize: 'clamp(15px, 1.5vw, 17px)',
              color: '#f0e6d8',
              lineHeight: '1.8',
              maxWidth: '740px',
              fontWeight: '450',
              textAlign: 'center',
            }}
          >
            Ruang kreasi pementasan wayang dua dimensi Anda. Rancang babak kelir digital, hidupkan solah ksatria pewayangan berdasar pakem, dan kelola arsip lakon pementasan pribadi.
          </p>

          {/* Tombol Aksi Utama Hero (Format Harmonis 12px Radius) */}
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
            {/* Primary Action Button -> Buat Lakon Baru */}
            <button
              onClick={handleCreateNew}
              style={{
                background: 'linear-gradient(135deg, #e8bb5c 0%, #d4af37 100%)',
                border: '1px solid rgba(245, 215, 127, 0.45)',
                color: '#1a120b',
                padding: '13px 30px',
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
              <Plus size={16} strokeWidth={2.5} />
              <span>Rancang Lakon Baru</span>
            </button>

            {/* Secondary Action Button -> Buka Studio Panggung */}
            <button
              onClick={() => {
                if (onOpenStudio) onOpenStudio();
              }}
              style={{
                background: 'rgba(24, 17, 11, 0.65)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(212, 175, 55, 0.28)',
                color: '#fdfbf7',
                padding: '13px 26px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '650',
                letterSpacing: '0.2px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(36, 25, 16, 0.85)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(24, 17, 11, 0.65)';
              }}
            >
              <Film size={16} style={{ color: '#d4af37' }} />
              <span>Buka Studio Kelir</span>
            </button>

            {/* Action 3 -> Inspirasi Template Pakem */}
            <button
              onClick={() => {
                setShowTemplatesDrawer(true);
                setTimeout(() => {
                  const el = document.getElementById('template-lakon-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 60);
              }}
              style={{
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                color: '#e8bb5c',
                padding: '13px 22px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '650',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d4af37';
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.22)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.12)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Compass size={16} />
              <span>Inspirasi Pakem</span>
            </button>
          </div>

          {/* Cardbox Numerik Floating (Selaras dengan Hero Beranda & Panjang Menyesuaikan Navbar 1180px) */}
          <div className="myworks-floating-stats-card" style={{ marginTop: '38px', marginBottom: '8px' }}>
            {/* Metrik 1: Total Lakon */}
            <div className="myworks-floating-stat-item">
              <div
                style={{
                  fontSize: '25px',
                  fontWeight: '850',
                  color: '#e8bb5c',
                  letterSpacing: '-0.3px',
                  lineHeight: '1.15',
                  marginBottom: '3px',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                <AnimatedCounter
                  start={0}
                  target={stats.total}
                  duration={900}
                  shouldStart={true}
                />
              </div>
              <div style={{ fontSize: '13px', fontWeight: '750', color: '#fdfbf7', marginBottom: '2px', letterSpacing: '0.15px' }}>
                Total Lakon
              </div>
              <div style={{ fontSize: '11px', color: '#bfae9c', fontWeight: '400', lineHeight: '1.3' }}>
                Koleksi lakon di sanggar
              </div>
            </div>

            {/* Metrik 2: Pagelaran Publik */}
            <div className="myworks-floating-stat-item">
              <div
                style={{
                  fontSize: '25px',
                  fontWeight: '850',
                  color: '#e8bb5c',
                  letterSpacing: '-0.3px',
                  lineHeight: '1.15',
                  marginBottom: '3px',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                <AnimatedCounter
                  start={0}
                  target={stats.publicWorks}
                  duration={900}
                  delay={80}
                  shouldStart={true}
                />
              </div>
              <div style={{ fontSize: '13px', fontWeight: '750', color: '#fdfbf7', marginBottom: '2px', letterSpacing: '0.15px' }}>
                Pagelaran Publik
              </div>
              <div style={{ fontSize: '11px', color: '#bfae9c', fontWeight: '400', lineHeight: '1.3' }}>
                Tayang terbuka di Galeri
              </div>
            </div>

            {/* Metrik 3: Draf Privat */}
            <div className="myworks-floating-stat-item">
              <div
                style={{
                  fontSize: '25px',
                  fontWeight: '850',
                  color: '#e8bb5c',
                  letterSpacing: '-0.3px',
                  lineHeight: '1.15',
                  marginBottom: '3px',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                <AnimatedCounter
                  start={0}
                  target={stats.privateWorks}
                  duration={900}
                  delay={160}
                  shouldStart={true}
                />
              </div>
              <div style={{ fontSize: '13px', fontWeight: '750', color: '#fdfbf7', marginBottom: '2px', letterSpacing: '0.15px' }}>
                Draf Privat
              </div>
              <div style={{ fontSize: '11px', color: '#bfae9c', fontWeight: '400', lineHeight: '1.3' }}>
                Arsip pribadi sanggar
              </div>
            </div>

            {/* Metrik 4: Total Babak Kelir */}
            <div className="myworks-floating-stat-item">
              <div
                style={{
                  fontSize: '25px',
                  fontWeight: '850',
                  color: '#e8bb5c',
                  letterSpacing: '-0.3px',
                  lineHeight: '1.15',
                  marginBottom: '3px',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                <AnimatedCounter
                  start={0}
                  target={stats.totalScenes}
                  duration={900}
                  delay={240}
                  shouldStart={true}
                />
              </div>
              <div style={{ fontSize: '13px', fontWeight: '750', color: '#fdfbf7', marginBottom: '2px', letterSpacing: '0.15px' }}>
                Babak Adegan
              </div>
              <div style={{ fontSize: '11px', color: '#bfae9c', fontWeight: '400', lineHeight: '1.3' }}>
                Adegan kelir digital
              </div>
            </div>
          </div>
        </div>

        {/* Strip Motif Batik Emas di Bagian Bawah Hero Sesuai Desain Atlas */}
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

      {/* ============================================================
          2. SECTION INSPIRASI TEMPLATE PAKEM KLASIK
          Desain Menawan Harmonis Sesuai Gaya Hero & Story Atlas
          Dilengkapi Filter Kategori, Audio Gamelan Player, Roster Tokoh,
          dan Pratinjau Bedah Babak Panggung
          ============================================================ */}
      <section
        id="template-lakon-section"
        data-light-section="true"
        style={{
          width: '100%',
          background: '#f5f0e4',
          borderBottom: '1px solid rgba(212, 175, 55, 0.28)',
          position: 'relative',
          boxSizing: 'border-box',
          padding: showTemplatesDrawer ? '64px 0 74px 0' : '26px 0',
          transition: 'all 0.35s ease',
          overflow: 'hidden',
        }}
      >
        {/* Motif Latar Belakang Awan Tradisional Jawa Halus (Hanya di margin tepi, tidak menabrak cardbox) */}
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
          {/* Kondisi Jika Section Ditutup (Collapsed Ribbon Banner) */}
          {!showTemplatesDrawer ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                background: '#ffffff',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                borderRadius: '20px',
                padding: '16px 24px',
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#8b5a1b',
                    flexShrink: 0,
                  }}
                >
                  <BookOpen size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#1a140e' }}>
                    Khazanah 4 Template Lakon Pakem Klasik Tersedia
                  </div>
                  <div style={{ fontSize: '13px', color: '#6e5e4d', marginTop: '2px' }}>
                    Gunakan skenario standar keraton (Bharatayuddha, Dewa Ruci, Ramayana) lengkap dengan tokoh, dialog, dan gamelan.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowTemplatesDrawer(true)}
                style={{
                  background: '#c27827',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '9px 22px',
                  fontSize: '13px',
                  fontWeight: '750',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
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
                <span>Buka Inspirasi Pakem (4)</span>
                <ChevronDown size={15} />
              </button>
            </div>
          ) : (
            /* Kondisi Jika Section Dibuka (Full Expanded Showcase) */
            <div>
              {/* 1. Header Khazanah Skenario Pakem (Tipografi Alami & Ornamen Berlian ✦) */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '26px',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(212, 175, 55, 0.14)',
                      border: '1px solid rgba(212, 175, 55, 0.40)',
                      color: '#8b5a1b',
                      padding: '5px 14px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: '800',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: '10px',
                    }}
                  >
                    <span>Pustaka Template Lakon Pakem</span>
                  </div>

                  <h2
                    style={{
                      margin: '0 0 8px 0',
                      fontSize: 'clamp(24px, 3.4vw, 36px)',
                      fontWeight: '850',
                      color: '#1a140e',
                      letterSpacing: '-0.5px',
                      lineHeight: '1.25',
                    }}
                  >
                    Skenario Panggung <span style={{ color: '#d4af37' }}>Siap Pentas</span>
                  </h2>

                  <p
                    style={{
                      margin: 0,
                      fontSize: '14.5px',
                      color: '#6e5e4d',
                      maxWidth: '720px',
                      lineHeight: '1.65',
                    }}
                  >
                    Mulai pementasan seketika dengan skenario standar keraton yang telah teruji—dilengkapi tata letak tokoh di kelir, dialog sastra Jawa otentik, dan alunan gamelan.
                  </p>
                </div>

                {/* Tombol Collapse / Tutup Inspirasi */}
                <button
                  onClick={() => setShowTemplatesDrawer(false)}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid rgba(212, 175, 55, 0.4)',
                    color: '#8b5a1b',
                    padding: '8px 18px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#c27827';
                    e.currentTarget.style.color = '#c27827';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                    e.currentTarget.style.color = '#8b5a1b';
                  }}
                >
                  <ChevronUp size={16} />
                  <span>Sembunyikan</span>
                </button>
              </div>

              {/* 2. Baris Filter Kategori & Pengalih Tampilan (Story Atlas Filter Chips & Switcher) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px',
                  marginBottom: '36px',
                  background: '#ffffff',
                  padding: '12px 18px',
                  borderRadius: '22px',
                  border: '1px solid rgba(212, 175, 55, 0.24)',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
                }}
              >
                {/* Filter Kategori Lakon */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: `Semua Lakon (${TEMPLATE_STARTERS.length})` },
                    { id: 'mahabharata', label: 'Mahabharata' },
                    { id: 'spiritual', label: 'Ajaran Hakikat' },
                    { id: 'ramayana', label: 'Wiracarita Ramayana' },
                  ].map((chip) => {
                    const isActive = templateFilter === chip.id;
                    return (
                      <button
                        key={chip.id}
                        type="button"
                        onClick={() => setTemplateFilter(chip.id)}
                        style={{
                          background: isActive ? '#c27827' : '#ffffff',
                          color: isActive ? '#ffffff' : '#2d1f14',
                          border: isActive ? '1.5px solid #c27827' : '1.5px solid #dcd7ce',
                          borderRadius: '9999px',
                          padding: '7px 18px',
                          fontSize: '13px',
                          fontWeight: isActive ? '750' : '600',
                          cursor: 'pointer',
                          boxShadow: isActive
                            ? '0 2px 10px rgba(194, 120, 39, 0.35)'
                            : '0 2px 6px rgba(0, 0, 0, 0.04)',
                          transition: 'all 0.18s ease',
                        }}
                      >
                        {chip.label}
                      </button>
                    );
                  })}
                </div>

                {/* Switcher Tampilan: Kartu Pustaka vs Bedah Babak Panggung */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#f5f0e4',
                    padding: '4px',
                    borderRadius: '16px',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    gap: '4px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setTemplateViewMode('grid')}
                    style={{
                      background: templateViewMode === 'grid' ? '#ffffff' : 'transparent',
                      color: templateViewMode === 'grid' ? '#1a140e' : '#6e5e4d',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '6px 14px',
                      fontSize: '12.5px',
                      fontWeight: '750',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: templateViewMode === 'grid' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <LayoutGrid size={14} style={{ color: templateViewMode === 'grid' ? '#c27827' : 'inherit' }} />
                    <span>Kartu Pustaka</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTemplateViewMode('inspector')}
                    style={{
                      background: templateViewMode === 'inspector' ? '#ffffff' : 'transparent',
                      color: templateViewMode === 'inspector' ? '#1a140e' : '#6e5e4d',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '6px 14px',
                      fontSize: '12.5px',
                      fontWeight: '750',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: templateViewMode === 'inspector' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Columns size={14} style={{ color: templateViewMode === 'inspector' ? '#c27827' : 'inherit' }} />
                    <span>Bedah Babak Panggung</span>
                  </button>
                </div>
              </div>

              {/* 3. TAMPILAN MODE 1: GRID KARTU PUSTAKA (Sesuai Gaya Kartu Story Atlas) */}
              {templateViewMode === 'grid' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '28px',
                  }}
                >
                  {filteredTemplates.map((tpl) => {
                    const isPlaying = playingAudioId === tpl.id;
                    return (
                      <div
                        key={tpl.id}
                        style={{
                          background: '#ffffff',
                          borderRadius: '26px',
                          border: '1px solid rgba(212, 175, 55, 0.26)',
                          padding: '22px',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
                          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                          position: 'relative',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#d4af37';
                          e.currentTarget.style.transform = 'translateY(-6px)';
                          e.currentTarget.style.boxShadow =
                            '0 18px 38px rgba(212, 175, 55, 0.18), 0 4px 14px rgba(0, 0, 0, 0.06)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.26)';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.04)';
                        }}
                      >
                        {/* A. Cover Image dengan Badge Tradisi & Jumlah Babak */}
                        <div
                          style={{
                            position: 'relative',
                            width: '100%',
                            height: '200px',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            backgroundColor: '#090705',
                            marginBottom: '18px',
                          }}
                        >
                          <img
                            src={tpl.coverImg}
                            alt={tpl.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center',
                              transition: 'transform 0.4s ease',
                            }}
                          />

                          {/* Badge Tradisi Pakem (Kiri Atas Sesuai Story Atlas) */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '12px',
                              left: '12px',
                              background: 'rgba(255, 255, 255, 0.96)',
                              backdropFilter: 'blur(8px)',
                              borderRadius: '9999px',
                              padding: '5px 13px',
                              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.14)',
                              fontSize: '11px',
                              fontWeight: '800',
                              color: '#1a140e',
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                              pointerEvents: 'none',
                            }}
                          >
                            {tpl.tradition}
                          </div>

                          {/* Badge Jumlah Babak Adegan (Kanan Atas) */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '12px',
                              right: '12px',
                              background: 'rgba(18, 12, 8, 0.88)',
                              border: '1px solid rgba(212, 175, 55, 0.45)',
                              borderRadius: '9999px',
                              padding: '5px 12px',
                              color: '#e8bb5c',
                              fontSize: '11px',
                              fontWeight: '750',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                            }}
                          >
                            <Film size={12} />
                            <span>{tpl.scenesCount} Babak Adegan</span>
                          </div>
                        </div>

                        {/* B. Metadata Pakem & Fokus Cerita (Format Story Atlas) */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px',
                            marginBottom: '12px',
                            fontSize: '13px',
                            lineHeight: '1.45',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              style={{
                                color: '#8b5a1b',
                                fontWeight: '750',
                                fontSize: '11.5px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                              }}
                            >
                              Pakem:
                            </span>
                            <span style={{ color: '#2b2118', fontWeight: '650' }}>{tpl.versionPakem}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              style={{
                                color: '#8b5a1b',
                                fontWeight: '750',
                                fontSize: '11.5px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                              }}
                            >
                              Fokus:
                            </span>
                            <span style={{ color: '#2b2118', fontWeight: '650' }}>{tpl.conflictFocus}</span>
                          </div>
                        </div>

                        {/* C. Judul & Deskripsi Skenario */}
                        <h3
                          style={{
                            margin: '0 0 8px 0',
                            fontSize: '19px',
                            fontWeight: '800',
                            color: '#1a140e',
                            letterSpacing: '-0.3px',
                            lineHeight: '1.35',
                            minHeight: '52px',
                          }}
                        >
                          {tpl.title}
                        </h3>

                        <p
                          style={{
                            margin: '0 0 16px 0',
                            fontSize: '13px',
                            color: '#6b7280',
                            lineHeight: '1.6',
                            minHeight: '44px',
                            flex: 1,
                          }}
                        >
                          {tpl.description}
                        </p>

                        {/* D. Roster Tokoh Wayang Utama yang Tampil */}
                        <div
                          style={{
                            background: '#faf6ee',
                            border: '1px solid rgba(212, 175, 55, 0.22)',
                            borderRadius: '16px',
                            padding: '10px 14px',
                            marginBottom: '14px',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '11px',
                              fontWeight: '750',
                              color: '#8b5a1b',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              marginBottom: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                            }}
                          >
                            <Users size={12} />
                            <span>Tokoh Utama di Kelir</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            {tpl.characters.map((ch, cIdx) => (
                              <div
                                key={cIdx}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '7px',
                                  background: '#ffffff',
                                  padding: '4px 10px 4px 6px',
                                  borderRadius: '9999px',
                                  border: '1px solid rgba(212, 175, 55, 0.22)',
                                  boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                                }}
                              >
                                <div
                                  style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    border: `1.5px solid ${ch.accentColor}`,
                                    overflow: 'hidden',
                                    background: '#1c140d',
                                    flexShrink: 0,
                                  }}
                                >
                                  {ch.avatar ? (
                                    <img
                                      src={ch.avatar}
                                      alt={ch.name}
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                  ) : (
                                    <div
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#ffffff',
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      {ch.name[0]}
                                    </div>
                                  )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: '11.5px', fontWeight: '750', color: '#1a140e', lineHeight: 1.2 }}>
                                    {ch.name}
                                  </span>
                                  <span style={{ fontSize: '9.5px', color: '#8b5a1b', fontWeight: '500' }}>
                                    {ch.role}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* E. Tata Suara / Gamelan Live Preview Pill (Interaktif Web Audio) */}
                        <button
                          type="button"
                          onClick={() => handleToggleAudio(tpl)}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: isPlaying ? 'rgba(212, 175, 55, 0.16)' : '#ffffff',
                            border: isPlaying ? '1.5px solid #d4af37' : '1px solid rgba(212, 175, 55, 0.28)',
                            borderRadius: '14px',
                            padding: '8px 14px',
                            marginBottom: '18px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxSizing: 'border-box',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
                            <div
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: isPlaying ? '#c27827' : 'rgba(212, 175, 55, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: isPlaying ? '#ffffff' : '#8b5a1b',
                                flexShrink: 0,
                              }}
                            >
                              {isPlaying ? <Square size={13} fill="#ffffff" /> : <Play size={13} fill="#8b5a1b" />}
                            </div>
                            <div>
                              <div style={{ fontSize: '12px', fontWeight: '750', color: '#1a140e' }}>
                                {tpl.audioTitle}
                              </div>
                              <div style={{ fontSize: '10.5px', color: '#8b5a1b' }}>{tpl.audioMood}</div>
                            </div>
                          </div>

                          <span
                            style={{
                              fontSize: '11.5px',
                              fontWeight: '750',
                              color: isPlaying ? '#c27827' : '#8b5a1b',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Volume2 size={13} />
                            {isPlaying ? 'Hentikan Audio' : 'Pratinjau Suara'}
                          </span>
                        </button>

                        {/* F. Tombol Aksi Ganda: Pratinjau Babak & Gunakan Skenario */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            paddingTop: '14px',
                            borderTop: '1px solid rgba(212, 175, 55, 0.20)',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => setInspectingTemplate(tpl)}
                            style={{
                              flex: 1,
                              background: '#ffffff',
                              border: '1px solid rgba(212, 175, 55, 0.35)',
                              color: '#8b5a1b',
                              padding: '10px 14px',
                              borderRadius: '12px',
                              fontSize: '12.5px',
                              fontWeight: '750',
                              cursor: 'pointer',
                              minHeight: '44px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#d4af37';
                              e.currentTarget.style.background = '#fcfaf5';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
                              e.currentTarget.style.background = '#ffffff';
                            }}
                          >
                            <BookOpen size={14} />
                            <span>Pratinjau Babak</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleUseTemplate(tpl)}
                            style={{
                              flex: 1.25,
                              background: 'linear-gradient(135deg, #e8bb5c 0%, #d4af37 100%)',
                              border: 'none',
                              color: '#1a140e',
                              padding: '10px 16px',
                              borderRadius: '12px',
                              fontSize: '12.5px',
                              fontWeight: '800',
                              cursor: 'pointer',
                              minHeight: '44px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 8px rgba(212, 175, 55, 0.25)',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.filter = 'brightness(1.06)';
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.filter = 'none';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <span>Pakai Skenario</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 4. TAMPILAN MODE 2: BEDAH BABAK PANGGUNG (Split Stage Simulator & Script Inspector) */}
              {templateViewMode === 'inspector' && (
                <div>
                  {/* Selector Tab Template untuk Mode Inspector */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      overflowX: 'auto',
                      paddingBottom: '12px',
                      marginBottom: '20px',
                    }}
                  >
                    {filteredTemplates.map((t) => {
                      const isSelected = selectedInspectorId === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setSelectedInspectorId(t.id);
                            setInspectorSceneIdx(0);
                          }}
                          style={{
                            background: isSelected ? '#1a140e' : '#ffffff',
                            color: isSelected ? '#fcfaf2' : '#2b2118',
                            border: isSelected ? '1.5px solid #d4af37' : '1.5px solid rgba(212, 175, 55, 0.3)',
                            padding: '8px 18px',
                            borderRadius: '16px',
                            fontSize: '13px',
                            fontWeight: isSelected ? '800' : '650',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            whiteSpace: 'nowrap',
                            boxShadow: isSelected
                              ? '0 4px 14px rgba(0, 0, 0, 0.15)'
                              : '0 2px 6px rgba(0, 0, 0, 0.04)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: isSelected ? '#e8bb5c' : '#c27827',
                            }}
                          />
                          <span>{t.title.split(':')[0]}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Kontainer Split: Simulator Kelir Panggung (Kiri) & Bedah Naskah Dalang (Kanan) */}
                  {(() => {
                    const currentTpl =
                      TEMPLATE_STARTERS.find((t) => t.id === selectedInspectorId) || TEMPLATE_STARTERS[0];
                    const activeScene = currentTpl.scenes[inspectorSceneIdx] || currentTpl.scenes[0];
                    const isAudioPlaying = playingAudioId === currentTpl.id;

                    return (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                          gap: '24px',
                          background: '#ffffff',
                          borderRadius: '28px',
                          border: '1.5px solid rgba(212, 175, 55, 0.35)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
                          padding: '28px',
                          boxSizing: 'border-box',
                        }}
                      >
                        {/* Kolom Kiri: Simulator Kelir Panggung Virtual */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: '12px',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: '800',
                                color: '#8b5a1b',
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                              }}
                            >
                              Pratinjau Kelir • {activeScene.title}
                            </span>
                            <span
                              style={{
                                fontSize: '11.5px',
                                color: '#e8bb5c',
                                background: '#17110c',
                                border: '1px solid rgba(212, 175, 55, 0.4)',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                fontWeight: '700',
                              }}
                            >
                              Durasi: {Math.round((activeScene.durationMs || 5000) / 1000)}s
                            </span>
                          </div>

                          {/* Kanvas Kelir Mini dengan Blencong & Wayang di Koordinat Asli */}
                          <div
                            style={{
                              position: 'relative',
                              width: '100%',
                              height: '290px',
                              borderRadius: '20px',
                              overflow: 'hidden',
                              backgroundColor: '#0c0906',
                              border: '2px solid rgba(212, 175, 55, 0.4)',
                              boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.8)',
                            }}
                          >
                            <img
                              src={currentTpl.coverImg}
                              alt="Kelir Background"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                opacity: 0.38,
                                filter: 'blur(1px)',
                              }}
                            />

                            {/* Pendaran Hangat Cahaya Blencong Tradisional */}
                            <div
                              style={{
                                position: 'absolute',
                                top: '0',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212, 175, 55, 0.30) 0%, rgba(212, 175, 55, 0.06) 60%, transparent 100%)',
                                width: '180px',
                                height: '80px',
                                pointerEvents: 'none',
                              }}
                            />

                            {/* Tokoh Wayang Terposisi Sesuai Koordinat X & Y Skenario */}
                            {activeScene.characters?.map((ch, idx) => (
                              <div
                                key={idx}
                                style={{
                                  position: 'absolute',
                                  left: `${ch.x * 100}%`,
                                  top: `${ch.y * 100}%`,
                                  transform: 'translate(-50%, -50%)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  zIndex: 8,
                                }}
                              >
                                {/* Speech Bubble Dialog Sastra */}
                                {ch.dialogue && (
                                  <div
                                    style={{
                                      background: 'rgba(255, 255, 255, 0.96)',
                                      color: '#1a140e',
                                      fontSize: '11px',
                                      padding: '5px 10px',
                                      borderRadius: '10px',
                                      border: `1.5px solid ${ch.accentColor || '#d4af37'}`,
                                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                      maxWidth: '190px',
                                      textAlign: 'center',
                                      marginBottom: '6px',
                                      lineHeight: '1.35',
                                      fontWeight: '600',
                                      fontStyle: 'italic',
                                    }}
                                  >
                                    "{ch.dialogue}"
                                  </div>
                                )}

                                {/* Avatar Tokoh Wayang di Kelir (Subtle Elevation Tanpa Neon Glow) */}
                                <div
                                  style={{
                                    width: '46px',
                                    height: '46px',
                                    borderRadius: '50%',
                                    border: `2px solid ${ch.accentColor || '#d4af37'}`,
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.45)',
                                    background: '#1c140d',
                                    overflow: 'hidden',
                                  }}
                                >
                                  {getAvatarForSlug(ch.slug) ? (
                                    <img
                                      src={getAvatarForSlug(ch.slug)}
                                      alt={ch.name}
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                  ) : (
                                    <div
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#ffffff',
                                        fontWeight: '800',
                                      }}
                                    >
                                      {ch.name[0]}
                                    </div>
                                  )}
                                </div>

                                <span
                                  style={{
                                    marginTop: '4px',
                                    background: 'rgba(13, 10, 7, 0.9)',
                                    color: '#ffffff',
                                    fontSize: '10px',
                                    fontWeight: '750',
                                    padding: '2px 8px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(212, 175, 55, 0.4)',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {ch.name} ({ch.facing})
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Tombol Pemilih Babak di Bawah Kelir */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginTop: '12px',
                            }}
                          >
                            {currentTpl.scenes.map((sc, sIdx) => {
                              const isCurr = inspectorSceneIdx === sIdx;
                              return (
                                <button
                                  key={sIdx}
                                  type="button"
                                  onClick={() => setInspectorSceneIdx(sIdx)}
                                  style={{
                                    flex: 1,
                                    background: isCurr ? '#c27827' : '#ffffff',
                                    color: isCurr ? '#ffffff' : '#2b2118',
                                    border: isCurr ? '1.5px solid #c27827' : '1.5px solid rgba(212, 175, 55, 0.3)',
                                    borderRadius: '12px',
                                    padding: '7px 12px',
                                    fontSize: '12px',
                                    fontWeight: '750',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                  }}
                                >
                                  Babak {sIdx + 1}: {sc.title.split(' ')[0]}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Kolom Kanan: Arahan Naskah, Dialog Sastra & Tata Suara */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <span
                                style={{
                                  background: 'rgba(212, 175, 55, 0.16)',
                                  color: '#8b5a1b',
                                  padding: '4px 10px',
                                  borderRadius: '8px',
                                  fontSize: '11px',
                                  fontWeight: '800',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {currentTpl.tradition}
                              </span>
                              <span style={{ fontSize: '12px', color: '#6e5e4d', fontWeight: '600' }}>
                                Pakem: {currentTpl.versionPakem}
                              </span>
                            </div>

                            <h3 style={{ margin: '0 0 6px 0', fontSize: '22px', color: '#1a140e', fontWeight: '850' }}>
                              {currentTpl.title}
                            </h3>

                            <p style={{ margin: '0 0 18px 0', fontSize: '13.5px', color: '#6e5e4d', lineHeight: '1.6' }}>
                              {currentTpl.description}
                            </p>

                            {/* Kotak Dialog Sastra & Terjemahan */}
                            <div
                              style={{
                                background: '#faf6ee',
                                border: '1px solid rgba(212, 175, 55, 0.28)',
                                borderRadius: '16px',
                                padding: '14px 16px',
                                marginBottom: '18px',
                              }}
                            >
                              <div
                                style={{
                                  fontSize: '11px',
                                  fontWeight: '800',
                                  color: '#8b5a1b',
                                  textTransform: 'uppercase',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                }}
                              >
                                <span style={{ fontWeight: '700', color: '#8b5a1b' }}>Dialog Pedalangan Babak {inspectorSceneIdx + 1}</span>
                              </div>

                              {activeScene.characters?.[0]?.dialogue ? (
                                <>
                                  <div
                                    style={{
                                      fontSize: '13.5px',
                                      fontWeight: '700',
                                      color: '#1a140e',
                                      fontStyle: 'italic',
                                      lineHeight: '1.5',
                                      marginBottom: '6px',
                                    }}
                                  >
                                    "{activeScene.characters[0].dialogue}"
                                  </div>
                                  {activeScene.characters[0].translation && (
                                    <div style={{ fontSize: '12px', color: '#6e5e4d', lineHeight: '1.45' }}>
                                      Arti: {activeScene.characters[0].translation}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div style={{ fontSize: '12.5px', color: '#6e5e4d' }}>
                                  Adegan pergerakan lakon tanpa dialog langsung.
                                </div>
                              )}
                            </div>

                            {/* Live Audio Gamelan Player di Inspector */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: '#ffffff',
                                border: '1px solid rgba(212, 175, 55, 0.3)',
                                borderRadius: '14px',
                                padding: '10px 14px',
                                marginBottom: '22px',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: isAudioPlaying ? '#c27827' : 'rgba(212, 175, 55, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: isAudioPlaying ? '#ffffff' : '#8b5a1b',
                                  }}
                                >
                                  {isAudioPlaying ? (
                                    <Square size={14} fill="#ffffff" />
                                  ) : (
                                    <Play size={14} fill="#8b5a1b" />
                                  )}
                                </div>
                                <div>
                                  <div style={{ fontSize: '12.5px', fontWeight: '750', color: '#1a140e' }}>
                                    {currentTpl.audioTitle}
                                  </div>
                                  <div style={{ fontSize: '11px', color: '#8b5a1b' }}>{currentTpl.audioMood}</div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleToggleAudio(currentTpl)}
                                style={{
                                  background: isAudioPlaying ? '#c27827' : '#ffffff',
                                  color: isAudioPlaying ? '#ffffff' : '#8b5a1b',
                                  border: isAudioPlaying ? 'none' : '1px solid rgba(212, 175, 55, 0.4)',
                                  borderRadius: '9999px',
                                  padding: '6px 14px',
                                  fontSize: '11.5px',
                                  fontWeight: '750',
                                  cursor: 'pointer',
                                }}
                              >
                                {isAudioPlaying ? 'Berhenti' : 'Putar Gamelan'}
                              </button>
                            </div>
                          </div>

                          {/* Tombol Utama Gunakan Skenario Ini */}
                          <button
                            type="button"
                            onClick={() => handleUseTemplate(currentTpl)}
                            style={{
                              width: '100%',
                              background: 'linear-gradient(135deg, #e8bb5c 0%, #d4af37 100%)',
                              border: 'none',
                              color: '#1a140e',
                              padding: '12px 20px',
                              borderRadius: '12px',
                              fontSize: '14px',
                              fontWeight: '800',
                              cursor: 'pointer',
                              minHeight: '44px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              boxShadow: '0 4px 14px rgba(212, 175, 55, 0.25)',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.filter = 'brightness(1.06)';
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.filter = 'none';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <span>Gunakan Skenario & Masuk ke Studio Kelir</span>
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          3. KONTEN UTAMA: DAFTAR PAGELARAN TERSIMPAN
          Menggunakan latar belakang ramah baca #f5f0e4 (persis seperti
          Story Atlas & Section Lakon Beranda). Mengakomodasi Navbar
          scroll detection (id: my-works-light-sections & data-light-section)
          ============================================================ */}
      <section
        id="my-works-light-sections"
        data-light-section="true"
        style={{
          width: '100%',
          background: '#f5f0e4',
          minHeight: '85vh',
          padding: '70px 0 100px 0',
          boxSizing: 'border-box',
          color: '#1a140e',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Motif Awan Tradisional Jawa Halus (Hanya di margin tepi, tidak menabrak cardbox) */}
        <JavaneseCloudBackground variant="flanking" theme="light" opacity={0.20} animated={true} />

        <div
          id="my-works-content-section"
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
          {/* Header Bagian Konten */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2
              style={{
                margin: '0 0 10px 0',
                fontSize: 'clamp(26px, 3.8vw, 38px)',
                fontWeight: '850',
                color: '#1a140e',
                letterSpacing: '-0.5px',
              }}
            >
              Koleksi Pagelaran <span style={{ color: '#d4af37' }}>Tersimpan</span>
            </h2>
            <p style={{ margin: 0, fontSize: '15px', color: '#6e5e4d', maxWidth: '640px', marginInline: 'auto' }}>
              Pilih karya untuk disunting di studio panggung kelir atau tonton langsung pagelaran dengan animasi solah dalang dan alunan gamelan.
            </p>
          </div>

          {/* Kapsul Search Bar Elegan (Sesuai Gaya Search Bar Story Atlas) */}
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{
              maxWidth: '820px',
              width: '100%',
              margin: '0 auto 28px auto',
              background: '#ffffff',
              borderRadius: '9999px',
              padding: '6px 8px 6px 22px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              boxSizing: 'border-box',
            }}
          >
            <Search size={22} style={{ color: '#8b5a1b', marginRight: '14px', flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan judul lakon, deskripsi, atau tokoh wayang..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: '#1a140e',
                fontSize: '15px',
                fontWeight: '500',
                fontFamily: 'inherit',
                padding: '8px 0',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8b5a1b',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  marginRight: '6px',
                  fontSize: '16px',
                }}
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}
            <div
              style={{
                background: '#c27827',
                color: '#ffffff',
                padding: '9px 22px',
                borderRadius: '9999px',
                fontSize: '13.5px',
                fontWeight: '750',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                pointerEvents: 'none',
              }}
            >
              <span>{filteredWorks.length} Ditemukan</span>
            </div>
          </form>

          {/* Toolbar Navigasi: Filter Kapsul Tabs & Pilihan Pengurutan */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '36px',
              borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
              paddingBottom: '20px',
            }}
          >
            {/* Filter Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                { id: 'all', label: 'Semua Karya', count: stats.total },
                { id: 'public', label: 'Publik', count: stats.publicWorks },
                { id: 'private', label: 'Draf Privat', count: stats.privateWorks },
                { id: 'pakem', label: 'Rujukan Pakem', count: stats.pakemCount },
              ].map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    style={{
                      background: isActive ? '#1a140e' : '#ffffff',
                      color: isActive ? '#fcfaf2' : '#2b2118',
                      border: `1.5px solid ${isActive ? '#1a140e' : 'rgba(212, 175, 55, 0.35)'}`,
                      padding: '8px 18px',
                      borderRadius: '9999px',
                      fontSize: '13px',
                      fontWeight: '750',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 4px 14px rgba(0,0,0,0.15)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = '#d4af37';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    <span>{tab.label}</span>
                    <span
                      style={{
                        background: isActive ? '#d4af37' : 'rgba(212, 175, 55, 0.18)',
                        color: isActive ? '#0d0a07' : '#8b5a1b',
                        padding: '1px 8px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: '800',
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sorting Dropdown & Opsi Tambahan */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#ffffff',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  borderRadius: '16px',
                  padding: '6px 14px',
                  fontSize: '13px',
                  color: '#2b2118',
                  fontWeight: '600',
                }}
              >
                <SlidersHorizontal size={14} style={{ color: '#8b5a1b' }} />
                <span style={{ fontSize: '12px', color: '#8b5a1b' }}>Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#1a140e',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="newest">Terbaru Disunting</option>
                  <option value="oldest">Terlama Disunting</option>
                  <option value="title">Judul Lakon (A - Z)</option>
                  <option value="scenes">Babak Terbanyak</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid Karya Pertunjukan */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#6e5e4d' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  border: '3px solid rgba(212, 175, 55, 0.25)',
                  borderTopColor: '#d4af37',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 16px auto',
                }}
              />
              <div style={{ fontSize: '15px', fontWeight: '700' }}>Memuat khazanah karya tersimpan...</div>
            </div>
          ) : filteredWorks.length === 0 ? (
            /* Empty State Berseni Tinggi */
            <div
              style={{
                background: '#ffffff',
                border: '1px solid rgba(212, 175, 55, 0.28)',
                borderRadius: '24px',
                padding: '56px 24px',
                textAlign: 'center',
                maxWidth: '680px',
                margin: '0 auto',
                boxShadow: '0 4px 20px rgba(40, 28, 16, 0.04)',
              }}
            >
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '20px',
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto',
                }}
              >
                <Film size={30} style={{ color: '#b48a28' }} />
              </div>

              <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', color: '#1a140e', fontWeight: '800' }}>
                {searchQuery ? 'Tidak Ada Karya yang Cocok' : 'Belum Ada Pementasan Tersimpan'}
              </h3>
              <p
                style={{
                  margin: '0 0 26px 0',
                  fontSize: '14px',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  maxWidth: '460px',
                  marginInline: 'auto',
                }}
              >
                {searchQuery
                  ? `Tidak ditemukan karya dengan kata kunci "${searchQuery}". Coba kata kunci lain atau bersihkan filter pencarian.`
                  : 'Mulai petualangan Anda sebagai dalang digital dengan menyusun babak adegan lakon pertama di Virtual Stage.'}
              </p>

              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: '#1a140e',
                    border: 'none',
                    color: '#fcfaf2',
                    padding: '11px 24px',
                    borderRadius: '12px',
                    fontWeight: '750',
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    minHeight: '44px',
                  }}
                >
                  Bersihkan Pencarian
                </button>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleCreateNew}
                    style={{
                      background: 'linear-gradient(135deg, #e8bb5c 0%, #d4af37 100%)',
                      border: 'none',
                      color: '#1a140e',
                      padding: '12px 28px',
                      borderRadius: '12px',
                      fontWeight: '800',
                      fontSize: '14px',
                      cursor: 'pointer',
                      minHeight: '44px',
                      boxShadow: '0 4px 14px rgba(212, 175, 55, 0.25)',
                    }}
                  >
                    Rancang Lakon Pertama
                  </button>
                  <button
                    onClick={() => setShowTemplatesDrawer(true)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      color: '#8b5a1b',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '750',
                      fontSize: '14px',
                      cursor: 'pointer',
                      minHeight: '44px',
                    }}
                  >
                    Gunakan Template Pakem
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Daftar Card Karya Pementasan (Heritage Elegance, De-cluttered & Anti-Slop) */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '26px',
              }}
            >
              {filteredWorks.map((item, idx) => {
                const sceneData =
                  typeof item.scene_data === 'string' ? JSON.parse(item.scene_data || '{}') : item.scene_data;
                const sceneCount = sceneData?.scenes?.length || 1;
                const refStory = item.story_id ? getStoryById(item.story_id) : null;
                const isPublic = item.visibility === 'public';
                const coverImg = getCoverImageForWork(item.story_id, idx);
                const charactersList = getCharactersInWork(sceneData);
                const audioTitle = getAudioTitleInWork(sceneData);

                return (
                  <div
                    key={item.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '20px',
                      border: '1px solid rgba(212, 175, 55, 0.22)',
                      boxShadow: '0 2px 10px rgba(40, 28, 16, 0.04)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.25s ease',
                      boxSizing: 'border-box',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.48)';
                      e.currentTarget.style.boxShadow =
                        '0 12px 30px rgba(40, 28, 16, 0.08), 0 2px 6px rgba(40, 28, 16, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.22)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(40, 28, 16, 0.04)';
                    }}
                  >
                    {/* 1. Visual Cover Thumbnail: Bersih Tanpa Over-Badging */}
                    <div
                      style={{
                        height: '185px',
                        position: 'relative',
                        overflow: 'hidden',
                        backgroundColor: '#1b140d',
                      }}
                    >
                      <img
                        src={coverImg}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease',
                        }}
                      />

                      {/* Scrim Gradient Gelap Alami */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(to top, rgba(13, 10, 7, 0.85) 0%, rgba(13, 10, 7, 0.2) 50%, transparent 100%)',
                        }}
                      />

                      {/* Single Clean Status Tag (Pojok Kiri Atas) */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: 'rgba(20, 15, 10, 0.82)',
                          backdropFilter: 'blur(6px)',
                          color: isPublic ? '#34d399' : '#e8bb5c',
                          border: `1px solid ${isPublic ? 'rgba(16, 185, 129, 0.6)' : 'rgba(212, 175, 55, 0.35)'}`,
                          fontSize: '11px',
                          fontWeight: '750',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {isPublic ? <Globe size={11} /> : <Lock size={11} />}
                        <span>{isPublic ? 'Publik' : 'Privat'}</span>
                      </div>

                      {/* Tombol Play Mengambang di Pojok Kanan Bawah */}
                      <button
                        onClick={() => {
                          if (onPlayPerformance) onPlayPerformance(item);
                        }}
                        title="Tonton Pagelaran"
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          right: '12px',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #e8bb5c 0%, #d4af37 100%)',
                          border: 'none',
                          color: '#0d0a07',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.45)',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.08)';
                          e.currentTarget.style.filter = 'brightness(1.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1.0)';
                          e.currentTarget.style.filter = 'none';
                        }}
                      >
                        <Play size={15} fill="#0d0a07" style={{ marginLeft: '2px' }} />
                      </button>
                    </div>

                    {/* 2. Isi Kartu: Metadata Terpadu, Judul Lakon & Cast */}
                    <div
                      style={{
                        padding: '20px 22px',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        boxSizing: 'border-box',
                      }}
                    >
                      {/* Metadata Row: Tanggal, Babak, dan Gamelan */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '6px',
                          fontSize: '11.5px',
                          color: '#8b5a1b',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          marginBottom: '8px',
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} />
                          {new Date(item.updated_at || item.created_at || '2026-01-01').toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span style={{ color: 'rgba(139, 90, 27, 0.35)' }}>•</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Layers size={11} /> {sceneCount} Babak
                        </span>
                        <span style={{ color: 'rgba(139, 90, 27, 0.35)' }}>•</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Music size={11} /> {audioTitle}
                        </span>
                      </div>

                      {/* Tag Rujukan Cerita Pakem (Jika Ada) */}
                      {refStory && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '11px',
                            color: '#7a4e18',
                            background: '#faf6ee',
                            border: '1px solid rgba(212, 175, 55, 0.25)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontWeight: '650',
                            width: 'fit-content',
                            marginBottom: '8px',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <BookOpen size={11} style={{ color: '#b48a28', flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            Pakem: {refStory.title}
                          </span>
                        </div>
                      )}

                      {/* Judul Lakon */}
                      <h3
                        style={{
                          margin: '0 0 8px 0',
                          fontSize: '19px',
                          fontWeight: '800',
                          color: '#1a140e',
                          letterSpacing: '-0.3px',
                          lineHeight: '1.3',
                        }}
                      >
                        {item.title}
                      </h3>

                      {/* Deskripsi Lakon */}
                      <p
                        style={{
                          margin: '0 0 16px 0',
                          fontSize: '13.5px',
                          color: '#6b7280',
                          lineHeight: '1.55',
                          flex: 1,
                        }}
                      >
                        {item.description || 'Pementasan lakon wayang digital dengan animasi solah dalang dua dimensi.'}
                      </p>

                      {/* Daftar Tokoh Wayang Terlibat (Cast Roster) */}
                      {charactersList.length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                          <div
                            style={{
                              fontSize: '11px',
                              fontWeight: '750',
                              color: '#8b5a1b',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              marginBottom: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Users size={11} />
                            <span>Tokoh Dimainkan:</span>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {charactersList.map((ch, cI) => (
                              <span
                                key={cI}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: '#fcfaf5',
                                  border: '1px solid rgba(212, 175, 55, 0.3)',
                                  borderRadius: '8px',
                                  padding: '2px 8px',
                                  fontSize: '11px',
                                  fontWeight: '650',
                                  color: '#2b2118',
                                }}
                              >
                                {ch.avatar ? (
                                  <img
                                    src={ch.avatar}
                                    alt={ch.name}
                                    style={{ width: '13px', height: '13px', borderRadius: '50%' }}
                                  />
                                ) : (
                                  <span
                                    style={{
                                      width: '6px',
                                      height: '6px',
                                      borderRadius: '50%',
                                      background: ch.accentColor,
                                      display: 'inline-block',
                                    }}
                                  />
                                )}
                                <span>{ch.name}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3. Toolbar Aksi Kartu: Standardized 12px Radius & Clear Hierarchy */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          borderTop: '1px solid rgba(212, 175, 55, 0.18)',
                          paddingTop: '14px',
                          marginTop: 'auto',
                        }}
                      >
                        {/* Tombol Utama: Buka di Studio */}
                        <button
                          onClick={() => handleReopenInStudio(item)}
                          style={{
                            flex: 1,
                            minHeight: '42px',
                            background: 'linear-gradient(135deg, #e8bb5c 0%, #d4af37 100%)',
                            border: 'none',
                            color: '#1a140e',
                            padding: '9px 14px',
                            borderRadius: '12px',
                            fontSize: '13px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 8px rgba(212, 175, 55, 0.2)',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.filter = 'brightness(1.06)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.filter = 'none';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <Edit3 size={14} />
                          <span>Buka Studio</span>
                        </button>

                        {/* Tombol Putar Pagelaran */}
                        <button
                          onClick={() => {
                            if (onPlayPerformance) onPlayPerformance(item);
                          }}
                          title="Tonton Pagelaran Langsung"
                          style={{
                            minHeight: '42px',
                            background: '#ffffff',
                            border: '1px solid rgba(212, 175, 55, 0.35)',
                            color: '#8b5a1b',
                            padding: '9px 12px',
                            borderRadius: '12px',
                            fontSize: '12.5px',
                            fontWeight: '750',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#d4af37';
                            e.currentTarget.style.background = '#fcfaf5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
                            e.currentTarget.style.background = '#ffffff';
                          }}
                        >
                          <Play size={13} fill="#8b5a1b" />
                          <span>Tonton</span>
                        </button>

                        {/* Tombol Cepat Ubah Visibilitas (Publik ⇄ Privat) */}
                        <button
                          onClick={() => handleToggleVisibility(item)}
                          title={`Ubah menjadi ${isPublic ? 'Privat' : 'Publik'}`}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: '#fcfaf5',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            color: isPublic ? '#059669' : '#8b5a1b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            flexShrink: 0,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#d4af37';
                            e.currentTarget.style.background = '#f7f2e4';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                            e.currentTarget.style.background = '#fcfaf5';
                          }}
                        >
                          {isPublic ? <Globe size={14} /> : <Lock size={14} />}
                        </button>

                        {/* Tombol Duplikasi */}
                        <button
                          onClick={() => handleDuplicate(item)}
                          title="Duplikasi Karya"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: '#fcfaf5',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            color: '#2b2118',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            flexShrink: 0,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#d4af37';
                            e.currentTarget.style.background = '#f7f2e4';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                            e.currentTarget.style.background = '#fcfaf5';
                          }}
                        >
                          <Copy size={14} />
                        </button>

                        {/* Tombol Hapus */}
                        <button
                          onClick={() => setDeleteTarget(item)}
                          title="Hapus Karya"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'rgba(239, 68, 68, 0.06)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            color: '#dc2626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            flexShrink: 0,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.14)';
                            e.currentTarget.style.borderColor = '#dc2626';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)';
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.25)';
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          4. MODAL KONFIRMASI HAPUS ELEGAN (CUSTOM DIALOG)
          ============================================================ */}
      {deleteTarget && (
        <div
          className="wayang-modal-backdrop"
          style={{ zIndex: 1100 }}
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="wayang-modal-chassis"
            style={{ maxWidth: '480px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="wayang-modal-inner" style={{ padding: '32px 28px', textAlign: 'center' }}>
              <div className="wayang-modal-hairline" />

              {/* Tombol Tutup X */}
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                aria-label="Tutup Dialog"
                className="wayang-modal-close-btn"
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  width: '38px',
                  height: '38px',
                }}
              >
                <X size={16} />
              </button>

              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  boxShadow: '0 4px 12px rgba(185, 28, 28, 0.08)',
                  color: '#b91c1c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                }}
              >
                <Trash2 size={24} />
              </div>

              <div
                className="wayang-modal-eyebrow"
                style={{
                  marginBottom: '8px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  borderColor: 'rgba(239, 68, 68, 0.35)',
                  color: '#b91c1c',
                }}
              >
                <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
                <span>KONFIRMASI PENGHAPUSAN</span>
              </div>

              <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', fontWeight: '850', color: '#1a140e', fontFamily: 'Cinzel, Georgia, serif', letterSpacing: '-0.3px' }}>
                Hapus Pementasan?
              </h3>
              <p style={{ margin: '0 0 26px 0', fontSize: '13.5px', color: '#5c4738', lineHeight: '1.65' }}>
                Apakah Anda yakin ingin menghapus karya{' '}
                <strong style={{ color: '#8b4513' }}>"{deleteTarget.title}"</strong>? Seluruh susunan adegan dan dialog di dalamnya akan dihapus secara permanen.
              </p>

              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="wayang-btn-ghost"
                  style={{ flex: 1 }}
                >
                  Batalkan
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="wayang-btn-cta"
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                    color: '#ffffff',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Hapus</span>
                  <span className="wayang-btn-cta-icon" style={{ background: 'rgba(0,0,0,0.2)' }}>
                    <Trash2 size={15} color="#ffffff" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          5. MODAL DETAIL & BEDAH SKENARIO LAKON (PRATINJAU LENGKAP)
          ============================================================ */}
      {inspectingTemplate && (
        <div
          className="wayang-modal-backdrop"
          style={{ zIndex: 1100 }}
          onClick={() => setInspectingTemplate(null)}
        >
          <div
            className="wayang-modal-chassis"
            style={{
              maxWidth: '840px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              background: '#f7f3ea',
              borderRadius: '20px',
              border: 'none',
              boxShadow: '0 24px 64px -12px rgba(20, 14, 9, 0.35), 0 4px 20px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="wayang-modal-hairline" />

            {/* 1. Atmospheric Cover Banner with Fixed Badge Row & Close Button */}
            <div
              style={{
                position: 'relative',
                height: '140px',
                width: '100%',
                flexShrink: 0,
                overflow: 'hidden',
                backgroundColor: '#140e09',
              }}
            >
              <img
                src={inspectingTemplate.coverImg}
                alt={inspectingTemplate.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', filter: 'brightness(0.78) contrast(1.05)' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(20, 14, 9, 0.45) 0%, rgba(247, 243, 234, 0.5) 60%, #f7f3ea 100%)',
                }}
              />

              {/* Top Navigation Row on Banner: Badges & Close Button */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '20px',
                  right: '18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  zIndex: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      background: '#ffffff',
                      color: '#1a140e',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: '800',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      border: '1px solid rgba(40, 28, 16, 0.08)',
                      boxShadow: '0 2px 8px rgba(40, 28, 16, 0.08)',
                    }}
                  >
                    {inspectingTemplate.tradition}
                  </span>

                  <span
                    className="wayang-modal-eyebrow"
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      padding: '4px 12px',
                      boxShadow: '0 2px 8px rgba(40, 28, 16, 0.08)',
                      margin: 0,
                    }}
                  >
                    {inspectingTemplate.scenesCount} Babak Lengkap
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setInspectingTemplate(null)}
                  aria-label="Tutup Pratinjau"
                  className="wayang-modal-close-btn"
                  style={{
                    width: '38px',
                    height: '38px',
                    flexShrink: 0,
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* 2. Dedicated Title & Eyebrow Row in Normal Flow (Cannot Collide) */}
            <div
              style={{
                padding: '2px 28px 16px 28px',
                borderBottom: 'none',
                background: '#f7f3ea',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  color: '#8b4513',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d4af37' }} />
                <span>{inspectingTemplate.subtitle}</span>
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: '850',
                  color: '#1a140e',
                  fontFamily: 'Cinzel, Georgia, serif',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.25',
                }}
              >
                {inspectingTemplate.title}
              </h2>
            </div>

            {/* 3. Scrollable Body with Clean Heritage Cards */}
            <div
              className="wayang-modal-inner modal-custom-scroll"
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '22px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              {/* Sinopsis & Latar Filosofis — Clean Editorial */}
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#8b4513',
                    fontWeight: '800',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}
                >
                  Sinopsis & Latar Filosofis
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: '#3d2b1f', lineHeight: '1.8' }}>
                  {inspectingTemplate.description}
                </p>
              </div>

              {/* Roster Tokoh yang Dipentaskan */}
              <div>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#8b4513', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Komposisi Tokoh di Panggung Kelir
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  {inspectingTemplate.characters.map((ch, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: '#ffffff',
                        border: '1px solid rgba(40, 28, 16, 0.08)',
                        borderRadius: '9999px',
                        padding: '5px 16px 5px 6px',
                        boxShadow: '0 2px 6px rgba(40, 28, 16, 0.04)',
                      }}
                    >
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          border: `1.5px solid ${ch.accentColor || '#d4af37'}`,
                          overflow: 'hidden',
                          background: '#0d0805',
                          flexShrink: 0,
                        }}
                      >
                        {ch.avatar ? (
                          <img src={ch.avatar} alt={ch.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e8bb5c', fontWeight: 'bold', fontSize: '11px' }}>
                            {ch.name[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: '800', color: '#1a140e' }}>{ch.name}</div>
                        <div style={{ fontSize: '11px', color: '#8b4513', fontWeight: '600' }}>{ch.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daftar Babak Adegan Beserta Dialog */}
              <div>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#8b4513', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Rangkaian Babak & Naskah Dialog
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {inspectingTemplate.scenes.map((sc, sIdx) => (
                    <div
                      key={sIdx}
                      style={{
                        background: '#ffffff',
                        border: '1px solid rgba(40, 28, 16, 0.08)',
                        borderRadius: '14px',
                        padding: '16px 18px',
                        boxShadow: '0 2px 6px rgba(40, 28, 16, 0.03)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#1a140e' }}>
                          Babak {sIdx + 1}: {sc.title}
                        </span>
                        <span style={{ fontSize: '11px', color: '#8b4513', background: 'rgba(212, 175, 55, 0.12)', border: '1px solid rgba(212, 175, 55, 0.2)', padding: '3px 10px', borderRadius: '9999px', fontWeight: '750' }}>
                          Latar: {sc.background.replace('kelir-', '').replace(/-/g, ' ')}
                        </span>
                      </div>

                      {sc.characters?.[0]?.dialogue && (
                        <div style={{ padding: '10px 14px', background: 'rgba(247, 243, 234, 0.65)', borderLeft: '3.5px solid #d4af37', borderRadius: '0 8px 8px 0' }}>
                          <div style={{ fontSize: '13.5px', fontStyle: 'italic', color: '#1a140e', fontWeight: '650', marginBottom: '4px', fontFamily: 'Georgia, serif' }}>
                            "{sc.characters[0].dialogue}"
                          </div>
                          {sc.characters[0].translation && (
                            <div style={{ fontSize: '12px', color: '#6e5e4d' }}>
                              Terjemahan: {sc.characters[0].translation}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Audio Gamelan Player dalam Modal */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  background: '#ffffff',
                  border: '1px solid rgba(40, 28, 16, 0.08)',
                  boxShadow: '0 2px 8px rgba(40, 28, 16, 0.04)',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(212, 175, 55, 0.16)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#8b4513',
                    }}
                  >
                    <Music size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#1a140e' }}>
                      Iringan: {inspectingTemplate.audioTitle}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#8b4513', fontWeight: '650' }}>{inspectingTemplate.audioMood}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleAudio(inspectingTemplate)}
                  style={{
                    background: playingAudioId === inspectingTemplate.id ? 'linear-gradient(135deg, #e8bb5c 0%, #d4af37 100%)' : '#ffffff',
                    color: '#1a140e',
                    border: '1px solid rgba(40, 28, 16, 0.12)',
                    borderRadius: '9999px',
                    padding: '7px 18px',
                    fontSize: '12px',
                    fontWeight: '750',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    minHeight: '38px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 6px rgba(40, 28, 16, 0.04)',
                  }}
                >
                  {playingAudioId === inspectingTemplate.id ? <Square size={13} fill="#1a140e" /> : <Play size={13} fill="#1a140e" />}
                  <span>{playingAudioId === inspectingTemplate.id ? 'Hentikan Audio' : 'Dengar Iringan'}</span>
                </button>
              </div>
            </div>

            {/* 4. Pinned Sticky Action Footer */}
            <div
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px',
                padding: '16px 28px',
                background: '#f7f3ea',
                borderTop: 'none',
                boxShadow: '0 -4px 16px rgba(40, 28, 16, 0.04)',
              }}
            >
              <button
                type="button"
                onClick={() => setInspectingTemplate(null)}
                className="wayang-btn-ghost"
                style={{ minHeight: '44px' }}
              >
                Tutup Pratinjau
              </button>

              <button
                type="button"
                onClick={() => {
                  const tpl = inspectingTemplate;
                  setInspectingTemplate(null);
                  handleUseTemplate(tpl);
                }}
                className="wayang-btn-cta"
                style={{ minHeight: '44px', padding: '6px 6px 6px 22px' }}
              >
                <span>Gunakan Template di Studio</span>
                <span className="wayang-btn-cta-icon">
                  <ArrowRight size={16} color="#16100a" />
                </span>
              </button>
            </div>
          </div>
      </div>
    )}

      {/* ============================================================
          6. TOAST FEEDBACK NOTIFIKASI SUKSES / INFO
          ============================================================ */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            zIndex: 1200,
            background: '#17110c',
            border: '1px solid rgba(212, 175, 55, 0.45)',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(40, 28, 16, 0.2)',
            borderRadius: '12px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#fcfaf2',
            fontSize: '13.5px',
            fontWeight: '650',
            animation: 'fadeInUp 0.3s ease',
          }}
        >
          <div
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: '#e8bb5c',
              color: '#0d0a07',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Check size={13} strokeWidth={3} />
          </div>
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
