@extends('layouts.app')

@section('title', 'DUDI - Guru')

@section('content')
<div class="p-6" x-data="{ showAddModal: false, editingDudi: null }">
    <div class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-2xl font-bold text-white uppercase tracking-tighter">Daftar DUDI</h1>
            <p class="text-gray-400">Kelola informasi mitra industri sekolah</p>
        </div>
        <button class="px-5 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/30" @click="showAddModal = true">
            <i class="fas fa-plus mr-2"></i> Tambah Perusahaan
        </button>
    </div>

    <div class="bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
        <table class="w-full text-left text-sm text-gray-300">
            <thead class="bg-gray-800/80 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                <tr>
                    <th class="p-5">Nama Perusahaan</th>
                    <th class="p-5">Bidang Usaha</th>
                    <th class="p-5">Penanggung Jawab</th>
                    <th class="p-5">Alamat </th>
                    <th class="p-5 text-center">Aksi</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-800">
                @forelse($dudis as $dudi)
                <tr class="hover:bg-gray-800/30 transition group">
                    <td class="p-5">
                        <div class="text-white font-bold group-hover:text-blue-400 transition">{{ $dudi->nama }}</div>
                        <div class="text-[10px] text-gray-500 uppercase">{{ $dudi->email ?? 'no-email@company.com' }}</div>
                    </td>
                    <td class="p-5">
                        <span class="px-2 py-1 bg-gray-800 text-gray-400 rounded-md border border-gray-700 text-xs">{{ $dudi->bidang_usaha ?? '-' }}</span>
                    </td>
                    <td class="p-5">
                        <div class="flex flex-col">
                            <span class="text-gray-200 font-medium font-serif italic">{{ $dudi->penanggung_jawab ?? 'Belum Ditentukan' }}</span>
                            <span class="text-[10px] text-gray-500">{{ $dudi->telepon ?? '-' }}</span>
                        </div>
                    </td>
                    <td class="p-5 text-xs text-gray-400 max-w-xs truncate">{{ $dudi->alamat ?? '-' }}</td>
                    <td class="p-5">
                        <div class="flex items-center justify-center gap-2">
                            <button class="w-8 h-8 flex items-center justify-center bg-blue-600/10 text-blue-500 rounded-lg hover:bg-blue-600 hover:text-white transition" 
                                    @click="editingDudi = {{ json_encode($dudi) }}">
                                <i class="fas fa-edit text-xs"></i>
                            </button>
                            <form action="{{ route('guru.dudis.destroy', $dudi) }}" method="POST" onsubmit="return confirm('Yakin ingin menghapus DUDI ini?')">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="w-8 h-8 flex items-center justify-center bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition">
                                    <i class="fas fa-trash text-xs"></i>
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="5" class="p-12 text-center text-gray-600">
                        <div class="flex flex-col items-center">
                            <i class="fas fa-building text-4xl mb-3 opacity-20"></i>
                            <p>Belum ada data DUDI yang terdaftar.</p>
                        </div>
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <!-- Modals (Add & Edit) -->
    <template x-teleport="body">
        <div x-show="showAddModal || editingDudi" class="fixed inset-0 z-50 flex items-center justify-center p-4" x-cloak>
            <div class="absolute inset-0 bg-black/80 backdrop-blur-md" @click="showAddModal = false; editingDudi = null"></div>
            
            <div class="relative bg-gray-800 border border-gray-700 w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 overflow-hidden">
                <div class="flex justify-between items-start mb-8">
                    <h2 class="text-3xl font-black text-white tracking-tighter" x-text="editingDudi ? 'Ubah Informasi' : 'Tambah Mitra Baru'"></h2>
                    <button @click="showAddModal = false; editingDudi = null" class="text-gray-500 hover:text-white transition-colors text-xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <form :action="editingDudi ? `/dashboard/guru/dudis/${editingDudi.id}` : '{{ route('guru.dudis.store') }}'" method="POST" class="space-y-6">
                    @csrf
                    <div x-show="editingDudi">
                        <input type="hidden" name="_method" value="PUT">
                    </div>

                    <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Nama Instansi / Perusahaan</label>
                        <input type="text" name="nama" :value="editingDudi ? editingDudi.nama : ''" class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition" placeholder="Contoh: Indigo Hub Pasuruan" required>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Bidang Usaha</label>
                            <input type="text" name="bidang_usaha" :value="editingDudi ? editingDudi.bidang_usaha : ''" class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition" placeholder="IT, Kontrak, dll">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Telepon</label>
                            <input type="text" name="telepon" :value="editingDudi ? editingDudi.telepon : ''" class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition" placeholder="08x-xxx...">
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Alamat Kantor Pusat</label>
                        <textarea name="alamat" rows="3" class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition" placeholder="Jl. Raya Bangil No. 1..." x-text="editingDudi ? editingDudi.alamat : ''"></textarea>
                    </div>

                    <div class="flex gap-4 pt-4">
                        <button type="button" class="flex-1 px-6 py-4 bg-gray-700 text-gray-300 rounded-2xl font-bold hover:bg-gray-600 transition" @click="showAddModal = false; editingDudi = null">Batal</button>
                        <button type="submit" class="flex-1 px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-600/40 hover:scale-[1.02] transition" x-text="editingDudi ? 'Perbarui Data' : 'Simpan Mitra'"></button>
                    </div>
                </form>
            </div>
        </div>
    </template>
</div>
@endsection
