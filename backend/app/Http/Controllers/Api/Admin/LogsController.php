<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class LogsController extends Controller
{
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
