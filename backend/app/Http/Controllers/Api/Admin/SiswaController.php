<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\User;
use App\Models\Profile;
use App\Models\PenempatanMagang;
use App\Models\TempatMagang;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use OpenApi\Attributes as OA;

class SiswaController extends Controller
{
    #[OA\Get(
        path: '/api/admin/siswa',
        summary: 'Daftar siswa',
        description: 'Daftar semua siswa beserta relasi user, penempatan, DUDI, dan pembimbing.',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'kelas', in: 'query', description: 'Filter kelas.', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'status_magang', in: 'query', description: 'Filter status magang.', required: false, schema: new OA\Schema(type: 'string', enum: ['belum_magang', 'pengajuan', 'sedang_magang', 'lulus'])),
            new OA\Parameter(name: 'search', in: 'query', description: 'Cari berdasarkan nama atau NIS.', required: false, schema: new OA\Schema(type: 'string')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Daftar siswa.', content: new OA\JsonContent(
                type: 'array',
                items: new OA\Items(ref: '#/components/schemas/Siswa'),
            )),
        ],
    )]
    public function index(Request $request)
    {
        $query = Siswa::with(['user.profile', 'penempatan.tempatMagang', 'penempatan.guru', 'kelas', 'pengajuan.tempatMagang']);

        if ($request->kelas) {
            $kelasName = $request->kelas;
            $query->whereHas('kelas', function ($q) use ($kelasName) {
                $q->where('nama', $kelasName);
            });
        }

        if ($request->status_magang) {
            $query->where('status_magang', $request->status_magang);
        }

        if ($request->search) {
            $query->where('nama_lengkap', 'like', "%{$request->search}%")
                  ->orWhere('nis', 'like', "%{$request->search}%");
        }

        return response()->json([
            'status' => true,
            'data'   => $query->get()
        ]);
    }

    #[OA\Post(
        path: '/api/admin/siswa',
        summary: 'Tambah siswa',
        description: 'Membuat akun siswa baru beserta user & profile (role siswa).',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(
            required: ['nis', 'nama_lengkap', 'kelas', 'email', 'password'],
            properties: [
                new OA\Property(property: 'nis', type: 'string', pattern: '^\\d{10}$', example: '2024001'),
                new OA\Property(property: 'nama_lengkap', type: 'string', example: 'Skultori Andro'),
                new OA\Property(property: 'kelas', type: 'string', example: 'XI'),
                new OA\Property(property: 'email', type: 'string', format: 'email', example: 'siswa@simmas.sch.id'),
                new OA\Property(property: 'email_kontak', type: 'string', format: 'email', nullable: true),
                new OA\Property(property: 'password', type: 'string', format: 'password', minLength: 6),
            ],
        )),
        responses: [
            new OA\Response(response: 201, description: 'Siswa berhasil ditambahkan.', content: new OA\JsonContent(ref: '#/components/schemas/Siswa')),
            new OA\Response(response: 422, description: 'Validasi gagal (NIS/email duplikat).'),
        ],
    )]
    public function store(Request $request)
    {
        $request->validate([
            'nis'          => 'required|numeric|unique:siswa,nis',
            'nama_lengkap' => 'required|string|max:255',
            'kelas_id'     => 'required|exists:kelas,id',
            'email'        => 'required|email|unique:users,email',
            'password'     => 'required|string|min:6',
        ]);

        return DB::transaction(function () use ($request) {
            $user = User::create([
                'name'     => $request->nama_lengkap,
                'email'    => strtolower(trim($request->email)),
                'password' => Hash::make($request->password),
            ]);

            Profile::create([
                'user_id' => $user->id,
                'nama'    => $request->nama_lengkap,
                'email'   => strtolower(trim($request->email)),
                'role'    => 'siswa',
            ]);

            $siswa = Siswa::create([
                'user_id'      => $user->id,
                'nis'          => $request->nis,
                'nama_lengkap' => $request->nama_lengkap,
                'kelas_id'     => $request->kelas_id,
                'email_kontak' => strtolower(trim($request->email)),
                'status_magang'=> 'belum_magang',
            ]);

            ActivityLog::log('siswa.create', 'info', ['siswa_id' => $siswa->id, 'nis' => $siswa->nis]);

            return response()->json([
                'status'  => true,
                'message' => 'Siswa berhasil ditambahkan.',
                'data'    => $siswa->load('user.profile', 'kelas')
            ], 201);
        });
    }

    #[OA\Put(
        path: '/api/admin/siswa/{id}',
        summary: 'Perbarui data siswa',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(
            required: ['nis', 'nama_lengkap', 'kelas'],
            properties: [
                new OA\Property(property: 'nis', type: 'string'),
                new OA\Property(property: 'nama_lengkap', type: 'string'),
                new OA\Property(property: 'kelas', type: 'string'),
                new OA\Property(property: 'email', type: 'string', format: 'email'),
                new OA\Property(property: 'email_kontak', type: 'string', format: 'email', nullable: true),
                new OA\Property(property: 'status_magang', type: 'string', enum: ['belum_magang', 'pengajuan', 'sedang_magang', 'lulus']),
                new OA\Property(property: 'password', type: 'string', format: 'password', nullable: true),
            ],
        )),
        responses: [
            new OA\Response(response: 200, description: 'Siswa berhasil diperbarui.', content: new OA\JsonContent(ref: '#/components/schemas/Siswa')),
        ],
    )]
    public function update(Request $request, $id)
    {
        $siswa = Siswa::findOrFail($id);

        $request->validate([
            'nis'          => 'required|numeric|unique:siswa,nis,' . $id,
            'nama_lengkap' => 'required|string|max:255',
            'kelas_id'     => 'required|exists:kelas,id',
        ]);

        $siswa->update([
            'nis'          => $request->nis,
            'nama_lengkap' => $request->nama_lengkap,
            'kelas_id'     => $request->kelas_id,
        ]);

        if ($siswa->user) {
            $siswa->user->update(['name' => $request->nama_lengkap]);
            if ($siswa->user->profile) {
                $siswa->user->profile->update(['nama' => $request->nama_lengkap]);
            }
        }

        ActivityLog::log('siswa.update', 'info', ['siswa_id' => $siswa->id]);

        return response()->json([
            'status'  => true,
            'message' => 'Data siswa berhasil diperbarui.',
            'data'    => $siswa->load('kelas')
        ]);
    }

    #[OA\Delete(
        path: '/api/admin/siswa/{id}',
        summary: 'Hapus siswa',
        description: 'Menghapus siswa beserta akun user-nya.',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Siswa berhasil dihapus.'),
        ],
    )]
    public function destroy($id)
    {
        $siswa = Siswa::findOrFail($id);

        DB::transaction(function () use ($siswa) {
            ActivityLog::log('siswa.delete', 'warn', ['siswa_id' => $siswa->id, 'nis' => $siswa->nis]);
            if ($siswa->user) {
                $siswa->user->delete();
            } else {
                $siswa->delete();
            }
        });

        return response()->json([
            'status'  => true,
            'message' => 'Data siswa berhasil dihapus.'
        ]);
    }

    #[OA\Post(
        path: '/api/admin/siswa/{id}/plotting',
        summary: 'Plotting (penempatan) siswa',
        description: 'Menempatkan siswa ke DUDI dengan pembimbing guru dan periode magang.',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(
            required: ['tempat_magang_id', 'guru_id'],
            properties: [
                new OA\Property(property: 'tempat_magang_id', type: 'integer'),
                new OA\Property(property: 'guru_id', type: 'integer'),
                new OA\Property(property: 'tanggal_mulai', type: 'string', format: 'date'),
                new OA\Property(property: 'tanggal_selesai', type: 'string', format: 'date'),
            ],
        )),
        responses: [
            new OA\Response(response: 200, description: 'Siswa berhasil diplotting.', content: new OA\JsonContent(ref: '#/components/schemas/PenempatanMagang')),
            new OA\Response(response: 422, description: 'Validasi gagal (kuota penuh, siswa sudah ditempatkan).'),
        ],
    )]
    public function plotting(Request $request, $id)
    {
        $siswa = Siswa::findOrFail($id);

        $request->validate([
            'tempat_magang_id' => 'required|exists:tempat_magang,id',
            'guru_id'          => 'required|exists:guru,id',
            'tanggal_mulai'    => 'required|date',
            'tanggal_selesai'  => 'required|date|after:tanggal_mulai',
        ]);

        // Check DUDI quota
        $dudi = TempatMagang::findOrFail($request->tempat_magang_id);
        if ($dudi->sisa_kuota <= 0 && !$siswa->penempatan) {
            return response()->json([
                'status'  => false,
                'message' => 'Kuota tempat magang ini sudah penuh!'
            ], 422);
        }

        return DB::transaction(function () use ($siswa, $request) {
            $penempatan = PenempatanMagang::updateOrCreate(
                ['siswa_id' => $siswa->id],
                [
                    'tempat_magang_id'  => $request->tempat_magang_id,
                    'guru_id'           => $request->guru_id,
                    'tanggal_mulai'     => $request->tanggal_mulai,
                    'tanggal_selesai'   => $request->tanggal_selesai,
                    'status_pengesahan' => 'disahkan',
                ]
            );

            $siswa->update(['status_magang' => 'sedang_magang']);

            ActivityLog::log('siswa.plotting', 'info', [
                'siswa_id'         => $siswa->id,
                'tempat_magang_id' => $request->tempat_magang_id,
                'guru_id'          => $request->guru_id,
            ]);

            return response()->json([
                'status'  => true,
                'message' => 'Plotting pembimbing & tempat magang berhasil.',
                'data'    => $penempatan->load(['tempatMagang', 'guru'])
            ]);
        });
    }

    public function prosesPengajuan(Request $request, $id)
    {
        $request->validate([
            'status'            => 'required|in:disetujui,ditolak',
            'guru_id'           => 'required_if:status,disetujui|nullable|exists:guru,id',
            'catatan_penolakan' => 'nullable|string|max:500',
        ]);

        $pengajuan = \App\Models\PengajuanMagang::with(['siswa', 'tempatMagang'])->findOrFail($id);
        $siswa = $pengajuan->siswa;

        return DB::transaction(function () use ($pengajuan, $siswa, $request) {
            if ($request->status === 'disetujui') {
                $pengajuan->update(['status' => 'disetujui']);

                $penempatan = PenempatanMagang::updateOrCreate(
                    ['siswa_id' => $siswa->id],
                    [
                        'tempat_magang_id'  => $pengajuan->tempat_magang_id,
                        'guru_id'           => $request->guru_id,
                        'tanggal_mulai'     => $pengajuan->tanggal_mulai_usulan,
                        'tanggal_selesai'   => $pengajuan->tanggal_selesai_usulan,
                        'status_pengesahan' => 'disahkan',
                    ]
                );

                $siswa->update(['status_magang' => 'sedang_magang']);

                ActivityLog::log('admin.pengajuan_disetujui', 'info', [
                    'siswa_id'         => $siswa->id,
                    'pengajuan_id'     => $pengajuan->id,
                    'tempat_magang_id' => $pengajuan->tempat_magang_id,
                    'guru_id'          => $request->guru_id,
                ]);

                return response()->json([
                    'status'  => true,
                    'message' => 'Pengajuan magang berhasil disetujui & penempatan siswa dibuat.',
                    'data'    => $penempatan->load(['tempatMagang', 'guru'])
                ]);
            } else {
                $pengajuan->update([
                    'status'            => 'ditolak',
                    'catatan_penolakan' => $request->catatan_penolakan,
                ]);

                $siswa->update(['status_magang' => 'belum_magang']);

                ActivityLog::log('admin.pengajuan_ditolak', 'warn', [
                    'siswa_id'     => $siswa->id,
                    'pengajuan_id' => $pengajuan->id,
                    'catatan'      => $request->catatan_penolakan,
                ]);

                return response()->json([
                    'status'  => true,
                    'message' => 'Pengajuan magang telah ditolak.',
                    'data'    => $pengajuan
                ]);
            }
        });
    }
}
