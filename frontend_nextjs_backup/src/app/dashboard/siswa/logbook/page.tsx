"use client";

import React, { useState, useEffect, useMemo } from "react";

// --- Tipe Data ---
interface Logbook {
  id: number;
  tanggal: string;
  kegiatan: string;
  kendala: string;
  url_foto?: string;
  status: "Disetujui" | "Ditolak" | "Belum Diverifikasi";
  catatan_guru?: string;
  catatan_dudi?: string;
  created_at: string;
}
type LogbookFormData = Omit<Logbook, "id" | "status" | "created_at" | "catatan_guru" | "catatan_dudi">;

// --- Tipe Data untuk Props Komponen ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}
interface LogbookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LogbookFormData) => void;
  logbook: Logbook | null;
}
interface DetailLogbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  logbook: Logbook | null;
}
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  logbook: Logbook | null;
}

// --- Komponen Ikon ---
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 hover:text-blue-600">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 hover:text-green-600">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);
const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 hover:text-red-600">
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

// --- Komponen Modal (Reusable) ---
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// --- Komponen Modal Form (untuk Tambah & Edit) ---
const LogbookFormModal: React.FC<LogbookFormModalProps> = ({ isOpen, onClose, onSave, logbook }) => {
  const isEditMode = !!logbook;
  const [formData, setFormData] = useState<LogbookFormData>({
    tanggal: new Date().toISOString().split("T")[0],
    kegiatan: "",
    kendala: "",
    url_foto: "",
  });

  useEffect(() => {
    if (isEditMode && logbook) {
      setFormData({
        tanggal: logbook.tanggal.split("T")[0],
        kegiatan: logbook.kegiatan,
        kendala: logbook.kendala || "",
        url_foto: logbook.url_foto || "",
      });
    } else if (!isEditMode) {
      setFormData({
        tanggal: new Date().toISOString().split("T")[0],
        kegiatan: "",
        kendala: "",
        url_foto: "",
      });
    }
  }, [logbook, isEditMode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.kegiatan.trim()) return alert("Kegiatan tidak boleh kosong.");
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Edit Logbook" : "Tambah Logbook"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="tanggal" className="block text-sm font-medium text-gray-600 mb-1">
            Tanggal
          </label>
          <input type="date" id="tanggal" name="tanggal" value={formData.tanggal} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="kegiatan" className="block text-sm font-medium text-gray-600 mb-1">
            Kegiatan
          </label>
          <textarea
            id="kegiatan"
            name="kegiatan"
            rows={3}
            value={formData.kegiatan}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Jelaskan kegiatan yang Anda lakukan..."
          ></textarea>
        </div>
        <div>
          <label htmlFor="kendala" className="block text-sm font-medium text-gray-600 mb-1">
            Kendala
          </label>
          <textarea
            id="kendala"
            name="kendala"
            rows={3}
            value={formData.kendala}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Jelaskan kendala yang Anda hadapi (jika ada)..."
          ></textarea>
        </div>
        <div>
          <label htmlFor="url_foto" className="block text-sm font-medium text-gray-600 mb-1">
            URL Foto
          </label>
          <input
            type="text"
            id="url_foto"
            name="url_foto"
            value={formData.url_foto}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://..."
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 mt-2">
          {isEditMode ? "Simpan Perubahan" : "Tambah Logbook"}
        </button>
      </form>
    </Modal>
  );
};

// --- Komponen Modal Detail ---
const DetailLogbookModal: React.FC<DetailLogbookModalProps> = ({ isOpen, onClose, logbook }) => {
  if (!isOpen || !logbook) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Logbook">
      <div className="space-y-4 text-gray-700">
        <div>
          <strong className="font-semibold text-gray-900 block">Tanggal:</strong> {new Date(logbook.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
        </div>
        <div>
          <strong className="font-semibold text-gray-900 block">Kegiatan:</strong> <p className="mt-1">{logbook.kegiatan}</p>
        </div>
        <div>
          <strong className="font-semibold text-gray-900 block">Kendala:</strong> <p className="mt-1">{logbook.kendala || "-"}</p>
        </div>
        <div>
          <strong className="font-semibold text-gray-900 block">Status:</strong> {logbook.status}
        </div>
        <div className="border-t pt-4">
          <strong className="font-semibold text-gray-900 block mb-2">Catatan Verifikasi:</strong>
          {logbook.catatan_guru && (
            <p>
              <strong className="font-medium">Guru:</strong> {logbook.catatan_guru}
            </p>
          )}
          {logbook.catatan_dudi && (
            <p className="mt-1">
              <strong className="font-medium">DUDI:</strong> {logbook.catatan_dudi}
            </p>
          )}
          {!logbook.catatan_guru && !logbook.catatan_dudi && <p className="text-gray-500 italic">Belum ada catatan.</p>}
        </div>
      </div>
    </Modal>
  );
};

// --- Komponen Modal Konfirmasi Hapus ---
const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, logbook }) => {
  if (!isOpen || !logbook) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Konfirmasi Hapus">
      <p className="text-gray-600">
        Apakah Anda yakin ingin menghapus logbook untuk tanggal <strong className="font-semibold">{new Date(logbook.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long" })}</strong>? Aksi ini tidak dapat dibatalkan.
      </p>
      <div className="flex justify-end gap-4 mt-8">
        <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold">
          Batal
        </button>
        <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold">
          Ya, Hapus
        </button>
      </div>
    </Modal>
  );
};

// --- Komponen Utama Halaman Logbook ---
export default function LogbookPage() {
  const [logbooks, setLogbooks] = useState<Logbook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalState, setModalState] = useState<{
    add: boolean;
    edit: Logbook | null;
    detail: Logbook | null;
    delete: Logbook | null;
  }>({ add: false, edit: null, detail: null, delete: null });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  const fetchLogbooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/logbooks");
      if (!response.ok) throw new Error("Gagal mengambil data logbook");
      const data = await response.json();
      const simulatedData = data.map((item: any, index: number) => ({
        ...item,
        status: item.status || ["Belum Diverifikasi", "Disetujui", "Ditolak"][index % 3],
        catatan_guru: index % 3 === 1 ? "Bagus, lanjutkan dengan implementasi" : index % 3 === 2 ? "Perbaiki deskripsi kegiatan, terlalu singkat" : null,
        catatan_dudi: index % 3 === 1 ? "Desain sudah sesuai dengan brief yang diberikan" : index % 3 === 2 ? "Kurang detail dalam menjelaskan langkah-langkah" : null,
      }));
      setLogbooks(simulatedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogbooks();
  }, []);

  const handleSave = async (formData: LogbookFormData) => {
    const isEditMode = !!modalState.edit;
    const url = isEditMode ? `/api/logbooks/${modalState.edit!.id}` : "/api/logbooks";
    const method = isEditMode ? "PUT" : "POST";
    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`Gagal ${isEditMode ? "memperbarui" : "menambahkan"} logbook`);
      }
      await response.json();
      setModalState({ add: false, edit: null, detail: null, delete: null });
      fetchLogbooks();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  const handleDelete = async () => {
    if (!modalState.delete) return;
    try {
      const response = await fetch(`/api/logbooks/${modalState.delete.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Gagal menghapus logbook");
      fetchLogbooks();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setModalState({ add: false, edit: null, detail: null, delete: null });
    }
  };

  const filteredLogbooks = useMemo(() => {
    return logbooks.filter((log) => {
      if (statusFilter !== "Semua" && log.status !== statusFilter) return false;
      const search = searchTerm.toLowerCase();
      return log.kegiatan.toLowerCase().includes(search) || (log.kendala && log.kendala.toLowerCase().includes(search));
    });
  }, [logbooks, searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Disetujui":
        return "bg-green-100 text-green-800";
      case "Ditolak":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    // STRUKTUR BARU: Gunakan React Fragment <> sebagai root
    <>
      {/* KONTEN UTAMA HALAMAN */}
      <div className="p-4 md:p-8 font-sans">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Logbook Magang Saya</h1>
          <p className="text-gray-600 mt-1">Catat kegiatan harian dan kendala yang Anda hadapi selama magang</p>
        </header>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Daftar Logbook Harian</h2>
            <button
              onClick={() => setModalState((prev) => ({ ...prev, add: true }))}
              className="w-full md:w-auto bg-blue-600 text-white font-bold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition duration-300 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Tambah Logbook</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Cari kegiatan atau kendala..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option>Semua</option>
              <option>Disetujui</option>
              <option>Ditolak</option>
              <option>Belum Diverifikasi</option>
            </select>
          </div>
          <div className="space-y-4">
            {isLoading && <p className="text-center py-8 text-gray-500">Memuat data...</p>}
            {error && <p className="text-center py-8 text-red-500">{error}</p>}
            {!isLoading && !error && (
              <>
                {filteredLogbooks.map((log) => {
                  const date = new Date(log.tanggal);
                  const day = date.getDate();
                  const month = date.toLocaleDateString("id-ID", { month: "long" });
                  const year = date.getFullYear();
                  return (
                    <div key={log.id} className="flex flex-col md:flex-row items-start gap-y-3 gap-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50 hover:bg-white transition-all duration-200">
                      <div className="flex items-center gap-4 w-full md:w-44 flex-shrink-0">
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                        </div>
                        <div className="text-sm">
                          <p className="text-2xl font-bold text-gray-800">{day}</p>
                          <p className="text-gray-600 -mt-1">{`${month} ${year}`}</p>
                          <p className="text-xs text-gray-500 mt-2">{log.url_foto ? "Foto tersedia" : "Foto tidak ada"}</p>
                        </div>
                      </div>
                      <div className="flex-grow w-full border-t md:border-t-0 md:border-l border-gray-200 pt-3 md:pt-0 md:pl-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-grow">
                            <p className="text-gray-700 leading-relaxed">
                              <strong className="font-semibold text-gray-900">Kegiatan:</strong> {log.kegiatan}
                            </p>
                            <p className="text-gray-700 leading-relaxed mt-2">
                              <strong className="font-semibold text-gray-900">Kendala:</strong> {log.kendala || "-"}
                            </p>
                          </div>
                          <div className="flex-shrink-0 ml-4">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusBadge(log.status)}`}>{log.status}</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200/80 space-y-2 text-sm">
                          {!log.catatan_guru && !log.catatan_dudi && <div className="text-gray-400 italic">Belum ada catatan verifikasi.</div>}
                          {log.catatan_guru && (
                            <p className="text-gray-600">
                              <strong className="font-semibold text-gray-800">Guru:</strong> {log.catatan_guru}
                            </p>
                          )}
                          {log.catatan_dudi && (
                            <p className="mt-1">
                              <strong className="font-semibold text-gray-800">DUDI:</strong> {log.catatan_dudi}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-end md:justify-start gap-2 w-full md:w-auto md:border-l border-gray-200 pt-3 md:pt-0 md:pl-4">
                        <button onClick={() => setModalState((prev) => ({ ...prev, detail: log }))} title="Lihat Detail" className="p-2 rounded-md hover:bg-gray-200">
                          <EyeIcon />
                        </button>
                        <button onClick={() => setModalState((prev) => ({ ...prev, edit: log }))} title="Edit" className="p-2 rounded-md hover:bg-gray-200">
                          <EditIcon />
                        </button>
                        <button onClick={() => setModalState((prev) => ({ ...prev, delete: log }))} title="Hapus" className="p-2 rounded-md hover:bg-gray-200">
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {filteredLogbooks.length === 0 && <p className="text-center py-8 text-gray-500">Tidak ada data logbook yang cocok.</p>}
              </>
            )}
          </div>
        </div>
      </div>

      {/* RENDER SEMUA MODAL  */}
      <LogbookFormModal isOpen={modalState.add || !!modalState.edit} onClose={() => setModalState({ add: false, edit: null, detail: null, delete: null })} onSave={handleSave} logbook={modalState.edit} />
      <DetailLogbookModal isOpen={!!modalState.detail} onClose={() => setModalState((prev) => ({ ...prev, detail: null }))} logbook={modalState.detail} />
      <ConfirmDeleteModal isOpen={!!modalState.delete} onClose={() => setModalState((prev) => ({ ...prev, delete: null }))} onConfirm={handleDelete} logbook={modalState.delete} />
    </>
  );
}