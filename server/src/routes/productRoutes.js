// filepath: server/src/routes/productRoutes.js
import express from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct);

export default router;
