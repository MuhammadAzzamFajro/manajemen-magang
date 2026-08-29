<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Laravel')</title>
    
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <!-- Tailwind CSS (Stable v3) & Alpine.js -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Outfit', 'sans-serif'],
                        outfit: ['Outfit', 'sans-serif'],
                    },
                    colors: {
                        gray: {
                            950: '#030712',
                        }
                    }
                }
            }
        }
    </script>
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

    <style>
        [x-cloak] { display: none !important; }
        * { font-display: swap; }
        body {
            font-family: 'Outfit', sans-serif;
            scroll-behavior: smooth;
            -webkit-font-smoothing: antialiased;
        }
        .page-enter {
            animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
        }
        /* Performance optimization: hardware acceleration */
        .will-change-transform { will-change: transform; }
    </style>
</head>
<body class="font-sans antialiased bg-gray-900 text-white overflow-x-hidden" x-data="{ showSwitchModal: {{ $errors->has('switch_email') || $errors->has('email') ? 'true' : 'false' }}, switchRoleLabel: '{{ old('role', '') }}', sidebarOpen: false, showUserMenu: false }">
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

        @php
            $activeRole = session('active_role', Auth::user()?->role);
        @endphp

        @if(Request::is('dashboard/guru*') || ($activeRole === 'Guru' && Request::routeIs('search')))
            @include('partials.sidebar-guru')
        @elseif(Request::is('dashboard/siswa*') || ($activeRole === 'Siswa' && Request::routeIs('search')))
            @include('partials.sidebar-siswa')
        @endif

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col min-w-0">
            <div class="sticky top-0 z-30 bg-gray-900/80 backdrop-blur border-b border-gray-800">
                <div class="px-4 md:px-6 lg:px-8 py-3">
                    @include('partials.navbar')
                </div>
            </div>

            <main class="flex-1 bg-gray-800 p-4 md:p-6 lg:p-8 overflow-y-auto">
                @yield('content')
            </main>
        </div>
    </div>

    <!-- Global Switch Role Modal -->
    <div x-show="showSwitchModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4" x-cloak>
        <div class="absolute inset-0 bg-black/90 backdrop-blur-xl" @click="showSwitchModal = false"></div>
        <div class="relative bg-gray-800 border-2 border-gray-700 w-full max-w-md rounded-[3rem] shadow-2xl p-10" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="opacity-0 scale-90" x-transition:enter-end="opacity-100 scale-100">
            <div class="text-center mb-8">
                <div class="w-20 h-20 bg-cyan-600/20 text-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
                    <i class="fas fa-user-shield text-3xl"></i>
                </div>
                <h2 class="text-2xl font-black text-white uppercase tracking-tighter">Verifikasi Akses</h2>
                <p class="text-gray-400 text-sm mt-1">Masukkan email untuk beralih ke mode <span class="font-bold text-white" x-text="switchRoleLabel"></span></p>
            </div>

            <form action="{{ route('switch.role') }}" method="POST" class="space-y-6">
                @csrf
                <!-- Use :value binding for reliable one-way data flow to hidden input -->
                <input type="hidden" name="role" :value="switchRoleLabel">
                
                <div>
                    <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Kredensial</label>
                    <input type="email" name="email" class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition" placeholder="Masukkan email akun Anda" required>
                    @error('email')
                        <span class="text-red-400 text-xs mt-2 block">{{ $message }}</span>
                    @enderror
                    @if($errors->has('switch_email'))
                        <span class="text-red-400 text-xs mt-2 block">{{ $errors->first('switch_email') }}</span>
                    @endif
                </div>
                <div class="flex gap-4">
                    <button type="button" class="flex-1 py-4 bg-gray-700 text-gray-300 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-600 transition" @click="showSwitchModal = false">Batal</button>
                    <button type="submit" class="flex-1 py-4 bg-cyan-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-cyan-600/40 hover:bg-cyan-500 transition">Verifikasi</button>
                </div>
            </form>
        </div>
    </div>
    <!-- Global Notification System -->
    <script>
        function showNotification(message, type = 'success') {
            const existingNotifications = document.querySelectorAll('.global-notification');
            existingNotifications.forEach(n => n.remove());

            const notification = document.createElement('div');
            notification.className = `global-notification fixed top-6 right-6 px-8 py-4 rounded-2xl font-bold shadow-2xl z-[200] transform transition-all duration-500 translate-y-[-20px] opacity-0 flex items-center gap-4 ${
                type === 'success' ? 'bg-green-600 text-white shadow-green-600/20' : 'bg-red-600 text-white shadow-red-600/20'
            }`;
            notification.innerHTML = `
                <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <i class="fas ${type === 'success' ? 'fa-check' : 'fa-exclamation'}"></i>
                </div>
                <span class="text-sm tracking-wide">${message}</span>
            `;
            
            document.body.appendChild(notification);

            // Animate in
            requestAnimationFrame(() => {
                notification.classList.remove('translate-y-[-20px]', 'opacity-0');
            });

            // Remove after 3s
            setTimeout(() => {
                notification.classList.add('translate-y-[-20px]', 'opacity-0');
                setTimeout(() => notification.remove(), 500);
            }, 3000);
        }

        @if(session('success'))
            document.addEventListener('DOMContentLoaded', () => {
                showNotification("{{ session('success') }}", 'success');
            });
        @endif

        @if(session('error'))
            document.addEventListener('DOMContentLoaded', () => {
                showNotification("{{ session('error') }}", 'error');
            });
        @endif
        
        @if($errors->any())
             // Optional: Show first validation error as notification if you want
             // document.addEventListener('DOMContentLoaded', () => {
             //    showNotification("{{ $errors->first() }}", 'error');
             // });
        @endif
    </script>
</body>
</html>
