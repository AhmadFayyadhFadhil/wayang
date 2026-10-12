<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Source extends Model
{
    use HasFactory;

    protected $fillable = [
        'story_id',
        'title',
        'author_or_publisher',
        'url_or_reference',
        'rights_note',
    ];

    public function story(): BelongsTo
    {
        return $this->belongsTo(Story::class);
    }
}
