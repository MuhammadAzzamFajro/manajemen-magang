@extends('layouts.app')

@section('title', 'Logbook - Guru')

@section('content')
<div class="p-4 md:p-8">
    <div class="mb-10">
        <h1 class="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight">Verifikasi Logbook</h1>
        <p class="text-gray-400 font-medium text-sm">Tinjau dan berikan feedback pada laporan harian siswa</p>
    </div>

    <div class="grid grid-cols-1 gap-6">
        @forelse($logbooks as $log)
        <div class="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-cyan-500/30 transition shadow-xl group">
            <div class="flex-1">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-cyan-600/20">
                        {{ substr($log->siswa->nama ?? 'S', 0, 1) }}
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-cyan-400 text-xs font-black uppercase tracking-widest">{{ $log->siswa->nama ?? 'Siswa Anonim' }}</span>
                            <span class="text-gray-600 text-[10px] font-black uppercase tracking-widest bg-gray-900 px-2 py-0.5 rounded-full border border-gray-700">{{ $log->siswa->nis ?? '-' }}</span>
                        </div>
                        <p class="text-[10px] text-gray-500 font-bold mt-0.5"><i class="fas fa-calendar-day mr-1"></i> {{ \Carbon\Carbon::parse($log->tanggal)->format('l, d F Y') }}</p>
                    </div>
                </div>
                <h3 class="text-xl font-black text-white mb-2 leading-tight group-hover:text-cyan-400 transition">{{ $log->kegiatan }}</h3>
                <div class="bg-gray-900/40 p-4 rounded-2xl border border-gray-700/30">
                    <p class="text-gray-400 text-sm leading-relaxed italic line-clamp-3">"{{ $log->deskripsi }}"</p>
                </div>
            </div>

            <div class="flex flex-row md:flex-col items-center md:items-end gap-4 w-full md:w-auto border-t md:border-t-0 border-gray-700 pt-4 md:pt-0">
                <div class="mr-auto md:mr-0">
                    <span class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                        @if($log->status == 'Setuju') bg-green-500/10 text-green-400 border-green-500/20
                        @elseif($log->status == 'Tolak') bg-red-500/10 text-red-400 border-red-500/20
                        @else bg-yellow-500/10 text-yellow-500 border-yellow-500/20 @endif">
                        <i class="fas @if($log->status == 'Setuju') fa-check-circle @elseif($log->status == 'Tolak') fa-times-circle @else fa-hourglass-half @endif mr-1"></i>
                        {{ $log->status }}
                    </span>
                </div>
                
                <div x-data="{ confirming: null }" class="flex gap-2 w-full md:w-auto">
                    @if($log->status == 'Menunggu')
                    <form action="{{ route('guru.logbook.verify', $log) }}" method="POST" class="flex-1 md:flex-none">
                        @csrf
                        <input type="hidden" name="status" value="Setuju">
                        <button type="submit" class="w-full px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition shadow-lg shadow-green-600/20 active:scale-95">Setujui</button>
                    </form>
                    <form action="{{ route('guru.logbook.verify', $log) }}" method="POST" class="flex-1 md:flex-none">
                        @csrf
                        <input type="hidden" name="status" value="Tolak">
                        <button type="submit" class="w-full px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition shadow-lg shadow-red-600/20 active:scale-95">Tolak</button>
                    </form>
                    @else
                    <button disabled class="w-full px-5 py-2.5 bg-gray-700 text-gray-500 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-not-allowed opacity-50 border border-gray-600">Terarsip</button>
                    @endif
                </div>
            </div>
        </div>
        @empty
        <div class="flex flex-col items-center justify-center p-24 bg-gray-800/30 border-4 border-dashed border-gray-700 rounded-[3rem]">
            <div class="w-20 h-20 bg-gray-800 rounded-3xl flex items-center justify-center text-gray-600 mb-6 border border-gray-700">
                <i class="fas fa-coffee text-3xl"></i>
            </div>
            <h2 class="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Semua Beres!</h2>
            <p class="text-gray-500 text-center max-w-xs">Belum ada logbook baru yang perlu diverifikasi. Waktunya istirahat sejenak.</p>
        </div>
        @endforelse
    </div>
</div>
@endsection
