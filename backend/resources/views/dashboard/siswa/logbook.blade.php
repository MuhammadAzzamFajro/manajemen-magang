@extends('layouts.blade_app')

@section('title', 'Logbook Saya - Siswa')

@section('content')
<div class="p-4 md:p-6 lg:p-8" x-data="{ showModal: false }">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
        <div>
            <h1 class="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Jurnal Magang</h1>
            <p class="text-gray-400 text-sm">Dokumentasikan progress harian Anda di sini</p>
        </div>
        <button class="w-full md:w-auto px-6 py-3 bg-cyan-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-500 transition shadow-2xl shadow-cyan-600/40 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2" @click="showModal = true">
            <i class="fas fa-plus-circle"></i> Catat Jurnal
        </button>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div class="bg-gray-800/50 p-4 md:p-5 rounded-2xl border border-gray-700/50">
            <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Entri</p>
            <p class="text-xl md:text-2xl font-black text-white">{{ count($logbooks) }}</p>
        </div>
        <div class="bg-gray-800/50 p-4 md:p-5 rounded-2xl border border-gray-700/50">
            <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Disetujui</p>
            <p class="text-xl md:text-2xl font-black text-green-400">{{ $logbooks->where('status', 'Setuju')->count() }}</p>
        </div>
        <div class="bg-gray-800/50 p-4 md:p-5 rounded-2xl border border-gray-700/50">
            <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Menunggu</p>
            <p class="text-xl md:text-2xl font-black text-yellow-500">{{ $logbooks->where('status', 'Menunggu')->count() }}</p>
        </div>
        <div class="bg-gray-800/50 p-4 md:p-5 rounded-2xl border border-gray-700/50">
            <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Ditolak</p>
            <p class="text-xl md:text-2xl font-black text-red-400">{{ $logbooks->where('status', 'Tolak')->count() }}</p>
        </div>
    </div>

    <!-- Modal Buat Logbook -->
    <template x-teleport="body">
        <div x-show="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" x-cloak>
            <div class="absolute inset-0 bg-black/80 backdrop-blur-md" @click="showModal = false"></div>
            <div class="relative bg-gray-800 border border-gray-700 w-full max-w-xl rounded-[2.5rem] shadow-2xl p-8 md:p-10 overflow-y-auto max-h-[90vh]">
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h2 class="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Entri Jurnal Baru</h2>
                        <p class="text-gray-400 text-xs mt-1">Isi detail kegiatan magang Anda hari ini</p>
                    </div>
                    <button @click="showModal = false" class="text-gray-500 hover:text-white transition-colors"><i class="fas fa-times text-xl"></i></button>
                </div>

                <form action="{{ route('siswa.logbook.store') }}" method="POST" class="space-y-6">
                    @csrf
                    <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Tanggal</label>
                        <input type="date" name="tanggal" value="{{ date('Y-m-d') }}" class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition">
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Nama Kegiatan</label>
                        <input type="text" name="kegiatan" class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition" placeholder="Misal: Maintenance Server atau Desain UI" required>
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Uraian Pekerjaan</label>
                        <textarea name="deskripsi" class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition" rows="5" placeholder="Jelaskan secara detail apa yang Anda lakukan..." required></textarea>
                    </div>
                    <div class="flex gap-4 pt-4">
                        <button type="button" class="flex-1 py-4 bg-gray-700 text-gray-300 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-600 transition" @click="showModal = false">Batal</button>
                        <button type="submit" class="flex-1 py-4 bg-cyan-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-cyan-600/40 hover:bg-cyan-500 transition">Kirim Laporan</button>
                    </div>
                </form>
            </div>
        </div>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        @forelse($logbooks as $log)
        <div class="bg-gray-800/40 border border-gray-700/50 p-5 md:p-6 rounded-2xl hover:bg-gray-800/80 transition group relative overflow-hidden backdrop-blur-sm">
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gray-900 border border-gray-700 rounded-xl flex flex-col items-center justify-center group-hover:bg-cyan-600 group-hover:border-cyan-500 transition-all duration-500">
                        <span class="text-xs font-black uppercase tracking-tighter text-gray-500 group-hover:text-white">{{ \Carbon\Carbon::parse($log->tanggal)->format('M') }}</span>
                        <span class="text-lg font-black text-white">{{ \Carbon\Carbon::parse($log->tanggal)->format('d') }}</span>
                    </div>
                    <div>
                        <h4 class="text-lg font-black text-white leading-tight group-hover:text-cyan-400 transition">{{ $log->kegiatan }}</h4>
                        <p class="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">{{ \Carbon\Carbon::parse($log->tanggal)->format('d M Y') }}</p>
                    </div>
                </div>
                <div class="flex flex-col items-end">
                    <span class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border
                        @if($log->status == 'Setuju') bg-green-500/10 text-green-400 border-green-500/20
                        @elseif($log->status == 'Tolak') bg-red-500/10 text-red-500 border-red-500/20
                        @else bg-yellow-500/10 text-yellow-500 border-yellow-500/20 @endif">
                        {{ $log->status }}
                    </span>
                </div>
            </div>
            
            <div class="bg-gray-900/50 p-4 rounded-xl border border-gray-700/30 mb-4">
                <p class="text-gray-400 text-sm leading-relaxed italic line-clamp-2">
                    "{{ $log->deskripsi }}"
                </p>
            </div>

            <div class="flex items-center justify-between text-[10px] text-gray-600 font-black uppercase tracking-widest">
                <div class="flex gap-4">
                    <span><i class="fas fa-history mr-1 opacity-50"></i> 08:00 - 17:00</span>
                    <span><i class="fas fa-check-circle mr-1 opacity-50 text-cyan-500"></i> Mandiri</span>
                </div>
                @if($log->status == 'Setuju')
                    <span class="text-green-500/50"><i class="fas fa-shield-alt mr-1"></i> Verified</span>
                @endif
            </div>
        </div>
        @empty
        <div class="col-span-full py-32 text-center bg-gray-900/50 rounded-[4rem] border-4 border-dashed border-gray-800">
            <div class="mb-6 opacity-10"><i class="fas fa-pen-nib text-[8rem]"></i></div>
            <h2 class="text-2xl font-black text-white uppercase tracking-tighter">Lembaran Kosong</h2>
            <p class="text-gray-500 max-w-xs mx-auto mt-2">Anda belum mencatat kegiatan magang hari ini. Ayo buat laporan pertama Anda!</p>
        </div>
        @endforelse
    </div>
</div>
@endsection
