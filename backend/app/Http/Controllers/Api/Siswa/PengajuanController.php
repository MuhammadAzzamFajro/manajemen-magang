<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use App\Models\PengajuanMagang;
use App\Models\TempatMagang;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class PengajuanController extends Controller
{
    public function index(Request $request)
    {
        $siswa = $request->user()->siswa;

        $pengajuan = PengajuanMagang::where('siswa_id', $siswa->id)
            ->with('tempatMagang')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'data'   => $pengajuan
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tempat_magang_id'      => 'required|exists:tempat_magang,id',
            'posisi_diminati'       => 'required|string|max:255',
            'tanggal_mulai_usulan'  => 'required|date',
            'tanggal_selesai_usulan'=> 'required|date|after:tanggal_mulai_usulan',
        ]);

        $siswa = $request->user()->siswa;

        $dudi = TempatMagang::findOrFail($request->tempat_magang_id);
        if ($dudi->sisa_kuota <= 0) {
            return response()->json([
                'status'  => false,
                'message' => 'Kuota tempat magang ini sudah tidak tersedia.'
            ], 422);
        }

        $pengajuan = PengajuanMagang::create([
            'siswa_id'               => $siswa->id,
            'tempat_magang_id'       => $request->tempat_magang_id,
            'posisi_diminati'        => $request->posisi_diminati,
            'tanggal_mulai_usulan'   => $request->tanggal_mulai_usulan,
            'tanggal_selesai_usulan' => $request->tanggal_selesai_usulan,
            'status'                 => 'menunggu',
        ]);

        $siswa->update(['status_magang' => 'pengajuan']);

        ActivityLog::log('siswa.pengajuan_create', 'info', ['pengajuan_id' => $pengajuan->id]);

        return response()->json([
            'status'  => true,
            'message' => 'Pengajuan magang berhasil dikirim.',
            'data'    => $pengajuan->load('tempatMagang')
        ], 201);
    }
}
