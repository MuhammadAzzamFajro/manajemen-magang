<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Siswa;

class SiswaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $siswa = Siswa::with('kelas')->get();
        return response()->json([
            'status' => true,
            'message' => 'Data siswa berhasil diambil',
            'data' => $siswa
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nis' => 'required|string|unique:siswas,nis',
            'nama' => 'required|string|max:255',
            'kelas_id' => 'required|exists:kelas,id',
            'alamat' => 'required|string',
        ]);

        $siswa = Siswa::create([
            'nis' => $request->nis,
            'nama' => $request->nama,
            'kelas_id' => $request->kelas_id,
            'alamat' => $request->alamat,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Data siswa berhasil ditambahkan',
            'data' => $siswa
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $siswa = Siswa::with('kelas')->find($id);

        if ($siswa) {
            return response()->json([
                'status' => true,
                'message' => 'Data siswa berhasil diambil',
                'data' => $siswa
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Data siswa tidak ditemukan',
                'data' => null
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $siswa = Siswa::find($id);
        if (!$siswa) {
            return response()->json([
                'status' => false,
                'message' => 'Data siswa tidak ditemukan',
                'data' => null
            ], 404);
        }

        $request->validate([
            'nis' => 'sometimes|required|string|unique:siswas,nis,' . $id,
            'nama' => 'sometimes|required|string|max:255',
            'kelas_id' => 'sometimes|required|exists:kelas,id',
            'alamat' => 'sometimes|required|string',
        ]);

        $siswa->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Data siswa berhasil diupdate',
            'data' => $siswa
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $siswa = Siswa::find($id);
        if (!$siswa) {
            return response()->json([
                'status' => false,
                'message' => 'Data siswa tidak ditemukan',
                'data' => null
            ], 404);
        }

        $siswa->delete();

        return response()->json([
            'status' => true,
            'message' => 'Data siswa berhasil dihapus',
            'data' => null
        ]);
    }
}
