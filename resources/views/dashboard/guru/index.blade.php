@extends('layouts.blade_app')

@section('title', 'Dashboard Guru')

@section('content')
<div class="text-white">
    <!-- Header Section - Optimized -->
    <div class="mb-6 md:mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-4 md:gap-6">
        <div class="flex-1 min-w-0">
            <h1 class="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-2 md:mb-3 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Panel Monitoring</h1>
            <p class="text-gray-400 font-medium italic text-sm md:text-base lg:text-lg opacity-80">"SMK Negeri 1 Surabaya &bull; Pusat Unggulan & Mitra Industri Digital Hub"</p>
        </div>

        <div class="flex flex-col sm:flex-row items-stretch gap-3 shrink-0">
            @if($stats['pendingLogbook'] > 0 || $stats['pendingMagang'] > 0)
                <a href="{{ route('guru.logbook') }}" aria-label="Notifikasi permintaan validasi pending" class="flex items-center gap-3 bg-orange-600/20 border border-orange-500/40 px-4 md:px-5 py-3 rounded-2xl md:rounded-3xl animate-pulse hover:bg-orange-600/35 transition-colors duration-300">
                    <div class="w-9 h-9 md:w-10 md:h-10 bg-orange-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/40">
                        <i class="fas fa-bell text-sm md:text-base"></i>
                    </div>
                    <div>
                        <p class="text-[9px] md:text-[10px] font-black text-orange-400 uppercase tracking-widest leading-none mb-1">Permintaan Baru</p>
                        <p class="text-xs md:text-sm font-bold text-white">{{ $stats['pendingLogbook'] + $stats['pendingMagang'] }} Item Perlu Validasi</p>
                    </div>
                </a>
            @endif

            <div class="flex gap-2 bg-gray-950 p-2 md:p-2.5 rounded-2xl md:rounded-3xl border border-gray-800 backdrop-blur-md shadow-2xl">
                <button @click="showSwitchModal = true; switchRoleLabel = 'Siswa'" aria-label="Alihkan tampilan ke dashboard siswa"
                   class="px-4 md:px-6 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl text-[9px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 hover:bg-gray-800/80 text-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-950">
                    <i class="fas fa-user-graduate mr-1 md:mr-2"></i> Siswa
                </button>
                <a href="{{ route('dashboard.guru') }}" aria-label="Dashboard guru (saat ini aktif)" aria-current="page"
                   class="px-4 md:px-6 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl text-[9px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 bg-blue-600 text-white shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-gray-950">
                    <i class="fas fa-chalkboard-teacher mr-1 md:mr-2"></i> Guru
                </a>
            </div>
        </div>
    </div>

    <!-- Stats Grid: Fully Responsive & Compact -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5 mb-6 md:mb-8">
        <!-- Total Siswa -->
        <div class="group bg-gray-900 border border-gray-800 p-4 md:p-5 lg:p-6 rounded-2xl md:rounded-3xl shadow-2xl hover:border-blue-500/50 transition-all duration-500 hover:scale-[1.02]">
            <div class="flex flex-col gap-3">
                <div class="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-blue-600/20 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <i class="fas fa-users text-lg md:text-xl lg:text-2xl"></i>
                </div>
                <div>
                    <p class="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1.5 md:mb-2">Total Talenta</p>
                    <h3 class="text-2xl md:text-3xl font-black text-white leading-none">{{ $stats['totalSiswa'] ?? 0 }} <span class="text-[9px] md:text-[10px] font-bold text-gray-600 uppercase">Siswa</span></h3>
                </div>
            </div>
        </div>

        <!-- DUDI -->
        <div class="group bg-gray-900 border border-gray-800 p-4 md:p-5 lg:p-6 rounded-2xl md:rounded-3xl shadow-2xl hover:border-cyan-500/50 transition-all duration-500 hover:scale-[1.02]">
            <div class="flex flex-col gap-3">
                <div class="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-cyan-600/20 rounded-xl md:rounded-2xl flex items-center justify-center text-cyan-500 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-500">
                    <i class="fas fa-building text-lg md:text-xl lg:text-2xl"></i>
                </div>
                <div>
                    <p class="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1.5 md:mb-2">Mitra Aktif</p>
                    <h3 class="text-2xl md:text-3xl font-black text-white leading-none">{{ $stats['totalDudi'] ?? 0 }} <span class="text-[9px] md:text-[10px] font-bold text-gray-600 uppercase">Unit</span></h3>
                </div>
            </div>
        </div>

        <!-- Magang Aktif -->
        <div class="group bg-gray-900 border border-gray-800 p-4 md:p-5 lg:p-6 rounded-2xl md:rounded-3xl shadow-2xl hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02]">
            <div class="flex flex-col gap-3">
                <div class="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-purple-600/20 rounded-xl md:rounded-2xl flex items-center justify-center text-purple-500 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
                    <i class="fas fa-briefcase text-lg md:text-xl lg:text-2xl"></i>
                </div>
                <div>
                    <p class="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1.5 md:mb-2">Penempatan</p>
                    <h3 class="text-2xl md:text-3xl font-black text-white leading-none">{{ $stats['totalMagang'] ?? 0 }} <span class="text-[9px] md:text-[10px] font-bold text-gray-600 uppercase">Aktif</span></h3>
                </div>
            </div>
        </div>

        <!-- Logbook Today -->
        <div class="group bg-gray-900 border border-gray-800 p-4 md:p-5 lg:p-6 rounded-2xl md:rounded-3xl shadow-2xl hover:border-red-500/50 transition-all duration-500 hover:scale-[1.02]">
            <div class="flex flex-col gap-3">
                <div class="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-red-600/20 rounded-xl md:rounded-2xl flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                    <i class="fas fa-book-open text-lg md:text-xl lg:text-2xl"></i>
                </div>
                <div>
                    <p class="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1.5 md:mb-2">Total Laporan</p>
                    <h3 class="text-2xl md:text-3xl font-black text-white leading-none">{{ $stats['totalLogbook'] ?? 0 }} <span class="text-[9px] md:text-[10px] font-bold text-gray-600 uppercase">Entri</span></h3>
                </div>
            </div>
        </div>
    </div>

    <!-- Pending Verifications Section - Always Visible with Empty State -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-8">
        <!-- Pending Magang -->
        <div class="bg-gray-900 border border-orange-500/40 rounded-2xl md:rounded-3xl shadow-2xl p-5 md:p-6 lg:p-8">
            <div class="flex items-center justify-between mb-5 md:mb-6 lg:mb-8">
                <h2 class="text-base md:text-lg lg:text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2 md:gap-3">
                    <i class="fas fa-clock text-orange-500 animate-pulse text-sm md:text-base" aria-hidden="true"></i>
                    <span class="hidden sm:inline">Pengajuan Magang Pending</span>
                    <span class="sm:hidden">Magang Pending</span>
                </h2>
                <a href="{{ route('guru.magang') }}" aria-label="Kelola semua pengajuan magang" class="text-[9px] md:text-[10px] font-black text-orange-500 uppercase tracking-widest hover:text-orange-300 transition-colors duration-300">Kelola &rarr;</a>
            </div>

            @if($pendingMagangs->count() > 0)
                <div class="space-y-3 md:space-y-4">
                    @foreach($pendingMagangs as $pm)
                    <div class="p-3 md:p-4 bg-gray-950/50 border border-gray-800 rounded-xl md:rounded-2xl">
                        <div class="flex items-start justify-between mb-3 gap-2">
                            <div class="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                                <div class="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-lg flex items-center justify-center text-[9px] md:text-[10px] font-black text-orange-400 border border-gray-700 shrink-0">
                                    {{ substr($pm->siswa?->nama ?? 'S', 0, 1) }}
                                </div>
                                <div class="min-w-0 flex-1">
                                    <h4 class="text-xs md:text-sm font-black text-white truncate">{{ $pm->siswa?->nama ?? '-' }}</h4>
                                    <p class="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">{{ $pm->dudi?->nama ?? '-' }}</p>
                                </div>
                            </div>
                            <div class="text-[8px] md:text-[9px] font-black text-gray-600 uppercase tracking-widest shrink-0">
                                {{ $pm->created_at->diffForHumans() }}
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <form method="POST" action="{{ route('guru.magang.verify', $pm) }}" class="flex-1">
                                @csrf
                                <input type="hidden" name="status" value="Setuju">
                                <button type="submit" aria-label="Setujui pengajuan magang" class="w-full px-3 py-1.5 md:px-4 md:py-2 bg-green-600 hover:bg-green-700 text-white text-[10px] md:text-xs font-black uppercase rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-gray-950 shadow-lg shadow-green-600/20 hover:shadow-lg hover:shadow-green-600/30">
                                    Setujui
                                </button>
                            </form>
                            <form method="POST" action="{{ route('guru.magang.verify', $pm) }}" class="flex-1">
                                @csrf
                                <input type="hidden" name="status" value="Tolak">
                                <button type="submit" aria-label="Tolak pengajuan magang" class="w-full px-3 py-1.5 md:px-4 md:py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] md:text-xs font-black uppercase rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-950 shadow-lg shadow-red-600/20 hover:shadow-lg hover:shadow-red-600/30">\n                                    Tolak
                                </button>
                            </form>
                        </div>
                    </div>
                    @endforeach
                </div>
            @else
                <div class="text-center py-8 md:py-12">
                    <div class="w-16 h-16 md:w-20 md:h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-check-circle text-2xl md:text-3xl text-green-500"></i>
                    </div>
                    <p class="text-xs md:text-sm font-bold text-gray-500 uppercase">Tidak ada pengajuan pending</p>
                </div>
            @endif
        </div>

        <!-- Pending Logbook -->
        <div class="bg-gray-900 border border-yellow-500/40 rounded-2xl md:rounded-3xl shadow-2xl p-5 md:p-6 lg:p-8">
            <div class="flex items-center justify-between mb-5 md:mb-6 lg:mb-8">
                <h2 class="text-base md:text-lg lg:text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2 md:gap-3">
                    <i class="fas fa-book text-yellow-500 animate-pulse text-sm md:text-base" aria-hidden="true"></i>
                    <span class="hidden sm:inline">Logbook Menunggu Verifikasi</span>
                    <span class="sm:hidden">Logbook Pending</span>
                </h2>
                <a href="{{ route('guru.logbook') }}" aria-label="Kelola semua logbook yang menunggu verifikasi" class="text-[9px] md:text-[10px] font-black text-yellow-500 uppercase tracking-widest hover:text-yellow-300 transition-colors duration-300">Kelola &rarr;</a>
            </div>

            @if($pendingLogbooks->count() > 0)
                <div class="space-y-3 md:space-y-4">
                    @foreach($pendingLogbooks as $pl)
                    <div class="p-3 md:p-4 bg-gray-950/50 border border-gray-800 rounded-xl md:rounded-2xl">
                        <div class="flex items-start justify-between mb-3 gap-2">
                            <div class="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                                <div class="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-lg flex items-center justify-center text-[9px] md:text-[10px] font-black text-yellow-400 border border-gray-700 shrink-0">
                                    {{ substr($pl->siswa?->nama ?? 'S', 0, 1) }}
                                </div>
                                <div class="min-w-0 flex-1">
                                    <h4 class="text-xs md:text-sm font-black text-white truncate">{{ $pl->siswa?->nama ?? '-' }}</h4>
                                    <p class="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">{{ $pl->kegiatan ?? '-' }}</p>
                                </div>
                            </div>
                            <div class="text-[8px] md:text-[9px] font-black text-gray-600 uppercase tracking-widest shrink-0">
                                {{ $pl->created_at->diffForHumans() }}
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <form method="POST" action="{{ route('guru.logbook.verify', $pl) }}" class="flex-1">
                                @csrf
                                <input type="hidden" name="status" value="Setuju">
                                <button type="submit" aria-label="Setujui logbook" class="w-full px-3 py-1.5 md:px-4 md:py-2 bg-green-600 hover:bg-green-700 text-white text-[10px] md:text-xs font-black uppercase rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-gray-950 shadow-lg shadow-green-600/20 hover:shadow-lg hover:shadow-green-600/30">
                                    Setujui
                                </button>
                            </form>
                            <form method="POST" action="{{ route('guru.logbook.verify', $pl) }}" class="flex-1">
                                @csrf
                                <input type="hidden" name="status" value="Tolak">
                                <button type="submit" aria-label="Tolak logbook" class="w-full px-3 py-1.5 md:px-4 md:py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] md:text-xs font-black uppercase rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-950 shadow-lg shadow-red-600/20 hover:shadow-lg hover:shadow-red-600/30">
                                    Tolak
                                </button>
                            </form>
                        </div>
                    </div>
                    @endforeach
                </div>
            @else
                <div class="text-center py-8 md:py-12">
                    <div class="w-16 h-16 md:w-20 md:h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-check-circle text-2xl md:text-3xl text-green-500"></i>
                    </div>
                    <p class="text-xs md:text-sm font-bold text-gray-500 uppercase">Semua logbook terverifikasi</p>
                </div>
            @endif
        </div>
    </div>

    <!-- Bottom Section: Tables -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        <!-- Tabel Magang Terbaru (Left - 2/3) -->
        <div class="xl:col-span-2">
            <div class="bg-gray-900 border border-gray-800 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden">
                <div class="p-5 md:p-6 lg:p-8 border-b border-gray-800 flex items-center justify-between">
                    <h2 class="text-base md:text-lg lg:text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2 md:gap-3">
                        <i class="fas fa-bolt text-yellow-500 animate-pulse text-sm md:text-base" aria-hidden="true"></i>
                        <span class="hidden sm:inline">Penempatan Aktif</span>
                        <span class="sm:hidden">Penempatan</span>
                    </h2>
                    <a href="{{ route('guru.magang') }}" aria-label="Lihat semua data penempatan magang" class="text-[9px] md:text-[10px] font-black text-cyan-500 uppercase tracking-widest hover:text-cyan-300 transition-colors duration-300">Semua &rarr;</a>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs md:text-sm" role="table" aria-label="Daftar penempatan magang aktif">
                        <thead class="bg-gray-950 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                            <tr>
                                <th class="p-3 md:p-4 lg:p-6">Siswa</th>
                                <th class="p-3 md:p-4 lg:p-6 hidden sm:table-cell">Mitra</th>
                                <th class="p-3 md:p-4 lg:p-6 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-800/50">
                            @forelse($magangs as $row)
                            <tr class="hover:bg-gray-800/30 transition group">
                                <td class="p-3 md:p-4 lg:p-6">
                                    <div class="flex items-center gap-2 md:gap-3">
                                        <div class="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gray-800 flex items-center justify-center text-[9px] md:text-[10px] font-black text-blue-400 border border-gray-700 shrink-0">
                                            {{ substr($row->siswa?->nama ?? 'S', 0, 1) }}
                                        </div>
                                        <div class="min-w-0">
                                            <div class="font-bold text-gray-200 truncate">{{ $row->siswa?->nama ?? '-' }}</div>
                                            <div class="sm:hidden text-[9px] text-gray-500 font-bold truncate">{{ $row->dudi?->nama ?? '-' }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="p-3 md:p-4 lg:p-6 text-gray-400 font-medium hidden sm:table-cell">
                                    <div class="truncate">{{ $row->dudi?->nama ?? '-' }}</div>
                                </td>
                                <td class="p-3 md:p-4 lg:p-6 text-center">
                                    <span class="px-2 md:px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[9px] md:text-[10px] font-black uppercase border border-green-500/20 inline-block">
                                        {{ $row->status ?? 'Aktif' }}
                                    </span>
                                </td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="3" class="p-8 md:p-10 text-center">
                                    <div class="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <i class="fas fa-inbox text-2xl text-gray-600"></i>
                                    </div>
                                    <p class="text-gray-600 font-black uppercase text-xs">Belum ada aktivitas</p>
                                </td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Right Side: Siswa Baru Terdaftar -->
        <div class="xl:col-span-1">
            <div class="bg-gray-900 border border-gray-800 rounded-2xl md:rounded-3xl shadow-2xl p-5 md:p-6 lg:p-8 h-full flex flex-col">
                <div class="flex items-center justify-between mb-5 md:mb-6 lg:mb-8">
                    <h2 class="text-base md:text-lg lg:text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2 md:gap-3">
                        <i class="fas fa-user-plus text-blue-500 text-sm md:text-base" aria-hidden="true"></i> Siswa Baru
                    </h2>
                    <a href="{{ route('guru.siswa') }}" aria-label="Kelola data siswa baru" class="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors duration-300">Kelola &rarr;</a>
                </div>

                <div class="space-y-3 md:space-y-4 flex-1">
                    @forelse($latestSiswas as $ls)
                    <div class="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-950/50 border border-gray-800 rounded-xl md:rounded-2xl hover:border-blue-500/50 transition-all duration-300 group hover:bg-gray-950/80">
                        <div class="w-10 h-10 md:w-12 md:h-12 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center text-blue-400 text-sm md:text-base font-black group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                            {{ substr($ls->nama, 0, 1) }}
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="text-xs md:text-sm font-black text-white truncate">{{ $ls->nama }}</h4>
                            <p class="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">{{ $ls->kelas->nama ?? 'No Class' }}</p>
                        </div>
                        <div class="text-[8px] md:text-[9px] font-black text-gray-600 uppercase tracking-widest shrink-0">
                            {{ $ls->created_at->diffForHumans() }}
                        </div>
                    </div>
                    @empty
                    <div class="text-center py-8 md:py-12">
                        <div class="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-user-graduate text-2xl text-gray-600"></i>
                        </div>
                        <p class="text-center text-gray-600 font-black uppercase text-xs">Belum ada siswa</p>
                    </div>
                    @endforelse
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
