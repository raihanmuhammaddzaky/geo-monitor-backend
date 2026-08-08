import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllCategories, createCategory, deleteCategory, updateCategory } from '../../../services/category.js';
import { db } from '../../../db/index.js';

// Memalsukan database builder Drizzle
vi.mock('../../../db/index.js', () => ({
    db: {
        select: vi.fn().mockReturnThis(),
        from: vi.fn(),
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockReturnThis(),
        returning: vi.fn(),
        delete: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
    }
}));

describe('Service - Category', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getAllCategories: harus mengembalikan array kategori', async () => {
        const mockCategories = [{ id: 1, name: 'Bencana Alam' }, { id: 2, name: 'Kriminal' }];
        db.from.mockResolvedValue(mockCategories);

        const result = await getAllCategories();
        expect(result).toEqual(mockCategories);
        expect(db.select).toHaveBeenCalled();
        expect(db.from).toHaveBeenCalled();
    });

    it('createCategory: harus mengembalikan kategori baru', async () => {
        const mockCategory = { id: 1, name: 'Bencana Alam' };
        db.returning.mockResolvedValue([mockCategory]);

        const result = await createCategory('Bencana Alam');
        expect(result).toEqual(mockCategory);
        expect(db.insert).toHaveBeenCalled();
        expect(db.values).toHaveBeenCalledWith({ name: 'Bencana Alam' });
    });

    it('deleteCategory: harus mengembalikan kategori yang dihapus', async () => {
        const mockCategory = { id: 1, name: 'Bencana Alam' };
        db.returning.mockResolvedValue([mockCategory]);

        const result = await deleteCategory(1);
        expect(result).toEqual(mockCategory);
        expect(db.delete).toHaveBeenCalled();
        expect(db.where).toHaveBeenCalled();
    });

    it('deleteCategory: harus mengembalikan undefined jika ID tidak ditemukan', async () => {
        db.returning.mockResolvedValue([]);

        const result = await deleteCategory(99);
        expect(result).toBeUndefined();
    });

    it('updateCategory: harus mengembalikan kategori yang diperbarui', async () => {
        const mockCategory = { id: 1, name: 'Bencana Alam Baru' };
        db.returning.mockResolvedValue([mockCategory]);

        const result = await updateCategory(1, 'Bencana Alam Baru');
        expect(result).toEqual(mockCategory);
        expect(db.update).toHaveBeenCalled();
        expect(db.set).toHaveBeenCalledWith({ name: 'Bencana Alam Baru' });
    });

    it('updateCategory: harus mengembalikan undefined jika ID tidak ditemukan', async () => {
        db.returning.mockResolvedValue([]);

        const result = await updateCategory(99, 'Bencana Baru');
        expect(result).toBeUndefined();
    });
});
