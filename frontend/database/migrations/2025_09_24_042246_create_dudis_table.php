<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dudis', function (Blueprint $table) {
            $table->id();
            $table->string('nama'); // Nama perusahaan
            $table->string('alamat')->nullable();
            $table->string('email')->nullable();
            $table->string('telepon')->nullable();
            $table->string('penanggung_jawab')->nullable(); // Nama pembimbing dari DUDI
            $table->string('jabatan')->nullable(); // Jabatan penanggung jawab
            $table->string('bidang_usaha')->nullable(); // Bidang industri
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dudis');
}
};
