'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDudis, createDudi, updateDudi, deleteDudi, toggleDudiVerifikasi } from '@/lib/db';
import {
  Plus, Search, ChevronDown, MoreHorizontal, Edit2, Trash2,
  AlertTriangle, Lock, Building2, Store, Users, Clock, ShieldCheck, CheckCircle2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ShieldX, CheckCircle, RotateCw, MapPin, Phone, User,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/lib/toast';

// ─── Avatar helpers ────────────────────────────────────────────────────────────
const getInitials = (name: string) => {
  const clean = name.replace(/[.,]/g, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (!words.length) return '?';
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const AVATAR_BG = [
  '#059669', '#0891B2', '#4F46E5', '#D97706',
  '#DC2626', '#7C3AED', '#DB2777', '#0284C7',
];
const getAvatarBg = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_BG[Math.abs(h) % AVATAR_BG.length];
};

// ─── 3-dot Action Menu ────────────────────────────────────────────────────────
function ActionMenu({ dudi, onEdit, onToggleStatus, onDelete }: {
  dudi: any; onEdit: () => void; onToggleStatus: () => void; onDelete: () => void;
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
            <Edit2 className="w-3.5 h-3.5 text-gray-400" /> Edit Data DUDI
          </button>
          <button onClick={() => { onToggleStatus(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
            <RotateCw className="w-3.5 h-3.5 text-blue-500" /> Ubah Status Verifikasi
          </button>
          <div className="border-t border-gray-100 my-1" />
          <button onClick={() => { onDelete(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Hapus Data DUDI
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Modal Dialog: Ubah Status Verifikasi DUDI ──────────────────────────────
function ChangeVerifikasiModal({
  isOpen,
  onClose,
  onSave,
  dudi,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newStatus: string) => void;
  dudi: any;
  isLoading: boolean;
}) {
  const [selectedStatus, setSelectedStatus] = useState<string>('terverifikasi');

  useEffect(() => {
    if (dudi) {
      setSelectedStatus(dudi.status_verifikasi || 'terverifikasi');
    }
  }, [dudi]);

  if (!isOpen || !dudi) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <RotateCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 leading-tight">Ubah Status Verifikasi</h3>
            <p className="text-xs text-gray-500 mt-1 leading-snug">
              Perbarui status verifikasi mitra untuk <span className="font-semibold text-gray-800">{dudi.nama_perusahaan}</span>.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm font-medium border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            >
              <option value="terverifikasi">Terverifikasi</option>
              <option value="belum_diverifikasi">Menunggu Validasi</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onSave(selectedStatus)}
            disabled={isLoading}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 rounded-lg transition-colors inline-flex items-center justify-center gap-1.5"
          >
            {isLoading ? 'Memproses...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Dialog ────────────────────────────────────────────────────────────
function DeleteDialog({ isOpen, onClose, onConfirm, dudi, isLoading }: {
  isOpen: boolean; onClose: () => void; onConfirm: () => void; dudi: any; isLoading: boolean;
}) {
  if (!isOpen || !dudi) return null;
  const siswaAktif = dudi.penempatan_count ?? dudi.siswa_aktif ?? 0;
  const blocked = siswaAktif > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
          {blocked ? <ShieldX className="w-5 h-5 text-rose-500" /> : <Trash2 className="w-5 h-5 text-rose-500" />}
        </div>

        <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">
          {blocked ? 'Hapus Tidak Dapat Dilakukan' : 'Hapus Data Mitra DUDI?'}
        </h3>

        {blocked ? (
          <div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Perusahaan <span className="font-bold text-gray-900">{dudi.nama_perusahaan}</span> saat ini masih memiliki{' '}
              <span className="font-bold text-rose-600">{siswaAktif} siswa aktif magang</span>.
            </p>
            <div className="mt-3 p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700 font-medium leading-relaxed">
              Pindahkan lokasi magang siswa terlebih dahulu sebelum menghapus data mitra industri ini.
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-500 leading-relaxed mb-6">
            Apakah Anda yakin ingin menghapus data mitra <span className="font-bold text-gray-900">{dudi.nama_perusahaan}</span>? Data penempatan dan profil perusahaan akan dihapus dari sistem.
          </p>
        )}

        <div className="flex items-center justify-end gap-2.5 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {blocked ? 'Tutup' : 'Batal'}
          </button>
          {!blocked && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-60 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              {isLoading ? (
                <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menghapus...</>
              ) : (
                'Ya, Hapus DUDI'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminDudiPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDudi, setEditingDudi] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [statusTarget, setStatusTarget] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [namaPerusahaan, setNamaPerusahaan] = useState('');
  const [bidangUsaha, setBidangUsaha] = useState('');
  const [namaPic, setNamaPic] = useState('');
  const [kontakPic, setKontakPic] = useState('');
  const [kuota, setKuota] = useState(10);
  const [alamat, setAlamat] = useState('');
  const [statusVerifikasi, setStatusVerifikasi] = useState('terverifikasi');

  // ─── Fetch data dari Laravel API ─────────────────────────────────────────
  const { data: rawDudis = [], isLoading, error: fetchError } = useQuery({
    queryKey: ['admin-dudi'],
    queryFn: () => getDudis(),
    staleTime: 30_000,
  });

  // ─── Client-side Filter & Pagination ─────────────────────────────────────
  const filtered = useMemo(() => {
    let list = rawDudis as any[];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        d.nama_perusahaan?.toLowerCase().includes(q) ||
        d.bidang_usaha?.toLowerCase().includes(q) ||
        d.nama_pic?.toLowerCase().includes(q) ||
        d.alamat?.toLowerCase().includes(q)
      );
    }
    if (filterStatus) {
      if (filterStatus === 'terverifikasi') list = list.filter(d => d.status_verifikasi === 'terverifikasi');
      else if (filterStatus === 'belum_diverifikasi') list = list.filter(d => d.status_verifikasi !== 'terverifikasi');
    }
    return list;
  }, [rawDudis, search, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // ─── Stats ───────────────────────────────────────────────────────────────
  const all = rawDudis as any[];
  const totalDudi = all.length;
  const terverifikasi = all.filter(d => d.status_verifikasi === 'terverifikasi').length;
  const menungguValidasi = all.filter(d => d.status_verifikasi !== 'terverifikasi').length;
  const siswaDitempatkan = all.reduce((sum, d) => sum + (d.penempatan_count ?? d.siswa_aktif ?? 0), 0);

  // ─── Checkbox Selection ──────────────────────────────────────────────────
  const allPageSelected = paginated.length > 0 && paginated.every(d => selected.has(d.id));
  const toggleAll = () => {
    setSelected(prev => {
      const n = new Set(prev);
      allPageSelected ? paginated.forEach(d => n.delete(d.id)) : paginated.forEach(d => n.add(d.id));
      return n;
    });
  };

  // ─── Form Helpers ────────────────────────────────────────────────────────
  const resetForm = () => {
    setNamaPerusahaan(''); setBidangUsaha(''); setNamaPic(''); setKontakPic('');
    setKuota(10); setAlamat(''); setStatusVerifikasi('terverifikasi'); setErrorMsg('');
  };

  const openAdd = () => { setEditingDudi(null); resetForm(); setIsModalOpen(true); };
  const openEdit = (d: any) => {
    setEditingDudi(d);
    setNamaPerusahaan(d.nama_perusahaan || '');
    setBidangUsaha(d.bidang_usaha || '');
    setNamaPic(d.nama_pic || '');
    setKontakPic(d.kontak_pic || '');
    setKuota(d.kuota ?? 10);
    setAlamat(d.alamat || '');
    setStatusVerifikasi(d.status_verifikasi || 'terverifikasi');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  // ─── Mutations ───────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        nama_perusahaan: namaPerusahaan,
        bidang_usaha: bidangUsaha,
        nama_pic: namaPic,
        kontak_pic: kontakPic,
        kuota: Number(kuota),
        sisa_kuota: Number(kuota),
        alamat,
        status_verifikasi: statusVerifikasi,
      };
      if (editingDudi) return updateDudi(editingDudi.id, payload);
      return createDudi(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dudi'] });
      setIsModalOpen(false);
      resetForm();
      toast.success(editingDudi ? 'Data DUDI berhasil diperbarui.' : 'Mitra DUDI baru berhasil ditambahkan.');
    },
    onError: (e: any) => { setErrorMsg(e.message || 'Gagal menyimpan data DUDI.'); toast.error(e.message || 'Gagal menyimpan data DUDI.'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteDudi(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-dudi'] }); setDeleteTarget(null); toast.success('Data DUDI berhasil dihapus.'); },
    onError: (e: any) => toast.error(e.message || 'Gagal menghapus DUDI.'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => toggleDudiVerifikasi(id, status),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-dudi'] }); setStatusTarget(null); toast.success('Status verifikasi DUDI berhasil diubah.'); },
    onError: (e: any) => toast.error(e.message || 'Gagal mengubah status verifikasi DUDI.'),
  });

  const handleSaveStatus = (newStatus: string) => {
    if (!statusTarget) return;
    toggleMutation.mutate({ id: statusTarget.id, status: newStatus });
  };

  return (
    <div className="p-0 font-sans">

      {/* ── Stat cards (4 Cards) ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* Card 1: Total Mitra DUDI */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total Mitra DUDI</p>
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <Store className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <p className="text-5xl font-black text-gray-900 leading-none">{totalDudi}</p>
          <p className="text-xs text-gray-400 mt-2">perusahaan terdaftar</p>
        </div>

        {/* Card 2: Terverifikasi */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Terverifikasi</p>
            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <p className="text-5xl font-black text-gray-900 leading-none">{terverifikasi}</p>
          <p className="text-xs text-gray-400 mt-2">siap menerima siswa</p>
        </div>

        {/* Card 3: Menunggu Validasi */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Menunggu Validasi</p>
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <p className="text-5xl font-black text-gray-900 leading-none">{menungguValidasi}</p>
          <p className="text-xs text-gray-400 mt-2">perlu ditinjau</p>
        </div>

        {/* Card 4: Siswa Ditempatkan */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Siswa Ditempatkan</p>
            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-500" />
            </div>
          </div>
          <p className="text-5xl font-black text-gray-900 leading-none">{siswaDitempatkan}</p>
          <p className="text-xs text-gray-400 mt-2">magang aktif</p>
        </div>
      </div>

      {/* ── Filter bar ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3 mb-4 flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari perusahaan, alamat, at..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filter Status */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">≡</span>
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            className="pl-7 pr-7 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="terverifikasi">Terverifikasi</option>
            <option value="belum_diverifikasi">Menunggu Validasi</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>

        <span className="text-sm font-semibold text-gray-500">{filtered.length} DUDI</span>

        <button
          onClick={openAdd}
          className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-blue-200"
        >
          <Plus className="w-4 h-4" /> Tambah DUDI
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
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">PERUSAHAAN</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">PIC & KONTAK</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">BIDANG USAHA</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">KUOTA</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">SISWA AKTIF</span>
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
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-4 py-4"><div className="w-4 h-4 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse shrink-0" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                          <div className="h-2.5 w-24 bg-gray-100 rounded animate-pulse" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4"><div className="h-3 w-28 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-3 w-20 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-3 w-8 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-12 bg-gray-100 rounded-full animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-6 bg-gray-100 rounded animate-pulse ml-auto" /></td>
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <Store className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                    <p className="text-sm text-gray-400">
                      {(search || filterStatus) ? 'Tidak ada data yang cocok dengan filter.' : 'Belum ada data mitra DUDI.'}
                    </p>
                    {(search || filterStatus) && (
                      <button onClick={() => { setSearch(''); setFilterStatus(''); }}
                        className="mt-2 text-xs text-blue-600 hover:underline">Reset filter</button>
                    )}
                  </td>
                </tr>
              ) : (
                paginated.map((d: any) => {
                  const bg = getAvatarBg(d.nama_perusahaan || '');
                  const initials = getInitials(d.nama_perusahaan || '');
                  const siswaAktif = d.penempatan_count ?? d.siswa_aktif ?? 0;
                  const isVerified = d.status_verifikasi === 'terverifikasi';

                  return (
                    <tr key={d.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${selected.has(d.id) ? 'bg-blue-50/30' : ''}`}>
                      {/* Checkbox */}
                      <td className="px-4 py-3.5">
                        <input type="checkbox" checked={selected.has(d.id)}
                          onChange={() => setSelected(prev => { const n = new Set(prev); n.has(d.id) ? n.delete(d.id) : n.add(d.id); return n; })}
                          className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer" />
                      </td>

                      {/* Perusahaan + Alamat */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{ backgroundColor: bg }}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm leading-none">{d.nama_perusahaan}</p>
                            {d.alamat && <p className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{d.alamat}</p>}
                          </div>
                        </div>
                      </td>

                      {/* PIC & Kontak */}
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="font-semibold text-gray-800 text-xs leading-none">{d.nama_pic || '—'}</p>
                          {d.kontak_pic && <p className="text-xs text-gray-400 mt-0.5">{d.kontak_pic}</p>}
                        </div>
                      </td>

                      {/* Bidang Usaha */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-medium text-gray-700">{d.bidang_usaha || '—'}</span>
                      </td>

                      {/* Kuota */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-semibold text-gray-800">{d.kuota ?? 0}</span>
                      </td>

                      {/* Siswa Aktif */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          <Users className="w-3 h-3 text-blue-500" /> {siswaAktif}
                        </span>
                      </td>

                      {/* Status Verifikasi */}
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => setStatusTarget(d)}
                          title="Klik untuk ubah status verifikasi"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity ${
                            isVerified ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isVerified ? 'bg-green-500' : 'bg-amber-500'}`} />
                          {isVerified ? 'Terverifikasi' : 'Menunggu Validasi'}
                        </button>
                      </td>

                      {/* Aksi */}
                      <td className="px-4 py-3.5">
                        <ActionMenu
                          dudi={d}
                          onEdit={() => openEdit(d)}
                          onToggleStatus={() => setStatusTarget(d)}
                          onDelete={() => setDeleteTarget(d)}
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

      {/* ── Modal Form Tambah / Edit DUDI ──────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => { setIsModalOpen(false); resetForm(); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header Icon */}
            <div className="flex items-start gap-3.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                {editingDudi ? <Edit2 className="w-5 h-5" /> : <Store className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  {editingDudi ? 'Edit Data DUDI' : 'Tambah Mitra DUDI Baru'}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-snug">
                  Isi data lengkap perusahaan mitra industri tempat magang siswa.
                </p>
              </div>
            </div>

            <form onSubmit={e => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
              {errorMsg && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-medium">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />{errorMsg}
                </div>
              )}

              {/* Grid 1: Nama Perusahaan & Bidang Usaha */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    NAMA PERUSAHAAN <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={namaPerusahaan}
                    onChange={e => setNamaPerusahaan(e.target.value)}
                    required
                    placeholder="Contoh: PT. Suka"
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    BIDANG USAHA <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={bidangUsaha}
                    onChange={e => setBidangUsaha(e.target.value)}
                    required
                    placeholder="Contoh: F&B / Software"
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              {/* Grid 2: Nama PIC & Kontak PIC */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    NAMA PIC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={namaPic}
                    onChange={e => setNamaPic(e.target.value)}
                    required
                    placeholder="Budi Hermawan"
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    KONTAK PIC (TELP/WA) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={kontakPic}
                    onChange={e => setKontakPic(e.target.value)}
                    required
                    placeholder="083845038238"
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              {/* Grid 3: Kuota Penerimaan & Status Verifikasi */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    KUOTA SISWA <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={kuota}
                    onChange={e => setKuota(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    STATUS VERIFIKASI
                  </label>
                  <div className="relative">
                    <select
                      value={statusVerifikasi}
                      onChange={e => setStatusVerifikasi(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-medium border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer"
                    >
                      <option value="terverifikasi">Terverifikasi</option>
                      <option value="belum_diverifikasi">Menunggu Validasi</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Field: Alamat Perusahaan */}
              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  ALAMAT LENGKAP PERUSAHAAN
                </label>
                <textarea
                  rows={2}
                  value={alamat}
                  onChange={e => setAlamat(e.target.value)}
                  placeholder="Jl. Probolinggo No. 12..."
                  className="w-full px-3.5 py-2.5 text-xs font-medium border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white"
                />
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
                  disabled={saveMutation.isPending}
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm shadow-blue-200"
                >
                  {saveMutation.isPending ? (
                    <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</>
                  ) : editingDudi ? (
                    'Simpan Perubahan'
                  ) : (
                    'Simpan DUDI'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Dialog: Ubah Status Verifikasi DUDI ─────────────────────── */}
      <ChangeVerifikasiModal
        isOpen={!!statusTarget}
        onClose={() => setStatusTarget(null)}
        onSave={handleSaveStatus}
        dudi={statusTarget}
        isLoading={toggleMutation.isPending}
      />

      {/* ── Delete dialog ────────────────────────────────────────────────────── */}
      <DeleteDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        dudi={deleteTarget}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
