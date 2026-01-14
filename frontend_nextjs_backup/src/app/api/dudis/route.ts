import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

// READ: Mengambil semua data DUDI beserta statistik
export async function GET(request: Request) {
  const supabase = createServerSupabaseClient();
  
  try {
    // Ambil statistik secara paralel
    const [{ count: dudiCount }, { count: siswaCount }, { count: magangCount }] = await Promise.all([
      supabase.from('dudis').select('*', { count: 'exact', head: true }),
      supabase.from('siswas').select('*', { count: 'exact', head: true }),
      supabase.from('magangs_siswa').select('*', { count: 'exact', head: true })
    ]);

    const totalDudi = dudiCount || 0;
    const totalSiswa = siswaCount || 0;
    // Pastikan magangCount tidak null sebelum melakukan pembagian
    const rasio = totalDudi > 0 && magangCount ? Math.round(magangCount / totalDudi) : 0;

    // Ambil daftar DUDI
    const { data: dudisData, error: dudisError } = await supabase
      .from('dudis')
      .select('id, nama, alamat, telepon')
      .order('nama', { ascending: true });

    if (dudisError) throw dudisError;

    // Mapping nama kolom agar sesuai dengan frontend (name, address, phone)
    const mappedDudis = dudisData?.map((d: any) => ({
      id: d.id,
      name: d.nama,
      address: d.alamat,
      phone: d.telepon
    })) || [];

    return NextResponse.json({
      stats: { totalDudi, totalSiswa, rasio },
      dudis: mappedDudis
    });
  } catch (error: any) {
    console.error('Error fetching DUDI data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// CREATE: Menambahkan DUDI baru
export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const body = await request.json();

  // Data dari frontend akan memiliki key: nama, alamat, telepon
  const { nama, alamat, telepon } = body;

  if (!nama || !alamat || !telepon) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('dudis')
      .insert([{ nama, alamat, telepon }])
      .select()
      .single(); // .single() untuk mendapatkan data yang baru dibuat

    if (error) throw error;

    return NextResponse.json(data, { status: 201 }); // 201 Created
  } catch (error: any) {
    console.error('Error creating DUDI:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE: Memperbarui data DUDI berdasarkan ID
export async function PATCH(request: Request) {
  const supabase = createServerSupabaseClient();
  const body = await request.json();

  // Data dari frontend akan memiliki key: id, nama, alamat, telepon
  const { id, ...updateData } = body;

  if (!id) {
    return NextResponse.json({ error: 'ID DUDI dibutuhkan' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('dudis')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 }); // 200 OK
  } catch (error: any) {
    console.error('Error updating DUDI:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Menghapus data DUDI berdasarkan ID
export async function DELETE(request: Request) {
    const supabase = createServerSupabaseClient();
    // Ambil ID dari URL query parameter (?id=...)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID DUDI dibutuhkan' }, { status: 400 });
    }

    try {
        const { error } = await supabase
            .from('dudis')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ message: 'DUDI berhasil dihapus' }, { status: 200 }); // 200 OK
    } catch (error: any) {
        console.error('Error deleting DUDI:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}