<?php

namespace App\Http\Controllers;

use App\Models\logbook;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LogbookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = logbook::with(['siswa', 'verifier']);

        // Filter by status if provided
        if ($request->has('status')) {
            $query->byStatus($request->status);
        }

        // Filter by siswa if provided
        if ($request->has('siswa_id')) {
            $query->bySiswa($request->siswa_id);
        }

        // Filter by date range if provided
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->byDateRange($request->start_date, $request->end_date);
        }

        // Search by kegiatan if provided
        if ($request->has('search')) {
            $query->where('kegiatan', 'like', "%{$request->search}%");
        }

        $logbooks = $query->orderBy('tanggal', 'desc')->get();

        return response()->json([
            'status' => true,
            'message' => 'Data logbook berhasil diambil',
            'data' => $logbooks
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'tanggal' => 'required|date',
            'kegiatan' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'jam_mulai' => 'nullable|date_format:H:i',
            'jam_selesai' => 'nullable|date_format:H:i|after:jam_mulai',
            'status' => 'in:Menunggu,Disetujui,Ditolak',
        ]);

        // Verify that the siswa exists and is active
        $siswa = Siswa::find($request->siswa_id);
        if (!$siswa) {
            return response()->json([
                'status' => false,
                'message' => 'Siswa tidak ditemukan',
                'data' => null
            ], 404);
        }

        $logbook = logbook::create([
            'siswa_id' => $request->siswa_id,
            'tanggal' => $request->tanggal,
            'kegiatan' => $request->kegiatan,
            'deskripsi' => $request->deskripsi,
            'jam_mulai' => $request->jam_mulai,
            'jam_selesai' => $request->jam_selesai,
            'status' => $request->status ?? 'Menunggu',
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Data logbook berhasil ditambahkan',
            'data' => $logbook->load(['siswa', 'verifier'])
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $logbook = logbook::with(['siswa', 'verifier'])->find($id);

        if ($logbook) {
            return response()->json([
                'status' => true,
                'message' => 'Data logbook berhasil diambil',
                'data' => $logbook
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Data logbook tidak ditemukan',
                'data' => null
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $logbook = logbook::find($id);
        if (!$logbook) {
            return response()->json([
                'status' => false,
                'message' => 'Data logbook tidak ditemukan',
                'data' => null
            ], 404);
        }

        $request->validate([
            'siswa_id' => 'sometimes|required|exists:siswas,id',
            'tanggal' => 'sometimes|required|date',
            'kegiatan' => 'sometimes|required|string|max:255',
            'deskripsi' => 'sometimes|nullable|string',
            'jam_mulai' => 'sometimes|nullable|date_format:H:i',
            'jam_selesai' => 'sometimes|nullable|date_format:H:i|after:jam_mulai',
            'status' => 'sometimes|in:Menunggu,Disetujui,Ditolak',
        ]);

        // If status is being updated to Disetujui or Ditolak, set verification info
        if ($request->has('status') && in_array($request->status, ['Disetujui', 'Ditolak'])) {
            $request->merge([
                'diverifikasi_oleh' => Auth::id(),
                'diverifikasi_pada' => now(),
            ]);
        }

        $logbook->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Data logbook berhasil diupdate',
            'data' => $logbook->load(['siswa', 'verifier'])
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $logbook = logbook::find($id);
        if (!$logbook) {
            return response()->json([
                'status' => false,
                'message' => 'Data logbook tidak ditemukan',
                'data' => null
            ], 404);
        }

        $logbook->delete();

        return response()->json([
            'status' => true,
            'message' => 'Data logbook berhasil dihapus',
            'data' => null
        ]);
    }

    /**
     * Update logbook status (for verification)
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Menunggu,Disetujui,Ditolak',
        ]);

        $logbook = logbook::find($id);
        if (!$logbook) {
            return response()->json([
                'status' => false,
                'message' => 'Data logbook tidak ditemukan',
                'data' => null
            ], 404);
        }

        $logbook->update([
            'status' => $request->status,
            'diverifikasi_oleh' => Auth::id(),
            'diverifikasi_pada' => now(),
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Status logbook berhasil diupdate',
            'data' => $logbook->load(['siswa', 'verifier'])
        ]);
    }

    /**
     * Get logbooks by siswa
     */
    public function getBySiswa($siswaId)
    {
        $logbooks = logbook::with(['siswa', 'verifier'])
                          ->bySiswa($siswaId)
                          ->orderBy('tanggal', 'desc')
                          ->get();

        return response()->json([
            'status' => true,
            'message' => 'Data logbook siswa berhasil diambil',
            'data' => $logbooks
        ]);
    }
}
