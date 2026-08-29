@extends('layouts.blade_app')

@section('title', 'Hasil Pencarian')

@section('content')
<div class="p-4 md:p-6 lg:p-8 text-white">
    <div class="mb-8 flex items-center justify-between gap-4">
        <div>
            <h1 class="text-2xl md:text-3xl font-black tracking-tighter leading-none mb-2">
                Hasil Pencarian
            </h1>
            <p class="text-gray-400 text-sm">
                Kata kunci:
                <span class="font-bold text-white">"{{ $query }}"</span>
            </p>
        </div>

    </div>

    @if($logbooks->isEmpty() && $magangs->isEmpty() && $dudis->isEmpty())
        <div class="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center">
            <p class="text-gray-400 text-sm">Tidak ada hasil yang cocok dengan kata kunci tersebut.</p>
        </div>
        @return
    @endif

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <!-- Logbook -->
        <div class="lg:col-span-1 space-y-4">
            <h2 class="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                <i class="fas fa-book text-yellow-500"></i> Logbook
            </h2>
            <div class="space-y-4">
                @forelse($logbooks as $log)
                    <div class="bg-gray-900/80 border border-gray-700/60 rounded-2xl p-5 shadow-lg shadow-black/20 hover:border-yellow-500/40 transition">
                        <div class="flex items-start justify-between gap-4 mb-3">
                            <div class="min-w-0">
                                <p class="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-1">Logbook</p>
                                <h3 class="font-black text-white leading-tight truncate">{{ $log->kegiatan }}</h3>
                            </div>
                            <span class="shrink-0 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                {{ \Illuminate\Support\Carbon::parse($log->tanggal)->format('d M Y') }}
                            </span>
                        </div>
                        @if(isset($log->siswa))
                            <p class="text-xs text-gray-400 mb-2">
                                {{ $log->siswa->nama }}
                                @if(isset($log->siswa->kelas))
                                    • {{ $log->siswa->kelas->nama ?? $log->siswa->kelas->kelas ?? '' }}
                                @endif
                            </p>
                        @endif
                        @if($log->deskripsi)
                            <p class="text-xs text-gray-500 line-clamp-2">{{ $log->deskripsi }}</p>
                        @endif
                    </div>
                @empty
                    <div class="bg-gray-900/60 border border-dashed border-gray-700 rounded-2xl p-5 text-xs text-gray-500 text-center">Tidak ada logbook terkait.</div>
                @endforelse
            </div>
        </div>

        <!-- Magang -->
        <div class="lg:col-span-1 space-y-4">
            <h2 class="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                <i class="fas fa-briefcase text-cyan-500"></i> Magang
            </h2>
            <div class="space-y-4">
                @forelse($magangs as $mg)
                    <div class="bg-gray-900/80 border border-gray-700/60 rounded-2xl p-5 shadow-lg shadow-black/20 hover:border-cyan-500/40 transition">
                        <div class="flex items-start justify-between gap-4 mb-3">
                            <div class="min-w-0">
                                <p class="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Magang</p>
                                <h3 class="font-black text-white leading-tight truncate">{{ $mg->judul_magang }}</h3>
                            </div>
                            <span class="shrink-0 text-[10px] font-black uppercase tracking-widest text-green-400">
                                {{ $mg->status }}
                            </span>
                        </div>
                        <p class="text-xs text-gray-400 mb-2">
                            @if(isset($mg->siswa))
                                {{ $mg->siswa->nama }}
                                @if(isset($mg->siswa->kelas))
                                    • {{ $mg->siswa->kelas->nama ?? $mg->siswa->kelas->kelas ?? '' }}
                                @endif
                                <br>
                            @endif
                            @if(isset($mg->dudi))
                                Mitra: <span class="text-white font-medium">{{ $mg->dudi->nama }}</span>
                            @endif
                        </p>
                        @if($mg->deskripsi)
                            <p class="text-xs text-gray-500 line-clamp-2">{{ $mg->deskripsi }}</p>
                        @endif
                    </div>
                @empty
                    <div class="bg-gray-900/60 border border-dashed border-gray-700 rounded-2xl p-5 text-xs text-gray-500 text-center">Tidak ada magang terkait.</div>
                @endforelse
            </div>
        </div>

        <!-- DUDI -->
        <div class="lg:col-span-1 space-y-4">
            <h2 class="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                <i class="fas fa-building text-blue-500"></i> Mitra DUDI
            </h2>
            <div class="space-y-4">
                @forelse($dudis as $dudi)
                    <div class="bg-gray-900/80 border border-gray-700/60 rounded-2xl p-5 shadow-lg shadow-black/20 hover:border-blue-500/40 transition">
                        <p class="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Mitra</p>
                        <p class="font-black text-white mb-1 truncate">{{ $dudi->nama }}</p>
                        @if($dudi->bidang_usaha)
                            <p class="text-[11px] uppercase tracking-widest text-cyan-400 mb-1">
                                {{ $dudi->bidang_usaha }}
                            </p>
                        @endif
                        @if($dudi->alamat)
                            <p class="text-xs text-gray-500">{{ $dudi->alamat }}</p>
                        @endif
                    </div>
                @empty
                    <div class="bg-gray-900/60 border border-dashed border-gray-700 rounded-2xl p-5 text-xs text-gray-500 text-center">Tidak ada mitra DUDI terkait.</div>
                @endforelse
            </div>
        </div>
    </div>
</div>
@endsection

