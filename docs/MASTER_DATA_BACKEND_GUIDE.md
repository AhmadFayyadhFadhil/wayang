# 📜 Panduan Master Data & Skema Backend (Untuk Tim Backend)
### Wayangverse MVP — Dokumen Sinkronisasi Tim Frontend & Backend
*Versi: 1.0 | Tanggal: 12 Oktober 2026*

Dokumen ini disusun oleh tim Frontend sebagai acuan bagi tim Backend dalam membuat Migration, Model Eloquent, Seeder data awal, dan Endpoint REST API agar sinkron dengan kebutuhan antarmuka pengguna.

---

## 1. Daftar Entitas Master Data

### A. Master Cerita (`stories`)
Menyimpan lakon/wiracarita terkurasi untuk katalog *Story Atlas* dan dropdown cerita rujukan di panggung.
* **Tabel:** `stories`
* **Kolom:**
  * `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY (atau UUID)
  * `slug`: VARCHAR(255) UNIQUE NOT NULL (cth: `gugurnya-ghatotkaca`)
  * `title`: VARCHAR(255) NOT NULL (cth: `Bharatayuddha: Gugurnya Ghatotkaca`)
  * `synopsis`: TEXT NOT NULL (ringkasan alur cerita)
  * `philosophy`: TEXT NOT NULL (nilai moral & filosofis lakon)
  * `tradition`: VARCHAR(100) NOT NULL (cth: `Gaya Surakarta`, `Gaya Yogyakarta`)
  * `version_label`: VARCHAR(100) NOT NULL (cth: `Pakem Gagrag Mataram`)
  * `cover_image`: VARCHAR(255) NULL (URL gambar sampul)
  * `status`: ENUM('draft', 'published', 'archived') DEFAULT 'published'
  * `created_at`, `updated_at`: TIMESTAMP

### B. Master Karakter Wayang (`characters`)
Menyimpan tokoh wayang, filosofi watak, dan referensi aset siluet SVG/vektor.
* **Tabel:** `characters`
* **Kolom:**
  * `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  * `slug`: VARCHAR(255) UNIQUE NOT NULL (cth: `gatotkaca`)
  * `name`: VARCHAR(255) NOT NULL (cth: `Raden Gatotkaca`)
  * `alias`: VARCHAR(255) NULL (cth: `Satria Pringgandani, Senopati Udara`)
  * `type`: ENUM('ksatria', 'raksasa', 'punakawan', 'dewa', 'wanita', 'lainnya') DEFAULT 'ksatria'
  * `description`: TEXT NOT NULL (watak dan karakteristik)
  * `philosophy`: TEXT NOT NULL (makna filosofis tokoh bagi kehidupan)
  * `image_path`: VARCHAR(255) NOT NULL (path SVG/PNG, cth: `/images/characters/gatotkaca.svg`)
  * `default_scale`: DECIMAL(3, 2) DEFAULT 1.00
  * `available_poses`: JSON NOT NULL (cth: `["default", "sembah", "perang", "terbang"]`)
  * `status`: ENUM('draft', 'published', 'archived') DEFAULT 'published'
  * `created_at`, `updated_at`: TIMESTAMP

### C. Pivot Cerita & Karakter (`story_character`)
Relasi many-to-many antar cerita dan tokoh yang terlibat.
* **Tabel:** `story_character`
* **Kolom:**
  * `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  * `story_id`: FOREIGN KEY -> `stories.id` ON DELETE CASCADE
  * `character_id`: FOREIGN KEY -> `characters.id` ON DELETE CASCADE
  * `role_note`: VARCHAR(255) NULL (cth: `Tokoh Utama / Senopati`)
  * UNIQUE(`story_id`, `character_id`)

### D. Master Sumber Rujukan & Atribusi (`sources`)
Memastikan integritas budaya (*Cultural Integrity & Provenance*).
* **Tabel:** `sources`
* **Kolom:**
  * `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  * `story_id`: FOREIGN KEY -> `stories.id` ON DELETE CASCADE (nullable)
  * `title`: VARCHAR(255) NOT NULL (cth: `Kakawin Bharatayuddha - Pupuh XLV`)
  * `author_or_publisher`: VARCHAR(255) NOT NULL (cth: `Mpu Sedah & Mpu Panuluh / Balai Pustaka`)
  * `url_or_reference`: VARCHAR(500) NULL
  * `rights_note`: VARCHAR(255) DEFAULT 'Domain Publik / Kurasi Budaya'
  * `created_at`, `updated_at`: TIMESTAMP

### E. Master Tata Suara / Gamelan (`audio_assets`)
Menyimpan soundscape gamelan, suluk, dan SFX dalang.
* **Tabel:** `audio_assets`
* **Kolom:**
  * `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  * `title`: VARCHAR(255) NOT NULL (cth: `Gamelan Srepeg Mataram`)
  * `category`: ENUM('bgm', 'sfx', 'suluk') DEFAULT 'bgm'
  * `instrument`: VARCHAR(100) NOT NULL (cth: `Kendang, Gender, Gong & Saron`)
  * `file_path`: VARCHAR(255) NOT NULL (path file audio mp3/ogg)
  * `duration`: INT DEFAULT 0 (dalam detik)
  * `source_note`: VARCHAR(255) NOT NULL
  * `license_note`: VARCHAR(255) NOT NULL (cth: `CC-BY 4.0 / Arsip Komunitas`)
  * `status`: ENUM('active', 'inactive') DEFAULT 'active'
  * `created_at`, `updated_at`: TIMESTAMP

### F. Master Latar Panggung / Kelir (`stage_backgrounds`)
Preset tema panggung 2D yang tersedia di studio panggung (HD 16:9 Otentik Nusantara):
* Nilai preset baku (disimpan di master data dan config):
  1. `kelir-naskah-prada-kencana` (Serat Kuno Prada Kencana — Default)
  2. `kelir-gunungan-batik-soga` (Hamparan Kelir & Sayap Kayon Batik Soga)
  3. `kelir-kayon-keraton-kencana` (Relief Kayu Jati Gebyok & Prada Kencana)
  4. `kelir-naskah-kuno-pustaka` (Kertas Pustaka Babad Serat Kuno)
  5. `kelir-teratai-prada-lumut` (Beludru Hijau Lumut & Teratai Suci)

---

## 2. Struktur Payload `scene_data` JSON (SRS Bab 6.1)

Setiap pertunjukan yang disimpan oleh user di tabel `performances` memiliki kolom `scene_data` bertipe `JSON` dengan skema versi 1:

```json
{
  "schemaVersion": 1,
  "scenes": [
    {
      "id": "scene-1",
      "title": "Perjumpaan di Kurusetra",
      "background": "kelir-naskah-prada-kencana",
      "durationMs": 6000,
      "audioAssetIds": [1],
      "characters": [
        {
          "characterId": 1,
          "name": "Raden Gatotkaca",
          "x": 0.25,
          "y": 0.65,
          "scale": 1.0,
          "pose": "default",
          "facing": "right",
          "dialogue": "Duh Rama Paduka, kulo sumadya ngurbanaken jiwa raga kangge Pandawa!"
        },
        {
          "characterId": 2,
          "name": "Adipati Karna",
          "x": 0.75,
          "y": 0.65,
          "scale": 1.0,
          "pose": "perang",
          "facing": "left",
          "dialogue": "Majua Gatotkaca, panah Kunta Wijayandanu wus cumawis ing gandewa!"
        }
      ]
    }
  ]
}
```

> **Catatan Penting untuk Backend:**
> 1. Koordinat `x` dan `y` dinormalisasi dalam rentang desimal `0.00` hingga `1.00`.
> 2. Backend harus memvalidasi `schemaVersion == 1` dan memvalidasi foreign keys `characterId` serta `audioAssetId` yang ada di dalam JSON.
> 3. Saat `performance` disimpan/diperbarui, Backend secara otomatis mengisi tabel pivot `performance_character` dan `performance_audio` melalui Database Transaction (`DB::transaction`).

---

## 3. Kontrak Endpoint REST API yang Diharapkan Frontend

| Method | Endpoint | Hak Akses | Kegunaan |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/stories` | Public | List cerita published |
| `GET` | `/api/stories/{slug}` | Public | Detail cerita + karakter terkait + sumber |
| `GET` | `/api/characters` | Public | List karakter wayang |
| `GET` | `/api/characters/{slug}` | Public | Detail profil karakter |
| `GET` | `/api/audio-assets` | Public | List aset audio / soundscape |
| `GET` | `/api/performances` | Authenticated | List karya milik user saat ini (My Works) |
| `POST` | `/api/performances` | Authenticated | Menyimpan karya baru |
| `GET` | `/api/performances/{id}` | Auth / Public | Membuka karya (validasi kepemilikan jika private) |
| `PATCH` | `/api/performances/{id}`| Owner Only | Memperbarui karya dan scene_data |
| `DELETE`| `/api/performances/{id}`| Owner Only | Menghapus karya |
| `GET` | `/api/public/performances` | Public | Galeri karya publik (Connected Archive) |

Dokumen ini menjadi pegangan bersama agar integrasi frontend dan backend berjalan mulus dan selaras dengan PRD & SRS.
