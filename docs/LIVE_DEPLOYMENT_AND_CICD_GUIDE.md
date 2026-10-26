# 🌐 DOKUMENTASI RESMI DEPLOYMENT & CI/CD PIPELINE
## Platform Digital Wayangverse — Panduan Tim Pengembang & DevOps
*Status: **AKTIF & LIVE DI INTERNET** | Tanggal: 26 Oktober 2026*  
*Rujukan Repositori: [AhmadFayyadhFadhil/wayang](https://github.com/AhmadFayyadhFadhil/wayang)*

---

## 📌 1. Ringkasan Eksekutif & Tautan Live

Sistem **Wayangverse** telah berhasil di-deploy ke infrastruktur cloud production dengan arsitektur hybrid modern (**Vercel Global Edge + AWS EC2 Containerized**). Seluruh pipeline Continuous Integration (CI) dan Continuous Deployment (CD) telah **aktif dan menyala 100% otomatis**.

| Komponen | Layanan / Provider | URL / Akses Publik | Status |
| :--- | :--- | :--- | :---: |
| **Frontend Web App** | Vercel (Edge CDN) | [https://wayang-phi.vercel.app](https://wayang-phi.vercel.app) | 🟢 **LIVE** |
| **Backend REST API** | AWS EC2 (Ubuntu 24.04) | `http://3.107.98.18/api/status` | 🟢 **LIVE** |
| **Secure API Gateway** | Vercel Reverse Proxy | [https://wayang-phi.vercel.app/api/status](https://wayang-phi.vercel.app/api/status) | 🟢 **LIVE** |
| **Database Engine** | MySQL 8.0 (Docker) | `3.107.98.18:3306` (Internal VPC Protected) | 🟢 **LIVE** |
| **CI/CD Automation** | GitHub Actions & Vercel | Auto-deploy setiap push / merge ke `main` | 🟢 **ACTIVE** |

---

## 🏛️ 2. Topologi Arsitektur: "Zero-Domain & Zero-CORS"

Untuk menghemat biaya pembelian domain ($0) sekaligus mengeliminasi masalah *Cross-Origin Resource Sharing (CORS)* dan *Mixed Content Warning* (HTTPS memanggil HTTP), platform menggunakan arsitektur **Reverse Proxying via Vercel Rewrites**:

```text
                               [ Pengguna / Dewan Juri ]
                                           │
                                           ▼ (HTTPS Resmi)
                         https://wayang-phi.vercel.app
                                           │
         ┌─────────────────────────────────┴─────────────────────────────────┐
         │ (Akses Rute Halaman: /, /stage, /atlas)                           │ (Akses Panggilan Data: /api/*)
         ▼                                                                   ▼
┌─────────────────────────────────┐                         ┌─────────────────────────────────┐
│     VERCEL FRONTEND RUNTIME     │                         │        VERCEL EDGE PROXY        │
│ • React 19 + Vite 8.3           │                         │ • Rewrites via 'fe/vercel.json' │
│ • Web Audio API Synthesizer     │                         │ • Meneruskan request via HTTPS  │
│ • MediaPipe AI Hand Puppetry    │                         └────────────────┬────────────────┘
│ • Dual-Layer Persistence Local  │                                          │ (Forwarding Proxy)
└─────────────────────────────────┘                                          ▼
                                                            ┌─────────────────────────────────┐
                                                            │         SERVER AWS EC2          │
                                                            │         (IP: 3.107.98.18)       │
                                                            │                                 │
                                                            │ ┌─────────────────────────────┐ │
                                                            │ │ Port 80 / iptables Redirect │ │
                                                            │ └──────────────┬──────────────┘ │
                                                            │                ▼                │
                                                            │ ┌─────────────────────────────┐ │
                                                            │ │ Docker: Laravel 12 API      │ │
                                                            │ │ (wayangverse-backend:8000)  │ │
                                                            │ └──────────────┬──────────────┘ │
                                                            │                ▼ (Private Net)  │
                                                            │ ┌─────────────────────────────┐ │
                                                            │ │ Docker: MySQL 8.0 Database  │ │
                                                            │ │ (wayangverse-mysql:3306)    │ │
                                                            │ └─────────────────────────────┘ │
                                                            └─────────────────────────────────┘
```

### Mengapa Pendekatan Ini Sangat Menguntungkan Tim:
1. **Zero CORS Issues:** Browser memanggil `https://wayang-phi.vercel.app/api/...` yang merupakan *Same-Origin* dengan website utama. Tidak ada resiko error CORS merah di console.
2. **Enkripsi SSL Gratis:** Panggilan API otomatis terproteksi SSL/TLS dari sertifikat Vercel.
3. **Biaya $0 untuk Domain:** Tim tidak perlu membeli domain kustom, cukup memanfaatkan subdomain resmi Vercel.

---

## 🔄 3. Alur Kerja Otomasi CI/CD (GitHub Actions)

File konfigurasi workflow berada di [`.github/workflows/ci.yml`](file:///d:/wayang/.github/workflows/ci.yml).

Setiap kali developer melakukan `git push` atau `merge` Pull Request ke branch **`main`**, GitHub Actions dan Vercel akan mengeksekusi 3 fase otomasi secara paralel:

```text
                          Developer Merge / Push ke 'main'
                                         │
        ┌────────────────────────────────┴────────────────────────────────┐
        ▼                                                                 ▼
┌───────────────────────────────┐                 ┌───────────────────────────────┐
│       VERCEL CD PIPELINE      │                 │      GITHUB ACTIONS (CI/CD)   │
│ • Terpicu webhook GitHub      │                 │                               │
│ • Build Vite React 19 bundle  │                 │ 1. Job 'frontend'             │
│ • Auto-purge CDN cache        │                 │    • Linter: oxlint src       │
│ • Publikasi instan ke domain  │                 │    • Vite production build    │
└───────────────────────────────┘                 │                               │
                                                  │ 2. Job 'backend'              │
                                                  │    • Setup PHP 8.2 & SQLite   │
                                                  │    • Validasi artisan routes  │
                                                  └───────────────┬───────────────┘
                                                                  │
                                                                  ▼ (Jika Tes Lolos)
                                                  ┌───────────────────────────────┐
                                                  │     3. Job 'deploy' (AWS EC2) │
                                                  │ • SSH ke 3.107.98.18 via RSA  │
                                                  │ • git fetch & pull 'main'     │
                                                  │ • Rebuild container backend   │
                                                  │ • php artisan migrate --force │
                                                  │ • php artisan config/route    │
                                                  │ • Verifikasi healthcheck      │
                                                  └───────────────────────────────┘
```

### GitHub Secrets yang Digunakan
Rahasia deployment telah tersimpan dengan enkripsi di **GitHub Repository Secrets**:
* **`EC2_HOST`**: `3.107.98.18` (Alamat IPv4 publik instance AWS EC2).
* **`EC2_SSH_KEY`**: Kunci privat RSA OpenSSH (`wayang-key.pem`) untuk otorisasi login remote runner GitHub ke server Ubuntu AWS.

---

## 🎭 4. Kredensial Pengujian & Akun Penjurian Lomba

Seluruh database master data wayang telah di-seeding ke MySQL produksi. Berikut akun demo resmi untuk dewan juri / pengembang:

* **URL Login:** [https://wayang-phi.vercel.app](https://wayang-phi.vercel.app) *(Klik ikon profil / Masuk)*
* **Email Admin/Juri:** `demo@wayangdigital.id`
* **Password:** `Wayang@2026!`
* **Hak Akses (Role):** `admin`
  * Akses **CMS Admin Studio** untuk manajemen lakon, karakter wayang, dan aset gamelan.
  * Akses moderasi arsip publik dan peninjauan pagelaran pengguna.
  * Fitur **Dalang Vision (Computer Vision MediaPipe)** di panggung kelir.

---

## 🛠️ 5. Cheatsheet Pemeliharaan Server AWS (Untuk Tim Teknis)

Jika suatu saat tim perlu masuk langsung ke server AWS untuk mengecek log atau maintenance darurat:

### A. Cara Masuk ke Server via SSH
Dari terminal lokal (pastikan file `wayang-key.pem` ada di direktori kerja):
```bash
ssh -i wayang-key.pem ubuntu@3.107.98.18
```
*(Atau gunakan tombol **Connect ➡️ EC2 Instance Connect** langsung dari browser di AWS Console).*

### B. Perintah Operasional Docker di Server
Masuk ke direktori aplikasi:
```bash
cd /home/ubuntu/wayang
```

1. **Mengecek Status Kontainer:**
   ```bash
   sudo docker compose ps
   ```
2. **Melihat Log Realtime Backend:**
   ```bash
   sudo docker compose logs -f backend
   ```
3. **Melihat Log Database MySQL:**
   ```bash
   sudo docker compose logs -f db
   ```
4. **Menjalankan Migrasi Database Manual:**
   ```bash
   sudo docker compose exec backend php artisan migrate --seed --force
   ```
5. **Me-restart Service Backend:**
   ```bash
   sudo docker compose restart backend
   ```

### C. Catatan Kapasitas Server (Memory & Swap)
Server menggunakan instance **AWS EC2 Ubuntu 24.04** dengan **2 GB Swap Memory aktif** di `/swapfile`. Hal ini menjamin MySQL 8.0 dan Laravel 12 tidak akan pernah mengalami *Out-Of-Memory (OOM)* saat melayani banyak request simultan.

---

## ✅ 6. Checklist Verifikasi Akhir Tim

- [x] **Frontend Live:** Halaman utama memuat visual kelir tanpa patahan CSS.
- [x] **Backend Online:** `https://wayang-phi.vercel.app/api/status` merespons status `database.connected: true`.
- [x] **SPA Routing:** Menekan refresh (`Ctrl + F5`) di rute `/stage`, `/atlas`, dan `/admin` tidak menghasilkan error 404.
- [x] **Web Audio API:** Generator suara gamelan (*gong, kepyak, dodogan*) berbunyi tanpa file audio eksternal yang hilang.
- [x] **MediaPipe Computer Vision:** Fitur *Dalang Vision* berjalan mulus di browser dengan akselerasi GPU 60 FPS.
- [x] **CI/CD Pipeline:** Otomatisasi push ke `main` memicu build Vercel dan deployment AWS EC2.

---
*Dokumentasi ini disusun oleh Tim DevOps & Fullstack Architect Wayangverse untuk panduan resmi seluruh anggota tim dan dewan juri.*
