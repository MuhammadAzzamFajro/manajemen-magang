"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiBriefcase, FiBookOpen, FiClipboard } from "react-icons/fi";

const routes = {
  dashboard: "/dashboard/guru",
  dudis: "/dashboard/guru/dudis",
  magang: "/dashboard/guru/magang",
  logbook: "/dashboard/guru/logbook",
};

export default function GuruSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-72 bg-gray-900 border-r border-gray-700 min-h-screen px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <FiHome />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Magang</h3>
            <p className="text-xs text-gray-400">Management</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        <Link
          href={routes.dashboard}
          className={`flex items-center gap-3 p-3 rounded-lg ${
            isActive(routes.dashboard)
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-800 text-gray-300"
          }`}
        >
          <FiHome
            className={`text-xl ${
              isActive(routes.dashboard) ? "text-white" : "text-blue-400"
            }`}
          />
          <span
            className={`font-medium ${
              isActive(routes.dashboard) ? "text-white" : "text-gray-300"
            }`}
          >
            Dashboard
          </span>
        </Link>

        <Link
          href={routes.dudis}
          className={`flex items-center gap-3 p-3 rounded-lg ${
            isActive(routes.dudis)
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-800 text-gray-300"
          }`}
        >
          <FiBriefcase
            className={`text-xl ${
              isActive(routes.dudis) ? "text-white" : "text-blue-400"
            }`}
          />
          <div>
            <div
              className={`font-medium ${
                isActive(routes.dudis) ? "text-white" : "text-gray-300"
              }`}
            >
              DUDI
            </div>
            <div
              className={`text-xs ${
                isActive(routes.dudis) ? "text-white/80" : "text-gray-500"
              }`}
            >
              Dunia Usaha & Industri
            </div>
          </div>
        </Link>

        <Link
          href={routes.magang}
          className={`flex items-center gap-3 p-3 rounded-lg ${
            isActive(routes.magang)
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-800 text-gray-300"
          }`}
        >
          <FiClipboard
            className={`text-xl ${
              isActive(routes.magang) ? "text-white" : "text-blue-400"
            }`}
          />
          <div>
            <div
              className={`font-medium ${
                isActive(routes.magang) ? "text-white" : "text-gray-300"
              }`}
            >
              Magang
            </div>
            <div
              className={`text-xs ${
                isActive(routes.magang) ? "text-white/80" : "text-gray-500"
              }`}
            >
              Data siswa magang
            </div>
          </div>
        </Link>

        <Link
          href={routes.logbook}
          className={`flex items-center gap-3 p-3 rounded-lg ${
            isActive(routes.logbook)
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-800 text-gray-300"
          }`}
        >
          <FiBookOpen
            className={`text-xl ${
              isActive(routes.logbook) ? "text-white" : "text-blue-400"
            }`}
          />
          <div>
            <div
              className={`font-medium ${
                isActive(routes.logbook) ? "text-white" : "text-gray-300"
              }`}
            >
              Logbook
            </div>
            <div
              className={`text-xs ${
                isActive(routes.logbook) ? "text-white/80" : "text-gray-500"
              }`}
            >
              Catatan harian
            </div>
          </div>
        </Link>
      </nav>
    </aside>
  );
}
