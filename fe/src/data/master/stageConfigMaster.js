/**
 * Master Data Konfigurasi Panggung (Virtual Stage 2D)
 * Mencakup preset background kelir otentik, daftar pose, dan aturan koordinat
 */

const STORAGE_CUSTOM_KEY = 'wayangverse_custom_stage_backgrounds';

export const BUILTIN_STAGE_BACKGROUNDS = [
  {
    id: 'kelir-naskah-prada-kencana',
    name: 'Kelir Naskah Prada Kencana',
    description: 'Latar naskah daun lontar dan serat serat emas prada berbingkai ornamen sulur klasik kraton dengan arak-arakan animasi awan.',
    atmosphere: 'Klasik, Anggun, Serat Kuno Nusantara & Awan Megamendung',
    pathet: 'nem',
    bgType: 'image',
    bgImage: '/images/backgrounds/bg_kelir_naskah_prada.jpg',
    bgColor: '#1c150e',
    kelirColor: '#f7eccf',
    glowColor: '#d4af37',
    shadowColor: '#362619',
    imageOpacity: 0.95,
    hasGunungan: false,
    hasCloudsAnimation: true,
    status: 'published',
  },
  {
    id: 'kelir-gunungan-batik-soga',
    name: 'Kelir Awan Batik Soga',
    description: 'Hamparan kain kelir kuno berhiaskan motif batik klasik soga kraton dengan sapuan lembut arak-arakan animasi awan.',
    atmosphere: 'Megah, Tradisi Luhur, Jejer Dalang & Animasi Awan',
    pathet: 'nem',
    bgType: 'image',
    bgImage: '/images/backgrounds/bg_kelir_gunungan_batik.jpg',
    bgColor: '#1e140d',
    kelirColor: '#fcefd2',
    glowColor: '#e5c158',
    shadowColor: '#3a2212',
    imageOpacity: 0.95,
    hasGunungan: false,
    hasCloudsAnimation: true,
    status: 'published',
  },
  {
    id: 'kelir-kayon-keraton-kencana',
    name: 'Kelir Awan Keraton Kencana',
    description: 'Panggung adiluhung berlatar serat naskah prada dengan arak-arakan animasi awan kraton kencana.',
    atmosphere: 'Sakral, Kharismatik, Animasi Awan Megamendung',
    pathet: 'sanga',
    bgType: 'image',
    bgImage: '/images/backgrounds/bg_kelir_kayon_keraton.jpg',
    bgColor: '#160e08',
    kelirColor: '#fbe9c7',
    glowColor: '#f59e0b',
    shadowColor: '#3d1c08',
    imageOpacity: 0.95,
    hasGunungan: false,
    hasCloudsAnimation: true,
    status: 'published',
  },
  {
    id: 'kelir-naskah-kuno-pustaka',
    name: 'Kelir Naskah Megamendung Pustaka',
    description: 'Kelir kertas pustaka babad serat kuno bertingkat dengan sapuan lembut animasi awan sakral Nusantara.',
    atmosphere: 'Arsip Suci, Mistik Babak Pertapaan & Awan Emas',
    pathet: 'sanga',
    bgType: 'image',
    bgImage: '/images/backgrounds/bg_kelir_naskah_pustaka.jpg',
    bgColor: '#18120b',
    kelirColor: '#f6ebd0',
    glowColor: '#d4af37',
    shadowColor: '#382514',
    imageOpacity: 0.95,
    hasGunungan: false,
    hasCloudsAnimation: true,
    status: 'published',
  },
  {
    id: 'kelir-teratai-prada-lumut',
    name: 'Kelir Teratai Prada Lumut',
    description: 'Kelir beludru hijau lumut antik bertahtakan bingkai emas tempaan kraton dengan animasi awan mistik.',
    atmosphere: 'Eksklusif, Khidmat, Pagelaran Mahakarya & Awan',
    pathet: 'manyura',
    bgType: 'image',
    bgImage: '/images/backgrounds/bg_kelir_teratai_lumut.jpg',
    bgColor: '#141811',
    kelirColor: '#e6ede0',
    glowColor: '#d4af37',
    shadowColor: '#1d2a1b',
    imageOpacity: 0.95,
    hasGunungan: false,
    hasCloudsAnimation: true,
    status: 'published',
  },
];

export const STAGE_CONFIG_MASTER = {
  version: 1,
  aspectRatio: '16:9',
  viewBox: {
    width: 1000,
    height: 562.5,
  },
  coordinateBounds: {
    minX: 0.05,
    maxX: 0.95,
    minY: 0.30,
    maxY: 0.85,
  },
  backgrounds: BUILTIN_STAGE_BACKGROUNDS,
  poses: [
    { id: 'default', label: 'Tancep (Siaga Tegak)' },
    { id: 'sembah', label: 'Sembah (Menghormat)' },
    { id: 'perang', label: 'Laga (Angkat Senjata)' },
    { id: 'terbang', label: 'Melayang di Udara' },
    { id: 'memanah', label: 'Membidik Panah' },
    { id: 'nasihat', label: 'Dialog / Nasihat' },
  ],
};

/**
 * Mengambil daftar panggung kustom yang disimpan di browser
 */
export function getCustomBackgrounds() {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Menyimpan panggung kustom baru atau memperbarui yang ada
 */
export function saveCustomBackground(bgData) {
  try {
    const current = getCustomBackgrounds();
    const existingIdx = current.findIndex((b) => b.id === bgData.id);
    let updated;
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = { ...updated[existingIdx], ...bgData, isCustom: true };
    } else {
      updated = [{ ...bgData, isCustom: true, status: bgData.status || 'published' }, ...current];
    }
    localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

/**
 * Menghapus panggung kustom
 */
export function deleteCustomBackground(id) {
  try {
    const current = getCustomBackgrounds();
    const filtered = current.filter((b) => b.id !== id);
    localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(filtered));
    return filtered;
  } catch {
    return [];
  }
}

/**
 * Mengambil seluruh panggung (bawaan sistem + kustom yang ditambahkan)
 */
export function getAllBackgrounds() {
  const custom = getCustomBackgrounds();
  return [...BUILTIN_STAGE_BACKGROUNDS, ...custom];
}

/**
 * Mengambil konfigurasi panggung berdasarkan ID
 */
export function getBackgroundById(id) {
  const all = getAllBackgrounds();
  return all.find((b) => b.id === id) || BUILTIN_STAGE_BACKGROUNDS[0];
}
