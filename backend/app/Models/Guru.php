<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Guru extends Model
{
    use HasFactory;
    protected $table    = 'guru';
    protected $fillable = ['user_id', 'nip', 'nama_lengkap', 'jurusan', 'status_akun'];

    public function user()         { return $this->belongsTo(User::class); }
    public function penempatan()   { return $this->hasMany(PenempatanMagang::class); }
    public function kunjungan()    { return $this->hasMany(Kunjungan::class); }
}
