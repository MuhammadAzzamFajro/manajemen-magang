<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class KelasController extends Controller
{
    public function index()
    {
        $data = Kelas::with('jurusan')->withCount('siswa')->orderBy('nama')->get();
        return response()->json(['status' => true, 'data' => $data]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama'       => 'required|string|max:255|unique:kelas,nama',
            'jurusan_id' => 'nullable|exists:jurusan,id',
        ]);
        $kelas = Kelas::create(['nama' => $request->nama, 'jurusan_id' => $request->jurusan_id]);
        ActivityLog::log('kelas.create', 'info', ['kelas_id' => $kelas->id, 'nama' => $kelas->nama]);
        return response()->json(['status' => true, 'message' => 'Kelas berhasil ditambahkan.', 'data' => $kelas->load('jurusan')], 201);
    }

    public function update(Request $request, $id)
    {
        $kelas = Kelas::findOrFail($id);
        $request->validate([
            'nama'       => 'required|string|max:255|unique:kelas,nama,' . $id,
            'jurusan_id' => 'nullable|exists:jurusan,id',
        ]);
        $kelas->update(['nama' => $request->nama, 'jurusan_id' => $request->jurusan_id]);
        ActivityLog::log('kelas.update', 'info', ['kelas_id' => $kelas->id, 'nama' => $kelas->nama]);
        return response()->json(['status' => true, 'message' => 'Kelas berhasil diperbarui.', 'data' => $kelas->load('jurusan')]);
    }

    public function destroy($id)
    {
        $kelas = Kelas::findOrFail($id);

        $used = $kelas->siswa()->count();
        if ($used > 0) {
            return response()->json([
                'status'  => false,
                'message' => "Gagal menghapus! Kelas ini masih dipakai oleh {$used} siswa.",
            ], 422);
        }

        ActivityLog::log('kelas.delete', 'warn', ['kelas_id' => $kelas->id, 'nama' => $kelas->nama]);
        $kelas->delete();
        return response()->json(['status' => true, 'message' => 'Kelas berhasil dihapus.']);
    }
}
