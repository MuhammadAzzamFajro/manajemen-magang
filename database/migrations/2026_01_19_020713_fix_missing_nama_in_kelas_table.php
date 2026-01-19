<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('kelas', function (Blueprint $table) {
            if (!Schema::hasColumn('kelas', 'nama')) {
                $table->string('nama')->after('id')->nullable();
            }
        });

        // Set default name for existing records that might be null
        DB::table('kelas')->whereNull('nama')->update(['nama' => 'XII RPL 1']);
    }

    public function down(): void
    {
        Schema::table('kelas', function (Blueprint $table) {
            if (Schema::hasColumn('kelas', 'nama')) {
                // We don't drop it to prevent data loss in case of rollback, 
                // or you can uncomment below if you strictly want to revert.
                // $table->dropColumn('nama');
            }
        });
    }
};
