<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Performance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'story_id',
        'title',
        'description',
        'visibility',
        'author',
        'scene_data',
        'schema_version',
    ];

    protected $casts = [
        'scene_data' => 'array',
        'schema_version' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function story(): BelongsTo
    {
        return $this->belongsTo(Story::class);
    }

    public function characters(): BelongsToMany
    {
        return $this->belongsToMany(Character::class, 'performance_character');
    }

    public function audioAssets(): BelongsToMany
    {
        return $this->belongsToMany(AudioAsset::class, 'performance_audio');
    }
}
