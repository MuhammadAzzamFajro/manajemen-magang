<header class="w-full bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
    <div class="text-lg font-semibold text-white">
        SMK Negeri 1 Surabaya
    </div>
    <div class="flex-1 max-w-md mx-8">
        <input
            type="text"
            placeholder="Cari logbook, magang..."
            class="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
