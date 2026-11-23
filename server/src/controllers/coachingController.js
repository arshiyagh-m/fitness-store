import asyncHandler from 'express-async-handler';
import CoachingRequest from '../models/CoachingRequest.js';

// @desc    ثبت درخواست مربی‌گری جدید (عمومی)
// @route   POST /api/coaching
export const createCoachingRequest = asyncHandler(async (req, res) => {
  const { fullName, phone, goal, formData, formattedText } = req.body;

  if (!fullName || !phone) {
    res.status(400);
    throw new Error('نام و نام خانوادگی و شماره تماس الزامی است.');
  }

  const request = await CoachingRequest.create({
    fullName,
    phone,
    goal: goal || '',
    formData: formData || {},
    formattedText: formattedText || '',
  });

  res.status(201).json({
    message: 'فرم ارزیابی شما با موفقیت ثبت و برای مربی ارسال شد.',
    id: request._id,
  });
});

// @desc    دریافت لیست تمام درخواست‌های مربی‌گری (ادمین)
// @route   GET /api/coaching
export const getCoachingRequests = asyncHandler(async (req, res) => {
  const requests = await CoachingRequest.find({}).sort({ createdAt: -1 });
  res.json(requests);
});

// @desc    بروزرسانی وضعیت یا یادداشت مربی (ادمین)
// @route   PUT /api/coaching/:id
export const updateCoachingRequest = asyncHandler(async (req, res) => {
  const request = await CoachingRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('درخواست مورد نظر یافت نشد.');
  }

  if (req.body.status) request.status = req.body.status;
  if (req.body.adminNote !== undefined) request.adminNote = req.body.adminNote;

  const updated = await request.save();
  res.json(updated);
});

// @desc    حذف درخواست مربی‌گری (ادمین)
// @route   DELETE /api/coaching/:id
export const deleteCoachingRequest = asyncHandler(async (req, res) => {
  const request = await CoachingRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('درخواست مورد نظر یافت نشد.');
  }
  await request.deleteOne();
  res.json({ message: 'درخواست حذف شد.' });
});
