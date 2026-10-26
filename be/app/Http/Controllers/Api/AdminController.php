<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AudioAsset;
use App\Models\Character;
use App\Models\Performance;
use App\Models\Story;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Pastikan pengguna memiliki peran administrator.
     */
    private function authorizeAdmin(Request $request): void
    {
        $user = $request->user();

        if (!$user || !$user->isAdmin()) {
            abort(403, 'Akses ditolak. Fitur ini hanya dapat diakses oleh Administrator.');
        }
    }

    /**
     * Mengambil seluruh data CMS dalam satu payload terpadu (Atomic & Cepat).
     */
    public function dashboardData(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        return response()->json([
            'status' => 'success',
            'data' => [
                'counts' => [
                    'characters' => Character::count(),
                    'stories' => Story::count(),
                    'audio_assets' => AudioAsset::count(),
                    'performances' => Performance::count(),
                    'public_performances' => Performance::where('visibility', 'public')->count(),
                    'private_performances' => Performance::where('visibility', 'private')->count(),
                    'users' => User::count(),
                ],
                'characters' => Character::orderBy('id', 'asc')->get(),
                'stories' => Story::with('sources')->orderBy('id', 'asc')->get(),
                'audio_assets' => AudioAsset::orderBy('id', 'asc')->get(),
                'performances' => Performance::with(['user:id,name,email', 'story:id,title'])->latest()->get(),
                'users' => User::select('id', 'name', 'email', 'created_at')->orderBy('id', 'asc')->get(),
            ],
        ]);
    }

    /**
     * Mengambil ringkasan statistik platform untuk Dashboard CMS.
     */
    public function stats(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        return response()->json([
            'status' => 'success',
            'data' => [
                'counts' => [
                    'characters' => Character::count(),
                    'stories' => Story::count(),
                    'audio_assets' => AudioAsset::count(),
                    'performances' => Performance::count(),
                    'public_performances' => Performance::where('visibility', 'public')->count(),
                    'private_performances' => Performance::where('visibility', 'private')->count(),
                    'users' => User::count(),
                ],
                'recent_performances' => Performance::with(['user:id,name,email', 'story:id,title'])
                    ->latest()
                    ->take(5)
                    ->get(),
            ],
        ]);
    }

    /**
     * Mengambil seluruh daftar pengguna terdaftar.
     */
    public function users(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $users = User::withCount('performances')->latest()->get()->map(function ($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => ($u->email === 'demo@wayangdigital.id' || str_contains($u->email, 'admin')) ? 'admin' : 'user',
                'performances_count' => $u->performances_count,
                'created_at' => $u->created_at,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $users,
        ]);
    }

    /**
     * Mengambil seluruh karya pertunjukan lintas pengguna untuk moderasi konten.
     */
    public function allPerformances(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $performances = Performance::with([
            'user:id,name,email',
            'story:id,title',
            'characters',
            'audioAssets',
        ])->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $performances,
        ]);
    }

    /**
     * Mengubah visibilitas karya (Moderasi Konten).
     */
    public function updatePerformanceVisibility(Request $request, int $id): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'visibility' => 'required|in:public,private',
        ]);

        $perf = Performance::findOrFail($id);
        $perf->update(['visibility' => $validated['visibility']]);

        return response()->json([
            'status' => 'success',
            'message' => 'Status visibilitas karya berhasil diperbarui.',
            'data' => $perf,
        ]);
    }

    /**
     * Menghapus karya pertunjukan oleh admin (Moderasi Konten).
     */
    public function destroyPerformance(Request $request, int $id): JsonResponse
    {
        $this->authorizeAdmin($request);

        $perf = Performance::findOrFail($id);
        $perf->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Karya pertunjukan berhasil dihapus oleh admin.',
        ]);
    }
}
