import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import User from './models/User.js';

// اینجا محصولات واقعی شما را در قالب یک آرایه قرار می‌دهیم
// وقتی روی سرور واقعی اجرا شود، دقیقاً دیتابیس را پر می‌کند
import fs from 'fs';
import path from 'path';

dotenv.config();
connectDB();

const restoreData = async () => {
  try {
    // 1. ساخت اکانت ادمین اختصاصی شما
    await User.deleteMany({ phone: '09338656771' });
    await User.create({
      name: 'مالک و مدیر کل Team 9',
      phone: '09338656771',
      password: '09148587351',
      role: 'admin'
    });
    console.log('✅ اکانت ادمین 09338656771 با موفقیت ساخته شد.');

    // 2. بازیابی محصولات (در مرحله بعدی با کدهای شما پر می‌شود)
    console.log('✅ اسکریپت بازیابی آماده شد.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

restoreData();
