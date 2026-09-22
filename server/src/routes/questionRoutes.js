import express from 'express';
import { 
  createQuestion, 
  getProductQuestions, 
  getAllQuestionsAdmin, 
  answerQuestion, 
  deleteQuestion 
} from '../controllers/questionController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createQuestion)
  .get(protect, admin, getAllQuestionsAdmin);

router.route('/product/:productId').get(getProductQuestions);
router.route('/:id/answer').put(protect, admin, answerQuestion);
router.route('/:id').delete(protect, admin, deleteQuestion);

export default router;
