/**
 * Master Data Tokoh & Karakter Wayang
 * Sesuai PRD/SRS Wayangverse (Cultural Integrity & Connected by Design)
 */

export const CHARACTERS_MASTER = [
  {
    id: 1,
    slug: 'gatotkaca',
    name: 'Raden Gatotkaca',
    alias: 'Satria Pringgandani, Senopati Udara',
    type: 'ksatria',
    typeName: 'Ksatria Gagah Perkasa',
    weapons: 'Kotang Antakusuma, Aji Brajamusti',
    description: 'Putra Raden Werkudara (Bima) dan Dewi Arimbi. Bertubuh kokoh berotot kawat bertulang besi ("otot kawat balung wesi"), mampu terbang melesat di angkasa tanpa sayap burung.',
    philosophy: 'Simbol dedikasi, kerelaan berkorban demi keutuhan bangsa, serta kesetiaan prajurit sejati yang menomorsatukan keselamatan keluarga dan negeri di atas kepentingannya sendiri.',
    tradition: 'Gaya Surakarta & Yogyakarta',
    defaultScale: 1.0,
    availablePoses: ['default', 'sembah', 'perang', 'terbang'],
    status: 'published',
    accentColor: '#d4af37',
    silhouetteSvg: 'gatotkaca'
  },
  {
    id: 2,
    slug: 'arjuna',
    name: 'Raden Arjuna',
    alias: 'Janaka, Dananjaya, Permadi',
    type: 'ksatria',
    typeName: 'Ksatria Halus & Utama',
    weapons: 'Panah Pasopati, Gandewa, Pulanggeni',
    description: 'Putra Prabu Pandu dan Dewi Kunti, penengah Pandawa. Sosok ksatria berparas rupawan, berwatak tenang, lemah lembut tutur katanya, dan ahli memanah nomor satu di jagad pewayangan.',
    philosophy: 'Mewakili ketenangan batin, ketajaman konsentrasi (*cipta wening*), kepatuhan pada dharma, serta kesanggupan mengendalikan nafsu indria.',
    tradition: 'Gaya Surakarta & Yogyakarta',
    defaultScale: 0.95,
    availablePoses: ['default', 'sembah', 'perang', 'memanah'],
    status: 'published',
    accentColor: '#e5c158',
    silhouetteSvg: 'arjuna'
  },
  {
    id: 3,
    slug: 'karna',
    name: 'Adipati Karna',
    alias: 'Basukarna, Suryaputra',
    type: 'ksatria',
    typeName: 'Ksatria Satria Narpatitama',
    weapons: 'Senjata Kunta Wijayandanu, Panah Wijayacapa',
    description: 'Raja Awangga yang merupakan saudara seibu para Pandawa (putra Batara Surya dan Dewi Kunti). Berdiri membela Kurawa bukan karena membenarkan kejahatan, melainkan demi membalas budi dan sumpah kesatria kepada Duryudana.',
    philosophy: 'Simbol dilema moral manusia dan keluhuran memegang janji (*setya toh pati*). Ia mengajarkan arti kesetiaan tanpa pamrih pada kehormatan janji diri.',
    tradition: 'Gaya Surakarta & Yogyakarta',
    defaultScale: 0.98,
    availablePoses: ['default', 'sembah', 'perang', 'memanah'],
    status: 'published',
    accentColor: '#d97706',
    silhouetteSvg: 'karna'
  },
  {
    id: 4,
    slug: 'bima',
    name: 'Raden Werkudara (Bima)',
    alias: 'Bimasena, Bayusuta, Bratasena',
    type: 'ksatria',
    typeName: 'Ksatria Gagah Lugas',
    weapons: 'Kuku Pancanaka, Gada Rujakpala',
    description: 'Pandawa kedua yang berbadan tinggi besar, berwatak jujur, pantang berbohong, tidak pernah menggunakan bahasa krama (selalu ngoko) kepada siapapun kecuali Dewa Ruci karena ketulusan hatinya.',
    philosophy: 'Lambang ketegasan hukum, kejujuran tanpa tedeng aling-aling, kekuatan moral, dan pencarian hakikat sejati jatidiri manusia (*Sangkan Paraning Dumadi*).',
    tradition: 'Gaya Surakarta & Yogyakarta',
    defaultScale: 1.15,
    availablePoses: ['default', 'sembah', 'perang', 'tinju'],
    status: 'published',
    accentColor: '#c59b27',
    silhouetteSvg: 'bima'
  },
  {
    id: 5,
    slug: 'semar',
    name: 'Kyai Lurah Semar',
    alias: 'Batara Ismaya, Janggan Smarasanta',
    type: 'punakawan',
    typeName: 'Pamong Luhur & Dewa Ngejawantah',
    weapons: 'Kentrung / Kentut Pengapesan, Ajian Semar Mesem',
    description: 'Pamong agung para kesatria Pandawa yang sesungguhnya adalah penjelmaan Batara Ismaya. Berwajah menangis tapi mulutnya tersenyum, berbadan bulat namun lincah, berbusana kain poleng.',
    philosophy: 'Representasi kebijaksanaan rakyat jelata, kesederhanaan, penyeimbang kekuasaan, dan suara nurani yang senantiasa mengingatkan para pemimpin agar tidak angkuh.',
    tradition: 'Gaya Surakarta, Yogyakarta & Sunda',
    defaultScale: 0.85,
    availablePoses: ['default', 'sembah', 'nasihat'],
    status: 'published',
    accentColor: '#bfae9c',
    silhouetteSvg: 'semar'
  },
  {
    id: 6,
    slug: 'rahwana',
    name: 'Prabu Rahwana (Dasamuka)',
    alias: 'Raja Alengka, Dasasirsa',
    type: 'raksasa',
    typeName: 'Raja Raksasa Angkara',
    weapons: 'Aji Rawarontek, Aji Pancasona, Candrahasa',
    description: 'Raja raksasa penguasa Alengka berkepala sepuluh yang memiliki kesaktian luar biasa karena dapat hidup kembali selama menyentuh bumi. Terbutakan oleh nafsu ingin memiliki Dewi Shinta.',
    philosophy: 'Peringatan keras akan kehancuran akibat keserakahan, arogansi kekuasaan, dan kegagalan menundukkan hawa nafsu duniawi.',
    tradition: 'Gaya Surakarta & Sunda',
    defaultScale: 1.18,
    availablePoses: ['default', 'perang', 'tertawa'],
    status: 'published',
    accentColor: '#991b1b',
    silhouetteSvg: 'rahwana'
  }
];

export const getCharacterById = (id) => CHARACTERS_MASTER.find((c) => c.id === Number(id));
export const getCharacterBySlug = (slug) => CHARACTERS_MASTER.find((c) => c.slug === slug);
