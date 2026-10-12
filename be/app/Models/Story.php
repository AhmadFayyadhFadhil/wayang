<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Story extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'synopsis',
        'philosophy',
        'tradition',
        'version_label',
        'cover_image',
        'recommended_background',
        'theme_song',
        'status',
    ];

    public function characters(): BelongsToMany
    {
        return $this->belongsToMany(Character::class, 'story_character')
            ->withPivot('role_note');
    }

    public function sources(): HasMany
    {
        return $this->hasMany(Source::class);
    }

    public function performances(): HasMany
    {
        return $this->hasMany(Performance::class);
    }
}
