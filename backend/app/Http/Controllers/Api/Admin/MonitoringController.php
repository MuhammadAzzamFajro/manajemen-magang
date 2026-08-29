<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use Illuminate\Http\Request;

class MonitoringController extends Controller
{
    public function index(Request $request)
    {
        $query = Siswa::with(['penempatan.tempatMagang', 'penempatan.guru'])
            ->withCount([
                'absensi as total_absensi',
                'absensi as total_hadir' => function ($q) { $q->where('status', 'hadir'); },
                'jurnal as total_jurnal',
                'jurnal as jurnal_disetujui' => function ($q) { $q->where('status_verifikasi', 'disetujui'); },
            ]);

        if ($request->has('kelas') && $request->kelas) {
            $query->where('kelas', $request->kelas);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%");
            });
        }

        return response()->json([
            'status' => true,
            'data'   => $query->paginate(15)
        ]);
    }

    public function show($siswa_id)
    {
        $siswa = Siswa::with([
            'penempatan.tempatMagang',
            'penempatan.guru',
            'absensi' => function ($q) { $q->orderBy('tanggal', 'desc')->take(30); },
            'jurnal'  => function ($q) { $q->orderBy('tanggal', 'desc')->take(30); },
            'pengajuan.tempatMagang'
        ])->findOrFail($siswa_id);

        return response()->json([
            'status' => true,
            'data'   => $siswa
        ]);
    }
}
