'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Tindakan',
  message,
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  type = 'danger',
  isLoading = false,
}) => {
  const bgColors = {
    danger: 'bg-rose-50 text-rose-600',
    warning: 'bg-amber-50 text-amber-600',
    info: 'bg-sky-50 text-sky-600',
  };

  const btnColors = {
    danger: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500',
    warning: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
    info: 'bg-sky-600 hover:bg-sky-700 focus:ring-sky-500',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex flex-col items-center text-center">
        <div className={`p-4 rounded-full mb-4 ${bgColors[type]}`}>
          <AlertTriangle className="w-8 h-8" />
        </div>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">{message}</p>

        <div className="flex items-center justify-end w-full gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xl shadow-md transition-all disabled:opacity-50 ${btnColors[type]}`}
          >
            {isLoading ? 'Memproses...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
