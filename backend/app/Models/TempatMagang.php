<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TempatMagang extends Model
{
    use HasFactory;
    protected $table    = 'tempat_magang';
    protected $fillable = ['nama_perusahaan','bidang_usaha','nama_pic','kontak_pic','kuota','alamat','status_verifikasi'];
    protected $appends  = ['sisa_kuota'];

    public function penempatan()   { return $this->hasMany(PenempatanMagang::class); }
    public function pengajuan()    { return $this->hasMany(PengajuanMagang::class); }
    public function kunjungan()    { return $this->hasMany(Kunjungan::class); }

    public function siswaAktif()
    {
        return $this->hasMany(PenempatanMagang::class)
            ->whereIn('status_pengesahan', ['belum_disahkan', 'disahkan']);
    }

    public function getSisaKuotaAttribute(): int
    {
        return max(0, $this->kuota - $this->siswaAktif()->count());
    }
}
