<?php

namespace App\Http\Controllers;

use App\Models\Magang;
use Illuminate\Http\Request;

class MagangController extends Controller
{
    public function index()
    {
        $magangs = Magang::with(['siswa.kelas', 'dudi', 'guruPembimbing'])->get();
        return response()->json($magangs);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'dudi_id' => 'required|exists:dudis,id',
            'guru_pembimbing_id' => 'required|exists:users,id',
            'judul_magang' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
        ]);

        return Magang::create($validated);
    }

    public function show($id)
    {
        return Magang::with(['siswa', 'dudi', 'guruPembimbing'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $magang = Magang::findOrFail($id);

        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'dudi_id' => 'required|exists:dudis,id',
            'guru_pembimbing_id' => 'required|exists:users,id',
            'judul_magang' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
        ]);

        $magang->update($validated);

        return $magang;
    }

    public function destroy($id)
    {
        $magang = Magang::findOrFail($id);
        $magang->delete();

        return response()->json(['message' => 'Data magang berhasil dihapus']);
    }
}
