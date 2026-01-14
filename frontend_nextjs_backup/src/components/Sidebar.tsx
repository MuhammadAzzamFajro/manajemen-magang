"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, GraduationCap, BookOpen } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menus = [
    {
      name: "Dashboard",
      desc: "Ringkasan aktivitas",
      href: "/dashboard/siswa",
      icon: <Home size={20} />,
    },
    {
      name: "DUDI",
      desc: "Dunia Usaha & Industri",
      href: "/dashboard/siswa/dudi",
      icon: <Building2 size={20} />,
    },
    {
      name: "Magang",
      desc: "Data magang saya",
      href: "/dashboard/siswa/magang",
      icon: <GraduationCap size={20} />,
    },
    {
      name: "Logbook",
      desc: "Catatan harian",
      href: "/dashboard/siswa/logbook",
      icon: <BookOpen size={20} />,
    },
  ];

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 py-6 shadow-md">
      <h2 className="px-6 text-lg font-semibold text-white mb-8">Portal Siswa</h2>

      <nav className="flex flex-col gap-2 px-4">
        {menus.map((menu) => {
          const isDashboardLink = menu.href === "/dashboard/siswa";
          const active = isDashboardLink ? pathname === menu.href : pathname.startsWith(menu.href);
          return (
            <Link key={menu.name} href={menu.href} className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${active ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30" : "text-gray-300 hover:bg-gray-800"}`}>
              <div className={`transition-colors ${active ? "text-white" : "text-gray-400"}`}>{menu.icon}</div>
              <div>
                <p className="text-sm font-medium">{menu.name}</p>
                <p className="text-xs opacity-75">{menu.desc}</p>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
