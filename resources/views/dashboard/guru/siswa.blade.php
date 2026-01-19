@extends('layouts.blade_app')

@section('title', 'Data Siswa - Guru')

@section('content')
<div class="p-4 md:p-8" x-data="{ showModal: false }">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
            <h1 class="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">Manajemen Siswa</h1>
            <p class="text-gray-400 mt-1 font-medium text-sm">Kelola data siswa peserta magang</p>
        </div>
        <button class="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-500 transition shadow-2xl shadow-blue-600/40 flex items-center justify-center gap-2" @click="showModal = true">
            <i class="fas fa-plus-circle"></i> Tambah Siswa
        </button>
    </div>

    <div class="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl overflow-hidden">
        <!-- Mobile Card View -->
        <div class="lg:hidden">
            @forelse($siswas as $s)
                <div class="p-6 border-b border-gray-800 last:border-b-0">
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                {{ strtoupper(substr($s->nama, 0, 1)) }}
                            </div>
                            <div>
                                <h3 class="font-bold text-white">{{ $s->nama }}</h3>
                                <p class="text-gray-400 text-sm">{{ $s->nis }}</p>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button class="p-2 text-blue-400 hover:bg-blue-600/20 rounded-lg transition">
                                <i class="fas fa-edit"></i>
                            </button>
                            <form action="{{ route('guru.siswa.destroy', $s) }}" method="POST" onsubmit="return confirm('Hapus data siswa ini?')">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="p-2 text-red-400 hover:bg-red-600/20 rounded-lg transition">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-500">Kelas:</span>
                            <span class="text-white">{{ $s->kelas->nama ?? '-' }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-500">Email:</span>
                            <span class="text-white">{{ $s->user->email ?? '-' }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-500">Alamat:</span>
                            <span class="text-white text-right">{{ $s->alamat ?: '-' }}</span>
                        </div>
                    </div>
                </div>
            @empty
                <div class="p-8 text-center text-gray-500">
                    <i class="fas fa-user-slash text-4xl mb-4"></i>
                    <p>Belum ada data siswa</p>
                </div>
            @endforelse
        </div>

        <!-- Desktop Table View -->
        <div class="hidden lg:block overflow-x-auto">
            <div class="min-w-[800px]">
                <table class="w-full text-left text-sm text-gray-300">
                <thead class="bg-gray-800/80 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                    <tr>
                        <th class="p-6">Identitas Siswa</th>
                        <th class="p-6">NIS</th>
                        <th class="p-6">Kelas</th>
                        <th class="p-6">Email Akses</th>
                        <th class="p-6 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-800">
                @forelse($siswas as $s)
                <tr class="hover:bg-gray-800/30 transition group">
                    <td class="p-6">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-blue-500 font-black border border-gray-700">
                                {{ substr($s->nama, 0, 1) }}
                            </div>
                            <div class="text-white font-bold group-hover:text-blue-400 transition">{{ $s->nama }}</div>
                        </div>
                    </td>
                    <td class="p-6 font-mono text-xs text-gray-500">{{ $s->nis }}</td>
                    <td class="p-6">
                        <span class="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-[10px] font-black uppercase border border-blue-500/20">
                            {{ $s->kelas->nama ?? 'N/A' }}
                        </span>
                    </td>
                    <td class="p-6 text-gray-400 italic text-xs">{{ $s->user->email ?? '-' }}</td>
                    <td class="p-6">
                        <div class="flex items-center justify-center gap-2">
                            <button class="w-10 h-10 flex items-center justify-center bg-gray-800 text-gray-400 rounded-xl hover:bg-blue-600 hover:text-white transition cursor-not-allowed opacity-50">
                                <i class="fas fa-edit text-xs"></i>
                            </button>
                            <form action="{{ route('guru.siswa.destroy', $s) }}" method="POST" onsubmit="return confirm('Yakin ingin menghapus siswa dan akun terkait?')">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="w-10 h-10 flex items-center justify-center bg-gray-800 text-gray-400 rounded-xl hover:bg-red-600 hover:text-white transition">
                                    <i class="fas fa-trash text-xs"></i>
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="5" class="p-20 text-center text-gray-600">
                        <i class="fas fa-users text-5xl mb-4 opacity-20"></i>
                        <p class="font-bold italic">Belum ada data siswa yang terdaftar.</p>
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <!-- Modal Tambah Siswa -->
    <template x-teleport="body">
        <div x-show="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" x-cloak>
            <div class="absolute inset-0 bg-black/80 backdrop-blur-md" @click="showModal = false"></div>
            <div class="relative bg-gray-800 border-2 border-gray-700 w-full max-w-xl rounded-[3rem] shadow-2xl p-12 overflow-y-auto max-h-[90vh]">
                <div class="flex justify-between items-start mb-10">
                    <div>
                        <h2 class="text-3xl font-black text-white uppercase tracking-tighter">Tambah Siswa Baru</h2>
                        <p class="text-gray-400 text-xs mt-1">Siswa akan mendapatkan akun otomatis untuk login.</p>
                    </div>
                </div>

                <form action="{{ route('guru.siswa.store') }}" method="POST" class="space-y-6">
                    @csrf
                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
                            <input type="text" name="nama" class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition" placeholder="Ahmad Rizky" required>
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">NIS</label>
                            <input type="text" name="nis" class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition" placeholder="123456" required>
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Email (Untuk Login)</label>
                        <input type="email" name="email" class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition" placeholder="ahmad@siswa.com" required>
                    </div>

                    <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Kelas</label>
                        <select name="kelas_id" class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition appearance-none" required>
                            <option value="">Pilih Kelas</option>
                            @forelse($kelases as $k)
                                <option value="{{ $k->id }}">{{ $k->nama }}</option>
                            @empty
                                <option value="" disabled>Belum ada data kelas</option>
                            @endforelse
                        </select>
                    </div>

                    <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Alamat Domisili</label>
                        <textarea name="alamat" rows="3" class="w-full bg-gray-900 border border-gray-700 rounded-[2rem] px-6 py-5 text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition" placeholder="Jl. Teratai No. 45..."></textarea>
                    </div>

                    <div class="flex gap-4 pt-6">
                        <button type="button" class="flex-1 py-5 bg-gray-700 text-gray-300 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-600 transition" @click="showModal = false">Batal</button>
                        <button type="submit" class="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-blue-600/40 hover:bg-blue-500 transition">Simpan Data</button>
                    </div>
                </form>
            </div>
        </div>
    </template>
</div>
@endsection
