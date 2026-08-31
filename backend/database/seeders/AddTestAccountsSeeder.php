<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Profile;
use App\Models\Jurusan;
use App\Models\Kelas;
use App\Models\Guru;
use App\Models\Siswa;

class AddTestAccountsSeeder extends Seeder
{
    public function run(): void
    {
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
        foreach ($jurusanList as $j) {
            $jurusanMap[$j] = Jurusan::firstOrCreate(['nama' => $j])->id;
        }

        $kelasMap = [];
        $kelasList = [
            ['nama' => 'XII RPL 1', 'jurusan' => 'Rekayasa Perangkat Lunak'],
            ['nama' => 'XII TKJ 1', 'jurusan' => 'Teknik Komputer & Jaringan'],
            ['nama' => 'XII MM 1',  'jurusan' => 'Multimedia'],
            ['nama' => 'XII DKV 1', 'jurusan' => 'Desain Komunikasi Visual'],
            ['nama' => 'XII TITL 1','jurusan' => 'Teknik Kelistrikan'],
            ['nama' => 'XII TKR 1', 'jurusan' => 'Teknik Otomotif'],
            ['nama' => 'XII TAV 1', 'jurusan' => 'Teknik Elektro'],
            ['nama' => 'XII TME 1', 'jurusan' => 'Mekatronika'],
            ['nama' => 'XII BCP 1', 'jurusan' => 'Broadcasting dan Perfilman'],
            ['nama' => 'XII TB 1',  'jurusan' => 'Busana'],
        ];
        foreach ($kelasList as $k) {
            $kelasMap[$k['nama']] = Kelas::firstOrCreate(['nama' => $k['nama']], ['jurusan_id' => $jurusanMap[$k['jurusan']] ?? null])->id;
        }

        // 3 Guru baru polosan tanpa bimbingan (password: password)
        $gurus = [
            [
                'nip'     => '199501102020012001',
                'nama'    => 'Rina Marlina, S.Kom',
                'email'   => 'rina.guru@simmas.sch.id',
                'jurusan' => 'Rekayasa Perangkat Lunak',
            ],
            [
                'nip'     => '199203152019031002',
                'nama'    => 'Bambang Prasetyo, M.Kom',
                'email'   => 'bambang.guru@simmas.sch.id',
                'jurusan' => 'Teknik Komputer & Jaringan',
            ],
            [
                'nip'     => '199801252021012003',
                'nama'    => 'Salsabila Putri, S.ST',
                'email'   => 'salsabila.guru@simmas.sch.id',
                'jurusan' => 'Multimedia',
            ],
        ];

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

            Guru::updateOrCreate(
                ['nip' => $g['nip']],
                [
                    'user_id'      => $user->id,
                    'nama_lengkap' => $g['nama'],
                    'jurusan_id'   => $jurusanMap[$g['jurusan']] ?? null,
                    'status_akun'  => 'aktif',
                ]
            );
        }

        // 5 Siswa polosan: belum magang & tanpa penempatan (password: password)
        $siswas = [
            ['nis' => '2024008', 'nama' => 'Hanif Ramadhan', 'email' => 'hanif@simmas.sch.id', 'kelas' => 'XII RPL 1'],
            ['nis' => '2024009', 'nama' => 'Intan Permata',  'email' => 'intan@simmas.sch.id', 'kelas' => 'XII DKV 1'],
            ['nis' => '2024010', 'nama' => 'Joko Susilo',    'email' => 'joko@simmas.sch.id',  'kelas' => 'XII TITL 1'],
            ['nis' => '2024011', 'nama' => 'Karmila Sari',   'email' => 'karmila@simmas.sch.id', 'kelas' => 'XII TKR 1'],
            ['nis' => '2024012', 'nama' => 'Luthfi Hakim',   'email' => 'luthfi@simmas.sch.id', 'kelas' => 'XII TB 1'],
        ];

        foreach ($siswas as $s) {
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

            Siswa::updateOrCreate(
                ['nis' => $s['nis']],
                [
                    'user_id'      => $user->id,
                    'nama_lengkap' => $s['nama'],
                    'kelas_id'     => $kelasMap[$s['kelas']] ?? null,
                    'email_kontak' => $s['email'],
                    'status_magang' => 'belum_magang',
                ]
            );
        }
    }
}