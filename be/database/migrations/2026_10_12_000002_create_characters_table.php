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
        Schema::create('characters', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('alias')->nullable();
            $table->enum('type', ['ksatria', 'raksasa', 'punakawan', 'dewa', 'wanita', 'lainnya'])->default('ksatria');
            $table->string('type_name')->nullable();
            $table->string('weapons')->nullable();
            $table->text('description');
            $table->text('philosophy');
            $table->string('tradition')->default('Gaya Surakarta & Yogyakarta');
            $table->string('image_path')->nullable();
            $table->string('accent_color')->default('#f59e0b');
            $table->string('silhouette_svg')->nullable();
            $table->decimal('default_scale', 3, 2)->default(1.00);
            $table->json('available_poses');
            $table->enum('status', ['draft', 'published', 'archived'])->default('published');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('characters');
    }
};
