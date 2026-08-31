<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\User;
use App\Models\Profile;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use OpenApi\Attributes as OA;

class GuruController extends Controller
{
    #[OA\Get(
        path: '/api/admin/guru',
        summary: 'Daftar guru',
        description: 'Daftar semua guru beserta jumlah penempatan/siswa bimbingan.',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'search', in: 'query', description: 'Cari berdasarkan nama atau NIP.', required: false, schema: new OA\Schema(type: 'string')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Daftar guru.', content: new OA\JsonContent(
                type: 'array',
                items: new OA\Items(ref: '#/components/schemas/Guru'),
            )),
        ],
    )]
    public function index(Request $request)
    {
        $query = Guru::with('user.profile', 'jurusan')
            ->withCount('penempatan')
            ->orderByRaw("FIELD(status_akun, 'aktif', 'nonaktif')");

        if ($request->search) {
            $query->where('nama_lengkap', 'like', "%{$request->search}%")
                  ->orWhere('nip', 'like', "%{$request->search}%")
                  ->orWhereHas('jurusan', function ($q) use ($request) {
                      $q->where('nama', 'like', "%{$request->search}%");
                  });
        }

        return response()->json([
            'status' => true,
            'data'   => $query->get()
        ]);
    }

    #[OA\Post(
        path: '/api/admin/guru',
        summary: 'Tambah guru',
        description: 'Membuat akun guru baru beserta user & profile (role guru).',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(
            required: ['nip', 'nama_lengkap', 'email', 'password'],
            properties: [
                new OA\Property(property: 'nip', type: 'string', minLength: 18, maxLength: 18, example: '199003202015012004'),
                new OA\Property(property: 'nama_lengkap', type: 'string', example: 'Antigravity Andro'),
                new OA\Property(property: 'email', type: 'string', format: 'email', example: 'guru@simmas.sch.id'),
                new OA\Property(property: 'jurusan', type: 'string', nullable: true, example: 'Rekayasa Perangkat Lunak'),
                new OA\Property(property: 'password', type: 'string', format: 'password', minLength: 6, example: 'password'),
            ],
        )),
        responses: [
            new OA\Response(response: 201, description: 'Guru berhasil ditambahkan.', content: new OA\JsonContent(ref: '#/components/schemas/Guru')),
            new OA\Response(response: 422, description: 'Validasi gagal (NIP/email duplikat, format salah).'),
        ],
    )]
    public function store(Request $request)
    {
        $request->validate([
            'nip'          => 'required|string|size:18|regex:/^[0-9]+$/|unique:guru,nip',
            'nama_lengkap' => 'required|string|max:255',
            'email'        => 'required|email|unique:users,email',
            'jurusan_id'   => 'nullable|exists:jurusan,id',
            'password'     => 'required|string|min:6',
        ], [
            'nip.required' => 'NIP wajib diisi.',
            'nip.size'     => 'NIP harus berisi tepat 18 digit angka.',
            'nip.regex'    => 'NIP hanya boleh terdiri dari karakter angka.',
            'nip.unique'   => 'NIP sudah terdaftar dalam sistem.',
            'email.unique' => 'Email akun sudah digunakan oleh pengguna lain.',
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
                'role'    => 'guru',
            ]);

            $guru = Guru::create([
                'user_id'      => $user->id,
                'nip'          => $request->nip,
                'nama_lengkap' => $request->nama_lengkap,
                'jurusan_id'   => $request->jurusan_id,
                'status_akun'  => 'aktif',
            ]);

            ActivityLog::log('guru.create', 'info', ['guru_id' => $guru->id, 'nip' => $guru->nip]);

            return response()->json([
                'status'  => true,
                'message' => 'Guru berhasil ditambahkan.',
                'data'    => $guru->load('user.profile', 'jurusan')
            ], 201);
        });
    }

    #[OA\Put(
        path: '/api/admin/guru/{id}',
        summary: 'Perbarui data guru',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(
            required: ['nip', 'nama_lengkap'],
            properties: [
                new OA\Property(property: 'nip', type: 'string', minLength: 18, maxLength: 18),
                new OA\Property(property: 'nama_lengkap', type: 'string'),
                new OA\Property(property: 'jurusan', type: 'string', nullable: true),
            ],
        )),
        responses: [
            new OA\Response(response: 200, description: 'Guru berhasil diperbarui.', content: new OA\JsonContent(ref: '#/components/schemas/Guru')),
            new OA\Response(response: 404, description: 'Guru tidak ditemukan.'),
        ],
    )]
    public function update(Request $request, $id)
    {
        $guru = Guru::findOrFail($id);

        $request->validate([
            'nip'          => 'required|string|size:18|regex:/^[0-9]+$/|unique:guru,nip,' . $id,
            'nama_lengkap' => 'required|string|max:255',
            'jurusan_id'   => 'nullable|exists:jurusan,id',
        ], [
            'nip.required' => 'NIP wajib diisi.',
            'nip.size'     => 'NIP harus berisi tepat 18 digit angka.',
            'nip.regex'    => 'NIP hanya boleh terdiri dari karakter angka.',
        ]);

        $guru->update([
            'nip'          => $request->nip,
            'nama_lengkap' => $request->nama_lengkap,
            'jurusan_id'   => $request->jurusan_id ?? $guru->jurusan_id,
        ]);

        if ($guru->user) {
            $guru->user->update(['name' => $request->nama_lengkap]);
            if ($guru->user->profile) {
                $guru->user->profile->update(['nama' => $request->nama_lengkap]);
            }
        }

        ActivityLog::log('guru.update', 'info', ['guru_id' => $guru->id]);

        return response()->json([
            'status'  => true,
            'message' => 'Data guru berhasil diperbarui.',
            'data'    => $guru->load('jurusan')
        ]);
    }

    #[OA\Patch(
        path: '/api/admin/guru/{id}/status',
        summary: 'Ubah status akun guru (aktif/nonaktif)',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Status akun berhasil diubah.', content: new OA\JsonContent(ref: '#/components/schemas/Guru')),
        ],
    )]
    public function updateStatus($id)
    {
        $guru = Guru::findOrFail($id);
        $newStatus = $guru->status_akun === 'aktif' ? 'nonaktif' : 'aktif';
        $guru->update(['status_akun' => $newStatus]);

        ActivityLog::log('guru.toggle_status', 'info', ['guru_id' => $guru->id, 'status' => $newStatus]);

        return response()->json([
            'status'  => true,
            'message' => "Status akun guru berhasil diubah menjadi {$newStatus}.",
            'data'    => $guru
        ]);
    }

    #[OA\Delete(
        path: '/api/admin/guru/{id}',
        summary: 'Hapus guru',
        description: 'Menghapus guru beserta akun user-nya. Ditolak jika masih membimbing siswa aktif.',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Guru berhasil dihapus.'),
            new OA\Response(response: 422, description: 'Gagal: guru masih membimbing siswa aktif.'),
        ],
    )]
    public function destroy($id)
    {
        $guru = Guru::findOrFail($id);

        // Aturan bisnis: Cegah hapus guru yang masih punya siswa bimbingan aktif
        $activeCount = $guru->penempatan()->whereIn('status_pengesahan', ['disahkan', 'lulus_magang'])->count();
        if ($activeCount > 0) {
            return response()->json([
                'status'  => false,
                'message' => "Gagal menghapus! Guru ini masih membimbing {$activeCount} siswa aktif. Harap pindahkan bimbingan siswa terlebih dahulu."
            ], 422);
        }

        DB::transaction(function () use ($guru) {
            ActivityLog::log('guru.delete', 'warn', ['guru_id' => $guru->id, 'nip' => $guru->nip]);
            if ($guru->user) {
                $guru->user->delete(); // cascading profile
            } else {
                $guru->delete();
            }
        });

        return response()->json([
            'status'  => true,
            'message' => 'Data guru berhasil dihapus.'
        ]);
    }
}
