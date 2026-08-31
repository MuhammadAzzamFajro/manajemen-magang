<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

/**
 * Metadata & component definitions OpenAPI untuk SIMMAS.
 * Anotasi pada kelas ini dibaca otomatis oleh L5-Swagger.
 * Kelas dibuat autoloadable (PSR-4: App\OpenApi\Metadata -> app/OpenApi/Metadata.php).
 */


#[OA\Info(
    version: '1.0.0',
    title: 'SIMMAS API',
    description: 'Sistem Informasi Manajemen Magang Siswa (SIMMAS). REST API dengan autentikasi Sanctum. Token didapat dari endpoint `POST /api/login`. Semua endpoint selain `login` dan `public/*` memerlukan header `Authorization: Bearer <token>`.',
)]
#[OA\Tag(name: 'Autentikasi', description: 'Login, logout, dan profil pengguna saat ini.')]
#[OA\Tag(name: 'Public', description: 'Endpoint publik tanpa autentikasi.')]
#[OA\Tag(name: 'Admin', description: 'Manajemen data oleh Admin.')]
#[OA\Tag(name: 'Guru', description: 'Fitur untuk role Guru Pembimbing.')]
#[OA\Tag(name: 'Siswa', description: 'Fitur untuk role Siswa Magang.')]
#[OA\Server(url: 'http://localhost:8000', description: 'Server backend SIMMAS (Laravel)')]
#[OA\SecurityScheme(
    securityScheme: 'sanctum',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'Sanctum',
    description: 'Masukkan token dari endpoint login. Cukup token-nya saja, tanpa kata "Bearer" (Swagger akan menambahkannya otomatis).',
)]
#[OA\Schema(
    schema: 'LoginRequest',
    required: ['email', 'password'],
    properties: [
        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'siswa@simmas.sch.id'),
        new OA\Property(property: 'password', type: 'string', format: 'password', example: 'password'),
    ],
)]
#[OA\Schema(
    schema: 'LoginResponse',
    description: 'Payload berhasil login.',
    properties: [
        new OA\Property(property: 'token', type: 'string', example: '1|xxxxxxxxxxxxxxxxxxxx'),
        new OA\Property(property: 'user', ref: '#/components/schemas/User'),
    ],
)]
#[OA\Schema(
    schema: 'User',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'name', type: 'string'),
        new OA\Property(property: 'email', type: 'string', format: 'email'),
        new OA\Property(property: 'role', type: 'string', enum: ['admin', 'guru', 'siswa'], nullable: true),
        new OA\Property(property: 'profile', ref: '#/components/schemas/Profile', nullable: true),
        new OA\Property(property: 'guru', ref: '#/components/schemas/Guru', nullable: true),
        new OA\Property(property: 'siswa', ref: '#/components/schemas/Siswa', nullable: true),
    ],
)]
#[OA\Schema(
    schema: 'ApiResponse',
    description: 'Pembungkus standar respon JSON.',
    properties: [
        new OA\Property(property: 'status', type: 'boolean', example: true),
        new OA\Property(property: 'message', type: 'string', example: 'Berhasil.'),
        new OA\Property(property: 'data', description: 'Payload utama (isi bervariasi per endpoint).'),
    ],
)]
#[OA\Schema(
    schema: 'Profile',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'user_id', type: 'integer'),
        new OA\Property(property: 'nama', type: 'string'),
        new OA\Property(property: 'email', type: 'string', format: 'email'),
        new OA\Property(property: 'role', type: 'string', enum: ['admin', 'guru', 'siswa']),
        new OA\Property(property: 'avatar', type: 'string', nullable: true),
    ],
)]
#[OA\Schema(
    schema: 'Guru',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'user_id', type: 'integer', nullable: true),
        new OA\Property(property: 'nip', type: 'string'),
        new OA\Property(property: 'nama_lengkap', type: 'string'),
        new OA\Property(property: 'jurusan', type: 'string', nullable: true),
        new OA\Property(property: 'status_akun', type: 'string', enum: ['aktif', 'nonaktif']),
        new OA\Property(property: 'penempatan_count', type: 'integer', nullable: true),
    ],
)]
#[OA\Schema(
    schema: 'Siswa',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'user_id', type: 'integer', nullable: true),
        new OA\Property(property: 'nis', type: 'string'),
        new OA\Property(property: 'nama_lengkap', type: 'string'),
        new OA\Property(property: 'kelas', type: 'string'),
        new OA\Property(property: 'email_kontak', type: 'string', format: 'email', nullable: true),
        new OA\Property(property: 'status_magang', type: 'string', enum: ['belum_magang', 'pengajuan', 'sedang_magang', 'lulus']),
    ],
)]
#[OA\Schema(
    schema: 'TempatMagang',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'nama_perusahaan', type: 'string'),
        new OA\Property(property: 'bidang_usaha', type: 'string'),
        new OA\Property(property: 'nama_pic', type: 'string'),
        new OA\Property(property: 'kontak_pic', type: 'string'),
        new OA\Property(property: 'kuota', type: 'integer'),
        new OA\Property(property: 'sisa_kuota', type: 'integer'),
        new OA\Property(property: 'alamat', type: 'string'),
        new OA\Property(property: 'status_verifikasi', type: 'string', enum: ['terverifikasi', 'belum_diverifikasi']),
    ],
)]
#[OA\Schema(
    schema: 'PenempatanMagang',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'siswa_id', type: 'integer'),
        new OA\Property(property: 'tempat_magang_id', type: 'integer'),
        new OA\Property(property: 'guru_id', type: 'integer'),
        new OA\Property(property: 'tanggal_mulai', type: 'string', format: 'date'),
        new OA\Property(property: 'tanggal_selesai', type: 'string', format: 'date'),
        new OA\Property(property: 'nilai_akhir', type: 'integer', nullable: true),
        new OA\Property(property: 'status_pengesahan', type: 'string', enum: ['belum_disahkan', 'disahkan', 'lulus_magang']),
    ],
)]
#[OA\Schema(
    schema: 'PengajuanMagang',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'siswa_id', type: 'integer'),
        new OA\Property(property: 'tempat_magang_id', type: 'integer'),
        new OA\Property(property: 'posisi_diminati', type: 'string'),
        new OA\Property(property: 'tanggal_mulai_usulan', type: 'string', format: 'date'),
        new OA\Property(property: 'tanggal_selesai_usulan', type: 'string', format: 'date'),
        new OA\Property(property: 'status', type: 'string', enum: ['menunggu', 'disetujui', 'ditolak']),
        new OA\Property(property: 'catatan_penolakan', type: 'string', nullable: true),
    ],
)]
#[OA\Schema(
    schema: 'Absensi',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'siswa_id', type: 'integer'),
        new OA\Property(property: 'tanggal', type: 'string', format: 'date', example: '2026-08-30'),
        new OA\Property(property: 'status', type: 'string', enum: ['hadir', 'sakit', 'izin', 'alfa']),
        new OA\Property(property: 'jam_masuk', type: 'string', nullable: true),
        new OA\Property(property: 'jam_pulang', type: 'string', nullable: true),
        new OA\Property(property: 'foto_masuk', type: 'string', nullable: true),
        new OA\Property(property: 'foto_pulang', type: 'string', nullable: true),
        new OA\Property(property: 'status_validasi_guru', type: 'string', enum: ['menunggu', 'disetujui', 'ditolak']),
        new OA\Property(property: 'catatan_guru', type: 'string', nullable: true),
    ],
)]
#[OA\Schema(
    schema: 'JurnalHarian',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'siswa_id', type: 'integer'),
        new OA\Property(property: 'tanggal', type: 'string', format: 'date', example: '2026-08-30'),
        new OA\Property(property: 'uraian_kegiatan', type: 'string'),
        new OA\Property(property: 'kendala', type: 'string', nullable: true),
        new OA\Property(property: 'solusi', type: 'string', nullable: true),
        new OA\Property(property: 'foto_bukti', type: 'string', nullable: true),
        new OA\Property(property: 'status_verifikasi', type: 'string', enum: ['menunggu', 'disetujui', 'perlu_revisi']),
        new OA\Property(property: 'catatan_guru', type: 'string', nullable: true),
    ],
)]
#[OA\Schema(
    schema: 'Kunjungan',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'guru_id', type: 'integer'),
        new OA\Property(property: 'tempat_magang_id', type: 'integer'),
        new OA\Property(property: 'tanggal_kunjungan', type: 'string', format: 'date'),
        new OA\Property(property: 'catatan_evaluasi', type: 'string', nullable: true),
        new OA\Property(property: 'foto_dokumentasi', type: 'string', nullable: true),
    ],
)]
#[OA\Schema(
    schema: 'ActivityLog',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'actor_email', type: 'string', nullable: true),
        new OA\Property(property: 'actor_role', type: 'string', nullable: true),
        new OA\Property(property: 'action_type', type: 'string'),
        new OA\Property(property: 'level', type: 'string', enum: ['info', 'warn', 'error']),
        new OA\Property(property: 'ip_address', type: 'string', nullable: true),
        new OA\Property(property: 'metadata', type: 'object', nullable: true),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
    ],
)]
class Metadata
{
}