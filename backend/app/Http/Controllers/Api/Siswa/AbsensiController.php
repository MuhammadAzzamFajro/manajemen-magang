<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class AbsensiController extends Controller
{
    #[OA\Get(
        path: '/api/siswa/absensi',
        summary: 'Riwayat absensi siswa',
        description: 'Riwayat presensi milik siswa yang sedang login, urut tanggal terbaru.',
        tags: ['Siswa'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Riwayat absensi.', content: new OA\JsonContent(
                type: 'array',
                items: new OA\Items(ref: '#/components/schemas/Absensi'),
            )),
        ],
    )]
    public function index(Request $request)
    {
        $siswa = $request->user()->siswa;

        $absensi = Absensi::where('siswa_id', $siswa->id)
            ->orderBy('tanggal', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'data'   => $absensi
        ]);
    }

    #[OA\Post(
        path: '/api/siswa/absensi',
        summary: 'Catat presensi / izin',
        description: 'Absen masuk/pulang atau izin/sakit hari ini. `foto` dikirim sebagai multipart/form-data (opsional). Satu baris absensi per hari per siswa (di-update bila sudah ada).',
        tags: ['Siswa'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(required: true, content: new OA\MediaType(
            mediaType: 'multipart/form-data',
            schema: new OA\Schema(required: ['type'], properties: [
                new OA\Property(property: 'type', type: 'string', enum: ['masuk', 'pulang', 'izin_sakit']),
                new OA\Property(property: 'status', type: 'string', enum: ['hadir', 'sakit', 'izin'], nullable: true),
                new OA\Property(property: 'catatan', type: 'string', nullable: true),
                new OA\Property(property: 'foto', type: 'string', format: 'binary', nullable: true),
            ]),
        )),
        responses: [
            new OA\Response(response: 200, description: 'Presensi berhasil dicatat.', content: new OA\JsonContent(ref: '#/components/schemas/Absensi')),
            new OA\Response(response: 422, description: 'Validasi gagal.'),
        ],
    )]
    public function store(Request $request)
    {
        $request->validate([
            'type'   => 'required|in:masuk,pulang,izin_sakit',
            'status' => 'required_if:type,izin_sakit|in:hadir,sakit,izin,alfa',
            'foto'   => 'nullable|image|max:4096',
        ]);

        $siswa = $request->user()->siswa;
        $today = now()->toDateString();

        $absensi = Absensi::firstOrNew([
            'siswa_id' => $siswa->id,
            'tanggal'  => $today,
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('absensi', 'public');
        }

        if ($request->type === 'masuk') {
            $absensi->status       = 'hadir';
            $absensi->jam_masuk    = now()->toTimeString();
            $absensi->foto_masuk   = $fotoPath;
            $absensi->status_validasi_guru = 'disetujui';
        } elseif ($request->type === 'pulang') {
            $absensi->jam_pulang  = now()->toTimeString();
            if ($fotoPath) {
                $absensi->foto_pulang = $fotoPath;
            }
        } elseif ($request->type === 'izin_sakit') {
            $absensi->status               = $request->status;
            $absensi->foto_masuk           = $fotoPath;
            $absensi->status_validasi_guru = 'menunggu';
            $absensi->catatan_guru         = $request->catatan;
        }

        $absensi->save();

        ActivityLog::log('siswa.absensi', 'info', ['absensi_id' => $absensi->id, 'type' => $request->type]);

        return response()->json([
            'status'  => true,
            'message' => 'Presensi berhasil dicatat.',
            'data'    => $absensi
        ]);
    }
}
