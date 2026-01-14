// app/api/magang/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

// Helper select string untuk relasi
const MAGANG_SELECT_STRING = `
  id,
  siswa_id,
  dudi_id,
  guru_pembimbing_id,
  judul_magang,
  deskripsi,
  tanggal_mulai,
  tanggal_selesai,
  status,
  siswas!inner(id, nama),
  dudis!inner(id, nama),
  guru!inner(id, name)
`;

// READ: Mengambil semua data Magang
export async function GET() {
  const supabase = createServerSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("magangs_siswa")
      .select(MAGANG_SELECT_STRING)
      .order("tanggal_mulai", { ascending: false });

    if (error) throw error;

    // Transformasi data agar sesuai dengan yang diharapkan di frontend (terutama untuk nested data)
    const transformedData = (data || []).map((item: any) => ({
      ...item, // Salin semua properti (id, judul_magang, deskripsi, status, etc.)
      // Ambil nama dari relasi
      siswa_nama: item.siswas?.nama || "",
      dudi_nama: item.dudis?.nama || "",
      guru_nama: item.guru?.name || "",
    }));

    // Data dikirim dalam bentuk array of objects yang lengkap
    return NextResponse.json(transformedData);
  } catch (err: any) {
    console.error("Error fetching magang:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch" }, { status: 500 });
  }
}

// CREATE: Menambahkan data Magang baru
export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();

  try {
    const body = await request.json();
    const {
      siswa_id,
      dudi_id,
      guru_pembimbing_id, // Ditambahkan
      judul_magang,       // Ditambahkan
      deskripsi,          // Ditambahkan
      tanggal_mulai,
      tanggal_selesai,
      status,
    } = body;

    // Minimal validation
    if (!siswa_id || !dudi_id || !guru_pembimbing_id || !tanggal_mulai) {
      return NextResponse.json({ error: "Siswa, Dudi, Guru, dan Tanggal Mulai wajib diisi." }, { status: 400 });
    }

    // Insert magang
    const { data: inserted, error: insertErr } = await supabase
      .from("magangs_siswa")
      .insert([
        {
          siswa_id,
          dudi_id,
          guru_pembimbing_id,
          judul_magang,
          deskripsi,
          tanggal_mulai,
          tanggal_selesai: tanggal_selesai || null,
          status: status || "Pending",
        },
      ])
      .select(MAGANG_SELECT_STRING)
      .single();

    if (insertErr) throw insertErr;

    return NextResponse.json(inserted, { status: 201 });
  } catch (err: any) {
    console.error("Error creating magang:", err);
    return NextResponse.json({ error: err.message || "Insert failed" }, { status: 500 });
  }
}



// import { NextResponse } from "next/server";
// import { createServerSupabaseClient } from "@/lib/supabaseServer";

// export async function GET() {
//   const supabase = createServerSupabaseClient();

//   try {
//     const { data, error } = await supabase
//       .from("magangs_siswa")
//       .select(`
//         id,
//         siswa_id,
//         dudi_id,
//         tanggal_mulai,
//         tanggal_selesai,
//         status,
//         siswas!inner(id, nama, nis, email, kontak),
//         dudis!inner(id, nama)
//       `)
//       .order("tanggal_mulai", { ascending: false });

//     if (error) throw error;

//     const transformedData = (data || []).map((item: any) => ({
//       id: item.id,
//       nama: item.siswas?.nama || "",
//       nis: item.siswas?.nis || "",
//       email: item.siswas?.email || null,
//       kontak: item.siswas?.kontak || null,
//       kelas: "Unknown",
//       dudi: item.dudis?.[0]?.nama || "Unknown",
//       dudi_id: item.dudi_id,
//       tanggal_mulai: item.tanggal_mulai,
//       tanggal_selesai: item.tanggal_selesai,
//       status: item.status,
//       raw: item, // optional: raw data if butuh
//     }));

//     return NextResponse.json(transformedData);
//   } catch (err: any) {
//     console.error("Error fetching magang:", err);
//     return NextResponse.json({ error: err.message || "Failed to fetch" }, { status: 500 });
//   }
// }

// export async function POST(request: Request) {
//   const supabase = createServerSupabaseClient();

//   try {
//     const body = await request.json();
//     const {
//       siswa_id,
//       nis,
//       nama,
//       email,
//       kontak,
//       dudi_id,
//       tanggal_mulai,
//       tanggal_selesai,
//       status,
//     } = body;

//     // minimal validation
//     if (!dudi_id || !tanggal_mulai) {
//       return NextResponse.json({ error: "dudi_id dan tanggal_mulai wajib diisi" }, { status: 400 });
//     }

//     // resolve siswa_id: pakai siswa_id bila ada, kalau tidak cari berdasarkan NIS lalu buat siswa baru bila perlu
//     let finalSiswaId = siswa_id || null;

//     if (!finalSiswaId) {
//       if (!nis || !nama) {
//         return NextResponse.json({ error: "Jika siswa_id tidak dikirim, kirim nis dan nama siswa" }, { status: 400 });
//       }

//       const { data: found, error: findErr } = await supabase
//         .from("siswas")
//         .select("id")
//         .eq("nis", nis)
//         .maybeSingle();

//       if (findErr) throw findErr;

//       if (found?.id) {
//         finalSiswaId = found.id;
//       } else {
//         const { data: newSiswa, error: insertSiswaErr } = await supabase
//           .from("siswas")
//           .insert([{ nama, nis, email: email || null, kontak: kontak || null }])
//           .select("id")
//           .maybeSingle();

//         if (insertSiswaErr) throw insertSiswaErr;
//         finalSiswaId = newSiswa?.id;
//       }
//     }

//     // finally insert magang
//     const { data: inserted, error: insertErr } = await supabase
//       .from("magangs_siswa")
//       .insert([
//         {
//           siswa_id: finalSiswaId,
//           dudi_id,
//           tanggal_mulai,
//           tanggal_selesai: tanggal_selesai || null,
//           status: status || "Pending",
//         },
//       ])
//       .select(`
//         id,
//         siswa_id,
//         dudi_id,
//         tanggal_mulai,
//         tanggal_selesai,
//         status,
//         siswas!inner(id, nama, nis, email, kontak),
//         dudis!inner(id, nama)
//       `)
//       .single();

//     if (insertErr) throw insertErr;

//     return NextResponse.json(inserted, { status: 201 });
//   } catch (err: any) {
//     console.error("Error creating magang:", err);
//     return NextResponse.json({ error: err.message || "Insert failed" }, { status: 500 });
//   }
// }
