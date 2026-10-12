/**
 * Master Data Cerita & Lakon Wayang (Story Atlas)
 * Dilengkapi Sumber Provenance & Relasi Tokoh (Connected by Design)
 */

export const STORIES_MASTER = [
  {
    id: 1,
    slug: 'gugurnya-ghatotkaca',
    title: 'Bharatayuddha: Gugurnya Ghatotkaca',
    synopsis: 'Pertempuran malam hari yang dramatis di Kurusetra. Demi melindungi pamannya, Arjuna, dari panah pusaka sakti Kunta Wijayandanu milik Adipati Karna, Raden Gatotkaca membumbung tinggi menyusup ke balik awan untuk memecah perhatian pasukan Kurawa sebelum takdir menjemputnya sebagai pahlawan bangsa.',
    philosophy: 'Pengorbanan suci seorang generasi muda yang memilih gugur demi keberlangsungan perjuangan yang lebih besar. Kematian fisik bukanlah kekalahan jika kehormatan dan keselamatan sesama berhasil dijaga.',
    tradition: 'Gaya Surakarta & Yogyakarta (Gagrag Mataram)',
    versionLabel: 'Serat Bharatayuddha - Pupuh Salya-Karna',
    characterIds: [1, 3, 2], // Gatotkaca, Karna, Arjuna
    sources: [
      {
        title: 'Kakawin Bharatayuddha',
        author: 'Mpu Sedah & Mpu Panuluh (abad ke-12 Masehi)',
        reference: 'Balai Pustaka / Reksa Pustaka Mangkunegaran',
        rightsNote: 'Warisan Budaya Nusantara / Domain Publik'
      },
      {
        title: 'Naskah Lakon Wayang Kulit Purwa Ki Manteb Soedharsono',
        author: 'Ki Manteb Soedharsono (1998)',
        reference: 'Dokumentasi Sanggar Seni Surakarta',
        rightsNote: 'Arsip Kurasi Pedalangan'
      }
    ],
    recommendedBackground: 'kelir-kurusetra-perang',
    themeSong: 'Gamelan Srepeg Mataram'
  },
  {
    id: 2,
    slug: 'dewa-ruci',
    title: 'Dewa Ruci: Samudra Hakikat Kehidupan',
    synopsis: 'Perjalanan spiritual Raden Werkudara (Bima) atas perintah gurunya Resi Durna untuk mencari Air Kehidupan (Tirta Perwitasari). Setelah menjelajahi hutan belantara dan menyelami samudra raya, Bima justru bertemu sosok kerdil yang persis dirinya bernama Dewa Ruci yang mengajarkannya rahasia hakikat manusia dan ketuhanan.',
    philosophy: 'Pencarian jati diri manusia (manunggaling kawula Gusti), ketulusan ketaatan seorang murid, keberanian menaklukkan ego pribadi, dan penemuan kedamaian batin hakiki.',
    tradition: 'Gaya Surakarta & Pesisiran',
    versionLabel: 'Serat Dewa Ruci Pakem Yasadipura I',
    characterIds: [4, 5], // Bima, Semar
    sources: [
      {
        title: 'Serat Dewa Ruci',
        author: 'Raden Ngabehi Yasadipura I (Kasunanan Surakarta)',
        reference: 'Koleksi Museum Radyapustaka Surakarta',
        rightsNote: 'Domain Publik'
      }
    ],
    recommendedBackground: 'kelir-malam-mistik',
    themeSong: 'Gamelan Ayak-ayak Slendro'
  },
  {
    id: 3,
    slug: 'shinta-obong',
    title: 'Ramayana: Kesucian Api Shinta Obong',
    synopsis: 'Setelah prabu Rahwana berhasil dikalahkan oleh Sri Rama dibantu laskar kera Hanoman, Dewi Shinta dijemput kembali. Untuk membuktikan kesucian hatinya setelah bertahun-tahun ditawan di negeri Alengka, Shinta menceburkan diri ke dalam kobaran api unggun suci yang justru melindunginya karena ketulusan baktinya.',
    philosophy: 'Keteguhan iman dan integritas moral wanita dalam menghadapi fitnah dan praduga. Api suci melambangkan pembersihan batin dan kebenaran sejati yang tak akan pernah lekang oleh celaan.',
    tradition: 'Gaya Surakarta, Yogyakarta & Bali',
    versionLabel: 'Kakawin Ramayana Bab Uttarakanda',
    characterIds: [6, 2], // Rahwana, Arjuna (perwakilan ksatria)
    sources: [
      {
        title: 'Kakawin Ramayana Kuno',
        author: 'Pujangga Kerajaan Medang Mataram Kuno (Abad ke-9)',
        reference: 'Koleksi Balai Kajian Sejarah & Budaya Nusantara',
        rightsNote: 'Cagar Budaya Nasional'
      }
    ],
    recommendedBackground: 'kelir-blencong-default',
    themeSong: 'Gamelan Sampak Alengka'
  }
];

export const getStoryBySlug = (slug) => STORIES_MASTER.find((s) => s.slug === slug);
export const getStoryById = (id) => STORIES_MASTER.find((s) => s.id === Number(id));
