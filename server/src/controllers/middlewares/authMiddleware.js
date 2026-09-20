// filepath: server/src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// محافظت از مسیرها (فقط کاربران لاگین شده)
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // اطلاعات کاربر (به جز پسورد) به req.user متصل می‌شود
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401);
      throw new Error('عدم دسترسی، توکن نامعتبر است');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('عدم دسترسی، توکنی وجود ندارد');
  }
});

// محافظت از مسیرهای ادمین (فقط مدیران)
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('دسترسی رد شد، این بخش مخصوص مدیران است');
  }
};
