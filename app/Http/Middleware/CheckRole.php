<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Jika belum login, arahkan ke halaman login
        if (! auth()->check()) {
            return redirect()->route('login');
        }

        // Sudah login tapi role tidak sesuai
        if (auth()->user()->role !== $role) {
            $redirect = auth()->user()->role === 'Guru'
                ? 'dashboard.guru'
                : 'dashboard.siswa';

            return redirect()
                ->route($redirect)
                ->with('error', 'Anda tidak memiliki hak akses ke halaman tersebut.');
        }

        return $next($request);
    }
}
