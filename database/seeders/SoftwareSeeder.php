<?php

namespace Database\Seeders;

use App\Models\Software;
use Illuminate\Database\Seeder;

class SoftwareSeeder extends Seeder
{
    public function run(): void
    {
        // Un único software de arranque, sin descripción. El resto se administra
        // desde el panel (Admin → Softwares).
        Software::query()->firstOrCreate(
            ['slug' => 'general'],
            ['name' => 'General', 'description' => null, 'color' => null, 'is_active' => true],
        );
    }
}
