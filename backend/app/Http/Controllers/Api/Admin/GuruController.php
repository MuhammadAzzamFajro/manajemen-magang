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

class GuruController extends Controller
{
    public function index(Request $request)
    {
        $query = Guru::with('user.profile')
            ->withCount('penempatan')
            ->orderByRaw("FIELD(status_akun, 'aktif', 'nonaktif')");

        if ($request->search) {
            $query->where('nama_lengkap', 'like', "%{$request->search}%")
                  ->orWhere('nip', 'like', "%{$request->search}%");
        }

        return response()->json([
            'status' => true,
            'data'   => $query->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nip'          => 'required|string|size:18|regex:/^[0-9]+$/|unique:guru,nip',
            'nama_lengkap' => 'required|string|max:255',
            'email'        => 'required|email|unique:users,email',
            'jurusan'      => 'nullable|string|max:255',
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
                'jurusan'      => $request->jurusan,
                'status_akun'  => 'aktif',
            ]);

            ActivityLog::log('guru.create', 'info', ['guru_id' => $guru->id, 'nip' => $guru->nip]);

            return response()->json([
                'status'  => true,
                'message' => 'Guru berhasil ditambahkan.',
                'data'    => $guru->load('user.profile')
            ], 201);
        });
    }

    public function update(Request $request, $id)
    {
        $guru = Guru::findOrFail($id);

        $request->validate([
            'nip'          => 'required|string|size:18|regex:/^[0-9]+$/|unique:guru,nip,' . $id,
            'nama_lengkap' => 'required|string|max:255',
            'jurusan'      => 'nullable|string|max:255',
        ], [
            'nip.required' => 'NIP wajib diisi.',
            'nip.size'     => 'NIP harus berisi tepat 18 digit angka.',
            'nip.regex'    => 'NIP hanya boleh terdiri dari karakter angka.',
        ]);

        $guru->update([
            'nip'          => $request->nip,
            'nama_lengkap' => $request->nama_lengkap,
            'jurusan'      => $request->jurusan,
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
            'data'    => $guru
        ]);
    }

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
