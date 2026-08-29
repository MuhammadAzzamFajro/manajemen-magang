<?php

namespace App\Http\Controllers\Api\Guru;

use App\Http\Controllers\Controller;
use App\Models\Kunjungan;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class KunjunganController extends Controller
{
    public function index(Request $request)
    {
        $guru = $request->user()->guru;

        $kunjungan = Kunjungan::where('guru_id', $guru->id)
            ->with('tempatMagang')
            ->orderBy('tanggal_kunjungan', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'data'   => $kunjungan
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tempat_magang_id'  => 'required|exists:tempat_magang,id',
            'tanggal_kunjungan' => 'required|date',
            'catatan_evaluasi'  => 'nullable|string',
            'foto_dokumentasi'  => 'nullable|image|max:4096',
        ]);

        $guru = $request->user()->guru;
        $fotoPath = null;

        if ($request->hasFile('foto_dokumentasi')) {
            $fotoPath = $request->file('foto_dokumentasi')->store('kunjungan', 'public');
        }

        $kunjungan = Kunjungan::create([
            'guru_id'           => $guru->id,
            'tempat_magang_id'  => $request->tempat_magang_id,
            'tanggal_kunjungan' => $request->tanggal_kunjungan,
            'catatan_evaluasi'  => $request->catatan_evaluasi,
            'foto_dokumentasi'  => $fotoPath,
        ]);

        ActivityLog::log('guru.kunjungan_create', 'info', ['kunjungan_id' => $kunjungan->id]);

        return response()->json([
            'status'  => true,
            'message' => 'Catatan kunjungan lapangan berhasil ditambahkan.',
            'data'    => $kunjungan->load('tempatMagang')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $guru = $request->user()->guru;
        $kunjungan = Kunjungan::where('guru_id', $guru->id)->findOrFail($id);

        $request->validate([
            'tempat_magang_id'  => 'required|exists:tempat_magang,id',
            'tanggal_kunjungan' => 'required|date',
            'catatan_evaluasi'  => 'nullable|string',
            'foto_dokumentasi'  => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('foto_dokumentasi')) {
            if ($kunjungan->foto_dokumentasi) {
                Storage::disk('public')->delete($kunjungan->foto_dokumentasi);
            }
            $kunjungan->foto_dokumentasi = $request->file('foto_dokumentasi')->store('kunjungan', 'public');
        }

        $kunjungan->update($request->only(['tempat_magang_id', 'tanggal_kunjungan', 'catatan_evaluasi']));

        ActivityLog::log('guru.kunjungan_update', 'info', ['kunjungan_id' => $kunjungan->id]);

        return response()->json([
            'status'  => true,
            'message' => 'Catatan kunjungan berhasil diperbarui.',
            'data'    => $kunjungan->load('tempatMagang')
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $guru = $request->user()->guru;
        $kunjungan = Kunjungan::where('guru_id', $guru->id)->findOrFail($id);

        if ($kunjungan->foto_dokumentasi) {
            Storage::disk('public')->delete($kunjungan->foto_dokumentasi);
        }

        ActivityLog::log('guru.kunjungan_delete', 'warn', ['kunjungan_id' => $kunjungan->id]);
        $kunjungan->delete();

        return response()->json([
            'status'  => true,
            'message' => 'Catatan kunjungan berhasil dihapus.'
        ]);
    }
}
