<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password'];
    protected $hidden   = ['password', 'remember_token'];

    protected function casts(): array
    {
        return ['email_verified_at' => 'datetime', 'password' => 'hashed'];
    }

    public function profile() { return $this->hasOne(Profile::class); }
    public function guru()    { return $this->hasOne(Guru::class); }
    public function siswa()   { return $this->hasOne(Siswa::class); }

    public function isAdmin(): bool  { return $this->profile?->role === 'admin'; }
    public function isGuru(): bool   { return $this->profile?->role === 'guru'; }
    public function isSiswa(): bool  { return $this->profile?->role === 'siswa'; }
    public function getRole(): ?string { return $this->profile?->role; }
}
