import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient();
  
  try {
    // Get session to identify the current siswa
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch siswa details by user_id
    const { data: siswa, error: siswaError } = await supabase
      .from("siswas")
      .select("id, nama, email, kontak, kelas_id")
      .eq("user_id", session.user.id)
      .single();

    if (siswaError || !siswa) {
      return NextResponse.json({ error: "Siswa not found" }, { status: 404 });
    }

    // Fetch current/active magang for this siswa
    const { data: currentMagang, error: currentError } = await supabase
      .from("magangs_siswa")
      .select(`
        id,
        tanggal_mulai,
        tanggal_selesai,
        status,
        dudi_id,
        dudis!inner(nama),
        pembimbing_lapangan
      `)
      .eq("siswa_id", siswa.id)
      .eq("status", "Aktif")
      .single();

    if (currentError && currentError.code !== "PGRST116") { // PGRST116 is no rows
      throw currentError;
    }

    // Fetch history (all magang for this siswa)
    const { data: history, error: historyError } = await supabase
      .from("magangs_siswa")
      .select(`
        id,
        tanggal_mulai,
        tanggal_selesai,
        status,
        dudi_id,
        dudis!inner(nama)
      `)
      .eq("siswa_id", siswa.id)
      .order("tanggal_mulai", { ascending: false });

    if (historyError) {
      throw historyError;
    }

    const transformedHistory = history?.map((item: any) => ({
      id: item.id,
      periode: `${item.tanggal_mulai} - ${item.tanggal_selesai}`,
      dudi: item.dudis[0]?.nama || 'Unknown',
      status: item.status,
    })) || [];

    return NextResponse.json({
      current: currentMagang ? {
        status: currentMagang.status,
        durasi: `${currentMagang.tanggal_mulai} - ${currentMagang.tanggal_selesai}`,
        dudi: currentMagang.dudis[0]?.nama || 'Unknown',
        pembimbing: currentMagang.pembimbing_lapangan || "Belum ditentukan",
      } : null,
      history: transformedHistory,
      siswa: siswa,
    });
  } catch (error: any) {
    console.error('Error fetching siswa magang data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: siswa } = await supabase
      .from("siswas")
      .select("id")
      .eq("user_id", session.user.id)
      .single();

    if (!siswa) {
      return NextResponse.json({ error: "Siswa not found" }, { status: 404 });
    }

    const body = await request.json();
    const { tanggal_mulai, tanggal_selesai, dudi_id, status } = body;

    const { error } = await supabase
      .from("magangs_siswa")
      .insert({
        siswa_id: siswa.id,
        dudi_id,
        tanggal_mulai,
        tanggal_selesai,
        status: status || "Pending",
      });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating magang:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
