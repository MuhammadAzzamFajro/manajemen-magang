@extends('layouts.app')

@section('title', 'Dashboard Siswa')

@section('content')
<div class="p-6 text-white min-h-screen">
    <h1 class="text-2xl font-bold mb-2">Dashboard</h1>
    <p class="text-gray-300 mb-6">
       Siswa <span class="text-cyan-400 font-semibold">{{ $namaSiswa }}</span>
    </p>

    <div class="w-full mb-8">
        <div class="flex gap-2 bg-gray-900 p-1 rounded-lg w-fit border border-gray-700">
            <a href="{{ route('dashboard.siswa') }}" 
               class="px-6 py-2 rounded-md text-sm font-bold transition-all duration-300 {{ Request::routeIs('dashboard.siswa') ? 'bg-cyan-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-800' }}">
                Siswa
            </a>
            <button @click="showSwitchModal = true; switchRoleLabel = 'Guru'" 
               class="px-6 py-2 rounded-md text-sm font-bold transition-all duration-300 {{ Request::routeIs('dashboard.guru') ? 'bg-cyan-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-800' }}">
                Guru
            </button>
        </div>
    </div>

    <!-- Content: Siswa -->
    <div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
                <p class="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Status Kehadiran</p>
                <h3 class="text-3xl font-black text-white">{{ $presentRate }}%</h3>
                <div class="w-full bg-gray-700 h-1 mt-4 rounded-full overflow-hidden">
                    <div class="bg-cyan-500 h-full w-[{{ $presentRate }}%]"></div>
                </div>
            </div>
            <div class="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
                <p class="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Logbook Terkirim</p>
                <h3 class="text-3xl font-black text-white">{{ $logbookCount }} <small class="text-sm font-normal text-gray-500">hari</small></h3>
                <p class="text-green-400 text-xs mt-2 font-bold"><i class="fas fa-check-double mr-1"></i> {{ $approvedLogbook }} Disetujui</p>
            </div>
            <div class="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
                <p class="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Nilai Rata-rata</p>
                <h3 class="text-3xl font-black text-white">{{ $grade }}</h3>
                <p class="text-gray-500 text-xs mt-2">Berdasarkan evaluasi DUDI</p>
            </div>
        </div>

        <div class="bg-cyan-600/10 border border-cyan-500/30 p-6 rounded-2xl">
            <h4 class="text-cyan-400 font-bold mb-2 flex items-center"><i class="fas fa-info-circle mr-2"></i> Pengumuman Terbaru</h4>
            <p class="text-gray-300 text-sm">Pembekalan magang tahap II akan dilaksanakan pada hari Senin depan di Aula Sekolah.</p>
        </div>
    </div>
</div>
@endsection
