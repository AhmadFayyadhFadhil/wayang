<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('performance_character', function (Blueprint $table) {
            $table->id();
            $table->foreignId('performance_id')->constrained('performances')->cascadeOnDelete();
            $table->foreignId('character_id')->constrained('characters')->cascadeOnDelete();
            $table->unique(['performance_id', 'character_id']);
        });

        Schema::create('performance_audio', function (Blueprint $table) {
            $table->id();
            $table->foreignId('performance_id')->constrained('performances')->cascadeOnDelete();
            $table->foreignId('audio_asset_id')->constrained('audio_assets')->cascadeOnDelete();
            $table->unique(['performance_id', 'audio_asset_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('performance_audio');
        Schema::dropIfExists('performance_character');
    }
};
