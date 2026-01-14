require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function seedUsers() {
  console.log("👨‍🏫 Seeding users (guru pembimbing)...");
  const { error } = await supabase.from("users").insert([
    { id: 1, name: "Pak Andi", email: "andi@example.com" },
    { id: 2, name: "Bu Siti", email: "siti@example.com" },
    { id: 3, name: "Pak Joko", email: "joko@example.com" }
  ]);
  if (error) console.error("❌ Users error:", error);
  else console.log("✅ Users seeded!");
}

async function seedDudis() {
  console.log("🏢 Seeding dudis...");
  const { error } = await supabase.from("dudis").insert([
    { id: 1, nama_dudi: "PT Teknologi Nusantara", alamat: "Jakarta" },
    { id: 2, nama_dudi: "CV Digital Kreatif", alamat: "Bandung" }
  ]);
  if (error) console.error("❌ Dudis error:", error);
  else console.log("✅ Dudis seeded!");
}

async function seedSiswas() {
  console.log("🎓 Seeding siswas...");
  const { error } = await supabase.from("siswas").insert([
    { id: 1, nis: "12345", nama: "Budi", email: "budi@example.com", kontak: "081234567890", kelas_id: 1 },
    { id: 2, nis: "12346", nama: "Siti", email: "siti@example.com", kontak: "081234567891", kelas_id: 2 }
  ]);
  if (error) console.error("❌ Siswas error:", error);
  else console.log("✅ Siswas seeded!");
}

async function seedMagangSiswa() {
  console.log("🛠️ Seeding magangs_siswa...");
  const { error } = await supabase.from("magangs_siswa").insert([
    {
      siswa_id: 1,
      dudi_id: 1,
      guru_pembimbing_id: 1,
      judul_magang: "Aplikasi Absensi Siswa",
      deskripsi: "Membangun sistem absensi berbasis web",
      tanggal_mulai: "2025-01-10",
      tanggal_selesai: "2025-04-10"
    },
    {
      siswa_id: 2,
      dudi_id: 2,
      guru_pembimbing_id: 2,
      judul_magang: "Sistem Informasi Perpustakaan",
      deskripsi: "Membuat sistem informasi untuk manajemen buku",
      tanggal_mulai: "2025-02-01",
      tanggal_selesai: "2025-05-01"
    }
  ]);
  if (error) console.error("❌ Magangs error:", error);
  else console.log("✅ Magangs seeded!");
}

async function main() {
  console.log("🚀 Starting full seeding...");

  await seedUsers();
  await seedDudis();
  await seedSiswas();
  await seedMagangSiswa();

  console.log("🎉 Semua data dummy berhasil dimasukkan!");
}

main();
