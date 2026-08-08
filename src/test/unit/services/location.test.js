import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getApprovedLocations, getAllLocations, getPendingLocations, getLocationBySlug, createLocation, updateLocationStatus, getLocationsByCategory, updateLocation, searchLocationsService } from '../../../services/location.js';
import { db } from '../../../db/index.js';
import * as slugUtils from '../../../utils/slug.js';

vi.mock('../../../utils/slug.js');

vi.mock('../../../db/index.js', () => ({
    db: {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockReturnThis(),
        returning: vi.fn(),
        update: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
    }
}));

describe('Service - Location', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset all mock implementations to return 'this' for chaining
        db.select.mockReturnThis();
        db.from.mockReturnThis();
        db.leftJoin.mockReturnThis();
        db.where.mockReturnThis();
        db.insert.mockReturnThis();
        db.values.mockReturnThis();
        db.update.mockReturnThis();
        db.set.mockReturnThis();
    });

    it('getApprovedLocations: harus mengembalikan lokasi berstatus approved', async () => {
        const mockData = [{ id: 1, status: 'approved' }];
        db.where.mockResolvedValueOnce(mockData);

        const result = await getApprovedLocations();
        expect(result).toEqual(mockData);
        expect(db.where).toHaveBeenCalled();
    });

    it('getAllLocations: harus mengembalikan semua lokasi', async () => {
        const mockData = [{ id: 1 }, { id: 2 }];
        // leftJoin dipanggil 2 kali. Panggilan pertama mengembalikan builder (db), panggilan kedua mengembalikan Promise.
        db.leftJoin.mockReturnValueOnce(db).mockResolvedValueOnce(mockData);

        const result = await getAllLocations();
        expect(result).toEqual(mockData);
        expect(db.leftJoin).toHaveBeenCalledTimes(2);
    });

    it('getPendingLocations: harus mengembalikan lokasi berstatus pending', async () => {
        const mockData = [{ id: 1, status: 'pending' }];
        db.where.mockResolvedValueOnce(mockData);

        const result = await getPendingLocations();
        expect(result).toEqual(mockData);
        expect(db.where).toHaveBeenCalled();
    });

    it('getLocationBySlug: harus mengembalikan lokasi jika slug ditemukan', async () => {
        const mockData = { id: 1, slug: 'lokasi-1', name: 'Lokasi 1' };
        db.where.mockResolvedValueOnce([mockData]);

        const result = await getLocationBySlug('lokasi-1');
        expect(result).toEqual(mockData);
    });

    it('getLocationBySlug: harus mengembalikan undefined jika slug tidak ada', async () => {
        db.where.mockResolvedValueOnce([]);

        const result = await getLocationBySlug('tidak-ada');
        expect(result).toBeUndefined();
    });

    it('createLocation: harus menyimpan data dengan status pending dan men-generate slug', async () => {
        const mockData = { id: 1, slug: 'baru', name: 'Baru', status: 'pending' };
        vi.mocked(slugUtils.generateUniqueSlug).mockResolvedValueOnce('baru');
        db.returning.mockResolvedValueOnce([mockData]);

        const result = await createLocation({ name: 'Baru' });
        expect(result).toEqual(mockData);
        expect(slugUtils.generateUniqueSlug).toHaveBeenCalledWith('Baru');
        expect(db.insert).toHaveBeenCalled();
    });

    it('updateLocationStatus: harus mengupdate status lokasi', async () => {
        const mockData = { id: 1, status: 'approved' };
        db.returning.mockResolvedValueOnce([mockData]);

        const result = await updateLocationStatus(1, 'approved');
        expect(result).toEqual(mockData);
        expect(db.set).toHaveBeenCalledWith({ status: 'approved' });
    });

    it('updateLocationStatus: harus mengembalikan undefined jika ID tidak ada', async () => {
        db.returning.mockResolvedValueOnce([]);

        const result = await updateLocationStatus(99, 'approved');
        expect(result).toBeUndefined();
    });

    it('getLocationsByCategory: harus mengembalikan lokasi berdasarkan ID kategori', async () => {
        const mockData = [{ id: 1, categoryId: 1, name: 'Lokasi Kategori 1' }];
        db.where.mockResolvedValueOnce(mockData);

        const result = await getLocationsByCategory(1);
        expect(result).toEqual(mockData);
        expect(db.where).toHaveBeenCalled();
    });

    it('updateLocation: harus memperbarui data lokasi dengan slug tertentu', async () => {
        const mockData = { id: 1, slug: 'lokasi-1', name: 'Lokasi 1 Update' };
        db.returning.mockResolvedValueOnce([mockData]);

        const result = await updateLocation('lokasi-1', { name: 'Lokasi 1 Update', description: 'desc', categoryId: 1, latitude: 1, longitude: 1 });
        expect(result).toEqual(mockData);
        expect(db.set).toHaveBeenCalledWith({
            name: 'Lokasi 1 Update',
            description: 'desc',
            categoryId: 1,
            latitude: 1,
            longitude: 1
        });
    });

    it('searchLocationsService: harus melakukan filter berdasarkan nama, kategori, dan kota', async () => {
        const mockData = [{ id: 1, name: 'Banjir Jakarta' }];
        db.where.mockResolvedValueOnce(mockData);

        const result = await searchLocationsService('banjir', 1, 'jakarta');
        expect(result).toEqual(mockData);
        expect(db.where).toHaveBeenCalled();
    });
});
