<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Jurusan extends Model
{
    use HasFactory;
    protected $table = 'jurusan';
    protected $fillable = ['nama'];

    public function kelas()
    {
        return $this->hasMany(Kelas::class);
    }

    public function guru()
    {
        return $this->hasMany(Guru::class);
    }
}
