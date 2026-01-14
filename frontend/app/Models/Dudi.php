<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dudi extends Model
{
    /** @use HasFactory<\Database\Factories\DudiFactory> */
    use HasFactory;

    protected $fillable = [
        'nama',
        'alamat',
        'email',
        'telepon',
        'penanggung_jawab',
        'jabatan',
        'bidang_usaha',
    ];

    /**
     * Scope for filtering by bidang usaha
     */
    public function scopeByBidangUsaha($query, $bidang)
    {
        return $query->where('bidang_usaha', $bidang);
    }

    /**
     * Scope for searching by name or penanggung jawab
     */
    public function scopeSearch($query, $search)
    {
        return $query->where('nama', 'like', "%{$search}%")
                    ->orWhere('penanggung_jawab', 'like', "%{$search}%");
    }
}
