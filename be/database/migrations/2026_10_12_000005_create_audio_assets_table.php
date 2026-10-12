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
        Schema::create('audio_assets', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('category', ['bgm', 'sfx', 'suluk'])->default('bgm');
            $table->string('instrument');
            $table->string('tempo')->nullable();
            $table->string('mood')->nullable();
            $table->text('description')->nullable();
            $table->string('file_path')->nullable();
            $table->string('synth_type')->nullable();
            $table->integer('duration')->default(0); // in seconds
            $table->string('source_note')->nullable();
            $table->string('license_note')->default('CC-BY 4.0 Creative Commons');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audio_assets');
    }
};
