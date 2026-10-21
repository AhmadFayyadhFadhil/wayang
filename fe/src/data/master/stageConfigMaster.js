/**
 * Master Data Konfigurasi Panggung (Virtual Stage 2D)
 * Mencakup preset background kelir otentik, daftar pose, dan aturan koordinat
 */

const STORAGE_CUSTOM_KEY = 'wayangverse_custom_stage_backgrounds';

export const BUILTIN_STAGE_BACKGROUNDS = [
  {
    id: 'kelir-gunungan-kayon',
    name: 'Kelir Gunungan & Surya Kencana',
    description: 'Dua Gunungan Kayon kembar dengan latar awan megamendung dan pendaran surya emas blencong sakral.',
    atmosphere: 'Sakral & Luhur — Jejer Pembuka & Penutup',
    bgType: 'image',
    bgImage: '/images/backgrounds/kelir_gunungan_stage.png',
    bgColor: '#17110c',
    kelirColor: '#fef3c7',
    glowColor: '#d4af37',
    shadowColor: '#362619',
    imageOpacity: 0.92,
    status: 'published',
  },
  {
    id: 'kelir-blencong-default',
    name: 'Kelir Blencong Klasik',
    description: 'Layar kain putih gading tradisional dengan pendaran keemasan hangat dari lampu minyak blencong di bagian tengah atas.',
    atmosphere: 'Hangat, Sakral, Nuansa Malam Tradisional',
    bgType: 'gradient',
    bgColor: '#1c1917',
    kelirColor: '#fdf6e2',
    glowColor: '#f59e0b',
    shadowColor: '#451a03',
    status: 'published',
  },
  {
    id: 'kelir-kurusetra-perang',
    name: 'Kurusetra Laga Senja',
    description: 'Langit senja temaram kemerahan berdebu melatari peperangan agung para satria di medan Kurusetra.',
    atmosphere: 'Heroik, Genting, Peperangan Bharatayuddha',
    bgType: 'gradient',
    bgColor: '#2a0808',
    kelirColor: '#fed7aa',
    glowColor: '#ef4444',
    shadowColor: '#450a0a',
    status: 'published',
  },
  {
    id: 'kelir-pendopo-agung',
    name: 'Pendopo Keraton Agung',
    description: 'Nuansa megah aula istana keraton dengan tiang soko guru jati dan gebyok ukir emas keprabon.',
    atmosphere: 'Megah, Berwibawa, Jejer Keprabon & Kedhaton',
    bgType: 'gradient',
    bgColor: '#17110c',
    kelirColor: '#fef3c7',
    glowColor: '#d97706',
    shadowColor: '#78350f',
    status: 'published',
  },
  {
    id: 'kelir-alas-robana',
    name: 'Alas Robana Rimba',
    description: 'Siluet pepohonan lebat rimba belantara tempat pengembaraan dan pertapaan para ksatria utama.',
    atmosphere: 'Misterius, Rindang, Hutan Belantara & Pertapaan',
    bgType: 'gradient',
    bgColor: '#061a12',
    kelirColor: '#dcfce7',
    glowColor: '#10b981',
    shadowColor: '#064e3b',
    status: 'published',
  },
  {
    id: 'kelir-malam-mistik',
    name: 'Samudra Mistik Semesta',
    description: 'Kelir malam bernuansa biru indigo temaram, cocok untuk adegan pertapaan spiritual dan pencarian jatidiri (Dewa Ruci).',
    atmosphere: 'Hening, Teduh, Mistik Spiritual Samudra',
    bgType: 'gradient',
    bgColor: '#090d16',
    kelirColor: '#e0e7ff',
    glowColor: '#6366f1',
    shadowColor: '#1e1b4b',
    status: 'published',
  },
  {
    id: 'kelir-prabanggana-langit',
    name: 'Prabanggana Dirgantara',
    description: 'Layar temaram cakrawala angkasa dengan hamparan awan keemasan tempat Gatotkaca melesat terbang.',
    atmosphere: 'Megah, Luas, Angkasa Dirgantara',
    bgType: 'gradient',
    bgColor: '#1a140e',
    kelirColor: '#fbf3d5',
    glowColor: '#e5c158',
    shadowColor: '#451a03',
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
