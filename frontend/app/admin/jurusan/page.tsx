'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getJurusans, createJurusan, updateJurusan, deleteJurusan,
} from '@/lib/db';
import {
  Plus, Search, Edit2, Trash2,
  Layers, Users, BookOpen,
} from 'lucide-react';
import { toast } from '@/lib/toast';
import { Modal } from '@/components/ui/Modal';

export default function AdminJurusanPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [nama, setNama] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { data: rawList = [], isLoading } = useQuery({
    queryKey: ['admin-jurusan'],
    queryFn: () => getJurusans(),
    staleTime: 30_000,
  });

  const filtered = useMemo(() => {
    let list = rawList as any[];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(j => j.nama?.toLowerCase().includes(q));
    }
    return list;
  }, [rawList, search]);

  const totalGuru = (rawList as any[]).reduce((sum, j) => sum + (j.guru_count ?? 0), 0);
  const totalKelas = (rawList as any[]).reduce((sum, j) => sum + (j.kelas_count ?? 0), 0);

  const resetForm = () => { setNama(''); setErrorMsg(''); };

  const openAdd = () => { setEditing(null); resetForm(); setIsModalOpen(true); };
  const openEdit = (j: any) => {
    setEditing(j);
    setNama(j.nama || '');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { nama };
      if (editing) return updateJurusan(editing.id, payload);
      return createJurusan(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jurusan'] });
      setIsModalOpen(false);
      toast.success(editing ? 'Jurusan berhasil diperbarui.' : 'Jurusan berhasil ditambahkan.');
      resetForm();
    },
    onError: (e: any) => { setErrorMsg(e.message || 'Gagal menyimpan jurusan.'); toast.error(e.message || 'Gagal menyimpan jurusan.'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteJurusan(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-jurusan'] }); setDeleteTarget(null); toast.success('Jurusan berhasil dihapus.'); },
    onError: (e: any) => toast.error(e.message || 'Gagal menghapus jurusan.'),
  });

  return (
    <div className="p-0 font-sans">
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900 tracking-tight">Data Jurusan</h1>
        <p className="text-xs text-gray-500 mt-1">Kelola daftar jurusan/kompetensi keahlian sekolah.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard icon={<Layers className="w-4 h-4" />} label="Total Jurusan" value={rawList.length} color="bg-indigo-50 text-indigo-600" />
        <StatCard icon={<Users className="w-4 h-4" />} label="Total Guru Terkait" value={totalGuru} color="bg-blue-50 text-blue-600" />
        <StatCard icon={<BookOpen className="w-4 h-4" />} label="Total Kelas Terkait" value={totalKelas} color="bg-emerald-50 text-emerald-600" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari jurusan..."
              className="pl-9 pr-3 py-2 text-xs w-64 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm">
            <Plus className="w-3.5 h-3.5" /> Tambah Jurusan
          </button>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-10 text-center text-xs text-gray-400">Memuat...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-xs text-gray-400">Tidak ada data jurusan.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-5 py-3.5">Nama Jurusan</th>
                  <th className="px-5 py-3.5">Guru</th>
                  <th className="px-5 py-3.5">Kelas</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(j => (
                  <tr key={j.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Layers className="w-4 h-4" />
                        </span>
                        <span className="text-sm font-semibold text-gray-800">{j.nama}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-600">{j.guru_count ?? 0}</td>
                    <td className="px-5 py-4 text-xs text-gray-600">{j.kelas_count ?? 0}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button onClick={() => openEdit(j)} className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(j)} className="p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <Modal isOpen onClose={() => { setIsModalOpen(false); resetForm(); }} title={editing ? 'Ubah Jurusan' : 'Tambah Jurusan'}>
          <form
            onSubmit={e => { e.preventDefault(); saveMutation.mutate(); }}
            className="space-y-4"
          >
            {errorMsg && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{errorMsg}</p>}
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Nama Jurusan</label>
              <input
                value={nama}
                onChange={e => setNama(e.target.value)}
                required
                placeholder="Contoh: Rekayasa Perangkat Lunak"
                className="w-full px-3.5 py-2.5 text-sm font-medium border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">
                Batal
              </button>
              <button type="submit" disabled={saveMutation.isPending} className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                {saveMutation.isPending ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Simpan'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <Modal isOpen onClose={() => setDeleteTarget(null)} title="Hapus Jurusan">
          <div className="text-sm text-gray-600 mb-5">
            Yakin ingin menghapus jurusan <b>{deleteTarget.nama}</b>?
          </div>
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg">
              Batal
            </button>
            <button onClick={() => deleteMutation.mutate(deleteTarget.id)} disabled={deleteMutation.isPending} className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 rounded-lg">
              {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
      <span className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>{icon}</span>
      <div>
        <p className="text-2xl font-black text-gray-900 leading-none">{value}</p>
        <p className="text-[11px] font-semibold text-gray-400 mt-1 uppercase tracking-wide">{label}</p>
      </div>
    </div>
  );
}
