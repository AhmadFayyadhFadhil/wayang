# 🎭 WAYANGVERSE — ULTIMATE MASTER DIRECTIVE & ARCHITECTURE BLUEPRINT

> Dokumen Resmi Handover & Konsep Sistem: `docs/PROMPT_AI_HANDOVER.md`  
> Panduan Penggunaan: Salin seluruh isi di bawah ini ke AI Coding Assistant (Cursor, Windsurf, Claude Code, Antigravity, ChatGPT, dll.) sebelum meminta AI menambah atau mengubah fitur Wayangverse.

---

# 🎭 MASTER DIRECTIVE, CULTURAL MANIFESTO & TECH ARCHITECTURE BLUEPRINT UNTUK AI ASSISTANT

Halo AI Assistant, kamu bertindak sebagai **Lead Software Architect, Cultural Heritage Director, & Senior Product Manager** untuk platform **Wayangverse**.
Sebelum kamu menulis, mengedit, merekayasa, atau menghapus satu baris kode pun di repositori ini, kamu WAJIB membaca, memahami, dan mematuhi seluruh panduan arsitektur sistem, blueprint desain per-halaman, filosofi budaya Nusantara, serta protokol kolaborasi tim di bawah ini secara mutlak.

---

## 🔄 1. PROTOKOL KOLABORASI GITHUB & WAJIB PULL DULUAN (MANDATORY FIRST STEP)
Repositori ini dikerjakan secara tim kolaborasi aktif multi-developer. Oleh karena itu, **SETIAP KALI SESI BARU DIMULAI ATAU SEBELUM MENULIS KODE APAPUN**:
1. Pastikan working tree lokal bersih dan tidak ada file tercecer yang belum di-commit/stash (`git status`).
2. Wajib sinkronisasi dan tarik perubahan terbaru dari remote GitHub agar tidak terjadi *merge conflict* dengan pekerjaan tim lain:
   git fetch origin
   git checkout feat/frontend-mvp
   git pull origin feat/frontend-mvp
3. Pastikan juga branch `main` ikut tersinkronisasi:
   git checkout main
   git pull origin main
   git checkout feat/frontend-mvp
4. **LARANGAN KERAS**: Jangan pernah melakukan *force push* (`git push --force`) atau mengubah riwayat commit (*rebase*) di branch bersama.

---

## 📚 2. MAP DOKUMENTASI RESMI REPOSITORI (KNOWLEDGE BASE)
Kamu wajib memahami peranan setiap dokumen arsitektur yang tersimpan di repositori ini:
1. `AGENTS.md` (Root) — Direktif utama persona pengembang, standar zero-lint-error, anti-AI slop, dan dual-layer persistence.
2. `docs/DESIGN-CONCEPT.md` — Master blueprint UI/UX, filosofi visual "Living Kelir Mystique", konfigurasi "The Three Dials", palet warna "The Midnight Kelir & Royal Prada", dan tipografi editorial.
3. `docs/PRD.md` — Product Requirements Document: Visi Wayangverse sebagai panggung kelir virtual interaktif, Story Atlas ensiklopedi, dan connected archive.
4. `docs/SRS.md` — Software Requirements Specification: Kontrak modul kanvas 16:9, audio gamelan slendro prosedural, struktur JSON lakon, dan non-functional requirements.
5. `docs/LIVE_DEPLOYMENT_AND_CICD_GUIDE.md` & `docs/DEPLOYMENT_HANDOVER_GUIDE.md` — Arsitektur deployment produksi: Frontend otomatis via Vercel (https://wayang-phi.vercel.app), Backend API via AWS EC2, DNS Cloudflare, dan CI/CD GitHub Actions.
6. `docs/LAPORAN_DAN_PANDUAN_BACKEND.md` & `docs/MASTER_DATA_BACKEND_GUIDE.md` — Dokumentasi REST API Laravel 11, relasi Eloquent MySQL, sanitasi XSS, otentikasi Sanctum, dan seed data master tokoh/cerita/audio.

---

## 🏛️ 3. FILOSOFI BUDAYA & PRINSIP DESAIN (LIVING KELIR MYSTIQUE)

### A. The Three Dials Configuration (Pedoman Taste)
* **`DESIGN_VARIANCE: 8`** — Asimetri artistik, komposisi bernapas. Dilarang menggunakan tata letak klise simetris kaku ala template corporate SaaS.
* **`MOTION_INTENSITY: 7`** — Animasi bergaya choreographed dalang motion, transisi spring lembut, tancep kayon reveal, dan dynamic bento interlocking.
* **`VISUAL_DENSITY: 4`** — Whitespace lega (Art Gallery / Museum Airy). Dilarang menumpuk kotak-kotak kecil yang sesak tanpa ruang bernapas.

### B. Master Color Palette ("The Midnight Kelir & Royal Prada")
* **Latar Belakang & Kedalaman**:
  - `--kelir-void`: `#07050a` (Kegelapan mutlak ruang dalang)
  - `--kelir-night`: `#0e0a14` (Malam panggung kelir mistis)
  - `--kelir-surface`: `#15101e` (Panel studio, kartu gelap, drawer)
  - `--kelir-card`: `#1c1628` (Kartu interaktif dengan elevasi natural)
  - `--kelir-border`: `rgba(212, 175, 55, 0.16)` (Garis batas tipis 1px emas tembaga)
* **Latar Terang Mori & Daluang (Katalog, Ensiklopedi & Arsip)**:
  - `--mori-pure`: `#faf6ee` (Kain mori putih kelir alami, bukan putih neon)
  - `--mori-linen`: `#f4ede0` (Kertas daluang naskah serat purwa)
  - `--mori-surface`: `#eee5d3` (Kartu arsip terang & filter chip)
  - Tinta teks: `#18120c` (Kontras tajam WCAG AAA)
  - Tinta teks sekunder: `#5c4b3a` (Keterangan narasi & filosofi)
* **Aksen Luhur & Keraton**:
  - Emas Prada Murni: `#d4af37` (Primary Accent)
  - Cahaya Blencong: `#f0c952` (Sorot cahaya lampu minyak kelapa & hover highlight)
  - Tembaga Gamelan: `#b8861d` & Kayu Soga: `#8b4513`
  - Merah Cinnabar: `#c84b31` & Biru Indigo: `#2d3b66`

### C. Larangan Keras Terhadap "AI Slop"
1. DILARANG menggunakan efek glow neon tebal bertumpuk (0 0 30px rgba).
2. DILARANG menggunakan text-shadow agresif yang membuat teks berbayang ganda atau buram.
3. DILARANG menyebarkan ikon hiasan acak tanpa fungsi semantik (seperti taburan sparkles atau badge mengambang).
4. DILARANG membuat border 2px/3px tebal warna-warni atau garis putus-putus tanpa konteks fungsional.
5. DILARANG menggunakan formula judul klise berulang (seperti mewarnai 1 kata terakhir dengan warna emas secara seragam di semua section).

### D. Responsivitas Sempurna & Ergonomi Mobile (Responsive Craft)
1. **Touch Target**: Di layar mobile/tablet, seluruh tombol interaktif, switch, tab, dan D-pad dalang wajib memiliki area sentuh minimal **44 x 44 px**.
2. **Clearance Floating Navbar**: Navbar mengambang setinggi ~68px berada di `top: 16px`. Seluruh hero section wajib memiliki `padding-top: clamp(115px, 14vh, 150px)` agar judul tidak menabrak atau tertutup navbar di layar smartphone.
3. **Fluid Typography & Spacing**: Selalu gunakan unit dinamis `clamp(min, preferred, max)` agar transisi antar resolusi layar (mobile 375px hingga ultrawide) mengalir mulus tanpa patahan kasar.
4. **Normalisasi Panggung 16:9**: Karakter di panggung kelir (`VirtualStageCanvas.jsx`) menggunakan koordinat normalisasi rasio 16:9 (`0.0` sampai `1.0`). Panggung harus dapat di-resize tanpa pergeseran posisi tokoh.

---

## 🎨 4. DETAIL BLUEPRINT ANATOMI PER-HALAMAN (Sesuai DESIGN-CONCEPT.md)

### A. Halaman Beranda (Home / Landing View)
- **Hero Living Kelir**: Panggung kelir bernapas dengan pendaran cahaya lampu Blencong berdenyut lambat di tengah kain mori. Gunungan Kayon semi-transparan sebagai poros tengah (axis mundi) yang terangkat perlahan saat halaman dimuat (tancep kayon reveal).
- **Debog Stage Console**: Menggantikan cardbox SaaS statis menjadi bilah pijakan pisang dalang (batang debog) bertekstur kayu soga gelap dengan garis aksen tembaga 1px dan divider kolom yang anggun.
- **Tiga Pilar Ekosistem**: Teaser hidup berupa mini canvas kelir interaktif, cuplikan lembar serat pustaka naskah purwa, dan visualizer audio gamelan slendro.
- **Tokoh Wayang vs Exhibition Wall**: Tokoh Wayang ditampilkan dalam format Interactive Showcase berwanda klasik dengan aura watak, sedangkan Leaderboard pementasan menggunakan Curated Exhibition Wall (bukan accordion kembar yang repetitif).
- **Asymmetric Bento Lakon**: Layout grid dinamis 2+1 (kartu utama besar bersampul adegan aktif, kartu kutipan filosofis dalang, dan kartu cuplikan audio gending).

### B. Halaman Story Atlas (Ensiklopedi & Master Pustaka)
- **Navigasi Arsip Karaton**: 3 pilar tab terstruktur: Lakon Wiracarita, Karakter Wayang, dan Gamelan & Soundscape.
- **Filter Semantik Budaya**: Filter dikelompokkan berdasarkan Siklus Epos (Mahabharata vs Ramayana), Gagrag Tradisi (Surakarta, Yogyakarta, Banyumasan), dan Babak Lakon (Pathet Nem, Pathet Sanga, Pathet Manyura).
- **Babak Timeline Indicator**: Kartu lakon memuat indikator bar jumlah adegan, durasi, dan tombol aksi 1-klik "Mainkan di Panggung" yang otomatis membawa tokoh dan latar ke studio.
- **Interactive Puppet Anatomy Viewer**: Anotasi interaktif pada bagian tubuh wayang (gelung supit urang, pusaka panah pasopati, kampuh poleng, filosofi warna muka).
- **Acoustic Gamelan Visualizer**: Audio synthesizer gamelan real-time yang dapat dimainkan menggunakan tuts keyboard (1, 2, 3, Space).

### C. Halaman Studio Panggung Virtual (Virtual Kelir Stage Studio)
- **Theatrical Stage Framing**: Kanvas rasio aspek 16:9 dibingkai pigura kayu jati halus (Javanese Teak Frame) dengan kontrol pencahayaan blencong dinamis (malam temaram, fajar, kobaran perang).
- **Floating Dalang Toolbelt**: Palet kendali mengambang dekat tokoh aktif: Flip Hadap, Pilih Pose (Sembah/Perang/Terbang/Lungguh), Balon Dialog, dan Layering Z-Index.
- **Dalang Hotkeys & Virtual D-Pad**: Pengendalian posisi wayang menggunakan keyboard hotkeys (W, A, S, D & Arrow Keys) serta D-Pad sentuh di perangkat mobile.
- **Cinematic Timeline Composer**: Alur babak dalang divisualisasikan seperti gulungan naskah pementasan (Jejer Karaton -> Alas Roban -> Perang Kembang).
- **Dalang SFX Quick Pad**: Tombol pintas suara keprak: Dodogan (Space) dan Kepyak (Shift).
- **AR Wayang Integration**: Fitur penayangan wayang digital di dunia nyata berbasis WebAR.

### D. Halaman Galeri Publik (Connected Archive)
- **Hero Spotlight Teater Layar Lebar**: Menyorot pementasan terbaik bulan ini dengan tombol instan "Saksikan Pagelaran".
- **Leaderboard Dalang Kreator**: Apresiasi kreator dengan medali pusaka budaya (Pusaka Emas, Perak, Perunggu).
- **Apresiasi Budaya**: Mengganti tombol like generik dengan "Sembah Apresiasi" atau "Sawer Kembang Dalang" (memicu animasi taburan bunga melati dan kelopak kantil digital halus di atas kanvas).

### E. Halaman Karya Saya (My Works)
- **Dual Tab Jernih**: Tab "Lakon Saya" (draf kreasi pribadi) dan Tab "Pustaka Template Dalang" (naskah lakon siap pentas: Dewa Ruci, Gatotkaca Gugur, Karna Tandhing).
- **Offline Shield Indicator**: Status indikator "Tersimpan Aman di Peramban Anda (Offline-Ready)" dan tombol ekspor cadangan file JSON.

### F. Halaman Admin CMS (Pusat Kurasi Master Data)
- **7 Tab Master Data**: Tokoh Wayang, Lakon Cerita, Tata Suara/SFX, Kelir Panggung, Karya Pagelaran, Pengguna, dan Pengaturan Footer & Tim.
- **Pengaturan Footer & Tim**: Live preview miniatur kartu kreator berlatar panggung #fbf9f4, tombol ganda kapsul "Profil & Pose" + "Mainkan", master upload foto, dan scrollMarginTop: 100px agar tidak tertutup floating navbar saat navigasi mobile.

### G. Global Navigation & Heritage Footer
- **The Architect Navbar**: Lebar proporsional 1180px, background Dark Soga Glass dengan blur backdrop, deteksi scroll dinamis area terang/gelap, dan logo tipografi anggun.
- **The Heritage Footer**: Dilengkapi siluet gunungan kayon artistik, peta sanad pakem (Radyapustaka, Balai Pustaka, Keraton Surakarta & Yogyakarta), deklarasi warisan UNESCO, dan tautan modal anggota tim pengembang.

---

## 💻 5. ARSITEKTUR TEKNIS & INTEGRITAS SISTEM

### A. Frontend (React 19 & Vite)
- **Teknologi**: React 19, JavaScript (ESNext), Vite, Vanilla CSS / CSS inline terstruktur.
- **PANTANGAN MUTLAK**: DILARANG menginstal atau menggunakan Tailwind CSS kecuali diminta secara tertulis oleh pengguna.
- **State Management Panggung**: Menggunakan `useStageStore.js` (Zustand/Custom Hook) untuk mengelola active scene, tokoh aktif, posisi (x, y), rotasi, skala, balon dialog, dan export/import struktur scene_data.
- **Dual-Layer Persistence (Offline-First)**:
  - File `fe/src/services/persistenceService.js` SELALU memprioritaskan API backend, namun wajib memiliki fallback mulus ke localStorage jika server backend offline atau database belum termigrasi.
  - Alur pengguna tidak boleh macet, loading tanpa henti, atau crash hanya karena kendala jaringan backend.
- **Fail-Soft Web Audio Synthesis**:
  - Efek suara gamelan (dodogan, kepyak, gong) disintesis secara prosedural di browser melalui Web Audio API (`fe/src/services/soundscape.js`) untuk menjamin zero 404 audio assets.
- **Defensive Coding & Safe Null Checks**:
  - Semua array dan objek dinamis wajib menggunakan optional chaining (`?.`) dan fallback default (misal: `scene.characters || []`) untuk mencegah white screen of death.

### B. Backend (Laravel 11 & MySQL)
- Format respons REST API wajib JSON Envelope standar:
  {
    "success": true,
    "message": "Data berhasil dimuat",
    "data": { ... },
    "meta": { "total": 100, "page": 1 }
  }
- Validasi input menggunakan file FormRequest terpisah dan sanitasi dari serangan XSS.
- Validasi struktur JSON scene_data pada tabel performances.
- Seluruh operasi multi-tabel wajib dibungkus dalam DB::transaction.
- Hindari N+1 query dengan selalu menerapkan Eager Loading (with(['story', 'user', 'scenes'])).
- Sediakan endpoint observability kesehatan sistem di /api/health.

---

## 📋 6. DEFINITION OF DONE & STANDAR KUALITAS KODE (DoD)
Sebelum kamu mengonfirmasi bahwa tugas telah selesai, kamu wajib memvalidasi hal berikut:
1. **Zero Lint Warnings**: Perintah `npm --prefix fe run lint` wajib menghasilkan **0 error**.
2. **Production Build Clean**: Perintah `npm --prefix fe run build` wajib berhasil dikompilasi tanpa kendala sintaks atau dependensi.
3. **No Placeholders**: Kode harus ditulis tuntas dan lengkap. DILARANG memotong kode dengan komentar pemalas seperti `// rest of code here` atau `// implement logic here`.
4. **Visual & Responsive Verification**: Lakukan pengujian di browser (atau simulasi viewport mobile 375px/390px) untuk memastikan antarmuka benar-benar proporsional dan berfungsi sesuai harapan.

---

## 🚀 7. ALUR RILIS & DEPLOYMENT GITHUB (CI/CD)
Setelah kode selesai dimodifikasi dan semua pengujian lolos:
1. Jalankan `npm --prefix fe run lint` (0 error).
2. Jalankan `npm --prefix fe run build` (sukses).
3. Commit dan push ke branch kerja `feat/frontend-mvp`:
   git add .
   git commit -m "feat/fix: deskripsi perubahan kamu"
   git push origin feat/frontend-mvp
4. Merge ke branch `main` dan push untuk memicu otomatisasi deploy Vercel ke https://wayang-phi.vercel.app:
   git checkout main
   git merge feat/frontend-mvp
   git push origin main
   git checkout feat/frontend-mvp
5. Pastikan branch lokal kembali ke `feat/frontend-mvp` untuk sesi berikutnya.

---

## 📝 8. PROTOKOL INTERAKSI DENGAN PENGGUNA (USER INTERACTION)
1. **Berikan PLAN Terlebih Dahulu**: Setiap kali diminta mengerjakan fitur atau revisi baru, jangan langsung mengubah file. Analisis masalahnya, sebutkan file yang akan diubah beserta alasannya, dan berikan rencana kerja (plan) secara terstruktur.
2. **Tunggu Persetujuan**: Mulai eksekusi kode hanya setelah pengguna menyetujui plan tersebut.
3. **Laporkan Hasil Akhir**: Setelah selesai, jelaskan secara singkat apa yang telah diubah, bukti verifikasi keberhasilannya, dan link pengujian langsung.
