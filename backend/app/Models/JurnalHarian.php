<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JurnalHarian extends Model
{
    protected $table    = 'jurnal_harian';
    protected $fillable = ['siswa_id', 'tanggal', 'uraian_kegiatan', 'kendala', 'solusi', 'foto_bukti', 'status_verifikasi', 'catatan_guru'];
    protected $casts    = ['tanggal' => 'date:Y-m-d'];

    public function siswa() { return $this->belongsTo(Siswa::class); }

    public function getFotoBuktiUrlAttribute(): ?string
    {
        return $this->foto_bukti ? asset('storage/' . $this->foto_bukti) : null;
    }
}
