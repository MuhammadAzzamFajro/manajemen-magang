'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Activity,
  Users,
  UserCheck,
  Building2,
  MapPin,
  Settings,
  ShieldCheck,
  LogOut,
  GraduationCap,
  Layers,
  BookOpen,
  X,
} from 'lucide-react';
import { signOut, getAuthUser } from '@/lib/auth';

interface AdminSidebarProps {
  onCloseMobileMenu?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobileMenu }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  const handleLogout = async () => {
    if (onCloseMobileMenu) onCloseMobileMenu();
    await signOut();
  };

  const navGroups = [
    {
      label: 'OVERVIEW',
      items: [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/monitoring', label: 'Monitoring Global', icon: Activity },
      ],
    },
    {
      label: 'MASTER DATA',
      items: [
        { href: '/admin/guru', label: 'Data Guru', icon: UserCheck },
        { href: '/admin/siswa', label: 'Data Siswa', icon: Users },
        { href: '/admin/dudi', label: 'Data DUDI', icon: Building2 },
        { href: '/admin/jurusan', label: 'Data Jurusan', icon: Layers },
        { href: '/admin/kelas', label: 'Data Kelas', icon: BookOpen },
      ],
    },
    {
      label: 'MANAJEMEN',
      items: [
        { href: '/admin/penempatan', label: 'Penempatan Magang', icon: MapPin },
      ],
    },
    {
      label: 'SISTEM',
      items: [
        { href: '/admin/settings', label: 'Pengaturan Sistem', icon: Settings },
        { href: '/admin/logs', label: 'Log Aktivitas & Audit', icon: ShieldCheck },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white text-slate-600 flex flex-col h-full border-r border-slate-200/80 shrink-0 font-sans shadow-xl lg:shadow-none overflow-hidden">
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#2563eb] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-slate-900 tracking-tight text-base leading-tight">SIMMAS</h1>
            <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
              ADMINISTRATOR
            </p>
          </div>
        </div>
        {/* Close button for mobile drawer */}
        <button
          onClick={onCloseMobileMenu}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-5 space-y-6">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobileMenu}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                      isActive
                        ? 'bg-[#2563eb] text-white font-bold shadow-md shadow-blue-500/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-100 bg-white shrink-0 mt-auto">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0"
              suppressHydrationWarning
            >
              {user?.name ? user.name.split(' ').map((n: any) => n[0]).join('').slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-xs font-bold text-slate-900 truncate leading-tight"
                title={user?.name || 'Administrator'}
                suppressHydrationWarning
              >
                {user?.name || 'Administrator'}
              </p>
              <p
                className="text-[10px] font-medium text-slate-400 truncate mt-0.5"
                suppressHydrationWarning
              >
                Administrator
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Keluar dari Sistem"
            className="w-8 h-8 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors shrink-0 flex items-center justify-center"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
