"use client";

import React, { useState, useEffect } from "react";
import Table from "@/components/Table";
import Modal from "@/components/Modal";
import { supabase } from "@/lib/supabaseClient";
import {
  FaBuilding,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlus,
} from "react-icons/fa";

// Tipe data untuk Mitra DUDI
type Dudi = {
  id: number;
  name: string;
  address: string;
  phone: string;
};

const GuruDudiPage = () => {
  const [dudis, setDudis] = useState<Dudi[]>([]);
  const [filteredDudis, setFilteredDudis] = useState<Dudi[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDudi, setCurrentDudi] = useState<Dudi | null>(null);
  const [formData, setFormData] = useState<Omit<Dudi, "id">>({
    name: "",
    address: "",
    phone: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [totalDudi, setTotalDudi] = useState(0);
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [rasioSiswa, setRasioSiswa] = useState(0);

  // ---------------------------
  // 1. Ambil data dari API
  // ---------------------------
  const fetchDudiData = async () => {
    setLoading(true);
    setStatsLoading(true);
    try {
      const response = await fetch('/api/dudis');
      if (!response.ok) throw new Error('Failed to fetch data');
      const { stats, dudis } = await response.json();

      setTotalDudi(stats.totalDudi);
      setTotalSiswa(stats.totalSiswa);
      setRasioSiswa(stats.rasio);
      setDudis(dudis);
      setFilteredDudis(dudis);
    } catch (err) {
      console.error("Error fetching DUDI data:", err);
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  };

  const dudiStats = [
    { title: "Total DUDI", value: totalDudi.toString(), icon: <FaBuilding /> },
    { title: "Total Siswa", value: totalSiswa.toString(), icon: <FaUserGraduate /> },
    { title: "Rasio Siswa/DUDI", value: rasioSiswa.toString(), icon: <FaChalkboardTeacher /> },
  ];

  useEffect(() => {
    fetchDudiData();
  }, []);

  // ---------------------------
  // 3. Pencarian / Filtering
  // ---------------------------
  useEffect(() => {
    const filtered = dudis.filter(
      (dudi) =>
        dudi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dudi.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDudis(filtered);
  }, [searchTerm, dudis]);

  // ---------------------------
  // 4. Modal + Form Handling
  // ---------------------------
  const handleOpenModal = (dudi: Dudi | null = null) => {
    if (dudi) {
      setIsEditing(true);
      setCurrentDudi(dudi);
      setFormData({
        name: dudi.name,
        address: dudi.address,
        phone: dudi.phone,
      });
    } else {
      setIsEditing(false);
      setCurrentDudi(null);
      setFormData({ name: "", address: "", phone: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentDudi(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------------------
  // 5. CRUD Supabase
  // ---------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Pastikan nama kolom sesuai dengan yang diharapkan oleh API (dan database)
  const submitData = {
    nama: formData.name,
    alamat: formData.address,
    telepon: formData.phone,
  };

  try {
    let response;
    if (isEditing && currentDudi) {
      // Panggil method PATCH untuk update
      response = await fetch('/api/dudis', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentDudi.id, ...submitData }),
      });
    } else {
      // Panggil method POST untuk create
      response = await fetch('/api/dudis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Gagal menyimpan data DUDI');
    }

    fetchDudiData(); // Muat ulang data setelah berhasil
    handleCloseModal();
  } catch (err) {
    console.error("Error saving DUDI:", err);
    // Tambahkan notifikasi error untuk user jika perlu
  }
};

const handleDelete = async (id: number) => {
  if (window.confirm("Apakah Anda yakin ingin menghapus DUDI ini?")) {
    try {
      // Panggil method DELETE dengan ID sebagai query parameter
      const response = await fetch(`/api/dudis?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menghapus DUDI');
      }

      fetchDudiData(); // Muat ulang data setelah berhasil
    } catch (err) {
      console.error("Error deleting DUDI:", err);
      // Tambahkan notifikasi error untuk user jika perlu
    }
  }
};

  // ---------------------------
  // 6. Render
  // ---------------------------
  const tableHeaders = ["Nama", "Kontak", "Alamat", "Aksi"];
  const tableData = filteredDudis.map((d) => ({
    nama: d.name,
    kontak: d.phone,
    alamat: d.address.length > 40 ? d.address.slice(0, 40) + "..." : d.address,
    aksi: (
      <div className="flex gap-2">
        <button
          onClick={() => handleOpenModal(d)}
          className="p-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg text-blue-400 hover:text-blue-300 transition-all duration-200 transform hover:scale-105"
          title="Edit"
        >
          <FaEdit size={16} />
        </button>
        <button
          onClick={() => handleDelete(d.id)}
          className="p-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg text-red-400 hover:text-red-300 transition-all duration-200 transform hover:scale-105"
          title="Hapus"
        >
          <FaTrash size={16} />
        </button>
      </div>
    ),
  }));

  if (loading || statsLoading) {
    return (
      <div className="p-6 text-center text-gray-600">Memuat data DUDI...</div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Manajemen Mitra DUDI
        </h1>
        <p className="text-gray-300">
          Kelola data mitra DUDI untuk program magang
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {dudiStats.map((item, index) => (
          <div key={index} className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-300 mb-1">{item.title}</p>
                <p className="text-3xl font-bold text-white">{item.value}</p>
              </div>
              <div className="p-3 bg-indigo-500/20 rounded-lg">
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Tambah */}
      <div className="flex flex-col sm:flex-row justify-gap items-start sm:items-center mb-6 ">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Cari nama perusahaan atau alamat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-700 bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          onClick={() => handleOpenModal(null)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
        >
          <FaPlus className="text-sm" /> Tambah DUDI
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10 w-full overflow-hidden">
        <div className="p-6">
          {filteredDudis.length === 0 ? (
            <div className="text-center py-12">
              <FaBuilding className="mx-auto text-6xl text-gray-500 mb-4" />
              <p className="text-gray-400 text-lg">Tidak ada data DUDI yang ditemukan.</p>
              <p className="text-gray-500 mt-2">Mulai dengan menambahkan mitra DUDI pertama Anda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table headers={tableHeaders} data={tableData} />
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        show={showModal}
        onClose={handleCloseModal}
        title={isEditing ? "Edit Mitra DUDI" : "Tambah Mitra DUDI"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Nama Perusahaan
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-600 bg-gray-800/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
              placeholder="Masukkan nama perusahaan"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Alamat
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-600 bg-gray-800/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
              placeholder="Masukkan alamat lengkap"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Telepon
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-600 bg-gray-800/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
              placeholder="Masukkan nomor telepon"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-3 bg-gray-600/80 text-white rounded-xl hover:bg-gray-700/80 transition-all duration-300 backdrop-blur-sm border border-gray-500/30"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isEditing ? "Simpan Perubahan" : "Tambah DUDI"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default GuruDudiPage;
