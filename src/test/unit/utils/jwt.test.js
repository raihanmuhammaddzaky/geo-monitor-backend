import 'dotenv/config';
import { describe, it, expect } from 'vitest';
import { generateToken, verifyToken } from '../../../utils/jwt.js'


const mockPayload = { id: 1, name: 'Budi', email: 'budi@test.com', role: 'admin' };


describe('Utils - JWT', () => {

    describe('generateToken', () => {
        it('harus mengembalikan sebuah string token', () => {
            const token = generateToken(mockPayload);
            expect(token).toBeTypeOf('string');
            expect(token.split('.').length).toBe(3);
        });
        it('token harus bisa di-decode dan berisi payload yang benar', () => {
            const token = generateToken(mockPayload);
            const decoded = verifyToken(token);
            expect(decoded.id).toBe(mockPayload.id);
            expect(decoded.name).toBe(mockPayload.name);
            expect(decoded.email).toBe(mockPayload.email);
            expect(decoded.role).toBe(mockPayload.role);
        });
    });

    describe('verifyToken', () => {
        it('harus mengembalikan payload jika token valid', () => {
            const token = generateToken(mockPayload);
            const decoded = verifyToken(token);
            expect(decoded).toHaveProperty('id');
            expect(decoded).toHaveProperty('role');
        });
        it('harus melempar error jika token palsu/rusak', () => {
            const tokenPalsu = 'ini.bukan.token.asli';
            expect(() => verifyToken(tokenPalsu)).toThrow();
        });
    });

});
