FROM php:8.2-cli-alpine

# Pasang dependensi sistem dan ekstensi PHP yang dibutuhkan Laravel
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    oniguruma-dev \
    mariadb-client \
    && docker-php-ext-install pdo pdo_mysql mbstring pcntl bcmath gd

# Unduh Composer versi resmi
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Tentukan direktori kerja di dalam kontainer
WORKDIR /var/www/html

# Salin definisi dependensi backend
COPY composer.json composer.lock ./

# Unduh dependensi Composer (tanpa dev untuk optimasi produksi)
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# Salin seluruh kode aplikasi backend
COPY . .

# Generate autoload teroptimasi
RUN composer dump-autoload --optimize

# Berikan izin tulis untuk folder storage dan bootstrap cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Port default service backend
EXPOSE 8000

# Perintah default: Jalankan Laravel artisan serve
CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=8000"]
