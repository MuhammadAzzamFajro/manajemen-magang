<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Pelanggaran;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BuktiPelanggaran>
 */
class BuktiPelanggaranFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'pelanggaran_id' => Pelanggaran::all()->random()->id,
            'tipe' => fake()->randomElement(['foto', 'video', 'dokumen']),
            'url' => fake()->imageUrl(),
            'nama' => fake()->words(3, true),
            'deskripsi' => fake()->sentence(10),
            'diunggah_oleh_id' => User::all()->random()->id,
            'waktu_unggah' => fake()->time(),
        ];
    }
}
