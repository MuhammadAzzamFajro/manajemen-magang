<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pelanggaran;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\BuktiPelanggaran;

class PelanggaranController extends Controller
{
    /**
     * Menampilkan semua data pelanggaran.
     */
    public function index()
    {
        $pelanggaran = Pelanggaran::with('siswa.kelas', 'dilaporkan_oleh', 'bukti')->latest()->get();
        return response()->json([
            'status' => true,
            'message' => 'Data pelanggaran berhasil diambil',
            'data' => $pelanggaran
        ]);
    }

    /**
     * Menampilkan data pelanggaran berdasarkan ID.
     */
    public function show($id)
    {
        // Menggunakan findOrFail untuk mencari pelanggaran berdasarkan ID, atau gagal dengan 404 jika tidak ditemukan
        $pelanggaran = Pelanggaran::with('siswa.kelas', 'dilaporkan_oleh', 'bukti')->findOrFail($id);

        return response()->json([
            'status' => true,
            'message' => 'Data pelanggaran berhasil diambil',
            'data' => $pelanggaran
        ]);
    }

    /**
     * Menyimpan data pelanggaran baru.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'dilaporkan_oleh_id' => 'required|exists:users,id',
            'jenis_pelanggaran' => 'required|string',
            'tingkat' => 'required|string',
            'poin' => 'required|integer',
            'tanggal' => 'required|date',
            'waktu' => 'required',
            'lokasi' => 'required|string',
            'deskripsi' => 'nullable|string',
            'status' => 'required|string',
            'tindakan' => 'nullable|string',
            'tanggal_tindak_lanjut' => 'nullable|date',
            'catatan' => 'nullable|string',
            // Validasi untuk file upload
            'bukti_files' => 'nullable|array',
            'bukti_files.*' => 'file|mimes:jpg,jpeg,png,pdf,doc,docx|max:2048', // Menambahkan tipe file lain jika perlu
            // Validasi untuk deskripsi bukti
            'bukti_descriptions' => 'nullable|array',
            'bukti_descriptions.*' => 'nullable|string',
        ]);

        // Menggunakan transaksi database untuk memastikan integritas data
        DB::beginTransaction();
        try {
            $pelanggaran = Pelanggaran::create([
                'dilaporkan_oleh_id' => $validatedData['dilaporkan_oleh_id'],
                'siswa_id' => $validatedData['siswa_id'],
                'jenis_pelanggaran' => $validatedData['jenis_pelanggaran'],
                'tingkat' => $validatedData['tingkat'],
                'poin' => $validatedData['poin'],
                'tanggal' => $validatedData['tanggal'],
                'waktu' => $validatedData['waktu'],
                'lokasi' => $validatedData['lokasi'],
                'deskripsi' => $validatedData['deskripsi'] ?? null,
                'status' => $validatedData['status'],
                'tindakan' => $validatedData['tindakan'] ?? null,
                'tanggal_tindak_lanjut' => $validatedData['tanggal_tindak_lanjut'] ?? null,
                'catatan' => $validatedData['catatan'] ?? null,
            ]);

            // Handle file upload untuk bukti
            if ($request->hasFile('bukti_files')) {
                $buktiData = [];
                $files = $request->file('bukti_files');
                $descriptions = $request->input('bukti_descriptions', []);
                $user = Auth::user(); // Mendapatkan user yang sedang login

                foreach ($files as $index => $file) {
                    if ($file->isValid()) {
                        // Generate nama file unik
                        $filename = time() . '_' . $index . '_' . $file->getClientOriginalName();

                        // Simpan file ke storage/app/public/bukti_pelanggaran
                        $path = $file->storeAs('bukti_pelanggaran', $filename, 'public');

                        // Tentukan tipe file (image atau file)
                        $mimetype = $file->getMimeType();
                        $tipe = str_starts_with($mimetype, 'image/') ? 'image' : 'file';

                        // Kumpulkan data bukti untuk disimpan ke database
                        $buktiData[] = [
                            'tipe' => $tipe,
                            'url' => $path, // Path relatif ke storage
                            'nama' => $file->getClientOriginalName(),
                            'deskripsi' => $descriptions[$index] ?? null,
                            'diunggah_oleh' => $user->name, // Mengambil nama user
                            'waktu_unggah' => now(),
                            'mime_type' => $mimetype,
                            'size' => $file->getSize(),
                        ];
                    }
                }

                // Simpan bukti ke database menggunakan relasi
                if (!empty($buktiData)) {
                    $pelanggaran->bukti()->createMany($buktiData);
                }
            }

            // Load relasi bukti agar data terkirim di response
            $pelanggaran->load('bukti');

            return response()->json([
                'status' => true,
                'message' => 'Data pelanggaran berhasil disimpan',
                'data' => $pelanggaran
            ], 201); // Menggunakan status code 201 Created

        } catch (\Exception $e) {
            // Rollback transaksi jika terjadi error
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Gagal menyimpan data pelanggaran',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Memperbarui data pelanggaran yang ada.
     */
    public function update(Request $request, $id)
    {
        $pelanggaran = Pelanggaran::findOrFail($id);

        $validatedData = $request->validate([
            'siswa_id' => 'sometimes|required|exists:siswas,id',
            'dilaporkan_oleh_id' => 'sometimes|required|exists:users,id',
            'jenis_pelanggaran' => 'sometimes|required|string',
            'tingkat' => 'sometimes|required|string',
            'poin' => 'sometimes|required|integer',
            'tanggal' => 'sometimes|required|date',
            'waktu' => 'sometimes|required',
            'lokasi' => 'sometimes|required|string',
            'deskripsi' => 'nullable|string',
            'status' => 'sometimes|required|string',
            'tindakan' => 'nullable|string',
            'tanggal_tindak_lanjut' => 'nullable|date',
            'catatan' => 'nullable|string',
        ]);

        $pelanggaran->update($validatedData);

        // Di sini bisa ditambahkan logika untuk menambah/menghapus bukti jika diperlukan

        return response()->json([
            'status' => true,
            'message' => 'Data pelanggaran berhasil diperbarui',
            'data' => $pelanggaran
        ]);
    }

    /**
     * Menghapus data pelanggaran.
     */
    public function destroy($id)
    {
        $pelanggaran = Pelanggaran::with('bukti')->findOrFail($id);

        // Hapus file bukti dari storage sebelum menghapus record dari database
        foreach ($pelanggaran->bukti as $bukti) {
            Storage::disk('public')->delete($bukti->url);
        }

        // Hapus record pelanggaran (dan record bukti terkait akan terhapus oleh cascade on delete jika di-setting di migrasi)
        $pelanggaran->delete();

        return response()->json([
            'status' => true,
            'message' => 'Data pelanggaran berhasil dihapus'
        ]);
    }
    public function getBuktiFile($id)
    {
        $bukti = BuktiPelanggaran::findOrFail($id);

        $filePath = storage_path('app/public/' . $bukti->url);

        if (!file_exists($filePath)) {
            abort(404, 'File tidak ditemukan');
        }

        return response()->file($filePath);
    }

    /**
     * Mengunduh file bukti.
     */
    public function downloadBuktiFile($id)
    {
        $bukti = BuktiPelanggaran::findOrFail($id);

        $filePath = storage_path('app/public/' . $bukti->url);

        if (!file_exists($filePath)) {
            abort(404, 'File tidak ditemukan');
        }

        return response()->download($filePath, $bukti->nama);
    }
    public function getBuktiImage($id)
    {
        $bukti = BuktiPelanggaran::findOrFail($id);

        $filePath = storage_path('app/public/' . $bukti->url);

        if (!file_exists($filePath)) {
            abort(404, 'File tidak ditemukan');
        }

        $mimetype = mime_content_type($filePath);
        $content = file_get_contents($filePath);

        return response($content, 200, [
            'Content-Type' => $mimetype,
            'Content-Disposition' => 'inline; filename="' . $bukti->nama . '"',
        ]);
    }
}
