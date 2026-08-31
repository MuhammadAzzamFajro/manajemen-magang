<?php

namespace App\Http\Controllers\Api\Guru;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\PenempatanMagang;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class AbsensiController extends Controller
{
    #[OA\Get(
        path: '/api/guru/absensi',
        summary: 'Daftar absensi siswa bimbingan',
        description: 'Riwayat absensi siswa bimbingan guru, bisa difilter berdasarkan status validasi.',
        tags: ['Guru'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'status_validasi', in: 'query', description: 'Filter status validasi guru.', required: false, schema: new OA\Schema(type: 'string', enum: ['menunggu', 'disetujui', 'ditolak'])),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Daftar absensi.', content: new OA\JsonContent(
                type: 'array',
                items: new OA\Items(ref: '#/components/schemas/Absensi'),
            )),
        ],
    )]
    public function index(Request $request)
    {
        $guru = $request->user()->guru;
        $siswaIds = PenempatanMagang::where('guru_id', $guru->id)->pluck('siswa_id');

        $query = Absensi::whereIn('siswa_id', $siswaIds)->with('siswa.penempatan.tempatMagang');

        if ($request->status_validasi) {
            $query->where('status_validasi_guru', $request->status_validasi);
        }

        return response()->json([
            'status' => true,
            'data'   => $query->orderBy('tanggal', 'desc')->get()
        ]);
    }

    #[OA\Patch(
        path: '/api/guru/absensi/{id}/validasi',
        summary: 'Validasi absensi siswa',
        description: 'Menyetujui atau menolak absensi siswa, dengan catatan opsional.',
        tags: ['Guru'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID absensi.', schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(
            required: ['status_validasi_guru'],
            properties: [
                new OA\Property(property: 'status_validasi_guru', type: 'string', enum: ['disetujui', 'ditolak']),
                new OA\Property(property: 'catatan_guru', type: 'string', nullable: true),
            ],
        )),
        responses: [
            new OA\Response(response: 200, description: 'Status validasi berhasil diubah.', content: new OA\JsonContent(ref: '#/components/schemas/Absensi')),
            new OA\Response(response: 404, description: 'Absensi tidak ditemukan.'),
            new OA\Response(response: 422, description: 'Validasi gagal.'),
        ],
    )]
    public function validasi(Request $request, $id)
    {
        $request->validate([
            'status_validasi_guru' => 'required|in:disetujui,ditolak',
            'catatan_guru'         => 'nullable|string',
        ]);

        $absensi = Absensi::findOrFail($id);
        $absensi->update([
            'status_validasi_guru' => $request->status_validasi_guru,
            'catatan_guru'         => $request->catatan_guru,
        ]);

        ActivityLog::log('guru.validasi_absensi', 'info', [
            'absensi_id' => $absensi->id,
            'status'     => $request->status_validasi_guru
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Status validasi absensi berhasil diperbarui.',
            'data'    => $absensi
        ]);
    }
}
