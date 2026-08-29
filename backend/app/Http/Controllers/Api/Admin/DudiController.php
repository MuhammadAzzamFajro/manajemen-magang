<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\TempatMagang;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class DudiController extends Controller
{
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
