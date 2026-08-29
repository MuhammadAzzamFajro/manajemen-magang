<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\TempatMagang;
use App\Models\JurnalHarian;
use App\Models\Absensi;

class LandingController extends Controller
{
    public function stats()
    {
        return response()->json([
            'status' => true,
            'data'   => [
                'jurnal_disetujui' => JurnalHarian::where('status_verifikasi', 'disetujui')->count(),
                'presensi_tercatat' => Absensi::count(),
                'siswa_aktif'      => Siswa::whereIn('status_magang', ['sedang_magang', 'lulus'])->count(),
                'total_dudi'       => TempatMagang::where('status_verifikasi', 'terverifikasi')->count(),
            ]
        ]);
    }
}
