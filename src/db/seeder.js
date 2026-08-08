import { db } from './index.js';
import { users, locationCategories, locations } from './schema.js';
import bcrypt from 'bcrypt';

async function runSeeder() {
  console.log('Menjalankan seeder...');
  
  try {
    // 1. Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('password123', saltRounds);

    // 2. Insert Users (1 Admin, 1 Worker)
    await db.insert(users).values([
      {
        name: 'Budi Admin',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin',
      },
      {
        name: 'Joko Pekerja',
        email: 'worker@test.com',
        password: hashedPassword,
        role: 'worker',
      }
    ]).onConflictDoNothing();
    console.log('✅ Berhasil membuat 2 akun user (Admin & Worker)');

    // 3. Insert Master Kategori Lokasi
    await db.insert(locationCategories).values([
      { name: 'Jalan Rusak' },
      { name: 'Pohon Tumbang' },
      { name: 'Fasilitas Umum' },
      { name: 'Lampu Jalan Mati' }
    ]).onConflictDoNothing();
    console.log('✅ Berhasil membuat 4 kategori lokasi');

    // 4. Hapus data lokasi lama (opsional untuk dev seeder) dan Insert 5 Lokasi Asli Palembang
    await db.delete(locations);
    
    // Pastikan memasukkan geom { x: longitude, y: latitude } untuk kolom geometry
    await db.insert(locations).values([
      {
        slug: 'jembatan-ampera-palembang',
        name: 'Jembatan Ampera',
        description: 'Jembatan ikonik kota Palembang yang membentang gagah di atas Sungai Musi, menghubungkan daerah Seberang Ulu dan Seberang Ilir.',
        city: 'Palembang',
        categoryId: 3, 
        latitude: -2.9921,
        longitude: 104.7634,
        geom: { x: 104.7634, y: -2.9921 },
        imagePath: 'https://images.unsplash.com/photo-1543832923-44667a44c804?q=80&w=800&auto=format&fit=crop',
        status: 'approved',
        userId: 2, 
      },
      {
        slug: 'monpera-sumsel',
        name: 'Monumen Perjuangan Rakyat (Monpera)',
        description: 'Monumen bersejarah yang berdiri tepat di pusat kota untuk memperingati perjuangan heroik rakyat Sumatera Selatan melawan penjajah.',
        city: 'Palembang',
        categoryId: 3,
        latitude: -2.9898,
        longitude: 104.7615,
        geom: { x: 104.7615, y: -2.9898 },
        imagePath: 'https://images.unsplash.com/photo-1598284693952-4796324b1712?q=80&w=800&auto=format&fit=crop',
        status: 'approved',
        userId: 2,
      },
      {
        slug: 'benteng-kuto-besak-bkb',
        name: 'Benteng Kuto Besak (BKB)',
        description: 'Bangunan keraton bersejarah yang menjadi pusat pemerintahan Kesultanan Palembang abad ke-18. Kini halamannya menjadi plaza ruang publik terbuka.',
        city: 'Palembang',
        categoryId: 3,
        latitude: -2.9912,
        longitude: 104.7593,
        geom: { x: 104.7593, y: -2.9912 },
        imagePath: 'https://images.unsplash.com/photo-1592398457008-568ebba6fcbd?q=80&w=800&auto=format&fit=crop',
        status: 'approved',
        userId: 2,
      },
      {
        slug: 'masjid-agung-sultan-mahmud',
        name: 'Masjid Agung Sultan Mahmud Badaruddin I',
        description: 'Masjid kebanggaan sekaligus terbesar di Kota Palembang dengan arsitektur unik perpaduan gaya Indonesia, Tiongkok, dan Eropa.',
        city: 'Palembang',
        categoryId: 3,
        latitude: -2.9886,
        longitude: 104.7601,
        geom: { x: 104.7601, y: -2.9886 },
        imagePath: 'https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?q=80&w=800&auto=format&fit=crop',
        status: 'approved',
        userId: 2,
      },
      {
        slug: 'jakabaring-sport-city',
        name: 'Stadion Gelora Sriwijaya Jakabaring',
        description: 'Stadion multi-fungsi bertaraf internasional yang terletak di dalam kompleks olahraga raksasa Jakabaring Sport City.',
        city: 'Palembang',
        categoryId: 3,
        latitude: -3.0236,
        longitude: 104.7897,
        geom: { x: 104.7897, y: -3.0236 },
        imagePath: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=800&auto=format&fit=crop',
        status: 'approved',
        userId: 2,
      }
    ]).onConflictDoNothing();
    console.log('✅ Berhasil menanamkan 5 titik lokasi nyata di Palembang beserta gambar Unsplash');

    console.log('🎉 Seeder selesai dengan sukses!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder gagal:', error);
    process.exit(1);
  }
}

runSeeder();
