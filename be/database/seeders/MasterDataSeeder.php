<?php

namespace Database\Seeders;

use App\Models\AudioAsset;
use App\Models\Character;
use App\Models\Performance;
use App\Models\Source;
use App\Models\Story;
use App\Models\User;
use Illuminate\Database\Seeder;

class MasterDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. SEED KARAKTER WAYANG
        $charactersData = [
            [
                'id' => 1,
                'slug' => 'gatotkaca',
                'name' => 'Raden Gatotkaca',
                'alias' => 'Satria Pringgandani, Senopati Udara',
                'type' => 'ksatria',
                'type_name' => 'Ksatria Gagah Perkasa',
                'weapons' => 'Kotang Antakusuma, Aji Brajamusti',
                'description' => 'Putra Raden Werkudara (Bima) dan Dewi Arimbi. Bertubuh kokoh berotot kawat bertulang besi ("otot kawat balung wesi"), mampu terbang melesat di angkasa tanpa sayap burung.',
                'philosophy' => 'Simbol dedikasi, kerelaan berkorban demi keutuhan bangsa, serta kesetiaan prajurit sejati yang menomorsatukan keselamatan keluarga dan negeri di atas kepentingannya sendiri.',
                'tradition' => 'Gaya Surakarta & Yogyakarta',
                'default_scale' => 1.00,
                'available_poses' => ['default', 'sembah', 'perang', 'terbang'],
                'accent_color' => '#eab308',
                'silhouette_svg' => 'gatotkaca',
                'status' => 'published',
            ],
            [
                'id' => 2,
                'slug' => 'arjuna',
                'name' => 'Raden Arjuna',
                'alias' => 'Janaka, Dananjaya, Permadi',
                'type' => 'ksatria',
                'type_name' => 'Ksatria Halus & Utama',
                'weapons' => 'Panah Pasopati, Gandewa, Pulanggeni',
                'description' => 'Putra Prabu Pandu dan Dewi Kunti, penengah Pandawa. Sosok ksatria berparas rupawan, berwatak tenang, lemah lembut tutur katanya, dan ahli memanah nomor satu di jagad pewayangan.',
                'philosophy' => 'Mewakili ketenangan batin, ketajaman konsentrasi (cipta wening), kepatuhan pada dharma, serta kesanggupan mengendalikan nafsu indria.',
                'tradition' => 'Gaya Surakarta & Yogyakarta',
                'default_scale' => 0.95,
                'available_poses' => ['default', 'sembah', 'perang', 'memanah'],
                'accent_color' => '#38bdf8',
                'silhouette_svg' => 'arjuna',
                'status' => 'published',
            ],
            [
                'id' => 3,
                'slug' => 'karna',
                'name' => 'Adipati Karna',
                'alias' => 'Basukarna, Suryaputra',
                'type' => 'ksatria',
                'type_name' => 'Ksatria Satria Narpatitama',
                'weapons' => 'Senjata Kunta Wijayandanu, Panah Wijayacapa',
                'description' => 'Raja Awangga yang merupakan saudara seibu para Pandawa (putra Batara Surya dan Dewi Kunti). Berdiri membela Kurawa bukan karena membenarkan kejahatan, melainkan demi membalas budi dan sumpah kesatria kepada Duryudana.',
                'philosophy' => 'Simbol dilema moral manusia dan keluhuran memegang janji (setya toh pati). Ia mengajarkan arti kesetiaan tanpa pamrih pada kehormatan janji diri.',
                'tradition' => 'Gaya Surakarta & Yogyakarta',
                'default_scale' => 0.98,
                'available_poses' => ['default', 'sembah', 'perang', 'memanah'],
                'accent_color' => '#f97316',
                'silhouette_svg' => 'karna',
                'status' => 'published',
            ],
            [
                'id' => 4,
                'slug' => 'bima',
                'name' => 'Raden Werkudara (Bima)',
                'alias' => 'Bimasena, Bayusuta, Jagal Bilawa',
                'type' => 'ksatria',
                'type_name' => 'Ksatria Penegak Keadilan',
                'weapons' => 'Kuku Pancanaka, Gada Rujakpala',
                'description' => 'Putra kedua Pandawa yang berpostur tinggi besar, berwatak lugas, jujur apa adanya, tidak pernah berbahasa krama halus kepada siapa pun kecuali kepada Dewa Ruci karena kejujuran hatinya yang murni.',
                'philosophy' => 'Lambang ketegasan moral, keberanian membela kebenaran tanpa kompromi, dan ketulusan pencarian spiritual hakiki.',
                'tradition' => 'Gaya Surakarta & Yogyakarta',
                'default_scale' => 1.15,
                'available_poses' => ['default', 'sembah', 'perang'],
                'accent_color' => '#10b981',
                'silhouette_svg' => 'bima',
                'status' => 'published',
            ],
            [
                'id' => 5,
                'slug' => 'semar',
                'name' => 'Kyai Lurah Semar',
                'alias' => 'Badranaya, Ismaya, Ki Nayantaka',
                'type' => 'punakawan',
                'type_name' => 'Pamong & Pengayom Sejati',
                'weapons' => 'Kentut Ajimat, Sabda Suci',
                'description' => 'Pamong para ksatria berbudi luhur yang sejatinya adalah penjelmaan Batara Ismaya. Bertubuh tambun, bermata sembab lambang keprihatinan rakyat jelata, selalu tersenyum namun bijaksana luar biasa.',
                'philosophy' => 'Mewakili kedaulatan rakyat kecil, kerendahhatian, kearifan lokal Nusantara, dan penyeimbang kekuasaan para penguasa.',
                'tradition' => 'Gaya Jawa Mataram & Pesisiran',
                'default_scale' => 0.85,
                'available_poses' => ['default', 'sembah', 'nasihat'],
                'accent_color' => '#a855f7',
                'silhouette_svg' => 'semar',
                'status' => 'published',
            ],
            [
                'id' => 6,
                'slug' => 'rahwana',
                'name' => 'Prabu Dasamuka (Rahwana)',
                'alias' => 'Rawana, Raja Alengka',
                'type' => 'raksasa',
                'type_name' => 'Raja Angkara Murka',
                'weapons' => 'Aji Pancasona, Pedang Mentawa',
                'description' => 'Raja perkasa negeri Alengka yang berwajah sepuluh (Dasamuka). Memiliki kesaktian luar biasa tak tertandingi hingga mampu menaklukkan para dewa, namun takluk oleh hawa nafsu dan kesombongan dirinya sendiri.',
                'philosophy' => 'Peringatan keras bagi manusia tentang bahaya ambisi tanpa batas, arogansi kekuasaan, dan kehancuran tak terelakkan akibat menuruti hawa nafsu angkara.',
                'tradition' => 'Gaya Surakarta & Yogyakarta',
                'default_scale' => 1.25,
                'available_poses' => ['default', 'perang', 'angkara'],
                'accent_color' => '#ef4444',
                'silhouette_svg' => 'rahwana',
                'status' => 'published',
            ],
        ];

        foreach ($charactersData as $cData) {
            Character::updateOrCreate(['slug' => $cData['slug']], $cData);
        }

        // 2. SEED LAKON CERITA & SUMBER ATRIBUSI
        $storiesData = [
            [
                'id' => 1,
                'slug' => 'gugurnya-ghatotkaca',
                'title' => 'Bharatayuddha: Gugurnya Ghatotkaca',
                'synopsis' => 'Pertempuran malam hari yang dramatis di Kurusetra. Demi melindungi pamannya, Arjuna, dari panah pusaka sakti Kunta Wijayandanu milik Adipati Karna, Raden Gatotkaca membumbung tinggi menyusup ke balik awan untuk memecah perhatian pasukan Kurawa sebelum takdir menjemputnya sebagai pahlawan bangsa.',
                'philosophy' => 'Pengorbanan suci seorang generasi muda yang memilih gugur demi keberlangsungan perjuangan yang lebih besar. Kematian fisik bukanlah kekalahan jika kehormatan dan keselamatan sesama berhasil dijaga.',
                'tradition' => 'Gaya Surakarta & Yogyakarta (Gagrag Mataram)',
                'version_label' => 'Serat Bharatayuddha - Pupuh Salya-Karna',
                'recommended_background' => 'kelir-kurusetra-perang',
                'theme_song' => 'Gamelan Srepeg Mataram',
                'character_slugs' => ['gatotkaca', 'karna', 'arjuna'],
                'sources' => [
                    [
                        'title' => 'Kakawin Bharatayuddha',
                        'author_or_publisher' => 'Mpu Sedah & Mpu Panuluh (abad ke-12 Masehi)',
                        'url_or_reference' => 'Balai Pustaka / Reksa Pustaka Mangkunegaran',
                        'rights_note' => 'Warisan Budaya Nusantara / Domain Publik',
                    ],
                    [
                        'title' => 'Naskah Lakon Wayang Kulit Purwa Ki Manteb Soedharsono',
                        'author_or_publisher' => 'Ki Manteb Soedharsono (1998)',
                        'url_or_reference' => 'Dokumentasi Sanggar Seni Surakarta',
                        'rights_note' => 'Arsip Kurasi Pedalangan',
                    ],
                ],
            ],
            [
                'id' => 2,
                'slug' => 'dewa-ruci',
                'title' => 'Dewa Ruci: Samudra Hakikat Kehidupan',
                'synopsis' => 'Perjalanan spiritual Raden Werkudara (Bima) atas perintah gurunya Resi Durna untuk mencari Air Kehidupan (Tirta Perwitasari). Setelah menjelajahi hutan belantara dan menyelami samudra raya, Bima justru bertemu sosok kerdil yang persis dirinya bernama Dewa Ruci yang mengajarkannya rahasia hakikat manusia dan ketuhanan.',
                'philosophy' => 'Pencarian jati diri manusia (manunggaling kawula Gusti), ketulusan ketaatan seorang murid, keberanian menaklukkan ego pribadi, dan penemuan kedamaian batin hakiki.',
                'tradition' => 'Gaya Surakarta & Pesisiran',
                'version_label' => 'Serat Dewa Ruci Pakem Yasadipura I',
                'recommended_background' => 'kelir-malam-mistik',
                'theme_song' => 'Gamelan Ayak-ayak Slendro',
                'character_slugs' => ['bima', 'semar'],
                'sources' => [
                    [
                        'title' => 'Serat Dewa Ruci',
                        'author_or_publisher' => 'Raden Ngabehi Yasadipura I (Kasunanan Surakarta)',
                        'url_or_reference' => 'Koleksi Museum Radyapustaka Surakarta',
                        'rights_note' => 'Domain Publik',
                    ],
                ],
            ],
            [
                'id' => 3,
                'slug' => 'shinta-obong',
                'title' => 'Ramayana: Kesucian Api Shinta Obong',
                'synopsis' => 'Setelah prabu Rahwana berhasil dikalahkan oleh Sri Rama dibantu laskar kera Hanoman, Dewi Shinta dijemput kembali. Untuk membuktikan kesucian hatinya setelah bertahun-tahun ditawan di negeri Alengka, Shinta menceburkan diri ke dalam kobaran api unggun suci yang justru melindunginya karena ketulusan baktinya.',
                'philosophy' => 'Keteguhan iman dan integritas moral wanita dalam menghadapi fitnah dan praduga. Api suci melambangkan pembersihan batin dan kebenaran sejati yang tak akan pernah lekang oleh celaan.',
                'tradition' => 'Gaya Surakarta, Yogyakarta & Bali',
                'version_label' => 'Kakawin Ramayana Bab Uttarakanda',
                'recommended_background' => 'kelir-kurusetra-perang',
                'theme_song' => 'Gamelan Sampak Alengka',
                'character_slugs' => ['rahwana'],
                'sources' => [
                    [
                        'title' => 'Serat Rama Kawi Purwa',
                        'author_or_publisher' => 'Yasadipura II (Keraton Surakarta)',
                        'url_or_reference' => 'Arsip Naskah Sastra Jawa Surakarta',
                        'rights_note' => 'Domain Publik Budaya Nusantara',
                    ],
                ],
            ],
        ];

        foreach ($storiesData as $sItem) {
            $story = Story::updateOrCreate(
                ['slug' => $sItem['slug']],
                [
                    'title' => $sItem['title'],
                    'synopsis' => $sItem['synopsis'],
                    'philosophy' => $sItem['philosophy'],
                    'tradition' => $sItem['tradition'],
                    'version_label' => $sItem['version_label'],
                    'recommended_background' => $sItem['recommended_background'],
                    'theme_song' => $sItem['theme_song'],
                    'status' => 'published',
                ]
            );

            // Hubungkan karakter ke cerita
            $charIds = Character::whereIn('slug', $sItem['character_slugs'])->pluck('id');
            $story->characters()->sync($charIds);

            // Buat sumber rujukan naskah
            foreach ($sItem['sources'] as $src) {
                Source::updateOrCreate(
                    [
                        'story_id' => $story->id,
                        'title' => $src['title'],
                    ],
                    $src
                );
            }
        }

        // 3. SEED TATA SUARA / AUDIO ASSETS
        $audioData = [
            [
                'id' => 1,
                'title' => 'Gamelan Srepeg Mataram',
                'category' => 'bgm',
                'instrument' => 'Kendang Ciblon, Bonang, Gender, Gong & Saron',
                'tempo' => 'Cepat & Heroik',
                'mood' => 'Pertempuran / Perang Tanding / Ketegangan',
                'description' => 'Irama dinamis penuh semangat khas pertunjukan wayang saat adegan peperangan antar kesatria.',
                'source_note' => 'Rekaman Studio Karawitan Tradisi',
                'license_note' => 'CC-BY 4.0 Creative Commons Budaya',
                'duration' => 120,
                'synth_type' => 'srepeg',
                'status' => 'active',
            ],
            [
                'id' => 2,
                'title' => 'Gamelan Ayak-ayak Slendro',
                'category' => 'bgm',
                'instrument' => 'Gender Barung, Gambang, Rebab & Kethuk',
                'tempo' => 'Lambat, Syahdu, Mengalun',
                'mood' => 'Kedamaian / Dialog Filosofis / Pertapaan',
                'description' => 'Melodi lembut gamelan laras Slendro yang menenangkan, biasa dibunyikan saat jejer dialog bijak para pamong dan begawan.',
                'source_note' => 'Arsip Sanggar Karawitan Pura Mangkunegaran',
                'license_note' => 'Domain Publik Budaya Nusantara',
                'duration' => 180,
                'synth_type' => 'ayak_ayak',
                'status' => 'active',
            ],
            [
                'id' => 3,
                'title' => 'Gamelan Sampak Alengka',
                'category' => 'bgm',
                'instrument' => 'Kendang Ageng, Kenong, Kepyak & Kempul',
                'tempo' => 'Sangat Cepat & Bergetar',
                'mood' => 'Kekacauan / Amarah / Pasukan Raksasa',
                'description' => 'Pukulan bertubi-tubi dengan ketukan ritmis menegangkan menggambarkan kegentingan situasi negara.',
                'source_note' => 'Kurasi Tim Seni Pedalangan',
                'license_note' => 'CC-BY-NC 4.0 Edukasi',
                'duration' => 95,
                'synth_type' => 'sampak',
                'status' => 'active',
            ],
            [
                'id' => 4,
                'title' => 'Dodogan Kotak Kayu Dalang',
                'category' => 'sfx',
                'instrument' => 'Cempala Kayu & Kotak Wayang Jati',
                'tempo' => 'Aksen Tunggal / Hentakan',
                'mood' => 'Aksentuasi / Isyarat Komando',
                'description' => 'Ketukan kayu keras cempala dalang ke dinding kotak wayang untuk menandai perubahan gerak dan tanda vokal dalang.',
                'source_note' => 'Efek Suara Asli Pedalangan',
                'license_note' => 'Royalty Free Budaya',
                'duration' => 1,
                'synth_type' => 'dodogan',
                'status' => 'active',
            ],
            [
                'id' => 5,
                'title' => 'Kepyak Logam Dalang',
                'category' => 'sfx',
                'instrument' => 'Lempengan Logam Kuningan & Cempala Kaki',
                'tempo' => 'Gemerincing Tajam',
                'mood' => 'Aksentuasi Sabetan / Ketukan Kaki',
                'description' => 'Bunyi gemerincing lempeng perunggu/kuningan yang dijepit di jari kaki dalang untuk mengiringi sabetan gerak cepat wayang.',
                'source_note' => 'Rekaman Pedalangan Klasik',
                'license_note' => 'Royalty Free Budaya',
                'duration' => 1,
                'synth_type' => 'kepyak',
                'status' => 'active',
            ],
            [
                'id' => 6,
                'title' => 'Gong Ageng Pamungkas',
                'category' => 'sfx',
                'instrument' => 'Gong Ageng Perunggu Pelog/Slendro',
                'tempo' => 'Dengung Dalam & Panjang',
                'mood' => 'Penyelesaian / Momen Sakral / Klimaks',
                'description' => 'Dentuman rendah menggelegar dari gong terbesar yang menandai penutupan siklus gending atau adegan puncak.',
                'source_note' => 'Arsip Karawitan Keraton Surakarta',
                'license_note' => 'Domain Publik Budaya Nusantara',
                'duration' => 4,
                'synth_type' => 'gong',
                'status' => 'active',
            ],
        ];

        foreach ($audioData as $aItem) {
            AudioAsset::updateOrCreate(['title' => $aItem['title']], $aItem);
        }

        // 4. SEED DEMO KARYA PERTUNJUKAN PUBLIK (CONNECTED ARCHIVE)
        $defaultUser = User::first();
        if ($defaultUser) {
            $defaultStory = Story::where('slug', 'gugurnya-ghatotkaca')->first();

            $sceneDataDemo = [
                'schemaVersion' => 1,
                'scenes' => [
                    [
                        'id' => 'scene-demo-1',
                        'title' => 'Panggilan Bhakti Senopati',
                        'background' => 'kelir-kurusetra-perang',
                        'durationMs' => 6000,
                        'audioAssetIds' => [1],
                        'characters' => [
                            [
                                'characterId' => 1,
                                'name' => 'Raden Gatotkaca',
                                'x' => 0.28,
                                'y' => 0.68,
                                'scale' => 1.0,
                                'pose' => 'default',
                                'facing' => 'right',
                                'dialogue' => 'Duh Rama Paduka, kulo sumadya ngurbanaken jiwa raga kangge Pandawa!',
                            ],
                            [
                                'characterId' => 3,
                                'name' => 'Adipati Karna',
                                'x' => 0.74,
                                'y' => 0.68,
                                'scale' => 1.0,
                                'pose' => 'perang',
                                'facing' => 'left',
                                'dialogue' => 'Majua Gatotkaca, pusaka Kunta Wijayandanu wus cumawis ing gandewa!',
                            ],
                        ],
                    ],
                    [
                        'id' => 'scene-demo-2',
                        'title' => 'Laga Angkasa Kurusetra',
                        'background' => 'kelir-malam-mistik',
                        'durationMs' => 5000,
                        'audioAssetIds' => [1],
                        'characters' => [
                            [
                                'characterId' => 1,
                                'name' => 'Raden Gatotkaca',
                                'x' => 0.35,
                                'y' => 0.40,
                                'scale' => 1.05,
                                'pose' => 'terbang',
                                'facing' => 'right',
                                'dialogue' => 'Otot kawat balung wesi, sumpah kesatria ora bakal luntur!',
                            ],
                            [
                                'characterId' => 2,
                                'name' => 'Raden Arjuna',
                                'x' => 0.15,
                                'y' => 0.68,
                                'scale' => 0.95,
                                'pose' => 'sembah',
                                'facing' => 'right',
                                'dialogue' => 'Kulup Gatotkaca, kencengna tekadmu demi tegake kebenaran!',
                            ],
                        ],
                    ],
                ],
            ];

            $demoPerf = Performance::updateOrCreate(
                ['title' => 'Gugurnya Sang Senopati Udara'],
                [
                    'user_id' => $defaultUser->id,
                    'story_id' => $defaultStory?->id,
                    'description' => 'Interpretasi kisah kepahlawanan Raden Gatotkaca di medan laga Kurusetra dalam membela keadilan.',
                    'visibility' => 'public',
                    'author' => 'Dalang Inovasi Lomba',
                    'scene_data' => $sceneDataDemo,
                    'schema_version' => 1,
                ]
            );

            // Hubungkan pivot karakter & audio
            $demoPerf->characters()->sync([1, 2, 3]);
            $demoPerf->audioAssets()->sync([1]);
        }
    }
}
