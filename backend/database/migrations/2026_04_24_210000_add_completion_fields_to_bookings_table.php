<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->timestamp('provider_completed_at')->nullable()->after('status');
            $table->timestamp('client_approved_at')->nullable()->after('provider_completed_at');

            $table->index(['provider_completed_at', 'client_approved_at']);
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex(['provider_completed_at', 'client_approved_at']);
            $table->dropColumn(['provider_completed_at', 'client_approved_at']);
        });
    }
};

