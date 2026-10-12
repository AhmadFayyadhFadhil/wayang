<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Character extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'alias',
        'type',
        'type_name',
        'weapons',
        'description',
        'philosophy',
        'tradition',
        'image_path',
        'accent_color',
        'silhouette_svg',
        'default_scale',
        'available_poses',
        'status',
    ];

    protected $casts = [
        'available_poses' => 'array',
        'default_scale' => 'float',
    ];

    public function stories(): BelongsToMany
    {
        return $this->belongsToMany(Story::class, 'story_character')
            ->withPivot('role_note');
    }

    public function performances(): BelongsToMany
    {
        return $this->belongsToMany(Performance::class, 'performance_character');
    }
}
