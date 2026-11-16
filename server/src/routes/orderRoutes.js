import express from 'express';
import { addOrderItems, getMyOrders, getOrders, getOrderById, updateOrderStatus, updateOrderToPaid, requestPayment, digipayCallback } from '../controllers/orderController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/digipay/callback').get(digipayCallback);
router.route('/:id').get(protect, getOrderById).put(protect, admin, updateOrderStatus);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/pay-request').post(protect, requestPayment);
export default router;
