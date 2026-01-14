<?php

namespace Database\Factories;

use App\Models\Logbook;
use App\Models\Siswa;
use Illuminate\Database\Eloquent\Factories\Factory;

class LogbookFactory extends Factory
{
    protected $model = Logbook::class;

    public function definition(): array
    {
        return [
            'siswa_id' => Siswa::all()->random()->id,
            'tanggal' => $this->faker->date(),
            'kegiatan' => $this->faker->sentence(12),
        ];
    }
}

