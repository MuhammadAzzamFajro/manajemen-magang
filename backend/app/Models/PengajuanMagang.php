<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PengajuanMagang extends Model
{
    protected $table    = 'pengajuan_magang';
    protected $fillable = ['siswa_id', 'tempat_magang_id', 'posisi_diminati', 'tanggal_mulai_usulan', 'tanggal_selesai_usulan', 'status', 'catatan_penolakan'];
    protected $casts    = ['tanggal_mulai_usulan' => 'date:Y-m-d', 'tanggal_selesai_usulan' => 'date:Y-m-d'];

    public function siswa()        { return $this->belongsTo(Siswa::class); }
    public function tempatMagang() { return $this->belongsTo(TempatMagang::class); }
}
