import express from 'express';
import { getAll, create, remove, update } from '../controllers/category.js';
import { isAuthenticated, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAll);
router.post('/', isAuthenticated, isAdmin, create);
router.delete('/:id', isAuthenticated, isAdmin, remove);
router.put('/:id', isAuthenticated, isAdmin, update);

export default router;

