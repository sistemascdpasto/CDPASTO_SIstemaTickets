<?php

namespace Database\Factories;

use App\Models\TicketStatus;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<TicketStatus>
 */
class TicketStatusFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->word();

        return [
            'name' => Str::title($name),
            'slug' => Str::slug($name),
            'color' => fake()->randomElement(['slate', 'blue', 'amber', 'green', 'red', 'zinc']),
            'sort_order' => fake()->numberBetween(1, 20),
            'is_default' => false,
            'is_resolved' => false,
            'is_terminal' => false,
        ];
    }
}
