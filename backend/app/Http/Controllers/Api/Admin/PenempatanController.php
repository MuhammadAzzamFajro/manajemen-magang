<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PenempatanMagang;
use App\Models\Siswa;
use App\Models\TempatMagang;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PenempatanController extends Controller
{
    public function index()
    {
        $penempatan = PenempatanMagang::with(['siswa', 'tempatMagang', 'guru'])->get();

        return response()->json([
            'status' => true,
            'data'   => $penempatan
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'siswa_id'         => 'required|exists:siswa,id',
            'tempat_magang_id' => 'required|exists:tempat_magang,id',
            'guru_id'          => 'required|exists:guru,id',
            'tanggal_mulai'    => 'required|date',
            'tanggal_selesai'  => 'required|date|after:tanggal_mulai',
        ]);

        $dudi = TempatMagang::findOrFail($request->tempat_magang_id);
        if ($dudi->sisa_kuota <= 0) {
            return response()->json([
                'status'  => false,
                'message' => 'Kuota tempat magang ini sudah habis!'
            ], 422);
        }

        return DB::transaction(function () use ($request) {
            $penempatan = PenempatanMagang::create([
                'siswa_id'          => $request->siswa_id,
                'tempat_magang_id'  => $request->tempat_magang_id,
                'guru_id'           => $request->guru_id,
                'tanggal_mulai'     => $request->tanggal_mulai,
                'tanggal_selesai'   => $request->tanggal_selesai,
                'status_pengesahan' => 'disahkan',
            ]);

            Siswa::where('id', $request->siswa_id)->update(['status_magang' => 'sedang_magang']);

            ActivityLog::log('penempatan.create', 'info', ['penempatan_id' => $penempatan->id]);

            return response()->json([
                'status'  => true,
                'message' => 'Penempatan magang berhasil dibuat.',
                'data'    => $penempatan->load(['siswa', 'tempatMagang', 'guru'])
            ], 201);
        });
    }

    public function update(Request $request, $id)
    {
        $penempatan = PenempatanMagang::findOrFail($id);

        $request->validate([
            'tempat_magang_id' => 'required|exists:tempat_magang,id',
            'guru_id'          => 'required|exists:guru,id',
            'tanggal_mulai'    => 'required|date',
            'tanggal_selesai'  => 'required|date|after:tanggal_mulai',
        ]);

        $penempatan->update($request->only(['tempat_magang_id', 'guru_id', 'tanggal_mulai', 'tanggal_selesai']));

        ActivityLog::log('penempatan.update', 'info', ['penempatan_id' => $penempatan->id]);

        return response()->json([
            'status'  => true,
            'message' => 'Penempatan magang berhasil diperbarui.',
            'data'    => $penempatan->load(['siswa', 'tempatMagang', 'guru'])
        ]);
    }

    public function sahkan($id)
    {
        $penempatan = PenempatanMagang::findOrFail($id);
        $penempatan->update(['status_pengesahan' => 'disahkan']);
        $penempatan->siswa->update(['status_magang' => 'sedang_magang']);

        ActivityLog::log('penempatan.sahkan', 'info', ['penempatan_id' => $penempatan->id]);

        return response()->json([
            'status'  => true,
            'message' => 'Penempatan magang telah disahkan.',
            'data'    => $penempatan
        ]);
    }

    public function batalkan($id)
    {
        $penempatan = PenempatanMagang::findOrFail($id);

        return DB::transaction(function () use ($penempatan) {
            $siswa = $penempatan->siswa;

            ActivityLog::log('penempatan.batalkan', 'warn', [
                'penempatan_id' => $penempatan->id,
                'siswa_id'      => $siswa->id
            ]);

            $penempatan->delete();
            $siswa->update(['status_magang' => 'belum_magang']);

            return response()->json([
                'status'  => true,
                'message' => 'Penempatan magang berhasil dibatalkan dan status siswa dikembalikan.'
            ]);
        });
    }
}
