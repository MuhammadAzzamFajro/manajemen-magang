export type Role = 'admin' | 'guru' | 'siswa';

export interface Profile {
  id: number;
  user_id: number;
  nama: string;
  email: string;
  role: Role;
  avatar?: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role?: Role;
  profile?: Profile;
  guru?: Guru;
  siswa?: Siswa;
  avatar?: string | null;
}

export interface Guru {
  id: number;
  user_id?: number;
  nip: string;
  nama_lengkap: string;
  jurusan?: string;
  email?: string;
  status_akun: 'aktif' | 'nonaktif';
  penempatan_count?: number;
  jumlah_siswa_aktif?: number;
  user?: User;
}

export interface Siswa {
  id: number;
  user_id?: number;
  nis: string;
  nama_lengkap: string;
  kelas: string;
  email_kontak?: string;
  status_magang: 'belum_magang' | 'pengajuan' | 'sedang_magang' | 'lulus';
  penempatan?: PenempatanMagang;
  user?: User;
  total_absensi?: number;
  total_hadir?: number;
  total_jurnal?: number;
  jurnal_disetujui?: number;
}

export interface TempatMagang {
  id: number;
  nama_perusahaan: string;
  bidang_usaha: string;
  nama_pic: string;
  kontak_pic: string;
  kuota: number;
  sisa_kuota: number;
  alamat: string;
  status_verifikasi: 'terverifikasi' | 'belum_diverifikasi';
  penempatan_count?: number;
}

export interface PenempatanMagang {
  id: number;
  siswa_id: number;
  tempat_magang_id: number;
  guru_id: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  nilai_akhir?: number | null;
  status_pengesahan: 'belum_disahkan' | 'disahkan' | 'lulus_magang';
  siswa?: Siswa;
  tempat_magang?: TempatMagang;
  tempatMagang?: TempatMagang;
  guru?: Guru;
}

export interface PengajuanMagang {
  id: number;
  siswa_id: number;
  tempat_magang_id: number;
  posisi_diminati: string;
  tanggal_mulai_usulan: string;
  tanggal_selesai_usulan: string;
  status: 'menunggu' | 'disetujui' | 'ditolak';
  catatan_penolakan?: string | null;
  siswa?: Siswa;
  tempat_magang?: TempatMagang;
  tempatMagang?: TempatMagang;
}

export interface Absensi {
  id: number;
  siswa_id: number;
  tanggal: string;
  status: 'hadir' | 'sakit' | 'izin' | 'alfa';
  jam_masuk?: string | null;
  jam_pulang?: string | null;
  foto_masuk?: string | null;
  foto_pulang?: string | null;
  status_validasi_guru: 'menunggu' | 'disetujui' | 'ditolak';
  catatan_guru?: string | null;
  siswa?: Siswa;
}

export interface JurnalHarian {
  id: number;
  siswa_id: number;
  tanggal: string;
  uraian_kegiatan: string;
  kendala?: string | null;
  solusi?: string | null;
  foto_bukti?: string | null;
  status_verifikasi: 'menunggu' | 'disetujui' | 'perlu_revisi';
  catatan_guru?: string | null;
  siswa?: Siswa;
}

export interface Kunjungan {
  id: number;
  guru_id: number;
  tempat_magang_id: number;
  tanggal_kunjungan: string;
  catatan_evaluasi?: string | null;
  foto_dokumentasi?: string | null;
  guru?: Guru;
  tempat_magang?: TempatMagang;
  tempatMagang?: TempatMagang;
}

export interface ActivityLog {
  id: number;
  actor_email?: string;
  actor_role?: string;
  action_type: string;
  level: 'info' | 'warn' | 'error';
  ip_address?: string;
  metadata?: any;
  created_at: string;
}
