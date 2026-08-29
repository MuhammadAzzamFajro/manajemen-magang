'use client';

import React, { useState } from 'react';
import { GuruSidebar } from "@/components/layout/GuruSidebar";
import { Header } from "@/components/layout/Header";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { usePathname } from "next/navigation";

export default function GuruLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getTitle = () => {
    if (pathname.includes('/guru/dashboard')) return { title: 'Dashboard Guru', breadcrumb: 'Overview' };
    if (pathname.includes('/guru/siswa')) return { title: 'Siswa Bimbingan & Penilaian', breadcrumb: 'Bimbingan' };
    if (pathname.includes('/guru/jurnal')) return { title: 'Validasi Jurnal & Absensi', breadcrumb: 'Bimbingan' };
    if (pathname.includes('/guru/kunjungan')) return { title: 'Kunjungan Lapangan DUDI', breadcrumb: 'Bimbingan' };
    return { title: 'Portal Guru', breadcrumb: 'SIMMAS' };
  };

  const { title, breadcrumb } = getTitle();

  return (
    <RoleGuard allowedRole="guru">
    <div className="flex min-h-screen bg-[#f8fafc] font-sans relative overflow-x-hidden">
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar (Fixed Full Viewport Height inset-y-0) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <GuruSidebar onCloseMobileMenu={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main Container (Padded left by w-64 on Desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 bg-[#f8fafc]">
        <Header
          title={title}
          breadcrumb={breadcrumb}
          roleLabel="GURU PEMBIMBING"
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full bg-[#f8fafc]">
          {children}
        </main>
      </div>
    </div>
    </RoleGuard>
  );
}
