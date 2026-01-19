@extends('layouts.blade_app')

@section('title', 'Magang Saya - Siswa')

@section('content')
<div class="p-6" x-data="{ showAjukanModal: false }">
    <div class="mb-8">
        <h1 class="text-3xl font-black text-white uppercase tracking-tighter">Status Penempatan</h1>
        <p class="text-gray-400">Informasi detail mengenai perjalanan magang Anda</p>
    </div>

    @forelse($magangs as $magang)
    <div class="bg-gray-800 border-l-8 border-cyan-500 rounded-[2rem] md:rounded-3xl p-6 md:p-10 mb-8 relative overflow-hidden shadow-2xl">
        <div class="absolute right-0 top-0 opacity-5 -rotate-12 translate-x-10 -translate-y-10 pointer-events-none">
            <i class="fas fa-briefcase text-[10rem] md:text-[15rem]"></i>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-center">
            <div class="lg:col-span-2">
                <div class="flex items-center gap-3 mb-6">
                    <span class="px-4 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-500/30">{{ $magang->status }}</span>
                    <span class="text-gray-600 font-bold text-[10px] md:text-xs uppercase tracking-widest">ID: #MGN-{{ $magang->id }}</span>
                </div>
                
                <h2 class="text-3xl md:text-5xl font-black text-white mb-3 md:mb-4 leading-none tracking-tighter">{{ $magang->dudi->nama ?? '-' }}</h2>
                <h3 class="text-lg md:text-2xl text-cyan-500 font-bold mb-6 md:mb-8 italic">"{{ $magang->judul_magang ?? 'Posisi Magang' }}"</h3>
                
                <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div class="bg-gray-900/40 p-5 rounded-2xl border border-gray-700/50">
                        <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Tanggal Mulai</p>
                        <p class="text-white font-bold">{{ \Carbon\Carbon::parse($magang->tanggal_mulai)->format('d M Y') }}</p>
                    </div>
                    <div class="bg-gray-900/40 p-5 rounded-2xl border border-gray-700/50">
                        <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Periode</p>
                        <p class="text-white font-bold">6 Bulan (Smt 5)</p>
                    </div>
                    <div class="bg-gray-900/40 p-5 rounded-2xl border border-gray-700/50">
                        <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Guru Pembimbing</p>
                        <p class="text-white font-bold text-xs">{{ $magang->guruPembimbing->name ?? 'Belum Ditentukan' }}</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-gray-900/80 p-8 rounded-[2rem] border border-gray-700 shadow-xl relative backdrop-blur-md">
                <div class="absolute -top-4 -right-4 w-12 h-12 bg-cyan-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-12">
                    <i class="fas fa-quote-right"></i>
                </div>
                <h4 class="text-xs font-black text-gray-500 mb-4 uppercase tracking-widest flex items-center gap-2">
                    <i class="fas fa-info-circle text-cyan-500"></i> Job Description
                </h4>
                <p class="text-gray-300 text-sm leading-relaxed italic">
                    {{ $magang->deskripsi ?? 'Mahasiswa diwajibkan mengikuti seluruh aturan perusahaan dan melaporkan kegiatan harian melalui aplikasi Logbook ini secara konsisten.' }}
                </p>
                
                <a href="{{ route('siswa.logbook') }}" class="w-full mt-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black text-sm transition-all text-center block shadow-lg shadow-cyan-600/30">
                    ISI LOGBOOK SEKARANG
                </a>
            </div>
        </div>
    </div>
    @empty
    <div class="bg-gray-800 border-4 border-dashed border-gray-700 rounded-[3rem] p-20 text-center shadow-inner">
        <div class="mb-6 inline-flex items-center justify-center w-32 h-32 bg-gray-900 rounded-[2.5rem] border border-gray-700">
            <i class="fas fa-paper-plane text-5xl text-gray-600 rotate-12"></i>
        </div>
        <h2 class="text-3xl font-black text-white mb-3 tracking-tighter uppercase">Belum Ada Penempatan?</h2>
        <p class="text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">Jangan khawatir! Anda dapat mengajukan tempat magang mandiri atau memilih dari daftar mitra DUDI kami.</p>
        <button @click="showAjukanModal = true" class="px-10 py-5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black text-lg transition-all shadow-2xl shadow-cyan-600/40 hover:scale-[1.05] active:scale-95">
            AJUKAN PENEMPATAN MANDIRI
        </button>
    </div>
    @endforelse

    <!-- Modal Ajukan -->
    <template x-teleport="body">
        <div x-show="showAjukanModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" x-cloak>
            <div class="absolute inset-0 bg-black/80 backdrop-blur-lg" @click="showAjukanModal = false"></div>
            
            <div class="relative bg-gray-800 border border-gray-700 w-full max-w-xl rounded-[3rem] shadow-2xl p-12">
                <div class="flex justify-between items-start mb-10">
                    <div>
                        <h2 class="text-4xl font-black text-white tracking-tighter uppercase">Form Pengajuan</h2>
                        <p class="text-gray-400 mt-1 font-medium">Lengkapi data mitra magang baru Anda</p>
                    </div>
                </div>

                <form action="#" method="POST" class="space-y-6" @submit.prevent="alert('Fitur pengajuan sedang diproses oleh Admin. Terima kasih!'); showAjukanModal = false;">
                    @csrf
                    <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Nama Perusahaan / Instansi</label>
                        <input type="text" name="nama_dudi" class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition" placeholder="Contoh: PT. Digital Raya" required>
                    </div>

                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Posisi / Bidang</label>
                            <input type="text" name="posisi" class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition" placeholder="Web Developer">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Tanggal Mulai</label>
                            <input type="date" name="start_date" class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition" required>
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Alamat Instansi</label>
                        <textarea rows="3" class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition" placeholder="Lengkapi alamat detail untuk proses verifikasi..."></textarea>
                    </div>

                    <div class="flex gap-4 pt-6">
                        <button type="button" class="flex-1 py-5 bg-gray-700 text-gray-300 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-600 transition" @click="showAjukanModal = false">Batal</button>
                        <button type="submit" class="flex-1 py-5 bg-cyan-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-cyan-600/40 hover:bg-cyan-500 transition">Kirim Pengajuan</button>
                    </div>
                </form>
            </div>
        </div>
    </template>
</div>
@endsection
