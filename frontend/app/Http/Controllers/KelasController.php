<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kelas;

class KelasController extends Controller
{
    public function index()
    {
      $kelas= Kelas::all();
      return response()->json([
        'status' => true,
        'message' => 'Data kelas berhasil diambil',
        'data' => $kelas
      ]);
    }

    public function show($request)
    {
      $kelas = Kelas::find($request);
      if($kelas){
        return response()->json([
          'status' => true,
          'message' => 'Data kelas berhasil diambil',
          'data' => $kelas
        ]);
      } else {
        return response()->json([
          'status' => false,
          'message' => 'Data kelas tidak ditemukan',
          'data' => null
        ], 404);
      }
    }
    public function store(Request $request)
    {
      $request->validate([
        'nama_kelas' => 'required|string|max:255',
        'kompetensi_keahlian' => 'required|string|max:255',
      ]);

      $kelas = Kelas::create([
        'nama_kelas' => $request->nama_kelas,
        'kompetensi_keahlian' => $request->kompetensi_keahlian,
      ]);

      return response()->json([
        'status' => true,
        'message' => 'Data kelas berhasil ditambahkan',
        'data' => $kelas
      ], 201);
    }
    public function update(Request $request, $id)
    {
      $request->validate([
        'nama_kelas' => 'sometimes|required|string|max:255',
        'kompetensi_keahlian' => 'sometimes|required|string|max:255',
      ]);

      $kelas = Kelas::find($id);
      if(!$kelas){
        return response()->json([
          'status' => false,
          'message' => 'Data kelas tidak ditemukan',
          'data' => null
        ], 404);
      }

      $kelas->update($request->all());

      return response()->json([
        'status' => true,
        'message' => 'Data kelas berhasil diupdate',
        'data' => $kelas
      ]);
    }
    public function destroy($id)
    {
      $kelas = Kelas::find($id);
      if(!$kelas){
        return response()->json([
          'status' => false,
          'message' => 'Data kelas tidak ditemukan',
          'data' => null
        ], 404);
      }

      $kelas->delete();

      return response()->json([
        'status' => true,
        'message' => 'Data kelas berhasil dihapus',
        'data' => null
      ]);
    }
}
