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
        Schema::create('performances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('story_id')->nullable()->constrained('stories')->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('visibility', ['public', 'private'])->default('public');
            $table->string('author')->default('Dalang Kreator Muda');
            $table->json('scene_data'); // Menyimpan array adegan, karakter, koordinat, dialog
            $table->unsignedInteger('schema_version')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('performances');
    }
};
