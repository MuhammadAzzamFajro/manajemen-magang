<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Dudi;
use App\Models\logbook;
use App\Models\Magang;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Admin / Guru
        User::updateOrCreate(['email' => 'admin@gmail.com'], [
            'name' => 'Admin Guru Master',
            'password' => bcrypt('password'),
            'role' => 'Guru'
        ]);

        // 2. Demo Student User
        $studentUser = User::updateOrCreate(['email' => 'siswa@gmail.com'], [
            'name' => 'Azzam Kurnia',
            'password' => bcrypt('password'),
            'role' => 'Siswa'
        ]);

        // 3. Setup Kelas
        $kelas = Kelas::factory()->count(5)->create();
        
        // 4. Buat Profil Siswa untuk User Demo
        $demoSiswa = Siswa::updateOrCreate(['user_id' => $studentUser->id], [
            'nis' => '123456789',
            'nama' => 'Azzam Kurnia',
            'kelas_id' => $kelas->random()->id,
            'alamat' => 'Jl. Merdeka No. 1, Surabaya',
        ]);

        // 5. Seed DUDI
        $seededDudis = Dudi::factory()->count(15)->create();
        
        // 6. Seed Magang untuk Siswa Demo
        $guruId = User::where('email', 'admin@gmail.com')->first()->id;
        
        Magang::create([
            'siswa_id' => $demoSiswa->id,
            'dudi_id' => $seededDudis->random()->id,
            'guru_pembimbing_id' => $guruId,
            'judul_magang' => 'Web Developer Intern',
            'deskripsi' => 'Fokus pada pengembangan UI/UX dan integrasi sistem backend.',
            'tanggal_mulai' => now()->subMonths(2),
            'status' => 'Aktif',
        ]);

        // 7. Seed Logbooks untuk siswa demo
        logbook::factory()->count(10)->create([
            'siswa_id' => $demoSiswa->id,
            'status' => 'Setuju'
        ]);

        logbook::factory()->count(3)->create([
            'siswa_id' => $demoSiswa->id,
            'status' => 'Menunggu'
        ]);
    }
}
