// app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Panggilan API untuk login
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Simpan token di localStorage untuk API calls
        localStorage.setItem('token', data.token);
        router.push('/dashboard/guru');
      } else {
        setError(data.message || 'Login gagal. Periksa kembali email dan password Anda.');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Login</h2>
        <form onSubmit={handleLogin}>
          {error && <div className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</div>}
          
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              // onChange handler untuk menyimpan input ke state
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="Masukkan email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              // onChange handler untuk menyimpan input ke state
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="Masukkan password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg py-2 font-bold text-white transition-colors duration-200 ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;