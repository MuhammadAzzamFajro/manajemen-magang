<?php

namespace App\Http\Controllers\Api\Guru;

use App\Http\Controllers\Controller;
use App\Models\PenempatanMagang;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class SiswaController extends Controller
{
    #[OA\Get(
        path: '/api/guru/siswa',
        summary: 'Daftar siswa bimbingan',
        description: 'Daftar penempatan siswa bimbingan guru, lengkap dengan relasi absensi, jurnal, dan DUDI tempat magang.',
        tags: ['Guru'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Daftar bimbingan.', content: new OA\JsonContent(
                type: 'array',
                items: new OA\Items(ref: '#/components/schemas/PenempatanMagang'),
            )),
            new OA\Response(response: 404, description: 'Profil guru tidak ditemukan.'),
        ],
    )]
    public function index(Request $request)
    {
        $guru = $request->user()->guru;

        if (!$guru) {
            return response()->json(['status' => false, 'message' => 'Profil guru tidak ditemukan.'], 404);
        }

        $bimbingan = PenempatanMagang::where('guru_id', $guru->id)
            ->with(['siswa.absensi', 'siswa.jurnal', 'siswa.kelas', 'tempatMagang'])
            ->get();

        return response()->json([
            'status' => true,
            'data'   => $bimbingan
        ]);
    }

    #[OA\Post(
        path: '/api/guru/siswa/{id}/input-nilai',
        summary: 'Input nilai akhir & sahkan kelulusan siswa',
        description: 'Menyimpan nilai akhir (0-100), menandai penempatan lulus_magang, dan mengubah status siswa menjadi lulus.',
        tags: ['Guru'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID siswa.', schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(
            required: ['nilai_akhir'],
            properties: [
                new OA\Property(property: 'nilai_akhir', type: 'integer', minimum: 0, maximum: 100, example: 90),
            ],
        )),
        responses: [
            new OA\Response(response: 200, description: 'Nilai berhasil disimpan.', content: new OA\JsonContent(ref: '#/components/schemas/PenempatanMagang')),
            new OA\Response(response: 404, description: 'Siswa tidak berada dalam bimbingan guru.'),
            new OA\Response(response: 422, description: 'Validasi gagal.'),
        ],
    )]
    public function inputNilai(Request $request, $id)
    {
        $request->validate([
            'nilai_akhir' => 'required|integer|min:0|max:100',
        ]);

        $guru = $request->user()->guru;

        $penempatan = PenempatanMagang::where('guru_id', $guru->id)
            ->where('siswa_id', $id)
            ->firstOrFail();

        $penempatan->update([
            'nilai_akhir'       => $request->nilai_akhir,
            'status_pengesahan' => 'lulus_magang',
        ]);

        $penempatan->siswa->update(['status_magang' => 'lulus']);

        ActivityLog::log('guru.input_nilai', 'info', [
            'guru_id'     => $guru->id,
            'siswa_id'    => $id,
            'nilai_akhir' => $request->nilai_akhir,
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Nilai akhir berhasil disimpan dan siswa disahkan lulus magang.',
            'data'    => $penempatan
        ]);
    }
}
