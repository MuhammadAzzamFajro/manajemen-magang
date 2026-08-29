'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAbsensiSiswa, submitAbsensi } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Camera,
  UploadCloud,
  ImageIcon,
  X,
  LogIn,
  LogOut as LogOutIcon,
  RotateCw,
  Video,
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
function AttendanceStatusBadge({ status }: { status: string }) {
  const s = (status || '').toLowerCase();
  if (s === 'hadir') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3 h-3" /> Hadir
      </span>
    );
  }
  if (s === 'sakit') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        Sakit
      </span>
    );
  }
  if (s === 'izin') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        Izin
      </span>
    );
  }
  if (s === 'alfa') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <XCircle className="w-3 h-3" /> Alfa
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-500 border border-gray-200">
      -
    </span>
  );
}

// ─── Form Modal Component ───────────────────────────────────────────────────────
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
            <Clock className="w-5 h-5" />
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
export default function SiswaAbsensiPage() {
  const user = getAuthUser();
  const queryClient = useQueryClient();
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<string | null>(null);

  // Form states
  const [presensiType, setPresensiType] = useState<'masuk' | 'pulang' | 'izin_sakit'>('masuk');
  const [statusKehadiran, setStatusKehadiran] = useState<'hadir' | 'sakit' | 'izin'>('hadir');
  const [jamPresensi, setJamPresensi] = useState('');
  const [tanggalPresensi, setTanggalPresensi] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Live Camera states & refs
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const now = new Date();
    setTanggalPresensi(now.toISOString().split('T')[0]);
    setJamPresensi(now.toTimeString().slice(0, 5));
  }, []);

  const siswaId = user?.siswa_id || user?.id || 0;
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Queries
  const { data: absensiList = [], isLoading } = useQuery({
    queryKey: ['siswa-absensi', siswaId],
    queryFn: () => getAbsensiSiswa(siswaId),
    enabled: isMounted && !!siswaId,
  });

  // Find today's record
  const todayAbsensi = useMemo(() => {
    return absensiList.find((a: any) => a.tanggal === todayStr);
  }, [absensiList, todayStr]);

  // Camera helpers
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch (err: any) {
      setCameraError('Kamera tidak dapat diakses atau izin ditolak. Silakan upload file foto.');
      stopCamera();
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `selfie_${Date.now()}.jpg`, { type: 'image/jpeg' });
          setFotoFile(file);
          setFotoPreview(dataUrl);
          stopCamera();
        }
      }, 'image/jpeg', 0.85);
    }
  };

  // Mutations
  const submitMutation = useMutation({
    mutationFn: () => {
      const payload: any = {
        type: presensiType,
        status: statusKehadiran,
        foto: fotoFile,
      };
      return submitAbsensi(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa-absensi'] });
      queryClient.invalidateQueries({ queryKey: ['siswa-dashboard'] });
      resetForm();
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message || err.message || 'Gagal menyimpan presensi.');
    },
  });

  const resetForm = () => {
    stopCamera();
    setIsModalOpen(false);
    setStatusKehadiran('hadir');
    const now = new Date();
    setJamPresensi(now.toTimeString().slice(0, 5));
    setFotoFile(null);
    setFotoPreview(null);
    setErrorMsg('');
    setCameraError(null);
  };

  const openClockInModal = () => {
    setErrorMsg('');
    setPresensiType('masuk');
    setStatusKehadiran('hadir');
    setIsModalOpen(true);
  };

  const openClockOutModal = () => {
    setErrorMsg('');
    setPresensiType('pulang');
    setStatusKehadiran('hadir');
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoFile(file);
      setFotoPreview(URL.createObjectURL(file));
      stopCamera();
    }
  };

  // Skeleton Loader for Hydration Safety
  if (!isMounted || isLoading) {
    return (
      <div className="space-y-8 font-sans animate-pulse">
        <div className="h-8 w-48 bg-gray-100 rounded-xl" />
        <div className="h-28 bg-gray-100 rounded-2xl" />
        <div className="h-80 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  // Today's Status Text
  const getTodayStatusText = () => {
    if (!todayAbsensi) return 'Belum Absen Masuk';
    if (todayAbsensi.status === 'sakit') return 'Sakit (Surat Dokter)';
    if (todayAbsensi.status === 'izin') return 'Izin';
    if (todayAbsensi.jam_masuk && !todayAbsensi.jam_pulang) {
      return `Sudah Absen Masuk: ${todayAbsensi.jam_masuk.slice(0, 5)}`;
    }
    if (todayAbsensi.jam_masuk && todayAbsensi.jam_pulang) {
      return `Hadir (Masuk: ${todayAbsensi.jam_masuk.slice(0, 5)} • Pulang: ${todayAbsensi.jam_pulang.slice(0, 5)})`;
    }
    return 'Belum Absen';
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Absensi</h1>
      </div>

      {/* Top Status Card: Status Kehadiran Hari Ini */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-base leading-tight">
              Status Kehadiran Hari Ini
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{getTodayStatusText()}</p>
          </div>
        </div>

        {/* Action Buttons: Clock In & Clock Out */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={openClockInModal}
            disabled={!!todayAbsensi?.jam_masuk}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-transparent text-white font-bold text-xs shadow-xs inline-flex items-center gap-1.5 transition-all"
          >
            <LogIn className="w-4 h-4" /> Clock In
          </button>
          <button
            onClick={openClockOutModal}
            disabled={!todayAbsensi?.jam_masuk || !!todayAbsensi?.jam_pulang}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-transparent text-white font-bold text-xs shadow-xs inline-flex items-center gap-1.5 transition-all"
          >
            <LogOutIcon className="w-4 h-4" /> Clock Out
          </button>
        </div>
      </div>

      {/* Table Card: RIWAYAT BULAN INI */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            RIWAYAT BULAN INI
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  TANGGAL
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  MASUK
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  PULANG
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  FOTO
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {absensiList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                    <CalendarCheck className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                    Belum ada riwayat presensi.
                  </td>
                </tr>
              ) : (
                absensiList.map((a: any) => (
                  <tr key={a.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4 font-semibold text-gray-800 text-sm">
                      {formatIndonesianDateShort(a.tanggal)}
                    </td>
                    <td className="px-5 py-4">
                      <AttendanceStatusBadge status={a.status} />
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-gray-600">
                      {a.jam_masuk ? a.jam_masuk.slice(0, 5) : '-'}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-gray-600">
                      {a.jam_pulang ? a.jam_pulang.slice(0, 5) : '-'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {a.foto_masuk && (
                          <button
                            onClick={() => setSelectedPhotoModal(a.foto_masuk)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <ImageIcon className="w-3 h-3" /> Foto Masuk
                          </button>
                        )}
                        {a.foto_pulang && (
                          <button
                            onClick={() => setSelectedPhotoModal(a.foto_pulang)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <ImageIcon className="w-3 h-3" /> Foto Pulang
                          </button>
                        )}
                        {!a.foto_masuk && !a.foto_pulang && (
                          <span className="text-gray-300 text-xs italic">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal: Form Presensi Harian Siswa */}
      <FormModal
        isOpen={isModalOpen}
        onClose={resetForm}
        title="Form Presensi Harian"
        subtitle="Catat kehadiran dan lampirkan bukti foto presensi."
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

          {/* Segmented Status Tabs (Hadir, Sakit, Izin) */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              STATUS KEHADIRAN
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['hadir', 'sakit', 'izin'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    setStatusKehadiran(st);
                    if (st === 'sakit' || st === 'izin') {
                      setPresensiType('izin_sakit');
                    } else if (presensiType === 'izin_sakit') {
                      setPresensiType('masuk');
                    }
                  }}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${
                    statusKehadiran === st
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-2xs'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Grid 2 Columns: Jam Presensi & Tanggal */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                JAM PRESENSI
              </label>
              <input
                type="time"
                value={jamPresensi}
                onChange={(e) => setJamPresensi(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                TANGGAL
              </label>
              <input
                type="date"
                value={tanggalPresensi}
                onChange={(e) => setTanggalPresensi(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Photo Bukti Upload / Live Camera Area */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              FOTO BUKTI PRESENSI (SELFIE / LOKASI)
            </label>

            {cameraError && (
              <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200 p-2 rounded-lg mb-2 font-medium">
                {cameraError}
              </p>
            )}

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {fotoPreview ? (
              <div className="flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                <img
                  src={fotoPreview}
                  alt="Preview Selfie"
                  className="w-32 h-32 object-cover rounded-xl border border-gray-200 shadow-xs"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Camera className="w-3.5 h-3.5" /> Ambil Ulang (Kamera)
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <UploadCloud className="w-3.5 h-3.5" /> Upload File
                  </button>
                </div>
              </div>
            ) : isCameraActive ? (
              <div className="flex flex-col items-center gap-3 p-3 rounded-xl border-2 border-blue-400 bg-black text-white">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-52 object-cover rounded-lg bg-gray-900"
                />
                <div className="flex items-center gap-3 w-full justify-center">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition shadow-md"
                  >
                    <Camera className="w-4 h-4" /> Jepret Foto Selfie
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-3 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-semibold transition"
                  >
                    Batal Kamera
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={startCamera}
                  className="p-4 rounded-xl border-2 border-dashed border-blue-200 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50 text-blue-700 flex flex-col items-center justify-center gap-2 transition group cursor-pointer"
                >
                  <Camera className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-center">Buka Kamera Web</span>
                  <span className="text-[10px] text-blue-400">Foto Selfie Langsung</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-400 bg-gray-50/50 hover:bg-gray-100 text-gray-600 flex flex-col items-center justify-center gap-2 transition group cursor-pointer"
                >
                  <UploadCloud className="w-6 h-6 text-gray-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-center">Upload File Foto</span>
                  <span className="text-[10px] text-gray-400">Pilih dari Galeri</span>
                </button>
              </div>
            )}
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
              disabled={submitMutation.isPending}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition disabled:opacity-50"
            >
              {submitMutation.isPending ? 'Mengirim...' : 'Kirim Presensi'}
            </button>
          </div>
        </form>
      </FormModal>

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
              alt="Foto Presensi"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
