# WAYANGVERSE — Software Requirements Specification (SRS)

*SRS — Persyaratan fungsional, nonfungsional, data, API, dan pengujian*

**Versi 1.0** | 12 Oktober 2026 | Dokumen kerja untuk tim pengembang & AI Agent

---

## Kontrol Dokumen

| Item | Detail | Status Implementasi |
| :--- | :--- | :--- |
| **Produk** | Wayangverse | Baseline MVP |
| **Versi** | 1.0 — spesifikasi baseline MVP | Aktif |
| **Status** | Terkunci & Diimplementasikan | Terverifikasi |
| **Backend** | Laravel 12 | Terpasang di `/be` |
| **Frontend** | React + Vite | Terpasang di `/fe` |
| **Authentication** | Laravel Sanctum untuk first-party SPA (Cookie/Session) | Siap & Terkonfigurasi |
| **Database** | MySQL 8+ (`wayang` database) | Terkoneksi & Migrasi Lengkap |
| **Media** | Laravel filesystem; local storage untuk dev | Siap di `public/images` & `be/storage` |

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen
Dokumen ini mendefinisikan perilaku sistem yang dapat diuji untuk MVP Wayangverse. Dokumen menjadi acuan implementasi, pembagian tugas, pengujian, panduan AI agent, dan penilaian apakah sistem memenuhi kebutuhan produk.

### 1.2 Ruang Lingkup Sistem
Sistem menyediakan website untuk mengeksplorasi konten wayang terkurasi, membuat pertunjukan 2D, memilih audio, menyimpan konfigurasi adegan, mengelola karya milik pengguna, dan menampilkan karya publik yang terhubung ke metadata budaya.

### 1.3 Istilah

| Istilah | Definisi |
| :--- | :--- |
| **Scene** | Satu susunan karakter, posisi/pose, dialog, dan audio pada suatu adegan. |
| **Performance** | Proyek/pertunjukan yang terdiri dari metadata dan satu atau beberapa scene. |
| **Cultural entity** | Cerita, karakter, instrumen/audio, sumber, atau entitas budaya terkait. |
| **Original/source** | Informasi yang merepresentasikan cerita sumber berdasarkan rujukan yang dicatat. |
| **User interpretation** | Karya kreatif pengguna yang tidak diklaim sebagai versi tradisional. |
| **Public/Private** | Status visibilitas karya yang ditegakkan oleh backend. |

---

## 2. Gambaran Sistem

### 2.1 Arsitektur
* **React SPA** dibangun menggunakan Vite (`/fe`).
* **Laravel** menyediakan REST API, validasi, business logic, autentikasi, otorisasi, dan akses database (`/be`).
* **Laravel Sanctum** menangani autentikasi first-party SPA berbasis cookie/session; konfigurasi stateful domains, CORS, CSRF, HTTPS, dan cookie ditegakkan.
* **Database Relasional MySQL** menyimpan pengguna, cerita, karakter, sumber, audio metadata, pertunjukan, relasi adegan, dan status publikasi.
* **Media** disimpan di filesystem abstraction Laravel (`storage/app/public`); local untuk dev, object storage untuk production.
* Tidak diperlukan microservices atau WebSocket pada MVP.

### 2.2 Batas Sistem
* Sistem tidak mensimulasikan teknik dalang fisik secara lengkap.
* Sistem tidak membutuhkan kolaborasi real-time pada MVP.
* Sistem tidak menghasilkan interpretasi budaya otomatis melalui AI generatif tanpa kurasi.
* Sistem tidak memverifikasi kebenaran budaya secara otomatis; proses kurasi manusia tetap diperlukan.

---

## 3. Peran dan Hak Akses

| Peran | Hak Akses |
| :--- | :--- |
| **Guest** | Melihat cerita, karakter, audio yang dipublikasikan, dan karya publik. |
| **User** | Semua hak Guest; membuat/mengedit/menghapus karya milik sendiri; mengatur visibilitas karya sendiri. |
| **Admin/Curator** | Mengelola cerita, karakter, sumber, audio metadata, serta meninjau konten/karya sesuai kebijakan CMS. |

> *Semua pemeriksaan otorisasi harus dilakukan di server. Menyembunyikan tombol pada frontend bukan kontrol keamanan.*

---

## 4. Persyaratan Fungsional

| ID | Nama | Spesifikasi |
| :--- | :--- | :--- |
| **FR-01** | Daftar cerita | Sistem harus menampilkan daftar cerita yang berstatus published dengan judul, ringkasan, tradisi/versi, dan gambar jika tersedia. |
| **FR-02** | Detail cerita | Sistem harus menampilkan detail cerita, sumber, filosofi, karakter terkait, dan karya publik terkait jika tersedia. |
| **FR-03** | Daftar/detail karakter | Sistem harus menampilkan profil karakter dan relasi ke cerita; daftar hanya menampilkan konten yang dapat diakses. |
| **FR-04** | Daftar audio | Sistem harus menampilkan audio yang aktif/published, metadata instrumen, deskripsi, sumber, dan hak penggunaan yang tercatat. |
| **FR-05** | Autentikasi | Sistem harus menyediakan register/login/logout sesuai konfigurasi Sanctum; respons kesalahan tidak boleh membocorkan informasi sensitif. |
| **FR-06** | Buat performance | User terautentikasi dapat membuat proyek dengan judul, deskripsi opsional, cerita sumber opsional/terpilih, dan status awal private. |
| **FR-07** | Edit scene | Editor harus mendukung menambah/mengubah/menghapus/mengurutkan scene dan mengubah data karakter, posisi, pose, dialog, serta referensi audio. |
| **FR-08** | Preview | UI harus merender konfigurasi scene yang sedang diedit tanpa perlu menyimpan terlebih dahulu. |
| **FR-09** | Simpan performance | Sistem harus memvalidasi dan menyimpan metadata serta scene data; respons memuat ID dan waktu pembaruan. |
| **FR-10** | Buka performance | User dapat memuat kembali proyek miliknya dengan struktur adegan yang sama seperti saat disimpan. |
| **FR-11** | Perbarui performance | Hanya pemilik atau admin berwenang yang dapat mengubah proyek; update harus memvalidasi referensi budaya dan format scene. |
| **FR-12** | Hapus performance | Pemilik dapat menghapus proyek miliknya; sistem harus menerapkan strategi penghapusan yang konsisten pada scene/relasi dan file terkait. |
| **FR-13** | Atur visibilitas | Pemilik dapat mengatur private/public; akses publik harus ditegakkan oleh endpoint server. |
| **FR-14** | Halaman karya publik | Pengunjung dapat melihat karya public beserta atribusi, cerita sumber, karakter, dan audio terkait. |
| **FR-15** | Navigasi relasi | Pengguna dapat berpindah dari karya ke cerita, karakter, atau audio terkait melalui ID yang valid. |
| **FR-16** | Admin konten | Admin dapat membuat/memperbarui/mengarsipkan konten budaya dan mencatat sumber; endpoint harus dibatasi berdasarkan role. |
| **FR-17** | Penanganan error | Sistem menampilkan pesan yang dapat dipahami untuk validation error, sesi berakhir, media gagal dimuat, dan kegagalan server. |
| **FR-18** | Autosave optional | Autosave tidak wajib pada MVP; jika diterapkan, status saving/saved/error harus jelas dan konflik update harus ditangani. |

---

## 5. Persyaratan Nonfungsional

| ID | Kategori | Persyaratan |
| :--- | :--- | :--- |
| **NFR-01** | Performance | Pada lingkungan demo yang layak, endpoint daftar/detail normal menargetkan p95 < 800 ms tanpa menghitung unduhan media besar. |
| **NFR-02** | Responsiveness | Halaman konten dan editor harus diuji pada lebar 360 px, 768 px, dan desktop 1280 px atau lebih. |
| **NFR-03** | Security | Semua endpoint mutasi membutuhkan autentikasi; otorisasi kepemilikan dilakukan server-side. |
| **NFR-04** | Session security | Gunakan HTTPS pada production, cookie aman, CSRF protection, dan konfigurasi CORS/stateful domain yang ketat. |
| **NFR-05** | Validation | Validasi tipe, panjang, batas ukuran, enum, referensi foreign key, dan struktur scene JSON di backend. |
| **NFR-06** | Accessibility | Kontrol utama memiliki label, fokus keyboard yang terlihat, kontras memadai, dan alternatif kontrol keyboard untuk interaksi drag. |
| **NFR-07** | Reliability | Save/load harus mempertahankan urutan scene, karakter, posisi, dialog, pose, dan referensi audio. |
| **NFR-08** | Maintainability | Gunakan service/request/resource/controller yang terpisah; jangan menaruh seluruh business logic di controller. |
| **NFR-09** | Data integrity | Gunakan foreign key, transaksi untuk operasi multi-tabel, dan aturan penghapusan yang eksplisit. |
| **NFR-10** | Privacy | Email dan data akun tidak ditampilkan pada halaman publik; proyek private tidak dapat diakses melalui URL langsung oleh pengguna lain. |
| **NFR-11** | Media rights | Setiap aset media memiliki sumber dan catatan izin/lisensi internal; jangan menganggap aset daring bebas digunakan. |
| **NFR-12** | Observability | Catat error server tanpa menyimpan password, token, atau data sensitif; sediakan log untuk debugging demo. |

---

## 6. Model Data Logis

| Entitas | Atribut Minimum | Relasi & Aturan |
| :--- | :--- | :--- |
| **users** | `id, name, email, password_hash, role, timestamps` | User memiliki banyak performances; role enum (`guest`, `user`, `admin`). |
| **stories** | `id, slug, title, synopsis, philosophy, tradition, version_label, status, timestamps` | Cerita punya banyak sources dan relasi many-to-many dengan characters. |
| **characters** | `id, slug, name, description, image_path, status, timestamps` | Karakter dapat muncul di banyak cerita dan performance. |
| **story_character** | `story_id, character_id, context_note` | Pivot many-to-many; unique pair. |
| **sources** | `id, story_id nullable, title, author/publisher, url_or_reference, accessed_at, rights_note` | Sumber dikaitkan ke cerita atau entitas budaya. |
| **audio_assets** | `id, title, instrument, description, file_path, source_note, license_note, status, duration` | File disimpan di storage; DB menyimpan metadata dan path. |
| **performances** | `id, user_id, story_id nullable, title, description, visibility, status, scene_data, schema_version, published_at, timestamps` | Dimiliki user; story_id mengacu ke cerita jika dipilih. |
| **performance_character** | `performance_id, character_id` | Pivot relasi eksplisit untuk Connected Archive. |
| **performance_audio** | `performance_id, audio_asset_id` | Pivot relasi eksplisit untuk pencarian musik. |
| **reports** *(P1)* | `id, performance_id, reporter_id nullable, reason, status, timestamps` | Moderasi karya publik. |

### 6.1 Struktur `scene_data`

```json
{  
  "schemaVersion": 1,  
  "scenes": [  
    {  
      "id": "scene-1",  
      "title": "Pertemuan",  
      "background": "stage-default",  
      "characters": [  
        {  
          "characterId": "character-uuid",  
          "x": 0.35,  
          "y": 0.72,  
          "scale": 1,  
          "pose": "default",  
          "facing": "right",  
          "dialogue": "Contoh dialog interpretasi pengguna."  
        }  
      ],  
      "audioAssetIds": ["audio-uuid"],  
      "durationMs": 5000  
    }  
  ]  
}
```

*Koordinat dinormalisasi pada rentang 0–1 agar adaptif ke ukuran kanvas kelir yang berbeda. Server membatasi ukuran payload dan memvalidasi `schemaVersion` serta ID referensi.*

---

## 7. Kontrak API Utama

| Method & Endpoint | Akses | Kegunaan |
| :--- | :--- | :--- |
| `GET /api/stories` | Public | Daftar cerita published; pagination dan filter. |
| `GET /api/stories/{slug}` | Public | Detail cerita, sumber, dan karakter terkait. |
| `GET /api/characters` | Public | Daftar karakter published. |
| `GET /api/characters/{slug}` | Public | Detail karakter dan cerita terkait. |
| `GET /api/audio-assets` | Public | Daftar audio aset budaya published. |
| `GET /api/performances` | Authenticated | Daftar karya milik pengguna yang sedang login. |
| `POST /api/performances` | Authenticated | Membuat karya baru. |
| `GET /api/performances/{id}` | Owner/Admin/Public | Mengambil detail karya sesuai visibilitas. |
| `PATCH /api/performances/{id}` | Owner/Admin | Memperbarui metadata dan/atau `scene_data`. |
| `DELETE /api/performances/{id}` | Owner/Admin | Menghapus karya. |
| `POST /api/performances/{id}/publish` | Owner/Admin | Mempublikasikan karya setelah validasi. |
| `GET /api/public/performances/{slug-or-id}`| Public | Detail karya publik beserta relasi budaya. |
| `POST /api/admin/stories` | Admin | Membuat konten cerita (CMS). |
| `PATCH /api/admin/stories/{id}` | Admin | Memperbarui konten cerita (CMS). |

---

## 8. Aturan Validasi dan Otorisasi

* **Title performance:** Wajib, panjang 3–100 karakter; `description` opsional.
* **Visibility:** Hanya menerima `private` atau `public`.
* **Scene Data:** Wajib JSON object dengan `schemaVersion: 1`, batas scene maksimal, dan batas payload 2MB.
* **Koordinat Karakter:** Dibatasi rentang `0.0` sampai `1.0`; scale masuk akal (`0.4` sampai `2.5`); pose sesuai daftar master.
* **Integrasi Referensi:** Setiap `characterId`/`audioAssetId` harus valid dan aktif.
* **Otorisasi Server-Side:** Pengguna tidak dapat membaca/mengubah/menghapus karya privat milik orang lain melalui manipulasi URL/ID.
* **CMS Admin:** Endpoint dilindungi middleware `role:admin`; hak akses dicek sebelum mutasi data.

---

## 9. Aturan Bisnis

* Karya baru secara default berstatus `private`.
* Karya publik wajib memiliki judul dan metadata minimum; cerita sumber disarankan dan ditautkan transparan.
* Interpretasi pengguna diberi label tegas sebagai *"Karya Kreatif Pengguna"*, bukan versi pakem tradisional yang terverifikasi.
* Konten cerita/karakter/audio hanya tampil publik jika statusnya `published`/`active`.
* Penghapusan aset budaya tidak boleh merusak pertunjukan lama yang menggunakannya (gunakan *soft-archive* alih-alih hard delete).

---

## 10. Pengujian dan Acceptance Test

| ID | Jenis | Skenario Lulus |
| :--- | :--- | :--- |
| **T-01** | Feature | Guest dapat melihat daftar dan detail cerita published. |
| **T-02** | Feature | User dapat membuat performance dengan scene minimal satu. |
| **T-03** | Integration | Simpan → reload browser → buka kembali menghasilkan state adegan yang identik. |
| **T-04** | Authorization | User A tidak dapat GET/PATCH/DELETE karya privat milik User B. |
| **T-05** | Authorization | Guest dapat melihat karya publik tanpa hak modifikasi. |
| **T-06** | Validation | ID karakter/audio tidak valid ditolak dengan status HTTP 422. |
| **T-07** | Validation | Payload `scene_data` tidak valid atau `schemaVersion` tidak didukung ditolak. |
| **T-08** | Integration | Karya menautkan cerita, karakter, dan audio dengan ID relasional valid. |
| **T-09** | UI | Editor panggung dapat digunakan pada lebar 360 px hingga desktop tanpa kontrol utama tertutup. |
| **T-10** | Security | Endpoint admin ditolak dengan 403 untuk guest dan user biasa. |
| **T-11** | Media | Audio yang gagal dimuat tidak membuat seluruh aplikasi crash. |
| **T-12** | Regression | Edit dan simpan berulang kali tidak menduplikasi baris relasi pivot. |

---

## 11. Deployment dan Operasional

* Rahasia dan kredensial disimpan di environment variables (`.env`); jangan pernah commit file `.env`.
* Jalankan database migration dan seeder untuk data demo yang dapat diulang (`php artisan migrate --seed`).
* Gunakan HTTPS, cookie aman, dan CORS ketat di production.
* Dokumentasikan panduan setup lokal, build frontend, migrasi, seeding, dan deployment di `README.md`.
