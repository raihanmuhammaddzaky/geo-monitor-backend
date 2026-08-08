import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAll, create, remove, update } from '../../../controllers/category.js';
import * as categoryService from '../../../services/category.js';
import * as responseUtils from '../../../utils/response.js';

vi.mock('../../../services/category.js');
vi.mock('../../../utils/response.js');

describe('Controller - Category', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = { params: {}, body: {} };
        mockRes = {};
        vi.clearAllMocks();
    });

    it('getAll: harus mengembalikan 200 dan daftar kategori', async () => {
        const mockData = [{ id: 1, name: 'Bencana' }];
        vi.mocked(categoryService.getAllCategories).mockResolvedValue(mockData);

        await getAll(mockReq, mockRes);
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 200, 'success', 'Berhasil mengambil daftar kategori', mockData);
    });

    it('create: harus mengembalikan 400 jika nama kosong', async () => {
        mockReq.body = { name: '' };
        await create(mockReq, mockRes);
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 400, 'error', 'Nama kategori wajib diisi');
    });

    it('create: harus mengembalikan 201 jika berhasil', async () => {
        mockReq.body = { name: 'Bencana' };
        const mockData = { id: 1, name: 'Bencana' };
        vi.mocked(categoryService.createCategory).mockResolvedValue(mockData);

        await create(mockReq, mockRes);
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 201, 'success', 'Berhasil membuat kategori baru', mockData);
    });

    it('remove: harus mengembalikan 404 jika kategori tidak ditemukan', async () => {
        mockReq.params = { id: '99' };
        vi.mocked(categoryService.deleteCategory).mockResolvedValue(undefined);

        await remove(mockReq, mockRes);
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 404, 'error', 'Kategori tidak ditemukan');
    });

    it('remove: harus mengembalikan 200 jika berhasil dihapus', async () => {
        mockReq.params = { id: '1' };
        const mockData = { id: 1, name: 'Bencana' };
        vi.mocked(categoryService.deleteCategory).mockResolvedValue(mockData);

        await remove(mockReq, mockRes);
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 200, 'success', 'Berhasil menghapus kategori', mockData);
    });

    it('update: harus mengembalikan 400 jika nama kosong', async () => {
        mockReq.params = { id: '1' };
        mockReq.body = { name: '' };
        await update(mockReq, mockRes);
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 400, 'error', 'Nama kategori wajib diisi');
    });

    it('update: harus mengembalikan 404 jika tidak ditemukan', async () => {
        mockReq.params = { id: '99' };
        mockReq.body = { name: 'Bencana' };
        vi.mocked(categoryService.updateCategory).mockResolvedValue(undefined);

        await update(mockReq, mockRes);
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 404, 'error', 'Kategori tidak ditemukan');
    });

    it('update: harus mengembalikan 200 jika berhasil diperbarui', async () => {
        mockReq.params = { id: '1' };
        mockReq.body = { name: 'Bencana Baru' };
        const mockData = { id: 1, name: 'Bencana Baru' };
        vi.mocked(categoryService.updateCategory).mockResolvedValue(mockData);

        await update(mockReq, mockRes);
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 200, 'success', 'Berhasil memperbarui kategori', mockData);
    });
});
