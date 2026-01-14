"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LogbookGuruPage() {
  const [logbooks, setLogbooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("logbooks")
        .select(
          `
          id,
          tanggal,
          kegiatan,
          kendala,
          jam_mulai,
          jam_selesai,
          status,
          siswas ( nama )
        `
        )
        .order("tanggal", { ascending: false });

      if (error) {
        console.error("Error fetch logbooks:", error);
        setLogbooks([]);
      } else {
        setLogbooks(data || []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const total = logbooks.length;
  const pending = logbooks.filter((l) => l.status === "Pending").length;
  const approved = logbooks.filter((l) => l.status === "Disetujui").length;
  const rejected = logbooks.filter((l) => l.status === "Ditolak").length;

  const filteredLogbooks = logbooks.filter((l) => {
    const matchStatus =
      statusFilter === "Semua" ? true : l.status === statusFilter;
    const matchSearch =
      l.siswas?.nama?.toLowerCase().includes(search.toLowerCase()) ||
      l.kegiatan?.toLowerCase().includes(search.toLowerCase()) ||
      l.kendala?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">
        📘 Manajemen Logbook Magang
      </h1>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-600 rounded-lg p-4 text-center">
          <p className="text-lg font-semibold text-white">Total Logbook</p>
          <p className="text-2xl font-bold text-white">{total}</p>
        </div>
        <div className="bg-yellow-400 rounded-lg p-4 text-center">
          <p className="text-lg font-semibold text-white">Belum Diverifikasi</p>
          <p className="text-2xl font-bold text-white">{pending}</p>
        </div>
        <div className="bg-green-500 rounded-lg p-4 text-center">
          <p className="text-lg font-semibold text-white">Disetujui</p>
          <p className="text-2xl font-bold text-white">{approved}</p>
        </div>
        <div className="bg-red-600 rounded-lg p-4 text-center">
          <p className="text-lg font-semibold text-white">Ditolak</p>
          <p className="text-2xl font-bold text-white">{rejected}</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Cari siswa, kegiatan, atau kendala..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-cyan-500 outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-cyan-500 outline-none"
        >
          <option value="Semua">Semua</option>
          <option value="Pending">Pending</option>
          <option value="Disetujui">Disetujui</option>
          <option value="Ditolak">Ditolak</option>
        </select>
      </div>

      {/* Tabel */}
      <div className="bg-gray-800 rounded-lg overflow-x-auto shadow-lg">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-700 text-gray-200 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Siswa</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Kegiatan</th>
              <th className="px-4 py-3">Kendala</th>
              <th className="px-4 py-3">Jam</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  ⏳ Loading...
                </td>
              </tr>
            ) : filteredLogbooks.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  ❌ Tidak ada data logbook
                </td>
              </tr>
            ) : (
              filteredLogbooks.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-700 hover:bg-gray-700/50"
                >
                  <td className="px-4 py-2 font-medium">
                    {log.siswas?.nama || "-"}
                  </td>
                  <td className="px-4 py-2">{log.tanggal}</td>
                  <td className="px-4 py-2">{log.kegiatan}</td>
                  <td className="px-4 py-2">{log.kendala}</td>
                  <td className="px-4 py-2">
                    {log.jam_mulai} - {log.jam_selesai}
                  </td>
                  <td className="px-4 py-2">
                    {log.status === "Pending" && (
                      <span className="px-2 py-1 text-xs rounded bg-yellow-500 text-black">
                        Pending
                      </span>
                    )}
                    {log.status === "Disetujui" && (
                      <span className="px-2 py-1 text-xs rounded bg-green-500 text-white">
                        Disetujui
                      </span>
                    )}
                    {log.status === "Ditolak" && (
                      <span className="px-2 py-1 text-xs rounded bg-red-500 text-white">
                        Ditolak
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
