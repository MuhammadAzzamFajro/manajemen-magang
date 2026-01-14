<aside 
    :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    class="fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 border-r border-gray-800 px-6 py-8 transform lg:static lg:translate-x-0 transition duration-300 ease-in-out shadow-2xl lg:shadow-none">
    
    <!-- Mobile Close Button -->
    <button @click="sidebarOpen = false" class="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-white">
        <i class="fas fa-times text-xl"></i>
    </button>
    <div class="mb-8">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <i class="fas fa-home"></i>
            </div>
            <div>
                <h3 class="text-lg font-semibold text-white">Magang</h3>
                <p class="text-xs text-gray-400">Management</p>
            </div>
        </div>
    </div>

    <nav class="space-y-2">
        <a href="{{ route('dashboard.guru') }}"
           class="flex items-center gap-3 p-3 rounded-lg {{ Request::routeIs('dashboard.guru') ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300' }}">
            <i class="fas fa-home text-xl {{ Request::routeIs('dashboard.guru') ? 'text-white' : 'text-blue-400' }}"></i>
            <span class="font-medium">Dashboard</span>
        </a>

        <a href="{{ route('guru.siswa') }}" class="flex items-center gap-3 p-3 rounded-lg {{ Request::routeIs('guru.siswa') ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300' }}">
            <i class="fas fa-user-graduate text-xl {{ Request::routeIs('guru.siswa') ? 'text-white' : 'text-blue-400' }}"></i>
            <div>
                <div class="font-medium">Siswa</div>
                <div class="text-xs text-gray-500">Kelola peserta magang</div>
            </div>
        </a>

        <a href="{{ route('guru.dudis') }}" class="flex items-center gap-3 p-3 rounded-lg {{ Request::routeIs('guru.dudis') ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300' }}">
            <i class="fas fa-briefcase text-xl {{ Request::routeIs('guru.dudis') ? 'text-white' : 'text-blue-400' }}"></i>
            <div>
                <div class="font-medium">DUDI</div>
                <div class="text-xs text-gray-500">Dunia Usaha & Industri</div>
            </div>
        </a>

        <a href="{{ route('guru.magang') }}" class="flex items-center gap-3 p-3 rounded-lg {{ Request::routeIs('guru.magang') ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300' }}">
            <i class="fas fa-clipboard text-xl {{ Request::routeIs('guru.magang') ? 'text-white' : 'text-blue-400' }}"></i>
            <div>
                <div class="font-medium">Magang</div>
                <div class="text-xs text-gray-500">Data siswa magang</div>
            </div>
        </a>

        <a href="{{ route('guru.logbook') }}" class="flex items-center gap-3 p-3 rounded-lg {{ Request::routeIs('guru.logbook') ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300' }}">
            <i class="fas fa-book-open text-xl {{ Request::routeIs('guru.logbook') ? 'text-white' : 'text-blue-400' }}"></i>
            <div>
                <div class="font-medium">Logbook</div>
                <div class="text-xs text-gray-500">Catatan harian</div>
            </div>
        </a>
    </nav>
</aside>
