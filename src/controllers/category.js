import { getAllCategories, createCategory, deleteCategory, updateCategory } from '../services/category.js';
import { formatResponse } from '../utils/response.js';

export const getAll = async (req, res) => {
  try {
    const categories = await getAllCategories();
    return formatResponse(res, 200, 'success', 'Berhasil mengambil daftar kategori', categories);
  } catch (error) {
    console.error('Error in getAll Categories:', error);
    return formatResponse(res, 500, 'error', 'Gagal mengambil data kategori');
  }
};

export const create = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return formatResponse(res, 400, 'error', 'Nama kategori wajib diisi');
    }
    const newCategory = await createCategory(name);
    return formatResponse(res, 201, 'success', 'Berhasil membuat kategori baru', newCategory);
  } catch (error) {
    console.error('Error in create Category:', error);
    return formatResponse(res, 500, 'error', 'Gagal membuat kategori');
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await deleteCategory(parseInt(id));
    
    if (!deletedCategory) {
      return formatResponse(res, 404, 'error', 'Kategori tidak ditemukan');
    }
    return formatResponse(res, 200, 'success', 'Berhasil menghapus kategori', deletedCategory);
  } catch (error) {
    return formatResponse(res, 500, 'error', 'Gagal menghapus kategori');
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name) {
      return formatResponse(res, 400, 'error', 'Nama kategori wajib diisi');
    }

    const updatedCategory = await updateCategory(parseInt(id), name);
    
    if (!updatedCategory) {
      return formatResponse(res, 404, 'error', 'Kategori tidak ditemukan');
    }
    
    return formatResponse(res, 200, 'success', 'Berhasil memperbarui kategori', updatedCategory);
  } catch (error) {
    console.error('Error in update Category:', error);
    return formatResponse(res, 500, 'error', 'Gagal memperbarui kategori');
  }
};
