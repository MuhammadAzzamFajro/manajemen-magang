<?php

namespace App\Http\Controllers\Api\Guru;

use App\Http\Controllers\Controller;
use App\Models\JurnalHarian;
use App\Models\PenempatanMagang;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class JurnalController extends Controller
{
    #[OA\Get(
        path: '/api/guru/jurnal',
        summary: 'Daftar jurnal siswa bimbingan',
        description: 'Jurnal harian siswa bimbingan guru, bisa difilter berdasarkan status verifikasi.',
        tags: ['Guru'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'status', in: 'query', description: 'Filter status verifikasi.', required: false, schema: new OA\Schema(type: 'string', enum: ['menunggu', 'disetujui', 'perlu_revisi'])),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Daftar jurnal.', content: new OA\JsonContent(
                type: 'array',
                items: new OA\Items(ref: '#/components/schemas/JurnalHarian'),
            )),
        ],
    )]
    public function index(Request $request)
    {
        $guru = $request->user()->guru;
        $siswaIds = PenempatanMagang::where('guru_id', $guru->id)->pluck('siswa_id');

        $query = JurnalHarian::whereIn('siswa_id', $siswaIds)->with('siswa.penempatan.tempatMagang');

        if ($request->status) {
            $query->where('status_verifikasi', $request->status);
        }

        return response()->json([
            'status' => true,
            'data'   => $query->orderBy('tanggal', 'desc')->get()
        ]);
    }

    #[OA\Patch(
        path: '/api/guru/jurnal/{id}/validasi',
        summary: 'Validasi jurnal siswa',
        description: 'Menyetujui atau meminta revisi jurnal siswa, dengan catatan opsional.',
        tags: ['Guru'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID jurnal.', schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(
            required: ['status_verifikasi'],
            properties: [
                new OA\Property(property: 'status_verifikasi', type: 'string', enum: ['disetujui', 'perlu_revisi']),
                new OA\Property(property: 'catatan_guru', type: 'string', nullable: true),
            ],
        )),
        responses: [
            new OA\Response(response: 200, description: 'Status verifikasi berhasil diubah.', content: new OA\JsonContent(ref: '#/components/schemas/JurnalHarian')),
            new OA\Response(response: 404, description: 'Jurnal tidak ditemukan.'),
            new OA\Response(response: 422, description: 'Validasi gagal.'),
        ],
    )]
    public function validasi(Request $request, $id)
    {
        $request->validate([
            'status_verifikasi' => 'required|in:disetujui,perlu_revisi',
            'catatan_guru'      => 'nullable|string',
        ]);

        $jurnal = JurnalHarian::findOrFail($id);
        $jurnal->update([
            'status_verifikasi' => $request->status_verifikasi,
            'catatan_guru'      => $request->catatan_guru,
        ]);

        ActivityLog::log('guru.validasi_jurnal', 'info', [
            'jurnal_id' => $jurnal->id,
            'status'    => $request->status_verifikasi
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Status verifikasi jurnal berhasil diperbarui.',
            'data'    => $jurnal
        ]);
    }
}
