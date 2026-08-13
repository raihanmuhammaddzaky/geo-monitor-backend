import {
  getApprovedLocations,
  getAllLocations,
  getPendingLocations,
  getLocationBySlug,
  createLocation,
  updateLocationStatus,
  searchLocationsService,
  getLocationsByCategory,
  updateLocation
} from '../services/location.js';
import { formatResponse } from '../utils/response.js';

export const getApproved = async (req, res) => {
  try {
    const locations = await getApprovedLocations();
    return formatResponse(res, 200, 'success', 'Berhasil mengambil data lokasi publik', locations);
  } catch (error) {
    console.error('Error in getApproved Locations:', error);
    return formatResponse(res, 500, 'error', 'Terjadi kesalahan pada server');
  }
};

export const getAll = async (req, res) => {
  try {
    const locations = await getAllLocations();
    return formatResponse(res, 200, 'success', 'Berhasil mengambil semua data lokasi (Admin)', locations);
  } catch (error) {
    console.error('Error in getAll Locations:', error);
    return formatResponse(res, 500, 'error', 'Terjadi kesalahan pada server');
  }
};

export const getPending = async (req, res) => {
  try {
    const locations = await getPendingLocations();
    return formatResponse(res, 200, 'success', 'Berhasil mengambil data lokasi pending', locations);
  } catch (error) {
    console.error('Error in getPending Locations:', error);
    return formatResponse(res, 500, 'error', 'Terjadi kesalahan pada server');
  }
};

export const getBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const location = await getLocationBySlug(slug);

    if (!location) {
      return formatResponse(res, 404, 'error', 'Data lokasi tidak ditemukan');
    }

    return formatResponse(res, 200, 'success', 'Berhasil mengambil detail lokasi', location);
  } catch (error) {
    console.error('Error in getBySlug Location:', error);
    return formatResponse(res, 500, 'error', 'Terjadi kesalahan pada server');
  }
};

export const create = async (req, res) => {
  try {
    const { name, description, categoryId, latitude, longitude } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const userId = req.user.id;

    if (!userId) {
      return formatResponse(res, 400, 'error', 'userId diperlukan (sementara sebelum Auth aktif)');
    }

    const data = {
      name,
      description,
      categoryId: parseInt(categoryId),
      latitude,
      longitude,
      imagePath,
      userId: userId
    };

    const newLocation = await createLocation(data);
    return formatResponse(res, 201, 'success', 'Berhasil menambahkan titik lokasi baru (Pending)', newLocation);
  } catch (error) {
    console.error('Error in create Location:', error);
    return formatResponse(res, 500, 'error', 'Gagal menyimpan titik lokasi');
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { slug } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return formatResponse(res, 400, 'error', 'Status tidak valid');
    }

    const updatedLocation = await updateLocationStatus(slug, status);
    if (!updatedLocation) {
      return formatResponse(res, 404, 'error', 'Titik lokasi tidak ditemukan');
    }

    return formatResponse(res, 200, 'success', `Status berhasil diubah menjadi ${status}`, updatedLocation);
  } catch (error) {
    console.error('Error in updateStatus Location:', error);
    return formatResponse(res, 500, 'error', 'Gagal mengubah status lokasi');
  }
};

export const getByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const locations = await getLocationsByCategory(categoryId);
    return formatResponse(res, 200, 'success', 'Berhasil mengambil lokasi berdasarkan kategori', locations);
  } catch (error) {
    console.error('Error in getByCategory:', error);
    return formatResponse(res, 500, 'error', 'Terjadi kesalahan pada server');
  }
};

export const updateDetail = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, description, categoryId, latitude, longitude } = req.body;

    // Kalau ada file foto baru yang diunggah, pakai itu. Kalau tidak, biarkan kosong.
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;
    const data = { name, description, categoryId, latitude, longitude, imagePath };
    const updated = await updateLocation(slug, data);
    if (!updated) {
      return formatResponse(res, 404, 'error', 'Titik lokasi tidak ditemukan');
    }
    return formatResponse(res, 200, 'success', 'Berhasil mengubah detail lokasi', updated);
  } catch (error) {
    console.error('Error in updateDetail:', error);
    return formatResponse(res, 500, 'error', 'Gagal mengubah detail lokasi');
  }
};

export const searchLocations = async (req, res) => {
  try {
    const { q, category, city } = req.query;
    const locations = await searchLocationsService(q, category, city);
    return formatResponse(res, 200, 'success', 'Berhasil mencari lokasi', locations);
  } catch (error) {
    console.error('Error in searchLocations:', error);
    return formatResponse(res, 500, 'error', 'Terjadi kesalahan pada server saat mencari lokasi');
  }
};