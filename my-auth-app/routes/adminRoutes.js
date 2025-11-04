import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminProtect } from '../middleware/adminProtect.js';
import { getAlluser } from '../controllers/userController.js';

const router = express.Router();

router.route('/users').get(protect, adminProtect, getAlluser);

export default router;