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
        Schema::create('sources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('story_id')->nullable()->constrained('stories')->cascadeOnDelete();
            $table->string('title');
            $table->string('author_or_publisher');
            $table->string('url_or_reference', 500)->nullable();
            $table->string('rights_note')->default('Domain Publik / Kurasi Budaya');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sources');
    }
};
