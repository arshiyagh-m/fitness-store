import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// دریافت تمام کاربران (ادمین)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// تغییر نقش کاربر (تبدیل به ادمین یا کاربر عادی)
export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.role = req.body.role || user.role;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      phone: updatedUser.phone,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('کاربر یافت نشد');
  }
});

// حذف کاربر
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.role === 'admin' && user.phone === '09000000000') {
      res.status(400);
      throw new Error('مدیر ارشد کل قابل حذف نیست');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'کاربر با موفقیت حذف شد' });
  } else {
    res.status(404);
    throw new Error('کاربر یافت نشد');
  }
});
