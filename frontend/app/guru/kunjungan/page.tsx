'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getKunjunganForGuru,
  createKunjungan,
  updateKunjungan,
  deleteKunjungan,
  getDudis,
} from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import {
  Plus,
  MapPin,
  Calendar,
  Building2,
  Trash2,
  Edit2,
  ImageIcon,
  X,
  Clock,
  UploadCloud,
  CheckCircle2,
} from 'lucide-react';

// ─── Helpers ───────────────────────────────────────────────────────────────────
const formatIndonesianDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

// ─── Reusable Modal ────────────────────────────────────────────────────────────
function CustomModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-3 px-6 pt-5 pb-4 border-b border-gray-100">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              {icon}
            </div>
          )}
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

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  dudiName,
  tanggal,
  isPending,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  dudiName: string;
  tanggal: string;
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
          <h3 className="text-lg font-bold text-gray-900">Hapus Catatan Kunjungan?</h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Apakah Anda yakin ingin menghapus catatan kunjungan ke{' '}
            <strong className="text-gray-800">{dudiName}</strong> pada tanggal{' '}
            <strong className="text-gray-800">{formatIndonesianDate(tanggal)}</strong>?
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
            {isPending ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function GuruKunjunganPage() {
  const user = getAuthUser();
  const queryClient = useQueryClient();
  const [isMounted, setIsMounted] = useState(false);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<string | null>(null);

  const [tempatMagangId, setTempatMagangId] = useState('');
  const [tanggalKunjungan, setTanggalKunjungan] = useState('');
  const [catatanEvaluasi, setCatatanEvaluasi] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setIsMounted(true);
    setTanggalKunjungan(new Date().toISOString().split('T')[0]);
  }, []);

  const guruId = user?.guru_id || user?.id || 0;

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: kunjungans = [], isLoading } = useQuery({
    queryKey: ['guru-kunjungan', guruId],
    queryFn: () => getKunjunganForGuru(guruId),
    enabled: isMounted && !!guruId,
  });

  const { data: dudis = [] } = useQuery({
    queryKey: ['guru-dudi-list'],
    queryFn: () => getDudis(),
    enabled: isMounted,
  });

  // ── Compute Statistics ─────────────────────────────────────────────────────
  const totalKunjungan = kunjungans.length;

  const kunjunganBulanIni = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return kunjungans.filter((k: any) => {
      if (!k.tanggal_kunjungan) return false;
      const d = new Date(k.tanggal_kunjungan);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;
  }, [kunjungans]);

  const dudiDikunjungiCount = useMemo(() => {
    const setDudi = new Set();
    kunjungans.forEach((k: any) => {
      if (k.tempat_magang_id) setDudi.add(k.tempat_magang_id);
    });
    return setDudi.size;
  }, [kunjungans]);

  // ── Mutations ──────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: () =>
      createKunjungan({
        tempat_magang_id: parseInt(tempatMagangId),
        tanggal_kunjungan: tanggalKunjungan,
        catatan_evaluasi: catatanEvaluasi,
        foto_dokumentasi: fotoFile,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guru-kunjungan'] });
      resetForm();
    },
    onError: (err: any) => setErrorMsg(err.message || 'Gagal menyimpan kunjungan.'),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateKunjungan(editingItem.id, {
        tempat_magang_id: parseInt(tempatMagangId),
        tanggal_kunjungan: tanggalKunjungan,
        catatan_evaluasi: catatanEvaluasi,
        foto_dokumentasi: fotoFile,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guru-kunjungan'] });
      resetForm();
    },
    onError: (err: any) => setErrorMsg(err.message || 'Gagal memperbarui kunjungan.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteKunjungan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guru-kunjungan'] });
      setDeleteItem(null);
    },
  });

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setTempatMagangId('');
    setTanggalKunjungan(new Date().toISOString().split('T')[0]);
    setCatatanEvaluasi('');
    setFotoFile(null);
    setFotoPreview(null);
    setErrorMsg('');
  };

  const openAddModal = () => {
    resetForm();
    if (dudis.length > 0) setTempatMagangId(String(dudis[0].id));
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setErrorMsg('');
    setEditingItem(item);
    setTempatMagangId(String(item.tempat_magang_id || item.tempatMagang?.id || ''));
    setTanggalKunjungan(item.tanggal_kunjungan || '');
    setCatatanEvaluasi(item.catatan_evaluasi || '');
    setFotoFile(null);
    setFotoPreview(item.foto_dokumentasi ? item.foto_dokumentasi : null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoFile(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  // ── Skeleton Loader ────────────────────────────────────────────────────────
  if (!isMounted || isLoading) {
    return (
      <div className="space-y-8 font-sans animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-100 rounded-xl" />
          <div className="h-10 w-36 bg-gray-100 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}
        </div>
        <div className="h-96 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kunjungan Lapangan</h1>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" /> Tambah Kunjungan
        </button>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Total Kunjungan */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">TOTAL KUNJUNGAN</p>
            <h3 className="text-2xl font-extrabold text-gray-900 leading-tight mt-0.5">{totalKunjungan}</h3>
            <p className="text-xs text-gray-400">Seluruh riwayat tercatat</p>
          </div>
        </div>

        {/* Card 2: Bulan Ini */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">BULAN INI</p>
            <h3 className="text-2xl font-extrabold text-gray-900 leading-tight mt-0.5">{kunjunganBulanIni}</h3>
            <p className="text-xs text-gray-400">Kunjungan periode berjalan</p>
          </div>
        </div>

        {/* Card 3: DUDI Dikunjungi */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">DUDI DIKUNJUNGI</p>
            <h3 className="text-2xl font-extrabold text-gray-900 leading-tight mt-0.5">{dudiDikunjungiCount}</h3>
            <p className="text-xs text-gray-400">Mitra industri unik</p>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
        {kunjungans.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-500">Belum ada kunjungan lapangan yang dicatat.</p>
            <p className="text-xs text-gray-400 mt-1">Klik tombol "+ Tambah Kunjungan" untuk memulai pencatatan.</p>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 border-l-2 border-blue-100 space-y-8">
            {kunjungans.map((k: any) => {
              const dudiName = k.tempat_magang?.nama_perusahaan || k.tempatMagang?.nama_perusahaan || 'Perusahaan DUDI';
              return (
                <div key={k.id} className="relative group">
                  {/* Timeline Indicator Node */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-5 h-5 rounded-full bg-white border-4 border-blue-600 shadow-xs" />

                  {/* Timeline Card */}
                  <div className="p-5 rounded-2xl bg-gray-50/50 border border-gray-200/80 hover:border-blue-200 transition-all space-y-3">
                    {/* Card Header: Title & Date */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        {dudiName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatIndonesianDate(k.tanggal_kunjungan)}</span>
                      </div>
                    </div>

                    {/* Evaluation Notes */}
                    {k.catatan_evaluasi && (
                      <p className="text-xs text-gray-600 leading-relaxed bg-white p-3.5 rounded-xl border border-gray-100">
                        {k.catatan_evaluasi}
                      </p>
                    )}

                    {/* Footer Actions & Photo */}
                    <div className="flex items-center justify-between pt-1">
                      {k.foto_dokumentasi ? (
                        <button
                          onClick={() => setSelectedPhotoModal(k.foto_dokumentasi)}
                          className="px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <ImageIcon className="w-3.5 h-3.5" /> Dokumentasi Kunjungan
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">Tidak ada foto dokumentasi</span>
                      )}

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(k)}
                          title="Edit Catatan Kunjungan"
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteItem(k)}
                          title="Hapus Catatan Kunjungan"
                          className="p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Form Modal: Add / Edit Kunjungan */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingItem ? 'Edit Catatan Kunjungan' : 'Catat Kunjungan Industri'}
        subtitle={
          editingItem
            ? 'Perbarui log kunjungan ke tempat magang.'
            : 'Dokumentasikan hasil monitoring guru ke tempat magang.'
        }
        icon={editingItem ? <Edit2 className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
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

          {/* DUDI Dropdown */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              PILIH PERUSAHAAN DUDI
            </label>
            <select
              value={tempatMagangId}
              onChange={(e) => setTempatMagangId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            >
              <option value="" disabled>
                -- Pilih Tempat Magang --
              </option>
              {dudis.map((d: any) => (
                <option key={d.id} value={d.id}>
                  {d.nama_perusahaan}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              TANGGAL KUNJUNGAN
            </label>
            <input
              type="date"
              value={tanggalKunjungan}
              onChange={(e) => setTanggalKunjungan(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* Notes Textarea */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              CATATAN EVALUASI / HASIL MONITORING
            </label>
            <textarea
              value={catatanEvaluasi}
              onChange={(e) => setCatatanEvaluasi(e.target.value)}
              rows={3}
              placeholder="Monitoring perkembangan pengerjaan modul backend siswa, koordinasi dengan PIC industri terkait kehadiran dan kedisiplinan kerja."
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
            />
          </div>

          {/* Photo Upload Input */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              FOTO DOKUMENTASI LAPANGAN (OPSIONAL)
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
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <p className="text-[11px] text-blue-600 font-semibold">Klik untuk mengganti foto</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-gray-400">
                  <UploadCloud className="w-6 h-6 text-gray-300" />
                  <p className="text-xs font-semibold text-gray-500">
                    Klik untuk upload foto bersama pembimbing industri
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
                : 'Simpan Kunjungan'}
            </button>
          </div>
        </form>
      </CustomModal>

      {/* Confirm Delete Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => deleteItem && deleteMutation.mutate(deleteItem.id)}
        dudiName={deleteItem?.tempat_magang?.nama_perusahaan || deleteItem?.tempatMagang?.nama_perusahaan || ''}
        tanggal={deleteItem?.tanggal_kunjungan || ''}
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
              alt="Foto Dokumentasi Kunjungan"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
