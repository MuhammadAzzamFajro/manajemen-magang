<aside class="flex h-screen w-64 flex-col bg-gray-900 py-6 shadow-md border-r border-gray-700">
    <h2 class="px-6 text-lg font-semibold text-white mb-8">Portal Siswa</h2>

    <nav class="flex flex-col gap-2 px-4">
        <a href="{{ route('dashboard.siswa') }}"
           class="flex items-center gap-3 rounded-xl px-4 py-3 transition {{ Request::routeIs('dashboard.siswa') ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-gray-300 hover:bg-gray-800' }}">
            <div class="transition-colors"><i class="fas fa-home"></i></div>
            <div>
                <p class="text-sm font-medium">Dashboard</p>
                <p class="text-xs opacity-75">Ringkasan aktivitas</p>
            </div>
        </a>

        <a href="{{ route('siswa.dudi') }}"
           class="flex items-center gap-3 rounded-xl px-4 py-3 transition {{ Request::routeIs('siswa.dudi') ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-gray-300 hover:bg-gray-800' }}">
            <div class="transition-colors"><i class="fas fa-building"></i></div>
            <div>
                <p class="text-sm font-medium">DUDI</p>
                <p class="text-xs opacity-75">Dunia Usaha & Industri</p>
            </div>
        </a>

        <a href="{{ route('siswa.magang') }}"
           class="flex items-center gap-3 rounded-xl px-4 py-3 transition {{ Request::routeIs('siswa.magang') ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-gray-300 hover:bg-gray-800' }}">
            <div class="transition-colors"><i class="fas fa-graduation-cap"></i></div>
            <div>
                <p class="text-sm font-medium">Magang</p>
                <p class="text-xs opacity-75">Data magang saya</p>
            </div>
        </a>

        <a href="{{ route('siswa.logbook') }}"
           class="flex items-center gap-3 rounded-xl px-4 py-3 transition {{ Request::routeIs('siswa.logbook') ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-gray-300 hover:bg-gray-800' }}">
            <div class="transition-colors"><i class="fas fa-book-open"></i></div>
            <div>
                <p class="text-sm font-medium">Logbook</p>
                <p class="text-xs opacity-75">Catatan harian</p>
            </div>
        </a>
    </nav>
</aside>
