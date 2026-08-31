<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Jurusan;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class JurusanController extends Controller
{
    public function index()
    {
        $data = Jurusan::withCount('guru')->withCount('kelas')->orderBy('nama')->get();
        return response()->json(['status' => true, 'data' => $data]);
    }

    public function store(Request $request)
    {
        $request->validate(['nama' => 'required|string|max:255|unique:jurusan,nama']);
        $jurusan = Jurusan::create(['nama' => $request->nama]);
        ActivityLog::log('jurusan.create', 'info', ['jurusan_id' => $jurusan->id, 'nama' => $jurusan->nama]);
        return response()->json(['status' => true, 'message' => 'Jurusan berhasil ditambahkan.', 'data' => $jurusan], 201);
    }

    public function update(Request $request, $id)
    {
        $jurusan = Jurusan::findOrFail($id);
        $request->validate(['nama' => 'required|string|max:255|unique:jurusan,nama,' . $id]);
        $jurusan->update(['nama' => $request->nama]);
        ActivityLog::log('jurusan.update', 'info', ['jurusan_id' => $jurusan->id, 'nama' => $jurusan->nama]);
        return response()->json(['status' => true, 'message' => 'Jurusan berhasil diperbarui.', 'data' => $jurusan]);
    }

    public function destroy($id)
    {
        $jurusan = Jurusan::findOrFail($id);

        $used = $jurusan->guru()->count() + $jurusan->kelas()->count();
        if ($used > 0) {
            return response()->json([
                'status'  => false,
                'message' => "Gagal menghapus! Jurusan ini dipakai oleh {$jurusan->guru()->count()} guru dan {$jurusan->kelas()->count()} kelas.",
            ], 422);
        }

        ActivityLog::log('jurusan.delete', 'warn', ['jurusan_id' => $jurusan->id, 'nama' => $jurusan->nama]);
        $jurusan->delete();
        return response()->json(['status' => true, 'message' => 'Jurusan berhasil dihapus.']);
    }
}
