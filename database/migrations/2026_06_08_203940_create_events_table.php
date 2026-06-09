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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('date')->nullable();
            $table->string('time')->nullable();
            $table->string('location')->nullable();
            $table->string('category')->nullable();
            $table->integer('max_attendees')->default(0);
            $table->string('cover_image_uri')->nullable();
            $table->foreignId('community_id')->nullable()->constrained('communities')->nullOnDelete();
            $table->integer('attendee_count')->default(0);
            $table->json('gallery_images')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
