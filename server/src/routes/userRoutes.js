import express from 'express';
import { getUsers, updateUserRole, deleteUser } from '../controllers/userController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.route('/').get(protect, admin, getUsers);
router.route('/:id').put(protect, admin, updateUserRole).delete(protect, admin, deleteUser);

export default router;
