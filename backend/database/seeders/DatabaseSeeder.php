<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Profile;
use App\Models\Guru;
use App\Models\Siswa;
use App\Models\TempatMagang;
use App\Models\PenempatanMagang;
use App\Models\JurnalHarian;
use App\Models\Absensi;
use App\Models\Kunjungan;
use App\Models\ActivityLog;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin Account
        $adminUser = User::updateOrCreate(
            ['email' => 'admin@simmas.sch.id'],
            [
                'name'     => 'Administrator Sekolah',
                'password' => Hash::make('password'),
            ]
        );

        Profile::updateOrCreate(
            ['user_id' => $adminUser->id],
            [
                'nama'  => 'Administrator Sekolah',
                'email' => 'admin@simmas.sch.id',
                'role'  => 'admin',
            ]
        );

        // 2. Guru Accounts
        $gurus = [
            ['nip' => '199003202015012004', 'nama' => 'Antigravity Andro', 'email' => 'guru@simmas.sch.id', 'jurusan' => 'Rekayasa Perangkat Lunak'],
            ['nip' => '198501152010011001', 'nama' => 'Drs. Budi Santoso, M.Pd', 'email' => 'budi.guru@simmas.sch.id', 'jurusan' => 'Teknik Komputer & Jaringan'],
            ['nip' => '198803202012022002', 'nama' => 'Siti Nurhaliza, S.ST', 'email' => 'siti.guru@simmas.sch.id', 'jurusan' => 'Rekayasa Perangkat Lunak'],
            ['nip' => '199005122015031003', 'nama' => 'Ahmad Fauzi, S.Kom', 'email' => 'ahmad.guru@simmas.sch.id', 'jurusan' => 'Multimedia'],
            ['nip' => '198207182008042004', 'nama' => 'Dewi Lestari, M.T', 'email' => 'dewi.guru@simmas.sch.id', 'jurusan' => 'Teknik Komputer & Jaringan'],
        ];

        $guruModels = [];
        foreach ($gurus as $g) {
            $user = User::updateOrCreate(
                ['email' => $g['email']],
                [
                    'name'     => $g['nama'],
                    'password' => Hash::make('password'),
                ]
            );

            Profile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'nama'  => $g['nama'],
                    'email' => $g['email'],
                    'role'  => 'guru',
                ]
            );

            $guruModels[] = Guru::updateOrCreate(
                ['nip' => $g['nip']],
                [
                    'user_id'      => $user->id,
                    'nama_lengkap' => $g['nama'],
                    'jurusan'      => $g['jurusan'],
                    'status_akun'  => 'aktif',
                ]
            );
        }

        // 3. Tempat Magang / DUDI
        $dudisData = [
            [
                'nama_perusahaan'   => 'PT. Universal Big Data',
                'bidang_usaha'      => 'Big Data & Cloud Infrastructure',
                'nama_pic'          => 'Budi Hermawan',
                'kontak_pic'        => '081234567890',
                'kuota'             => 5,
                'alamat'            => 'Jl. Surabaya, Sidoarjo',
                'status_verifikasi' => 'terverifikasi',
            ],
            [
                'nama_perusahaan'   => 'PT. Telkom Sidoarjo',
                'bidang_usaha'      => 'Telecommunication & Internet Service',
                'nama_pic'          => 'Anita Rahmawati',
                'kontak_pic'        => '082198765432',
                'kuota'             => 4,
                'alamat'            => 'Jl. A. Yani, Sidoarjo',
                'status_verifikasi' => 'terverifikasi',
            ],
            [
                'nama_perusahaan'   => 'PT Teknologi Nusantara Digital',
                'bidang_usaha'      => 'Software House & App Development',
                'nama_pic'          => 'Bambang Sukmono',
                'kontak_pic'        => '081399887766',
                'kuota'             => 6,
                'alamat'            => 'Jl. Sukarno Hatta No. 12, Malang',
                'status_verifikasi' => 'terverifikasi',
            ],
            [
                'nama_perusahaan'   => 'CV Solusi Kreatif Informatika',
                'bidang_usaha'      => 'Web & Mobile Solution',
                'nama_pic'          => 'Hendra Wijaya',
                'kontak_pic'        => '085711223344',
                'kuota'             => 3,
                'alamat'            => 'Jl. Borobudur No. 88, Malang',
                'status_verifikasi' => 'terverifikasi',
            ],
        ];

        $dudiModels = [];
        foreach ($dudisData as $d) {
            $dudiModels[] = TempatMagang::updateOrCreate(
                ['nama_perusahaan' => $d['nama_perusahaan']],
                $d
            );
        }

        // 4. Siswa Accounts
        $siswasData = [
            ['nis' => '20261001', 'nama' => 'Siswa Magang', 'email' => 'siswa@simmas.sch.id', 'kelas' => 'XII RPL 1'],
            ['nis' => '220533604138', 'nama' => 'Bagus Hidayat', 'email' => 'bagus@simmas.sch.id', 'kelas' => 'XII RPL 1'],
            ['nis' => '20261003', 'nama' => 'Andi Pratama', 'email' => 'andi@simmas.sch.id', 'kelas' => 'XII RPL 2'],
            ['nis' => '20261004', 'nama' => 'Citra Kirana', 'email' => 'citra@simmas.sch.id', 'kelas' => 'XII TKJ 1'],
            ['nis' => '20261005', 'nama' => 'Deni Kurniawan', 'email' => 'deni@simmas.sch.id', 'kelas' => 'XII TKJ 2'],
            ['nis' => '20261006', 'nama' => 'Eka Putri', 'email' => 'eka@simmas.sch.id', 'kelas' => 'XII MM 1'],
        ];

        $siswaModels = [];
        foreach ($siswasData as $idx => $s) {
            $user = User::updateOrCreate(
                ['email' => $s['email']],
                [
                    'name'     => $s['nama'],
                    'password' => Hash::make('password'),
                ]
            );

            Profile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'nama'  => $s['nama'],
                    'email' => $s['email'],
                    'role'  => 'siswa',
                ]
            );

            $siswaModel = Siswa::updateOrCreate(
                ['nis' => $s['nis']],
                [
                    'user_id'      => $user->id,
                    'nama_lengkap' => $s['nama'],
                    'kelas'        => $s['kelas'],
                    'email_kontak' => $s['email'],
                    'status_magang'=> 'sedang_magang',
                ]
            );

            $siswaModels[] = $siswaModel;

            $assignedGuru = $guruModels[$idx % count($guruModels)];
            $assignedDudi = $dudiModels[$idx % count($dudiModels)];

            $penempatan = PenempatanMagang::updateOrCreate(
                ['siswa_id' => $siswaModel->id],
                [
                    'tempat_magang_id'  => $assignedDudi->id,
                    'guru_id'           => $assignedGuru->id,
                    'tanggal_mulai'     => '2026-07-01',
                    'tanggal_selesai'   => '2026-12-31',
                    'status_pengesahan' => 'disahkan',
                    'nilai_akhir'       => $idx % 2 === 1 ? 88 : null,
                ]
            );

            // Generate 10-day attendance history
            for ($d = 10; $d >= 0; $d--) {
                $date = date('Y-m-d', strtotime("-$d days"));
                if (date('N', strtotime($date)) >= 6) continue; // Skip weekend

                $status = ($d === 3 && $idx === 1) ? 'sakit' : (($d === 7 && $idx === 2) ? 'izin' : 'hadir');
                Absensi::updateOrCreate(
                    [
                        'siswa_id' => $siswaModel->id,
                        'tanggal'  => $date,
                    ],
                    [
                        'status'               => $status,
                        'jam_masuk'            => $status === 'hadir' ? '07:45:00' : null,
                        'jam_pulang'           => $status === 'hadir' ? '16:00:00' : null,
                        'status_validasi_guru' => $d === 0 ? 'menunggu' : 'disetujui',
                    ]
                );
            }

            // Generate multi-day journals
            $jurnalEntries = [
                [
                    'days_ago' => 0,
                    'uraian'   => 'Testing endpoint API autentikasi menggunakan Postman dan memperbaiki bug pada response handler.',
                    'status'   => 'menunggu',
                    'catatan'  => null,
                ],
                [
                    'days_ago' => 1,
                    'uraian'   => 'Instalasi dan konfigurasi Node.js, setup environment development untuk proyek web magang.',
                    'status'   => 'disetujui',
                    'catatan'  => 'Kerja bagus, perhatikan struktur folder kodenya.',
                ],
                [
                    'days_ago' => 2,
                    'uraian'   => 'Konfigurasi database PostgreSQL dan integrasi REST API untuk manajemen penempatan siswa.',
                    'status'   => 'disetujui',
                    'catatan'  => 'Selesai tepat waktu.',
                ],
                [
                    'days_ago' => 4,
                    'uraian'   => 'Membuat tampilan antarmuka (UI) dashboard menggunakan React & Tailwind CSS.',
                    'status'   => 'perlu_revisi',
                    'catatan'  => 'Mohon perbaiki kontras warna tombol aksi.',
                ],
            ];

            foreach ($jurnalEntries as $je) {
                $jDate = date('Y-m-d', strtotime("-{$je['days_ago']} days"));
                JurnalHarian::updateOrCreate(
                    [
                        'siswa_id' => $siswaModel->id,
                        'tanggal'  => $jDate,
                    ],
                    [
                        'uraian_kegiatan'   => $je['uraian'],
                        'kendala'           => $je['days_ago'] === 4 ? 'Respon tampilan belum responsif di hp.' : 'Tidak ada kendala berarti.',
                        'solusi'            => $je['days_ago'] === 4 ? 'Menggunakan flex grid layout.' : 'Berjalan lancar.',
                        'status_verifikasi' => $je['status'],
                        'catatan_guru'      => $je['catatan'],
                    ]
                );
            }
        }

        // 5. Guru Kunjungan Lapangan
        $kunjunganData = [
            [
                'guru_id'           => $guruModels[0]->id,
                'tempat_magang_id'  => $dudiModels[0]->id,
                'tanggal_kunjungan' => '2026-08-15',
                'catatan_evaluasi'  => 'Siswa menunjukkan progres yang baik. Sudah berhasil mengerjakan tugas backend API. Kondisi lingkungan kerja kondusif. Pembimbing lapangan (Budi Hermawan) kooperatif dan membantu siswa.',
            ],
            [
                'guru_id'           => $guruModels[0]->id,
                'tempat_magang_id'  => $dudiModels[1]->id,
                'tanggal_kunjungan' => '2026-08-10',
                'catatan_evaluasi'  => 'Bagus Hidayat sudah sangat familiar dengan lingkungan kerja Telkom. Aktif bertanya dan menyelesaikan tugas dengan baik. Nilai sementara sangat memuaskan.',
            ],
            [
                'guru_id'           => $guruModels[0]->id,
                'tempat_magang_id'  => $dudiModels[2]->id,
                'tanggal_kunjungan' => '2026-08-05',
                'catatan_evaluasi'  => 'Kunjungan koordinasi awal dengan pihak PT Teknologi Nusantara Digital. Fasilitas magang siswa sudah disiapkan dengan memadai.',
            ],
        ];

        foreach ($kunjunganData as $k) {
            Kunjungan::updateOrCreate(
                [
                    'guru_id'           => $k['guru_id'],
                    'tempat_magang_id'  => $k['tempat_magang_id'],
                    'tanggal_kunjungan' => $k['tanggal_kunjungan'],
                ],
                $k
            );
        }

        // 6. Activity Logs
        ActivityLog::log('system.seed', 'info', ['message' => 'Seeding data SIMMAS berhasil dipublikasikan']);
        ActivityLog::log('guru.validasi_jurnal', 'info', ['jurnal_id' => 1, 'status' => 'disetujui']);
        ActivityLog::log('guru.validasi_absensi', 'info', ['absensi_id' => 2, 'status' => 'disetujui']);
        ActivityLog::log('admin.login', 'info', ['user' => 'admin@simmas.sch.id']);
    }
}
