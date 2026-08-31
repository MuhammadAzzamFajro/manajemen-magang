<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('guru', function (Blueprint $table) {
            $table->foreignId('jurusan_id')->nullable()->after('nama_lengkap')->constrained('jurusan')->nullOnDelete();
        });

        Schema::table('siswa', function (Blueprint $table) {
            $table->foreignId('kelas_id')->nullable()->after('nama_lengkap')->constrained('kelas')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('guru', function (Blueprint $table) {
            $table->dropConstrainedForeignId('jurusan_id');
        });

        Schema::table('siswa', function (Blueprint $table) {
            $table->dropConstrainedForeignId('kelas_id');
        });
    }
};
