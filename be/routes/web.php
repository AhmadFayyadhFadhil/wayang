<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => config('app.name', 'Wayang Digital API'),
        'version' => '1.0.0',
        'status' => 'operational',
        'status_url' => url('/api/status'),
    ]);
});
