<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $role
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if (!$user || !$user->profile) {
            return response()->json([
                'status'  => false,
                'message' => 'Unauthenticated / Profil tidak ditemukan.'
            ], 401);
        }

        if (strtolower($user->profile->role) !== strtolower($role)) {
            return response()->json([
                'status'  => false,
                'message' => 'Akses ditolak. Anda tidak memiliki wewenang role ' . strtoupper($role) . '.'
            ], 403);
        }

        return $next($request);
    }
}
