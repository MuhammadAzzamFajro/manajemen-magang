'use client';

import React, { useState } from 'react';
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Header } from "@/components/layout/Header";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getTitle = () => {
    if (pathname.includes('/admin/dashboard')) return { title: 'Dashboard', breadcrumb: 'Overview' };
    if (pathname.includes('/admin/monitoring')) return { title: 'Monitoring Global', breadcrumb: 'Overview' };
    if (pathname.includes('/admin/guru')) return { title: 'Data Guru Pembimbing', breadcrumb: 'Master Data' };
    if (pathname.includes('/admin/siswa')) return { title: 'Data Siswa Magang', breadcrumb: 'Master Data' };
    if (pathname.includes('/admin/dudi')) return { title: 'Data Mitra DUDI', breadcrumb: 'Master Data' };
    if (pathname.includes('/admin/penempatan')) return { title: 'Penempatan Magang', breadcrumb: 'Manajemen' };
    if (pathname.includes('/admin/settings')) return { title: 'Pengaturan Sistem', breadcrumb: 'Sistem' };
    if (pathname.includes('/admin/logs')) return { title: 'Log Aktivitas & Audit', breadcrumb: 'Sistem' };
    return { title: 'Dashboard', breadcrumb: 'SIMMAS' };
  };

  const { title, breadcrumb } = getTitle();

  return (
    <RoleGuard allowedRole="admin">
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
        <AdminSidebar onCloseMobileMenu={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main Container (Padded left by w-64 on Desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 bg-[#f8fafc]">
        <Header
          title={title}
          breadcrumb={breadcrumb}
          roleLabel="ADMINISTRATOR"
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