import express from 'express';
import { 
  submitAthleteIntake, 
  getAthleteIntakes, 
  getAthleteIntakeById, 
  updateAthleteIntake, 
  deleteAthleteIntake 
} from '../controllers/athleteIntakeController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(submitAthleteIntake)
  .get(protect, admin, getAthleteIntakes);

router.route('/:id')
  .get(protect, admin, getAthleteIntakeById)
  .put(protect, admin, updateAthleteIntake)
  .delete(protect, admin, deleteAthleteIntake);

export default router;
