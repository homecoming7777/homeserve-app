<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();
            $table->foreignId('client_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('provider_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('service_id')->constrained('services')->cascadeOnDelete();
            $table->unsignedTinyInteger('rating'); // 1..5
            $table->text('description')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->unique('booking_id');
            $table->index(['provider_id', 'service_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};

