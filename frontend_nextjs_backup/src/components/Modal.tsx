"use client";

import React from "react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ show, onClose, title, children }: ModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-gray-800/95 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl backdrop-blur-md">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold transition-colors duration-200 hover:bg-gray-700/50 rounded-full p-1"
          >
            ×
          </button>
        </div>
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
