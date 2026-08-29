<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PenempatanMagang extends Model
{
    protected $table    = 'penempatan_magang';
    protected $fillable = ['siswa_id','tempat_magang_id','guru_id','tanggal_mulai','tanggal_selesai','nilai_akhir','status_pengesahan'];
    protected $casts    = ['tanggal_mulai' => 'date:Y-m-d', 'tanggal_selesai' => 'date:Y-m-d'];

    public function siswa()        { return $this->belongsTo(Siswa::class); }
    public function tempatMagang() { return $this->belongsTo(TempatMagang::class); }
    public function guru()         { return $this->belongsTo(Guru::class); }
}
