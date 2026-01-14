import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = createServerSupabaseClient();
  
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get siswa_id from user_id
    const { data: siswa, error: siswaError } = await supabase
      .from("siswas")
      .select("id")
      .eq("user_id", session.user.id)
      .single();

    if (siswaError || !siswa) {
      return NextResponse.json({ error: "Siswa not found" }, { status: 404 });
    }

    const { data: magang, error: magangError } = await supabase
      .from("magangs_siswa")
      .select("id, tanggal_mulai, tanggal_selesai, status, dudi_id")
      .eq("siswa_id", siswa.id)
      .single();

    if (magangError || !magang) {
      return NextResponse.json({ error: "No magang found for this siswa" }, { status: 404 });
    }

    const { data: dudi, error: dudiError } = await supabase
      .from("dudis")
      .select("nama, alamat, telepon")
      .eq("id", magang.dudi_id)
      .single();

    if (dudiError || !dudi) {
      return NextResponse.json({ error: "DUDI not found" }, { status: 404 });
    }

    // Transform to match expected format
    const dudiInfo = [
      { title: "DUDI Terpilih", value: dudi.nama, icon: "FaBuilding" },
      { title: "Status Magang", value: magang.status, icon: "FaBriefcase" },
      { title: "Durasi Magang", value: `${new Date(magang.tanggal_mulai).toLocaleDateString('id-ID')} - ${new Date(magang.tanggal_selesai).toLocaleDateString('id-ID')}`, icon: "FaCalendar" },
      { title: "Pembimbing Lapangan", value: "Pak Joko", icon: "FaUserTie" }, // Add pembimbing field to magang if needed
    ];

    const dudiTable = [
      {
        no: 1,
        nama: dudi.nama,
        alamat: dudi.alamat,
        bidang: "Teknologi Informasi", // Add bidang_usaha to dudis table if needed
        kontak: dudi.telepon,
      }
    ];

    return NextResponse.json({ dudiInfo, dudiTable });
  } catch (error: any) {
    console.error('Error fetching dudi data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
