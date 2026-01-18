<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/login', [AuthController::class, 'loginView'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');
Route::get('/register', [AuthController::class, 'registerView'])->name('register');
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:login');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
Route::post('/switch-role', [AuthController::class, 'switchRole'])->name('switch.role');

Route::middleware(['auth'])->group(function () {
    // Global search (untuk guru & siswa)
    Route::get('/search', [DashboardController::class, 'search'])->name('search');

    // Dashboard - dengan role protection
    Route::middleware(['role:Guru'])->get('/dashboard/guru', [DashboardController::class, 'index'])->name('dashboard.guru');
    Route::middleware(['role:Siswa'])->get('/dashboard/siswa', [DashboardController::class, 'siswa'])->name('dashboard.siswa');

    // Guru Sub-pages
    Route::middleware(['role:Guru'])->prefix('dashboard/guru')->name('guru.')->group(function() {
        Route::get('/siswa', [DashboardController::class, 'guruSiswa'])->name('siswa');
        Route::post('/siswa', [DashboardController::class, 'storeSiswa'])->name('siswa.store');
        Route::delete('/siswa/{siswa}', [DashboardController::class, 'destroySiswa'])->name('siswa.destroy');

        Route::get('/dudis', [DashboardController::class, 'guruDudi'])->name('dudis');
        Route::post('/dudis', [DashboardController::class, 'storeDudi'])->name('dudis.store');
        Route::put('/dudis/{dudi}', [DashboardController::class, 'updateDudi'])->name('dudis.update');
        Route::delete('/dudis/{dudi}', [DashboardController::class, 'destroyDudi'])->name('dudis.destroy');

        Route::get('/magang', [DashboardController::class, 'guruMagang'])->name('magang');
        Route::post('/magang', [DashboardController::class, 'storeMagang'])->name('magang.store');
        Route::post('/magang/{magang}/verify', [DashboardController::class, 'verifyMagang'])->name('magang.verify');

        Route::get('/logbook', [DashboardController::class, 'guruLogbook'])->name('logbook');
        Route::post('/logbook/{logbook}/verify', [DashboardController::class, 'verifyLogbook'])->name('logbook.verify');
    });

    // Siswa Sub-pages
    Route::middleware(['role:Siswa'])->prefix('dashboard/siswa')->name('siswa.')->group(function() {
        Route::get('/dudi', [DashboardController::class, 'siswaDudi'])->name('dudi');
        Route::get('/magang', [DashboardController::class, 'siswaMagang'])->name('magang');
        Route::post('/magang/apply', [DashboardController::class, 'storeApplication'])->name('magang.apply');

        Route::get('/logbook', [DashboardController::class, 'siswaLogbook'])->name('logbook');
        Route::post('/logbook', [DashboardController::class, 'storeLogbook'])->name('logbook.store');

        Route::get('/kehadiran', [\App\Http\Controllers\AttendanceController::class, 'index'])->name('kehadiran');
        Route::post('/kehadiran', [\App\Http\Controllers\AttendanceController::class, 'store'])->name('kehadiran.store');
    });
});
