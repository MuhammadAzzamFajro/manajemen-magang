/**
 * lib/db.ts
 * Semua fungsi data diambil dari Laravel REST API (MySQL backend).
 * Tidak ada lagi koneksi langsung ke Supabase.
 *
 * Base URL: http://localhost:8000/api (diatur via NEXT_PUBLIC_API_URL)
 */

import api from './api';

// ─── ADMIN: DASHBOARD ─────────────────────────────────────────────────────────

export const getAdminDashboardStats = async () => {
  return api.get('/admin/dashboard');
};

export const getDudiDistributionStats = async () => {
  const data = await api.get<any[]>('/admin/dudi');
  return (data || []).map((d: any) => ({
    id:              d.id,
    nama_perusahaan: d.nama_perusahaan,
    bidang_usaha:    d.bidang_usaha || 'Mitra DUDI',
    kuota:           d.kuota ?? 0,
    siswa_aktif:     d.penempatan_count ?? 0,
  }));
};

// ─── ADMIN: MONITORING ───────────────────────────────────────────────────────

export const getMonitoring = async (search = '', kelas = '') => {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (kelas)  params.set('kelas', kelas);
  const qs = params.toString();

  const res = await api.get<any>(`/admin/monitoring${qs ? `?${qs}` : ''}`);
  // Laravel paginator → { data: [...], total: ... }
  return Array.isArray(res) ? res : (res.data ?? []);
};

// ─── ADMIN: GURU ──────────────────────────────────────────────────────────────

export const getGurus = async (search = '') => {
  const qs = search ? `?search=${encodeURIComponent(search)}` : '';
  const data = await api.get<any[]>(`/admin/guru${qs}`);
  return (data || []).map((g: any) => ({
    ...g,
    email:             g.user?.email || g.email || '',
    jumlah_siswa_aktif: g.penempatan_count ?? 0,
  }));
};

export const createGuru = async (payload: {
  nip: string;
  nama_lengkap: string;
  jurusan_id?: number | null;
  email: string;
  password: string;
  status_akun?: string;
}) => {
  return api.post('/admin/guru', {
    ...payload,
    password: payload.password || 'password',
    status_akun: payload.status_akun || 'aktif',
  });
};

export const updateGuru = async (id: number, payload: any) => {
  return api.put(`/admin/guru/${id}`, payload);
};

export const deleteGuru = async (id: number) => {
  return api.delete(`/admin/guru/${id}`);
};

export const toggleGuruStatus = async (id: number, currentStatus: string) => {
  return api.patch(`/admin/guru/${id}/status`);
};

// ─── ADMIN: SISWA ─────────────────────────────────────────────────────────────

export const getSiswas = async (search = '', kelas = '') => {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (kelas)  params.set('kelas', kelas);
  const qs = params.toString();
  const data = await api.get<any[]>(`/admin/siswa${qs ? `?${qs}` : ''}`);
  return (data || []).map((s: any) => ({
    ...s,
    penempatan: s.penempatan ? [s.penempatan] : [],
  }));
};

export const createSiswa = async (payload: any) => {
  return api.post('/admin/siswa', payload);
};

export const updateSiswa = async (id: number, payload: any) => {
  return api.put(`/admin/siswa/${id}`, payload);
};

export const deleteSiswa = async (id: number) => {
  return api.delete(`/admin/siswa/${id}`);
};

export const plottingSiswa = async (id: number, payload: {
  tempat_magang_id: number;
  guru_id: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
}) => {
  return api.post(`/admin/siswa/${id}/plotting`, payload);
};

export const prosesPengajuanSiswa = async (pengajuanId: number, payload: {
  status: 'disetujui' | 'ditolak';
  guru_id?: number | null;
  catatan_penolakan?: string;
}) => {
  return api.post(`/admin/siswa/pengajuan/${pengajuanId}/proses`, payload);
};

// ─── ADMIN: DUDI (TEMPAT MAGANG) ─────────────────────────────────────────────

export const getDudis = async (search = '') => {
  const qs = search ? `?search=${encodeURIComponent(search)}` : '';
  return api.get<any[]>(`/admin/dudi${qs}`);
};

// Daftar DUDI terverifikasi & masih berkuota — dapat diakses semua role (admin/guru/siswa)
export const getDudisOptions = async () => {
  return api.get<any[]>('/dudi');
};

export const createDudi = async (payload: any) => {
  return api.post('/admin/dudi', payload);
};

export const updateDudi = async (id: number, payload: any) => {
  return api.put(`/admin/dudi/${id}`, payload);
};

export const deleteDudi = async (id: number) => {
  return api.delete(`/admin/dudi/${id}`);
};

export const toggleDudiVerifikasi = async (id: number, _currentStatus: string) => {
  return api.patch(`/admin/dudi/${id}/verifikasi`);
};

// ─── ADMIN: PENEMPATAN ────────────────────────────────────────────────────────

export const getPenempatans = async () => {
  return api.get<any[]>('/admin/penempatan');
};

export const createPenempatan = async (payload: any) => {
  return api.post('/admin/penempatan', payload);
};

export const updatePenempatan = async (id: number, payload: any) => {
  return api.put(`/admin/penempatan/${id}`, payload);
};

export const sahkanPenempatan = async (id: number, _siswaId?: number) => {
  return api.patch(`/admin/penempatan/${id}/sahkan`);
};

export const batalkanPenempatan = async (id: number, _siswaId?: number, _tempatMagangId?: number) => {
  return api.patch(`/admin/penempatan/${id}/batalkan`);
};

// ─── ADMIN: SETTINGS & LOGS ──────────────────────────────────────────────────

export const getSettings = async () => {
  return api.get('/admin/settings');
};

export const updateSettings = async (payload: any) => {
  return api.put('/admin/settings', payload);
};

export const getActivityLogs = async (page = 1, perPage = 20, search = '', level = '') => {
  const params = new URLSearchParams();
  params.set('page', page.toString());
  params.set('per_page', perPage.toString());
  if (search) params.set('search', search);
  if (level)  params.set('level', level);
  const qs = params.toString();
  return api.get<any>(`/admin/logs${qs ? `?${qs}` : ''}`);
};

// ─── GURU: DASHBOARD ─────────────────────────────────────────────────────────

export const getGuruDashboard = async (_guruId?: number) => {
  return api.get('/guru/dashboard');
};

export const getJurnalForGuru = async (_guruId?: number) => {
  const [jurnal, absensi] = await Promise.all([
    api.get<any[]>('/guru/jurnal'),
    api.get<any[]>('/guru/absensi'),
  ]);
  return { jurnal, absensi };
};

export const validasiJurnal = async (id: number, status: string, catatan?: string) => {
  return api.patch(`/guru/jurnal/${id}/validasi`, { status_verifikasi: status, catatan });
};

export const validasiAbsensi = async (id: number, status: string, catatan?: string) => {
  return api.patch(`/guru/absensi/${id}/validasi`, { status_validasi_guru: status, catatan });
};

export const getSiswaBimbingan = async (_guruId?: number) => {
  return api.get('/guru/siswa');
};

export const inputNilai = async (penempatanId: number, nilai: number) => {
  return api.post(`/guru/siswa/${penempatanId}/nilai`, { nilai_akhir: nilai });
};

// ─── SISWA: DASHBOARD ─────────────────────────────────────────────────────────

export const getSiswaDashboard = async (_siswaId?: number) => {
  return api.get('/siswa/dashboard');
};

// ─── SISWA: PENGAJUAN ────────────────────────────────────────────────────────

export const getPengajuanSiswa = async (_siswaId?: number) => {
  return api.get('/siswa/pengajuan');
};

export const submitPengajuan = async (payload: any) => {
  return api.post('/siswa/pengajuan', payload);
};

// ─── SISWA: ABSENSI ──────────────────────────────────────────────────────────

export const getAbsensiSiswa = async (_siswaId?: number) => {
  return api.get('/siswa/absensi');
};

export const submitAbsensi = async (payload: any) => {
  if (payload instanceof FormData) {
    return api.postForm('/siswa/absensi', payload);
  }
  if (payload.foto) {
    const fd = new FormData();
    Object.keys(payload).forEach((key) => {
      if (payload[key] !== undefined && payload[key] !== null) {
        fd.append(key, payload[key]);
      }
    });
    return api.postForm('/siswa/absensi', fd);
  }
  return api.post('/siswa/absensi', payload);
};

// ─── SISWA: JURNAL ────────────────────────────────────────────────────────────

export const getJurnalSiswa = async (_siswaId?: number) => {
  return api.get('/siswa/jurnal');
};

export const createJurnal = async (payload: any) => {
  if (payload instanceof FormData) {
    return api.postForm('/siswa/jurnal', payload);
  }
  if (payload.foto_bukti) {
    const fd = new FormData();
    Object.keys(payload).forEach((key) => {
      if (payload[key] !== undefined && payload[key] !== null) {
        fd.append(key, payload[key]);
      }
    });
    return api.postForm('/siswa/jurnal', fd);
  }
  return api.post('/siswa/jurnal', payload);
};

export const updateJurnal = async (id: number, payload: any) => {
  if (payload instanceof FormData) {
    return api.putForm(`/siswa/jurnal/${id}`, payload);
  }
  if (payload.foto_bukti) {
    const fd = new FormData();
    Object.keys(payload).forEach((key) => {
      if (payload[key] !== undefined && payload[key] !== null) {
        fd.append(key, payload[key]);
      }
    });
    return api.putForm(`/siswa/jurnal/${id}`, fd);
  }
  return api.put(`/siswa/jurnal/${id}`, payload);
};

export const deleteJurnal = async (id: number) => {
  return api.delete(`/siswa/jurnal/${id}`);
};

// ─── PUBLIC: LANDING STATS ───────────────────────────────────────────────────

export const getLandingStats = async () => {
  return api.get('/public/landing-stats');
};

// ─── Legacy: getProfile (tidak lagi query DB langsung) ───────────────────────
// Profil sudah tersimpan saat login. Fungsi ini jaga kompatibilitas.
export const getProfile = async (_userId?: string) => {
  const { getAuthUser } = await import('./auth');
  return getAuthUser();
};

// ─── GURU: KUNJUNGAN LAPANGAN ─────────────────────────────────────────────────

export const getKunjunganForGuru = async (_guruId?: number) => {
  return api.get('/guru/kunjungan');
};

export const createKunjungan = async (payload: {
  tempat_magang_id: number;
  tanggal_kunjungan: string;
  catatan_evaluasi?: string;
  foto_dokumentasi?: File | null;
}) => {
  const fd = new FormData();
  fd.append('tempat_magang_id', String(payload.tempat_magang_id));
  fd.append('tanggal_kunjungan', payload.tanggal_kunjungan);
  if (payload.catatan_evaluasi) fd.append('catatan_evaluasi', payload.catatan_evaluasi);
  if (payload.foto_dokumentasi) fd.append('foto_dokumentasi', payload.foto_dokumentasi);
  return api.postForm('/guru/kunjungan', fd);
};

export const updateKunjungan = async (id: number, payload: {
  tempat_magang_id: number;
  tanggal_kunjungan: string;
  catatan_evaluasi?: string;
  foto_dokumentasi?: File | null;
}) => {
  const fd = new FormData();
  fd.append('tempat_magang_id', String(payload.tempat_magang_id));
  fd.append('tanggal_kunjungan', payload.tanggal_kunjungan);
  if (payload.catatan_evaluasi) fd.append('catatan_evaluasi', payload.catatan_evaluasi);
  if (payload.foto_dokumentasi) fd.append('foto_dokumentasi', payload.foto_dokumentasi);
  return api.putForm(`/guru/kunjungan/${id}`, fd);
};

export const deleteKunjungan = async (id: number) => {
  return api.delete(`/guru/kunjungan/${id}`);
};

// ─── ADMIN: JURUSAN & KELAS ─────────────────────────────────────────────────
// Get bisa diakses semua role (untuk dropdown form)
export const getJurusans = async () => {
  return api.get<any[]>('/jurusan');
};

export const getKelases = async () => {
  return api.get<any[]>('/kelas');
};

export const createJurusan = async (payload: { nama: string }) => {
  return api.post('/admin/jurusan', payload);
};

export const updateJurusan = async (id: number, payload: { nama: string }) => {
  return api.put(`/admin/jurusan/${id}`, payload);
};

export const deleteJurusan = async (id: number) => {
  return api.delete(`/admin/jurusan/${id}`);
};

export const createKelas = async (payload: { nama: string; jurusan_id?: number | null }) => {
  return api.post('/admin/kelas', payload);
};

export const updateKelas = async (id: number, payload: { nama: string; jurusan_id?: number | null }) => {
  return api.put(`/admin/kelas/${id}`, payload);
};

export const deleteKelas = async (id: number) => {
  return api.delete(`/admin/kelas/${id}`);
};

