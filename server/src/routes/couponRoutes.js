import express from 'express';
import { getCoupons, createCoupon, validateCoupon } from '../controllers/couponController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.route('/').get(protect, admin, getCoupons).post(protect, admin, createCoupon);
router.route('/validate').post(protect, validateCoupon); // مخصوص کاربر
export default router;
