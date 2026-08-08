import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getApproved, getAll, getPending, getBySlug, create, updateStatus, getByCategory, updateDetail, searchLocations } from '../../../controllers/location.js';
import * as locationService from '../../../services/location.js';
import * as responseUtils from '../../../utils/response.js';

vi.mock('../../../services/location.js');
vi.mock('../../../utils/response.js');

describe('Controller - Location', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = { params: {}, body: {}, user: { id: 1 } };
        mockRes = {};
        vi.clearAllMocks();
    });

    it('getApproved: harus mengembalikan 200 dan daftar lokasi', async () => {
        const mockData = [{ id: 1, status: 'approved' }];
        vi.mocked(locationService.getApprovedLocations).mockResolvedValue(mockData);

        await getApproved(mockReq, mockRes);
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 200, 'success', 'Berhasil mengambil data lokasi publik', mockData);
    });

    it('getAll: harus mengembalikan 200 dan semua data lokasi', async () => {
        const mockData = [{ id: 1 }, { id: 2 }];
        vi.mocked(locationService.getAllLocations).mockResolvedValue(mockData);

        await getAll(mockReq, mockRes);
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 200, 'success', 'Berhasil mengambil semua data lokasi (Admin)', mockData);
    });

    it('getPending: harus mengembalikan 200 dan lokasi pending', async () => {
        const mockData = [{ id: 1, status: 'pending' }];
        vi.mocked(locationService.getPendingLocations).mockResolvedValue(mockData);

        await getPending(mockReq, mockRes);
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 200, 'success', 'Berhasil mengambil data lokasi pending', mockData);
    });

    it('getBySlug: harus mengembalikan 404 jika lokasi tidak ada', async () => {
        mockReq.params = { slug: 'tidak-ada' };
        vi.mocked(locationService.getLocationBySlug).mockResolvedValue(undefined);

        await getBySlug(mockReq, mockRes);
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 404, 'error', 'Data lokasi tidak ditemukan');
    });

    it('getBySlug: harus mengembalikan 200 jika lokasi ditemukan', async () => {
        mockReq.params = { slug: 'lokasi-1' };
        const mockData = { id: 1, slug: 'lokasi-1' };
        vi.mocked(locationService.getLocationBySlug).mockResolvedValue(mockData);

        await getBySlug(mockReq, mockRes);
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 200, 'success', 'Berhasil mengambil detail lokasi', mockData);
    });

    it('create: harus mengembalikan 201 dan menggunakan req.user.id', async () => {
        mockReq.body = { categoryId: 1, address: 'Test', coordinates: '0,0' };
        const mockData = { id: 1, userId: 1 }; // userId harus diambil dari req.user.id
        vi.mocked(locationService.createLocation).mockResolvedValue(mockData);

        await create(mockReq, mockRes);
        expect(locationService.createLocation).toHaveBeenCalledWith(expect.objectContaining({ userId: 1 }));
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 201, 'success', 'Berhasil menambahkan titik lokasi baru (Pending)', mockData);
    });

    it('updateStatus: harus mengembalikan 400 jika status tidak valid', async () => {
        mockReq.params = { id: '1' };
        mockReq.body = { status: 'ngasal' };

        await updateStatus(mockReq, mockRes);
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 400, 'error', 'Status tidak valid');
    });

    it('updateStatus: harus mengembalikan 404 jika lokasi tidak ditemukan', async () => {
        mockReq.params = { id: '99' };
        mockReq.body = { status: 'approved' };
        vi.mocked(locationService.updateLocationStatus).mockResolvedValue(undefined);

        await updateStatus(mockReq, mockRes);
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 404, 'error', 'Titik lokasi tidak ditemukan');
    });

    it('updateStatus: harus mengembalikan 200 jika berhasil', async () => {
        mockReq.params = { id: '1' };
        mockReq.body = { status: 'approved' };
        const mockData = { id: 1, status: 'approved' };
        vi.mocked(locationService.updateLocationStatus).mockResolvedValue(mockData);

        await updateStatus(mockReq, mockRes);
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 200, 'success', 'Status berhasil diubah menjadi approved', mockData);
    });

    it('getByCategory: harus mengembalikan 200 dan daftar lokasi berdasar kategori', async () => {
        mockReq.params = { categoryId: '1' };
        const mockData = [{ id: 1, categoryId: 1 }];
        vi.mocked(locationService.getLocationsByCategory).mockResolvedValue(mockData);

        await getByCategory(mockReq, mockRes);
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 200, 'success', 'Berhasil mengambil lokasi berdasarkan kategori', mockData);
    });

    it('updateDetail: harus mengembalikan 404 jika lokasi tidak ditemukan saat diupdate', async () => {
        mockReq.params = { slug: 'tidak-ada' };
        mockReq.body = { name: 'Baru' };
        vi.mocked(locationService.updateLocation).mockResolvedValue(undefined);

        await updateDetail(mockReq, mockRes);
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 404, 'error', 'Titik lokasi tidak ditemukan');
    });

    it('updateDetail: harus mengembalikan 200 dan mengupdate detail lokasi', async () => {
        mockReq.params = { slug: 'lokasi-1' };
        mockReq.body = { name: 'Lokasi 1 Updated' };
        mockReq.file = { filename: 'test.jpg' };
        const mockData = { id: 1, slug: 'lokasi-1', imagePath: '/uploads/test.jpg' };
        
        vi.mocked(locationService.updateLocation).mockResolvedValue(mockData);

        await updateDetail(mockReq, mockRes);
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 200, 'success', 'Berhasil mengubah detail lokasi', mockData);
    });

    it('searchLocations: harus mengembalikan 200 dan hasil pencarian', async () => {
        mockReq.query = { q: 'banjir', category: '1', city: 'jakarta' };
        const mockData = [{ id: 1, name: 'Banjir Jakarta' }];
        vi.mocked(locationService.searchLocationsService).mockResolvedValue(mockData);

        await searchLocations(mockReq, mockRes);
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 200, 'success', 'Berhasil mencari lokasi', mockData);
    });
});
