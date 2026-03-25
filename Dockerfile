# Dockerfile para ChatBot-Cubano (Laravel 12 + React/Vite)
FROM php:8.2-cli AS base

# Dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    curl \
    libzip-dev \
    libonig-dev \
    libpng-dev \
    libicu-dev \
    default-mysql-client \
    nodejs npm \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl bcmath intl

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar y preparar aplicación
COPY . .

# Variables de entorno de ejemplo (la producción debe usar .env real en compose)
RUN if [ -f .env.example ]; then cp .env.example .env; fi && \
    composer install --no-interaction --prefer-dist --optimize-autoloader && \
    php artisan key:generate --force --no-interaction && \
    npm install && \
    npm run build && \
    chown -R www-data:www-data storage bootstrap/cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
