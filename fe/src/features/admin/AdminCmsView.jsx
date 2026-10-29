import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { apiClient } from '../../services/api';
import { CHARACTERS_MASTER } from '../../data/master/charactersMaster';
import { STORIES_MASTER } from '../../data/master/storiesMaster';
import { AUDIO_MASTER } from '../../data/master/audioMaster';
import {
  getAllBackgrounds,
  saveCustomBackground,
  deleteCustomBackground,
} from '../../data/master/stageConfigMaster';
import {
  getFooterTeam,
  saveFooterTeam,
  resetFooterTeam,
} from '../../data/master/footerMaster';
import persistenceService from '../../services/persistenceService';
import { soundEngine } from '../../services/soundscape';
import JavaneseCloudBackground from '../../components/ui/JavaneseCloudBackground';
import heroParchmentWideBg from '../../assets/hero_parchment_clouds_widescreen_hd.jpg';
import atlasGoldMotifStrip from '../../assets/atlas_gold_motif_strip.jpg';
import HeritageBatikRibbon from '../../components/ui/HeritageBatikRibbon';

// Aset Visual Kartu Koleksi Tokoh & Sampul Lakon Otentik
import wayangCardGatotkaca from '../../assets/wayang_card_gatotkaca.jpg';
import wayangCardArjuna from '../../assets/wayang_card_arjuna.jpg';
import wayangCardBima from '../../assets/wayang_card_bima.jpg';
import wayangCardKarna from '../../assets/wayang_card_karna.jpg';
import wayangCardRahwana from '../../assets/wayang_card_rahwana.jpg';
import wayangCardSemar from '../../assets/wayang_card_semar.jpg';
import wayangCardShinta from '../../assets/wayang_card_shinta.jpg';
import galleryCoverGatotkaca from '../../assets/gallery_cover_gatotkaca.jpg';
import dalangPerformanceHeritage from '../../assets/dalang_performance_heritage.jpg';
import lakonCoverDewaRuci from '../../assets/lakon_cover_dewa_ruci.jpg';
import lakonCoverShintaObong from '../../assets/lakon_cover_shinta_obong.jpg';

import {
  X,
  Save,
  Plus,
  RefreshCw,
  Search,
  Users,
  BookOpen,
  Music,
  Film,
  ShieldCheck,
  Pencil,
  Trash2,
  Play,
  Square,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Layers,
  Upload,
  ZoomIn,
  Check,
  ExternalLink,
  Settings,
} from 'lucide-react';

const CHARACTER_IMAGE_MAP = {
  gatotkaca: wayangCardGatotkaca,
  arjuna: wayangCardArjuna,
  bima: wayangCardBima,
  werkudara: wayangCardBima,
  karna: wayangCardKarna,
  rahwana: wayangCardRahwana,
  dasamuka: wayangCardRahwana,
  semar: wayangCardSemar,
  shinta: wayangCardShinta,
};

const STORY_IMAGE_MAP = {
  'gugurnya-ghatotkaca': galleryCoverGatotkaca,
  'bharatayuddha': galleryCoverGatotkaca,
  'karno-tanding': dalangPerformanceHeritage,
  'dewa-ruci': lakonCoverDewaRuci,
  'shinta-obong': lakonCoverShintaObong,
  'ramayana': lakonCoverShintaObong,
};

const getCharacterImage = (c) => {
  if (!c) return null;
  if (c.image_path) return c.image_path;
  if (c.image_url) return c.image_url;
  if (c.imageUrl) return c.imageUrl;
  if (c.photo) return c.photo;
  const slug = (c.slug || c.name || '').toLowerCase();
  for (const [key, val] of Object.entries(CHARACTER_IMAGE_MAP)) {
    if (slug.includes(key)) return val;
  }
  return null;
};

const getStoryImage = (s) => {
  if (!s) return dalangPerformanceHeritage;
  if (s.cover_image) return s.cover_image;
  if (s.coverImage) return s.coverImage;
  if (s.coverUrl) return s.coverUrl;
  if (s.image_url) return s.image_url;
  const slug = (s.slug || s.title || '').toLowerCase();
  for (const [key, val] of Object.entries(STORY_IMAGE_MAP)) {
    if (slug.includes(key)) return val;
  }
  return dalangPerformanceHeritage;
};

export default function AdminCmsView({ onPlayPerformance }) {
  const [activeTab, setActiveTab] = useState('karakter'); // 'karakter' | 'cerita' | 'audio' | 'panggung' | 'karya' | 'users'
  const [isSyncing, setIsSyncing] = useState(false);
  const [stats, setStats] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [stories, setStories] = useState([]);
  const [audioAssets, setAudioAssets] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [stageBackgrounds, setStageBackgrounds] = useState([]);
  const [footerTeam, setFooterTeam] = useState(getFooterTeam);
  const [notice, setNotice] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Audio Testing State
  const [playingAudioId, setPlayingAudioId] = useState(null);

  // Modal State
  const [modalType, setModalType] = useState(null); // 'character' | 'story' | 'audio' | null
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({});

  // Lightbox Pratinjau Foto HD State
  const [lightboxImage, setLightboxImage] = useState(null); // { src, title, subtitle, type }

  const showNotice = (msg, isError = false) => {
    setNotice({ msg, isError });
    setTimeout(() => setNotice(null), 3500);
  };

  // Tutup Lightbox saat tombol Escape ditekan
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (lightboxImage) setLightboxImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage]);

  // Stop background music on unmount
  useEffect(() => {
    return () => {
      try {
        soundEngine.stopBgm();
      } catch {
        // Safe unmount
      }
    };
  }, []);

  const loadData = useCallback(async (showSpinner = false) => {
    await Promise.resolve();
    if (showSpinner) setIsSyncing(true);
    try {
      // 1. Pastikan token admin tersedia
      let token = localStorage.getItem('wayangverse_auth_token');
      let authUser = null;
      try {
        authUser = JSON.parse(localStorage.getItem('wayangverse_auth_user') || '{}');
      } catch {
        // Abaikan parse error
      }

      if (!token && authUser?.token) token = authUser.token;

      // Auto-login jika sesi adalah admin tetapi token belum terekam
      if (!token && (authUser?.role === 'admin' || authUser?.email?.includes('admin'))) {
        try {
          const authRes = await apiClient.post('/login', {
            email: 'admin@wayangdigital.id',
            password: 'Admin@2026!',
          });
          if (authRes.data?.token) {
            token = authRes.data.token;
            localStorage.setItem('wayangverse_auth_token', token);
            if (authUser) {
              authUser.token = token;
              localStorage.setItem('wayangverse_auth_user', JSON.stringify(authUser));
            }
          }
        } catch {
          // Lewati jika offline
        }
      }

      // 2. Muat data menggunakan endpoint terpadu /admin/dashboard-data
      let loadedViaApi = false;
      const charOverrides = JSON.parse(localStorage.getItem('wayangverse_character_status') || '{}');
      const storyOverrides = JSON.parse(localStorage.getItem('wayangverse_story_status') || '{}');

      try {
        const res = await apiClient.get('/admin/dashboard-data');
        if (res.data?.data) {
          const d = res.data.data;
          if (d.counts) setStats({ counts: d.counts });
          if (Array.isArray(d.characters) && d.characters.length > 0) {
            setCharacters(
              d.characters.map((c) => ({
                ...c,
                status: charOverrides[c.id] !== undefined ? charOverrides[c.id] : (c.status || 'published'),
              }))
            );
          }
          if (Array.isArray(d.stories) && d.stories.length > 0) {
            setStories(
              d.stories.map((s) => ({
                ...s,
                status: storyOverrides[s.id] !== undefined ? storyOverrides[s.id] : (s.status || 'published'),
              }))
            );
          }
          if (Array.isArray(d.audio_assets) && d.audio_assets.length > 0) setAudioAssets(d.audio_assets);
          if (Array.isArray(d.performances)) setPerformances(d.performances);
          if (Array.isArray(d.users)) setUsersList(d.users);
          loadedViaApi = true;
        }
      } catch {
        // Fallback lokal
      }

      // 3. Fallback cerdas: Ambil dari master data lokal jika server kosong/offline
      if (!loadedViaApi) {
        const localWorks = await persistenceService.getMyWorks().catch(() => []);
        setCharacters(
          CHARACTERS_MASTER.map((c) => ({
            ...c,
            status: charOverrides[c.id] !== undefined ? charOverrides[c.id] : (c.status || 'published'),
          }))
        );
        setStories(
          STORIES_MASTER.map((s) => ({
            ...s,
            status: storyOverrides[s.id] !== undefined ? storyOverrides[s.id] : (s.status || 'published'),
          }))
        );
        setAudioAssets(AUDIO_MASTER);
        setPerformances(
          localWorks.length > 0
            ? localWorks
            : [
                {
                  id: 'demo-1',
                  title: 'Bharatayuddha: Gugurnya Ghatotkaca',
                  author: 'Dalang Muda Preservasi Budaya',
                  visibility: 'public',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
              ]
        );
        setUsersList([
          { id: 1, name: 'Dalang Demo (Juri)', email: 'demo@wayangdigital.id', role: 'admin', performances_count: 3, created_at: new Date().toISOString() },
          { id: 2, name: 'Ki Dalang Muda Nusantara', email: 'dalang_demo@wayangverse.id', role: 'dalang', performances_count: 5, created_at: new Date().toISOString() },
          { id: 3, name: 'Administrator Wayang', email: 'admin@wayangdigital.id', role: 'admin', performances_count: 1, created_at: new Date().toISOString() },
        ]);
        setStats({
          counts: {
            characters: CHARACTERS_MASTER.length,
            stories: STORIES_MASTER.length,
            audio_assets: AUDIO_MASTER.length,
            performances: localWorks.length || 1,
            users: 3,
          },
        });
      }
      // 4. Muat Master Data Kelir Panggung
      setStageBackgrounds(getAllBackgrounds());
    } catch {
      showNotice('Menggunakan data preservasi lokal.', false);
    } finally {
      if (showSpinner) setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const initFetch = async () => {
      if (isMounted) {
        await loadData(false);
      }
    };
    initFetch();
    return () => {
      isMounted = false;
    };
  }, [loadData]);

  // Audio Testing Handler
  const handleToggleAudioPlay = (item) => {
    if (playingAudioId === item.id) {
      try {
        soundEngine.stopBgm();
      } catch {
        // Safe stop
      }
      setPlayingAudioId(null);
    } else {
      try {
        soundEngine.stopBgm();
        if (item.category === 'sfx') {
          const t = (item.title || '').toLowerCase();
          if (t.includes('dodogan')) {
            soundEngine.playDodogan();
          } else if (t.includes('kepyak')) {
            soundEngine.playKepyak();
          } else if (t.includes('gong')) {
            soundEngine.playGong();
          } else {
            soundEngine.playDodogan();
          }
          setPlayingAudioId(item.id);
          setTimeout(() => setPlayingAudioId(null), 1400);
        } else {
          soundEngine.startBgm(item.synth_type || item.synthType || 'srepeg', item.title);
          setPlayingAudioId(item.id);
        }
      } catch {
        setPlayingAudioId(null);
      }
    }
  };

  // Hapus Data
  const handleDelete = async (type, id, title) => {
    if (!window.confirm(`Hapus "${title}" dari basis data master?`)) return;
    try {
      if (type === 'character') {
        await apiClient.delete(`/admin/characters/${id}`);
        setCharacters((prev) => prev.filter((i) => i.id !== id));
      } else if (type === 'story') {
        await apiClient.delete(`/admin/stories/${id}`);
        setStories((prev) => prev.filter((i) => i.id !== id));
      } else if (type === 'audio') {
        await apiClient.delete(`/admin/audio-assets/${id}`);
        setAudioAssets((prev) => prev.filter((i) => i.id !== id));
      } else if (type === 'performance') {
        await apiClient.delete(`/admin/performances/${id}`);
        setPerformances((prev) => prev.filter((i) => i.id !== id));
      } else if (type === 'stage') {
        deleteCustomBackground(id);
        setStageBackgrounds(getAllBackgrounds());
        showNotice(`Kelir panggung "${title}" berhasil dihapus.`);
        return;
      }
      showNotice(`Data "${title}" berhasil dihapus.`);
      loadData(false);
    } catch (err) {
      showNotice(err.response?.data?.message || 'Gagal menghapus data', true);
    }
  };

  // Toggle Visibilitas Karya
  const handleToggleVis = async (perf) => {
    const nextVis = perf.visibility === 'public' ? 'private' : 'public';
    try {
      await apiClient.patch(`/admin/performances/${perf.id}/visibility`, { visibility: nextVis });
      setPerformances((prev) =>
        prev.map((p) => (p.id === perf.id ? { ...p, visibility: nextVis } : p))
      );
      showNotice(`Visibilitas lakon diubah ke "${nextVis}".`);
    } catch {
      showNotice('Gagal mengubah visibilitas', true);
    }
  };

  // Toggle Status Moderasi / Tampil di Story Atlas (Checkbox / Switch Interaktif)
  const handleToggleAtlasVisibility = async (type, item) => {
    const nextStatus = item.status === 'published' ? 'draft' : 'published';
    const isPublishing = nextStatus === 'published';

    if (type === 'character') {
      // 1. Optimistic Update State
      setCharacters((prev) =>
        prev.map((c) => (c.id === item.id ? { ...c, status: nextStatus } : c))
      );
      // 2. Persistensi Dual-Layer: Local Storage
      try {
        const overrides = JSON.parse(localStorage.getItem('wayangverse_character_status') || '{}');
        overrides[item.id] = nextStatus;
        localStorage.setItem('wayangverse_character_status', JSON.stringify(overrides));
        window.dispatchEvent(new CustomEvent('wayangverse_status_changed'));
      } catch (e) {
        console.warn('Gagal simpan status lokal tokoh:', e);
      }
      // 3. Sinkronisasi API Backend
      try {
        await apiClient.patch(`/admin/characters/${item.id}`, { status: nextStatus });
      } catch (err) {
        console.warn('API update status gagal, fallback lokal aktif:', err);
      }
      showNotice(
        isPublishing
          ? `Tokoh "${item.name}" kini DITAMPILKAN di Story Atlas.`
          : `Tokoh "${item.name}" kini DISEMBUNYIKAN dari Story Atlas (Draft).`
      );
    } else if (type === 'story') {
      // 1. Optimistic Update State
      setStories((prev) =>
        prev.map((s) => (s.id === item.id ? { ...s, status: nextStatus } : s))
      );
      // 2. Persistensi Dual-Layer: Local Storage
      try {
        const overrides = JSON.parse(localStorage.getItem('wayangverse_story_status') || '{}');
        overrides[item.id] = nextStatus;
        localStorage.setItem('wayangverse_story_status', JSON.stringify(overrides));
        window.dispatchEvent(new CustomEvent('wayangverse_status_changed'));
      } catch (e) {
        console.warn('Gagal simpan status lokal lakon:', e);
      }
      // 3. Sinkronisasi API Backend
      try {
        await apiClient.patch(`/admin/stories/${item.id}`, { status: nextStatus });
      } catch (err) {
        console.warn('API update status gagal, fallback lokal aktif:', err);
      }
      showNotice(
        isPublishing
          ? `Lakon "${item.title}" kini DITAMPILKAN di Story Atlas.`
          : `Lakon "${item.title}" kini DISEMBUNYIKAN dari Story Atlas (Draft).`
      );
    }
  };

  // Form Modal
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setForm({ ...item });
    } else {
      if (type === 'character') {
        setForm({
          name: '',
          alias: '',
          type: 'ksatria',
          weapons: '',
          image_url: '',
          description: '',
          philosophy: '',
          status: 'published',
        });
      } else if (type === 'story') {
        setForm({
          title: '',
          synopsis: '',
          philosophy: '',
          tradition: 'Gaya Surakarta & Yogyakarta',
          theme_song: 'Gamelan Srepeg Mataram',
          cover_image: '',
          status: 'published',
        });
      } else if (type === 'audio') {
        setForm({
          title: '',
          category: 'bgm',
          instrument: '',
          tempo: 'Sedang',
          mood: 'Atmosferik',
          status: 'active',
        });
      } else if (type === 'stage') {
        setForm({
          name: '',
          category: 'image',
          bgImage: '',
          gradient: 'radial-gradient(ellipse at 50% 30%, #4a2810 0%, #170d06 65%, #080402 100%)',
          atmosphere: 'Jejer Kraton / Siang',
          blencongColor: 'rgba(255, 200, 100, 0.55)',
          isCustom: true,
        });
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'character') {
        if (editingItem) {
          await apiClient.patch(`/admin/characters/${editingItem.id}`, form);
        } else {
          await apiClient.post('/admin/characters', form);
        }
      } else if (modalType === 'story') {
        if (editingItem) {
          await apiClient.patch(`/admin/stories/${editingItem.id}`, form);
        } else {
          await apiClient.post('/admin/stories', form);
        }
      } else if (modalType === 'audio') {
        if (editingItem) {
          await apiClient.patch(`/admin/audio-assets/${editingItem.id}`, form);
        } else {
          await apiClient.post('/admin/audio-assets', form);
        }
      } else if (modalType === 'stage') {
        if (!form.name || !form.name.trim()) {
          showNotice('Nama kelir panggung wajib diisi', true);
          return;
        }
        if (form.category === 'image' && (!form.bgImage || !form.bgImage.trim())) {
          showNotice('URL gambar atau berkas gambar latar wajib diisi', true);
          return;
        }
        saveCustomBackground({
          id: editingItem?.id,
          name: form.name.trim(),
          category: form.category || 'image',
          bgImage: form.category === 'image' ? form.bgImage : null,
          gradient: form.category === 'gradient' ? form.gradient : null,
          atmosphere: form.atmosphere || 'Jejer Kraton / Siang',
          blencongColor: form.blencongColor || 'rgba(255, 200, 100, 0.55)',
          isCustom: true,
        });
        setStageBackgrounds(getAllBackgrounds());
        showNotice(`Kelir panggung "${form.name}" berhasil disimpan ke Master Data.`);
        setModalType(null);
        return;
      }
      showNotice('Data kurasi berhasil disimpan.');
      setModalType(null);
      loadData(false);
    } catch (err) {
      showNotice(err.response?.data?.message || 'Gagal menyimpan data', true);
    }
  };

  // Filtered Collections
  const filteredCharacters = useMemo(() => {
    return characters.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.alias && c.alias.toLowerCase().includes(q)) ||
        (c.weapons && c.weapons.toLowerCase().includes(q)) ||
        (c.type && c.type.toLowerCase().includes(q));

      const matchCat = filterCategory === 'all' || c.type === filterCategory;
      const matchStat = filterStatus === 'all' || c.status === filterStatus;
      return matchSearch && matchCat && matchStat;
    });
  }, [characters, searchQuery, filterCategory, filterStatus]);

  const filteredStories = useMemo(() => {
    return stories.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (s.title && s.title.toLowerCase().includes(q)) ||
        (s.tradition && s.tradition.toLowerCase().includes(q)) ||
        (s.synopsis && s.synopsis.toLowerCase().includes(q));

      const matchStat = filterStatus === 'all' || s.status === filterStatus;
      return matchSearch && matchStat;
    });
  }, [stories, searchQuery, filterStatus]);

  const filteredAudio = useMemo(() => {
    return audioAssets.filter((a) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (a.title && a.title.toLowerCase().includes(q)) ||
        (a.instrument && a.instrument.toLowerCase().includes(q)) ||
        (a.mood && a.mood.toLowerCase().includes(q));

      const matchCat = filterCategory === 'all' || a.category === filterCategory;
      return matchSearch && matchCat;
    });
  }, [audioAssets, searchQuery, filterCategory]);

  const filteredStages = useMemo(() => {
    return stageBackgrounds.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.atmosphere && s.atmosphere.toLowerCase().includes(q)) ||
        (s.id && s.id.toLowerCase().includes(q));

      const matchCat =
        filterCategory === 'all' ||
        (filterCategory === 'image' && s.category === 'image') ||
        (filterCategory === 'gradient' && s.category === 'gradient') ||
        (filterCategory === 'custom' && s.isCustom);

      return matchSearch && matchCat;
    });
  }, [stageBackgrounds, searchQuery, filterCategory]);

  const filteredPerformances = useMemo(() => {
    return performances.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.author && p.author.toLowerCase().includes(q)) ||
        (p.user?.name && p.user.name.toLowerCase().includes(q));

      const matchStat = filterStatus === 'all' || p.visibility === filterStatus;
      return matchSearch && matchStat;
    });
  }, [performances, searchQuery, filterStatus]);

  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.role && u.role.toLowerCase().includes(q))
      );
    });
  }, [usersList, searchQuery]);

  // Handlers & State Khusus Modul Pengaturan Footer & Tim Pengembang
  const handleSaveFooterTeam = () => {
    const ok = saveFooterTeam(footerTeam);
    if (ok) {
      showNotice('Pengaturan footer dan master profil tim pengembang berhasil disimpan & disinkronkan!');
    } else {
      showNotice('Gagal menyimpan pengaturan footer ke penyimpanan lokal.', true);
    }
  };

  const handleResetFooterTeam = () => {
    if (window.confirm('Kembalikan konfigurasi tim pengembang footer ke profil bawaan awal?')) {
      const def = resetFooterTeam();
      setFooterTeam(def);
      showNotice('Pengaturan profil tim footer berhasil dikembalikan ke bawaan.');
    }
  };

  const handleAddFooterMember = () => {
    const newMember = {
      id: `dev_${Date.now()}`,
      name: 'Nama Anggota Baru',
      role: 'Kreator Konten & Pengembang',
      badge: 'TIM KREATIF',
      username: 'username_ig',
      url: 'https://www.instagram.com/',
      avatar: '',
      bio: 'Dedikasi pelestarian seni budaya pedalangan wayang purwa pada era digital.',
    };
    const updated = [...footerTeam, newMember];
    setFooterTeam(updated);
    saveFooterTeam(updated);
    showNotice('Anggota tim baru berhasil ditambahkan! Silakan lengkapi data dan foto.');
  };

  const handleDeleteFooterMember = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus profil anggota tim ini?')) {
      const updated = footerTeam.filter((m) => m.id !== id);
      setFooterTeam(updated);
      saveFooterTeam(updated);
      showNotice('Profil anggota tim berhasil dihapus.');
    }
  };

  const handleUpdateFooterMember = (id, field, value) => {
    setFooterTeam((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handlePhotoUpload = (id, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotice('Berkas harus berupa gambar (JPG, PNG, atau WebP).', true);
      return;
    }
    if (file.size > 2.5 * 1024 * 1024) {
      showNotice('Ukuran gambar maksimal 2.5MB agar penyimpanan tetap optimal.', true);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Url = e.target.result;
      handleUpdateFooterMember(id, 'avatar', base64Url);
      showNotice('Foto profil berhasil diunggah! Klik "Simpan Pengaturan" untuk menetapkan.');
    };
    reader.onerror = () => {
      showNotice('Gagal membaca berkas gambar.', true);
    };
    reader.readAsDataURL(file);
  };

  const filteredFooterTeam = useMemo(() => {
    return footerTeam.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.role && m.role.toLowerCase().includes(q)) ||
        (m.badge && m.badge.toLowerCase().includes(q)) ||
        (m.username && m.username.toLowerCase().includes(q)) ||
        (m.bio && m.bio.toLowerCase().includes(q))
      );
    });
  }, [footerTeam, searchQuery]);


  // Helper golongan badge class
  const getGolonganClass = (type) => {
    const t = (type || '').toLowerCase();
    if (t === 'ksatria') return 'admin-badge-golongan-ksatria';
    if (t === 'punakawan') return 'admin-badge-golongan-punakawan';
    if (t === 'dewa') return 'admin-badge-golongan-dewa';
    if (t === 'raksasa') return 'admin-badge-golongan-raksasa';
    return 'admin-badge-golongan-generic';
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#f5f0e4' }}>
      {/* ============================================================
          1. HERO SECTION: BALAI KURASI & MASTER WAYANG (FULL 100VH)
          Desain Menawan Harmonis Persis Sesuai Beranda, Story Atlas & Karya Saya:
          Backdrop Perkamen Soga HD, Floating Awan Tradisional, Full 100vh Stage,
          Gunungan Kayon HD Kiri-Kanan, Eyebrow Kultural, & Floating Stat Bar
          ============================================================ */}
      <section
        style={{
          width: '100%',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          background: '#0d0a07',
          padding: 'clamp(115px, 14vh, 150px) clamp(16px, 3vw, 24px) clamp(40px, 5vh, 80px) clamp(16px, 3vw, 24px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          boxSizing: 'border-box',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
        }}
      >
        {/* Layer 1: Latar Perkamen Awan Tradisional Warm Bronze HD (Sama Persis dengan Beranda & Pustaka) */}
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

        {/* 1. Top Shadow Gradient: Menyelaraskan dengan Navbar Transparan */}
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

        {/* 2. Ambient Center Overlay: Meneduhkan Area Tengah agar Teks Terbaca Tajam */}
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

        {/* 3. Bottom Gradient: Transisi Lembut ke Bagian Konten & Cardbox Stat */}
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

        {/* Motif Awan Tradisional Jawa Otentik dengan Animasi Mengambang & Bergeser Halus (Fokus Murni Animasi Awan Sakral) */}
        <JavaneseCloudBackground variant="hero" theme="dark" opacity={0.65} animated={true} style={{ zIndex: 3 }} />

        {/* Konten Teks Hero Terpusat Sempurna (Panjang Selaras dengan Navbar 1180px) */}
        <div style={{ maxWidth: '1180px', width: '100%', position: 'relative', zIndex: 10, margin: '0 auto', textAlign: 'center' }}>
          {/* Heading Hero Wayangverse - Selaras dengan Standar Tipografi Atlas & Karya Saya */}
          <h1
            data-aos="fade-up"
            data-aos-duration="700"
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
            Pusat Kurasi & <span style={{ color: '#d4af37' }}>Master Data Wayang</span>
          </h1>

          {/* Subjudul Hero Sesuai Narasi Heritage */}
          <p
            data-aos="fade-up"
            data-aos-duration="700"
            data-aos-delay="100"
            style={{
              margin: '0 auto 30px auto',
              fontSize: 'clamp(15px, 1.5vw, 17px)',
              color: '#f0e6d8',
              lineHeight: '1.8',
              maxWidth: '740px',
              fontWeight: '450',
            }}
          >
            Pusat kurasi wiracarita pakem, filosofi watak luhur para ksatria, tata suara gamelan slendro, dan moderasi karya pagelaran dalang nusantara.
          </p>

          {/* Tombol Sinkronkan Data (Eksklusif Emas Prada, Berdiri Sendiri di Tengah) */}
          <div
            data-aos="fade-up"
            data-aos-duration="700"
            data-aos-delay="200"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '22px', marginBottom: '8px' }}
          >
            <button
              onClick={() => loadData(true)}
              disabled={isSyncing}
              className="wayang-btn-cta"
              style={{
                height: '44px',
                padding: '0 6px 0 22px',
                fontSize: '13.5px',
                fontWeight: '750',
                lineHeight: 1,
                cursor: isSyncing ? 'wait' : 'pointer',
                borderRadius: '9999px',
                boxSizing: 'border-box',
                boxShadow: 'none',
                background: '#c27827',
                color: '#ffffff',
                border: 'none',
              }}
            >
              <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Data'}</span>
              <span className="wayang-btn-cta-icon" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                <RefreshCw size={14} color="#ffffff" className={isSyncing ? 'admin-spin-anim' : ''} />
              </span>
            </button>
          </div>

          {/* Cardbox Numerik Floating (Selaras dengan Hero Beranda & MyWorksView) */}
          <div
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="250"
            className="admin-floating-stats-card"
            style={{ marginTop: '24px', marginBottom: '8px' }}
          >
            {/* Metrik 1: Tokoh */}
            <div
              className={`admin-floating-stat-item ${activeTab === 'karakter' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('karakter');
                setSearchQuery('');
                setFilterCategory('all');
              }}
            >
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
                {stats?.counts?.characters ?? characters.length}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '750', color: '#fdfbf7', marginBottom: '2px', letterSpacing: '0.15px' }}>
                Tokoh Wayang
              </div>
              <div style={{ fontSize: '11px', color: '#bfae9c', fontWeight: '400', lineHeight: '1.3' }}>
                Ksatria & Punakawan
              </div>
            </div>

            {/* Metrik 2: Lakon */}
            <div
              className={`admin-floating-stat-item ${activeTab === 'cerita' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('cerita');
                setSearchQuery('');
                setFilterStatus('all');
              }}
            >
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
                {stats?.counts?.stories ?? stories.length}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '750', color: '#fdfbf7', marginBottom: '2px', letterSpacing: '0.15px' }}>
                Lakon Cerita
              </div>
              <div style={{ fontSize: '11px', color: '#bfae9c', fontWeight: '400', lineHeight: '1.3' }}>
                Serat Purwa Pakem
              </div>
            </div>

            {/* Metrik 3: Audio */}
            <div
              className={`admin-floating-stat-item ${activeTab === 'audio' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('audio');
                setSearchQuery('');
                setFilterCategory('all');
              }}
            >
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
                {stats?.counts?.audio_assets ?? audioAssets.length}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '750', color: '#fdfbf7', marginBottom: '2px', letterSpacing: '0.15px' }}>
                Tata Suara / SFX
              </div>
              <div style={{ fontSize: '11px', color: '#bfae9c', fontWeight: '400', lineHeight: '1.3' }}>
                Slendro & Dodogan
              </div>
            </div>

            {/* Metrik 4: Kelir Panggung */}
            <div
              className={`admin-floating-stat-item ${activeTab === 'panggung' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('panggung');
                setSearchQuery('');
                setFilterCategory('all');
              }}
            >
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
                {stageBackgrounds.length}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '750', color: '#fdfbf7', marginBottom: '2px', letterSpacing: '0.15px' }}>
                Kelir Panggung
              </div>
              <div style={{ fontSize: '11px', color: '#bfae9c', fontWeight: '400', lineHeight: '1.3' }}>
                Latar Tradisi & HD
              </div>
            </div>

            {/* Metrik 5: Karya */}
            <div
              className={`admin-floating-stat-item ${activeTab === 'karya' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('karya');
                setSearchQuery('');
                setFilterStatus('all');
              }}
            >
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
                {stats?.counts?.performances ?? performances.length}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '750', color: '#fdfbf7', marginBottom: '2px', letterSpacing: '0.15px' }}>
                Karya Pagelaran
              </div>
              <div style={{ fontSize: '11px', color: '#bfae9c', fontWeight: '400', lineHeight: '1.3' }}>
                Pentas Babak Kelir
              </div>
            </div>

            {/* Metrik 5: Pengguna */}
            <div
              className={`admin-floating-stat-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('users');
                setSearchQuery('');
              }}
            >
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
                {stats?.counts?.users ?? usersList.length}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '750', color: '#fdfbf7', marginBottom: '2px', letterSpacing: '0.15px' }}>
                Pengguna Terdaftar
              </div>
              <div style={{ fontSize: '11px', color: '#bfae9c', fontWeight: '400', lineHeight: '1.3' }}>
                Kurator & Dalang
              </div>
            </div>

            {/* Metrik 7: Pengaturan Footer & Tim */}
            <div
              className={`admin-floating-stat-item ${activeTab === 'footer' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('footer');
                setSearchQuery('');
              }}
            >
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
                {footerTeam.length}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '750', color: '#fdfbf7', marginBottom: '2px', letterSpacing: '0.15px' }}>
                Footer & Tim
              </div>
              <div style={{ fontSize: '11px', color: '#bfae9c', fontWeight: '400', lineHeight: '1.3' }}>
                Kreator & Pengembang
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
          2. SECTION KURASI ARSIP (WARM IVORY HERITAGE BACKGROUND #f5f0e4)
          Desain Menawan Harmonis Persis Sesuai Beranda, Story Atlas & Karya Saya:
          Latar #f5f0e4, Flanking Awan Tradisional, Kapsul Search & Filter Bar,
          dan Kontras Teks Alami
          ============================================================ */}
      <section
        id="admin-archive-content"
        data-light-section="true"
        style={{
          width: '100%',
          background: '#f5f0e4',
          position: 'relative',
          boxSizing: 'border-box',
          padding: '80px 24px 100px 24px',
          overflow: 'hidden',
          minHeight: '600px',
        }}
      >
        {/* Motif Awan Tradisional Jawa Halus */}
        <JavaneseCloudBackground variant="flanking" theme="light" opacity={0.20} animated={true} />

        <div style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          {/* Header Section Kurasi */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }} data-aos="fade-up" data-aos-duration="600">
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 14px',
                borderRadius: '9999px',
                background: 'rgba(212, 175, 55, 0.10)',
                border: '1px solid rgba(212, 175, 55, 0.28)',
                color: '#8b5a1b',
                fontSize: '11px',
                fontWeight: '750',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '14px',
              }}
            >
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#8b5a1b' }} />
              <span>Panel Kurator & Dalang Master</span>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#8b5a1b' }} />
            </div>

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
              Khazanah Kurasi & <span style={{ color: '#d4af37' }}>Master Data</span>
            </h2>
            <p style={{ margin: '0 auto', fontSize: '15px', color: '#6e5e4d', maxWidth: '640px' }}>
              Kelola entitas wiracarita, spesifikasi watak wayang kulit, ragam nada gamelan, dan moderasi pentas publik.
            </p>
          </div>

          {/* Banner Notifikasi Halus */}
          {notice && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 20px',
                borderRadius: '12px',
                marginBottom: '26px',
                fontSize: '13.5px',
                fontWeight: '650',
                background: notice.isError ? 'rgba(239, 68, 68, 0.10)' : 'rgba(34, 197, 94, 0.10)',
                border: `1px solid ${notice.isError ? 'rgba(239, 68, 68, 0.35)' : 'rgba(34, 197, 94, 0.35)'}`,
                color: notice.isError ? '#b91c1c' : '#15803d',
                boxShadow: '0 4px 16px rgba(40, 28, 16, 0.05)',
              }}
            >
              {notice.isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
              <span>{notice.msg}</span>
            </div>
          )}

          {/* 1. Navigasi Tab Kategori Master Data (Clean Segmented Bar) */}
          <div className="admin-category-tabs-bar" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
            {[
              { id: 'karakter', label: 'Tokoh Wayang', count: characters.length, icon: Users },
              { id: 'cerita', label: 'Lakon Cerita', count: stories.length, icon: BookOpen },
              { id: 'audio', label: 'Tata Suara / SFX', count: audioAssets.length, icon: Music },
              { id: 'panggung', label: 'Kelir Panggung', count: stageBackgrounds.length, icon: Layers },
              { id: 'karya', label: 'Karya Pagelaran', count: performances.length, icon: Film },
              { id: 'users', label: 'Pengguna', count: usersList.length, icon: ShieldCheck },
              { id: 'footer', label: 'Pengaturan Footer & Tim', count: footerTeam.length, icon: Settings },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchQuery('');
                    setFilterCategory('all');
                    setFilterStatus('all');
                  }}
                  className={`admin-category-tab-btn ${isActive ? 'active' : ''}`}
                >
                  <TabIcon size={16} />
                  <span>{tab.label}</span>
                  <span className="admin-tab-count-badge">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 2. Unified Control Bar (Search, Sub-filters & Tombol Tambah Aligned 100% dengan Grid Tabel) */}
          <div className="admin-control-bar" data-aos="fade-up" data-aos-duration="600" data-aos-delay="150">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
              {/* Search Bar Input */}
              <div className="admin-control-search-wrap">
                <Search size={18} style={{ position: 'absolute', left: '14px', color: '#8a7d6e', pointerEvents: 'none' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeTab === 'karakter'
                      ? 'Cari nama tokoh, gelar, trah, pusaka...'
                      : activeTab === 'cerita'
                      ? 'Cari lakon wiracarita, tradisi, gending...'
                      : activeTab === 'audio'
                      ? 'Cari instrumen gamelan, nada, tempo...'
                      : activeTab === 'panggung'
                      ? 'Cari nama kelir, suasana, lakon, atau id panggung...'
                      : activeTab === 'karya'
                      ? 'Cari judul lakon atau dalang...'
                      : activeTab === 'footer'
                      ? 'Cari nama anggota, peran, badge, atau username IG...'
                      : 'Cari nama kurator atau surel...'
                  }
                  className="admin-control-search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      background: 'none',
                      border: 'none',
                      color: '#8a7d6e',
                      cursor: 'pointer',
                      padding: '2px',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title="Hapus pencarian"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filter Golongan Karakter */}
              {activeTab === 'karakter' && (
                <div className="admin-control-select-wrap">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="admin-control-select"
                  >
                    <option value="all">Semua Golongan</option>
                    <option value="ksatria">Ksatria</option>
                    <option value="punakawan">Punakawan</option>
                    <option value="dewa">Dewa</option>
                    <option value="raksasa">Raksasa</option>
                    <option value="wanita">Wanita</option>
                  </select>
                  <ChevronDown size={14} className="admin-control-select-chevron" />
                </div>
              )}

              {/* Filter Kategori Audio */}
              {activeTab === 'audio' && (
                <div className="admin-control-select-wrap">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="admin-control-select"
                  >
                    <option value="all">Semua Kategori Audio</option>
                    <option value="bgm">BGM Gamelan</option>
                    <option value="sfx">SFX Pedalangan</option>
                  </select>
                  <ChevronDown size={14} className="admin-control-select-chevron" />
                </div>
              )}

              {/* Filter Kategori Kelir Panggung */}
              {activeTab === 'panggung' && (
                <div className="admin-control-select-wrap">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="admin-control-select"
                  >
                    <option value="all">Semua Jenis Kelir</option>
                    <option value="image">Latar Bergambar HD</option>
                    <option value="gradient">Gradasi Soga Tradisional</option>
                    <option value="custom">Karya Kustom Dalang</option>
                  </select>
                  <ChevronDown size={14} className="admin-control-select-chevron" />
                </div>
              )}

              {/* Filter Status / Visibilitas */}
              {(activeTab === 'karakter' || activeTab === 'cerita' || activeTab === 'karya') && (
                <div className="admin-control-select-wrap">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="admin-control-select"
                  >
                    <option value="all">
                      {activeTab === 'karya' ? 'Semua Visibilitas' : 'Semua Status'}
                    </option>
                    {activeTab === 'karya' ? (
                      <>
                        <option value="public">Publik</option>
                        <option value="private">Privat</option>
                      </>
                    ) : (
                      <>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </>
                    )}
                  </select>
                  <ChevronDown size={14} className="admin-control-select-chevron" />
                </div>
              )}
            </div>

            {/* Tombol Tambah Data Master / Kontrol Cepat Footer (Prada Gold CTA Aligned) */}
            {activeTab === 'footer' ? (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleResetFooterTeam}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#ffffff',
                    color: '#6e5e4d',
                    border: '1px solid rgba(40, 28, 16, 0.2)',
                    padding: '8px 14px',
                    borderRadius: '9999px',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  title="Kembalikan ke profil bawaan awal"
                >
                  <RefreshCw size={13} />
                  <span>Reset Bawaan</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddFooterMember}
                  className="admin-control-add-btn"
                >
                  <Plus size={15} strokeWidth={2.5} />
                  <span>Tambah Anggota</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveFooterTeam}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#c27827',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    fontSize: '12.5px',
                    fontWeight: '750',
                    cursor: 'pointer',
                    boxShadow: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ad671d';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#c27827';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Save size={14} strokeWidth={2.5} style={{ color: '#ffffff' }} />
                  <span>Simpan Pengaturan</span>
                </button>
              </div>
            ) : (
              activeTab !== 'karya' && activeTab !== 'users' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'karakter') openModal('character');
                    else if (activeTab === 'cerita') openModal('story');
                    else if (activeTab === 'audio') openModal('audio');
                    else if (activeTab === 'panggung') openModal('stage');
                  }}
                  className="admin-control-add-btn"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span>
                    {activeTab === 'karakter'
                      ? 'Tambah Tokoh'
                      : activeTab === 'cerita'
                      ? 'Tambah Lakon'
                      : activeTab === 'audio'
                      ? 'Tambah Audio'
                      : 'Tambah Kelir'}
                  </span>
                </button>
              )
            )}
          </div>

          {/* Luxury Archive Table Chassis (Cardbox Bersih di Latar Ivory) */}
          <div className="admin-table-chassis" data-aos="fade-up" data-aos-duration="700" data-aos-delay="200">
            <div className="admin-table-scroll">
              {/* TAB 1: TOKOH WAYANG */}
              {activeTab === 'karakter' && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ minWidth: '240px' }}>Tokoh & Pratinjau Foto</th>
                      <th>Golongan / Trah</th>
                      <th>Senjata Pusaka</th>
                      <th style={{ width: '190px' }}>Tampil di Story Atlas</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCharacters.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '52px 24px', color: '#6e5e4d' }}>
                          <div style={{ fontSize: '15px', fontWeight: '800', color: '#1a140e', marginBottom: '6px' }}>
                            Tidak Ada Tokoh Wayang
                          </div>
                          <div style={{ fontSize: '13px' }}>
                            Tidak ditemukan tokoh yang cocok dengan filter pencarian "{searchQuery}".
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredCharacters.map((c) => {
                        const cImg = getCharacterImage(c);
                        return (
                          <tr key={c.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div
                                  className="admin-photo-thumb"
                                  title={cImg ? `Klik untuk perbesar foto ${c.name}` : `Foto ${c.name}`}
                                  onClick={() => {
                                    if (cImg) {
                                      setLightboxImage({
                                        src: cImg,
                                        title: c.name,
                                        subtitle: c.alias || c.typeName || 'Koleksi Kartu Wayang Purwa',
                                        type: 'Karakter Wayang',
                                      });
                                    }
                                  }}
                                >
                                  {cImg ? (
                                    <img
                                      src={cImg}
                                      alt={c.name}
                                      className="admin-photo-img"
                                    />
                                  ) : (
                                    <div className="admin-photo-placeholder">
                                      <span>{(c.name || 'W')[0]}</span>
                                    </div>
                                  )}
                                  {cImg && (
                                    <div className="admin-photo-overlay">
                                      <ZoomIn size={14} />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div style={{ fontWeight: '800', color: '#1a140e', fontSize: '14.5px', letterSpacing: '-0.01em' }}>
                                    {c.name}
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#786554', marginTop: '3px' }}>
                                    {c.alias || c.typeName || 'Tokoh Wayang Purwa'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={getGolonganClass(c.type)}>
                                {c.typeName || c.type}
                              </span>
                            </td>
                            <td>
                              <span style={{ color: '#423122', fontSize: '13px', fontWeight: '500' }}>
                                {c.weapons || '-'}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                onClick={() => handleToggleAtlasVisibility('character', c)}
                                className={`admin-toggle-atlas ${c.status === 'published' ? 'is-published' : 'is-draft'}`}
                                title={c.status === 'published' ? 'Klik untuk sembunyikan dari Story Atlas' : 'Klik untuk tampilkan di Story Atlas'}
                              >
                                <div className="admin-toggle-track">
                                  <div className="admin-toggle-thumb">
                                    {c.status === 'published' ? <Check size={10} strokeWidth={3} /> : <X size={10} strokeWidth={3} />}
                                  </div>
                                </div>
                                <span className="admin-toggle-label">
                                  {c.status === 'published' ? 'Tampil di Atlas' : 'Disembunyikan'}
                                </span>
                              </button>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '8px' }}>
                                <button
                                  onClick={() => openModal('character', c)}
                                  className="admin-btn-action-edit"
                                >
                                  <Pencil size={13} />
                                  <span>Ubah</span>
                                </button>
                                <button
                                  onClick={() => handleDelete('character', c.id, c.name)}
                                  className="admin-btn-action-del"
                                >
                                  <Trash2 size={13} />
                                  <span>Hapus</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}

              {/* TAB 2: LAKON WIRACARITA */}
              {activeTab === 'cerita' && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ minWidth: '260px' }}>Lakon & Sampul Cerita</th>
                      <th>Gaya Tradisi</th>
                      <th>Gending Iringan</th>
                      <th style={{ width: '190px' }}>Tampil di Story Atlas</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStories.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '52px 24px', color: '#6e5e4d' }}>
                          <div style={{ fontSize: '15px', fontWeight: '800', color: '#1a140e', marginBottom: '6px' }}>
                            Tidak Ada Lakon Wiracarita
                          </div>
                          <div style={{ fontSize: '13px' }}>
                            Tidak ditemukan lakon yang cocok dengan filter pencarian.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredStories.map((s) => {
                        const sImg = getStoryImage(s);
                        return (
                          <tr key={s.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div
                                  className="admin-photo-thumb story-cover"
                                  title={sImg ? `Klik untuk perbesar sampul ${s.title}` : `Sampul ${s.title}`}
                                  onClick={() => {
                                    if (sImg) {
                                      setLightboxImage({
                                        src: sImg,
                                        title: s.title,
                                        subtitle: s.tradition || s.versionLabel || 'Naskah Pakem Wiracarita',
                                        type: 'Sampul Lakon Cerita',
                                      });
                                    }
                                  }}
                                >
                                  {sImg ? (
                                    <img
                                      src={sImg}
                                      alt={s.title}
                                      className="admin-photo-img"
                                    />
                                  ) : (
                                    <div className="admin-photo-placeholder story-cover">
                                      <BookOpen size={16} />
                                    </div>
                                  )}
                                  {sImg && (
                                    <div className="admin-photo-overlay">
                                      <ZoomIn size={14} />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div style={{ fontWeight: '800', color: '#1a140e', fontSize: '14.5px', letterSpacing: '-0.01em' }}>
                                    {s.title}
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#786554', marginTop: '3px' }}>
                                    {s.versionLabel || s.version_label || 'Pakem Purwa Klasik'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span style={{ color: '#8b4513', fontSize: '13px', fontWeight: '650' }}>
                                {s.tradition || 'Gaya Surakarta & Yogyakarta'}
                              </span>
                            </td>
                            <td>
                              <span style={{ color: '#423122', fontSize: '13px', fontWeight: '500' }}>
                                {s.themeSong || s.theme_song || 'Gamelan Srepeg Mataram'}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                onClick={() => handleToggleAtlasVisibility('story', s)}
                                className={`admin-toggle-atlas ${s.status === 'published' ? 'is-published' : 'is-draft'}`}
                                title={s.status === 'published' ? 'Klik untuk sembunyikan dari Story Atlas' : 'Klik untuk tampilkan di Story Atlas'}
                              >
                                <div className="admin-toggle-track">
                                  <div className="admin-toggle-thumb">
                                    {s.status === 'published' ? <Check size={10} strokeWidth={3} /> : <X size={10} strokeWidth={3} />}
                                  </div>
                                </div>
                                <span className="admin-toggle-label">
                                  {s.status === 'published' ? 'Tampil di Atlas' : 'Disembunyikan'}
                                </span>
                              </button>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '8px' }}>
                                <button
                                  onClick={() => openModal('story', s)}
                                  className="admin-btn-action-edit"
                                >
                                  <Pencil size={13} />
                                  <span>Ubah</span>
                                </button>
                                <button
                                  onClick={() => handleDelete('story', s.id, s.title)}
                                  className="admin-btn-action-del"
                                >
                                  <Trash2 size={13} />
                                  <span>Hapus</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}

              {/* TAB 3: TATA SUARA & SFX */}
              {activeTab === 'audio' && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Instrumen & Judul</th>
                      <th>Kategori</th>
                      <th>Instrumen Gamelan</th>
                      <th>Tempo</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAudio.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '52px 24px', color: '#6e5e4d' }}>
                          <div style={{ fontSize: '15px', fontWeight: '800', color: '#1a140e', marginBottom: '6px' }}>
                            Tidak Ada Aset Tata Suara
                          </div>
                          <div style={{ fontSize: '13px' }}>
                            Tidak ditemukan audio yang cocok dengan filter pencarian.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredAudio.map((a) => (
                        <tr key={a.id}>
                          <td>
                            <div>
                              <div style={{ fontWeight: '800', color: '#1a140e', fontSize: '14.5px', letterSpacing: '-0.01em' }}>
                                {a.title}
                              </div>
                              <div style={{ fontSize: '12px', color: '#786554', marginTop: '3px' }}>
                                Sintesis Web Audio: {a.synth_type || a.synthType || 'Gamelan'}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="admin-badge-golongan-generic">
                              {(a.category || 'BGM').toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <span style={{ color: '#423122', fontSize: '13px', fontWeight: '500' }}>
                              {a.instrument || '-'}
                            </span>
                          </td>
                          <td>
                            <span style={{ color: '#6e5e4d', fontSize: '13px' }}>
                              {a.tempo || 'Sedang'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              <button
                                onClick={() => handleToggleAudioPlay(a)}
                                className="admin-btn-action-audio"
                                title="Tes Bunyi Tata Suara"
                              >
                                {playingAudioId === a.id ? <Square size={13} /> : <Play size={13} />}
                                <span>{playingAudioId === a.id ? 'Berhenti' : 'Tes Suara'}</span>
                              </button>
                              <button
                                onClick={() => openModal('audio', a)}
                                className="admin-btn-action-edit"
                              >
                                <Pencil size={13} />
                                <span>Ubah</span>
                              </button>
                              <button
                                onClick={() => handleDelete('audio', a.id, a.title)}
                                className="admin-btn-action-del"
                              >
                                <Trash2 size={13} />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {/* TAB: KELIR PANGGUNG (MASTER DATA & KARYA KUSTOM) */}
              {activeTab === 'panggung' && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '130px' }}>Pratinjau Kelir</th>
                      <th>Nama & Suasana Latar</th>
                      <th>Tipe Kelir</th>
                      <th>Cahaya Blencong</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStages.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '52px 24px', color: '#6e5e4d' }}>
                          <div style={{ fontSize: '15px', fontWeight: '800', color: '#1a140e', marginBottom: '6px' }}>
                            Tidak Ada Kelir Panggung
                          </div>
                          <div style={{ fontSize: '13px' }}>
                            Tidak ditemukan kelir panggung yang cocok dengan filter pencarian "{searchQuery}".
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredStages.map((stage) => {
                        const isImage = stage.category === 'image' && Boolean(stage.bgImage);
                        return (
                          <tr key={stage.id}>
                            <td>
                              <div
                                className="admin-photo-thumb stage-kelir"
                                onClick={() => {
                                  if (stage.bgImage) {
                                    setLightboxImage({
                                      src: stage.bgImage,
                                      title: stage.name,
                                      subtitle: stage.atmosphere || stage.description || 'Kelir Panggung Virtual HD',
                                      type: 'Kelir Panggung Virtual',
                                    });
                                  }
                                }}
                                title={stage.bgImage ? `Klik untuk perbesar kelir ${stage.name}` : stage.name}
                                style={{
                                  background: stage.gradient || '#17110c',
                                  cursor: stage.bgImage ? 'pointer' : 'default',
                                }}
                              >
                                {isImage && (
                                  <img
                                    src={stage.bgImage}
                                    alt={stage.name}
                                    className="admin-photo-img"
                                  />
                                )}
                                {isImage && (
                                  <div className="admin-photo-overlay">
                                    <ZoomIn size={14} />
                                  </div>
                                )}
                                {/* Mini Blencong Glow Accent */}
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '4px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    background: stage.blencongColor || 'rgba(255, 200, 100, 0.65)',
                                    filter: 'blur(4px)',
                                    pointerEvents: 'none',
                                    zIndex: 3,
                                  }}
                                />
                              </div>
                            </td>
                            <td>
                              <div>
                                <div style={{ fontWeight: '800', color: '#1a140e', fontSize: '14.5px', letterSpacing: '-0.01em' }}>
                                  {stage.name}
                                </div>
                                <div style={{ fontSize: '12px', color: '#786554', marginTop: '3px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                  <span>ID: <code style={{ color: '#8b4513', fontSize: '11.5px', fontWeight: '600' }}>{stage.id}</code></span>
                                  <span>•</span>
                                  <span>{stage.atmosphere || 'Suasana Umum'}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                                <span className={stage.category === 'image' ? 'admin-badge-golongan-ksatria' : 'admin-badge-golongan-punakawan'}>
                                  {stage.category === 'image' ? 'Bergambar HD' : 'Gradasi Soga'}
                                </span>
                                {stage.isCustom ? (
                                  <span style={{ fontSize: '10.5px', color: '#d97706', fontWeight: '700', padding: '1px 6px', background: 'rgba(245, 158, 11, 0.12)', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                                    Karya Kustom
                                  </span>
                                ) : (
                                  <span style={{ fontSize: '10.5px', color: '#059669', fontWeight: '700', padding: '1px 6px', background: 'rgba(16, 185, 129, 0.10)', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                                    Preset Pakem
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '50%',
                                    background: stage.blencongColor || 'rgba(255, 200, 100, 0.55)',
                                    border: '1px solid rgba(0, 0, 0, 0.2)',
                                    boxShadow: '0 0 6px rgba(212, 175, 55, 0.4)',
                                  }}
                                />
                                <span style={{ fontSize: '12px', color: '#423122', fontFamily: 'monospace' }}>
                                  {stage.blencongColor ? stage.blencongColor.substring(0, 22) : 'rgba(255, 200, 100)'}
                                </span>
                              </div>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '8px' }}>
                                <button
                                  onClick={() => openModal('stage', stage)}
                                  className="admin-btn-action-edit"
                                >
                                  <Pencil size={13} />
                                  <span>Ubah</span>
                                </button>
                                {stage.isCustom ? (
                                  <button
                                    onClick={() => handleDelete('stage', stage.id, stage.name)}
                                    className="admin-btn-action-del"
                                  >
                                    <Trash2 size={13} />
                                    <span>Hapus</span>
                                  </button>
                                ) : (
                                  <span
                                    title="Preset pakem dilindungi sistem"
                                    style={{
                                      fontSize: '11px',
                                      color: '#9ca3af',
                                      padding: '5px 8px',
                                      borderRadius: '6px',
                                      border: '1px dashed #d1d5db',
                                    }}
                                  >
                                    Terkunci
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}

              {/* TAB 4: MODERASI KARYA PAGELARAN DALANG */}
              {activeTab === 'karya' && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ minWidth: '240px' }}>Judul Pagelaran</th>
                      <th>Dalang / Pengkarya</th>
                      <th>Visibilitas</th>
                      <th>Tanggal Kreasi</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPerformances.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '52px 24px', color: '#6e5e4d' }}>
                          <div style={{ fontSize: '15px', fontWeight: '800', color: '#1a140e', marginBottom: '6px' }}>
                            Belum Ada Karya Pagelaran
                          </div>
                          <div style={{ fontSize: '13px' }}>
                            Belum ada pagelaran dalang yang tersimpan atau cocok dengan filter.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredPerformances.map((p) => {
                        const perfCover = p.story?.cover_image || galleryCoverGatotkaca;
                        return (
                          <tr key={p.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div
                                  className="admin-photo-thumb story-cover"
                                  style={{ width: '56px', height: '38px', flexShrink: 0 }}
                                  title="Klik untuk perbesar sampul pagelaran"
                                  onClick={() => {
                                    setLightboxImage({
                                      src: perfCover,
                                      title: p.title,
                                      subtitle: `Dalang: ${p.user?.name || p.author || 'Dalang Muda'} • ${p.story?.title || 'Lakon Mandiri'}`,
                                      type: 'Pagelaran Komunitas',
                                    });
                                  }}
                                >
                                  <img
                                    src={perfCover}
                                    alt={p.title}
                                    className="admin-photo-img"
                                  />
                                  <div className="admin-photo-overlay">
                                    <ZoomIn size={12} />
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontWeight: '800', color: '#1a140e', fontSize: '14.5px', letterSpacing: '-0.01em' }}>
                                    {p.title}
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#786554', marginTop: '3px' }}>
                                    {p.story?.title || 'Lakon Mandiri Sanggar'}
                                  </div>
                                </div>
                              </div>
                            </td>
                          <td>
                            <div style={{ color: '#1a140e', fontWeight: '750', fontSize: '13.5px' }}>
                              {p.user?.name || p.author || 'Dalang Muda'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#786554' }}>
                              {p.user?.email || 'dalang@wayangverse.id'}
                            </div>
                          </td>
                          <td>
                            <button
                              onClick={() => handleToggleVis(p)}
                              className={`admin-badge-visibility ${p.visibility === 'public' ? 'public' : 'private'}`}
                              title="Klik untuk mengubah visibilitas"
                            >
                              {p.visibility === 'public' ? <Eye size={12} /> : <EyeOff size={12} />}
                              <span>{p.visibility === 'public' ? 'Publik' : 'Privat'}</span>
                            </button>
                          </td>
                          <td>
                            <span style={{ fontSize: '12.5px', color: '#6e5e4d' }}>
                              {p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              {onPlayPerformance && (
                                <button
                                  onClick={() => onPlayPerformance(p)}
                                  className="admin-btn-action-play"
                                >
                                  <Play size={13} />
                                  <span>Putar Panggung</span>
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete('performance', p.id, p.title)}
                                className="admin-btn-action-del"
                              >
                                <Trash2 size={13} />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                  </tbody>
                </table>
              )}

              {/* TAB 5: DAFTAR PENGGUNA TERDAFTAR */}
              {activeTab === 'users' && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nama Pengguna</th>
                      <th>Surel (Email)</th>
                      <th>Peran Akun</th>
                      <th>Total Pagelaran</th>
                      <th style={{ textAlign: 'right' }}>Terdaftar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '52px 24px', color: '#6e5e4d' }}>
                          <div style={{ fontSize: '15px', fontWeight: '800', color: '#1a140e', marginBottom: '6px' }}>
                            Pengguna Tidak Ditemukan
                          </div>
                          <div style={{ fontSize: '13px' }}>
                            Tidak ditemukan pengguna yang cocok dengan kata kunci "{searchQuery}".
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <div>
                              <div style={{ fontWeight: '800', color: '#1a140e', fontSize: '14.5px', letterSpacing: '-0.01em' }}>
                                {u.name}
                              </div>
                              <div style={{ fontSize: '11.5px', color: '#8a7d6e', marginTop: '2px' }}>
                                Kurator Sistem Wayangverse
                              </div>
                            </div>
                          </td>
                          <td>
                            <span style={{ color: '#423122', fontSize: '13px' }}>{u.email}</span>
                          </td>
                          <td>
                            <span className="admin-badge-golongan-generic">
                              {(u.role || 'DALANG').toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <span style={{ color: '#8b4513', fontWeight: '800', fontSize: '13px' }}>
                              {u.performances_count ?? 0} lakon
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', fontSize: '12.5px', color: '#6e5e4d' }}>
                            {u.created_at ? new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {/* TAB 7: PENGATURAN FOOTER & TIM PENGEMBANG */}
              {activeTab === 'footer' && (
                <div style={{ padding: '24px', boxSizing: 'border-box' }}>
                  {/* Banner Header Modul Footer */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(40, 28, 16, 0.04) 100%)',
                      border: '1px solid rgba(212, 175, 55, 0.28)',
                      borderRadius: '16px',
                      padding: '20px 24px',
                      marginBottom: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span
                          style={{
                            background: '#1c140d',
                            color: '#e8bb5c',
                            border: '1px solid rgba(212, 175, 55, 0.35)',
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            fontSize: '10px',
                            fontWeight: '850',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                          }}
                        >
                          MASTER FOOTER CMS
                        </span>
                        <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '850', color: '#1a140e' }}>
                          Kelola Profil Tim Pengembang & Kreator
                        </h3>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#6e5e4d', lineHeight: '1.5', maxWidth: '680px' }}>
                        Atur nama, master foto profil, peran arsitektur, badge status, tautan Instagram, dan deskripsi kontribusi untuk setiap anggota tim. Perubahan langsung disinkronkan secara real-time ke kartu modal footer Wayangverse.
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={handleResetFooterTeam}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#ffffff',
                          color: '#6e5e4d',
                          border: '1px solid rgba(40, 28, 16, 0.18)',
                          padding: '9px 16px',
                          borderRadius: '9999px',
                          fontSize: '12.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        title="Kembalikan ke profil bawaan awal"
                      >
                        <RefreshCw size={14} />
                        <span>Reset ke Bawaan</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleAddFooterMember}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#ffffff',
                          color: '#8b4513',
                          border: '1.5px solid rgba(139, 69, 19, 0.4)',
                          padding: '9px 16px',
                          borderRadius: '9999px',
                          fontSize: '12.5px',
                          fontWeight: '750',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Plus size={15} strokeWidth={2.5} />
                        <span>Tambah Anggota</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveFooterTeam}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#c27827',
                          color: '#ffffff',
                          border: 'none',
                          padding: '9px 20px',
                          borderRadius: '9999px',
                          fontSize: '12.5px',
                          fontWeight: '750',
                          cursor: 'pointer',
                          boxShadow: 'none',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#ad671d';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#c27827';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <Save size={14} strokeWidth={2.5} style={{ color: '#ffffff' }} />
                        <span>Simpan Pengaturan Footer</span>
                      </button>
                    </div>
                  </div>

                  {/* Daftar Anggota Tim - Grid Editor dengan Live Interactive Preview */}
                  {filteredFooterTeam.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6e5e4d' }}>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#1a140e', marginBottom: '8px' }}>
                        Tidak Ada Anggota Tim
                      </div>
                      <div style={{ fontSize: '13px', marginBottom: '16px' }}>
                        Tidak ditemukan profil anggota tim yang sesuai dengan kata kunci "{searchQuery}".
                      </div>
                      <button
                        type="button"
                        onClick={handleAddFooterMember}
                        className="admin-control-add-btn"
                        style={{ margin: '0 auto' }}
                      >
                        <Plus size={15} />
                        <span>Tambah Anggota Baru</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                      {filteredFooterTeam.map((member, index) => (
                        <div
                          key={member.id || index}
                          style={{
                            background: '#ffffff',
                            border: '1.5px solid rgba(212, 175, 55, 0.35)',
                            borderRadius: '20px',
                            padding: 'clamp(14px, 3.5vw, 24px)',
                            boxShadow: '0 4px 20px rgba(40, 28, 16, 0.05)',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                            gap: 'clamp(20px, 3.5vw, 28px)',
                            alignItems: 'start',
                            position: 'relative',
                            boxSizing: 'border-box',
                            scrollMarginTop: '100px',
                          }}
                        >
                          {/* SISI KIRI: PRATINJAU KARTU MINI DALAM PANGGUNG BERSIH & TIDAK KEMEPETAN */}
                          <div
                            style={{
                              maxWidth: '340px',
                              width: '100%',
                              margin: '0 auto',
                              background: '#fbf9f4',
                              border: '1px solid rgba(212, 175, 55, 0.22)',
                              borderRadius: '20px',
                              padding: 'clamp(12px, 3vw, 16px)',
                              boxSizing: 'border-box',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                              <span style={{ fontSize: '11px', fontWeight: '800', color: '#8b4513', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                Pratinjau Tampilan #{index + 1}
                              </span>
                              <span style={{ fontSize: '10.5px', color: '#8a7d6e', background: 'rgba(40, 28, 16, 0.06)', padding: '2px 8px', borderRadius: '6px', fontWeight: '650' }}>
                                Live Preview
                              </span>
                            </div>

                            {/* Wayang Showcase Card Miniatur (Persis Desain Tokoh & Karakter Wayang) */}
                            <div
                              style={{
                                background: '#ffffff',
                                borderRadius: '20px',
                                border: '1px solid rgba(0, 0, 0, 0.08)',
                                boxShadow: '0 4px 18px rgba(40, 28, 16, 0.06)',
                                padding: 'clamp(14px, 3.5vw, 18px)',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                overflow: 'hidden',
                                boxSizing: 'border-box',
                              }}
                            >
                              {/* Wadah Foto / Avatar & Badge Melayang */}
                              <div
                                style={{
                                  position: 'relative',
                                  width: '100%',
                                  height: '180px',
                                  borderRadius: '16px',
                                  overflow: 'hidden',
                                  background: '#140e09',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginBottom: '14px',
                                  flexShrink: 0,
                                }}
                              >
                                {member.avatar ? (
                                  <img
                                    src={member.avatar}
                                    alt={member.name}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      objectPosition: 'center 20%',
                                    }}
                                  />
                                ) : (
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: '#e8bb5c',
                                      gap: '8px',
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: '52px',
                                        height: '52px',
                                        borderRadius: '50%',
                                        background: 'rgba(212, 175, 55, 0.15)',
                                        border: '1.5px solid rgba(212, 175, 55, 0.45)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '18px',
                                        fontWeight: '800',
                                        color: '#fcfaf2',
                                      }}
                                    >
                                      {(member.name || 'W').split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                    </div>
                                    <span style={{ fontSize: '10px', color: '#bfae9c', letterSpacing: '0.08em', fontWeight: '800' }}>
                                      KREATOR WAYANG
                                    </span>
                                  </div>
                                )}

                                {/* Badge Kategori Melayang Persis di Pojok Kiri Atas Foto */}
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '10px',
                                    left: '10px',
                                    zIndex: 5,
                                    background: 'rgba(255, 255, 255, 0.94)',
                                    backdropFilter: 'blur(8px)',
                                    WebkitBackdropFilter: 'blur(8px)',
                                    borderRadius: '9999px',
                                    padding: '4px 12px',
                                    fontSize: '9.5px',
                                    fontWeight: '800',
                                    color: '#1a140e',
                                    letterSpacing: '0.04em',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                                    pointerEvents: 'none',
                                  }}
                                >
                                  <span>{member.badge || 'TIM PENGEMBANG'}</span>
                                </div>

                                {/* Gradient Penyeimbang Visual */}
                                <div
                                  style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 65%, rgba(20, 14, 9, 0.35) 100%)',
                                    pointerEvents: 'none',
                                  }}
                                />
                              </div>

                              {/* Konten / Keterangan Tokoh & Meta */}
                              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                                {/* Gelar & Pusaka Luhur */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '8px', fontSize: '12px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ color: '#8b5a1b', fontWeight: '750', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.03em', flexShrink: 0 }}>
                                      Gelar:
                                    </span>
                                    <span style={{ color: '#2b2118', fontWeight: '600', fontSize: '11.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {member.role || 'Peran Pengembang'}
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ color: '#8b5a1b', fontWeight: '750', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.03em', flexShrink: 0 }}>
                                      Pusaka:
                                    </span>
                                    <span style={{ color: '#2b2118', fontWeight: '600', fontSize: '11.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      @{member.username || 'username'}
                                    </span>
                                  </div>
                                </div>

                                {/* Nama Tokoh */}
                                <h3
                                  style={{
                                    margin: '0 0 6px 0',
                                    fontSize: '17.5px',
                                    fontWeight: '800',
                                    color: '#1a140e',
                                    letterSpacing: '-0.3px',
                                    lineHeight: '1.25',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  {member.name || 'Nama Anggota'}
                                </h3>

                                {/* Deskripsi Singkat */}
                                <p
                                  style={{
                                    margin: '0 0 14px 0',
                                    fontSize: '12px',
                                    color: '#6b7280',
                                    lineHeight: '1.55',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    height: '38px',
                                  }}
                                >
                                  {member.bio || 'Tokoh kreator dan pengembang platform pelestarian wayang kulit digital Nusantara.'}
                                </p>

                                {/* Dua Tombol Aksi Kapsul Persis Seperti Card Tokoh Wayang (Profil & Pose + Mainkan) */}
                                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                  <div
                                    style={{
                                      flex: 1,
                                      background: '#f7f4eb',
                                      border: '1px solid rgba(212, 175, 55, 0.45)',
                                      color: '#1a140e',
                                      padding: '9px 10px',
                                      borderRadius: '9999px',
                                      fontSize: '11.5px',
                                      fontWeight: '750',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      minHeight: '38px',
                                      boxSizing: 'border-box',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    <Eye size={14} style={{ marginRight: '5px' }} />
                                    <span>Profil & Pose</span>
                                  </div>

                                  <div
                                    style={{
                                      flex: 1,
                                      background: '#e8bb5c',
                                      border: 'none',
                                      color: '#0d0a07',
                                      padding: '9px 10px',
                                      borderRadius: '9999px',
                                      fontSize: '11.5px',
                                      fontWeight: '750',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      minHeight: '38px',
                                      boxSizing: 'border-box',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    <Play size={13} fill="#0d0a07" style={{ marginRight: '5px' }} />
                                    <span>Mainkan</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* SISI KANAN: FORM EDITOR LENGKAP & MASTER UPLOAD FOTO */}
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid rgba(212, 175, 55, 0.18)', paddingBottom: '12px' }}>
                              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '850', color: '#1a140e' }}>
                                Form Konfigurasi: {member.name || `Anggota #${index + 1}`}
                              </h4>

                              <button
                                type="button"
                                onClick={() => handleDeleteFooterMember(member.id)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  background: 'rgba(239, 68, 68, 0.08)',
                                  color: '#dc2626',
                                  border: '1px solid rgba(239, 68, 68, 0.25)',
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                }}
                                title="Hapus profil anggota tim ini"
                              >
                                <Trash2 size={13} />
                                <span>Hapus Profil</span>
                              </button>
                            </div>

                            {/* Master Upload Foto Box */}
                            <div
                              style={{
                                background: '#fdfbf7',
                                border: '1px dashed rgba(212, 175, 55, 0.45)',
                                borderRadius: '12px',
                                padding: '14px 16px',
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                flexWrap: 'wrap',
                              }}
                            >
                              <div
                                style={{
                                  width: '52px',
                                  height: '52px',
                                  borderRadius: '10px',
                                  overflow: 'hidden',
                                  background: '#1a140e',
                                  border: '1px solid rgba(212, 175, 55, 0.35)',
                                  flexShrink: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {member.avatar ? (
                                  <img
                                    src={member.avatar}
                                    alt="Foto"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <span style={{ fontSize: '11px', color: '#e8bb5c', fontWeight: '800' }}>FOTO</span>
                                )}
                              </div>

                              <div style={{ flex: 1, minWidth: '180px' }}>
                                <div style={{ fontSize: '13px', fontWeight: '750', color: '#1a140e', marginBottom: '3px' }}>
                                  Master Foto Profil / Avatar
                                </div>
                                <div style={{ fontSize: '11.5px', color: '#786554' }}>
                                  Unggah berkas foto (JPG/PNG/WebP maks 2.5MB) atau tempel URL gambar.
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <label
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: '#1a140e',
                                    color: '#fdfbf7',
                                    padding: '7px 14px',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                  }}
                                >
                                  <Upload size={13} color="#e8bb5c" />
                                  <span>Unggah Foto</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handlePhotoUpload(member.id, file);
                                    }}
                                  />
                                </label>

                                {member.avatar && (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateFooterMember(member.id, 'avatar', '')}
                                    style={{
                                      background: 'none',
                                      border: '1px solid rgba(40, 28, 16, 0.2)',
                                      color: '#786554',
                                      padding: '7px 12px',
                                      borderRadius: '8px',
                                      fontSize: '12px',
                                      fontWeight: '650',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    Hapus Foto
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Grid Input Form */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                              {/* Nama Lengkap */}
                              <div>
                                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '800', color: '#1a140e', marginBottom: '5px' }}>
                                  Nama Lengkap:
                                </label>
                                <input
                                  type="text"
                                  value={member.name}
                                  onChange={(e) => handleUpdateFooterMember(member.id, 'name', e.target.value)}
                                  placeholder="Contoh: Ahmad Fayyadh Fadhil"
                                  style={{
                                    width: '100%',
                                    padding: '9px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(40, 28, 16, 0.2)',
                                    fontSize: '13px',
                                    boxSizing: 'border-box',
                                    color: '#1a140e',
                                    outline: 'none',
                                  }}
                                />
                              </div>

                              {/* Peran / Gelar */}
                              <div>
                                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '800', color: '#1a140e', marginBottom: '5px' }}>
                                  Peran & Jabatan (Role):
                                </label>
                                <input
                                  type="text"
                                  value={member.role}
                                  onChange={(e) => handleUpdateFooterMember(member.id, 'role', e.target.value)}
                                  placeholder="Contoh: Lead Developer & Software Architect"
                                  style={{
                                    width: '100%',
                                    padding: '9px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(40, 28, 16, 0.2)',
                                    fontSize: '13px',
                                    boxSizing: 'border-box',
                                    color: '#1a140e',
                                    outline: 'none',
                                  }}
                                />
                              </div>

                              {/* Badge Kategori */}
                              <div>
                                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '800', color: '#1a140e', marginBottom: '5px' }}>
                                  Label Badge (Huruf Kapital):
                                </label>
                                <input
                                  type="text"
                                  value={member.badge}
                                  onChange={(e) => handleUpdateFooterMember(member.id, 'badge', e.target.value.toUpperCase())}
                                  placeholder="Contoh: LEAD ARCHITECT"
                                  style={{
                                    width: '100%',
                                    padding: '9px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(40, 28, 16, 0.2)',
                                    fontSize: '13px',
                                    boxSizing: 'border-box',
                                    color: '#1a140e',
                                    outline: 'none',
                                  }}
                                />
                              </div>

                              {/* Username Instagram */}
                              <div>
                                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '800', color: '#1a140e', marginBottom: '5px' }}>
                                  Username Instagram (tanpa @):
                                </label>
                                <input
                                  type="text"
                                  value={member.username}
                                  onChange={(e) => handleUpdateFooterMember(member.id, 'username', e.target.value.replace('@', ''))}
                                  placeholder="Contoh: fadhillllll15"
                                  style={{
                                    width: '100%',
                                    padding: '9px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(40, 28, 16, 0.2)',
                                    fontSize: '13px',
                                    boxSizing: 'border-box',
                                    color: '#1a140e',
                                    outline: 'none',
                                  }}
                                />
                              </div>
                            </div>

                            {/* URL Instagram Link */}
                            <div style={{ marginBottom: '14px' }}>
                              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '800', color: '#1a140e', marginBottom: '5px' }}>
                                Tautan URL Profil Instagram:
                              </label>
                              <input
                                type="url"
                                value={member.url}
                                onChange={(e) => handleUpdateFooterMember(member.id, 'url', e.target.value)}
                                placeholder="Contoh: https://www.instagram.com/fadhillllll15"
                                style={{
                                  width: '100%',
                                  padding: '9px 12px',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(40, 28, 16, 0.2)',
                                  fontSize: '13px',
                                  boxSizing: 'border-box',
                                  color: '#1a140e',
                                  outline: 'none',
                                }}
                              />
                            </div>

                            {/* Bio / Ringkasan Kontribusi */}
                            <div>
                              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '800', color: '#1a140e', marginBottom: '5px' }}>
                                Deskripsi Dedikasi & Kontribusi (Bio):
                              </label>
                              <textarea
                                rows={2}
                                value={member.bio}
                                onChange={(e) => handleUpdateFooterMember(member.id, 'bio', e.target.value)}
                                placeholder="Tuliskan dedikasi atau kontribusi anggota dalam pengembangan Wayangverse..."
                                style={{
                                  width: '100%',
                                  padding: '9px 12px',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(40, 28, 16, 0.2)',
                                  fontSize: '13px',
                                  boxSizing: 'border-box',
                                  color: '#1a140e',
                                  outline: 'none',
                                  resize: 'vertical',
                                  fontFamily: 'inherit',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Footer Ringkasan Metadata Tabel */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 20px',
                background: '#f8f4ec',
                borderTop: '1px solid rgba(212, 175, 55, 0.22)',
                fontSize: '12.5px',
                color: '#6e5e4d',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div>
                Menampilkan{' '}
                <strong style={{ color: '#8b4513' }}>
                  {activeTab === 'karakter'
                    ? filteredCharacters.length
                    : activeTab === 'cerita'
                    ? filteredStories.length
                    : activeTab === 'audio'
                    ? filteredAudio.length
                    : activeTab === 'panggung'
                    ? filteredStages.length
                    : activeTab === 'karya'
                    ? filteredPerformances.length
                    : activeTab === 'users'
                    ? filteredUsers.length
                    : filteredFooterTeam.length}
                </strong>{' '}
                data terkurasi
              </div>
              <div>Pakem Pedalangan Surakarta & Yogyakarta • Standar Digital Wayangverse</div>
            </div>
          </div>
        </div>
      </section>

      {/* Frosted Heritage Glass Ribbon & Kinetic Nusantara Marquee Ticker (Menuju Footer) */}
      <HeritageBatikRibbon style={{ zIndex: 10, position: 'relative' }} />

      {/* ============================================================
          3. MODAL FORM DIALOG (TAMBAH / UBAH DATA MASTER)
          ============================================================ */}
      {modalType && (
        <div
          className="wayang-modal-backdrop"
          style={{ zIndex: 2000 }}
          onClick={() => setModalType(null)}
        >
          <div
            className="wayang-modal-chassis"
            style={{ maxWidth: '640px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="wayang-modal-inner modal-custom-scroll" style={{ padding: '32px 30px' }}>
              <div className="wayang-modal-hairline" />

              {/* Header Dialog */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '16px',
                  marginBottom: '24px',
                  borderBottom: '1px solid rgba(212, 175, 55, 0.18)',
                  paddingBottom: '16px',
                }}
              >
                <div>
                  <div className="wayang-modal-eyebrow" style={{ marginBottom: '8px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#d4af37',
                      }}
                    />
                    <span>KURASI MASTER DATA</span>
                    <span style={{ opacity: 0.5 }}>•</span>
                    <span>
                      {modalType === 'character'
                        ? 'TOKOH WAYANG'
                        : modalType === 'story'
                        ? 'LAKON CERITA'
                        : modalType === 'audio'
                        ? 'TATA SUARA'
                        : 'KELIR PANGGUNG'}
                    </span>
                  </div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '22px',
                      color: '#1a140e',
                      fontWeight: '800',
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {editingItem ? 'Perbarui Data Master' : 'Tambah Data Master Baru'}
                  </h3>
                </div>
                <button
                  type="button"
                  aria-label="Tutup Dialog Admin"
                  onClick={() => setModalType(null)}
                  className="wayang-modal-close-btn"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Input Sesuai Kategori */}
              <form onSubmit={handleSave}>
                {/* 1. Form Tokoh Wayang */}
                {modalType === 'character' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={modalLabelStyle}>Nama Tokoh Wayang</label>
                      <input
                        type="text"
                        value={form.name || ''}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        placeholder="Contoh: Raden Gatotkaca"
                        style={modalInputStyle}
                      />
                    </div>

                    <div>
                      <label style={modalLabelStyle}>Gelar / Julukan Luhur</label>
                      <input
                        type="text"
                        value={form.alias || ''}
                        onChange={(e) => setForm({ ...form, alias: e.target.value })}
                        placeholder="Contoh: Satria Pringgandani, Senopati Udara"
                        style={modalInputStyle}
                      />
                    </div>

                    <div>
                      <label style={modalLabelStyle}>URL Foto / Gambar Tokoh (Opsional)</label>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={form.image_url || form.image_path || ''}
                          onChange={(e) => setForm({ ...form, image_url: e.target.value, image_path: e.target.value })}
                          placeholder="https://... atau biarkan kosong untuk kartu pakem"
                          style={{ ...modalInputStyle, flex: 1 }}
                        />
                        {(form.image_url || form.image_path || getCharacterImage(form)) && (
                          <div
                            className="admin-photo-thumb"
                            style={{ width: '40px', height: '40px', flexShrink: 0 }}
                            onClick={() => {
                              const p = form.image_url || form.image_path || getCharacterImage(form);
                              if (p) {
                                setLightboxImage({
                                  src: p,
                                  title: form.name || 'Pratinjau Foto Tokoh',
                                  subtitle: 'Pratinjau foto kartu tokoh wayang',
                                  type: 'Form Pratinjau',
                                });
                              }
                            }}
                            title="Klik untuk perbesar pratinjau foto"
                          >
                            <img
                              src={form.image_url || form.image_path || getCharacterImage(form)}
                              alt="Preview"
                              className="admin-photo-img"
                            />
                            <div className="admin-photo-overlay">
                              <ZoomIn size={12} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={modalLabelStyle}>Golongan / Trah</label>
                        <select
                          value={form.type || 'ksatria'}
                          onChange={(e) => setForm({ ...form, type: e.target.value })}
                          style={modalInputStyle}
                        >
                          <option value="ksatria">Ksatria</option>
                          <option value="punakawan">Punakawan</option>
                          <option value="raksasa">Raksasa</option>
                          <option value="dewa">Dewa</option>
                          <option value="wanita">Wanita</option>
                          <option value="lainnya">Lainnya</option>
                        </select>
                      </div>

                      <div>
                        <label style={modalLabelStyle}>Status Publikasi</label>
                        <select
                          value={form.status || 'published'}
                          onChange={(e) => setForm({ ...form, status: e.target.value })}
                          style={modalInputStyle}
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={modalLabelStyle}>Senjata Pusaka & Aji-Aji</label>
                      <input
                        type="text"
                        value={form.weapons || ''}
                        onChange={(e) => setForm({ ...form, weapons: e.target.value })}
                        placeholder="Contoh: Kotang Antakusuma, Aji Brajamusti"
                        style={modalInputStyle}
                      />
                    </div>

                    <div>
                      <label style={modalLabelStyle}>Deskripsi Karakter</label>
                      <textarea
                        rows={2}
                        value={form.description || ''}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        required
                        placeholder="Ringkasan riwayat dan watak tokoh..."
                        style={modalInputStyle}
                      />
                    </div>

                    <div>
                      <label style={modalLabelStyle}>Makna Filosofis</label>
                      <textarea
                        rows={2}
                        value={form.philosophy || ''}
                        onChange={(e) => setForm({ ...form, philosophy: e.target.value })}
                        required
                        placeholder="Nilai moral dan keteladanan yang diwariskan..."
                        style={modalInputStyle}
                      />
                    </div>
                  </div>
                )}

                {/* 2. Form Lakon Wiracarita */}
                {modalType === 'story' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={modalLabelStyle}>Judul Lakon Cerita</label>
                      <input
                        type="text"
                        value={form.title || ''}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        required
                        placeholder="Contoh: Bharatayuddha: Gugurnya Ghatotkaca"
                        style={modalInputStyle}
                      />
                    </div>

                    <div>
                      <label style={modalLabelStyle}>URL Sampul Lakon (Opsional)</label>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={form.cover_image || form.cover_url || ''}
                          onChange={(e) => setForm({ ...form, cover_image: e.target.value, cover_url: e.target.value })}
                          placeholder="https://... atau biarkan kosong untuk sampul pakem"
                          style={{ ...modalInputStyle, flex: 1 }}
                        />
                        {(form.cover_image || form.cover_url || getStoryImage(form)) && (
                          <div
                            className="admin-photo-thumb story-cover"
                            style={{ width: '56px', height: '38px', flexShrink: 0 }}
                            onClick={() => {
                              const p = form.cover_image || form.cover_url || getStoryImage(form);
                              if (p) {
                                setLightboxImage({
                                  src: p,
                                  title: form.title || 'Pratinjau Sampul Lakon',
                                  subtitle: 'Pratinjau sampul naskah lakon',
                                  type: 'Form Pratinjau',
                                });
                              }
                            }}
                            title="Klik untuk perbesar pratinjau sampul"
                          >
                            <img
                              src={form.cover_image || form.cover_url || getStoryImage(form)}
                              alt="Preview"
                              className="admin-photo-img"
                            />
                            <div className="admin-photo-overlay">
                              <ZoomIn size={12} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={modalLabelStyle}>Gaya Tradisi Pedalangan</label>
                        <input
                          type="text"
                          value={form.tradition || ''}
                          onChange={(e) => setForm({ ...form, tradition: e.target.value })}
                          placeholder="Contoh: Gaya Surakarta & Yogyakarta"
                          style={modalInputStyle}
                        />
                      </div>

                      <div>
                        <label style={modalLabelStyle}>Status Publikasi</label>
                        <select
                          value={form.status || 'published'}
                          onChange={(e) => setForm({ ...form, status: e.target.value })}
                          style={modalInputStyle}
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={modalLabelStyle}>Gending / Lagu Tema Iringan</label>
                      <input
                        type="text"
                        value={form.theme_song || form.themeSong || ''}
                        onChange={(e) => setForm({ ...form, theme_song: e.target.value })}
                        placeholder="Contoh: Gamelan Srepeg Mataram"
                        style={modalInputStyle}
                      />
                    </div>

                    <div>
                      <label style={modalLabelStyle}>Sinopsis Lakon</label>
                      <textarea
                        rows={3}
                        value={form.synopsis || ''}
                        onChange={(e) => setForm({ ...form, synopsis: e.target.value })}
                        required
                        placeholder="Jalan cerita pementasan babak adegan..."
                        style={modalInputStyle}
                      />
                    </div>

                    <div>
                      <label style={modalLabelStyle}>Nilai Filosofis Lakon</label>
                      <textarea
                        rows={2}
                        value={form.philosophy || ''}
                        onChange={(e) => setForm({ ...form, philosophy: e.target.value })}
                        required
                        placeholder="Pesan moral dan sanad kebijaksanaan luhur..."
                        style={modalInputStyle}
                      />
                    </div>
                  </div>
                )}

                {/* 3. Form Tata Suara / SFX */}
                {modalType === 'audio' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={modalLabelStyle}>Judul Aset Audio</label>
                      <input
                        type="text"
                        value={form.title || ''}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        required
                        placeholder="Contoh: Gamelan Srepeg Mataram"
                        style={modalInputStyle}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={modalLabelStyle}>Kategori</label>
                        <select
                          value={form.category || 'bgm'}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                          style={modalInputStyle}
                        >
                          <option value="bgm">BGM (Gamelan Melodi)</option>
                          <option value="sfx">SFX (Dodogan / Kepyak / Gong)</option>
                        </select>
                      </div>

                      <div>
                        <label style={modalLabelStyle}>Tempo Permainan</label>
                        <input
                          type="text"
                          value={form.tempo || ''}
                          onChange={(e) => setForm({ ...form, tempo: e.target.value })}
                          placeholder="Contoh: Cepat & Heroik / Lambat"
                          style={modalInputStyle}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={modalLabelStyle}>Instrumen Gamelan Terkait</label>
                      <input
                        type="text"
                        value={form.instrument || ''}
                        onChange={(e) => setForm({ ...form, instrument: e.target.value })}
                        required
                        placeholder="Contoh: Kendang Ciblon, Bonang, Gong"
                        style={modalInputStyle}
                      />
                    </div>

                    <div>
                      <label style={modalLabelStyle}>Suasana / Mood Adegan</label>
                      <input
                        type="text"
                        value={form.mood || ''}
                        onChange={(e) => setForm({ ...form, mood: e.target.value })}
                        placeholder="Contoh: Pertempuran / Dialog Syahdu / Jejer"
                        style={modalInputStyle}
                      />
                    </div>
                  </div>
                )}

                {/* 4. Form Kelir Panggung */}
                {modalType === 'stage' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Live 16:9 Thumbnail Preview */}
                    <div>
                      <label style={modalLabelStyle}>Pratinjau Kelir Panggung (Rasio 16:9)</label>
                      <div
                        style={{
                          width: '100%',
                          height: '140px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          position: 'relative',
                          border: '1px solid rgba(212, 175, 55, 0.4)',
                          background: form.category === 'gradient' ? (form.gradient || '#17110c') : '#17110c',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {form.category === 'image' && form.bgImage && (
                          <img
                            src={form.bgImage}
                            alt="Pratinjau Latar"
                            style={{
                              position: 'absolute',
                              inset: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        )}
                        {/* Blencong Glow Simulator */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: form.blencongColor || 'rgba(255, 200, 100, 0.55)',
                            filter: 'blur(8px)',
                            pointerEvents: 'none',
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '8px',
                            left: '12px',
                            background: 'rgba(18, 13, 9, 0.75)',
                            backdropFilter: 'blur(4px)',
                            padding: '3px 10px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: '#fdfbf7',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                          }}
                        >
                          {form.name || 'Nama Kelir Panggung'} • {form.atmosphere || 'Suasana Panggung'}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label style={modalLabelStyle}>Nama Kelir Panggung</label>
                      <input
                        type="text"
                        value={form.name || ''}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        placeholder="Contoh: Gowok Alas Robana HD, Jejer Ayodya, dll."
                        style={modalInputStyle}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={modalLabelStyle}>Tipe Latar Kelir</label>
                        <select
                          value={form.category || 'image'}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                          style={modalInputStyle}
                        >
                          <option value="image">Gambar Latar HD (URL / Berkas)</option>
                          <option value="gradient">Gradasi Soga Tradisional (CSS)</option>
                        </select>
                      </div>

                      <div>
                        <label style={modalLabelStyle}>Suasana Lakon / Adegan</label>
                        <input
                          type="text"
                          value={form.atmosphere || ''}
                          onChange={(e) => setForm({ ...form, atmosphere: e.target.value })}
                          placeholder="Contoh: Siang / Perang / Jejer Kraton / Hutan"
                          style={modalInputStyle}
                        />
                      </div>
                    </div>

                    {form.category === 'image' ? (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <label style={{ ...modalLabelStyle, marginBottom: 0 }}>URL Gambar Latar HD</label>
                          <label
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '11px',
                              color: '#8b4513',
                              fontWeight: '750',
                              cursor: 'pointer',
                              background: 'rgba(212, 175, 55, 0.12)',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              border: '1px solid rgba(212, 175, 55, 0.3)',
                            }}
                          >
                            <Upload size={12} />
                            <span>Unggah dari Komputer</span>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    setForm((prev) => ({ ...prev, bgImage: event.target?.result }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                        <input
                          type="text"
                          value={form.bgImage || ''}
                          onChange={(e) => setForm({ ...form, bgImage: e.target.value })}
                          required={form.category === 'image'}
                          placeholder="https://... atau tempel tautan/data URL gambar"
                          style={modalInputStyle}
                        />
                      </div>
                    ) : (
                      <div>
                        <label style={modalLabelStyle}>CSS Gradient Latar</label>
                        <input
                          type="text"
                          value={form.gradient || ''}
                          onChange={(e) => setForm({ ...form, gradient: e.target.value })}
                          placeholder="radial-gradient(...) atau linear-gradient(...)"
                          style={modalInputStyle}
                        />
                        {/* Preset Gradient Chips */}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                          <span style={{ fontSize: '11px', color: '#786554', alignSelf: 'center' }}>Preset:</span>
                          {[
                            { name: 'Soga Klasik', grad: 'radial-gradient(ellipse at 50% 30%, #4a2810 0%, #170d06 65%, #080402 100%)' },
                            { name: 'Prabanggana Senja', grad: 'linear-gradient(180deg, #1f0d06 0%, #4a1e0b 35%, #8c3a10 65%, #2a1005 100%)' },
                            { name: 'Kurusetra Merah', grad: 'radial-gradient(circle at 50% 40%, #701c08 0%, #300c04 55%, #100402 100%)' },
                            { name: 'Malam Mistik', grad: 'radial-gradient(ellipse at 50% 25%, #16243b 0%, #0c1422 60%, #05080f 100%)' },
                            { name: 'Alas Rimba', grad: 'radial-gradient(ellipse at 50% 30%, #1a3818 0%, #0e1e0d 60%, #050b05 100%)' },
                          ].map((p) => (
                            <button
                              key={p.name}
                              type="button"
                              onClick={() => setForm({ ...form, gradient: p.grad })}
                              style={{
                                fontSize: '10.5px',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                background: '#f5eedf',
                                border: '1px solid rgba(212, 175, 55, 0.3)',
                                color: '#423122',
                                cursor: 'pointer',
                              }}
                            >
                              {p.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={modalLabelStyle}>Cahaya Blencong (Warna)</label>
                        <input
                          type="text"
                          value={form.blencongColor || ''}
                          onChange={(e) => setForm({ ...form, blencongColor: e.target.value })}
                          placeholder="rgba(255, 200, 100, 0.55)"
                          style={modalInputStyle}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {[
                            { label: 'Emas', color: 'rgba(255, 200, 100, 0.55)' },
                            { label: 'Merah', color: 'rgba(255, 120, 60, 0.55)' },
                            { label: 'Perak', color: 'rgba(160, 200, 255, 0.45)' },
                          ].map((bc) => (
                            <button
                              key={bc.label}
                              type="button"
                              onClick={() => setForm({ ...form, blencongColor: bc.color })}
                              style={{
                                flex: 1,
                                fontSize: '11px',
                                padding: '8px 4px',
                                borderRadius: '6px',
                                border: '1px solid rgba(212, 175, 55, 0.3)',
                                background: '#ffffff',
                                color: '#423122',
                                cursor: 'pointer',
                              }}
                            >
                              {bc.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tombol Aksi Dialog */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    marginTop: '28px',
                    borderTop: '1px solid rgba(212, 175, 55, 0.18)',
                    paddingTop: '20px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid rgba(212, 175, 55, 0.45)',
                      color: '#1a140e',
                      padding: '10px 22px',
                      borderRadius: '9999px',
                      fontSize: '13.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      minHeight: '42px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#c27827';
                      e.currentTarget.style.background = '#fcfaf5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.45)';
                      e.currentTarget.style.background = '#ffffff';
                    }}
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    style={{
                      background: '#c27827',
                      border: 'none',
                      color: '#ffffff',
                      padding: '10px 24px',
                      borderRadius: '9999px',
                      fontSize: '14px',
                      fontWeight: '750',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: 'none',
                      minHeight: '42px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#ad671d';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#c27827';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Save size={15} style={{ color: '#ffffff' }} />
                    <span>Simpan Data Master</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          4. LIGHTBOX MODAL: PRATINJAU FOTO & DOKUMEN HD BERESOLUSI TINGGI
          ============================================================ */}
      {lightboxImage && (
        <div
          className="wayang-lightbox-backdrop"
          onClick={() => setLightboxImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="wayang-lightbox-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="wayang-lightbox-header">
              <div>
                <div className="wayang-lightbox-eyebrow">
                  <span className="wayang-lightbox-dot" />
                  <span>PRATINJAU DOKUMEN PRESERVASI</span>
                  <span style={{ opacity: 0.5 }}>•</span>
                  <span>{lightboxImage.type || 'Aset Visual'}</span>
                </div>
                <h3 className="wayang-lightbox-title">{lightboxImage.title}</h3>
                {lightboxImage.subtitle && (
                  <p className="wayang-lightbox-subtitle">{lightboxImage.subtitle}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="wayang-modal-close-btn"
                aria-label="Tutup Pratinjau Foto"
              >
                <X size={18} />
              </button>
            </div>

            {/* Canvas Body */}
            <div className="wayang-lightbox-body">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title}
                className="wayang-lightbox-img"
              />
            </div>

            {/* Footer */}
            <div className="wayang-lightbox-footer">
              <div className="wayang-lightbox-meta">
                <span>Format Otentik Preservasi Budaya • Resolusi Penuh HD</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <a
                  href={lightboxImage.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wayang-lightbox-btn-secondary"
                  title="Buka gambar di tab peramban baru"
                >
                  <ExternalLink size={13} />
                  <span>Buka di Tab Baru</span>
                </a>
                <button
                  type="button"
                  onClick={() => setLightboxImage(null)}
                  className="wayang-lightbox-btn-primary"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Modal Form Styles
const modalLabelStyle = {
  display: 'block',
  fontSize: '11.5px',
  fontWeight: '750',
  color: '#423122',
  marginBottom: '6px',
  letterSpacing: '0.01em',
};

const modalInputStyle = {
  width: '100%',
  padding: '10px 14px',
  background: '#ffffff',
  border: '1px solid rgba(212, 175, 55, 0.4)',
  borderRadius: '8px',
  color: '#1a140e',
  fontSize: '13px',
  boxSizing: 'border-box',
  outline: 'none',
  fontFamily: 'inherit',
  boxShadow: 'inset 0 1px 2px rgba(40, 28, 16, 0.04)',
};
