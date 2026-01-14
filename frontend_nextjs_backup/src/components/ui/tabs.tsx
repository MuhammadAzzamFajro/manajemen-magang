"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardTabs() {
  const router = useRouter();
  const pathname = usePathname() || "";
  const active = pathname.includes("/dashboard/siswa") ? "siswa" : "guru";

  return (
    <div className="w-full">
      <div className="grid w-[200px] grid-cols-2 gap-2">
        <button
          onClick={() => router.push("/dashboard/siswa")}
          className={`px-3 py-1.5 rounded-sm text-sm font-medium transition ${
            active === "siswa"
              ? "bg-cyan-500 text-white shadow-sm"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Siswa
        </button>

        <button
          onClick={() => router.push("/dashboard/guru")}
          className={`px-3 py-1.5 rounded-sm text-sm font-medium transition ${
            active === "guru"
              ? "bg-cyan-500 text-white shadow-sm"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Guru
        </button>
      </div>
    </div>
  );
}