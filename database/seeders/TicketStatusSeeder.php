<?php

namespace Database\Seeders;

use App\Models\TicketStatus;
use Illuminate\Database\Seeder;

class TicketStatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            ['name' => 'Pendiente', 'slug' => 'pendiente', 'color' => 'slate', 'sort_order' => 1, 'is_default' => true],
            ['name' => 'En revisión', 'slug' => 'en-revision', 'color' => 'blue', 'sort_order' => 2],
            ['name' => 'En proceso', 'slug' => 'en-proceso', 'color' => 'amber', 'sort_order' => 3],
            ['name' => 'Resuelto', 'slug' => 'resuelto', 'color' => 'green', 'sort_order' => 4, 'is_resolved' => true],
            ['name' => 'Cerrado', 'slug' => 'cerrado', 'color' => 'zinc', 'sort_order' => 5, 'is_resolved' => true, 'is_terminal' => true],
            ['name' => 'Rechazado', 'slug' => 'rechazado', 'color' => 'red', 'sort_order' => 6, 'is_terminal' => true],
        ];

        foreach ($statuses as $status) {
            TicketStatus::query()->updateOrCreate(
                ['slug' => $status['slug']],
                $status + ['is_default' => false, 'is_resolved' => false, 'is_terminal' => false],
            );
        }
    }
}
