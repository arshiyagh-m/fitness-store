import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import generateToken from '../utils/generateToken.js';
import { sendAutomatedSMS } from '../utils/smsService.js';

// ۱. ورود با شماره موبایل و رمز عبور
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

// ۲. ارسال کد تایید پیامکی برای شروع ثبت‌نام
export const sendRegisterOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  const userExists = await User.findOne({ phone });

  if (userExists) {
    res.status(400);
    throw new Error('این شماره موبایل قبلاً در سیستم ثبت‌نام کرده است');
  }

  // حذف کدهای قبلی این شماره
  await Otp.deleteMany({ phone });

  // تولید کد ۵ رقمی رندوم
  const code = Math.floor(10000 + Math.random() * 90000).toString();
  await Otp.create({ phone, code });

  // ارسال خودکار پیامک واقعی یا چاپ در کنسول
  sendAutomatedSMS({
    phone,
    message: `کد تایید عضویت در فروشگاه Team 9:\n${code}\nاعتبار: ۳ دقیقه`
  });

  res.json({ message: 'کد تایید ۵ رقمی به شماره شما پیامک شد', mockCode: code });
});

// ۳. بررسی کد تایید و ساخت قطعی کاربر
export const verifyRegisterOtpAndCreate = asyncHandler(async (req, res) => {
  const { name, phone, password, code } = req.body;

  const validOtp = await Otp.findOne({ phone, code });
  if (!validOtp) {
    res.status(400);
    throw new Error('کد تایید وارد شده اشتباه است یا منقضی شده');
  }

  const user = await User.create({ name, phone, password });
  await Otp.deleteMany({ phone });

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
    throw new Error('خطا در ثبت‌نام کاربر');
  }
});

// ۴. ارسال کد تایید پیامکی برای بازیابی رمز عبور
export const sendResetPasswordOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  const user = await User.findOne({ phone });

  if (!user) {
    res.status(404);
    throw new Error('حساب کاربری با این شماره موبایل یافت نشد');
  }

  await Otp.deleteMany({ phone });
  const code = Math.floor(10000 + Math.random() * 90000).toString();
  await Otp.create({ phone, code });

  sendAutomatedSMS({
    phone,
    message: `کد بازیابی رمز عبور در Team 9:\n${code}\nاعتبار: ۳ دقیقه`
  });

  res.json({ message: 'کد بازیابی رمز برای شما ارسال شد', mockCode: code });
});

// ۵. تایید کد و تغییر رمز عبور
export const verifyOtpAndResetPassword = asyncHandler(async (req, res) => {
  const { phone, code, newPassword } = req.body;

  const validOtp = await Otp.findOne({ phone, code });
  if (!validOtp) {
    res.status(400);
    throw new Error('کد تایید اشتباه یا منقضی شده است');
  }

  const user = await User.findOne({ phone });
  if (!user) {
    res.status(404);
    throw new Error('کاربر یافت نشد');
  }

  user.password = newPassword;
  await user.save();
  await Otp.deleteMany({ phone });

  res.json({ message: 'رمز عبور شما با موفقیت تغییر کرد. اکنون وارد شوید.' });
});
