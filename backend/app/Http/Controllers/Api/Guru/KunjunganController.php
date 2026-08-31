<?php

namespace App\Http\Controllers\Api\Guru;

use App\Http\Controllers\Controller;
use App\Models\Kunjungan;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use OpenApi\Attributes as OA;

class KunjunganController extends Controller
{
    #[OA\Get(
        path: '/api/guru/kunjungan',
        summary: 'Daftar kunjungan lapangan',
        description: 'Catatan kunjungan lapangan milik guru yang sedang login.',
        tags: ['Guru'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Daftar kunjungan.', content: new OA\JsonContent(
                type: 'array',
                items: new OA\Items(ref: '#/components/schemas/Kunjungan'),
            )),
        ],
    )]
    public function index(Request $request)
    {
        $guru = $request->user()->guru;

        $kunjungan = Kunjungan::where('guru_id', $guru->id)
            ->with('tempatMagang')
            ->orderBy('tanggal_kunjungan', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'data'   => $kunjungan
        ]);
    }

    #[OA\Post(
        path: '/api/guru/kunjungan',
        summary: 'Tambah kunjungan lapangan',
        description: 'Membuat catatan kunjungan. `foto_dokumentasi` dikirim sebagai multipart/form-data (opsional).',
        tags: ['Guru'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(required: true, content: new OA\MediaType(
            mediaType: 'multipart/form-data',
            schema: new OA\Schema(required: ['tempat_magang_id', 'tanggal_kunjungan'], properties: [
                new OA\Property(property: 'tempat_magang_id', type: 'integer'),
                new OA\Property(property: 'tanggal_kunjungan', type: 'string', format: 'date'),
                new OA\Property(property: 'catatan_evaluasi', type: 'string', nullable: true),
                new OA\Property(property: 'foto_dokumentasi', type: 'string', format: 'binary', nullable: true),
            ]),
        )),
        responses: [
            new OA\Response(response: 201, description: 'Kunjungan berhasil ditambahkan.', content: new OA\JsonContent(ref: '#/components/schemas/Kunjungan')),
            new OA\Response(response: 422, description: 'Validasi gagal.'),
        ],
    )]
    public function store(Request $request)
    {
        $request->validate([
            'tempat_magang_id'  => 'required|exists:tempat_magang,id',
            'tanggal_kunjungan' => 'required|date',
            'catatan_evaluasi'  => 'nullable|string',
            'foto_dokumentasi'  => 'nullable|image|max:4096',
        ]);

        $guru = $request->user()->guru;
        $fotoPath = null;

        if ($request->hasFile('foto_dokumentasi')) {
            $fotoPath = $request->file('foto_dokumentasi')->store('kunjungan', 'public');
        }

        $kunjungan = Kunjungan::create([
            'guru_id'           => $guru->id,
            'tempat_magang_id'  => $request->tempat_magang_id,
            'tanggal_kunjungan' => $request->tanggal_kunjungan,
            'catatan_evaluasi'  => $request->catatan_evaluasi,
            'foto_dokumentasi'  => $fotoPath,
        ]);

        ActivityLog::log('guru.kunjungan_create', 'info', ['kunjungan_id' => $kunjungan->id]);

        return response()->json([
            'status'  => true,
            'message' => 'Catatan kunjungan lapangan berhasil ditambahkan.',
            'data'    => $kunjungan->load('tempatMagang')
        ], 201);
    }

    #[OA\Put(
        path: '/api/guru/kunjungan/{id}',
        summary: 'Perbarui kunjungan lapangan',
        tags: ['Guru'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(required: true, content: new OA\MediaType(
            mediaType: 'multipart/form-data',
            schema: new OA\Schema(required: ['tempat_magang_id', 'tanggal_kunjungan'], properties: [
                new OA\Property(property: 'tempat_magang_id', type: 'integer'),
                new OA\Property(property: 'tanggal_kunjungan', type: 'string', format: 'date'),
                new OA\Property(property: 'catatan_evaluasi', type: 'string', nullable: true),
                new OA\Property(property: 'foto_dokumentasi', type: 'string', format: 'binary', nullable: true),
            ]),
        )),
        responses: [
            new OA\Response(response: 200, description: 'Kunjungan berhasil diperbarui.', content: new OA\JsonContent(ref: '#/components/schemas/Kunjungan')),
            new OA\Response(response: 404, description: 'Kunjungan tidak ditemukan.'),
            new OA\Response(response: 422, description: 'Validasi gagal.'),
        ],
    )]
    public function update(Request $request, $id)
    {
        $guru = $request->user()->guru;
        $kunjungan = Kunjungan::where('guru_id', $guru->id)->findOrFail($id);

        $request->validate([
            'tempat_magang_id'  => 'required|exists:tempat_magang,id',
            'tanggal_kunjungan' => 'required|date',
            'catatan_evaluasi'  => 'nullable|string',
            'foto_dokumentasi'  => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('foto_dokumentasi')) {
            if ($kunjungan->foto_dokumentasi) {
                Storage::disk('public')->delete($kunjungan->foto_dokumentasi);
            }
            $kunjungan->foto_dokumentasi = $request->file('foto_dokumentasi')->store('kunjungan', 'public');
        }

        $kunjungan->update($request->only(['tempat_magang_id', 'tanggal_kunjungan', 'catatan_evaluasi']));

        ActivityLog::log('guru.kunjungan_update', 'info', ['kunjungan_id' => $kunjungan->id]);

        return response()->json([
            'status'  => true,
            'message' => 'Catatan kunjungan berhasil diperbarui.',
            'data'    => $kunjungan->load('tempatMagang')
        ]);
    }

    #[OA\Delete(
        path: '/api/guru/kunjungan/{id}',
        summary: 'Hapus kunjungan lapangan',
        tags: ['Guru'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Kunjungan berhasil dihapus.'),
            new OA\Response(response: 404, description: 'Kunjungan tidak ditemukan.'),
        ],
    )]
    public function destroy(Request $request, $id)
    {
        $guru = $request->user()->guru;
        $kunjungan = Kunjungan::where('guru_id', $guru->id)->findOrFail($id);

        if ($kunjungan->foto_dokumentasi) {
            Storage::disk('public')->delete($kunjungan->foto_dokumentasi);
        }

        ActivityLog::log('guru.kunjungan_delete', 'warn', ['kunjungan_id' => $kunjungan->id]);
        $kunjungan->delete();

        return response()->json([
            'status'  => true,
            'message' => 'Catatan kunjungan berhasil dihapus.'
        ]);
    }
}
