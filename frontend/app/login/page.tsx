'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Eye, EyeOff, Lock, Mail, Check } from 'lucide-react';
import { signIn } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const profile = await signIn(email.trim().toLowerCase(), password);

      // Redirect berdasarkan role dari response Laravel
      if (profile.role === 'admin')      router.push('/admin/dashboard');
      else if (profile.role === 'guru')  router.push('/guru/dashboard');
      else if (profile.role === 'siswa') router.push('/siswa/dashboard');
      else                               router.push('/admin/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal masuk. Periksa email & password Anda.');
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 font-sans">
      {/* Panel Kiri: Gradient Biru */}
      <div className="hidden lg:flex flex-col justify-between p-14 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute top-12 left-12 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-12 right-12 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight">SIMMAS</span>
        </div>

        <div className="space-y-8 max-w-lg relative z-10">
          <h2 className="text-5xl font-black leading-[1.1] tracking-tight">
            Magang lebih<br />
            <span className="text-blue-200">teratur.</span>
          </h2>

          <div className="space-y-4">
            {[
              'Penempatan magang terpusat & transparan',
              'Monitoring kehadiran & jurnal real-time',
              'Koordinasi sekolah, guru, dan industri',
            ].map((text) => (
              <div key={text} className="flex items-center gap-3 text-sm font-semibold text-blue-100">
                <div className="w-5 h-5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                {text}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
            <div>
              <div className="text-2xl font-black">50+</div>
              <div className="text-xs text-blue-300 font-medium">SMK Aktif</div>
            </div>
            <div>
              <div className="text-2xl font-black text-blue-200">10k+</div>
              <div className="text-xs text-blue-300 font-medium">Siswa Terdaftar</div>
            </div>
            <div>
              <div className="text-2xl font-black text-indigo-300">200+</div>
              <div className="text-xs text-blue-300 font-medium">Mitra DUDI</div>
            </div>
          </div>
        </div>

        <p className="text-xs text-blue-400 relative z-10">© 2026 SIMMAS Indonesia. All rights reserved.</p>
      </div>

      {/* Panel Kanan: Form Login */}
      <div className="flex items-center justify-center p-5 sm:p-8 lg:p-14 bg-[#f8fafc]">
        <div className="w-full max-w-md space-y-8">
          <div>
            <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold uppercase tracking-wider inline-block mb-3">
              PORTAL MASUK
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Masuk ke akun Anda.</h2>
            <p className="text-slate-500 text-xs mt-1.5">Masukkan email sekolah & kata sandi terdaftar.</p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Email Sekolah
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@simmas.sch.id"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium shadow-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-blue-600 hover:underline font-semibold">Lupa?</a>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm tracking-wide"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</>
                : 'Masuk Dashboard →'}
            </button>
          </form>

          {/* Akun Demo (email sesuai data di MySQL kamu) */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-wider">AKUN DEMO FAST-FILL</p>
            <div className="space-y-2">
              {[
                { email: 'admin@simmas.sch.id', label: 'ADMIN', color: 'blue' },
                { email: 'guru@simmas.sch.id',  label: 'GURU',  color: 'teal' },
                { email: 'siswa@simmas.sch.id', label: 'SISWA', color: 'indigo' },
              ].map(({ email: demoEmail, label, color }) => (
                <button
                  key={demoEmail}
                  type="button"
                  onClick={() => quickFill(demoEmail)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-between transition-all shadow-xs"
                >
                  <span>{demoEmail}</span>
                  <span className={`px-2 py-0.5 rounded-md bg-${color}-50 text-${color}-600 border border-${color}-200 font-extrabold text-[10px]`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-center text-[10px] text-slate-400">
              Password demo: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">password</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
