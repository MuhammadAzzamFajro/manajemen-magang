'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getActivityLogs } from '@/lib/db';
import {
  Search, ChevronDown, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, AlertTriangle, Trash2,
  FileText, Info, TriangleAlert, XCircle, ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDateLine = (dateStr: string) => {
  if (!dateStr) return { date: '—', time: '' };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { date: dateStr, time: '' };
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  const date = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return { date, time };
};

// ─── Level Badge (Mockup-style pill badges with borders and text) ──────────────
function LevelBadge({ level }: { level: string }) {
  if (level === 'warn') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-500 border border-amber-200">
        <TriangleAlert className="w-3.5 h-3.5 shrink-0" />
        <span>WARN</span>
      </span>
    );
  }
  if (level === 'error') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-500 border border-rose-200">
        <XCircle className="w-3.5 h-3.5 shrink-0" />
        <span>ERROR</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-500 border border-blue-200">
      <Info className="w-3.5 h-3.5 shrink-0" />
      <span>INFO</span>
    </span>
  );
}

// ─── Metadata Drawer ──────────────────────────────────────────────────────────
function MetadataDrawer({ log, onClose }: { log: any; onClose: () => void }) {
  if (!log) return null;
  const meta = typeof log.metadata === 'string' ? JSON.parse(log.metadata || '{}') : (log.metadata || {});
  const { date, time } = formatDateLine(log.created_at);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 leading-tight">Detail Metadata Log</h3>
            <p className="text-xs text-gray-400 mt-0.5">{date} {time}</p>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Action Type</p>
              <p className="text-xs font-bold text-gray-800 font-mono">{log.action_type || '—'}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Level</p>
              <p className="text-xs font-bold text-gray-800 uppercase">{log.level || '—'}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Aktor</p>
              <p className="text-xs font-semibold text-gray-800 truncate">{log.actor_email || 'System'}</p>
              <p className="text-[10px] text-gray-400">{log.actor_role || 'GUEST'}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">IP Address</p>
              <p className="text-xs font-mono font-semibold text-gray-800">{log.ip_address || '127.0.0.1'}</p>
            </div>
          </div>

          {Object.keys(meta).length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Payload Metadata</p>
              <pre className="p-3.5 rounded-xl bg-slate-900 text-emerald-400 text-xs font-mono overflow-auto max-h-40 leading-relaxed">
                {JSON.stringify(meta, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Warning Modal for Clear Logs (Append-Only Enforcement) ──────────────────
function AppendOnlyWarningModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-150 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-2">Aksi Tidak Diperbolehkan</h3>
        <p className="text-xs text-gray-505 leading-relaxed mb-6">
          Sesuai dengan kebijakan keamanan data SIMMAS, log aktivitas bersifat <strong>append-only</strong>. Seluruh riwayat log sistem tidak dapat dihapus, dimodifikasi, atau dibersihkan oleh pengguna manapun demi keperluan audit.
        </p>
        <button
          onClick={onClose}
          className="w-full py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
        >
          Mengerti
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminLogsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [level, setLevel] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Debounce search input to avoid excessive API requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const { data, isLoading, error: fetchError } = useQuery({
    queryKey: ['admin-logs', page, perPage, debouncedSearch, level],
    queryFn: () => getActivityLogs(page, perPage, debouncedSearch, level),
    staleTime: 10_000,
  });

  const paginatedLogs = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const totalLogs = data?.total || 0;
  const totalPages = data?.last_page || 1;
  const fromRecord = data?.from || 0;
  const toRecord = data?.to || 0;

  // Extract action types into mockup formats (e.g. LOGIN_SUCCESS, Target: AUTH)
  const getActionDisplay = (action: string) => {
    if (!action) return { type: '—', target: '' };
    const parts = action.split('.');
    if (parts.length > 1) {
      return {
        type: parts[1].toUpperCase(),
        target: `Target: ${parts[0].toUpperCase()}`,
      };
    }
    return {
      type: action.toUpperCase(),
      target: '',
    };
  };

  return (
    <div className="p-0 font-sans">

      {/* ── Filter Bar ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3 mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari tipe aksi, aktor, atau ta..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Level Filter */}
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={level}
              onChange={e => { setLevel(e.target.value); setPage(1); }}
              className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white font-medium text-gray-700 cursor-pointer"
            >
              <option value="">Semua Level</option>
              <option value="info">INFO</option>
              <option value="warn">WARN</option>
              <option value="error">ERROR</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-500">{totalLogs} Log</span>
          
          {/* Clear Logs Button (Red styling from mockup) */}
          <button
            onClick={() => setShowWarningModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Trash2 className="w-4 h-4" /> Bersihkan Log
          </button>
        </div>
      </div>

      {/* ── Error ────────────────────────────────────────────────────────── */}
      {fetchError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Gagal memuat data: {(fetchError as Error).message}
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">WAKTU</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">LEVEL</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">AKSI</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">AKTOR</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">IP ADDRESS</span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">DETAIL</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-4 py-3.5">
                      <div className="space-y-1.5">
                        <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                        <div className="h-2.5 w-14 bg-gray-100 rounded animate-pulse" />
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse" /></td>
                    <td className="px-4 py-3.5">
                      <div className="space-y-1.5">
                        <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
                        <div className="h-2.5 w-20 bg-gray-100 rounded animate-pulse" />
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="space-y-1.5">
                        <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                        <div className="h-4 w-14 bg-gray-100 rounded-full animate-pulse" />
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><div className="h-3 w-20 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-3.5"><div className="h-6 w-18 bg-gray-100 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                    <p className="text-sm text-gray-400">Tidak ada log aktivitas yang cocok.</p>
                    {(searchInput || level) && (
                      <button onClick={() => { setSearchInput(''); setLevel(''); setPage(1); }}
                        className="mt-2 text-xs text-blue-600 hover:underline">Reset filter</button>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((l: any) => {
                  const { date, time } = formatDateLine(l.created_at);
                  const { type, target } = getActionDisplay(l.action_type);
                  const emailDisplay = l.actor_email
                    ? (l.actor_email.length > 28 ? l.actor_email.slice(0, 26) + '...' : l.actor_email)
                    : 'System';

                  return (
                    <tr key={l.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">

                      {/* Waktu */}
                      <td className="px-4 py-3.5">
                        <p className="text-xs font-semibold text-gray-700">{date}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{time}</p>
                      </td>

                      {/* Level */}
                      <td className="px-4 py-3.5">
                        <LevelBadge level={l.level} />
                      </td>

                      {/* Aksi */}
                      <td className="px-4 py-3.5">
                        <p className="text-xs font-bold text-gray-800 font-mono">{type}</p>
                        {target && <p className="text-[11px] text-gray-400 mt-0.5">{target}</p>}
                      </td>

                      {/* Aktor */}
                      <td className="px-4 py-3.5">
                        <p className="text-xs font-semibold text-gray-800">{emailDisplay}</p>
                        <p className="text-[10px] text-gray-400 uppercase mt-0.5">{l.actor_role || 'GUEST'}</p>
                      </td>

                      {/* IP Address */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-gray-500 font-medium">{l.ip_address || '127.0.0.1'}</span>
                      </td>

                      {/* Detail / Metadata */}
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => setSelectedLog(l)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" /> Metadata
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ───────────────────────────────────────────────── */}
        {!isLoading && totalLogs > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-3 text-xs text-gray-500">
            <span>
              Menampilkan {fromRecord}–{toRecord} dari {totalLogs} data
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                Baris per halaman:
                <div className="relative">
                  <select
                    value={perPage}
                    onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
                    className="pl-2 pr-6 py-1 border border-gray-200 rounded text-xs focus:outline-none appearance-none cursor-pointer"
                  >
                    {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button onClick={() => setPage(1)} disabled={page === 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="px-2.5 py-1 font-semibold text-gray-700">{page}/{totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Metadata Drawer ──────────────────────────────────────────────── */}
      <MetadataDrawer log={selectedLog} onClose={() => setSelectedLog(null)} />

      {/* ── Warning Modal ────────────────────────────────────────────────── */}
      <AppendOnlyWarningModal isOpen={showWarningModal} onClose={() => setShowWarningModal(false)} />
    </div>
  );
}

