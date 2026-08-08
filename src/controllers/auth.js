import { loginUser } from '../services/auth.js';
import { formatResponse } from '../utils/response.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return formatResponse(res, 400, 'error', 'Email dan Password Harus Diisi');
        }

        const result = await loginUser(email, password);

        if (result.error) {
            return formatResponse(res, result.status, 'error', result.error);
        }

        return formatResponse(res, 200, 'success', 'Login berhasil', result);

    } catch (error) {
        console.error('Error in login controller:', error);
        return formatResponse(res, 500, 'error', 'Terjadi kesalahan pada server saat login');
    }
};
