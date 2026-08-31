'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJurnalForGuru, validasiJurnal, validasiAbsensi } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { toast } from '@/lib/toast';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  FileText,
  Image as ImageIcon,
  X,
} from 'lucide-react';

// ─── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

// ─── Status Badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const s = (status || '').toLowerCase();
  if (s === 'disetujui') return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <CheckCircle2 className="w-3 h-3" /> Disetujui
    </span>
  );
  if (s === 'perlu_revisi' || s === 'perlu revisi') return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
      <AlertTriangle className="w-3 h-3" /> Perlu Revisi
    </span>
  );
  if (s === 'ditolak') return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
      <XCircle className="w-3 h-3" /> Ditolak
    </span>
  );
  // menunggu / default
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-600 border border-orange-200">
      <Clock className="w-3 h-3" /> Menunggu
    </span>
  );
}

// ─── Absensi Status Badge ───────────────────────────────────────────────────────
function AbsensiBadge({ status }: { status: string }) {
  const s = (status || '').toLowerCase();
  const map: Record<string, string> = {
    hadir: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    sakit: 'bg-blue-50 text-blue-700 border-blue-200',
    izin: 'bg-amber-50 text-amber-700 border-amber-200',
    alfa: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  const cls = map[s] || 'bg-gray-50 text-gray-500 border-gray-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cls}`}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : '-'}
    </span>
  );
}

// ─── Foto Thumbnail ─────────────────────────────────────────────────────────────
function FotoThumbnail({ url }: { url?: string }) {
  if (!url) return (
    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
      <ImageIcon className="w-4 h-4 text-gray-300" />
    </div>
  );
  return (
    <img
      src={url}
      alt="Foto bukti"
      className="w-9 h-9 rounded-lg object-cover border border-gray-200 cursor-pointer hover:opacity-80 transition"
    />
  );
}

// ─── Validation Modal ───────────────────────────────────────────────────────────
function ValidationModal({
  isOpen,
  onClose,
  children,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function GuruJurnalPage() {
  const user = getAuthUser();
  const queryClient = useQueryClient();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'jurnal' | 'absensi'>('jurnal');
  const [selectedJurnal, setSelectedJurnal] = useState<any>(null);
  const [selectedAbsensi, setSelectedAbsensi] = useState<any>(null);
  const [statusJurnal, setStatusJurnal] = useState<'disetujui' | 'perlu_revisi'>('disetujui');
  const [catatanGuru, setCatatanGuru] = useState('');
  const [catatanAbsensi, setCatatanAbsensi] = useState('');

  useEffect(() => { setIsMounted(true); }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['guru-jurnal', user?.guru_id],
    queryFn: () => getJurnalForGuru(user?.guru_id || user?.id || 0),
    enabled: isMounted && !!(user?.guru_id || user?.id),
  });

  const validasiJurnalMutation = useMutation({
    mutationFn: () => validasiJurnal(selectedJurnal.id, statusJurnal, catatanGuru),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guru-jurnal'] });
      queryClient.invalidateQueries({ queryKey: ['guru-dashboard'] });
      setSelectedJurnal(null);
      setCatatanGuru('');
      toast.success(statusJurnal === 'disetujui' ? 'Jurnal berhasil disetujui.' : `Jurnal diperbarui: ${statusJurnal}.`);
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || err.message || 'Gagal memvalidasi jurnal.'),
  });

  const validasiAbsensiMutation = useMutation({
    mutationFn: (status: string) => validasiAbsensi(selectedAbsensi.id, status, catatanAbsensi),
    onSuccess: (_: any, status: string) => {
      queryClient.invalidateQueries({ queryKey: ['guru-jurnal'] });
      queryClient.invalidateQueries({ queryKey: ['guru-dashboard'] });
      setSelectedAbsensi(null);
      setCatatanAbsensi('');
      toast.success(status === 'disetujui' ? 'Absensi berhasil disetujui.' : 'Absensi berhasil ditolak.');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || err.message || 'Gagal memvalidasi absensi.'),
  });

  const { jurnal = [], absensi = [] } = data || {};

  // ── Stat counts ────────────────────────────────────────────────────────────
  const jurnalMenunggu  = jurnal.filter((j: any) => j.status_verifikasi === 'menunggu').length;
  const jurnalDisetujui = jurnal.filter((j: any) => j.status_verifikasi === 'disetujui').length;
  const jurnalRevisi    = jurnal.filter((j: any) => j.status_verifikasi === 'perlu_revisi').length;

  const absensiMenunggu  = absensi.filter((a: any) => a.status_validasi_guru === 'menunggu').length;
  const absensiDisetujui = absensi.filter((a: any) => a.status_validasi_guru === 'disetujui').length;
  const absensiDitolak   = absensi.filter((a: any) => a.status_validasi_guru === 'ditolak').length;

  // ── Skeleton ────────────────────────────────────────────────────────────────
  if (!isMounted || isLoading) {
    return (
      <div className="space-y-6 font-sans animate-pulse">
        <div className="h-10 w-56 rounded-xl bg-gray-100" />
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => <div key={i} className="h-20 rounded-2xl bg-gray-100" />)}
        </div>
        <div className="h-80 rounded-2xl bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">

      {/* ── Tab Navigation ─────────────────────────────────────────────────── */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-0">
          {([
            { key: 'jurnal', label: 'Jurnal Kegiatan', count: jurnalMenunggu },
            { key: 'absensi', label: 'Absensi Siswa', count: absensiMenunggu },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`inline-flex items-center justify-center w-5 h-5 text-[10px] font-extrabold rounded-full ${
                  activeTab === tab.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Tab: Jurnal Kegiatan ────────────────────────────────────────────── */}
      {activeTab === 'jurnal' && (
        <div className="space-y-6">

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-gray-200 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Menunggu Validasi</p>
                <p className="text-2xl font-extrabold text-gray-900 leading-tight">{jurnalMenunggu}</p>
                <p className="text-[11px] text-gray-400">Perlu ditinjau</p>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-gray-200 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Jurnal Disetujui</p>
                <p className="text-2xl font-extrabold text-emerald-600 leading-tight">{jurnalDisetujui}</p>
                <p className="text-[11px] text-gray-400">Selesai</p>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-gray-200 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Perlu Revisi</p>
                <p className="text-2xl font-extrabold text-amber-600 leading-tight">{jurnalRevisi}</p>
                <p className="text-[11px] text-gray-400">Dikembalikan</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tanggal & Siswa</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kegiatan</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Foto</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {jurnal.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                        <FileText className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                        Tidak ada jurnal untuk divalidasi.
                      </td>
                    </tr>
                  ) : (
                    jurnal.map((j: any) => (
                      <tr key={j.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-800 text-sm">{j.siswa?.nama_lengkap}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {j.siswa?.penempatan?.tempatMagang?.nama_perusahaan || j.siswa?.tempatMagang?.nama_perusahaan || ''}
                          </p>
                          <p className="text-[11px] text-gray-400">Sen, {formatDate(j.tanggal)}</p>
                        </td>
                        <td className="px-5 py-4 max-w-xs">
                          <p className="text-sm text-gray-700 line-clamp-2">{j.uraian_kegiatan}</p>
                        </td>
                        <td className="px-5 py-4">
                          <FotoThumbnail url={j.foto_bukti} />
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={j.status_verifikasi} />
                        </td>
                        <td className="px-5 py-4">
                          {j.status_verifikasi === 'menunggu' ? (
                            <button
                              onClick={() => {
                                setSelectedJurnal(j);
                                setStatusJurnal('disetujui');
                                setCatatanGuru('');
                              }}
                              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                            >
                              Validasi
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedJurnal(j);
                                setStatusJurnal('disetujui');
                                setCatatanGuru('');
                              }}
                              className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs font-semibold hover:bg-gray-50 transition-colors"
                            >
                              Lihat Detail
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Absensi Siswa ──────────────────────────────────────────────── */}
      {activeTab === 'absensi' && (
        <div className="space-y-6">

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-gray-200 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Menunggu Validasi</p>
                <p className="text-2xl font-extrabold text-gray-900 leading-tight">{absensiMenunggu}</p>
                <p className="text-[11px] text-gray-400">Perlu ditinjau</p>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-gray-200 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Disetujui</p>
                <p className="text-2xl font-extrabold text-emerald-600 leading-tight">{absensiDisetujui}</p>
                <p className="text-[11px] text-gray-400">Terverifikasi</p>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-gray-200 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Ditolak</p>
                <p className="text-2xl font-extrabold text-rose-600 leading-tight">{absensiDitolak}</p>
                <p className="text-[11px] text-gray-400">Tidak valid</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tanggal & Siswa</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status Kehadiran</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Foto Bukti Presensi</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status Validasi</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tombol Validasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {absensi.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                        <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                        Tidak ada absensi untuk divalidasi.
                      </td>
                    </tr>
                  ) : (
                    absensi.map((a: any) => (
                      <tr key={a.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-800 text-sm">{a.siswa?.nama_lengkap}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(a.tanggal)}</p>
                        </td>
                        <td className="px-5 py-4">
                          <AbsensiBadge status={a.status} />
                          <p className="text-[11px] text-gray-400 mt-1 font-mono">
                            {a.jam_masuk || '--:--'} → {a.jam_pulang || '--:--'}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <FotoThumbnail url={a.foto_masuk} />
                            <FotoThumbnail url={a.foto_pulang} />
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={a.status_validasi_guru} />
                        </td>
                        <td className="px-5 py-4">
                          {a.status_validasi_guru === 'menunggu' && (
                            <button
                              onClick={() => { setSelectedAbsensi(a); setCatatanAbsensi(''); }}
                              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                            >
                              Validasi
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Validasi Jurnal ─────────────────────────────────────────────── */}
      <ValidationModal
        isOpen={!!selectedJurnal}
        onClose={() => setSelectedJurnal(null)}
        title="Validasi Jurnal Kegiatan"
      >
        {selectedJurnal && (
          <div className="space-y-5">
            {/* Detail jurnal */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="text-gray-400 font-medium w-20 shrink-0">Siswa</span>
                <span className="font-semibold text-gray-800">{selectedJurnal.siswa?.nama_lengkap}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 font-medium w-20 shrink-0">Tanggal</span>
                <span className="text-gray-700">{formatDate(selectedJurnal.tanggal)}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 font-medium w-20 shrink-0">Kegiatan</span>
                <span className="text-gray-700 leading-relaxed">{selectedJurnal.uraian_kegiatan}</span>
              </div>
              {selectedJurnal.kendala && (
                <div className="flex gap-2">
                  <span className="text-gray-400 font-medium w-20 shrink-0">Kendala</span>
                  <span className="text-gray-700">{selectedJurnal.kendala}</span>
                </div>
              )}
            </div>

            {/* Pilihan keputusan */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Keputusan</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setStatusJurnal('disetujui')}
                  className={`p-4 rounded-xl border-2 text-sm font-semibold flex items-center gap-2 transition-all ${
                    statusJurnal === 'disetujui'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 text-gray-500 hover:border-emerald-300 hover:bg-emerald-50/50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" /> Setujui Jurnal
                </button>
                <button
                  onClick={() => setStatusJurnal('perlu_revisi')}
                  className={`p-4 rounded-xl border-2 text-sm font-semibold flex items-center gap-2 transition-all ${
                    statusJurnal === 'perlu_revisi'
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-gray-200 text-gray-500 hover:border-amber-300 hover:bg-amber-50/50'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" /> Minta Revisi
                </button>
              </div>
            </div>

            {/* Catatan */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Catatan Evaluasi <span className="font-normal normal-case text-gray-400">(opsional)</span>
              </label>
              <textarea
                value={catatanGuru}
                onChange={(e) => setCatatanGuru(e.target.value)}
                rows={3}
                placeholder="Berikan catatan atau arahan untuk siswa..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => setSelectedJurnal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => validasiJurnalMutation.mutate()}
                disabled={validasiJurnalMutation.isPending}
                className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-60"
              >
                {validasiJurnalMutation.isPending ? 'Menyimpan...' : 'Simpan Validasi'}
              </button>
            </div>
          </div>
        )}
      </ValidationModal>

      {/* ── Modal Validasi Absensi ────────────────────────────────────────────── */}
      <ValidationModal
        isOpen={!!selectedAbsensi}
        onClose={() => setSelectedAbsensi(null)}
        title="Validasi Absensi Siswa"
      >
        {selectedAbsensi && (
          <div className="space-y-5">
            {/* Detail absensi */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="text-gray-400 font-medium w-24 shrink-0">Siswa</span>
                <span className="font-semibold text-gray-800">{selectedAbsensi.siswa?.nama_lengkap}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 font-medium w-24 shrink-0">Tanggal</span>
                <span className="text-gray-700">{formatDate(selectedAbsensi.tanggal)}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 font-medium w-24 shrink-0">Status</span>
                <AbsensiBadge status={selectedAbsensi.status} />
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 font-medium w-24 shrink-0">Jam Masuk</span>
                <span className="text-gray-700 font-mono">{selectedAbsensi.jam_masuk || '-'}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 font-medium w-24 shrink-0">Jam Pulang</span>
                <span className="text-gray-700 font-mono">{selectedAbsensi.jam_pulang || '-'}</span>
              </div>
              {(selectedAbsensi.foto_masuk || selectedAbsensi.foto_pulang) && (
                <div className="flex gap-3 pt-1">
                  {selectedAbsensi.foto_masuk && (
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1">Foto Masuk</p>
                      <img src={selectedAbsensi.foto_masuk} alt="Foto masuk" className="w-20 h-20 rounded-lg object-cover border border-gray-200" />
                    </div>
                  )}
                  {selectedAbsensi.foto_pulang && (
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1">Foto Pulang</p>
                      <img src={selectedAbsensi.foto_pulang} alt="Foto pulang" className="w-20 h-20 rounded-lg object-cover border border-gray-200" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Catatan opsional */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Catatan <span className="font-normal normal-case text-gray-400">(opsional)</span>
              </label>
              <textarea
                value={catatanAbsensi}
                onChange={(e) => setCatatanAbsensi(e.target.value)}
                rows={2}
                placeholder="Catatan untuk siswa..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => setSelectedAbsensi(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => validasiAbsensiMutation.mutate('ditolak')}
                disabled={validasiAbsensiMutation.isPending}
                className="px-4 py-2 text-sm font-semibold text-rose-600 border border-rose-200 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors disabled:opacity-60 flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" /> Tolak
              </button>
              <button
                onClick={() => validasiAbsensiMutation.mutate('disetujui')}
                disabled={validasiAbsensiMutation.isPending}
                className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-60 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                {validasiAbsensiMutation.isPending ? 'Menyimpan...' : 'Setujui'}
              </button>
            </div>
          </div>
        )}
      </ValidationModal>
    </div>
  );
}
