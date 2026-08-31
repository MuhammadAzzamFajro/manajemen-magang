<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('siswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('nis')->unique();
            $table->string('nama_lengkap');
            $table->string('kelas')->nullable();
            $table->string('email_kontak')->nullable();
            $table->enum('status_magang', ['belum_magang','pengajuan','sedang_magang','lulus'])->default('belum_magang');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('siswa');
    }
};
