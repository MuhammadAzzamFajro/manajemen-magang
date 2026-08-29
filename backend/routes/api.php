<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Public\LandingController;

// Public Endpoints
Route::get('/public/landing-stats', [LandingController::class, 'stats']);

// Auth Endpoints
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

  
    // Admin Endpoints
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Api\Admin\DashboardController::class, 'index']);
        Route::get('/monitoring', [\App\Http\Controllers\Api\Admin\MonitoringController::class, 'index']);
        Route::get('/monitoring/{siswa_id}', [\App\Http\Controllers\Api\Admin\MonitoringController::class, 'show']);

        // Guru CRUD 
        Route::get('/guru', [\App\Http\Controllers\Api\Admin\GuruController::class, 'index']);
        Route::post('/guru', [\App\Http\Controllers\Api\Admin\GuruController::class, 'store']);
        Route::put('/guru/{id}', [\App\Http\Controllers\Api\Admin\GuruController::class, 'update']);
        Route::patch('/guru/{id}/status', [\App\Http\Controllers\Api\Admin\GuruController::class, 'updateStatus']);
        Route::delete('/guru/{id}', [\App\Http\Controllers\Api\Admin\GuruController::class, 'destroy']);

        // Siswa CRUD & Plotting
        Route::get('/siswa', [\App\Http\Controllers\Api\Admin\SiswaController::class, 'index']);
        Route::post('/siswa', [\App\Http\Controllers\Api\Admin\SiswaController::class, 'store']);
        Route::put('/siswa/{id}', [\App\Http\Controllers\Api\Admin\SiswaController::class, 'update']);
        Route::delete('/siswa/{id}', [\App\Http\Controllers\Api\Admin\SiswaController::class, 'destroy']);
        Route::post('/siswa/{id}/plotting', [\App\Http\Controllers\Api\Admin\SiswaController::class, 'plotting']);

        // DUDI CRUD
        Route::get('/dudi', [\App\Http\Controllers\Api\Admin\DudiController::class, 'index']);
        Route::post('/dudi', [\App\Http\Controllers\Api\Admin\DudiController::class, 'store']);
        Route::put('/dudi/{id}', [\App\Http\Controllers\Api\Admin\DudiController::class, 'update']);
        Route::patch('/dudi/{id}/verifikasi', [\App\Http\Controllers\Api\Admin\DudiController::class, 'verifikasi']);
        Route::delete('/dudi/{id}', [\App\Http\Controllers\Api\Admin\DudiController::class, 'destroy']);

        // Penempatan
        Route::get('/penempatan', [\App\Http\Controllers\Api\Admin\PenempatanController::class, 'index']);
        Route::post('/penempatan', [\App\Http\Controllers\Api\Admin\PenempatanController::class, 'store']);
        Route::put('/penempatan/{id}', [\App\Http\Controllers\Api\Admin\PenempatanController::class, 'update']);
        Route::patch('/penempatan/{id}/sahkan', [\App\Http\Controllers\Api\Admin\PenempatanController::class, 'sahkan']);
        Route::patch('/penempatan/{id}/batalkan', [\App\Http\Controllers\Api\Admin\PenempatanController::class, 'batalkan']);

        // Settings & Logs
        Route::get('/settings', [\App\Http\Controllers\Api\Admin\SettingsController::class, 'show']);
        Route::put('/settings', [\App\Http\Controllers\Api\Admin\SettingsController::class, 'update']);
        Route::get('/logs', [\App\Http\Controllers\Api\Admin\LogsController::class, 'index']);
    });

    // Guru Endpoints
    Route::middleware('role:guru')->prefix('guru')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Api\Guru\DashboardController::class, 'index']);
        Route::get('/siswa', [\App\Http\Controllers\Api\Guru\SiswaController::class, 'index']);
        Route::post('/siswa/{id}/nilai', [\App\Http\Controllers\Api\Guru\SiswaController::class, 'inputNilai']);

        Route::get('/jurnal', [\App\Http\Controllers\Api\Guru\JurnalController::class, 'index']);
        Route::patch('/jurnal/{id}/validasi', [\App\Http\Controllers\Api\Guru\JurnalController::class, 'validasi']);

        Route::get('/absensi', [\App\Http\Controllers\Api\Guru\AbsensiController::class, 'index']);
        Route::patch('/absensi/{id}/validasi', [\App\Http\Controllers\Api\Guru\AbsensiController::class, 'validasi']);

        Route::get('/kunjungan', [\App\Http\Controllers\Api\Guru\KunjunganController::class, 'index']);
        Route::post('/kunjungan', [\App\Http\Controllers\Api\Guru\KunjunganController::class, 'store']);
        Route::put('/kunjungan/{id}', [\App\Http\Controllers\Api\Guru\KunjunganController::class, 'update']);
        Route::delete('/kunjungan/{id}', [\App\Http\Controllers\Api\Guru\KunjunganController::class, 'destroy']);
    });

    // Siswa Endpoints
    Route::middleware('role:siswa')->prefix('siswa')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Api\Siswa\DashboardController::class, 'index']);

        Route::get('/pengajuan', [\App\Http\Controllers\Api\Siswa\PengajuanController::class, 'index']);
        Route::post('/pengajuan', [\App\Http\Controllers\Api\Siswa\PengajuanController::class, 'store']);

        Route::get('/absensi', [\App\Http\Controllers\Api\Siswa\AbsensiController::class, 'index']);
        Route::post('/absensi', [\App\Http\Controllers\Api\Siswa\AbsensiController::class, 'store']);

        Route::get('/jurnal', [\App\Http\Controllers\Api\Siswa\JurnalController::class, 'index']);
        Route::post('/jurnal', [\App\Http\Controllers\Api\Siswa\JurnalController::class, 'store']);
        Route::put('/jurnal/{id}', [\App\Http\Controllers\Api\Siswa\JurnalController::class, 'update']);
        Route::delete('/jurnal/{id}', [\App\Http\Controllers\Api\Siswa\JurnalController::class, 'destroy']);
    });
});
