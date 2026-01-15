<!-- Mobile Menu Toggle -->
<button @click="sidebarOpen = true" class="lg:hidden text-gray-400 hover:text-white transition-colors">
    <i class="fas fa-bars text-xl"></i>
</button>

<!-- Search Bar - Responsive -->
<div class="flex-1 max-w-md mx-4 md:mx-10 hidden md:block">
    <form action="{{ route('search') }}" method="GET" class="relative">
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
        <input
            type="text"
            name="q"
            placeholder="Cari logbook, magang..."
            class="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl px-12 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all"
        />
    </form>
</div>

<!-- User Menu -->
<div class="flex items-center gap-4">
    <div class="relative">
        <button @click="showUserMenu = !showUserMenu" class="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
            <div class="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {{ strtoupper(substr(auth()->user()->name, 0, 1)) }}
            </div>
            <span class="hidden md:block text-sm font-medium">{{ auth()->user()->name }}</span>
            <i class="fas fa-chevron-down text-xs"></i>
        </button>
        
        <!-- Dropdown Menu -->
        <div x-show="showUserMenu" 
             x-transition:enter="transition ease-out duration-200"
             x-transition:enter-start="opacity-0 scale-95"
             x-transition:enter-end="opacity-100 scale-100"
             x-transition:leave="transition ease-in duration-75"
             x-transition:leave-start="opacity-100 scale-100"
             x-transition:leave-end="opacity-0 scale-95"
             @click.away="showUserMenu = false"
             class="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50"
             x-cloak>
            <div class="p-2">
                <a href="#" class="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
                    <i class="fas fa-user text-sm"></i>
                    <span class="text-sm">Profil</span>
                </a>
                <a href="#" class="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
                    <i class="fas fa-cog text-sm"></i>
                    <span class="text-sm">Pengaturan</span>
                </a>
                <hr class="my-2 border-gray-700">
                <form action="{{ route('logout') }}" method="POST" class="block">
                    @csrf
                    <button type="submit" class="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors">
                        <i class="fas fa-sign-out-alt text-sm"></i>
                        <span class="text-sm">Keluar</span>
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
