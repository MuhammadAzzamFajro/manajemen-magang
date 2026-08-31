'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJurnalSiswa, createJurnal, updateJurnal, deleteJurnal } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { toast } from '@/lib/toast';
import {
  Plus,
  BookOpen,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ImageIcon,
  UploadCloud,
  X,
  FileText,
} from 'lucide-react';

// ─── Date Formatter ─────────────────────────────────────────────────────────────
const formatIndonesianDateShort = (dateStr: string) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
};

// ─── Status Badge ───────────────────────────────────────────────────────────────
function VerificationStatusBadge({ status }: { status: string }) {
  const s = (status || '').toLowerCase();
  if (s === 'disetujui') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3 h-3" /> Disetujui
      </span>
    );
  }
  if (s === 'perlu_revisi' || s === 'perlu revisi') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <AlertTriangle className="w-3 h-3" /> Perlu Revisi
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-200">
      <Clock className="w-3 h-3" /> Menunggu
    </span>
  );
}

// ─── Reusable Modal ────────────────────────────────────────────────────────────
function FormModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-start gap-3 px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-900 text-base leading-tight">{title}</h2>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition shrink-0 -mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  tanggal,
  isPending,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tanggal?: string;
  isPending: boolean;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
          <Trash2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Hapus Laporan Jurnal?</h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Apakah Anda yakin ingin menghapus draft jurnal kegiatan tanggal{' '}
            <strong className="text-gray-800">{tanggal ? formatIndonesianDateShort(tanggal) : ''}</strong>? Laporan yang sudah disetujui guru tidak dapat dihapus.
          </p>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition disabled:opacity-50"
          >
            {isPending ? 'Menghapus...' : 'Ya, Hapus Jurnal'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function SiswaJurnalPage() {
  const user = getAuthUser();
  const queryClient = useQueryClient();
  const [isMounted, setIsMounted] = useState(false);

  // States
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<string | null>(null);

  // Form inputs
  const [tanggal, setTanggal] = useState('');
  const [uraian, setUraian] = useState('');
  const [kendala, setKendala] = useState('');
  const [solusi, setSolusi] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setIsMounted(true);
    setTanggal(new Date().toISOString().split('T')[0]);
  }, []);

  const siswaId = user?.siswa_id || user?.id || 0;

  // Queries
  const { data: jurnals = [], isLoading } = useQuery({
    queryKey: ['siswa-jurnal', siswaId],
    queryFn: () => getJurnalSiswa(siswaId),
    enabled: isMounted && !!siswaId,
  });

  // Filtered Jurnal List
  const filteredJurnals = useMemo(() => {
    if (!search.trim()) return jurnals;
    const q = search.toLowerCase();
    return jurnals.filter(
      (j: any) =>
        (j.uraian_kegiatan || '').toLowerCase().includes(q) ||
        (j.kendala || '').toLowerCase().includes(q) ||
        (j.solusi || '').toLowerCase().includes(q)
    );
  }, [jurnals, search]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: () =>
      createJurnal({
        tanggal,
        uraian_kegiatan: uraian,
        kendala,
        solusi,
        foto_bukti: fotoFile,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa-jurnal'] });
      queryClient.invalidateQueries({ queryKey: ['siswa-dashboard'] });
      resetForm();
      toast.success('Jurnal baru berhasil disimpan.');
    },
    onError: (err: any) => { const m = err?.response?.data?.message || err.message || 'Gagal menyimpan jurnal.'; setErrorMsg(m); toast.error(m); },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateJurnal(editingItem.id, {
        tanggal,
        uraian_kegiatan: uraian,
        kendala,
        solusi,
        foto_bukti: fotoFile,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa-jurnal'] });
      queryClient.invalidateQueries({ queryKey: ['siswa-dashboard'] });
      resetForm();
      toast.success('Jurnal berhasil diperbarui.');
    },
    onError: (err: any) => { const m = err?.response?.data?.message || err.message || 'Gagal memperbarui jurnal.'; setErrorMsg(m); toast.error(m); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteJurnal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa-jurnal'] });
      queryClient.invalidateQueries({ queryKey: ['siswa-dashboard'] });
      setDeleteItem(null);
      toast.success('Jurnal berhasil dihapus.');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || err.message || 'Gagal menghapus jurnal.'),
  });

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setTanggal(new Date().toISOString().split('T')[0]);
    setUraian('');
    setKendala('');
    setSolusi('');
    setFotoFile(null);
    setFotoPreview(null);
    setErrorMsg('');
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setErrorMsg('');
    setEditingItem(item);
    setTanggal(item.tanggal || new Date().toISOString().split('T')[0]);
    setUraian(item.uraian_kegiatan || '');
    setKendala(item.kendala || '');
    setSolusi(item.solusi || '');
    setFotoFile(null);
    setFotoPreview(item.foto_bukti ? item.foto_bukti : null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoFile(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  // Skeleton Loader for Hydration Safety
  if (!isMounted || isLoading) {
    return (
      <div className="space-y-8 font-sans animate-pulse">
        <div className="h-8 w-48 bg-gray-100 rounded-xl" />
        <div className="flex justify-between gap-4">
          <div className="h-10 w-64 bg-gray-100 rounded-xl" />
          <div className="h-10 w-36 bg-gray-100 rounded-xl" />
        </div>
        <div className="h-80 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Jurnal Kegiatan</h1>
      </div>

      {/* Filter / Search & Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kegiatan atau kendala..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
          />
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" /> Tulis Jurnal
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  TANGGAL
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  KEGIATAN
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  FOTO
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  AKSI
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredJurnals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-sm font-semibold text-gray-600 mt-1">
                        Belum ada jurnal kegiatan.
                      </p>
                      <p className="text-xs text-gray-400">
                        Tekan tombol "Tulis Jurnal" untuk mulai melaporkan aktivitas.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredJurnals.map((j: any) => (
                  <tr key={j.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Tanggal */}
                    <td className="px-5 py-4 font-semibold text-gray-800 text-sm whitespace-nowrap">
                      {formatIndonesianDateShort(j.tanggal)}
                    </td>

                    {/* Kegiatan */}
                    <td className="px-5 py-4 max-w-md">
                      <p className="text-sm text-gray-800 font-medium line-clamp-2 leading-relaxed">
                        {j.uraian_kegiatan}
                      </p>
                      {(j.kendala || j.solusi) && (
                        <div className="mt-1.5 space-y-0.5 text-[11px] text-gray-500">
                          {j.kendala && (
                            <p>
                              <strong className="text-gray-600">Kendala:</strong> {j.kendala}
                            </p>
                          )}
                          {j.solusi && (
                            <p>
                              <strong className="text-gray-600">Solusi:</strong> {j.solusi}
                            </p>
                          )}
                        </div>
                      )}
                      {j.catatan_guru && (
                        <p className="mt-2 text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                          <strong>Catatan Guru:</strong> {j.catatan_guru}
                        </p>
                      )}
                    </td>

                    {/* Foto Bukti */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {j.foto_bukti ? (
                        <button
                          onClick={() => setSelectedPhotoModal(j.foto_bukti)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <ImageIcon className="w-3.5 h-3.5" /> Foto Bukti
                        </button>
                      ) : (
                        <span className="text-gray-300 text-xs italic">-</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <VerificationStatusBadge status={j.status_verifikasi} />
                    </td>

                    {/* Aksi */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {j.status_verifikasi !== 'disetujui' ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(j)}
                            title="Edit Jurnal"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteItem(j)}
                            title="Hapus Jurnal"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">Terkunci</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal: Tulis / Edit Jurnal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingItem ? 'Edit Jurnal Kegiatan Harian' : 'Tulis Jurnal Kegiatan'}
        subtitle={
          editingItem
            ? 'Perbarui laporan aktivitas magang Anda.'
            : 'Catat aktivitas yang Anda kerjakan di tempat magang hari ini.'
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (editingItem) {
              updateMutation.mutate();
            } else {
              createMutation.mutate();
            }
          }}
          className="space-y-4"
        >
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Tanggal Pelaksanaan */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              TANGGAL PELAKSANAAN
            </label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* Rincian Kegiatan */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              RINCIAN KEGIATAN <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={uraian}
              onChange={(e) => setUraian(e.target.value)}
              rows={3}
              minLength={15}
              required
              placeholder="Konfigurasi database PostgreSQL dan integrasi REST API untuk manajemen penempatan siswa..."
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
            />
          </div>

          {/* Kendala / Masalah / Solusi */}
          {editingItem ? (
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                KENDALA / SOLUSI
              </label>
              <textarea
                value={kendala}
                onChange={(e) => setKendala(e.target.value)}
                rows={2}
                placeholder="Ada error koneksi, sudah diperbaiki dengan restart container..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  KENDALA / MASALAH (OPSIONAL)
                </label>
                <textarea
                  value={kendala}
                  onChange={(e) => setKendala(e.target.value)}
                  rows={2}
                  placeholder="Tidak ada kendala, tugas berjalan lancar..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  SOLUSI / TINDAK LANJUT (OPSIONAL)
                </label>
                <textarea
                  value={solusi}
                  onChange={(e) => setSolusi(e.target.value)}
                  rows={2}
                  placeholder="Solusi atau pemecahan masalah..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
                />
              </div>
            </div>
          )}

          {/* Foto Bukti Pekerjaan Input */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              FOTO BUKTI PEKERJAAN (OPSIONAL)
            </label>
            <div className="border-2 border-dashed border-gray-200 hover:border-blue-400 bg-gray-50/50 rounded-xl p-4 text-center transition cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {fotoPreview ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={fotoPreview}
                    alt="Preview Foto Bukti"
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <p className="text-[11px] text-blue-600 font-semibold">Klik untuk mengganti foto</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-gray-400">
                  <UploadCloud className="w-6 h-6 text-gray-300" />
                  <p className="text-xs font-semibold text-gray-500">
                    Klik untuk lampirkan screenshot atau foto dokumentasi
                  </p>
                  <p className="text-[10px] text-gray-400">JPG, PNG atau WEBP (Maks. 4MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Memproses...'
                : editingItem
                ? 'Simpan Perubahan'
                : 'Kirim Jurnal'}
            </button>
          </div>
        </form>
      </FormModal>

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => deleteItem && deleteMutation.mutate(deleteItem.id)}
        tanggal={deleteItem?.tanggal}
        isPending={deleteMutation.isPending}
      />

      {/* Photo View Modal */}
      {selectedPhotoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedPhotoModal(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2">
            <button
              onClick={() => setSelectedPhotoModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedPhotoModal}
              alt="Foto Bukti Pekerjaan"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
