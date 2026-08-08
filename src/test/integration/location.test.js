import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { app } from '../../app.js';
import * as locationService from '../../services/location.js';
import { generateToken } from '../../utils/jwt.js';
import 'dotenv/config';

vi.mock('../../services/location.js');

describe('Integration - /api/locations', () => {
    let adminToken, workerToken;

    beforeEach(() => {
        vi.clearAllMocks();
        process.env.JWT_SECRET = 'test_secret_integration';
        adminToken = generateToken({ id: 1, role: 'admin' });
        workerToken = generateToken({ id: 2, role: 'worker' });
    });

    it('GET / tanpa token harus mengembalikan 200 (Publik)', async () => {
        vi.mocked(locationService.getApprovedLocations).mockResolvedValue([]);
        const res = await request(app).get('/api/locations');
        expect(res.status).toBe(200);
    });

    it('GET /all tanpa token harus mengembalikan 401', async () => {
        const res = await request(app).get('/api/locations/all');
        expect(res.status).toBe(401);
    });

    it('GET /all dengan token valid harus mengembalikan 200', async () => {
        vi.mocked(locationService.getAllLocations).mockResolvedValue([]);
        
        // Cek pakai token Admin
        let res = await request(app).get('/api/locations/all').set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        
        // Cek pakai token Worker (dua-duanya harus bisa akses)
        res = await request(app).get('/api/locations/all').set('Authorization', `Bearer ${workerToken}`);
        expect(res.status).toBe(200);
    });

    it('GET /pending dengan token valid harus mengembalikan 200', async () => {
        vi.mocked(locationService.getPendingLocations).mockResolvedValue([]);
        const res = await request(app).get('/api/locations/pending').set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
    });

    it('POST / dengan token Worker harus mengembalikan 201', async () => {
        vi.mocked(locationService.createLocation).mockResolvedValue({ id: 1 });
        const res = await request(app)
            .post('/api/locations')
            .set('Authorization', `Bearer ${workerToken}`)
            .send({ name: 'Lokasi 1', categoryId: 1, latitude: '0', longitude: '0' });
        expect(res.status).toBe(201);
    });

    it('POST / dengan token Admin harus mengembalikan 403', async () => {
        const res = await request(app)
            .post('/api/locations')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Lokasi 1' });
        expect(res.status).toBe(403);
    });

    it('PUT /:id/status dengan token Admin harus mengembalikan 200', async () => {
        vi.mocked(locationService.updateLocationStatus).mockResolvedValue({ id: 1, status: 'approved' });
        const res = await request(app)
            .put('/api/locations/1/status')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status: 'approved' });
        expect(res.status).toBe(200);
    });

    it('PUT /:id/status dengan token Worker harus mengembalikan 403', async () => {
        const res = await request(app)
            .put('/api/locations/1/status')
            .set('Authorization', `Bearer ${workerToken}`)
            .send({ status: 'approved' });
        expect(res.status).toBe(403);
    });

    it('GET /search harus mengembalikan 200', async () => {
        vi.mocked(locationService.searchLocationsService).mockResolvedValue([]);
        const res = await request(app).get('/api/locations/search?q=banjir');
        expect(res.status).toBe(200);
    });

    it('GET /category/:categoryId harus mengembalikan 200', async () => {
        vi.mocked(locationService.getLocationsByCategory).mockResolvedValue([]);
        const res = await request(app).get('/api/locations/category/1');
        expect(res.status).toBe(200);
    });

    it('GET /detail-location/:slug harus mengembalikan 200', async () => {
        vi.mocked(locationService.getLocationBySlug).mockResolvedValue({ id: 1 });
        const res = await request(app).get('/api/locations/detail-location/slug-1');
        expect(res.status).toBe(200);
    });

    it('PUT /:slug dengan token Admin harus mengembalikan 200', async () => {
        vi.mocked(locationService.updateLocation).mockResolvedValue({ id: 1 });
        const res = await request(app)
            .put('/api/locations/slug-1')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Update', categoryId: 2, latitude: 0, longitude: 0 });
        expect(res.status).toBe(200);
    });

    it('PUT /:slug dengan token Worker harus mengembalikan 403', async () => {
        const res = await request(app)
            .put('/api/locations/slug-1')
            .set('Authorization', `Bearer ${workerToken}`)
            .send({ name: 'Update' });
        expect(res.status).toBe(403);
    });
});
