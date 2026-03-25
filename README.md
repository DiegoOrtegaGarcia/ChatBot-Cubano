# Yasmani AI - Asistente Virtual Inteligente

<div align="center">

![Yasmani AI](https://img.shields.io/badge/Yasmani-AI-purple?style=for-the-badge&logo=ai)
![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)

**Chatbot inteligente con IA integrada, diseño moderno y accesibilidad total**

[Características](#-características) • [Tecnologías](#-tecnologías) • [Instalación](#-instalación) • [Uso](#-uso) • [Estructura](#-estructura-del-proyecto) • [Solución de errores](#-solución-de-errores)

</div>

## 🚀 Características

- Chat con IA usando **OpenRouter**
- Interfaz **Inertia + React + Tailwind**
- Rate limiting para evitar abuso (`ratelimit.chat:10,1`)
- Sanitización con **DOMPurify** y seguridad HTML
- Autoscroll, estado de carga y manejo de errores
- Rutas: `/` (landing) y `/roselia` (API POST)

## 🛠️ Tecnologías

### Backend
- Laravel 12
- PHP 8.2
- SQLite (por defecto)
- OpenRouter API

### Frontend
- React 18
- TypeScript
- Vite
- Axios
- Tailwind CSS

## 📦 Instalación

### Prerrequisitos
```bash
php --version
composer --version
node --version
npm --version
```

### 1) Clonar repositorio
```bash
git clone https://github.com/DiegoOrtegaGarcia/ChatBot-Cubano.git
cd ChatBot-Cubano
```

### 2) Dependencias PHP
```bash
composer install
```

### 3) Configurar variables de entorno
```bash
cp .env.example .env
php artisan key:generate
```

Agregar en `.env`:
```ini
API_IA_KEY=tu_api_key_de_openrouter
```

### 4) Base de datos
```bash
# SQLite
touch database/database.sqlite
php artisan migrate
```

### 5) Dependencias JS + build
```bash
npm install
npm run build
```

### 6) Ejecutar local
```bash
php artisan serve --host=127.0.0.1 --port=8000
```

Acceder: `http://127.0.0.1:8000`

## ▶️ Uso

- `/` interfaz de chat (Inertia + React).
- POST `/roselia` recibe:
```json
{
  "message": "Hola",
  "conversation_history": [{"role":"user","messages":"..."}]
}
```

- Se procesa en `app/Http/Controllers/IAController.php` y `app/Services/ChatService.php`.

## ✅ Modelo de OpenRouter

En `app/Services/ChatService.php`:
```php
$this->model = 'meta-llama/llama-3.2-3b-instruct';
```

**Este modelo es completamente gratuito** y ofrece un excelente rendimiento para chatbots.

### 🔄 Modelos gratuitos alternativos si hay problemas:

```php
// Modelo actual (Meta Llama - recomendado)
$this->model = 'meta-llama/llama-3.2-3b-instruct';

// Opción 2: Modelo de Google
$this->model = 'google/gemma-7b-it';

// Opción 3: Modelo Mistral gratuito
$this->model = 'mistralai/mistral-7b-instruct:free';

// Opción 4: Modelo Microsoft
$this->model = 'microsoft/wizardlm-2-8x22b';
```

### 🔑 **API Key gratuita:**

1. Ve a [OpenRouter.ai](https://openrouter.ai)
2. Regístrate gratis
3. Obtén tu API key
4. Agrégala a `.env`: `API_IA_KEY=tu_api_key_aqui`

**¡Los modelos gratuitos NO requieren pago!** 🎉

## 👷‍♂️ CORS + CSRF

### CORS: `config/cors.php`
- `allowed_origins: ['*']`
- `paths: ['api/*','sanctum/csrf-cookie','roselia']`

### CSRF:
- En `resources/views/app.blade.php`:
```html
<meta name="csrf-token" content="{{ csrf_token() }}">
```
- En Axios (`resources/js/core/axios/axios.ts`):
```ts
headers: {
  'Content-Type': 'application/json',
  'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
}
```

- Si hay conflicto, en `bootstrap/app.php` puedes excluir `roselia`:
```php
$middleware->validateCsrfTokens(except: ['roselia']);
```

## ✅ Dockerización rápida

Hecho: ahora tienes `Dockerfile`, `docker-compose.yml` y `.dockerignore` en la raíz.

### 1) Crea el contenedor
```bash
cd c:\Users\lll\Proyectos\ChatBot-Cubano
docker compose up -d --build
```

### 2) Comprueba app
- Navega: http://localhost:8000
- Revisa logs: `docker compose logs -f app`

### 3) Primer setup (solo la 1ª vez)
```bash
docker compose exec app php artisan migrate
```

### 4) Variables de entorno
- Crea `.env.local` o edita `.env` (con `API_IA_KEY` y otros valores)
- Si necesitas MySQL, activa servicio `db` comentado en `docker-compose.yml`.

### 5) Parar/arrancar contenedor
```bash
docker compose down
docker compose up -d
```

---

## 🐞 Solución de errores comunes

### 500 con error API
- Revisa `storage/logs/laravel.log`.
- Si aparece `No endpoints found for x-ai/grok-4-fast:free`, cambia `model` en `ChatService`.
- Si aparece `No application encryption key has been specified`, ejecuta `php artisan key:generate`.

### 419 CSRF mismatch
- Asegura meta CSRF + Axios header.
- Comprobar cookie `XSRF-TOKEN` y que request y servidor compartan dominio (localhost/127.0.0.1).

### Vite manifest not found
- Ejecuta `npm run build` para generar `public/build/manifest.json`.

### Artisan no encontrado
- Ejecuta comandos desde la carpeta raíz (donde `artisan` existe), o usa ruta absoluta:
```bash
php C:\Users\lll\Proyectos\ChatBot-Cubano\artisan serve
```

## 🧪 Tests

- `composer test` (Pest/PHPUnit)
- `npm run lint`
- `npm run types`

## 🔍 Estructura del proyecto relevante

- `app/Http/Controllers/IAController.php`
- `app/Services/ChatService.php`
- `routes/web.php`
- `resources/js/core/hooks/useWelcome.ts`
- `resources/js/pages/welcome.tsx`
- `resources/js/core/axios/axios.ts`
- `bootstrap/app.php`

## 📌 Notas de despliegue

- `APP_ENV=production`, `APP_DEBUG=false`
- `php artisan config:cache && php artisan route:cache && php artisan view:cache`
- `npm run build`

## 📚 Recursos
- OpenRouter docs: https://openrouter.ai/docs
- Laravel docs: https://laravel.com/docs
- Inertia docs: https://inertiajs.com