#!/bin/bash
set -e

echo "=========================================================="
echo "🚀 MEMULAI SETUP OTOMATIS BACKEND & DATABASE WAYANGVERSE"
echo "Target Host: 3.107.98.18 | OS: Ubuntu Server 24.04 LTS"
echo "=========================================================="

echo "=== 1. Menyiapkan 2GB Swap Memory ==="
if [ ! -f /swapfile ]; then
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "Swap 2GB berhasil diaktifkan!"
fi

echo "=== 2. Memasang Docker & Docker Compose Plugin ==="
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg git
sudo install -m 0755 -d /etc/apt/keyrings
if [ ! -f /etc/apt/keyrings/docker.gpg ]; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
fi
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER || true

echo "=== 3. Mengunduh & Memperbarui Repositori Wayangverse ==="
cd /home/ubuntu
if [ ! -d "wayang" ]; then
    git clone https://github.com/AhmadFayyadhFadhil/wayang.git
fi
cd /home/ubuntu/wayang
git fetch origin
git checkout feat/frontend-mvp
git pull origin feat/frontend-mvp

echo "=== 4. Menyiapkan Konfigurasi Lingkungan Backend ==="
cp be/.env.example be/.env
sed -i 's/APP_ENV=local/APP_ENV=production/g' be/.env
sed -i 's/APP_DEBUG=true/APP_DEBUG=false/g' be/.env
sed -i 's|APP_URL=http://127.0.0.1:8000|APP_URL=http://3.107.98.18:8000|g' be/.env
sed -i 's|DB_HOST=127.0.0.1|DB_HOST=db|g' be/.env
sed -i 's|DB_DATABASE=wayang|DB_DATABASE=wayang|g' be/.env
sed -i 's|DB_USERNAME=root|DB_USERNAME=root|g' be/.env
sed -i 's|DB_PASSWORD=|DB_PASSWORD=|g' be/.env

echo "=== 5. Menjalankan Container Database (MySQL 8) & Backend Laravel ==="
sudo docker compose up -d --build db backend

echo "=== 6. Menunggu MySQL Siap Menerima Koneksi... ==="
until sudo docker compose exec -T db mysqladmin ping -h localhost --silent; do
    echo "Menunggu database startup..."
    sleep 3
done

echo "=== 7. Eksekusi Kunci Aplikasi, Migrasi & Seeding Data Budaya ==="
sudo docker compose exec -T backend php artisan key:generate --force
sudo docker compose exec -T backend php artisan migrate --seed --force
sudo docker compose exec -T backend php artisan config:cache
sudo docker compose exec -T backend php artisan route:cache

echo ""
echo "=== 8. Uji Coba Health Check Backend API ==="
curl -s http://localhost:8000/api/status

echo ""
echo "=========================================================="
echo "🎉 BACKEND & DATABASE WAYANGVERSE TELAH ONLINE DI AWS! 🎉"
echo "Public Health Check: http://3.107.98.18:8000/api/status"
echo "=========================================================="
