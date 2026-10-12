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
        Schema::create('stories', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->text('synopsis');
            $table->text('philosophy');
            $table->string('tradition')->default('Gaya Surakarta & Yogyakarta (Gagrag Mataram)');
            $table->string('version_label')->default('Pakem Gagrag Mataram');
            $table->string('cover_image')->nullable();
            $table->string('recommended_background')->nullable();
            $table->string('theme_song')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('published');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stories');
    }
};
