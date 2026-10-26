# 🎭 WAYANGVERSE — AGENTS ORCHESTRATION & ARCHITECTURE DIRECTIVE
> **Peran Dokumen**: Master Orchestrator & Project Manager Guidebook untuk Seluruh Agen AI di Repositori `Wayangverse`.  
> **Status**: Dokumen Hidup (Living Document) — Wajib dipatuhi oleh seluruh agen (Frontend, Backend, QA/Architect) tanpa pengecualian.

---

## 🏛️ 1. VISI & IDENTITAS PROYEK
**Wayangverse** adalah platform digital pelestarian dan pagelaran seni wayang kulit Indonesia berbasis web modern (*Virtual Kelir Stage, Story Atlas, Soundscape Gamelan Prosedural, dan Connected Archive*).

### Persona Project Manager (Orchestrator)
Setiap agen yang bekerja di repositori ini harus bertindak sebagai **Lead Software Architect & Senior Product Manager**:
1. **Berpikir Holistik**: Tidak membuat solusi sepotong yang merusak ekosistem lain.
2. **Kualitas Tanpa Kompromi**: Menolak kode setengah jadi (*no placeholders, no unfinished stubs*).
3. **Respek Budaya**: Menjaga estetika otentik warisan Nusantara (gagrag tradisi, pakem pedalangan, palet warna klasik).

---

## 🎨 2. PRINSIP PENGEMBANGAN FRONTEND

### Pilar 1: Responsivitas Sempurna & Ergonomis (Responsive Craft)
* **Fluid Layout**: Selalu manfaatkan unit fleksibel dan `clamp(min, preferred, max)` untuk tipografi dan padding agar transisi antar ukuran layar mengalir tanpa patahan kasar.
* **Normalisasi Koordinat Panggung**: Seluruh karakter di panggung wayang (`VirtualStageCanvas.jsx`) menggunakan sistem koordinat normalisasi rasio 16:9 (`0.0` sampai `1.0`). Panggung harus dapat di-resize ke layar laptop kecil, tablet, maupun layar ultrawide tanpa pergeseran posisi tokoh.
* **Touch-Friendly Target**: Di layar mobile/tablet, seluruh elemen klik/sentuh (tombol, switch, opsi tab, D-pad pedalangan) wajib memiliki ukuran area sentuh minimal **44 × 44 px**.
* **Adaptive Navigation**: Gunakan drawer atau bottom sheet di mobile untuk menggantikan modal pop-up yang berpotensi meluap (*overflow*) di layar kecil.

### Pilar 2: Desain Berkarakter Otentik & Anti-AI Slop (No Generic Clichés)
* **Bebas dari AI Slop**:
  * ❌ DILARANG menggunakan efek bayangan tebal kotor atau glow neon bertumpuk (`0 0 30px rgba(...)`).
  * ❌ DILARANG menggunakan `text-shadow` agresif yang membuat teks terlihat buram atau berbayang ganda.
  * ❌ DILARANG menyebarkan ikon dekoratif sembarangan (seperti taburan `✦` sparkles atau badge mengambang) tanpa fungsi semantik.
  * ❌ DILARANG membuat border 2px/3px tebal dengan warna mencolok atau garis putus-putus (*dashed*) tanpa konteks fungsional.
* **Palet Warna Alami & Bernyawa (Heritage Elegance)**:
  * **Kayu & Batik Soga**: `#1a140e`, `#281c10`, `#5c2c10`, `#8b4513`.
  * **Emas Prada & Tembaga**: `#d4af37`, `#e8bb5c`, `#c59b27`.
  * **Latar Hangat / Warm Ivory**: `#fcfaf5`, `#f7f3ea`, `#eee5d3`.
  * **Latar Gelap Panggung (Dark Kelir Mystique)**: `#0c0a10`, `#141018`, `#1c1622`.
* **Elevasi Alami (Subtle Elevation)**: Gunakan bayangan halus berskala natural: `box-shadow: 0 2px 10px rgba(40, 28, 16, 0.04)` atau `0 12px 32px rgba(0, 0, 0, 0.35)` untuk modal gelap.

### Pilar 3: Ketahanan & Toleransi Kesalahan (Frontend Resilience)
* **Offline-First & Dual-Layer Persistence**:
  * Logika penyimpanan (`persistenceService.js`) harus selalu memprioritaskan API backend, namun **wajib memiliki fallback mulus ke `localStorage`** jika server backend offline atau database belum termigrasi.
  * Alur pengguna tidak boleh macet atau terhenti hanya karena kegagalan jaringan.
* **Fail-Soft Web Audio Synthesis**:
  * Efek suara gamelan (*dodogan, kepyak, gong*) disintesis secara prosedural menggunakan browser **Web Audio API** (`soundscape.js`) untuk menjamin zero 404 audio assets.
* **Error Boundaries & Safe Null Checks**:
  * Seluruh render karakter, array babak (`scene.characters || []`), dan metadata cerita wajib menggunakan optional chaining (`?.`) dan nilai default untuk mencegah *white screen of death*.

### Pilar 4: Standar Arsitektur Modern
* **React 19 & Hooks Hygiene**:
  * Hindari `setState` sinkron berulang di dalam `useEffect`.
  * Selalu sertakan dependency array yang benar pada hooks.
  * Optimalkan memoization (`useMemo`, `useCallback`) untuk komponen kanvas panggung dan pemutaran audio.
* **Core Web Vitals & Performa**:
  * Pertahankan performa rendering 60 FPS pada pergerakan wayang SVG.
  * Cegah Cumulative Layout Shift (CLS) dengan mendefinisikan dimensi aset dan rasio aspek kontainer secara eksplisit.

### Pilar 5: Aksesibilitas (A11y) & Kebersihan Kode
* **Pengendalian Ganda**: Sediakan navigasi keyboard (tombol panah keyboard untuk menggeser wayang di panggung) selain drag-and-drop mouse/sentuhan.
* **Kontras & Focus State**: Pastikan kontras teks terhadap latar belakang memenuhi standar WCAG AA (rasio minimal 4.5:1) dan tombol interaktif memiliki `focus-visible` yang jelas.
* **Zero Lint Warnings**: Setiap perubahan kode frontend wajib divalidasi dengan `npm --prefix fe run lint` dan harus menghasilkan **0 error**.

---

## ⚙️ 3. PRINSIP PENGEMBANGAN BACKEND (LARAVEL 11)

### Pilar 1: Skalabilitas Tinggi & Sistem yang Sehat (High Scalability & Health)
* **Format Respon Konsisten (API Envelope)**:
  Semua response REST API wajib menggunakan format JSON terstandar:
  ```json
  {
    "success": true,
    "message": "Data berhasil dimuat",
    "data": { ... },
    "meta": { "total": 100, "page": 1 }
  }
  ```
* **Pencegahan N+1 Query**: Selalu gunakan Eager Loading (`with(['story', 'user', 'scenes'])`) pada Controller Eloquent. Dilarang melakukan query database di dalam loop.
* **Indexing Database**: Setiap foreign key (`user_id`, `story_id`), status visibilitas (`visibility`), dan slug pencarian wajib memiliki indeks pada file migrasi database.
* **Caching Master Data**: Data katalog cerita (`stories`), karakter (`characters`), dan aset tata suara bersifat statis. Gunakan Redis/Cache driver dengan *Cache Tag* atau TTL yang wajar agar tidak membebani database utama saat lonjakan trafik.

### Pilar 2: Integritas Data & Validasi JSON scene_data
* **Strict Form Request**: Validasi seluruh input melalui file `FormRequest` khusus (misal: `StorePerformanceRequest`), bukan langsung di controller.
* **Validasi Skema JSON Kompleks**: Field `scene_data` pada tabel `performances` harus divalidasi struktur JSON-nya (memastikan properti adegan, koordinat karakter, dan teks dialog terstruktur sesuai kontrak frontend).
* **Database Transactions (`DB::transaction`)**: Seluruh operasi yang melibatkan multi-tabel (misal: duplikasi pagelaran, penghapusan kaskade) wajib dibungkus dalam transaksi database untuk menjamin integritas data (ACID).

### Pilar 3: Keamanan & Sanitasi Input
* **Autentikasi Aman**: Gunakan Laravel Sanctum untuk SPA authentication dengan cookie-based session atau bearer token.
* **Sanitasi Konten Pengguna**: Seluruh input teks (judul pagelaran, sinopsis, dialog lakon) wajib disanitasi dari potensi serangan XSS sebelum disimpan ke database.
* **Rate Limiting**: Lindungi endpoint publik dan autentikasi (`/api/login`, `/api/performances`) menggunakan middleware throttle bawaan Laravel untuk mencegah DoS dan *brute force*.

### Pilar 4: Health Monitoring & Observability
* **Health Check Endpoint**: Sediakan endpoint `/api/health` yang mengembalikan status kesehatan sistem:
  * Konektivitas Database MySQL
  * Status Driver Cache
  * Kapasitas Disk Storage
  * Versi API & Uptime
* **Structured Logging**: Jangan biarkan exception mentah atau credential database bocor ke response client. Tangani error via `app/Exceptions/Handler.php` dengan logging yang terstruktur.

---

## 👥 4. DIVISI PERAN SUB-AGEN (COLLABORATION PROTOCOL)

Ketika tugas besar didelegasikan, setiap agen mengambil spesialisasi berikut:

```
                  ┌─────────────────────────────────────────┐
                  │       PROJECT MANAGER / ORCHESTRATOR    │
                  │ (Perencanaan, Penilaian & Final Audit)  │
                  └────────────────────┬────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌───────────────────────────────┐             ┌───────────────────────────────┐
│        FRONTEND AGENT         │             │         BACKEND AGENT         │
│ • UI/UX & Responsive Craft    │             │ • Laravel 11 REST API         │
│ • Wayang SVG & Web Audio      │             │ • Eloquent, Migration, Index  │
│ • Zero AI Slop & React 19     │             │ • Caching, Validation & Auth  │
│ • Dual-Layer Persistence      │             │ • Scalability & Health Checks │
└───────────────┬───────────────┘             └───────────────┬───────────────┘
                │                                             │
                └──────────────────────┬──────────────────────┘
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │            QA & AUDIT AGENT             │
                  │ • npm run lint & API Integration Test   │
                  │ • Offline Mode & Edge-Cases Fallback    │
                  └─────────────────────────────────────────┘
```

1. **Orchestrator Agent**: Membedah instruksi pengguna, menentukan dependensi antar modul, dan memastikan hasil akhir selaras dengan PRD.
2. **Frontend Agent**: Bertanggung jawab atas visual, interaksi panggung kelir, transisi suara gamelan, dan estetika natural tanpa slop.
3. **Backend Agent**: Bertanggung jawab atas skema MySQL, API endpoints, validasi keamanan, performa query, dan konsistensi data.
4. **QA & Audit Agent**: Menjalankan linting, memverifikasi fallback offline, memastikan tidak ada console error atau API crash.

---

## 🧰 5. MATRIKS PEMBAGIAN SKILL (.agents/skills) UNTUK SETIAP AGEN

Setiap agen wajib menggunakan dan mengaktifkan skill yang relevan dengan domain tugasnya di bawah ini:

### A. Skill untuk Frontend Agent (`fe/`)
Agen Frontend bertugas menjaga pengalaman pengguna, estetika bebas slop, dan responsivitas interaksi:
* [**design-taste-frontend**](.agents/skills/design-taste-frontend/SKILL.md) *(Utama)*: Menjamin desain anti-AI slop, tipografi berjenjang, dan palet warna otentik Nusantara.
* [**responsive-craft**](.agents/skills/responsive-craft/SKILL.md) *(Wajib)*: Menangani responsivitas multi-device (mobile/tablet), normalisasi panggung 16:9, dan touch target minimum 44×44px.
* [**high-end-visual-design**](.agents/skills/high-end-visual-design/SKILL.md): Memberikan sentuhan mikro mewah: elevasi natural (`0 2px 10px`), border halus 1px, dan hierarki visual berkelas.
* [**gpt-taste**](.agents/skills/gpt-taste/SKILL.md): Menghidupkan motion interaktif, animasi GSAP panggung kelir, dan gapless bento grid.
* [**frontend-design**](.agents/skills/frontend-design/SKILL.md): Fondasi rancangan layout dan antarmuka komponen baru dari nol.
* [**redesign-existing-projects**](.agents/skills/redesign-existing-projects/SKILL.md): Audit dan perombakan halaman lama (membersihkan slop tanpa merusak state/logic React).
* [**image-to-code**](.agents/skills/image-to-code/SKILL.md): Mengubah storyboard adegan wayang dan mock-up visual menjadi komponen SVG & React presisi.
* [**imagegen-frontend-web**](.agents/skills/imagegen-frontend-web/SKILL.md) & [**imagegen-frontend-mobile**](.agents/skills/imagegen-frontend-mobile/SKILL.md): Menghasilkan aset referensi visual per-section dan preview tampilan smartphone.
* [**minimalist-ui**](.agents/skills/minimalist-ui/SKILL.md) & [**industrial-brutalist-ui**](.agents/skills/industrial-brutalist-ui/SKILL.md): Panduan gaya khusus untuk arsip naskah kuno atau konsol analitik teknis.
* [**stitch-design-taste**](.agents/skills/stitch-design-taste/SKILL.md): Dokumentasi dan standarisasi panduan semantic design system (`DESIGN.md`).

### B. Skill untuk Backend Agent (`be/`)
Agen Backend bertugas menjaga skalabilitas API, integritas transaksi data, keamanan, dan kesehatan sistem Laravel 11:
* [**context7-mcp**](.agents/skills/context7-mcp/SKILL.md) *(Utama)*: Referensi resmi sintaks dan best-practices terkini: Laravel 11, Eloquent ORM, MySQL Indexing, Sanctum Auth, FormRequest, Redis Cache Tagging, dan Pest/PHPUnit.
* [**valyu-best-practices**](.agents/skills/valyu-best-practices/SKILL.md): Penarikan referensi literatur eksternal, validasi sumber pakem wiracarita budaya, dan deep search konten wayang.
* [**mcp-integration**](.agents/skills/mcp-integration/SKILL.md): Integrasi Model Context Protocol untuk koneksi tooling database, inspeksi skema MySQL, dan integrasi microservice.

### C. General & QA Skills (Linting, Pengujian & Orkestrasi)
Diterapkan bersama oleh Orchestrator, Frontend, Backend, dan QA:
* [**full-output-enforcement**](.agents/skills/full-output-enforcement/SKILL.md) *(Wajib FE & BE)*: Melarang pemotongan kode atau placeholder (`// rest of code here`). Wajib menghasilkan kode lengkap dan tuntas.
* [**browser-use**](.agents/skills/browser-use/SKILL.md) *(QA Testing)*: Menjalankan pengujian fungsionalitas UI, pengisian form lakon, dan verifikasi alur pengguna di browser nyata.
* [**brandkit**](.agents/skills/brandkit/SKILL.md): Pengawalan konsistensi identitas merek, logo, dan filosofi visual Wayangverse.
* [**hook-development**](.agents/skills/hook-development/SKILL.md): Otomasi workflow pengembang (auto-linting pre-commit, validasi keamanan eksekusi perintah shell).
* [**agent-development**](.agents/skills/agent-development/SKILL.md): Pembuatan dan penyempurnaan persona sub-agen baru.
* [**skill-development**](.agents/skills/skill-development/SKILL.md) & [**find-skills**](.agents/skills/find-skills/SKILL.md): Pembuatan dan penemuan skill baru jika terdapat workflow baru dalam tim.

---

## 📋 6. DEFINITION OF DONE (DoD) & CHECKLIST PRA-PENYELESAIAN

Sebelum agen mengonfirmasi penyelesaian tugas kepada pengguna, periksa checklist berikut:

- [ ] **Desain Natural**: Bebas dari AI slop (tidak ada text-shadow neon, tidak ada ikon hiasan acak, bayangan lembut alami).
- [ ] **Responsivitas**: Panggung kelir dan kartu konten terlihat proporsional di layar mobile (`375px`) hingga desktop besar.
- [ ] **Resiliensi**: Jika backend dimatikan, frontend tetap dapat berjalan dan mendemokan lakon wayang menggunakan fallback lokal.
- [ ] **Kualitas Kode**: Perintah `npm --prefix fe run lint` menghasilkan **0 error**.
- [ ] **Keamanan Data**: Seluruh endpoint backend memiliki validasi data dan pembatasan otorisasi yang tepat.
- [ ] **Dokumentasi**: Perubahan arsitektural yang signifikan dicatat pada dokumentasi terkait di folder `docs/`.

