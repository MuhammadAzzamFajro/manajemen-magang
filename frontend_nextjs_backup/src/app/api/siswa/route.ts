import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = createServerSupabaseClient();

  try {
    // Ambil data magang terbaru untuk siswa tertentu (contoh: siswa_id = 1)
    const { data, error } = await supabase
      .from("magangs_siswa")
      .select(`
        id,
        siswa_id,
        dudi_id,
        guru_pembimbing_id,
        judul_magang,
        deskripsi,
        tanggal_mulai,
        tanggal_selesai,
        status,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    if (!data || data.length === 0) {
      return NextResponse.json({ current: null, history: [] });
    }

    // current = record paling baru
    const current = {
      status: data[0].status,
      durasi: `${data[0].tanggal_mulai} s/d ${data[0].tanggal_selesai}`,
      dudi: `DUDI #${data[0].dudi_id}`, // nanti bisa join ke tabel dudi
      pembimbing: `Guru #${data[0].guru_pembimbing_id}`, // bisa join juga
    };

    // history = semua record
    const history = data.map((item) => ({
      id: item.id,
      periode: `${item.tanggal_mulai} - ${item.tanggal_selesai}`,
      dudi: `DUDI #${item.dudi_id}`,
      status: item.status,
    }));

    return NextResponse.json({ current, history });
  } catch (error: any) {
    console.error("Error fetching magang data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const supabase = createServerSupabaseClient();

  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from("magangs_siswa")
      .insert([
        {
          siswa_id: body.siswa_id ?? 1, // sementara hardcode siswa_id = 1
          dudi_id: body.dudi_id,
          guru_pembimbing_id: body.guru_pembimbing_id ?? null,
          judul_magang: body.judul_magang ?? "Magang Baru",
          deskripsi: body.deskripsi ?? "",
          tanggal_mulai: body.tanggal_mulai,
          tanggal_selesai: body.tanggal_selesai,
          status: body.status,
        },
      ])
      .select();

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error inserting magang data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
