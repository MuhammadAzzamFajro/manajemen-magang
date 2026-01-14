// seedMagang.js
const { createClient } = require('@supabase/supabase-js');

// Ganti dengan environment kamu
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedMagang() {
  try {
    // Ambil siswa
    const { data: siswaData, error: siswaError } = await supabase
      .from('siswas')
      .select('id, nis, nama')
      .limit(5);

    if (siswaError) throw siswaError;
    if (!siswaData || siswaData.length === 0) {
      console.log('⚠️ Tidak ada data siswa. Isi tabel siswas dulu.');
      return;
    }

    // Ambil dudi
    const { data: dudiData, error: dudiError } = await supabase
      .from('dudis')
      .select('id, nama')
      .limit(5);

    if (dudiError) throw dudiError;
    if (!dudiData || dudiData.length === 0) {
      console.log('⚠️ Tidak ada data dudi. Isi tabel dudis dulu.');
      return;
    }

    // Buat data magang dummy
    const magangData = [];
    for (let i = 0; i < 5; i++) {
      const randomSiswa = siswaData[Math.floor(Math.random() * siswaData.length)];
      const randomDudi = dudiData[Math.floor(Math.random() * dudiData.length)];

      magangData.push({
        siswa_id: randomSiswa.id,
        dudi_id: randomDudi.id,
        tanggal_mulai: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        tanggal_selesai: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        status: ['Pending', 'Aktif', 'Selesai'][Math.floor(Math.random() * 3)]
      });
    }

    // Insert ke tabel
    const { data, error } = await supabase
      .from('magangs_siswa')
      .insert(magangData);

    if (error) throw error;

    console.log('✅ Berhasil insert data magang:', data);
  } catch (err) {
    console.error('❌ Error seeding magang:', err.message || err);
  }
}

seedMagang();
