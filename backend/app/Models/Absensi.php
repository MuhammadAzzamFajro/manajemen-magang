<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Absensi extends Model
{
    protected $table    = 'absensi';
    protected $fillable = ['siswa_id', 'tanggal', 'status', 'jam_masuk', 'jam_pulang', 'foto_masuk', 'foto_pulang', 'status_validasi_guru', 'catatan_guru'];
    protected $casts    = ['tanggal' => 'date:Y-m-d'];
    protected $appends  = ['foto_masuk_url', 'foto_pulang_url'];

    public function siswa() { return $this->belongsTo(Siswa::class); }

    public function getFotoMasukUrlAttribute(): ?string
    {
        return $this->foto_masuk ? asset('storage/' . $this->foto_masuk) : null;
    }

    public function getFotoPulangUrlAttribute(): ?string
    {
        return $this->foto_pulang ? asset('storage/' . $this->foto_pulang) : null;
    }
}
