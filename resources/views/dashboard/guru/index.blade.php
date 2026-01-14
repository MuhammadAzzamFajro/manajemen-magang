@extends('layouts.app')

@section('title', 'Dashboard Guru')

@section('content')
<div class="p-4 md:p-8 text-white min-h-screen">
    <!-- Header Section -->
    <div class="mb-10 flex flex-col xl:flex-row xl:items-start justify-between gap-8">
        <div class="flex-1">
            <h1 class="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Panel Monitoring</h1>
            <p class="text-gray-400 font-medium italic text-base md:text-lg opacity-80 max-w-2xl">"SMK Negeri 1 Surabaya &bull; Pusat Unggulan & Mitra Industri Digital Hub"</p>
        </div>

        <div class="flex flex-col sm:flex-row items-stretch lg:items-center gap-4 shrink-0">
            @if($stats['pendingLogbook'] > 0 || $stats['pendingMagang'] > 0)
                <a href="{{ route('guru.logbook') }}" class="flex items-center gap-4 bg-orange-600/20 border border-orange-500/40 px-6 py-4 rounded-3xl animate-pulse hover:bg-orange-600/30 transition">
                    <div class="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/40">
                        <i class="fas fa-bell"></i>
                    </div>
                    <div>
                        <p class="text-[10px] font-black text-orange-400 uppercase tracking-widest leading-none mb-1">Permintaan Baru</p>
                        <p class="text-sm font-bold text-white">{{ $stats['pendingLogbook'] + $stats['pendingMagang'] }} Item Perlu Validasi</p>
                    </div>
                </a>
            @endif

            <div class="flex gap-2 bg-gray-950 p-2 rounded-[2rem] border border-gray-800 backdrop-blur-md shadow-2xl">
                <button @click="showSwitchModal = true; switchRoleLabel = 'Siswa'"
                   class="px-6 py-3.5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 hover:bg-gray-800 text-gray-500 hover:text-white">
                    <i class="fas fa-user-graduate mr-2"></i> Siswa
                </button>
                <a href="{{ route('dashboard.guru') }}"
                   class="px-6 py-3.5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 bg-blue-600 text-white shadow-xl shadow-blue-600/30">
                    <i class="fas fa-chalkboard-teacher mr-2"></i> Guru
                </a>
            </div>
        </div>
    </div>

    <!-- Stats Grid: Fully Responsive -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-10">
        <!-- Total Siswa -->
        <div class="group bg-gray-900 border border-gray-800 p-6 rounded-[2rem] shadow-2xl hover:border-blue-500/50 transition-all duration-500 hover:scale-[1.02] flex items-center gap-5">
            <div class="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shrink-0">
                <i class="fas fa-users text-2xl"></i>
            </div>
            <div>
                <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-2">Total Talenta</p>
                <h3 class="text-3xl font-black text-white leading-none">{{ $stats['totalSiswa'] }} <span class="text-[10px] font-bold text-gray-600 uppercase">Siswa</span></h3>
            </div>
        </div>

        <!-- DUDI -->
        <div class="group bg-gray-900 border border-gray-800 p-6 rounded-[2rem] shadow-2xl hover:border-cyan-500/50 transition-all duration-500 hover:scale-[1.02] flex items-center gap-5">
            <div class="w-14 h-14 bg-cyan-600/20 rounded-2xl flex items-center justify-center text-cyan-500 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-500 shrink-0">
                <i class="fas fa-building text-2xl"></i>
            </div>
            <div>
                <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-2">Mitra Aktif</p>
                <h3 class="text-3xl font-black text-white leading-none">{{ $stats['totalDudi'] }} <span class="text-[10px] font-bold text-gray-600 uppercase">Unit</span></h3>
            </div>
        </div>

        <!-- Magang Aktif -->
        <div class="group bg-gray-900 border border-gray-800 p-6 rounded-[2rem] shadow-2xl hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] flex items-center gap-5">
            <div class="w-14 h-14 bg-purple-600/20 rounded-2xl flex items-center justify-center text-purple-500 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 shrink-0">
                <i class="fas fa-briefcase text-2xl"></i>
            </div>
            <div>
                <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-2">Penempatan</p>
                <h3 class="text-3xl font-black text-white leading-none">{{ $stats['totalMagang'] }} <span class="text-[10px] font-bold text-gray-600 uppercase">Aktif</span></h3>
            </div>
        </div>

        <!-- Logbook Today -->
        <div class="group bg-gray-900 border border-gray-800 p-6 rounded-[2rem] shadow-2xl hover:border-red-500/50 transition-all duration-500 hover:scale-[1.02] flex items-center gap-5">
            <div class="w-14 h-14 bg-red-600/20 rounded-2xl flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all duration-500 shrink-0">
                <i class="fas fa-book-open text-2xl"></i>
            </div>
            <div>
                <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-2">Total Laporan</p>
                <h3 class="text-3xl font-black text-white leading-none">{{ $stats['totalLogbook'] }} <span class="text-[10px] font-bold text-gray-600 uppercase">Entri</span></h3>
            </div>
        </div>
    </div>

    <!-- Pending Verifications Section -->
    @if($pendingMagangs->count() > 0 || $pendingLogbooks->count() > 0)
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <!-- Pending Magang -->
        @if($pendingMagangs->count() > 0)
        <div class="bg-gray-900 border border-orange-500/40 rounded-[2.5rem] shadow-2xl p-8">
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                    <i class="fas fa-clock text-orange-500 animate-pulse"></i> Pengajuan Magang Pending
                </h2>
                <a href="{{ route('guru.magang') }}" class="text-[9px] font-black text-orange-500 uppercase tracking-widest hover:text-orange-400">Kelola Semua &rarr;</a>
            </div>

            <div class="space-y-4">
                @foreach($pendingMagangs as $pm)
                <div class="p-4 bg-gray-950/50 border border-gray-800 rounded-2xl">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-[10px] font-black text-orange-400 border border-gray-700">
                                {{ substr($pm->siswa->nama ?? 'S', 0, 1) }}
                            </div>
                            <div>
                                <h4 class="text-sm font-black text-white">{{ $pm->siswa->nama ?? '-' }}</h4>
                                <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{{ $pm->dudi->nama ?? '-' }}</p>
                            </div>
                        </div>
                        <div class="text-[9px] font-black text-gray-600 uppercase tracking-widest">
                            {{ $pm->created_at->diffForHumans() }}
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <form method="POST" action="{{ route('guru.magang.verify', $pm) }}" class="flex-1">
                            @csrf
                            <input type="hidden" name="status" value="Setuju">
                            <button type="submit" class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-black uppercase rounded-lg transition">
                                Setujui
                            </button>
                        </form>
                        <form method="POST" action="{{ route('guru.magang.verify', $pm) }}" class="flex-1">
                            @csrf
                            <input type="hidden" name="status" value="Tolak">
                            <button type="submit" class="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase rounded-lg transition">
                                Tolak
                            </button>
                        </form>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
        @endif

        <!-- Pending Logbook -->
        @if($pendingLogbooks->count() > 0)
        <div class="bg-gray-900 border border-yellow-500/40 rounded-[2.5rem] shadow-2xl p-8">
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                    <i class="fas fa-book text-yellow-500 animate-pulse"></i> Logbook Menunggu Verifikasi
                </h2>
                <a href="{{ route('guru.logbook') }}" class="text-[9px] font-black text-yellow-500 uppercase tracking-widest hover:text-yellow-400">Kelola Semua &rarr;</a>
            </div>

            <div class="space-y-4">
                @foreach($pendingLogbooks as $pl)
                <div class="p-4 bg-gray-950/50 border border-gray-800 rounded-2xl">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-[10px] font-black text-yellow-400 border border-gray-700">
                                {{ substr($pl->siswa->nama ?? 'S', 0, 1) }}
                            </div>
                            <div>
                                <h4 class="text-sm font-black text-white">{{ $pl->siswa->nama ?? '-' }}</h4>
                                <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{{ $pl->kegiatan }}</p>
                            </div>
                        </div>
                        <div class="text-[9px] font-black text-gray-600 uppercase tracking-widest">
                            {{ $pl->created_at->diffForHumans() }}
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <form method="POST" action="{{ route('guru.logbook.verify', $pl) }}" class="flex-1">
                            @csrf
                            <input type="hidden" name="status" value="Setuju">
                            <button type="submit" class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-black uppercase rounded-lg transition">
                                Setujui
                            </button>
                        </form>
                        <form method="POST" action="{{ route('guru.logbook.verify', $pl) }}" class="flex-1">
                            @csrf
                            <input type="hidden" name="status" value="Tolak">
                            <button type="submit" class="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase rounded-lg transition">
                                Tolak
                            </button>
                        </form>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
        @endif
    </div>
    @endif

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- Tabel Magang Terbaru (Left - 2/3) -->
        <div class="xl:col-span-2 space-y-8">
            <div class="bg-gray-900 border border-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden">
                <div class="p-8 border-b border-gray-800 flex items-center justify-between">
                    <h2 class="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <i class="fas fa-bolt text-yellow-500 animate-pulse"></i> Penempatan Aktif
                    </h2>
                    <a href="{{ route('guru.magang') }}" class="text-[9px] font-black text-cyan-500 uppercase tracking-widest hover:text-cyan-400">Semua Data &rarr;</a>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-gray-950 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                            <tr>
                                <th class="p-6">Siswa</th>
                                <th class="p-6">Mitra</th>
                                <th class="p-6 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-800/50">
                            @forelse($magangs as $row)
                            <tr class="hover:bg-gray-800/30 transition group">
                                <td class="p-6">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-[10px] font-black text-blue-400 border border-gray-700">
                                            {{ substr($row->siswa->nama ?? 'S', 0, 1) }}
                                        </div>
                                        <div class="font-bold text-gray-200">{{ $row->siswa->nama ?? '-' }}</div>
                                    </div>
                                </td>
                                <td class="p-6 text-gray-400 font-medium">{{ $row->dudi->nama ?? '-' }}</td>
                                <td class="p-6 text-center">
                                    <span class="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[9px] font-black uppercase border border-green-500/20">
                                        {{ $row->status }}
                                    </span>
                                </td>
                            </tr>
                            @empty
                            <tr><td colspan="3" class="p-10 text-center text-gray-600 font-black uppercase text-xs">Belum ada aktivitas</td></tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Right Side: Siswa Baru Terdaftar -->
        <div class="xl:col-span-1">
            <div class="bg-gray-900 border border-gray-800 rounded-[2.5rem] shadow-2xl p-8">
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <i class="fas fa-user-plus text-blue-500"></i> Siswa Baru
                    </h2>
                    <a href="{{ route('guru.siswa') }}" class="text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-white">Kelola &rarr;</a>
                </div>

                <div class="space-y-4">
                    @forelse($latestSiswas as $ls)
                    <div class="flex items-center gap-4 p-4 bg-gray-950/50 border border-gray-800 rounded-2xl hover:border-blue-500/30 transition-all duration-300 group">
                        <div class="w-12 h-12 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center text-blue-400 font-black group-hover:bg-blue-600 group-hover:text-white transition-all">
                            {{ substr($ls->nama, 0, 1) }}
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="text-sm font-black text-white truncate">{{ $ls->nama }}</h4>
                            <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{{ $ls->kelas->nama ?? 'No Class' }}</p>
                        </div>
                        <div class="text-[9px] font-black text-gray-600 uppercase tracking-widest">
                            {{ $ls->created_at->diffForHumans() }}
                        </div>
                    </div>
                    @empty
                    <p class="text-center text-gray-600 font-black uppercase text-xs py-10">Belum ada siswa</p>
                    @endforelse
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
