<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
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
