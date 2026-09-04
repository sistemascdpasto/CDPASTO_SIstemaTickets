<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            TicketStatusSeeder::class,
            SoftwareSeeder::class,
        ]);

        // Cuenta administradora de arranque. Identificación = usuario = contraseña.
        User::updateOrCreate(
            ['identification' => '1000000000'],
            [
                'name' => 'Administrador CD Nariño',
                'email' => 'admin@cdnarino.test',
                'password' => Hash::make('1000000000'),
                'role' => UserRole::Admin,
                'is_active' => true,
                'email_verified_at' => now(),
            ],
        );

        User::updateOrCreate(
            ['identification' => '1234567890'],
            [
                'name' => 'Usuario de prueba',
                'email' => 'test@example.com',
                'password' => Hash::make('1234567890'),
                'role' => UserRole::User,
                'is_active' => true,
                'email_verified_at' => now(),
            ],
        );
    }
}
