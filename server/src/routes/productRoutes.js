import express from 'express';
import { getProducts, getProductById, createProductReview, deleteProduct } from '../controllers/productController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts);

// اتصال مسیر حذف (DELETE) به همراه محافظت ادمین
router.route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct);

router.route('/:id/reviews').post(protect, createProductReview);

export default router;
