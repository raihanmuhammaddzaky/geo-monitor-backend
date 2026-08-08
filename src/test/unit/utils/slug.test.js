import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateUniqueSlug } from '../../../utils/slug.js';
import { db } from '../../../db/index.js';

vi.mock('../../../db/index.js', () => ({
    db: {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn()
    }
}));

describe('Util - generateUniqueSlug', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        db.select.mockReturnThis();
        db.from.mockReturnThis();
    });

    it('harus mengembalikan slug tanpa counter jika belum ada di database', async () => {
        db.where.mockResolvedValueOnce([]); // Belum ada

        const slug = await generateUniqueSlug('Jalan Rusak Sekali');
        expect(slug).toBe('jalan-rusak-sekali');
    });

    it('harus menambahkan counter jika slug sudah ada', async () => {
        // Panggilan pertama (tes-slug) ada isinya, panggilan kedua (tes-slug-1) kosong
        db.where
            .mockResolvedValueOnce([{ slug: 'tes-slug' }])
            .mockResolvedValueOnce([]);

        const slug = await generateUniqueSlug('Tes Slug');
        expect(slug).toBe('tes-slug-1');
        expect(db.where).toHaveBeenCalledTimes(2);
    });

    it('harus menghilangkan karakter khusus', async () => {
        db.where.mockResolvedValueOnce([]);
        
        const slug = await generateUniqueSlug('Jalan & Jembatan @$%!');
        expect(slug).toBe('jalan-jembatan');
    });
});
