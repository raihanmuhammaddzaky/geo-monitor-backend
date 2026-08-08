import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { app } from '../../app.js';
import * as authService from '../../services/auth.js';

// Kita memalsukan service agar tidak benar-benar memanggil database
vi.mock('../../services/auth.js');

describe('Integration - POST /api/auth/login', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('harus mengembalikan 200 dan token jika login berhasil', async () => {
        vi.mocked(authService.loginUser).mockResolvedValue({
            user: { id: 1, name: 'Budi' },
            token: 'token_rahasia'
        });

        // supertest (request) akan memanggil aplikasi express kita seolah-olah dari Postman
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@test.com', password: 'password' });

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.data.token).toBe('token_rahasia');
    });

    it('harus mengembalikan 401 jika email salah', async () => {
        vi.mocked(authService.loginUser).mockResolvedValue({
            error: 'Email atau Password Salah',
            status: 401
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'salah@test.com', password: 'password' });

        expect(res.status).toBe(401);
        expect(res.body.status).toBe('error');
    });

    it('harus mengembalikan 400 jika body kosong', async () => {
        const res = await request(app).post('/api/auth/login').send({});

        expect(res.status).toBe(400);
        expect(res.body.status).toBe('error');
    });
});
