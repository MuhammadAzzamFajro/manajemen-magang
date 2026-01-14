  import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("logbooks")
      .select("id, tanggal, kegiatan, kendala, status")
      .order("tanggal", { ascending: false })
      .limit(2);

    if (error) {
      throw new Error(error.message);
    }

    // Transform data to match expected format
    const transformedData = data.map((item: any) => ({
      title: item.kegiatan,
      description: item.kendala || "Tidak ada kendala tercatat",
      date: new Date(item.tanggal).toLocaleDateString('id-ID'),
    }));

    return NextResponse.json(transformedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
