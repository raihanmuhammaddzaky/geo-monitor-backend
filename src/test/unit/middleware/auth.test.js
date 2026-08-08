import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isAuthenticated, isAdmin, isWorker } from '../../../middlewares/auth.js';
import * as jwtUtils from '../../../utils/jwt.js';
import { formatResponse } from '../../../utils/response.js';

vi.mock('../../../utils/jwt.js', () => ({
    verifyToken: vi.fn()
}));

describe('Middleware - Auth', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockReq = { headers: {} };
        mockRes = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        };
        mockNext = vi.fn();
        vi.clearAllMocks();
    });

    describe('isAuthenticated', () => {
        it('harus mengembalikan 401 jika tidak ada header Authorization', () => {
            isAuthenticated(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('harus mengembalikan 401 jika format bukan Bearer <token>', () => {
            mockReq.headers.authorization = 'token_saja';
            isAuthenticated(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('harus memanggil next() dan set req.user jika token valid', () => {
            mockReq.headers.authorization = 'Bearer token_asli';
            const fakePayload = { id: 1, role: 'worker' };
            vi.mocked(jwtUtils.verifyToken).mockReturnValue(fakePayload);

            isAuthenticated(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(mockReq.user).toEqual(fakePayload);
        });

        it('harus mengembalikan 401 jika token tidak valid', () => {
            mockReq.headers.authorization = 'Bearer token_salah';
            vi.mocked(jwtUtils.verifyToken).mockImplementation(() => { throw new Error('Invalid token'); });

            isAuthenticated(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockNext).not.toHaveBeenCalled();
        });
    });

    describe('isAdmin', () => {
        it('harus memanggil next() jika role adalah admin', () => {
            mockReq.user = { role: 'admin' };
            isAdmin(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalled();
        });

        it('harus mengembalikan 403 jika role bukan admin', () => {
            mockReq.user = { role: 'worker' };
            isAdmin(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('harus mengembalikan 401 jika req.user tidak ada', () => {
            isAdmin(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockNext).not.toHaveBeenCalled();
        });
    });

    describe('isWorker', () => {
        it('harus memanggil next() jika role adalah worker', () => {
            mockReq.user = { role: 'worker' };
            isWorker(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalled();
        });

        it('harus mengembalikan 403 jika role bukan worker', () => {
            mockReq.user = { role: 'admin' };
            isWorker(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('harus mengembalikan 401 jika req.user tidak ada', () => {
            isWorker(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockNext).not.toHaveBeenCalled();
        });
    });
});
