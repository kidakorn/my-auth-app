import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // Import middleware
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';

const router = express.Router();

// กำหนด Route GET /profile ที่ใช้ Middleware 'protect' ก่อนเข้า Controller
router.route('/profile')
	.get(protect, getUserProfile)
	.patch(protect, updateUserProfile);

export default router;