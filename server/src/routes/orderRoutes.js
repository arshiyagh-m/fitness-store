import express from 'express';
import { addOrderItems } from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// محافظت شده با protect (فقط کاربری که توکن معتبر دارد می‌تواند سفارش ثبت کند)
router.route('/').post(protect, addOrderItems);

export default router;
