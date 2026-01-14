@extends('layouts.app')

@section('title', 'Dashboard Guru')

@section('content')
<div class="p-6 text-white min-h-screen">
    <div class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
            <h1 class="text-3xl font-black text-white uppercase tracking-tighter">Panel Monitoring</h1>
            <p class="text-gray-400 mt-1 font-medium italic">"SMK Negeri 1 Surabaya &bull; Mitra Industri Hub"</p>
        </div>
        
        <div class="flex gap-2 bg-gray-900/80 p-2 rounded-2xl border border-gray-700 backdrop-blur-sm">
            <button @click="showSwitchModal = true; switchRoleLabel = 'Siswa'" 
               class="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 {{ Request::routeIs('dashboard.siswa') ? 'bg-cyan-500 text-white shadow-xl shadow-cyan-500/20' : 'text-gray-500 hover:text-white hover:bg-gray-800' }}">
                View Siswa
            </button>
            <a href="{{ route('dashboard.guru') }}" 
               class="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 {{ Request::routeIs('dashboard.guru') ? 'bg-cyan-500 text-white shadow-xl shadow-cyan-500/20' : 'text-gray-500 hover:text-white hover:bg-gray-800' }}">
                View Guru
            </a>
        </div>
    </div>

    <!-- Cards Statistik (Ultra Premium Grid) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div class="bg-gray-800/40 p-8 rounded-[2.5rem] border border-gray-700/50 relative overflow-hidden group shadow-2xl backdrop-blur-md">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-blue-500 opacity-5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Total Siswa Aktif</p>
            <div class="flex items-end gap-3">
                <h3 class="text-5xl font-black text-white transition-all group-hover:text-blue-400">{{ $stats['totalSiswa'] }}</h3>
                <span class="text-xs font-bold text-gray-600 mb-2">Talenta</span>
            </div>
            <div class="mt-6 flex items-center gap-2">
                <div class="h-1 flex-1 bg-gray-900 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500 w-full"></div>
                </div>
                <i class="fas fa-user-graduate text-blue-500/50 text-xs"></i>
            </div>
        </div>

        <div class="bg-gray-800/40 p-8 rounded-[2.5rem] border border-gray-700/50 relative overflow-hidden group shadow-2xl backdrop-blur-md">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500 opacity-5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Mitra Industri</p>
            <div class="flex items-end gap-3">
                <h3 class="text-5xl font-black text-white transition-all group-hover:text-emerald-400">{{ $stats['totalDudi'] }}</h3>
                <span class="text-xs font-bold text-gray-600 mb-2">DUDI</span>
            </div>
            <div class="mt-6 flex items-center gap-2">
                <div class="h-1 flex-1 bg-gray-900 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-500 w-[70%]"></div>
                </div>
                <i class="fas fa-industry text-emerald-500/50 text-xs"></i>
            </div>
        </div>

        <div class="bg-gray-800/40 p-8 rounded-[2.5rem] border border-gray-700/50 relative overflow-hidden group shadow-2xl backdrop-blur-md">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-purple-500 opacity-5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Penempatan Magang</p>
            <div class="flex items-end gap-3">
                <h3 class="text-5xl font-black text-white transition-all group-hover:text-purple-400">{{ $stats['totalMagang'] }}</h3>
                <span class="text-xs font-bold text-gray-600 mb-2">Aktif</span>
            </div>
            <div class="mt-6 flex items-center gap-2">
                <div class="h-1 flex-1 bg-gray-900 rounded-full overflow-hidden">
                    <div class="h-full bg-purple-500 w-[85%]"></div>
                </div>
                <i class="fas fa-briefcase text-purple-500/50 text-xs"></i>
            </div>
        </div>

        <div class="bg-gray-800/40 p-8 rounded-[2.5rem] border border-gray-700/50 relative overflow-hidden group shadow-2xl backdrop-blur-md">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-rose-500 opacity-5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Laporan Logbook</p>
            <div class="flex items-end gap-3">
                <h3 class="text-5xl font-black text-white transition-all group-hover:text-rose-400">{{ $stats['totalLogbook'] }}</h3>
                <span class="text-xs font-bold text-gray-600 mb-2">Entri</span>
            </div>
            <div class="mt-6 flex items-center gap-2">
                <div class="h-1 flex-1 bg-gray-900 rounded-full overflow-hidden">
                    <div class="h-full bg-rose-500 w-[60%]"></div>
                </div>
                <i class="fas fa-book text-rose-500/50 text-xs"></i>
            </div>
        </div>
    </div>

    <!-- Tabel Magang Terbaru (Premium Table) -->
    <div class="bg-gray-900/50 border border-gray-700/50 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-black text-white flex items-center tracking-tighter uppercase">
                <i class="fas fa-bolt mr-3 text-yellow-500"></i> Aktivitas Terbaru
            </h2>
            <a href="{{ route('guru.magang') }}" class="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em] hover:text-cyan-400 transition">Lihat Semua Data &rarr;</a>
        </div>
        
        @if(count($magangs) == 0)
            <div class="py-20 text-center text-gray-600 flex flex-col items-center">
                <i class="fas fa-inbox text-5xl mb-4 opacity-20"></i>
                <p class="font-bold italic">Belum ada aktivitas magang yang tercatat di sistem.</p>
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-gray-300">
                    <thead class="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-gray-800">
                        <tr>
                            <th class="p-4">Identitas Siswa</th>
                            <th class="p-4">Lokasi DUDI</th>
                            <th class="p-4">Periode</th>
                            <th class="p-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-800/50">
                        @foreach($magangs as $row)
                            <tr class="hover:bg-gray-800/30 transition group">
                                <td class="p-4">
                                    <div class="text-white font-black group-hover:text-cyan-400 transition">{{ $row['nama_siswa'] }}</div>
                                    <div class="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Siswa Magang Internal</div>
                                </td>
                                <td class="p-4 text-gray-400 font-medium italic">{{ $row['dudi'] }}</td>
                                <td class="p-4 text-xs font-bold text-gray-500 tracking-tighter">
                                    @if($row['tanggal_mulai'])
                                        {{ \Carbon\Carbon::parse($row['tanggal_mulai'])->format('M Y') }} - 
                                        {{ $row['tanggal_selesai'] ? \Carbon\Carbon::parse($row['tanggal_selesai'])->format('M Y') : 'Sekarang' }}
                                    @else
                                        Tiap Semester
                                    @endif
                                </td>
                                <td class="p-4 text-center">
                                    <span class="px-3 py-1 bg-gray-800 border-b-2 
                                        @if($row['status'] == 'Aktif') border-green-500 text-green-400
                                        @elseif($row['status'] == 'Selesai') border-blue-500 text-blue-400
                                        @else border-yellow-500 text-yellow-500 @endif
                                        rounded-lg text-[10px] font-black uppercase tracking-widest">
                                        {{ $row['status'] }}
                                    </span>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </div>
</div>
@endsection
