<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index()
    {
        $siswa = $this->getLoggedInSiswa();

        if (!$siswa) {
            return redirect()->route('dashboard.siswa')->with('error', 'Akun Anda tidak terhubung dengan data Siswa.');
        }

        // Get attendance statistics
        $attendanceStats = $this->getAttendanceStats($siswa);

        // Get recent attendance records
        $recentAttendances = Attendance::where('siswa_id', $siswa->id)
            ->orderBy('tanggal', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Dashboard/Siswa/Kehadiran', compact('siswa', 'attendanceStats', 'recentAttendances'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'status' => 'required|in:Hadir,Tidak Hadir,Izin,Sakit',
            'catatan' => 'nullable|string|max:255',
        ]);

        $siswa = $this->getLoggedInSiswa();
        
        if (!$siswa) {
            return back()->with('error', 'Akun Anda tidak terhubung dengan data Siswa. Hubungi admin.');
        }

        $today = Carbon::today();

        // Use upsert for better performance - single query instead of select + insert/update
        Attendance::upsert([
            'siswa_id' => $siswa->id,
            'tanggal' => $today->toDateString(),
            'status' => $request->status,
            'catatan' => $request->catatan,
        ], ['siswa_id', 'tanggal'], ['status', 'catatan']);

        return back()->with('success', 'Kehadiran berhasil dicatat.');
    }

    private function getLoggedInSiswa()
    {
        $user = Auth::user();
        if (!$user) return null;

        $activeEmail = session('active_email');

        $siswa = null;

        // Jika ada active_email, cari siswa berdasarkan email tersebut (untuk switch role)
        if ($activeEmail) {
            $targetUser = \App\Models\User::where('email', $activeEmail)->first();
            if ($targetUser) {
                $siswa = Siswa::where('user_id', $targetUser->id)
                    ->with(['kelas', 'user'])
                    ->first();
            }
        }

        // Fallback ke siswa dari user yang login saat ini
        if (!$siswa) {
            $siswa = Siswa::where('user_id', $user->id)
                ->with(['kelas', 'user'])
                ->first();
        }

        return $siswa;
    }

    private function getAttendanceStats(Siswa $siswa)
    {
        $now = Carbon::now();
        
        // Cek data magang untuk mendapatkan tanggal mulai
        $magang = \App\Models\Magang::where('siswa_id', $siswa->id)->first();
        
        // Jika ada magang, gunakan tanggal mulai magang. Jika tidak, fallback ke awal bulan ini.
        if ($magang && $magang->tanggal_mulai) {
            $startDate = Carbon::parse($magang->tanggal_mulai);
        } else {
            $startDate = $now->copy()->startOfMonth();
        }
        
        // Ambil statistik per status SEJAK TANGGAL MULAI
        $stats = Attendance::where('siswa_id', $siswa->id)
            ->whereBetween('tanggal', [$startDate->format('Y-m-d'), $now->format('Y-m-d')])
            ->select('status', \Illuminate\Support\Facades\DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        // Hitung hari kerja (Senin-Jumat) dari tanggal mulai sampai hari ini (denominator)
        // Ini merefleksikan "Sudah berapa hari kerja berlalu sejak magang dimulai?"
        // Sinkron dengan konsep "Progres Waktu" di dashboard
        $workingDays = $startDate->diffInDaysFiltered(function (Carbon $date) {
            return !$date->isWeekend();
        }, $now);
        
        // Tambahkan 1 hari jika hari ini adalah weekday (karena diffInDaysFiltered biasanya exclude end date atau tergantung jam, safe way + check)
        if (!$now->isWeekend()) {
             $workingDays += 1;
        }

        // Koreksi jika start date > now (future date)
        if ($workingDays < 0) $workingDays = 0;

        $presentDays = $stats['Hadir'] ?? 0;
        $sickDays = $stats['Sakit'] ?? 0;
        $permissionDays = $stats['Izin'] ?? 0;
        $absentDays = $stats['Tidak Hadir'] ?? 0; // Sebenarnya absent days harusnya dihitung dari workingDays - present - sick - permission

        // Hitung persentase: (Hadir / Hari Kerja Yang Sudah Berlalu)
        // Jadi jika magang berjalan 10 hari, dan hadir 10 hari, maka 100%.
        $percentage = $workingDays > 0 ? round(($presentDays / $workingDays) * 100) : 0;
        
        // Cap percentage at 100% just in case of odd data
        $percentage = min(100, $percentage);

        return [
            'percentage' => $percentage,
            'working_days' => $workingDays,  // Ini adalah "Seharusnya Hadir" (total hari kerja yang sudah lewat)
            'present_days' => $presentDays,
            'sick_days' => $sickDays,
            'permission_days' => $permissionDays,
            'absent_days' => $workingDays - ($presentDays + $sickDays + $permissionDays), // Sisa hari yang bolos (alfa)
        ];
    }
}
