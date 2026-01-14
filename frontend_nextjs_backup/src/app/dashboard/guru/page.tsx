"use client";

import { useState, useEffect } from "react";
import { FaUserGraduate, FaIndustry, FaBriefcase, FaBook } from "react-icons/fa";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface MagangRow {
  no: number;
  nama_siswa: string;
  dudi: string;
  periode: string;
  status: string;
}

const GuruDashboard = () => {
  const [stats, setStats] = useState({
    totalSiswa: 0,
    totalDudi: 0,
    totalMagang: 0,
    totalLogbook: 0,
  });
  const [magangData, setMagangData] = useState<MagangRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // === Statistik ===
        const [
          { count: siswaCount },
          { count: dudiCount },
          { count: magangCount },
          { count: logbookCount },
        ] = await Promise.all([
          supabase.from("siswas").select("id", { count: "exact", head: true }),
          supabase.from("dudis").select("id", { count: "exact", head: true }),
          supabase.from("magangs_siswa").select("id", { count: "exact", head: true }),
          supabase.from("logbooks").select("id", { count: "exact", head: true }),
        ]);

        setStats({
          totalSiswa: siswaCount || 0,
          totalDudi: dudiCount || 0,
          totalMagang: magangCount || 0,
          totalLogbook: logbookCount || 0,
        });

        // === Data Magang (singkat) ===
        const { data: magangs, error } = await supabase
          .from("magangs_siswa")
          .select(`
            id,
            status,
            tanggal_mulai,
            tanggal_selesai,
            siswas(nama),
            dudis(nama)
          `)
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) console.error("Error fetch magangs:", error);

        if (magangs) {
          const monthNames: Record<string, string> = {
            "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
            "05": "Mei", "06": "Jun", "07": "Jul", "08": "Agu",
            "09": "Sep", "10": "Okt", "11": "Nov", "12": "Des",
          };

          const mapped: MagangRow[] = magangs.map((m: any, index: number) => {
            const startMonth = m.tanggal_mulai
              ? monthNames[m.tanggal_mulai.slice(5, 7)]
              : "";
            const endMonth = m.tanggal_selesai
              ? monthNames[m.tanggal_selesai.slice(5, 7)]
              : "";

            const periode =
              m.tanggal_mulai && m.tanggal_selesai
                ? `${startMonth} ${m.tanggal_mulai.slice(0, 4)} - ${endMonth} ${m.tanggal_selesai.slice(0, 4)}`
                : "-";

            return {
              no: index + 1,
              nama_siswa: Array.isArray(m.siswas)
                ? m.siswas[0]?.nama || "-"
                : m.siswas?.nama || "-",
              dudi: Array.isArray(m.dudis)
                ? m.dudis[0]?.nama || "-"
                : m.dudis?.nama || "-",
              periode,
              status: m.status || "-",
            };
          });

          setMagangData(mapped);
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-white">Memuat data dashboard...</div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">SMK Negeri 1 Bangil</h1>
        <h2 className="text-xl font-semibold text-gray-300">Dashboard Guru</h2>
        <p className="text-gray-400 mt-2">
          Selamat datang di sistem pelaporan magang siswa
        </p>
      </div>

      {/* Switch */}
      <div className="flex justify-end mb-6">
        <div className="flex gap-2">
          <Link
            href="/dashboard/siswa"
            className="px-4 py-2 bg-white text-gray-800 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            Siswa
          </Link>
          <Link
            href="/dashboard/guru"
            className="px-4 py-2 bg-cyan-500 text-white rounded-md font-medium hover:bg-cyan-600 transition-colors"
          >
            Guru
          </Link>
        </div>
      </div>

      {/* Cards Statistik */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 rounded-xl p-4 border border-blue-500/30 flex items-center justify-between">
          <div>
            <h2 className="text-sm text-blue-300">Total Siswa</h2>
            <p className="text-2xl font-bold text-white">{stats.totalSiswa}</p>
          </div>
          <FaUserGraduate className="text-blue-400 text-3xl" />
        </div>
        <div className="bg-gradient-to-r from-green-900/20 to-green-800/20 rounded-xl p-4 border border-green-500/30 flex items-center justify-between">
          <div>
            <h2 className="text-sm text-green-300">Total DUDI</h2>
            <p className="text-2xl font-bold text-white">{stats.totalDudi}</p>
          </div>
          <FaIndustry className="text-green-400 text-3xl" />
        </div>
        <div className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 rounded-xl p-4 border border-purple-500/30 flex items-center justify-between">
          <div>
            <h2 className="text-sm text-purple-300">Total Magang</h2>
            <p className="text-2xl font-bold text-white">{stats.totalMagang}</p>
          </div>
          <FaBriefcase className="text-purple-400 text-3xl" />
        </div>
        <div className="bg-gradient-to-r from-orange-900/20 to-orange-800/20 rounded-xl p-4 border border-red-900 flex items-center justify-between">
          <div>
            <h2 className="text-sm text-red-500">Total Logbook</h2>
            <p className="text-2xl font-bold text-white">{stats.totalLogbook}</p>
          </div>
          <FaBook className="text-red-500 text-3xl" />
        </div>
      </div>

      {/* Tabel Magang (informasi singkat) */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <FaBriefcase className="mr-2 text-purple-400" /> Magang Terbaru
        </h2>
        {magangData.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-6 text-center text-gray-400">
            Belum ada data magang.
          </div>
        ) : (
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-700 text-gray-200">
              <tr>
                <th className="p-3">No</th>
                <th className="p-3">Nama Siswa</th>
                <th className="p-3">DUDI</th>
                <th className="p-3">Periode</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {magangData.map((row) => (
                <tr key={row.no} className="border-b border-gray-700">
                  <td className="p-3">{row.no}</td>
                  <td className="p-3">{row.nama_siswa}</td>
                  <td className="p-3">{row.dudi}</td>
                  <td className="p-3">{row.periode}</td>
                  <td className="p-3">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default GuruDashboard;
