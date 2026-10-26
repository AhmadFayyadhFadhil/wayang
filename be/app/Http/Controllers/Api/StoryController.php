<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Source;
use App\Models\Story;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StoryController extends Controller
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
     * Display a listing of stories.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Story::with(['characters', 'sources']);

        if (!$request->boolean('all')) {
            $query->where('status', 'published');
        }

        $stories = $query->orderBy('id', 'asc')->get();

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

    /**
     * Menyimpan lakon wiracarita baru (CMS Admin).
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:stories,slug',
            'synopsis' => 'required|string',
            'philosophy' => 'required|string',
            'tradition' => 'nullable|string|max:255',
            'version_label' => 'nullable|string|max:255',
            'recommended_background' => 'nullable|string|max:255',
            'theme_song' => 'nullable|string|max:255',
            'status' => 'nullable|in:draft,published,archived',
            'character_ids' => 'nullable|array',
            'sources' => 'nullable|array',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        return DB::transaction(function () use ($validated) {
            $story = Story::create([
                'title' => $validated['title'],
                'slug' => $validated['slug'],
                'synopsis' => $validated['synopsis'],
                'philosophy' => $validated['philosophy'],
                'tradition' => $validated['tradition'] ?? 'Gaya Surakarta & Yogyakarta',
                'version_label' => $validated['version_label'] ?? 'Pakem Gagrag Mataram',
                'recommended_background' => $validated['recommended_background'] ?? 'kelir-naskah-prada-kencana',
                'theme_song' => $validated['theme_song'] ?? 'Gamelan Srepeg Mataram',
                'status' => $validated['status'] ?? 'published',
            ]);

            if (!empty($validated['character_ids'])) {
                $story->characters()->sync($validated['character_ids']);
            }

            if (!empty($validated['sources'])) {
                foreach ($validated['sources'] as $src) {
                    if (!empty($src['title'])) {
                        Source::create([
                            'story_id' => $story->id,
                            'title' => $src['title'],
                            'author_or_publisher' => $src['author_or_publisher'] ?? 'Domain Publik Budaya',
                            'url_or_reference' => $src['url_or_reference'] ?? null,
                            'rights_note' => $src['rights_note'] ?? 'Domain Publik / Kurasi Budaya',
                        ]);
                    }
                }
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Lakon wiracarita berhasil ditambahkan ke atlas budaya.',
                'data' => $story->load(['characters', 'sources']),
            ], 201);
        });
    }

    /**
     * Memperbarui lakon wiracarita (CMS Admin).
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $this->authorizeAdmin($request);

        $story = Story::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:stories,slug,' . $id,
            'synopsis' => 'sometimes|required|string',
            'philosophy' => 'sometimes|required|string',
            'tradition' => 'nullable|string|max:255',
            'version_label' => 'nullable|string|max:255',
            'recommended_background' => 'nullable|string|max:255',
            'theme_song' => 'nullable|string|max:255',
            'status' => 'sometimes|required|in:draft,published,archived',
            'character_ids' => 'nullable|array',
        ]);

        return DB::transaction(function () use ($story, $validated) {
            $story->update($validated);

            if (isset($validated['character_ids'])) {
                $story->characters()->sync($validated['character_ids']);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Lakon wiracarita berhasil diperbarui.',
                'data' => $story->load(['characters', 'sources']),
            ]);
        });
    }

    /**
     * Menghapus lakon wiracarita (CMS Admin).
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->authorizeAdmin($request);

        $story = Story::findOrFail($id);
        $story->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Lakon wiracarita berhasil dihapus.',
        ]);
    }
}
