import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = createServerSupabaseClient();
  
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    const [pendingRes, approvedTodayRes, rejectedTodayRes, totalRes] = await Promise.all([
      supabase
        .from("logbooks")
        .select("*", { count: "exact", head: true })
        .eq("status", "Belum Diverifikasi"),
      supabase
        .from("logbooks")
        .select("*", { count: "exact", head: true })
        .eq("status", "Disetujui")
        .gte("tanggal", today),
      supabase
        .from("logbooks")
        .select("*", { count: "exact", head: true })
        .eq("status", "Ditolak")
        .gte("tanggal", today),
      supabase
        .from("logbooks")
        .select("*", { count: "exact", head: true }),
    ]);

    if (pendingRes.error || approvedTodayRes.error || rejectedTodayRes.error || totalRes.error) {
      throw new Error("Error fetching logbook stats");
    }

    const stats = {
      pendingApprovals: pendingRes.count || 0,
      approvedToday: approvedTodayRes.count || 0,
      rejectedToday: rejectedTodayRes.count || 0,
      totalLogbooks: totalRes.count || 0,
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Error fetching logbook stats:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
