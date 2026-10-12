<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Performance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicArchiveController extends Controller
{
    /**
     * Display a listing of public performances for Connected Archive gallery.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Performance::where('visibility', 'public')
            ->with([
                'characters',
                'audioAssets',
                'story',
                'user:id,name',
            ]);

        if ($request->filled('story_id')) {
            $query->where('story_id', $request->query('story_id'));
        }

        if ($request->filled('search')) {
            $search = '%' . $request->query('search') . '%';
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', $search)
                  ->orWhere('description', 'like', $search)
                  ->orWhere('author', 'like', $search);
            });
        }

        $performances = $query->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $performances,
        ]);
    }

    /**
     * Display the specified public performance.
     */
    public function show(int $id): JsonResponse
    {
        $performance = Performance::where('id', $id)
            ->where('visibility', 'public')
            ->with([
                'characters',
                'audioAssets',
                'story',
                'user:id,name',
            ])
            ->first();

        if (!$performance) {
            return response()->json([
                'status' => 'error',
                'message' => 'Karya publik tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $performance,
        ]);
    }
}
