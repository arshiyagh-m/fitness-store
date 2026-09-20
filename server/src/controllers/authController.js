// filepath: server/src/controllers/authController.js
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, phone, password } = req.body;

  const userExists = await User.findOne({ phone });

  if (userExists) {
    res.status(400);
    throw new Error('این شماره موبایل قبلاً ثبت شده است');
  }

  const user = await User.create({
    name,
    phone,
    password,
  });

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
// @access  Public
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
