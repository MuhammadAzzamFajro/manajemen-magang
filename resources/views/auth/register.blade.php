<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daftar - Magang</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Outfit', 'sans-serif'],
                        outfit: ['Outfit', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <style>body { font-family: 'Outfit', sans-serif; }</style>
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body class="bg-[#0f172a] flex items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-md">
        <div class="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-3xl p-8 shadow-2xl">
            <div class="text-center mb-8">
                <h1 class="text-2xl font-black text-white uppercase tracking-tighter">Buat Akun Baru</h1>
                <p class="text-gray-400 text-sm">Bergabunglah dengan ekosistem magang kami</p>
            </div>

            <form action="{{ route('register') }}" method="POST" class="space-y-4">
                @csrf
                <div>
                    <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
                    <input type="text" name="name" required class="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 px-4 text-white focus:border-cyan-500 focus:outline-none transition">
                </div>

                <div>
                    <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Email</label>
                    <input type="email" name="email" required class="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 px-4 text-white focus:border-cyan-500 focus:outline-none transition">
                </div>

                <div>
                    <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Password</label>
                    <input type="password" name="password" required class="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 px-4 text-white focus:border-cyan-500 focus:outline-none transition">
                </div>

                <div>
                    <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Konfirmasi Password</label>
                    <input type="password" name="password_confirmation" required class="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 px-4 text-white focus:border-cyan-500 focus:outline-none transition">
                </div>

                <div>
                    <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Daftar Sebagai</label>
                    <div class="grid grid-cols-2 gap-3" x-data="{ role: 'Siswa' }">
                        <label class="relative cursor-pointer">
                            <input type="radio" name="role" value="Siswa" x-model="role" class="sr-only">
                            <div :class="role === 'Siswa' ? 'bg-cyan-600 border-cyan-500' : 'bg-gray-900 border-gray-700'" class="py-3 px-4 rounded-xl border text-center text-xs font-bold text-white transition-all">
                                <i class="fas fa-user-graduate mr-1"></i> Siswa
                            </div>
                        </label>
                        <label class="relative cursor-pointer">
                            <input type="radio" name="role" value="Guru" x-model="role" class="sr-only">
                            <div :class="role === 'Guru' ? 'bg-blue-600 border-blue-500' : 'bg-gray-900 border-gray-700'" class="py-3 px-4 rounded-xl border text-center text-xs font-bold text-white transition-all">
                                <i class="fas fa-chalkboard-teacher mr-1"></i> Guru
                            </div>
                        </label>
                    </div>
                </div>

                <button type="submit" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all">
                    Daftar Akun
                </button>
            </form>

            <p class="mt-8 text-center text-gray-500 text-xs">
                Sudah punya akun? <a href="{{ route('login') }}" class="text-blue-400 font-bold hover:underline">Login di sini</a>
            </p>
        </div>
    </div>
</body>
</html>
