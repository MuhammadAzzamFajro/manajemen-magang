"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState(""); // 👈 Ditambahkan
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 👈 Ditambahkan

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true); // mulai loading

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }), // kirim nama, email, password ke api/register
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        setSuccess(data.message);
        setName(""); // kosongin form setelah sukses
        setEmail("");
        setPassword("");
      }
    } catch (err: any) {
      setError("Terjadi kesalahan pada server. Silakan coba lagi.");
    } finally {
      setIsLoading(false); // matikan loading
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Registrasi</h2>

        {error && <p className="bg-red-100 text-red-700 p-2 mb-3 rounded">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-2 mb-3 rounded">{success}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Nama Lengkap</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded" placeholder="John Doe" required />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded" placeholder="example@gmail.com" required />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 rounded" placeholder="Minimal 6 karakter" required />
        </div>

        <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:bg-gray-400">
          {isLoading ? "Mendaftarkan..." : "Daftar"}
        </button>
      </form>
    </div>
  );
}
