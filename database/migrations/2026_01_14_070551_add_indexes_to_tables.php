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
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                $table->index('role');
            });
        }

        if (Schema::hasTable('siswas')) {
            Schema::table('siswas', function (Blueprint $table) {
                $table->index('user_id');
                $table->index('kelas_id');
            });
        }

        if (Schema::hasTable('magangs_siswa')) {
            Schema::table('magangs_siswa', function (Blueprint $table) {
                $table->index('siswa_id');
                $table->index('dudi_id');
                $table->index('status');
            });
        }

        if (Schema::hasTable('logbooks')) {
            Schema::table('logbooks', function (Blueprint $table) {
                $table->index('siswa_id');
                $table->index('status');
                $table->index('tanggal');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropIndex(['role']);
            });
        }

        if (Schema::hasTable('siswas')) {
            Schema::table('siswas', function (Blueprint $table) {
                $table->dropIndex(['user_id']);
                $table->dropIndex(['kelas_id']);
            });
        }

        if (Schema::hasTable('magangs_siswa')) {
            Schema::table('magangs_siswa', function (Blueprint $table) {
                $table->dropIndex(['siswa_id']);
                $table->dropIndex(['dudi_id']);
                $table->dropIndex(['status']);
            });
        }

        if (Schema::hasTable('logbooks')) {
            Schema::table('logbooks', function (Blueprint $table) {
                $table->dropIndex(['siswa_id']);
                $table->dropIndex(['status']);
                $table->dropIndex(['tanggal']);
            });
        }
    }
};
