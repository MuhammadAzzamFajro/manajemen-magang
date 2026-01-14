<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Pramagang</title>
    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>body { font-family: 'Poppins', sans-serif; }</style>
</head>
<body class="bg-[#0f172a] flex items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-md">
        <div class="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-3xl p-8 shadow-2xl">
            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg shadow-cyan-500/30">
                    <i class="fas fa-rocket"></i>
                </div>
                <h1 class="text-2xl font-black text-white uppercase tracking-tighter">Pramagang SMKN 1</h1>
                <p class="text-gray-400 text-sm">Silakan masuk ke akun Anda</p>
            </div>

            @if($errors->any())
                <div class="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl text-xs">
                    {{ $errors->first() }}
                </div>
            @endif

            <form action="{{ route('login') }}" method="POST" class="space-y-4">
                @csrf
                <div>
                    <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                    <div class="relative">
                        <i class="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"></i>
                        <input type="email" name="email" required class="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-white focus:border-cyan-500 focus:outline-none transition" placeholder="admin@gmail.com">
                    </div>
                </div>

                <div>
                    <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Password</label>
                    <div class="relative">
                        <i class="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"></i>
                        <input type="password" name="password" required class="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-white focus:border-cyan-500 focus:outline-none transition" placeholder="••••••••">
                    </div>
                </div>

                <button type="submit" class="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-2">
                    Login <i class="fas fa-arrow-right text-xs opacity-50"></i>
                </button>
            </form>

            <p class="mt-8 text-center text-gray-500 text-xs">
                Belum punya akun? <a href="{{ route('register') }}" class="text-cyan-400 font-bold hover:underline">Daftar Sekarang</a>
            </p>
        </div>
    </div>
</body>
</html>
