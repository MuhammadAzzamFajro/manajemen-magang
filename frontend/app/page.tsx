'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLandingStats } from '@/lib/db';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Award,
  FileSpreadsheet,
  Check,
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const { data: stats } = useQuery({
    queryKey: ['landing-stats'],
    queryFn: () => getLandingStats(),
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative">
      {/* Background Decorative Circle Ring (Left Bottom) */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 border-2 border-slate-200/60 rounded-full pointer-events-none -z-0 hidden md:block" />

      {/* Background Giant Solid Blue Cut (Right Side - Desktop Only) */}
      <div className="absolute top-0 right-0 w-[42%] h-[850px] bg-[#2563eb] -skew-x-6 transform origin-top-right z-0 hidden lg:block rounded-bl-[80px]" />

      {/* Floating Pill Header */}
      <div className="w-full px-3 sm:px-6 pt-3 sm:pt-6 sticky top-0 z-50">
        <header className="bg-white/95 backdrop-blur-md rounded-full shadow-lg shadow-slate-200/50 border border-slate-100/80 px-4 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
          {/* Logo Brand */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] flex items-center justify-center text-white shadow-md shadow-blue-500/30">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-base sm:text-lg font-black tracking-tight text-slate-900">SIMMAS</span>
          </div>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#fitur" className="hover:text-blue-600 transition-colors">Fitur</a>
            <a href="#panduan" className="hover:text-blue-600 transition-colors">Panduan</a>
          </nav>

          {/* Action Buttons (Responsive) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href="/login" className="hidden sm:inline-block px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">
              Masuk
            </Link>
            <Link href="/login" className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-full shadow-md shadow-blue-500/30 transition-all flex items-center gap-1.5 sm:gap-2">
              <span>Mulai Sekarang</span> <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-6 sm:pt-12 pb-16 sm:pb-24 px-4 sm:px-6 sm:px-12 w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-7">
            <p className="text-slate-400 font-extrabold text-[10px] sm:text-[11px] tracking-[0.18em] uppercase">
              SISTEM INFORMASI MANAJEMEN MAGANG SISWA
            </p>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Magang <br className="hidden sm:inline" />lebih <br className="hidden sm:inline" />teratur.
            </h1>

            <p className="text-slate-500 text-xs sm:text-sm md:text-base max-w-md leading-relaxed">
              Platform manajemen magang siswa SMK yang menghubungkan sekolah, guru pembimbing, dan dunia usaha dalam satu sistem terpadu.
            </p>

            {/* Checklist items */}
            <div className="space-y-2.5 sm:space-y-3 pt-1">
              {[
                'Penempatan magang terpusat & transparan',
                'Monitoring kehadiran & jurnal real-time',
                'Koordinasi sekolah, guru, dan industri',
              ].map((text) => (
                <div key={text} className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-bold text-slate-700">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Hero CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link href="/login" className="px-6 sm:px-8 py-3.5 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2">
                Mulai Sekarang <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#fitur" className="px-6 sm:px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl border border-slate-200/80 transition-all text-center">
                Lihat Fitur
              </a>
            </div>
          </div>

          {/* Right Column: Floating Mockup */}
          <div className="lg:col-span-6 relative mt-6 lg:mt-0">
            {/* Live Badge */}
            <div className="absolute -top-3 right-2 sm:right-4 z-30 bg-[#1e293b] text-white rounded-xl px-3.5 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-extrabold shadow-2xl flex items-center gap-2 border border-slate-700/50">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
              <span className="text-slate-400">LIVE</span>
              <span className="text-white font-black">{stats?.siswa_aktif || 324} Siswa</span>
            </div>

            {/* Mockup Container */}
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>

              <div className="grid grid-cols-12 min-h-[340px] sm:min-h-[380px] bg-slate-50 text-[10px] sm:text-[11px]">
                {/* Mini Sidebar */}
                <div className="col-span-4 bg-white border-r border-slate-100 p-2.5 sm:p-3 space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-[9px] sm:text-[10px]">S</div>
                    <span className="font-extrabold text-slate-800 text-[10px] sm:text-xs">SIMMAS</span>
                  </div>
                  <div className="space-y-1">
                    {['Beranda', 'Data Siswa', 'Data Guru', 'Mitra DUDI', 'Permohonan Magang', 'Penempatan'].map((item, i) => (
                      <div key={item} className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg font-medium truncate ${i === 0 ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-500'}`}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mini Dashboard Content */}
                <div className="col-span-8 p-3 sm:p-4 space-y-3 bg-white overflow-x-auto">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h4 className="font-bold text-slate-800 text-[10px] sm:text-xs">Dashboard</h4>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">Admin</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
                    {[['Total Siswa', stats?.siswa_aktif || 324], ['Total Guru', 45], ['Mitra DUDI', stats?.total_dudi || 112]].map(([label, val]) => (
                      <div key={label as string} className="p-1.5 sm:p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <p className="text-[8px] sm:text-[9px] text-slate-400 truncate">{label}</p>
                        <p className="text-xs sm:text-sm font-extrabold text-slate-800">{val}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <p className="font-bold text-[9px] sm:text-[10px] text-slate-700">Daftar Permohonan Magang Siswa</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[8px] sm:text-[9px]">
                        <thead className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100">
                          <tr><th className="py-1 px-1">Nama</th><th className="py-1 px-1">Kelas</th><th className="py-1 px-1 text-right">Status</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {[['Nama Siswa', 'RPL', 'Disetujui'], ['Nama Siswa2', 'TKJ', 'Menunggu'], ['Nama Siswa3', 'RPL', 'Disetujui']].map(([n, k, s]) => (
                            <tr key={n}><td className="py-1 px-1 font-semibold text-slate-700 truncate">{n}</td><td className="py-1 px-1 text-slate-500">{k}</td><td className="py-1 px-1 text-right"><span className={`px-1 py-0.5 rounded-full font-bold ${s === 'Disetujui' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{s}</span></td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Feature Cards */}
      <section id="fitur" className="py-12 sm:py-20 px-4 sm:px-6 bg-white border-t border-slate-100 relative z-10">
        <div className="w-full space-y-8 sm:space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2 sm:space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Fitur Peran Pengguna</h2>
            <p className="text-slate-500 text-xs sm:text-sm">Dikembangkan menyesuaikan alur kerja tiap pemangku kepentingan.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'blue', title: 'Siswa Magang', desc: 'Pengajuan magang mandiri, presensi foto harian clock-in/out, dan pencatatan jurnal harian real-time.', features: ['Clock In / Clock Out Presensi', 'Jurnal Harian & Foto Bukti', 'Stepper Tracking Pengajuan'] },
              { icon: <Award className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'teal', title: 'Guru Pembimbing', desc: 'Monitoring seluruh siswa bimbingan, validasi jurnal & absensi, serta catatan kunjungan lapangan.', features: ['Evaluasi & Revisi Jurnal', 'Timeline Kunjungan Lapangan', 'Penilaian Akhir (Skala 0–100)'] },
              { icon: <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'indigo', title: 'Administrator Sekolah', desc: 'Pengelolaan master data guru, siswa, mitra DUDI, plotting bimbingan, serta audit log transparan.', features: ['Plotting Pembimbing & Kuota DUDI', 'Monitoring Global Presensi', 'Audit Log & System Settings'] },
            ].map(({ icon, color, title, desc, features }) => (
              <div key={title} className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col justify-between group">
                <div>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-${color}-100 text-${color}-600 flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform`}>{icon}</div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-6">{desc}</p>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  {features.map((f) => <li key={f} className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 text-${color}-600`} /> {f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Step Guide */}
      <section id="panduan" className="py-12 sm:py-20 px-4 sm:px-6 bg-slate-50 border-t border-slate-100 relative z-10">
        <div className="w-full space-y-8 sm:space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Panduan Alur Kerja SIMMAS</h2>
            <p className="text-slate-500 text-xs sm:text-sm">4 langkah terintegrasi mengawal siklus magang siswa.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { n: 1, t: 'Registrasi DUDI', d: 'Admin menginput & memverifikasi profil mitra perusahaan DUDI serta batasan kuota.' },
              { n: 2, t: 'Pengajuan Magang', d: 'Siswa memilih tempat magang mandiri atau ditentukan via plotting admin sekolah.' },
              { n: 3, t: 'Persetujuan & Plotting', d: 'Admin mengesahkan status penempatan dan menentukan guru pembimbing siswa.' },
              { n: 4, t: 'Monitoring Real-time', d: 'Siswa mengisi presensi & jurnal, guru memvalidasi & menginput nilai akhir.' },
            ].map(({ n, t, d }) => (
              <div key={n} className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-100 space-y-3 shadow-xs">
                <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center">{n}</span>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">{t}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-slate-200 py-8 sm:py-10 bg-white text-xs text-slate-500 relative z-10">
        <div className="w-full px-4 sm:px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="font-bold text-slate-900">SIMMAS</span> — Sistem Informasi Manajemen Magang Siswa © 2026
          </div>
          <p>Direkayasa untuk Uji Kompetensi Keahlian (SERKOM) RPL</p>
        </div>
      </footer>
    </div>
  );
}
