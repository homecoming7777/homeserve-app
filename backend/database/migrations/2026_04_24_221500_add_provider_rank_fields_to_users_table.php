<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'provider_points')) {
                $table->unsignedInteger('provider_points')->default(0)->after('wallet_balance');
            }
            if (! Schema::hasColumn('users', 'provider_rank')) {
                $table->string('provider_rank')->default('Newcomer')->after('provider_points');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'provider_rank')) {
                $table->dropColumn('provider_rank');
            }
            if (Schema::hasColumn('users', 'provider_points')) {
                $table->dropColumn('provider_points');
            }
        });
    }
};
