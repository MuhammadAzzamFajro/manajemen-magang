"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MagangPage() {
  const [siswas, setSiswas] = useState<any[]>([]);
  const [dudis, setDudis] = useState<any[]>([]);
  const [gurus, setGurus] = useState<any[]>([]);
  const [magangs, setMagangs] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    siswa_id: "",
    dudi_id: "",
    guru_pembimbing_id: "",
    judul_magang: "",
    deskripsi: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    status: "Pending",
  });

  // ambil data dari supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data: siswaData } = await supabase.from("siswas").select("id, nama");
      setSiswas(siswaData || []);

      const { data: dudiData } = await supabase.from("dudis").select("id, nama");
      setDudis(dudiData || []);

      const { data: guruData } = await supabase.from("guru").select("id, name");
      setGurus(guruData || []);

      const response = await fetch("/api/magang");
      if (response.ok) {
        const magangData = await response.json();
        setMagangs(magangData || []);
      }
    };

    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      siswa_id: "",
      dudi_id: "",
      guru_pembimbing_id: "",
      judul_magang: "",
      deskripsi: "",
      tanggal_mulai: "",
      tanggal_selesai: "",
      status: "Pending",
    });
    setEditingId(null);
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      siswa_id: parseInt(formData.siswa_id),
      dudi_id: parseInt(formData.dudi_id),
      guru_pembimbing_id: parseInt(formData.guru_pembimbing_id),
      judul_magang: formData.judul_magang,
      deskripsi: formData.deskripsi,
      tanggal_mulai: formData.tanggal_mulai,
      tanggal_selesai: formData.tanggal_selesai,
      status: formData.status,
    };

    try {
      let response: Response;
      if (editingId) {
        response = await fetch(`/api/magang/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch("/api/magang", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menyimpan data magang");
      }

      resetForm();
      setShowModal(false);

      const refetchResponse = await fetch("/api/magang");
      if (refetchResponse.ok) {
        const magangData = await refetchResponse.json();
        setMagangs(magangData || []);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        `Terjadi kesalahan: ${
          error instanceof Error ? error.message : "Cek konsol"
        }`
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus data ini?")) return;

    try {
      const response = await fetch(`/api/magang/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menghapus data magang");
      }

      const refetchResponse = await fetch("/api/magang");
      if (refetchResponse.ok) {
        const magangData = await refetchResponse.json();
        setMagangs(magangData || []);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      alert(
        `Terjadi kesalahan: ${
          error instanceof Error ? error.message : "Cek konsol"
        }`
      );
    }
  };

  const handleEdit = (magang: any) => {
    setEditingId(magang.id);
    setFormData({
      siswa_id: magang.siswa_id?.toString() || "",
      dudi_id: magang.dudi_id?.toString() || "",
      guru_pembimbing_id: magang.guru_pembimbing_id?.toString() || "",
      judul_magang: magang.judul_magang,
      deskripsi: magang.deskripsi,
      tanggal_mulai: magang.tanggal_mulai,
      tanggal_selesai: magang.tanggal_selesai,
      status: magang.status,
    });
    setShowModal(true);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">📋 Daftar Magang</h2>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-semibold shadow hover:opacity-90 text-sm"
        >
          ➕ Tambah Magang
        </button>
      </div>

      {/* tabel */}
      <div className="bg-gray-800/80 rounded-2xl shadow-xl p-4 text-sm">
        <table className="w-full text-white border-collapse">
          <thead>
            <tr className="bg-gray-700 text-xs">
              <th className="p-2">Siswa</th>
              <th className="p-2">DUDI</th>
              <th className="p-2">Guru</th>
              <th className="p-2">Judul</th>
              <th className="p-2">Status</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {magangs.map((m) => (
              <tr key={m.id} className="border-t border-gray-600 text-xs">
                <td className="p-2">{m.siswas?.nama}</td>
                <td className="p-2">{m.dudis?.nama}</td>
                <td className="p-2">{m.guru?.name}</td>
                <td className="p-2">{m.judul_magang}</td>
                <td className="p-2">{m.status}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(m)}
                    className="px-2 py-1 rounded bg-yellow-500 text-black text-xs"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="px-2 py-1 rounded bg-red-500 text-white text-xs"
                  >
                    🗑️ Hapus
                  </button>
                </td>
              </tr>
            ))}
            {magangs.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-400">
                  Belum ada data magang
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* modal form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-2">
          <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-4">
            <h2 className="text-lg font-bold text-white mb-3 text-center">
              {editingId ? "✏️ Edit Magang" : "➕ Tambah Magang"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              {/* siswa */}
              <label className="block text-gray-300 text-xs">Siswa</label>
              <select
                name="siswa_id"
                value={formData.siswa_id}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-900 text-white text-sm"
                required
              >
                <option value="">-- Pilih Siswa --</option>
                {siswas.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama}
                  </option>
                ))}
              </select>

              {/* dudi */}
              <label className="block text-gray-300 text-xs">DUDI</label>
              <select
                name="dudi_id"
                value={formData.dudi_id}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-900 text-white text-sm"
                required
              >
                <option value="">-- Pilih DUDI --</option>
                {dudis.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nama}
                  </option>
                ))}
              </select>

              {/* guru */}
              <label className="block text-gray-300 text-xs">Guru</label>
              <select
                name="guru_pembimbing_id"
                value={formData.guru_pembimbing_id}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-900 text-white text-sm"
                required
              >
                <option value="">-- Pilih Guru --</option>
                {gurus.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>

              {/* judul */}
              <label className="block text-gray-300 text-xs">Judul Magang</label>
              <input
                type="text"
                name="judul_magang"
                value={formData.judul_magang}
                onChange={handleChange}
                placeholder="Judul"
                className="w-full p-2 rounded bg-gray-900 text-white text-sm"
                required
              />

              {/* deskripsi */}
              <label className="block text-gray-300 text-xs">Deskripsi</label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                placeholder="Deskripsi"
                className="w-full p-2 rounded bg-gray-900 text-white text-sm"
              />

              {/* tanggal */}
              <label className="block text-gray-300 text-xs">
                Tanggal Mulai / Selesai
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  name="tanggal_mulai"
                  value={formData.tanggal_mulai}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-900 text-white text-sm"
                  required
                />
                <input
                  type="date"
                  name="tanggal_selesai"
                  value={formData.tanggal_selesai}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-900 text-white text-sm"
                  required
                />
              </div>

              {/* status */}
              <label className="block text-gray-300 text-xs">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-900 text-white text-sm"
                required
              >
                <option value="Pending">Pending</option>
                <option value="Aktif">Aktif</option>
                <option value="Selesai">Selesai</option>
              </select>

              {/* tombol */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1 rounded bg-gray-600 text-white text-xs"
                >
                  ❌ Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-blue-600 text-white text-xs"
                >
                  {editingId ? "💾 Simpan" : "➕ Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
