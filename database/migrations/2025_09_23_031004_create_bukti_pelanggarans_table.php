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
        Schema::create('bukti_pelanggarans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pelanggaran_id')->references('id')->on('pelanggarans')->onDelete('cascade');
            $table->string('tipe');
            $table->string('url');
            $table->string('nama');
            $table->string('deskripsi')->nullable();
            $table->foreignId('diunggah_oleh_id')->references('id')->on('siswas')->onDelete('cascade');
            $table->time('waktu_unggah');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bukti_pelanggarans');
    }
};
