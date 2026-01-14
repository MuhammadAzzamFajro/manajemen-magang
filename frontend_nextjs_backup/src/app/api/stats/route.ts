import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const [siswaRes, dudiRes, magangRes, logbookRes] = await Promise.all([
      supabase.from("siswas").select("*", { count: "exact", head: true }),
      supabase.from("dudis").select("*", { count: "exact", head: true }),
      supabase.from("magangs_siswa").select("*", { count: "exact", head: true }),
      supabase.from("logbooks").select("*", { count: "exact", head: true }),
    ]);

    if (siswaRes.error || dudiRes.error || magangRes.error || logbookRes.error) {
      throw new Error("Error fetching stats");
    }

    const stats = {
      totalSiswa: siswaRes.count || 0,
      totalDudi: dudiRes.count || 0,
      totalMagang: magangRes.count || 0,
      totalLogbook: logbookRes.count || 0,
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
