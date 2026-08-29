<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $table = 'activity_logs';

    public $timestamps = false; // append-only, created_at is auto-set by DB

    protected static function booted()
    {
        static::updating(function ($model) {
            throw new \DomainException('Activity log data is append-only and cannot be modified.');
        });

        static::deleting(function ($model) {
            throw new \DomainException('Activity log data is append-only and cannot be deleted.');
        });
    }

    protected $fillable = [
        'actor_email',
        'actor_role',
        'action_type',
        'level',
        'ip_address',
        'metadata',
        'created_at'
    ];

    protected $casts = [
        'metadata'   => 'array',
        'created_at' => 'datetime',
    ];

    public static function log(string $actionType, string $level = 'info', array $metadata = [], ?User $actor = null)
    {
        $user = $actor ?? auth()->user();

        return static::create([
            'actor_email' => $user?->email ?? 'system',
            'actor_role'  => $user?->getRole() ?? 'guest',
            'action_type' => $actionType,
            'level'       => $level,
            'ip_address'  => request()->ip(),
            'metadata'    => $metadata,
            'created_at'  => now(),
        ]);
    }
}
