import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitness_store';

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    
    // پاک کردن هرگونه کاربر قبلی با این شماره
    await User.deleteMany({ phone: '09000000000' });
    
    // ساخت ادمین به شیوه استاندارد Mongoose (اجازه می‌دهیم خود مدل رمز را هش کند)
    const admin = await User.create({
      name: 'مدیر کل تیم ۹',
      phone: '09000000000',
      password: '123456',
      role: 'admin'
    });

    console.log('-------------------------------------------');
    console.log('✅ اکانت ادمین با موفقیت قطعی ساخته شد:');
    console.log('📱 شماره موبایل: 09000000000');
    console.log('🔑 رمز عبور: 123456');
    console.log('👑 سطح دسترسی: admin');
    console.log('-------------------------------------------');
    process.exit(0);
  } catch (err) {
    console.error('❌ خطا:', err.message);
    process.exit(1);
  }
};

run();
