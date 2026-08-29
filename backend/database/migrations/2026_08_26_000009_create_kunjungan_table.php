<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kunjungan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guru_id')->constrained('guru')->onDelete('restrict');
            $table->foreignId('tempat_magang_id')->constrained('tempat_magang')->onDelete('restrict');
            $table->date('tanggal_kunjungan');
            $table->text('catatan_evaluasi')->nullable();
            $table->string('foto_dokumentasi')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kunjungan');
    }
};
