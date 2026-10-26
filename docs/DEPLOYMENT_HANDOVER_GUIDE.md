# 🚀 DOKUMEN SERAH TERIMA & PANDUAN DEPLOYMENT (HANDOVER GUIDE)
## Wayangverse Platform — Instruksi Kerja untuk Agen AI & Tim DevOps
*Tanggal: 26 Oktober 2026 | Dari: Rey Cannavaro (DevOps & Fullstack) & AI Assistant*  
*Target Pembaca: AI Agent / Developer di Laptop Rekan Tim (Pelaksana Deployment AWS)*  
*Branch Rujukan: `feat/frontend-mvp`*

---

## 📌 1. Konteks & Ringkasan Eksekutif

Halo rekan AI Agent dan tim pengembang! Dokumen ini disusun untuk memberikan gambaran lengkap mengenai **pekerjaan arsitektur & keamanan yang telah diselesaikan**, serta **panduan langkah-demi-langkah untuk mengeksekusi deployment ke AWS, Vercel, dan Cloudflare**.

### ⚠️ Komitmen Penting (Strict Rule):
> **JANGAN MENGUBAH TAMPILAN DESAIN FRONTEND SAMA SEKALI.**  
> Seluruh visual panggung kelir SVG, tata cahaya blencong, animasi AOS, palet warna klasik Batik Soga & Prada Emas, rigging wayang, synthesizer Web Audio gamelan, dan modal dialog sudah difinalisasi untuk kebutuhan penjurian lomba. Pekerjaan selanjutnya murni berfokus pada **infrastruktur, konektivitas cloud, dan deployment**.

---

## 🛠️ 2. Rekapitulasi Pekerjaan yang Telah Diselesaikan (Changelog)

Berikut pembaruan yang telah kami terapkan pada repositori di branch `feat/frontend-mvp`:

### A. Kebersihan Monorepo (Hygiene & Cleanliness)
1. **Penghapusan File Sampah:** 7 file `.gitkeep` redundan pada folder yang sudah terisi kode aktif telah dihapus.
2. **Pembersihan Boilerplate Laravel:** Menghapus `be/resources/views/welcome.blade.php` (hemat 82 KB), serta menghapus sisa Vite & Tailwind di backend (`be/vite.config.js`, `be/package.json`, `be/resources/css`, `be/resources/js`) yang sebelumnya membingungkan skrip monorepo.
3. **Standardisasi Root Backend:** File `be/routes/web.php` kini merespons JSON status operasional yang bersih.
4. **Perbaikan Tautan Dokumentasi:** Memperbaiki 19 tautan hardcoded mesin lokal `file:///d:/Wayang/...` di `AGENTS.md` dan `docs/LAPORAN_DAN_PANDUAN_BACKEND.md` menjadi path relatif sehingga valid di semua sistem operasi.
5. **Isolasi Linter:** Mengatur `fe/package.json` agar `npm --prefix fe run lint` menargetkan `oxlint src` sehingga script tooling eksternal di `.agents/` tidak memicu warning linter (0 error).

### B. Penguatan Keamanan Backend (Security Hardening)
1. **Migrasi Kolom `role`:** Menambahkan file migrasi `be/database/migrations/2026_10_26_000001_add_role_to_users_table.php` untuk menambahkan kolom `role` (enum/string: `guest`, `user`, `admin`, default `user`) pada tabel `users`.
2. **Model User & Seeder:** Menambahkan atribut `role` pada `$fillable` dan helper method `isAdmin(): bool` di `be/app/Models/User.php`. Di `DatabaseSeeder.php`, akun demo juri (`demo@wayangdigital.id`) dan admin resmi secara eksplisit diberi `role = 'admin'`.
3. **Middleware Otorisasi Admin Resmi:** Membuat middleware `be/app/Http/Middleware/EnsureUserIsAdmin.php` dan mendaftarkan alias `role.admin` di `be/bootstrap/app.php`.
4. **Eliminasi String Check Rentan:** Menghapus celah keamanan `str_contains($user->email, 'admin')` di seluruh controller (`StoryController`, `CharacterController`, `AudioAssetController`, `AdminController`). Otorisasi kini murni berbasis data peran resmi dari database via middleware `role.admin`.
5. **Rate Limiting:** Rute autentikasi (`/login`, `/register`) di `be/routes/api.php` kini diproteksi middleware `throttle:10,1` untuk mencegah serangan brute force.
6. **Sanitasi Error Database:** Endpoint `/api/status` di `StatusController.php` tidak akan pernah membocorkan pesan error exception PDO mentah ke publik saat `APP_DEBUG=false`.

### C. Kesiapan Deployment Cloud (Cloud-Native Configuration)
1. **Vercel SPA Config:** Membuat `fe/vercel.json` dengan konfigurasi *rewrites* agar me-refresh halaman di Vercel (seperti `/stage`, `/atlas`, `/my-works`) tidak menyebabkan error `404 Not Found`.
2. **CORS Multi-Origin:** Mengupdate `be/config/cors.php` dengan regex `allowed_origins_patterns` untuk mendukung Vercel preview deployment URLs (`#^https://.*\.vercel\.app$#`).
3. **Containerization Docker:**
   - `be/Dockerfile` & `be/.dockerignore`: Image backend berbasis PHP 8.2 Alpine ringan dengan seluruh ekstensi MySQL/PDO/GD.
   - `fe/Dockerfile`: Image frontend React berbasis Node 20 Alpine.
   - `docker-compose.yml`: Orkestrasi lokal satu-perintah untuk menjalankan MySQL 8.0, Backend Laravel 12, dan Frontend Vite.
4. **CI/CD Pipeline:** Menambahkan `.github/workflows/ci.yml` untuk pengujian otomatis linter, build Vite, dan validasi sintaks backend di GitHub.
5. **Panduan Cloudflare:** Membuat panduan detail di `docs/CLOUDFLARE_AWS_SETUP.md`.

---

## 🏛️ 3. Arsitektur Target Deployment

```text
                        [ Pengguna / Browser ]
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │  CLOUDFLARE (DNS & EDGE)  │
                    │  • SSL: Full (Strict)     │
                    │  • WAF & DDoS Protection  │
                    └─────────────┬─────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         │ (Subdomain: app.domain.com)                     │ (Subdomain: api.domain.com)
         ▼                                                 ▼
┌─────────────────────────────┐               ┌─────────────────────────────┐
│       VERCEL (FRONTEND)     │               │          AWS (BACKEND)      │
│ • React 19 + Vite           │               │ • Laravel 12 API Engine     │
│ • Root Directory: 'fe'      │ ──(REST API)─►│ • EC2 / Lightsail / Docker  │
│ • VITE_API_URL pointing to  │   via HTTPS   │ • Port 8000 / Nginx Reverse │
│   api.domain.com/api        │   (Bearer)    └──────────────┬──────────────┘
└─────────────────────────────┘                              │
                                                             ▼
                                              ┌─────────────────────────────┐
                                              │       AWS MySQL / RDS       │
                                              │ • Database 'wayang'         │
                                              │ • Port 3306 (VPC Protected) │
                                              └─────────────────────────────┘
```

---

## 📋 4. Panduan Eksekusi Deployment untuk Agen / Rekan di Laptop Target

Berikut urutan instruksi yang harus dijalankan di laptop target:

### Langkah 1: Tarik Perubahan Kode Terbaru
Buka terminal dan pastikan branch berada di `feat/frontend-mvp`:
```bash
git fetch origin
git checkout feat/frontend-mvp
git pull origin feat/frontend-mvp
```

---

### Langkah 2: Deploy Frontend ke Vercel
1. Login ke dashboard [Vercel](https://vercel.com) menggunakan akun tim.
2. Klik **Add New Project** > Import repositori GitHub `wayang`.
3. Atur konfigurasi build berikut:
   * **Framework Preset:** `Vite`
   * **Root Directory:** Edit dan arahkan ke folder **`fe`** *(SANGAT PENTING!)*
   * **Build Command:** `vite build`
   * **Output Directory:** `dist`
4. Tambahkan Environment Variable di Vercel:
   * **`VITE_API_URL`**: `https://api.domainkamu.com/api` (Ganti `domainkamu.com` dengan domain resmi tim).
5. Klik **Deploy**.
6. Setelah deployment berhasil, masuk ke tab **Settings > Domains**, lalu tambahkan custom subdomain: `app.domainkamu.com`.

---

### Langkah 3: Deploy Backend & Database ke AWS (EC2 / Lightsail)

#### A. Persiapan Server AWS
1. Buat instance **Ubuntu 24.04 LTS** di AWS EC2 atau AWS Lightsail.
2. Pastikan **Security Group** AWS membuka port:
   * Port `22` (SSH - Khusus IP Developer)
   * Port `80` (HTTP - Akses Publik / Cloudflare)
   * Port `443` (HTTPS - Akses Publik / Cloudflare)
   * Port `3306` (MySQL - DITUTUP dari publik, hanya lokal).

#### B. Setup Aplikasi Backend di Server AWS
Clone repositori ke server AWS dan masuk ke direktori `be`:
```bash
git clone https://github.com/AhmadFayyadhFadhil/wayang.git
cd wayang
git checkout feat/frontend-mvp
cd be

# Salin environment template
cp .env.example .env
```

Sesuaikan file `be/.env` di server AWS:
```ini
APP_NAME="Wayang Digital"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.domainkamu.com
FRONTEND_URL=https://app.domainkamu.com

# Database Connection
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=wayang
DB_USERNAME=wayang_user
DB_PASSWORD=Password_Sangat_Kuat_2026!

# Sanctum & CORS
SANCTUM_STATEFUL_DOMAINS=app.domainkamu.com
CORS_ALLOWED_ORIGINS=https://app.domainkamu.com
```

#### C. Jalankan Instalasi, Migrasi & Seeding
```bash
# Install dependensi PHP tanpa dev tools
composer install --no-dev --optimize-autoloader

# Generate kunci enkripsi
php artisan key:generate

# Hubungkan direktori storage media
php artisan storage:link

# Eksekusi migrasi tabel (termasuk kolom role baru) & data budaya master
php artisan migrate --seed --force

# Optimasi cache konfigurasi Laravel untuk produksi
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

*(Catatan: Alternatif container dapat menggunakan file `docker-compose.yml` atau `be/Dockerfile` yang sudah kami sediakan).*

---

### Langkah 4: Pengaturan DNS, SSL & Cache di Cloudflare

1. Masuk ke Cloudflare Dashboard > Pilih domain tim (`domainkamu.com`).
2. Masuk ke menu **DNS > Records** dan tambahkan 2 record:
   * **CNAME Record:**
     * Name: `app`
     * Target: `cname.vercel-dns.com`
     * Proxy Status: **Proxied (Awan Oranye)**
   * **A Record:**
     * Name: `api`
     * Target: `<IP_PUBLIK_AWS_ANDA>`
     * Proxy Status: **Proxied (Awan Oranye)**
3. Masuk ke menu **SSL/TLS > Overview**:
   * Set encryption mode ke **Full** atau **Full (Strict)**.  
   *(PERINGATAN: Jangan pilih Flexible agar tidak terjadi loop redirect).*
4. Masuk ke menu **Caching > Cache Rules > Create Rule**:
   * Nama Aturan: `Bypass Cache API Laravel`
   * Rule: `Hostname equals api.domainkamu.com`
   * Action: **Bypass Cache** (Agar transaksi naskah, autentikasi, dan status database selalu realtime).

---

## ✅ 5. Checklist Verifikasi Akhir (Definition of Done)

Sebelum melaporkan bahwa sistem sudah live, pastikan verifikasi berikut lolos:

- [ ] **Health Check API:** Buka browser di `https://api.domainkamu.com/api/status`. Respon harus mengembalikan JSON `{ "status": "success", "database": { "connected": true, "name": "wayang" } }` tanpa error.
- [ ] **Tampilan Frontend:** Buka `https://app.domainkamu.com`. Pastikan kartu status di halaman utama menampilkan respon hijau (**Backend Online & Database Connected**).
- [ ] **SPA Route Refresh:** Buka tab panggung (`/stage`) atau atlas (`/atlas`), lalu tekan `Ctrl + F5` (Hard Refresh). Halaman harus tetap terbuka normal tanpa muncul error 404 dari Vercel.
- [ ] **Autentikasi & Role Admin:** Login menggunakan akun juri `demo@wayangdigital.id` / `Wayang@2026!`. Verifikasi bahwa menu CMS Admin dapat dibuka dan data master budaya termuat dengan sempurna.
- [ ] **CORS Verifikasi:** Buka Developer Tools (F12) > Console di browser. Pastikan tidak ada pesan merah *CORS policy error*.
- [ ] **Soundscape & Panggung:** Buka panggung kelir, geser tokoh wayang, bunyikan instrumen gamelan (Gong/Dodogan/Kepyak). Pastikan Web Audio API berbunyi merdu tanpa error aset 404.

---

*Semoga panduan ini membantu kelancaran proses deployment di laptop rekan tim. Jika ada pertanyaan, seluruh blueprint dan alasan arsitektural dapat ditinjau pada dokumen rujukan di folder `docs/`.*
