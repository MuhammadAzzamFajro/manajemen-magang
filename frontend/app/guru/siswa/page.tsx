'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSiswaBimbingan, inputNilai } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { Edit2, ClipboardList, CheckCircle2, X } from 'lucide-react';

// ─── Toast ──────────────────────────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 bg-gray-900 text-white rounded-2xl shadow-2xl text-sm font-semibold animate-slide-in">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      {message}
    </div>
  );
}

// ─── Modal ──────────────────────────────────────────────────────────────────────
function Modal({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-start gap-3 px-6 pt-5 pb-4 border-b border-gray-100">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm leading-tight">{title}</p>
            {subtitle && <p className="text-xs text-blue-500 mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition shrink-0 -mt-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status?: string }) {
  const s = (status || 'aktif').toLowerCase();
  if (s === 'lulus' || s === 'lulus_magang')
    return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Lulus Magang</span>;
  if (s === 'tidak_lulus')
    return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">Tidak Lulus</span>;
  return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Sedang Magang</span>;
}

// ─── Nilai Circle Badge ──────────────────────────────────────────────────────────
function NilaiBadge({ nilai }: { nilai: number | null }) {
  if (nilai === null || nilai === undefined)
    return <span className="text-gray-300 text-sm">-</span>;
  const color = nilai >= 75
    ? 'border-emerald-400 text-emerald-700 bg-emerald-50'
    : 'border-rose-400 text-rose-700 bg-rose-50';
  return (
    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm ${color}`}>
      {nilai}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────────
export default function GuruSiswaPage() {
  const user = getAuthUser();
  const queryClient = useQueryClient();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedNilai, setSelectedNilai] = useState<any>(null);
  const [nilaiInput, setNilaiInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => { setIsMounted(true); }, []);

  const { data: bimbingan = [], isLoading } = useQuery({
    queryKey: ['guru-siswa-bimbingan', user?.guru_id],
    queryFn: () => getSiswaBimbingan(user?.guru_id || user?.id || 0),
    enabled: isMounted && !!(user?.guru_id || user?.id),
  });

  const nilaiMutation = useMutation({
    mutationFn: () => {
      const nilai = parseInt(nilaiInput);
      if (isNaN(nilai) || nilai < 0 || nilai > 100) throw new Error('Nilai harus antara 0 – 100.');
      // inputNilai uses siswa_id per backend route: /guru/siswa/{id}/nilai
      return inputNilai(selectedNilai.siswa_id || selectedNilai.siswa?.id, nilai);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guru-siswa-bimbingan'] });
      queryClient.invalidateQueries({ queryKey: ['guru-dashboard'] });
      setSelectedNilai(null);
      setErrorMsg('');
      setToast('Nilai akhir berhasil disimpan!');
    },
    onError: (err: any) => setErrorMsg(err?.response?.data?.message || err.message || 'Terjadi kesalahan.'),
  });

  // ── Computed stats ───────────────────────────────────────────────────────────
  const sudahDinilai = bimbingan.filter((b: any) => b.nilai_akhir !== null && b.nilai_akhir !== undefined).length;
  const belumDinilai = bimbingan.length - sudahDinilai;

  // ── Skeleton ─────────────────────────────────────────────────────────────────
  if (!isMounted || isLoading) {
    return (
      <div className="space-y-6 font-sans animate-pulse">
        <div className="h-8 w-48 rounded-xl bg-gray-100" />
        <div className="h-72 rounded-2xl bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Siswa Bimbingan</h1>
        <p className="text-sm text-gray-400 mt-0.5">Daftar siswa binaan dan manajemen nilai akhir magang.</p>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Siswa</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kelas</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tempat Magang (DUDI)</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nilai Akhir</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bimbingan.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                        <ClipboardList className="w-6 h-6 text-gray-200" />
                      </div>
                      <p className="text-sm text-gray-400">Belum ada siswa bimbingan.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                bimbingan.map((b: any) => {
                  const perusahaan = b.tempatMagang?.nama_perusahaan || b.tempat_magang?.nama_perusahaan || '-';
                  const alamat = b.tempatMagang?.alamat || b.tempat_magang?.alamat || '';
                  const statusPenempatan = b.status_pengesahan || (b.siswa?.status_magang === 'lulus' ? 'lulus_magang' : 'aktif');

                  return (
                    <tr key={b.id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Siswa */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800 text-sm">{b.siswa?.nama_lengkap}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{b.siswa?.nis}</p>
                      </td>
                      {/* Kelas */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-700 font-medium">{b.siswa?.kelas || '-'}</span>
                      </td>
                      {/* Tempat Magang */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800 text-sm">{perusahaan}</p>
                        {alamat && <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{alamat}</p>}
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge status={statusPenempatan} />
                      </td>
                      {/* Nilai Akhir */}
                      <td className="px-5 py-4">
                        <NilaiBadge nilai={b.nilai_akhir ?? null} />
                      </td>
                      {/* Aksi */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => {
                            setSelectedNilai(b);
                            setNilaiInput(b.nilai_akhir?.toString() ?? '');
                            setErrorMsg('');
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          {b.nilai_akhir !== null && b.nilai_akhir !== undefined ? 'Revisi Nilai' : 'Beri Nilai'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal: Penilaian Akhir Magang ───────────────────────────────────── */}
      <Modal
        isOpen={!!selectedNilai}
        onClose={() => { setSelectedNilai(null); setErrorMsg(''); }}
        title="Penilaian Akhir Magang"
        subtitle={`Input nilai evaluasi keseluruhan untuk ${selectedNilai?.siswa?.nama_lengkap ?? ''}`}
        icon={<Edit2 className="w-5 h-5" />}
      >
        {selectedNilai && (
          <div className="space-y-5">
            {/* Info siswa */}
            <div className="space-y-1.5 text-sm text-gray-500 border-b border-gray-100 pb-4">
              <p>
                <span>Tempat Magang: </span>
                <span className="font-semibold text-gray-800">
                  {selectedNilai.tempatMagang?.nama_perusahaan || selectedNilai.tempat_magang?.nama_perusahaan || '-'}
                </span>
              </p>
              <p>
                <span>Total Jurnal: </span>
                <span className="font-semibold text-emerald-600">
                  {selectedNilai.siswa?.jurnal?.filter((j: any) => j.status_verifikasi === 'disetujui').length ?? 0} Disetujui
                </span>
                {' '}
                <span>Kehadiran: </span>
                <span className="font-semibold text-emerald-600">
                  {(() => {
                    const absensi = selectedNilai.siswa?.absensi || [];
                    const hadir = absensi.filter((a: any) => a.status === 'hadir').length;
                    const total = absensi.length;
                    if (total === 0) return '0%';
                    return `${Math.round((hadir / total) * 100)}%`;
                  })()}
                </span>
              </p>
            </div>

            {/* Input nilai */}
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Nilai Akhir (Skala 0 – 100)
              </label>
              {errorMsg && (
                <p className="mb-2 text-xs text-rose-600 font-medium">{errorMsg}</p>
              )}
              <input
                type="number"
                min={0}
                max={100}
                value={nilaiInput}
                onChange={(e) => { setNilaiInput(e.target.value); setErrorMsg(''); }}
                placeholder="88"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-3xl font-extrabold text-center text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-1">
              <button
                onClick={() => { setSelectedNilai(null); setErrorMsg(''); }}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => nilaiMutation.mutate()}
                disabled={nilaiMutation.isPending || !nilaiInput}
                className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                {nilaiMutation.isPending ? 'Menyimpan...' : 'Simpan Nilai'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Toast ───────────────────────────────────────────────────────────── */}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}
