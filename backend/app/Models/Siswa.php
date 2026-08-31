<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Siswa extends Model
{
    use HasFactory;
    protected $table    = 'siswa';
    protected $fillable = ['user_id', 'nis', 'nama_lengkap', 'kelas_id', 'email_kontak', 'status_magang'];

    public function user()       { return $this->belongsTo(User::class); }
    public function penempatan() { return $this->hasOne(PenempatanMagang::class); }
    public function pengajuan()  { return $this->hasMany(PengajuanMagang::class); }
    public function absensi()    { return $this->hasMany(Absensi::class); }
    public function jurnal()     { return $this->hasMany(JurnalHarian::class); }
    public function kelas()      { return $this->belongsTo(Kelas::class); }
}
