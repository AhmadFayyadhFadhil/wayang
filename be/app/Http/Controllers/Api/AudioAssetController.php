<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AudioAsset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AudioAssetController extends Controller
{
    /**
     * Display a listing of active audio assets (bgm, sfx, suluk).
     */
    public function index(Request $request): JsonResponse
    {
        $query = AudioAsset::where('status', 'active');

        if ($request->filled('category')) {
            $query->where('category', $request->query('category'));
        }

        $assets = $query->orderBy('id', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $assets,
        ]);
    }

    /**
     * Display the specified audio asset.
     */
    public function show(int $id): JsonResponse
    {
        $asset = AudioAsset::find($id);

        if (!$asset) {
            return response()->json([
                'status' => 'error',
                'message' => 'Aset audio tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $asset,
        ]);
    }
}
