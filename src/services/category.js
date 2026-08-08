import { db } from '../db/index.js';
import { locationCategories } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const getAllCategories = async () => {
  return await db.select().from(locationCategories);
};

export const createCategory = async (name) => {
  const newCategory = await db.insert(locationCategories).values({ name }).returning();
  return newCategory[0];
};

export const deleteCategory = async (id) => {
  const deletedCategory = await db.delete(locationCategories)
    .where(eq(locationCategories.id, id))
    .returning();
  return deletedCategory[0];
};

export const updateCategory = async (id, name) => {
  const updatedCategory = await db.update(locationCategories)
    .set({ name })
    .where(eq(locationCategories.id, id))
    .returning();
  return updatedCategory[0];
};
