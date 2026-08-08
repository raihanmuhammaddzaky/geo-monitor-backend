import { describe, it, expect, vi } from 'vitest';
import { formatResponse } from '../../../utils/response.js';

const mockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnThis();
    res.status = vi.fn().mockReturnThis();
    res.json = vi.fn().mockReturnThis();
    return res;
}

describe('Utils - formatResponse', () => {
    it('harus memanggil res.status() dengan status code yang benar', () => {
        const res = mockRes();
        formatResponse(res, 200, 'success', 'berhasil');
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it('harus mengembalikan JSON dengan format { status, message, data }', () => {
        const res = mockRes();
        const mockData = { id: 1, name: 'Test' };
        formatResponse(res, 201, 'success', 'Berhasil dibuat', mockData);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            message: 'Berhasil dibuat',
            data: mockData
        });
    });
    it('jika data tidak diberikan, nilainya harus null', () => {
        const res = mockRes();
        formatResponse(res, 404, 'error', 'Tidak ditemukan');
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Tidak ditemukan',
            data: null 
        });
    });
});
