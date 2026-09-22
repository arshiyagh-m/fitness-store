import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 180 // کد پس از ۳ دقیقه به صورت خودکار از دیتابیس پاک می‌شود
  },
});

export default mongoose.model('Otp', OtpSchema);
