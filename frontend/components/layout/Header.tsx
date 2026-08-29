'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, LayoutGrid, Menu } from 'lucide-react';
import { getAuthUser } from '@/lib/auth';

interface HeaderProps {
  breadcrumb?: string;
  title: string;
  roleLabel?: string;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, roleLabel, onToggleMobileMenu }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  const initial = user?.name ? user.name.slice(0, 2).toUpperCase() : (roleLabel ? roleLabel.slice(0, 2).toUpperCase() : 'AD');
  const displayName = user?.name || roleLabel || 'Admin';

  return (
    <header className="bg-white border-b border-slate-100 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 font-sans">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden transition-colors"
          title="Buka Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="hidden sm:flex p-1.5 rounded-lg border border-slate-200 text-slate-500">
          <LayoutGrid className="w-4 h-4" />
        </div>
        <h1 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight truncate max-w-[160px] sm:max-w-none">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search Input with Hotkey Pill */}
        <div className="relative hidden md:flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
          <input
            type="text"
            placeholder="Cari..."
            className="w-36 lg:w-44 pl-8 pr-8 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs font-medium focus:outline-none focus:bg-white focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
          <span className="absolute right-2 text-[10px] font-bold text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded text-[9px]">
            ⌘K
          </span>
        </div>

        {/* Bell Notification Icon */}
        <button className="relative p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
        </button>

        {/* User Profile Avatar Pill */}
        <div className="flex items-center gap-2 pl-2">
          <div className="w-7 h-7 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-extrabold text-[11px] shadow-xs shrink-0" suppressHydrationWarning>
            {initial}
          </div>
          <span className="text-xs font-bold text-slate-800 hidden sm:inline-block max-w-[100px] truncate" suppressHydrationWarning>
            {displayName}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline-block" />
        </div>
      </div>
    </header>
  );
};
