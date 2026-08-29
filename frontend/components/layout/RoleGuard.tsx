'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';

const roleDashboards: Record<string, string> = {
  admin: '/admin/dashboard',
  guru: '/guru/dashboard',
  siswa: '/siswa/dashboard',
};

export function RoleGuard({
  allowedRole,
  children,
}: {
  allowedRole: 'admin' | 'guru' | 'siswa';
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const user = getAuthUser();
    if (!user?.role) {
      router.replace('/login');
      return;
    }
    if (user.role !== allowedRole) {
      router.replace(roleDashboards[user.role] || '/login');
      return;
    }
    setReady(true);
  }, [allowedRole, router]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-sans">
        <p className="text-xs font-semibold text-slate-400">Memeriksa akses...</p>
      </div>
    );
  }

  return <>{children}</>;
}