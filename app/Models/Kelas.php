<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    /** @use HasFactory<\Database\Factories\KelasFactory> */
    use HasFactory;

    protected $fillable = ['nama'];

    /**
     * Get all siswas in this kelas.
     */
    public function siswas()
    {
        return $this->hasMany(Siswa::class);
    }
}
