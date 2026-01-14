<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\Dudi;
use App\Models\Magang;
use App\Models\logbook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'totalSiswa' => Siswa::count(),
            'totalDudi' => Dudi::count(),
            'totalMagang' => Magang::count(),
            'totalLogbook' => logbook::count(),
        ];

        $magangs = Magang::with(['siswa', 'dudi'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($magang) {
                return [
                    'id' => $magang->id,
                    'status' => $magang->status,
                    'tanggal_mulai' => $magang->tanggal_mulai,
                    'tanggal_selesai' => $magang->tanggal_selesai,
                    'nama_siswa' => $magang->siswa ? $magang->siswa->nama : '-',
                    'dudi' => $magang->dudi ? $magang->dudi->nama : '-',
                ];
            });

        return view('dashboard.guru.index', compact('stats', 'magangs'));
    }

    private function getLoggedInSiswa()
    {
        $user = Auth::user();
        if (!$user) return null;
        
        $siswa = Siswa::where('user_id', $user->id)->first();
        
        // Fallback for demo: if user is admin or guru, and no siswa profile, just use first for demo or handle differently
        if (!$siswa && (str_contains(strtolower($user->name), 'siswa') || $user->email !== 'admin@gmail.com')) {
            // Logic to create or just return first for testing
            return Siswa::first();
        }
        
        return $siswa;
    }

    public function siswa()
    {
        $siswa = $this->getLoggedInSiswa();
        $namaSiswa = $siswa ? $siswa->nama : (Auth::user()->name ?? 'User');

        $logbookCount = logbook::where('siswa_id', $siswa->id ?? 0)->count();
        $approvedLogbook = logbook::where('siswa_id', $siswa->id ?? 0)->where('status', 'Setuju')->count();

        return view('dashboard.siswa.index', [
            'namaSiswa' => $namaSiswa,
            'logbookCount' => $logbookCount,
            'approvedLogbook' => $approvedLogbook,
            'presentRate' => 98, // Mock
            'grade' => 'A-', // Mock
            'siswa' => $siswa
        ]);
    }

    // Guru Sub-pages
    public function guruSiswa()
    {
        $siswas = Siswa::with('kelas', 'user')->latest()->get();
        $kelases = Kelas::all();
        return view('dashboard.guru.siswa', compact('siswas', 'kelases'));
    }

    public function storeSiswa(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'nis' => 'required|unique:siswas',
            'kelas_id' => 'required|exists:kelas,id',
            'alamat' => 'nullable|string',
        ]);

        $user = \App\Models\User::create([
            'name' => $request->nama,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make('password123'), // Default password
            'role' => 'Siswa',
        ]);

        Siswa::create([
            'user_id' => $user->id,
            'nis' => $request->nis,
            'nama' => $request->nama,
            'kelas_id' => $request->kelas_id,
            'alamat' => $request->alamat,
        ]);

        return back()->with('success', 'Siswa berhasil ditambahkan. Password default: password123');
    }

    public function guruDudi()
    {
        $dudis = Dudi::latest()->get();
        return view('dashboard.guru.dudi', compact('dudis'));
    }

    public function guruMagang()
    {
        $magangs = Magang::with(['siswa', 'dudi'])->latest()->get();
        $siswas = Siswa::all();
        $dudis = Dudi::all();
        return view('dashboard.guru.magang', compact('magangs', 'siswas', 'dudis'));
    }

    public function storeMagang(Request $request)
    {
        $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'dudi_id' => 'required|exists:dudis,id',
            'judul_magang' => 'required|string',
            'tanggal_mulai' => 'required|date',
            'deskripsi' => 'nullable|string',
        ]);

        Magang::create([
            'siswa_id' => $request->siswa_id,
            'dudi_id' => $request->dudi_id,
            'guru_pembimbing_id' => Auth::id(),
            'judul_magang' => $request->judul_magang,
            'deskripsi' => $request->deskripsi,
            'tanggal_mulai' => $request->tanggal_mulai,
            'status' => 'Aktif',
        ]);

        return back()->with('success', 'Penempatan magang berhasil ditambahkan');
    }

    public function guruLogbook()
    {
        $logbooks = logbook::with('siswa')->latest()->get();
        return view('dashboard.guru.logbook', compact('logbooks'));
    }

    // Siswa Sub-pages
    public function siswaDudi()
    {
        $dudis = Dudi::latest()->get();
        return view('dashboard.siswa.dudi', compact('dudis'));
    }

    public function siswaMagang()
    {
        $siswa = $this->getLoggedInSiswa();
        $magangs = Magang::where('siswa_id', $siswa->id ?? 0)->with('dudi')->get();
        return view('dashboard.siswa.magang', compact('magangs', 'siswa'));
    }

    public function siswaLogbook()
    {
        $siswa = $this->getLoggedInSiswa();
        $logbooks = logbook::where('siswa_id', $siswa->id ?? 0)->latest()->get();
        return view('dashboard.siswa.logbook', compact('logbooks', 'siswa'));
    }

    // POST Actions
    public function storeDudi(Request $request)
    {
        Dudi::create($request->validate([
            'nama' => 'required|string',
            'bidang_usaha' => 'nullable|string',
            'alamat' => 'nullable|string',
        ]));

        return back()->with('success', 'DUDI berhasil ditambahkan');
    }

    public function storeLogbook(Request $request)
    {
        $siswa = $this->getLoggedInSiswa();
        
        logbook::create([
            'siswa_id' => $siswa->id ?? 1,
            'tanggal' => $request->tanggal ?? now(),
            'kegiatan' => $request->kegiatan,
            'deskripsi' => $request->deskripsi,
            'status' => 'Menunggu',
        ]);

        return back()->with('success', 'Logbook berhasil dikirim');
    }

    public function verifyLogbook(logbook $logbook, Request $request)
    {
        $logbook->update([
            'status' => $request->status,
            'diverifikasi_oleh' => Auth::id(),
            'diverifikasi_pada' => now(),
        ]);

        return back()->with('success', 'Logbook diverifikasi: ' . $request->status);
    }

    public function updateDudi(Dudi $dudi, Request $request)
    {
        $dudi->update($request->validate([
            'nama' => 'required|string',
            'bidang_usaha' => 'nullable|string',
            'telepon' => 'nullable|string',
            'alamat' => 'nullable|string',
        ]));

        return back()->with('success', 'DUDI berhasil diperbarui');
    }

    public function destroyDudi(Dudi $dudi)
    {
        $dudi->delete();
        return back()->with('success', 'DUDI berhasil dihapus');
    }
}
