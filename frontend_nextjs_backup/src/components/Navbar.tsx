"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isSiswa = pathname.startsWith('/dashboard/siswa');

  return (
    <header className="w-full bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
      <div className="text-lg font-semibold text-white">
        SMK Negeri 1 Surabaya
      </div>
      <div className="flex-1 max-w-md mx-8">
        <input
          type="text"
          placeholder="Cari logbook, magang..."
          className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          suppressHydrationWarning={true}
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-300">{isSiswa ? "Siswa" : "Guru Pembimbing"}</div>
        <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold cursor-pointer hover:bg-cyan-600">
          {isSiswa ? "S" : "G"}
        </div>
      </div>
    </header>
  );
}
