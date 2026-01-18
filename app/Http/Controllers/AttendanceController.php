<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

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

        return view('dashboard.siswa.kehadiran', compact('siswa', 'attendanceStats', 'recentAttendances'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'status' => 'required|in:Hadir,Tidak Hadir,Izin,Sakit',
            'catatan' => 'nullable|string|max:255',
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Sesi login telah berakhir.']);
        }

        // Optimized siswa lookup - direct query instead of complex method
        $siswa = Siswa::where('user_id', $user->id)->first();
        if (!$siswa) {
            return response()->json(['success' => false, 'message' => 'Akun Anda tidak terhubung dengan data Siswa.']);
        }

        $today = Carbon::today();

        // Use upsert for better performance - single query instead of select + insert/update
        Attendance::upsert([
            'siswa_id' => $siswa->id,
            'tanggal' => $today->toDateString(),
            'status' => $request->status,
            'catatan' => $request->catatan,
        ], ['siswa_id', 'tanggal'], ['status', 'catatan']);

        return response()->json([
            'success' => true,
            'message' => 'Kehadiran berhasil dicatat.'
        ]);
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
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;
        $currentDay = Carbon::now()->day;

        $attendances = Attendance::where('siswa_id', $siswa->id)
            ->whereYear('tanggal', $currentYear)
            ->whereMonth('tanggal', $currentMonth)
            ->get();

        // Calculate working days (excluding weekends) up to current date
        $workingDays = 0;
        for ($day = 1; $day <= $currentDay; $day++) {
            $date = Carbon::create($currentYear, $currentMonth, $day);
            // Exclude weekends (Saturday = 6, Sunday = 0)
            if ($date->dayOfWeek != 0 && $date->dayOfWeek != 6) {
                $workingDays++;
            }
        }

        $presentDays = $attendances->where('status', 'Hadir')->count();
        $sickDays = $attendances->where('status', 'Sakit')->count();
        $permissionDays = $attendances->where('status', 'Izin')->count();
        $absentDays = $attendances->where('status', 'Tidak Hadir')->count();

        // Calculate percentage based on working days, not just recorded days
        $percentage = $workingDays > 0 ? round(($presentDays / $workingDays) * 100) : 0;

        return [
            'percentage' => $percentage,
            'working_days' => $workingDays,
            'present_days' => $presentDays,
            'sick_days' => $sickDays,
            'permission_days' => $permissionDays,
            'absent_days' => $absentDays,
        ];
    }
}
