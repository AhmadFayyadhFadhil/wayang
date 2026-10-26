/**
 * Master Data Tata Suara & Soundscape
 * Meliputi BGM Gamelan, SFX Dalang (Dodogan, Kepyak, Suluk)
 */

export const AUDIO_MASTER = [
  {
    id: 1,
    title: 'Gamelan Srepeg Mataram',
    category: 'bgm',
    instrument: 'Kendang Ciblon, Bonang, Gender, Gong & Saron',
    tempo: 'Cepat & Heroik',
    tempoTag: 'Cepat',
    mood: 'Pertempuran / Perang Tanding / Ketegangan',
    shortDesc: 'Irama heroik pertempuran ksatria.',
    description: 'Irama dinamis penuh semangat khas pertunjukan wayang saat adegan peperangan antar kesatria.',
    sourceNote: 'Rekaman Studio Karawitan Tradisi',
    licenseNote: 'CC-BY 4.0 Creative Commons Budaya',
    durationSec: 120,
    synthType: 'srepeg'
  },
  {
    id: 2,
    title: 'Gamelan Ayak-ayak Slendro',
    category: 'bgm',
    instrument: 'Gender Barung, Gambang, Rebab & Kethuk',
    tempo: 'Lambat, Syahdu, Mengalun',
    tempoTag: 'Lambat',
    mood: 'Kedamaian / Dialog Filosofis / Pertapaan',
    shortDesc: 'Melodi syahdu dialog tenang pamong.',
    description: 'Melodi lembut gamelan laras Slendro yang menenangkan, biasa dibunyikan saat jejer dialog bijak para pamong dan begawan.',
    sourceNote: 'Arsip Sanggar Karawitan Pura Mangkunegaran',
    licenseNote: 'Domain Publik Budaya Nusantara',
    durationSec: 180,
    synthType: 'ayak_ayak'
  },
  {
    id: 3,
    title: 'Gamelan Sampak Alengka',
    category: 'bgm',
    instrument: 'Kendang Ageng, Kenong, Kepyak & Kempul',
    tempo: 'Sangat Cepat & Bergetar',
    tempoTag: 'Sangat Cepat',
    mood: 'Kekacauan / Amarah / Pasukan Raksasa',
    shortDesc: 'Ketukan cepat tensi laga raksasa.',
    description: 'Pukulan bertubi-tubi dengan ketukan ritmis menegangkan menggambarkan kegentingan situasi negara.',
    sourceNote: 'Kurasi Tim Seni Pedalangan',
    licenseNote: 'CC-BY-NC 4.0 Edukasi',
    durationSec: 95,
    synthType: 'sampak'
  },
  {
    id: 4,
    title: 'Dodogan Kotak Kayu',
    category: 'sfx',
    instrument: 'Cempala Kayu & Kotak Wayang Jati',
    tempo: 'Aksen Tunggal / Hentakan',
    tempoTag: 'Aksen Tunggal',
    mood: 'Aksentuasi / Isyarat Komando',
    shortDesc: 'Ketuk cempala isyarat dalang.',
    description: 'Ketukan kayu keras cempala dalang ke dinding kotak wayang untuk menandai perubahan gerak dan tanda vokal dalang.',
    sourceNote: 'Efek Suara Asli Pedalangan',
    licenseNote: 'Royalty Free Budaya',
    durationSec: 1,
    synthType: 'dodogan'
  },
  {
    id: 5,
    title: 'Kepyak Pelat Logam',
    category: 'sfx',
    instrument: 'Pelat Kuningan / Perunggu & Cempala Besi',
    tempo: 'Gemerincing Tajam',
    tempoTag: 'Gemerincing',
    mood: 'Ketegangan Gerak / Langkah Wayang',
    shortDesc: 'Gemerincing aksen sabetan wayang.',
    description: 'Bunyi gemerincing tajam dari lempengan logam yang dipukul kaki dalang untuk mengiringi langkah sabetan wayang.',
    sourceNote: 'Efek Suara Pedalangan Tradisional',
    licenseNote: 'Royalty Free Budaya',
    durationSec: 1,
    synthType: 'kepyak'
  },
  {
    id: 6,
    title: 'Gong Ageng Pamungkas',
    category: 'sfx',
    instrument: 'Gong Ageng Perunggu 90cm',
    tempo: 'Gema Menggelegar Dalam',
    tempoTag: 'Gema Ageng',
    mood: 'Pemberhentian / Simpul Makna / Titik Balik',
    shortDesc: 'Dentuman sakral penutup babak.',
    description: 'Dentuman sakral gong ageng dengan getaran resonansi mendalam penutup gongan lakon.',
    sourceNote: 'Koleksi Studio Musik Tradisi',
    licenseNote: 'Royalty Free Budaya',
    durationSec: 4,
    synthType: 'gong'
  }
];

export const getAudioById = (id) => AUDIO_MASTER.find((a) => a.id === Number(id));
export const getBgmTracks = () => AUDIO_MASTER.filter((a) => a.category === 'bgm');
export const getSfxTracks = () => AUDIO_MASTER.filter((a) => a.category === 'sfx');
