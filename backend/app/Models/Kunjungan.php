<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kunjungan extends Model
{
    protected $table    = 'kunjungan';
    protected $fillable = ['guru_id', 'tempat_magang_id', 'tanggal_kunjungan', 'catatan_evaluasi', 'foto_dokumentasi'];
    protected $casts    = ['tanggal_kunjungan' => 'date:Y-m-d'];

    public function guru()         { return $this->belongsTo(Guru::class); }
    public function tempatMagang() { return $this->belongsTo(TempatMagang::class); }
}
