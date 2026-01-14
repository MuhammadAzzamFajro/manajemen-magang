<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pelanggaran extends Model
{
    /** @use HasFactory<\Database\Factories\PelanggaranFactory> */
    use HasFactory;
    protected $fillable = [
        'siswa_id',
        'dilaporkan_oleh_id',
        'jenis_pelanggaran',
        'tingkat',
        'poin',
        'tanggal',
        'waktu',
        'lokasi',
        'deskripsi',
        'status',
        'tindakan',
        'tanggal_tindak_lanjut',
        'catatan',
    ];
    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }
    public function dilaporkan_oleh()
    {
        return $this->belongsTo(User::class, 'dilaporkan_oleh_id');
    }
    public function bukti()
    {
        return $this->hasMany(BuktiPelanggaran::class, 'pelanggaran_id', 'id');
    }
}
