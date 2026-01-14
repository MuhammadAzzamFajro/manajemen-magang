<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Laravel')</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Tailwind CSS & Alpine.js CDN -->
    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    
    <style>
        [x-cloak] { display: none !important; }
        body {
            font-family: 'Poppins', sans-serif;
            scroll-behavior: smooth;
        }
        .page-enter {
            animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body class="font-sans antialiased bg-gray-900 text-white" x-data="{ showSwitchModal: false, switchRoleLabel: '', sidebarOpen: false }">
    <div class="flex min-h-screen bg-gray-900">
        <!-- Mobile Sidebar Overlay -->
        <div x-show="sidebarOpen" 
             x-transition:enter="transition-opacity ease-linear duration-300"
             x-transition:enter-start="opacity-0"
             x-transition:enter-end="opacity-100"
             x-transition:leave="transition-opacity ease-linear duration-300"
             x-transition:leave-start="opacity-100"
             x-transition:leave-end="opacity-0"
             @click="sidebarOpen = false"
             class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" x-cloak></div>

        @if(Request::is('dashboard/guru*'))
            @include('partials.sidebar-guru')
        @elseif(Request::is('dashboard/siswa*'))
            @include('partials.sidebar-siswa')
        @endif

        <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
            @include('partials.navbar')

            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800 p-6">
                <!-- Flash Messages -->
                @if(session('success'))
                    <div class="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-400 rounded-xl flex items-center gap-3">
                        <i class="fas fa-check-circle"></i>
                        <span>{{ session('success') }}</span>
                    </div>
                @endif

                @if($errors->has('switch_email'))
                    <div class="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl flex items-center gap-3">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>{{ $errors->first('switch_email') }}</span>
                    </div>
                @endif

                @if($errors->any() && !$errors->has('switch_email'))
                    <div class="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl">
                        <div class="flex items-center gap-3 mb-2">
                            <i class="fas fa-exclamation-circle"></i>
                            <span class="font-bold">Terjadi Kesalahan:</span>
                        </div>
                        <ul class="list-disc list-inside text-sm opacity-80">
                            @foreach($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <div class="page-enter">
                    @yield('content')
                </div>
            </main>
        </div>
    </div>

    <!-- Global Switch Role Modal -->
    <template x-teleport="body">
        <div x-show="showSwitchModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4" x-cloak>
            <div class="absolute inset-0 bg-black/90 backdrop-blur-xl" @click="showSwitchModal = false"></div>
            <div class="relative bg-gray-800 border-2 border-gray-700 w-full max-w-md rounded-[3rem] shadow-2xl p-10">
                <div class="text-center mb-8">
                    <div class="w-20 h-20 bg-cyan-600/20 text-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
                        <i class="fas fa-user-shield text-3xl"></i>
                    </div>
                    <h2 class="text-2xl font-black text-white uppercase tracking-tighter">Verifikasi Akses</h2>
                    <p class="text-gray-400 text-sm mt-1">Silakan masukkan email <span class="font-bold text-white" x-text="switchRoleLabel"></span> untuk melanjutkan</p>
                </div>

                <form action="{{ route('switch.role') }}" method="POST" class="space-y-6">
                    @csrf
                    <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Kredensial</label>
                        <input type="email" name="email" class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition" :placeholder="`Masukkan email ${switchRoleLabel}...`" required>
                    </div>

                    <div class="flex gap-4">
                        <button type="button" class="flex-1 py-4 bg-gray-700 text-gray-300 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-600 transition" @click="showSwitchModal = false">Batal</button>
                        <button type="submit" class="flex-1 py-4 bg-cyan-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-cyan-600/40 hover:bg-cyan-500 transition">Verifikasi</button>
                    </div>
                </form>
            </div>
        </div>
    </template>
</body>
</html>
