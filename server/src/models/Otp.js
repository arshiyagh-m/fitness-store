// filepath: server/src/models/Otp.js
import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 120, // سند پس از 120 ثانیه (2 دقیقه) خودکار از دیتابیس پاک می‌شود
  }
});

const Otp = mongoose.model('Otp', OtpSchema);
export default Otp;
