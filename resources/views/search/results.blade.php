@extends('layouts.app')

@section('title', 'Hasil Pencarian')

@section('content')
<div class="p-2 md:p-4 text-white min-h-screen">
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
        <a href="{{ url()->previous() }}" class="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white">
            &larr; Kembali
        </a>
    </div>

    @if($logbooks->isEmpty() && $magangs->isEmpty() && $dudis->isEmpty())
        <div class="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center">
            <p class="text-gray-400 text-sm">Tidak ada hasil yang cocok dengan kata kunci tersebut.</p>
        </div>
        @return
    @endif

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Logbook -->
        <div class="lg:col-span-1 space-y-3">
            <h2 class="text-sm font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                <i class="fas fa-book text-yellow-500"></i> Logbook
            </h2>
            <div class="space-y-3">
                @forelse($logbooks as $log)
                    <div class="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-sm">
                        <div class="flex items-center justify-between mb-1">
                            <span class="font-bold text-white">
                                {{ $log->kegiatan }}
                            </span>
                            <span class="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                {{ \Illuminate\Support\Carbon::parse($log->tanggal)->format('d M Y') }}
                            </span>
                        </div>
                        @if(isset($log->siswa))
                            <p class="text-xs text-gray-400 mb-1">
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
                    <p class="text-xs text-gray-500">Tidak ada logbook terkait.</p>
                @endforelse
            </div>
        </div>

        <!-- Magang -->
        <div class="lg:col-span-1 space-y-3">
            <h2 class="text-sm font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                <i class="fas fa-briefcase text-cyan-500"></i> Magang
            </h2>
            <div class="space-y-3">
                @forelse($magangs as $mg)
                    <div class="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-sm">
                        <div class="flex items-center justify-between mb-1">
                            <span class="font-bold text-white">
                                {{ $mg->judul_magang }}
                            </span>
                            <span class="text-[10px] font-black uppercase tracking-widest text-green-400">
                                {{ $mg->status }}
                            </span>
                        </div>
                        <p class="text-xs text-gray-400 mb-1">
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
                    <p class="text-xs text-gray-500">Tidak ada magang terkait.</p>
                @endforelse
            </div>
        </div>

        <!-- DUDI -->
        <div class="lg:col-span-1 space-y-3">
            <h2 class="text-sm font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                <i class="fas fa-building text-blue-500"></i> Mitra DUDI
            </h2>
            <div class="space-y-3">
                @forelse($dudis as $dudi)
                    <div class="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-sm">
                        <p class="font-bold text-white mb-1">{{ $dudi->nama }}</p>
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
                    <p class="text-xs text-gray-500">Tidak ada mitra DUDI terkait.</p>
                @endforelse
            </div>
        </div>
    </div>
</div>
@endsection

