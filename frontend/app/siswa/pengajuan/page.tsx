'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPengajuanSiswa, submitPengajuan, getDudis } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import {
  Plus,
  Send,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  Briefcase,
  Calendar,
  AlertCircle,
  X,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

// ─── Date Formatter ─────────────────────────────────────────────────────────────
const formatShortDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

// ─── Modal Component ────────────────────────────────────────────────────────────
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-start gap-3 px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
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

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function SiswaPengajuanPage() {
  const user = getAuthUser();
  const queryClient = useQueryClient();
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form inputs
  const [tempatMagangId, setTempatMagangId] = useState('');
  const [posisi, setPosisi] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('2026-08-01');
  const [tanggalSelesai, setTanggalSelesai] = useState('2026-11-30');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const siswaId = user?.siswa_id || user?.id || 0;

  // Queries
  const { data: pengajuans = [], isLoading } = useQuery({
    queryKey: ['siswa-pengajuan', siswaId],
    queryFn: () => getPengajuanSiswa(siswaId),
    enabled: isMounted && !!siswaId,
  });

  const { data: dudis = [] } = useQuery({
    queryKey: ['siswa-dudi-list'],
    queryFn: () => getDudis(),
    enabled: isMounted,
  });

  const submitMutation = useMutation({
    mutationFn: () =>
      submitPengajuan({
        siswa_id: siswaId,
        tempat_magang_id: parseInt(tempatMagangId),
        posisi_diminati: posisi || 'Peserta Magang',
        tanggal_mulai_usulan: tanggalMulai,
        tanggal_selesai_usulan: tanggalSelesai,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa-pengajuan'] });
      queryClient.invalidateQueries({ queryKey: ['siswa-dashboard'] });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message || err.message || 'Gagal mengirim pengajuan.');
    },
  });

  const resetForm = () => {
    setTempatMagangId('');
    setPosisi('');
    setTanggalMulai('2026-08-01');
    setTanggalSelesai('2026-11-30');
    setErrorMsg('');
  };

  const openModal = () => {
    resetForm();
    if (dudis.length > 0) {
      setTempatMagangId(String(dudis[0].id));
    }
    setIsModalOpen(true);
  };

  // Latest submission
  const latestSubmission = pengajuans.length > 0 ? pengajuans[0] : null;
  const status = latestSubmission?.status || 'belum_mengajukan';

  // Stepper State Logic
  const stepState = {
    step1: true,
    step2: status === 'menunggu' || status === 'disetujui' || status === 'ditolak',
    step3: status === 'disetujui',
    rejected: status === 'ditolak',
  };

  // Skeleton Loader for Hydration Safety
  if (!isMounted || isLoading) {
    return (
      <div className="space-y-8 font-sans animate-pulse">
        <div className="h-8 w-48 bg-gray-100 rounded-xl" />
        <div className="h-28 bg-gray-100 rounded-2xl" />
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-100 rounded-2xl" />
          <div className="h-64 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Page Title & Top Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengajuan Magang</h1>
        </div>
        {status === 'belum_mengajukan' || status === 'ditolak' ? (
          <button
            onClick={openModal}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" /> Form Pengajuan Tempat Magang
          </button>
        ) : null}
      </div>

      {/* Stepper Tracking Card */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            TRACKING STATUS PENGAJUAN
          </p>
          {status === 'disetujui' && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Disetujui
            </span>
          )}
          {status === 'menunggu' && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              Menunggu Validasi
            </span>
          )}
          {status === 'ditolak' && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              Ditolak
            </span>
          )}
          {status === 'belum_mengajukan' && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-400 border border-gray-200">
              Belum Mengajukan
            </span>
          )}
        </div>

        {/* Visual Progress Stepper */}
        <div className="flex items-center justify-between max-w-xl mx-auto px-4 py-2">
          {/* Step 1: Ajukan */}
          <div className="flex flex-col items-center gap-2 relative z-10">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/20">
              <Send className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-gray-800">Ajukan</span>
          </div>

          {/* Line 1 -> 2 */}
          <div className={`flex-1 h-0.5 mx-2 transition-colors ${stepState.step2 ? 'bg-blue-600' : 'bg-gray-200'}`} />

          {/* Step 2: Ditinjau Sekolah */}
          <div className="flex flex-col items-center gap-2 relative z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                stepState.step2
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-gray-100 text-gray-400 border border-gray-200'
              }`}
            >
              <Clock className="w-4 h-4" />
            </div>
            <span className={`text-xs font-bold ${stepState.step2 ? 'text-gray-800' : 'text-gray-400'}`}>
              Ditinjau Sekolah
            </span>
          </div>

          {/* Line 2 -> 3 */}
          <div className={`flex-1 h-0.5 mx-2 transition-colors ${stepState.step3 ? 'bg-emerald-600' : stepState.rejected ? 'bg-rose-500' : 'bg-gray-200'}`} />

          {/* Step 3: Disetujui / Ditolak */}
          <div className="flex flex-col items-center gap-2 relative z-10">
            {stepState.rejected ? (
              <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-rose-500/20">
                <XCircle className="w-4 h-4" />
              </div>
            ) : (
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  stepState.step3
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
            <span
              className={`text-xs font-bold ${
                stepState.step3
                  ? 'text-emerald-700'
                  : stepState.rejected
                  ? 'text-rose-600'
                  : 'text-gray-400'
              }`}
            >
              {stepState.rejected ? 'Ditolak' : 'Disetujui'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Detail Pengajuan & Status Card */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column: Detail Pengajuan Magang */}
        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Detail Pengajuan Magang</h2>
            <p className="text-xs text-gray-400 mt-0.5">Informasi tempat magang yang diajukan.</p>
          </div>

          {latestSubmission ? (
            <div className="space-y-4 pt-2">
              {/* Tempat Magang (DUDI) */}
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Tempat Magang (DUDI)
                  </p>
                  <p className="font-bold text-gray-800 text-sm mt-0.5">
                    {latestSubmission.tempatMagang?.nama_perusahaan ||
                      latestSubmission.tempat_magang?.nama_perusahaan ||
                      '-'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {latestSubmission.tempatMagang?.alamat || latestSubmission.tempat_magang?.alamat || 'Tasikmadu'}
                  </p>
                </div>
              </div>

              {/* Posisi yang Diajukan */}
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Posisi yang Diajukan
                  </p>
                  <p className="font-bold text-gray-800 text-sm mt-0.5">
                    {latestSubmission.posisi_diminati || 'Peserta Magang'}
                  </p>
                </div>
              </div>

              {/* Tanggal Pengajuan */}
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-500 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Tanggal Pengajuan
                  </p>
                  <p className="font-bold text-gray-800 text-sm mt-0.5">
                    {formatShortDate(latestSubmission.created_at || latestSubmission.tanggal_mulai_usulan || '2026-08-18')}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Building2 className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-sm font-semibold">Belum ada pengajuan magang yang tercatat.</p>
              <p className="text-xs text-gray-400 mt-1">
                Silakan buat pengajuan tempat magang untuk memulai.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Status Card Box */}
        <div className="flex flex-col justify-center">
          {status === 'disetujui' && (
            <div className="p-8 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-center space-y-4 flex flex-col items-center justify-center h-full">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-lg font-bold text-gray-900">Pengajuan Magang Aktif</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Selamat! Anda sudah terdaftar dan aktif magang. Silakan isi absensi atau jurnal harian Anda.
                </p>
              </div>
              <Link
                href="/siswa/dashboard"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                Ke Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {status === 'menunggu' && (
            <div className="p-8 rounded-2xl bg-amber-50/50 border border-amber-200 text-center space-y-4 flex flex-col items-center justify-center h-full">
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                <Clock className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-lg font-bold text-gray-900">Pengajuan Dalam Tinjauan</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Pengajuan Anda sedang ditinjau oleh pihak sekolah. Mohon tunggu proses validasi selesai.
                </p>
              </div>
            </div>
          )}

          {status === 'ditolak' && (
            <div className="p-8 rounded-2xl bg-rose-50/50 border border-rose-200 text-center space-y-4 flex flex-col items-center justify-center h-full">
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                <XCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-lg font-bold text-gray-900">Pengajuan Ditolak</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Permohonan tempat magang Anda ditolak. Silakan ajukan ulang ke perusahaan mitra lainnya.
                </p>
              </div>
              <button
                onClick={openModal}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                + Ajukan Ulang Tempat Magang
              </button>
            </div>
          )}

          {status === 'belum_mengajukan' && (
            <div className="p-8 rounded-2xl bg-blue-50/50 border border-blue-200 text-center space-y-4 flex flex-col items-center justify-center h-full">
              <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Building2 className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-lg font-bold text-gray-900">Form Pengajuan Tempat Magang</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Pilih industri mitra yang membuka kuota penerimaan permohonan magang mandiri.
                </p>
              </div>
              <button
                onClick={openModal}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                + Form Pengajuan Tempat Magang
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal: Form Pengajuan Tempat Magang */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Form Pengajuan Tempat Magang"
        subtitle="Pilih industri mitra yang membuka kuota penerimaan."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitMutation.mutate();
          }}
          className="space-y-4"
        >
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* DUDI Selection */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              PILIH PERUSAHAAN MITRA DUDI
            </label>
            <select
              value={tempatMagangId}
              onChange={(e) => setTempatMagangId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            >
              <option value="" disabled>
                -- Pilih Perusahaan DUDI --
              </option>
              {dudis.map((d: any) => {
                const sisaKuota = Math.max(0, (d.kuota ?? 5) - (d.penempatan_count ?? 0));
                return (
                  <option key={d.id} value={d.id}>
                    {d.nama_perusahaan} (Sisa Kuota: {sisaKuota})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Posisi / Divisi */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              POSISI / DIVISI YANG DIMINATI
            </label>
            <input
              type="text"
              value={posisi}
              onChange={(e) => setPosisi(e.target.value)}
              required
              placeholder="Web Developer Intern"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* Date Range Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                TANGGAL MULAI
              </label>
              <input
                type="date"
                value={tanggalMulai}
                onChange={(e) => setTanggalMulai(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                TANGGAL SELESAI
              </label>
              <input
                type="date"
                value={tanggalSelesai}
                onChange={(e) => setTanggalSelesai(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition disabled:opacity-50"
            >
              {submitMutation.isPending ? 'Mengirim...' : 'Kirim Pengajuan'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}
