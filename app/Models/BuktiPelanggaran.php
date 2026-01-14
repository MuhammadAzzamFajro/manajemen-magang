<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuktiPelanggaran extends Model
{
    /** @use HasFactory<\Database\Factories\BuktiPelanggaranFactory> */
    use HasFactory;

    protected $fillable = [
        'pelanggaran_id',
        'tipe',
        'url',
        'nama',
        'deskripsi',
        'diunggah_oleh_id',
        'waktu_unggah',
    ];
}
