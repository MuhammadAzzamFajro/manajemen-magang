'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { subscribe, dismiss, type ToastItem } from '@/lib/toast';

const STYLE: Record<ToastItem['type'], { bg: string; icon: React.ReactElement }> = {
  success: { bg: 'bg-emerald-50 border-emerald-200 text-emerald-800', icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" /> },
  error:   { bg: 'bg-rose-50 border-rose-200 text-rose-800', icon: <AlertCircle className="w-5 h-5 text-rose-600" /> },
  info:    { bg: 'bg-sky-50 border-sky-200 text-sky-800', icon: <Info className="w-5 h-5 text-sky-600" /> },
};

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => subscribe(setToasts), []);

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80">
      {toasts.map((t) => {
        const s = STYLE[t.type];
        return (
          <div
            key={t.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg shadow-slate-900/5 ${s.bg}`}
          >
            <span className="shrink-0 mt-0.5">{s.icon}</span>
            <p className="flex-1 text-xs font-medium leading-relaxed min-w-0">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 p-0.5 rounded text-current opacity-50 hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}