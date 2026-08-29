'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getGurus, createGuru, updateGuru, deleteGuru, toggleGuruStatus,
} from '@/lib/db';
import {
  Plus, Search, ChevronDown, MoreHorizontal, Edit2, Trash2,
  AlertTriangle, UserCheck, Users, ShieldCheck, BookOpen,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ShieldX, RotateCw, Key, Copy, Check, Ban,
} from 'lucide-react';

// ─── JURUSAN OPTIONS ────────────────────────────────────────────────────────────
const JURUSAN_OPTIONS = [
  'Rekayasa Perangkat Lunak',
  'Teknik Komputer & Jaringan',
  'Desain Komunikasi Visual',
  'Teknik Kelistrikan',
  'Teknik Otomotif',
  'Teknik Elektro',
  'Mekatronika',
  'Broadcasting dan Perfilman',
  'Busana',
];

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

// ─── 3-dot Action Menu ────────────────────────────────────────────────────────
function ActionMenu({ guru, onEdit, onToggleStatus, onDelete }: {
  guru: any; onEdit: () => void; onToggleStatus: () => void; onDelete: () => void;
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
        <div className="absolute right-0 top-8 z-40 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 text-sm">
          <button onClick={() => { onEdit(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
            <Edit2 className="w-3.5 h-3.5 text-gray-400" /> Edit Data Guru
          </button>
          <button onClick={() => { onToggleStatus(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
            <RotateCw className="w-3.5 h-3.5 text-blue-500" /> Ubah Status Akun
          </button>
          <div className="border-t border-gray-100 my-1" />
          <button onClick={() => { onDelete(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Hapus Data
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Modal Dialog: Kredensial Akun Guru Baru ──────────────────────────────
function NewGuruCredentialModal({
  isOpen,
  onClose,
  credentials,
}: {
  isOpen: boolean;
  onClose: () => void;
  credentials: { email: string; password: string } | null;
}) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  if (!isOpen || !credentials) return null;

  const copyToClipboard = (text: string, type: 'email' | 'pass') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 overflow-hidden animate-in zoom-in-95 duration-150 text-center">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <Key className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">
          Akun Guru Berhasil Dibuat
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto mb-5">
          Berikan kredensial ini kepada guru untuk login portal magang.
        </p>

        <div className="text-left mb-4">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            EMAIL AKUN
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              readOnly
              value={credentials.email}
              className="w-full pl-3.5 pr-10 py-2.5 text-xs font-mono font-semibold bg-gray-50 border border-gray-200 rounded-xl text-gray-800 outline-none select-all"
            />
            <button
              type="button"
              onClick={() => copyToClipboard(credentials.email, 'email')}
              title="Salin email"
              className="absolute right-2.5 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 transition-colors"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="text-left mb-6">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            PASSWORD SEMENTARA
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              readOnly
              value={credentials.password}
              className="w-full pl-3.5 pr-10 py-2.5 text-xs font-mono font-semibold bg-gray-50 border border-gray-200 rounded-xl text-gray-800 outline-none select-all"
            />
            <button
              type="button"
              onClick={() => copyToClipboard(credentials.password, 'pass')}
              title="Salin password"
              className="absolute right-2.5 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 transition-colors"
            >
              {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}

// ─── Modal Dialog: Ubah Status Akun Guru ─────────────────────────────────────
function ChangeGuruStatusModal({
  isOpen,
  onClose,
  onSave,
  guru,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newStatus: string) => void;
  guru: any;
  isLoading: boolean;
}) {
  const [selectedStatus, setSelectedStatus] = useState<string>('aktif');

  useEffect(() => {
    if (guru) {
      setSelectedStatus(guru.status_akun === 'nonaktif' ? 'nonaktif' : 'aktif');
    }
  }, [guru]);

  if (!isOpen || !guru) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <RotateCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 leading-tight">Ubah Status Akun Guru</h3>
            <p className="text-xs text-gray-500 mt-1 leading-snug">
              Perbarui status akun untuk <span className="font-semibold text-gray-800">{guru.nama_lengkap}</span>.
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
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
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
function DeleteDialog({ isOpen, onClose, onConfirm, guru, isLoading }: {
  isOpen: boolean; onClose: () => void; onConfirm: () => void; guru: any; isLoading: boolean;
}) {
  if (!isOpen || !guru) return null;
  const siswaAktif = guru.penempatan_count ?? guru.jumlah_siswa_aktif ?? 0;
  const blocked = siswaAktif > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
          {blocked ? <ShieldX className="w-5 h-5 text-rose-500" /> : <Trash2 className="w-5 h-5 text-rose-500" />}
        </div>

        <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">
          {blocked ? 'Hapus Tidak Dapat Dilakukan' : 'Hapus Data Guru?'}
        </h3>

        {blocked ? (
          <div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Guru <span className="font-bold text-gray-900">{guru.nama_lengkap}</span> saat ini masih membimbing{' '}
              <span className="font-bold text-rose-600">{siswaAktif} siswa aktif magang</span>.
            </p>
            <div className="mt-3 p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700 font-medium leading-relaxed">
              Pindahkan bimbingan siswa terlebih dahulu sebelum menghapus data guru ini.
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-500 leading-relaxed mb-6">
            Apakah Anda yakin ingin menghapus data guru <span className="font-bold text-gray-900">{guru.nama_lengkap} (NIP: {guru.nip})</span>? Akun login beserta profilnya akan dihapus dari sistem.
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
                'Ya, Hapus Guru'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminGuruPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [filterJurusan, setFilterJurusan] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuru, setEditingGuru] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [statusTarget, setStatusTarget] = useState<any>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [nip, setNip] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [jurusan, setJurusan] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ─── Fetch data dari Laravel API ─────────────────────────────────────────
  const { data: rawGurus = [], isLoading, error: fetchError } = useQuery({
    queryKey: ['admin-guru'],
    queryFn: () => getGurus(),
    staleTime: 30_000,
  });

  // ─── Client-side Filter & Pagination ─────────────────────────────────────
  const filtered = useMemo(() => {
    let list = rawGurus as any[];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(g =>
        g.nama_lengkap?.toLowerCase().includes(q) ||
        g.nip?.includes(q) ||
        g.jurusan?.toLowerCase().includes(q) ||
        g.user?.email?.toLowerCase().includes(q)
      );
    }
    if (filterJurusan) list = list.filter(g => g.jurusan === filterJurusan);
    if (filterStatus) list = list.filter(g => g.status_akun === filterStatus);
    return list;
  }, [rawGurus, search, filterJurusan, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // ─── Stats ───────────────────────────────────────────────────────────────
  const all = rawGurus as any[];
  const totalGuru = all.length;
  const akunAktif = all.filter(g => g.status_akun === 'aktif').length;
  const akunNonaktif = all.filter(g => g.status_akun === 'nonaktif').length;
  const siswaBimbingan = all.reduce((sum, g) => sum + (g.penempatan_count ?? 0), 0);

  // ─── Jurusan (untuk filter & rekap) ──────────────────────────────────────
  const jurusanList = useMemo(() => {
    const set = new Set<string>([...JURUSAN_OPTIONS]);
    all.forEach(g => { if (g.jurusan) set.add(g.jurusan); });
    return [...set].sort();
  }, [all]);

  const rekapJurusan = useMemo(() => {
    const map = new Map<string, { jumlah: number; aktif: number }>();
    all.forEach(g => {
      const j = g.jurusan || 'Tanpa Jurusan';
      const cur = map.get(j) || { jumlah: 0, aktif: 0 };
      cur.jumlah += 1;
      if (g.status_akun === 'aktif') cur.aktif += 1;
      map.set(j, cur);
    });
    return [...map.entries()]
      .map(([jurusan, v]) => ({ jurusan, ...v }))
      .sort((a, b) => b.jumlah - a.jumlah);
  }, [all]);

  // ─── Checkbox Selection ──────────────────────────────────────────────────
  const allPageSelected = paginated.length > 0 && paginated.every(g => selected.has(g.id));
  const toggleAll = () => {
    setSelected(prev => {
      const n = new Set(prev);
      allPageSelected ? paginated.forEach(g => n.delete(g.id)) : paginated.forEach(g => n.add(g.id));
      return n;
    });
  };

  // ─── Form Helpers ────────────────────────────────────────────────────────
  const resetForm = () => {
    setNip(''); setNamaLengkap(''); setJurusan(''); setEmail(''); setPassword(''); setErrorMsg('');
  };

  const openAdd = () => { setEditingGuru(null); resetForm(); setIsModalOpen(true); };
  const openEdit = (g: any) => {
    setEditingGuru(g);
    setNip(g.nip || '');
    setNamaLengkap(g.nama_lengkap || '');
    setJurusan(g.jurusan || '');
    setEmail(g.user?.email || g.email || '');
    setPassword('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  // ─── Mutations ───────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        nip,
        nama_lengkap: namaLengkap,
        jurusan,
        status_akun: editingGuru ? editingGuru.status_akun : 'aktif',
      };
      if (editingGuru) return updateGuru(editingGuru.id, payload);

      const usedPassword = password || `Guru#${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      await createGuru({ ...payload, email, password: usedPassword });
      return { _usedEmail: email, _usedPassword: usedPassword };
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['admin-guru'] });
      setIsModalOpen(false);
      if (!editingGuru && data?._usedEmail) {
        setCreatedCredentials({ email: data._usedEmail, password: data._usedPassword });
      }
      resetForm();
    },
    onError: (e: any) => setErrorMsg(e.message || 'Gagal menyimpan data guru.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteGuru(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-guru'] }); setDeleteTarget(null); },
    onError: (e: any) => setErrorMsg(e.message || 'Gagal menghapus guru.'),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => toggleGuruStatus(id, status),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-guru'] }); setStatusTarget(null); },
    onError: (e: any) => setErrorMsg(e.message || 'Gagal mengubah status akun guru.'),
  });

  const handleSaveStatus = (newStatus: string) => {
    if (!statusTarget) return;
    if (newStatus === statusTarget.status_akun) { setStatusTarget(null); return; }
    statusMutation.mutate({ id: statusTarget.id, status: newStatus });
  };

  return (
    <div className="p-0 font-sans">

      {/* ── Stat cards (4 Cards) ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* Card 1: Total Guru */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total Guru</p>
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <p className="text-5xl font-black text-gray-900 leading-none">{totalGuru}</p>
          <p className="text-xs text-gray-400 mt-2">guru terdaftar</p>
        </div>

        {/* Card 2: Akun Aktif */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Akun Aktif</p>
            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <p className="text-5xl font-black text-gray-900 leading-none">{akunAktif}</p>
          <p className="text-xs text-gray-400 mt-2">dapat mengakses sistem</p>
        </div>

        {/* Card 3: Akun Nonaktif */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Akun Nonaktif</p>
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
              <Ban className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <p className="text-5xl font-black text-gray-900 leading-none">{akunNonaktif}</p>
          <p className="text-xs text-gray-400 mt-2">tidak aktif login</p>
        </div>

        {/* Card 4: Siswa Bimbingan */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Siswa Bimbingan</p>
            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-500" />
            </div>
          </div>
          <p className="text-5xl font-black text-gray-900 leading-none">{siswaBimbingan}</p>
          <p className="text-xs text-gray-400 mt-2">sedang ditempatkan</p>
        </div>
      </div>

      {/* ── Filter bar ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3 mb-4 flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, NIP, atau jurusan..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filter Jurusan */}
        <div className="relative">
          <select
            value={filterJurusan}
            onChange={e => { setFilterJurusan(e.target.value); setPage(1); }}
            className="pl-3 pr-7 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer"
          >
            <option value="">Semua Jurusan</option>
            {jurusanList.map(j => <option key={j} value={j}>{j}</option>)}
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
            <option value="nonaktif">Nonaktif</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>

        <span className="text-sm font-semibold text-gray-500">{filtered.length} Guru</span>

        <button
          onClick={openAdd}
          className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-blue-200"
        >
          <Plus className="w-4 h-4" /> Tambah Guru
        </button>
      </div>

      {/* ── Error ────────────────────────────────────────────────────────────── */}
      {fetchError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Gagal memuat data dari Backend: {(fetchError as Error).message}
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />{errorMsg}
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
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">NIP</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Nama Guru</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Jurusan</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Siswa Bimbingan</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status Akun</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-4 py-4"><div className="w-4 h-4 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-3 w-24 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse shrink-0" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
                          <div className="h-2.5 w-36 bg-gray-100 rounded animate-pulse" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4"><div className="h-3 w-20 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-6 bg-gray-100 rounded animate-pulse ml-auto" /></td>
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <UserCheck className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                    <p className="text-sm text-gray-400">
                      {(search || filterJurusan || filterStatus) ? 'Tidak ada data yang cocok dengan filter.' : 'Belum ada data guru.'}
                    </p>
                    {(search || filterJurusan || filterStatus) && (
                      <button onClick={() => { setSearch(''); setFilterJurusan(''); setFilterStatus(''); }}
                        className="mt-2 text-xs text-blue-600 hover:underline">Reset filter</button>
                    )}
                  </td>
                </tr>
              ) : (
                paginated.map((g: any) => {
                  const bg = getAvatarBg(g.nama_lengkap || '');
                  const initials = getInitials(g.nama_lengkap || '');
                  const isActive = g.status_akun === 'aktif';
                  const siswaAktif = g.penempatan_count ?? 0;
                  const emailStr = g.user?.email || g.email || '';

                  return (
                    <tr key={g.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${selected.has(g.id) ? 'bg-blue-50/30' : ''}`}>
                      {/* Checkbox */}
                      <td className="px-4 py-3.5">
                        <input type="checkbox" checked={selected.has(g.id)}
                          onChange={() => setSelected(prev => { const n = new Set(prev); n.has(g.id) ? n.delete(g.id) : n.add(g.id); return n; })}
                          className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer" />
                      </td>

                      {/* NIP */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs text-gray-500">{g.nip}</span>
                      </td>

                      {/* Nama + Email */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{ backgroundColor: bg }}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm leading-none">{g.nama_lengkap}</p>
                            {emailStr && <p className="text-xs text-gray-400 mt-0.5">{emailStr}</p>}
                          </div>
                        </div>
                      </td>

                      {/* Jurusan */}
                      <td className="px-4 py-3.5">
                        {g.jurusan ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                            <BookOpen className="w-3 h-3 text-indigo-500" /> {g.jurusan}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      {/* Siswa Bimbingan */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          siswaAktif > 0 ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-gray-50 text-gray-500 border border-gray-100'
                        }`}>
                          <Users className="w-3 h-3" /> {siswaAktif}
                        </span>
                      </td>

                      {/* Status Akun */}
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => setStatusTarget(g)}
                          title="Klik untuk ubah status akun"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity ${
                            isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-slate-400'}`} />
                          {isActive ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>

                      {/* Aksi */}
                      <td className="px-4 py-3.5">
                        <ActionMenu
                          guru={g}
                          onEdit={() => openEdit(g)}
                          onToggleStatus={() => setStatusTarget(g)}
                          onDelete={() => setDeleteTarget(g)}
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

      {/* ── Rekap Jurusan ──────────────────────────────────────────────────── */}
      {!isLoading && rekapJurusan.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mt-5">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight">Rekap Jurusan</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Sebaran guru pembimbing per jurusan
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              {rekapJurusan.length} Jurusan
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-3 text-left">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Jurusan</span>
                  </th>
                  <th className="px-5 py-3 text-left">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Jumlah Guru</span>
                  </th>
                  <th className="px-5 py-3 text-left">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Akun Aktif</span>
                  </th>
                  <th className="px-5 py-3 w-1/3">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Sebaran</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rekapJurusan.map(r => {
                  const pct = totalGuru > 0 ? Math.round((r.jumlah / totalGuru) * 100) : 0;
                  return (
                    <tr key={r.jurusan} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          <BookOpen className="w-3 h-3 text-indigo-500" /> {r.jurusan}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm font-bold text-gray-900">{r.jumlah}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> {r.aktif}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[11px] font-semibold text-gray-400 w-9 text-right">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modal Form Tambah / Edit Guru ─────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => { setIsModalOpen(false); resetForm(); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                {editingGuru ? <Edit2 className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  {editingGuru ? 'Edit Data Guru' : 'Tambah Guru Baru'}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-snug">
                  {editingGuru
                    ? 'Ubah informasi identitas dan jurusan guru pembimbing.'
                    : 'Akun login guru akan dibuat otomatis dengan password default.'}
                </p>
              </div>
            </div>

            <form onSubmit={e => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
              {errorMsg && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-medium">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />{errorMsg}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  NAMA LENGKAP
                </label>
                <input
                  type="text"
                  value={namaLengkap}
                  onChange={e => setNamaLengkap(e.target.value)}
                  required
                  placeholder="Contoh: M. Fajar Siddik, M.Pd."
                  className="w-full px-3.5 py-2.5 text-sm font-medium border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  NIP (NOMOR INDUK PEGAWAI) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={nip}
                  onChange={e => setNip(e.target.value.replace(/\D/g, '').slice(0, 18))}
                  required
                  placeholder="18 digit angka, contoh: 198203152010011001"
                  className="w-full px-3.5 py-2.5 text-sm font-mono font-medium border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors bg-white"
                />
                {nip.length > 0 && nip.length < 18 && (
                  <p className="mt-1 text-[11px] text-amber-600 font-medium">
                    NIP harus berisi tepat 18 digit ({nip.length}/18)
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  JURUSAN / BIDANG
                </label>
                <div className="relative">
                  <select
                    value={jurusan}
                    onChange={e => setJurusan(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-medium border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer"
                  >
                    <option value="">— Pilih Jurusan —</option>
                    {JURUSAN_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
                    {editingGuru && jurusan && !JURUSAN_OPTIONS.includes(jurusan) && (
                      <option value={jurusan}>{jurusan} (lama)</option>
                    )}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  EMAIL AKUN LOGIN
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={!!editingGuru}
                  placeholder="Contoh: fajar@smk.sch.id"
                  className="w-full px-3.5 py-2.5 text-sm font-medium border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors bg-white disabled:bg-slate-50 disabled:text-gray-400"
                />
              </div>

              {!editingGuru && (
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    PASSWORD SEMENTARA
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Kosongkan untuk password otomatis"
                    className="w-full px-3.5 py-2.5 text-sm font-medium border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors bg-white"
                  />
                </div>
              )}

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
                  ) : editingGuru ? (
                    'Simpan Perubahan'
                  ) : (
                    'Buat Akun Guru'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Dialog: Ubah Status Akun Guru ─────────────────────────────── */}
      <ChangeGuruStatusModal
        isOpen={!!statusTarget}
        onClose={() => setStatusTarget(null)}
        onSave={handleSaveStatus}
        guru={statusTarget}
        isLoading={statusMutation.isPending}
      />

      {/* ── Delete dialog ────────────────────────────────────────────────────── */}
      <DeleteDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        guru={deleteTarget}
        isLoading={deleteMutation.isPending}
      />

      {/* ── Kredensial akun guru baru ───────────────────────────────────────── */}
      <NewGuruCredentialModal
        isOpen={!!createdCredentials}
        onClose={() => setCreatedCredentials(null)}
        credentials={createdCredentials}
      />
    </div>
  );
}