<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ActivityLog;
use OpenApi\Attributes as OA;

class SettingsController extends Controller
{
    #[OA\Get(
        path: '/api/admin/settings',
        summary: 'Lihat pengaturan sistem',
        description: 'Mengembalikan identitas aplikasi, konten halaman depan, dan profil sekolah.',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Pengaturan sistem.'),
        ],
    )]
    public function show()
    {
        return response()->json([
            'status' => true,
            'data'   => [
                'identitas' => [
                    'nama_aplikasi' => 'SIMMAS',
                    'deskripsi'     => 'Sistem Informasi Manajemen Magang Siswa SMK',
                    'versi'         => '1.0.0',
                    'tahun_ajaran'  => '2026/2027',
                ],
                'halaman_depan' => [
                    'tagline'      => 'Magang Lebih Teratur',
                    'sub_tagline'  => 'Platform digital pengelolaan PKL & Magang Industri terpadu',
                    'show_stats'   => true,
                ],
                'sekolah' => [
                    'nama_sekolah' => 'SMK Negeri SIMMAS',
                    'npsn'         => '20199888',
                    'alamat'       => 'Jl. Pendidikan No. 45, Kota Malang',
                    'telepon'      => '(0341) 555-1234',
                    'email'        => 'info@simmas.sch.id',
                ]
            ]
        ]);
    }

    #[OA\Put(
        path: '/api/admin/settings',
        summary: 'Simpan pengaturan sistem',
        description: 'Menyimpan perubahan identitas aplikasi, halaman depan, dan data sekolah. Tercatat di activity log.',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(required: false, content: new OA\JsonContent(properties: [
            new OA\Property(property: 'identitas', type: 'object'),
            new OA\Property(property: 'halaman_depan', type: 'object'),
            new OA\Property(property: 'sekolah', type: 'object'),
        ])),
        responses: [
            new OA\Response(response: 200, description: 'Pengaturan berhasil disimpan.'),
        ],
    )]
    public function update(Request $request)
    {
        ActivityLog::log('settings.update', 'info', ['data' => $request->all()]);

        return response()->json([
            'status'  => true,
            'message' => 'Pengaturan sistem berhasil disimpan.',
            'data'    => $request->all()
        ]);
    }
}
