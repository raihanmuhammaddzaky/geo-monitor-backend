import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { app } from '../../app.js';
import * as categoryService from '../../services/category.js';
import { generateToken } from '../../utils/jwt.js';
import 'dotenv/config';

vi.mock('../../services/category.js');

describe('Integration - /api/categories', () => {
    let adminToken, workerToken;

    beforeEach(() => {
        vi.clearAllMocks();
        // Kita membuat token JWT sungguhan agar middleware kita bisa membacanya
        process.env.JWT_SECRET = 'test_secret_integration';
        adminToken = generateToken({ id: 1, role: 'admin' });
        workerToken = generateToken({ id: 2, role: 'worker' });
    });

    it('GET / tanpa token harus mengembalikan 200 (Publik)', async () => {
        vi.mocked(categoryService.getAllCategories).mockResolvedValue([]);
        const res = await request(app).get('/api/categories');
        expect(res.status).toBe(200);
    });

    it('POST / tanpa token harus mengembalikan 401', async () => {
        const res = await request(app).post('/api/categories').send({ name: 'Test' });
        expect(res.status).toBe(401);
    });

    it('POST / dengan token Worker harus mengembalikan 403', async () => {
        const res = await request(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${workerToken}`)
            .send({ name: 'Test' });
        expect(res.status).toBe(403);
    });

    it('POST / dengan token Admin harus mengembalikan 201', async () => {
        vi.mocked(categoryService.createCategory).mockResolvedValue({ id: 1, name: 'Test' });
        const res = await request(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Test' });
        expect(res.status).toBe(201);
    });

    it('DELETE /:id dengan token Admin harus mengembalikan 200', async () => {
        vi.mocked(categoryService.deleteCategory).mockResolvedValue({ id: 1 });
        const res = await request(app)
            .delete('/api/categories/1')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
    });

    it('PUT /:id dengan token Admin harus mengembalikan 200', async () => {
        vi.mocked(categoryService.updateCategory).mockResolvedValue({ id: 1 });
        const res = await request(app)
            .put('/api/categories/1')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Baru' });
        expect(res.status).toBe(200);
    });
});
