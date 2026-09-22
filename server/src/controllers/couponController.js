import asyncHandler from 'express-async-handler';
import Coupon from '../models/Coupon.js';

// دریافت تمام کدهای تخفیف (ادمین)
export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.json(coupons);
});

// ساخت کد تخفیف جدید واقعی در دیتابیس
export const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountPercent, maxDiscount, minCartValue, usageLimit, expiryDate } = req.body;

  const existing = await Coupon.findOne({ code: code.toUpperCase().trim() });
  if (existing) {
    res.status(400); throw new Error('این کد تخفیف قبلاً تعریف شده است');
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase().trim(),
    discountPercent: Number(discountPercent),
    maxDiscount: Number(maxDiscount) || 999999999,
    minCartValue: Number(minCartValue) || 0,
    usageLimit: Number(usageLimit) || 100,
    expiryDate: expiryDate ? new Date(expiryDate) : new Date(Date.now() + 30*24*60*60*1000), // پیش‌فرض ۱ ماه
    isActive: true,
  });

  res.status(201).json(coupon);
});

// حذف کد تخفیف (ادمین)
export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (coupon) {
    await Coupon.deleteOne({ _id: coupon._id });
    res.json({ message: 'کد تخفیف حذف شد' });
  } else {
    res.status(404); throw new Error('کد تخفیف یافت نشد');
  }
});

// اعتبارسنجی کد در سبد خرید مشتری
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, cartValue } = req.body;
  if (!code) { res.status(400); throw new Error('کد را وارد کنید'); }

  const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });

  if (!coupon) {
    res.status(404); throw new Error('کد تخفیف وارد شده معتبر نیست');
  }
  if (new Date() > new Date(coupon.expiryDate)) {
    res.status(400); throw new Error('مهلت زمانی استفاده از این کد تخفیف به پایان رسیده است');
  }
  if (coupon.usedCount >= coupon.usageLimit) {
    res.status(400); throw new Error('ظرفیت مجاز استفاده از این کد تخفیف تکمیل شده است');
  }
  if (cartValue < coupon.minCartValue) {
    res.status(400); throw new Error(`حداقل مبلغ خرید برای استفاده از این کد ${coupon.minCartValue.toLocaleString('fa-IR')} تومان است`);
  }

  res.json({
    code: coupon.code,
    discountPercent: coupon.discountPercent,
    maxDiscount: coupon.maxDiscount,
  });
});
