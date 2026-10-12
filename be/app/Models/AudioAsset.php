<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class AudioAsset extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'instrument',
        'tempo',
        'mood',
        'description',
        'file_path',
        'synth_type',
        'duration',
        'source_note',
        'license_note',
        'status',
    ];

    public function performances(): BelongsToMany
    {
        return $this->belongsToMany(Performance::class, 'performance_audio');
    }
}
