import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminProtect } from '../middleware/adminProtect.js';
import { getAllUsers, updateUserRole, deleteUser, createUserByAdmin } from '../controllers/userController.js';

const router = express.Router();

router.route('/users')
	.get(protect, adminProtect, getAllUsers)
	.post(protect, adminProtect, createUserByAdmin);

router.route('/users/:id')
	.put(protect, adminProtect, updateUserRole)
	.delete(protect, adminProtect, deleteUser);

export default router;