import express from 'express';
import { requestDigipayPayment, verifyDigipayCallback } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/digipay/request', protect, requestDigipayPayment);
router.all('/digipay/callback', verifyDigipayCallback);

export default router;
