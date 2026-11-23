import asyncHandler from 'express-async-handler';
import Setting from '../models/Setting.js';

export const getSettings = asyncHandler(async (req, res) => {
  let setting = await Setting.findOne();
  if (!setting) {
    setting = await Setting.create({});
  }
  const obj = setting.toObject();
  // مخفی‌سازی کلیدهای محرمانه در خروجی عمومی
  obj.digipayPassword = obj.digipayPassword ? '••••••••' : '';
  obj.digipayClientSecret = obj.digipayClientSecret ? '••••••••' : '';
  res.json(obj);
});

export const updateSettings = asyncHandler(async (req, res) => {
  let setting = await Setting.findOne();
  const payload = { ...req.body };

  // اگر ادمین فیلد رمز را تغییر نداده و مقدار ماسک‌شده ارسال شده، مقدار قبلی حفظ شود
  if (payload.digipayPassword === '••••••••') delete payload.digipayPassword;
  if (payload.digipayClientSecret === '••••••••') delete payload.digipayClientSecret;

  if (!setting) {
    setting = await Setting.create(payload);
  } else {
    Object.assign(setting, payload);
    await setting.save();
  }

  const obj = setting.toObject();
  obj.digipayPassword = obj.digipayPassword ? '••••••••' : '';
  obj.digipayClientSecret = obj.digipayClientSecret ? '••••••••' : '';
  res.json(obj);
});
