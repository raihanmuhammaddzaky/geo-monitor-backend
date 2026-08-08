import express from 'express';
import session from 'express-session';
import 'dotenv/config';
import categoryRoutes from './routes/category.js';
import locationRoutes from './routes/location.js';
import authRoutes from './routes/auth.js';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

// Buka folder public/uploads agar foto bisa diakses dari browser
app.use('/uploads', express.static('public/uploads'));

// Setup Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/auth', authRoutes);

export { app };

