<?php

namespace Database\Seeders;

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
        // Akun resmi demo untuk pengujian juri lomba
        User::updateOrCreate(
            ['email' => 'demo@wayangdigital.id'],
            [
                'name' => 'Dalang Demo (Juri)',
                'password' => Hash::make('Wayang@2026!'),
                'email_verified_at' => now(),
            ]
        );
    }
}
