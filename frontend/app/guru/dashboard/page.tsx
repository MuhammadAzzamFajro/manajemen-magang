'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGuruDashboard } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { Users, BookOpen, CheckCircle2, FileText } from 'lucide-react';
import Link from 'next/link';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatShortDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

// ─── Attendance Status Badge Mapping ──────────────────────────────────────────
function AttendanceBadge({ status }: { status: string }) {
  const normalized = (status || '').toLowerCase();

  if (normalized === 'hadir') {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        Hadir
      </span>
    );
  }
  if (normalized === 'sakit') {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        Sakit
      </span>
    );
  }
  if (normalized === 'izin') {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        Izin
      </span>
    );
  }
  if (normalized === 'alfa') {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        Alfa
      </span>
    );
  }
  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-400 border border-slate-200">
      Belum Absen
    </span>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function GuruDashboardPage() {
  const user = getAuthUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['guru-dashboard', user?.guru_id],
    queryFn: () => getGuruDashboard(user?.guru_id || user?.id || 0),
    enabled: isMounted && !!(user?.guru_id || user?.id),
  });

  const {
    total_siswa_bimbingan = 0,
    jurnal_perlu_evaluasi = 0,
    jurnal_perlu_evaluasi_list = [],
    absensi_hari_ini = [],
    siswa_bimbingan = [],
  } = dashboardData || {};

  // Compute daily attendance statistics
  const presentCount = useMemo(() => {
    return (absensi_hari_ini || []).filter((a: any) => a.status === 'hadir').length;
  }, [absensi_hari_ini]);

  const attendanceRateText = useMemo(() => {
    const total = total_siswa_bimbingan || 0;
    if (total === 0) return '0% siswa hadir';
    const rate = Math.round((presentCount / total) * 100);
    return `${rate}% siswa hadir`;
  }, [presentCount, total_siswa_bimbingan]);

  // Lookup today's attendance status for each student
  const getSiswaAttendanceStatus = (siswaId: number) => {
    const todayAbs = (absensi_hari_ini || []).find((a: any) => a.siswa_id === siswaId);
    return todayAbs ? todayAbs.status : 'Belum Absen';
  };

  // Prevent SSR/client hydration mismatch — render skeleton until mounted
  if (!isMounted || isLoading) {
    return (
      <div className="space-y-8 font-sans animate-pulse">
        <div className="h-32 rounded-3xl bg-blue-200/60" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => <div key={i} className="h-24 rounded-2xl bg-gray-100" />)}
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
      {/* Welcome Hero Banner */}
      <div className="p-8 rounded-3xl bg-blue-600 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Selamat datang, {user?.nama || user?.name || 'Guru Pembimbing'}
          </h1>
          <p className="text-sm text-blue-100">
            Ada <strong className="text-white font-bold">{jurnal_perlu_evaluasi || 0} jurnal</strong> siswa bimbingan yang menunggu evaluasi Anda.
          </p>
        </div>
        <Link
          href="/guru/jurnal"
          className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shrink-0 relative z-10"
        >
          <FileText className="w-4 h-4" /> Lihat Jurnal
        </Link>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Siswa Bimbingan */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">SISWA BIMBINGAN</p>
            <h3 className="text-2xl font-extrabold text-gray-900 leading-tight mt-0.5">{total_siswa_bimbingan}</h3>
            <p className="text-xs text-gray-400">Siswa aktif magang</p>
          </div>
        </div>

        {/* Card 2: Jurnal Belum Dinilai */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">JURNAL BELUM DINILAI</p>
            <h3 className="text-2xl font-extrabold text-gray-900 leading-tight mt-0.5">{jurnal_perlu_evaluasi}</h3>
            <p className="text-xs text-gray-400">Perlu evaluasi segera</p>
          </div>
        </div>

        {/* Card 3: Kehadiran Hari Ini */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">KEHADIRAN HARI INI</p>
            <h3 className="text-2xl font-extrabold text-gray-900 leading-tight mt-0.5">
              {presentCount}/{total_siswa_bimbingan}
            </h3>
            <p className="text-xs text-gray-400">{attendanceRateText}</p>
          </div>
        </div>
      </div>

      {/* Main Widgets Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Widget: Jurnal Perlu Evaluasi */}
        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Jurnal Perlu Evaluasi</h2>
          </div>
          <div className="space-y-3">
            {jurnal_perlu_evaluasi_list?.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Semua jurnal sudah dievaluasi.</p>
            ) : (
              jurnal_perlu_evaluasi_list?.slice(0, 3).map((j: any) => (
                <div key={j.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-50 text-amber-500 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{j.siswa?.nama_lengkap}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {j.uraian_kegiatan} - <span className="font-medium text-gray-400">{formatShortDate(j.tanggal)}</span>
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/guru/jurnal"
                    className="px-3.5 py-1.5 rounded-xl border border-amber-200 hover:bg-amber-50 text-amber-600 text-xs font-semibold transition-colors shrink-0"
                  >
                    Review
                  </Link>
                </div>
              ))
            )}
          </div>
          {jurnal_perlu_evaluasi > 0 && (
            <div className="pt-2 text-center">
              <Link
                href="/guru/jurnal"
                className="inline-block px-4 py-2 border border-amber-200 rounded-lg text-xs font-semibold text-amber-600 hover:bg-amber-50 transition-colors"
              >
                Lihat semua tugas ({jurnal_perlu_evaluasi})
              </Link>
            </div>
          )}
        </div>

        {/* Right Widget: Daftar Siswa Bimbingan */}
        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Daftar Siswa Bimbingan</h2>
            <Link href="/guru/siswa" className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors">
              Lihat Semua
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {siswa_bimbingan?.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Belum ada siswa bimbingan.</p>
            ) : (
              siswa_bimbingan?.map((item: any) => {
                const status = getSiswaAttendanceStatus(item.siswa?.id || item.siswa_id);
                return (
                  <div key={item.id} className="py-3.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{item.siswa?.nama_lengkap}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.tempat_magang?.nama_perusahaan || item.tempatMagang?.nama_perusahaan || '-'}
                      </p>
                    </div>
                    <AttendanceBadge status={status} />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
