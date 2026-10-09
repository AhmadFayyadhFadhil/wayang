# 🎭 Wayang Digital — Platform Interaktif Digitalisasi Pewayangan

> 🏆 **KARYA INOVASI LOMBA**  
> **Tema Utama:** Sosial dan Kesenian  
> **Sub-Tema:** Revitalisasi Budaya Tradisional Berbasis Digital & Gamifikasi Interaktif

[![Laravel](https://img.shields.io/badge/Backend-Laravel%2012-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/Frontend-React%2019%20(Vite)-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

---

## 📌 Latar Belakang & Masalah Sosial
Pertunjukan seni wayang kulit tradisional memiliki nilai filosofis luhur dan pesan moral sosial yang mendalam. Namun, generasi muda (Gen Z) kerap menganggap pertunjukan wayang konvensional membosankan (*boring*) karena durasinya yang semalam suntuk (7–8 jam), penggunaan bahasa kawi/jawa kuno yang sulit dicerna, serta minimnya medium interaktif dua arah.

**Wayang Digital** hadir mendisrupsi tantangan tersebut dengan mentransformasikan kesenian adiluhung ini ke dalam platform panggung digital (*Virtual Kelir*) yang dinamis:
1. **Relevansi Sosial (*True Story*):** Mengangkat naskah cerita berbasis kisah nyata dan isu-isu sosial modern yang dihubungkan dengan filosofi wayang.
2. **Panggung Interaktif (*Virtual Dalang Experience*):** Pengguna dapat memainkan dan memperagakan tokoh wayang sendiri secara langsung melalui manipulasi sendi digital.
3. **Atmosfer Kontemporer:** Memadukan efek pencahayaan blencong modern, siluet kelir, dan aransemen soundtrack gamelan kontemporer.

---

## 🏛️ Arsitektur & Tech Stack

```text
[ Browser / Client ]
        │
        │ HTTP REST API (CORS Enabled)
        ▼
[ Frontend: React 19 + Vite (Port 5173) ]
        │
        │ Axios API Service
        ▼
[ Backend: Laravel 12 API (Port 8000) ]
        │
        │ PDO Connection
        ▼
[ Database: MySQL 'wayang' (Port 3306 - XAMPP) ]
```

- **Backend**: Laravel 12 (RESTful API, Sanctum, CORS middleware, Eloquent ORM)
- **Frontend**: React 19, Vite, Axios Client, CSS Custom Theme
- **Database**: MySQL (Database name: `wayang`)
- **Struktur Repositori**: Monorepo terisolasi (`be/` dan `fe/`)

---

## 📁 Struktur Monorepo

```text
wayang/
├── be/                                # Backend API (Laravel 12)
│   ├── app/Http/Controllers/Api/      # Endpoint Controllers (StatusController, dll)
│   ├── config/cors.php                # Konfigurasi Cross-Origin Resource Sharing
│   ├── database/migrations/           # Skema migrasi database
│   ├── routes/api.php                 # Rute REST API
│   ├── storage/app/public/            # Penyimpanan dinamis (wayang & audio)
│   ├── .env.example                   # Template konfigurasi environment aman
│   └── composer.json
│
├── fe/                                # Frontend UI (React + Vite)
│   ├── public/audio/                  # Aset soundtrack (bgm) & efek suara (sfx)
│   ├── public/images/                 # Aset grafis kelir & karakter wayang
│   ├── src/features/stage/            # Modul Panggung Interaktif & Puppeteering
│   ├── src/features/story/            # Modul Lakon & Presentasi True Story
│   ├── src/features/encyclopedia/     # Modul Ensiklopedia Tokoh & Filosofi
│   ├── src/services/api.js            # Axios client penghubung ke Laravel
│   ├── .env.example                   # Template variabel lingkungan frontend
│   └── package.json
│
├── .gitignore                         # Proteksi zero-trust root monorepo
├── LICENSE                            # MIT License
└── README.md                          # Dokumentasi resmi proyek
```

---

## ⚙️ Prasyarat Sistem (Prerequisites)
Sebelum menjalankan proyek, pastikan perangkat telah terinstal:
- **PHP**: Versi `>= 8.2` (Direkomendasikan PHP 8.2 atau 8.3 via XAMPP)
- **Composer**: Versi `>= 2.2`
- **Node.js**: Versi `>= 20.x` & `npm`
- **MySQL Database Server**: Port 3306 (melalui XAMPP Control Panel)

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### 1. Persiapan Database
1. Buka **XAMPP Control Panel**, lalu aktifkan modul **Apache** dan **MySQL**.
2. Buka `http://localhost/phpmyadmin` di browser.
3. Buat database baru bernama: **`wayang`** (Collation: `utf8mb4_unicode_ci`).

---

### 2. Setup Backend (`be/`)
Buka terminal dan jalankan instruksi berikut:

```bash
# 1. Masuk ke direktori backend
cd be

# 2. Install dependensi PHP
composer install

# 3. Salin file environment dari template aman
copy .env.example .env

# 4. Generate application key
php artisan key:generate

# 5. Jalankan migrasi tabel database
php artisan migrate

# 6. Hubungkan direktori storage publik (opsional)
php artisan storage:link

# 7. Jalankan server backend Laravel
php artisan serve
```
> Server backend akan berjalan di: **`http://127.0.0.1:8000`**  
> Verifikasi endpoint API: **`http://127.0.0.1:8000/api/status`**

---

### 3. Setup Frontend (`fe/`)
Buka terminal baru pada direktori yang sama:

```bash
# 1. Masuk ke direktori frontend
cd fe

# 2. Install dependensi Node.js
npm install

# 3. Salin file environment dari template aman
copy .env.example .env

# 4. Jalankan development server
npm run dev
```
> Buka browser pada URL: **`http://localhost:5173`**  
> Indikator panggung akan otomatis mendeteksi koneksi aktif ke Laravel API dan database `wayang`.

---

## 👤 Akun Uji Coba / Demo (Dummy Data)
Untuk pengujian autentikasi (tahap selanjutnya):
- **Email:** `demo@wayangdigital.id`
- **Password:** `Wayang@2026!` *(Hash: Bcrypt)*

---

## 👥 Tim Pengembang
- **Ketua Tim / Lead Developer:** Ahmad Fayyadh Fadhil
- **Creative & Cultural Content:** Tim Wayang Digital
- **Subtema Lomba:** Sosial & Kesenian

---

## 📄 Lisensi
Proyek ini didistribusikan di bawah lisensi terbuka [MIT License](LICENSE). Hak cipta © 2026 Ahmad Fayyadh Fadhil & Tim Wayang.
