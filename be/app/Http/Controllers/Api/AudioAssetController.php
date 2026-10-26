<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AudioAsset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AudioAssetController extends Controller
{
    /**
     * Pastikan pengguna memiliki peran administrator untuk aksi manipulasi data.
     */
    private function authorizeAdmin(Request $request): void
    {
        $user = $request->user();

        if (!$user || !$user->isAdmin()) {
            abort(403, 'Akses ditolak. Tindakan ini hanya diperbolehkan untuk Administrator.');
        }
    }

    /**
     * Display a listing of active audio assets (bgm, sfx, suluk).
     */
    public function index(Request $request): JsonResponse
    {
        $query = AudioAsset::query();

        if (!$request->boolean('all')) {
            $query->where('status', 'active');
        }

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

    /**
     * Menyimpan aset audio baru (CMS Admin).
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|in:bgm,sfx,suluk',
            'instrument' => 'required|string|max:255',
            'tempo' => 'nullable|string|max:100',
            'mood' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'synth_type' => 'nullable|string|max:50',
            'duration' => 'nullable|integer',
            'source_note' => 'nullable|string|max:255',
            'license_note' => 'nullable|string|max:255',
            'status' => 'nullable|in:active,inactive',
        ]);

        $audio = AudioAsset::create([
            'title' => $validated['title'],
            'category' => $validated['category'],
            'instrument' => $validated['instrument'],
            'tempo' => $validated['tempo'] ?? 'Sedang',
            'mood' => $validated['mood'] ?? 'Atmosferik',
            'description' => $validated['description'] ?? 'Tata suara pedalangan warisan budaya.',
            'synth_type' => $validated['synth_type'] ?? 'srepeg',
            'duration' => $validated['duration'] ?? 120,
            'source_note' => $validated['source_note'] ?? 'Kurasi Sanggar Tradisi',
            'license_note' => $validated['license_note'] ?? 'Domain Publik Budaya',
            'status' => $validated['status'] ?? 'active',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Aset audio berhasil ditambahkan.',
            'data' => $audio,
        ], 201);
    }

    /**
     * Memperbarui aset audio (CMS Admin).
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $this->authorizeAdmin($request);

        $audio = AudioAsset::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|in:bgm,sfx,suluk',
            'instrument' => 'sometimes|required|string|max:255',
            'tempo' => 'nullable|string|max:100',
            'mood' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'synth_type' => 'nullable|string|max:50',
            'duration' => 'nullable|integer',
            'source_note' => 'nullable|string|max:255',
            'license_note' => 'nullable|string|max:255',
            'status' => 'sometimes|required|in:active,inactive',
        ]);

        $audio->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Aset audio berhasil diperbarui.',
            'data' => $audio,
        ]);
    }

    /**
     * Menghapus aset audio (CMS Admin).
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->authorizeAdmin($request);

        $audio = AudioAsset::findOrFail($id);
        $audio->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Aset audio berhasil dihapus.',
        ]);
    }
}
