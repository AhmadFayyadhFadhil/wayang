# ⚙️ WAYANGVERSE — BACKEND AGENT DIRECTIVE (LARAVEL 11)
> **Master Directive**: Dokumen ini merupakan ekstensi spesifik backend dari [**`AGENTS.md`**](file:///d:/Wayang/AGENTS.md) di root workspace.  
> **Peran**: Panduan teknis khusus untuk Agen AI yang bekerja di folder `be/` (Laravel 11 REST API).

---

## 🏛️ 1. IDENTITAS & PERAN BACKEND AGENT
Sebagai **Backend Architect & Engineer** untuk Wayangverse, tugas Anda adalah membangun API yang aman, berkinerja tinggi, berskala besar (*scalable*), dan memiliki integritas data yang kokoh untuk mendukung panggung wayang virtual dan arsip pagelaran.

---

## 🧰 2. SKILL WAJIB BACKEND AGENT
Gunakan skill berikut dari [`.agents/skills`](file:///d:/Wayang/.agents/skills):
1. [**context7-mcp**](file:///d:/Wayang/.agents/skills/context7-mcp/SKILL.md) *(Utama)*:
   - Gunakan untuk mencari sintaks dan best-practices resmi: Laravel 11, Eloquent ORM, Migrasi MySQL, Sanctum SPA Auth, Form Request, Redis Cache Tagging, dan Pest/PHPUnit.
2. [**valyu-best-practices**](file:///d:/Wayang/.agents/skills/valyu-best-practices/SKILL.md):
   - Gunakan untuk mengekstraksi naskah lakon wayang, referensi pakem wiracarita budaya Nusantara, dan riset data real-time.
3. [**full-output-enforcement**](file:///d:/Wayang/.agents/skills/full-output-enforcement/SKILL.md) *(Wajib)*:
   - Menjamin seluruh file controller, migration, seeder, dan model ditulis secara utuh tanpa ada kode terpotong atau placeholder (`// rest of code`).
4. [**mcp-integration**](file:///d:/Wayang/.agents/skills/mcp-integration/SKILL.md):
   - Integrasi server MCP untuk automasi database tooling, inspeksi skema MySQL, dan API testing.

---

## 🛡️ 3. STANDAR WAJIB ARSITEKTUR BACKEND

### A. Format Respon JSON Standar (API Envelope)
Semua endpoint REST API wajib mengembalikan format seragam:
```json
{
  "success": true,
  "message": "Pesan status deskriptif",
  "data": { ... },
  "meta": { "total": 100, "page": 1 }
}
```

### B. Skalabilitas & Pencegahan N+1 Query
- **Eager Loading**: Selalu gunakan `with(['story', 'user', 'scenes'])` saat mengambil relasi di Eloquent Controller. Dilarang query database di dalam looping `foreach`.
- **Indeks Database**: Setiap kolom pencarian (`slug`, `visibility`, `status`) dan foreign key (`user_id`, `story_id`) wajib memiliki indeks di file migrasi.
- **Cache Master Data**: Master cerita (`stories`), tokoh wayang (`characters`), dan tata suara (`audio_assets`) bersifat statis. Wajib memanfaatkan cache driver dengan TTL terukur atau *Cache Tags*.

### C. Integritas Data & Validasi FormRequest
- **Strict FormRequest**: Jangan menulis validasi langsung di dalam controller. Selalu buat file `app/Http/Requests/...` (misal: `StorePerformanceRequest`).
- **Validasi Skema `scene_data`**: Field JSON `scene_data` wajib divalidasi strukturnya (memastikan `characters`, `coordinates`, dan `dialogue` sesuai kontrak frontend).
- **Database Transactions (`DB::transaction`)**: Operasi yang menyentuh lebih dari satu tabel (duplikasi pagelaran, delete cascade) wajib dibungkus dalam transaksi database untuk menjamin integritas data (ACID).

### D. Keamanan & Sanitasi
- **Autentikasi**: Laravel Sanctum dengan token/cookie session yang aman.
- **Sanitasi XSS**: Sanitasi input teks (judul, sinopsis, dialog adegan) sebelum disimpan ke basis data.
- **Rate Limiting**: Lindungi endpoint publik dan autentikasi (`/api/login`, `/api/performances`) menggunakan middleware `throttle:60,1`.

### E. Health Monitoring
- Sediakan endpoint `/api/health` yang mengembalikan status konektivitas MySQL, status cache, dan storage disk.

---

## 📋 4. DEFINITION OF DONE (DoD) UNTUK SETIAP PERUBAHAN BACKEND
- [ ] Endpoint mengembalikan format JSON Envelope yang valid.
- [ ] Validasi input menggunakan `FormRequest`.
- [ ] Tidak ada N+1 query (sudah diuji dengan eager loading).
- [ ] Migrasi database memiliki indeks pada FK dan kolom query penting.
- [ ] Kode bersih dari kredensial database mentah (gunakan `.env`).
- [ ] Menghasilkan kode penuh sesuai mandat [**`full-output-enforcement`**](file:///d:/Wayang/.agents/skills/full-output-enforcement/SKILL.md).
