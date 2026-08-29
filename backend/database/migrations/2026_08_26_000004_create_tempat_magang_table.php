<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tempat_magang', function (Blueprint $table) {
            $table->id();
            $table->string('nama_perusahaan');
            $table->string('bidang_usaha');
            $table->string('nama_pic');
            $table->string('kontak_pic');
            $table->unsignedInteger('kuota')->default(1);
            $table->text('alamat');
            $table->enum('status_verifikasi', ['terverifikasi', 'belum_diverifikasi'])->default('belum_diverifikasi');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tempat_magang');
    }
};
