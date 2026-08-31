<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PenempatanMagang;
use App\Models\Siswa;
use App\Models\TempatMagang;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use OpenApi\Attributes as OA;

class PenempatanController extends Controller
{
    #[OA\Get(
        path: '/api/admin/penempatan',
        summary: 'Daftar penempatan magang',
        description: 'Semua penempatan beserta relasi siswa, tempat magang, dan guru pembimbing.',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Daftar penempatan.', content: new OA\JsonContent(
                type: 'array',
                items: new OA\Items(ref: '#/components/schemas/PenempatanMagang'),
            )),
        ],
    )]
    public function index()
    {
        $penempatan = PenempatanMagang::with(['siswa.kelas', 'tempatMagang', 'guru'])->get();

        return response()->json([
            'status' => true,
            'data'   => $penempatan
        ]);
    }

    #[OA\Post(
        path: '/api/admin/penempatan',
        summary: 'Buat penempatan magang',
        description: 'Menempatkan siswa ke DUDI + guru pembimbing, sekaligus mengubah status siswa menjadi sedang_magang. Kuota DUDI harus tersedia.',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(
            required: ['siswa_id', 'tempat_magang_id', 'guru_id', 'tanggal_mulai', 'tanggal_selesai'],
            properties: [
                new OA\Property(property: 'siswa_id', type: 'integer'),
                new OA\Property(property: 'tempat_magang_id', type: 'integer'),
                new OA\Property(property: 'guru_id', type: 'integer'),
                new OA\Property(property: 'tanggal_mulai', type: 'string', format: 'date'),
                new OA\Property(property: 'tanggal_selesai', type: 'string', format: 'date'),
            ],
        )),
        responses: [
            new OA\Response(response: 201, description: 'Penempatan berhasil dibuat.', content: new OA\JsonContent(ref: '#/components/schemas/PenempatanMagang')),
            new OA\Response(response: 422, description: 'Validasi gagal atau kuota DUDI habis.'),
        ],
    )]
    public function store(Request $request)
    {
        $request->validate([
            'siswa_id'         => 'required|exists:siswa,id',
            'tempat_magang_id' => 'required|exists:tempat_magang,id',
            'guru_id'          => 'required|exists:guru,id',
            'tanggal_mulai'    => 'required|date',
            'tanggal_selesai'  => 'required|date|after:tanggal_mulai',
        ]);

        $dudi = TempatMagang::findOrFail($request->tempat_magang_id);
        if ($dudi->sisa_kuota <= 0) {
            return response()->json([
                'status'  => false,
                'message' => 'Kuota tempat magang ini sudah habis!'
            ], 422);
        }

        return DB::transaction(function () use ($request) {
            $penempatan = PenempatanMagang::create([
                'siswa_id'          => $request->siswa_id,
                'tempat_magang_id'  => $request->tempat_magang_id,
                'guru_id'           => $request->guru_id,
                'tanggal_mulai'     => $request->tanggal_mulai,
                'tanggal_selesai'   => $request->tanggal_selesai,
                'status_pengesahan' => 'disahkan',
            ]);

            Siswa::where('id', $request->siswa_id)->update(['status_magang' => 'sedang_magang']);

            ActivityLog::log('penempatan.create', 'info', ['penempatan_id' => $penempatan->id]);

            return response()->json([
                'status'  => true,
                'message' => 'Penempatan magang berhasil dibuat.',
                'data'    => $penempatan->load(['siswa', 'tempatMagang', 'guru'])
            ], 201);
        });
    }

    #[OA\Put(
        path: '/api/admin/penempatan/{id}',
        summary: 'Perbarui penempatan magang',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(
            required: ['tempat_magang_id', 'guru_id', 'tanggal_mulai', 'tanggal_selesai'],
            properties: [
                new OA\Property(property: 'tempat_magang_id', type: 'integer'),
                new OA\Property(property: 'guru_id', type: 'integer'),
                new OA\Property(property: 'tanggal_mulai', type: 'string', format: 'date'),
                new OA\Property(property: 'tanggal_selesai', type: 'string', format: 'date'),
            ],
        )),
        responses: [
            new OA\Response(response: 200, description: 'Penempatan berhasil diperbarui.', content: new OA\JsonContent(ref: '#/components/schemas/PenempatanMagang')),
        ],
    )]
    public function update(Request $request, $id)
    {
        $penempatan = PenempatanMagang::findOrFail($id);

        $request->validate([
            'tempat_magang_id' => 'required|exists:tempat_magang,id',
            'guru_id'          => 'required|exists:guru,id',
            'tanggal_mulai'    => 'required|date',
            'tanggal_selesai'  => 'required|date|after:tanggal_mulai',
        ]);

        $penempatan->update($request->only(['tempat_magang_id', 'guru_id', 'tanggal_mulai', 'tanggal_selesai']));

        ActivityLog::log('penempatan.update', 'info', ['penempatan_id' => $penempatan->id]);

        return response()->json([
            'status'  => true,
            'message' => 'Penempatan magang berhasil diperbarui.',
            'data'    => $penempatan->load(['siswa', 'tempatMagang', 'guru'])
        ]);
    }

    #[OA\Post(
        path: '/api/admin/penempatan/{id}/sahkan',
        summary: 'Sahkan penempatan magang',
        description: 'Mengesahkan penempatan dan menandai siswa sebagai sedang_magang.',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Penempatan disahkan.', content: new OA\JsonContent(ref: '#/components/schemas/PenempatanMagang')),
        ],
    )]
    public function sahkan($id)
    {
        $penempatan = PenempatanMagang::findOrFail($id);
        $penempatan->update(['status_pengesahan' => 'disahkan']);
        $penempatan->siswa->update(['status_magang' => 'sedang_magang']);

        ActivityLog::log('penempatan.sahkan', 'info', ['penempatan_id' => $penempatan->id]);

        return response()->json([
            'status'  => true,
            'message' => 'Penempatan magang telah disahkan.',
            'data'    => $penempatan
        ]);
    }

    #[OA\Delete(
        path: '/api/admin/penempatan/{id}/batalkan',
        summary: 'Batalkan penempatan magang',
        description: 'Menghapus penempatan dan mengembalikan status siswa menjadi belum_magang.',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Penempatan dibatalkan.'),
        ],
    )]
    public function batalkan($id)
    {
        $penempatan = PenempatanMagang::findOrFail($id);

        return DB::transaction(function () use ($penempatan) {
            $siswa = $penempatan->siswa;

            ActivityLog::log('penempatan.batalkan', 'warn', [
                'penempatan_id' => $penempatan->id,
                'siswa_id'      => $siswa->id
            ]);

            $penempatan->delete();
            $siswa->update(['status_magang' => 'belum_magang']);

            return response()->json([
                'status'  => true,
                'message' => 'Penempatan magang berhasil dibatalkan dan status siswa dikembalikan.'
            ]);
        });
    }
}
