<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ActivityLog;

class SettingsController extends Controller
{
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
