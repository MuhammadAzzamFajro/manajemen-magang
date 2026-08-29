<?php

namespace App\Http\Controllers\Api\Guru;

use App\Http\Controllers\Controller;
use App\Models\PenempatanMagang;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class SiswaController extends Controller
{
    public function index(Request $request)
    {
        $guru = $request->user()->guru;

        if (!$guru) {
            return response()->json(['status' => false, 'message' => 'Profil guru tidak ditemukan.'], 404);
        }

        $bimbingan = PenempatanMagang::where('guru_id', $guru->id)
            ->with(['siswa.absensi', 'siswa.jurnal', 'tempatMagang'])
            ->get();

        return response()->json([
            'status' => true,
            'data'   => $bimbingan
        ]);
    }

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
