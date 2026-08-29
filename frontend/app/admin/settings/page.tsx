'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Save, CheckCircle, AlertTriangle, AppWindow, School, Globe,
} from 'lucide-react';

// ─── API helpers ─────────────────────────────────────────────────────────────
const BASE = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const token = () => (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);

async function fetchSettings() {
  try {
    const res = await fetch(`${BASE()}/admin/settings`, {
      headers: { Authorization: `Bearer ${token()}`, Accept: 'application/json' },
    });
    if (!res.ok) return {};
    const json = await res.json();
    return json.data || json || {};
  } catch {
    return {};
  }
}

async function postSettings(payload: Record<string, any>) {
  const res = await fetch(`${BASE()}/admin/settings`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Gagal menyimpan pengaturan.');
  }
  return res.json();
}

// ─── Tabs definition ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'identitas', label: 'Identitas Aplikasi' },
  { id: 'halaman_depan', label: 'Halaman Depan' },
  { id: 'data_sekolah', label: 'Data Sekolah' },
];

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold animate-in slide-in-from-bottom-5 duration-300 ${
      type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
    }`}>
      {type === 'success'
        ? <CheckCircle className="w-4 h-4 shrink-0" />
        : <AlertTriangle className="w-4 h-4 shrink-0" />
      }
      {message}
    </div>
  );
}

// ─── Field Component ─────────────────────────────────────────────────────────
function Field({
  label, hint, children,
}: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('identitas');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // ── Tab 1: Identitas Aplikasi ─────────────────────────────────────────────
  const [namaAplikasi, setNamaAplikasi] = useState('SIMMAS');
  const [kepanjangan, setKepanjangan] = useState('Sistem Informasi Manajemen Magang Siswa');
  const [deskripsiSingkat, setDeskripsiSingkat] = useState('Platform terpusat pengelolaan magang SMK. Mudah, modern, dan efisien.');

  // ── Tab 2: Halaman Depan ─────────────────────────────────────────────────
  const [judulHero, setJudulHero] = useState('Sistem Magang SMK Terpadu');
  const [deskripsiHero, setDeskripsiHero] = useState('Platform digital untuk pengelolaan program magang siswa SMK secara modern, transparan, dan efisien.');

  // ── Tab 3: Data Sekolah ────────────────────────────────────────────────────
  const [namaSekolah, setNamaSekolah] = useState('SMK Negeri 1 Contoh');
  const [websiteResmi, setWebsiteResmi] = useState('https://smkn1contoh.sch.id');
  const [namaKepalaSekolah, setNamaKepalaSekolah] = useState('');
  const [nipKepala, setNipKepala] = useState('');
  const [alamatSekolah, setAlamatSekolah] = useState('');
  const [nomorTelepon, setNomorTelepon] = useState('');

  // ── Fetch existing settings ────────────────────────────────────────────────
  const { isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: fetchSettings,
    onSuccess: (d: any) => {
      if (!d) return;
      if (d.nama_aplikasi) setNamaAplikasi(d.nama_aplikasi);
      if (d.kepanjangan) setKepanjangan(d.kepanjangan);
      if (d.deskripsi_singkat) setDeskripsiSingkat(d.deskripsi_singkat);
      if (d.judul_hero) setJudulHero(d.judul_hero);
      if (d.deskripsi_hero) setDeskripsiHero(d.deskripsi_hero);
      if (d.nama_sekolah) setNamaSekolah(d.nama_sekolah);
      if (d.website_resmi) setWebsiteResmi(d.website_resmi);
      if (d.nama_kepala_sekolah) setNamaKepalaSekolah(d.nama_kepala_sekolah);
      if (d.nip_kepala) setNipKepala(d.nip_kepala);
      if (d.alamat_sekolah) setAlamatSekolah(d.alamat_sekolah);
      if (d.nomor_telepon) setNomorTelepon(d.nomor_telepon);
    },
  } as any);

  // ── Save mutation ──────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: () => postSettings({
      nama_aplikasi: namaAplikasi,
      kepanjangan,
      deskripsi_singkat: deskripsiSingkat,
      judul_hero: judulHero,
      deskripsi_hero: deskripsiHero,
      nama_sekolah: namaSekolah,
      website_resmi: websiteResmi,
      nama_kepala_sekolah: namaKepalaSekolah,
      nip_kepala: nipKepala,
      alamat_sekolah: alamatSekolah,
      nomor_telepon: nomorTelepon,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      setToast({ message: 'Pengaturan berhasil disimpan!', type: 'success' });
    },
    onError: (e: any) => {
      setToast({ message: e.message || 'Gagal menyimpan pengaturan.', type: 'error' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  return (
    <div className="p-0 font-sans">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="mb-5">
        <h1 className="text-xl font-black text-gray-900">Pengaturan Sistem</h1>
      </div>

      {/* ── Main Card ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

        {/* ── Tab Header ───────────────────────────────────────────────── */}
        <div className="border-b border-gray-200 px-4">
          <nav className="flex gap-0.5 -mb-px">
            {TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* ── Tab Content ──────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="h-3 w-24 bg-gray-100 rounded animate-pulse mb-2" />
                  <div className="h-9 bg-gray-100 rounded-xl animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* ── Tab 1: Identitas Aplikasi ─────────────────────────── */}
              {activeTab === 'identitas' && (
                <div className="space-y-5 max-w-2xl">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Nama Aplikasi" hint="Nama singkat yang tampil di header & sidebar.">
                      <input
                        type="text"
                        value={namaAplikasi}
                        onChange={e => setNamaAplikasi(e.target.value)}
                        placeholder="SIMMAS"
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white transition-colors"
                      />
                    </Field>
                    <Field label="Kepanjangan" hint="Nama lengkap sistem yang tampil di tooltip / about.">
                      <input
                        type="text"
                        value={kepanjangan}
                        onChange={e => setKepanjangan(e.target.value)}
                        placeholder="Sistem Informasi Manajemen Magang Siswa"
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white transition-colors"
                      />
                    </Field>
                  </div>
                  <Field label="Deskripsi Aplikasi" hint="Teks pendek yang mendeskripsikan fungsi aplikasi ini.">
                    <textarea
                      rows={3}
                      value={deskripsiSingkat}
                      onChange={e => setDeskripsiSingkat(e.target.value)}
                      placeholder="Platform terpusat pengelolaan magang SMK..."
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white transition-colors resize-none"
                    />
                  </Field>
                </div>
              )}

              {/* ── Tab 2: Halaman Depan ──────────────────────────────── */}
              {activeTab === 'halaman_depan' && (
                <div className="space-y-5 max-w-2xl">
                  <Field label="Judul Utama Hero" hint="Judul besar yang tampil di bagian atas landing page publik.">
                    <input
                      type="text"
                      value={judulHero}
                      onChange={e => setJudulHero(e.target.value)}
                      placeholder="Sistem Magang SMK Terpadu"
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white transition-colors"
                    />
                  </Field>
                  <Field label="Deskripsi Hero" hint="Paragraf pendek di bawah judul hero yang menjelaskan manfaat sistem.">
                    <textarea
                      rows={4}
                      value={deskripsiHero}
                      onChange={e => setDeskripsiHero(e.target.value)}
                      placeholder="Platform digital untuk pengelolaan program magang siswa SMK..."
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white transition-colors resize-none"
                    />
                  </Field>
                </div>
              )}

              {/* ── Tab 3: Data Sekolah ───────────────────────────────── */}
              {activeTab === 'data_sekolah' && (
                <div className="space-y-5 max-w-2xl">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Nama Sekolah">
                      <input
                        type="text"
                        value={namaSekolah}
                        onChange={e => setNamaSekolah(e.target.value)}
                        placeholder="SMK Negeri 1 Contoh"
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white transition-colors"
                      />
                    </Field>
                    <Field label="Website Resmi">
                      <input
                        type="url"
                        value={websiteResmi}
                        onChange={e => setWebsiteResmi(e.target.value)}
                        placeholder="https://smkn1contoh.sch.id"
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white transition-colors"
                      />
                    </Field>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Nama Kepala Sekolah">
                      <input
                        type="text"
                        value={namaKepalaSekolah}
                        onChange={e => setNamaKepalaSekolah(e.target.value)}
                        placeholder="Drs. Budi Santoso, M.Pd."
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white transition-colors"
                      />
                    </Field>
                    <Field label="NIP Kepala Sekolah">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={nipKepala}
                        onChange={e => setNipKepala(e.target.value.replace(/\D/g, ''))}
                        placeholder="18 digit angka NIP"
                        maxLength={18}
                        className="w-full px-3.5 py-2.5 text-sm font-mono border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white transition-colors"
                      />
                    </Field>
                  </div>
                  <Field label="Alamat Lengkap">
                    <textarea
                      rows={3}
                      value={alamatSekolah}
                      onChange={e => setAlamatSekolah(e.target.value)}
                      placeholder="Jl. Pendidikan No. 1, Kota..."
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white transition-colors resize-none"
                    />
                  </Field>
                  <Field label="Nomor Telepon">
                    <input
                      type="text"
                      inputMode="tel"
                      value={nomorTelepon}
                      onChange={e => setNomorTelepon(e.target.value.replace(/[^\d+\-\s()]/g, ''))}
                      placeholder="(031) 123-4567"
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white transition-colors"
                    />
                  </Field>
                </div>
              )}
            </>
          )}

          {/* ── Save Button ──────────────────────────────────────────── */}
          <div className="mt-8 flex justify-end border-t border-gray-100 pt-5">
            <button
              type="submit"
              disabled={saveMutation.isPending || isLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-blue-200"
            >
              {saveMutation.isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Pengaturan
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── Toast Notification ────────────────────────────────────────────── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
