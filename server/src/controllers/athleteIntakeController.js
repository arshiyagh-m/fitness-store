import asyncHandler from 'express-async-handler';
import AthleteIntake from '../models/AthleteIntake.js';
import { sendAutomatedSMS } from '../utils/smsService.js';

// ثبت فرم توسط ورزشکار (عمومی)
export const submitAthleteIntake = asyncHandler(async (req, res) => {
  const { fullName, phone, formData } = req.body;

  if (!fullName || !phone) {
    res.status(400); throw new Error('نام و شماره تماس الزامی است.');
  }

  const intake = await AthleteIntake.create({
    fullName,
    phone,
    formData,
  });

  // ارسال پیامک خودکار تایید دریافت پرونده به ورزشکار
  sendAutomatedSMS({
    phone,
    message: `${fullName} عزیز، فرم ارزیابی شما با موفقیت در سامانه Team 9 ثبت شد و جهت طراحی اختصاصی برنامه در اختیار مربی قرار گرفت.`
  });

  res.status(201).json({ message: 'فرم با موفقیت ثبت شد', id: intake._id });
});

// دریافت لیست تمام پرونده‌ها (مخصوص ادمین)
export const getAthleteIntakes = asyncHandler(async (req, res) => {
  const intakes = await AthleteIntake.find({}).sort({ createdAt: -1 });
  res.json(intakes);
});

// دریافت جزئیات یک پرونده
export const getAthleteIntakeById = asyncHandler(async (req, res) => {
  const intake = await AthleteIntake.findById(req.params.id);
  if (intake) {
    res.json(intake);
  } else {
    res.status(404); throw new Error('پرونده ورزشکار یافت نشد.');
  }
});

// به‌روزرسانی وضعیت پرونده و یادداشت‌های مربی
export const updateAthleteIntake = asyncHandler(async (req, res) => {
  const intake = await AthleteIntake.findById(req.params.id);
  if (intake) {
    intake.status = req.body.status || intake.status;
    if (req.body.coachNotes !== undefined) intake.coachNotes = req.body.coachNotes;
    const updated = await intake.save();
    res.json(updated);
  } else {
    res.status(404); throw new Error('پرونده یافت نشد.');
  }
});

// حذف پرونده
export const deleteAthleteIntake = asyncHandler(async (req, res) => {
  const intake = await AthleteIntake.findById(req.params.id);
  if (intake) {
    await AthleteIntake.deleteOne({ _id: intake._id });
    res.json({ message: 'پرونده با موفقیت حذف شد.' });
  } else {
    res.status(404); throw new Error('پرونده یافت نشد.');
  }
});
