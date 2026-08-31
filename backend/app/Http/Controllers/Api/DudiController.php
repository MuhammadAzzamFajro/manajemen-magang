<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TempatMagang;
use OpenApi\Attributes as OA;

class DudiController extends Controller
{
    #[OA\Get(
        path: '/api/dudi',
        summary: 'Daftar DUDI untuk form pengajuan/kunjungan',
        description: 'Menampilkan mitra DUDI terverifikasi yang masih memiliki kuota (penempatan_count < kuota). Dapat diakses oleh semua role terautentikasi (admin, guru, siswa).',
        tags: ['Public'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Daftar DUDI tersedia.', content: new OA\JsonContent(
                type: 'array',
                items: new OA\Items(ref: '#/components/schemas/TempatMagang'),
            )),
            new OA\Response(response: 401, description: 'Token tidak valid.'),
        ],
    )]
    public function index()
    {
        $dudis = TempatMagang::withCount('penempatan')
            ->where('status_verifikasi', 'terverifikasi')
            ->orderBy('nama_perusahaan')
            ->get()
            ->filter(fn ($d) => $d->penempatan_count < $d->kuota)
            ->values();

        return response()->json([
            'status' => true,
            'data'   => $dudis,
        ]);
    }
}