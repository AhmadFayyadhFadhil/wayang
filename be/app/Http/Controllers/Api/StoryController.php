<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Story;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StoryController extends Controller
{
    /**
     * Display a listing of published stories.
     */
    public function index(Request $request): JsonResponse
    {
        $stories = Story::where('status', 'published')
            ->with(['characters', 'sources'])
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $stories,
        ]);
    }

    /**
     * Display the specified story by ID or slug.
     */
    public function show(string $idOrSlug): JsonResponse
    {
        $story = Story::where('slug', $idOrSlug)
            ->orWhere('id', is_numeric($idOrSlug) ? (int) $idOrSlug : 0)
            ->with(['characters', 'sources'])
            ->first();

        if (!$story) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lakon cerita tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $story,
        ]);
    }
}
