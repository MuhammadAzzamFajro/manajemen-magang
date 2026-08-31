<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class LogsController extends Controller
{
    #[OA\Get(
        path: '/api/admin/logs',
        summary: 'Daftar riwayat aktivitas (audit trail)',
        description: 'Riwayat aktivitas seluruh pengguna, dipaginasi dan dapat difilter berdasarkan level atau kata kunci.',
        tags: ['Admin'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'level', in: 'query', description: 'Filter level log (info/warn/error).', required: false, schema: new OA\Schema(type: 'string', enum: ['info', 'warn', 'error'])),
            new OA\Parameter(name: 'search', in: 'query', description: 'Cari berdasarkan email aktor, action_type, IP, atau role.', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'per_page', in: 'query', description: 'Jumlah data per halaman (maks 100).', required: false, schema: new OA\Schema(type: 'integer', default: 20)),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Daftar log.', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'status', type: 'boolean', example: true),
                    new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/ActivityLog')),
                ],
            )),
        ],
    )]
    public function index(Request $request)
    {
        $query = ActivityLog::orderBy('created_at', 'desc');

        if ($request->level) {
            $query->where('level', $request->level);
        }

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('actor_email', 'like', "%{$search}%")
                  ->orWhere('action_type', 'like', "%{$search}%")
                  ->orWhere('ip_address', 'like', "%{$search}%")
                  ->orWhere('actor_role', 'like', "%{$search}%");
            });
        }

        $perPage = $request->input('per_page', 20);
        $perPage = min(max((int)$perPage, 1), 100);

        return response()->json([
            'status' => true,
            'data'   => $query->paginate($perPage)
        ]);
    }
}
