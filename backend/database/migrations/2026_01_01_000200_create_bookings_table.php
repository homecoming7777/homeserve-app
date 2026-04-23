<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('service_id')->constrained('services')->cascadeOnDelete();
            $table->foreignId('provider_id')->constrained('users')->cascadeOnDelete();
            $table->dateTime('booking_date');
            $table->string('address');
            $table->enum('status', ['pending', 'accepted', 'rejected', 'in_progress', 'completed'])->default('pending');
            $table->enum('payment_method', ['cash', 'wallet', 'card'])->nullable();
            $table->enum('payment_status', ['pending', 'paid'])->default('pending');
            $table->string('payment_id')->nullable();
            $table->dateTime('paid_at')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
