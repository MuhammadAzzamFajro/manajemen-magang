<?php

namespace App\Http\Controllers\Api\Guru;

use App\Http\Controllers\Controller;
use App\Models\JurnalHarian;
use App\Models\PenempatanMagang;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class JurnalController extends Controller
{
    public function index(Request $request)
    {
        $guru = $request->user()->guru;
        $siswaIds = PenempatanMagang::where('guru_id', $guru->id)->pluck('siswa_id');

        $query = JurnalHarian::whereIn('siswa_id', $siswaIds)->with('siswa');

        if ($request->status) {
            $query->where('status_verifikasi', $request->status);
        }

        return response()->json([
            'status' => true,
            'data'   => $query->orderBy('tanggal', 'desc')->get()
        ]);
    }

    public function validasi(Request $request, $id)
    {
        $request->validate([
            'status_verifikasi' => 'required|in:disetujui,perlu_revisi',
            'catatan_guru'      => 'nullable|string',
        ]);

        $jurnal = JurnalHarian::findOrFail($id);
        $jurnal->update([
            'status_verifikasi' => $request->status_verifikasi,
            'catatan_guru'      => $request->catatan_guru,
        ]);

        ActivityLog::log('guru.validasi_jurnal', 'info', [
            'jurnal_id' => $jurnal->id,
            'status'    => $request->status_verifikasi
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Status verifikasi jurnal berhasil diperbarui.',
            'data'    => $jurnal
        ]);
    }
}
