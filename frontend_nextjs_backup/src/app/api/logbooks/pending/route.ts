import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = createServerSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from("logbooks")
      .select(`
        id,
        tanggal,
        kegiatan,
        kendala,
        status,
        siswas!inner(nama, nis)
      `)
      .eq("status", "Belum Diverifikasi")
      .order("tanggal", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Transform data to match expected format
    const transformedData = data?.map((item: any) => ({
      id: item.id,
      nama_siswa: item.siswas?.nama || 'Unknown',
      nis: item.siswas?.nis || 'Unknown',
      tanggal: item.tanggal,
      kegiatan: item.kegiatan,
      kendala: item.kendala || "Tidak ada kendala",
      status: item.status,
    })) || [];

    return NextResponse.json(transformedData);
  } catch (error: any) {
    console.error('Error fetching pending logbooks:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
