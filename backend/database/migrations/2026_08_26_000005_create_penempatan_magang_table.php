<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('penempatan_magang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->foreignId('tempat_magang_id')->constrained('tempat_magang')->onDelete('restrict');
            $table->foreignId('guru_id')->constrained('guru')->onDelete('restrict');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->unsignedTinyInteger('nilai_akhir')->nullable()->comment('Skala 0-100');
            $table->enum('status_pengesahan', ['belum_disahkan','disahkan','lulus_magang'])->default('belum_disahkan');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penempatan_magang');
    }
};
