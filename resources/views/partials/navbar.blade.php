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
