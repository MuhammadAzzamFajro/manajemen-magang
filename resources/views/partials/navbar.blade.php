<header class="w-full bg-gray-900 border-b border-gray-800 px-4 md:px-8 py-4 flex items-center justify-between z-30">
    <div class="flex items-center gap-4">
        <!-- Mobile Menu Toggle -->
        <button @click="sidebarOpen = true" class="lg:hidden p-2 text-gray-400 hover:text-white transition-colors">
            <i class="fas fa-bars text-xl"></i>
        </button>
        
        <div class="text-lg font-black text-white hidden sm:block uppercase tracking-tighter">
            SMK <span class="text-blue-500">N 1</span> SBY
        </div>
    </div>

    <!-- Search Bar - Responsive -->
    <div class="flex-1 max-w-md mx-4 md:mx-10 hidden md:block">
        <div class="relative">
            <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
            <input
                type="text"
                placeholder="Cari logbook, magang..."
                class="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl px-12 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all"
            />
        </div>
    </div>
    <div class="flex items-center gap-4">
        <div class="text-sm text-right">
            <div class="text-white font-bold leading-none">
                {{ Auth::user()->name ?? 'Administrator' }}
            </div>
            <div class="text-gray-500 text-[10px] uppercase tracking-widest mt-1">
                @if(Request::is('dashboard/siswa*')) Siswa @else Guru Pembimbing @endif
            </div>
        </div>
        <div class="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold cursor-pointer hover:bg-cyan-600 shadow-lg shadow-cyan-500/20">
            {{ substr(Auth::user()->name ?? 'A', 0, 1) }}
        </div>

        @auth
        <form action="{{ route('logout') }}" method="POST">
            @csrf
            <button type="submit" class="text-gray-500 hover:text-red-400 transition ml-2">
                <i class="fas fa-sign-out-alt"></i>
            </button>
        </form>
        @else
        <a href="{{ route('login') }}" class="text-gray-500 hover:text-cyan-400 transition ml-2">
            <i class="fas fa-sign-in-alt"></i>
        </a>
        @endauth
    </div>
</header>
