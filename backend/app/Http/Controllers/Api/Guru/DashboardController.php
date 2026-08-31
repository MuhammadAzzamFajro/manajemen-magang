<?php

namespace App\Http\Controllers\Api\Guru;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\PenempatanMagang;
use App\Models\JurnalHarian;
use App\Models\Absensi;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class DashboardController extends Controller
{
    #[OA\Get(
        path: '/api/guru/dashboard',
        summary: 'Statistik dashboard guru',
        description: 'Ringkasan nilai/absensi/jurnal untuk siswa bimbingan guru yang sedang login.',
        tags: ['Guru'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Statistik dashboard guru.'),
            new OA\Response(response: 404, description: 'Profil guru tidak ditemukan.'),
        ],
    )]
    public function index(Request $request)
    {
        $guru = $request->user()->guru;

        if (!$guru) {
            return response()->json(['status' => false, 'message' => 'Profil guru tidak ditemukan.'], 404);
        }

        $siswaBimbinganIds = PenempatanMagang::where('guru_id', $guru->id)->pluck('siswa_id');

        $jurnalBelumEvaluasi = JurnalHarian::whereIn('siswa_id', $siswaBimbinganIds)
            ->where('status_verifikasi', 'menunggu')
            ->with('siswa')
            ->get();

        $absensiHariIni = Absensi::whereIn('siswa_id', $siswaBimbinganIds)
            ->where('tanggal', now()->toDateString())
            ->with('siswa')
            ->get();

        return response()->json([
            'status' => true,
            'data'   => [
                'total_siswa_bimbingan'   => $siswaBimbinganIds->count(),
                'jurnal_perlu_evaluasi'   => $jurnalBelumEvaluasi->count(),
                'absensi_menunggu'        => Absensi::whereIn('siswa_id', $siswaBimbinganIds)->where('status_validasi_guru', 'menunggu')->count(),
                'jurnal_perlu_evaluasi_list' => $jurnalBelumEvaluasi,
                'absensi_hari_ini'        => $absensiHariIni,
                'siswa_bimbingan'         => PenempatanMagang::where('guru_id', $guru->id)->with(['siswa.kelas', 'tempatMagang'])->get(),
            ]
        ]);
    }
}
