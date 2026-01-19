@extends('layouts.blade_app')

@section('title', 'Data Magang - Guru')

@section('content')
<div class="p-4 md:p-8" x-data="{ selectedMagang: null, showAddModal: false }">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
            <h1 class="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Monitoring Magang</h1>
            <p class="text-gray-400 mt-1 font-medium text-sm">Monitoring status magang siswa seluruhnya</p>
        </div>
        <button class="w-full md:w-auto px-8 py-4 bg-cyan-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-500 transition shadow-2xl shadow-cyan-600/40 flex items-center justify-center gap-2" @click="showAddModal = true">
            <i class="fas fa-plus"></i> Tambah Penempatan
        </button>
    </div>

    <div class="overflow-x-auto bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl">
        <div class="min-w-[900px]">
            <table class="w-full text-left text-sm text-gray-300">
            <thead class="bg-gray-800 text-gray-200 uppercase text-xs">
                <tr>
                    <th class="p-4">Siswa</th>
                    <th class="p-4">DUDI</th>
                    <th class="p-4">Status</th>
                    <th class="p-4">Periode</th>
                    <th class="p-4">Aksi</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
                @forelse($magangs as $magang)
                <tr class="hover:bg-gray-800/50 transition">
                    <td class="p-4">
                        <div class="text-white font-black group-hover:text-cyan-400 transition">{{ $magang->siswa->nama ?? 'Siswa' }}</div>
                        <div class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{{ $magang->siswa->nis ?? '-' }}</div>
                    </td>
                    <td class="p-4">
                        <div class="text-white font-bold">{{ $magang->dudi->nama ?? '-' }}</div>
                        <div class="text-[10px] text-gray-500 italic">{{ $magang->judul_magang }}</div>
                    </td>
                    <td class="p-4">
                        <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                            @if($magang->status == 'Aktif') bg-green-500/10 text-green-400 border border-green-500/20
                            @elseif($magang->status == 'Selesai') bg-blue-500/10 text-blue-400 border border-blue-500/20
                            @elseif($magang->status == 'Pending') bg-orange-500/10 text-orange-400 border border-orange-500/20 animate-pulse
                            @else bg-red-500/10 text-red-500 border border-red-500/20 @endif">
                            {{ $magang->status }}
                        </span>
                    </td>
                    <td class="p-4">
                        <div class="text-xs font-medium text-gray-400">
                            {{ $magang->tanggal_mulai ? \Carbon\Carbon::parse($magang->tanggal_mulai)->format('d M Y') : '-' }}
                        </div>
                    </td>
                    <td class="p-4">
                        <div class="flex items-center gap-2">
                            @if($magang->status == 'Pending')
                                <form action="{{ route('guru.magang.verify', $magang) }}" method="POST" class="inline">
                                    @csrf
                                    <input type="hidden" name="status" value="Setuju">
                                    <button type="submit" class="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition shadow-lg shadow-green-600/20">Setujui</button>
                                </form>
                                <form action="{{ route('guru.magang.verify', $magang) }}" method="POST" class="inline">
                                    @csrf
                                    <input type="hidden" name="status" value="Tolak">
                                    <button type="submit" class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition shadow-lg shadow-red-600/20">Tolak</button>
                                </form>
                            @else
                                <button class="text-cyan-400 hover:text-cyan-300 font-black uppercase text-[10px] tracking-widest" 
                                        @click="selectedMagang = {{ json_encode($magang) }}">
                                    Detail
                                </button>
                            @endif
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="5" class="p-8 text-center text-gray-500">Belum ada data magang.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <!-- Detail Modal -->
    <template x-teleport="body">
        <div x-show="selectedMagang" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="selectedMagang = null"></div>
            <div class="relative bg-gray-800 border border-gray-700 w-full max-w-lg rounded-2xl shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
                <div class="flex justify-between items-start mb-6">
                    <h2 class="text-2xl font-black text-white">Detail Penempatan</h2>
                    <button @click="selectedMagang = null" class="text-gray-500 hover:text-white"><i class="fas fa-times"></i></button>
                </div>
                
                <div class="space-y-6" x-if="selectedMagang">
                    <div class="bg-gray-900/50 p-4 rounded-xl">
                        <p class="text-[10px] font-black text-gray-500 uppercase mb-1">Nama Siswa</p>
                        <p class="text-white font-bold" x-text="selectedMagang.siswa ? selectedMagang.siswa.nama : '-'"></p>
                    </div>
                    
                    <div class="bg-gray-900/50 p-4 rounded-xl">
                        <p class="text-[10px] font-black text-gray-500 uppercase mb-1">Perusahaan (DUDI)</p>
                        <p class="text-white font-bold" x-text="selectedMagang.dudi ? selectedMagang.dudi.nama : '-'"></p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-gray-900/50 p-4 rounded-xl">
                            <p class="text-[10px] font-black text-gray-500 uppercase mb-1">Tanggal Mulai</p>
                            <p class="text-white font-bold" x-text="selectedMagang.tanggal_mulai"></p>
                        </div>
                        <div class="bg-gray-900/50 p-4 rounded-xl">
                            <p class="text-[10px] font-black text-gray-500 uppercase mb-1">Status</p>
                            <span class="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-md text-xs font-bold" x-text="selectedMagang.status"></span>
                        </div>
                    </div>

                    <div class="bg-gray-900/50 p-4 rounded-xl">
                        <p class="text-[10px] font-black text-gray-500 uppercase mb-1">Deskripsi Magang</p>
                        <p class="text-gray-300 text-sm italic" x-text="selectedMagang.deskripsi || 'Tidak ada deskripsi'"></p>
                    </div>
                </div>

                <div class="mt-8">
                    <button class="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition shadow-lg shadow-cyan-600/20" @click="selectedMagang = null">Tutup</button>
                </div>
            </div>
        </div>
    </template>

    <!-- Modal Tambah Penempatan -->
    <template x-teleport="body">
        <div x-show="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" x-cloak>
            <div class="absolute inset-0 bg-black/80 backdrop-blur-md" @click="showAddModal = false"></div>
            <div class="relative bg-gray-800 border-2 border-gray-700 w-full max-w-xl rounded-[3rem] shadow-2xl p-12 overflow-y-auto max-h-[90vh]">
                <div class="flex justify-between items-start mb-10">
                    <div>
                        <h2 class="text-3xl font-black text-white uppercase tracking-tighter">Penempatan Baru</h2>
                        <p class="text-gray-400 text-xs mt-1">Lengkapi data untuk menempatkan siswa ke mitra industri.</p>
                    </div>
                </div>

                <form action="{{ route('guru.magang.store') }}" method="POST" class="space-y-6">
                    @csrf
                    <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Siswa</label>
                        <select name="siswa_id" class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition appearance-none" required>
                            <option value="">Pilih Siswa</option>
                            @foreach($siswas as $s)
                                <option value="{{ $s->id }}">{{ $s->nama }} ({{ $s->nis }})</option>
                            @endforeach
                        </select>
                    </div>

                    <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Mitra Industri (DUDI)</label>
                        <select name="dudi_id" class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition appearance-none" required>
                            <option value="">Pilih Perusahaan</option>
                            @foreach($dudis as $d)
                                <option value="{{ $d->id }}">{{ $d->nama }}</option>
                            @endforeach
                        </select>
                    </div>

                    <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Judul / Posisi Magang</label>
                        <input type="text" name="judul_magang" class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition" placeholder="Contoh: Web Developer Intern" required>
                    </div>

                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Tanggal Mulai</label>
                            <input type="date" name="tanggal_mulai" class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition" required>
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Durasi</label>
                            <input type="text" value="6 Bulan" disabled class="w-full bg-gray-800 border border-gray-700 rounded-2xl px-6 py-5 text-gray-500 focus:outline-none transition">
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Deskripsi Tugas</label>
                        <textarea name="deskripsi" rows="3" class="w-full bg-gray-900 border border-gray-700 rounded-[2rem] px-6 py-5 text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition" placeholder="Tugas utama siswa selama magang..."></textarea>
                    </div>

                    <div class="flex gap-4 pt-6">
                        <button type="button" class="flex-1 py-5 bg-gray-700 text-gray-300 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-600 transition" @click="showAddModal = false">Batal</button>
                        <button type="submit" class="flex-1 py-5 bg-cyan-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-cyan-600/40 hover:bg-cyan-500 transition">Simpan Penempatan</button>
                    </div>
                </form>
            </div>
        </div>
    </template>
</div>
@endsection
