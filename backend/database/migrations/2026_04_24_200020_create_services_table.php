<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('categories');
            $table->foreignId('area_id')->constrained('areas');
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->boolean('is_available')->default(true);
            $table->timestamp('created_at')->useCurrent();

            $table->index(['provider_id', 'is_available']);
            $table->index(['area_id', 'category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};

