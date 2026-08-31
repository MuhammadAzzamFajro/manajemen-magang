<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\TempatMagang;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class DudiController extends Controller
{
    #[OA\Get(
        path: '/api/admin/dudi',
        summary: 'Daftar mitra DUDI',
        description: 'Daftar semua tempat magang beserta jumlah penempatan. Dapat difilter dengan pencarian.',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'search', in: 'query', description: 'Cari berdasarkan nama perusahaan atau bidang usaha.', required: false, schema: new OA\Schema(type: 'string')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Daftar DUDI.', content: new OA\JsonContent(
                type: 'array',
                items: new OA\Items(ref: '#/components/schemas/TempatMagang'),
            )),
        ],
    )]
    public function index(Request $request)
    {
        $query = TempatMagang::withCount('penempatan');

        if ($request->search) {
            $query->where('nama_perusahaan', 'like', "%{$request->search}%")
                  ->orWhere('bidang_usaha', 'like', "%{$request->search}%");
        }

        return response()->json([
            'status' => true,
            'data'   => $query->get()
        ]);
    }

    #[OA\Post(
        path: '/api/admin/dudi',
        summary: 'Tambah mitra DUDI',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(
            required: ['nama_perusahaan', 'bidang_usaha', 'nama_pic', 'kontak_pic', 'kuota', 'alamat'],
            properties: [
                new OA\Property(property: 'nama_perusahaan', type: 'string', example: 'PT Teknologi Nusantara'),
                new OA\Property(property: 'bidang_usaha', type: 'string', example: 'Teknologi Informasi'),
                new OA\Property(property: 'nama_pic', type: 'string', example: 'Budi Santoso'),
                new OA\Property(property: 'kontak_pic', type: 'string', example: '0812-3456-7890'),
                new OA\Property(property: 'kuota', type: 'integer', minimum: 1, example: 10),
                new OA\Property(property: 'alamat', type: 'string', example: 'Jl. Industri No. 10, Malang'),
            ],
        )),
        responses: [
            new OA\Response(response: 201, description: 'DUDI berhasil ditambahkan.', content: new OA\JsonContent(ref: '#/components/schemas/TempatMagang')),
            new OA\Response(response: 422, description: 'Validasi gagal.'),
        ],
    )]
    public function store(Request $request)
    {
        $request->validate([
            'nama_perusahaan' => 'required|string|max:255',
            'bidang_usaha'    => 'required|string|max:255',
            'nama_pic'        => 'required|string|max:255',
            'kontak_pic'      => 'required|string|max:100',
            'kuota'           => 'required|integer|min:1',
            'alamat'          => 'required|string',
        ]);

        $dudi = TempatMagang::create([
            'nama_perusahaan'   => $request->nama_perusahaan,
            'bidang_usaha'      => $request->bidang_usaha,
            'nama_pic'          => $request->nama_pic,
            'kontak_pic'        => $request->kontak_pic,
            'kuota'             => $request->kuota,
            'alamat'            => $request->alamat,
            'status_verifikasi' => 'terverifikasi',
        ]);

        ActivityLog::log('dudi.create', 'info', ['dudi_id' => $dudi->id]);

        return response()->json([
            'status'  => true,
            'message' => 'Mitra DUDI berhasil ditambahkan.',
            'data'    => $dudi
        ], 201);
    }

    #[OA\Put(
        path: '/api/admin/dudi/{id}',
        summary: 'Perbarui data mitra DUDI',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(
            required: ['nama_perusahaan', 'bidang_usaha', 'nama_pic', 'kontak_pic', 'kuota', 'alamat'],
            properties: [
                new OA\Property(property: 'nama_perusahaan', type: 'string'),
                new OA\Property(property: 'bidang_usaha', type: 'string'),
                new OA\Property(property: 'nama_pic', type: 'string'),
                new OA\Property(property: 'kontak_pic', type: 'string'),
                new OA\Property(property: 'kuota', type: 'integer', minimum: 1),
                new OA\Property(property: 'alamat', type: 'string'),
            ],
        )),
        responses: [
            new OA\Response(response: 200, description: 'DUDI berhasil diperbarui.', content: new OA\JsonContent(ref: '#/components/schemas/TempatMagang')),
        ],
    )]
    public function update(Request $request, $id)
    {
        $dudi = TempatMagang::findOrFail($id);

        $request->validate([
            'nama_perusahaan' => 'required|string|max:255',
            'bidang_usaha'    => 'required|string|max:255',
            'nama_pic'        => 'required|string|max:255',
            'kontak_pic'      => 'required|string|max:100',
            'kuota'           => 'required|integer|min:1',
            'alamat'          => 'required|string',
        ]);

        $dudi->update($request->only([
            'nama_perusahaan', 'bidang_usaha', 'nama_pic', 'kontak_pic', 'kuota', 'alamat'
        ]));

        ActivityLog::log('dudi.update', 'info', ['dudi_id' => $dudi->id]);

        return response()->json([
            'status'  => true,
            'message' => 'Data mitra DUDI berhasil diperbarui.',
            'data'    => $dudi
        ]);
    }

    #[OA\Patch(
        path: '/api/admin/dudi/{id}/verifikasi',
        summary: 'Toggle status verifikasi DUDI',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Status verifikasi berhasil diubah.', content: new OA\JsonContent(ref: '#/components/schemas/TempatMagang')),
        ],
    )]
    public function verifikasi($id)
    {
        $dudi = TempatMagang::findOrFail($id);
        $newStatus = $dudi->status_verifikasi === 'terverifikasi' ? 'belum_diverifikasi' : 'terverifikasi';
        $dudi->update(['status_verifikasi' => $newStatus]);

        ActivityLog::log('dudi.toggle_verifikasi', 'info', ['dudi_id' => $dudi->id, 'status' => $newStatus]);

        return response()->json([
            'status'  => true,
            'message' => "Status verifikasi DUDI diubah menjadi {$newStatus}.",
            'data'    => $dudi
        ]);
    }

    #[OA\Delete(
        path: '/api/admin/dudi/{id}',
        summary: 'Hapus mitra DUDI',
        description: 'Penghapusan ditolak apabila masih ada siswa yang sedang aktif magang di DUDI tersebut.',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'DUDI berhasil dihapus.'),
            new OA\Response(response: 422, description: 'Gagal: masih ada siswa aktif magang.'),
        ],
    )]
    public function destroy($id)
    {
        $dudi = TempatMagang::findOrFail($id);

        // Aturan bisnis: Delete ditolak jika masih ada siswa aktif magang
        if ($dudi->siswaAktif()->exists()) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal menghapus! DUDI ini masih memiliki siswa yang sedang aktif magang.'
            ], 422);
        }

        ActivityLog::log('dudi.delete', 'warn', ['dudi_id' => $dudi->id, 'nama' => $dudi->nama_perusahaan]);
        $dudi->delete();

        return response()->json([
            'status'  => true,
            'message' => 'Mitra DUDI berhasil dihapus.'
        ]);
    }
}
