import express from 'express';
import {
  createCoachingRequest,
  getCoachingRequests,
  updateCoachingRequest,
  deleteCoachingRequest,
} from '../controllers/coachingController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(createCoachingRequest).get(protect, admin, getCoachingRequests);
router.route('/:id').put(protect, admin, updateCoachingRequest).delete(protect, admin, deleteCoachingRequest);

export default router;
