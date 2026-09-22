import express from 'express';
import { 
  addOrderItems, 
  getMyOrders, 
  getOrders, 
  getOrderById, 
  updateOrderStatus,
  updateOrderToPaid 
} from '../controllers/orderController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById).put(protect, admin, updateOrderStatus);
router.route('/:id/pay').put(protect, updateOrderToPaid);

export default router;
