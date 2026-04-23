# HomeServe (React Frontend + Laravel API)

This project now includes:

- `homeserve-full/`: React + Vite frontend.
- `backend/`: Laravel API scaffold (Sanctum auth + core resources).

## Frontend setup

```bash
cd homeserve-full
npm install
cp .env.example .env
npm run dev
```

If `VITE_API_BASE_URL` is set, the frontend can call the Laravel API via `src/services/laravelApiService.js`.

## Laravel backend setup

> Note: this repository contains a Laravel-compatible scaffold. In a normal internet-enabled environment, install dependencies with Composer before running Artisan commands.

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

API base URL expected by frontend:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Implemented API modules

- Auth (register/login/me/logout)
- Services CRUD
- Bookings CRUD + status and payment updates

### API routes summary

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET|POST|PUT|DELETE /api/services`
- `GET|POST /api/bookings`
- `PATCH /api/bookings/{id}/status`
- `PATCH /api/bookings/{id}/payment`

## Migration path for current frontend

The app currently still contains localStorage-based services for backward compatibility. To fully switch to backend:

1. Replace calls in pages/contexts from local services to async `laravelApiService` methods.
2. Update state loading in pages to `useEffect + await` patterns.
3. Remove `seedData` once backend seeding is in place.
4. Add role-based authorization policies in Laravel.
