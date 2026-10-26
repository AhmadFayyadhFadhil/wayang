<?php

use App\Http\Controllers\Api\AudioAssetController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CharacterController;
use App\Http\Controllers\Api\PerformanceController;
use App\Http\Controllers\Api\PublicArchiveController;
use App\Http\Controllers\Api\StatusController;
use App\Http\Controllers\Api\StoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Wayang Digital (Wayangverse)
|--------------------------------------------------------------------------
*/

// 1. Health & Status Check
Route::get('/status', [StatusController::class, 'index']);

// 2. CSRF cookie fallback for API clients
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['status' => 'ok', 'message' => 'CSRF cookie initialized']);
});

// 3. Autentikasi Publik (Dilindungi Rate Limiter)
Route::middleware('throttle:10,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

// 4. Master Data Terbuka (Public Catalog & Atlas)
Route::get('/stories', [StoryController::class, 'index']);
Route::get('/stories/{slug}', [StoryController::class, 'show']);
Route::get('/characters', [CharacterController::class, 'index']);
Route::get('/characters/{slug}', [CharacterController::class, 'show']);
Route::get('/audio-assets', [AudioAssetController::class, 'index']);
Route::get('/audio-assets/{id}', [AudioAssetController::class, 'show']);

// 5. Arsip Terbuka Publik (Connected Archive Galeri)
Route::get('/public/performances', [PublicArchiveController::class, 'index']);
Route::get('/public/performances/{id}', [PublicArchiveController::class, 'show']);

// 6. Rute Terproteksi Sanctum (Wajib Login)
Route::middleware('auth:sanctum')->group(function () {
    // Info User & Logout
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Manajemen Karya Pengguna (CRUD Performances)
    Route::get('/performances', [PerformanceController::class, 'index']);
    Route::post('/performances', [PerformanceController::class, 'store']);
    Route::get('/performances/{id}', [PerformanceController::class, 'show']);
    Route::patch('/performances/{id}', [PerformanceController::class, 'update']);
    Route::put('/performances/{id}', [PerformanceController::class, 'update']);
    Route::delete('/performances/{id}', [PerformanceController::class, 'destroy']);

    // 7. Modul CMS Administrator (Master Data, Metrik & Moderasi - Wajib Role Admin)
    Route::prefix('admin')->middleware('role.admin')->group(function () {
        Route::get('/dashboard-data', [\App\Http\Controllers\Api\AdminController::class, 'dashboardData']);
        Route::get('/stats', [\App\Http\Controllers\Api\AdminController::class, 'stats']);
        Route::get('/users', [\App\Http\Controllers\Api\AdminController::class, 'users']);
        Route::get('/performances', [\App\Http\Controllers\Api\AdminController::class, 'allPerformances']);
        Route::patch('/performances/{id}/visibility', [\App\Http\Controllers\Api\AdminController::class, 'updatePerformanceVisibility']);
        Route::delete('/performances/{id}', [\App\Http\Controllers\Api\AdminController::class, 'destroyPerformance']);

        // Master Karakter Wayang CRUD
        Route::post('/characters', [CharacterController::class, 'store']);
        Route::patch('/characters/{id}', [CharacterController::class, 'update']);
        Route::put('/characters/{id}', [CharacterController::class, 'update']);
        Route::delete('/characters/{id}', [CharacterController::class, 'destroy']);

        // Master Lakon Cerita CRUD
        Route::post('/stories', [StoryController::class, 'store']);
        Route::patch('/stories/{id}', [StoryController::class, 'update']);
        Route::put('/stories/{id}', [StoryController::class, 'update']);
        Route::delete('/stories/{id}', [StoryController::class, 'destroy']);

        // Master Tata Suara Audio CRUD
        Route::post('/audio-assets', [AudioAssetController::class, 'store']);
        Route::patch('/audio-assets/{id}', [AudioAssetController::class, 'update']);
        Route::put('/audio-assets/{id}', [AudioAssetController::class, 'update']);
        Route::delete('/audio-assets/{id}', [AudioAssetController::class, 'destroy']);
    });
});
