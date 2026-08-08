import express from 'express';
import { upload } from '../utils/upload.js';
import {
  getApproved,
  getAll,
  getPending,
  getBySlug,
  getByCategory,
  updateDetail,
  create,
  updateStatus,
  searchLocations
} from '../controllers/location.js';

import { isAuthenticated, isAdmin, isWorker } from '../middlewares/auth.js';

const router = express.Router();

//Public
router.get('/search', searchLocations);
router.get('/detail-location/:slug', getBySlug);
router.get('/category/:categoryId', getByCategory);

//Worker and Admin
router.get('/', getApproved);
router.get('/all', isAuthenticated, getAll);
router.get('/pending', isAuthenticated, getPending);

//Admin Only
router.put('/:slug', isAuthenticated, isAdmin, upload.single('image'), updateDetail);
router.put('/:slug/status', isAuthenticated, isAdmin, updateStatus);

//Worker Only
router.post('/', isAuthenticated, isWorker, upload.single('image'), create);

export default router;

