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
        Schema::table('attendances', function (Blueprint $table) {
            // Add indexes for better query performance
            $table->index(['siswa_id', 'tanggal'], 'attendances_siswa_date_index');
            $table->index(['tanggal'], 'attendances_date_index');
            $table->index(['status'], 'attendances_status_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            // Drop indexes when rolling back
            $table->dropIndex('attendances_siswa_date_index');
            $table->dropIndex('attendances_date_index');
            $table->dropIndex('attendances_status_index');
        });
    }
};
