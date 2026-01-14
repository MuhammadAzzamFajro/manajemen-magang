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
        Schema::create('pelanggarans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->references('id')->on('siswas')->onDelete('cascade');
            $table->foreignId('dilaporkan_oleh_id')->references('id')->on('siswas')->onDelete('cascade');
            $table->string('jenis_pelanggaran');
            $table->string('tingkat');
            $table->string('poin');
            $table->date('tanggal');
            $table->time('waktu');
            $table->string('lokasi');
            $table->string('deskripsi')->nullable();
            $table->string('status')->default('aktif');
            $table->string('tindakan')->nullable();
            $table->string('tanggal_tindak_lanjut')->nullable();
            $table->string('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pelanggarans');
    }
};
