import { db } from '../db/index.js';
import { locations, locationCategories, users } from '../db/schema.js';
import { eq, or, and, ilike } from 'drizzle-orm';
import { generateUniqueSlug } from '../utils/slug.js';

export const getApprovedLocations = async () => {
  return await db.select({
    id: locations.id,
    slug: locations.slug,
    name: locations.name,
    description: locations.description,
    latitude: locations.latitude,
    longitude: locations.longitude,
    imagePath: locations.imagePath,
    status: locations.status,
    categoryName: locationCategories.name,
    reporterName: users.name,
    createdAt: locations.createdAt,
    city: locations.city,
  })
    .from(locations)
    .leftJoin(locationCategories, eq(locations.categoryId, locationCategories.id))
    .leftJoin(users, eq(locations.userId, users.id))
    .where(eq(locations.status, 'approved'));
};

export const getAllLocations = async () => {
  return await db.select({
    id: locations.id,
    slug: locations.slug,
    name: locations.name,
    description: locations.description,
    latitude: locations.latitude,
    longitude: locations.longitude,
    imagePath: locations.imagePath,
    status: locations.status,
    categoryName: locationCategories.name,
    reporterName: users.name,
    createdAt: locations.createdAt,
    city: locations.city,
  })
    .from(locations)
    .leftJoin(locationCategories, eq(locations.categoryId, locationCategories.id))
    .leftJoin(users, eq(locations.userId, users.id));
};

export const getPendingLocations = async () => {
  return await db.select({
    id: locations.id,
    slug: locations.slug,
    name: locations.name,
    description: locations.description,
    latitude: locations.latitude,
    longitude: locations.longitude,
    imagePath: locations.imagePath,
    status: locations.status,
    categoryName: locationCategories.name,
    reporterName: users.name,
    createdAt: locations.createdAt,
    city: locations.city,
  })
    .from(locations)
    .leftJoin(locationCategories, eq(locations.categoryId, locationCategories.id))
    .leftJoin(users, eq(locations.userId, users.id))
    .where(eq(locations.status, 'pending'));
};

export const createLocation = async (data) => {
  const slug = await generateUniqueSlug(data.name);

  const newLocation = await db.insert(locations).values({
    slug: slug,
    name: data.name,
    description: data.description,
    categoryId: parseInt(data.categoryId),
    latitude: data.latitude,
    longitude: data.longitude,
    imagePath: data.imagePath,
    status: 'pending',
    userId: parseInt(data.userId),
    city: data.city,
  }).returning();

  return newLocation[0];
};

export const updateLocationStatus = async (slug, status) => {
  const updatedLocation = await db.update(locations)
    .set({ status })
    .where(eq(locations.slug, slug))
    .returning();

  return updatedLocation[0];
};

export const getLocationBySlug = async (slug) => {
  const result = await db.select({
    id: locations.id,
    slug: locations.slug,
    name: locations.name,
    description: locations.description,
    latitude: locations.latitude,
    longitude: locations.longitude,
    imagePath: locations.imagePath,
    status: locations.status,
    categoryName: locationCategories.name,
    reporterName: users.name,
    createdAt: locations.createdAt,
    city: locations.city,
  })
    .from(locations)
    .leftJoin(locationCategories, eq(locations.categoryId, locationCategories.id))
    .leftJoin(users, eq(locations.userId, users.id))
    .where(eq(locations.slug, slug));

  return result[0];
};

export const getLocationsByCategory = async (categoryId) => {
  return await db.select({
    id: locations.id,
    slug: locations.slug,
    name: locations.name,
    description: locations.description,
    latitude: locations.latitude,
    longitude: locations.longitude,
    imagePath: locations.imagePath,
    status: locations.status,
    categoryName: locationCategories.name,
    reporterName: users.name,
    createdAt: locations.createdAt,
    city: locations.city,
  })
    .from(locations)
    .leftJoin(locationCategories, eq(locations.categoryId, locationCategories.id))
    .leftJoin(users, eq(locations.userId, users.id))
    .where(eq(locations.categoryId, parseInt(categoryId)));
};

export const updateLocation = async (slug, data) => {
  const updatedLocation = await db.update(locations)
    .set({
      name: data.name,
      description: data.description,
      categoryId: parseInt(data.categoryId),
      latitude: data.latitude,
      longitude: data.longitude,
      // Kalau user tidak upload foto baru, foto lama tidak akan ditimpa
      ...(data.imagePath && { imagePath: data.imagePath })
    })
    .where(eq(locations.slug, slug))
    .returning();
  return updatedLocation[0];
};

export const searchLocationsService = async (name, categoryId, city) => {
  const conditions = [];

  // Pencarian publik hanya untuk lokasi yang sudah disetujui
  conditions.push(eq(locations.status, 'approved'));

  if (name) {
    conditions.push(
      or(
        ilike(locations.name, `%${name}%`),
        ilike(locations.description, `%${name}%`)
      )
    );
  }

  if (categoryId) {
    conditions.push(eq(locations.categoryId, parseInt(categoryId)));
  }

  if (city) {
    conditions.push(ilike(locations.city, `%${city}%`));
  }

  return await db.select({
    id: locations.id,
    slug: locations.slug,
    name: locations.name,
    description: locations.description,
    city: locations.city,
    latitude: locations.latitude,
    longitude: locations.longitude,
    imagePath: locations.imagePath,
    status: locations.status,
    categoryName: locationCategories.name,
    reporterName: users.name,
    createdAt: locations.createdAt,
    city: locations.city,
  })
    .from(locations)
    .leftJoin(locationCategories, eq(locations.categoryId, locationCategories.id))
    .leftJoin(users, eq(locations.userId, users.id))
    .where(and(...conditions));
};