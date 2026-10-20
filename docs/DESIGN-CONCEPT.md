# 🎭 WAYANGVERSE — MASTER UI/UX REDESIGN BLUEPRINT & CONCEPT
> **Dokumen**: `DESIGN-CONCEPT.md`  
> **Status**: Dokumen Visi & Arsitektur Desain (Design Direction & Concept Specification)  
> **Otoritas**: Lead Product Designer & Frontend Creative Director  
> **Tujuan**: Transformasi menyeluruh antarmuka & pengalaman pengguna (*UI/UX*) Wayangverse dari kesan "web generik/AI template" menjadi **Platform Teater Warisan Nusantara Kelas Dunia (Awwwards / Museum-Grade Digital Experience)**.

---

## 🏛️ 1. DESIGN READ & CREATIVE MANIFESTO

### 1.A Design Read (Sesuai `design-taste-frontend` & `brandkit`)
> **Reading this as**: *Platform preservasi dan kreasi budaya imersif (Digital Heritage Theater) untuk penikmat seni, kreator muda, dan akademisi budaya global, dengan bahasa visual **Living Kelir Mystique (Teater Bayangan Malam & Emas Prada Keraton)**, memadukan materialitas kain mori, pendaran api minyak blencong, kayu soga berukir, serta aksen vermillion cinnabar yang dramatis.*

### 1.B The Three Dials Configuration
Berdasarkan kebutuhan platform seni interaktif berkelas tinggi:
* **`DESIGN_VARIANCE: 8`** — Asimetri artistik, komposisi bernapas, melarang tata letak klise simetris kaku.
* **`MOTION_INTENSITY: 7`** — Animasi bergaya *choreographed dalang motion*, transisi spring lembut, dan dynamic bento interlocking.
* **`VISUAL_DENSITY: 4`** — Whitespace lega (*Art Gallery / Museum Airy*), melarang penumpukan kotak-kotak kecil yang sesak.

---

## 🎨 2. SISTEM WARNA & PALET BARU (*BEYOND MONOTONOUS BROWN*)

### Masalah Palet Saat Ini:
Palet saat ini terlalu terjebak dalam warna cokelat perkamen krem dan kuning mustard yang datar (*washed-out warm monochrome*). Di panggung wayang kulit yang sesungguhnya, atmosfer pertunjukan kaya akan kontras dramatis antara **kegelapan malam**, **pendar hangat minyak kelapa**, **kilau prada emas murni**, dan **warna pigmen mineral kuno (merah cinnabar, nila nila/indigo, dan hitam arang jelaga)**.

### Master Palette: "The Midnight Kelir & Royal Prada"
```css
:root {
  /* ========================================================
     1. LATAR BELAKANG & KEDALAMAN (ATMOSPHERIC DEPTH)
     ======================================================== */
  --kelir-void: #07050a;          /* Kegelapan mutlak ruang dalang */
  --kelir-night: #0e0a14;         /* Malam panggung kelir mistis */
  --kelir-surface: #15101e;       /* Surface panel studio, kartu gelap, drawer */
  --kelir-card: #1c1628;          /* Surface kartu interaktif dengan kedalaman */
  --kelir-border: rgba(212, 175, 55, 0.16); /* Garis batas tipis 1px emas tembaga */

  /* ========================================================
     2. LATAR TERANG MORI & DALUANG (ARCHIVE / READING SECTIONS)
     ======================================================== */
  --mori-pure: #faf6ee;           /* Kain mori putih kelir alami (bukan putih steril) */
  --mori-linen: #f4ede0;          /* Kertas daluang naskah serat purwa */
  --mori-surface: #eee5d3;        /* Kartu arsip terang & filter chip */
  --mori-text-primary: #18120c;   /* Tinta soga pekat (kontras tajam WCAG AAA) */
  --mori-text-secondary: #5c4b3a; /* Keterangan narasi & filosofi */

  /* ========================================================
     3. WARNA SIMBOLIK & AKSI (ROYAL ACCENTS)
     ======================================================== */
  --prada-gold-pure: #d4af37;     /* Emas prada murni keraton (Primary Accent) */
  --prada-gold-glow: #f0c952;     /* Sorot cahaya blencong & hover highlight */
  --prada-copper: #b8861d;        /* Tembaga gamelan & ornamen aksen sekunder */
  
  /* Pigmen Dramatis Lakon (Aksen Emosional untuk Adegan & Kategori) */
  --cinnabar-red: #c84b31;        /* Simbol watak ksatria gagah / perang Kurusetra */
  --royal-indigo: #2d3b66;        /* Simbol kebijaksanaan dewa & semak samudra */
  --emerald-forest: #235347;      /* Simbol wana/alas Dandaka & ketenangan batin */
}
```

---

## ✍️ 3. ARSITEKTUR TIPOGRAFI (*EDITORIAL HERITAGE*)

Mengganti font sans-serif generik SaaS dengan **duet tipografi yang berjiwa sastra luhur**:
1. **Display Heading Font**: `Cinzel Decorative` / `Playfair Display` / `Cormorant Garamond`
   - *Karakteristik*: Tajam, bertaji klasik (*serif with chisel-cut terminals*), mencerminkan tatah kulit dan prasasti naskah lontar.
   - *Aturan Ketat*: Judul hero maksimal 2–3 baris di desktop, `letter-spacing: -0.02em`, `line-height: 1.15`.
2. **Body & Interface Font**: `Plus Jakarta Sans` / `Outfit`
   - *Karakteristik*: Geometris modern dengan keterbacaan tinggi (*high legibility*) pada ukuran kecil (11px–15px).
   - *Angka & Metrik*: Wajib menggunakan `font-variant-numeric: tabular-nums` agar animasi countdown tidak bergeser horizontal (*zero layout jitter*).

---

## 🔎 4. ANALISA MENDALAM SELURUH HALAMAN (CURRENT FLAWS & REDESIGN BLUEPRINT)

---

### A. Halaman Beranda (Home / Landing View)

#### 🔴 Masalah UI/UX Saat Ini:
1. **Hero "Stiker Tempel"**: Dua gunungan di sisi kiri & kanan terasa seperti clipart simetris yang dipasang kaku di pojok, dan tiang bawahnya terpotong oleh cardbox.
2. **Navbar Mengambang Terlalu Kapsul**: Bentuk kapsul penuh (`9999px`) di navbar dan tombol login bersaing dengan tombol CTA di Hero.
3. **Cardbox Terjepit**: Box metrik 3 kolom mengambang tepat di perbatasan layar, memotong transisi pandangan pengguna ke bagian cerita di bawahnya.
4. **Kebocoran Kode PRD/SRS di UI**: Kartu fitur menggunakan label teknis internal `(PR-01)`, `(PR-02)`, `(PR-04)` yang merusak citra panggung budaya. *(Sudah dibersihkan menjadi Studio Panggung Kelir, Pustaka & Sanad Pakem, Tata Suara Gamelan Slendro)*.
5. **Kelelahan Interaksi: Accordion Kembar Berturut-Turut**: Section Tokoh Wayang menggunakan horizontal expanding accordion, dan tepat di bawahnya Section Leaderboard Top 4 menggunakan horizontal accordion yang sama persis. Teks vertikal 180° di kartu tidak aktif juga sulit dibaca.
6. **Formula Copywriting Repetitif**: Judul section mengulang rumus "Teks gelap + 1 kata terakhir kuning emas" di 5 section dan tombol seragam "Selengkapnya".

#### 🟢 Blueprint Redesain Beranda:
* **Komposisi Hero "The Living Kelir"**:
  - Gunakan **satu panggung kelir bernapas**: pendaran cahaya lampu *Blencong* berdenyut sangat lambat di tengah kelir mori.
  - Alih-alih 2 gunungan kaku di pojok, letakkan satu Gunungan Kayon megah semi-transparan sebagai poros tengah (*axis mundi*) yang terangkat perlahan ke atas saat halaman dimuat (*tancep kayon reveal*).
  - Judul menggunakan Display Serif keemasan dengan kontras tinggi terhadap latar malam.
* **Transisi Cardbox Menjadi "Debog Stage Console"**:
  - Cardbox diintegrasikan sebagai "batang debog" (pijakan pisang dalang tempat menancapkan wayang) dengan kayu soga gelap bertekstur, garis aksen tembaga 1px, dan divider kolom tipis yang anggun.
* **Tiga Pilar Ekosistem (Cultural Heritage Teasers)**:
  - Menggantikan kotak SaaS putih statis dengan cuplikan hidup: preview mini kanvas kelir, lembar serat pustaka naskah purwa, dan visualizer audio laras slendro.
* **Pemisahan Desain: Tokoh Wayang vs. Leaderboard Top 4**:
  - **Tokoh Wayang (Interactive Wayang Showcase)**: Menampilkan visual tokoh wanda klasik beresolusi tinggi dengan aura warna watak (tembaga keberanian Gatotkaca, emas ketenangan Arjuna, gading Shinta) dan tombol tactile untuk menguji solah/pose gerak.
  - **Leaderboard Top 4 (Theatrical Exhibition Wall)**: Dirombak agar TIDAK kembar accordion. Menggunakan format *Curated Exhibition Wall / Chronicle Cards* bertingkat dengan medali pusaka, durasi babak, nama dalang kreator, dan audio preview cuplikan pertunjukan.
* **Asymmetric Bento Lakon**:
  - Format grid dinamis 2+1: Kartu 1 berukuran besar (menampilkan lakon unggulan dengan cuplikan visual panggung aktif), Kartu 2 menampilkan kutipan filosofis dalang, Kartu 3 menampilkan audio gending cuplikan babak.

---

### B. Halaman Story Atlas (Ensiklopedia & Master Data)

#### 🔴 Masalah UI/UX Saat Ini:
1. **Filter Chips Berantakan**: Deretan filter chip abu-abu terasa datar dan monoton; sulit membedakan antara filter lakon wiracarita, filter kasta tokoh, dan filter tata suara.
2. **Kartu Lakon Monoton**: Kartu cerita hanya berupa kotak putih dengan teks panjang, kurang memvisualisasikan babak pementasan dan gaya gagrag dalang.
3. **Audio Player Terisolasi**: Bagian tata suara hanya berupa daftar tombol klik tanpa visualisasi gelombang suara (*waveform*) gamelan atau penjelasan tangga nada Slendro/Pelog.

#### 🟢 Blueprint Redesain Story Atlas:
* **Navigasi Tab Bergaya "Katalog Arsip Karaton"**:
  - Header dengan 3 pilar jelas: **Lakon Wiracarita**, **Karakter Wayang**, dan **Gamelan & Soundscape**.
  - Filter interaktif dikelompokkan secara semantik: *Berdasarkan Siklus Epos* (Mahabharata vs Ramayana), *Berdasarkan Gagrag* (Surakarta, Yogyakarta, Banyumasan), dan *Berdasarkan Babak* (Pathet Nem, Pathet Sanga, Pathet Manyura).
* **Story Cards dengan "Babak Timeline Indicator"**:
  - Setiap kartu lakon menampilkan indikator mini bar jumlah babak (misal: 3 babak) dengan estimasi durasi dan tingkat kedramatisan lakon.
  - Tombol aksi *"Mainkan di Panggung"* membawa metadata lakon langsung ke studio kanvas dalam 1 klik.
* **Interactive Wayang Puppet Anatomy Viewer**:
  - Saat melihat tokoh (misal: Raden Arjuna), pengguna dapat mengarahkan kursor ke bagian tubuh wayang untuk melihat anotasi budaya: *gelung supit urang*, pusaka *panah pasopati*, kain *kampuh poleng*, dan filosofi watak ksatria.
* **Acoustic Gamelan Visualizer**:
  - Setiap instrumen gamelan (Gong, Kepyak, Dodogan, Kendhang) memiliki representasi visual interaktif dengan audio synthesizer real-time yang dapat dibunyikan langsung menggunakan tuts keyboard (tombol `1`, `2`, `3`, `Space`).

---

### C. Halaman Studio Panggung Virtual (Virtual Kelir Stage Studio)

#### 🔴 Masalah UI/UX Saat Ini:
1. **Workspace Terlalu Gelap Gulita & Sesak**: Batas antara area kontrol dan kanvas panggung 16:9 belum memiliki pemisahan ruang bernapas yang jelas.
2. **Scene Composer Timeline Terlihat Kaku**: Timeline adegan di bawah kanvas terasa seperti tombol angka biasa, kurang mencerminkan alur cerita pedalangan yang mengalir.
3. **Manipulasi Karakter Kurang Intuitif di Mobile**: Di layar sentuh, memutar atau mengubah skala wayang masih membutuhkan kontrol presisi yang sulit dijangkau jari.

#### 🟢 Blueprint Redesain Panggung Virtual:
* **Theatrical Stage Framing**:
  - Kanvas 16:9 diberi bingkai pigura kayu jati halus (*Javanese Teak Frame*) dengan pendaran cahaya lampu Blencong dinamis yang intensitas dan sudut cahayanya dapat diatur oleh Dalang (efek malam temaram, fajar, atau kobaran api perang *Gugur*).
* **Floating Dalang Toolbelt (Ergonomic Inspector)**:
  - Tool kontrol tokoh yang sedang dipilih mengambang anggun di dekat tokoh tersebut: tombol *Flip Hadap*, *Pilih Pose (Sembah/Perang/Terbang)*, *Balon Dialog*, dan *Layering Z-Index*.
  - Sediakan **D-Pad Virtual & Keyboard Hotkeys (`W, A, S, D` & Arrow Keys)** yang responsif dengan haptic visual feedback.
* **Cinematic Timeline Composer (Alur Babak Dalang)**:
  - Timeline adegan divisualisasikan seperti gulungan naskah lakon: Adegan 1 (*Jejer Karaton*), Adegan 2 (*Alas Roban*), Adegan 3 (*Perang Kembang*), lengkap dengan durasi transisi dan indikator instrumen gamelan latar.
* **Dalang SFX Quick Pad**:
  - Panel tombol pintas di bawah kanvas untuk memukul **Dodogan** (`Space`) dan **Kepyak** (`Shift`), memberikan sensasi memimpin pagelaran wayang secara nyata.

---

### D. Halaman Galeri Publik (Connected Archive)

#### 🔴 Masalah UI/UX Saat Ini:
1. **Desain Terlalu Mirip Grid Kartu Biasa**: Galeri pertunjukan pengguna terlihat seperti galeri blog biasa, kehilangan aura "Pagelaran Akbar".
2. **Banner Atribusi Budaya Terlalu Kaku**: Peringatan tentang interpretasi kreatif pengguna terasa seperti kotak peringatan sistem (*disclaimer*), bukan edukasi etika budaya yang mengayomi.

#### 🟢 Blueprint Redesain Galeri Publik:
* **Hero Spotlight Pementasan Terbaik Bulan Ini**:
  - Karya dalang terbaik ditampilkan dalam banner teater layar lebar dengan tombol *"Saksikan Pagelaran"* instan.
* **Leaderboard Dalang Kreator yang Berwibawa**:
  - Peringkat kreator disusun dengan medali bergaya pusaka budaya (Pusaka Emas, Perak, Perunggu), menampilkan jumlah pagelaran diciptakan dan apresiasi penonton.
* **Apresiasi Penonton Berbasis Budaya**:
  - Mengganti tombol "Like" generik dengan aksi *"Sembah Apresiasi"* atau *"Sawer Kembang Dalang"*, yang memicu animasi taburan bunga melati dan kelopak kantil digital halus di atas kanvas pertunjukan.

---

### E. Halaman Karya Saya (My Works & Starter Templates)

#### 🔴 Masalah UI/UX Saat Ini:
1. **Pemisahan Antara Karya Sendiri dan Template Pemula Membingungkan**: Pengguna baru bingung harus mulai dari mana saat membuka halaman ini.
2. **Ketergantungan Pada Backend**: Saat backend mati, indikator koneksi sering menimbulkan kecemasan pengguna meskipun data lokalnya tersimpan aman.

#### 🟢 Blueprint Redesain Karya Saya:
* **Dual Tab Jernih**:
  - Tab 1: **"Lakon Saya"** (Pertunjukan yang sedang Anda susun, draft, dan arsip publik).
  - Tab 2: **"Pustaka Template Dalang"** (Naskah siap pentas: *Dewa Ruci*, *Gatotkaca Gugur*, *Karna Tandhing*).
* **Offline Shield Indicator**:
  - Tampilkan badge status kecil yang menenangkan: `● Tersimpan Aman di Peramban Anda (Offline-Ready)` dengan tombol ekspor cadangan JSON yang mudah diakses.

---

### F. Global Navigation & Footer

#### 🔴 Masalah UI/UX Saat Ini:
1. **Navbar Pill Mengambang Menjepit Tampilan**: Bentuknya yang lonjong bulat menumpuk dengan tombol login kuning terang merusak hierarki panggung.
2. **Footer Kurang Bobot Budaya**: Footer saat ini tampak seperti footer SaaS standar dengan 4 kolom link biasa.

#### 🟢 Blueprint Redesain Navigation & Footer:
* **The Architect Navigation Bar**:
  - Lebar proporsional (`1180px`), radius terukur `14px` (berpadu sempurna dengan pigura kayu panggung).
  - Logo dengan ikon lambang Gunungan Emas mikro yang agung.
  - Tombol login menggunakan *Dark Soga Glass* dengan aksen border emas tembaga tipis, tenang dan elegan.
* **The Heritage Cultural Footer**:
  - Dilengkapi ilustrasi Gunungan Kayon siluet artistik yang menjulang halus di latar belakang footer.
  - Mencantumkan peta sanad pakem (*Radyapustaka, Balai Pustaka, Keraton Surakarta & Yogyakarta*), deklarasi pelestarian warisan takbenda UNESCO, dan credit apresiasi pedalangan.

---

## 🚀 5. ROADMAP EKSEKUSI BERTAHAP (STEP-BY-STEP IMPLEMENTATION)

Untuk mengubah konsep ini menjadi kenyataan tanpa merusak fungsionalitas React 19 dan Web Audio yang sudah ada, berikut urutan eksekusi yang direkomendasikan:

```
[Tahap 1: Fondasi Desain & Warna]
  ├── Menerapkan Token Warna Baru (Midnight Kelir, Mori Linen, Prada Gold, Cinnabar) di index.css
  └── Penyelarasan Tipografi Display Serif + Clean Sans
        ↓
[Tahap 2: Transformasi Navbar & Hero Beranda]
  ├── Navbar Arsitektural 14px + Logo Emblem Budaya
  └── Hero Panggung Kelir Bernyawa + Cahaya Blencong Alami
        ↓
[Tahap 3: Penyempurnaan Story Atlas & Galeri]
  ├── Katalog Lakon dengan Timeline Babak
  └── Viewer Anatomi Wayang & Visualizer Gamelan Akustik
        ↓
[Tahap 4: Studio Panggung Virtual & Timeline Composer]
  ├── Framing Pigura Kayu Jati 16:9 + Toolbelt Dalang Mengambang
  └── Quick Pad SFX Dodogan & Kepyak
```

---

## 📋 6. KESIMPULAN

Konsep desain baru ini melepaskan Wayangverse dari jebakan "AI Template Klise" dan mentransformasikannya menjadi **platform seni budaya digital yang berjiwa, berwibawa, dan memukau juri serta penikmat seni di panggung internasional**.
