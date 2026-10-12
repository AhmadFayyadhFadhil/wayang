<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Character;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CharacterController extends Controller
{
    /**
     * Display a listing of published characters.
     */
    public function index(Request $request): JsonResponse
    {
        $characters = Character::where('status', 'published')
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $characters,
        ]);
    }

    /**
     * Display the specified character by ID or slug.
     */
    public function show(string $idOrSlug): JsonResponse
    {
        $character = Character::where('slug', $idOrSlug)
            ->orWhere('id', is_numeric($idOrSlug) ? (int) $idOrSlug : 0)
            ->with('stories')
            ->first();

        if (!$character) {
            return response()->json([
                'status' => 'error',
                'message' => 'Karakter wayang tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $character,
        ]);
    }
}
