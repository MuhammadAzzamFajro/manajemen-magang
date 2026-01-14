<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\PelanggaranController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LogbookController;
use App\Http\Controllers\DudiController;
use App\Http\Controllers\MagangController;

// Public auth routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    // Student management
    Route::apiResource('siswa', SiswaController::class)->except(['index', 'show']);
    Route::apiResource('kelas', KelasController::class)->except(['index', 'show']);

    // Violation management
    Route::apiResource('pelanggaran', PelanggaranController::class);
    Route::get('/bukti/{id}/view', [PelanggaranController::class, 'getBuktiFile']);
    Route::get('/bukti/{id}/download', [PelanggaranController::class, 'downloadBuktiFile']);
    Route::get('/bukti/image/{id}', [PelanggaranController::class, 'getBuktiImage']);

    // Logbook management
    Route::apiResource('logbook', LogbookController::class);
    Route::patch('/logbook/{id}/status', [LogbookController::class, 'updateStatus']);
    Route::get('/logbook/siswa/{siswaId}', [LogbookController::class, 'getBySiswa']);

    // DUDI management
    Route::apiResource('dudi', DudiController::class);
    Route::get('/dudi/bidang/{bidang}', [DudiController::class, 'getByBidangUsaha']);

    // Magang management ✅
    Route::apiResource('magang', MagangController::class);
    Route::get('/magang/siswa/{siswaId}', [MagangController::class, 'getBySiswa']);

    // Token verification
    Route::post('/verify-token', [AuthController::class, 'verifyToken']);
});
