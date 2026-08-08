import { pgTable, serial, varchar, text, numeric, timestamp, integer, geometry } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: text('password').notNull(),
    role: varchar('role', { length: 50 }).notNull().default('worker'), // 'worker' or 'admin'
    createdAt: timestamp('created_at').defaultNow(),
});

export const locationCategories = pgTable('location_categories', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(), // e.g., 'Infrastruktur', 'Fasilitas Umum'
    createdAt: timestamp('created_at').defaultNow(),
});

export const locations = pgTable('locations', {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    city: varchar('city', { length: 100 }),
    categoryId: integer('category_id').references(() => locationCategories.id).notNull(), // Relasi ke tabel kategori
    latitude: numeric('latitude').notNull(),
    longitude: numeric('longitude').notNull(),
    imagePath: varchar('image_path', { length: 255 }), // Untuk menyimpan foto lokasi
    geom: geometry('geom', { type: 'point', mode: 'xy', srid: 4326 }), // Kolom khusus Spasial (PostGIS) Asli Drizzle
    status: varchar('status', { length: 50 }).notNull().default('pending'), // 'pending', 'approved', 'rejected'
    userId: integer('user_id').references(() => users.id).notNull(), // Pekerja yang membuat
    createdAt: timestamp('created_at').defaultNow(),
});
