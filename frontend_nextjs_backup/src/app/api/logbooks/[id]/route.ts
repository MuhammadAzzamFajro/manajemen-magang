import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET: Ambil satu data logbook berdasarkan ID
export async function GET(request: Request) {
  try {
    const urlPath = new URL(request.url).pathname;
    const id = parseInt(urlPath.split("/").pop() || "", 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const { data, error } = await supabase.from("logbooks").select("*").eq("id", id).single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Logbook tidak ditemukan" }, { status: 404 });
      }
      throw new Error(error.message);
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// PUT: Update data logbook berdasarkan ID
export async function PUT(req: Request) {
  try {
    const urlPath = new URL(req.url).pathname;
    const id = parseInt(urlPath.split("/").pop() || "", 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const body = await req.json();
    const { kegiatan, kendala, url_foto, status } = body;

    const { data, error } = await supabase.from("logbooks").update({ kegiatan, kendala, url_foto, status, updated_at: new Date().toISOString() }).eq("id", id).select();

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Logbook tidak ditemukan untuk diupdate" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Hapus data logbook berdasarkan ID
export async function DELETE(request: Request) {
  try {
    const urlPath = new URL(request.url).pathname;
    const id = parseInt(urlPath.split("/").pop() || "", 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID Logbook tidak valid." }, { status: 400 });
    }

    const { error } = await supabase.from("logbooks").delete().eq("id", id);

    if (error) {
      console.error("Supabase Delete Error:", error);
      throw new Error(error.message);
    }

    return NextResponse.json({ message: "Logbook berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}