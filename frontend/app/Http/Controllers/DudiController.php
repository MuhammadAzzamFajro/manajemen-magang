<?php

namespace App\Http\Controllers;

use App\Models\Dudi;
use Illuminate\Http\Request;

class DudiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Dudi::query();

        // Filter by bidang usaha if provided
        if ($request->has('bidang_usaha')) {
            $query->byBidangUsaha($request->bidang_usaha);
        }

        // Search by name or penanggung jawab if provided
        if ($request->has('search')) {
            $query->search($request->search);
        }

        $dudis = $query->orderBy('nama')->get();

        return response()->json([
            'status' => true,
            'message' => 'Data DUDI berhasil diambil',
            'data' => $dudis
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'nullable|string',
            'email' => 'nullable|email|unique:dudis,email',
            'telepon' => 'nullable|string|max:20',
            'penanggung_jawab' => 'nullable|string|max:255',
            'jabatan' => 'nullable|string|max:255',
            'bidang_usaha' => 'nullable|string|max:255',
        ]);

        $dudi = Dudi::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Data DUDI berhasil ditambahkan',
            'data' => $dudi
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Dudi $dudi)
    {
        return response()->json([
            'status' => true,
            'message' => 'Data DUDI berhasil diambil',
            'data' => $dudi
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Dudi $dudi)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Dudi $dudi)
    {
        $request->validate([
            'nama' => 'sometimes|required|string|max:255',
            'alamat' => 'sometimes|nullable|string',
            'email' => 'sometimes|nullable|email|unique:dudis,email,' . $dudi->id,
            'telepon' => 'sometimes|nullable|string|max:20',
            'penanggung_jawab' => 'sometimes|nullable|string|max:255',
            'jabatan' => 'sometimes|nullable|string|max:255',
            'bidang_usaha' => 'sometimes|nullable|string|max:255',
        ]);

        $dudi->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Data DUDI berhasil diupdate',
            'data' => $dudi
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dudi $dudi)
    {
        $dudi->delete();

        return response()->json([
            'status' => true,
            'message' => 'Data DUDI berhasil dihapus',
            'data' => null
        ]);
    }

    /**
     * Get DUDI by bidang usaha
     */
    public function getByBidangUsaha($bidang)
    {
        $dudis = Dudi::byBidangUsaha($bidang)->get();

        return response()->json([
            'status' => true,
            'message' => 'Data DUDI berdasarkan bidang usaha berhasil diambil',
            'data' => $dudis
        ]);
    }
}
