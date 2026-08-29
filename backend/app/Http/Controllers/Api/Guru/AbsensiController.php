<?php

namespace App\Http\Controllers\Api\Guru;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\PenempatanMagang;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class AbsensiController extends Controller
{
    public function index(Request $request)
    {
        $guru = $request->user()->guru;
        $siswaIds = PenempatanMagang::where('guru_id', $guru->id)->pluck('siswa_id');

        $query = Absensi::whereIn('siswa_id', $siswaIds)->with('siswa');

        if ($request->status_validasi) {
            $query->where('status_validasi_guru', $request->status_validasi);
        }

        return response()->json([
            'status' => true,
            'data'   => $query->orderBy('tanggal', 'desc')->get()
        ]);
    }

    public function validasi(Request $request, $id)
    {
        $request->validate([
            'status_validasi_guru' => 'required|in:disetujui,ditolak',
            'catatan_guru'         => 'nullable|string',
        ]);

        $absensi = Absensi::findOrFail($id);
        $absensi->update([
            'status_validasi_guru' => $request->status_validasi_guru,
            'catatan_guru'         => $request->catatan_guru,
        ]);

        ActivityLog::log('guru.validasi_absensi', 'info', [
            'absensi_id' => $absensi->id,
            'status'     => $request->status_validasi_guru
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Status validasi absensi berhasil diperbarui.',
            'data'    => $absensi
        ]);
    }
}
