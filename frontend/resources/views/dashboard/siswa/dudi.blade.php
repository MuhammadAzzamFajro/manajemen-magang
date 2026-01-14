@extends('layouts.app')

@section('title', 'Eksplorasi DUDI - Siswa')

@section('content')
<div class="p-6" x-data="{ selectedDudi: null }">
    <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <h1 class="text-4xl font-black text-white uppercase tracking-tighter">Eksplorasi Mitra</h1>
            <p class="text-gray-400 mt-2 font-medium">Temukan tempat magang impian Anda di industri terbaik</p>
        </div>
        <div class="flex gap-2 bg-gray-900 p-2 rounded-2xl border border-gray-700">
            <button class="px-6 py-2.5 bg-cyan-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-cyan-600/20 transition-all">Semua</button>
            <button class="px-6 py-2.5 text-gray-500 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">Populer</button>
            <button class="px-6 py-2.5 text-gray-500 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">Terdekat</button>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        @forelse($dudis as $dudi)
        <div class="bg-gray-800/40 border border-gray-700/50 rounded-[3rem] p-10 hover:bg-gray-800/80 transition-all duration-500 group relative overflow-hidden flex flex-col backdrop-blur-sm hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2">
            <!-- Decorative Icon -->
            <div class="absolute -right-4 -top-4 w-32 h-32 bg-cyan-600 opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            
            <div class="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl flex items-center justify-center text-white mb-8 group-hover:rotate-6 transition-transform shadow-xl shadow-cyan-600/20">
                <i class="fas fa-industry text-3xl"></i>
            </div>

            <div class="flex-1">
                <div class="flex items-center gap-2 mb-3">
                    <span class="px-3 py-1 bg-gray-900 border border-gray-700 text-gray-400 rounded-full text-[9px] font-black uppercase tracking-widest group-hover:border-cyan-500/50 group-hover:text-cyan-400 transition">{{ $dudi->bidang_usaha ?? 'Umum' }}</span>
                </div>
                <h3 class="text-2xl font-black text-white mb-4 leading-tight group-hover:text-cyan-400 transition">{{ $dudi->nama }}</h3>
                <p class="text-gray-400 text-sm mb-8 line-clamp-2 leading-relaxed italic"><i class="fas fa-map-marker-alt mr-2 text-cyan-500"></i> {{ $dudi->alamat ?? 'Lokasi industri belum diperbarui oleh admin.' }}</p>
            </div>

            <div class="flex items-center justify-between mt-auto pt-8 border-t border-gray-700/50">
                <div class="flex flex-col">
                    <span class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Quota</span>
                    <span class="text-white font-black">4 <small class="text-gray-500 font-bold">Posisi</small></span>
                </div>
                <button class="px-6 py-3 bg-gray-900 hover:bg-cyan-600 text-cyan-400 hover:text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl hover:shadow-cyan-600/30 active:scale-95" @click="selectedDudi = {{ json_encode($dudi) }}">
                    Buka Detail <i class="fas fa-arrow-right ml-1"></i>
                </button>
            </div>
        </div>
        @empty
        <div class="col-span-full py-40 text-center bg-gray-900/50 rounded-[5rem] border-4 border-dashed border-gray-800 flex flex-col items-center">
            <div class="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center text-gray-700 mb-8 border border-gray-700 shadow-inner">
                <i class="fas fa-search text-4xl"></i>
            </div>
            <h2 class="text-3xl font-black text-white uppercase tracking-tighter">Ops, Mitra Belum Siap</h2>
            <p class="text-gray-500 max-w-sm mt-4 leading-relaxed font-medium text-lg">Halaman eksplorasi industri sedang dalam masa pemeliharaan oleh tim prakerin.</p>
        </div>
        @endforelse
    </div>

    <!-- Detail Modal -->
    <template x-teleport="body">
        <div x-show="selectedDudi" class="fixed inset-0 z-50 flex items-center justify-center p-4" x-cloak>
            <div class="absolute inset-0 bg-black/90 backdrop-blur-xl" @click="selectedDudi = null"></div>
            
            <div class="relative bg-gray-800 border-2 border-gray-700 w-full max-w-2xl rounded-[3.5rem] shadow-2xl p-12 overflow-y-auto max-h-[95vh]">
                <div class="flex justify-between items-start mb-12">
                    <div class="w-16 h-16 bg-cyan-600 rounded-3xl flex items-center justify-center text-white shadow-xl rotate-3">
                        <i class="fas fa-building text-3xl"></i>
                    </div>
                    <button @click="selectedDudi = null" class="text-gray-500 hover:text-white transition-all hover:rotate-90 text-2xl"><i class="fas fa-times"></i></button>
                </div>

                <div x-if="selectedDudi">
                    <h2 class="text-4xl font-black text-white tracking-tighter uppercase mb-2" x-text="selectedDudi.nama"></h2>
                    <p class="text-cyan-500 font-black tracking-[0.2em] text-xs uppercase mb-10" x-text="selectedDudi.bidang_usaha || 'Bidang Usaha Mitra'"></p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div class="bg-gray-900/60 p-6 rounded-3xl border border-gray-700/50">
                            <h4 class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">Informasi Kontak</h4>
                            <div class="space-y-4">
                                <div class="flex items-center gap-4 text-gray-200">
                                    <div class="w-10 h-10 bg-gray-800 rounded-2xl flex items-center justify-center text-cyan-400 shadow-md">
                                        <i class="fas fa-phone-alt"></i>
                                    </div>
                                    <span class="font-bold text-sm" x-text="selectedDudi.telepon || '+62 ---'"></span>
                                </div>
                                <div class="flex items-center gap-4 text-gray-200">
                                    <div class="w-10 h-10 bg-gray-800 rounded-2xl flex items-center justify-center text-cyan-400 shadow-md">
                                        <i class="fas fa-envelope"></i>
                                    </div>
                                    <span class="font-bold text-sm" x-text="selectedDudi.email || 'contact@mitra.com'"></span>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-900/60 p-6 rounded-3xl border border-gray-700/50">
                            <h4 class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">Penanggung Jawab</h4>
                            <div class="flex items-center gap-4">
                                <div class="w-14 h-14 bg-gradient-to-tr from-cyan-600 to-blue-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg" x-text="(selectedDudi.penanggung_jawab || 'P').charAt(0)"></div>
                                <div>
                                    <p class="text-white font-black text-lg" x-text="selectedDudi.penanggung_jawab || 'Belum Ada Nama'"></p>
                                    <p class="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-0.5">HR Industrial Relation</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-900/60 p-8 rounded-3xl border border-gray-700/50 mb-12">
                        <h4 class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">Lokasi Pabrik / Kantor</h4>
                        <p class="text-gray-300 leading-relaxed font-medium italic" x-text="selectedDudi.alamat || 'Alamat lengkap mitra industri tidak tersedia di database.'"></p>
                    </div>

                    <div class="flex gap-4">
                        <button class="flex-1 py-5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-[1.5rem] font-black uppercase tracking-widest transition-all" @click="selectedDudi = null">Kembali</button>
                        <button class="flex-1 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-2xl shadow-cyan-600/30 hover:scale-[1.03] transition-all" @click="alert('Segera hubungi Guru Pembimbing untuk proses pendaftaran ke mitra ini!')">Daftar Magang</button>
                    </div>
                </div>
            </div>
        </div>
    </template>
</div>
@endsection
