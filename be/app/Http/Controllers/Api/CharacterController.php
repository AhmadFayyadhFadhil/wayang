<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Character;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CharacterController extends Controller
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
     * Display a listing of characters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Character::query();

        // Jika bukan admin atau tanpa parameter all, hanya tampilkan published
        if (!$request->boolean('all')) {
            $query->where('status', 'published');
        }

        $characters = $query->orderBy('id', 'asc')->get();

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

    /**
     * Menyimpan tokoh karakter baru (CMS Admin).
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:characters,slug',
            'alias' => 'nullable|string|max:255',
            'type' => 'required|in:ksatria,raksasa,punakawan,dewa,wanita,lainnya',
            'type_name' => 'nullable|string|max:255',
            'weapons' => 'nullable|string|max:255',
            'description' => 'required|string',
            'philosophy' => 'required|string',
            'tradition' => 'nullable|string|max:255',
            'accent_color' => 'nullable|string|max:20',
            'silhouette_svg' => 'nullable|string|max:50',
            'default_scale' => 'nullable|numeric|between:0.5,2.0',
            'available_poses' => 'nullable|array',
            'status' => 'nullable|in:draft,published,archived',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }
        if (empty($validated['available_poses'])) {
            $validated['available_poses'] = ['default', 'sembah', 'perang'];
        }
        if (empty($validated['silhouette_svg'])) {
            $validated['silhouette_svg'] = $validated['slug'];
        }

        $character = Character::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Tokoh wayang berhasil ditambahkan ke katalog budaya.',
            'data' => $character,
        ], 201);
    }

    /**
     * Memperbarui tokoh karakter (CMS Admin).
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $this->authorizeAdmin($request);

        $character = Character::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:characters,slug,' . $id,
            'alias' => 'nullable|string|max:255',
            'type' => 'sometimes|required|in:ksatria,raksasa,punakawan,dewa,wanita,lainnya',
            'type_name' => 'nullable|string|max:255',
            'weapons' => 'nullable|string|max:255',
            'description' => 'sometimes|required|string',
            'philosophy' => 'sometimes|required|string',
            'tradition' => 'nullable|string|max:255',
            'accent_color' => 'nullable|string|max:20',
            'silhouette_svg' => 'nullable|string|max:50',
            'default_scale' => 'nullable|numeric|between:0.5,2.0',
            'available_poses' => 'nullable|array',
            'status' => 'sometimes|required|in:draft,published,archived',
        ]);

        $character->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Data tokoh wayang berhasil diperbarui.',
            'data' => $character,
        ]);
    }

    /**
     * Menghapus tokoh karakter (CMS Admin).
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->authorizeAdmin($request);

        $character = Character::findOrFail($id);
        $character->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Tokoh wayang berhasil dihapus.',
        ]);
    }
}
