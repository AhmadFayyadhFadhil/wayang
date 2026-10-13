/**
 * Master Data Konfigurasi Panggung (Virtual Stage 2D)
 * Mencakup preset background kelir, daftar pose, dan aturan koordinat
 */

export const STAGE_CONFIG_MASTER = {
  version: 1,
  aspectRatio: '16:9',
  viewBox: {
    width: 1000,
    height: 562.5
  },
  coordinateBounds: {
    minX: 0.05,
    maxX: 0.95,
    minY: 0.30,
    maxY: 0.85
  },
  backgrounds: [
    {
      id: 'kelir-blencong-default',
      name: 'Kelir Blencong Klasik',
      description: 'Layar kain putih khas dengan pendaran keemasan hangat dari lampu minyak blencong di bagian tengah atas.',
      atmosphere: 'Hangat, Sakral, Nuansa Malam Tradisional',
      bgColor: '#1c1917',
      kelirColor: '#fdf6e2',
      glowColor: '#f59e0b',
      shadowColor: '#451a03'
    },
    {
      id: 'kelir-kurusetra-perang',
      name: 'Kurusetra Laga Senja',
      description: 'Langit senja temaram kemerahan berdebu melatari peperangan agung para satria.',
      atmosphere: 'Heroik, Genting, Dramatis Kemerahan',
      bgColor: '#2a0808',
      kelirColor: '#fed7aa',
      glowColor: '#ef4444',
      shadowColor: '#450a0a'
    },
    {
      id: 'kelir-malam-mistik',
      name: 'Samudra Mistik Semesta',
      description: 'Kelir malam bernuansa biru indigo temaram, cocok untuk adegan pertapaan dan perenungan hakikat jiwa.',
      atmosphere: 'Tenang, Teduh, Mistik Biru Malam',
      bgColor: '#090d16',
      kelirColor: '#e0e7ff',
      glowColor: '#6366f1',
      shadowColor: '#1e1b4b'
    },
    {
      id: 'kelir-alas-robana',
      name: 'Alas Robana Rimba',
      description: 'Siluet pepohonan lebat rimba belantara tempat pengembaraan para kesatria.',
      atmosphere: 'Misterius, Rindang, Hutan Belantara',
      bgColor: '#061a12',
      kelirColor: '#dcfce7',
      glowColor: '#10b981',
      shadowColor: '#064e3b'
    },
    {
      id: 'kelir-pendopo-agung',
      name: 'Pendopo Keraton Agung',
      description: 'Nuansa megah aula istana keraton dengan tiang soko guru dan gebyok ukir.',
      atmosphere: 'Megah, Berwibawa, Jejer Keprabon',
      bgColor: '#17110c',
      kelirColor: '#fef3c7',
      glowColor: '#d97706',
      shadowColor: '#78350f'
    }
  ],
  poses: [
    { id: 'default', label: 'Tancep (Siaga Tegak)' },
    { id: 'sembah', label: 'Sembah (Menghormat)' },
    { id: 'perang', label: 'Laga (Angkat Senjata)' },
    { id: 'terbang', label: 'Melayang di Udara' },
    { id: 'memanah', label: 'Membidik Panah' },
    { id: 'nasihat', label: 'Dialog / Nasihat' }
  ]
};

export const getBackgroundById = (id) =>
  STAGE_CONFIG_MASTER.backgrounds.find((b) => b.id === id) || STAGE_CONFIG_MASTER.backgrounds[0];
