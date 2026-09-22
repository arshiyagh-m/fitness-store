import asyncHandler from 'express-async-handler';
import Coupon from '../models/Coupon.js';

export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.json(coupons);
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(coupon);
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, cartValue } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

  if (!coupon) { res.status(404); throw new Error('کد تخفیف نامعتبر است'); }
  if (new Date() > new Date(coupon.expiryDate)) { res.status(400); throw new Error('کد تخفیف منقضی شده است'); }
  if (coupon.usedCount >= coupon.usageLimit) { res.status(400); throw new Error('ظرفیت این کد تخفیف تکمیل شده است'); }
  if (cartValue < coupon.minCartValue) { res.status(400); throw new Error(`حداقل سبد خرید باید ${coupon.minCartValue} تومان باشد`); }

  res.json({ discountPercent: coupon.discountPercent, maxDiscount: coupon.maxDiscount, code: coupon.code });
});
