import express from 'express';
import { getCoupons, createCoupon } from '../controllers/couponController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.route('/').get(protect, admin, getCoupons).post(protect, admin, createCoupon);
export default router;
