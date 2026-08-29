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

class SiswaController extends Controller
{
    public function index(Request $request)
    {
        $query = Siswa::with(['user.profile', 'penempatan.tempatMagang', 'penempatan.guru']);

        if ($request->kelas) {
            $query->where('kelas', $request->kelas);
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

    public function store(Request $request)
    {
        $request->validate([
            'nis'          => 'required|string|unique:siswa,nis',
            'nama_lengkap' => 'required|string|max:255',
            'kelas'        => 'required|string|max:100',
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
                'kelas'        => $request->kelas,
                'email_kontak' => strtolower(trim($request->email)),
                'status_magang'=> 'belum_magang',
            ]);

            ActivityLog::log('siswa.create', 'info', ['siswa_id' => $siswa->id, 'nis' => $siswa->nis]);

            return response()->json([
                'status'  => true,
                'message' => 'Siswa berhasil ditambahkan.',
                'data'    => $siswa->load('user.profile')
            ], 201);
        });
    }

    public function update(Request $request, $id)
    {
        $siswa = Siswa::findOrFail($id);

        $request->validate([
            'nis'          => 'required|string|unique:siswa,nis,' . $id,
            'nama_lengkap' => 'required|string|max:255',
            'kelas'        => 'required|string|max:100',
        ]);

        $siswa->update([
            'nis'          => $request->nis,
            'nama_lengkap' => $request->nama_lengkap,
            'kelas'        => $request->kelas,
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
            'data'    => $siswa
        ]);
    }

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
}
