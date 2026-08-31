<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\TempatMagang;
use App\Models\JurnalHarian;
use App\Models\Absensi;
use OpenApi\Attributes as OA;

class LandingController extends Controller
{
    #[OA\Get(
        path: '/api/public/landing-stats',
        summary: 'Statistik publik halaman landing',
        description: 'Menampilkan jumlah jurnal disetujui, presensi tercatat, siswa aktif, dan total DUDI terverifikasi (tanpa autentikasi).',
        tags: ['Public'],
        responses: [
            new OA\Response(response: 200, description: 'Statistik berhasil dimuat.', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'status', type: 'boolean', example: true),
                    new OA\Property(property: 'data', properties: [
                        new OA\Property(property: 'jurnal_disetujui', type: 'integer'),
                        new OA\Property(property: 'presensi_tercatat', type: 'integer'),
                        new OA\Property(property: 'siswa_aktif', type: 'integer'),
                        new OA\Property(property: 'total_dudi', type: 'integer'),
                    ]),
                ],
            )),
        ],
    )]
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
