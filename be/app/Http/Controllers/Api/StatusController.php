<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class StatusController extends Controller
{
    /**
     * Check API and Database connection health status.
     */
    public function index(): JsonResponse
    {
        $dbConnected = false;
        $dbName = null;
        $dbError = null;

        try {
            DB::connection()->getPdo();
            $dbConnected = true;
            $dbName = DB::connection()->getDatabaseName();
        } catch (\Throwable $e) {
            $dbError = $e->getMessage();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Wayang Digital API is running smoothly',
            'project' => [
                'name' => config('app.name', 'Wayang Digital'),
                'theme' => 'Digitalisasi Wayang: Sosial & Kesenian',
                'framework' => 'Laravel ' . app()->version(),
            ],
            'database' => [
                'connected' => $dbConnected,
                'name' => $dbName,
                'driver' => config('database.default'),
                'error' => $dbError,
            ],
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
