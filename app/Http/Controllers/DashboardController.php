<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\Dudi;
use App\Models\Kelas;
use App\Models\Magang;
use App\Models\Logbook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            // Statistik dengan fallback 0
            $stats = [
                'totalSiswa' => Siswa::count(),
                'totalDudi' => Dudi::count(),
                'totalMagang' => Magang::where('status', 'Aktif')->count(),
                'totalLogbook' => Logbook::count(),
                'pendingLogbook' => Logbook::where('status', 'Menunggu')->count(),
                'pendingMagang' => Magang::where('status', 'Pending')->count(),
            ];

            $magangs = Magang::with(['siswa', 'dudi'])
                ->latest()
                ->limit(5)
                ->get() ?? collect();

            $latestSiswas = Siswa::with(['kelas'])
                ->latest()
                ->limit(5)
                ->get() ?? collect();

            $pendingMagangs = Magang::with(['siswa', 'dudi'])
                ->where('status', 'Pending')
                ->latest()
                ->limit(5)
                ->get() ?? collect();

            $pendingLogbooks = Logbook::with(['siswa.user', 'siswa.kelas'])
                ->where('status', 'Menunggu')
                ->latest()
                ->limit(5)
                ->get() ?? collect();

            return view('dashboard.guru.index', compact('stats', 'magangs', 'latestSiswas', 'pendingMagangs', 'pendingLogbooks'));
        } catch (\Exception $e) {
            // Jika ada error, return dengan data kosong
            $stats = [
                'totalSiswa' => 0,
                'totalDudi' => 0,
                'totalMagang' => 0,
                'totalLogbook' => 0,
                'pendingLogbook' => 0,
                'pendingMagang' => 0,
            ];

            return view('dashboard.guru.index', [
                'stats' => $stats,
                'magangs' => collect(),
                'latestSiswas' => collect(),
                'pendingMagangs' => collect(),
                'pendingLogbooks' => collect(),
            ]);
        }
    }

    /**
     * Global search untuk logbook, magang, dan DUDI.
     */
    public function search(Request $request)
    {
        $request->validate([
            'q' => 'nullable|string|max:255',
        ]);

        $query = trim((string) $request->get('q', ''));

        if ($query === '') {
            return redirect()->back();
        }

        $user = Auth::user();

        // Siapkan koleksi kosong default
        $logbooks = collect();
        $magangs = collect();
        $dudis = collect();

        if ($user?->role === 'Guru') {
            // Guru: bisa melihat semua data
            $logbooks = Logbook::with(['siswa.kelas'])
                ->where(function ($q) use ($query) {
                    $q->where('kegiatan', 'like', "%{$query}%")
                      ->orWhere('deskripsi', 'like', "%{$query}%");
                })
                ->latest()
                ->limit(20)
                ->get();

            $magangs = Magang::with(['siswa.kelas', 'dudi'])
                ->where(function ($q) use ($query) {
                    $q->where('judul_magang', 'like', "%{$query}%")
                      ->orWhereHas('siswa', function ($qs) use ($query) {
                          $qs->where('nama', 'like', "%{$query}%");
                      })
                      ->orWhereHas('dudi', function ($qd) use ($query) {
                          $qd->where('nama', 'like', "%{$query}%");
                      });
                })
                ->latest()
                ->limit(20)
                ->get();
        } else {
            // Siswa / role lain: batasi ke data milik siswa login
            $siswa = $this->getLoggedInSiswa();

            if ($siswa) {
                $logbooks = Logbook::where('siswa_id', $siswa->id)
                    ->where(function ($q) use ($query) {
                        $q->where('kegiatan', 'like', "%{$query}%")
                          ->orWhere('deskripsi', 'like', "%{$query}%");
                    })
                    ->latest()
                    ->limit(20)
                    ->get();

                $magangs = Magang::with(['dudi'])
                    ->where('siswa_id', $siswa->id)
                    ->where(function ($q) use ($query) {
                        $q->where('judul_magang', 'like', "%{$query}%")
                          ->orWhereHas('dudi', function ($qd) use ($query) {
                              $qd->where('nama', 'like', "%{$query}%");
                          });
                    })
                    ->latest()
                    ->limit(20)
                    ->get();
            }
        }

        // DUDI bisa dicari oleh semua role
        $dudis = Dudi::where(function ($q) use ($query) {
                $q->where('nama', 'like', "%{$query}%")
                  ->orWhere('bidang_usaha', 'like', "%{$query}%")
                  ->orWhere('alamat', 'like', "%{$query}%");
            })
            ->orderBy('nama')
            ->limit(20)
            ->get();

        return view('search.results', [
            'query' => $query,
            'logbooks' => $logbooks,
            'magangs' => $magangs,
            'dudis' => $dudis,
        ]);
    }

    private function getLoggedInSiswa()
    {
        $user = Auth::user();
        if (!$user) return null;

        $siswa = Siswa::where('user_id', $user->id)
            ->with(['kelas', 'user'])
            ->first();

        // Fix for "novtu" and others: Auto-create Siswa profile if role is Siswa
        if (!$siswa && $user->role === 'Siswa') {
            // Get or create a default class
            $kelas = Kelas::first() ?? Kelas::create(['nama' => 'XII RPL 1']);

            $siswa = Siswa::create([
                'user_id' => $user->id,
                'nis' => 'NIS-' . str_pad($user->id, 5, '0', STR_PAD_LEFT),
                'nama' => $user->name,
                'kelas_id' => $kelas->id,
                'alamat' => 'Belum diisi',
            ]);

            $siswa->load(['kelas', 'user']);
        }

        return $siswa;
    }

    public function siswa()
    {
        $siswa = $this->getLoggedInSiswa();
        $namaSiswa = session('active_name', $siswa ? $siswa->nama : (Auth::user()->name ?? 'User'));

        $logbookCount = Logbook::where('siswa_id', ($siswa?->id) ?? 0)->count();
        $approvedLogbook = Logbook::where('siswa_id', ($siswa?->id) ?? 0)->where('status', 'Setuju')->count();
        $pendingLogbook = Logbook::where('siswa_id', ($siswa?->id) ?? 0)->where('status', 'Menunggu')->count();
        $rejectedLogbook = Logbook::where('siswa_id', ($siswa?->id) ?? 0)->where('status', 'Tolak')->count();

        return view('dashboard.siswa.index', [
            'namaSiswa' => $namaSiswa,
            'logbookCount' => $logbookCount,
            'approvedLogbook' => $approvedLogbook,
            'pendingLogbook' => $pendingLogbook,
            'rejectedLogbook' => $rejectedLogbook,
            'presentRate' => 98,
            'grade' => 'A-',
            'siswa' => $siswa
        ]);
    }

    // Guru Sub-pages
    public function guruSiswa()
    {
        // Auto-seed classes if empty for easier testing
        if (Kelas::count() == 0) {
            Kelas::create(['nama' => 'XII RPL 1']);
            Kelas::create(['nama' => 'XII RPL 2']);
            Kelas::create(['nama' => 'XII TKJ 1']);
        }

        $siswas = Siswa::with(['kelas', 'user'])->latest()->get();
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
            'password' => \Illuminate\Support\Facades\Hash::make('password123'),
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

    public function destroySiswa(Siswa $siswa)
    {
        // Delete associated user first
        if ($siswa->user) {
            $siswa->user->delete();
        }
        $siswa->delete();
        return back()->with('success', 'Data siswa dan akun berhasil dihapus');
    }

    public function guruDudi()
    {
        $dudis = Dudi::latest()->get();
        return view('dashboard.guru.dudi', compact('dudis'));
    }

    public function guruMagang()
    {
        $magangs = Magang::with(['siswa', 'dudi'])->latest()->get();
        $siswas = Siswa::orderBy('nama')->get();
        $dudis = Dudi::orderBy('nama')->get();
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
        $logbooks = Logbook::with(['siswa.user', 'siswa.kelas'])->latest()->get();
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
        $magangs = Magang::where('siswa_id', ($siswa?->id) ?? 0)->with('dudi')->get();
        return view('dashboard.siswa.magang', compact('magangs', 'siswa'));
    }

    public function siswaLogbook()
    {
        $siswa = $this->getLoggedInSiswa();
        $logbooks = Logbook::where('siswa_id', ($siswa?->id) ?? 0)->latest()->get();
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

        if (!$siswa) {
            return back()->with('error', 'Akun Anda tidak terhubung dengan data Siswa. Silakan hubungi admin.');
        }

        Logbook::create([
            'siswa_id' => $siswa->id,
            'tanggal' => $request->tanggal ?? now(),
            'kegiatan' => $request->kegiatan,
            'deskripsi' => $request->deskripsi,
            'status' => 'Menunggu',
        ]);

        return back()->with('success', 'Logbook berhasil dikirim');
    }

    public function storeApplication(Request $request)
    {
        $siswa = $this->getLoggedInSiswa();

        if (!$siswa) {
            return back()->with('error', 'Akun Anda tidak terhubung dengan data Siswa.');
        }

        $request->validate([
            'dudi_id' => 'required|exists:dudis,id',
        ]);

        // Check if already applied
        $exists = Magang::where('siswa_id', $siswa->id)
            ->where('dudi_id', $request->dudi_id)
            ->exists();

        if ($exists) {
            return back()->with('error', 'Anda sudah mengajukan magang di tempat ini.');
        }

        Magang::create([
            'siswa_id' => $siswa->id,
            'dudi_id' => $request->dudi_id,
            'judul_magang' => 'Pengajuan Mandiri',
            'tanggal_mulai' => now(),
            'status' => 'Pending',
            'deskripsi' => 'Pengajuan magang mandiri dari siswa.',
        ]);

        return back()->with('success', 'Pengajuan magang berhasil dikirim. Menunggu verifikasi guru.');
    }

    public function verifyLogbook(Logbook $logbook, Request $request)
    {
        $logbook->update([
            'status' => $request->status,
            'diverifikasi_oleh' => Auth::id(),
            'diverifikasi_pada' => now(),
        ]);

        return back()->with('success', 'Logbook diverifikasi: ' . $request->status);
    }

    public function verifyMagang(Magang $magang, Request $request)
    {
        $magang->update([
            'status' => $request->status === 'Setuju' ? 'Aktif' : 'Tolak',
        ]);

        return back()->with('success', 'Status pengajuan magang diupdate menjadi: ' . $magang->status);
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
