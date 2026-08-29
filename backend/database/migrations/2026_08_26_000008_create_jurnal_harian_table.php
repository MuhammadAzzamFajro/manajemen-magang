<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jurnal_harian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->date('tanggal');
            $table->text('uraian_kegiatan');
            $table->text('kendala')->nullable();
            $table->text('solusi')->nullable();
            $table->string('foto_bukti')->nullable();
            $table->enum('status_verifikasi', ['menunggu','disetujui','perlu_revisi'])->default('menunggu');
            $table->text('catatan_guru')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jurnal_harian');
    }
};
