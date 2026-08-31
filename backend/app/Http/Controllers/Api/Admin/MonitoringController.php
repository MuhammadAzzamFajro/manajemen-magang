<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\Absensi;
use App\Models\JurnalHarian;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class MonitoringController extends Controller
{
    #[OA\Get(
        path: '/api/admin/monitoring',
        summary: 'Monitoring siswa magang',
        description: 'Daftar siswa (dapat difilter) beserta nama DUDI, pembimbing, rekap presensi, jumlah jurnal, status pantauan, dan jurnal terakhir.',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'kelas', in: 'query', description: 'Filter berdasarkan kelas.', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'search', in: 'query', description: 'Cari berdasarkan nama atau NIS.', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'per_page', in: 'query', description: 'Jumlah data per halaman.', required: false, schema: new OA\Schema(type: 'integer', default: 15)),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Daftar monitoring siswa.', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'status', type: 'boolean', example: true),
                    new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Siswa')),
                ],
            )),
            new OA\Response(response: 401, description: 'Token tidak valid.'),
            new OA\Response(response: 403, description: 'Role tidak diizinkan (bukan admin).'),
        ],
    )]
    public function index(Request $request)
    {
        $query = Siswa::with(['penempatan.tempatMagang', 'penempatan.guru', 'kelas']);

        if ($request->has('kelas') && $request->kelas) {
            $kelasName = $request->kelas;
            $query->whereHas('kelas', function ($q) use ($kelasName) {
                $q->where('nama', $kelasName);
            });
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%");
            });
        }

        $perPage = $request->input('per_page', 15);
        $perPage = min(max((int)$perPage, 1), 100);

        $result = $query->paginate($perPage);

        $this->enrich($result->getCollection());

        return response()->json([
            'status' => true,
            'data'   => $result
        ]);
    }

    #[OA\Get(
        path: '/api/admin/monitoring/{siswa_id}',
        summary: 'Detail monitoring satu siswa',
        description: 'Detail lengkap siswa: penempatan, rekap presensi, jurnal terbaru, dan pengajuan.',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'siswa_id', in: 'path', required: true, description: 'ID siswa.', schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Detail monitoring siswa.', content: new OA\JsonContent(ref: '#/components/schemas/Siswa')),
            new OA\Response(response: 404, description: 'Siswa tidak ditemukan.'),
        ],
    )]
    public function show($siswa_id)
    {
        $siswa = Siswa::with([
            'penempatan.tempatMagang',
            'penempatan.guru',
            'kelas',
            'absensi' => function ($q) { $q->orderBy('tanggal', 'desc')->take(30); },
            'jurnal'  => function ($q) { $q->orderBy('tanggal', 'desc')->take(30); },
            'pengajuan.tempatMagang'
        ])->findOrFail($siswa_id);

        $this->enrichSingle($siswa);

        return response()->json([
            'status' => true,
            'data'   => $siswa
        ]);
    }

    /**
     * Lengkapi setiap item siswa dengan data rekap yang dibutuhkan halaman
     * monitoring admin: nama_dudi, nama_guru, rekap_presensi, jumlah_jurnal,
     * status, terakhir_aktif, dan jurnal_terakhir.
     *
     * @param \Illuminate\Support\Collection<int, Siswa> $siswas
     */
    protected function enrich($siswas): void
    {
        if ($siswas->isEmpty()) {
            return;
        }

        $siswaIds = $siswas->pluck('id');

        $presensi = Absensi::whereIn('siswa_id', $siswaIds)
            ->selectRaw('siswa_id, status, COUNT(*) as total')
            ->groupBy('siswa_id', 'status')
            ->get()
            ->groupBy('siswa_id')
            ->map->keyBy('status');

        $latestAbsensi = Absensi::whereIn('siswa_id', $siswaIds)
            ->selectRaw('siswa_id, MAX(tanggal) as terakhir')
            ->groupBy('siswa_id')
            ->pluck('terakhir', 'siswa_id');

        $jurnalCounts = JurnalHarian::whereIn('siswa_id', $siswaIds)
            ->selectRaw('siswa_id, status_verifikasi, COUNT(*) as total')
            ->groupBy('siswa_id', 'status_verifikasi')
            ->get()
            ->groupBy('siswa_id')
            ->map->keyBy('status_verifikasi');

        $jurnalTerakhir = JurnalHarian::whereIn('siswa_id', $siswaIds)
            ->orderBy('tanggal', 'desc')
            ->get()
            ->unique('siswa_id')
            ->keyBy('siswa_id');

        // Tanggal kegiatan terakhir (absensi terbaru / jurnal terbaru)
        $latestJurnalDate = JurnalHarian::whereIn('siswa_id', $siswaIds)
            ->selectRaw('siswa_id, MAX(tanggal) as terakhir')
            ->groupBy('siswa_id')
            ->pluck('terakhir', 'siswa_id');

        foreach ($siswas as $siswa) {
            $this->applyEnrichedFields(
                $siswa,
                $presensi->get((int)$siswa->id, collect()),
                $latestAbsensi->get((int)$siswa->id),
                $jurnalCounts->get((int)$siswa->id, collect()),
                $jurnalTerakhir->get((int)$siswa->id),
                $latestJurnalDate->get((int)$siswa->id)
            );
        }
    }

    /**
     * Lengkapi satu model siswa saja (untuk endpoint show).
     */
    protected function enrichSingle(Siswa $siswa): void
    {
        $presensi = Absensi::where('siswa_id', $siswa->id)
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->get()
            ->keyBy('status');

        $jurnalCounts = JurnalHarian::where('siswa_id', $siswa->id)
            ->selectRaw('status_verifikasi, COUNT(*) as total')
            ->groupBy('status_verifikasi')
            ->get()
            ->keyBy('status_verifikasi');

        $latestAbsensi = Absensi::where('siswa_id', $siswa->id)
            ->orderBy('tanggal', 'desc')
            ->value('tanggal');

        $latestJurnalDate = JurnalHarian::where('siswa_id', $siswa->id)
            ->orderBy('tanggal', 'desc')
            ->value('tanggal');

        $jurnalTerakhir = $siswa->jurnal->first();

        $this->applyEnrichedFields(
            $siswa,
            $presensi,
            $latestAbsensi,
            $jurnalCounts,
            $jurnalTerakhir,
            $latestJurnalDate
        );
    }

    /**
     * Isi field tambahan ke model siswa.
     */
    protected function applyEnrichedFields(
        Siswa $siswa,
        $presensi,
        ?string $latestAbsensi,
        $jurnalCounts,
        ?JurnalHarian $jurnalTerakhir,
        ?string $latestJurnalDate
    ): void {
        $hadir = (int)($presensi->get('hadir')?->total ?? 0);
        $sakit = (int)($presensi->get('sakit')?->total ?? 0);
        $izin  = (int)($presensi->get('izin')?->total ?? 0);
        $alfa  = (int)($presensi->get('alfa')?->total ?? 0);

        $jumlahJurnal = 0;
        $jurnalDisetujui = 0;
        foreach ($jurnalCounts as $status => $row) {
            $jumlahJurnal += (int)$row->total;
            if ($status === 'disetujui') {
                $jurnalDisetujui += (int)$row->total;
            }
        }

        // Status pantauan siswa untuk admin
        if ($alfa >= 3) {
            $status = 'bermasalah';
        } elseif ($alfa >= 1 || $jumlahJurnal === 0) {
            $status = 'perlu_perhatian';
        } else {
            $status = 'aktif';
        }

        // Tanggal aktivitas terakhir
        $dates    = array_filter([$latestAbsensi, $latestJurnalDate]);
        $terakhir = $dates ? max($dates) : null;

        $penempatan = $siswa->penempatan;

        $siswa->nama_dudi = $penempatan?->tempatMagang?->nama_perusahaan;
        $siswa->nama_guru = $penempatan?->guru?->nama_lengkap;
        $siswa->rekap_presensi = [
            'hadir' => $hadir,
            'sakit' => $sakit,
            'izin'  => $izin,
            'alfa'  => $alfa,
        ];
        $siswa->jumlah_jurnal    = $jumlahJurnal;
        $siswa->jurnal_disetujui = $jurnalDisetujui;
        $siswa->status           = $status;
        $siswa->terakhir_aktif   = $terakhir ? \Illuminate\Support\Carbon::parse($terakhir)->translatedFormat('d M Y') : null;
        $siswa->jurnal_terakhir  = $jurnalTerakhir ? [
            'tanggal'           => optional($jurnalTerakhir->tanggal)->toDateString(),
            'uraian'            => $jurnalTerakhir->uraian_kegiatan,
            'status_verifikasi' => $jurnalTerakhir->status_verifikasi,
        ] : null;
    }
}