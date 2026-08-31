<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use App\Models\PengajuanMagang;
use App\Models\TempatMagang;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class PengajuanController extends Controller
{
    #[OA\Get(
        path: '/api/siswa/pengajuan',
        summary: 'Daftar pengajuan magang siswa',
        description: 'Riwayat pengajuan magang milik siswa yang sedang login.',
        tags: ['Siswa'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Daftar pengajuan.', content: new OA\JsonContent(
                type: 'array',
                items: new OA\Items(ref: '#/components/schemas/PengajuanMagang'),
            )),
        ],
    )]
    public function index(Request $request)
    {
        $siswa = $request->user()->siswa;

        $pengajuan = PengajuanMagang::where('siswa_id', $siswa->id)
            ->with('tempatMagang')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'data'   => $pengajuan
        ]);
    }

    #[OA\Post(
        path: '/api/siswa/pengajuan',
        summary: 'Buat pengajuan magang',
        description: 'Mengirim pengajuan magang ke DUDI. Kuota DUDI harus tersedia. Status siswa otomatis menjadi pengajuan.',
        tags: ['Siswa'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(
            required: ['tempat_magang_id', 'posisi_diminati', 'tanggal_mulai_usulan', 'tanggal_selesai_usulan'],
            properties: [
                new OA\Property(property: 'tempat_magang_id', type: 'integer'),
                new OA\Property(property: 'posisi_diminati', type: 'string', example: 'Programmer'),
                new OA\Property(property: 'tanggal_mulai_usulan', type: 'string', format: 'date'),
                new OA\Property(property: 'tanggal_selesai_usulan', type: 'string', format: 'date'),
            ],
        )),
        responses: [
            new OA\Response(response: 201, description: 'Pengajuan berhasil dikirim.', content: new OA\JsonContent(ref: '#/components/schemas/PengajuanMagang')),
            new OA\Response(response: 422, description: 'Validasi gagal atau kuota DUDI habis.'),
        ],
    )]
    public function store(Request $request)
    {
        $request->validate([
            'tempat_magang_id'      => 'required|exists:tempat_magang,id',
            'posisi_diminati'       => 'required|string|max:255',
            'tanggal_mulai_usulan'  => 'required|date',
            'tanggal_selesai_usulan'=> 'required|date|after:tanggal_mulai_usulan',
        ]);

        $siswa = $request->user()->siswa;

        if (in_array($siswa->status_magang, ['sedang_magang', 'lulus'])) {
            return response()->json([
                'status'  => false,
                'message' => 'Anda sudah terdaftar magang, tidak dapat mengajukan magang lagi.'
            ], 422);
        }

        $dudi = TempatMagang::findOrFail($request->tempat_magang_id);
        if ($dudi->sisa_kuota <= 0) {
            return response()->json([
                'status'  => false,
                'message' => 'Kuota tempat magang ini sudah tidak tersedia.'
            ], 422);
        }

        $pengajuan = PengajuanMagang::create([
            'siswa_id'               => $siswa->id,
            'tempat_magang_id'       => $request->tempat_magang_id,
            'posisi_diminati'        => $request->posisi_diminati,
            'tanggal_mulai_usulan'   => $request->tanggal_mulai_usulan,
            'tanggal_selesai_usulan' => $request->tanggal_selesai_usulan,
            'status'                 => 'menunggu',
        ]);

        $siswa->update(['status_magang' => 'pengajuan']);

        ActivityLog::log('siswa.pengajuan_create', 'info', ['pengajuan_id' => $pengajuan->id]);

        return response()->json([
            'status'  => true,
            'message' => 'Pengajuan magang berhasil dikirim.',
            'data'    => $pengajuan->load('tempatMagang')
        ], 201);
    }
}
