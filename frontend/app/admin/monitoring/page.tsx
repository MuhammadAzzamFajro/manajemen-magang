'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMonitoring } from '@/lib/db';
import {
  Search, Eye, Users, Activity, BookOpen, AlertTriangle,
  Grid, SearchX, Building2, GraduationCap, CalendarCheck,
  FileText, Clock, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, ChevronDown, Filter,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

// ─── Avatar helpers ────────────────────────────────────────────────────────────
const getInitials = (name: string) => {
  const clean = name.replace(/[.,]/g, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (!words.length) return '?';
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const AVATAR_BG = [
  '#4F46E5', '#0891B2', '#059669', '#D97706',
  '#DC2626', '#7C3AED', '#DB2777', '#0284C7',
];
const getAvatarBg = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_BG[Math.abs(h) % AVATAR_BG.length];
};

export default function AdminMonitoringPage() {
  const [search, setSearch] = useState('');
  const [kelas, setKelas] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedSiswa, setSelectedSiswa] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data: rawList = [], isLoading, error: fetchError } = useQuery({
    queryKey: ['admin-monitoring'],
    queryFn: () => getMonitoring('', ''),
    staleTime: 30_000,
  });

  // ─── Client-side filter ───────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = rawList as any[];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.nama_lengkap?.toLowerCase().includes(q) ||
        s.nis?.includes(q) ||
        s.nama_dudi?.toLowerCase().includes(q) ||
        s.nama_guru?.toLowerCase().includes(q)
      );
    }
    if (kelas) list = list.filter(s => s.kelas === kelas);
    if (filterStatus) list = list.filter(s => s.status === filterStatus);
    return list;
  }, [rawList, search, kelas, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const kelasList = useMemo(() => {
    const set = new Set((rawList as any[]).map(s => s.kelas).filter(Boolean));
    return [...set].sort();
  }, [rawList]);

  // ─── Stats ───────────────────────────────────────────────────────────────
  const all = rawList as any[];
  const totalSiswaAktif = all.length;
  const totalJurnal = all.reduce((sum, s) => sum + (s.jumlah_jurnal ?? 0), 0);
  const perluPerhatian = all.filter(s => s.status === 'perlu_perhatian' || s.status === 'bermasalah').length;

  // Compute average attendance rate from all students
  const avgKehadiran = useMemo(() => {
    if (!all.length) return 0;
    const totals = all.reduce((acc, s) => {
      const h = s.rekap_presensi?.hadir ?? 0;
      const s2 = s.rekap_presensi?.sakit ?? 0;
      const i = s.rekap_presensi?.izin ?? 0;
      const a = s.rekap_presensi?.alfa ?? 0;
      const total = h + s2 + i + a;
      acc.hadir += h;
      acc.total += total;
      return acc;
    }, { hadir: 0, total: 0 });
    if (!totals.total) return 0;
    return Math.round((totals.hadir / totals.total) * 100);
  }, [all]);

  return (
    <div className="p-0 font-sans">

      {/* ── 4 Stat Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* Card 1: Total Siswa Aktif */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total Siswa Aktif</p>
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <p className="text-5xl font-black text-gray-900 leading-none">{totalSiswaAktif}</p>
          <p className="text-xs text-gray-400 mt-2">Siswa sedang magang</p>
        </div>

        {/* Card 2: Tingkat Kehadiran */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tingkat Kehadiran</p>
            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
              <Activity className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <p className="text-5xl font-black text-gray-900 leading-none">{avgKehadiran}%</p>
          <p className="text-xs text-gray-400 mt-2">Rata-rata kehadiran harian</p>
        </div>

        {/* Card 3: Jurnal Terkumpul */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Jurnal Terkumpul</p>
            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-purple-500" />
            </div>
          </div>
          <p className="text-5xl font-black text-gray-900 leading-none">{totalJurnal}</p>
          <p className="text-xs text-gray-400 mt-2">Total jurnal minggu ini</p>
        </div>

        {/* Card 4: Perlu Perhatian */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Perlu Perhatian</p>
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <p className="text-5xl font-black text-gray-900 leading-none">{perluPerhatian}</p>
          <p className="text-xs text-gray-400 mt-2">Siswa bermasalah/alfa</p>
        </div>
      </div>

      {/* ── Filter Bar ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3 mb-4 flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari siswa atau DUDI..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filter Kelas */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">≡</span>
          <select
            value={kelas}
            onChange={e => { setKelas(e.target.value); setPage(1); }}
            className="pl-7 pr-7 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer"
          >
            <option value="">Semua Kelas</option>
            {kelasList.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>

        {/* Filter Status */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            className="pl-3 pr-7 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="perlu_perhatian">Perlu Perhatian</option>
            <option value="bermasalah">Bermasalah</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>

        <span className="text-sm font-semibold text-gray-500 ml-1">{filtered.length} Data</span>
      </div>

      {/* ── Error ────────────────────────────────────────────────────────────── */}
      {fetchError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Gagal memuat data dari Backend: {(fetchError as Error).message}
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-5">SISWA & KELAS</th>
                <th className="py-3.5 px-5">DUDI & PEMBIMBING</th>
                <th className="py-3.5 px-5">KEHADIRAN (H/S/I/A)</th>
                <th className="py-3.5 px-5 text-center">JURNAL</th>
                <th className="py-3.5 px-5">STATUS</th>
                <th className="py-3.5 px-5 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse shrink-0" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
                          <div className="h-2.5 w-14 bg-gray-100 rounded animate-pulse" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5"><div className="h-3 w-32 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="py-4 px-5"><div className="h-3 w-20 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="py-4 px-5 text-center"><div className="h-6 w-8 bg-gray-100 rounded animate-pulse mx-auto" /></td>
                    <td className="py-4 px-5"><div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse" /></td>
                    <td className="py-4 px-5 text-right"><div className="h-6 w-14 bg-gray-100 rounded animate-pulse ml-auto" /></td>
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <SearchX className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                    <p className="font-semibold text-gray-700 text-sm">Tidak ada data siswa yang cocok</p>
                    <p className="text-gray-400 text-xs mt-1">Coba sesuaikan nama siswa, NIS, atau filter kelas.</p>
                    {(search || kelas || filterStatus) && (
                      <button
                        onClick={() => { setSearch(''); setKelas(''); setFilterStatus(''); }}
                        className="mt-2 text-xs text-blue-600 hover:underline"
                      >
                        Reset filter
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                paginated.map((s: any) => {
                  const hadir = s.rekap_presensi?.hadir ?? 0;
                  const sakit = s.rekap_presensi?.sakit ?? 0;
                  const izin = s.rekap_presensi?.izin ?? 0;
                  const alfa = s.rekap_presensi?.alfa ?? 0;
                  const bg = getAvatarBg(s.nama_lengkap || '');
                  const initials = getInitials(s.nama_lengkap || '');

                  return (
                    <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Siswa & Kelas */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{ backgroundColor: bg }}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-xs leading-none">{s.nama_lengkap}</p>
                            <p className="text-[11px] font-medium text-gray-400 mt-0.5">{s.kelas}</p>
                          </div>
                        </div>
                      </td>

                      {/* DUDI & Pembimbing */}
                      <td className="py-3.5 px-5">
                        <p className="font-semibold text-gray-800">{s.nama_dudi || '—'}</p>
                        <p className="text-[11px] text-gray-400">{s.nama_guru || '—'}</p>
                      </td>

                      {/* Kehadiran */}
                      <td className="py-3.5 px-5 font-mono font-bold text-xs">
                        <span className="text-emerald-600">{hadir}</span>
                        <span className="text-gray-300 mx-1.5">/</span>
                        <span className="text-amber-500">{sakit}</span>
                        <span className="text-gray-300 mx-1.5">/</span>
                        <span className="text-blue-500">{izin}</span>
                        <span className="text-gray-300 mx-1.5">/</span>
                        <span className={alfa > 0 ? 'text-rose-600' : 'text-gray-400'}>{alfa}</span>
                      </td>

                      {/* Jurnal */}
                      <td className="py-3.5 px-5 text-center">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs">
                          {s.jumlah_jurnal ?? 0}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5">
                        <div>
                          {s.status === 'bermasalah' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Bermasalah
                            </span>
                          ) : s.status === 'perlu_perhatian' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Perlu Perhatian
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Aktif
                            </span>
                          )}
                          {s.terakhir_aktif && (
                            <p className="text-[10px] text-gray-400 font-medium mt-1">🕒 {s.terakhir_aktif}</p>
                          )}
                        </div>
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => setSelectedSiswa(s)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Detail
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ───────────────────────────────────────────────────── */}
        {!isLoading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-3 text-xs text-gray-500">
            <span>
              Menampilkan {Math.min((currentPage - 1) * perPage + 1, filtered.length)}–{Math.min(currentPage * perPage, filtered.length)} dari {filtered.length} data
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                Baris per halaman:
                <div className="relative">
                  <select
                    value={perPage}
                    onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
                    className="pl-2 pr-6 py-1 border border-gray-200 rounded text-xs focus:outline-none appearance-none cursor-pointer"
                  >
                    {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button onClick={() => setPage(1)} disabled={currentPage === 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="px-2.5 py-1 font-semibold text-gray-700">{currentPage}/{totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setPage(totalPages)} disabled={currentPage === totalPages} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Detail Modal ─────────────────────────────────────────────────────── */}
      <Modal isOpen={!!selectedSiswa} onClose={() => setSelectedSiswa(null)} title="Detail Monitoring Siswa">
        {selectedSiswa && (
          <div className="space-y-5 font-sans text-xs">
            {/* Header Profile */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] uppercase tracking-wider">
                  {selectedSiswa.kelas}
                </span>
                <h3 className="text-xl font-black tracking-tight">{selectedSiswa.nama_lengkap}</h3>
                <p className="text-slate-400 font-mono text-[11px]">NIS: {selectedSiswa.nis || '—'}</p>
              </div>
              <div>
                {selectedSiswa.status === 'bermasalah' ? (
                  <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">● Bermasalah</span>
                ) : selectedSiswa.status === 'perlu_perhatian' ? (
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">● Perlu Perhatian</span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">● Aktif Magang</span>
                )}
              </div>
            </div>

            {/* DUDI & Guru */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" /> Tempat Magang (DUDI)
                </div>
                <p className="font-bold text-gray-900 text-sm">{selectedSiswa.nama_dudi || '—'}</p>
                <p className="text-gray-500 text-[11px]">Perusahaan Mitra Industri SMK</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                  <GraduationCap className="w-3.5 h-3.5 text-purple-600" /> Guru Pembimbing
                </div>
                <p className="font-bold text-gray-900 text-sm">{selectedSiswa.nama_guru || '—'}</p>
                <p className="text-gray-500 text-[11px]">Pembimbing Lapangan Sekolah</p>
              </div>
            </div>

            {/* Rekap Kehadiran */}
            <div className="space-y-2">
              <h4 className="font-bold text-gray-400 text-[10px] uppercase tracking-wider">Rekapitulasi Kehadiran</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'HADIR', value: selectedSiswa.rekap_presensi?.hadir ?? 0, color: 'emerald' },
                  { label: 'SAKIT', value: selectedSiswa.rekap_presensi?.sakit ?? 0, color: 'amber' },
                  { label: 'IZIN', value: selectedSiswa.rekap_presensi?.izin ?? 0, color: 'blue' },
                  { label: 'ALFA', value: selectedSiswa.rekap_presensi?.alfa ?? 0, color: 'rose' },
                ].map(({ label, value, color }) => (
                  <div key={label} className={`p-3.5 rounded-xl bg-${color}-50/70 border border-${color}-200/60 text-center`}>
                    <span className={`text-[10px] font-black uppercase tracking-widest text-${color}-600`}>{label}</span>
                    <p className={`text-2xl font-black text-${color}-700 mt-1`}>{value}</p>
                    <p className={`text-[10px] text-${color}-600 font-semibold`}>Hari</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Jurnal Terakhir */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-400 text-[10px] uppercase tracking-wider">Jurnal Harian Terakhir</h4>
                {selectedSiswa.jurnal_terakhir?.status_verifikasi === 'disetujui' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">✓ Disetujui Guru</span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px]">⏳ Menunggu Validasi</span>
                )}
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold border-b border-gray-200/50 pb-2">
                  <span>📅 Tanggal: {selectedSiswa.jurnal_terakhir?.tanggal || '—'}</span>
                  <span>Total Jurnal: {selectedSiswa.jumlah_jurnal ?? 0}</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  &ldquo;{selectedSiswa.jurnal_terakhir?.uraian || 'Belum ada jurnal kegiatan harian terbaru.'}&rdquo;
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSiswa(null)}
                className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
