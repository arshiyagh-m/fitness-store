import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

// آدرس دیتابیس با پشتیبانی از آدرس مستقیم
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitness_store';

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    await User.findOneAndUpdate(
      { phone: '09000000000' },
      { name: 'مدیر کل تیم ۹', phone: '09000000000', password: hashedPassword, role: 'admin' },
      { upsert: true, new: true }
    );
    
    console.log('✅ Admin User Created Successfully!');
    console.log('📞 Phone: 09000000000');
    console.log('🔑 Pass: 123456');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
