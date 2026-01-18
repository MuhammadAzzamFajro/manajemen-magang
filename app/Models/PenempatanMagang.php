<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PenempatanMagang extends Model
{
    protected $table = 'penempatan_magang';

    protected $fillable = [
        'siswa_id',
        'perusahaan',
        'posisi',
        'divisi',
        'alamat_perusahaan',
        'pembimbing_lapangan',
        'kontak_pembimbing',
        'guru_pembimbing_id',
        'tanggal_mulai',
        'tanggal_selesai',
        'status',
        'keterangan',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'status' => 'string',
    ];

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function guruPembimbing(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guru_pembimbing_id');
    }
}
