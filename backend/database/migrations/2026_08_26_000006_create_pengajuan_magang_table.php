<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengajuan_magang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->foreignId('tempat_magang_id')->constrained('tempat_magang')->onDelete('cascade');
            $table->string('posisi_diminati');
            $table->date('tanggal_mulai_usulan');
            $table->date('tanggal_selesai_usulan');
            $table->enum('status', ['menunggu','disetujui','ditolak'])->default('menunggu');
            $table->text('catatan_penolakan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengajuan_magang');
    }
};
