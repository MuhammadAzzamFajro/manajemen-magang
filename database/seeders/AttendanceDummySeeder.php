<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Siswa;
use App\Models\User;
use App\Models\Magang;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AttendanceDummySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cari user siswa@gmail.com
        $user = User::where('email', 'siswa@gmail.com')->first();
        
        if (!$user) {
            $this->command->info('User siswa@gmail.com tidak ditemukan.');
            return;
        }

        // Cari siswa yang terhubung
        $siswa = Siswa::where('user_id', $user->id)->first();
        
        if (!$siswa) {
            $this->command->info('Data Siswa tidak ditemukan untuk user tersebut.');
            return;
        }

        // Cari magang untuk mendapat tanggal mulai
        $magang = Magang::where('siswa_id', $siswa->id)->first();
        
        if (!$magang || !$magang->tanggal_mulai) {
            $this->command->info('Data Magang tidak ditemukan atau tanggal mulai kosong.');
            return;
        }

        $startDate = Carbon::parse($magang->tanggal_mulai);
        $endDate = Carbon::now();
        
        // Hapus data kehadiran lama untuk siswa ini
        Attendance::where('siswa_id', $siswa->id)->delete();
        
        $this->command->info("Membuat data kehadiran dari {$startDate->format('Y-m-d')} sampai {$endDate->format('Y-m-d')}...");
        
        $count = 0;
        
        // Buat data kehadiran untuk setiap hari kerja
        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
            // Skip weekend
            if ($date->isWeekend()) {
                continue;
            }
            
            // Random status dengan kemungkinan: 85% Hadir, 5% Sakit, 5% Izin, 5% Tidak Hadir
            $rand = rand(1, 100);
            if ($rand <= 85) {
                $status = 'Hadir';
            } elseif ($rand <= 90) {
                $status = 'Sakit';
            } elseif ($rand <= 95) {
                $status = 'Izin';
            } else {
                $status = 'Tidak Hadir';
            }
            
            Attendance::create([
                'siswa_id' => $siswa->id,
                'tanggal' => $date->format('Y-m-d'),
                'status' => $status,
                'catatan' => $status === 'Hadir' ? null : 'Data dummy seeder',
            ]);
            
            $count++;
        }
        
        $this->command->info("Berhasil membuat {$count} data kehadiran untuk siswa@gmail.com");
    }
}
