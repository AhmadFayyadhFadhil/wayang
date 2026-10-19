# 🎭 WAYANGVERSE — FRONTEND ARCHITECT & AGENT DIRECTIVE
> **Master Directive**: Dokumen ini merupakan pedoman teknis mendalam dan spesifik frontend yang diturunkan langsung dari [**`AGENTS.md`**](file:///d:/Wayang/AGENTS.md) di root workspace.  
> **Target Pengguna**: Seluruh Agen AI yang bekerja pada folder `fe/` (React 19 + Vite + Web Audio API).  
> **Status**: Dokumen Operasional Wajib — Tidak ada toleransi untuk pelanggaran prinsip estetika, responsivitas, atau ketahanan sistem.

---

## 🏛️ 1. VISI TEKNIS & PERAN FRONTEND AGENT

Sebagai **Lead Frontend Architect** di Wayangverse, Anda bertanggung jawab menghidupkan warisan adiluhung wayang kulit Jawa ke dalam pengalaman web modern berstandar internasional. 

Karya Anda dinilai dari 3 aspek fundamental:
1. **Keaslian & Jiwa Budaya (*Cultural Soul*)**: Visual harus merefleksikan keanggunan seni klasik Nusantara (Batik Soga, Prada Emas, Wayang Kulit Tatah Sungging, Lampu Blencong) — bukan sekadar template web generik.
2. **Kerapian Rekayasa (*Engineering Elegance*)**: Bebas AI slop, performa rendering kanvas 60 FPS, koordinat panggung 16:9 yang matematis, dan zero error linter.
3. **Resiliensi Tanpa Henti (*Unbreakable Frontend*)**: Web harus dapat beroperasi penuh dan mendemokan lakon bahkan saat backend Laravel dimatikan atau koneksi internet terputus (*Offline-First*).

---

## 🧰 2. PANDUAN PENGGUNAAN SKILL RESMI (.agents/skills)

Ketika menangani task frontend, agen wajib mengaktifkan skill spesifik sesuai konteks tugas:

| Skenario Kerja | Skill Wajib | Panduan Penerapan |
| :--- | :--- | :--- |
| **Membangun Halaman Baru / Feature Baru** | [**design-taste-frontend**](file:///d:/Wayang/.agents/skills/design-taste-frontend/SKILL.md) | Mencegah layout klise, mengatur tipografi berjenjang, dan menerapkan palet warna Nusantara. |
| **Perbaikan Tampilan Mobile / Responsif** | [**responsive-craft**](file:///d:/Wayang/.agents/skills/responsive-craft/SKILL.md) | Menerapkan `clamp()`, audit touch target 44×44px, bottom sheet drawer, dan uji layar 375px hingga 1440px. |
| **Penyempurnaan Detail & Visual Mewah** | [**high-end-visual-design**](file:///d:/Wayang/.agents/skills/high-end-visual-design/SKILL.md) | Menghilangkan bayangan kotor, menerapkan border mikro 1px natural, dan menyusun whitespace yang lega. |
| **Animasi Panggung & Bento Grid Interaktif** | [**gpt-taste**](file:///d:/Wayang/.agents/skills/gpt-taste/SKILL.md) | Motion GSAP halus, transisi spring natural, dan penyusunan grid dinamis tanpa celah kosong. |
| **Refactoring & Pembersihan AI Slop** | [**redesign-existing-projects**](file:///d:/Wayang/.agents/skills/redesign-existing-projects/SKILL.md) | Audit visual komponen lama, membersihkan glow/stroke berlebih tanpa merusak state React dan event listener. |
| **Konversi Mockup / Sketsa Panggung** | [**image-to-code**](file:///d:/Wayang/.agents/skills/image-to-code/SKILL.md) | Mengubah gambar referensi tokoh / storyboard babak menjadi kode komponen SVG dan JSX presisi. |
| **Penulisan Kode Lengkap** | [**full-output-enforcement**](file:///d:/Wayang/.agents/skills/full-output-enforcement/SKILL.md) | Melarang keras pemotongan kode (`// ... rest of code`). Seluruh file yang diedit wajib lengkap 100%. |
| **Validasi & Verifikasi Antarmuka** | [**browser-use**](file:///d:/Wayang/.agents/skills/browser-use/SKILL.md) | Pengujian fungsionalitas UI, drag-and-drop wayang, dan navigasi alur dalang di browser nyata. |

---

## 🎨 3. STANDAR DESAIN ANTI-AI SLOP & DESIGN TOKENS

### A. Daftar Larangan Keras (Banned AI Slop Clichés)
* ❌ **DILARANG Glow Neon & Bayangan Bertumpuk**: Hapus `box-shadow: 0 0 30px rgba(...)` atau halo warna-warni pada tombol/kartu.
* ❌ **DILARANG Text-Shadow Agresif**: Jangan menambahkan `text-shadow` hitam pekat atau berwarna yang membuat teks tampak buram dan kotor.
* ❌ **DILARANG Ikon Hiasan Sembarangan**: Hapus taburan ikon dekoratif `✦` (sparkles) atau badge mengambang yang tidak memiliki aksi fungsional.
* ❌ **DILARANG Stroke & Border Tebal 2px/3px Mencolok**: Jangan gunakan border tebal atau garis putus-putus (*dashed line*) tanpa konteks fungsional.
* ❌ **DILARANG Fake Glassmorphism Berlebihan**: Hindari kartu putih transparan buram bertumpuk-tumpuk dengan border putih tebal. Gunakan kontras latar belakang alami.

### B. Palet Warna Resmi Wayangverse (Heritage Color System)
Gunakan token warna berikut pada seluruh styling:
```css
/* Palet Latar & Kontras Alami */
--bg-stage-dark: #0c0a10;        /* Malam Panggung Kelir */
--bg-stage-surface: #141018;     /* Surface Panggung & Panel Dalang */
--bg-stage-card: #1c1622;        /* Kartu Gelap Panggung */
--bg-warm-ivory: #fcfaf5;        /* Latar Terang Kertas Daluang Kuno */
--bg-warm-sand: #f7f3ea;         /* Surface Lembut Kartu Terang */
--bg-warm-border: #eee5d3;       /* Border Halus Latar Terang */

/* Palet Tradisi (Kayu & Batik Soga) */
--soga-deep: #1a140e;            /* Teks Utama Gelap Alami */
--soga-wood: #281c10;            /* Bingkai Kayu & Heading */
--soga-leather: #5c2c10;         /* Aksen Kulit Tatah */
--soga-brown: #8b4513;           /* Brand Sekunder & Badge Tradisi */

/* Palet Keagungan (Emas Prada & Logam Gamelan) */
--gold-prada: #d4af37;           /* Emas Prada Murni */
--gold-light: #e8bb5c;           /* Aksen Hover & Highlight */
--gold-amber: #c59b27;           /* Emas Tua / Tembaga */
```

### C. Elevasi & Bayangan Alami (Natural Elevation)
Gunakan formula bayangan berskala organik:
* **Kartu Terang**: `box-shadow: 0 2px 10px rgba(40, 28, 16, 0.04);`
* **Kartu Gelap**: `box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);`
* **Modal Dialog**: `box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);`
* **Border Standar**: `1px solid rgba(0, 0, 0, 0.06)` (Light) atau `1px solid rgba(212, 175, 55, 0.2)` (Dark).

---

## 📐 4. ARSITEKTUR RESPONSIF & KANVAS PANGGUNG 16:9

### A. Sistem Koordinat Normalisasi Panggung (`0.0` sampai `1.0`)
Di komponen [**`VirtualStageCanvas.jsx`**](file:///d:/Wayang/fe/src/features/stage/VirtualStageCanvas.jsx), posisi karakter **TIDAK BOLEH** disimpan dalam satuan piksel tetap (`px`).
* **Koordinat X**: `0.0` (ujung kiri kelir) hingga `1.0` (ujung kanan kelir).
* **Koordinat Y**: `0.0` (atas kelir) hingga `1.0` (dasar batang pisang / debog).
* **Penskalaan Otomatis**: Posisi piksel dihitung dinamis berdasarkan ukuran kontainer kanvas saat ini:
  ```javascript
  const pixelX = character.x * stageWidth;
  const pixelY = character.y * stageHeight;
  ```
* **Rasio Aspek Terkunci (16:9)**: Kontainer panggung wajib menjaga rasio `aspect-ratio: 16 / 9` dengan `max-width: 100%` agar seluruh babak terlihat identik di layar smartphone (`375px`), laptop (`1366px`), maupun desktop ultrawide.

### B. Ergonomi Sentuh & Pola Mobile
* **Touch Target**: Seluruh tombol, tombol D-pad, tab lakon, dan handle slider wajib memiliki area sentuh minimal **44 × 44 px**.
* **Drawer Menggantikan Modal di Mobile**: Di layar `< 768px`, panel inspektor lakon dan dialog pedalangan harus ditampilkan sebagai bottom sheet / drawer geser, bukan pop-up modal di tengah layar yang rentan terpotong (*overflow*).
* **Fluid Typography**: Manfaatkan `clamp()` untuk ukuran judul utama:
  ```css
  font-size: clamp(1.75rem, 4vw + 1rem, 3.25rem);
  ```

---

## 🛡️ 5. KETAHANAN SISTEM (FRONTEND RESILIENCE & OFFLINE-FIRST)

### A. Dual-Layer Persistence (`persistenceService.js`)
Frontend dirancang dengan prinsip **Zero Failure Demonstration**:
1. Setiap aksi simpan/ambil data pagelaran selalu mencoba endpoint backend `/api/performances`.
2. Jika backend offline, mengembalikan error `500`, atau database belum siap:
   - Logika persistensi **segera beralih ke `localStorage`** tanpa memunculkan crash / layar putih.
   - User diberikan feedback halus (*soft notification*), bukan dialog error yang mematikan alur aplikasi.
3. Selalu sediakan *seed demo works* awal agar halaman galeri ([**`ConnectedArchiveView.jsx`**](file:///d:/Wayang/fe/src/features/story/ConnectedArchiveView.jsx)) dan studio pagelaran tidak pernah kosong saat pertama kali dibuka.

### B. Fail-Soft Web Audio Synthesis (`soundscape.js`)
* **Zero 404 Audio Policy**: Tidak bergantung pada file `.mp3` eksternal yang rentan gagal dimuat karena jaringan lambat.
* **Prosedural Synthesis**: Menggunakan **Web Audio API** native browser:
  - **Dodogan**: Osilator sinus frekuensi rendah (60–120 Hz) dengan decay cepat menyimulasikan ketukan kayu cempala dalang ke kotak wayang.
  - **Kepyak**: Noise generator frekuensi tinggi yang difilter bandpass menyimulasikan lempengan logam perunggu.
  - **Gong Ageng**: Osilator sub-bass termodulasi dengan reverb natural menyimulasikan gaung gong perunggu kuno.
  - **Tangga Nada Slendro & Pelog**: Formula frekuensi matematis nada pentatonis gamelan Jawa.

### C. Safe Null-Checking & Error Boundaries
* Setiap mapping array tokoh, babak cerita, atau opsi musik **wajib** menggunakan fallback array:
  ```javascript
  const characters = scene?.characters || [];
  const scenes = performance?.scenes || [];
  ```
* Hindari memanggil properti bersarang tanpa optional chaining: gunakan `activeScene?.characters?.[0]?.dialogue`.

---

## ⚡ 6. PRAKTIK REACT 19 & KEBERSIHAN KODE

1. **Hooks Hygiene**:
   - Dilarang memanggil `setState` secara sinkron langsung di dalam tubuh `useEffect` jika dapat diturunkan langsung (*derived state*) atau dipicu dari event pengguna.
   - Selalu deklarasikan dependensi `useEffect`, `useCallback`, dan `useMemo` dengan benar.
2. **State Management Terpusat (Zustand)**:
   - State aktif pagelaran dikelola via [**`useStageStore.js`**](file:///d:/Wayang/fe/src/features/stage/useStageStore.js).
   - Hindari *prop drilling* lebih dari 2 tingkat untuk data panggung.
3. **Linting Mandat (0 Warnings, 0 Errors)**:
   - Setiap perubahan kode frontend wajib diuji dengan:
     ```bash
     npm --prefix fe run lint
     ```
   - **Toleransi 0 Error**: Jangan menyerahkan pekerjaan kepada pengguna sebelum linter menghasilkan exit code `0`.

---

## 📋 7. STRUKTUR DIREKTORI FRONTEND (`fe/src`)

```
fe/src/
├── assets/                  # Citra tekstur kelir, avatar tokoh, latar panggung
├── components/
│   ├── layout/              # Navbar.jsx, Footer.jsx
│   ├── stage/               # WayangFigureSvg.jsx, BlencongLightEffect.jsx
│   └── ui/                  # AnimatedCounter.jsx, ConfettiOverlay.jsx
├── data/
│   └── master/              # storiesMaster.js, charactersMaster.js, audioMaster.js
├── features/
│   ├── admin/               # AdminCmsView.jsx
│   ├── auth/                # AuthModal.jsx
│   ├── encyclopedia/        # AtlasView.jsx (Story Atlas & Katalog Tokoh)
│   ├── home/                # HomeView.jsx, GununganOpeningOverlay.jsx
│   ├── stage/               # VirtualStageCanvas.jsx, SceneComposer.jsx, StageStudio.jsx,
│   │                        # MyWorksView.jsx, StagePreviewModal.jsx, SavePerformanceModal.jsx
│   └── story/               # ConnectedArchiveView.jsx (Galeri Pagelaran)
└── services/
    ├── api.js               # Klien HTTP Axios dengan konfigurasi interceptor
    ├── persistenceService.js# Dual-Layer Persistence (API + LocalStorage Fallback)
    └── soundscape.js        # Synthesizer Web Audio API Gamelan Prosedural
```

---

## ✅ 8. CHECKLIST SELESAI TUGAS (FRONTEND DoD)

Sebelum menyatakan tugas frontend selesai, pastikan checklist ini terpenuhi:
- [ ] Tampilan bersih dari efek AI slop (tidak ada text-shadow tebal, tidak ada border neon, tidak ada ikon hiasan acak).
- [ ] Kanvas panggung 16:9 mempertahankan posisi tokoh secara proporsional di seluruh ukuran layar.
- [ ] Tombol dan elemen interaktif memenuhi ukuran minimum sentuh 44×44px di mobile.
- [ ] Fitur tetap berfungsi normal meskipun koneksi ke backend diputus (*offline persistence fallback* aktif).
- [ ] Synthesizer Web Audio gamelan berbunyi tanpa melempar error di konsol browser.
- [ ] Menjalankan `npm --prefix fe run lint` dan menghasilkan status **0 error**.
