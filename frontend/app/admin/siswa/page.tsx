'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSiswas, createSiswa, updateSiswa, deleteSiswa, plottingSiswa, prosesPengajuanSiswa,
  getGurus, getDudis, getKelases,
} from '@/lib/db';
import {
  Plus, Search, ChevronDown, MoreHorizontal, Edit2, Trash2,
  AlertTriangle, Lock, Mail, Hash, GraduationCap, Users, Briefcase, Clock,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ShieldX, UserCheck, Building2, Key, Copy, Check, Filter, RotateCw, FileCheck,
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
  '#4F46E5', '#0891B2', '#059669', '#D97706',
  '#DC2626', '#7C3AED', '#DB2777', '#0284C7',
];
const getAvatarBg = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_BG[Math.abs(h) % AVATAR_BG.length];
};

// ─── 3-dot Action Menu ────────────────────────────────────────────────────────
function ActionMenu({ siswa, onEdit, onPlotting, onProsesPengajuan, onToggleStatus, onDelete }: {
  siswa: any; onEdit: () => void; onPlotting: () => void; onProsesPengajuan: () => void; onToggleStatus: () => void; onDelete: () => void;
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
          {siswa.status_magang === 'pengajuan' && (
            <button onClick={() => { onProsesPengajuan(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-amber-700 bg-amber-50/80 hover:bg-amber-100 transition-colors font-semibold border-b border-amber-100">
              <FileCheck className="w-3.5 h-3.5 text-amber-600" /> Proses Pengajuan
            </button>
          )}
          <button onClick={() => { onEdit(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
            <Edit2 className="w-3.5 h-3.5 text-gray-400" /> Edit Data Siswa
          </button>
          <button onClick={() => { onPlotting(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-indigo-600 hover:bg-indigo-50 transition-colors font-medium">
            <UserCheck className="w-3.5 h-3.5 text-indigo-500" /> Plot Pembimbing & DUDI
          </button>
          <button onClick={() => { onToggleStatus(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
            <RotateCw className="w-3.5 h-3.5 text-blue-500" /> Ubah Status Siswa
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

// ─── Modal Dialog: Kredensial Akun Siswa Baru ─────────────────────────────
function NewSiswaCredentialModal({
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
          Akun Siswa Berhasil Dibuat
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto mb-5">
          Berikan kredensial ini kepada siswa untuk login portal magang.
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

// ─── Modal Dialog: Plotting Guru Pembimbing & DUDI ────────────────────────────
function PlottingModal({
  isOpen,
  onClose,
  siswa,
  gurus = [],
  dudis = [],
  onSave,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  siswa: any;
  gurus: any[];
  dudis: any[];
  onSave: (payload: { guru_id: number; tempat_magang_id: number; tanggal_mulai: string; tanggal_selesai: string }) => void;
  isLoading: boolean;
}) {
  const [guruId, setGuruId] = useState('');
  const [tempatMagangId, setTempatMagangId] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('2026-07-01');
  const [tanggalSelesai, setTanggalSelesai] = useState('2026-12-31');

  useEffect(() => {
    if (siswa) {
      const p = siswa.penempatan?.[0];
      if (p) {
        setGuruId(p.guru_id ? String(p.guru_id) : '');
        setTempatMagangId(p.tempat_magang_id ? String(p.tempat_magang_id) : '');
        if (p.tanggal_mulai) setTanggalMulai(p.tanggal_mulai.split('T')[0]);
        if (p.tanggal_selesai) setTanggalSelesai(p.tanggal_selesai.split('T')[0]);
      } else {
        setGuruId('');
        setTempatMagangId('');
      }
    }
  }, [siswa]);

  if (!isOpen || !siswa) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guruId || !tempatMagangId) return;
    onSave({
      guru_id: parseInt(guruId),
      tempat_magang_id: parseInt(tempatMagangId),
      tanggal_mulai: tanggalMulai,
      tanggal_selesai: tanggalSelesai,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Purple Icon Header */}
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 leading-tight">Plot Guru Pembimbing</h3>
            <p className="text-xs text-gray-500 mt-1 leading-snug">
              Tetapkan guru pembimbing dan DUDI untuk siswa terpilih.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Guru Pembimbing */}
          <div>
            <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              GURU PEMBIMBING
            </label>
            <div className="relative">
              <select
                value={guruId}
                onChange={(e) => setGuruId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm font-medium border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
              >
                <option value="">— Pilih Guru Pembimbing —</option>
                {gurus.map((g: any) => (
                  <option key={g.id} value={g.id}>
                    {g.nama_lengkap} (NIP: {g.nip || '—'})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Tempat Magang (DUDI) */}
          <div>
            <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              TEMPAT MAGANG (INDUSTRI)
            </label>
            <div className="relative">
              <select
                value={tempatMagangId}
                onChange={(e) => setTempatMagangId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm font-medium border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
              >
                <option value="">— Pilih Tempat Magang —</option>
                {dudis.map((d: any) => {
                  const kuota = d.kuota ?? 0;
                  const terisi = d.penempatan_count ?? 0;
                  const sisa = Math.max(0, kuota - terisi);
                  return (
                    <option key={d.id} value={d.id} disabled={sisa <= 0 && String(d.id) !== tempatMagangId}>
                      {d.nama_perusahaan} (Sisa Kuota: {sisa})
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || !guruId || !tempatMagangId}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm shadow-indigo-200"
            >
              {isLoading ? (
                <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</>
              ) : (
                'Simpan Plotting'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal Dialog: Ubah Status Siswa ─────────────────────────────────────────
function ChangeSiswaStatusModal({
  isOpen,
  onClose,
  onSave,
  siswa,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newStatus: string) => void;
  siswa: any;
  isLoading: boolean;
}) {
  const [selectedStatus, setSelectedStatus] = useState<string>('aktif');

  useEffect(() => {
    if (siswa) {
      setSelectedStatus(siswa.status_magang === 'nonaktif' ? 'nonaktif' : 'aktif');
    }
  }, [siswa]);

  if (!isOpen || !siswa) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <RotateCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 leading-tight">Ubah Status Siswa</h3>
            <p className="text-xs text-gray-500 mt-1 leading-snug">
              Perbarui status aktif untuk siswa magang.
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
function DeleteDialog({ isOpen, onClose, onConfirm, siswa, isLoading }: {
  isOpen: boolean; onClose: () => void; onConfirm: () => void; siswa: any; isLoading: boolean;
}) {
  if (!isOpen || !siswa) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
          <Trash2 className="w-5 h-5 text-rose-500" />
        </div>

        <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">
          Hapus Data Siswa?
        </h3>

        <p className="text-xs text-gray-500 leading-relaxed mb-6">
          Apakah Anda yakin ingin menghapus siswa <span className="font-bold text-gray-900">{siswa.nama_lengkap} (NIS: {siswa.nis})</span>? Seluruh data riwayat presensi, jurnal, dan penempatan terkait akan dihapus.
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
              <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menghapus...</>
            ) : (
              'Ya, Hapus Siswa'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Process Pengajuan Modal ───────────────────────────────────────────────────
function ProcessPengajuanModal({
  isOpen,
  onClose,
  siswa,
  gurus = [],
  onApprove,
  onReject,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  siswa: any;
  gurus: any[];
  onApprove: (guruId: number) => void;
  onReject: (catatan: string) => void;
  isLoading: boolean;
}) {
  const [guruId, setGuruId] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [catatanPenolakan, setCatatanPenolakan] = useState('');

  useEffect(() => {
    if (isOpen) {
      setGuruId('');
      setShowRejectForm(false);
      setCatatanPenolakan('');
    }
  }, [isOpen]);

  if (!isOpen || !siswa) return null;

  const activePengajuan = Array.isArray(siswa.pengajuan) && siswa.pengajuan.length > 0
    ? siswa.pengajuan[0]
    : siswa.pengajuan_terakhir;
  const dudiName = activePengajuan?.tempat_magang?.nama_perusahaan || activePengajuan?.tempatMagang?.nama_perusahaan || '—';
  const posisi = activePengajuan?.posisi_diminati || '—';
  const tglMulai = activePengajuan?.tanggal_mulai_usulan ? activePengajuan.tanggal_mulai_usulan.split('T')[0] : '—';
  const tglSelesai = activePengajuan?.tanggal_selesai_usulan ? activePengajuan.tanggal_selesai_usulan.split('T')[0] : '—';

  const handleApproveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guruId) return;
    onApprove(parseInt(guruId));
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReject(catatanPenolakan);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Icon Header */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 leading-tight">Proses Pengajuan Magang</h3>
            <p className="text-xs text-gray-500 mt-1 leading-snug">
              Tinjau pengajuan magang dari <span className="font-semibold text-gray-800">{siswa.nama_lengkap}</span>.
            </p>
          </div>
        </div>

        {/* Ringkasan Detail Pengajuan */}
        <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-3.5 mb-4 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Perusahaan DUDI:</span>
            <span className="font-bold text-gray-900">{dudiName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Posisi Diminati:</span>
            <span className="font-semibold text-indigo-700">{posisi}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Usulan Periode:</span>
            <span className="font-mono text-gray-700">{tglMulai} s.d. {tglSelesai}</span>
          </div>
        </div>

        {!showRejectForm ? (
          <form onSubmit={handleApproveSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                ALOKASIKAN GURU PEMBIMBING <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={guruId}
                  onChange={(e) => setGuruId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs font-medium border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
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

            <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowRejectForm(true)}
                className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
              >
                Tolak Pengajuan
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !guruId}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm shadow-emerald-200"
                >
                  {isLoading ? 'Memproses...' : 'Setujui Pengajuan'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRejectSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-1.5">
                ALASAN / CATATAN PENOLAKAN
              </label>
              <textarea
                value={catatanPenolakan}
                onChange={(e) => setCatatanPenolakan(e.target.value)}
                placeholder="Contoh: Kuota posisi di DUDI ini sudah penuh..."
                rows={3}
                className="w-full px-3 py-2 text-xs border border-rose-200 rounded-xl focus:outline-none focus:border-rose-500 bg-rose-50/20"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowRejectForm(false)}
                className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Kembali
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-60 rounded-lg transition-colors"
              >
                {isLoading ? 'Memproses...' : 'Konfirmasi Tolak'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminSiswaPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  const [filterIndustri, setFilterIndustri] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [plottingTarget, setPlottingTarget] = useState<any>(null);
  const [prosesPengajuanTarget, setProsesPengajuanTarget] = useState<any>(null);
  const [statusTarget, setStatusTarget] = useState<any>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [nis, setNis] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [kelasId, setKelasId] = useState<number | string>('');
  const [emailKontak, setEmailKontak] = useState('');
  const [password, setPassword] = useState('');

  // ─── Fetch data dari Laravel API ─────────────────────────────────────────
  const { data: rawSiswas = [], isLoading, error: fetchError } = useQuery({
    queryKey: ['admin-siswa'],
    queryFn: () => getSiswas(),
    staleTime: 30_000,
  });

  const { data: gurus = [] } = useQuery({ queryKey: ['admin-guru-list'], queryFn: () => getGurus() });
  const { data: dudis = [] } = useQuery({ queryKey: ['admin-dudi-list'], queryFn: () => getDudis() });
  const { data: kelasData = [] } = useQuery({ queryKey: ['admin-kelas'], queryFn: () => getKelases(), staleTime: 30_000 });

  // ─── Client-side Filter & Pagination ─────────────────────────────────────
  const filtered = useMemo(() => {
    let list = rawSiswas as any[];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.nama_lengkap?.toLowerCase().includes(q) ||
        s.nis?.includes(q) ||
        s.kelas?.nama?.toLowerCase().includes(q) ||
        s.email_kontak?.toLowerCase().includes(q) ||
        s.user?.email?.toLowerCase().includes(q)
      );
    }
    if (filterKelas) list = list.filter(s => s.kelas?.nama === filterKelas);
    if (filterIndustri) {
      list = list.filter(s => {
        const p = s.penempatan?.[0];
        const dudiName = p?.tempat_magang?.nama_perusahaan || p?.tempatMagang?.nama_perusahaan || '';
        return dudiName === filterIndustri;
      });
    }
    if (filterStatus) list = list.filter(s => s.status_magang === filterStatus);
    return list;
  }, [rawSiswas, search, filterKelas, filterIndustri, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Filter dropdown lists
  const kelasList = useMemo(() => {
    const set = new Set<string>((kelasData as any[]).map(k => k.nama).filter(Boolean));
    (rawSiswas as any[]).forEach(s => { if (s.kelas?.nama) set.add(s.kelas.nama); });
    return [...set].sort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawSiswas, kelasData]);

  const industriList = useMemo(() => {
    const set = new Set((dudis as any[]).map(d => d.nama_perusahaan).filter(Boolean));
    return [...set].sort();
  }, [dudis]);

  // ─── Stats ───────────────────────────────────────────────────────────────
  const all = rawSiswas as any[];
  const totalSiswa = all.length;
  const sedangMagang = all.filter(s => s.status_magang === 'sedang_magang').length;
  const belumMagang = all.filter(s => s.status_magang === 'belum_magang' || !s.status_magang).length;
  const lulusMagang = all.filter(s => s.status_magang === 'lulus').length;
  const pengajuanMenunggu = all.filter(s => s.status_magang === 'pengajuan' && Array.isArray(s.pengajuan) && s.pengajuan.some((p: any) => p.status === 'menunggu')).length;

  // ─── Checkbox Selection ──────────────────────────────────────────────────
  const allPageSelected = paginated.length > 0 && paginated.every(s => selected.has(s.id));
  const toggleAll = () => {
    setSelected(prev => {
      const n = new Set(prev);
      allPageSelected ? paginated.forEach(s => n.delete(s.id)) : paginated.forEach(s => n.add(s.id));
      return n;
    });
  };

  // ─── Form Helpers ────────────────────────────────────────────────────────
  const resetForm = () => { setNis(''); setNamaLengkap(''); setKelasId(''); setEmailKontak(''); setPassword(''); setErrorMsg(''); };

  const openAdd = () => { setEditingSiswa(null); resetForm(); setIsModalOpen(true); };
  const openEdit = (s: any) => {
    setEditingSiswa(s);
    setNis(s.nis || '');
    setNamaLengkap(s.nama_lengkap || '');
    setKelasId(s.kelas_id || '');
    setEmailKontak(s.email_kontak || s.user?.email || '');
    setPassword('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  // ─── Mutations ───────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        nis,
        nama_lengkap: namaLengkap,
        kelas_id: kelasId ? Number(kelasId) : null,
        email: emailKontak,
        email_kontak: emailKontak,
        status_magang: editingSiswa ? editingSiswa.status_magang : 'belum_magang',
      };
      if (editingSiswa) return updateSiswa(editingSiswa.id, payload);

      const usedPassword = password || `Siswa#${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const res = await createSiswa({ ...payload, password: usedPassword });
      return { ...res, _usedEmail: emailKontak, _usedPassword: usedPassword };
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['admin-siswa'] });
      setIsModalOpen(false);
      toast.success(editingSiswa ? 'Data siswa berhasil diperbarui.' : 'Siswa baru berhasil ditambahkan.');
      if (!editingSiswa && data?._usedEmail) {
        setCreatedCredentials({
          email: data._usedEmail,
          password: data._usedPassword,
        });
      }
      resetForm();
    },
    onError: (e: any) => { setErrorMsg(e.message || 'Gagal menyimpan data.'); toast.error(e.message || 'Gagal menyimpan data.'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSiswa(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-siswa'] }); setDeleteTarget(null); toast.success('Data siswa berhasil dihapus.'); },
    onError: (e: any) => toast.error(e.message || 'Gagal menghapus siswa.'),
  });

  const plottingMutation = useMutation({
    mutationFn: (payload: { guru_id: number; tempat_magang_id: number; tanggal_mulai: string; tanggal_selesai: string }) => {
      return plottingSiswa(plottingTarget.id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-siswa'] });
      setPlottingTarget(null);
      toast.success('Plotting pembimbing & DUDI berhasil disimpan.');
    },
    onError: (e: any) => toast.error(e.message || 'Gagal melakukan plotting.'),
  });

  const prosesPengajuanMutation = useMutation({
    mutationFn: (payload: { status: 'disetujui' | 'ditolak'; guru_id?: number; catatan_penolakan?: string }) => {
      const activePengajuan = Array.isArray(prosesPengajuanTarget?.pengajuan) && prosesPengajuanTarget.pengajuan.length > 0
        ? prosesPengajuanTarget.pengajuan[0]
        : prosesPengajuanTarget?.pengajuan_terakhir;
      if (!activePengajuan?.id) throw new Error('Data pengajuan magang siswa tidak ditemukan.');
      return prosesPengajuanSiswa(activePengajuan.id, payload);
    },
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ['admin-siswa'] });
      queryClient.invalidateQueries({ queryKey: ['admin-penempatan'] });
      setProsesPengajuanTarget(null);
      toast.success(res?.message || 'Pengajuan magang berhasil diproses.');
    },
    onError: (e: any) => toast.error(e.message || 'Gagal memproses pengajuan magang.'),
  });

  const handleSaveSiswaStatus = (newStatus: string) => {
    setStatusTarget(null);
  };

  return (
    <div className="p-0">

      {/* ── Stat cards (5 Cards) ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-5">
        {/* Card 1: Total Siswa */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Siswa</p>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-blue-500" />
            </div>
          </div>
          <p className="text-4xl font-black text-gray-900 leading-none">{totalSiswa}</p>
          <p className="text-xs text-gray-400 mt-1.5">Siswa terdaftar</p>
        </div>

        {/* Card 2: Sedang Magang */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sedang Magang</p>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5 text-blue-500" />
            </div>
          </div>
          <p className="text-4xl font-black text-gray-900 leading-none">{sedangMagang}</p>
          <p className="text-xs text-gray-400 mt-1.5">Aktif di industri</p>
        </div>

        {/* Card 3: Pengajuan Menunggu */}
        <div className={`rounded-2xl border p-4 ${pengajuanMenunggu > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'}`}>
          <div className="flex items-start justify-between mb-3">
            <p className={`text-[10px] font-bold uppercase tracking-widest ${pengajuanMenunggu > 0 ? 'text-amber-600' : 'text-gray-400'}`}>Perlu Ditinjau</p>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${pengajuanMenunggu > 0 ? 'bg-amber-200' : 'bg-amber-100'}`}>
              <FileCheck className="w-3.5 h-3.5 text-amber-600" />
            </div>
          </div>
          <p className={`text-4xl font-black leading-none ${pengajuanMenunggu > 0 ? 'text-amber-700' : 'text-gray-900'}`}>{pengajuanMenunggu}</p>
          <button
            onClick={() => { setFilterStatus('pengajuan'); setPage(1); }}
            className={`text-xs mt-1.5 transition-colors ${pengajuanMenunggu > 0 ? 'text-amber-600 hover:text-amber-800 font-semibold underline underline-offset-2' : 'text-gray-400 cursor-default'}`}
          >
            {pengajuanMenunggu > 0 ? 'Lihat pengajuan →' : 'Semua diproses'}
          </button>
        </div>

        {/* Card 4: Belum Magang */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Belum Magang</p>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>
          <p className="text-4xl font-black text-gray-900 leading-none">{belumMagang}</p>
          <p className="text-xs text-gray-400 mt-1.5">Perlu ditempatkan</p>
        </div>

        {/* Card 5: Lulus Magang */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lulus Magang</p>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-green-500" />
            </div>
          </div>
          <p className="text-4xl font-black text-gray-900 leading-none">{lulusMagang}</p>
          <p className="text-xs text-gray-400 mt-1.5">Selesai program</p>
        </div>
      </div>

      {/* ── Filter bar ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3 mb-4 flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, NIS, atau kelas..."
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

        {/* Filter Industri */}
        <div className="relative">
          <select
            value={filterIndustri}
            onChange={e => { setFilterIndustri(e.target.value); setPage(1); }}
            className="pl-3 pr-7 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer"
          >
            <option value="">Semua Industri</option>
            {industriList.map(ind => <option key={ind} value={ind}>{ind}</option>)}
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
            <option value="belum_magang">Belum Magang</option>
            <option value="pengajuan">Pengajuan</option>
            <option value="sedang_magang">Sedang Magang</option>
            <option value="lulus">Lulus Magang</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>

        <span className="text-sm font-semibold text-gray-500">{filtered.length} Siswa</span>

        <button
          onClick={openAdd}
          className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-blue-200"
        >
          <Plus className="w-4 h-4" /> Tambah Siswa
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
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">NIS</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Nama Lengkap</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Kelas</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status Magang</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Industri</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Guru Pembimbing</span>
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
                    <td className="px-4 py-4"><div className="h-3 w-16 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-3 w-32 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-3 w-28 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-6 bg-gray-100 rounded animate-pulse ml-auto" /></td>
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <Users className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                    <p className="text-sm text-gray-400">
                      {(search || filterKelas || filterIndustri || filterStatus) ? 'Tidak ada data yang cocok dengan filter.' : 'Belum ada data siswa.'}
                    </p>
                    {(search || filterKelas || filterIndustri || filterStatus) && (
                      <button onClick={() => { setSearch(''); setFilterKelas(''); setFilterIndustri(''); setFilterStatus(''); }}
                        className="mt-2 text-xs text-blue-600 hover:underline">Reset filter</button>
                    )}
                  </td>
                </tr>
              ) : (
                paginated.map((s: any) => {
                  const bg = getAvatarBg(s.nama_lengkap || '');
                  const initials = getInitials(s.nama_lengkap || '');
                  const p = s.penempatan?.[0];
                  const dudiName = p?.tempat_magang?.nama_perusahaan || p?.tempatMagang?.nama_perusahaan || s.nama_dudi || '';
                  const guruName = p?.guru?.nama_lengkap || s.nama_guru || '';
                  const emailStr = s.email_kontak || s.user?.email || '';

                  // Status Badges
                  const statusConfig: Record<string, { label: string; bg: string; dot: string }> = {
                    sedang_magang: { label: 'Sedang Magang', bg: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
                    pengajuan:     { label: 'Pengajuan',     bg: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
                    lulus:         { label: 'Lulus Magang',  bg: 'bg-green-50 text-green-700', dot: 'bg-green-500' },
                    belum_magang:  { label: 'Belum Magang',  bg: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
                  };
                  const st = statusConfig[s.status_magang] || statusConfig.belum_magang;

                  return (
                    <tr key={s.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${selected.has(s.id) ? 'bg-blue-50/30' : ''}`}>
                      {/* Checkbox */}
                      <td className="px-4 py-3.5">
                        <input type="checkbox" checked={selected.has(s.id)}
                          onChange={() => setSelected(prev => { const n = new Set(prev); n.has(s.id) ? n.delete(s.id) : n.add(s.id); return n; })}
                          className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer" />
                      </td>

                      {/* NIS */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs text-gray-500">{s.nis}</span>
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
                            <p className="font-semibold text-gray-800 text-sm leading-none">{s.nama_lengkap}</p>
                            {emailStr && <p className="text-xs text-gray-400 mt-0.5">{emailStr}</p>}
                          </div>
                        </div>
                      </td>

                      {/* Kelas */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-medium text-gray-700">{s.kelas?.nama}</span>
                      </td>

                      {/* Status Magang */}
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => setStatusTarget(s)}
                          title="Klik untuk ubah status siswa"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity ${st.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {st.label}
                        </button>
                      </td>

                      {/* Industri */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-medium text-gray-700">
                          {dudiName || <span className="text-gray-300">—</span>}
                        </span>
                      </td>

                      {/* Guru Pembimbing */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-medium text-gray-700">
                          {guruName || <span className="text-gray-300">—</span>}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="px-4 py-3.5">
                        <ActionMenu
                          siswa={s}
                          onEdit={() => openEdit(s)}
                          onPlotting={() => setPlottingTarget(s)}
                          onProsesPengajuan={() => setProsesPengajuanTarget(s)}
                          onToggleStatus={() => setStatusTarget(s)}
                          onDelete={() => setDeleteTarget(s)}
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

      {/* ── Modal Form Tambah / Edit Siswa ─────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => { setIsModalOpen(false); resetForm(); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                {editingSiswa ? <Edit2 className="w-5 h-5" /> : <Users className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  {editingSiswa ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-snug">
                  {editingSiswa
                    ? 'Ubah informasi identitas dan kelas siswa.'
                    : 'Akun login siswa akan dibuat otomatis dengan password default.'}
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
                  {editingSiswa ? 'NAMA LENGKAP SISWA' : 'NAMA LENGKAP'}
                </label>
                <input
                  type="text"
                  value={namaLengkap}
                  onChange={e => setNamaLengkap(e.target.value)}
                  required
                  placeholder="Contoh: Bagus Hidayat"
                  className="w-full px-3.5 py-2.5 text-sm font-medium border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  {editingSiswa ? 'NIS (NOMOR INDUK SISWA)' : 'NIS'}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={nis}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    if (!/^\d*$/.test(value)) {
                      e.target.value = value.replace(/\D/g, '');
                    }
                    setNis(e.target.value);
                  }}
                  readOnly={!!editingSiswa}
                  required={!editingSiswa}
                  placeholder="Contoh: 220533604138"
                  className="w-full px-3.5 py-2.5 text-sm font-medium border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors bg-white disabled:bg-slate-50 disabled:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  KELAS
                </label>
                <div className="relative">
                  <select
                    value={kelasId}
                    onChange={e => setKelasId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-sm font-medium border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer"
                  >
                    <option value="">— Pilih Kelas —</option>
                    {(kelasData as any[]).map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

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
                  ) : editingSiswa ? (
                    'Simpan Perubahan'
                  ) : (
                    'Buat Akun Siswa'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Plotting Pembimbing & DUDI ──────────────────────────────── */}
      <PlottingModal
        isOpen={!!plottingTarget}
        onClose={() => setPlottingTarget(null)}
        siswa={plottingTarget}
        gurus={gurus}
        dudis={dudis}
        onSave={(payload) => plottingMutation.mutate(payload)}
        isLoading={plottingMutation.isPending}
      />

      {/* ── Modal Process Pengajuan Magang ─────────────────────────────────── */}
      <ProcessPengajuanModal
        isOpen={!!prosesPengajuanTarget}
        onClose={() => setProsesPengajuanTarget(null)}
        siswa={prosesPengajuanTarget}
        gurus={gurus}
        onApprove={(guruId) => prosesPengajuanMutation.mutate({ status: 'disetujui', guru_id: guruId })}
        onReject={(catatan) => prosesPengajuanMutation.mutate({ status: 'ditolak', catatan_penolakan: catatan })}
        isLoading={prosesPengajuanMutation.isPending}
      />

      {/* ── Modal Dialog: Ubah Status Siswa ─────────────────────────────────── */}
      <ChangeSiswaStatusModal
        isOpen={!!statusTarget}
        onClose={() => setStatusTarget(null)}
        onSave={handleSaveSiswaStatus}
        siswa={statusTarget}
        isLoading={false}
      />

      {/* ── Modal Dialog: Kredensial Akun Siswa Baru ─────────────────────────── */}
      <NewSiswaCredentialModal
        isOpen={!!createdCredentials}
        onClose={() => setCreatedCredentials(null)}
        credentials={createdCredentials}
      />

      {/* ── Delete dialog ────────────────────────────────────────────────────── */}
      <DeleteDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        siswa={deleteTarget}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
