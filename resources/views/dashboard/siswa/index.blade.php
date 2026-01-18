@extends('layouts.app')

@section('title', 'Dashboard Siswa')

@section('content')
<div class="p-4 md:p-8 text-white">
    <div class="mb-10">
        <h1 class="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-2">Portal <span class="text-cyan-500">Siswa</span></h1>
        <p class="text-gray-400 font-medium">Selamat datang kembali, <span class="text-white font-bold">{{ $namaSiswa }}</span></p>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 mb-12">
        <div class="flex gap-2 bg-gray-950 p-2 rounded-2xl w-full sm:w-fit border border-gray-800 backdrop-blur-md shadow-2xl">
            <a href="{{ route('dashboard.siswa') }}"
               class="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 {{ Request::routeIs('dashboard.siswa') ? 'bg-cyan-600 text-white shadow-xl shadow-cyan-600/30' : 'text-gray-500 hover:text-white hover:bg-gray-800' }}">
                <i class="fas fa-user-graduate"></i>
                Siswa
            </a>
            <button @click="showSwitchModal = true; switchRoleLabel = 'Guru'"
               class="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 text-gray-500 hover:text-white hover:bg-gray-800">
                <i class="fas fa-chalkboard-teacher"></i>
                Guru
            </button>
        </div>
    </div>

    <!-- Content: Stats Section -->
    @if($hasMagang)
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <a href="{{ route('siswa.kehadiran') }}" class="group bg-gray-900 border border-gray-800 p-8 rounded-[2.5rem] shadow-2xl hover:border-cyan-500/50 transition-all duration-500 hover:scale-[1.02] block">
            <div class="flex justify-between items-start mb-6">
                <div class="w-14 h-14 bg-cyan-600/20 rounded-2xl flex items-center justify-center text-cyan-500 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-500">
                    <i class="fas fa-calendar-check text-2xl"></i>
                </div>
                <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Kehadiran hari ini</span>
            </div>
            <h3 class="text-4xl font-black text-white mb-4">{{ $presentRate }}%</h3>
            <div class="w-full bg-gray-800 h-2 rounded-full overflow-hidden border border-gray-700/50">
                <div class="bg-gradient-to-r from-cyan-600 to-blue-500 h-full rounded-full" style="width: {{ $presentRate }}%"></div>
            </div>
        </a>

        <div class="group bg-gray-900 border border-gray-800 p-8 rounded-[2.5rem] shadow-2xl hover:border-green-500/50 transition-all duration-500 hover:scale-[1.02]">
            <div class="flex justify-between items-start mb-6">
                <div class="w-14 h-14 bg-green-600/20 rounded-2xl flex items-center justify-center text-green-500 group-hover:bg-green-600 group-hover:text-white transition-all duration-500">
                    <i class="fas fa-file-invoice text-2xl"></i>
                </div>
                <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Progress Jurnal</span>
            </div>
            <h3 class="text-4xl font-black text-white mb-2">{{ $logbookCount }} <span class="text-sm font-bold text-gray-600 uppercase">Total</span></h3>
            <div class="flex flex-col gap-1">
                <p class="text-green-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    {{ $approvedLogbook }} Disetujui
                </p>
                <p class="text-yellow-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <span class="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
                    {{ $pendingLogbook }} Menunggu Verifikasi
                </p>
            </div>
        </div>

        <div class="group bg-gray-900 border border-gray-800 p-8 rounded-[2.5rem] shadow-2xl hover:border-yellow-500/50 transition-all duration-500 hover:scale-[1.02] lg:col-span-1 md:col-span-2 lg:col-span-1">
            <div class="flex justify-between items-start mb-6">
                <div class="w-14 h-14 bg-yellow-600/20 rounded-2xl flex items-center justify-center text-yellow-500 group-hover:bg-yellow-600 group-hover:text-white transition-all duration-500">
                    <i class="fas fa-briefcase text-2xl"></i>
                </div>
                <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Status Magang</span>
            </div>
            <h3 class="text-4xl font-black text-white mb-2">{{ $internshipStatus ?? 'Belum Ditentukan' }}</h3>
            @if($internshipCompany)
                <p class="text-cyan-400 text-sm font-bold mb-3">{{ $internshipCompany }}</p>
            @endif
            @if($internshipProgress)
                <div class="mb-2">
                    <div class="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{{ $internshipProgress['days_passed'] }}/{{ $internshipProgress['total_days'] }} hari</span>
                        <span>{{ $internshipProgress['percentage'] }}%</span>
                    </div>
                    <div class="w-full bg-gray-800 h-2 rounded-full overflow-hidden border border-gray-700/50">
                        <div class="bg-gradient-to-r from-yellow-600 to-orange-500 h-full rounded-full transition-all duration-500" style="width: {{ $internshipProgress['percentage'] }}%"></div>
                    </div>
                </div>
            @endif
            <p class="text-gray-500 text-xs font-medium italic">Status Penempatan Magang</p>
        </div>
    </div>
    @else
    <div class="bg-amber-600/10 border-2 border-amber-500/30 p-8 rounded-[3rem] shadow-2xl shadow-amber-600/10 flex flex-col md:flex-row items-center gap-6 mb-10">
        <div class="w-16 h-16 shrink-0 bg-amber-500 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/50">
            <i class="fas fa-exclamation-triangle text-2xl"></i>
        </div>
        <div>
            <h4 class="text-amber-400 font-black uppercase tracking-widest text-sm mb-1">Belum Ada Penempatan Magang</h4>
            <p class="text-gray-200 font-medium">Anda belum memiliki penempatan magang. Silakan jelajahi mitra industri (DUDI) dan ajukan pendaftaran untuk memulai program magang Anda.</p>
            <a href="{{ route('siswa.dudi') }}" class="inline-block mt-4 px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-sm transition-all">
                Jelajahi DUDI <i class="fas fa-arrow-right ml-2"></i>
            </a>
        </div>
    </div>
    @endif

    <!-- Announcement Feed -->
    <div class="bg-blue-600/10 border-2 border-blue-500/30 p-8 rounded-[3rem] shadow-2xl shadow-blue-600/10 flex flex-col md:flex-row items-center gap-6">
        <div class="w-16 h-16 shrink-0 bg-blue-500 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/50">
            <i class="fas fa-bullhorn text-2xl"></i>
        </div>
        <div>
            <h4 class="text-blue-400 font-black uppercase tracking-widest text-sm mb-1">Pengumuman Terbaru</h4>
            <p class="text-gray-200 font-medium">Pembekalan magang tahap II akan dilaksanakan pada hari Senin depan di Aula Sekolah. Seluruh siswa wajib hadir tepat waktu dengan seragam lengkap.</p>
        </div>
    </div>
</div>
@endsection
