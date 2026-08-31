<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    #[OA\Post(
        path: '/api/login',
        summary: 'Login pengguna',
        description: 'Mengembalikan token Sanctum dan data pengguna. Token dipakai pada header `Authorization: Bearer <token>` untuk endpoint lain.',
        tags: ['Autentikasi'],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(ref: '#/components/schemas/LoginRequest')),
        responses: [
            new OA\Response(response: 200, description: 'Login berhasil.', content: new OA\JsonContent(ref: '#/components/schemas/LoginResponse')),
            new OA\Response(response: 401, description: 'Email atau password salah.'),
            new OA\Response(response: 422, description: 'Validasi gagal.'),
        ],
    )]
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            ActivityLog::log('auth.login_failed', 'warn', [
                'email' => $request->email,
                'reason' => 'Invalid credentials'
            ]);

            return response()->json([
                'status'  => false,
                'message' => 'Email atau password salah.'
            ], 401);
        }

        // Generate Sanctum token
        $token = $user->createToken('simmas-api-token')->plainTextToken;

        ActivityLog::log('auth.login_success', 'info', [
            'user_id' => $user->id,
            'role'    => $user->getRole(),
        ], $user);

        return response()->json([
            'status'  => true,
            'message' => 'Login berhasil.',
            'data'    => [
                'token' => $token,
                'user'  => [
                    'id'     => $user->id,
                    'name'   => $user->name,
                    'email'  => $user->email,
                    'role'   => $user->getRole(),
                    'profile'=> $user->profile,
                    'guru'   => $user->guru,
                    'siswa'  => $user->siswa,
                ]
            ]
        ]);
    }

    #[OA\Get(
        path: '/api/me',
        summary: 'Data pengguna saat ini',
        description: 'Mengembalikan profil pengguna yang sedang login beserta relasi guru/siswa & penempatan.',
        tags: ['Autentikasi'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Profil pengguna.', content: new OA\JsonContent(ref: '#/components/schemas/User')),
            new OA\Response(response: 401, description: 'Token tidak valid / tidak terautentikasi.'),
        ],
    )]
    public function me(Request $request)
    {
        $user = $request->user();
        $user->load(['profile', 'guru', 'siswa.penempatan.tempatMagang', 'siswa.penempatan.guru']);

        return response()->json([
            'status' => true,
            'data'   => [
                'id'      => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
                'role'    => $user->getRole(),
                'profile' => $user->profile,
                'guru'    => $user->guru,
                'siswa'   => $user->siswa,
            ]
        ]);
    }

    #[OA\Post(
        path: '/api/logout',
        summary: 'Logout (revoke token)',
        description: 'Membatalkan token Sanctum yang sedang dipakai.',
        tags: ['Autentikasi'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Berhasil logout.'),
        ],
    )]
    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user) {
            ActivityLog::log('auth.logout', 'info', [], $user);
            $user->currentAccessToken()->delete();
        }

        return response()->json([
            'status'  => true,
            'message' => 'Berhasil logout.'
        ]);
    }
}
