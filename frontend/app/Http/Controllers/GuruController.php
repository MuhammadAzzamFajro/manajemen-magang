<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Guru;
use Illuminate\Support\Facades\Hash;

class GuruController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $guru = Guru::all();
        return response()->json([
            'status' => true,
            'message' => 'Data guru berhasil diambil',
            'data' => $guru
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:guru,email',
            'password' => 'required|string|min:8',
        ]);

        $guru = Guru::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Data guru berhasil ditambahkan',
            'data' => $guru
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $guru = Guru::find($id);

        if ($guru) {
            return response()->json([
                'status' => true,
                'message' => 'Data guru berhasil diambil',
                'data' => $guru
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Data guru tidak ditemukan',
                'data' => null
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $guru = Guru::find($id);
        if (!$guru) {
            return response()->json([
                'status' => false,
                'message' => 'Data guru tidak ditemukan',
                'data' => null
            ], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|unique:guru,email,' . $id,
            'password' => 'sometimes|required|string|min:8',
        ]);

        $data = $request->only(['name', 'email']);
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $guru->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Data guru berhasil diupdate',
            'data' => $guru
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $guru = Guru::find($id);
        if (!$guru) {
            return response()->json([
                'status' => false,
                'message' => 'Data guru tidak ditemukan',
                'data' => null
            ], 404);
        }

        $guru->delete();

        return response()->json([
            'status' => true,
            'message' => 'Data guru berhasil dihapus',
            'data' => null
        ]);
    }
}
