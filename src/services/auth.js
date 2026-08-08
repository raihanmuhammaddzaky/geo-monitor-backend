import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { generateToken } from '../utils/jwt.js';

export const loginUser = async (email, password) => {

    const result = await db.select().from(users).where(eq(users.email, email));
    const user = result[0];

    if (!user) {
        return { error: 'Email atau Password Salah', status: 401 };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return { error: 'Email atau Password Salah', status: 401 };
    }

    const token = generateToken(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    );

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
    };
};
