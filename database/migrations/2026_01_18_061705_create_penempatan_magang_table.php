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
        Schema::create('penempatan_magang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswas')->onDelete('cascade');
            $table->string('perusahaan', 200);
            $table->string('posisi', 100)->nullable();
            $table->string('divisi', 100)->nullable();
            $table->text('alamat_perusahaan')->nullable();
            $table->string('pembimbing_lapangan', 200)->nullable();
            $table->string('kontak_pembimbing', 50)->nullable();
            $table->foreignId('guru_pembimbing_id')->nullable()->constrained('users')->onDelete('set null');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->integer('durasi_hari')->storedAs('tanggal_selesai - tanggal_mulai');
            $table->enum('status', ['aktif', 'selesai', 'dibatalkan'])->default('aktif');
            $table->text('keterangan')->nullable();
            $table->timestamps();

            // Indexes for performance
            $table->index('siswa_id');
            $table->index('status');
            $table->index(['tanggal_mulai', 'tanggal_selesai']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penempatan_magang');
    }
};
