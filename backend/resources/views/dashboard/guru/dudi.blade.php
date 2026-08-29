@extends('layouts.blade_app')

@section('title', 'DUDI - Guru')

@section('content')
<div class="p-4 md:p-8" x-data="{ showAddModal: false, editingDudi: null }">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
            <h1 class="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none">Mitra Industri</h1>
            <p class="text-gray-400 mt-2 font-medium text-sm md:text-base">Kelola informasi Dunia Usaha & Dunia Industri (DUDI)</p>
        </div>
        <button class="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-500 transition shadow-2xl shadow-blue-600/40 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2" @click="showAddModal = true">
            <i class="fas fa-plus-circle"></i> Tambah Perusahaan
        </button>
    </div>

    <div class="overflow-x-auto bg-gray-950/20 backdrop-blur-3xl border border-gray-800 rounded-[2.5rem] shadow-3xl">
        <div class="min-w-[900px]">
            <table class="w-full text-left text-sm text-gray-400">
                <thead class="bg-gray-900/50 text-gray-500 uppercase text-[10px] font-black tracking-widest border-b border-gray-800">
                    <tr>
                        <th class="p-6">Nama Instansi</th>
                        <th class="p-6">Bidang Usaha</th>
                        <th class="p-6">Penanggung Jawab</th>
                        <th class="p-6">Lokasi</th>
                        <th class="p-6 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-800/50">
                    @forelse($dudis as $dudi)
                    <tr class="hover:bg-gray-800/20 transition-all duration-300 group">
                        <td class="p-6">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-lg">
                                    <i class="fas fa-building text-xl"></i>
                                </div>
                                <div>
                                    <div class="text-white font-black group-hover:text-blue-400 transition-colors text-base">{{ $dudi->nama }}</div>
                                    <div class="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">{{ $dudi->email ?? 'no-email@company.com' }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="p-6">
                            <span class="px-3 py-1 bg-gray-900 text-gray-400 rounded-lg border border-gray-800 text-[10px] font-black uppercase tracking-widest group-hover:border-blue-500/30 transition-all">{{ $dudi->bidang_usaha ?? 'Lainnya' }}</span>
                        </td>
                        <td class="p-6">
                            <div class="flex flex-col">
                                <span class="text-gray-200 font-bold tracking-tight">{{ $dudi->penanggung_jawab ?? '---' }}</span>
                                <span class="text-[10px] text-gray-600 font-black tracking-widest mt-0.5 uppercase">{{ $dudi->telepon ?? '-' }}</span>
                            </div>
                        </td>
                        <td class="p-6">
                            <p class="text-[11px] text-gray-500 leading-relaxed max-w-[200px] truncate italic group-hover:text-gray-400 transition-colors">{{ $dudi->alamat ?? '-' }}</p>
                        </td>
                        <td class="p-6">
                            <div class="flex items-center justify-center gap-3">
                                <button class="w-10 h-10 flex items-center justify-center bg-gray-900 border border-gray-800 text-blue-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-md"
                                        @click="editingDudi = {{ json_encode($dudi) }}">
                                    <i class="fas fa-edit text-xs"></i>
                                </button>
                                <form action="{{ route('guru.dudis.destroy', $dudi) }}" method="POST" onsubmit="return confirm('Yakin ingin menghapus DUDI ini?')">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="w-10 h-10 flex items-center justify-center bg-gray-900 border border-gray-800 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-md">
                                        <i class="fas fa-trash text-xs"></i>
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="5" class="p-24 text-center text-gray-700">
                            <div class="flex flex-col items-center">
                                <div class="w-20 h-20 bg-gray-900 border border-gray-800 rounded-3xl flex items-center justify-center mb-6">
                                    <i class="fas fa-building text-4xl opacity-10"></i>
                                </div>
                                <p class="font-black uppercase tracking-tighter text-lg">Belum Ada Mitra Terdaftar</p>
                                <p class="text-sm italic opacity-50 mt-1">Gunakan tombol di atas untuk menambah mitra baru.</p>
                            </div>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <!-- Modals (Add & Edit) -->
    <template x-teleport="body">
        <div x-show="showAddModal || editingDudi" class="fixed inset-0 z-50 flex items-center justify-center p-4" x-cloak>
            <div class="absolute inset-0 bg-black/90 backdrop-blur-xl" @click="showAddModal = false; editingDudi = null"></div>

            <div class="relative bg-gray-800 border-2 border-gray-700 w-full max-w-lg rounded-[3.5rem] shadow-2xl p-10 md:p-14 overflow-hidden transform transition-all">
                <div class="flex justify-between items-start mb-10">
                    <div>
                        <h2 class="text-3xl font-black text-white tracking-tighter uppercase leading-none" x-text="editingDudi ? 'Update Mitra' : 'Mitra Baru'"></h2>
                        <p class="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2">Dunia Usaha & Dunia Industri</p>
                    </div>
                    <button @click="showAddModal = false; editingDudi = null" class="w-10 h-10 flex items-center justify-center bg-gray-900 border border-gray-700 text-gray-500 hover:text-white rounded-xl transition-all hover:rotate-90">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <form :action="editingDudi ? '{{ url('dashboard/guru/dudis') }}/' + editingDudi.id : '{{ route('guru.dudis.store') }}'" method="POST" class="space-y-6">
                    @csrf
                    <template x-if="editingDudi">
                        <input type="hidden" name="_method" value="PUT">
                    </template>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Nama Instansi / Perusahaan</label>
                            <input type="text" name="nama" :value="editingDudi ? editingDudi.nama : ''" class="w-full bg-gray-950 border border-gray-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold" placeholder="Contoh: PT. Teknologi Maju" required>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Bidang Usaha</label>
                                <input type="text" name="bidang_usaha" :value="editingDudi ? editingDudi.bidang_usaha : ''" class="w-full bg-gray-950 border border-gray-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm font-bold" placeholder="Informasi Teknologi">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Telepon / WhatsApp</label>
                                <input type="text" name="telepon" :value="editingDudi ? editingDudi.telepon : ''" class="w-full bg-gray-950 border border-gray-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm font-bold" placeholder="08x-xxx...">
                            </div>
                        </div>

                        <div>
                            <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Alamat Kantor Pusat</label>
                            <textarea name="alamat" rows="3" x-model="editingDudi.alamat" class="w-full bg-gray-950 border border-gray-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium italic" placeholder="Jl. Raya Utama No. 123, Surabaya..."></textarea>
                        </div>
                    </div>

                    <div class="flex gap-4 pt-6">
                        <button type="button" class="flex-1 px-6 py-5 bg-gray-900 border border-gray-800 text-gray-500 rounded-2xl font-black uppercase text-xs tracking-widest hover:text-gray-300 transition-all" @click="showAddModal = false; editingDudi = null">Batal</button>
                        <button type="submit" class="flex-1 px-6 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-blue-600/40 hover:scale-[1.03] transition-all" x-text="editingDudi ? 'Simpan Perubahan' : 'Daftarkan Mitra'"></button>
                    </div>
                </form>
            </div>
        </div>
    </template>
</div>
@endsection
