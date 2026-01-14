import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET: Ambil semua data logbook
export async function GET() {
  try {
    const { data, error } = await supabase.from("logbooks").select("*").order("tanggal", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Tambah data logbook baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tanggal, kegiatan, kendala, url_foto } = body;

    if (!tanggal || !kegiatan) {
      return NextResponse.json({ error: "Tanggal dan Kegiatan wajib diisi." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("logbooks")
      .insert([
        {
          siswa_id: 1, // ID = 1 karena ini data dummy, nanti akan diubah sesuai user yang login
          tanggal,
          kegiatan,
          kendala: kendala || null,
          url_foto: url_foto || null,
          status: "Belum Diverifikasi",
        },
      ])
      .select();

    if (error) {
      console.error("Supabase Insert Error:", error);
      throw new Error(error.message);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}


// import { NextResponse } from "next/server";
// import { createServerSupabaseClient } from "@/lib/supabaseServer";
// import { supabase } from "@/lib/supabaseClient";

// // GET: Ambil semua logbook (no login required)
// export async function GET() {
//   const supabase = createServerSupabaseClient();
  
//   try {
//     const { data, error } = await supabase
//       .from("logbooks")
//       .select(`
//         *,
//         siswas(nama)
//       `)
//       .order("tanggal", { ascending: false });

//     if (error) {
//       throw new Error(error.message);
//     }

//     // Transform for frontend
//     const transformedData = data?.map((item: any) => ({
//       id: item.id,
//       siswa_id: item.siswa_id,
//       nama_siswa: item.siswas?.nama || 'Unknown',
//       tanggal: item.tanggal,
//       kegiatan: item.kegiatan,
//       kendala: item.kendala || "-",
//       status: item.status,
//       url_foto: item.url_foto,
//     })) || [];

//     return NextResponse.json(transformedData);
//   } catch (error: any) {
//     console.error('Error fetching logbooks:', error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// // POST: Tambah data logbook baru
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { tanggal, kegiatan, kendala, url_foto } = body;

//     if (!tanggal || !kegiatan) {
//       return NextResponse.json({ error: "Tanggal dan Kegiatan wajib diisi." }, { status: 400 });
//     }

//     const { data, error } = await supabase
//       .from("logbooks")
//       .insert([
//         {
//           siswa_id: body.siswa_id, // Use siswa_id from request body
//           tanggal,
//           kegiatan,
//           kendala: kendala || null,
//           url_foto: url_foto || null,
//           status: "Belum Diverifikasi",
//         },
//       ])
//       .select();

//     if (error) {
//       console.error("Supabase Insert Error:", error);
//       throw new Error(error.message);
//     }

//     return NextResponse.json(data, { status: 201 });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
//   }
// }

// // POST: Tambah data logbook baru untuk siswa yang login
// // export async function POST(req: Request) {
// //   const supabase = createServerSupabaseClient();
  
// //   try {
// //     const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
// //     if (sessionError || !session) {
// //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// //     }

// //     const body = await req.json();
// //     const { tanggal, kegiatan, kendala, url_foto } = body;

// //     if (!tanggal || !kegiatan) {
// //       return NextResponse.json({ error: "Tanggal dan Kegiatan wajib diisi." }, { status: 400 });
// //     }

// //     // Get siswa_id from user_id
// //     const { data: siswa, error: siswaError } = await supabase
// //       .from("siswas")
// //       .select("id")
// //       .eq("user_id", session.user.id)
// //       .single();

// //     if (siswaError || !siswa) {
// //       return NextResponse.json({ error: "Siswa not found" }, { status: 404 });
// //     }

// //     const { data, error } = await supabase
// //       .from("logbooks")
// //       .insert([
// //         {
// //           siswa_id: siswa.id,
// //           tanggal,
// //           kegiatan,
// //           kendala: kendala || null,
// //           url_foto: url_foto || null,
// //           status: "Belum Diverifikasi",
// //         },
// //       ])
// //       .select();

// //     if (error) {
// //       console.error("Supabase Insert Error:", error);
// //       throw new Error(error.message);
// //     }

// //     return NextResponse.json(data, { status: 201 });
// //   } catch (error: any) {
// //     return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
// //   }
// // }
