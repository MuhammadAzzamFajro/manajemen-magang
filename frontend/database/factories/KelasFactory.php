<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Kelas>
 */
class KelasFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kelas'=>
            fake()->randomElement(['X', 'XI', 'XII']).''.
            fake()->randomElement(['RPL', 'TKJ', 'DKV']).''.
            fake()->randomElement(['1', '2', '3']),
        ];
    }
}
