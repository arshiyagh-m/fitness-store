import express from 'express';
import { 
  authUser, 
  sendRegisterOtp, 
  verifyRegisterOtpAndCreate, 
  sendResetPasswordOtp, 
  verifyOtpAndResetPassword 
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authUser);
router.post('/register/send-otp', sendRegisterOtp);
router.post('/register/verify', verifyRegisterOtpAndCreate);
router.post('/reset-password/send-otp', sendResetPasswordOtp);
router.post('/reset-password/verify', verifyOtpAndResetPassword);

export default router;
