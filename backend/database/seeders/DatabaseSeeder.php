<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Profile;
use App\Models\Jurusan;
use App\Models\Kelas;
use App\Models\Guru;
use App\Models\Siswa;
use App\Models\TempatMagang;
use App\Models\PenempatanMagang;
use App\Models\PengajuanMagang;
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

        // 2. Jurusan (10 Jurusan Lengkap)
        $jurusanList = [
            'Rekayasa Perangkat Lunak',
            'Teknik Komputer & Jaringan',
            'Multimedia',
            'Desain Komunikasi Visual',
            'Teknik Kelistrikan',
            'Teknik Otomotif',
            'Teknik Elektro',
            'Mekatronika',
            'Broadcasting dan Perfilman',
            'Busana'
        ];
        $jurusanMap = [];
        foreach ($jurusanList as $jnama) {
            $jurusanMap[$jnama] = Jurusan::firstOrCreate(['nama' => $jnama])->id;
        }

        // 3. Kelas (Lengkap untuk seluruh 10 Jurusan)
        $kelasList = [
            // RPL
            ['nama' => 'XII RPL 1', 'jurusan' => 'Rekayasa Perangkat Lunak'],
            ['nama' => 'XII RPL 2', 'jurusan' => 'Rekayasa Perangkat Lunak'],
            ['nama' => 'XII RPL 3', 'jurusan' => 'Rekayasa Perangkat Lunak'],
            ['nama' => 'XI RPL 1',  'jurusan' => 'Rekayasa Perangkat Lunak'],
            // TKJ
            ['nama' => 'XII TKJ 1', 'jurusan' => 'Teknik Komputer & Jaringan'],
            ['nama' => 'XII TKJ 2', 'jurusan' => 'Teknik Komputer & Jaringan'],
            ['nama' => 'XI TKJ 1',  'jurusan' => 'Teknik Komputer & Jaringan'],
            // MM
            ['nama' => 'XII MM 1',  'jurusan' => 'Multimedia'],
            ['nama' => 'XII MM 2',  'jurusan' => 'Multimedia'],
            ['nama' => 'XI MM 1',   'jurusan' => 'Multimedia'],
            // DKV
            ['nama' => 'XII DKV 1', 'jurusan' => 'Desain Komunikasi Visual'],
            ['nama' => 'XII DKV 2', 'jurusan' => 'Desain Komunikasi Visual'],
            ['nama' => 'XI DKV 1',  'jurusan' => 'Desain Komunikasi Visual'],
            // TITL (Teknik Kelistrikan)
            ['nama' => 'XII TITL 1','jurusan' => 'Teknik Kelistrikan'],
            ['nama' => 'XII TITL 2','jurusan' => 'Teknik Kelistrikan'],
            ['nama' => 'XI TITL 1', 'jurusan' => 'Teknik Kelistrikan'],
            // TKR (Teknik Otomotif)
            ['nama' => 'XII TKR 1', 'jurusan' => 'Teknik Otomotif'],
            ['nama' => 'XII TKR 2', 'jurusan' => 'Teknik Otomotif'],
            ['nama' => 'XI TKR 1',  'jurusan' => 'Teknik Otomotif'],
            // TAV (Teknik Elektro)
            ['nama' => 'XII TAV 1', 'jurusan' => 'Teknik Elektro'],
            ['nama' => 'XII TAV 2', 'jurusan' => 'Teknik Elektro'],
            ['nama' => 'XI TAV 1',  'jurusan' => 'Teknik Elektro'],
            // TME (Mekatronika)
            ['nama' => 'XII TME 1', 'jurusan' => 'Mekatronika'],
            ['nama' => 'XII TME 2', 'jurusan' => 'Mekatronika'],
            ['nama' => 'XI TME 1',  'jurusan' => 'Mekatronika'],
            // BCP (Broadcasting dan Perfilman)
            ['nama' => 'XII BCP 1', 'jurusan' => 'Broadcasting dan Perfilman'],
            ['nama' => 'XII BCP 2', 'jurusan' => 'Broadcasting dan Perfilman'],
            ['nama' => 'XI BCP 1',  'jurusan' => 'Broadcasting dan Perfilman'],
            // TB (Busana)
            ['nama' => 'XII TB 1',  'jurusan' => 'Busana'],
            ['nama' => 'XII TB 2',  'jurusan' => 'Busana'],
            ['nama' => 'XI TB 1',   'jurusan' => 'Busana'],
        ];
        $kelasMap = [];
        foreach ($kelasList as $knama) {
            $kelasMap[$knama['nama']] = Kelas::firstOrCreate(['nama' => $knama['nama']], ['jurusan_id' => $jurusanMap[$knama['jurusan']] ?? null])->id;
        }

        // 4. Guru Accounts (Tersebar untuk 10 Jurusan)
        $gurus = [
            // RPL
            ['nip' => '199003202015012004', 'nama' => 'Antigravity Andro',      'email' => 'guru@simmas.sch.id',       'jurusan' => 'Rekayasa Perangkat Lunak'],
            ['nip' => '198803202012022002', 'nama' => 'Siti Nurhaliza, S.ST',   'email' => 'siti.guru@simmas.sch.id',  'jurusan' => 'Rekayasa Perangkat Lunak'],
            // TKJ
            ['nip' => '198501152010011001', 'nama' => 'Drs. Budi Santoso, M.Pd','email' => 'budi.guru@simmas.sch.id',  'jurusan' => 'Teknik Komputer & Jaringan'],
            ['nip' => '198207182008042004', 'nama' => 'Dewi Lestari, M.T',      'email' => 'dewi.guru@simmas.sch.id',  'jurusan' => 'Teknik Komputer & Jaringan'],
            // MM
            ['nip' => '199005122015031003', 'nama' => 'Ahmad Fauzi, S.Kom',     'email' => 'ahmad.guru@simmas.sch.id', 'jurusan' => 'Multimedia'],
            ['nip' => '199308142018022004', 'nama' => 'Rina Kusumawati, S.Sn',  'email' => 'rina.k@simmas.sch.id',     'jurusan' => 'Multimedia'],
            // DKV
            ['nip' => '198911052014021005', 'nama' => 'Fajar Nugraha, S.Sn',    'email' => 'fajar.guru@simmas.sch.id', 'jurusan' => 'Desain Komunikasi Visual'],
            ['nip' => '199104182017012006', 'nama' => 'Dian Sastrowardoyo, M.Ds','email' => 'dian.guru@simmas.sch.id', 'jurusan' => 'Desain Komunikasi Visual'],
            // TITL (Kelistrikan)
            ['nip' => '198402102009031007', 'nama' => 'Ir. Supriyadi, M.T',     'email' => 'supriyadi.guru@simmas.sch.id', 'jurusan' => 'Teknik Kelistrikan'],
            ['nip' => '199006222015021008', 'nama' => 'Hendra Kurniawan, S.ST', 'email' => 'hendra.guru@simmas.sch.id',   'jurusan' => 'Teknik Kelistrikan'],
            // TKR (Otomotif)
            ['nip' => '198608122011011009', 'nama' => 'Bambang Sugeng, S.Pd',   'email' => 'sugeng.guru@simmas.sch.id',   'jurusan' => 'Teknik Otomotif'],
            ['nip' => '199201302019021010', 'nama' => 'Rudi Hartono, S.T',      'email' => 'rudi.guru@simmas.sch.id',     'jurusan' => 'Teknik Otomotif'],
            // TAV (Elektro)
            ['nip' => '198305142008011011', 'nama' => 'Dr. Ir. Hadi Suwito',    'email' => 'hadi.guru@simmas.sch.id',     'jurusan' => 'Teknik Elektro'],
            ['nip' => '199409082020012012', 'nama' => 'Maya Indah, S.T',        'email' => 'maya.guru@simmas.sch.id',     'jurusan' => 'Teknik Elektro'],
            // TME (Mekatronika)
            ['nip' => '198712012013021013', 'nama' => 'Anton Wijaya, M.Eng',    'email' => 'anton.guru@simmas.sch.id',    'jurusan' => 'Mekatronika'],
            ['nip' => '199110152016011014', 'nama' => 'Agus Setiawan, S.ST',    'email' => 'agus.guru@simmas.sch.id',     'jurusan' => 'Mekatronika'],
            // BCP (Broadcasting)
            ['nip' => '198807202014011015', 'nama' => 'Rendi Pratama, S.Sn',    'email' => 'rendi.guru@simmas.sch.id',    'jurusan' => 'Broadcasting dan Perfilman'],
            ['nip' => '199303122018022016', 'nama' => 'Eka Rahmawati, M.I.Kom', 'email' => 'eka.r@simmas.sch.id',         'jurusan' => 'Broadcasting dan Perfilman'],
            // TB (Busana)
            ['nip' => '198109252006042017', 'nama' => 'Hj. Endang Sri Lestari', 'email' => 'endang.guru@simmas.sch.id',   'jurusan' => 'Busana'],
            ['nip' => '199505102021012018', 'nama' => 'Fitriani, M.Ds',         'email' => 'fitriani.guru@simmas.sch.id', 'jurusan' => 'Busana'],
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
                    'jurusan_id'   => $jurusanMap[$g['jurusan']] ?? null,
                    'status_akun'  => 'aktif',
                ]
            );
        }

        // 5. Tempat Magang / DUDI (15 Perusahaan Tersebar di Seluruh Bidang)
        $dudisData = [
            [
                'nama_perusahaan'   => 'PT. Universal Big Data',
                'bidang_usaha'      => 'Big Data & Cloud Infrastructure',
                'nama_pic'          => 'Budi Hermawan',
                'kontak_pic'        => '081234567890',
                'kuota'             => 6,
                'alamat'            => 'Jl. Raya Darmo No. 45, Surabaya',
                'status_verifikasi' => 'terverifikasi',
            ],
            [
                'nama_perusahaan'   => 'PT. Telkom Sidoarjo',
                'bidang_usaha'      => 'Telecommunication & Network Operations',
                'nama_pic'          => 'Anita Rahmawati',
                'kontak_pic'        => '082198765432',
                'kuota'             => 5,
                'alamat'            => 'Jl. A. Yani No. 102, Sidoarjo',
                'status_verifikasi' => 'terverifikasi',
            ],
            [
                'nama_perusahaan'   => 'PT Teknologi Nusantara Digital',
                'bidang_usaha'      => 'Software House & Mobile App Development',
                'nama_pic'          => 'Bambang Sukmono',
                'kontak_pic'        => '081399887766',
                'kuota'             => 8,
                'alamat'            => 'Jl. Soekarno Hatta No. 12, Malang',
                'status_verifikasi' => 'terverifikasi',
            ],
            [
                'nama_perusahaan'   => 'CV Solusi Kreatif Informatika',
                'bidang_usaha'      => 'Web Development & E-Commerce Systems',
                'nama_pic'          => 'Hendra Wijaya',
                'kontak_pic'        => '085711223344',
                'kuota'             => 4,
                'alamat'            => 'Jl. Borobudur No. 88, Malang',
                'status_verifikasi' => 'terverifikasi',
            ],
            [
                'nama_perusahaan'   => 'PT Indonesia Cloud Services',
                'bidang_usaha'      => 'DevOps & Server Administration',
                'nama_pic'          => 'Rahmat Hidayat',
                'kontak_pic'        => '081255443322',
                'kuota'             => 5,
                'alamat'            => 'Jl. Basuki Rahmat No. 15, Surabaya',
                'status_verifikasi' => 'terverifikasi',
            ],
            [
                'nama_perusahaan'   => 'Studio Creative Motion & Media',
                'bidang_usaha'      => 'UI/UX Design & 3D Animation',
                'nama_pic'          => 'Maya Kartika',
                'kontak_pic'        => '087812345678',
                'kuota'             => 4,
                'alamat'            => 'Jl. Veteran No. 25, Malang',
                'status_verifikasi' => 'terverifikasi',
            ],
            [
                'nama_perusahaan'   => 'Pixellab Graphic & Brand Agency',
                'bidang_usaha'      => 'Branding, Vector Illustration & Print Design',
                'nama_pic'          => 'Doni Prasetya',
                'kontak_pic'        => '081299881122',
                'kuota'             => 6,
                'alamat'            => 'Jl. Bandung No. 18, Malang',
                'status_verifikasi' => 'terverifikasi',
            ],
            [
                'nama_perusahaan'   => 'PT PLN (Persero) ULP Malang Kota',
                'bidang_usaha'      => 'Instalasi & Distribusi Tenaga Listrik',
                'nama_pic'          => 'Ir. Sutrisno',
                'kontak_pic'        => '081333445566',
                'kuota'             => 6,
                'alamat'            => 'Jl. Basuki Rahmat No. 100, Malang',
                'status_verifikasi' => 'terverifikasi',
            ],
            [
                'nama_perusahaan'   => 'Bengkel Resmi Auto 2000 & Service',
                'bidang_usaha'      => 'Perawatan Mesin & Kelistrikan Otomotif',
                'nama_pic'          => 'Suryanto',
                'kontak_pic'        => '082233445566',
                'kuota'             => 8,
                'alamat'            => 'Jl. Sunandar Priyo Sudarmo No. 40, Malang',
                'status_verifikasi' => 'terverifikasi',
            ],
            [
                'nama_perusahaan'   => 'PT Panasonic Industrial Devices',
                'bidang_usaha'      => 'Mikroelektronika & Komponen Industri',
                'nama_pic'          => 'Hadi Kurnia',
                'kontak_pic'        => '085611223344',
                'kuota'             => 5,
                'alamat'            => 'Kawasan Industri SIER, Surabaya',
                'status_verifikasi' => 'terverifikasi',
            ],
            [
                'nama_perusahaan'   => 'PT Schneider Electric Automation',
                'bidang_usaha'      => 'Otomasik & Robotika Industri',
                'nama_pic'          => 'Wawan Setiawan',
                'kontak_pic'        => '081777888999',
                'kuota'             => 4,
                'alamat'            => 'Kawasan Industri PIER, Pasuruan',
                'status_verifikasi' => 'terverifikasi',
            ],
            [
                'nama_perusahaan'   => 'Stasiun TVRI & Media Film Nusantara',
                'bidang_usaha'      => 'Penyiaran Televisi, Live Stream & Cinematography',
                'nama_pic'          => 'Bagus Wijaya',
                'kontak_pic'        => '088812345678',
                'kuota'             => 5,
                'alamat'            => 'Jl. Mayjen Sungkono No. 124, Surabaya',
                'status_verifikasi' => 'terverifikasi',
            ],
            [
                'nama_perusahaan'   => 'High Fashion Atelier & House of Batik',
                'bidang_usaha'      => 'Desain Busana, Pattern Making & Garment',
                'nama_pic'          => 'Ratna Sari',
                'kontak_pic'        => '081999888777',
                'kuota'             => 6,
                'alamat'            => 'Jl. Ijen No. 50, Malang',
                'status_verifikasi' => 'terverifikasi',
            ],
            [
                'nama_perusahaan'   => 'CV Jaringan Nusantara Tech',
                'bidang_usaha'      => 'ISP & Fiber Optic Installation',
                'nama_pic'          => 'Eko Prasetyo',
                'kontak_pic'        => '089911223344',
                'kuota'             => 3,
                'alamat'            => 'Jl. Pahlawan No. 50, Pasuruan',
                'status_verifikasi' => 'belum_diverifikasi',
            ],
            [
                'nama_perusahaan'   => 'PT Cyber Security Guard',
                'bidang_usaha'      => 'Information Security & Auditing',
                'nama_pic'          => 'Dimas Anggara',
                'kontak_pic'        => '081122334455',
                'kuota'             => 2,
                'alamat'            => 'Jl. Pemuda No. 80, Surabaya',
                'status_verifikasi' => 'belum_diverifikasi',
            ],
        ];

        $dudiModels = [];
        foreach ($dudisData as $d) {
            $dudiModels[] = TempatMagang::updateOrCreate(
                ['nama_perusahaan' => $d['nama_perusahaan']],
                $d
            );
        }

        // 6A. Siswa Sedang Magang (Tersebar untuk 10 Jurusan)
        $siswasSedangMagang = [
            // RPL
            ['nis' => '20261001', 'nama' => 'Siswa Magang',     'email' => 'siswa@simmas.sch.id',   'kelas' => 'XII RPL 1'],
            ['nis' => '220533604138', 'nama' => 'Bagus Hidayat', 'email' => 'bagus@simmas.sch.id',   'kelas' => 'XII RPL 1'],
            // TKJ
            ['nis' => '20261004', 'nama' => 'Citra Kirana',     'email' => 'citra@simmas.sch.id',   'kelas' => 'XII TKJ 1'],
            ['nis' => '20261005', 'nama' => 'Deni Kurniawan',   'email' => 'deni@simmas.sch.id',    'kelas' => 'XII TKJ 2'],
            // MM
            ['nis' => '20261006', 'nama' => 'Eka Putri',        'email' => 'eka@simmas.sch.id',     'kelas' => 'XII MM 1'],
            // DKV
            ['nis' => '20261015', 'nama' => 'Gilang Pratama',   'email' => 'gilang@simmas.sch.id',  'kelas' => 'XII DKV 1'],
            // TITL (Kelistrikan)
            ['nis' => '20261016', 'nama' => 'Hasan Basri',      'email' => 'hasan@simmas.sch.id',   'kelas' => 'XII TITL 1'],
            // TKR (Otomotif)
            ['nis' => '20261017', 'nama' => 'Irfan Bachdim',    'email' => 'irfan@simmas.sch.id',   'kelas' => 'XII TKR 1'],
            // TAV (Elektro)
            ['nis' => '20261018', 'nama' => 'Jasmine Noor',     'email' => 'jasmine@simmas.sch.id', 'kelas' => 'XII TAV 1'],
            // TME (Mekatronika)
            ['nis' => '20261019', 'nama' => 'Krisna Bayu',      'email' => 'krisna@simmas.sch.id',  'kelas' => 'XII TME 1'],
            // BCP (Broadcasting)
            ['nis' => '20261020', 'nama' => 'Laila Majnun',     'email' => 'laila@simmas.sch.id',   'kelas' => 'XII BCP 1'],
            // TB (Busana)
            ['nis' => '20261021', 'nama' => 'Maulia Anggraini', 'email' => 'maulia@simmas.sch.id',  'kelas' => 'XII TB 1'],
        ];

        $jurnalSampleData = [
            [
                'uraian'  => 'Slicing UI dashboard manajemen magang menggunakan Next.js & Tailwind CSS.',
                'kendala' => 'Tampilan belum responsif di layar smartphone.',
                'solusi'  => 'Menambahkan breakpoint sm: & lg: pada Tailwind grid.',
                'catatan' => 'Bagus, pertahankan kerapihan kodenya.',
            ],
            [
                'uraian'  => 'Konfigurasi router Mikrotik dan manajemen bandwidth siswa magang.',
                'kendala' => 'Settingan IP static bentrok dengan DHCP server.',
                'solusi'  => 'Re-assign subnet IP baru untuk grup magang.',
                'catatan' => 'Sangat teliti dalam menangani jaringan.',
            ],
            [
                'uraian'  => 'Membuat animasi promo banner menggunakan Adobe After Effects & Figma.',
                'kendala' => 'Render file MP4 membutuhkan waktu cukup lama.',
                'solusi'  => 'Menggunakan preset H.264 dengan bitrate optimal.',
                'catatan' => 'Kreatif dan estetik.',
            ],
            [
                'uraian'  => 'Perbaikan instalasi kabel kontrol kelistrikan dan pengujian trafo daya.',
                'kendala' => 'Suhu rangkaian sedikit hangat saat pembebanan awal.',
                'solusi'  => 'Menyesuaikan kabel grounding dan kapasitas sekring.',
                'catatan' => 'Mengikuti standar K3 dengan baik.',
            ],
            [
                'uraian'  => 'Diagnosis sistem injeksi bahan bakar dan tune-up kendaraan mesin diesel.',
                'kendala' => 'Sensor EFI kotor menyebabkan tarikan berat.',
                'solusi'  => 'Membersihkan injector menggunakan saringan ultrasonic.',
                'catatan' => 'Analisis teknis sangat tepat.',
            ],
        ];

        foreach ($siswasSedangMagang as $idx => $s) {
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
                    'kelas_id'     => $kelasMap[$s['kelas']] ?? null,
                    'email_kontak' => $s['email'],
                    'status_magang'=> 'sedang_magang',
                ]
            );

            $assignedGuru = $guruModels[$idx % count($guruModels)];
            $assignedDudi = $dudiModels[$idx % count($dudiModels)];

            PenempatanMagang::updateOrCreate(
                ['siswa_id' => $siswaModel->id],
                [
                    'tempat_magang_id'  => $assignedDudi->id,
                    'guru_id'           => $assignedGuru->id,
                    'tanggal_mulai'     => '2026-07-01',
                    'tanggal_selesai'   => '2026-12-31',
                    'status_pengesahan' => 'disahkan',
                    'nilai_akhir'       => null,
                ]
            );

            // Generate 12-day attendance history
            for ($d = 12; $d >= 0; $d--) {
                $date = date('Y-m-d', strtotime("-$d days"));
                if (date('N', strtotime($date)) >= 6) continue; // Skip weekend

                $status = ($d === 2 && $idx === 1) ? 'sakit' : (($d === 6 && $idx === 3) ? 'izin' : 'hadir');
                Absensi::updateOrCreate(
                    [
                        'siswa_id' => $siswaModel->id,
                        'tanggal'  => $date,
                    ],
                    [
                        'status'               => $status,
                        'jam_masuk'            => $status === 'hadir' ? '07:45:00' : null,
                        'jam_pulang'           => $status === 'hadir' ? '16:30:00' : null,
                        'status_validasi_guru' => $d === 0 ? 'menunggu' : 'disetujui',
                        'catatan_guru'         => $d === 0 ? null : 'Validasi kehadiran otomatis.',
                    ]
                );

                // Generate Jurnal for present days
                if ($status === 'hadir' && $d % 2 === 0) {
                    $sample = $jurnalSampleData[($idx + $d) % count($jurnalSampleData)];
                    JurnalHarian::updateOrCreate(
                        [
                            'siswa_id' => $siswaModel->id,
                            'tanggal'  => $date,
                        ],
                        [
                            'uraian_kegiatan'   => $sample['uraian'],
                            'kendala'           => $sample['kendala'],
                            'solusi'            => $sample['solusi'],
                            'status_verifikasi' => $d === 0 ? 'menunggu' : 'disetujui',
                            'catatan_guru'      => $d === 0 ? null : $sample['catatan'],
                        ]
                    );
                }
            }
        }

        // 6B. Siswa Lulus Magang (Lengkap Berbagai Jurusan)
        $siswasLulus = [
            ['nis' => '20261009', 'nama' => 'Kevin Sanjaya',   'email' => 'kevin@simmas.sch.id',   'kelas' => 'XII RPL 1',  'nilai' => 92],
            ['nis' => '20261010', 'nama' => 'Laura Indah',     'email' => 'laura@simmas.sch.id',   'kelas' => 'XII TKJ 2',  'nilai' => 95],
            ['nis' => '20261011', 'nama' => 'Muhammad Fikri',  'email' => 'fikri@simmas.sch.id',   'kelas' => 'XII MM 2',   'nilai' => 88],
            ['nis' => '20261022', 'nama' => 'Nadia Rahma',     'email' => 'nadia@simmas.sch.id',   'kelas' => 'XII DKV 1',  'nilai' => 90],
            ['nis' => '20261023', 'nama' => 'Oktavianus',      'email' => 'okta@simmas.sch.id',    'kelas' => 'XII TITL 1', 'nilai' => 86],
            ['nis' => '20261024', 'nama' => 'Pratiwi Sulistyo', 'email' => 'pratiwi@simmas.sch.id','kelas' => 'XII TB 1',   'nilai' => 94],
        ];

        foreach ($siswasLulus as $idx => $sl) {
            $user = User::updateOrCreate(
                ['email' => $sl['email']],
                [
                    'name'     => $sl['nama'],
                    'password' => Hash::make('password'),
                ]
            );

            Profile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'nama'  => $sl['nama'],
                    'email' => $sl['email'],
                    'role'  => 'siswa',
                ]
            );

            $siswaModel = Siswa::updateOrCreate(
                ['nis' => $sl['nis']],
                [
                    'user_id'      => $user->id,
                    'nama_lengkap' => $sl['nama'],
                    'kelas_id'     => $kelasMap[$sl['kelas']] ?? null,
                    'email_kontak' => $sl['email'],
                    'status_magang'=> 'lulus',
                ]
            );

            PenempatanMagang::updateOrCreate(
                ['siswa_id' => $siswaModel->id],
                [
                    'tempat_magang_id'  => $dudiModels[$idx % count($dudiModels)]->id,
                    'guru_id'           => $guruModels[$idx % count($guruModels)]->id,
                    'tanggal_mulai'     => '2026-01-05',
                    'tanggal_selesai'   => '2026-06-30',
                    'status_pengesahan' => 'disahkan',
                    'nilai_akhir'       => $sl['nilai'],
                ]
            );
        }

        // 6C. Siswa Pengajuan Magang (Berbagai Jurusan)
        $siswasPengajuan = [
            ['nis' => '20261012', 'nama' => 'Nabila Az-Zahra', 'email' => 'nabila@simmas.sch.id', 'kelas' => 'XI RPL 1',  'posisi' => 'Frontend Developer', 'status' => 'menunggu'],
            ['nis' => '20261013', 'nama' => 'Oscar Ramadhan',  'email' => 'oscar@simmas.sch.id',  'kelas' => 'XI TKJ 1',  'posisi' => 'Network Administrator', 'status' => 'disetujui'],
            ['nis' => '20261014', 'nama' => 'Putri Amalia',    'email' => 'putri@simmas.sch.id',  'kelas' => 'XI MM 1',   'posisi' => 'UI/UX Designer', 'status' => 'ditolak'],
            ['nis' => '20261025', 'nama' => 'Qori Anggraini',  'email' => 'qori@simmas.sch.id',   'kelas' => 'XI DKV 1',  'posisi' => 'Graphic Illustrator', 'status' => 'menunggu'],
            ['nis' => '20261026', 'nama' => 'Rizky Febrian',   'email' => 'rizky@simmas.sch.id',  'kelas' => 'XI TKR 1',  'posisi' => 'Mechanic Assistant', 'status' => 'menunggu'],
            ['nis' => '20261027', 'nama' => 'Salsa Bila',      'email' => 'salsa@simmas.sch.id',  'kelas' => 'XI TB 1',   'posisi' => 'Fashion Pattern Designer', 'status' => 'menunggu'],
        ];

        foreach ($siswasPengajuan as $idx => $sp) {
            $user = User::updateOrCreate(
                ['email' => $sp['email']],
                [
                    'name'     => $sp['nama'],
                    'password' => Hash::make('password'),
                ]
            );

            Profile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'nama'  => $sp['nama'],
                    'email' => $sp['email'],
                    'role'  => 'siswa',
                ]
            );

            $siswaModel = Siswa::updateOrCreate(
                ['nis' => $sp['nis']],
                [
                    'user_id'      => $user->id,
                    'nama_lengkap' => $sp['nama'],
                    'kelas_id'     => $kelasMap[$sp['kelas']] ?? null,
                    'email_kontak' => $sp['email'],
                    'status_magang'=> 'pengajuan',
                ]
            );

            PengajuanMagang::updateOrCreate(
                ['siswa_id' => $siswaModel->id],
                [
                    'tempat_magang_id'      => $dudiModels[$idx % count($dudiModels)]->id,
                    'posisi_diminati'       => $sp['posisi'],
                    'tanggal_mulai_usulan'  => '2026-09-15',
                    'tanggal_selesai_usulan'=> '2026-12-15',
                    'status'                => $sp['status'],
                    'catatan_penolakan'     => $sp['status'] === 'ditolak' ? 'Kuota posisi UI/UX Designer di perusahaan ini sudah penuh.' : null,
                ]
            );
        }

        // 7. Guru Kunjungan Lapangan
        $kunjunganData = [
            [
                'guru_id'           => $guruModels[0]->id,
                'tempat_magang_id'  => $dudiModels[0]->id,
                'tanggal_kunjungan' => '2026-08-25',
                'catatan_evaluasi'  => 'Kunjungan berkala 1: Siswa menunjukkan progres yang baik. Sudah memegang modul backend API. Pembimbing DUDI mengapresiasi keaktifan siswa.',
            ],
            [
                'guru_id'           => $guruModels[2]->id,
                'tempat_magang_id'  => $dudiModels[1]->id,
                'tanggal_kunjungan' => '2026-08-20',
                'catatan_evaluasi'  => 'Kunjungan berkala 1: Siswa sudah terbiasa dengan lingkungan kerja Telkom Sidoarjo. Melakukan maintenance fiber optic dengan dampingan senior.',
            ],
            [
                'guru_id'           => $guruModels[4]->id,
                'tempat_magang_id'  => $dudiModels[5]->id,
                'tanggal_kunjungan' => '2026-08-18',
                'catatan_evaluasi'  => 'Kunjungan koordinasi awal: Fasilitas perangkat kerja siswa memadai. Pihak DUDI memberikan pembekalan standar operational procedure (SOP).',
            ],
            [
                'guru_id'           => $guruModels[6]->id,
                'tempat_magang_id'  => $dudiModels[6]->id,
                'tanggal_kunjungan' => '2026-08-12',
                'catatan_evaluasi'  => 'Evaluasi pertengahan: Siswa DKV berhasil membuat branding kit klien lokal. Hasil kerja disukai oleh tim kreatif industri.',
            ],
            [
                'guru_id'           => $guruModels[8]->id,
                'tempat_magang_id'  => $dudiModels[7]->id,
                'tanggal_kunjungan' => '2026-08-10',
                'catatan_evaluasi'  => 'Kunjungan lapangan kelistrikan: Siswa memahami instalasi panel daya 3-fasa di PLN Kota Malang. Penerapan safety gear 100% lengkap.',
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

        // 8. Activity Logs
        ActivityLog::log('system.seed', 'info', ['message' => 'Seeding master data SIMMAS 10 Jurusan berhasil dipublikasikan']);
        ActivityLog::log('admin.plotting', 'info', ['message' => 'Plotting 12 siswa magang ke DUDI terverifikasi lintas jurusan']);
        ActivityLog::log('guru.validasi_jurnal', 'info', ['jurnal_id' => 1, 'status' => 'disetujui']);
        ActivityLog::log('guru.validasi_absensi', 'info', ['absensi_id' => 2, 'status' => 'disetujui']);
        ActivityLog::log('siswa.pengajuan', 'info', ['siswa' => 'Nabila Az-Zahra', 'dudi' => 'PT. Universal Big Data']);
        ActivityLog::log('admin.login', 'info', ['user' => 'admin@simmas.sch.id']);

        // 9. Akun Guru Polos & Siswa Belum Magang
        $this->call(AddTestAccountsSeeder::class);
    }
}
