# WAYANGVERSE — Product Requirements Document (PRD)

*PRD — Produk, pengguna, ruang lingkup, pengalaman, dan kriteria keberhasilan*

**Versi 1.0** | 12 Oktober 2026 | Dokumen kerja untuk tim lomba & AI Agent

---

## Kontrol Dokumen

| Item | Detail | Status Implementasi |
| :--- | :--- | :--- |
| **Nama Produk** | Wayangverse | Baseline MVP |
| **Versi** | 1.0 — baseline MVP | Aktif |
| **Status** | Terkunci & Diimplementasikan | Terverifikasi |
| **Platform** | Website responsif desktop dan mobile | Tersedia di port 5173 / 8000 |
| **Stack Target** | Laravel 12, React, TypeScript/JSX, Vite, MySQL 8+, Laravel Sanctum | Beroperasi |
| **Tim** | 2–4 orang | Kolaborasi Tim & AI Agent |
| **Target Awal** | Remaja/pelajar; didukung guru, praktisi budaya, dan penikmat seni wayang | Edukasi & Pelestarian Digital |

---

## 1. Ringkasan Produk

Wayangverse adalah website interaktif yang memungkinkan pengguna merancang dan memainkan pertunjukan wayang virtual, sambil menghubungkan karya tersebut dengan cerita, tokoh, filosofi, dan audio budaya yang relevan. Produk tidak berhenti pada konsumsi konten; pengguna dapat membuat, menyimpan, membuka kembali, dan—jika memilih—mempublikasikan interpretasi kreatif.

### 1.1 Visi
Mengubah pengalaman generasi muda terhadap wayang dari sekadar melihat menjadi mengalami, menciptakan, dan ikut menjaga keberlanjutan pengetahuan budayanya.

### 1.2 Proposisi Nilai
Panggung wayang digital yang dapat dimainkan dan menghasilkan karya tersimpan, dengan relasi data yang menghubungkan setiap pertunjukan ke cerita, karakter, dan audio yang digunakan.

### 1.3 Prinsip Produk
* **Experience first:** Pengguna harus dapat memainkan adegan, bukan hanya membaca konten pasif.
* **Cultural integrity:** Sumber, tradisi/versi cerita, dan interpretasi kreatif dibedakan dengan jelas.
* **Connected by design:** Data tokoh, cerita, audio, dan karya saling terhubung melalui ID dan relasi yang konsisten.
* **MVP over breadth:** Satu alur lengkap dan stabil lebih penting daripada banyak fitur setengah jadi.
* **Responsive and accessible:** Interaksi inti harus tetap dapat digunakan pada layar kecil dan dengan kontrol keyboard alternatif.

---

## 2. Masalah dan Peluang

* Format pengenalan budaya yang pasif belum tentu memberi generasi muda ruang untuk bereksperimen.
* Cerita, karakter, filosofi, dan tata suara sering disajikan terpisah sehingga konteks keterkaitan antarunsur kurang terasa.
* Kreativitas digital dapat menjadi sarana partisipasi budaya jika pengguna dapat membuat interpretasi dengan atribusi sumber yang benar.

---

## 3. Sasaran dan Non-Sasaran

### 3.1 Sasaran MVP
* Pengguna dapat melihat konten budaya terkurasi dan memilih cerita naskah rujukan.
* Pengguna dapat menyusun adegan pada panggung 2D berbasis kelir interaktif dengan visual wayang kulit otentik dan animasi solah gerak dalang.
* Pengguna dapat menempatkan/memindahkan karakter, memilih pose, mengatur dialog/urutan adegan, dan memicu tata suara gamelan dinamis.
* Pengguna terautentikasi dapat menyimpan, membuka kembali, mengedit, dan menghapus karya miliknya.
* Karya memiliki relasi ke cerita sumber dan karakter/audio yang digunakan.
* Karya dapat dibuat privat atau publik; publikasi memiliki atribusi dan validasi server.
* Admin dapat mengelola konten dasar melalui panel CMS manajemen data.

### 3.2 Bukan Sasaran MVP
* Simulasi penuh seluruh teknik dalang fisik profesional atau animasi fisika kompleks.
* AI generatif untuk menulis cerita secara otomatis tanpa kontrol kurasi.
* Kolaborasi real-time multi-pengguna (WebSocket).
* Marketplace komersial atau aplikasi mobile native.
* Klaim tunggal bahwa satu versi cerita mewakili seluruh tradisi pewayangan Nusantara.

---

## 4. Persona dan Kebutuhan

| Persona | Kebutuhan | Prioritas |
| :--- | :--- | :--- |
| **Remaja / Pelajar** | Pengalaman interaktif singkat, visual memikat, mudah dimainkan, dan hasil kreasi dapat disimpan serta dibagikan. | Utama (P0) |
| **Guru / Fasilitator** | Konten yang memiliki sumber rujukan terpercaya dan dapat dipakai sebagai media ajar interaktif. | Sekunder (P1) |
| **Dalang / Kurator Budaya** | Konteks pakem budaya disajikan dengan tepat; atribusi dan versi naskah tidak dihilangkan. | Mitra Konten |
| **Pengunjung Umum** | Mudah menjelajahi ensiklopedia tokoh, lakon, filosofi, dan pertunjukan publik. | Sekunder (P1) |
| **Admin** | Mengelola database lakon, tokoh, audio, dan moderasi karya publik yang dilaporkan. | Operasional |

---

## 5. Pengalaman Utama dan User Journey

1. **Landing:** Pengguna memahami nilai produk, melihat panggung kelir interaktif otentik, dan memilih *Jelajahi Story Atlas* atau *Buka Panggung Virtual*.
2. **Discover:** Pengguna membuka lakon cerita/tokoh di AtlasView, membaca sinopsis, filosofi, silsilah, tradisi/versi, dan naskah sumber rujukan.
3. **Stage Setup:** Pengguna memilih karakter wayang, latar kelir (Blencong/Gunungan/Kurusetra), dan gending gamelan.
4. **Perform:** Pengguna mengatur posisi karakter, memilih pose laga/sembah, menginput dialog, menambah adegan (scenes), dan melakukan preview interaktif.
5. **Save:** Pengguna memberi judul, deskripsi, memilih cerita rujukan, dan mengatur visibilitas (private/public); backend memvalidasi dan menyimpan proyek.
6. **Reopen:** Pengguna kembali ke menu *Karya Saya* dan memuat kembali susunan adegan yang tersimpan persis seperti semula.
7. **Connect:** Halaman *Karya Publik / Connected Archive* menautkan cerita, karakter, dan audio yang digunakan; pengunjung lain dapat menelusuri akar budayanya.

---

## 6. Persyaratan Fitur dan Prioritas

| ID | Fitur | Persyaratan Produk | Prioritas | Status |
| :--- | :--- | :--- | :--- | :--- |
| **PR-01** | Story & Character Atlas | Daftar/detail cerita dan karakter, relasi terkait, filosofi, tradisi/versi, dan sumber. | P0 | Terimplementasi |
| **PR-02** | Virtual Stage | Panggung 2D kelir; tempatkan, pindahkan (drag & keyboard), ubah pose karakter, animasi solah dalang. | P0 | Terimplementasi |
| **PR-03** | Scene Composer | Tambah/urutkan adegan, edit dialog, preview alur adegan playback. | P0 | Terimplementasi |
| **PR-04** | Audio Soundscape | Pilih dan putar aset audio gamelan (srepeg, sampak, ayak-ayak, dodogan, kepyak, gong); kontrol play/volume. | P0 | Terimplementasi |
| **PR-05** | Authentication | Register, login, logout berbasis Sanctum modal; pemisahan hak akses guest, user, dan admin. | P0 | Terimplementasi |
| **PR-06** | Save & Reopen | Simpan, edit, hapus, dan buka kembali karya tersimpan di *Karya Saya*. | P0 | Terimplementasi |
| **PR-07** | Connected Work | Karya terhubung ke lakon cerita, karakter, dan musik dengan ID relasional. | P0 | Terimplementasi |
| **PR-08** | Visibility | Karya private atau public; publikasi ditegakkan server-side. | P0 | Terimplementasi |
| **PR-09** | Admin Content (CMS) | Manajemen master data cerita, tokoh, audio, dan sumber; proteksi role admin. | P1 | Terimplementasi |
| **PR-10** | Public Explore | Galeri karya publik terkurasi dengan filter lakon dan karakter. | P1 | Terimplementasi |
| **PR-11** | Report / Moderasi | Mekanisme peninjauan karya publik. | P1 | Desain Siap |
| **PR-12** | Co-Dalang | Kolaborasi real-time beberapa dalang secara simultan. | P2 | Pasca-MVP |
| **PR-13** | AI Story Assistant | Bantuan pendalaman filosofi lakon dengan kontrol etika budaya. | P2 | Pasca-MVP |

---

## 7. User Stories dan Acceptance Criteria

* **US-01 (Jelajah):** Sebagai pengunjung, saya ingin menjelajahi cerita dan karakter beserta filosofi dan sumber rujukannya.
* **US-02 (Pentas Virtual):** Sebagai pengguna, saya ingin menempatkan wayang di atas kelir dengan visual kulit otentik dan menggerakkannya secara luwes.
* **US-03 (Komposisi Adegan):** Sebagai dalang digital, saya ingin menyusun urutan babak adegan lakon dan menginput dialog tutur kata.
* **US-04 (Tata Suara):** Sebagai pengguna, saya ingin memutar iringan gamelan klasik dan memicu efek suara dodogan serta kepyak.
* **US-05 (Simpan Karya):** Sebagai pengguna terdaftar, saya ingin menyimpan karya pertunjukan saya ke database cloud.
* **US-06 (Buka Kembali):** Sebagai pemilik karya, saya ingin membuka kembali proyek saya tanpa kehilangan susunan adegan atau posisi wayang.
* **US-07 (Privasi):** Sebagai pemilik, saya ingin menentukan apakah karya saya berstatus privat atau publik.
* **US-08 (Keterhubungan Budaya):** Sebagai pengunjung galeri publik, saya ingin menelusuri naskah pakem rujukan yang mendasari karya seorang pengguna.
* **US-09 (Admin CMS):** Sebagai pengelola konten, saya ingin mengelola master data tokoh, cerita, dan audio melalui antarmuka CMS yang bersih.

---

## 8. Metrik Keberhasilan

1. **Time to First Performance:** Pengguna baru dapat menyusun dan memainkan adegan pertamanya dalam waktu kurang dari 2 menit.
2. **Reopen Success Rate:** 100% data adegan yang disimpan berhasil dipulihkan secara akurat saat dimuat kembali.
3. **Cultural Discovery Rate:** Pengguna yang membaca detail filosofi dan sumber naskah setelah menyaksikan suatu karya pementasan.
4. **Usability & Responsiveness:** Beroperasi mulus pada layar smartphone (360px) hingga monitor desktop (1280px+).

---

## 9. Mitigasi Risiko

* **Integritas Budaya:** Setiap karya pengguna wajib berlabel *"Interpretasi Kreatif Pengguna"*, sedangkan naskah rujukan berlabel *"Pakem Tradisi / Sumber Terkurasi"*.
* **Keamanan Data:** Otorisasi kepemilikan proyek selalu divalidasi di backend server (bukan sekadar menyembunyikan tombol UI).
* **Performa Grafis:** Menggunakan optimasi rendering GPU (CSS transform & lightweight responsive assets) agar performa tetap 60 FPS tanpa lag.
