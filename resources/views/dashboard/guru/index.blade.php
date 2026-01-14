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

    <!-- Cards Statistik (Ultra Premium Grid) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div class="bg-gray-800/40 p-6 md:p-8 rounded-[2.5rem] border border-gray-700/50 relative overflow-hidden group shadow-2xl backdrop-blur-md hover:border-blue-500/30 transition-all duration-500 hover:scale-[1.02]">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-blue-500 opacity-5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <p class="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Total Siswa Aktif</p>
            <div class="flex items-end gap-3">
                <h3 class="text-4xl md:text-5xl font-black text-white transition-all group-hover:text-blue-400">{{ $stats['totalSiswa'] }}</h3>
                <span class="text-[10px] font-bold text-gray-600 mb-2 uppercase">Talenta</span>
            </div>
            <div class="mt-6 flex items-center gap-2">
                <div class="h-1 flex-1 bg-gray-950 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500 w-full rounded-full"></div>
                </div>
                <i class="fas fa-user-graduate text-blue-500/50 text-xs"></i>
            </div>
        </div>

        <div class="bg-gray-800/40 p-6 md:p-8 rounded-[2.5rem] border border-gray-700/50 relative overflow-hidden group shadow-2xl backdrop-blur-md hover:border-emerald-500/30 transition-all duration-500 hover:scale-[1.02]">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500 opacity-5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <p class="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Mitra Industri</p>
            <div class="flex items-end gap-3">
                <h3 class="text-4xl md:text-5xl font-black text-white transition-all group-hover:text-emerald-400">{{ $stats['totalDudi'] }}</h3>
                <span class="text-[10px] font-bold text-gray-600 mb-2 uppercase">DUDI</span>
            </div>
            <div class="mt-6 flex items-center gap-2">
                <div class="h-1 flex-1 bg-gray-950 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-500 w-[70%] rounded-full"></div>
                </div>
                <i class="fas fa-industry text-emerald-500/50 text-xs"></i>
            </div>
        </div>

        <div class="bg-gray-800/40 p-6 md:p-8 rounded-[2.5rem] border border-gray-700/50 relative overflow-hidden group shadow-2xl backdrop-blur-md hover:border-purple-500/30 transition-all duration-500 hover:scale-[1.02]">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-purple-500 opacity-5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <p class="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Penempatan Magang</p>
            <div class="flex items-end gap-3">
                <h3 class="text-4xl md:text-5xl font-black text-white transition-all group-hover:text-purple-400">{{ $stats['totalMagang'] }}</h3>
                <span class="text-[10px] font-bold text-gray-600 mb-2 uppercase">Aktif</span>
            </div>
            <div class="mt-6 flex items-center gap-2">
                <div class="h-1 flex-1 bg-gray-950 rounded-full overflow-hidden">
                    <div class="h-full bg-purple-500 w-[85%] rounded-full"></div>
                </div>
                <i class="fas fa-briefcase text-purple-500/50 text-xs"></i>
            </div>
        </div>

        <div class="bg-gray-800/40 p-6 md:p-8 rounded-[2.5rem] border border-gray-700/50 relative overflow-hidden group shadow-2xl backdrop-blur-md hover:border-rose-500/30 transition-all duration-500 hover:scale-[1.02]">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-rose-500 opacity-5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <p class="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Laporan Logbook</p>
            <div class="flex items-end gap-3">
                <h3 class="text-4xl md:text-5xl font-black text-white transition-all group-hover:text-rose-400">{{ $stats['totalLogbook'] }}</h3>
                <span class="text-[10px] font-bold text-gray-600 mb-2 uppercase">Entri</span>
            </div>
            <div class="mt-6 flex items-center gap-2">
                <div class="h-1 flex-1 bg-gray-950 rounded-full overflow-hidden">
                    <div class="h-full bg-rose-500 w-[60%] rounded-full"></div>
                </div>
                <i class="fas fa-book text-rose-500/50 text-xs"></i>
            </div>
        </div>
    </div>

    <!-- Tabel Magang Terbaru (Premium Table) -->
    <div class="bg-gray-950 border border-gray-800 rounded-[2.5rem] shadow-3xl relative overflow-hidden backdrop-blur-3xl">
        <div class="p-6 md:p-10 border-b border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 class="text-xl md:text-2xl font-black text-white flex items-center tracking-tighter uppercase leading-none">
                <i class="fas fa-bolt mr-3 text-yellow-500 animate-pulse"></i> Aktivitas Terbaru
            </h2>
            <a href="{{ route('guru.magang') }}" class="text-[9px] md:text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em] hover:text-cyan-400 transition-all group">
                Lihat Semua <span class="group-hover:ml-1 transition-all">Data &rarr;</span>
            </a>
        </div>
        
        @if(count($magangs) == 0)
            <div class="py-24 text-center text-gray-700 flex flex-col items-center">
                <div class="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-4 border border-gray-800">
                    <i class="fas fa-inbox text-3xl opacity-20"></i>
                </div>
                <p class="font-bold italic text-sm tracking-tight opacity-50 uppercase">Belum ada aktivitas magang yang tercatat.</p>
            </div>
        @else
            <div class="overflow-x-auto">
                <div class="min-w-[850px]">
                    <table class="w-full text-left text-sm text-gray-400">
                        <thead class="text-[10px] font-black uppercase tracking-widest text-gray-600 bg-gray-900/50">
                            <tr>
                                <th class="p-6">Identitas Siswa</th>
                                <th class="p-6">Mitra Industri / Lokasi</th>
                                <th class="p-6">Periode</th>
                                <th class="p-6 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-800/50">
                            @foreach($magangs as $row)
                                <tr class="hover:bg-gray-900/40 transition-all duration-300 group">
                                    <td class="p-6">
                                        <div class="flex items-center gap-4">
                                            <div class="w-10 h-10 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center text-cyan-500 font-black text-xs group-hover:bg-cyan-600 group-hover:text-white transition-all duration-500">
                                                {{ substr($row->siswa->nama ?? 'S', 0, 1) }}
                                            </div>
                                            <div>
                                                <div class="text-white font-black group-hover:text-cyan-400 transition-colors">{{ $row->siswa->nama ?? 'Siswa' }}</div>
                                                <div class="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">NIS: {{ $row->siswa->nis ?? '-' }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="p-6">
                                        <div class="text-gray-300 font-bold tracking-tight text-sm">{{ $row->dudi->nama ?? '-' }}</div>
                                        <div class="text-[10px] text-gray-600 font-medium italic truncate max-w-[200px] mt-0.5">{{ $row->dudi->alamat ?? '-' }}</div>
                                    </td>
                                    <td class="p-6">
                                        <div class="text-xs font-black text-gray-500 tracking-tighter uppercase flex flex-col">
                                            @if($row->tanggal_mulai)
                                                <span class="text-gray-400">{{ \Carbon\Carbon::parse($row->tanggal_mulai)->format('d M Y') }}</span>
                                                <span class="text-[9px] text-gray-600 mt-0.5 opacity-50">&rarr; {{ $row->tanggal_selesai ? \Carbon\Carbon::parse($row->tanggal_selesai)->format('M Y') : 'Hingga Selesai' }}</span>
                                            @else
                                                Kontrak Tahunan
                                            @endif
                                        </div>
                                    </td>
                                    <td class="p-6 text-center">
                                        <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-950 border border-gray-800 rounded-xl group-hover:border-cyan-500/40 transition-all">
                                            <div class="w-1.5 h-1.5 rounded-full 
                                                @if($row->status == 'Aktif') bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]
                                                @elseif($row->status == 'Selesai') bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]
                                                @else bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)] @endif"></div>
                                            <span class="text-[10px] font-black uppercase tracking-widest leading-none
                                                @if($row->status == 'Aktif') text-green-400
                                                @elseif($row->status == 'Selesai') text-blue-400
                                                @else text-yellow-500 @endif">
                                                {{ $row->status }}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        @endif
    </div>
</div>
@endsection
