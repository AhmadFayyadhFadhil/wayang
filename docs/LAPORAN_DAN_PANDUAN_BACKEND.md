# 🎭 LAPORAN PENGEMBANGAN FRONTEND & PANDUAN EKSEKUSI BACKEND
## Wayangverse MVP 1.0 — Platform Digital Pelestarian Seni Wayang
*Versi Dokumen: 1.0 | Tanggal: 12 Oktober 2026 | Penulis: Frontend Lead Developer*

---

## 📌 DAFTAR ISI
1. [Laporan Hasil Pengembangan Frontend](#1-laporan-hasil-pengembangan-frontend)
   - [Ringkasan Eksekutif](#ringkasan-eksekutif)
   - [Matriks Pemenuhan Kebutuhan (PRD & SRS)](#matriks-pemenuhan-kebutuhan-prd--srs)
   - [Arsitektur & Keunggulan Teknis Frontend](#arsitektur--keunggulan-teknis-frontend)
   - [Hasil Validasi & Jaminan Kualitas](#hasil-validasi--jaminan-kualitas)
   - [Status Repositori & Git Branching](#status-repositori--git-branching)
2. [Panduan Teknis Eksekusi Backend (Laravel 11)](#2-panduan-teknis-eksekusi-backend-laravel-11)
   - [Tahap 1: Setup Lingkungan & Database MySQL](#tahap-1-setup-lingkungan--database-mysql)
   - [Tahap 2: Skema & Urutan Migrasi Database](#tahap-2-skema--urutan-migrasi-database)
   - [Tahap 3: Model Eloquent & Relasi Database](#tahap-3-model-eloquent--relasi-database)
   - [Tahap 4: Seeder Master Data Awal](#tahap-4-seeder-master-data-awal)
   - [Tahap 5: Implementasi Controller & Endpoint REST API](#tahap-5-implementasi-controller--endpoint-rest-api)
   - [Tahap 6: Kontrak API & Validasi JSON scene_data](#tahap-6-kontrak-api--validasi-json-scene_data)
   - [Tahap 7: Checklist Pengujian Integrasi](#tahap-7-checklist-pengujian-integrasi)

---

# 1. LAPORAN HASIL PENGEMBANGAN FRONTEND

### Ringkasan Eksekutif
Pengembangan antarmuka pengguna (Frontend) untuk **Wayangverse MVP 1.0** telah diselesaikan **100%**. Frontend dibangun menggunakan arsitektur modern **React 19 + Vite** dengan pendekatan **Offline-First**, **Fail-Soft Web Audio Synthesis**, dan **Normalized Coordinates (0.0 – 1.0)** untuk tata letak panggung SVG.

Platform dapat langsung dijalankan dan didemokan di hadapan juri/pengguna meskipun backend server belum sepenuhnya terhubung ke basis data, berkat sistem fallback persistensi lokal yang tangguh.

---

### Matriks Pemenuhan Kebutuhan (PRD & SRS)

| Kode Kebutuhan | Nama Fitur / Modul | File Komponen Utama | Status | Deskripsi Implementasi |
| :--- | :--- | :--- | :---: | :--- |
| **FR-01** | Landing & Hero Interaktif | `src/features/home/HomeView.jsx` | ✅ Selesai | Desain *Dark Mystical Heritage* (`#0c0a10` & aksen emas `#f59e0b`), tipografi Plus Jakarta Sans, CTA langsung ke panggung & atlas. |
| **FR-02** | Master Cerita & Sumber Pakem | `src/features/encyclopedia/AtlasView.jsx` | ✅ Selesai | Katalog lakon wiracarita lengkap dengan sinopsis, filosofi, gaya gagrag tradisi, dan atribusi naskah rujukan budaya. |
| **FR-03** | Master Karakter Wayang | `src/components/stage/WayangFigureSvg.jsx` | ✅ Selesai | 6 tokoh wayang kulit vektor SVG presisi: Gatotkaca, Arjuna, Karna, Bima, Semar, Rahwana lengkap dengan uji variasi pose interaktif. |
| **FR-04** | Virtual Kelir Canvas (2D) | `src/features/stage/VirtualStageCanvas.jsx` | ✅ Selesai | Kanvas 16:9, tata cahaya lampu minyak Blencong dinamis, drag-and-drop pointer dengan koordinat normalisasi (0.0 - 1.0). |
| **FR-05** | Timeline & Scene Composer | `src/features/stage/SceneComposer.jsx` | ✅ Selesai | Penyusunan multi-adegan (tambah, duplikasi, hapus, reorder), durasi transisi (ms), ganti latar kelir, dialog balon per tokoh. |
| **FR-06** | Soundscape & SFX Dalang | `src/services/soundscape.js` | ✅ Selesai | Synthesizer audio real-time Web Audio API: Dodogan kayu, Kepyak logam, Gong ageng, serta tangga nada pentatonis Slendro & Pelog (100% bebas error 404). |
| **FR-07** | Simpan & Duplikasi Karya | `src/features/stage/SavePerformanceModal.jsx` | ✅ Selesai | Simpan karya dengan metadata (judul, deskripsi, visibilitas publik/privat), duplikasi karya (PR-06), ekspor/impor JSON cadangan. |
| **FR-08** | Client-Side Preview Engine | `src/features/stage/StagePreviewModal.jsx` | ✅ Selesai | Mode teater layar penuh, auto-advance scene sesuai durasi, sinkronisasi soundscape, dan animasi confetti apresiasi penonton. |
| **FR-15** | Connected Archive (Galeri) | `src/features/story/ConnectedArchiveView.jsx` | ✅ Selesai | Galeri publik karya pengguna, filter cerita, pemutaran langsung karya, dan banner atribusi *"Interpretasi Kreatif Pengguna"*. |
| **NFR-06**| Aksesibilitas Pengendalian | `src/features/stage/VirtualStageCanvas.jsx` | ✅ Selesai | Navigasi posisi karakter panggung menggunakan tombol panah keyboard (`ArrowLeft/Right/Up/Down`) dan D-Pad visual di layar. |

---

### Arsitektur & Keunggulan Teknis Frontend

1. **Vektor SVG Dinamis Tanpa Dependensi Berat**:
   Karakter wayang digambar langsung via SVG terstruktur, memungkinkan rotasi, flipping hadap kiri/kanan, penyesuaian skala, serta perubahan pose (default, sembah, perang, terbang) dengan performa render 60 FPS.
2. **Synthesizer Gamelan Prosedural (Web Audio API)**:
   Menghindari kegagalan aset audio eksternal saat koneksi lambat. Frekuensi harmonik gong, ketukan dodogan, dan kepyak disintesis langsung melalui osilator dan modulasi kurva eksponensial browser.
3. **Penyimpanan Bertingkat (Dual-Layer Persistence)**:
   File `src/services/persistenceService.js` mengelola fallback otomatis: mencoba request ke backend Laravel `/api/performances`, dan jika server offline/belum termigrasi, data disimpan aman ke `localStorage` sehingga user flow tidak pernah terputus.

---

### Hasil Validasi & Jaminan Kualitas
- **Linter (`npm run lint`)**: **0 Error, 0 Warning**. Seluruh import, hook dependency, dan variabel bersih.
- **Production Build (`npm run build`)**: Bundel tersusun sukses dan siap untuk deployment statis (Vercel / Netlify / Nginx).
- **Daemon Dev Server**: Aktif berjalan di port `http://localhost:5173/`.

---

### Status Repositori & Git Branching
- **Branch Aktif**: `feat/frontend-mvp`
- **Branch Utama (`main`)**: Aman dan tidak tersentuh (terhindar dari merge conflict).
- **Commit Terakhir**: `8adb713` (*feat(frontend): implement core wayangverse frontend MVP, 2D SVG stage, soundscape and backend guide*).
- **Remote Push**: Berhasil ter-push 100% ke GitHub remote (`refs/heads/feat/frontend-mvp`).
- **Tautan Pull Request**: [https://github.com/AhmadFayyadhFadhil/wayang/pull/new/feat/frontend-mvp](https://github.com/AhmadFayyadhFadhil/wayang/pull/new/feat/frontend-mvp)

---

# 2. PANDUAN TEKNIS EKSEKUSI BACKEND (LARAVEL 11)

Panduan ini disusun untuk developer yang akan melanjutkan pengerjaan modul backend di direktori `be/`.

---

### Tahap 1: Setup Lingkungan & Database MySQL

1. **Jalankan MySQL**:
   Nyalakan service MySQL lokal (misal: aktifkan modul MySQL pada XAMPP Control Panel).
2. **Buat Database**:
   ```sql
   CREATE DATABASE wayangverse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. **Konfigurasi `.env` Backend**:
   Pastikan file `be/.env` memiliki pengaturan berikut:
   ```ini
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=wayangverse
   DB_USERNAME=root
   DB_PASSWORD=
   ```

---

### Tahap 2: Skema & Urutan Migrasi Database

Jalankan pembuatan file migrasi dengan urutan dependensi foreign key berikut:

#### 1. Migrasi Master Cerita (`stories`)
```php
Schema::create('stories', function (Blueprint $table) {
    $table->id();
    $table->string('slug')->unique();
    $table->string('title');
    $table->text('synopsis');
    $table->text('philosophy');
    $table->string('tradition')->default('Gaya Surakarta');
    $table->string('version_label')->default('Pakem Gagrag Mataram');
    $table->string('cover_image')->nullable();
    $table->enum('status', ['draft', 'published', 'archived'])->default('published');
    $table->timestamps();
});
```

#### 2. Migrasi Master Karakter Wayang (`characters`)
```php
Schema::create('characters', function (Blueprint $table) {
    $table->id();
    $table->string('slug')->unique();
    $table->string('name');
    $table->string('alias')->nullable();
    $table->enum('type', ['ksatria', 'raksasa', 'punakawan', 'dewa', 'wanita', 'lainnya'])->default('ksatria');
    $table->text('description');
    $table->text('philosophy');
    $table->string('image_path');
    $table->decimal('default_scale', 3, 2)->default(1.00);
    $table->json('available_poses');
    $table->enum('status', ['draft', 'published', 'archived'])->default('published');
    $table->timestamps();
});
```

#### 3. Migrasi Pivot Cerita & Karakter (`story_character`)
```php
Schema::create('story_character', function (Blueprint $table) {
    $table->id();
    $table->foreignId('story_id')->constrained('stories')->cascadeOnDelete();
    $table->foreignId('character_id')->constrained('characters')->cascadeOnDelete();
    $table->string('role_note')->nullable();
    $table->unique(['story_id', 'character_id']);
});
```

#### 4. Migrasi Sumber Rujukan Budaya (`sources`)
```php
Schema::create('sources', function (Blueprint $table) {
    $table->id();
    $table->foreignId('story_id')->nullable()->constrained('stories')->cascadeOnDelete();
    $table->string('title');
    $table->string('author_or_publisher');
    $table->string('url_or_reference', 500)->nullable();
    $table->string('rights_note')->default('Domain Publik / Kurasi Budaya');
    $table->timestamps();
});
```

#### 5. Migrasi Master Audio Asset (`audio_assets`)
```php
Schema::create('audio_assets', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->enum('category', ['bgm', 'sfx', 'suluk'])->default('bgm');
    $table->string('instrument');
    $table->string('file_path');
    $table->integer('duration')->default(0);
    $table->string('source_note');
    $table->string('license_note')->default('CC-BY 4.0');
    $table->enum('status', ['active', 'inactive'])->default('active');
    $table->timestamps();
});
```

#### 6. Migrasi Tabel Karya Pertunjukan (`performances`)
```php
Schema::create('performances', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->foreignId('story_id')->nullable()->constrained('stories')->nullOnDelete();
    $table->string('title');
    $table->text('description')->nullable();
    $table->enum('visibility', ['public', 'private'])->default('public');
    $table->json('scene_data'); // Menyimpan array scenes, karakter, dialog, durasi
    $table->timestamps();
});
```

#### 7. Migrasi Pivot Denormalisasi (`performance_character` & `performance_audio`)
```php
Schema::create('performance_character', function (Blueprint $table) {
    $table->id();
    $table->foreignId('performance_id')->constrained('performances')->cascadeOnDelete();
    $table->foreignId('character_id')->constrained('characters')->cascadeOnDelete();
    $table->unique(['performance_id', 'character_id']);
});

Schema::create('performance_audio', function (Blueprint $table) {
    $table->id();
    $table->foreignId('performance_id')->constrained('performances')->cascadeOnDelete();
    $table->foreignId('audio_asset_id')->constrained('audio_assets')->cascadeOnDelete();
    $table->unique(['performance_id', 'audio_asset_id']);
});
```

---

### Tahap 3: Model Eloquent & Relasi Database

Buat Model Eloquent pada `app/Models/`:

1. **`Story.php`**:
   - `hasMany(Source::class)`
   - `belongsToMany(Character::class, 'story_character')`
   - `hasMany(Performance::class)`
2. **`Character.php`**:
   - `casts = ['available_poses' => 'array']`
   - `belongsToMany(Story::class, 'story_character')`
   - `belongsToMany(Performance::class, 'performance_character')`
3. **`Performance.php`**:
   ```php
   protected $fillable = ['user_id', 'story_id', 'title', 'description', 'visibility', 'scene_data'];
   protected $casts = ['scene_data' => 'array'];

   public function user() { return $this->belongsTo(User::class); }
   public function story() { return $this->belongsTo(Story::class); }
   public function characters() { return $this->belongsToMany(Character::class, 'performance_character'); }
   public function audioAssets() { return $this->belongsToMany(AudioAsset::class, 'performance_audio'); }
   ```

---

### Tahap 4: Seeder Master Data Awal

Buat seeder: `php artisan make:seeder MasterDataSeeder`.
Gunakan data yang telah disiapkan di Frontend (`fe/src/data/master/`):

- **Tokoh Wayang**:
  1. `gatotkaca` (Raden Gatotkaca - Ksatria Pringgandani)
  2. `arjuna` (Raden Arjuna - Panengah Pandawa)
  3. `karna` (Adipati Karna - Senopati Awangga)
  4. `bima` (Raden Werkudara / Bima)
  5. `semar` (Kyai Lurah Semar Badranaya)
  6. `rahwana` (Prabu Dasamuka / Rahwana)
- **Lakon Cerita**:
  1. `gugurnya-ghatotkaca` (*Bharatayuddha: Gugurnya Ghatotkaca*)
  2. `karna-gugur` (*Bharatayuddha: Karna Tanding*)
  3. `shinta-obong` (*Ramayana: Shinta Obong*)

Eksekusi dengan perintah:
```bash
php artisan db:seed --class=MasterDataSeeder
```

---

### Tahap 5: Implementasi Controller & Endpoint REST API

Daftarkan route berikut pada `routes/api.php`:

```php
use App\Http\Controllers\Api\StoryController;
use App\Http\Controllers\Api\CharacterController;
use App\Http\Controllers\Api\AudioAssetController;
use App\Http\Controllers\Api\PerformanceController;
use App\Http\Controllers\Api\PublicArchiveController;

// Master Data Publik
Route::get('/stories', [StoryController::class, 'index']);
Route::get('/stories/{slug}', [StoryController::class, 'show']);
Route::get('/characters', [CharacterController::class, 'index']);
Route::get('/characters/{slug}', [CharacterController::class, 'show']);
Route::get('/audio-assets', [AudioAssetController::class, 'index']);

// Arsip Terbuka Publik (Connected Archive)
Route::get('/public/performances', [PublicArchiveController::class, 'index']);
Route::get('/public/performances/{id}', [PublicArchiveController::class, 'show']);

// Manajemen Karya Pengguna (Wajib Login Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/performances', [PerformanceController::class, 'index']);
    Route::post('/performances', [PerformanceController::class, 'store']);
    Route::get('/performances/{id}', [PerformanceController::class, 'show']);
    Route::patch('/performances/{id}', [PerformanceController::class, 'update']);
    Route::delete('/performances/{id}', [PerformanceController::class, 'destroy']);
});
```

---

### Tahap 6: Kontrak API & Validasi JSON `scene_data`

Saat menyimpan karya baru di `PerformanceController@store`, terapkan transaksi basis data atomik (`DB::transaction`) untuk menyimpan data utama sekaligus mengisi pivot:

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'story_id' => 'nullable|exists:stories,id',
        'visibility' => 'required|in:public,private',
        'scene_data' => 'required|array',
        'scene_data.schemaVersion' => 'required|integer|in:1',
        'scene_data.scenes' => 'required|array|min:1',
    ]);

    return DB::transaction(function () use ($validated, $request) {
        $performance = Performance::create([
            'user_id' => $request->user()->id,
            'story_id' => $validated['story_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'visibility' => $validated['visibility'],
            'scene_data' => $validated['scene_data'],
        ]);

        // Ekstraksi character_ids dari JSON scene_data
        $characterIds = collect($validated['scene_data']['scenes'])
            ->flatMap(fn($scene) => collect($scene['characters'] ?? [])->pluck('characterId'))
            ->filter()
            ->unique();
        $performance->characters()->sync($characterIds);

        // Ekstraksi audioAssetIds dari JSON scene_data
        $audioIds = collect($validated['scene_data']['scenes'])
            ->flatMap(fn($scene) => collect($scene['audioAssetIds'] ?? []))
            ->filter()
            ->unique();
        $performance->audioAssets()->sync($audioIds);

        return response()->json([
            'success' => true,
            'message' => 'Pertunjukan berhasil disimpan',
            'data' => $performance->load(['characters', 'audioAssets', 'story'])
        ], 201);
    });
}
```

---

### Tahap 7: Checklist Pengujian Integrasi

1. [ ] Jalankan `php artisan migrate:fresh --seed` tanpa pesan error.
2. [ ] Akses `http://127.0.0.1:8000/api/status` pastikan status database `connected: true`.
3. [ ] Uji endpoint `GET /api/characters` dan pastikan data 6 tokoh wayang tampil.
4. [ ] Buka antarmuka frontend di `http://localhost:5173/`, buka panggung virtual, buat adegan, dan simpan pertunjukan.
5. [ ] Cek database tabel `performances` dan pivot `performance_character` apakah data tersimpan otomatis.
