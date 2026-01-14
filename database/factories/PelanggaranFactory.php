<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Siswa;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pelanggaran>
 */
class PelanggaranFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        return [
            'siswa_id' => Siswa::inRandomOrder()->first()->id ?? Siswa::factory(),
            'dilaporkan_oleh_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'jenis_pelanggaran' => fake()->randomElement(['Terlambat', 'Merokok', 'Membolos', 'Berkelahi']),
            'tingkat' => fake()->randomElement(['Ringan', 'Sedang', 'Berat']),
            'poin' => fake()->numberBetween(5, 100),
            'tanggal' => fake()->date(),
            'waktu' => fake()->time(),
            'lokasi' => fake()->randomElement(['Kelas', 'Kantin', 'Lapangan', 'Perpustakaan']),
            'deskripsi' => fake()->sentence(10),
            'status' => fake()->randomElement(['Ditindaklanjuti', 'Belum Ditindaklanjuti']),
            'tindakan' => fake()->randomElement(['Teguran', 'Skorsing', 'Pemanggilan Orang Tua']),
            'tanggal_tindak_lanjut' => fake()->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
            'catatan' => fake()->optional()->sentence(6),
        ];
    }
}
