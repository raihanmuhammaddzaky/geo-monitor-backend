import { verifyToken } from "../utils/jwt.js";
import { formatResponse } from '../utils/response.js';

export const isAuthenticated = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return formatResponse(res, 401, 'error', 'Akses ditolak. Anda harus login terlebih dahulu.');
        }
        const token = authHeader.split(' ')[1];
        const decodedPayload = verifyToken(token);
        req.user = decodedPayload;
        next();
    } catch (error) {
        return formatResponse(res, 401, 'error', 'Sesi tidak valid atau sudah kedaluwarsa. Silakan login ulang.');
    }
}

export const isAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return formatResponse(res, 401, 'error', 'Anda harus login terlebih dahulu');
        }
        if (req.user.role !== 'admin') {
            return formatResponse(res, 403, 'error', 'Terlarang! Hanya Admin yang boleh melakukan aksi ini.');
        }
        next();
    } catch (error) {
        console.error('Error in isAdmin middleware:', error);
        return formatResponse(res, 500, 'error', 'Terjadi kesalahan internal server');
    }
}

export const isWorker = (req, res, next) => {
    try {
        if (!req.user) {
            return formatResponse(res, 401, 'error', 'Anda harus login terlebih dahulu');
        }

        // Cek apakah rolenya murni pekerja lapangan
        if (req.user.role !== 'worker') {
            return formatResponse(res, 403, 'error', 'Akses Ditolak! Hanya Pekerja Lapangan (Worker) yang boleh mengirim data ini.');
        }

        next();
    } catch (error) {
        console.error('Error in isWorker middleware:', error);
        return formatResponse(res, 500, 'error', 'Terjadi kesalahan internal server');
    }
}
