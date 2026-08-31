<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\Guru;
use App\Models\TempatMagang;
use App\Models\PengajuanMagang;
use App\Models\PenempatanMagang;
use OpenApi\Attributes as OA;

class DashboardController extends Controller
{
    #[OA\Get(
        path: '/api/admin/dashboard',
        summary: 'Statistik dashboard admin',
        description: 'Ringkasan jumlah siswa, guru aktif, mitra DUDI, pengajuan menunggu, distribusi DUDI, dan chart status magang.',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Statistik dashboard.', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'status', type: 'boolean', example: true),
                    new OA\Property(property: 'data', properties: [
                        new OA\Property(property: 'total_siswa', type: 'integer'),
                        new OA\Property(property: 'guru_aktif', type: 'integer'),
                        new OA\Property(property: 'mitra_dudi', type: 'integer'),
                        new OA\Property(property: 'pengajuan_menunggu', type: 'integer'),
                    ]),
                ],
            )),
            new OA\Response(response: 401, description: 'Token tidak valid.'),
            new OA\Response(response: 403, description: 'Role tidak diizinkan (bukan admin).'),
        ],
    )]
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
