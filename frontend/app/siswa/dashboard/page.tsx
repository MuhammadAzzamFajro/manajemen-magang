'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSiswaDashboard } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import {
  Calendar,
  CheckCircle2,
  BookOpen,
  MapPin,
  User,
  ArrowRight,
  Clock,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

// Helper to format uppercase Indonesian date e.g. "RABU, 19 AGUSTUS 2026"
const formatUppercaseDate = (d = new Date()) => {
  const days = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
  const months = [
    'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
    'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
  ];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export default function SiswaDashboardPage() {
  const user = getAuthUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const siswaId = user?.siswa_id || user?.id || 0;

  const { data, isLoading } = useQuery({
    queryKey: ['siswa-dashboard', siswaId],
    queryFn: () => getSiswaDashboard(siswaId),
    enabled: isMounted && !!siswaId,
  });

  const {
    siswa,
    penempatan,
    total_hadir = 0,
    total_jurnal = 0,
    jurnal_disetujui = 0,
    absensi_hari_ini,
  } = data || {};

  const siswaName = siswa?.nama_lengkap || user?.nama || user?.name || 'Siswa';
  const belumMagang = siswa?.status_magang === 'belum_magang' || !penempatan;
  const namaPerusahaan = belumMagang
    ? null
    : penempatan?.tempatMagang?.nama_perusahaan || penempatan?.tempat_magang?.nama_perusahaan || '—';
  const alamatPerusahaan = belumMagang
    ? null
    : penempatan?.tempatMagang?.alamat || penempatan?.tempat_magang?.alamat || '—';
  const namaGuru = belumMagang ? null : penempatan?.guru?.nama_lengkap || '—';
  const nipGuru = belumMagang ? null : penempatan?.guru?.nip || '—';

  const hariKe = useMemo(() => {
    // Estimate internship days count based on total attendance or minimum 2
    return total_hadir > 0 ? total_hadir + 1 : 2;
  }, [total_hadir]);

  // Skeleton Loader for Hydration Safety
  if (!isMounted || isLoading) {
    return (
      <div className="space-y-8 font-sans animate-pulse">
        <div className="h-36 rounded-3xl bg-blue-200/60" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-gray-100" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-64 rounded-2xl bg-gray-100" />
          <div className="h-64 rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* ── Welcome Hero Banner ───────────────────────────────────────────── */}
      <div className="p-8 rounded-3xl bg-blue-600 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <p className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">
            {formatUppercaseDate()}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {belumMagang ? `Selamat datang, ${siswaName}!` : `Semangat magang, ${siswaName}!`}
          </h1>
          {belumMagang ? (
            <p className="text-sm text-blue-100">
              Anda belum terdaftar magang. Ajukan pengajuan ke DUDI pilihan untuk memulai kegiatan magang Anda.
            </p>
          ) : (
            <p className="text-sm text-blue-100">
              Anda magang di <strong className="text-white font-bold">{namaPerusahaan}</strong>. Jangan lupa isi absensi hari ini.
            </p>
          )}
        </div>
        <Link
          href={belumMagang ? '/siswa/pengajuan' : '/siswa/absensi'}
          className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shrink-0 relative z-10"
        >
          <Calendar className="w-4 h-4" /> {belumMagang ? 'Ajukan Magang' : 'Isi Absensi'} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ── 3 Stat Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Progres/Status Magang */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {belumMagang ? 'STATUS MAGANG' : 'PROGRES MAGANG'}
            </p>
            <h3 className="text-2xl font-extrabold text-gray-900 leading-tight mt-0.5">
              {belumMagang ? 'Belum Magang' : `Hari ke-${hariKe}`}
            </h3>
            <p className="text-xs text-gray-400">
              {belumMagang ? 'Belum ada penempatan di DUDI' : 'dari 92 hari magang (s/d 18 Nov 2026)'}
            </p>
          </div>
        </div>

        {/* Card 2: Total Kehadiran */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">TOTAL KEHADIRAN</p>
            <h3 className="text-2xl font-extrabold text-gray-900 leading-tight mt-0.5">{total_hadir} hari</h3>
            <p className="text-xs text-gray-400">Kehadiran tercatat</p>
          </div>
        </div>

        {/* Card 3: Jurnal Ditulis */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">JURNAL DITULIS</p>
            <h3 className="text-2xl font-extrabold text-gray-900 leading-tight mt-0.5">{total_jurnal} laporan</h3>
            <p className="text-xs text-gray-400">Semua terverifikasi</p>
          </div>
        </div>
      </div>

      {/* ── Main Widgets Section (2 Columns) ─────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Widget: Informasi Magang */}
        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Informasi Magang</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {belumMagang ? 'Belum ada penempatan magang untuk Anda.' : 'Detail tempat dan pembimbing magang Anda.'}
              </p>
            </div>
            {!belumMagang && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Disetujui
              </span>
            )}
          </div>

          {belumMagang ? (
            <div className="p-6 rounded-xl border-2 border-dashed border-gray-200 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-gray-700">Anda belum ditempatkan magang</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Silakan cari DUDI yang sesuai lalu ajukan pengajuan magang. Setelah disetujui admin, detail tempat dan guru pembimbing akan tampil di sini.
              </p>
              <Link
                href="/siswa/pengajuan"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors"
              >
                Ajukan Magang <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
          <div className="space-y-4 pt-2">
            {/* Tempat Magang (DUDI) */}
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Tempat Magang (DUDI)
                </p>
                <p className="font-bold text-gray-800 text-sm mt-0.5">{namaPerusahaan}</p>
                <p className="text-xs text-gray-400 mt-0.5">{alamatPerusahaan}</p>
              </div>
            </div>

            {/* Guru Pembimbing */}
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Guru Pembimbing
                </p>
                <p className="font-bold text-gray-800 text-sm mt-0.5">{namaGuru}</p>
                <p className="text-xs text-gray-400 mt-0.5">{nipGuru}</p>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Right Widget: Quick Action Cards */}
        <div className="space-y-6">
          {belumMagang ? (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Langkah Pertama</h2>
                <MapPin className="w-5 h-5 text-blue-200" />
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">
                Ajukan pengajuan magang ke DUDI favorit Anda. Pilih posisi dan tentukan periode magang yang diinginkan.
              </p>
              <Link
                href="/siswa/pengajuan"
                className="w-full py-2.5 bg-white hover:bg-blue-50 text-blue-600 font-bold text-xs rounded-xl shadow-xs text-center block transition-colors mt-2"
              >
                Mulai Pengajuan Magang
              </Link>
            </div>
          ) : (
          <>
          {/* Card 1: Absensi Hari Ini */}
          <div className="p-6 rounded-2xl bg-blue-600 text-white shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Absensi Hari Ini</h2>
              <Clock className="w-5 h-5 text-blue-200" />
            </div>
            <p className="text-xs text-blue-100 leading-relaxed">
              Jangan lupa mengisi daftar hadir sebelum dan sesudah jam kerja magang.
            </p>
            <Link
              href="/siswa/absensi"
              className="w-full py-2.5 bg-white hover:bg-blue-50 text-blue-600 font-bold text-xs rounded-xl shadow-xs text-center block transition-colors mt-2"
            >
              Isi Absensi
            </Link>
          </div>

          {/* Card 2: Jurnal Kegiatan */}
          <div className="p-6 rounded-2xl bg-white border border-gray-200 text-gray-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Jurnal Kegiatan</h2>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Tulis pengalaman dan aktivitas harian Anda.
            </p>
            <Link
              href="/siswa/jurnal"
              className="w-full py-2.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-800 font-bold text-xs rounded-xl text-center block transition-colors mt-2"
            >
              Tulis Jurnal
            </Link>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
