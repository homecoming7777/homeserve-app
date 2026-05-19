<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('service_id')->constrained('services')->cascadeOnDelete();
            $table->dateTime('booking_date');
            $table->string('address');
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->enum('payment_method', ['cash', 'card', 'wallet']);
            $table->enum('payment_status', ['pending', 'paid'])->default('pending');
            $table->string('payment_id')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['client_id', 'status']);
            $table->index(['service_id', 'status']);
            $table->index(['payment_status', 'payment_method']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};

