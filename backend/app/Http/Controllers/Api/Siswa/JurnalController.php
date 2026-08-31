<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use App\Models\JurnalHarian;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use OpenApi\Attributes as OA;

class JurnalController extends Controller
{
    #[OA\Get(
        path: '/api/siswa/jurnal',
        summary: 'Daftar jurnal harian siswa',
        description: 'Riwayat jurnal harian milik siswa yang sedang login, urut tanggal terbaru.',
        tags: ['Siswa'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Daftar jurnal.', content: new OA\JsonContent(
                type: 'array',
                items: new OA\Items(ref: '#/components/schemas/JurnalHarian'),
            )),
        ],
    )]
    public function index(Request $request)
    {
        $siswa = $request->user()->siswa;

        $jurnal = JurnalHarian::where('siswa_id', $siswa->id)
            ->orderBy('tanggal', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'data'   => $jurnal
        ]);
    }

    #[OA\Post(
        path: '/api/siswa/jurnal',
        summary: 'Buat jurnal harian',
        description: 'Menyimpan jurnal harian baru. `foto_bukti` dikirim sebagai multipart/form-data (opsional). Status awal menunggu verifikasi guru.',
        tags: ['Siswa'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(required: true, content: new OA\MediaType(
            mediaType: 'multipart/form-data',
            schema: new OA\Schema(required: ['tanggal', 'uraian_kegiatan'], properties: [
                new OA\Property(property: 'tanggal', type: 'string', format: 'date', example: '2026-08-30'),
                new OA\Property(property: 'uraian_kegiatan', type: 'string', minLength: 15),
                new OA\Property(property: 'kendala', type: 'string', nullable: true),
                new OA\Property(property: 'solusi', type: 'string', nullable: true),
                new OA\Property(property: 'foto_bukti', type: 'string', format: 'binary', nullable: true),
            ]),
        )),
        responses: [
            new OA\Response(response: 201, description: 'Jurnal berhasil disimpan.', content: new OA\JsonContent(ref: '#/components/schemas/JurnalHarian')),
            new OA\Response(response: 422, description: 'Validasi gagal.'),
        ],
    )]
    public function store(Request $request)
    {
        $request->validate([
            'tanggal'         => 'required|date',
            'uraian_kegiatan' => 'required|string|min:15',
            'kendala'         => 'nullable|string',
            'solusi'          => 'nullable|string',
            'foto_bukti'      => 'nullable|image|max:4096',
        ]);

        $siswa = $request->user()->siswa;
        $fotoPath = null;

        if ($request->hasFile('foto_bukti')) {
            $fotoPath = $request->file('foto_bukti')->store('jurnal', 'public');
        }

        $jurnal = JurnalHarian::create([
            'siswa_id'          => $siswa->id,
            'tanggal'           => $request->tanggal,
            'uraian_kegiatan'   => $request->uraian_kegiatan,
            'kendala'           => $request->kendala,
            'solusi'            => $request->solusi,
            'foto_bukti'        => $fotoPath,
            'status_verifikasi' => 'menunggu',
        ]);

        ActivityLog::log('siswa.jurnal_create', 'info', ['jurnal_id' => $jurnal->id]);

        return response()->json([
            'status'  => true,
            'message' => 'Jurnal harian berhasil disimpan.',
            'data'    => $jurnal
        ], 201);
    }

    #[OA\Put(
        path: '/api/siswa/jurnal/{id}',
        summary: 'Perbarui jurnal harian',
        description: 'Mengubah jurnal milik siswa sendiri. Ditolak bila jurnal sudah disetujui guru.',
        tags: ['Siswa'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(required: true, content: new OA\MediaType(
            mediaType: 'multipart/form-data',
            schema: new OA\Schema(required: ['tanggal', 'uraian_kegiatan'], properties: [
                new OA\Property(property: 'tanggal', type: 'string', format: 'date'),
                new OA\Property(property: 'uraian_kegiatan', type: 'string', minLength: 15),
                new OA\Property(property: 'kendala', type: 'string', nullable: true),
                new OA\Property(property: 'solusi', type: 'string', nullable: true),
                new OA\Property(property: 'foto_bukti', type: 'string', format: 'binary', nullable: true),
            ]),
        )),
        responses: [
            new OA\Response(response: 200, description: 'Jurnal berhasil diperbarui.', content: new OA\JsonContent(ref: '#/components/schemas/JurnalHarian')),
            new OA\Response(response: 404, description: 'Jurnal tidak ditemukan.'),
            new OA\Response(response: 422, description: 'Jurnal sudah disetujui / validasi gagal.'),
        ],
    )]
    public function update(Request $request, $id)
    {
        $siswa = $request->user()->siswa;
        $jurnal = JurnalHarian::where('siswa_id', $siswa->id)->findOrFail($id);

        if ($jurnal->status_verifikasi === 'disetujui') {
            return response()->json([
                'status'  => false,
                'message' => 'Jurnal yang sudah disetujui guru tidak dapat diubah!'
            ], 422);
        }

        $request->validate([
            'tanggal'         => 'required|date',
            'uraian_kegiatan' => 'required|string|min:15',
            'kendala'         => 'nullable|string',
            'solusi'          => 'nullable|string',
            'foto_bukti'      => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('foto_bukti')) {
            if ($jurnal->foto_bukti) {
                Storage::disk('public')->delete($jurnal->foto_bukti);
            }
            $jurnal->foto_bukti = $request->file('foto_bukti')->store('jurnal', 'public');
        }

        $jurnal->update([
            'tanggal'           => $request->tanggal,
            'uraian_kegiatan'   => $request->uraian_kegiatan,
            'kendala'           => $request->kendala,
            'solusi'            => $request->solusi,
            'status_verifikasi' => 'menunggu', // reset back to pending for review
        ]);

        ActivityLog::log('siswa.jurnal_update', 'info', ['jurnal_id' => $jurnal->id]);

        return response()->json([
            'status'  => true,
            'message' => 'Jurnal harian berhasil diperbarui.',
            'data'    => $jurnal
        ]);
    }

    #[OA\Delete(
        path: '/api/siswa/jurnal/{id}',
        summary: 'Hapus jurnal harian',
        description: 'Menghapus jurnal milik siswa sendiri. Ditolak bila jurnal sudah disetujui guru.',
        tags: ['Siswa'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Jurnal berhasil dihapus.'),
            new OA\Response(response: 422, description: 'Jurnal sudah disetujui tidak bisa dihapus.'),
        ],
    )]
    public function destroy(Request $request, $id)
    {
        $siswa = $request->user()->siswa;
        $jurnal = JurnalHarian::where('siswa_id', $siswa->id)->findOrFail($id);

        if ($jurnal->status_verifikasi === 'disetujui') {
            return response()->json([
                'status'  => false,
                'message' => 'Jurnal yang sudah disetujui tidak dapat dihapus!'
            ], 422);
        }

        if ($jurnal->foto_bukti) {
            Storage::disk('public')->delete($jurnal->foto_bukti);
        }

        ActivityLog::log('siswa.jurnal_delete', 'warn', ['jurnal_id' => $jurnal->id]);
        $jurnal->delete();

        return response()->json([
            'status'  => true,
            'message' => 'Jurnal harian berhasil dihapus.'
        ]);
    }
}
