# SIMMAS — Sistem Informasi Manajemen Magang Siswa

SIMMAS adalah aplikasi web Sistem Informasi Manajemen Magang Siswa/PKL untuk SMK dengan arsitektur terpisah:
- **Backend**: Laravel 12 REST API murni (Sanctum token-based authentication, Supabase / PostgreSQL)
- **Frontend**: Next.js 14+ (App Router, TypeScript, Tailwind CSS, TanStack React Query)

---

## ⚡ Konfigurasi Database Supabase (PostgreSQL)

Edit file `backend/.env` sesuai dengan kredensial proyek Supabase Anda:

### Opsi 1: Connection String URI (`DATABASE_URL`)
```env
DB_CONNECTION=pgsql
DATABASE_URL=postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require
```

### Opsi 2: Standard Connection Parameters
```env
DB_CONNECTION=pgsql
DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com # atau db.YOUR_PROJECT_REF.supabase.co
DB_PORT=6543 # atau 5432
DB_DATABASE=postgres
DB_USERNAME=postgres.YOUR_PROJECT_REF
DB_PASSWORD=YOUR_SUPABASE_PASSWORD
DB_SSLMODE=require
```

---

## 🚀 Panduan Memulai (Quick Start)

### 1. Persiapan Backend (Laravel API)

```bash
cd backend

# 1. Install dependensi Composer
composer install

# 2. Migrate database & seeder demo ke Supabase
php artisan migrate:fresh --seed

# 3. Buat symbolic link storage untuk foto presensi & jurnal
php artisan storage:link

# 4. Jalankan server Laravel API (berjalan di http://localhost:8000)
php artisan serve
```

### 🔑 Akun Demo (Seeder Defaults)

- **Admin Sekolah**: `admin@simmas.sch.id` | Pass: `password`
- **Guru Pembimbing**: `guru@simmas.sch.id` | Pass: `password`
- **Siswa Magang**: `siswa@simmas.sch.id` | Pass: `password`

---

### 2. Persiapan Frontend (Next.js)

```bash
cd frontend

# 1. Install dependensi NPM
npm install --legacy-peer-deps

# 2. Jalankan server Next.js (berjalan di http://localhost:3000)
npm run dev
```

Buka browser di `http://localhost:3000` untuk mengakses aplikasi SIMMAS.
