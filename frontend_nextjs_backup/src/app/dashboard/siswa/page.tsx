"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardTabs from "@/components/ui/tabs";

export default function SiswaDashboard() {
  const [namaSiswa, setNamaSiswa] = useState<string>("");

  useEffect(() => {
    const fetchSiswa = async () => {
      const { data, error } = await supabase
        .from("siswas")
        .select("nama")
        .eq("id", 1) // sementara hardcode id=1
        .single();

      if (!error && data) {
        setNamaSiswa(data.nama);
      }
    };
    fetchSiswa();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-300 mb-6">
        Selamat datang,{" "}
        <span className="text-cyan-400 font-semibold">{namaSiswa}</span>
      </p>

      {/* Tabs Siswa/Guru */}
      <DashboardTabs />

    </div>
  );
}
