'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPenempatans, createPenempatan, updatePenempatan, batalkanPenempatan,
  getSiswas, getGurus, getDudis
} from '@/lib/db';
import {
  Plus, Search, ChevronDown, MoreHorizontal, Edit2, Trash2,
  AlertTriangle, Lock, Building2, Store, Users, Clock, ShieldCheck, CheckCircle2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ShieldX, CheckCircle, RotateCw, Link, Calendar, Briefcase, UserCheck, XCircle,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/lib/toast';

// ─── Avatar & Formatting Helpers ──────────────────────────────────────────────
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

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const formatPeriode = (startStr: string, endStr: string) => {
  if (!startStr || !endStr) return '—';
  return `${formatDate(startStr)} s.d. ${formatDate(endStr)}`;
};

// ─── 3-dot Action Menu ────────────────────────────────────────────────────────
function ActionMenu({ penempatan, onEdit, onCancel }: {
  penempatan: any; onEdit: () => void; onCancel: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-40 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 text-sm">
          <button onClick={() => { onEdit(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
            <Edit2 className="w-3.5 h-3.5 text-gray-400" /> Edit Penempatan
          </button>
          <div className="border-t border-gray-100 my-1" />
          <button onClick={() => { onCancel(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 transition-colors font-medium">
            <XCircle className="w-3.5 h-3.5" /> Batalkan Penempatan
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Cancel Penempatan Dialog ─────────────────────────────────────────────────
function CancelDialog({ isOpen, onClose, onConfirm, penempatan, isLoading }: {
  isOpen: boolean; onClose: () => void; onConfirm: () => void; penempatan: any; isLoading: boolean;
}) {
  if (!isOpen || !penempatan) return null;
  const siswaName = penempatan.siswa?.nama_lengkap || 'Siswa';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
        </div>

        <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">
          Batalkan Penempatan Magang?
        </h3>

        <p className="text-xs text-gray-500 leading-relaxed mb-6">
          Apakah Anda yakin ingin membatalkan penempatan magang untuk siswa <span className="font-bold text-gray-900">{siswaName}</span>? Status siswa akan dikembalikan menjadi &apos;Belum Magang&apos; dan kuota DUDI akan dikembalikan.
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-60 rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            {isLoading ? (
              <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Membatalkan...</>
            ) : (
              'Ya, Batalkan'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminPenempatanPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  const [filterDudi, setFilterDudi] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPenempatan, setEditingPenempatan] = useState<any>(null);
  const [cancelTarget, setCancelTarget] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [siswaId, setSiswaId] = useState('');
  const [dudiId, setDudiId] = useState('');
  const [guruId, setGuruId] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('2026-08-18');
  const [tanggalSelesai, setTanggalSelesai] = useState('2026-11-18');

  // ─── Fetch data dari Laravel API ─────────────────────────────────────────
  const { data: rawPenempatans = [], isLoading, error: fetchError } = useQuery({
    queryKey: ['admin-penempatan'],
    queryFn: () => getPenempatans(),
    staleTime: 30_000,
  });

  const { data: siswas = [] } = useQuery({ queryKey: ['admin-siswa-list'], queryFn: () => getSiswas() });
  const { data: gurus = [] } = useQuery({ queryKey: ['admin-guru-list'], queryFn: () => getGurus() });
  const { data: dudis = [] } = useQuery({ queryKey: ['admin-dudi-list'], queryFn: () => getDudis() });

  // ─── Client-side Filter & Pagination ─────────────────────────────────────
  const filtered = useMemo(() => {
    let list = rawPenempatans as any[];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.siswa?.nama_lengkap?.toLowerCase().includes(q) ||
        p.siswa?.nis?.includes(q) ||
        p.siswa?.kelas?.nama?.toLowerCase().includes(q) ||
        p.tempat_magang?.nama_perusahaan?.toLowerCase().includes(q) ||
        p.tempatMagang?.nama_perusahaan?.toLowerCase().includes(q) ||
        p.guru?.nama_lengkap?.toLowerCase().includes(q)
      );
    }
    if (filterKelas) list = list.filter(p => p.siswa?.kelas?.nama === filterKelas);
    if (filterDudi) {
      list = list.filter(p => {
        const dudiName = p.tempat_magang?.nama_perusahaan || p.tempatMagang?.nama_perusahaan || '';
        return dudiName === filterDudi;
      });
    }
    if (filterStatus) {
      if (filterStatus === 'berlangsung') {
        list = list.filter(p => p.status_pengesahan === 'disahkan' || !p.status_pengesahan);
      } else if (filterStatus === 'selesai') {
        list = list.filter(p => p.status_pengesahan === 'selesai');
      }
    }
    return list;
  }, [rawPenempatans, search, filterKelas, filterDudi, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Dropdown options
  const kelasList = useMemo(() => {
    const set = new Set((siswas as any[]).map(s => s.kelas?.nama).filter(Boolean));
    return [...set].sort();
  }, [siswas]);

  const dudiList = useMemo(() => {
    const set = new Set((dudis as any[]).map(d => d.nama_perusahaan).filter(Boolean));
    return [...set].sort();
  }, [dudis]);

  // Unassigned students for Tambah Penempatan
  const unassignedSiswas = useMemo(() => {
    return (siswas as any[]).filter(s => s.status_magang === 'belum_magang' || !s.status_magang);
  }, [siswas]);

  // ─── Stats ───────────────────────────────────────────────────────────────
  const all = rawPenempatans as any[];
  const totalPenempatan = all.length;
  const sedangBerlangsung = all.filter(p => p.status_pengesahan === 'disahkan' || !p.status_pengesahan).length;
  const selesaiMagang = all.filter(p => p.status_pengesahan === 'selesai').length;
  const dudiTerlibatCount = useMemo(() => {
    const dudiIds = new Set(all.map(p => p.tempat_magang_id).filter(Boolean));
    return dudiIds.size;
  }, [all]);

  // ─── Checkbox Selection ──────────────────────────────────────────────────
  const allPageSelected = paginated.length > 0 && paginated.every(p => selected.has(p.id));
  const toggleAll = () => {
    setSelected(prev => {
      const n = new Set(prev);
      allPageSelected ? paginated.forEach(p => n.delete(p.id)) : paginated.forEach(p => n.add(p.id));
      return n;
    });
  };

  // ─── Form Helpers ────────────────────────────────────────────────────────
  const resetForm = () => {
    setSiswaId(''); setDudiId(''); setGuruId('');
    setTanggalMulai('2026-08-18'); setTanggalSelesai('2026-11-18'); setErrorMsg('');
  };

  const openAdd = () => { setEditingPenempatan(null); resetForm(); setIsModalOpen(true); };
  const openEdit = (p: any) => {
    setEditingPenempatan(p);
    setSiswaId(String(p.siswa_id || ''));
    setDudiId(String(p.tempat_magang_id || ''));
    setGuruId(String(p.guru_id || ''));
    if (p.tanggal_mulai) setTanggalMulai(p.tanggal_mulai.split('T')[0]);
    if (p.tanggal_selesai) setTanggalSelesai(p.tanggal_selesai.split('T')[0]);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  // ─── Mutations ───────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        siswa_id: parseInt(siswaId),
        tempat_magang_id: parseInt(dudiId),
        guru_id: parseInt(guruId),
        tanggal_mulai: tanggalMulai,
        tanggal_selesai: tanggalSelesai,
      };
      if (editingPenempatan) return updatePenempatan(editingPenempatan.id, payload);
      return createPenempatan(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-penempatan'] });
      queryClient.invalidateQueries({ queryKey: ['admin-siswa'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dudi'] });
      setIsModalOpen(false);
      resetForm();
      toast.success(editingPenempatan ? 'Penempatan berhasil diperbarui.' : 'Penempatan baru berhasil disimpan.');
    },
    onError: (e: any) => { setErrorMsg(e.message || 'Gagal menyimpan penempatan.'); toast.error(e.message || 'Gagal menyimpan penempatan.'); },
  });

  const cancelMutation = useMutation({
    mutationFn: () => {
      return batalkanPenempatan(cancelTarget.id, cancelTarget.siswa_id, cancelTarget.tempat_magang_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-penempatan'] });
      queryClient.invalidateQueries({ queryKey: ['admin-siswa'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dudi'] });
      setCancelTarget(null);
      toast.success('Penempatan berhasil dibatalkan.');
    },
    onError: (e: any) => toast.error(e.message || 'Gagal membatalkan penempatan.'),
  });

  return (
    <div className="p-0 font-sans">

      {/* ── Stat cards (4 Cards) ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* Card 1: Total Penempatan */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total Penempatan</p>
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <Link className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <p className="text-5xl font-black text-gray-900 leading-none">{totalPenempatan}</p>
          <p className="text-xs text-gray-400 mt-2">siswa diproses</p>
        </div>

        {/* Card 2: Sedang Berlangsung */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Sedang Berlangsung</p>
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <p className="text-5xl font-black text-gray-900 leading-none">{sedangBerlangsung}</p>
          <p className="text-xs text-gray-400 mt-2">siswa magang aktif</p>
        </div>

        {/* Card 3: Selesai Magang */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Selesai Magang</p>
            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <p className="text-5xl font-black text-gray-900 leading-none">{selesaiMagang}</p>
          <p className="text-xs text-gray-400 mt-2">program selesai</p>
        </div>

        {/* Card 4: DUDI Terlibat */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">DUDI Terlibat</p>
            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
              <Store className="w-4 h-4 text-purple-500" />
            </div>
          </div>
          <p className="text-5xl font-black text-gray-900 leading-none">{dudiTerlibatCount}</p>
          <p className="text-xs text-gray-400 mt-2">mitra aktif</p>
        </div>
      </div>

      {/* ── Filter bar ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3 mb-4 flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari siswa, NIS, DUDI atau g..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filter Kelas */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">≡</span>
          <select
            value={filterKelas}
            onChange={e => { setFilterKelas(e.target.value); setPage(1); }}
            className="pl-7 pr-7 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer"
          >
            <option value="">Semua Kelas</option>
            {kelasList.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>

        {/* Filter DUDI */}
        <div className="relative">
          <select
            value={filterDudi}
            onChange={e => { setFilterDudi(e.target.value); setPage(1); }}
            className="pl-3 pr-7 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer"
          >
            <option value="">Semua DUDI</option>
            {dudiList.map(d => <option key={d} value={d}>{d}</option>)}
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
            <option value="berlangsung">Berlangsung</option>
            <option value="selesai">Selesai</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>

        <span className="text-sm font-semibold text-gray-500">{filtered.length} Penempatan</span>

        <button
          onClick={openAdd}
          className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-blue-200"
        >
          <Plus className="w-4 h-4" /> Tambah Penempatan
        </button>
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
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="px-4 py-3.5 w-10">
                  <input type="checkbox" checked={allPageSelected} onChange={toggleAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer accent-blue-600" />
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">SISWA</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">KELAS</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">TEMPAT MAGANG</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">GURU PEMBIMBING</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">PERIODE</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">STATUS</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">AKSI</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-4 py-4"><div className="w-4 h-4 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse shrink-0" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
                          <div className="h-2.5 w-20 bg-gray-100 rounded animate-pulse" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4"><div className="h-3 w-14 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-3 w-36 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-3 w-28 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-3 w-32 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-6 bg-gray-100 rounded animate-pulse ml-auto" /></td>
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <Link className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                    <p className="text-sm text-gray-400">
                      {(search || filterKelas || filterDudi || filterStatus) ? 'Tidak ada data yang cocok dengan filter.' : 'Belum ada data penempatan magang.'}
                    </p>
                    {(search || filterKelas || filterDudi || filterStatus) && (
                      <button onClick={() => { setSearch(''); setFilterKelas(''); setFilterDudi(''); setFilterStatus(''); }}
                        className="mt-2 text-xs text-blue-600 hover:underline">Reset filter</button>
                    )}
                  </td>
                </tr>
              ) : (
                paginated.map((p: any) => {
                  const siswaName = p.siswa?.nama_lengkap || '—';
                  const siswaNis = p.siswa?.nis || '—';
                  const siswaKelas = p.siswa?.kelas?.nama || '—';
                  const bg = getAvatarBg(siswaName);
                  const initials = getInitials(siswaName);
                  const dudiName = p.tempat_magang?.nama_perusahaan || p.tempatMagang?.nama_perusahaan || '—';
                  const guruName = p.guru?.nama_lengkap || '—';
                  const periodeStr = formatPeriode(p.tanggal_mulai, p.tanggal_selesai);
                  const isFinished = p.status_pengesahan === 'selesai';

                  return (
                    <tr key={p.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${selected.has(p.id) ? 'bg-blue-50/30' : ''}`}>
                      {/* Checkbox */}
                      <td className="px-4 py-3.5">
                        <input type="checkbox" checked={selected.has(p.id)}
                          onChange={() => setSelected(prev => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; })}
                          className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer" />
                      </td>

                      {/* Siswa + NIS */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{ backgroundColor: bg }}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm leading-none">{siswaName}</p>
                            <p className="font-mono text-xs text-gray-400 mt-0.5">{siswaNis}</p>
                          </div>
                        </div>
                      </td>

                      {/* Kelas */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-medium text-gray-700">{siswaKelas}</span>
                      </td>

                      {/* Tempat Magang */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Store className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-semibold text-gray-800 text-xs">{dudiName}</span>
                        </div>
                      </td>

                      {/* Guru Pembimbing */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-medium text-gray-700">{guruName}</span>
                      </td>

                      {/* Periode */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-gray-600 font-medium whitespace-nowrap">{periodeStr}</span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isFinished ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isFinished ? 'bg-green-500' : 'bg-blue-500'}`} />
                          {isFinished ? 'Selesai' : 'Berlangsung'}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="px-4 py-3.5">
                        <ActionMenu
                          penempatan={p}
                          onEdit={() => openEdit(p)}
                          onCancel={() => setCancelTarget(p)}
                        />
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

      {/* ── Modal Form Tambah / Edit Penempatan ────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => { setIsModalOpen(false); resetForm(); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header Icon */}
            <div className="flex items-start gap-3.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Link className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  {editingPenempatan ? 'Edit Penempatan Magang' : 'Tambah Penempatan Baru'}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-snug">
                  Tetapkan siswa ke mitra DUDI dan alokasikan guru pembimbing.
                </p>
              </div>
            </div>

            <form onSubmit={e => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
              {errorMsg && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-medium">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />{errorMsg}
                </div>
              )}

              {/* Siswa */}
              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  SISWA MAGANG <span className="text-red-500">*</span>
                </label>
                {editingPenempatan ? (
                  <input
                    type="text"
                    readOnly
                    value={`${editingPenempatan.siswa?.nama_lengkap || ''} (${editingPenempatan.siswa?.kelas?.nama || ''})`}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl text-gray-700 cursor-not-allowed"
                  />
                ) : (
                  <div className="relative">
                    <select
                      value={siswaId}
                      onChange={e => setSiswaId(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 text-xs font-medium border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer"
                    >
                      <option value="">— Pilih Siswa (Perlu Penempatan) —</option>
                      {unassignedSiswas.map((s: any) => (
                        <option key={s.id} value={s.id}>
                          {s.nama_lengkap} — NIS: {s.nis} ({s.kelas?.nama})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                )}
              </div>

              {/* DUDI */}
              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  PERUSAHAAN DUDI <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={dudiId}
                    onChange={e => setDudiId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer"
                  >
                    <option value="">— Pilih Mitra DUDI —</option>
                    {dudis.map((d: any) => {
                      const kuota = d.kuota ?? 0;
                      const terisi = d.penempatan_count ?? 0;
                      const sisa = Math.max(0, kuota - terisi);
                      return (
                        <option key={d.id} value={d.id} disabled={sisa <= 0 && String(d.id) !== dudiId}>
                          {d.nama_perusahaan} (Sisa Kuota: {sisa})
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Guru Pembimbing */}
              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  GURU PEMBIMBING <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={guruId}
                    onChange={e => setGuruId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer"
                  >
                    <option value="">— Pilih Guru Pembimbing —</option>
                    {gurus.map((g: any) => (
                      <option key={g.id} value={g.id}>
                        {g.nama_lengkap} ({typeof g.jurusan === 'object' ? g.jurusan?.nama : (g.jurusan || 'Guru')})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Tanggal Mulai & Tanggal Selesai */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    TANGGAL MULAI <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={tanggalMulai}
                    onChange={e => setTanggalMulai(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    TANGGAL SELESAI <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={tanggalSelesai}
                    onChange={e => setTanggalSelesai(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending || (!editingPenempatan && !siswaId)}
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm shadow-blue-200"
                >
                  {saveMutation.isPending ? (
                    <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</>
                  ) : editingPenempatan ? (
                    'Simpan Perubahan'
                  ) : (
                    'Simpan Penempatan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Cancel Dialog ────────────────────────────────────────────────────── */}
      <CancelDialog
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={() => cancelTarget && cancelMutation.mutate()}
        penempatan={cancelTarget}
        isLoading={cancelMutation.isPending}
      />
    </div>
  );
}
