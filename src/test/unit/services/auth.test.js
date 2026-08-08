import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginUser } from '../../../services/auth.js';
import { db } from '../../../db/index.js';
import bcrypt from 'bcrypt';
import * as jwtUtils from '../../../utils/jwt.js';

// Mocking dependencies
vi.mock('../../../db/index.js', () => {
    return {
        db: {
            select: vi.fn().mockReturnThis(),
            from: vi.fn().mockReturnThis(),
            where: vi.fn()
        }
    }
});
vi.mock('bcrypt');
vi.mock('../../../utils/jwt.js');

describe('Service - loginUser', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('harus mengembalikan error jika email tidak ditemukan di database', async () => {
        // Mock DB return array kosong (user tidak ada)
        db.where.mockResolvedValue([]);

        const result = await loginUser('salah@email.com', 'password123');

        expect(result).toEqual({ error: 'Email atau Password Salah', status: 401 });
    });

    it('harus mengembalikan error jika password tidak cocok', async () => {
        // Mock DB return ada user
        db.where.mockResolvedValue([{ id: 1, password: 'hashedpassword' }]);
        // Mock bcrypt return false
        vi.mocked(bcrypt.compare).mockResolvedValue(false);

        const result = await loginUser('test@email.com', 'salahpassword');

        expect(result).toEqual({ error: 'Email atau Password Salah', status: 401 });
    });

    it('harus mengembalikan objek { user, token } jika login berhasil', async () => {
        const mockUser = { id: 1, name: 'Test', email: 'test@test.com', role: 'worker', password: 'hash' };
        db.where.mockResolvedValue([mockUser]);
        vi.mocked(bcrypt.compare).mockResolvedValue(true);
        vi.mocked(jwtUtils.generateToken).mockReturnValue('token_palsu');

        const result = await loginUser('test@test.com', 'benar');

        expect(result).toHaveProperty('user');
        expect(result).toHaveProperty('token', 'token_palsu');
        expect(result.user).not.toHaveProperty('password'); // Password tidak boleh di-return
    });

    it('token yang dihasilkan harus berisi payload (id, name, email, role)', async () => {
        const mockUser = { id: 2, name: 'Admin', email: 'admin@test.com', role: 'admin', password: 'hash' };
        db.where.mockResolvedValue([mockUser]);
        vi.mocked(bcrypt.compare).mockResolvedValue(true);

        await loginUser('admin@test.com', 'benar');

        // Pastikan generateToken dipanggil dengan payload yang benar
        expect(jwtUtils.generateToken).toHaveBeenCalledWith({
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
            role: mockUser.role
        });
    });
});
