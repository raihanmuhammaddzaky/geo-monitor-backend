import { db } from '../db/index.js';
import { locations } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const generateUniqueSlug = async (name) => {
    // 1. Ubah ke lowercase, hilangkan karakter non-alphanumeric, dan hapus dash di awal/akhir
    const baseSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    
    let slug = baseSlug;
    let counter = 1;

    // 2. Loop hingga mendapatkan slug yang tidak ada di database
    while (true) {
        const existingLocation = await db.select().from(locations).where(eq(locations.slug, slug));
        
        if (existingLocation.length === 0) {
            break; // Slug unik ditemukan
        }
        
        // Jika sudah ada, tambahkan counter
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
};
