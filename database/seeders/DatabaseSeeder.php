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
        $kelasNames = ['XII RPL 1', 'XII RPL 2', 'XII TKJ 1', 'XII SIJA 1', 'XII MM 1'];
        $kelas = collect();
        foreach($kelasNames as $name) {
            $kelas->push(Kelas::updateOrCreate(['nama' => $name]));
        }
        
        // 4. Buat Profil Siswa untuk User Demo
        $demoSiswa = Siswa::updateOrCreate(['user_id' => $studentUser->id], [
            'nis' => '123456789',
            'nama' => 'Azzam Kurnia',
            'kelas_id' => $kelas->random()->id,
            'alamat' => 'Jl. Merdeka No. 1, Surabaya',
        ]);

        // 5. Seed DUDI with Real Names
        $dudiNames = [
            'PT Global Teknologi Nusantara', 'Google Cloud Indonesia', 'Bukalapak Head Office',
            'PT Telkom Indonesia', 'Startup Digital Hub', 'Kementerian Kominfo',
            'PT Multimedia Kreatif', 'UBIG Studio', 'Nokia Indonesia',
            'PT PLN (Persero)', 'Pertamina IT Division', 'Shopee International Indonesia',
            'Gojek Indonesia', 'Traveloka Tech', 'Tokopedia Academy'
        ];

        foreach($dudiNames as $dudiName) {
            Dudi::updateOrCreate(['nama' => $dudiName], [
                'alamat' => 'Gedung Cyber 2, Jl. HR. Rasuna Said, Jakarta',
                'pimpinan' => 'Bp. Budi Santoso',
                'telepon' => '021-555' . rand(100, 999),
                'email_kontak' => strtolower(str_replace(' ', '.', $dudiName)) . '@company.com',
            ]);
        }

        $seededDudis = Dudi::all();
        
        // 6. Seed Magang untuk Siswa Demo
        $guruId = User::where('email', 'admin@gmail.com')->first()->id;
        
        Magang::updateOrCreate(['siswa_id' => $demoSiswa->id], [
            'dudi_id' => $seededDudis->random()->id,
            'guru_pembimbing_id' => $guruId,
            'judul_magang' => 'Web Developer Intern',
            'deskripsi' => 'Fokus pada pengembangan UI/UX dan integrasi sistem backend.',
            'tanggal_mulai' => now()->subMonths(2),
            'status' => 'Aktif',
        ]);

        // 7. Seed Logbooks untuk siswa demo
        if (logbook::where('siswa_id', $demoSiswa->id)->count() == 0) {
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
}
