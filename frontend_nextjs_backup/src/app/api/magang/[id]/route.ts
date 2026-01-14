// app/api/magang/[id]/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

// Helper select string untuk relasi (sama seperti di route.ts)
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


// UPDATE: Memperbarui data Magang berdasarkan ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { id } = params;

  try {
    const body = await request.json();
    const updatePayload: Record<string, any> = {};

    // Menentukan field yang diizinkan untuk diupdate
    if (body.siswa_id !== undefined) updatePayload.siswa_id = body.siswa_id;
    if (body.dudi_id !== undefined) updatePayload.dudi_id = body.dudi_id;
    if (body.guru_pembimbing_id !== undefined) updatePayload.guru_pembimbing_id = body.guru_pembimbing_id; // Ditambahkan
    if (body.judul_magang !== undefined) updatePayload.judul_magang = body.judul_magang; // Ditambahkan
    if (body.deskripsi !== undefined) updatePayload.deskripsi = body.deskripsi; // Ditambahkan
    if (body.tanggal_mulai !== undefined) updatePayload.tanggal_mulai = body.tanggal_mulai;
    if (body.tanggal_selesai !== undefined) updatePayload.tanggal_selesai = body.tanggal_selesai;
    if (body.status !== undefined) updatePayload.status = body.status;

    // Jika tidak ada yang diupdate
    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("magangs_siswa")
      .update(updatePayload)
      .eq("id", id)
      .select(MAGANG_SELECT_STRING)
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("Error updating magang:", err);
    return NextResponse.json({ error: err.message || "Update failed" }, { status: 500 });
  }
}

// DELETE: Menghapus data Magang berdasarkan ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { id } = params;

  try {
    const { error } = await supabase.from("magangs_siswa").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("Error deleting magang:", err);
    return NextResponse.json({ error: err.message || "Delete failed" }, { status: 500 });
  }
}




// import { NextResponse } from "next/server";
// import { createServerSupabaseClient } from "@/lib/supabaseServer";

// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   const supabase = createServerSupabaseClient();
//   const { id } = params;

//   try {
//     const body = await request.json();
//     const updatePayload: Record<string, any> = {};

//     if (body.dudi_id !== undefined) updatePayload.dudi_id = body.dudi_id;
//     if (body.tanggal_mulai !== undefined) updatePayload.tanggal_mulai = body.tanggal_mulai;
//     if (body.tanggal_selesai !== undefined) updatePayload.tanggal_selesai = body.tanggal_selesai;
//     if (body.status !== undefined) updatePayload.status = body.status;

//     // if nothing to update
//     if (Object.keys(updatePayload).length === 0) {
//       return NextResponse.json({ error: "No fields to update" }, { status: 400 });
//     }

//     const { data, error } = await supabase
//       .from("magangs_siswa")
//       .update(updatePayload)
//       .eq("id", id)
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

//     if (error) throw error;

//     return NextResponse.json(data, { status: 200 });
//   } catch (err: any) {
//     console.error("Error updating magang:", err);
//     return NextResponse.json({ error: err.message || "Update failed" }, { status: 500 });
//   }
// }

// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   const supabase = createServerSupabaseClient();
//   const { id } = params;

//   try {
//     const { error } = await supabase.from("magangs_siswa").delete().eq("id", id);

//     if (error) throw error;

//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (err: any) {
//     console.error("Error deleting magang:", err);
//     return NextResponse.json({ error: err.message || "Delete failed" }, { status: 500 });
//   }
// }
