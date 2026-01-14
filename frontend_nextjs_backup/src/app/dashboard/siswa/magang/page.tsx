"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MagangSiswaPage() {
  const [magang, setMagang] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMagangForSiswa = async () => {
      // ambil data magang siswa
      const { data: magang, error } = await supabase
        .from("magangs_siswa")
        .select("*")
        .eq("siswa_id", 1)
        .single();

      if (error) {
        console.error("Error fetching magang:", error);
        setLoading(false);
        return;
      }

      // ambil data guru
      let guru = null;
      if (magang.guru_pembimbing_id) {
        const { data: guruData } = await supabase
          .from("guru")
          .select("id, name")
          .eq("id", magang.guru_pembimbing_id)
          .single();
        guru = guruData;
      }

      // ambil data DUDI
      let dudi = null;
      if (magang.dudi_id) {
        const { data: dudiData } = await supabase
          .from("dudis")
          .select("id, nama, alamat, bidang_usaha")
          .eq("id", magang.dudi_id)
          .single();
        dudi = dudiData;
      }

      // gabungkan
      setMagang({
        ...magang,
        guru_pembimbing: guru,
        dudi: dudi,
      });

      setLoading(false);
    };

    fetchMagangForSiswa();
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-400">Loading...</p>;
  }

  if (!magang) {
    return (
      <p className="p-6 text-red-400">Data Magang siswa tidak ditemukan.</p>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Data Magang Saya</h1>

      <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
        {/* Judul Magang */}
        <h2 className="text-xl font-semibold text-cyan-400">
          {magang.judul_magang}
        </h2>
        <p className="text-gray-300 mb-2">{magang.deskripsi}</p>

        {/* Guru Pembimbing */}
        <p className="text-sm text-gray-400 mb-1">
          Guru Pembimbing:{" "}
          <span className="text-white font-medium">
            {magang.guru_pembimbing?.name || "-"}
          </span>
        </p>

        {/* DUDI Info */}
        <div className="mt-4 border-t border-gray-700 pt-4">
          <h3 className="text-lg font-semibold">DUDI</h3>
          <p className="text-cyan-400 font-medium">{magang.dudi?.nama}</p>
          <p className="text-gray-300">{magang.dudi?.alamat}</p>
          <p className="text-gray-400">
            Bidang Usaha: {magang.dudi?.bidang_usaha}
          </p>
        </div>

        {/* Tanggal & Status */}
        <div className="mt-4 border-t border-gray-700 pt-4">
          <p className="text-sm text-gray-400">
            Mulai: <span className="text-white">{magang.tanggal_mulai}</span>
          </p>
          <p className="text-sm text-gray-400">
            Selesai:{" "}
            <span className="text-white">{magang.tanggal_selesai}</span>
          </p>
          <p className="text-sm text-gray-400">
            Status: <span className="text-cyan-300">{magang.status}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
