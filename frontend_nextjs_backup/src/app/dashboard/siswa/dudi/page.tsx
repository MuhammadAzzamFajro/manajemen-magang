"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DudiSiswaPage() {
  const [dudi, setDudi] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDudiForSiswa = async () => {
      // ambil data magang siswa
      const { data: magang, error: magangError } = await supabase
        .from("magangs_siswa")
        .select("dudi_id")
        .eq("siswa_id", 1) // sementara hardcode id siswa 1
        .single();

      if (magangError || !magang) {
        console.error("Magang not found:", magangError);
        setLoading(false);
        return;
      }

      // ambil data dudi berdasarkan dudi_id dari tabel magangs_siswa
      const { data: dudiData, error: dudiError } = await supabase
        .from("dudis")
        .select("*")
        .eq("id", magang.dudi_id)
        .single();

      if (dudiError) {
        console.error("DUDI not found:", dudiError);
      } else {
        setDudi(dudiData);
      }

      setLoading(false);
    };

    fetchDudiForSiswa();
  }, []);

  if (loading) return <p className="text-gray-400">Loading...</p>;

  if (!dudi) return <p className="text-red-400">Data DUDI siswa tidak ditemukan.</p>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Data Dunia Usaha & Industri</h1>
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold">{dudi.nama}</h2>
        <p className="text-gray-300">{dudi.alamat}</p>
        <p className="text-gray-400 mt-2">
          Penanggung Jawab: {dudi.penanggung_jawab} ({dudi.jabatan})
        </p>
        <p className="text-gray-400">Bidang Usaha: {dudi.bidang_usaha}</p>
        <p className="text-gray-400">Email: {dudi.email}</p>
        <p className="text-gray-400">Telepon: {dudi.telepon}</p>
      </div>
    </div>
  );
}
