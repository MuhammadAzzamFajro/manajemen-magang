import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("magangs_siswa")
      .select(`
        id,
        siswa_id,
        dudi_id,
        tanggal_mulai,
        tanggal_selesai,
        status,
        siswas!inner(nama),
        dudis!inner(nama, alamat, telepon)
      `)
      .order("tanggal_mulai", { ascending: false })
      .limit(2);

    if (error) {
      throw new Error(error.message);
    }

    // Transform data to match expected format (progress as placeholder calculations)
    const transformedData = data.map((item: any) => {
      const startDate = new Date(item.tanggal_mulai);
      const endDate = new Date(item.tanggal_selesai);
      const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
      const currentDays = (new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24);
      const progressMagang = Math.min(100, Math.round((currentDays / totalDays) * 100)) || 0;
      
      // Placeholder for logbook progress - would need to count logbooks for this magang
      const progressLogbook = 50; // Placeholder

      return {
        nama: item.siswas.nama,
        dudi: item.dudis.nama,
        tanggal_mulai: item.tanggal_mulai,
        tanggal_selesai: item.tanggal_selesai,
        progressMagang,
        progressLogbook,
        dudiDetails: {
          nama: item.dudis.nama,
          alamat: item.dudis.alamat,
          kontak: item.dudis.telepon,
        }
      };
    });

    return NextResponse.json(transformedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
