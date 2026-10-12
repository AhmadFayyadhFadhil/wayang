<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AudioAsset;
use App\Models\Character;
use App\Models\Performance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PerformanceController extends Controller
{
    /**
     * Display a listing of performances created by the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $performances = Performance::where('user_id', $request->user()->id)
            ->with(['characters', 'audioAssets', 'story'])
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $performances,
        ]);
    }

    /**
     * Store a newly created performance in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'story_id' => 'nullable|exists:stories,id',
            'visibility' => 'required|in:public,private',
            'author' => 'nullable|string|max:255',
            'schema_version' => 'nullable|integer',
            'scene_data' => 'required',
        ]);

        $sceneData = is_string($validated['scene_data'])
            ? json_decode($validated['scene_data'], true)
            : $validated['scene_data'];

        if (!is_array($sceneData)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Format scene_data harus berupa JSON object atau array valid.',
            ], 422);
        }

        return DB::transaction(function () use ($validated, $sceneData, $request) {
            $performance = Performance::create([
                'user_id' => $request->user()->id,
                'story_id' => $validated['story_id'] ?? null,
                'title' => trim($validated['title']),
                'description' => $validated['description'] ?? null,
                'visibility' => $validated['visibility'],
                'author' => $validated['author'] ?? $request->user()->name,
                'scene_data' => $sceneData,
                'schema_version' => $validated['schema_version'] ?? ($sceneData['schemaVersion'] ?? 1),
            ]);

            $this->syncPivotsFromSceneData($performance, $sceneData);

            $performance->load(['characters', 'audioAssets', 'story']);

            return response()->json([
                'status' => 'success',
                'message' => 'Pertunjukan berhasil disimpan',
                'id' => $performance->id,
                'data' => $performance,
            ], 201);
        });
    }

    /**
     * Display the specified performance.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $performance = Performance::with(['characters', 'audioAssets', 'story', 'user:id,name'])
            ->find($id);

        if (!$performance) {
            return response()->json([
                'status' => 'error',
                'message' => 'Karya pertunjukan tidak ditemukan.',
            ], 404);
        }

        // Jika karya privat, pastikan hanya pemilik yang dapat mengakses
        $currentUserId = $request->user('sanctum')?->id;
        if ($performance->visibility === 'private' && $performance->user_id !== $currentUserId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Karya ini bersifat privat.',
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $performance,
        ]);
    }

    /**
     * Update the specified performance in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $performance = Performance::find($id);

        if (!$performance) {
            return response()->json([
                'status' => 'error',
                'message' => 'Karya pertunjukan tidak ditemukan.',
            ], 404);
        }

        if ($performance->user_id !== $request->user()->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Anda bukan pemilik karya ini.',
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'story_id' => 'nullable|exists:stories,id',
            'visibility' => 'sometimes|required|in:public,private',
            'author' => 'nullable|string|max:255',
            'schema_version' => 'nullable|integer',
            'scene_data' => 'sometimes|required',
        ]);

        return DB::transaction(function () use ($performance, $validated) {
            $updateData = [];

            if (isset($validated['title'])) {
                $updateData['title'] = trim($validated['title']);
            }
            if (array_key_exists('description', $validated)) {
                $updateData['description'] = $validated['description'];
            }
            if (array_key_exists('story_id', $validated)) {
                $updateData['story_id'] = $validated['story_id'];
            }
            if (isset($validated['visibility'])) {
                $updateData['visibility'] = $validated['visibility'];
            }
            if (isset($validated['author'])) {
                $updateData['author'] = $validated['author'];
            }
            if (isset($validated['schema_version'])) {
                $updateData['schema_version'] = $validated['schema_version'];
            }

            if (isset($validated['scene_data'])) {
                $sceneData = is_string($validated['scene_data'])
                    ? json_decode($validated['scene_data'], true)
                    : $validated['scene_data'];

                if (is_array($sceneData)) {
                    $updateData['scene_data'] = $sceneData;
                    if (isset($sceneData['schemaVersion'])) {
                        $updateData['schema_version'] = $sceneData['schemaVersion'];
                    }
                    $this->syncPivotsFromSceneData($performance, $sceneData);
                }
            }

            $performance->update($updateData);
            $performance->load(['characters', 'audioAssets', 'story']);

            return response()->json([
                'status' => 'success',
                'message' => 'Karya pertunjukan berhasil diperbarui',
                'id' => $performance->id,
                'data' => $performance,
            ]);
        });
    }

    /**
     * Remove the specified performance from storage.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $performance = Performance::find($id);

        if (!$performance) {
            return response()->json([
                'status' => 'error',
                'message' => 'Karya pertunjukan tidak ditemukan.',
            ], 404);
        }

        if ($performance->user_id !== $request->user()->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Anda bukan pemilik karya ini.',
            ], 403);
        }

        $performance->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Karya pertunjukan berhasil dihapus.',
        ]);
    }

    /**
     * Helper to extract character & audio IDs from scene_data and sync pivots.
     */
    private function syncPivotsFromSceneData(Performance $performance, array $sceneData): void
    {
        $scenes = $sceneData['scenes'] ?? [];

        // 1. Ekstraksi ID karakter
        $rawCharIds = collect($scenes)
            ->flatMap(function ($scene) {
                return collect($scene['characters'] ?? [])->pluck('characterId');
            })
            ->filter()
            ->unique()
            ->values()
            ->all();

        if (!empty($rawCharIds)) {
            $validCharIds = Character::whereIn('id', $rawCharIds)->pluck('id')->all();
            $performance->characters()->sync($validCharIds);
        } else {
            $performance->characters()->sync([]);
        }

        // 2. Ekstraksi ID audio aset
        $rawAudioIds = collect($scenes)
            ->flatMap(function ($scene) {
                return collect($scene['audioAssetIds'] ?? []);
            })
            ->filter()
            ->unique()
            ->values()
            ->all();

        if (!empty($rawAudioIds)) {
            $validAudioIds = AudioAsset::whereIn('id', $rawAudioIds)->pluck('id')->all();
            $performance->audioAssets()->sync($validAudioIds);
        } else {
            $performance->audioAssets()->sync([]);
        }
    }
}
