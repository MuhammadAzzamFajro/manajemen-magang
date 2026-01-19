@extends('layouts.blade_app')

@section('title', 'Eksplorasi DUDI - Siswa')

@section('content')
<div class="p-6" x-data="{ selectedDudi: null, category: 'Semua' }">
    <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <h1 class="text-4xl font-black text-white uppercase tracking-tighter">Eksplorasi Mitra</h1>
            <p class="text-gray-400 mt-2 font-medium">Temukan tempat magang impian Anda di industri terbaik</p>
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

            <div class="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 border-2 border-gray-700 w-full max-w-4xl rounded-[3.5rem] shadow-2xl p-12 overflow-y-auto max-h-[95vh]">
                <div class="flex justify-between items-start mb-8">
                    <div class="flex items-start gap-6">
                        <div class="w-20 h-20 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-cyan-600/30 shrink-0">
                            <i class="fas fa-industry text-4xl"></i>
                        </div>
                        <div>
                            <h2 class="text-4xl font-black text-white tracking-tighter uppercase mb-2" x-text="selectedDudi.nama"></h2>
                            <p class="text-cyan-400 font-black tracking-[0.15em] text-xs uppercase mb-2" x-text="selectedDudi.bidang_usaha || 'Bidang Usaha Industri'"></p>
                            <div class="flex items-center gap-2 text-gray-400">
                                <i class="fas fa-map-marker-alt text-cyan-500"></i>
                                <span class="text-sm font-medium" x-text="selectedDudi.alamat ? (selectedDudi.alamat.length > 50 ? selectedDudi.alamat.substring(0, 50) + '...' : selectedDudi.alamat) : 'Lokasi belum diperbarui'"></span>
                            </div>
                        </div>
                    </div>
                    <button @click="selectedDudi = null" class="text-gray-500 hover:text-white transition-all hover:rotate-90 text-2xl p-2 hover:bg-gray-800 rounded-xl"><i class="fas fa-times"></i></button>
                </div>

                <div class="border-b border-gray-700/50 mb-10 pb-8" x-if="selectedDudi">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="bg-gray-900/50 p-4 rounded-2xl border border-gray-700/30">
                            <p class="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Quota Tersedia</p>
                            <p class="text-3xl font-black text-cyan-400">4</p>
                            <p class="text-gray-600 text-xs mt-1">Posisi Magang</p>
                        </div>
                        <div class="bg-gray-900/50 p-4 rounded-2xl border border-gray-700/30">
                            <p class="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Status</p>
                            <p class="text-2xl font-black text-green-400">Aktif</p>
                            <p class="text-gray-600 text-xs mt-1">Penerimaan Buka</p>
                        </div>
                        <div class="bg-gray-900/50 p-4 rounded-2xl border border-gray-700/30">
                            <p class="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Durasi</p>
                            <p class="text-2xl font-black text-yellow-400">4-6</p>
                            <p class="text-gray-600 text-xs mt-1">Bulan</p>
                        </div>
                        <div class="bg-gray-900/50 p-4 rounded-2xl border border-gray-700/30">
                            <p class="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Pelatihan</p>
                            <p class="text-2xl font-black text-blue-400"><i class="fas fa-check"></i></p>
                            <p class="text-gray-600 text-xs mt-1">Disediakan</p>
                        </div>
                    </div>
                </div>

                <div x-if="selectedDudi">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <!-- Kontak Section -->
                        <div class="bg-gray-900/60 p-8 rounded-3xl border border-gray-700/50 hover:border-cyan-600/30 transition-all">
                            <div class="flex items-center gap-3 mb-6">
                                <div class="w-10 h-10 bg-cyan-600/20 rounded-2xl flex items-center justify-center text-cyan-400">
                                    <i class="fas fa-phone-alt"></i>
                                </div>
                                <h4 class="text-sm font-black text-gray-400 uppercase tracking-widest">Nomor Telepon</h4>
                            </div>
                            <a :href="'tel:' + (selectedDudi.telepon || '')" class="block text-white font-bold text-lg hover:text-cyan-400 transition-colors" x-text="selectedDudi.telepon || '(Belum Tersedia)'"></a>
                        </div>

                        <div class="bg-gray-900/60 p-8 rounded-3xl border border-gray-700/50 hover:border-cyan-600/30 transition-all">
                            <div class="flex items-center gap-3 mb-6">
                                <div class="w-10 h-10 bg-cyan-600/20 rounded-2xl flex items-center justify-center text-cyan-400">
                                    <i class="fas fa-envelope"></i>
                                </div>
                                <h4 class="text-sm font-black text-gray-400 uppercase tracking-widest">Email</h4>
                            </div>
                            <a :href="'mailto:' + (selectedDudi.email || '')" class="block text-white font-bold text-sm hover:text-cyan-400 transition-colors break-all" x-text="selectedDudi.email || '(Belum Tersedia)'"></a>
                        </div>

                        <!-- Penanggung Jawab Section -->
                        <div class="bg-gray-900/60 p-8 rounded-3xl border border-gray-700/50 hover:border-green-600/30 transition-all md:col-span-2">
                            <div class="flex items-center gap-3 mb-6">
                                <div class="w-10 h-10 bg-green-600/20 rounded-2xl flex items-center justify-center text-green-400">
                                    <i class="fas fa-user-tie"></i>
                                </div>
                                <h4 class="text-sm font-black text-gray-400 uppercase tracking-widest">Penanggung Jawab / HR</h4>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0" x-text="(selectedDudi.penanggung_jawab || 'P').charAt(0).toUpperCase()"></div>
                                <div>
                                    <p class="text-white font-black text-lg" x-text="selectedDudi.penanggung_jawab || 'Belum Ada Nama'"></p>
                                    <p class="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Divisi Hubungan Industri</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Lokasi & Deskripsi -->
                    <div class="bg-gray-900/60 p-8 rounded-3xl border border-gray-700/50 mb-12">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="w-10 h-10 bg-purple-600/20 rounded-2xl flex items-center justify-center text-purple-400">
                                <i class="fas fa-building"></i>
                            </div>
                            <h4 class="text-sm font-black text-gray-400 uppercase tracking-widest">Lokasi Kantor / Pabrik</h4>
                        </div>
                        <p class="text-gray-300 leading-relaxed font-medium text-base" x-text="selectedDudi.alamat || 'Alamat lengkap mitra industri tidak tersedia di database.'"></p>
                    </div>

                    <!-- Deskripsi Bidang Usaha -->
                    <div class="bg-gray-900/60 p-8 rounded-3xl border border-gray-700/50 mb-12">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="w-10 h-10 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400">
                                <i class="fas fa-briefcase"></i>
                            </div>
                            <h4 class="text-sm font-black text-gray-400 uppercase tracking-widest">Bidang Usaha</h4>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            <span class="px-4 py-2 bg-blue-600/20 border border-blue-600/50 text-blue-300 rounded-full text-sm font-bold" x-text="selectedDudi.bidang_usaha || 'Industri Umum'"></span>
                        </div>
                    </div>

                    <!-- CTA Buttons -->
                    <div class="flex flex-col sm:flex-row gap-4">
                        <button class="flex-1 py-4 px-6 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-2xl font-black uppercase tracking-widest transition-all hover:shadow-xl active:scale-95 flex items-center justify-center gap-2" @click="selectedDudi = null">
                            <i class="fas fa-arrow-left"></i>
                            Kembali
                        </button>
                        <form action="{{ route('siswa.magang.apply') }}" method="POST" class="flex-1">
                            @csrf
                            <input type="hidden" name="dudi_id" :value="selectedDudi.id">
                            <button type="submit" class="w-full py-4 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-cyan-600/30 hover:shadow-cyan-600/50 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2">
                                <i class="fas fa-paper-plane"></i>
                                Ajukan Magang Sekarang
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </template>
</div>
@endsection
