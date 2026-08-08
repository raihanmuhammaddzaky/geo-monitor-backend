import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login } from '../../../controllers/auth.js';
import * as authService from '../../../services/auth.js';
import * as responseUtils from '../../../utils/response.js';

vi.mock('../../../services/auth.js');
vi.mock('../../../utils/response.js');

describe('Controller - login', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = { body: {} };
        mockRes = {};
        vi.clearAllMocks();
    });

    it('harus mengembalikan 400 jika email atau password kosong', async () => {
        mockReq.body = { email: 'a@a.com' }; // password kosong
        await login(mockReq, mockRes);
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 400, 'error', 'Email dan Password Harus Diisi');
    });

    it('harus mengembalikan 401 jika email atau password salah', async () => {
        mockReq.body = { email: 'a@a.com', password: 'salah' };
        vi.mocked(authService.loginUser).mockResolvedValue({ error: 'Salah', status: 401 });
        
        await login(mockReq, mockRes);
        
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 401, 'error', 'Salah');
    });

    it('harus mengembalikan 200 dan data user + token jika login berhasil', async () => {
        mockReq.body = { email: 'a@a.com', password: 'benar' };
        const mockResult = { user: { id: 1 }, token: 'abc' };
        vi.mocked(authService.loginUser).mockResolvedValue(mockResult);
        
        await login(mockReq, mockRes);
        
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 200, 'success', 'Login berhasil', mockResult);
    });

    it('harus mengembalikan 500 jika terjadi error tak terduga', async () => {
        mockReq.body = { email: 'a@a.com', password: 'benar' };
        vi.mocked(authService.loginUser).mockRejectedValue(new Error('DB meledak'));
        
        await login(mockReq, mockRes);
        
        expect(responseUtils.formatResponse).toHaveBeenCalledWith(mockRes, 500, 'error', 'Terjadi kesalahan pada server saat login');
    });
});
