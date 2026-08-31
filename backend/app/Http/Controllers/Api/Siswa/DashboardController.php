<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use App\Models\PenempatanMagang;
use App\Models\Absensi;
use App\Models\JurnalHarian;
use App\Models\PengajuanMagang;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class DashboardController extends Controller
{
    #[OA\Get(
        path: '/api/siswa/dashboard',
        summary: 'Statistik dashboard siswa',
        description: 'Ringkasan status magang, penempatan, pengajuan terakhir, absensi hari ini, serta rekap presensi & jurnal siswa yang sedang login.',
        tags: ['Siswa'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Statistik dashboard siswa.'),
            new OA\Response(response: 404, description: 'Profil siswa tidak ditemukan.'),
        ],
    )]
    public function index(Request $request)
    {
        $siswa = $request->user()->siswa;

        if (!$siswa) {
            return response()->json(['status' => false, 'message' => 'Profil siswa tidak ditemukan.'], 404);
        }

        $penempatan = PenempatanMagang::where('siswa_id', $siswa->id)
            ->with(['tempatMagang', 'guru'])
            ->first();

        $absensiHariIni = Absensi::where('siswa_id', $siswa->id)
            ->where('tanggal', now()->toDateString())
            ->first();

        $pengajuanTerakhir = PengajuanMagang::where('siswa_id', $siswa->id)
            ->with('tempatMagang')
            ->latest()
            ->first();

        return response()->json([
            'status' => true,
            'data'   => [
                'siswa'              => $siswa,
                'status_magang'      => $siswa->status_magang,
                'penempatan'         => $penempatan,
                'pengajuan_terakhir' => $pengajuanTerakhir,
                'absensi_hari_ini'   => $absensiHariIni,
                'total_hadir'        => Absensi::where('siswa_id', $siswa->id)->where('status', 'hadir')->count(),
                'total_sakit_izin'   => Absensi::where('siswa_id', $siswa->id)->whereIn('status', ['sakit', 'izin'])->count(),
                'total_jurnal'       => JurnalHarian::where('siswa_id', $siswa->id)->count(),
                'jurnal_disetujui'   => JurnalHarian::where('siswa_id', $siswa->id)->where('status_verifikasi', 'disetujui')->count(),
            ]
        ]);
    }
}
