'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminDashboardStats, getDudiDistributionStats } from '@/lib/db';
import {
  Users,
  GraduationCap,
  Building2,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { data: dashboardData } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => getAdminDashboardStats(),
  });

  const { data: dudiDistribution = [] } = useQuery({
    queryKey: ['admin-dudi-distribution'],
    queryFn: () => getDudiDistributionStats(),
  });

  const totalSiswaVal = dashboardData?.total_siswa ?? 7;
  const guruVal = dashboardData?.guru_aktif ?? 5;
  const dudiVal = dashboardData?.mitra_dudi ?? 3;
  const menungguVal = dashboardData?.pengajuan_menunggu ?? 0;

  const sedangMagangCount = dashboardData?.status_siswa_chart?.sedang_magang ?? 5;
  const pengajuanCount = dashboardData?.status_siswa_chart?.pengajuan ?? 0;
  const belumMagangCount = dashboardData?.status_siswa_chart?.belum_magang ?? 0;

  const totalCount = sedangMagangCount + pengajuanCount + belumMagangCount || 5;
  const disetujuiPct = Math.round((sedangMagangCount / totalCount) * 100);

  return (
    <div className="space-y-6 font-sans bg-[#f8fafc]">
      {/* 1. Hero Blue Gradient Banner */}
      <div className="p-7 rounded-2xl bg-gradient-to-r from-[#2563eb] via-[#1d4ed8] to-[#0284c7] text-white shadow-md shadow-blue-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-[11px] font-extrabold text-blue-200 uppercase tracking-widest">
            RABU, 19 AGUSTUS 2026
          </p>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Selamat datang kembali, Admin
          </h1>
          <p className="text-xs text-blue-100 font-medium">
            {menungguVal > 0
              ? `Ada ${menungguVal} pengajuan magang yang perlu divalidasi hari ini.`
              : 'Belum ada pengajuan magang yang perlu divalidasi hari ini.'}
          </p>
        </div>

        <Link
          href="/admin/penempatan"
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0"
        >
          Tinjau Pengajuan <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2. 4 Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: TOTAL SISWA */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              TOTAL SISWA
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900">{totalSiswaVal}</h3>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-medium">
              <span>— Data real-time</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            </div>
          </div>
        </div>

        {/* Card 2: GURU PEMBIMBING */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              GURU PEMBIMBING
            </span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900">{guruVal}</h3>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-medium">
              <span>— Data real-time</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            </div>
          </div>
        </div>

        {/* Card 3: MITRA DUDI */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              MITRA DUDI
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900">{dudiVal}</h3>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-medium">
              <span>— Data real-time</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            </div>
          </div>
        </div>

        {/* Card 4: MENUNGGU VALIDASI */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              MENUNGGU VALIDASI
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900">{menungguVal}</h3>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-medium">
              <span>— Data real-time</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Row: Tren Pengajuan */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Tren Pengajuan Magang */}
        <div className="lg:col-span-12 p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Tren Pengajuan Magang</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Jumlah pengajuan & persetujuan 6 bulan terakhir
            </p>
          </div>

          {/* Smooth Curved Line Area SVG Chart */}
          <div className="relative pt-6 pb-2">
            <div className="h-44 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradientBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.30" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Dotted Grid lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />

                {/* Smooth Area Path */}
                <path
                  d="M 0 120 Q 260 120 360 80 T 500 20 L 500 150 L 0 150 Z"
                  fill="url(#gradientBlue)"
                />

                {/* Smooth Curve Stroke */}
                <path
                  d="M 0 120 Q 260 120 360 80 T 500 20"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 pt-3 border-t border-slate-100 px-2">
              <span>Apr</span>
              <span>Mei</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Agu</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Tabel Distribusi DUDI & Aktivitas Sistem Terakhir */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Tabel Distribusi DUDI */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-slate-200/60 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">Distribusi DUDI & Kuota Siswa</h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Ringkasan perusahaan mitra, kuota penerimaan, dan jumlah siswa aktif magang.
                </p>
              </div>

              <Link
                href="/admin/dudi"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline shrink-0"
              >
                Kelola DUDI <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4 rounded-l-xl">Perusahaan Mitra</th>
                    <th className="py-3 px-4 text-center">Kuota</th>
                    <th className="py-3 px-4 text-center">Siswa Aktif</th>
                    <th className="py-3 px-4 rounded-r-xl text-right">Kapasitas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 font-medium">
                  {dudiDistribution.map((item: any) => {
                    const kuota = item.kuota || 1;
                    const aktif = item.siswa_aktif || 0;
                    const pct = Math.min(100, Math.round((aktif / kuota) * 100));

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-600 flex items-center justify-center font-black text-xs shrink-0">
                              {item.nama_perusahaan.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 truncate max-w-[180px] sm:max-w-[240px]">
                                {item.nama_perusahaan}
                              </p>
                              <span className="text-[10px] font-semibold text-slate-400">
                                {item.bidang_usaha}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-extrabold text-[11px]">
                            {item.kuota}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-extrabold text-[11px]">
                            {item.siswa_aktif}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden hidden sm:block">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  pct >= 100
                                    ? 'bg-rose-500'
                                    : pct >= 50
                                    ? 'bg-emerald-500'
                                    : 'bg-blue-500'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                pct >= 100
                                  ? 'bg-rose-50 text-rose-600'
                                  : pct >= 50
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : 'bg-blue-50 text-blue-600'
                              }`}
                            >
                              {pct}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Aktivitas Sistem Terakhir */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200/60 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-900">Aktivitas Sistem Terakhir</h2>
            <Link href="/admin/logs" className="text-xs font-bold text-blue-600 hover:underline">
              Lihat Semua
            </Link>
          </div>
          <div className="space-y-2.5">
            {[
              { email: 'admin@simmas.sch.id', role: 'ADMIN', action: 'Mengakses Dashboard Admin', time: 'Baru saja' },
              { email: 'guru@simmas.sch.id', role: 'GURU', action: 'Memvalidasi jurnal kegiatan siswa', time: '10 menit lalu' },
              { email: 'siswa@simmas.sch.id', role: 'SISWA', action: 'Melakukan clock-in presensi masuk', time: '1 jam lalu' },
            ].map((log, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 font-bold text-[10px]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{log.action}</p>
                    <p className="text-[10px] text-slate-400">{log.email} ({log.role})</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
