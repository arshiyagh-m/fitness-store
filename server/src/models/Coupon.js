import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountPercent: { type: Number, required: true },
  maxDiscount: { type: Number, required: true },
  minCartValue: { type: Number, required: true },
  usageLimit: { type: Number, required: true },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  expiryDate: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model('Coupon', CouponSchema);
