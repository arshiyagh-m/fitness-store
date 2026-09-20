// filepath: server/src/routes/authRoutes.js
import express from 'express';
import { 
  registerUser, 
  authUser, 
  requestOtp, 
  resetPassword 
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/request-otp', requestOtp);
router.post('/reset-password', resetPassword);

export default router;
