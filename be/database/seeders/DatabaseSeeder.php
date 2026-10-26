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
        // 1. Akun resmi demo untuk pengujian juri lomba (Admin)
        User::updateOrCreate(
            ['email' => 'demo@wayangdigital.id'],
            [
                'name' => 'Dalang Demo (Juri)',
                'password' => Hash::make('Wayang@2026!'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // 2. Akun demo frontend modal (Wayangverse - User Biasa)
        User::updateOrCreate(
            ['email' => 'dalang_demo@wayangverse.id'],
            [
                'name' => 'Ki Dalang Muda Nusantara',
                'password' => Hash::make('dalang2026!'),
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );

        // 3. Akun Administrator Sistem
        User::updateOrCreate(
            ['email' => 'admin@wayangdigital.id'],
            [
                'name' => 'Administrator Wayang',
                'password' => Hash::make('Admin@2026!'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // 4. Panggil MasterDataSeeder
        $this->call(MasterDataSeeder::class);
    }
}
