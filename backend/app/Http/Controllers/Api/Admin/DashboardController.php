<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\Guru;
use App\Models\TempatMagang;
use App\Models\PengajuanMagang;
use App\Models\PenempatanMagang;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => true,
            'data'   => [
                'total_siswa'        => Siswa::count(),
                'guru_aktif'         => Guru::where('status_akun', 'aktif')->count(),
                'mitra_dudi'         => TempatMagang::count(),
                'pengajuan_menunggu' => PengajuanMagang::where('status', 'menunggu')->count(),
                'distribusi_dudi'    => TempatMagang::withCount('penempatan')->get(),
                'status_siswa_chart' => [
                    'belum_magang'  => Siswa::where('status_magang', 'belum_magang')->count(),
                    'pengajuan'     => Siswa::where('status_magang', 'pengajuan')->count(),
                    'sedang_magang' => Siswa::where('status_magang', 'sedang_magang')->count(),
                    'lulus'         => Siswa::where('status_magang', 'lulus')->count(),
                ]
            ]
        ]);
    }
}
