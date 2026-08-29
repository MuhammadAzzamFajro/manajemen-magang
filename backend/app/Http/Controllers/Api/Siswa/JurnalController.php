<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use App\Models\JurnalHarian;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class JurnalController extends Controller
{
    public function index(Request $request)
    {
        $siswa = $request->user()->siswa;

        $jurnal = JurnalHarian::where('siswa_id', $siswa->id)
            ->orderBy('tanggal', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'data'   => $jurnal
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tanggal'         => 'required|date',
            'uraian_kegiatan' => 'required|string|min:15',
            'kendala'         => 'nullable|string',
            'solusi'          => 'nullable|string',
            'foto_bukti'      => 'nullable|image|max:4096',
        ]);

        $siswa = $request->user()->siswa;
        $fotoPath = null;

        if ($request->hasFile('foto_bukti')) {
            $fotoPath = $request->file('foto_bukti')->store('jurnal', 'public');
        }

        $jurnal = JurnalHarian::create([
            'siswa_id'          => $siswa->id,
            'tanggal'           => $request->tanggal,
            'uraian_kegiatan'   => $request->uraian_kegiatan,
            'kendala'           => $request->kendala,
            'solusi'            => $request->solusi,
            'foto_bukti'        => $fotoPath,
            'status_verifikasi' => 'menunggu',
        ]);

        ActivityLog::log('siswa.jurnal_create', 'info', ['jurnal_id' => $jurnal->id]);

        return response()->json([
            'status'  => true,
            'message' => 'Jurnal harian berhasil disimpan.',
            'data'    => $jurnal
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $siswa = $request->user()->siswa;
        $jurnal = JurnalHarian::where('siswa_id', $siswa->id)->findOrFail($id);

        if ($jurnal->status_verifikasi === 'disetujui') {
            return response()->json([
                'status'  => false,
                'message' => 'Jurnal yang sudah disetujui guru tidak dapat diubah!'
            ], 422);
        }

        $request->validate([
            'tanggal'         => 'required|date',
            'uraian_kegiatan' => 'required|string|min:15',
            'kendala'         => 'nullable|string',
            'solusi'          => 'nullable|string',
            'foto_bukti'      => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('foto_bukti')) {
            if ($jurnal->foto_bukti) {
                Storage::disk('public')->delete($jurnal->foto_bukti);
            }
            $jurnal->foto_bukti = $request->file('foto_bukti')->store('jurnal', 'public');
        }

        $jurnal->update([
            'tanggal'           => $request->tanggal,
            'uraian_kegiatan'   => $request->uraian_kegiatan,
            'kendala'           => $request->kendala,
            'solusi'            => $request->solusi,
            'status_verifikasi' => 'menunggu', // reset back to pending for review
        ]);

        ActivityLog::log('siswa.jurnal_update', 'info', ['jurnal_id' => $jurnal->id]);

        return response()->json([
            'status'  => true,
            'message' => 'Jurnal harian berhasil diperbarui.',
            'data'    => $jurnal
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $siswa = $request->user()->siswa;
        $jurnal = JurnalHarian::where('siswa_id', $siswa->id)->findOrFail($id);

        if ($jurnal->status_verifikasi === 'disetujui') {
            return response()->json([
                'status'  => false,
                'message' => 'Jurnal yang sudah disetujui tidak dapat dihapus!'
            ], 422);
        }

        if ($jurnal->foto_bukti) {
            Storage::disk('public')->delete($jurnal->foto_bukti);
        }

        ActivityLog::log('siswa.jurnal_delete', 'warn', ['jurnal_id' => $jurnal->id]);
        $jurnal->delete();

        return response()->json([
            'status'  => true,
            'message' => 'Jurnal harian berhasil dihapus.'
        ]);
    }
}
