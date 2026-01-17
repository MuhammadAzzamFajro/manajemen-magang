<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\NewAccessToken;

class AuthController extends Controller
{
    public function loginView()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Jika diminta sebagai API (Accept: application/json atau route prefix /api)
        if ($request->wantsJson()) {
            if (! Auth::attempt($credentials)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Kredensial tidak valid.',
                ], 401);
            }

            /** @var \App\Models\User $user */
            $user = Auth::user();
            /** @var NewAccessToken $token */
            $token = $user->createToken('api-token');

            return response()->json([
                'status' => true,
                'message' => 'Login berhasil.',
                'data' => [
                    'user' => $user,
                    'token' => $token->plainTextToken,
                ],
            ]);
        }

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            $user = Auth::user();
            $request->session()->put('active_role', $user->role);

            if ($user->role === 'Guru') {
                return redirect()->intended('dashboard/guru');
            }
            return redirect()->intended('dashboard/siswa');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function registerView()
    {
        return view('auth.register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:Siswa,Guru',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        // Jika register via API, langsung kembalikan token Sanctum
        if ($request->wantsJson()) {
            /** @var NewAccessToken $token */
            $token = $user->createToken('api-token');

            return response()->json([
                'status' => true,
                'message' => 'Registrasi berhasil.',
                'data' => [
                    'user' => $user,
                    'token' => $token->plainTextToken,
                ],
            ], 201);
        }

        Auth::login($user);

        return $user->role === 'Guru'
               ? redirect()->route('dashboard.guru')
               : redirect()->route('dashboard.siswa');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }

    public function switchRole(Request $request)
    {
        // Hanya izinkan user yang sudah login untuk mengganti "mode tampilan" dashboard
        $request->validate([
            'role' => 'required|in:Siswa,Guru',
            'email' => 'required|email',
        ]);

        if (! Auth::check()) {
            return redirect()->route('login')->withErrors([
                'switch_role' => 'Silakan login sebelum mengganti mode.',
            ]);
        }

        $targetRole = $request->role;
        $emailInput = $request->email;

        // Cek apakah email yang diinput terdaftar di database dengan role yang diminta
        $targetUser = User::where('email', $emailInput)->where('role', $targetRole)->first();

        if (!$targetUser) {
            return back()->withErrors([
                'switch_email' => 'Email tidak terdaftar atau tidak memiliki akses ke mode ' . $targetRole . '.',
            ]);
        }

        // Simpan role pilihan, email, dan nama di session untuk visual saja
        // Tetap gunakan user yang login saat ini, tapi ubah active_role, active_email, dan active_name-nya
        $request->session()->put('active_role', $targetRole);
        $request->session()->put('active_email', $emailInput);
        $request->session()->put('active_name', $targetUser->name);

        // Redirect ke dashboard sesuai role yang dipilih
        if ($targetRole === 'Guru') {
            return redirect()->route('dashboard.guru')->with('success', 'Berhasil beralih ke Mode Guru');
        }

        return redirect()->route('dashboard.siswa')->with('success', 'Berhasil beralih ke Mode Siswa');
    }

    /**
     * Verifikasi token Sanctum yang dikirim client.
     */
    public function verifyToken(Request $request)
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'status' => false,
                'message' => 'Token tidak valid atau sudah kedaluwarsa.',
            ], 401);
        }

        return response()->json([
            'status' => true,
            'message' => 'Token valid.',
            'data' => [
                'user' => $user,
            ],
        ]);
    }
}
