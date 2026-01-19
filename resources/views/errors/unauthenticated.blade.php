@extends('layouts.blade_app')

@section('title', 'Akses Ditolak')

@section('content')
<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-8">
    <div class="max-w-md w-full">
        <!-- Card Container -->
        <div class="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-3xl shadow-2xl p-8 md:p-10 text-center">
            <!-- Icon -->
            <div class="w-20 h-20 md:w-24 md:h-24 bg-red-500/20 border border-red-500/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i class="fas fa-lock text-4xl md:text-5xl text-red-500"></i>
            </div>

            <!-- Title -->
            <h1 class="text-2xl md:text-3xl font-black text-white mb-3 uppercase tracking-tight">Akses Terbatas</h1>

            <!-- Message -->
            <p class="text-gray-400 text-sm md:text-base mb-8 leading-relaxed">
                Anda harus login terlebih dahulu untuk mengakses dashboard monitoring magang.
            </p>

            <!-- Info Box -->
            <div class="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-8">
                <p class="text-blue-300 text-xs md:text-sm font-semibold">
                    <i class="fas fa-info-circle mr-2"></i>Gunakan kredensial akun Anda untuk login
                </p>
            </div>

            <!-- Button -->
            <a href="{{ route('login') }}" class="inline-block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm md:text-base uppercase rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-lg hover:shadow-blue-600/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-gray-900">
                <i class="fas fa-sign-in-alt mr-2"></i>Login Sekarang
            </a>

            <!-- Footer Help Text -->
            <div class="mt-8 pt-8 border-t border-gray-700">
                <p class="text-gray-500 text-xs md:text-sm mb-4">Butuh bantuan?</p>
                <div class="flex gap-3 justify-center">
                    <a href="{{ route('login') }}" class="text-blue-400 hover:text-blue-300 text-xs md:text-sm font-semibold transition-colors">
                        Login
                    </a>
                    <span class="text-gray-600">•</span>
                    <a href="/" class="text-gray-400 hover:text-white text-xs md:text-sm font-semibold transition-colors">
                        Beranda
                    </a>
                </div>
            </div>
        </div>

        <!-- Background decoration -->
        <div class="mt-8 text-center">
            <p class="text-gray-600 text-xs md:text-sm">
                Panel Monitoring • SMK Negeri 1 Surabaya
            </p>
        </div>
    </div>
</div>
@endsection
