<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
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
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        /** @var User $user */
        $user = Auth::user();

        // Gunakan active_role dari session jika ada, jika tidak gunakan role dari database
        $activeRole = session('active_role', $user->role);

        // Check apakah active_role sesuai dengan role yang diminta
        if ($activeRole !== $role) {
            // Jika role tidak sesuai, redirect ke dashboard sesuai active_role
            if ($activeRole === 'Guru') {
                return redirect()->route('dashboard.guru')->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
            }
            return redirect()->route('dashboard.siswa')->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
        }

        return $next($request);
    }
}
