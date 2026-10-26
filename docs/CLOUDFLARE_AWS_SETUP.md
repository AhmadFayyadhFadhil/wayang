# 🌐 Panduan Deployment Cloud: Vercel, AWS & Cloudflare
## Wayangverse Platform Architecture

Dokumen ini adalah panduan resmi DevOps untuk menghubungkan:
1. **Frontend**: Vercel (`app.domainkamu.com` atau domain utama)
2. **Backend & Database**: AWS (`api.domainkamu.com`)
3. **DNS & Security Edge**: Cloudflare

---

## 📌 1. Konfigurasi Cloudflare (DNS, SSL & Cache)

### A. Pengaturan DNS Records
Masuk ke Cloudflare Dashboard > Domain Anda > **DNS > Records**:

| Type | Name (Subdomain) | Target / Content | Proxy Status | Keterangan |
| :--- | :--- | :--- | :---: | :--- |
| **CNAME** | `app` | `cname.vercel-dns.com` | **Proxied (Orange Cloud)** | Mengarah ke Frontend Vercel |
| **A** | `api` | `<IP_ELASTIC_AWS>` | **Proxied (Orange Cloud)** | Mengarah ke IP Publik AWS |

### B. Pengaturan SSL / TLS (Sangat Penting!)
Buka menu **SSL/TLS > Overview**:
* Pilih mode: **Full** atau **Full (Strict)**.
* ⚠️ **JANGAN pilih Flexible**, karena akan menimbulkan loop redirect (*ERR_TOO_MANY_REDIRECTS*) antara Nginx AWS dan Cloudflare.

### C. Pengaturan Cache Rules untuk Backend API
Buka menu **Caching > Cache Rules > Create Rule**:
* **Rule Name:** `Bypass Cache for Laravel API`
* **When incoming requests match:**
  * Field: `Hostname`
  * Operator: `equals`
  * Value: `api.domainkamu.com`
* **Then eligible for cache:**
  * Cache status: **Bypass cache**
* *Tujuan:* Memastikan respon database, autentikasi, dan adegan wayang selalu realtime dan tidak basi (*stale*).

---

## 🚀 2. Konfigurasi Frontend di Vercel

1. Buka dashboard [Vercel](https://vercel.com) > **Add New Project** > Import repositori `wayang`.
2. Pada bagian **Project Configuration**:
   * **Framework Preset:** Vite
   * **Root Directory:** Ubah menjadi **`fe`** *(Wajib!)*
   * **Build Command:** `vite build`
   * **Output Directory:** `dist`
3. Pada bagian **Environment Variables**:
   * Key: `VITE_API_URL`
   * Value: `https://api.domainkamu.com/api`
4. Deploy! File `fe/vercel.json` yang sudah tersedia otomatis menangani SPA routing saat halaman di-refresh.
5. Hubungkan custom domain `app.domainkamu.com` di menu **Settings > Domains**.

---

## 🏛️ 3. Konfigurasi Backend di AWS (EC2 / Lightsail)

### A. AWS Security Group (Firewall)
Pastikan inbound rules pada AWS Security Group mengizinkan:
* **Port 80 (HTTP)**: `0.0.0.0/0` (atau IP range Cloudflare)
* **Port 443 (HTTPS)**: `0.0.0.0/0` (atau IP range Cloudflare)
* **Port 22 (SSH)**: Hanya IP pribadi developer
* **Port 3306 (MySQL)**: Tutup dari publik (hanya diakses lokal `127.0.0.1` atau internal VPC).

### B. Konfigurasi `.env` Backend di AWS
Pastikan file `be/.env` di server AWS memiliki nilai:
```ini
APP_NAME="Wayang Digital"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.domainkamu.com

FRONTEND_URL=https://app.domainkamu.com
CORS_ALLOWED_ORIGINS=https://app.domainkamu.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=wayang
DB_USERNAME=wayang_user
DB_PASSWORD=<PASSWORD_KUAT>

SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database
```

### C. Inisialisasi Database di Server AWS
Jalankan di server AWS:
```bash
cd be
php artisan migrate --seed --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 🔒 4. Verifikasi Health Check
Setelah domain aktif:
1. Akses `https://api.domainkamu.com/api/status` di browser.
2. Pastikan respon JSON mengembalikan:
   ```json
   {
     "status": "success",
     "database": {
       "connected": true,
       "name": "wayang"
     }
   }
   ```
3. Buka frontend `https://app.domainkamu.com`, pastikan kartu status API di halaman beranda berwarna hijau (*Backend Online*).
