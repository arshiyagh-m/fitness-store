// filepath: server/src/controllers/authController.js
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, phone, password } = req.body;
  const userExists = await User.findOne({ phone });

  if (userExists) {
    res.status(400);
    throw new Error('این شماره موبایل قبلاً ثبت شده است');
  }

  const user = await User.create({ name, phone, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('اطلاعات وارد شده نامعتبر است');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
export const authUser = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('شماره موبایل یا رمز عبور اشتباه است');
  }
});

// @desc    Request OTP for password reset
// @route   POST /api/auth/request-otp
export const requestOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  const user = await User.findOne({ phone });

  if (!user) {
    res.status(404);
    throw new Error('حساب کاربری با این شماره یافت نشد');
  }

  // حذف OTPهای قبلی این شماره
  await Otp.deleteMany({ phone });

  // تولید کد ۵ رقمی تصادفی
  const code = Math.floor(10000 + Math.random() * 90000).toString();

  await Otp.create({ phone, code });

  // در پروداکشن اینجا سرویس پیامک فراخوانی می‌شود
  console.log(`[MOCK SMS] OTP for ${phone} is: ${code}`);

  res.status(200).json({ 
    message: 'کد تایید ارسال شد',
    mockCode: code // فقط برای تست لوکال (در نسخه نهایی حذف شود)
  });
});

// @desc    Verify OTP and Reset Password
// @route   POST /api/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  const { phone, code, newPassword } = req.body;

  const validOtp = await Otp.findOne({ phone, code });

  if (!validOtp) {
    res.status(400);
    throw new Error('کد تایید نامعتبر است یا منقضی شده');
  }

  const user = await User.findOne({ phone });
  if (!user) {
    res.status(404);
    throw new Error('کاربر یافت نشد');
  }

  user.password = newPassword;
  await user.save();

  // پاک کردن OTP پس از استفاده موفق
  await Otp.deleteMany({ phone });

  res.status(200).json({ message: 'رمز عبور با موفقیت تغییر کرد' });
});
