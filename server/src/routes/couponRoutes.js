import express from 'express';
import { getCoupons, createCoupon, deleteCoupon, validateCoupon, redeemLoyaltyCoupon } from '../controllers/couponController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.route('/')
  .get(protect, admin, getCoupons)
  .post(protect, admin, createCoupon);

router.route('/redeem').post(protect, redeemLoyaltyCoupon); // تبدیل امتیاز باشگاه به کوپن
router.route('/:id').delete(protect, admin, deleteCoupon);
router.route('/validate').post(validateCoupon);

export default router;
