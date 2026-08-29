<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class AbsensiController extends Controller
{
    public function index(Request $request)
    {
        $siswa = $request->user()->siswa;

        $absensi = Absensi::where('siswa_id', $siswa->id)
            ->orderBy('tanggal', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'data'   => $absensi
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type'   => 'required|in:masuk,pulang,izin_sakit',
            'status' => 'required_if:type,izin_sakit|in:hadir,sakit,izin,alfa',
            'foto'   => 'nullable|image|max:4096',
        ]);

        $siswa = $request->user()->siswa;
        $today = now()->toDateString();

        $absensi = Absensi::firstOrNew([
            'siswa_id' => $siswa->id,
            'tanggal'  => $today,
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('absensi', 'public');
        }

        if ($request->type === 'masuk') {
            $absensi->status       = 'hadir';
            $absensi->jam_masuk    = now()->toTimeString();
            $absensi->foto_masuk   = $fotoPath;
            $absensi->status_validasi_guru = 'disetujui';
        } elseif ($request->type === 'pulang') {
            $absensi->jam_pulang  = now()->toTimeString();
            if ($fotoPath) {
                $absensi->foto_pulang = $fotoPath;
            }
        } elseif ($request->type === 'izin_sakit') {
            $absensi->status               = $request->status;
            $absensi->foto_masuk           = $fotoPath;
            $absensi->status_validasi_guru = 'menunggu';
            $absensi->catatan_guru         = $request->catatan;
        }

        $absensi->save();

        ActivityLog::log('siswa.absensi', 'info', ['absensi_id' => $absensi->id, 'type' => $request->type]);

        return response()->json([
            'status'  => true,
            'message' => 'Presensi berhasil dicatat.',
            'data'    => $absensi
        ]);
    }
}
