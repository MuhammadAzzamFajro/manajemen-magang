<?php

namespace Database\Factories;

use App\Models\Magang;
use App\Models\Siswa;
use App\Models\Dudi;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class MagangFactory extends Factory
{
    protected $model = Magang::class;

    public function definition(): array
    {
        return [
            'siswa_id' => Siswa::inRandomOrder()->first()->id ?? Siswa::factory(),
            'dudi_id' => Dudi::inRandomOrder()->first()->id ?? Dudi::factory(),
            'guru_pembimbing_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'judul_magang' => $this->faker->sentence(4),
            'deskripsi' => $this->faker->paragraph(),
            'tanggal_mulai' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'tanggal_selesai' => $this->faker->dateTimeBetween('now', '+6 months'),
        ];
    }
}
